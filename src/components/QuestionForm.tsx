import { useState } from "react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Check, X, Upload, Image } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export interface QuestionData {
  id?: string;
  question_text: string;
  option_a: string;
  option_b: string;
  option_c: string;
  option_d: string;
  correct_answer: string | string[];
  marks: number;
  negative_marks: number;
  is_multi_correct: boolean;
  order_number: number;
  exam_id?: string;
  image_url?: string;
}

interface QuestionFormProps {
  initialData?: QuestionData;
  onSave: (question: QuestionData) => void;
  onCancel: () => void;
  index: number;
}

const QuestionForm = ({ initialData, onSave, onCancel, index }: QuestionFormProps) => {
  const [formData, setFormData] = useState<Omit<QuestionData, 'id' | 'exam_id'>>({
    question_text: initialData?.question_text || "",
    option_a: initialData?.option_a || "",
    option_b: initialData?.option_b || "",
    option_c: initialData?.option_c || "",
    option_d: initialData?.option_d || "",
    correct_answer: initialData?.correct_answer || "a",
    marks: initialData?.marks || 1,
    negative_marks: initialData?.negative_marks || 0,
    is_multi_correct: initialData?.is_multi_correct || false,
    order_number: initialData?.order_number || index + 1,
  });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imageUrl, setImageUrl] = useState<string | undefined>(initialData?.image_url);

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast.error("Please upload an image file");
      return;
    }

    setImageFile(file);
    const objectUrl = URL.createObjectURL(file);
    setImageUrl(objectUrl);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    let finalImageUrl = imageUrl;
    
    if (imageFile) {
      try {
        const fileName = `${Date.now()}-${imageFile.name}`;
        const { data, error } = await supabase.storage
          .from('questions')
          .upload(fileName, imageFile);
          
        if (error) throw error;
        
        const { data: { publicUrl } } = supabase.storage
          .from('questions')
          .getPublicUrl(fileName);
          
        finalImageUrl = publicUrl;
      } catch (error) {
        console.error('Error uploading image:', error);
        toast.error("Failed to upload image");
        return;
      }
    }
    
    if (!formData.question_text || !formData.option_a || !formData.option_b || !formData.option_c || !formData.option_d || !formData.correct_answer) {
      toast.error("Please fill in all fields");
      return;
    }

    onSave({
      ...formData,
      image_url: finalImageUrl
    });
  };

  return (
    <Card>
      <form onSubmit={handleSubmit}>
        <CardHeader>
          <CardTitle>Question {index + 1}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Question Text</Label>
            <Textarea
              value={formData.question_text}
              onChange={(e) => setFormData({ ...formData, question_text: e.target.value })}
              required
            />
          </div>

          <div className="space-y-2">
            <Label>Question Image (Optional)</Label>
            <div className="border-2 border-dashed rounded-lg p-4 text-center cursor-pointer hover:bg-accent transition-colors"
                 onClick={() => document.getElementById(`question-image-${index}`)?.click()}>
              {imageUrl ? (
                <div className="space-y-2">
                  <img src={imageUrl} alt="Question" className="max-w-full h-auto mx-auto" />
                  <p className="text-sm text-muted-foreground">Click to change image</p>
                </div>
              ) : (
                <div className="py-4">
                  <Image className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                  <p className="text-sm text-muted-foreground">Click to upload an image</p>
                </div>
              )}
              <Input
                id={`question-image-${index}`}
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Option A</Label>
              <Input
                value={formData.option_a}
                onChange={(e) => setFormData({ ...formData, option_a: e.target.value })}
                required
              />
            </div>
            <div className="space-y-2">
              <Label>Option B</Label>
              <Input
                value={formData.option_b}
                onChange={(e) => setFormData({ ...formData, option_b: e.target.value })}
                required
              />
            </div>
            <div className="space-y-2">
              <Label>Option C</Label>
              <Input
                value={formData.option_c}
                onChange={(e) => setFormData({ ...formData, option_c: e.target.value })}
                required
              />
            </div>
            <div className="space-y-2">
              <Label>Option D</Label>
              <Input
                value={formData.option_d}
                onChange={(e) => setFormData({ ...formData, option_d: e.target.value })}
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Correct Answer</Label>
            <div className="flex gap-4">
              <div className="flex items-center space-x-2">
                <Input
                  type="radio"
                  id={`correct-a-${index}`}
                  name={`correct-answer-${index}`}
                  value="a"
                  checked={formData.correct_answer === "a"}
                  onChange={() => setFormData({ ...formData, correct_answer: "a" })}
                />
                <Label htmlFor={`correct-a-${index}`}>A</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Input
                  type="radio"
                  id={`correct-b-${index}`}
                  name={`correct-answer-${index}`}
                  value="b"
                  checked={formData.correct_answer === "b"}
                  onChange={() => setFormData({ ...formData, correct_answer: "b" })}
                />
                <Label htmlFor={`correct-b-${index}`}>B</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Input
                  type="radio"
                  id={`correct-c-${index}`}
                  name={`correct-answer-${index}`}
                  value="c"
                  checked={formData.correct_answer === "c"}
                  onChange={() => setFormData({ ...formData, correct_answer: "c" })}
                />
                <Label htmlFor={`correct-c-${index}`}>C</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Input
                  type="radio"
                  id={`correct-d-${index}`}
                  name={`correct-answer-${index}`}
                  value="d"
                  checked={formData.correct_answer === "d"}
                  onChange={() => setFormData({ ...formData, correct_answer: "d" })}
                />
                <Label htmlFor={`correct-d-${index}`}>D</Label>
              </div>
            </div>
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
