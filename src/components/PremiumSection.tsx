
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Award, CheckCircle, Sparkles } from "lucide-react";
import { useState } from "react";
import PremiumPricing from "@/components/PremiumPricing";

const PremiumSection = () => {
  const [activeTab, setActiveTab] = useState<'monthly' | 'yearly'>('monthly');
  
  return (
    <section className="py-20 relative overflow-hidden bg-gradient-to-b from-slate-900 via-blue-950 to-indigo-950 text-white dark:from-slate-950 dark:via-blue-900 dark:to-indigo-900">
      {/* Background elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] rounded-full bg-blue-500/20 blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] rounded-full bg-indigo-500/20 blur-3xl"></div>
        <div className="absolute top-1/4 left-1/4 w-[300px] h-[300px] rounded-full bg-purple-500/15 blur-3xl"></div>
        <div className="hidden md:block absolute -right-20 top-1/3 opacity-10 select-none text-white">
          <div className="text-[200px] font-bold">+</div>
        </div>
        <div className="hidden md:block absolute -left-20 bottom-1/3 opacity-10 select-none text-white">
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
          
          <div className="mt-8 max-w-3xl mx-auto">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 text-center hover:bg-white/20 transition">
                <div className="w-12 h-12 bg-blue-500/20 rounded-full flex items-center justify-center mx-auto mb-3">
                  <CheckCircle className="h-6 w-6 text-blue-400" />
                </div>
                <h3 className="font-medium mb-1">5,000+ Papers</h3>
                <p className="text-sm text-gray-300">Access our full collection of study materials</p>
              </div>
              
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 text-center hover:bg-white/20 transition">
                <div className="w-12 h-12 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-3">
                  <CheckCircle className="h-6 w-6 text-green-400" />
                </div>
                <h3 className="font-medium mb-1">Detailed Analytics</h3>
                <p className="text-sm text-gray-300">Track your progress and identify weak areas</p>
              </div>
              
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 text-center hover:bg-white/20 transition">
                <div className="w-12 h-12 bg-purple-500/20 rounded-full flex items-center justify-center mx-auto mb-3">
                  <CheckCircle className="h-6 w-6 text-purple-400" />
                </div>
                <h3 className="font-medium mb-1">AI Assistance</h3>
                <p className="text-sm text-gray-300">Get instant help with complex problems</p>
              </div>
            </div>
          </div>
        </div>
        
        <div className="max-w-5xl mx-auto">
          <PremiumPricing activeTab={activeTab} setActiveTab={setActiveTab} />
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
