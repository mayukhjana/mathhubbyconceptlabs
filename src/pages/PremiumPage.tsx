
import { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { CheckCircle, X, AlertCircle, CreditCard, Check } from "lucide-react";
import { toast } from "sonner";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import LoadingAnimation from "@/components/LoadingAnimation";

const PremiumPage = () => {
  const [selectedPlan, setSelectedPlan] = useState<"monthly" | "yearly">("yearly");
  const [paymentProcessing, setPaymentProcessing] = useState(false);
  
  const handlePayment = () => {
    setPaymentProcessing(true);
    
    // Simulate payment processing
    setTimeout(() => {
      setPaymentProcessing(false);
      toast.success("Thank you for your purchase! You now have premium access.", {
        description: "Your account has been upgraded successfully.",
      });
    }, 2000);
  };
  
  return (
    <div className="min-h-screen flex flex-col">
      <LoadingAnimation />
      <Navbar />
      
      <main className="flex-grow">
        {/* Hero Section */}
        <div className="bg-gradient-to-b from-mathdark to-black text-white py-16 md:py-24">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Unlock Your Full Math Potential
            </h1>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto mb-10">
              Get unlimited access to all premium papers, practice exams, and exclusive resources with MathHub Premium.
            </p>
            <div className="max-w-xs mx-auto">
              <Button size="lg" className="w-full" onClick={() => window.scrollTo({ top: 800, behavior: 'smooth' })}>
                See Plans
              </Button>
            </div>
          </div>
        </div>
        
        {/* Features Grid */}
        <div className="py-20 bg-white">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12">Everything You Need to Excel</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <div className="bg-white border rounded-xl p-6 hover:shadow-md transition-shadow">
                <div className="bg-mathlight inline-flex rounded-full p-3 mb-4">
                  <CheckCircle className="h-6 w-6 text-mathprimary" />
                </div>
                <h3 className="text-xl font-semibold mb-3">Unlimited Paper Access</h3>
                <p className="text-gray-600">
                  Access our entire library of 3000+ previous year papers from all boards, organized by chapter.
                </p>
              </div>
              
              <div className="bg-white border rounded-xl p-6 hover:shadow-md transition-shadow">
                <div className="bg-mathlight inline-flex rounded-full p-3 mb-4">
                  <CheckCircle className="h-6 w-6 text-mathprimary" />
                </div>
                <h3 className="text-xl font-semibold mb-3">Interactive MCQ Exams</h3>
                <p className="text-gray-600">
                  Practice with our comprehensive collection of MCQ exams with instant feedback and detailed solutions.
                </p>
              </div>
              
              <div className="bg-white border rounded-xl p-6 hover:shadow-md transition-shadow">
                <div className="bg-mathlight inline-flex rounded-full p-3 mb-4">
                  <CheckCircle className="h-6 w-6 text-mathprimary" />
                </div>
                <h3 className="text-xl font-semibold mb-3">Progress Tracking</h3>
                <p className="text-gray-600">
                  Track your performance over time and identify areas where you need to improve.
                </p>
              </div>
              
              <div className="bg-white border rounded-xl p-6 hover:shadow-md transition-shadow">
                <div className="bg-mathlight inline-flex rounded-full p-3 mb-4">
                  <CheckCircle className="h-6 w-6 text-mathprimary" />
                </div>
                <h3 className="text-xl font-semibold mb-3">Step-by-Step Solutions</h3>
                <p className="text-gray-600">
                  Get detailed solutions for all problems to understand concepts better and learn from your mistakes.
                </p>
              </div>
              
              <div className="bg-white border rounded-xl p-6 hover:shadow-md transition-shadow">
                <div className="bg-mathlight inline-flex rounded-full p-3 mb-4">
                  <CheckCircle className="h-6 w-6 text-mathprimary" />
                </div>
                <h3 className="text-xl font-semibold mb-3">Ad-Free Experience</h3>
                <p className="text-gray-600">
                  Enjoy an uninterrupted learning experience with no advertisements.
                </p>
              </div>
              
              <div className="bg-white border rounded-xl p-6 hover:shadow-md transition-shadow">
                <div className="bg-mathlight inline-flex rounded-full p-3 mb-4">
                  <CheckCircle className="h-6 w-6 text-mathprimary" />
                </div>
                <h3 className="text-xl font-semibold mb-3">Priority Support</h3>
                <p className="text-gray-600">
                  Get priority support from our team of math experts to help you with any questions.
                </p>
              </div>
            </div>
          </div>
        </div>
        
        {/* Pricing Section */}
        <div className="py-20 bg-mathlight/30">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-4">Simple, Transparent Pricing</h2>
            <p className="text-center text-gray-600 max-w-2xl mx-auto mb-12">
              Choose the plan that works best for you. Both plans give you full access to all premium features.
            </p>
            
            <div className="max-w-4xl mx-auto">
              <Tabs defaultValue="yearly" className="max-w-sm mx-auto mb-8">
                <TabsList className="grid w-full grid-cols-2 mb-8">
                  <TabsTrigger value="monthly" onClick={() => setSelectedPlan("monthly")}>Monthly</TabsTrigger>
                  <TabsTrigger value="yearly" onClick={() => setSelectedPlan("yearly")}>Yearly (Save 20%)</TabsTrigger>
                </TabsList>
                
                <TabsContent value="monthly">
                  <div className="bg-white border border-mathprimary/30 rounded-xl overflow-hidden shadow-lg">
                    <div className="bg-gradient-to-r from-mathprimary to-mathsecondary text-white p-6">
                      <h3 className="text-2xl font-bold mb-1">Monthly Plan</h3>
                      <p className="text-white/80">Billed monthly</p>
                    </div>
                    
                    <div className="p-6">
                      <div className="mb-6">
                        <span className="text-4xl font-bold">₹99</span>
                        <span className="text-gray-500">/month</span>
                      </div>
                      
                      <ul className="space-y-3 mb-8">
                        {[
                          "Full access to 3000+ papers",
                          "All practice exams included",
                          "Progress tracking",
                          "Step-by-step solutions",
                          "Ad-free experience",
                          "Priority support",
                          "Cancel anytime"
                        ].map((feature, index) => (
                          <li key={index} className="flex items-center gap-2">
                            <Check className="h-5 w-5 text-mathprimary" />
                            <span>{feature}</span>
                          </li>
                        ))}
                      </ul>
                      
                      <Button 
                        size="lg" 
                        className="w-full" 
                        onClick={handlePayment}
                        disabled={paymentProcessing}
                      >
                        {paymentProcessing ? (
                          <>Processing...</>
                        ) : (
                          <>
                            <CreditCard className="mr-2 h-4 w-4" />
                            Subscribe Now
                          </>
                        )}
                      </Button>
                    </div>
                  </div>
                </TabsContent>
                
                <TabsContent value="yearly">
                  <div className="bg-white border-2 border-mathprimary rounded-xl overflow-hidden shadow-lg relative">
                    <div className="absolute top-5 right-5 bg-mathprimary text-white px-3 py-1 rounded-full text-sm font-medium">
                      Best Value
                    </div>
                    
                    <div className="bg-gradient-to-r from-mathprimary to-mathsecondary text-white p-6">
                      <h3 className="text-2xl font-bold mb-1">Yearly Plan</h3>
                      <p className="text-white/80">Billed annually</p>
                    </div>
                    
                    <div className="p-6">
                      <div className="mb-6">
                        <span className="text-4xl font-bold">₹799</span>
                        <span className="text-gray-500">/year</span>
                        <div className="text-sm text-green-600 font-medium">Save ₹388 (20%) compared to monthly</div>
                      </div>
                      
                      <ul className="space-y-3 mb-8">
                        {[
                          "Everything in monthly plan",
                          "Full access to 3000+ papers",
                          "All practice exams included",
                          "Progress tracking",
                          "Step-by-step solutions", 
                          "Ad-free experience",
                          "Priority support",
                          "30-day money-back guarantee"
                        ].map((feature, index) => (
                          <li key={index} className="flex items-center gap-2">
                            <Check className="h-5 w-5 text-mathprimary" />
                            <span>{feature}</span>
                          </li>
                        ))}
                      </ul>
                      
                      <Button 
                        size="lg" 
                        className="w-full" 
                        onClick={handlePayment}
                        disabled={paymentProcessing}
                      >
                        {paymentProcessing ? (
                          <>Processing...</>
                        ) : (
                          <>
                            <CreditCard className="mr-2 h-4 w-4" />
                            Subscribe Now
                          </>
                        )}
                      </Button>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
              
              <div className="text-center mb-12">
                <p className="text-sm text-gray-500">
                  By subscribing, you agree to our Terms of Service and Privacy Policy.
                </p>
              </div>
              
              {/* FAQ Section */}
              <div className="max-w-2xl mx-auto">
                <h3 className="text-2xl font-bold text-center mb-8">Frequently Asked Questions</h3>
                
                <div className="space-y-6">
                  <div className="bg-white p-6 rounded-lg border">
                    <h4 className="font-semibold text-lg mb-2">Can I cancel my subscription anytime?</h4>
                    <p className="text-gray-600">
                      Yes, you can cancel your subscription at any time. If you cancel, you'll still have access until the end of your billing period.
                    </p>
                  </div>
                  
                  <div className="bg-white p-6 rounded-lg border">
                    <h4 className="font-semibold text-lg mb-2">Do you offer refunds?</h4>
                    <p className="text-gray-600">
                      We offer a 30-day money-back guarantee for our yearly subscription. If you're not satisfied with your purchase, contact our support team within 30 days for a full refund.
                    </p>
                  </div>
                  
                  <div className="bg-white p-6 rounded-lg border">
                    <h4 className="font-semibold text-lg mb-2">What payment methods do you accept?</h4>
                    <p className="text-gray-600">
                      We accept all major credit cards, debit cards, and UPI payments. All payments are processed securely.
                    </p>
                  </div>
                  
                  <div className="bg-white p-6 rounded-lg border">
                    <h4 className="font-semibold text-lg mb-2">Can I share my account with others?</h4>
                    <p className="text-gray-600">
                      No, your subscription is for individual use only. We monitor account activity and sharing your account may result in suspension.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* CTA Section */}
        <div className="py-16 bg-mathprimary text-white">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold mb-6">Ready to Take Your Math Skills to the Next Level?</h2>
            <p className="text-xl mb-8 max-w-2xl mx-auto">
              Join thousands of students who have improved their math scores with MathHub Premium.
            </p>
            <div className="max-w-xs mx-auto">
              <Button 
                variant="secondary" 
                size="lg" 
                className="w-full"
                onClick={handlePayment}
                disabled={paymentProcessing}
              >
                {paymentProcessing ? "Processing..." : "Get Started Now"}
              </Button>
              <p className="mt-4 text-sm text-white/80">
                30-day money-back guarantee for yearly plans
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
