
import { CheckCircle, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

interface PremiumPricingProps {
  activeTab: 'monthly' | 'yearly';
  setActiveTab: (tab: 'monthly' | 'yearly') => void;
}

const PremiumPricing = ({
  activeTab,
  setActiveTab
}: PremiumPricingProps) => {
  const features = {
    basic: [
      "Access to 1000+ basic papers",
      "Limited practice exams",
      "Basic performance tracking",
      "Mobile app access",
      "Email support"
    ],
    standard: [
      "Access to 5000+ papers",
      "All practice exams included", 
      "Unlimited downloads", 
      "Performance analytics dashboard", 
      "Ad-free experience across all devices", 
      "Mobile app access", 
      "24/7 customer support"
    ],
    premium: [
      "Everything in Standard plan",
      "1-on-1 tutoring sessions (2/month)",
      "Personalized study plans",
      "Advanced AI-powered feedback",
      "Guaranteed score improvement",
      "Priority customer support",
      "Offline mode for all content"
    ]
  };
  
  const plans = [
    {
      type: "basic",
      title: "Basic Plan",
      monthlyPrice: "₹99",
      yearlyPrice: "₹999",
      features: features.basic,
      popular: false,
      color: "bg-gray-100 dark:bg-gray-800"
    },
    {
      type: "standard",
      title: "Standard Plan",
      monthlyPrice: "₹149",
      yearlyPrice: "₹1,499",
      features: features.standard,
      popular: true,
      color: "bg-gradient-to-br from-white/10 to-white/5"
    },
    {
      type: "premium",
      title: "Premium Pro",
      monthlyPrice: "₹299",
      yearlyPrice: "₹2,999",
      features: features.premium,
      popular: false,
      color: "bg-gradient-to-br from-amber-500/10 to-amber-500/5"
    }
  ];

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
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {plans.map((plan) => (
          <div 
            key={plan.type} 
            className={`${plan.color} backdrop-blur-sm rounded-2xl p-8 border border-white/10 relative overflow-hidden shadow-xl w-full ${plan.popular ? 'transform md:-translate-y-4 scale-105' : ''}`}
          >
            {plan.popular && (
              <div className="absolute top-0 right-0 bg-mathprimary text-white px-3 py-1 rounded-bl-lg rounded-tr-lg text-sm font-medium">
                Most Popular
              </div>
            )}
            
            <div className="absolute -top-12 -right-12 w-40 h-40 bg-mathprimary/20 rounded-full filter blur-xl"></div>
            
            <div className="mb-8 relative z-10">
              <div className="text-mathprimary dark:text-blue-400 font-medium">
                {plan.title.toUpperCase()}
              </div>
              <div className="flex items-end gap-2 mt-2">
                <span className="text-4xl font-bold">
                  {activeTab === 'monthly' ? plan.monthlyPrice : plan.yearlyPrice}
                </span>
                <span className="text-gray-300 mb-1">/ {activeTab === 'monthly' ? 'month' : 'year'}</span>
              </div>
              {activeTab === 'yearly' && (
                <div className="mt-1 inline-flex items-center text-sm bg-green-500/20 text-green-400 px-2 py-1 rounded-full">
                  <Sparkles className="h-3 w-3 mr-1" />
                  <span>Save 20%</span>
                </div>
              )}
            </div>
            
            <div className="space-y-3 mb-8 relative z-10">
              {plan.features.map(feature => (
                <div key={feature} className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-mathprimary dark:text-blue-400 shrink-0" />
                  <span>{feature}</span>
                </div>
              ))}
            </div>
            
            <Button 
              className={`w-full relative z-10 ${plan.popular ? 'bg-white text-mathdark hover:bg-gray-100 dark:hover:bg-gray-200' : 'bg-mathprimary/80 text-white hover:bg-mathprimary'}`}
              size="lg"
              asChild
            >
              <Link to="/premium">Get {plan.title}</Link>
            </Button>
            
            {plan.popular && (
              <div className="mt-4 text-center text-sm text-gray-400">
                30-day money-back guarantee
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default PremiumPricing;
