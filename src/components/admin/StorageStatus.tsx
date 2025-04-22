
import { Alert, AlertCircle, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { RefreshCcw } from "lucide-react";

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

  return null;
};

export default StorageStatus;
