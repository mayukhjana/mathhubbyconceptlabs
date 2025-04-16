
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { Switch } from "@/components/ui/switch";
import { X, Save } from "lucide-react";

export type QuestionData = {
  id?: string;
  question_text: string;
  option_a: string;
  option_b: string;
  option_c: string;
  option_d: string;
  correct_answer: string | string[];
  order_number: number;
  marks: number;
  negative_marks: number;
  is_multi_correct?: boolean;
  exam_id?: string; // Add this to match the backend type
};

interface QuestionFormProps {
  initialData?: QuestionData;
  onSave: (questionData: QuestionData) => void;
  onCancel?: () => void;
  index: number;
}

const QuestionForm = ({ initialData, onSave, onCancel, index }: QuestionFormProps) => {
  // Initialize with empty or provided data
  const [question, setQuestion] = useState<QuestionData>(
    initialData || {
      question_text: "",
      option_a: "",
      option_b: "",
      option_c: "",
      option_d: "",
      correct_answer: "a",
      order_number: index + 1,
      marks: 1,
      negative_marks: 0,
      is_multi_correct: false,
    }
  );

  // Handle multi-correct initialization
  const isInitiallyMultiCorrect = initialData?.is_multi_correct || false;
  const initialSelectedAnswers = (() => {
    if (Array.isArray(initialData?.correct_answer)) {
      return initialData.correct_answer;
    } else if (typeof initialData?.correct_answer === 'string' && initialData?.is_multi_correct) {
      return initialData.correct_answer.split(',');
    }
    return initialData?.correct_answer ? [initialData.correct_answer] : [];
  })();

  const [isMultiCorrect, setIsMultiCorrect] = useState(isInitiallyMultiCorrect);
  const [selectedAnswers, setSelectedAnswers] = useState<string[]>(initialSelectedAnswers);
  
  const handleChange = (field: keyof QuestionData, value: string | number | boolean) => {
    setQuestion({
      ...question,
      [field]: field === 'marks' || field === 'negative_marks' ? Number(value) : value,
    });
  };

  const handleMultiCorrectToggle = (checked: boolean) => {
    setIsMultiCorrect(checked);
    
    // Reset selected answers when toggling
    if (!checked) {
      // If switching to single answer, default to "a"
      setSelectedAnswers(["a"]);
      setQuestion(prev => ({
        ...prev,
        correct_answer: "a",
        is_multi_correct: false
      }));
    } else {
      // If switching to multi-answer, start empty
      setSelectedAnswers([]);
      setQuestion(prev => ({
        ...prev,
        correct_answer: [],
        is_multi_correct: true
      }));
    }
  };

  const handleCheckboxChange = (value: string) => {
    const newSelected = selectedAnswers.includes(value)
      ? selectedAnswers.filter(item => item !== value)
      : [...selectedAnswers, value];
    
    setSelectedAnswers(newSelected);
    setQuestion(prev => ({
      ...prev,
      correct_answer: newSelected
    }));
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Prepare the final question data
    const finalQuestion = {
      ...question,
      correct_answer: isMultiCorrect ? selectedAnswers : question.correct_answer,
      is_multi_correct: isMultiCorrect
    };
    
    console.log("Saving question:", finalQuestion);
    onSave(finalQuestion);
  };

  const isFormValid = () => {
    return (
      question.question_text.trim() !== "" &&
      question.option_a.trim() !== "" &&
      question.option_b.trim() !== "" &&
      question.option_c.trim() !== "" &&
      question.option_d.trim() !== "" &&
      question.marks > 0 &&
      (isMultiCorrect ? selectedAnswers.length > 0 : !!question.correct_answer)
    );
  };
  
  return (
    <form onSubmit={handleSubmit} className="border rounded-md p-4 mb-4">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-medium">Question #{question.order_number}</h3>
        {onCancel && (
          <Button 
            type="button" 
            variant="ghost" 
            size="sm" 
            onClick={onCancel}
            className="text-red-500 hover:text-red-700 hover:bg-red-50"
          >
            <X className="h-4 w-4 mr-1" /> Cancel
          </Button>
        )}
      </div>
      
      <div className="space-y-4">
        <div className="flex items-center space-x-2">
          <Switch
            checked={isMultiCorrect}
            onCheckedChange={handleMultiCorrectToggle}
            id={`multi-correct-${index}`}
          />
          <Label htmlFor={`multi-correct-${index}`}>Allow multiple correct answers</Label>
        </div>

        <div>
          <Label htmlFor={`question-${index}`}>Question Text</Label>
          <Textarea
            id={`question-${index}`}
            value={question.question_text}
            onChange={(e) => handleChange("question_text", e.target.value)}
            placeholder="Enter the question text here..."
            className="mt-1"
            rows={2}
            required
          />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor={`option-a-${index}`}>Option A</Label>
            <Input
              id={`option-a-${index}`}
              value={question.option_a}
              onChange={(e) => handleChange("option_a", e.target.value)}
              placeholder="Option A"
              className="mt-1"
              required
            />
          </div>
          
          <div>
            <Label htmlFor={`option-b-${index}`}>Option B</Label>
            <Input
              id={`option-b-${index}`}
              value={question.option_b}
              onChange={(e) => handleChange("option_b", e.target.value)}
              placeholder="Option B"
              className="mt-1"
              required
            />
          </div>
          
          <div>
            <Label htmlFor={`option-c-${index}`}>Option C</Label>
            <Input
              id={`option-c-${index}`}
              value={question.option_c}
              onChange={(e) => handleChange("option_c", e.target.value)}
              placeholder="Option C"
              className="mt-1"
              required
            />
          </div>
          
          <div>
            <Label htmlFor={`option-d-${index}`}>Option D</Label>
            <Input
              id={`option-d-${index}`}
              value={question.option_d}
              onChange={(e) => handleChange("option_d", e.target.value)}
              placeholder="Option D"
              className="mt-1"
              required
            />
          </div>
        </div>
        
        <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor={`marks-${index}`}>Marks for Correct Answer</Label>
            <Input
              id={`marks-${index}`}
              type="number"
              min="0"
              step="0.5"
              value={question.marks}
              onChange={(e) => handleChange("marks", e.target.value)}
              placeholder="Enter marks"
              className="mt-1"
              required
            />
          </div>
          
          <div>
            <Label htmlFor={`negative-marks-${index}`}>Negative Marks (if wrong)</Label>
            <Input
              id={`negative-marks-${index}`}
              type="number"
              min="0"
              step="0.5"
              value={question.negative_marks}
              onChange={(e) => handleChange("negative_marks", e.target.value)}
              placeholder="Enter negative marks"
              className="mt-1"
            />
          </div>
        </div>
        
        <div>
          <Label>Correct Answer{isMultiCorrect ? "s" : ""}</Label>
          {isMultiCorrect ? (
            <div className="grid grid-cols-2 gap-4 mt-2">
              {['a', 'b', 'c', 'd'].map((option) => (
                <div key={option} className="flex items-center space-x-2">
                  <Checkbox
                    id={`correct-${option}-${index}`}
                    checked={selectedAnswers.includes(option)}
                    onCheckedChange={() => handleCheckboxChange(option)}
                  />
                  <Label htmlFor={`correct-${option}-${index}`} className="cursor-pointer">
                    Option {option.toUpperCase()}
                  </Label>
                </div>
              ))}
            </div>
          ) : (
            <RadioGroup
              value={question.correct_answer as string}
              onValueChange={(value) => handleChange("correct_answer", value)}
              className="flex space-x-4 mt-1"
            >
              {['a', 'b', 'c', 'd'].map((option) => (
                <div key={option} className="flex items-center space-x-2">
                  <RadioGroupItem value={option} id={`correct-${option}-${index}`} />
                  <Label htmlFor={`correct-${option}-${index}`} className="cursor-pointer">
                    {option.toUpperCase()}
                  </Label>
                </div>
              ))}
            </RadioGroup>
          )}
        </div>
      </div>
      
      <Button 
        type="submit" 
        className="w-full mt-4"
        disabled={!isFormValid()}
      >
        <Save className="h-4 w-4 mr-2" />
        {initialData ? "Update Question" : "Save Question"}
      </Button>
    </form>
  );
};

export default QuestionForm;
