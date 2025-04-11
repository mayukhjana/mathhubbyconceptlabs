import { useState, useEffect, useRef } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { toast } from "sonner";
import { BrainCircuit, Send, Key, HelpCircle, MessageSquare, History, Sparkles } from "lucide-react";
import { useForm } from "react-hook-form";
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

type SupportTicket = {
  id: string;
  subject: string;
  message: string;
  status: string;
  created_at: string;
};

const MathHubAI = () => {
  const { user, isAuthenticated, isLoading } = useAuth();
  const navigate = useNavigate();
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [loading, setLoading] = useState(false);
  const [useCustomKey, setUseCustomKey] = useState(false);
  const [customApiKey, setCustomApiKey] = useState("");
  const [remainingDoubts, setRemainingDoubts] = useState<number | null>(null);
  const [isPremium, setIsPremium] = useState(false);
  const [chatHistory, setChatHistory] = useState<HistoryItem[]>([]);
  const [supportTickets, setSupportTickets] = useState<SupportTicket[]>([]);
  const [activeTab, setActiveTab] = useState("chat");
  
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const supportForm = useForm({
    defaultValues: {
      subject: "",
      message: ""
    }
  });

  useEffect(() => {
    // Redirect to auth if not authenticated
    if (!isLoading && !isAuthenticated) {
      navigate("/auth", { state: { returnTo: "/mathhub-ai" } });
    }
    
    if (isAuthenticated && user) {
      fetchUserData();
      fetchChatHistory();
      fetchSupportTickets();
    }
  }, [isAuthenticated, isLoading, user, navigate]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const fetchUserData = async () => {
    try {
      // Check premium status
      const { data: premiumData } = await supabase
        .from("user_premium")
        .select("*")
        .eq("user_id", user?.id)
        .eq("is_active", true)
        .single();
      
      setIsPremium(!!premiumData);

      // Check remaining doubts if not premium
      if (!premiumData) {
        const { data: doubtsData } = await supabase
          .from("user_ai_doubts")
          .select("total_used")
          .eq("user_id", user?.id)
          .single();
        
        if (doubtsData) {
          setRemainingDoubts(Math.max(0, 5 - doubtsData.total_used));
        } else {
          setRemainingDoubts(5);
        }
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
      setRemainingDoubts(5); // Assume 5 if we can't fetch
    }
  };

  const fetchChatHistory = async () => {
    try {
      const { data, error } = await supabase
        .from("ai_chat_history")
        .select("*")
        .eq("user_id", user?.id)
        .order("created_at", { ascending: false })
        .limit(20);
        
      if (error) throw error;
      setChatHistory(data || []);
    } catch (error) {
      console.error("Error fetching chat history:", error);
    }
  };

  const fetchSupportTickets = async () => {
    try {
      const { data, error } = await supabase
        .from("support_tickets")
        .select("*")
        .eq("user_id", user?.id)
        .order("created_at", { ascending: false });
        
      if (error) throw error;
      setSupportTickets(data || []);
    } catch (error) {
      console.error("Error fetching support tickets:", error);
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || loading) return;
    
    const userMessage = input.trim();
    setInput("");
    setMessages((prev) => [...prev, { role: "user", content: userMessage }]);
    
    setLoading(true);
    
    try {
      const response = await fetch(`${supabase.functions.url}/mathhub-ai`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${(await supabase.auth.getSession()).data.session?.access_token}`
        },
        body: JSON.stringify({
          question: userMessage,
          useCustomKey,
          customApiKey: useCustomKey ? customApiKey : undefined
        })
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || "Failed to get answer from AI");
      }
      
      setMessages((prev) => [...prev, { role: "assistant", content: data.answer }]);
      
      // Update remaining doubts only if not using custom key and not premium
      if (!useCustomKey && !isPremium) {
        fetchUserData();
      }

      // Refresh chat history if not using custom key
      if (!useCustomKey) {
        fetchChatHistory();
      }
    } catch (error) {
      console.error(error);
      toast.error(error instanceof Error ? error.message : "Failed to get answer from AI");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitSupportTicket = async (values: { subject: string; message: string }) => {
    try {
      const response = await fetch(`${supabase.functions.url}/submit-support-ticket`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${(await supabase.auth.getSession()).data.session?.access_token}`
        },
        body: JSON.stringify(values)
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || "Failed to submit support ticket");
      }
      
      toast.success("Support ticket submitted successfully");
      supportForm.reset();
      fetchSupportTickets();
      setActiveTab("tickets");
    } catch (error) {
      console.error(error);
      toast.error(error instanceof Error ? error.message : "Failed to submit support ticket");
    }
  };

  const loadHistoryItem = (item: HistoryItem) => {
    setMessages([
      { role: "user", content: item.question },
      { role: "assistant", content: item.answer }
    ]);
    setActiveTab("chat");
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[70vh]">
        <LoadingAnimation />
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
            
            {isPremium && (
              <div className="text-sm bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300 px-3 py-1.5 rounded-full flex items-center">
                <Sparkles size={14} className="mr-1" /> Premium User
              </div>
            )}
            
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="outline" size="sm">
                  <Key size={16} className="mr-2" />
                  API Key Settings
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>API Key Settings</DialogTitle>
                  <DialogDescription>
                    You can use your own OpenAI API key instead of the free quota.
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="use-custom-key"
                      checked={useCustomKey}
                      onCheckedChange={setUseCustomKey}
                    />
                    <Label htmlFor="use-custom-key">Use my own API key</Label>
                  </div>
                  
                  {useCustomKey && (
                    <div className="space-y-2">
                      <Label htmlFor="api-key">OpenAI API Key</Label>
                      <Input
                        id="api-key"
                        type="password"
                        placeholder="sk-..."
                        value={customApiKey}
                        onChange={(e) => setCustomApiKey(e.target.value)}
                      />
                      <p className="text-xs text-muted-foreground">
                        Your API key is used only for your requests and is never stored on our servers.
                      </p>
                    </div>
                  )}
                </div>
                <DialogFooter>
                  <Button onClick={() => toast.success("API key settings saved")}>
                    Save Settings
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </div>
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid grid-cols-3 mb-8">
            <TabsTrigger value="chat" className="flex items-center gap-2">
              <MessageSquare size={16} />
              <span>AI Chat</span>
            </TabsTrigger>
            <TabsTrigger value="history" className="flex items-center gap-2">
              <History size={16} />
              <span>History</span>
            </TabsTrigger>
            <TabsTrigger value="tickets" className="flex items-center gap-2">
              <HelpCircle size={16} />
              <span>Support</span>
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
                  
                  <form onSubmit={handleSendMessage} className="flex gap-2">
                    <Input
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      placeholder="Ask any math question..."
                      disabled={loading || (!isPremium && remainingDoubts === 0 && !useCustomKey)}
                      className="flex-1"
                    />
                    <Button 
                      type="submit" 
                      disabled={loading || (!isPremium && remainingDoubts === 0 && !useCustomKey)}
                    >
                      {loading ? <LoadingAnimation size="sm" /> : <Send size={18} />}
                    </Button>
                  </form>
                  
                  {!isPremium && remainingDoubts === 0 && !useCustomKey && (
                    <div className="mt-4 text-center">
                      <p className="text-amber-600 dark:text-amber-400 text-sm">
                        You've used all your free doubts. Upgrade to premium or use your own API key.
                      </p>
                      <div className="mt-2 flex justify-center gap-2">
                        <Button variant="outline" size="sm" asChild>
                          <Link to="/premium">Upgrade to Premium</Link>
                        </Button>
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button size="sm" variant="secondary">Use My API Key</Button>
                          </DialogTrigger>
                          {/* Rest of the dialog is already defined above */}
                        </Dialog>
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
                  Your previous conversations with MathHub AI.
                  {!isPremium && (
                    <span className="block mt-1 text-amber-600 dark:text-amber-400">
                      History is only saved when using the free quota, not with custom API keys.
                    </span>
                  )}
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
          
          <TabsContent value="tickets">
            <div className="grid md:grid-cols-2 gap-8">
              <Card>
                <CardHeader>
                  <CardTitle>Submit Support Ticket</CardTitle>
                  <CardDescription>
                    Need help? Submit a ticket and our team will assist you.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Form {...supportForm}>
                    <form
                      onSubmit={supportForm.handleSubmit(handleSubmitSupportTicket)}
                      className="space-y-4"
                    >
                      <FormField
                        control={supportForm.control}
                        name="subject"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Subject</FormLabel>
                            <FormControl>
                              <Input placeholder="Brief description of your issue" {...field} />
                            </FormControl>
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={supportForm.control}
                        name="message"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Message</FormLabel>
                            <FormControl>
                              <Textarea placeholder="Describe your issue in detail..." {...field} rows={5} />
                            </FormControl>
                          </FormItem>
                        )}
                      />
                      
                      <Button type="submit" className="w-full">
                        Submit Ticket
                      </Button>
                    </form>
                  </Form>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Your Tickets</CardTitle>
                  <CardDescription>
                    Track the status of your support requests.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {supportTickets.length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground">
                      No support tickets yet. Submit a ticket if you need help.
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {supportTickets.map((ticket) => (
                        <div key={ticket.id} className="border rounded-lg p-4">
                          <div className="flex justify-between items-start">
                            <div className="font-medium">{ticket.subject}</div>
                            <div
                              className={`text-xs px-2 py-1 rounded-full uppercase font-medium ${
                                ticket.status === "open"
                                  ? "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300"
                                  : ticket.status === "in-progress"
                                  ? "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300"
                                  : "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300"
                              }`}
                            >
                              {ticket.status}
                            </div>
                          </div>
                          <div className="text-sm mt-2 line-clamp-2">{ticket.message}</div>
                          <div className="text-xs text-muted-foreground mt-2">
                            {new Date(ticket.created_at).toLocaleString()}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default MathHubAI;
