
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, Star, ChevronRight } from "lucide-react";
import DashboardPreview from "@/components/DashboardPreview";

const HeroSection = () => {
  return (
    <section className="relative min-h-screen flex flex-col justify-center overflow-hidden bg-background pt-20 pb-20">
      {/* Background gradients */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] rounded-full bg-gradient-to-br from-mathprimary/20 via-purple-500/10 to-mathsecondary/20 blur-3xl opacity-50"></div>
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] rounded-full bg-gradient-to-tr from-blue-500/20 via-mathprimary/10 to-transparent blur-3xl"></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="flex flex-col lg:flex-row items-center gap-16 lg:gap-24">
          <div className="w-full lg:w-1/2 text-center lg:text-left">
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-mathprimary/10 dark:bg-mathprimary/20 text-mathprimary dark:text-blue-300 text-sm mb-6 backdrop-blur-sm animate-fade-in">
              <Star className="w-4 h-4 mr-2" />
              <span>Trusted by 75,000+ students across India</span>
            </div>
            
            <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold text-mathdark dark:text-white mb-6 tracking-tight leading-[1.1]">
              Master Mathematics with{' '}
              <span className="relative inline-block text-transparent bg-clip-text bg-gradient-to-r from-mathprimary via-blue-600 to-mathsecondary">
                Precision
                <svg className="absolute -bottom-1 left-0 w-full" viewBox="0 0 200 10" xmlns="http://www.w3.org/2000/svg">
                  <path d="M0,5 Q50,0 100,5 T200,5" fill="none" stroke="currentColor" strokeWidth="2" opacity="0.3" />
                </svg>
              </span>
              <br />and Confidence
            </h1>
            
            <p className="text-lg sm:text-xl text-mathdark/70 dark:text-gray-300 mb-8 max-w-xl mx-auto lg:mx-0 leading-relaxed">
              Comprehensive practice papers, interactive exams, and personalized analytics for ICSE, CBSE, and West Bengal boards to help you achieve academic excellence.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start mb-10">
              <Button size="lg" className="text-base h-14 px-8 gap-2 bg-gradient-to-r from-mathprimary to-mathsecondary hover:from-mathprimary/90 hover:to-mathsecondary/90 dark:from-blue-600 dark:to-purple-600 dark:hover:from-blue-700 dark:hover:to-purple-700 shadow-lg shadow-mathprimary/25 dark:shadow-blue-900/30 animate-fade-in">
                <span>Start Learning Now</span>
                <ArrowRight size={16} />
              </Button>
              <Button size="lg" variant="outline" className="text-base h-14 px-8 border-2 border-mathprimary/30 text-mathprimary dark:border-blue-500/30 dark:text-blue-400 hover:bg-mathprimary/5 dark:hover:bg-blue-900/20 animate-fade-in" asChild>
                <Link to="/boards">Explore Papers</Link>
              </Button>
            </div>
            
            <div className="flex flex-col sm:flex-row items-center gap-6 justify-center lg:justify-start animate-fade-in">
              <div className="flex -space-x-4">
                {[1, 2, 3, 4, 5].map(i => (
                  <div key={i} className="w-12 h-12 rounded-full border-4 border-white dark:border-gray-800 bg-gray-200 dark:bg-gray-700 flex items-center justify-center overflow-hidden shadow-lg">
                    <span className="text-sm font-medium text-gray-600 dark:text-gray-300">{String.fromCharCode(64 + i)}</span>
                  </div>
                ))}
              </div>
              <div>
                <div className="flex items-center gap-1 mb-1">
                  {[1, 2, 3, 4, 5].map(i => (
                    <Star key={i} fill="currentColor" className="w-5 h-5 text-yellow-400" />
                  ))}
                </div>
                <div className="text-sm text-mathdark/70 dark:text-gray-400">
                  <span className="font-semibold text-mathdark dark:text-white">4.9/5</span> from over 5,000 reviews
                </div>
              </div>
            </div>
          </div>
          
          <div className="w-full lg:w-1/2 perspective-1000">
            <div className="relative mx-auto max-w-2xl animate-fade-in">
              <DashboardPreview />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
