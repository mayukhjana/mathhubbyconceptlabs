import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Save, PlusCircle } from "lucide-react";
import { Question } from "@/services/exam/types";
import { toast } from "sonner";
import QuestionForm from "@/components/QuestionForm";
import FileUploadZone from "@/components/admin/FileUploadZone";
import MCQQuestionsList from "@/components/admin/MCQQuestionsList";
import { Card, CardContent } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface UnifiedExamFormProps {
  uploadedFile: File | null;
  solutionFile: File | null;
  questions: Question[];
  isUploading: boolean;
  uploadProgress: number;
  onFileChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onSolutionFileChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onSaveQuestion: (questionData: Question) => void;
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

  const handleSaveQuestion = (questionData: Question) => {
    console.log("Saving question in UnifiedExamForm:", questionData);
    onSaveQuestion(questionData);
    
    setEditingQuestionIndex(null);
    
    if (editingQuestionIndex !== null) {
      toast.success("Question updated successfully!");
    } else {
      toast.success("Question added successfully!");
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
          acceptFormats=".pdf"
          description="Upload exam paper in PDF format only"
          required={true}
        />
        
        <FileUploadZone 
          id="solution-upload"
          label="Solution (PDF, Optional)"
          file={solutionFile}
          onChange={onSolutionFileChange}
          acceptFormats=".pdf"
          description="Upload solution in PDF format only"
        />
        
        <Alert className="bg-amber-50 text-amber-800 border-amber-200">
          <AlertDescription className="text-sm">
            <strong>Note:</strong> For board exams, selecting "Full Mock Test" will mark it as a complete exam.
            Selecting a specific chapter will categorize it under that chapter in the board's chapter list.
          </AlertDescription>
        </Alert>
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
              <Button onClick={() => setShowQuestionForm(true)} variant="default">
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
            variant="default"
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
