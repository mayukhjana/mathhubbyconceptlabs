
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export const useSubscription = () => {
  const { isAuthenticated } = useAuth();
  const [isLoading, setIsLoading] = useState<{[key: string]: boolean}>({ 
    monthly: false, 
    annual: false 
  });
  const navigate = useNavigate();

  const handleSubscribe = async (subscriptionType: "monthly" | "annual") => {
    if (!isAuthenticated) {
      toast.error("Please sign in to subscribe");
      navigate("/auth");
      return;
    }
    
    try {
      setIsLoading({...isLoading, [subscriptionType]: true});
      
      const { data, error } = await supabase.functions.invoke("create-checkout", {
        body: { subscriptionType }
      });
      
      if (error) {
        throw new Error(error.message);
      }
      
      if (data?.url) {
        window.location.href = data.url;
      } else {
        throw new Error("No checkout URL returned");
      }
    } catch (error) {
      console.error("Subscription error:", error);
      toast.error("Error creating subscription. Please try again.");
    } finally {
      setIsLoading({...isLoading, [subscriptionType]: false});
    }
  };

  return {
    isLoading,
    handleSubscribe
  };
};
