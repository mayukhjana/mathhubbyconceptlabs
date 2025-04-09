
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { Shield, CheckCircle, Clock, Crown, Star, Users, FileText } from "lucide-react";
import { toast } from "sonner";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

const PremiumPage = () => {
  const { isAuthenticated, isPremium, premiumExpiresAt, refreshPremiumStatus } = useAuth();
  const [isLoading, setIsLoading] = useState<{[key: string]: boolean}>({ 
    monthly: false, 
    annual: false 
  });
  const [billingCycle, setBillingCycle] = useState<"monthly" | "annual">("annual");
  const navigate = useNavigate();
  
  // Format expiry date if available
  const formattedExpiryDate = premiumExpiresAt 
    ? new Date(premiumExpiresAt).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric"
      })
    : null;

  // Subscription options with pricing
  const subscriptionOptions = {
    monthly: {
      price: "₹299",
      period: "/month",
      savingsText: null,
      description: "Flexible monthly billing"
    },
    annual: {
      price: "₹2,499",
      period: "/year",
      savingsText: "Save ₹1,089 compared to monthly",
      description: "Best value for serious students"
    }
  };
  
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
    } catch (error: any) {
      console.error("Subscription error:", error);
      toast.error("Error creating subscription. Please try again.");
    } finally {
      setIsLoading({...isLoading, [subscriptionType]: false});
    }
  };
  
  return (
    <div className="min-h-screen flex flex-col dark:bg-gray-900">
      <Navbar />
      
      <main className="flex-grow">
        {/* Hero section */}
        <div className="bg-gradient-to-b from-mathprimary/10 to-transparent dark:from-mathprimary/5">
          <div className="container mx-auto px-4 py-16 text-center">
            <div className="flex justify-center mb-4">
              <Crown className="h-16 w-16 text-yellow-500" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-6 dark:text-white">
              Upgrade to Premium
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto dark:text-gray-400">
              Get unlimited access to all premium question papers, personalized learning paths, 
              and advanced tools to ace your exams.
            </p>
          </div>
        </div>
        
        {/* Premium status section */}
        {isPremium && (
          <div className="container mx-auto px-4 py-8">
            <div className="bg-green-50 border border-green-200 rounded-lg p-6 mb-12 flex flex-col md:flex-row items-center justify-between dark:bg-green-900/20 dark:border-green-700">
              <div className="flex items-center mb-4 md:mb-0">
                <CheckCircle className="h-8 w-8 text-green-500 mr-4" />
                <div>
                  <h2 className="text-xl font-bold text-green-700 dark:text-green-400">You're on Premium!</h2>
                  {formattedExpiryDate ? (
                    <p className="text-green-600 dark:text-green-500">Your subscription is active until {formattedExpiryDate}</p>
                  ) : (
                    <p className="text-green-600 dark:text-green-500">You have lifetime access to premium features</p>
                  )}
                </div>
              </div>
              <Button
                variant="outline" 
                className="border-green-500 text-green-700 hover:bg-green-50 dark:border-green-700 dark:text-green-400 dark:hover:bg-green-900/20"
                onClick={() => refreshPremiumStatus()}
              >
                Refresh Status
              </Button>
            </div>
          </div>
        )}
        
        {/* Pricing toggle */}
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col items-center justify-center mb-12">
            <div className="flex items-center space-x-4">
              <span className={`text-lg ${billingCycle === 'monthly' ? 'font-semibold text-mathprimary' : 'text-muted-foreground'}`}>
                Monthly
              </span>
              <div className="flex items-center space-x-2">
                <Switch
                  id="billing-toggle"
                  checked={billingCycle === "annual"}
                  onCheckedChange={(checked) => setBillingCycle(checked ? "annual" : "monthly")}
                />
              </div>
              <span className={`text-lg ${billingCycle === 'annual' ? 'font-semibold text-mathprimary' : 'text-muted-foreground'}`}>
                Annual
              </span>
            </div>
            {billingCycle === "annual" && (
              <div className="mt-3 bg-green-100 text-green-800 text-sm px-3 py-1 rounded-full dark:bg-green-900/50 dark:text-green-400">
                Save 30% with annual billing
              </div>
            )}
          </div>
        </div>
        
        {/* Pricing plans */}
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto">
            <div className={`border rounded-xl shadow-lg hover:shadow-xl transition-shadow p-8 relative overflow-hidden ${billingCycle === "annual" ? "bg-white dark:bg-gray-800" : "bg-white/60 dark:bg-gray-800/60"}`}>
              {billingCycle === "annual" && (
                <div className="absolute -top-1 -right-12 rotate-45 bg-yellow-500 text-white px-12 py-2 text-sm font-medium shadow-md">
                  Best Value
                </div>
              )}
              
              <div className="flex flex-col md:flex-row justify-between">
                <div className="md:w-7/12">
                  <h3 className="text-2xl font-bold mb-2 dark:text-white">MathHub Premium</h3>
                  <p className="text-muted-foreground mb-6 dark:text-gray-400">Complete access to all premium content</p>
                  
                  <div className="space-y-4 mb-8">
                    <div className="flex items-start">
                      <CheckCircle className="h-5 w-5 text-green-500 mt-1 mr-3" />
                      <div>
                        <h4 className="font-medium dark:text-white">3,000+ premium exam papers</h4>
                        <p className="text-sm text-muted-foreground dark:text-gray-400">From ICSE, CBSE, and West Bengal boards</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start">
                      <CheckCircle className="h-5 w-5 text-green-500 mt-1 mr-3" />
                      <div>
                        <h4 className="font-medium dark:text-white">Unlimited MCQ practice tests</h4>
                        <p className="text-sm text-muted-foreground dark:text-gray-400">Chapter-specific and full-length exams</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start">
                      <CheckCircle className="h-5 w-5 text-green-500 mt-1 mr-3" />
                      <div>
                        <h4 className="font-medium dark:text-white">Personalized performance analytics</h4>
                        <p className="text-sm text-muted-foreground dark:text-gray-400">Track your progress and identify weak areas</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start">
                      <CheckCircle className="h-5 w-5 text-green-500 mt-1 mr-3" />
                      <div>
                        <h4 className="font-medium dark:text-white">Ad-free experience</h4>
                        <p className="text-sm text-muted-foreground dark:text-gray-400">Enjoy uninterrupted learning</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start">
                      <CheckCircle className="h-5 w-5 text-green-500 mt-1 mr-3" />
                      <div>
                        <h4 className="font-medium dark:text-white">Priority support</h4>
                        <p className="text-sm text-muted-foreground dark:text-gray-400">Get help when you need it</p>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="md:w-4/12 bg-mathlight p-6 rounded-lg self-start dark:bg-gray-700">
                  <div className="text-center mb-4">
                    <div className="text-sm font-medium text-mathprimary mb-1">{subscriptionOptions[billingCycle].description}</div>
                    <div className="flex items-center justify-center">
                      <span className="text-4xl font-bold dark:text-white">{subscriptionOptions[billingCycle].price}</span>
                      <span className="text-muted-foreground ml-1 dark:text-gray-400">{subscriptionOptions[billingCycle].period}</span>
                    </div>
                    {subscriptionOptions[billingCycle].savingsText && (
                      <div className="text-green-600 text-sm mt-1 dark:text-green-400">{subscriptionOptions[billingCycle].savingsText}</div>
                    )}
                  </div>
                  
                  <Button 
                    className="w-full bg-mathprimary hover:bg-mathsecondary"
                    onClick={() => handleSubscribe(billingCycle)}
                    disabled={isLoading[billingCycle] || isPremium}
                  >
                    {isLoading[billingCycle] ? (
                      <span className="flex items-center justify-center">
                        <Clock className="animate-spin mr-2 h-4 w-4" /> Processing...
                      </span>
                    ) : isPremium ? (
                      "Already Subscribed"
                    ) : (
                      `Subscribe ${billingCycle === "annual" ? "Yearly" : "Monthly"}`
                    )}
                  </Button>
                  
                  <div className="text-xs text-center mt-4 text-muted-foreground dark:text-gray-400">
                    Secure payment via Stripe
                    <br />
                    30-day money-back guarantee
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Features section */}
        <div className="container mx-auto px-4 py-16">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4 dark:text-white">What You Get With Premium</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto dark:text-gray-400">
              Everything you need to excel in your mathematics exams in one subscription
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm">
              <div className="bg-mathlight dark:bg-gray-700 rounded-full p-3 inline-block mb-4">
                <FileText className="h-6 w-6 text-mathprimary" />
              </div>
              <h3 className="text-xl font-bold mb-3 dark:text-white">Complete Paper Access</h3>
              <p className="text-muted-foreground dark:text-gray-400">
                Access our complete library of previous year papers from all major boards, 
                organized by chapter and with detailed solutions.
              </p>
            </div>
            
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm">
              <div className="bg-mathlight dark:bg-gray-700 rounded-full p-3 inline-block mb-4">
                <Star className="h-6 w-6 text-mathprimary" />
              </div>
              <h3 className="text-xl font-bold mb-3 dark:text-white">Personalized Analytics</h3>
              <p className="text-muted-foreground dark:text-gray-400">
                Track your performance over time with detailed analytics. Identify strengths 
                and weaknesses to focus your study time effectively.
              </p>
            </div>
            
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm">
              <div className="bg-mathlight dark:bg-gray-700 rounded-full p-3 inline-block mb-4">
                <Users className="h-6 w-6 text-mathprimary" />
              </div>
              <h3 className="text-xl font-bold mb-3 dark:text-white">Expert Support</h3>
              <p className="text-muted-foreground dark:text-gray-400">
                Get priority access to our expert support team who can help clarify concepts
                and explain solutions to difficult problems.
              </p>
            </div>
          </div>
        </div>
        
        {/* FAQ Section */}
        <div className="container mx-auto px-4 py-16">
          <h2 className="text-3xl font-bold text-center mb-12 dark:text-white">Frequently Asked Questions</h2>
          
          <div className="max-w-4xl mx-auto space-y-6">
            <div className="border-b pb-4 dark:border-gray-700">
              <h3 className="text-xl font-semibold mb-2 dark:text-white">How does the premium subscription work?</h3>
              <p className="text-muted-foreground dark:text-gray-400">
                Our premium subscription gives you unlimited access to all premium content. Once you subscribe,
                you'll immediately have access to all premium papers and features. You can choose either a 
                monthly subscription at ₹299/month or save with our annual plan at ₹2,499/year.
              </p>
            </div>
            
            <div className="border-b pb-4 dark:border-gray-700">
              <h3 className="text-xl font-semibold mb-2 dark:text-white">Can I cancel my subscription?</h3>
              <p className="text-muted-foreground dark:text-gray-400">
                Yes, you can cancel your subscription at any time from your account settings. 
                You'll still have access to premium content until the end of your billing period.
              </p>
            </div>
            
            <div className="border-b pb-4 dark:border-gray-700">
              <h3 className="text-xl font-semibold mb-2 dark:text-white">How do I access premium content?</h3>
              <p className="text-muted-foreground dark:text-gray-400">
                Once subscribed, all premium content will be automatically unlocked throughout the website. 
                Premium papers and practice exams will be immediately available, and you'll see your premium 
                status in your profile.
              </p>
            </div>
            
            <div className="border-b pb-4 dark:border-gray-700">
              <h3 className="text-xl font-semibold mb-2 dark:text-white">Is there a student discount?</h3>
              <p className="text-muted-foreground dark:text-gray-400">
                We offer special discounts for educational institutions and bulk purchases for schools.
                Please contact our support team for more information about institutional pricing.
              </p>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default PremiumPage;
