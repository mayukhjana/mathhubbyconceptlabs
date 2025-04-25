
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, Star } from "lucide-react";
import DashboardPreview from "@/components/DashboardPreview";

const HeroSection = () => {
  return (
    <section className="relative min-h-screen flex flex-col justify-center overflow-hidden bg-background pt-20 pb-20">
      {/* Modern Gradient Background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute w-full h-full">
          <div className="absolute top-0 -left-4 w-[800px] h-[800px] bg-mathprimary/20 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
          <div className="absolute top-0 -right-4 w-[800px] h-[800px] bg-mathsecondary/20 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>
          <div className="absolute -bottom-8 left-20 w-[600px] h-[600px] bg-mathaccent/20 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-4000"></div>
        </div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="flex flex-col lg:flex-row items-center gap-16 lg:gap-24">
          <div className="w-full lg:w-1/2 text-center lg:text-left">
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-mathprimary/10 dark:bg-mathprimary/20 text-mathprimary dark:text-blue-300 text-sm mb-6 backdrop-blur-sm">
              <Star className="w-4 h-4 mr-2" />
              <span>Trusted by 75,000+ students across India</span>
            </div>
            
            <h1 className="text-5xl sm:text-6xl lg:text-7xl xl:text-8xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-mathprimary via-mathsecondary to-mathaccent mb-6">
              Excel in Math<br />With Confidence
            </h1>
            
            <p className="text-lg sm:text-xl text-muted-foreground mb-8 max-w-xl mx-auto lg:mx-0">
              Master mathematics through our comprehensive practice papers, interactive exams, and AI-powered analytics.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start mb-10">
              <Button size="lg" className="text-base h-14 px-8 gap-2 bg-gradient-to-r from-mathprimary to-mathsecondary hover:opacity-90">
                Start Learning Now
                <ArrowRight size={16} />
              </Button>
              <Button size="lg" variant="outline" className="text-base h-14 px-8 border-2" asChild>
                <Link to="/boards">Explore Papers</Link>
              </Button>
            </div>
            
            <div className="flex items-center justify-center lg:justify-start space-x-8">
              <div className="text-center">
                <div className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-mathprimary to-mathsecondary">75K+</div>
                <div className="text-sm text-muted-foreground">Active Students</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-mathprimary to-mathsecondary">95%</div>
                <div className="text-sm text-muted-foreground">Success Rate</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-mathprimary to-mathsecondary">24/7</div>
                <div className="text-sm text-muted-foreground">Support</div>
              </div>
            </div>
          </div>
          
          <div className="w-full lg:w-1/2">
            <div className="relative mx-auto max-w-2xl">
              <DashboardPreview />
              <div className="absolute -inset-4 bg-gradient-to-r from-mathprimary to-mathsecondary opacity-30 blur-3xl -z-10"></div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
