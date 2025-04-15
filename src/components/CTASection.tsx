
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const CTASection = () => {
  return (
    <section className="py-16 bg-mathprimary dark:bg-blue-700 text-white">
      <div className="container mx-auto px-4 text-center">
        <h2 className="text-3xl font-bold mb-6">Ready to Excel in Mathematics?</h2>
        <p className="text-xl mb-8 max-w-2xl mx-auto">
          Join thousands of students who have improved their math scores with MathHub.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button size="lg" variant="secondary" className="bg-white text-mathprimary dark:text-blue-700 hover:bg-gray-100 dark:hover:bg-gray-100" asChild>
            <Link to="/boards">Browse Papers</Link>
          </Button>
          <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10" asChild>
            <Link to="/premium" className="text-black">Get Premium</Link>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default CTASection;
