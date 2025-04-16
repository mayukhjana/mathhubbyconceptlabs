
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Exam } from "@/services/exam/types";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Loader2 } from "lucide-react";

interface ExamCardProps {
  exam: Exam;
  onDelete: (examId: string, examTitle: string) => Promise<void>;
  onDeleteComplete?: () => void;
}

const ExamCard = ({ exam, onDelete, onDeleteComplete }: ExamCardProps) => {
  const [isDeleting, setIsDeleting] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [deleteStatus, setDeleteStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const { toast } = useToast();

  const handleDelete = async () => {
    try {
      setIsDeleting(true);
      setDeleteStatus('idle');
      setErrorMessage(null);
      
      await onDelete(exam.id, exam.title);
      
      setDeleteStatus('success');
      toast({
        title: "Success",
        description: `Exam "${exam.title}" deleted successfully`,
      });
      
      // Notify parent that deletion is complete
      if (onDeleteComplete) {
        setTimeout(() => {
          onDeleteComplete();
          setShowConfirmation(false);
        }, 1500); // Give a small delay to show success status
      }
    } catch (error) {
      console.error("Error deleting exam:", error);
      setDeleteStatus('error');
      setErrorMessage(error instanceof Error ? error.message : "Unknown error occurred");
      toast({
        title: "Error",
        description: `Failed to delete exam "${exam.title}"`,
        variant: "destructive",
      });
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="flex items-center justify-between p-2 rounded-lg border">
      <div>
        <h4 className="font-medium">{exam.title}</h4>
        <p className="text-sm text-muted-foreground">
          Year: {exam.year} | Duration: {exam.duration} mins
        </p>
        <p className="text-xs text-muted-foreground mt-1">
          ID: {exam.id}
        </p>
      </div>
      
      <Dialog open={showConfirmation} onOpenChange={setShowConfirmation}>
        <Button 
          variant="destructive" 
          size="sm" 
          disabled={isDeleting}
          onClick={() => setShowConfirmation(true)}
        >
          {isDeleting ? "Deleting..." : "Delete"}
        </Button>
        
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Exam</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete "{exam.title}" (ID: {exam.id})? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          
          {deleteStatus === 'success' && (
            <div className="bg-green-50 p-3 rounded-md text-green-700 mb-4">
              Exam deleted successfully! The list will refresh shortly.
            </div>
          )}
          
          {deleteStatus === 'error' && (
            <div className="bg-red-50 p-3 rounded-md text-red-700 mb-4">
              <p>Failed to delete exam. Please try again or contact support.</p>
              {errorMessage && <p className="text-sm mt-2 font-mono">{errorMessage}</p>}
            </div>
          )}
          
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setShowConfirmation(false)}
              disabled={isDeleting}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDelete}
              disabled={isDeleting}
            >
              {isDeleting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Deleting...
                </>
              ) : "Delete"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ExamCard;
