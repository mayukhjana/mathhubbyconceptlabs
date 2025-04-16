
import { useState } from "react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Check, X, AlertCircle } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";

export interface Question {
  id: string;
  text: string;
  options: {
    id: string;
    text: string;
  }[];
  correctAnswer: string | string[];
  marks: number;
  negative_marks: number;
  is_multi_correct?: boolean;
}

interface QuestionCardProps {
  question: Question;
  onAnswer: (questionId: string, selectedOption: string) => void;
  userAnswer?: string;
  showResult?: boolean;
  questionNumber: number;
  skipped?: boolean;
}

const QuestionCard = ({
  question,
  onAnswer,
  userAnswer,
  showResult = false,
  questionNumber,
  skipped = false,
}: QuestionCardProps) => {
  const [selectedOption, setSelectedOption] = useState<string | undefined>(userAnswer);
  
  const handleOptionChange = (optionId: string) => {
    if (showResult) return;
    
    setSelectedOption(optionId);
    onAnswer(question.id, optionId);
  };
  
  // Determine if answer is correct
  const isCorrect = showResult && !skipped && 
    (Array.isArray(question.correctAnswer) 
      ? question.correctAnswer.includes(selectedOption || '')
      : selectedOption === question.correctAnswer);

  const isIncorrect = showResult && !skipped && 
    (Array.isArray(question.correctAnswer)
      ? !question.correctAnswer.includes(selectedOption || '') && selectedOption !== undefined
      : selectedOption !== question.correctAnswer && selectedOption !== undefined);
  
  return (
    <div className="p-6 bg-white rounded-lg shadow-sm border mb-6">
      <div className="flex items-start gap-3">
        <div className="bg-mathlight text-mathprimary font-semibold rounded-full w-8 h-8 flex items-center justify-center shrink-0">
          {questionNumber}
        </div>
        <div className="w-full">
          <div className="flex justify-between items-start mb-4">
            <h3 className="text-lg font-medium">
              {question.text}
              {question.is_multi_correct && (
                <span className="ml-2 text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded">
                  Multiple Correct
                </span>
              )}
            </h3>
            <div className="text-sm text-gray-500 shrink-0">
              <span className="font-medium text-mathprimary">{question.marks} mark{question.marks !== 1 && 's'}</span>
              {question.negative_marks > 0 && (
                <span className="ml-1 text-red-500">(-{question.negative_marks})</span>
              )}
            </div>
          </div>
          
          <RadioGroup
            value={selectedOption}
            className="space-y-3"
          >
            {question.options.map((option) => {
              const isOptionCorrect = showResult && 
                (Array.isArray(question.correctAnswer) 
                  ? question.correctAnswer.includes(option.id)
                  : option.id === question.correctAnswer);
              
              const isOptionIncorrect = showResult && 
                selectedOption === option.id && 
                (Array.isArray(question.correctAnswer)
                  ? !question.correctAnswer.includes(option.id)
                  : option.id !== question.correctAnswer);
              
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
              isIncorrect ? "bg-red-50 text-red-800 border border-red-200" :
              skipped ? "bg-gray-50 text-gray-800 border border-gray-200" : ""
            }`}>
              {isCorrect ? (
                <div className="flex items-center gap-2">
                  <Check className="h-5 w-5" />
                  <span>Correct answer! (+{question.marks} marks)</span>
                </div>
              ) : isIncorrect ? (
                <div className="flex items-center gap-2">
                  <X className="h-5 w-5" />
                  <span>
                    Incorrect. {question.negative_marks > 0 && `(-${question.negative_marks} marks) `}
                    The correct answer is: {
                      Array.isArray(question.correctAnswer)
                        ? question.correctAnswer.map(id => 
                            question.options.find(o => o.id === id)?.text
                          ).filter(Boolean).join(", ")
                        : question.options.find(o => o.id === question.correctAnswer)?.text
                    }
                  </span>
                </div>
              ) : skipped && (
                <div className="flex items-center gap-2">
                  <AlertCircle className="h-5 w-5" />
                  <span>
                    Question skipped. (0 marks)
                    The correct answer is: {
                      Array.isArray(question.correctAnswer)
                        ? question.correctAnswer.map(id => 
                            question.options.find(o => o.id === id)?.text
                          ).filter(Boolean).join(", ")
                        : question.options.find(o => o.id === question.correctAnswer)?.text
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
