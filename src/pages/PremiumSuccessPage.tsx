
import { useEffect } from "react";
import { Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { CheckCircle, ArrowRight } from "lucide-react";

const PremiumSuccessPage = () => {
  const { refreshPremiumStatus } = useAuth();
  
  useEffect(() => {
    // Refresh premium status on load
    refreshPremiumStatus();
  }, [refreshPremiumStatus]);
  
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow flex items-center justify-center">
        <div className="container mx-auto px-4 py-16 max-w-3xl">
          <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            <div className="bg-gradient-to-r from-mathprimary to-mathprimary/80 p-8 text-white text-center">
              <div className="mx-auto bg-white rounded-full w-20 h-20 flex items-center justify-center mb-6">
                <CheckCircle className="h-12 w-12 text-green-500" />
              </div>
              <h1 className="text-3xl font-bold mb-2">Payment Successful!</h1>
              <p className="text-lg opacity-90">Thank you for subscribing to Premium.</p>
            </div>
            
            <div className="p-8 text-center">
              <h2 className="text-2xl font-bold mb-4">Your premium access is now active</h2>
              <p className="text-muted-foreground mb-8">
                You now have full access to all premium features and content. Start exploring and 
                make the most of your subscription!
              </p>
              
              <div className="grid gap-4 md:grid-cols-2 mb-8">
                <div className="border rounded-lg p-6">
                  <h3 className="font-medium mb-2">Access Premium Papers</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Browse all premium question papers and practice exams
                  </p>
                  <Button asChild variant="outline" className="w-full">
                    <Link to="/exam-papers">View Papers</Link>
                  </Button>
                </div>
                
                <div className="border rounded-lg p-6">
                  <h3 className="font-medium mb-2">Track Your Progress</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    View your performance analytics and improvement over time
                  </p>
                  <Button asChild variant="outline" className="w-full">
                    <Link to="/profile">Go to Profile</Link>
                  </Button>
                </div>
              </div>
              
              <Button asChild className="flex gap-2 items-center">
                <Link to="/">
                  Continue to Homepage <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default PremiumSuccessPage;
