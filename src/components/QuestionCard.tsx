import { useState } from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";

interface QuestionCardProps {
  question: {
    id: string;
    text: string;
    options: { id: string; text: string }[];
    correctAnswer: string | string[];
    marks: number;
    negative_marks: number;
    is_multi_correct: boolean;
    image_url?: string;
  };
  onAnswer: (id: string, answer: string) => void;
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
  skipped = false
}: QuestionCardProps) => {
  const [selectedAnswer, setSelectedAnswer] = useState(userAnswer || "");

  const handleAnswerChange = (answer: string) => {
    setSelectedAnswer(answer);
    onAnswer(question.id, answer);
  };

  const isCorrectAnswer = (selected: string, correct: string | string[]): boolean => {
    if (Array.isArray(correct)) {
      return correct.includes(selected);
    }
    return selected === correct;
  };

  return (
    <Card className={cn(
      "transition-colors",
      showResult && userAnswer ? (
        isCorrectAnswer(userAnswer, question.correctAnswer) ? "border-green-500" : "border-red-500"
      ) : ""
    )}>
      <CardHeader>
        <CardTitle className="flex justify-between items-start">
          <span>Question {questionNumber}</span>
          <span className="text-sm text-muted-foreground">
            {question.marks} marks {question.negative_marks > 0 && `(-${question.negative_marks} negative)`}
          </span>
        </CardTitle>
        <CardDescription>
          {question.text}
          {question.image_url && (
            <img 
              src={question.image_url} 
              alt="Question" 
              className="max-w-full h-auto mt-2 rounded-lg" 
            />
          )}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {question.is_multi_correct ? (
          <div className="space-y-2">
            {question.options.map((option) => (
              <div key={option.id} className="flex items-center space-x-2">
                <Checkbox
                  id={`question-${question.id}-option-${option.id}`}
                  checked={userAnswer ? userAnswer.split(',').includes(option.id) : false}
                  onCheckedChange={(checked) => {
                    let updatedAnswers: string[];
                    if (userAnswer) {
                      updatedAnswers = userAnswer.split(',');
                    } else {
                      updatedAnswers = [];
                    }
        
                    if (checked) {
                      updatedAnswers.push(option.id);
                    } else {
                      updatedAnswers = updatedAnswers.filter((ans) => ans !== option.id);
                    }
        
                    handleAnswerChange(updatedAnswers.sort().join(','));
                  }}
                />
                <Label
                  htmlFor={`question-${question.id}-option-${option.id}`}
                  className="cursor-pointer"
                >
                  {option.text}
                </Label>
              </div>
            ))}
          </div>
        ) : (
          <RadioGroup defaultValue={userAnswer} onValueChange={handleAnswerChange}>
            <div className="grid gap-2">
              {question.options.map((option) => (
                <div key={option.id} className="flex items-center space-x-2">
                  <RadioGroupItem value={option.id} id={option.id} />
                  <Label htmlFor={option.id}>{option.text}</Label>
                </div>
              ))}
            </div>
          </RadioGroup>
        )}
      </CardContent>
      {showResult && (
        <CardFooter className="justify-between">
          {skipped ? (
            <span className="text-sm text-orange-500">Skipped</span>
          ) : isCorrectAnswer(userAnswer, question.correctAnswer) ? (
            <span className="text-sm text-green-500">Correct Answer</span>
          ) : (
            <span className="text-sm text-red-500">Incorrect Answer</span>
          )}
          {showResult && (
            <span className="text-sm text-muted-foreground">
              Correct Answer: {Array.isArray(question.correctAnswer) ? question.correctAnswer.join(', ') : question.correctAnswer}
            </span>
          )}
        </CardFooter>
      )}
    </Card>
  );
};

const isCorrectAnswer = (selected: string, correct: string | string[]): boolean => {
    if (Array.isArray(correct)) {
      const selectedAnswers = selected.split(',').sort();
      const correctAnswers = correct.sort();
      return selectedAnswers.length === correctAnswers.length && selectedAnswers.every((value, index) => value === correctAnswers[index]);
    }
    return selected === correct;
  };

export default QuestionCard;
