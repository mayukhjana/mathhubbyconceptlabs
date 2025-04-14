import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Save, PlusCircle } from "lucide-react";
import { QuestionData } from "@/components/QuestionForm";
import { toast } from "sonner";
import QuestionForm from "@/components/QuestionForm";
import FileUploadZone from "@/components/admin/FileUploadZone";
import MCQQuestionsList from "@/components/admin/MCQQuestionsList";
import { Card, CardContent } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";

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
  const [showQuestionForm, setShowQuestionForm] = useState(false);

  const handleEditQuestion = (index: number) => {
    setEditingQuestionIndex(index);
    setShowQuestionForm(true);
  };

  const handleSaveQuestion = (questionData: QuestionData) => {
    onSaveQuestion(questionData);
    
    // Clear the form after saving to allow adding another question
    setEditingQuestionIndex(null);
    
    // Keep the form visible after saving, but reset it for a new question
    if (editingQuestionIndex !== null) {
      toast.success("Question updated successfully!");
    } else {
      toast.success("Question added successfully!");
      // Don't hide the form so they can keep adding questions
    }
  };

  const handleCancelQuestion = () => {
    setEditingQuestionIndex(null);
    setShowQuestionForm(false);
  };
  
  const handleAddAnotherQuestion = () => {
    setEditingQuestionIndex(null);
    setShowQuestionForm(true);
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
        
        {!showQuestionForm && questions.length === 0 && (
          <Card className="border-dashed">
            <CardContent className="py-6 text-center">
              <p className="text-muted-foreground mb-4">No questions added yet</p>
              <Button onClick={() => setShowQuestionForm(true)} variant="outline">
                <PlusCircle className="h-4 w-4 mr-2" />
                Add First Question
              </Button>
            </CardContent>
          </Card>
        )}
        
        {showQuestionForm ? (
          <QuestionForm
            initialData={editingQuestionIndex !== null ? questions[editingQuestionIndex] : undefined}
            onSave={handleSaveQuestion}
            onCancel={handleCancelQuestion}
            index={editingQuestionIndex !== null ? editingQuestionIndex : questions.length}
          />
        ) : (
          <Button 
            onClick={handleAddAnotherQuestion} 
            variant="outline" 
            className="w-full"
          >
            <PlusCircle className="h-4 w-4 mr-2" />
            Add {questions.length > 0 ? "Another" : "First"} Question
          </Button>
        )}
      </div>
      
      {isUploading && (
        <div className="space-y-2">
          <div className="w-full bg-gray-200 rounded-full h-2.5">
            <div 
              className="bg-mathprimary h-2.5 rounded-full transition-all duration-300" 
              style={{ width: `${uploadProgress}%` }}
            ></div>
          </div>
          <p className="text-sm text-center text-muted-foreground">
            Uploading... {uploadProgress}%
          </p>
        </div>
      )}
    </div>
  );
};

export default UnifiedExamForm;
