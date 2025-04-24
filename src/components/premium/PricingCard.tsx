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
  
  const getCardStyles = () => {
    const baseStyles = "border rounded-xl shadow-sm transition-all duration-300 p-6 flex flex-col relative backdrop-blur-sm";
    const hoverStyles = "hover:shadow-lg hover:scale-[1.02] hover:z-10";
    const popularStyles = isBestValue ? "transform scale-[1.03] shadow-xl border-2" : "";
    
    switch(type) {
      case "free": return `${baseStyles} ${hoverStyles} ${popularStyles} bg-gradient-to-br from-gray-50/5 to-gray-100/5 dark:from-gray-800/50 dark:to-gray-900/50 border-gray-200/10 dark:border-gray-700/30`;
      case "starter": return `${baseStyles} ${hoverStyles} ${popularStyles} bg-gradient-to-br from-blue-50/5 to-blue-100/5 dark:from-blue-900/30 dark:to-blue-800/30 border-blue-200/20 dark:border-blue-700/30`;
      case "pro": return `${baseStyles} ${hoverStyles} ${popularStyles} bg-gradient-to-br from-mathprimary/5 to-mathsecondary/5 dark:from-mathprimary/20 dark:to-mathsecondary/20 border-mathprimary/20 dark:border-mathprimary/30`;
      case "plus": return `${baseStyles} ${hoverStyles} ${popularStyles} bg-gradient-to-br from-yellow-50/5 to-yellow-100/5 dark:from-yellow-900/30 dark:to-yellow-800/30 border-yellow-200/20 dark:border-yellow-700/30`;
      default: return baseStyles;
    }
  };

  const getBadgeStyles = () => {
    switch(type) {
      case "free": return "bg-gray-100/10 dark:bg-gray-800/30 text-gray-600 dark:text-gray-300 border-gray-200/20";
      case "starter": return "bg-blue-100/10 dark:bg-blue-900/30 text-blue-600 dark:text-blue-300 border-blue-200/20";
      case "pro": return "bg-mathprimary/10 dark:bg-mathprimary/30 text-mathprimary dark:text-mathprimary/90 border-mathprimary/20";
      case "plus": return "bg-yellow-100/10 dark:bg-yellow-900/30 text-yellow-600 dark:text-yellow-300 border-yellow-200/20";
      default: return "";
    }
  };

  return (
    <div className={getCardStyles()}>
      {isBestValue && (
        <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-mathprimary text-white px-4 py-1.5 rounded-full text-sm font-medium shadow-lg">
          Most Popular
        </div>
      )}
      
      <div className="mb-6">
        <Badge variant="outline" className={`mb-2 ${getBadgeStyles()}`}>
          {type.charAt(0).toUpperCase() + type.slice(1)}
        </Badge>
        <h3 className="text-2xl font-bold">{title}</h3>
        <div className="mt-4 mb-2 flex items-end gap-2">
          <span className="text-3xl font-bold">{price}</span>
          {price !== "Free" && <span className="text-muted-foreground dark:text-gray-400">/{period}</span>}
        </div>
        
        {originalPrice && (
          <div className="flex items-center gap-2">
            <span className="text-muted-foreground line-through dark:text-gray-500">{originalPrice}</span>
            <Badge variant="outline" className="bg-green-500/10 text-green-600 dark:text-green-400 border-green-300/20">
              <Sparkles className="h-3 w-3 mr-1" />
              <span>Save 20%</span>
            </Badge>
          </div>
        )}
        
        {price !== "Free" && <p className="text-muted-foreground text-sm mt-2 dark:text-gray-400">Cancel anytime</p>}
      </div>
      
      <div className="flex-grow">
        <ul className="space-y-3 mb-6">
          {features.map((feature, index) => (
            <li key={index} className="flex items-center text-sm">
              <CheckCircle className="h-4 w-4 text-green-500 dark:text-green-400 mr-2 flex-shrink-0" />
              <span className="text-gray-600 dark:text-gray-300">{feature}</span>
            </li>
          ))}
        </ul>
      </div>
      
      <div className="space-y-3 mt-auto">
        {type === "free" ? (
          <Button 
            className="w-full bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
            variant="outline"
            disabled={true}
          >
            Current Plan
          </Button>
        ) : (
          <>
            <Button 
              className={`w-full ${isBestValue ? 'bg-mathprimary hover:bg-mathprimary/90' : ''}`}
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
            
            {!isPremium && type !== "free" && (
              <PhonePeButton 
                subscriptionType={type}
                planPeriod={isActive}
                className={`w-full ${isBestValue ? 'border-mathprimary/50 text-mathprimary hover:bg-mathprimary/5' : ''}`}
              />
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default PricingCard;
