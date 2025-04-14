
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { X, PlusCircle, Save } from "lucide-react";

export type QuestionData = {
  id?: string;
  question_text: string;
  option_a: string;
  option_b: string;
  option_c: string;
  option_d: string;
  correct_answer: "a" | "b" | "c" | "d";
  order_number: number;
};

interface QuestionFormProps {
  initialData?: QuestionData;
  onSave: (questionData: QuestionData) => void;
  onCancel?: () => void;
  index: number;
}

const QuestionForm = ({ initialData, onSave, onCancel, index }: QuestionFormProps) => {
  const [question, setQuestion] = useState<QuestionData>(
    initialData || {
      question_text: "",
      option_a: "",
      option_b: "",
      option_c: "",
      option_d: "",
      correct_answer: "a",
      order_number: index + 1,
    }
  );
  
  const handleChange = (field: keyof QuestionData, value: string) => {
    setQuestion({
      ...question,
      [field]: value,
    });
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(question);
  };

  const isFormValid = () => {
    return (
      question.question_text.trim() !== "" &&
      question.option_a.trim() !== "" &&
      question.option_b.trim() !== "" &&
      question.option_c.trim() !== "" &&
      question.option_d.trim() !== "" 
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
        
        <div>
          <Label>Correct Answer</Label>
          <RadioGroup
            value={question.correct_answer}
            onValueChange={(value) => handleChange("correct_answer", value as "a" | "b" | "c" | "d")}
            className="flex space-x-4 mt-1"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="a" id={`correct-a-${index}`} />
              <Label htmlFor={`correct-a-${index}`} className="cursor-pointer">A</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="b" id={`correct-b-${index}`} />
              <Label htmlFor={`correct-b-${index}`} className="cursor-pointer">B</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="c" id={`correct-c-${index}`} />
              <Label htmlFor={`correct-c-${index}`} className="cursor-pointer">C</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="d" id={`correct-d-${index}`} />
              <Label htmlFor={`correct-d-${index}`} className="cursor-pointer">D</Label>
            </div>
          </RadioGroup>
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
