
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Award, CheckCircle, Sparkles } from "lucide-react";
import { useState } from "react";
import PremiumFeatures from "@/components/PremiumFeatures";
import PremiumPricing from "@/components/PremiumPricing";

const PremiumSection = () => {
  const [activeTab, setActiveTab] = useState<'monthly' | 'yearly'>('monthly');
  
  return (
    <section className="py-20 relative overflow-hidden bg-gradient-to-b from-gray-900 via-blue-900 to-indigo-900 text-white">
      {/* Background elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] rounded-full bg-mathsecondary/20 blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] rounded-full bg-mathprimary/20 blur-3xl"></div>
        <div className="absolute top-1/4 left-1/4 w-[300px] h-[300px] rounded-full bg-purple-500/10 blur-3xl"></div>
        <div className="hidden md:block absolute -right-20 top-1/3 opacity-10 select-none">
          <div className="text-[200px] font-bold">+</div>
        </div>
        <div className="hidden md:block absolute -left-20 bottom-1/3 opacity-10 select-none">
          <div className="text-[200px] font-bold">×</div>
        </div>
        <div className="absolute inset-0 bg-grid-white/[0.03]"></div>
      </div>
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center bg-white/10 rounded-full p-2 mb-4 backdrop-blur-sm">
            <Award className="h-6 w-6 text-yellow-400" />
          </div>
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Upgrade to <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-amber-300">Premium</span>
          </h2>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Unlock your full potential with our premium plans and take your math skills to the next level
          </p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 lg:gap-12 items-start">
          <div className="lg:col-span-2">
            <PremiumFeatures />
          </div>
          
          <div className="lg:col-span-3">
            <PremiumPricing activeTab={activeTab} setActiveTab={setActiveTab} />
          </div>
        </div>
        
        <div className="text-center mt-16">
          <Button asChild size="lg" variant="outline" className="bg-white/10 hover:bg-white/20 backdrop-blur-sm border-white/20 text-white font-medium px-8">
            <Link to="/premium">View All Premium Plans</Link>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default PremiumSection;
