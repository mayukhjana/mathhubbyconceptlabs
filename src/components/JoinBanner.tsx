
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const JoinBanner = () => {
  return (
    <section className="py-20 bg-gradient-to-r from-mathprimary to-mathsecondary">
      <div className="container mx-auto px-4 text-center">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Join Concept Academy
          </h2>
          <p className="text-lg md:text-xl text-white/90 mb-8">
            Access comprehensive study materials, practice resources, and expert guidance to excel in your mathematical journey.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" variant="secondary" className="bg-white text-mathprimary hover:bg-gray-100" asChild>
              <Link to="/resources/study-materials">
                Study Materials
                <ArrowRight size={16} />
              </Link>
            </Button>
            <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10" asChild>
              <Link to="/resources">Browse Resources</Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default JoinBanner;
