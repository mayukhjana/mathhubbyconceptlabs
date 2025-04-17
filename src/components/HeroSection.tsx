
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, Star } from "lucide-react";
import DashboardPreview from "@/components/DashboardPreview";

const HeroSection = () => {
  return (
    <section className="relative min-h-screen flex flex-col justify-center overflow-hidden bg-background pt-24 pb-20">
      {/* Background effects */}
      <div className="absolute inset-0 opacity-50">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] rounded-full bg-gradient-to-b from-gray-200/50 via-gray-100/20 to-transparent dark:from-gray-800/50 dark:via-gray-900/20 blur-3xl"></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        {/* Grid layout for better organization */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Left column - Text content */}
          <div className="text-center lg:text-left">
            {/* Trust badge */}
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200 text-sm mb-8 animate-fade-in">
              <Star className="w-4 h-4 mr-2" />
              <span>Trusted by 75,000+ students across India</span>
            </div>
            
            {/* Main heading with gradients */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold text-mathdark dark:text-white mb-6 tracking-tight leading-[1.1] animate-fade-in">
              The Future of{' '}
              <span className="bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-400 bg-clip-text text-transparent">Mathematics Education</span>{' '}
              is Here
            </h1>
            
            {/* Enhanced subheading */}
            <p className="text-lg sm:text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-xl mx-auto lg:mx-0 leading-relaxed animate-fade-in">
              Master mathematics through interactive learning, comprehensive practice papers, and AI-powered personalized guidance.
            </p>
            
            {/* CTA buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start mb-10">
              <Button 
                size="lg" 
                className="h-14 px-8 bg-mathdark hover:bg-gray-800 dark:bg-white dark:text-mathdark dark:hover:bg-gray-200 text-white shadow-lg"
              >
                <Link to="/boards" className="flex items-center">
                  Start Learning
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button 
                size="lg" 
                variant="outline" 
                className="h-14 px-8 border-2 hover:bg-gray-100 dark:hover:bg-gray-800"
                asChild
              >
                <Link to="/premium">View Study Materials</Link>
              </Button>
            </div>

            {/* Stats section */}
            <div className="grid grid-cols-3 gap-8 max-w-2xl mx-auto lg:mx-0 animate-fade-in">
              <div className="text-center">
                <div className="text-3xl font-bold text-mathdark dark:text-white mb-1">75K+</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Active Students</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-mathdark dark:text-white mb-1">5000+</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Practice Papers</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-mathdark dark:text-white mb-1">98%</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Success Rate</div>
              </div>
            </div>
          </div>

          {/* Right column - Dashboard preview */}
          <div className="relative lg:right-0 animate-fade-in perspective-1000">
            <div className="relative mx-auto backdrop-blur-xl">
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-tr from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-700 opacity-80 shadow-2xl"></div>
              <div className="relative">
                <DashboardPreview />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
