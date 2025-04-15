
import { Award, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const PremiumFeatures = () => {
  const features = [
    {
      title: "Unlimited Downloads",
      description: "Download as many papers as you need"
    },
    {
      title: "Advanced Practice Tests",
      description: "Access to all MCQ exams with detailed solutions"
    },
    {
      title: "Performance Tracking",
      description: "Track your performance and identify areas for improvement"
    },
    {
      title: "Ad-Free Experience",
      description: "Enjoy an uninterrupted learning experience"
    }
  ];

  return (
    <div className="w-full lg:w-1/2">
      <div className="inline-flex items-center px-3 py-1 rounded-full bg-white/10 text-white text-sm mb-6">
        <Award className="w-4 h-4 mr-2" />
        <span>Premium Experience</span>
      </div>
      
      <h2 className="text-3xl font-bold mb-6">Upgrade to MathHub Premium</h2>
      <p className="text-gray-300 mb-8">
        Get unlimited access to all papers, practice exams, and exclusive resources to ace your math exams.
      </p>
      
      <div className="space-y-4">
        {features.map((feature) => (
          <div key={feature.title} className="flex items-start gap-3">
            <CheckCircle className="h-6 w-6 text-mathprimary dark:text-blue-400 shrink-0 mt-0.5" />
            <div>
              <h4 className="font-medium">{feature.title}</h4>
              <p className="text-gray-300 text-sm">{feature.description}</p>
            </div>
          </div>
        ))}
      </div>
      
      <div className="mt-8">
        <Button className="bg-white text-mathdark hover:bg-gray-100 dark:hover:bg-gray-200" size="lg" asChild>
          <Link to="/premium">Upgrade Now</Link>
        </Button>
      </div>
    </div>
  );
};

export default PremiumFeatures;
