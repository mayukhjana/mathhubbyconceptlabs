
import { Award, CheckCircle, Sparkles } from "lucide-react";

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
    <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-full bg-yellow-400/20 flex items-center justify-center">
          <Sparkles className="w-5 h-5 text-yellow-400" />
        </div>
        <h3 className="text-2xl font-bold">Premium Benefits</h3>
      </div>
      
      <ul className="space-y-6">
        {features.map((feature, index) => (
          <li key={index} className="flex gap-4">
            <div className="mt-0.5">
              <CheckCircle className="w-5 h-5 text-green-400" />
            </div>
            <div>
              <h4 className="text-lg font-medium mb-1">{feature.title}</h4>
              <p className="text-gray-300">{feature.description}</p>
            </div>
          </li>
        ))}
      </ul>
      
      <div className="mt-8 p-4 bg-gradient-to-r from-yellow-400/20 to-amber-400/20 rounded-xl">
        <div className="flex items-center gap-2 mb-2">
          <Award className="w-5 h-5 text-yellow-400" />
          <p className="font-medium">Students who upgrade see a 35% increase in test scores</p>
        </div>
        <p className="text-sm text-gray-300">Based on average improvement after 3 months of premium access</p>
      </div>
    </div>
  );
};

export default PremiumFeatures;
