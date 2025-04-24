
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, Clock, Sparkles } from "lucide-react";
import PhonePeButton from "@/components/PhonePeButton";

interface PricingCardProps {
  type: "free" | "starter" | "pro" | "plus";
  monthlyPrice: string;
  yearlyPrice: string;
  isActive: "monthly" | "annual";
  isLoading: boolean;
  isPremium: boolean;
  onSubscribe: () => void;
  features: string[];
  isBestValue?: boolean;
  originalMonthlyPrice?: string;
  originalYearlyPrice?: string;
}

const PricingCard = ({
  type,
  monthlyPrice,
  yearlyPrice,
  isActive,
  isLoading,
  isPremium,
  onSubscribe,
  features,
  isBestValue,
  originalMonthlyPrice,
  originalYearlyPrice
}: PricingCardProps) => {
  const titles = {
    free: "Free Plan",
    starter: "Starter Plan",
    pro: "Pro Plan",
    plus: "Plus Plan"
  };
  
  const title = titles[type];
  const price = isActive === "monthly" ? monthlyPrice : yearlyPrice;
  const originalPrice = isActive === "monthly" ? originalMonthlyPrice : originalYearlyPrice;
  const period = isActive === "monthly" ? "month" : "year";
  
  const buttonClasses = isBestValue ? "bg-yellow-500 hover:bg-yellow-600" : "";
  const phonePeButtonClasses = isBestValue 
    ? "bg-white border-yellow-500 text-yellow-600 hover:bg-yellow-50"
    : "";

  const getCardStyles = () => {
    switch(type) {
      case "free": return "border-gray-200 hover:border-gray-300";
      case "starter": return "border-blue-200 hover:border-blue-300";
      case "pro": return "border-mathprimary hover:border-mathprimary/80";
      case "plus": return "border-yellow-200 hover:border-yellow-300";
      default: return "";
    }
  };

  const getBadgeStyles = () => {
    switch(type) {
      case "free": return "text-gray-500 border-gray-500";
      case "starter": return "text-blue-500 border-blue-500";
      case "pro": return "text-mathprimary border-mathprimary";
      case "plus": return "text-yellow-500 border-yellow-500";
      default: return "";
    }
  };

  return (
    <div className={`border-2 rounded-xl shadow-sm hover:shadow-md transition-shadow p-6 flex flex-col relative ${getCardStyles()}`}>
      {isBestValue && (
        <div className="absolute top-0 right-0 bg-yellow-500 text-white px-3 py-1 rounded-bl-lg rounded-tr-lg text-sm font-medium">
          Most Popular
        </div>
      )}
      
      <div className="mb-4">
        <Badge variant="outline" className={`mb-2 ${getBadgeStyles()}`}>
          {type.charAt(0).toUpperCase() + type.slice(1)}
        </Badge>
        <h3 className="text-2xl font-bold">{title}</h3>
        <div className="mt-4 mb-2 flex items-end gap-2">
          <span className="text-3xl font-bold">{price}</span>
          {price !== "Free" && <span className="text-muted-foreground">/{period}</span>}
        </div>
        
        {originalPrice && (
          <div className="flex items-center gap-2">
            <span className="text-muted-foreground line-through">{originalPrice}</span>
            <Badge variant="outline" className="bg-green-500/10 text-green-600 border-green-300">
              <Sparkles className="h-3 w-3 mr-1" />
              <span>Save 20%</span>
            </Badge>
          </div>
        )}
        
        {price !== "Free" && <p className="text-muted-foreground text-sm mt-2">Cancel anytime</p>}
      </div>
      
      <div className="flex-grow">
        <ul className="space-y-3 mb-6">
          {features.map((feature, index) => (
            <li key={index} className="flex items-center">
              <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
              <span>{feature}</span>
            </li>
          ))}
        </ul>
      </div>
      
      <div className="space-y-3">
        {type === "free" ? (
          <Button 
            className={`w-full ${buttonClasses}`}
            variant="outline"
            disabled={true}
          >
            Current Plan
          </Button>
        ) : (
          <>
            <Button 
              className={`w-full ${buttonClasses}`}
              onClick={onSubscribe}
              disabled={isLoading || isPremium}
            >
              {isLoading ? (
                <span className="flex items-center">
                  <Clock className="mr-2 h-4 w-4 animate-spin" /> Processing...
                </span>
              ) : isPremium ? (
                "Already Subscribed"
              ) : (
                "Pay with Stripe"
              )}
            </Button>
            
            {!isPremium && (
              <PhonePeButton 
                subscriptionType={type}
                planPeriod={isActive}
                className={`w-full ${phonePeButtonClasses}`}
              />
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default PricingCard;
