
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const CTASection = () => {
  return (
    <section className="relative py-20 overflow-hidden">
      {/* Gradient Background */}
      <div className="absolute inset-0 bg-primary"></div>
      <div className="absolute inset-0 bg-gradient-to-t from-primary/80 to-primary"></div>
      
      {/* Decorative Elements */}
      <div className="absolute top-10 right-10 w-64 h-64 bg-white/5 rounded-full blur-3xl"></div>
      <div className="absolute bottom-10 left-10 w-48 h-48 bg-white/5 rounded-full blur-3xl"></div>
      
      <div className="container mx-auto px-4 text-center relative z-10">
        <h2 className="text-3xl md:text-4xl font-bold mb-6 text-white">Ready to Excel in Mathematics?</h2>
        <p className="text-xl mb-10 max-w-2xl mx-auto text-white/90">
          Join thousands of students who have improved their math scores with MathHub.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button size="lg" className="bg-white text-mathprimary hover:bg-white/90 hover:scale-105 transition-all duration-300 shadow-xl h-14 px-8" asChild>
            <Link to="/boards">Browse Papers</Link>
          </Button>
          <Button size="lg" className="border-2 border-white/30 bg-white/10 text-white hover:bg-white/20 backdrop-blur-sm h-14 px-8" asChild>
            <Link to="/premium">Get Premium</Link>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default CTASection;
