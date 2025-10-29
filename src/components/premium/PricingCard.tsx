
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, Clock } from "lucide-react";

interface PricingCardProps {
  type: "basic" | "standard" | "premium" | "monthly" | "annual";
  price: string;
  period?: string;
  isLoading: boolean;
  isPremium: boolean;
  onSubscribe: () => void;
  features: string[];
  isBestValue?: boolean;
  title?: string;
}

const PricingCard = ({
  type,
  price,
  period = "month",
  isLoading,
  isPremium,
  onSubscribe,
  features,
  isBestValue,
  title = "Premium"
}: PricingCardProps) => {
  const buttonClasses = isBestValue ? "bg-primary hover:bg-primary/90" : "";
    
  const cardClasses = isBestValue 
    ? "border-primary/50 shadow-md hover:shadow-lg transform scale-105" 
    : "hover:shadow-md transition-shadow";

  return (
    <div className={`bg-card border rounded-xl shadow-sm p-6 flex flex-col relative ${cardClasses}`}>
      {isBestValue && (
        <Badge className="absolute -top-3 right-6 bg-primary text-primary-foreground hover:bg-primary/90">
          BEST VALUE
        </Badge>
      )}
      
      <div className="text-center mb-4">
        <h3 className="text-xl font-bold mb-2 text-foreground">{title}</h3>
        <div className="flex items-baseline justify-center">
          <span className="text-3xl font-bold text-foreground">{price}</span>
          <span className="text-muted-foreground ml-2">/{period}</span>
        </div>
      </div>
      
      <div className="flex-grow mb-6 space-y-3">
        {features.map((feature, index) => (
          <div key={index} className="flex items-start">
            <CheckCircle className="w-5 h-5 text-green-500 dark:text-green-400 mr-2 flex-shrink-0 mt-0.5" />
            <span className="text-sm text-foreground">{feature}</span>
          </div>
        ))}
      </div>
      
      <Button
        onClick={onSubscribe}
        className={`w-full ${buttonClasses}`}
        disabled={isLoading || isPremium}
      >
        {isLoading ? (
          <span className="flex items-center">
            <Clock className="mr-2 h-4 w-4 animate-spin" /> Processing...
          </span>
        ) : isPremium ? (
          "Already Subscribed"
        ) : (
          "Get Premium"
        )}
      </Button>
    </div>
  );
};

export default PricingCard;
