
import { Progress } from "@/components/ui/progress";

interface UploadProgressProps {
  isUploading: boolean;
  uploadProgress: number;
}

const UploadProgress = ({ isUploading, uploadProgress }: UploadProgressProps) => {
  if (!isUploading) return null;

  return (
    <div className="space-y-2 mt-4 p-4 border rounded-md bg-gray-50 dark:bg-gray-900">
      <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
        <Progress value={uploadProgress} className="h-2.5 transition-all duration-300" />
      </div>
      <p className="text-sm text-center text-muted-foreground">
        Uploading... {uploadProgress}%
      </p>
    </div>
  );
};

export default UploadProgress;
