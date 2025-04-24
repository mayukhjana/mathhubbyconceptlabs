
import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PremiumHeader from "@/components/premium/PremiumHeader";
import PremiumStatus from "@/components/premium/PremiumStatus";
import PricingCard from "@/components/premium/PricingCard";
import PremiumFAQ from "@/components/premium/PremiumFAQ";
import { useSubscription } from "@/hooks/useSubscription";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const PremiumPage = () => {
  const { isPremium, premiumExpiresAt, refreshPremiumStatus } = useAuth();
  const { isLoading, handleSubscribe } = useSubscription();
  const [activeTab, setActiveTab] = useState<'monthly' | 'annual'>('monthly');
  
  const formattedExpiryDate = premiumExpiresAt 
    ? new Date(premiumExpiresAt).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric"
      })
    : null;
    
  const planFeatures = {
    free: [
      "Access to 100+ papers",
      "Basic practice exams",
      "Limited downloads",
      "Basic analytics",
      "Ad-supported experience"
    ],
    starter: [
      "Access to 1000+ papers",
      "Standard practice exams",
      "50 downloads per month",
      "Standard analytics",
      "Ad-free experience",
      "Email support"
    ],
    pro: [
      "Access to 5000+ papers",
      "Advanced practice exams",
      "Unlimited downloads",
      "Advanced analytics dashboard",
      "Ad-free experience",
      "Priority support"
    ],
    plus: [
      "All Pro features",
      "One-on-one tutoring sessions",
      "Personalized learning path",
      "AI-powered assistance",
      "Premium study materials",
      "24/7 dedicated support"
    ]
  };

  const handleTabChange = (tab: 'monthly' | 'annual') => {
    setActiveTab(tab);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow">
        <PremiumHeader />
        
        {isPremium && (
          <PremiumStatus 
            formattedExpiryDate={formattedExpiryDate}
            onRefresh={refreshPremiumStatus}
          />
        )}
        
        <div className="container mx-auto px-4 py-8 md:py-16">
          <div className="flex justify-center mb-8">
            <div className="inline-flex items-center gap-2 bg-background rounded-lg border p-1">
              <Button 
                variant={activeTab === 'monthly' ? 'default' : 'outline'} 
                onClick={() => handleTabChange('monthly')}
              >
                Monthly
              </Button>
              <Button 
                variant={activeTab === 'annual' ? 'default' : 'outline'} 
                onClick={() => handleTabChange('annual')}
              >
                Annual
              </Button>
            </div>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
            <PricingCard
              type="free"
              monthlyPrice="Free"
              yearlyPrice="Free"
              isActive={activeTab}
              isLoading={false}
              isPremium={false}
              onSubscribe={() => {}}
              features={planFeatures.free}
            />
            
            <PricingCard
              type="starter"
              monthlyPrice="₹99"
              yearlyPrice="₹950"
              isActive={activeTab}
              isLoading={isLoading.starter}
              isPremium={isPremium}
              onSubscribe={() => handleSubscribe("starter")}
              features={planFeatures.starter}
              originalMonthlyPrice="₹124"
              originalYearlyPrice="₹1,188"
            />
            
            <PricingCard
              type="pro"
              monthlyPrice="₹199"
              yearlyPrice="₹1,910"
              isActive={activeTab}
              isLoading={isLoading.pro}
              isPremium={isPremium}
              onSubscribe={() => handleSubscribe("pro")}
              features={planFeatures.pro}
              isBestValue
              originalMonthlyPrice="₹249"
              originalYearlyPrice="₹2,388"
            />
            
            <PricingCard
              type="plus"
              monthlyPrice="₹299"
              yearlyPrice="₹2,870"
              isActive={activeTab}
              isLoading={isLoading.plus}
              isPremium={isPremium}
              onSubscribe={() => handleSubscribe("plus")}
              features={planFeatures.plus}
              originalMonthlyPrice="₹374"
              originalYearlyPrice="₹3,588"
            />
          </div>
        </div>
        
        <PremiumFAQ />
      </main>
      
      <Footer />
    </div>
  );
};

export default PremiumPage;
