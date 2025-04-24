
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Award, CheckCircle, Sparkles } from "lucide-react";
import { useState } from "react";
import PremiumFeatures from "@/components/PremiumFeatures";
import PremiumPricing from "@/components/PremiumPricing";

const PremiumSection = () => {
  const [activeTab, setActiveTab] = useState<'monthly' | 'yearly'>('monthly');

  return (
    <section className="py-24 bg-gradient-to-b from-mathdark/95 to-black dark:from-gray-900 dark:to-black text-white relative overflow-hidden">
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
          <h2 className="text-4xl md:text-5xl font-bold mb-4">Choose Your Plan</h2>
          <p className="text-gray-300 max-w-xl mx-auto">
            From free to premium, we have plans designed to help every student excel in mathematics with the right tools.
          </p>
        </div>
        
        <PremiumPricing activeTab={activeTab} setActiveTab={setActiveTab} />

        <div className="mt-12 text-center">
          <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10" asChild>
            <Link to="/premium">View All Plan Details</Link>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default PremiumSection;
