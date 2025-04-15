
import { CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

interface PremiumPricingProps {
  activeTab: 'monthly' | 'yearly';
  setActiveTab: (tab: 'monthly' | 'yearly') => void;
}

const PremiumPricing = ({ activeTab, setActiveTab }: PremiumPricingProps) => {
  const features = [
    "Access to 5000+ papers",
    "All practice exams included",
    "Unlimited downloads",
    "Performance analytics",
    "Ad-free experience",
    "Mobile app access"
  ];

  return (
    <div className="w-full lg:w-1/2">
      <div className="bg-white/10 backdrop-blur-sm rounded-xl p-8 border border-white/20">
        <div className="flex justify-between items-start mb-6">
          <div>
            <div className="flex gap-4 mb-6">
              <Button
                variant={activeTab === 'monthly' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setActiveTab('monthly')}
                className="border-white/20 text-zinc-900"
              >
                Monthly
              </Button>
              <Button
                variant={activeTab === 'yearly' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setActiveTab('yearly')}
                className="border-white/20 text-zinc-900"
              >
                Yearly <span className="ml-1 text-xs bg-green-500 px-1.5 py-0.5 rounded-full">Save 20%</span>
              </Button>
            </div>
          
            <div className="text-mathprimary dark:text-blue-400 font-bold">PREMIUM</div>
            <div className="text-3xl font-bold mt-1">
              {activeTab === 'monthly' ? '₹149' : '₹1,499'}
            </div>
            <div className="text-gray-300 text-sm">per {activeTab === 'monthly' ? 'month' : 'year'}</div>
          </div>
          <div className="bg-mathprimary dark:bg-blue-600 text-white px-3 py-1 rounded-full text-sm font-medium">
            Most Popular
          </div>
        </div>
        
        <div className="space-y-3 mb-6">
          {features.map((feature) => (
            <div key={feature} className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-mathprimary dark:text-blue-400" />
              <span>{feature}</span>
            </div>
          ))}
        </div>
        
        <Button className="w-full bg-white text-mathdark hover:bg-gray-100 dark:hover:bg-gray-200" size="lg" asChild>
          <Link to="/premium">Get Premium</Link>
        </Button>
        
        <div className="mt-4 text-center text-sm text-gray-400">
          30-day money-back guarantee
        </div>
      </div>
    </div>
  );
};

export default PremiumPricing;
