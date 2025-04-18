
import { Crown } from "lucide-react";

const PremiumHeader = () => {
  return (
    <div className="bg-gradient-to-b from-mathprimary/10 to-transparent">
      <div className="container mx-auto px-4 py-16 text-center">
        <div className="flex justify-center mb-4">
          <Crown className="h-16 w-16 text-yellow-500" />
        </div>
        <h1 className="text-4xl md:text-5xl font-bold mb-6">
          Upgrade to Premium
        </h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Get unlimited access to all premium question papers, personalized learning paths, 
          and advanced tools to ace your exams.
        </p>
      </div>
    </div>
  );
};

export default PremiumHeader;
