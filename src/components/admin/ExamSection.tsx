
import { AlertCircle, Loader2, Trash2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Exam } from "@/services/exam/types";
import ExamCard from "./ExamCard";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

interface ExamSectionProps {
  title: string;
  exams: Exam[];
  onDeleteExam: (examId: string, examTitle: string) => Promise<void>;
  onDeleteComplete?: () => void;
  onDeleteAll?: () => Promise<void>;
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
  const { toast } = useToast();

  const handleDeleteAll = async () => {
    if (!onDeleteAll) return;
    
    try {
      setIsDeletingAll(true);
      setDeleteStatus('idle');
      setErrorMessage(null);
      
      await onDeleteAll();
      
      setDeleteStatus('success');
      toast({
        title: "Success",
        description: `All ${title} exams deleted successfully`,
      });
      
      // Notify parent component that deletion is complete
      if (onDeleteComplete) {
        setTimeout(() => {
          onDeleteComplete();
          setShowConfirmation(false);
        }, 1500); // Small delay to show success message
      }
    } catch (error) {
      console.error(`Error deleting all ${title} exams:`, error);
      setDeleteStatus('error');
      setErrorMessage(error instanceof Error ? error.message : "Unknown error occurred");
      toast({
        title: "Error",
        description: `Failed to delete all ${title} exams`,
        variant: "destructive",
      });
    } finally {
      setIsDeletingAll(false);
    }
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle>{title} ({exams.length})</CardTitle>
        {showDeleteAll && onDeleteAll && exams.length > 0 && (
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
                  This will permanently delete all {exams.length} {title} exams. This action cannot be undone.
                </DialogDescription>
              </DialogHeader>
              
              {deleteStatus === 'success' && (
                <div className="bg-green-50 p-3 rounded-md text-green-700 mb-4">
                  All exams deleted successfully! The list will refresh shortly.
                </div>
              )}
              
              {deleteStatus === 'error' && (
                <div className="bg-red-50 p-3 rounded-md text-red-700 mb-4">
                  <p>Failed to delete all exams. Please try again or contact support.</p>
                  {errorMessage && <p className="text-sm mt-2 font-mono">{errorMessage}</p>}
                </div>
              )}
              
              <DialogFooter>
                <Button
                  variant="outline"
                  onClick={() => setShowConfirmation(false)}
                  disabled={isDeletingAll}
                >
                  Cancel
                </Button>
                <Button
                  variant="destructive"
                  onClick={handleDeleteAll}
                  disabled={isDeletingAll}
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
        {exams.length === 0 ? (
          <div className="text-center py-4 text-muted-foreground">
            <AlertCircle className="mx-auto h-6 w-6 mb-2" />
            <p>No exams found for {title}</p>
          </div>
        ) : (
          <ScrollArea className="h-[300px]">
            <div className="space-y-2">
              {exams.map(exam => (
                <ExamCard
                  key={exam.id}
                  exam={exam}
                  onDelete={onDeleteExam}
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
