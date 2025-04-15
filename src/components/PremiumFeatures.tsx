
import { Award, CheckCircle, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const PremiumFeatures = () => {
  const features = [
    {
      title: "Unlimited Downloads",
      description: "Access and download unlimited papers and resources"
    },
    {
      title: "Advanced Practice Tests",
      description: "Exclusive access to all advanced MCQ exams with detailed solutions"
    },
    {
      title: "Performance Analytics",
      description: "Detailed tracking of your progress and areas for improvement"
    },
    {
      title: "Ad-Free Experience",
      description: "Enjoy uninterrupted learning without any distractions"
    },
    {
      title: "Priority Support",
      description: "Get faster responses from our education specialists"
    }
  ];

  return (
    <div className="w-full lg:w-1/2 bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10">
      <div className="inline-flex items-center px-3 py-1 rounded-full bg-mathprimary/20 text-mathprimary dark:text-blue-300 text-sm mb-6">
        <Award className="w-4 h-4 mr-2" />
        <span>Premium Features</span>
      </div>
      
      <h2 className="text-3xl font-bold mb-6">Elevate Your Learning Experience</h2>
      <p className="text-gray-300 mb-8">
        Join thousands of students who have transformed their math performance with our premium tools and resources.
      </p>
      
      <div className="space-y-5 mb-8">
        {features.map((feature) => (
          <div key={feature.title} className="flex items-start gap-3">
            <CheckCircle className="h-6 w-6 text-mathprimary dark:text-blue-400 shrink-0 mt-0.5" />
            <div>
              <h4 className="font-medium text-white">{feature.title}</h4>
              <p className="text-gray-300 text-sm">{feature.description}</p>
            </div>
          </div>
        ))}
      </div>
      
      <Button className="w-full bg-white text-mathdark hover:bg-gray-100 dark:hover:bg-gray-200" size="lg" asChild>
        <Link to="/premium">Get Started Today</Link>
      </Button>
    </div>
  );
};

export default PremiumFeatures;
