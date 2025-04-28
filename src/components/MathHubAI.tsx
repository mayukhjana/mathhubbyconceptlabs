
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

  // Ensure chat persists when component re-renders
  useEffect(() => {
    const savedMessages = localStorage.getItem('mathHubMessages');
    if (savedMessages) {
      try {
        setMessages(JSON.parse(savedMessages));
      } catch (e) {
        console.error("Error parsing saved messages:", e);
        localStorage.removeItem('mathHubMessages');
      }
    }
  }, []);

  // Save messages to localStorage whenever they change
  useEffect(() => {
    if (messages.length > 0) {
      localStorage.setItem('mathHubMessages', JSON.stringify(messages));
    }
  }, [messages]);

  useEffect(() => {
    if (activeTab === "new-chat" && messagesEndRef.current) {
      setTimeout(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
      }, 100);
    } else if (activeTab === "history" && historyEndRef.current) {
      setTimeout(() => {
        historyEndRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
      }, 100);
    }
  }, [messages, chatSessions, activeTab]);

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

  const saveAIResponse = async (question: string, answer: string, hasImage: boolean = false) => {
    if (!user?.id) return;
    
    try {
      const { data, error } = await supabase
        .from('ai_chat_history')
        .insert({
          user_id: user.id,
          question,
          answer,
          has_image: hasImage
        });

      if (error) {
        console.error("Error saving chat history:", error);
        throw error;
      }

      // Make sure to update history
      fetchChatHistory();
    } catch (error) {
      console.error("Error in saveAIResponse:", error);
    }
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
      
      // Add user message immediately
      setMessages(prev => [...prev, userMessage]);
      
      // Prepare image data if exists
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
      
      try {
        // Try Gemini first
        const { data: geminiData, error: geminiError } = await supabase.functions.invoke('gemini-math-ai', {
          body: {
            question,
            image: imageBase64
          }
        });

        if (geminiError) {
          console.error("Error calling Gemini AI function:", geminiError);
          
          // Fallback to OpenAI
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
            throw error;
          }

          if (!data || data.error) {
            throw new Error(data?.error || "Failed to get an answer");
          }

          const assistantMessage: Message = {
            id: `assistant-${tempId}`,
            role: 'assistant',
            content: data.answer,
            created_at: new Date().toISOString()
          };
          
          // Update messages with final answer
          setMessages(prev => [...prev.filter(msg => msg.id !== tempId + "-loading"), userMessage, assistantMessage]);
          
          // Save to database
          await saveAIResponse(question, data.answer, !!imageBase64);
          
        } else {
          const assistantMessage: Message = {
            id: `assistant-${tempId}`,
            role: 'assistant',
            content: geminiData.answer,
            created_at: new Date().toISOString()
          };
          
          // Update messages with final answer
          setMessages(prev => [...prev.filter(msg => msg.id !== tempId + "-loading"), userMessage, assistantMessage]);
          
          // Save to database
          await saveAIResponse(question, geminiData.answer, !!imageBase64);
        }
        
        // Reset form
        setQuestion("");
        removeImage();
        
        if (!isPremium) {
          checkDailyLimit();
        }
      } catch (apiError: any) {
        console.error("API call error:", apiError);
        setError(`API Error: ${apiError.message || "Unknown error occurred"}`);
        toast({
          title: "API Error",
          description: apiError.message || "Unknown error occurred",
          variant: "destructive"
        });
        
        // Remove temporary messages if error occurs
        setMessages(prev => prev.filter(msg => msg.id !== tempId && msg.id !== tempId + "-loading"));
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
        localStorage.removeItem('mathHubMessages');
        
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
                  <ChatInterface 
                    messages={messages} 
                    messagesEndRef={messagesEndRef}
                  />
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
                  historyEndRef={historyEndRef}
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
