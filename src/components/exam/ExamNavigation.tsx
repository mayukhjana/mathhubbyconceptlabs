
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
    <div className="fixed bottom-0 left-0 right-0 bg-background/95 backdrop-blur-sm border-t p-2 sm:p-4 z-40">
      <div className="container mx-auto flex justify-between items-center gap-2 max-w-4xl px-2">
        {/* Left group: Previous and Next buttons */}
        <div className="flex items-center gap-2">
          <Button 
            variant="outline" 
            onClick={onPrevious}
            disabled={currentQuestionIndex === 0}
            className="gap-1 sm:gap-2 text-xs sm:text-sm px-2 sm:px-4"
          >
            <ArrowLeft size={16} className="hidden sm:block" />
            <ArrowLeft size={14} className="sm:hidden" />
            <span className="hidden sm:inline">Previous</span>
            <span className="sm:hidden">Prev</span>
          </Button>
          
          <Button 
            variant={currentQuestionIndex === totalQuestions - 1 ? "secondary" : "outline"}
            onClick={onNext}
            disabled={currentQuestionIndex === totalQuestions - 1}
            className="gap-1 sm:gap-2 text-xs sm:text-sm px-2 sm:px-4"
          >
            <span>Next</span>
            <ArrowRight size={16} className="hidden sm:block" />
            <ArrowRight size={14} className="sm:hidden" />
          </Button>
        </div>
        
        {/* Right group: Submit button */}
        <Button 
          variant="default"
          onClick={onSubmit}
          className="gap-1 sm:gap-2 bg-mathprimary hover:bg-mathprimary/90 text-xs sm:text-sm px-2 sm:px-4"
        >
          <CheckSquare size={16} className="hidden sm:block" />
          <CheckSquare size={14} className="sm:hidden" />
          <span className="hidden sm:inline">Submit Exam</span>
          <span className="sm:hidden">Submit</span>
        </Button>
      </div>
    </div>
  );
};
