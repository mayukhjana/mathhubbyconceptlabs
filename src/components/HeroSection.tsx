
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, Star, ChevronRight } from "lucide-react";
import DashboardPreview from "@/components/DashboardPreview";

const HeroSection = () => {
  return (
    <section className="relative overflow-hidden pt-20 pb-20 md:pt-24 md:pb-28 bg-gradient-to-b from-background to-gray-50/50 dark:from-background dark:to-gray-900/30">
      {/* Background Pattern */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-20 left-0 right-0 h-[600px] bg-gradient-to-b from-mathprimary/5 to-transparent dark:from-mathprimary/10 dark:to-transparent"></div>
        <div className="absolute -bottom-24 left-0 w-96 h-96 bg-mathprimary/10 dark:bg-mathprimary/5 rounded-full filter blur-[100px]"></div>
        <div className="absolute top-40 right-0 w-[500px] h-[500px] bg-mathsecondary/10 dark:bg-mathsecondary/5 rounded-full filter blur-[100px]"></div>
        
        {/* Decorative elements */}
        <div className="absolute top-1/4 left-1/4 w-8 h-8 bg-mathprimary/30 rounded-full blur-sm animate-pulse"></div>
        <div className="absolute bottom-1/3 right-1/3 w-6 h-6 bg-mathsecondary/20 rounded-full blur-sm animate-pulse delay-500"></div>
        <div className="absolute top-1/2 right-1/4 w-4 h-4 bg-purple-500/20 rounded-full blur-sm animate-pulse delay-1000"></div>
      </div>
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-16">
          <div className="w-full lg:w-1/2 text-center lg:text-left">
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-mathprimary/10 dark:bg-mathprimary/20 text-mathprimary dark:text-blue-300 text-sm mb-6 backdrop-blur-sm">
              <Star className="w-4 h-4 mr-2" />
              <span>Trusted by 75,000+ students across India</span>
            </div>
            
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-mathdark dark:text-white mb-6 tracking-tight leading-tight">
              Master Mathematics with <span className="relative text-mathprimary dark:text-blue-400">
                Precision
                <svg className="absolute -bottom-1 left-0 w-full" viewBox="0 0 200 10" xmlns="http://www.w3.org/2000/svg">
                  <path d="M0,5 Q50,0 100,5 T200,5" fill="none" stroke="currentColor" strokeWidth="2" opacity="0.5" />
                </svg>
              </span>
              <br />and Confidence
            </h1>
            
            <p className="text-lg text-mathdark/70 dark:text-gray-300 mb-8 max-w-xl mx-auto lg:mx-0">
              Comprehensive practice papers, interactive exams, and personalized analytics for ICSE, CBSE, and West Bengal boards to help you achieve academic excellence.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start mb-10">
              <Button size="lg" className="gap-2 bg-mathprimary hover:bg-mathprimary/90 dark:bg-blue-600 dark:hover:bg-blue-700 shadow-lg shadow-mathprimary/25 dark:shadow-blue-900/30">
                <span>Start Learning Now</span>
                <ArrowRight size={16} />
              </Button>
              <Button size="lg" variant="outline" className="border-mathprimary/30 text-mathprimary dark:border-blue-500/30 dark:text-blue-400 hover:bg-mathprimary/5 dark:hover:bg-blue-900/20" asChild>
                <Link to="/boards">Explore Papers</Link>
              </Button>
            </div>
            
            <div className="flex flex-col sm:flex-row items-center gap-6 justify-center lg:justify-start">
              <div className="flex -space-x-3">
                {[1, 2, 3, 4, 5].map(i => (
                  <div key={i} className="w-10 h-10 rounded-full border-2 border-white dark:border-gray-800 bg-gray-200 dark:bg-gray-700 flex items-center justify-center overflow-hidden">
                    <span className="text-xs font-medium text-gray-600 dark:text-gray-300">{String.fromCharCode(64 + i)}</span>
                  </div>
                ))}
              </div>
              <div>
                <div className="flex items-center gap-1 mb-1">
                  {[1, 2, 3, 4, 5].map(i => (
                    <Star key={i} fill="currentColor" className="w-4 h-4 text-yellow-400" />
                  ))}
                </div>
                <div className="text-sm text-mathdark/70 dark:text-gray-400">
                  <span className="font-semibold text-mathdark dark:text-white">4.9/5</span> from over 5,000 reviews
                </div>
              </div>
            </div>
          </div>
          
          <div className="w-full lg:w-1/2">
            <div className="relative mx-auto max-w-lg">
              <DashboardPreview />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
