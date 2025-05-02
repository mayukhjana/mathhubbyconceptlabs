
import { useAuth } from "@/contexts/AuthContext";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PremiumHeader from "@/components/premium/PremiumHeader";
import PremiumStatus from "@/components/premium/PremiumStatus";
import PricingCard from "@/components/premium/PricingCard";
import PremiumFAQ from "@/components/premium/PremiumFAQ";
import { useSubscription } from "@/hooks/useSubscription";
import { useState } from "react";
import { Button } from "@/components/ui/button";

const PremiumPage = () => {
  const { isPremium, premiumExpiresAt, refreshPremiumStatus } = useAuth();
  const { isLoading, handleSubscribe } = useSubscription();
  const [activeTab, setActiveTab] = useState<'monthly' | 'yearly'>('monthly');
  
  const formattedExpiryDate = premiumExpiresAt 
    ? new Date(premiumExpiresAt).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric"
      })
    : null;
    
  const basicFeatures = [
    "Access to 1000+ basic papers",
    "Limited practice exams",
    "Basic performance tracking",
    "Mobile app access",
    "Email support"
  ];
    
  const standardFeatures = [
    "Access to 5000+ papers",
    "All practice exams included",
    "Unlimited downloads",
    "Performance analytics dashboard",
    "Ad-free experience across all devices"
  ];
  
  const premiumFeatures = [
    "Everything in Standard plan",
    "1-on-1 tutoring sessions (2/month)",
    "Personalized study plans",
    "Advanced AI-powered feedback",
    "Priority support"
  ];

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
        
        <div className="container mx-auto px-4 py-8 md:py-16 max-w-6xl">
          <div className="flex justify-center mb-8">
            <div className="bg-gray-100 dark:bg-gray-800 rounded-lg inline-flex p-1">
              <Button 
                variant={activeTab === 'monthly' ? 'default' : 'outline'} 
                size="sm" 
                onClick={() => setActiveTab('monthly')}
                className="rounded-md"
              >
                Monthly
              </Button>
              <Button 
                variant={activeTab === 'yearly' ? 'default' : 'outline'} 
                size="sm" 
                onClick={() => setActiveTab('yearly')}
                className="rounded-md"
              >
                Yearly (Save 20%)
              </Button>
            </div>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <PricingCard
              type="basic"
              price={activeTab === 'monthly' ? "₹99" : "₹999"}
              period={activeTab === 'monthly' ? "month" : "year"}
              isLoading={isLoading.monthly}
              isPremium={isPremium}
              onSubscribe={() => handleSubscribe(activeTab === 'monthly' ? "monthly" : "annual")}
              features={basicFeatures}
              title="Basic Plan"
            />
            
            <PricingCard
              type="standard"
              price={activeTab === 'monthly' ? "₹149" : "₹1,499"}
              period={activeTab === 'monthly' ? "month" : "year"}
              isLoading={isLoading.monthly}
              isPremium={isPremium}
              onSubscribe={() => handleSubscribe(activeTab === 'monthly' ? "monthly" : "annual")}
              features={standardFeatures}
              isBestValue
              title="Standard Plan"
            />
            
            <PricingCard
              type="premium"
              price={activeTab === 'monthly' ? "₹299" : "₹2,999"}
              period={activeTab === 'monthly' ? "month" : "year"}
              isLoading={isLoading.annual}
              isPremium={isPremium}
              onSubscribe={() => handleSubscribe(activeTab === 'monthly' ? "monthly" : "annual")}
              features={premiumFeatures}
              title="Premium Pro"
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
