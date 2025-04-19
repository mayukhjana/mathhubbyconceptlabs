
import React, { useState, useRef, useEffect } from "react";
import { Sparkles, Send, ImagePlus, Loader2, AlertCircle, TrashIcon, MessageSquare } from "lucide-react";
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
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import 'katex/dist/katex.min.css';

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

const MathHubAI: React.FC = () => {
  const [question, setQuestion] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [dailyQuestionsCount, setDailyQuestionsCount] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const { user, isPremium } = useAuth();
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (user) {
      fetchChatHistory();
      checkDailyLimit();
    }
  }, [user]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const fetchChatHistory = async () => {
    try {
      const { data, error } = await supabase
        .from('ai_chat_history')
        .select('*')
        .eq('user_id', user?.id)
        .order('created_at', { ascending: true })
        .limit(50);

      if (error) {
        console.error("Error fetching chat history:", error);
        return;
      }

      if (data) {
        const formattedMessages: Message[] = data.map((item: ChatHistoryItem) => ({
          id: item.id,
          role: 'user' as const,
          content: item.question,
          created_at: item.created_at,
          image: item.has_image ? 'image' : undefined
        })).flatMap((userMessage, index) => {
          const item = data[index];
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
      
      console.log("Calling Gemini Math AI function with question:", question.substring(0, 50));
      
      const { data, error } = await supabase.functions.invoke('gemini-math-ai', {
        body: {
          question,
          image: imageBase64
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

      if (!data.answer) {
        setError("AI returned an empty answer.");
        toast({
          title: "Error",
          description: "Received an empty response from the AI. Please try again.",
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
      
      if (!isPremium) {
        setDailyQuestionsCount(prev => prev + 1);
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

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex flex-col space-y-4 max-w-4xl mx-auto">
        <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold flex items-center">
              <Sparkles className="mr-2 h-8 w-8 text-mathprimary" />
              MathHub AI
            </h1>
            <p className="text-muted-foreground mt-1">
              Your personal math tutor powered by Google Gemini
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

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-xl">Math AI Assistant</CardTitle>
            <CardDescription>
              Ask any math question or upload a math problem image
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col space-y-4">
              <div className="h-[400px] border rounded-lg p-4 relative bg-muted/30 overflow-auto">
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
                                  <div className="math-content">
                                    <ReactMarkdown 
                                      remarkPlugins={[remarkGfm, remarkMath]}
                                      rehypePlugins={[rehypeKatex]}
                                    >
                                      {message.content}
                                    </ReactMarkdown>
                                  </div>
                                </div>
                              </div>
                            ) : (
                              <div>
                                <div className="mb-1 font-medium">You</div>
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
      </div>
    </div>
  );
};

export default MathHubAI;
