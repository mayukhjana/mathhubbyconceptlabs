
import { AlertCircle, Loader2, Trash2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Exam } from "@/services/exam/types";
import ExamCard from "./ExamCard";
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface ExamSectionProps {
  title: string;
  exams: Exam[];
  onDeleteExam: (examId: string, examTitle: string) => Promise<void>;
  onDeleteComplete?: () => void;
  onDeleteAll?: () => Promise<any>; // Accept any return type from the promise
  showDeleteAll?: boolean;
}

const ExamSection = ({ 
  title, 
  exams, 
  onDeleteExam, 
  onDeleteComplete,
  onDeleteAll, 
  showDeleteAll = false 
}: ExamSectionProps) => {
  const [isDeletingAll, setIsDeletingAll] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [deleteStatus, setDeleteStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [localExams, setLocalExams] = useState<Exam[]>(exams);
  const { toast } = useToast();

  // Update local exams when props change
  useEffect(() => {
    setLocalExams(exams);
  }, [exams]);

  const handleDeleteAll = async () => {
    if (!onDeleteAll) return;
    
    try {
      setIsDeletingAll(true);
      setDeleteStatus('idle');
      setErrorMessage(null);
      
      await onDeleteAll();
      
      setDeleteStatus('success');
      // Clear local exams immediately to update UI
      setLocalExams([]);
      
      toast({
        title: "Success",
        description: `All ${title} exams deleted successfully`,
      });
      
      // Close dialog after a delay
      setTimeout(() => {
        setShowConfirmation(false);
        setIsDeletingAll(false);
        
        // Notify parent component that deletion is complete
        if (onDeleteComplete) {
          onDeleteComplete();
        }
      }, 1500);
    } catch (error) {
      console.error(`Error deleting all ${title} exams:`, error);
      setDeleteStatus('error');
      setErrorMessage(error instanceof Error ? error.message : "Unknown error occurred");
      setIsDeletingAll(false);
      
      toast({
        title: "Error",
        description: `Failed to delete all ${title} exams`,
        variant: "destructive",
      });
    }
  };

  // Handle individual exam deletion
  const handleExamDelete = async (examId: string, examTitle: string) => {
    try {
      await onDeleteExam(examId, examTitle);
      // Remove the exam from local state immediately
      setLocalExams(prevExams => prevExams.filter(exam => exam.id !== examId));
      
      // Call onDeleteComplete to refresh parent data
      if (onDeleteComplete) {
        onDeleteComplete();
      }
      
      return Promise.resolve();
    } catch (error) {
      return Promise.reject(error);
    }
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle>{title} ({localExams.length})</CardTitle>
        {showDeleteAll && onDeleteAll && localExams.length > 0 && (
          <Dialog open={showConfirmation} onOpenChange={setShowConfirmation}>
            <Button
              variant="destructive"
              size="sm"
              disabled={isDeletingAll}
              onClick={() => setShowConfirmation(true)}
            >
              <Trash2 className="mr-2 h-4 w-4" />
              {isDeletingAll ? "Deleting..." : "Delete All"}
            </Button>
            
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Delete All {title} Exams</DialogTitle>
                <DialogDescription>
                  This will permanently delete all {localExams.length} {title} exams. This action cannot be undone.
                </DialogDescription>
              </DialogHeader>
              
              {deleteStatus === 'success' && (
                <div className="bg-green-50 p-3 rounded-md text-green-700 mb-4">
                  All exams deleted successfully! The list will refresh shortly.
                </div>
              )}
              
              {deleteStatus === 'error' && (
                <Alert variant="destructive" className="mb-4">
                  <AlertDescription className="space-y-2">
                    <p>Failed to delete all exams. Please try again or contact support.</p>
                    {errorMessage && <p className="text-sm font-mono break-words whitespace-pre-wrap">{errorMessage}</p>}
                  </AlertDescription>
                </Alert>
              )}
              
              <DialogFooter>
                <Button
                  variant="outline"
                  onClick={() => setShowConfirmation(false)}
                  disabled={isDeletingAll || deleteStatus === 'success'}
                >
                  Cancel
                </Button>
                <Button
                  variant="destructive"
                  onClick={handleDeleteAll}
                  disabled={isDeletingAll || deleteStatus === 'success'}
                >
                  {isDeletingAll ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Deleting...
                    </>
                  ) : "Delete All"}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        )}
      </CardHeader>
      <CardContent>
        {localExams.length === 0 ? (
          <div className="text-center py-4 text-muted-foreground">
            <AlertCircle className="mx-auto h-6 w-6 mb-2" />
            <p>No exams found for {title}</p>
          </div>
        ) : (
          <ScrollArea className="h-[300px]">
            <div className="space-y-2">
              {localExams.map(exam => (
                <ExamCard
                  key={exam.id}
                  exam={exam}
                  onDelete={handleExamDelete}
                  onDeleteComplete={onDeleteComplete}
                />
              ))}
            </div>
          </ScrollArea>
        )}
      </CardContent>
    </Card>
  );
};

export default ExamSection;
