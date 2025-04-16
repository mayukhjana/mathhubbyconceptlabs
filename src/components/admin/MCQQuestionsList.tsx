
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

  const calculateTotalMarks = () => {
    const totalPositive = questions.reduce((sum, q) => sum + q.marks, 0);
    return totalPositive;
  };

  return (
    <div className="space-y-4 mb-4">
      <div className="flex justify-between items-center bg-muted/50 p-3 rounded-md">
        <span className="font-medium">Total Questions: {questions.length}</span>
        <span className="font-medium text-mathprimary">Maximum Marks: {calculateTotalMarks()}</span>
      </div>
      
      {questions.map((question, index) => (
        <div 
          key={index} 
          className="border rounded-md p-4 hover:border-mathprimary/50 transition-colors"
        >
          <div className="flex justify-between mb-2">
            <div>
              <h4 className="font-medium">
                Question #{question.order_number}
                {question.is_multi_correct && (
                  <span className="ml-2 text-sm text-blue-600">(Multiple Correct)</span>
                )}
              </h4>
              <div className="text-sm text-muted-foreground mt-1">
                Marks: +{question.marks} | Wrong Answer: -{question.negative_marks}
              </div>
            </div>
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
            {['a', 'b', 'c', 'd'].map((option) => {
              const isCorrect = Array.isArray(question.correct_answer)
                ? question.correct_answer.includes(option)
                : question.correct_answer === option;
              
              return (
                <div 
                  key={option}
                  className={`p-2 rounded ${
                    isCorrect 
                      ? 'bg-green-100' 
                      : 'bg-gray-100'
                  }`}
                >
                  {option.toUpperCase()}: {question[`option_${option}` as keyof typeof question]}
                  {isCorrect && (
                    <span className="ml-2 text-green-600 font-medium">(Correct)</span>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
};

export default MCQQuestionsList;
