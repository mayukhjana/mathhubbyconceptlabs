
import { CheckCircle, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Badge } from "@/components/ui/badge";

interface PremiumPricingProps {
  activeTab: 'monthly' | 'yearly';
  setActiveTab: (tab: 'monthly' | 'yearly') => void;
}

interface PlanFeature {
  name: string;
  included: boolean;
}

interface PlanDetails {
  name: string;
  monthlyPrice: number;
  yearlyPrice: number;
  discount: number;
  features: PlanFeature[];
  isPopular?: boolean;
  bgClass: string;
}

const PremiumPricing = ({
  activeTab,
  setActiveTab
}: PremiumPricingProps) => {
  const plans: PlanDetails[] = [
    {
      name: "Free",
      monthlyPrice: 0,
      yearlyPrice: 0,
      discount: 0,
      bgClass: "from-gray-500/20 to-gray-500/10",
      features: [
        { name: "Access to 100+ papers", included: true },
        { name: "Basic practice exams", included: true },
        { name: "Limited downloads", included: true },
        { name: "Basic analytics", included: true },
        { name: "Ad-supported experience", included: true },
        { name: "Community support", included: true },
      ]
    },
    {
      name: "Starter",
      monthlyPrice: 99,
      yearlyPrice: 950,
      discount: 20,
      bgClass: "from-blue-500/20 to-blue-500/10",
      features: [
        { name: "Access to 1000+ papers", included: true },
        { name: "Standard practice exams", included: true },
        { name: "50 downloads per month", included: true },
        { name: "Standard analytics", included: true },
        { name: "Ad-free experience", included: true },
        { name: "Email support", included: true },
      ]
    },
    {
      name: "Pro",
      monthlyPrice: 199,
      yearlyPrice: 1910,
      discount: 20,
      isPopular: true,
      bgClass: "from-mathprimary/20 to-mathprimary/10",
      features: [
        { name: "Access to 5000+ papers", included: true },
        { name: "Advanced practice exams", included: true },
        { name: "Unlimited downloads", included: true },
        { name: "Advanced analytics dashboard", included: true },
        { name: "Ad-free experience", included: true },
        { name: "Priority support", included: true },
      ]
    },
    {
      name: "Plus",
      monthlyPrice: 299,
      yearlyPrice: 2870,
      discount: 20,
      bgClass: "from-yellow-500/20 to-yellow-500/10",
      features: [
        { name: "All Pro features", included: true },
        { name: "One-on-one tutoring sessions", included: true },
        { name: "Personalized learning path", included: true },
        { name: "AI-powered assistance", included: true },
        { name: "Premium study materials", included: true },
        { name: "24/7 dedicated support", included: true },
      ]
    }
  ];

  const formatPrice = (price: number) => {
    return price === 0 ? "Free" : `₹${price}`;
  };

  return (
    <div className="w-full">
      <div className="flex justify-center mb-8">
        <div className="inline-flex items-center gap-2 bg-gray-800/60 rounded-lg p-1">
          <Button 
            variant={activeTab === 'monthly' ? 'default' : 'ghost'} 
            size="sm" 
            onClick={() => setActiveTab('monthly')} 
            className={`${activeTab === 'monthly' ? 'bg-mathprimary text-white' : 'text-gray-300'}`}
          >
            Monthly
          </Button>
          <Button 
            variant={activeTab === 'yearly' ? 'default' : 'ghost'} 
            size="sm" 
            onClick={() => setActiveTab('yearly')} 
            className={`${activeTab === 'yearly' ? 'bg-mathprimary text-white' : 'text-gray-300'}`}
          >
            Yearly
          </Button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {plans.map((plan) => (
          <div key={plan.name} className={`bg-gradient-to-br ${plan.bgClass} backdrop-blur-sm rounded-2xl p-6 border border-white/10 relative overflow-hidden shadow-lg`}>
            {plan.isPopular && (
              <div className="absolute top-0 right-0 bg-mathprimary text-white px-3 py-1 rounded-bl-lg text-sm font-medium">
                Most Popular
              </div>
            )}

            <div className="mb-6">
              <h3 className="text-xl font-bold">{plan.name}</h3>
              <div className="mt-4 mb-2">
                <div className="flex items-end gap-2">
                  <span className="text-3xl font-bold">
                    {formatPrice(activeTab === 'monthly' ? plan.monthlyPrice : plan.yearlyPrice)}
                  </span>
                  {plan.monthlyPrice > 0 && (
                    <span className="text-muted-foreground">
                      /{activeTab === 'monthly' ? 'month' : 'year'}
                    </span>
                  )}
                </div>
                
                {activeTab === 'yearly' && plan.discount > 0 && (
                  <div className="flex items-center mt-2">
                    <Badge variant="outline" className="bg-green-500/20 text-green-400 border-green-500/30">
                      <Sparkles className="h-3 w-3 mr-1" />
                      <span>Save {plan.discount}%</span>
                    </Badge>
                    <span className="ml-2 text-sm line-through text-muted-foreground">
                      ₹{plan.monthlyPrice * 12}
                    </span>
                  </div>
                )}
              </div>
            </div>

            <div className="space-y-3 mb-6">
              {plan.features.map((feature, idx) => (
                <div key={idx} className="flex items-center gap-2">
                  <CheckCircle className={`h-5 w-5 ${feature.included ? 'text-green-500' : 'text-gray-400'}`} />
                  <span className={feature.included ? '' : 'text-gray-400 line-through'}>{feature.name}</span>
                </div>
              ))}
            </div>

            {plan.name === "Free" ? (
              <Button className="w-full bg-white/80 text-mathdark hover:bg-white dark:hover:bg-gray-200 relative z-10" size="lg" asChild>
                <Link to="/auth?tab=register">Get Started</Link>
              </Button>
            ) : (
              <Button className="w-full bg-white/80 text-mathdark hover:bg-white dark:hover:bg-gray-200 relative z-10" size="lg" asChild>
                <Link to="/premium">Get {plan.name}</Link>
              </Button>
            )}
          </div>
        ))}
      </div>
      
      <div className="mt-6 text-center text-sm text-gray-400">
        All paid plans come with a 30-day money-back guarantee
      </div>
    </div>
  );
};

export default PremiumPricing;
