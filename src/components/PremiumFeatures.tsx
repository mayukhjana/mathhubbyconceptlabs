
import { Award, CheckCircle } from "lucide-react";

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
    <div className="bg-white/5 backdrop-blur-sm rounded-xl p-8 border border-white/10 h-full">
      <div className="flex items-center gap-3 mb-6">
        <Award className="text-yellow-500 h-6 w-6" />
        <h3 className="text-xl font-bold">Premium Benefits</h3>
      </div>
      
      <ul className="space-y-4">
        {features.map((feature, index) => (
          <li key={index} className="flex gap-3">
            <CheckCircle className="h-5 w-5 text-green-500 shrink-0 mt-0.5" />
            <div>
              <h4 className="font-medium text-white">{feature.title}</h4>
              <p className="text-gray-300 text-sm">{feature.description}</p>
            </div>
          </li>
        ))}
      </ul>
      
      <div className="mt-6 pt-6 border-t border-white/10">
        <div className="flex items-center gap-2">
          <Sparkles className="h-4 w-4 text-yellow-500" />
          <p className="text-sm text-gray-300">Join thousands of successful students</p>
        </div>
      </div>
    </div>
  );
};

export default PremiumFeatures;
