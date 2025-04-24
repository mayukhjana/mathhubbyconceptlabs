
import { useAuth } from "@/contexts/AuthContext";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PremiumHeader from "@/components/premium/PremiumHeader";
import PremiumStatus from "@/components/premium/PremiumStatus";
import PricingCard from "@/components/premium/PricingCard";
import PremiumFAQ from "@/components/premium/PremiumFAQ";
import { useSubscription } from "@/hooks/useSubscription";

const PremiumPage = () => {
  const { isPremium, premiumExpiresAt, refreshPremiumStatus } = useAuth();
  const { isLoading, handleSubscribe } = useSubscription();
  
  const formattedExpiryDate = premiumExpiresAt 
    ? new Date(premiumExpiresAt).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric"
      })
    : null;
    
  const features = [
    "Access to all premium papers",
    "Practice unlimited questions",
    "Download papers as PDFs",
    "Performance analytics",
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
        
        <div className="container mx-auto px-4 py-8 md:py-16">
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <PricingCard
              type="monthly"
              price="₹149"
              isLoading={isLoading.monthly}
              isPremium={isPremium}
              onSubscribe={() => handleSubscribe("monthly")}
              features={features}
            />
            
            <PricingCard
              type="annual"
              price="₹1,499"
              isLoading={isLoading.annual}
              isPremium={isPremium}
              onSubscribe={() => handleSubscribe("annual")}
              features={features}
              isBestValue
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
