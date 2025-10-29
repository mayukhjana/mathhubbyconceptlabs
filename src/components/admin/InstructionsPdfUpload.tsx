import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText, Upload, Loader2, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

interface InstructionsPdfUploadProps {
  examId: string | null;
  currentInstructionsUrl?: string | null;
  onUploadComplete?: () => void;
}

export const InstructionsPdfUpload = ({ 
  examId, 
  currentInstructionsUrl,
  onUploadComplete 
}: InstructionsPdfUploadProps) => {
  const [uploading, setUploading] = useState(false);
  const [file, setFile] = useState<File | null>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (selectedFile) {
      if (selectedFile.type !== 'application/pdf') {
        toast.error('Please upload a PDF file');
        return;
      }
      if (selectedFile.size > 10 * 1024 * 1024) { // 10MB limit
        toast.error('File size must be less than 10MB');
        return;
      }
      setFile(selectedFile);
    }
  };

  const handleUpload = async () => {
    if (!file || !examId) {
      toast.error('Please select a file and ensure exam is created');
      return;
    }

    try {
      setUploading(true);

      // Upload to storage
      const fileExt = 'pdf';
      const fileName = `${examId}_instructions_${Date.now()}.${fileExt}`;
      const filePath = `instructions/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('exam-papers')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      // Get public URL
      const { data: urlData } = supabase.storage
        .from('exam-papers')
        .getPublicUrl(filePath);

      // Update exam with instructions URL
      const { error: updateError } = await supabase
        .from('exams')
        .update({ instructions_pdf_url: urlData.publicUrl })
        .eq('id', examId);

      if (updateError) throw updateError;

      toast.success('Instructions PDF uploaded successfully');
      setFile(null);
      onUploadComplete?.();
    } catch (error: any) {
      console.error('Error uploading instructions:', error);
      toast.error('Failed to upload instructions: ' + error.message);
    } finally {
      setUploading(false);
    }
  };

  const handleRemove = async () => {
    if (!examId || !currentInstructionsUrl) return;

    try {
      setUploading(true);

      // Extract file path from URL
      const url = new URL(currentInstructionsUrl);
      const filePath = url.pathname.split('/').slice(-2).join('/');

      // Delete from storage
      const { error: deleteError } = await supabase.storage
        .from('exam-papers')
        .remove([filePath]);

      if (deleteError) throw deleteError;

      // Update exam to remove instructions URL
      const { error: updateError } = await supabase
        .from('exams')
        .update({ instructions_pdf_url: null })
        .eq('id', examId);

      if (updateError) throw updateError;

      toast.success('Instructions PDF removed');
      onUploadComplete?.();
    } catch (error: any) {
      console.error('Error removing instructions:', error);
      toast.error('Failed to remove instructions: ' + error.message);
    } finally {
      setUploading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="h-5 w-5" />
          Exam Instructions PDF
        </CardTitle>
        <CardDescription>
          Upload instructions PDF that students will see before starting the exam
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {currentInstructionsUrl ? (
          <div className="space-y-3">
            <div className="flex items-center gap-3 p-3 border rounded-lg bg-muted/50">
              <FileText className="h-8 w-8 text-primary" />
              <div className="flex-1">
                <p className="font-medium text-sm">Instructions PDF Uploaded</p>
                <a 
                  href={currentInstructionsUrl} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-xs text-blue-600 hover:underline"
                >
                  View Current PDF
                </a>
              </div>
              <Button
                variant="destructive"
                size="sm"
                onClick={handleRemove}
                disabled={uploading}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <input
                type="file"
                accept=".pdf"
                onChange={handleFileChange}
                className="flex-1 text-sm"
                disabled={uploading || !examId}
              />
            </div>
            {file && (
              <div className="flex items-center gap-3 p-3 border rounded-lg bg-muted/50">
                <FileText className="h-8 w-8 text-primary" />
                <div className="flex-1">
                  <p className="font-medium text-sm">{file.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {(file.size / 1024 / 1024).toFixed(2)} MB
                  </p>
                </div>
              </div>
            )}
            <Button
              onClick={handleUpload}
              disabled={!file || uploading || !examId}
              className="w-full"
            >
              {uploading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  Uploading...
                </>
              ) : (
                <>
                  <Upload className="h-4 w-4 mr-2" />
                  Upload Instructions PDF
                </>
              )}
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
