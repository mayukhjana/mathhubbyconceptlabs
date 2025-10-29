import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, Star, ChevronRight } from "lucide-react";
import DashboardPreview from "@/components/DashboardPreview";
const HeroSection = () => {
  return <section className="relative min-h-screen flex flex-col justify-center overflow-hidden bg-gradient-to-br from-background via-background to-accent/5 pt-20 pb-20">
      {/* Animated Math Symbols Background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-0 w-full h-full opacity-[0.03] dark:opacity-[0.05]">
          <div className="absolute animate-float delay-0 left-[10%] top-[10%] text-6xl text-mathprimary">∫</div>
          <div className="absolute animate-float delay-200 left-[20%] top-[40%] text-5xl text-mathsecondary">π</div>
          <div className="absolute animate-float delay-400 left-[80%] top-[15%] text-7xl text-mathaccent">∑</div>
          <div className="absolute animate-float delay-600 left-[65%] top-[35%] text-5xl text-mathprimary">√</div>
          <div className="absolute animate-float delay-800 left-[35%] top-[65%] text-6xl text-mathsecondary">∞</div>
          <div className="absolute animate-float delay-1000 left-[75%] top-[75%] text-5xl text-mathaccent">θ</div>
        </div>

        {/* Soothing Gradient Orbs */}
        <div className="absolute top-20 right-10 w-[600px] h-[600px] rounded-full bg-gradient-to-br from-mathprimary/10 via-mathsecondary/5 to-transparent dark:from-mathprimary/8 dark:via-mathsecondary/4 blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] rounded-full bg-gradient-to-tr from-mathaccent/10 via-mathsecondary/5 to-transparent dark:from-mathaccent/8 dark:via-mathsecondary/4 blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] rounded-full bg-gradient-to-br from-mathprimary/5 to-transparent dark:from-mathprimary/3 blur-3xl"></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="flex flex-col lg:flex-row items-center gap-16 lg:gap-24">
          <div className="w-full lg:w-1/2 text-center lg:text-left">
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-gradient-to-r from-mathprimary/10 via-mathsecondary/10 to-mathaccent/10 dark:from-mathprimary/15 dark:via-mathsecondary/15 dark:to-mathaccent/15 text-foreground border border-mathprimary/20 dark:border-mathprimary/30 text-sm mb-6 backdrop-blur-sm animate-fade-in shadow-sm">
              <Star className="w-4 h-4 mr-2 text-mathprimary" />
              <span className="font-medium">Trusted by 75,000+ students across India</span>
            </div>
            
            <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold text-foreground mb-6 tracking-tight leading-[1.1]">
              Master Mathematics with{' '}
              <span className="text-primary">
                Confidence
              </span>
              <br />and Excellence
            </h1>
            
            <p className="text-lg sm:text-xl text-muted-foreground mb-8 max-w-xl mx-auto lg:mx-0 leading-relaxed">
              Comprehensive practice papers, interactive exams, and AI-powered analytics designed to help you excel in your studies.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start mb-10">
              <Button size="lg" className="text-base h-14 px-8 gap-2 bg-primary hover:bg-primary/90 hover:shadow-xl hover:scale-105 transition-all duration-300 shadow-lg animate-fade-in" asChild>
                <Link to="/boards">
                  <span>Start Learning Now</span>
                  <ArrowRight size={16} />
                </Link>
              </Button>
              <Button size="lg" variant="outline" className="text-base h-14 px-8 border-2 hover:bg-accent/50 dark:hover:bg-accent/30 transition-all duration-300 animate-fade-in" asChild>
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