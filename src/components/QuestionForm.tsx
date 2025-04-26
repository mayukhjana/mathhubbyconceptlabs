import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Check, X } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import QuestionImageUpload from "./question/QuestionImageUpload";
import QuestionOptions from "./question/QuestionOptions";
import CorrectAnswerSelection from "./question/CorrectAnswerSelection";
import { useQuestionForm } from "@/hooks/useQuestionForm";
import type { Question } from "@/services/exam/types";

interface QuestionFormProps {
  initialData?: Question;
  onSave: (question: Question) => void;
  onCancel: () => void;
  index: number;
}

const QuestionForm = ({ initialData, onSave, onCancel, index }: QuestionFormProps) => {
  const {
    formData,
    setFormData,
    imageUrl,
    selectedCorrectAnswers,
    handleImageUpload,
    handleCorrectAnswerChange,
    handleSubmit,
  } = useQuestionForm({ initialData, onSave, index });

  return (
    <Card>
      <form onSubmit={handleSubmit}>
        <CardHeader>
          <CardTitle>Question {index + 1}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center space-x-2 mb-4">
            <Switch
              id={`is-image-question-${index}`}
              checked={formData.is_image_question}
              onCheckedChange={(checked) => setFormData({ ...formData, is_image_question: checked })}
            />
            <Label htmlFor={`is-image-question-${index}`}>Use Image Question</Label>
          </div>

          {formData.is_image_question ? (
            <div className="space-y-2">
              <Label>Question Image</Label>
              <QuestionImageUpload
                imageUrl={imageUrl}
                index={index}
                onImageUpload={handleImageUpload}
              />
            </div>
          ) : (
            <div className="space-y-2">
              <Label>Question Text</Label>
              <Textarea
                value={formData.question_text}
                onChange={(e) => setFormData({ ...formData, question_text: e.target.value })}
                required
              />
            </div>
          )}

          <div className="space-y-2">
            <Label>Question Image (Optional)</Label>
            <QuestionImageUpload
              imageUrl={imageUrl}
              index={index}
              onImageUpload={handleImageUpload}
            />
          </div>

          <QuestionOptions
            options={{
              a: formData.option_a,
              b: formData.option_b,
              c: formData.option_c,
              d: formData.option_d
            }}
            onChange={(key, value) => setFormData({ ...formData, [key]: value })}
          />

          <div className="space-y-2">
            <Label>Correct Answer</Label>
            <CorrectAnswerSelection
              isMultiCorrect={formData.is_multi_correct}
              selectedAnswers={selectedCorrectAnswers}
              correctAnswer={formData.correct_answer as string}
              index={index}
              onAnswerChange={handleCorrectAnswerChange}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Marks</Label>
              <Input
                type="number"
                min="0"
                value={String(formData.marks)}
                onChange={(e) => setFormData({ ...formData, marks: Number(e.target.value) })}
              />
            </div>
            <div className="space-y-2">
              <Label>Negative Marks</Label>
              <Input
                type="number"
                min="0"
                value={String(formData.negative_marks)}
                onChange={(e) => setFormData({ ...formData, negative_marks: Number(e.target.value) })}
              />
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <Switch
              id={`is-multi-correct-${index}`}
              checked={formData.is_multi_correct}
              onCheckedChange={(checked) => setFormData({ ...formData, is_multi_correct: checked })}
            />
            <Label htmlFor={`is-multi-correct-${index}`}>Multiple Correct Answers</Label>
          </div>
        </CardContent>
        <CardFooter className="flex justify-end space-x-2">
          <Button variant="outline" onClick={onCancel}>
            <X className="h-4 w-4 mr-2" /> Cancel
          </Button>
          <Button type="submit">
            <Check className="h-4 w-4 mr-2" /> Save Question
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
};

export default QuestionForm;
