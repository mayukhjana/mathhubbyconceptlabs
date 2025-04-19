import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface CorrectAnswerSelectionProps {
  isMultiCorrect: boolean;
  selectedAnswers: string[];
  correctAnswer: string | string[];
  index: number;
  onAnswerChange: (option: string) => void;
}

const CorrectAnswerSelection = ({
  isMultiCorrect,
  selectedAnswers,
  correctAnswer,
  index,
  onAnswerChange
}: CorrectAnswerSelectionProps) => {
  return (
    <div className="flex gap-4">
      {['a', 'b', 'c', 'd'].map((option) => (
        <div key={option} className="flex items-center space-x-2">
          <Input
            type={isMultiCorrect ? "checkbox" : "radio"}
            id={`correct-${option}-${index}`}
            name={`correct-answer-${index}`}
            checked={
              isMultiCorrect
                ? selectedAnswers.includes(option)
                : correctAnswer === option
            }
            onChange={() => onAnswerChange(option)}
          />
          <Label htmlFor={`correct-${option}-${index}`}>{option.toUpperCase()}</Label>
        </div>
      ))}
    </div>
  );
};

export default CorrectAnswerSelection;
