
import React from 'react';
import { Sparkles, AlertCircle } from "lucide-react";

interface MathHubHeaderProps {
  remainingQuestions: number;
  isPremium: boolean;
}

const MathHubHeader: React.FC<MathHubHeaderProps> = ({ remainingQuestions, isPremium }) => {
  return (
    <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
      <div>
        <h1 className="text-3xl font-bold flex items-center">
          <Sparkles className="mr-2 h-8 w-8 text-mathprimary" />
          MathHub AI
        </h1>
        <p className="text-muted-foreground mt-1">
          Your personal math tutor powered by AI
        </p>
      </div>
      
      {!isPremium && (
        <div className="bg-amber-50 dark:bg-amber-950/30 px-4 py-2 rounded-lg text-amber-800 dark:text-amber-300 text-sm flex items-center">
          <AlertCircle className="h-4 w-4 mr-2" />
          <span>{5 - remainingQuestions} of 5 free questions remaining today</span>
        </div>
      )}
    </div>
  );
};

export default MathHubHeader;
