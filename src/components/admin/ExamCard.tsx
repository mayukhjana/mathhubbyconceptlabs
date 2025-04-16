
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Exam } from "@/services/exam/types";

interface ExamCardProps {
  exam: Exam;
  onDelete: (examId: string, examTitle: string) => Promise<void>;
}

const ExamCard = ({ exam, onDelete }: ExamCardProps) => {
  return (
    <div className="flex items-center justify-between p-2 rounded-lg border">
      <div>
        <h4 className="font-medium">{exam.title}</h4>
        <p className="text-sm text-muted-foreground">
          Year: {exam.year} | Duration: {exam.duration} mins
        </p>
      </div>
      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button variant="destructive" size="sm">Delete</Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Exam</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete "{exam.title}"? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => onDelete(exam.id, exam.title)}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default ExamCard;
