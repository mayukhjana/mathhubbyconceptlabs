
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SchoolLogosMarquee from "@/components/SchoolLogosMarquee";
import SupportTicket from "@/components/SupportTicket";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { 
  BookOpen, 
  GraduationCap, 
  FileText, 
  BarChart3,
  Award,
  BrainCircuit,
  Check
} from "lucide-react";

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow">
        {/* Hero Section */}
        <section className="bg-gradient-to-b from-background to-muted py-20">
          <div className="container mx-auto px-4">
            <div className="flex flex-col lg:flex-row items-center justify-between gap-12">
              <div className="lg:w-1/2">
                <h1 className="text-4xl md:text-5xl font-bold mb-6">
                  Ace Your Math Exams with MathHub
                </h1>
                <p className="text-xl text-muted-foreground mb-8">
                  Practice with previous year papers, take simulated exams, and track your progress
                  to excel in mathematics.
                </p>
                <div className="flex flex-col sm:flex-row gap-4">
                  <Button size="lg" asChild>
                    <Link to="/boards">Explore Papers</Link>
                  </Button>
                  <Button size="lg" variant="outline" asChild>
                    <Link to="/exams">Practice Exams</Link>
                  </Button>
                </div>
              </div>
              
              <div className="lg:w-1/2">
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl p-6 border">
                  <div className="flex items-center mb-6">
                    <GraduationCap size={36} className="text-mathprimary mr-4" />
                    <div>
                      <h2 className="text-2xl font-bold">MathHub</h2>
                      <p className="text-muted-foreground">Your Math Success Partner</p>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <Check className="text-green-500" />
                      <span>Access to 1000+ Previous Year Papers</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Check className="text-green-500" />
                      <span>Practice with Board-specific Questions</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Check className="text-green-500" />
                      <span>Detailed Performance Analytics</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Check className="text-green-500" />
                      <span>AI-powered Math Help</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
        
        {/* Features Section */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12">
              Everything You Need to Excel in Math
            </h2>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              <div className="bg-background rounded-lg p-6 border shadow-sm">
                <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center mb-4">
                  <BookOpen className="text-blue-600 dark:text-blue-400" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Previous Papers</h3>
                <p className="text-muted-foreground">
                  Access a vast collection of past papers from different boards and years.
                </p>
              </div>
              
              <div className="bg-background rounded-lg p-6 border shadow-sm">
                <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center mb-4">
                  <FileText className="text-green-600 dark:text-green-400" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Practice Tests</h3>
                <p className="text-muted-foreground">
                  Test your knowledge with simulated exams tailored to your curriculum.
                </p>
              </div>
              
              <div className="bg-background rounded-lg p-6 border shadow-sm">
                <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center mb-4">
                  <BarChart3 className="text-purple-600 dark:text-purple-400" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Progress Tracking</h3>
                <p className="text-muted-foreground">
                  Monitor your performance and identify areas for improvement.
                </p>
              </div>
              
              <div className="bg-background rounded-lg p-6 border shadow-sm">
                <div className="w-12 h-12 bg-amber-100 dark:bg-amber-900/30 rounded-lg flex items-center justify-center mb-4">
                  <BrainCircuit className="text-amber-600 dark:text-amber-400" />
                </div>
                <h3 className="text-xl font-semibold mb-2">MathHub AI</h3>
                <p className="text-muted-foreground">
                  Get instant help with solving math problems using our AI assistant.
                </p>
              </div>
            </div>
          </div>
        </section>
        
        {/* Trusted By Section */}
        <section className="bg-muted py-16">
          <div className="container mx-auto px-4">
            <h2 className="text-2xl font-bold text-center mb-8">
              Trusted by Schools Across the Country
            </h2>
            <SchoolLogosMarquee />
          </div>
        </section>
        
        {/* Premium Section */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="flex flex-col lg:flex-row items-center gap-12">
              <div className="lg:w-1/2">
                <h2 className="text-3xl font-bold mb-4">
                  Upgrade to Premium
                </h2>
                <p className="text-lg text-muted-foreground mb-6">
                  Get unlimited access to all premium papers, exams, and AI assistance
                  to maximize your math potential.
                </p>
                <ul className="space-y-3 mb-6">
                  <li className="flex items-center gap-2">
                    <Check className="text-green-500" />
                    <span>Unlimited practice tests</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="text-green-500" />
                    <span>Premium papers from all boards</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="text-green-500" />
                    <span>Advanced analytics and insights</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="text-green-500" />
                    <span>Unlimited access to MathHub AI</span>
                  </li>
                </ul>
                <Button size="lg" className="bg-gradient-to-r from-mathprimary to-mathsecondary" asChild>
                  <Link to="/premium">
                    <Award className="mr-2" />
                    Get Premium
                  </Link>
                </Button>
              </div>
              
              <div className="lg:w-1/2">
                <div className="bg-muted rounded-xl overflow-hidden">
                  <div className="bg-mathprimary/10 p-6">
                    <h3 className="text-xl font-bold mb-1">Premium Plan</h3>
                    <p className="text-muted-foreground">Full access to all features</p>
                    <div className="mt-4 mb-2">
                      <span className="text-4xl font-bold">₹299</span>
                      <span className="text-muted-foreground">/month</span>
                    </div>
                  </div>
                  <div className="p-6">
                    <ul className="space-y-3">
                      <li className="flex items-center gap-2">
                        <Check className="text-green-500" />
                        <span>Unlimited practice exams</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <Check className="text-green-500" />
                        <span>Full access to all board papers</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <Check className="text-green-500" />
                        <span>Detailed performance reports</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <Check className="text-green-500" />
                        <span>Unlimited MathHub AI questions</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <Check className="text-green-500" />
                        <span>Priority customer support</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Support Ticket Section */}
        <SupportTicket />
      </main>
      
      <Footer />
    </div>
  );
};

export default Index;
