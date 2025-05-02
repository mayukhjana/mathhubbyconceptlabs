
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Award, CheckCircle, Sparkles } from "lucide-react";
import { useState } from "react";
import PremiumFeatures from "@/components/PremiumFeatures";
import PremiumPricing from "@/components/PremiumPricing";

const PremiumSection = () => {
  const [activeTab, setActiveTab] = useState<'monthly' | 'yearly'>('monthly');
  
  return <section className="py-24 bg-gradient-to-b from-mathdark/95 to-black dark:from-gray-900 dark:to-black text-white relative overflow-hidden">
      {/* Background elements */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-20 right-10 w-96 h-96 bg-mathprimary opacity-15 rounded-full filter blur-[100px]"></div>
        <div className="absolute bottom-10 left-20 w-[500px] h-[500px] bg-mathsecondary opacity-10 rounded-full filter blur-[100px]"></div>
        <div className="absolute top-60 left-1/2 w-32 h-32 bg-white opacity-5 rounded-full filter blur-xl transform -translate-x-1/2"></div>
      </div>
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-16">
          <div className="inline-flex items-center px-3 py-1 rounded-full bg-white/10 text-white text-sm mb-4 backdrop-blur-sm">
            <Sparkles className="w-4 h-4 mr-2" />
            <span>Unlock Your Full Potential</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold mb-4">Upgrade to Premium</h2>
          <p className="text-gray-300 max-w-xl mx-auto">
            Advanced features designed to help you excel in mathematics with personalized learning tools.
          </p>
        </div>
        
        <div className="flex flex-col lg:flex-row items-stretch gap-12">
          <div className="w-full lg:w-1/3">
            <PremiumFeatures />
          </div>
          
          <div className="w-full lg:w-2/3">
            <PremiumPricing activeTab={activeTab} setActiveTab={setActiveTab} />
          </div>
        </div>
        
        <div className="mt-16 text-center">
          <Button variant="outline" size="lg" className="border-white hover:bg-white/10" asChild>
            <Link to="/premium">See All Premium Features</Link>
          </Button>
        </div>
      </div>
    </section>;
};

export default PremiumSection;
