
import { AlertCircle, RefreshCcw } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";

interface StorageStatusProps {
  error: string | null;
  bucketsReady: boolean;
  onRetry: () => void;
}

const StorageStatus = ({ error, bucketsReady, onRetry }: StorageStatusProps) => {
  if (!error && !bucketsReady) {
    return (
      <Alert className="mb-6">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Storage Initializing</AlertTitle>
        <AlertDescription>
          The storage system is initializing. Please wait a moment before uploading files.
        </AlertDescription>
      </Alert>
    );
  }

  if (error) {
    // Check for the specific MIME type error
    const isContentTypeError = error.includes("application/json is not supported") || 
                              error.includes("mime type") ||
                              error.includes("MIME type");
    
    if (isContentTypeError) {
      return (
        <Alert variant="default" className="mb-6">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Content Type Warning</AlertTitle>
          <AlertDescription className="flex flex-col gap-2">
            <div>
              There appears to be a MIME type issue. The system will try to automatically correct
              file types during upload. You can continue with your upload.
            </div>
            <Button 
              variant="outline" 
              size="sm" 
              className="w-fit flex gap-2 items-center mt-2" 
              onClick={onRetry}
            >
              <RefreshCcw className="h-4 w-4" />
              Retry Storage Initialization
            </Button>
          </AlertDescription>
        </Alert>
      );
    }
    
    return (
      <Alert variant="destructive" className="mb-6">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Storage Error</AlertTitle>
        <AlertDescription className="flex flex-col gap-2">
          <div>{error}</div>
          <Button 
            variant="outline" 
            size="sm" 
            className="w-fit flex gap-2 items-center mt-2" 
            onClick={onRetry}
          >
            <RefreshCcw className="h-4 w-4" />
            Retry Storage Initialization
          </Button>
        </AlertDescription>
      </Alert>
    );
  }

  if (bucketsReady) {
    return (
      <Alert className="mb-6 bg-green-50 text-green-800 border-green-200">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Storage Ready</AlertTitle>
        <AlertDescription className="flex flex-col gap-2">
          <div>Storage buckets are initialized and ready for file uploads.</div>
          <Button 
            variant="outline" 
            size="sm" 
            className="w-fit flex gap-2 items-center mt-2 text-green-700 border-green-300" 
            onClick={onRetry}
          >
            <RefreshCcw className="h-4 w-4" />
            Reinitialize Buckets
          </Button>
        </AlertDescription>
      </Alert>
    );
  }

  return null;
};

export default StorageStatus;

