import React, { useState, useEffect, useRef } from "react";
import { Sparkles, AlertCircle } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/components/ui/use-toast";
import ChatInterface from "./mathHub/ChatInterface";
import ChatInputForm from "./mathHub/ChatInputForm";
import ChatHistory from "./mathHub/ChatHistory";
import { Message, ChatSession, ChatHistoryItem } from "./mathHub/types";
import { getContentTypeFromFile } from "@/utils/fileUtils";

const MathHubAI: React.FC = () => {
  const [question, setQuestion] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [chatSessions, setChatSessions] = useState<ChatSession[]>([]);
  const [dailyQuestionsCount, setDailyQuestionsCount] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("new-chat");
  const [showAllHistory, setShowAllHistory] = useState(false);
  const { user, isPremium } = useAuth();
  const { toast } = useToast();
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const historyEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (user) {
      fetchChatHistory();
      checkDailyLimit();
    }
  }, [user]);

  useEffect(() => {
    if (activeTab === "new-chat") {
      scrollToBottom("chat");
    } else {
      scrollToBottom("history");
    }
  }, [messages, chatSessions, activeTab]);

  const scrollToBottom = (ref: "chat" | "history") => {
    if (ref === "chat") {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    } else {
      historyEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  };

  const fetchChatHistory = async () => {
    try {
      const { data, error } = await supabase
        .from('ai_chat_history')
        .select('*')
        .eq('user_id', user?.id)
        .order('created_at', { ascending: false })
        .limit(100);

      if (error) {
        console.error("Error fetching chat history:", error);
        return;
      }

      if (data) {
        const sessions = groupChatsByDate(data);
        setChatSessions(sessions);

        const recentMessages = data.slice(0, 10).reverse();
        
        const formattedMessages: Message[] = recentMessages.map((item: ChatHistoryItem) => ({
          id: item.id,
          role: 'user' as const,
          content: item.question,
          created_at: item.created_at,
          image: item.has_image ? 'image' : undefined
        })).flatMap((userMessage, index) => {
          const item = recentMessages[index];
          return [
            userMessage,
            {
              id: `assistant-${item.id}`,
              role: 'assistant' as const,
              content: item.answer,
              created_at: item.created_at
            }
          ];
        });

        setMessages(formattedMessages);
      }
    } catch (error) {
      console.error("Error in fetchChatHistory:", error);
    }
  };

  const groupChatsByDate = (chatItems: ChatHistoryItem[]): ChatSession[] => {
    const allChatItems = [...chatItems];
    
    const groupedChats: Record<string, ChatHistoryItem[]> = {};
    
    allChatItems.forEach(item => {
      const dateStr = new Date(item.created_at).toISOString().split('T')[0];
      if (!groupedChats[dateStr]) {
        groupedChats[dateStr] = [];
      }
      groupedChats[dateStr].push(item);
    });
    
    const sessions: ChatSession[] = Object.entries(groupedChats).map(([dateStr, items]) => {
      const messages: Message[] = items.flatMap(item => [
        {
          id: item.id,
          role: 'user' as const,
          content: item.question,
          created_at: item.created_at,
          image: item.has_image ? 'image' : undefined
        },
        {
          id: `assistant-${item.id}`,
          role: 'assistant' as const,
          content: item.answer,
          created_at: item.created_at
        }
      ]);
      
      return {
        date: dateStr,
        messages
      };
    });
    
    sessions.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    
    if (!isPremium && !showAllHistory) {
      return sessions.slice(0, 5);
    }
    
    return sessions;
  };

  const checkDailyLimit = async () => {
    if (isPremium) {
      setDailyQuestionsCount(0);
      return;
    }

    try {
      const today = new Date().toISOString().split('T')[0];
      const { count, error } = await supabase
        .from('ai_chat_history')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', user?.id)
        .gte('created_at', `${today}T00:00:00`)
        .lte('created_at', `${today}T23:59:59`);

      if (error) {
        console.error("Error checking daily limit:", error);
        return;
      }

      setDailyQuestionsCount(count || 0);
    } catch (error) {
      console.error("Error in checkDailyLimit:", error);
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.type.startsWith('image/')) {
        if (file.size <= 10 * 1024 * 1024) { // 10MB limit
          setImage(file);
          
          const reader = new FileReader();
          reader.onloadend = () => {
            setImagePreview(reader.result as string);
          };
          reader.readAsDataURL(file);
        } else {
          toast({
            title: "File too large",
            description: "Please upload an image smaller than 10MB",
            variant: "destructive"
          });
        }
      } else {
        toast({
          title: "Invalid file type",
          description: "Please upload an image file (JPEG, PNG, etc.)",
          variant: "destructive"
        });
      }
    }
  };

  const removeImage = () => {
    setImage(null);
    setImagePreview(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    
    if (!question.trim() && !image) {
      toast({
        title: "Missing input",
        description: "Please enter a question or upload an image",
        variant: "destructive"
      });
      return;
    }

    if (!isPremium && dailyQuestionsCount >= 5) {
      toast({
        title: "Daily limit reached",
        description: "Free users can ask 5 questions per day. Please upgrade to premium for unlimited questions.",
        variant: "destructive"
      });
      return;
    }

    try {
      setIsLoading(true);
      setActiveTab("new-chat");

      const tempId = Date.now().toString();
      const userMessage: Message = {
        id: tempId,
        role: 'user',
        content: question,
        created_at: new Date().toISOString(),
        image: image ? imagePreview || 'image' : undefined
      };
      
      setMessages(prev => [...prev, userMessage]);
      
      let imageBase64 = null;
      if (image) {
        const reader = new FileReader();
        imageBase64 = await new Promise<string | null>((resolve) => {
          reader.onloadend = () => {
            const result = reader.result as string;
            resolve(result.split(',')[1]);
          };
          reader.onerror = () => resolve(null);
          reader.readAsDataURL(image);
        });
      }
      
      console.log("Calling Math AI function");
      
      const { data, error } = await supabase.functions.invoke('mathhub-ai', {
        body: {
          question,
          model: 'gpt-4o-mini',
          files: imageBase64 ? [{
            name: image?.name || 'image.jpg',
            content: imageBase64,
            type: image?.type || 'image/jpeg'
          }] : []
        }
      });

      if (error) {
        console.error("Error calling AI function:", error);
        setError(`Error: ${error.message || "Failed to get an answer. Please try again."}`);
        toast({
          title: "Error",
          description: error.message || "Failed to get an answer. Please try again.",
          variant: "destructive"
        });
        
        setMessages(prev => prev.filter(msg => msg.id !== tempId));
        return;
      }

      if (!data) {
        const errorMsg = "Received empty response from the AI.";
        setError(errorMsg);
        toast({
          title: "Error",
          description: errorMsg,
          variant: "destructive"
        });
        
        setMessages(prev => prev.filter(msg => msg.id !== tempId));
        return;
      }
      
      if (data.error) {
        console.error("AI service returned error:", data.error);
        const errorDetails = data.details ? `${data.error}: ${data.details}` : data.error;
        setError(errorDetails);
        toast({
          title: "AI Service Error",
          description: errorDetails,
          variant: "destructive"
        });
        
        setMessages(prev => prev.filter(msg => msg.id !== tempId));
        return;
      }

      const assistantMessage: Message = {
        id: `assistant-${tempId}`,
        role: 'assistant',
        content: data.answer,
        created_at: new Date().toISOString()
      };
      
      setMessages(prev => [...prev.filter(msg => msg.id !== tempId), userMessage, assistantMessage]);
      
      setQuestion("");
      removeImage();
      
      fetchChatHistory();
      if (!isPremium) {
        checkDailyLimit();
      }
      
    } catch (error: any) {
      console.error("Error in handleSubmit:", error);
      setError(`${error.message || "Something went wrong. Please try again."}`);
      toast({
        title: "Error",
        description: error.message || "Something went wrong. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const clearHistory = async () => {
    if (confirm("Are you sure you want to clear your chat history? This cannot be undone.")) {
      try {
        setIsLoading(true);
        
        const { error } = await supabase
          .from('ai_chat_history')
          .delete()
          .eq('user_id', user?.id);
          
        if (error) {
          throw error;
        }
          
        setMessages([]);
        setChatSessions([]);
        setDailyQuestionsCount(0);
        
        toast({
          title: "Success",
          description: "Chat history cleared successfully"
        });
      } catch (error: any) {
        console.error("Error clearing chat history:", error);
        toast({
          title: "Error",
          description: error.message || "Failed to clear chat history",
          variant: "destructive"
        });
      } finally {
        setIsLoading(false);
      }
    }
  };

  const loadMoreHistory = () => {
    setShowAllHistory(true);
    fetchChatHistory();
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex flex-col space-y-4 max-w-5xl mx-auto">
        <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold flex items-center">
              <Sparkles className="mr-2 h-8 w-8 text-mathprimary" />
              MathHub AI
            </h1>
            <p className="text-muted-foreground mt-1">
              Your personal math tutor powered by AI
            </p>
          </div>
          
          {!isPremium && (
            <div className="bg-amber-50 dark:bg-amber-950/30 px-4 py-2 rounded-lg text-amber-800 dark:text-amber-300 text-sm flex items-center">
              <AlertCircle className="h-4 w-4 mr-2" />
              <span>{5 - dailyQuestionsCount} of 5 free questions remaining today</span>
            </div>
          )}
        </div>

        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid grid-cols-2 mb-4">
            <TabsTrigger value="new-chat">New Chat</TabsTrigger>
            <TabsTrigger value="history">Chat History</TabsTrigger>
          </TabsList>

          <TabsContent value="new-chat">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-xl">Math AI Assistant</CardTitle>
                <CardDescription>
                  Ask any math question or upload a math problem image
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col space-y-4">
                  <ChatInterface messages={messages} />
                  <ChatInputForm 
                    question={question}
                    setQuestion={setQuestion}
                    imagePreview={imagePreview}
                    handleImageUpload={handleImageUpload}
                    removeImage={removeImage}
                    handleSubmit={handleSubmit}
                    clearHistory={clearHistory}
                    isLoading={isLoading}
                    hasMessages={messages.length > 0}
                    isPremium={isPremium}
                    remainingQuestions={5 - dailyQuestionsCount}
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="history">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-xl">Chat History</CardTitle>
                <CardDescription>
                  {isPremium 
                    ? "Access all your previous conversations" 
                    : "Free users can view up to 5 days of chat history"}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ChatHistory 
                  chatSessions={chatSessions}
                  clearHistory={clearHistory}
                  loadMoreHistory={loadMoreHistory}
                  showAllHistory={showAllHistory}
                  isPremium={isPremium}
                />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default MathHubAI;
