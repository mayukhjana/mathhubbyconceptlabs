
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { Shield, CheckCircle, Clock, Crown } from "lucide-react";
import { toast } from "sonner";

const PremiumPage = () => {
  const { isAuthenticated, isPremium, premiumExpiresAt, refreshPremiumStatus } = useAuth();
  const [isLoading, setIsLoading] = useState<{[key: string]: boolean}>({ 
    monthly: false, 
    annual: false 
  });
  const navigate = useNavigate();
  
  // Format expiry date if available
  const formattedExpiryDate = premiumExpiresAt 
    ? new Date(premiumExpiresAt).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric"
      })
    : null;
  
  const handleSubscribe = async (subscriptionType: "monthly" | "annual") => {
    if (!isAuthenticated) {
      toast.error("Please sign in to subscribe");
      navigate("/auth");
      return;
    }
    
    try {
      setIsLoading({...isLoading, [subscriptionType]: true});
      
      const { data, error } = await supabase.functions.invoke("create-checkout", {
        body: { subscriptionType }
      });
      
      if (error) {
        throw new Error(error.message);
      }
      
      // Redirect to Stripe checkout
      if (data?.url) {
        window.location.href = data.url;
      } else {
        throw new Error("No checkout URL returned");
      }
    } catch (error) {
      console.error("Subscription error:", error);
      toast.error("Error creating subscription. Please try again.");
    } finally {
      setIsLoading({...isLoading, [subscriptionType]: false});
    }
  };
  
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow">
        {/* Hero section */}
        <div className="bg-gradient-to-b from-mathprimary/10 to-transparent">
          <div className="container mx-auto px-4 py-16 text-center">
            <div className="flex justify-center mb-4">
              <Crown className="h-16 w-16 text-yellow-500" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Upgrade to Premium
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Get unlimited access to all premium question papers, personalized learning paths, 
              and advanced tools to ace your exams.
            </p>
          </div>
        </div>
        
        {/* Premium status section */}
        {isPremium && (
          <div className="container mx-auto px-4 py-8">
            <div className="bg-green-50 border border-green-200 rounded-lg p-6 mb-12 flex flex-col md:flex-row items-center justify-between">
              <div className="flex items-center mb-4 md:mb-0">
                <CheckCircle className="h-8 w-8 text-green-500 mr-4" />
                <div>
                  <h2 className="text-xl font-bold text-green-700">You're on Premium!</h2>
                  {formattedExpiryDate ? (
                    <p className="text-green-600">Your subscription is active until {formattedExpiryDate}</p>
                  ) : (
                    <p className="text-green-600">You have lifetime access to premium features</p>
                  )}
                </div>
              </div>
              <Button
                variant="outline" 
                className="border-green-500 text-green-700 hover:bg-green-50"
                onClick={() => refreshPremiumStatus()}
              >
                Refresh Status
              </Button>
            </div>
          </div>
        )}
        
        {/* Pricing plans */}
        <div className="container mx-auto px-4 py-8 md:py-16">
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {/* Monthly plan */}
            <div className="border rounded-xl shadow-sm hover:shadow-md transition-shadow p-6 flex flex-col">
              <div className="mb-4">
                <Badge variant="outline" className="text-mathprimary border-mathprimary mb-2">
                  Monthly
                </Badge>
                <h3 className="text-2xl font-bold">Premium Monthly</h3>
                <div className="mt-4 mb-2">
                  <span className="text-3xl font-bold">₹149</span>
                  <span className="text-muted-foreground">/month</span>
                </div>
                <p className="text-muted-foreground">Cancel anytime</p>
              </div>
              
              <div className="flex-grow">
                <ul className="space-y-3 mb-6">
                  <li className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                    <span>Access to all premium papers</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                    <span>Practice unlimited questions</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                    <span>Download papers as PDFs</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                    <span>Performance analytics</span>
                  </li>
                </ul>
              </div>
              
              <Button 
                className="w-full"
                onClick={() => handleSubscribe("monthly")}
                disabled={isLoading.monthly || isPremium}
              >
                {isLoading.monthly ? (
                  <span className="flex items-center"><Clock className="mr-2 h-4 w-4 animate-spin" /> Processing...</span>
                ) : isPremium ? (
                  "Already Subscribed"
                ) : (
                  "Subscribe Monthly"
                )}
              </Button>
            </div>
            
            {/* Annual plan */}
            <div className="border rounded-xl shadow-sm hover:shadow-md transition-shadow p-6 relative flex flex-col">
              <div className="absolute top-0 right-0 bg-yellow-500 text-white px-3 py-1 rounded-bl-lg rounded-tr-lg text-sm font-medium">
                Best Value
              </div>
              
              <div className="mb-4">
                <Badge variant="outline" className="text-mathprimary border-mathprimary mb-2">
                  Annual
                </Badge>
                <h3 className="text-2xl font-bold">Premium Annual</h3>
                <div className="mt-4 mb-2">
                  <span className="text-3xl font-bold">₹1,499</span>
                  <span className="text-muted-foreground">/year</span>
                </div>
                <p className="text-green-600 font-medium">Save 16% compared to monthly</p>
              </div>
              
              <div className="flex-grow">
                <ul className="space-y-3 mb-6">
                  <li className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                    <span>Access to all premium papers</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                    <span>Practice unlimited questions</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                    <span>Download papers as PDFs</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                    <span>Performance analytics</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                    <span>Priority support</span>
                  </li>
                </ul>
              </div>
              
              <Button 
                className="w-full bg-yellow-500 hover:bg-yellow-600"
                onClick={() => handleSubscribe("annual")}
                disabled={isLoading.annual || isPremium}
              >
                {isLoading.annual ? (
                  <span className="flex items-center"><Clock className="mr-2 h-4 w-4 animate-spin" /> Processing...</span>
                ) : isPremium ? (
                  "Already Subscribed"
                ) : (
                  "Subscribe Annual"
                )}
              </Button>
            </div>
          </div>
        </div>
        
        {/* FAQ Section */}
        <div className="container mx-auto px-4 py-16">
          <h2 className="text-3xl font-bold text-center mb-12">Frequently Asked Questions</h2>
          
          <div className="max-w-4xl mx-auto space-y-6">
            <div className="border-b pb-4">
              <h3 className="text-xl font-semibold mb-2">How does the premium subscription work?</h3>
              <p className="text-muted-foreground">Our premium subscription gives you unlimited access to all our premium content. You can choose either a monthly or annual plan, and cancel anytime.</p>
            </div>
            
            <div className="border-b pb-4">
              <h3 className="text-xl font-semibold mb-2">Can I cancel my subscription?</h3>
              <p className="text-muted-foreground">Yes, you can cancel your subscription at any time. You'll still have access to premium content until the end of your billing period.</p>
            </div>
            
            <div className="border-b pb-4">
              <h3 className="text-xl font-semibold mb-2">How do I access premium content?</h3>
              <p className="text-muted-foreground">Once subscribed, all premium content will be automatically unlocked throughout the website. You'll see the premium badge disappear from locked items.</p>
            </div>
            
            <div className="border-b pb-4">
              <h3 className="text-xl font-semibold mb-2">Is there a student discount?</h3>
              <p className="text-muted-foreground">We offer special discounts for educational institutions. Please contact us for more information.</p>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default PremiumPage;
