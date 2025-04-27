
import React, { useState, useRef, useEffect } from "react";
import { Sparkles, Send, ImagePlus, Loader2, AlertCircle, TrashIcon, MessageSquare, History, User, Bot, CalendarClock, XCircle, Clock } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/components/ui/use-toast";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import 'katex/dist/katex.min.css';
import { format } from 'date-fns';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  created_at: string;
  image?: string;
}

interface ChatHistoryItem {
  id: string;
  user_id: string;
  question: string;
  answer: string;
  created_at: string;
  has_image?: boolean;
}

interface ChatSession {
  date: string;
  messages: Message[];
}

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
  const fileInputRef = useRef<HTMLInputElement>(null);
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
        // Group chats by date
        const sessions = groupChatsByDate(data);
        setChatSessions(sessions);

        // For the current session, get the last 5 messages
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
    // Limit to 5 most recent days if not premium and not showing all
    const allChatItems = [...chatItems];
    
    // Group by date
    const groupedChats: Record<string, ChatHistoryItem[]> = {};
    
    allChatItems.forEach(item => {
      const dateStr = new Date(item.created_at).toISOString().split('T')[0];
      if (!groupedChats[dateStr]) {
        groupedChats[dateStr] = [];
      }
      groupedChats[dateStr].push(item);
    });
    
    // Convert to chat sessions
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
    
    // Sort sessions by date, newest first
    sessions.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    
    // If not premium and not showing all, limit to 5 most recent days
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
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
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
      
      // Refresh chat history and daily count
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

  const renderMessageContent = (message: Message) => {
    if (message.role === 'assistant') {
      return (
        <div className="math-content">
          <ReactMarkdown 
            remarkPlugins={[remarkGfm, remarkMath]}
            rehypePlugins={[rehypeKatex]}
          >
            {message.content}
          </ReactMarkdown>
        </div>
      );
    } else {
      return (
        <>
          <div>{message.content}</div>
          {message.image && (
            <div className="mt-2 max-w-[200px]">
              {typeof message.image === 'string' && message.image !== 'image' && (
                <img 
                  src={message.image} 
                  alt="Uploaded" 
                  className="rounded-md max-h-[200px] object-contain"
                />
              )}
              {message.image === 'image' && (
                <div className="p-2 bg-black/10 rounded text-sm text-center">
                  [Image attached]
                </div>
              )}
            </div>
          )}
        </>
      );
    }
  };

  const formatSessionDate = (dateStr: string) => {
    const date = new Date(dateStr);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    
    if (date.toDateString() === today.toDateString()) {
      return 'Today';
    } else if (date.toDateString() === yesterday.toDateString()) {
      return 'Yesterday';
    } else {
      return format(date, 'MMMM d, yyyy');
    }
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
          <Alert variant="destructive" className="mb-4">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid grid-cols-2 mb-4">
            <TabsTrigger value="new-chat" className="flex items-center">
              <MessageSquare className="h-4 w-4 mr-2" />
              New Chat
            </TabsTrigger>
            <TabsTrigger value="history" className="flex items-center">
              <History className="h-4 w-4 mr-2" />
              Chat History
            </TabsTrigger>
          </TabsList>

          {/* New Chat Tab */}
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
                  <div className="h-[400px] border rounded-lg p-4 relative bg-muted/30">
                    <ScrollArea className="h-full pr-4">
                      {messages.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-full text-center p-4">
                          <MessageSquare className="h-12 w-12 text-muted-foreground/50 mb-2" />
                          <p className="text-muted-foreground">
                            No conversation history yet. Ask your first math question!
                          </p>
                        </div>
                      ) : (
                        <div className="flex flex-col space-y-4">
                          {messages.map((message) => (
                            <div 
                              key={message.id}
                              className={`flex ${
                                message.role === 'user' ? 'justify-end' : 'justify-start'
                              }`}
                            >
                              <div 
                                className={`rounded-lg p-4 max-w-[85%] ${
                                  message.role === 'user' 
                                    ? 'bg-mathprimary text-white ml-12' 
                                    : 'bg-muted mr-12'
                                }`}
                              >
                                {message.role === 'assistant' ? (
                                  <div className="flex items-start space-x-3">
                                    <Avatar className="h-8 w-8">
                                      <AvatarImage src="/lovable-uploads/0cfac2ed-f408-4c67-81fa-bb01eb283ca8.png" />
                                      <AvatarFallback>AI</AvatarFallback>
                                    </Avatar>
                                    <div>
                                      <div className="mb-1 font-medium">MathHub AI</div>
                                      {renderMessageContent(message)}
                                    </div>
                                  </div>
                                ) : (
                                  <div>
                                    <div className="mb-1 font-medium">You</div>
                                    {renderMessageContent(message)}
                                  </div>
                                )}
                              </div>
                            </div>
                          ))}
                          <div ref={messagesEndRef} />
                        </div>
                      )}
                    </ScrollArea>
                  </div>

                  <form onSubmit={handleSubmit} className="space-y-4">
                    {imagePreview && (
                      <div className="relative border rounded-md p-2 inline-block">
                        <img 
                          src={imagePreview} 
                          alt="Preview" 
                          className="max-h-[150px] rounded-md"
                        />
                        <Button
                          type="button"
                          variant="destructive"
                          size="icon"
                          className="absolute -top-2 -right-2 h-6 w-6 rounded-full"
                          onClick={removeImage}
                        >
                          <TrashIcon className="h-3 w-3" />
                        </Button>
                      </div>
                    )}

                    <div className="flex flex-col space-y-2">
                      <Textarea 
                        placeholder="Enter your math question here..." 
                        value={question}
                        onChange={(e) => setQuestion(e.target.value)}
                        className="min-h-[100px]"
                        disabled={isLoading}
                      />

                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <div className="flex items-center gap-2">
                          <Input
                            ref={fileInputRef}
                            type="file"
                            accept="image/*"
                            onChange={handleImageUpload}
                            className="hidden"
                            disabled={isLoading}
                          />
                          <Button
                            type="button"
                            variant="outline"
                            onClick={() => fileInputRef.current?.click()}
                            disabled={isLoading}
                          >
                            <ImagePlus className="h-4 w-4 mr-2" />
                            Upload Image
                          </Button>

                          {messages.length > 0 && (
                            <Button 
                              type="button" 
                              variant="ghost" 
                              onClick={clearHistory}
                              disabled={isLoading}
                            >
                              <TrashIcon className="h-4 w-4 mr-2" />
                              Clear History
                            </Button>
                          )}
                        </div>

                        <Button 
                          type="submit" 
                          className="bg-mathprimary hover:bg-mathprimary/90" 
                          disabled={(!question.trim() && !image) || isLoading || (!isPremium && dailyQuestionsCount >= 5)}
                        >
                          {isLoading ? (
                            <>
                              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                              Processing...
                            </>
                          ) : (
                            <>
                              <Send className="h-4 w-4 mr-2" />
                              Ask Question
                            </>
                          )}
                        </Button>
                      </div>
                    </div>
                  </form>

                  <Alert>
                    <Sparkles className="h-4 w-4" />
                    <AlertTitle>Tips for best results</AlertTitle>
                    <AlertDescription>
                      Be specific with your math questions. You can ask about algebra, calculus, geometry, or upload an image of a math problem.
                    </AlertDescription>
                  </Alert>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* History Tab */}
          <TabsContent value="history">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-xl flex items-center">
                  <History className="h-5 w-5 mr-2" />
                  Chat History
                </CardTitle>
                <CardDescription>
                  {isPremium 
                    ? "Access all your previous conversations" 
                    : "Free users can view up to 5 days of chat history"}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col space-y-6">
                  <ScrollArea className="h-[500px] pr-4">
                    {chatSessions.length === 0 ? (
                      <div className="flex flex-col items-center justify-center h-full text-center p-4">
                        <History className="h-12 w-12 text-muted-foreground/50 mb-2" />
                        <p className="text-muted-foreground">
                          No chat history found. Start a new conversation!
                        </p>
                      </div>
                    ) : (
                      <div className="space-y-8">
                        {chatSessions.map((session, sessionIndex) => (
                          <div key={session.date} className="space-y-4">
                            <div className="flex items-center space-x-2">
                              <CalendarClock className="h-4 w-4 text-muted-foreground" />
                              <h3 className="text-lg font-medium">{formatSessionDate(session.date)}</h3>
                              <div className="text-xs text-muted-foreground bg-muted px-2 py-1 rounded-full">
                                {session.messages.length / 2} conversations
                              </div>
                            </div>
                            
                            {session.messages.reduce<React.ReactNode[]>((pairs, message, index) => {
                              if (index % 2 === 0 && index < session.messages.length - 1) {
                                const userMessage = message;
                                const aiMessage = session.messages[index + 1];
                                
                                pairs.push(
                                  <Card key={userMessage.id} className="border border-muted">
                                    <CardContent className="p-4 space-y-4">
                                      {/* User message */}
                                      <div className="flex items-start space-x-3">
                                        <Avatar className="h-8 w-8 mt-1">
                                          <AvatarImage src="" />
                                          <AvatarFallback className="bg-mathprimary text-white">
                                            <User className="h-4 w-4" />
                                          </AvatarFallback>
                                        </Avatar>
                                        <div className="flex-1">
                                          <div className="flex items-center justify-between">
                                            <div className="font-medium mb-1">You</div>
                                            <div className="text-xs text-muted-foreground flex items-center">
                                              <Clock className="h-3 w-3 mr-1" />
                                              {format(new Date(userMessage.created_at), 'h:mm a')}
                                            </div>
                                          </div>
                                          {renderMessageContent(userMessage)}
                                        </div>
                                      </div>
                                      
                                      <div className="border-t border-border my-2" />
                                      
                                      {/* AI message */}
                                      <div className="flex items-start space-x-3">
                                        <Avatar className="h-8 w-8 mt-1">
                                          <AvatarImage src="/lovable-uploads/0cfac2ed-f408-4c67-81fa-bb01eb283ca8.png" />
                                          <AvatarFallback className="bg-muted">
                                            <Bot className="h-4 w-4" />
                                          </AvatarFallback>
                                        </Avatar>
                                        <div className="flex-1">
                                          <div className="flex items-center justify-between">
                                            <div className="font-medium mb-1">MathHub AI</div>
                                            <div className="text-xs text-muted-foreground flex items-center">
                                              <Clock className="h-3 w-3 mr-1" />
                                              {format(new Date(aiMessage.created_at), 'h:mm a')}
                                            </div>
                                          </div>
                                          {renderMessageContent(aiMessage)}
                                        </div>
                                      </div>
                                    </CardContent>
                                  </Card>
                                );
                              }
                              return pairs;
                            }, [])}
                          </div>
                        ))}
                        
                        {!isPremium && !showAllHistory && chatSessions.length >= 5 && (
                          <div className="flex justify-center pt-4">
                            <Button 
                              variant="outline" 
                              onClick={loadMoreHistory}
                              className="flex items-center"
                            >
                              <Sparkles className="h-4 w-4 mr-2 text-mathprimary" />
                              Upgrade to Premium for Full History
                            </Button>
                          </div>
                        )}
                        <div ref={historyEndRef} />
                      </div>
                    )}
                  </ScrollArea>
                  
                  {chatSessions.length > 0 && (
                    <div className="flex justify-end">
                      <Button 
                        variant="outline" 
                        onClick={clearHistory} 
                        className="text-red-500 border-red-200 hover:bg-red-50 hover:text-red-600"
                      >
                        <TrashIcon className="h-4 w-4 mr-2" />
                        Clear All History
                      </Button>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default MathHubAI;
