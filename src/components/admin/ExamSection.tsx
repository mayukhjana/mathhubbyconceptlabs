
import { AlertCircle, Trash2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Exam } from "@/services/exam/types";
import ExamCard from "./ExamCard";

interface ExamSectionProps {
  title: string;
  exams: Exam[];
  onDeleteExam: (examId: string, examTitle: string) => Promise<void>;
  onDeleteAll?: () => Promise<void>;
  showDeleteAll?: boolean;
}

const ExamSection = ({ 
  title, 
  exams, 
  onDeleteExam, 
  onDeleteAll, 
  showDeleteAll = false 
}: ExamSectionProps) => {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle>{title}</CardTitle>
        {showDeleteAll && onDeleteAll && (
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="destructive" size="sm">
                <Trash2 className="mr-2 h-4 w-4" />
                Delete All
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This will permanently delete all {title} exams. This action cannot be undone.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  onClick={onDeleteAll}
                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                >
                  Delete All
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
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
