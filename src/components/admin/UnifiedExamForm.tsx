
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Save } from "lucide-react";
import { QuestionData } from "@/components/QuestionForm";
import { toast } from "sonner";
import QuestionForm from "@/components/QuestionForm";
import FileUploadZone from "@/components/admin/FileUploadZone";
import MCQQuestionsList from "@/components/admin/MCQQuestionsList";

interface UnifiedExamFormProps {
  uploadedFile: File | null;
  solutionFile: File | null;
  questions: QuestionData[];
  isUploading: boolean;
  uploadProgress: number;
  onFileChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onSolutionFileChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onSaveQuestion: (questionData: QuestionData) => void;
  onRemoveQuestion: (index: number) => void;
}

const UnifiedExamForm = ({
  uploadedFile,
  solutionFile,
  questions,
  isUploading,
  uploadProgress,
  onFileChange,
  onSolutionFileChange,
  onSaveQuestion,
  onRemoveQuestion,
}: UnifiedExamFormProps) => {
  const [editingQuestionIndex, setEditingQuestionIndex] = useState<number | null>(null);

  const handleEditQuestion = (index: number) => {
    setEditingQuestionIndex(index);
  };

  const handleSaveQuestion = (questionData: QuestionData) => {
    onSaveQuestion(questionData);
    setEditingQuestionIndex(null);
  };

  return (
    <div className="space-y-6">
      <div className="border-t pt-6 space-y-4">
        <h3 className="font-medium">PDF Papers</h3>
        
        <FileUploadZone 
          id="file-upload"
          label="Exam Paper (PDF)"
          file={uploadedFile}
          onChange={onFileChange}
          required={true}
        />
        
        <FileUploadZone 
          id="solution-upload"
          label="Solution (PDF, Optional)"
          file={solutionFile}
          onChange={onSolutionFileChange}
        />
      </div>
      
      <div className="border-t pt-6 space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="font-medium">MCQ Questions (Optional)</h3>
          <span className="text-sm text-muted-foreground">
            {questions.length} questions added
          </span>
        </div>
        
        <MCQQuestionsList 
          questions={questions}
          onEditQuestion={handleEditQuestion}
          onRemoveQuestion={onRemoveQuestion}
        />
        
        {editingQuestionIndex !== null ? (
          <QuestionForm
            initialData={questions[editingQuestionIndex]}
            onSave={handleSaveQuestion}
            onCancel={() => setEditingQuestionIndex(null)}
            index={editingQuestionIndex}
          />
        ) : (
          <QuestionForm
            onSave={handleSaveQuestion}
            index={questions.length}
          />
        )}
      </div>
      
      {isUploading && (
        <div className="w-full bg-gray-200 rounded-full h-2.5">
          <div 
            className="bg-mathprimary h-2.5 rounded-full" 
            style={{ width: `${uploadProgress}%` }}
          ></div>
        </div>
      )}
    </div>
  );
};

export default UnifiedExamForm;
