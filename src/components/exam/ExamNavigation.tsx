
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
    <div className="fixed bottom-0 left-0 right-0 bg-background/95 backdrop-blur-sm border-t p-4 z-40">
      <div className="container mx-auto flex justify-between items-center max-w-4xl">
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
          variant="default"
          onClick={onSubmit}
          className="gap-2 bg-mathprimary hover:bg-mathprimary/90"
        >
          <CheckSquare size={16} />
          Submit Exam
        </Button>
        
        <Button 
          variant="outline"
          onClick={onNext}
          disabled={currentQuestionIndex === totalQuestions - 1}
          className="gap-2"
        >
          Next
          <ArrowRight size={16} />
        </Button>
      </div>
    </div>
  );
};
