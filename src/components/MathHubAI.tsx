
import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { BrainCircuit, Send, MessageSquare, History, Image, Upload } from "lucide-react";
import LoadingAnimation from "@/components/LoadingAnimation";

type ChatMessage = {
  role: "user" | "assistant";
  content: string;
};

type HistoryItem = {
  id: string;
  question: string;
  answer: string;
  created_at: string;
};

// File upload type
type UploadedFile = {
  file: File;
  preview: string;
};

// Generic SQL query response type
type SqlQueryResponse<T> = {
  data: T[];
};

type UserAIDoubts = {
  id: string;
  user_id: string;
  total_used: number;
  created_at: string | null;
};

type AIChatHistory = {
  id: string;
  user_id: string;
  question: string;
  answer: string;
  created_at: string | null;
};

const MathHubAI = () => {
  const { user, isAuthenticated, isLoading } = useAuth();
  const navigate = useNavigate();
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [loading, setLoading] = useState(false);
  const [remainingDoubts, setRemainingDoubts] = useState<number | null>(null);
  const [isPremium, setIsPremium] = useState(false);
  const [chatHistory, setChatHistory] = useState<HistoryItem[]>([]);
  const [activeTab, setActiveTab] = useState("chat");
  const [selectedModel, setSelectedModel] = useState("gpt-4o");
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      navigate("/auth", { state: { returnTo: "/mathhub-ai" } });
    }
    
    if (isAuthenticated && user) {
      fetchUserData();
      fetchChatHistory();
    }
  }, [isAuthenticated, isLoading, user, navigate]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const fetchUserData = async () => {
    try {
      const { data: premiumData } = await supabase
        .from("user_premium")
        .select("*")
        .eq("user_id", user?.id)
        .eq("is_active", true)
        .single();
      
      setIsPremium(!!premiumData);

      // Use the sql-execute edge function to query user_ai_doubts
      const { data, error } = await supabase
        .functions.invoke<SqlQueryResponse<UserAIDoubts>>("sql-execute", {
          body: {
            query: `SELECT * FROM user_ai_doubts WHERE user_id = '${user?.id}'`
          }
        });

      if (error) {
        console.error("Error fetching user data:", error);
        setRemainingDoubts(5);
        return;
      }

      const doubtsData = data?.data;
      
      if (doubtsData && doubtsData.length > 0) {
        setRemainingDoubts(Math.max(0, 5 - doubtsData[0].total_used));
      } else {
        setRemainingDoubts(5);
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
      setRemainingDoubts(5);
    }
  };

  const fetchChatHistory = async () => {
    try {
      const { data, error } = await supabase
        .functions.invoke<SqlQueryResponse<AIChatHistory>>("sql-execute", {
          body: {
            query: `SELECT * FROM ai_chat_history WHERE user_id = '${user?.id}' ORDER BY created_at DESC LIMIT 20`
          }
        });
        
      if (error) {
        console.error("Error fetching chat history:", error);
        return;
      }
      
      const chatData = data?.data;
      if (chatData) {
        setChatHistory(chatData.map(item => ({
          id: item.id,
          question: item.question,
          answer: item.answer,
          created_at: item.created_at || ''
        })));
      }
    } catch (error) {
      console.error("Error fetching chat history:", error);
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const newFiles: UploadedFile[] = [];
    
    Array.from(files).forEach(file => {
      // Check if file is an image and less than 5MB
      if (file.type.startsWith("image/") && file.size < 5 * 1024 * 1024) {
        const reader = new FileReader();
        reader.onload = (e) => {
          if (e.target?.result) {
            newFiles.push({
              file,
              preview: e.target.result as string
            });
            
            // Wait for all files to be processed
            if (newFiles.length === files.length) {
              setUploadedFiles(prev => [...prev, ...newFiles]);
            }
          }
        };
        reader.readAsDataURL(file);
      } else {
        toast.error(`${file.name} is not a valid image or exceeds 5MB limit.`);
      }
    });
  };

  const removeFile = (index: number) => {
    setUploadedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if ((!input.trim() && uploadedFiles.length === 0) || loading) return;
    
    const userMessage = input.trim();
    setInput("");
    
    // Create a message with both text and image references if applicable
    let messageContent = userMessage;
    if (uploadedFiles.length > 0) {
      if (!userMessage) {
        messageContent = "I've uploaded image(s) for analysis.";
      }
    }
    
    setMessages((prev) => [...prev, { role: "user", content: messageContent }]);
    
    setLoading(true);
    
    try {
      // Prepare files for API
      const files = uploadedFiles.map(file => {
        const base64Content = file.preview.split(',')[1]; // Remove the data URL prefix
        return {
          name: file.file.name,
          content: base64Content,
          type: file.file.type
        };
      });

      // Reset uploaded files after sending
      setUploadedFiles([]);
      
      const response = await fetch(`https://gpzoytysrrormkmytmyk.supabase.co/functions/v1/mathhub-ai`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${(await supabase.auth.getSession()).data.session?.access_token}`
        },
        body: JSON.stringify({
          question: userMessage,
          model: selectedModel,
          files: files
        })
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || "Failed to get answer from AI");
      }
      
      setMessages((prev) => [...prev, { role: "assistant", content: data.answer }]);
      
      if (!isPremium) {
        fetchUserData();
      }

      fetchChatHistory();
    } catch (error) {
      console.error(error);
      toast.error(error instanceof Error ? error.message : "Failed to get answer from AI");
    } finally {
      setLoading(false);
    }
  };

  const loadHistoryItem = (item: HistoryItem) => {
    setMessages([
      { role: "user", content: item.question },
      { role: "assistant", content: item.answer }
    ]);
    setActiveTab("chat");
  };

  const triggerFileInput = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[70vh]">
        <LoadingAnimation size="md" />
      </div>
    );
  }

  return (
    <div className="container mx-auto max-w-6xl px-4 py-8">
      <div className="flex flex-col space-y-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold flex items-center">
              <BrainCircuit className="mr-2 text-mathprimary" />
              MathHub AI
            </h1>
            <p className="text-muted-foreground mt-1">
              Your AI-powered math tutor to help with problems and concepts
            </p>
          </div>
          
          <div className="flex items-center gap-4">
            {!isPremium && remainingDoubts !== null && (
              <div className="text-sm bg-muted px-3 py-1.5 rounded-full">
                <span className="font-medium">Free Doubts: </span> 
                <span className={remainingDoubts > 0 ? "text-green-600" : "text-red-500"}>
                  {remainingDoubts}/5 remaining
                </span>
              </div>
            )}
          </div>
        </div>
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid grid-cols-2 mb-8">
            <TabsTrigger value="chat" className="flex items-center gap-2">
              <MessageSquare size={16} />
              <span>AI Chat</span>
            </TabsTrigger>
            <TabsTrigger value="history" className="flex items-center gap-2">
              <History size={16} />
              <span>History</span>
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="chat">
            <Card className="mb-8">
              <CardContent className="p-6">
                <div className="h-[60vh] flex flex-col">
                  <div className="flex-1 overflow-y-auto mb-4 space-y-4">
                    {messages.length === 0 ? (
                      <div className="h-full flex flex-col items-center justify-center text-center p-8">
                        <BrainCircuit size={48} className="text-muted-foreground mb-4" />
                        <h3 className="text-lg font-medium">Welcome to MathHub AI!</h3>
                        <p className="text-muted-foreground max-w-md mt-2">
                          Ask any math question, from basic arithmetic to advanced calculus.
                          I'm here to help with step-by-step solutions.
                        </p>
                      </div>
                    ) : (
                      messages.map((msg, i) => (
                        <div
                          key={i}
                          className={`flex ${
                            msg.role === "user" ? "justify-end" : "justify-start"
                          }`}
                        >
                          <div
                            className={`max-w-[80%] rounded-lg p-4 ${
                              msg.role === "user"
                                ? "bg-mathprimary text-white"
                                : "bg-muted"
                            }`}
                          >
                            <div className="whitespace-pre-wrap">{msg.content}</div>
                          </div>
                        </div>
                      ))
                    )}
                    <div ref={messagesEndRef} />
                  </div>
                  
                  {/* File uploads display */}
                  {uploadedFiles.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-3">
                      {uploadedFiles.map((file, index) => (
                        <div key={index} className="relative">
                          <img 
                            src={file.preview} 
                            alt={`Upload ${index + 1}`} 
                            className="h-16 w-16 object-cover rounded-lg" 
                          />
                          <button
                            onClick={() => removeFile(index)}
                            className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center"
                          >
                            ×
                          </button>
                        </div>
                      ))}
                    </div>
                  )}

                  <form onSubmit={handleSendMessage} className="flex gap-2">
                    <Input
                      type="file"
                      ref={fileInputRef}
                      className="hidden"
                      accept="image/*"
                      onChange={handleFileUpload}
                      multiple
                    />
                    <Button
                      type="button"
                      variant="outline"
                      size="icon"
                      onClick={triggerFileInput}
                      disabled={loading || (!isPremium && remainingDoubts === 0)}
                    >
                      <Upload size={18} />
                    </Button>
                    <Input
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      placeholder="Ask any math question..."
                      disabled={loading || (!isPremium && remainingDoubts === 0)}
                      className="flex-1"
                    />
                    <Button 
                      type="submit" 
                      disabled={loading || (!isPremium && remainingDoubts === 0) || (input.trim() === "" && uploadedFiles.length === 0)}
                    >
                      {loading ? <LoadingAnimation size="sm" /> : <Send size={18} />}
                    </Button>
                  </form>
                  
                  {!isPremium && remainingDoubts === 0 && (
                    <div className="mt-4 text-center">
                      <p className="text-amber-600 dark:text-amber-400 text-sm">
                        You've used all your free doubts. Upgrade to premium to continue.
                      </p>
                      <div className="mt-2">
                        <Button variant="outline" size="sm" asChild>
                          <a href="/premium">Upgrade to Premium</a>
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="history">
            <Card>
              <CardHeader>
                <CardTitle>Chat History</CardTitle>
                <CardDescription>
                  Your previous conversations with MathHub AI
                </CardDescription>
              </CardHeader>
              <CardContent>
                {chatHistory.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    No chat history yet. Start a conversation!
                  </div>
                ) : (
                  <div className="space-y-4">
                    {chatHistory.map((item) => (
                      <div
                        key={item.id}
                        className="border rounded-lg p-4 hover:bg-accent/50 transition-colors cursor-pointer"
                        onClick={() => loadHistoryItem(item)}
                      >
                        <div className="font-medium truncate">{item.question}</div>
                        <div className="text-sm text-muted-foreground mt-1 truncate">
                          {item.answer.substring(0, 100)}
                          {item.answer.length > 100 ? "..." : ""}
                        </div>
                        <div className="text-xs text-muted-foreground mt-2">
                          {new Date(item.created_at).toLocaleString()}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default MathHubAI;
