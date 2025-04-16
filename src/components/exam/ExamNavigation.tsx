
import { ArrowLeft, ArrowRight, CheckSquare } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ExamNavigationProps {
  currentQuestionIndex: number;
  totalQuestions: number;
  onPrevious: () => void;
  onNext: () => void;
  onSubmit: () => void;
}

export const ExamNavigation = ({
  currentQuestionIndex,
  totalQuestions,
  onPrevious,
  onNext,
  onSubmit,
}: ExamNavigationProps) => {
  return (
    <div className="flex justify-between mt-6">
      <Button 
        variant="outline" 
        onClick={onPrevious}
        disabled={currentQuestionIndex === 0}
        className="gap-2"
      >
        <ArrowLeft size={16} />
        Previous
      </Button>
      
      <Button 
        variant="outline"
        onClick={onSubmit}
        className="gap-2"
      >
        <CheckSquare size={16} />
        Submit Exam
      </Button>
      
      <Button 
        onClick={onNext}
        disabled={currentQuestionIndex === totalQuestions - 1}
        className="gap-2"
      >
        Next
        <ArrowRight size={16} />
      </Button>
    </div>
  );
};
