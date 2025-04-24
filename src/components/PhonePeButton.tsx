
import { Button } from "@/components/ui/button";
import { Phone } from "lucide-react";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface PhonePeButtonProps {
  subscriptionType: "monthly" | "annual";
  className?: string;
}

const PhonePeButton = ({ subscriptionType, className }: PhonePeButtonProps) => {
  const [isLoading, setIsLoading] = useState(false);

  const handlePhonePePayment = async () => {
    try {
      setIsLoading(true);
      toast.info("Initializing PhonePe payment...");
      
      const { data, error } = await supabase.functions.invoke("create-phonepe-checkout", {
        body: { subscriptionType }
      });
      
      if (error) {
        throw new Error(error.message);
      }
      
      console.log("PhonePe checkout response:", data);
      
      if (data?.url) {
        window.location.href = data.url;
      } else {
        throw new Error(data?.message || "No checkout URL returned");
      }
    } catch (error) {
      console.error("PhonePe payment error:", error);
      toast.error("Error initializing payment. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button
      onClick={handlePhonePePayment}
      disabled={isLoading}
      variant="outline"
      className={className}
    >
      {isLoading ? (
        <span className="flex items-center">Processing...</span>
      ) : (
        <span className="flex items-center">
          <Phone className="w-4 h-4 mr-2" />
          Pay with PhonePe
        </span>
      )}
    </Button>
  );
};

export default PhonePeButton;
