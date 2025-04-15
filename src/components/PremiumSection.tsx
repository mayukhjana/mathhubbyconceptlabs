
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Award, CheckCircle } from "lucide-react";
import { useState } from "react";
import PremiumFeatures from "@/components/PremiumFeatures";
import PremiumPricing from "@/components/PremiumPricing";

const PremiumSection = () => {
  const [activeTab, setActiveTab] = useState<'monthly' | 'yearly'>('monthly');

  return (
    <section className="py-20 bg-gradient-to-b from-mathdark to-black dark:from-gray-900 dark:to-black text-white relative overflow-hidden">
      {/* Background elements */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-20 right-10 w-72 h-72 bg-mathprimary opacity-10 rounded-full filter blur-3xl"></div>
        <div className="absolute bottom-10 left-20 w-80 h-80 bg-mathsecondary opacity-10 rounded-full filter blur-3xl"></div>
      </div>
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="flex flex-col lg:flex-row items-center gap-12">
          <PremiumFeatures />
          <PremiumPricing activeTab={activeTab} setActiveTab={setActiveTab} />
        </div>
      </div>
    </section>
  );
};

export default PremiumSection;
