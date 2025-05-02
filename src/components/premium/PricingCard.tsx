
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, Clock } from "lucide-react";
import PhonePeButton from "@/components/PhonePeButton";

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
  const buttonClasses = isBestValue ? "bg-yellow-500 hover:bg-yellow-600" : "";
  const phonePeButtonClasses = isBestValue 
    ? "bg-white border-yellow-500 text-yellow-600 hover:bg-yellow-50"
    : "";
    
  const cardClasses = isBestValue 
    ? "border-yellow-500/50 shadow-md hover:shadow-lg transform scale-105" 
    : "hover:shadow-md transition-shadow";

  return (
    <div className={`border rounded-xl shadow-sm p-6 flex flex-col relative ${cardClasses}`}>
      {isBestValue && (
        <div className="absolute top-0 right-0 bg-yellow-500 text-white px-3 py-1 rounded-bl-lg rounded-tr-lg text-sm font-medium">
          Most Popular
        </div>
      )}
      
      <div className="mb-4">
        <Badge variant="outline" className="text-mathprimary border-mathprimary mb-2">
          {title}
        </Badge>
        <div className="mt-4 mb-2">
          <span className="text-3xl font-bold">{price}</span>
          <span className="text-muted-foreground">/{period}</span>
        </div>
        <p className="text-muted-foreground">Cancel anytime</p>
      </div>
      
      <div className="flex-grow">
        <ul className="space-y-3 mb-6">
          {features.map((feature, index) => (
            <li key={index} className="flex items-center">
              <CheckCircle className="h-5 w-5 text-green-500 mr-2 shrink-0" />
              <span>{feature}</span>
            </li>
          ))}
        </ul>
      </div>
      
      <div className="space-y-3">
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
            className={`w-full ${phonePeButtonClasses}`}
          />
        )}
      </div>
    </div>
  );
};

export default PricingCard;
