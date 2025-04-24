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
  const features = ["Access to 5000+ papers", "All practice exams included", "Unlimited downloads", "Performance analytics dashboard", "Ad-free experience across all devices", "Mobile app access", "24/7 customer support"];
  return <div className="w-full lg:w-1/2">
      <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10 relative overflow-hidden shadow-xl w-full">
        <div className="absolute -top-12 -right-12 w-40 h-40 bg-mathprimary/20 rounded-full filter blur-xl"></div>
        
        <div className="flex justify-between items-start mb-8 relative z-10">
          <div>
            <div className="inline-flex items-center gap-2 bg-gray-800/60 rounded-lg p-1 mb-6">
              <Button variant={activeTab === 'monthly' ? 'default' : 'ghost'} size="sm" onClick={() => setActiveTab('monthly')} className={`${activeTab === 'monthly' ? 'bg-mathprimary text-white' : 'text-gray-300'}`}>
                Monthly
              </Button>
              <Button variant={activeTab === 'yearly' ? 'default' : 'ghost'} size="sm" onClick={() => setActiveTab('yearly')} className={`${activeTab === 'yearly' ? 'bg-mathprimary text-white' : 'text-gray-300'}`}>
                Yearly
              </Button>
            </div>
          
            <div className="text-mathprimary dark:text-blue-400 font-medium">PREMIUM PLAN</div>
            <div className="flex items-end gap-2 mt-2">
              <span className="text-5xl font-bold">
                {activeTab === 'monthly' ? '₹149' : '₹1,499'}
              </span>
              <span className="text-gray-300 mb-1">/ {activeTab === 'monthly' ? 'month' : 'year'}</span>
            </div>
            {activeTab === 'yearly' && <div className="mt-1 inline-flex items-center text-sm bg-green-500/20 text-green-400 px-2 py-1 rounded-full">
                <Sparkles className="h-3 w-3 mr-1" />
                <span>Save 20%</span>
              </div>}
          </div>
          <div className="bg-mathprimary text-white px-3 py-1 rounded-full text-sm font-medium">
            Most Popular
          </div>
        </div>
        
        <div className="space-y-3 mb-8 relative z-10">
          {features.map(feature => <div key={feature} className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-mathprimary dark:text-blue-400" />
              <span>{feature}</span>
            </div>)}
        </div>
        
        <Button className="w-full bg-white text-mathdark hover:bg-gray-100 dark:hover:bg-gray-200 relative z-10" size="lg" asChild>
          <Link to="/premium">Get Premium</Link>
        </Button>
        
        <div className="mt-4 text-center text-sm text-gray-400">
          30-day money-back guarantee
        </div>
      </div>
    </div>;
};
export default PremiumPricing;