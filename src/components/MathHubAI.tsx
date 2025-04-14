
import React, { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Send, Sparkles, MessageSquare, Loader2, AlertCircle, BookOpen } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Database } from "@/integrations/supabase/types";

type Message = {
  role: "user" | "assistant";
  content: string;
};

type DoubtsUsage = {
  id: string;
  user_id: string;
  total_used: number;
  created_at: string;
  updated_at: string;
};

type ChatHistoryItem = {
  question: string;
  answer: string;
};

const DOUBTS_LIMIT = 5;

const MathHubAI: React.FC = () => {
  const { user } = useAuth();
  const [prompt, setPrompt] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [selectedModel, setSelectedModel] = useState<string>("gpt-4o");
  const [doubtsUsage, setDoubtsUsage] = useState<DoubtsUsage | null>(null);
  const [doubtsRemaining, setDoubtsRemaining] = useState<number>(DOUBTS_LIMIT);
  const [view, setView] = useState<"chat" | "history">("chat");
  const [history, setHistory] = useState<ChatHistoryItem[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  useEffect(() => {
    const fetchDoubtsUsage = async () => {
      if (!user) return;

      try {
        const { data, error } = await supabase
          .from("user_ai_doubts")
          .select("*")
          .eq("user_id", user.id)
          .single();

        if (error && error.code !== "PGRST116") {
          console.error("Error fetching doubts usage:", error);
          return;
        }

        if (data) {
          setDoubtsUsage(data as DoubtsUsage);
          setDoubtsRemaining(Math.max(0, DOUBTS_LIMIT - data.total_used));
        } else {
          const { data: newRecord, error: insertError } = await supabase
            .from("user_ai_doubts")
            .insert({ user_id: user.id, total_used: 0 })
            .select("*")
            .single();

          if (insertError) {
            console.error("Error creating doubts usage record:", insertError);
            return;
          }

          if (newRecord) {
            setDoubtsUsage(newRecord as DoubtsUsage);
            setDoubtsRemaining(DOUBTS_LIMIT);
          }
        }
      } catch (err) {
        console.error("Error in doubts usage fetch:", err);
      }
    };

    fetchDoubtsUsage();
  }, [user]);

  useEffect(() => {
    const fetchChatHistory = async () => {
      if (!user) return;

      try {
        const { data, error } = await supabase
          .from("ai_chat_history")
          .select("question, answer")
          .eq("user_id", user.id)
          .order("created_at", { ascending: false });

        if (error) {
          console.error("Error fetching chat history:", error);
          return;
        }

        if (data) {
          setHistory(data as ChatHistoryItem[]);
        }
      } catch (err) {
        console.error("Error in chat history fetch:", err);
      }
    };

    fetchChatHistory();
  }, [user, view]);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim() || isLoading) return;
    if (!user) {
      toast({
        title: "Please log in",
        description: "You need to be logged in to use MathHub AI",
        variant: "destructive",
      });
      return;
    }

    if (doubtsRemaining <= 0) {
      toast({
        title: "Limit reached",
        description: "You have used all your available AI doubts. Please upgrade to premium for unlimited usage.",
        variant: "destructive",
      });
      return;
    }

    const userMessage = { role: "user" as const, content: prompt };
    setMessages((prev) => [...prev, userMessage]);
    setIsLoading(true);
    setError(null);
    setPrompt("");

    try {
      const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/mathhub-ai`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
        },
        body: JSON.stringify({
          question: prompt,
          model: selectedModel,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to get response from MathHub AI");
      }

      const data = await response.json();
      const aiMessage = { role: "assistant" as const, content: data.answer };
      setMessages((prev) => [...prev, aiMessage]);

      if (doubtsUsage) {
        const newUsage = doubtsUsage.total_used + 1;
        const { error: updateError } = await supabase
          .from("user_ai_doubts")
          .update({ total_used: newUsage, updated_at: new Date().toISOString() })
          .eq("id", doubtsUsage.id);

        if (updateError) {
          console.error("Error updating doubts usage:", updateError);
        } else {
          setDoubtsUsage({ ...doubtsUsage, total_used: newUsage });
          setDoubtsRemaining(Math.max(0, DOUBTS_LIMIT - newUsage));
        }
      }

      if (view === "history") {
        const { data: updatedHistory, error: historyError } = await supabase
          .from("ai_chat_history")
          .select("question, answer")
          .eq("user_id", user.id)
          .order("created_at", { ascending: false });

        if (!historyError && updatedHistory) {
          setHistory(updatedHistory as ChatHistoryItem[]);
        }
      }
    } catch (err: any) {
      console.error("MathHub AI error:", err);
      setError(err.message || "An error occurred while processing your request");
      toast({
        title: "MathHub AI Error",
        description: err.message || "Failed to get a response from MathHub AI",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
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
              Your personal math tutor - Ask any math question and get instant help
            </p>
          </div>

          <div className="flex items-center space-x-2">
            <Badge variant="outline" className="text-sm py-1">
              <BookOpen className="w-3.5 h-3.5 mr-1" />
              {doubtsRemaining} doubts remaining
            </Badge>
          </div>
        </div>

        <Tabs defaultValue="chat" className="w-full" onValueChange={(value) => setView(value as "chat" | "history")}>
          <TabsList className="grid grid-cols-2 mb-4">
            <TabsTrigger value="chat">
              <MessageSquare className="h-4 w-4 mr-2" />
              Chat
            </TabsTrigger>
            <TabsTrigger value="history">
              <BookOpen className="h-4 w-4 mr-2" />
              History
            </TabsTrigger>
          </TabsList>

          <TabsContent value="chat" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-xl">Chat with MathHub AI</CardTitle>
                <CardDescription>
                  Ask any math question and our AI will help you solve it step by step
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {messages.length === 0 ? (
                    <div className="text-center py-8">
                      <Sparkles className="h-12 w-12 text-mathprimary/50 mx-auto mb-3" />
                      <h3 className="text-lg font-medium mb-1">Welcome to MathHub AI!</h3>
                      <p className="text-muted-foreground text-sm max-w-md mx-auto">
                        Ask any math question, from simple arithmetic to complex calculus. I'll guide you through the solution step by step.
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-4 max-h-[400px] overflow-y-auto p-1">
                      {messages.map((msg, index) => (
                        <div
                          key={index}
                          className={`flex ${
                            msg.role === "user" ? "justify-end" : "justify-start"
                          }`}
                        >
                          <div
                            className={`max-w-[80%] rounded-lg p-3 ${
                              msg.role === "user"
                                ? "bg-mathprimary text-white"
                                : "bg-muted"
                            }`}
                          >
                            <div className="whitespace-pre-wrap">{msg.content}</div>
                          </div>
                        </div>
                      ))}
                      <div ref={messagesEndRef} />
                    </div>
                  )}

                  {error && (
                    <Alert variant="destructive">
                      <AlertCircle className="h-4 w-4" />
                      <AlertTitle>Error</AlertTitle>
                      <AlertDescription>{error}</AlertDescription>
                    </Alert>
                  )}
                </div>
              </CardContent>
              <CardFooter>
                <form onSubmit={handleSubmit} className="w-full space-y-3">
                  <div className="flex items-center space-x-2">
                    <Select
                      value={selectedModel}
                      onValueChange={setSelectedModel}
                      disabled={isLoading}
                    >
                      <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Select model" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          <SelectItem value="gpt-4o">OpenAI GPT-4o</SelectItem>
                          <SelectItem value="gpt-3.5-turbo">OpenAI GPT-3.5</SelectItem>
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex space-x-2">
                    <Textarea
                      placeholder="Type your math question here..."
                      value={prompt}
                      onChange={(e) => setPrompt(e.target.value)}
                      disabled={isLoading || doubtsRemaining <= 0}
                      className="min-h-[80px]"
                    />
                    <Button
                      type="submit"
                      disabled={isLoading || !prompt.trim() || doubtsRemaining <= 0}
                      className="self-end"
                    >
                      {isLoading ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <Send className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                </form>
              </CardFooter>
            </Card>
          </TabsContent>

          <TabsContent value="history">
            <Card>
              <CardHeader>
                <CardTitle className="text-xl">Your Question History</CardTitle>
                <CardDescription>
                  Review your previous math questions and answers
                </CardDescription>
              </CardHeader>
              <CardContent className="max-h-[600px] overflow-y-auto">
                {history.length > 0 ? (
                  <div className="space-y-6">
                    {history.map((item, index) => (
                      <div key={index} className="border rounded-lg p-4">
                        <div className="font-medium mb-2 text-mathprimary">
                          <MessageSquare className="h-4 w-4 inline mr-2" />
                          Question:
                        </div>
                        <p className="mb-4 text-sm">{item.question}</p>
                        <div className="font-medium mb-2 text-mathsecondary">
                          <Sparkles className="h-4 w-4 inline mr-2" />
                          Answer:
                        </div>
                        <p className="text-sm whitespace-pre-wrap">{item.answer}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <BookOpen className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                    <h3 className="text-lg font-medium mb-1">No questions yet</h3>
                    <p className="text-muted-foreground text-sm">
                      When you ask questions, they will appear here
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {doubtsRemaining <= 0 && (
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Daily limit reached</AlertTitle>
            <AlertDescription>
              You've used all your free AI doubts for today. Upgrade to premium for unlimited access.
              <div className="mt-2">
                <Button variant="default" size="sm" asChild>
                  <Link to="/premium">Upgrade to Premium</Link>
                </Button>
              </div>
            </AlertDescription>
          </Alert>
        )}
      </div>
    </div>
  );
};

export default MathHubAI;
