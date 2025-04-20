
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Question } from "@/services/exam/types";
import { uploadQuestionImage } from "@/services/exam/storage/operations";

interface UseQuestionFormProps {
  initialData?: Question;
  onSave: (question: Question) => void;
  index: number;
}

export const useQuestionForm = ({ initialData, onSave, index }: UseQuestionFormProps) => {
  // Define a temporary type for formData that doesn't require id and exam_id
  type QuestionFormData = Omit<Question, 'id' | 'exam_id'>;
  
  const [formData, setFormData] = useState<QuestionFormData>({
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
    image_url: initialData?.image_url
  });

  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imageUrl, setImageUrl] = useState<string | undefined>(initialData?.image_url);
  const [isUploading, setIsUploading] = useState(false);
  const [selectedCorrectAnswers, setSelectedCorrectAnswers] = useState<string[]>(
    formData.is_multi_correct && formData.correct_answer 
      ? (Array.isArray(formData.correct_answer) 
          ? formData.correct_answer 
          : formData.correct_answer.split(','))
      : []
  );

  const handleImageUpload = async (file: File) => {
    if (!file) return;
    
    setIsUploading(true);
    console.log("Starting image upload for file:", file.name, "type:", file.type);

    try {
      // Ensure the file is an image
      if (!file.type.startsWith('image/')) {
        const fileExt = file.name.split('.').pop()?.toLowerCase();
        if (!['png', 'jpg', 'jpeg', 'gif', 'webp', 'svg'].includes(fileExt || '')) {
          throw new Error('Only image files are allowed for question images');
        }
      }
      
      // Check file size
      const maxSizeInBytes = 5 * 1024 * 1024; // 5MB
      if (file.size > maxSizeInBytes) {
        throw new Error("Image size must be less than 5MB");
      }
      
      // Upload using the optimized function
      const publicUrl = await uploadQuestionImage(file);
      
      if (!publicUrl) {
        throw new Error("Failed to get public URL for uploaded image");
      }
      
      console.log("Image uploaded successfully:", publicUrl);
      setImageFile(file);
      setImageUrl(publicUrl);
      setFormData(prev => ({
        ...prev,
        image_url: publicUrl
      }));
      toast.success("Image uploaded successfully");
    } catch (error: any) {
      console.error('Error uploading image:', error);
      toast.error(`Failed to upload image: ${error.message}`);
      setImageUrl(undefined); // Clear the image URL on error
    } finally {
      setIsUploading(false);
    }
  };

  const handleCorrectAnswerChange = (option: string) => {
    if (!formData.is_multi_correct) {
      setFormData({ ...formData, correct_answer: option });
    } else {
      const currentAnswers = selectedCorrectAnswers.includes(option)
        ? selectedCorrectAnswers.filter(ans => ans !== option)
        : [...selectedCorrectAnswers, option];
      
      setSelectedCorrectAnswers(currentAnswers);
      setFormData({ 
        ...formData, 
        correct_answer: currentAnswers.sort() 
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.question_text || !formData.option_a || !formData.option_b || 
        !formData.option_c || !formData.option_d || 
        (formData.is_multi_correct && selectedCorrectAnswers.length === 0)) {
      toast.error("Please fill in all fields and select at least one correct answer");
      return;
    }

    // Create a complete question object with placeholders for id and exam_id
    const completeQuestion: Question = {
      ...formData,
      image_url: imageUrl,
      correct_answer: formData.is_multi_correct 
        ? selectedCorrectAnswers.sort() 
        : formData.correct_answer,
      id: initialData?.id || '',
      exam_id: initialData?.exam_id || ''
    };

    console.log("Saving question with data:", completeQuestion);
    onSave(completeQuestion);
  };

  return {
    formData,
    setFormData,
    imageUrl,
    selectedCorrectAnswers,
    isUploading,
    handleImageUpload,
    handleCorrectAnswerChange,
    handleSubmit,
  };
};
