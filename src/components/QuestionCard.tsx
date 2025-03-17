
import { useState } from "react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Check, X } from "lucide-react";

export interface Question {
  id: string;
  text: string;
  options: {
    id: string;
    text: string;
  }[];
  correctAnswer: string;
}

interface QuestionCardProps {
  question: Question;
  onAnswer: (questionId: string, selectedOption: string) => void;
  userAnswer?: string;
  showResult?: boolean;
  questionNumber: number;
}

const QuestionCard = ({
  question,
  onAnswer,
  userAnswer,
  showResult = false,
  questionNumber,
}: QuestionCardProps) => {
  const [selectedOption, setSelectedOption] = useState<string | undefined>(userAnswer);
  
  const handleOptionChange = (optionId: string) => {
    if (showResult) return;
    
    setSelectedOption(optionId);
    onAnswer(question.id, optionId);
  };
  
  const isCorrect = showResult && selectedOption === question.correctAnswer;
  const isIncorrect = showResult && selectedOption !== question.correctAnswer;
  
  return (
    <div className="p-6 bg-white rounded-lg shadow-sm border mb-6">
      <div className="flex items-start gap-3">
        <div className="bg-mathlight text-mathprimary font-semibold rounded-full w-8 h-8 flex items-center justify-center shrink-0">
          {questionNumber}
        </div>
        <div className="w-full">
          <h3 className="text-lg font-medium mb-4">{question.text}</h3>
          
          <RadioGroup
            value={selectedOption}
            className="space-y-3"
          >
            {question.options.map((option) => {
              const isOptionCorrect = showResult && option.id === question.correctAnswer;
              const isOptionIncorrect = showResult && selectedOption === option.id && option.id !== question.correctAnswer;
              
              return (
                <div
                  key={option.id}
                  className={`flex items-center space-x-2 p-3 rounded-md border ${
                    isOptionCorrect 
                      ? "bg-green-50 border-green-200"
                      : isOptionIncorrect
                        ? "bg-red-50 border-red-200"
                        : selectedOption === option.id
                          ? "bg-mathlight border-mathprimary/30"
                          : "hover:bg-muted/50"
                  }`}
                  onClick={() => handleOptionChange(option.id)}
                >
                  <RadioGroupItem
                    value={option.id}
                    id={`${question.id}-${option.id}`}
                    disabled={showResult}
                    className={isOptionCorrect ? "text-green-600" : isOptionIncorrect ? "text-red-600" : ""}
                  />
                  <Label
                    htmlFor={`${question.id}-${option.id}`}
                    className="w-full cursor-pointer flex items-center justify-between"
                  >
                    <span>{option.text}</span>
                    {isOptionCorrect && <Check className="h-4 w-4 text-green-600" />}
                    {isOptionIncorrect && <X className="h-4 w-4 text-red-600" />}
                  </Label>
                </div>
              );
            })}
          </RadioGroup>
          
          {showResult && (
            <div className={`mt-4 p-3 rounded-md ${
              isCorrect ? "bg-green-50 text-green-800 border border-green-200" : 
              isIncorrect ? "bg-red-50 text-red-800 border border-red-200" : ""
            }`}>
              {isCorrect ? (
                <div className="flex items-center gap-2">
                  <Check className="h-5 w-5" />
                  <span>Correct answer!</span>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <X className="h-5 w-5" />
                  <span>
                    Incorrect. The correct answer is: {
                      question.options.find(o => o.id === question.correctAnswer)?.text
                    }
                  </span>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default QuestionCard;
