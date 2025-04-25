
import { CheckCircle, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Card } from "@/components/ui/card";

interface PremiumPricingProps {
  activeTab: 'monthly' | 'yearly';
  setActiveTab: (tab: 'monthly' | 'yearly') => void;
}

const PremiumPricing = ({
  activeTab,
  setActiveTab
}: PremiumPricingProps) => {
  const tiers = [
    {
      name: "Free",
      description: "Perfect for getting started",
      price: { monthly: "₹0", yearly: "₹0" },
      features: [
        "Access to basic papers",
        "Limited practice questions",
        "Basic performance tracking",
        "Community support"
      ]
    },
    {
      name: "Starter",
      description: "Most popular for students",
      price: { monthly: "₹149", yearly: "₹1,499" },
      features: [
        "Access to all papers",
        "Unlimited practice questions",
        "Advanced analytics",
        "Priority email support",
        "Ad-free experience"
      ],
      popular: true
    },
    {
      name: "Pro",
      description: "Best for serious learners",
      price: { monthly: "₹299", yearly: "₹2,999" },
      features: [
        "Everything in Starter",
        "1-on-1 mentoring sessions",
        "Custom study plans",
        "Live doubt solving",
        "Mock test series",
        "24/7 WhatsApp support"
      ]
    }
  ];

  return (
    <div className="w-full space-y-8">
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
            {activeTab === 'yearly' && (
              <span className="ml-2 text-xs bg-green-500/20 text-green-400 px-2 py-0.5 rounded-full">
                Save 20%
              </span>
            )}
          </Button>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-8">
        {tiers.map((tier) => (
          <Card key={tier.name} className={`relative overflow-hidden ${
            tier.popular ? 'border-mathprimary shadow-lg shadow-mathprimary/10' : ''
          }`}>
            {tier.popular && (
              <div className="absolute top-0 right-0 bg-mathprimary text-white px-3 py-1 rounded-bl-lg text-sm font-medium">
                Most Popular
              </div>
            )}
            
            <div className="p-6">
              <h3 className="text-2xl font-bold">{tier.name}</h3>
              <p className="text-muted-foreground mt-1.5">{tier.description}</p>
              
              <div className="mt-5">
                <div className="text-4xl font-bold">
                  {activeTab === 'monthly' ? tier.price.monthly : tier.price.yearly}
                </div>
                <div className="text-muted-foreground">
                  per {activeTab === 'monthly' ? 'month' : 'year'}
                </div>
              </div>
              
              <ul className="mt-6 space-y-4">
                {tier.features.map((feature) => (
                  <li key={feature} className="flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-mathprimary" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
              
              <Button 
                className={`w-full mt-8 ${
                  tier.name === "Free" 
                    ? "bg-gray-100 text-gray-900 hover:bg-gray-200" 
                    : "bg-mathprimary hover:bg-mathprimary/90"
                }`}
                asChild
              >
                <Link to="/premium">
                  {tier.name === "Free" ? "Get Started" : "Upgrade Now"}
                </Link>
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default PremiumPricing;
