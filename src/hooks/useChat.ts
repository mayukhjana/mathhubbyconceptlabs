import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { Message, ChatSession } from "@/components/mathHub/types";

export const useChat = () => {
  const [question, setQuestion] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [chatSessions, setChatSessions] = useState<ChatSession[]>([]);
  const [dailyQuestionsCount, setDailyQuestionsCount] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [showAllHistory, setShowAllHistory] = useState(false);
  
  const { user, isPremium } = useAuth();
  const { toast } = useToast();

  // Load messages from localStorage
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

  // Save messages to localStorage
  useEffect(() => {
    if (messages.length > 0) {
      localStorage.setItem('mathHubMessages', JSON.stringify(messages));
    }
  }, [messages]);

  // Load chat history and check daily limit when user changes
  useEffect(() => {
    if (user) {
      fetchChatHistory();
      checkDailyLimit();
    }
  }, [user]);

  const fetchChatHistory = async () => {
    if (!user) return;
    
    try {
      const { data, error } = await supabase
        .from('ai_chat_history')
        .select('*')
        .eq('user_id', user.id)
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

  // Create a memoized version of fetchChatHistory that can be passed to useEffect dependencies
  const refreshChatHistory = useCallback(fetchChatHistory, [user]);

  const groupChatsByDate = (chatItems: any[]): ChatSession[] => {
    const allChatItems = [...chatItems];
    const groupedChats: Record<string, any[]> = {};
    
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
        if (file.size <= 10 * 1024 * 1024) {
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

  const startNewChat = () => {
    // Save current messages to history if needed
    if (messages.length > 0 && user) {
      // We don't need to do anything, messages are already saved to the database
      // when the user sends a message and the AI responds
      
      // Clear the current messages
      setMessages([]);
      localStorage.removeItem('mathHubMessages');
      toast({
        title: "New Chat Started",
        description: "Your previous conversation has been saved to history."
      });
    } else {
      toast({
        title: "New Chat Started",
        description: "Your conversation area has been cleared."
      });
      setMessages([]);
      localStorage.removeItem('mathHubMessages');
    }
    
    // Reset the input
    setQuestion("");
    removeImage();
    
    // Refresh chat history to show updated sessions
    refreshChatHistory();
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

      try {
        // Call MathHub AI with Gemini Flash model
        const { data, error } = await supabase.functions.invoke('mathhub-ai', {
          body: {
            question,
            files: imageBase64 ? [{
              name: image?.name || 'image.jpg',
              content: imageBase64,
              type: image?.type || 'image/jpeg'
            }] : []
          }
        });

        if (error) throw error;
        if (!data || data.error) throw new Error(data?.error || "Failed to get an answer");
        
        const answer = data.answer;

        const assistantMessage: Message = {
          id: `assistant-${tempId}`,
          role: 'assistant',
          content: answer,
          created_at: new Date().toISOString()
        };
        
        setMessages(prev => [...prev, assistantMessage]);
        
        // Chat history is already saved by the edge function, no need to save again here
        // This prevents double-counting of questions
        
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
        
        // Don't remove the user's message on error, so they can try again
        // setMessages(prev => prev.filter(msg => msg.id !== tempId));
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

  const saveAIResponse = async (question: string, answer: string, hasImage: boolean = false) => {
    if (!user?.id) return;
    
    try {
      const { error } = await supabase
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

      // Refresh chat history immediately after saving a new chat
      refreshChatHistory();
    } catch (error) {
      console.error("Error in saveAIResponse:", error);
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

  return {
    question,
    setQuestion,
    image,
    imagePreview,
    isLoading,
    messages,
    chatSessions,
    dailyQuestionsCount,
    error,
    showAllHistory,
    isPremium,
    handleImageUpload,
    removeImage,
    handleSubmit,
    clearHistory,
    loadMoreHistory,
    startNewChat,
    refreshChatHistory
  };
};
