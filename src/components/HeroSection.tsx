
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, Database, BookOpen, Star } from "lucide-react";

const HeroSection = () => {
  return (
    <section className="relative overflow-hidden pt-16 md:pt-20 pb-16 md:pb-24">
      {/* Background Pattern */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-0 left-0 right-0 h-[500px] bg-gradient-to-b from-mathprimary/5 to-transparent dark:from-mathprimary/10 dark:to-transparent"></div>
        <div className="absolute bottom-24 left-0 w-72 h-72 bg-mathprimary/10 dark:bg-mathprimary/5 rounded-full filter blur-3xl"></div>
        <div className="absolute top-32 right-10 w-96 h-96 bg-mathsecondary/10 dark:bg-mathsecondary/5 rounded-full filter blur-3xl"></div>
      </div>
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-16">
          <div className="w-full lg:w-1/2 text-center lg:text-left">
            <div className="inline-flex items-center px-3 py-1 rounded-full bg-mathprimary/10 dark:bg-mathprimary/20 text-mathprimary dark:text-blue-300 text-sm mb-6">
              <Star className="w-4 h-4 mr-2" />
              <span>Trusted by 75,000+ students across India</span>
            </div>
            
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-mathdark dark:text-white mb-6 tracking-tight leading-tight">
              Excel in Mathematics with <span className="text-mathprimary dark:text-blue-400 relative">
                Confidence
                <svg className="absolute -bottom-1 left-0 w-full" viewBox="0 0 200 10" xmlns="http://www.w3.org/2000/svg">
                  <path d="M0,5 Q50,0 100,5 T200,5" fill="none" stroke="currentColor" strokeWidth="2" opacity="0.5" />
                </svg>
              </span>
            </h1>
            
            <p className="text-lg text-mathdark/70 dark:text-gray-300 mb-8 max-w-xl mx-auto lg:mx-0">
              Access thousands of practice papers, interactive exams, and personalized analytics for ICSE, CBSE, and West Bengal boards.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Button size="lg" className="gap-2 bg-mathprimary hover:bg-mathprimary/90 dark:bg-blue-600 dark:hover:bg-blue-700">
                <span>Start Learning</span>
                <ArrowRight size={16} />
              </Button>
              <Button size="lg" variant="outline" className="border-mathprimary/30 text-mathprimary dark:border-blue-500/30 dark:text-blue-400 hover:bg-mathprimary/5 dark:hover:bg-blue-900/20" asChild>
                <Link to="/boards">Browse Papers</Link>
              </Button>
            </div>
            
            <div className="mt-10 flex items-center gap-6 justify-center lg:justify-start">
              <div className="flex -space-x-2">
                {[1, 2, 3, 4].map(i => <div key={i} className="w-8 h-8 rounded-full border-2 border-white dark:border-gray-800 bg-slate-50">
                    <span className="sr-only">User</span>
                  </div>)}
              </div>
              <div className="text-sm text-mathdark/70 dark:text-gray-400">
                <span className="font-semibold text-mathdark dark:text-white">4.9/5</span> from over 5,000 reviews
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
