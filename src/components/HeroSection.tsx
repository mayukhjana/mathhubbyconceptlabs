
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, Star, ChevronRight } from "lucide-react";
import DashboardPreview from "@/components/DashboardPreview";

const HeroSection = () => {
  return (
    <section className="relative min-h-screen flex flex-col justify-center overflow-hidden bg-background pt-20 pb-20">
      {/* Enhanced gradient backgrounds */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1200px] h-[600px] rounded-full bg-gradient-to-br from-violet-500/30 via-purple-500/20 to-blue-500/30 blur-3xl opacity-50 animate-pulse"></div>
        <div className="absolute bottom-0 left-0 w-[800px] h-[600px] rounded-full bg-gradient-to-tr from-blue-500/20 via-cyan-500/20 to-transparent blur-3xl"></div>
        <div className="absolute top-1/2 right-0 w-[600px] h-[400px] rounded-full bg-gradient-to-bl from-emerald-500/20 via-teal-500/20 to-transparent blur-3xl"></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="flex flex-col lg:flex-row items-center gap-16 lg:gap-24">
          <div className="w-full lg:w-1/2 text-center lg:text-left">
            {/* Trust badge with animation */}
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-blue-500/10 dark:bg-blue-400/20 text-blue-600 dark:text-blue-300 text-sm mb-6 backdrop-blur-sm animate-fade-in hover:bg-blue-500/15 transition-colors">
              <Star className="w-4 h-4 mr-2" />
              <span>Trusted by 75,000+ students across India</span>
            </div>
            
            {/* Enhanced heading with gradient */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold text-mathdark dark:text-white mb-6 tracking-tight leading-[1.1] animate-fade-in">
              Master Mathematics with{' '}
              <span className="relative inline-block">
                <span className="relative z-10 text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-violet-600 to-purple-600 dark:from-blue-400 dark:via-violet-400 dark:to-purple-400">
                  Precision
                </span>
                <svg className="absolute -bottom-1 left-0 w-full" viewBox="0 0 200 10" xmlns="http://www.w3.org/2000/svg">
                  <path d="M0,5 Q50,0 100,5 T200,5" fill="none" stroke="currentColor" strokeWidth="2" className="text-blue-400/30" />
                </svg>
              </span>
              <br />and{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-teal-600 dark:from-emerald-400 dark:to-teal-400">
                Confidence
              </span>
            </h1>
            
            {/* Enhanced description */}
            <p className="text-lg sm:text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-xl mx-auto lg:mx-0 leading-relaxed animate-fade-in">
              Access comprehensive practice papers, interactive exams, and personalized analytics for ICSE, CBSE, and West Bengal boards to achieve academic excellence.
            </p>
            
            {/* Enhanced CTA buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start mb-10">
              <Button size="lg" className="text-base h-14 px-8 gap-2 bg-gradient-to-r from-blue-600 to-violet-600 hover:from-blue-700 hover:to-violet-700 dark:from-blue-500 dark:to-violet-500 dark:hover:from-blue-600 dark:hover:to-violet-600 shadow-lg shadow-blue-500/25 dark:shadow-blue-900/30 animate-fade-in">
                <span>Start Learning Now</span>
                <ArrowRight size={16} />
              </Button>
              <Button size="lg" variant="outline" className="text-base h-14 px-8 border-2 border-blue-500/30 text-blue-600 dark:border-blue-400/30 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 animate-fade-in" asChild>
                <Link to="/boards">Explore Papers</Link>
              </Button>
            </div>
            
            {/* Enhanced social proof section */}
            <div className="flex flex-col sm:flex-row items-center gap-6 justify-center lg:justify-start animate-fade-in">
              <div className="flex -space-x-4">
                <div className="w-12 h-12 rounded-full border-4 border-white dark:border-gray-800 overflow-hidden shadow-lg">
                  <img 
                    src="https://images.unsplash.com/photo-1605810230434-7631ac76ec81" 
                    alt="Student A" 
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="w-12 h-12 rounded-full border-4 border-white dark:border-gray-800 overflow-hidden shadow-lg">
                  <img 
                    src="https://images.unsplash.com/photo-1519389950473-47ba0277781c" 
                    alt="Student B" 
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="w-12 h-12 rounded-full border-4 border-white dark:border-gray-800 overflow-hidden shadow-lg">
                  <img 
                    src="https://images.unsplash.com/photo-1581090464777-f3220bbe1b8b" 
                    alt="Student C" 
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="w-12 h-12 rounded-full border-4 border-white dark:border-gray-800 overflow-hidden shadow-lg">
                  <img 
                    src="https://images.unsplash.com/photo-1531123897727-8f129e1688ce" 
                    alt="Student D" 
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="w-12 h-12 rounded-full border-4 border-white dark:border-gray-800 overflow-hidden shadow-lg">
                  <img 
                    src="https://images.unsplash.com/photo-1629872430082-93d8912beccf" 
                    alt="Student E" 
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
              <div>
                <div className="flex items-center gap-1 mb-1">
                  {[1, 2, 3, 4, 5].map(i => (
                    <Star key={i} fill="currentColor" className="w-5 h-5 text-yellow-400" />
                  ))}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  <span className="font-semibold text-gray-900 dark:text-white">4.9/5</span> from over 5,000 reviews
                </div>
              </div>
            </div>
          </div>
          
          {/* Enhanced dashboard preview */}
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
