import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { FileText, Loader2, Download } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface InstructionsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  examId: string;
}

export const InstructionsDialog = ({ open, onOpenChange, examId }: InstructionsDialogProps) => {
  const [instructionsUrl, setInstructionsUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (open) {
      fetchInstructions();
    }
  }, [open, examId]);

  const fetchInstructions = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('exams')
        .select('instructions_pdf_url')
        .eq('id', examId)
        .single();

      if (error) throw error;
      setInstructionsUrl(data?.instructions_pdf_url || null);
    } catch (error) {
      console.error('Error fetching instructions:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = () => {
    if (instructionsUrl) {
      window.open(instructionsUrl, '_blank');
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Exam Instructions
          </DialogTitle>
          <DialogDescription>
            Please read the instructions carefully before starting the exam
          </DialogDescription>
        </DialogHeader>

        <div className="flex-1 overflow-auto">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : instructionsUrl ? (
            <div className="space-y-4">
              <div className="flex justify-end">
                <Button onClick={handleDownload} variant="outline" size="sm">
                  <Download className="h-4 w-4 mr-2" />
                  Download PDF
                </Button>
              </div>
              <div className="border rounded-lg overflow-hidden bg-white">
                <iframe
                  src={`${instructionsUrl}#toolbar=0`}
                  className="w-full h-[600px]"
                  title="Exam Instructions"
                />
              </div>
            </div>
          ) : (
            <div className="text-center py-12">
              <FileText className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-2">No Instructions Available</h3>
              <p className="text-muted-foreground">
                There are no specific instructions for this exam.
              </p>
            </div>
          )}
        </div>

        <div className="flex justify-end pt-4 border-t">
          <Button onClick={() => onOpenChange(false)}>
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
