
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
  Check,
  Star,
  Database,
  BookMarked,
  TrendingUp,
  Users,
  HelpCircle,
  ChevronDown,
  ChevronUp
} from "lucide-react";
import { 
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { useState } from "react";

const Index = () => {
  const [openFaq, setOpenFaq] = useState<string | null>(null);

  const toggleFaq = (id: string) => {
    if (openFaq === id) {
      setOpenFaq(null);
    } else {
      setOpenFaq(id);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow">
        {/* Hero Section - Kept as is */}
        <section className="bg-gradient-to-b from-background to-muted py-20">
          <div className="container mx-auto px-4">
            <div className="flex flex-col lg:flex-row items-center justify-between gap-12">
              <div className="lg:w-1/2">
                <div className="mb-6 inline-block bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 px-4 py-1 rounded-full">
                  <div className="flex items-center">
                    <Star size={16} className="mr-2" />
                    <span className="text-sm font-medium">Trusted by 75,000+ students across India</span>
                  </div>
                </div>
                <h1 className="text-4xl md:text-5xl font-bold mb-6">
                  <span className="block">Excel in Mathematics</span>
                  <span className="block text-mathprimary">with Confidence</span>
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
                      <span>Access to 5000+ Previous Year Papers</span>
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
        
        {/* Key Selling Points Section */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">Why Students Love MathHub</h2>
              <p className="text-lg text-muted-foreground">
                Our platform is designed to help you achieve academic excellence with powerful tools and resources
              </p>
            </div>
            
            <div className="grid md:grid-cols-3 gap-8 mb-16">
              <div className="bg-background rounded-lg p-8 border shadow-sm text-center">
                <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Database className="text-green-600 dark:text-green-400" size={28} />
                </div>
                <h3 className="text-2xl font-bold mb-2">5000+</h3>
                <p className="text-muted-foreground">Practice Papers</p>
              </div>
              
              <div className="bg-background rounded-lg p-8 border shadow-sm text-center">
                <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                  <BookMarked className="text-blue-600 dark:text-blue-400" size={28} />
                </div>
                <h3 className="text-2xl font-bold mb-2">150+</h3>
                <p className="text-muted-foreground">Math Chapters</p>
              </div>
              
              <div className="bg-background rounded-lg p-8 border shadow-sm text-center">
                <div className="w-16 h-16 bg-amber-100 dark:bg-amber-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Star className="text-amber-600 dark:text-amber-400" size={28} />
                </div>
                <h3 className="text-2xl font-bold mb-2">4.9/5</h3>
                <p className="text-muted-foreground">From over 5,000 reviews</p>
              </div>
            </div>
            
            <div className="flex flex-col md:flex-row items-center gap-12 bg-muted p-8 rounded-xl">
              <div className="md:w-1/2">
                <h3 className="text-2xl font-bold mb-4">Explore by Board</h3>
                <p className="text-lg mb-6">
                  Select your educational board and access thousands of chapter-wise questions and previous year papers.
                </p>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <Check className="text-green-500" />
                    <span>ICSE Board - Comprehensive coverage of all math topics</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Check className="text-green-500" />
                    <span>CBSE Board - Aligned with the latest curriculum</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Check className="text-green-500" />
                    <span>West Bengal Board - Chapter-wise question papers</span>
                  </div>
                </div>
                <div className="mt-8">
                  <Button size="lg" asChild>
                    <Link to="/boards">Browse All Boards</Link>
                  </Button>
                </div>
              </div>
              <div className="md:w-1/2 mt-6 md:mt-0">
                <img 
                  src="/lovable-uploads/be0e4f6c-803e-4e32-b399-8a2595f77e2e.png" 
                  alt="MathHub Dashboard" 
                  className="rounded-lg shadow-lg border border-border"
                />
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

        {/* FAQ Section */}
        <section className="py-16 bg-muted/50">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">Frequently Asked Questions</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Find answers to the most common questions about MathHub and our services
              </p>
            </div>
            
            <div className="max-w-3xl mx-auto">
              <Accordion type="single" collapsible className="space-y-4">
                <AccordionItem value="item-1" className="bg-background border rounded-lg overflow-hidden">
                  <AccordionTrigger className="px-6 py-4 hover:no-underline hover:bg-muted/50">
                    How can MathHub help improve my math grades?
                  </AccordionTrigger>
                  <AccordionContent className="px-6 py-4 pt-0 text-muted-foreground">
                    MathHub provides access to thousands of previous year papers, chapter-wise practice questions, and 
                    interactive exams. By regularly practicing with our resources and tracking your progress, you'll 
                    identify your weak areas and strengthen your understanding of key concepts, leading to improved grades.
                  </AccordionContent>
                </AccordionItem>
                
                <AccordionItem value="item-2" className="bg-background border rounded-lg overflow-hidden">
                  <AccordionTrigger className="px-6 py-4 hover:no-underline hover:bg-muted/50">
                    Which boards does MathHub support?
                  </AccordionTrigger>
                  <AccordionContent className="px-6 py-4 pt-0 text-muted-foreground">
                    MathHub currently supports ICSE, CBSE, and West Bengal boards with comprehensive 
                    chapter-wise question papers and practice materials. We're continuously adding more boards 
                    to our platform to serve students across India.
                  </AccordionContent>
                </AccordionItem>
                
                <AccordionItem value="item-3" className="bg-background border rounded-lg overflow-hidden">
                  <AccordionTrigger className="px-6 py-4 hover:no-underline hover:bg-muted/50">
                    What is MathHub AI and how does it help?
                  </AccordionTrigger>
                  <AccordionContent className="px-6 py-4 pt-0 text-muted-foreground">
                    MathHub AI is our intelligent assistant that helps you solve math problems and understand complex 
                    concepts. Simply upload your math question or type it in, and our AI will provide step-by-step explanations 
                    and solutions, helping you better understand the concepts and improve your problem-solving skills.
                  </AccordionContent>
                </AccordionItem>
                
                <AccordionItem value="item-4" className="bg-background border rounded-lg overflow-hidden">
                  <AccordionTrigger className="px-6 py-4 hover:no-underline hover:bg-muted/50">
                    What's included in the Premium plan?
                  </AccordionTrigger>
                  <AccordionContent className="px-6 py-4 pt-0 text-muted-foreground">
                    The Premium plan gives you unlimited access to all board papers, unlimited practice tests, 
                    detailed performance analytics, unlimited use of MathHub AI, and priority customer support. 
                    Premium members also get access to exclusive study materials and advanced features to maximize 
                    their learning experience.
                  </AccordionContent>
                </AccordionItem>
                
                <AccordionItem value="item-5" className="bg-background border rounded-lg overflow-hidden">
                  <AccordionTrigger className="px-6 py-4 hover:no-underline hover:bg-muted/50">
                    How do I track my progress on MathHub?
                  </AccordionTrigger>
                  <AccordionContent className="px-6 py-4 pt-0 text-muted-foreground">
                    MathHub provides detailed analytics and insights on your performance. You can track your 
                    progress by subject, chapter, and topic. The platform highlights your strengths and weaknesses, 
                    allowing you to focus your efforts where they're needed most. Your progress dashboard shows 
                    improvement over time and compares your performance with peers.
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
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
