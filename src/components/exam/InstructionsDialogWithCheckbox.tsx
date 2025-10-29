import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { FileText, Loader2, Download } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Label } from "@/components/ui/label";

interface InstructionsDialogWithCheckboxProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  examId: string;
  onStartExam: () => void;
}

export const InstructionsDialogWithCheckbox = ({ 
  open, 
  onOpenChange, 
  examId,
  onStartExam 
}: InstructionsDialogWithCheckboxProps) => {
  const [instructionsUrl, setInstructionsUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [agreedToTerms, setAgreedToTerms] = useState(false);

  useEffect(() => {
    if (open) {
      fetchInstructions();
      setAgreedToTerms(false); // Reset checkbox when dialog opens
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

  const handleStartExam = () => {
    onStartExam();
    onOpenChange(false);
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
                  className="w-full h-[500px]"
                  title="Exam Instructions"
                />
              </div>
            </div>
          ) : (
            <div className="text-center py-12">
              <FileText className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-2">Standard Exam Instructions</h3>
              <div className="text-left max-w-2xl mx-auto space-y-2 text-muted-foreground">
                <p>• Answer all questions to the best of your ability</p>
                <p>• Each question carries marks as indicated</p>
                <p>• Negative marking may apply for incorrect answers</p>
                <p>• Do not switch tabs or exit fullscreen during the exam</p>
                <p>• Screenshots and right-click are disabled</p>
                <p>• Your progress is automatically saved</p>
              </div>
            </div>
          )}
        </div>

        <div className="space-y-4 pt-4 border-t">
          <div className="flex items-center space-x-2">
            <Checkbox 
              id="terms" 
              checked={agreedToTerms}
              onCheckedChange={(checked) => setAgreedToTerms(checked === true)}
            />
            <Label 
              htmlFor="terms" 
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
            >
              I have read all the Terms & Conditions carefully and agree to abide by them
            </Label>
          </div>
          
          <div className="flex justify-end gap-2">
            <Button 
              variant="outline" 
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button 
              onClick={handleStartExam}
              disabled={!agreedToTerms}
              className="min-w-[120px]"
            >
              Start Paper
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
