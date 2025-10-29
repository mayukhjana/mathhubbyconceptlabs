import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, Star, ChevronRight } from "lucide-react";
import DashboardPreview from "@/components/DashboardPreview";
const HeroSection = () => {
  return <section className="relative min-h-screen flex flex-col justify-center overflow-hidden bg-background pt-20 pb-20">
      {/* Animated Math Symbols Background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-0 w-full h-full opacity-5">
          <div className="absolute animate-float delay-0 left-[10%] top-[10%]">∫</div>
          <div className="absolute animate-float delay-200 left-[20%] top-[40%]">π</div>
          <div className="absolute animate-float delay-400 left-[80%] top-[15%]">∑</div>
          <div className="absolute animate-float delay-600 left-[65%] top-[35%]">√</div>
          <div className="absolute animate-float delay-800 left-[35%] top-[65%]">∞</div>
          <div className="absolute animate-float delay-1000 left-[75%] top-[75%]">θ</div>
        </div>

        {/* Modern Gradient Effects */}
        
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
              </span>
              <br />and Confidence
            </h1>
            
            <p className="text-lg sm:text-xl text-mathdark/70 dark:text-gray-300 mb-8 max-w-xl mx-auto lg:mx-0 leading-relaxed">
              Comprehensive practice papers, interactive exams, and AI-powered analytics for ICSE, CBSE, and West Bengal boards.
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
              <div className="flex items-center gap-6">
                <div className="flex items-center gap-2 bg-card border rounded-lg px-4 py-2 shadow-sm">
                  <svg className="w-6 h-6" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z" fill="#FFC107"/>
                    <path d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z" fill="#FF3D00"/>
                    <path d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z" fill="#4CAF50"/>
                    <path d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z" fill="#1976D2"/>
                  </svg>
                  <span className="text-xs font-medium text-foreground">Google</span>
                </div>
                <div className="flex items-center gap-2 bg-card border rounded-lg px-4 py-2 shadow-sm">
                  <svg className="w-6 h-6" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <rect width="48" height="48" rx="8" fill="#00B67A"/>
                    <path d="M24 10L27.5 20H38L29.5 26.5L33 36.5L24 30L15 36.5L18.5 26.5L10 20H20.5L24 10Z" fill="white"/>
                  </svg>
                  <span className="text-xs font-medium text-foreground">Trustpilot</span>
                </div>
                <div className="flex items-center gap-2 bg-card border rounded-lg px-4 py-2 shadow-sm">
                  <div className="w-6 h-6 rounded bg-primary flex items-center justify-center">
                    <span className="text-xs font-bold text-primary-foreground">T</span>
                  </div>
                  <span className="text-xs font-medium text-foreground">TeacherOn</span>
                </div>
              </div>
              <div>
                <div className="flex items-center gap-1 mb-1">
                  {[1, 2, 3, 4, 5].map(i => <Star key={i} fill="currentColor" className="w-5 h-5 text-yellow-400" />)}
                </div>
                <div className="text-sm text-muted-foreground">
                  <span className="font-semibold text-foreground">4.9/5</span> from over 5,000 reviews
                </div>
              </div>
            </div>
          </div>
          
          <div className="w-full lg:w-1/2 perspective-1000">
            <div className="relative mx-auto max-w-2xl animate-fade-in hover:scale-105 transition-transform duration-500">
              <DashboardPreview />
            </div>
          </div>
        </div>
      </div>
    </section>;
};
export default HeroSection;