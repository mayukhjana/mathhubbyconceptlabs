
import { Button } from "@/components/ui/button";
import { Pencil, Trash } from "lucide-react";
import { QuestionData } from "@/components/QuestionForm";

interface MCQQuestionsListProps {
  questions: QuestionData[];
  onEditQuestion: (index: number) => void;
  onRemoveQuestion: (index: number) => void;
}

const MCQQuestionsList = ({ questions, onEditQuestion, onRemoveQuestion }: MCQQuestionsListProps) => {
  if (!questions.length) return null;

  return (
    <div className="space-y-4 mb-4">
      {questions.map((question, index) => (
        <div 
          key={index} 
          className="border rounded-md p-4 hover:border-mathprimary/50 transition-colors"
        >
          <div className="flex justify-between mb-2">
            <h4 className="font-medium">Question #{question.order_number}</h4>
            <div className="flex space-x-2">
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => onEditQuestion(index)}
              >
                <Pencil className="h-4 w-4" />
              </Button>
              <Button 
                variant="ghost" 
                size="sm"
                className="text-red-500 hover:text-red-700 hover:bg-red-50"
                onClick={() => onRemoveQuestion(index)}
              >
                <Trash className="h-4 w-4" />
              </Button>
            </div>
          </div>
          <p className="mb-2">{question.question_text}</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
            {['a', 'b', 'c', 'd'].map((option) => (
              <div 
                key={option}
                className={`p-2 rounded ${
                  question.correct_answer === option 
                    ? 'bg-green-100' 
                    : 'bg-gray-100'
                }`}
              >
                {option.toUpperCase()}: {question[`option_${option}` as keyof typeof question]}
                {question.correct_answer === option && (
                  <span className="ml-2 text-green-600 font-medium">(Correct)</span>
                )}
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default MCQQuestionsList;
