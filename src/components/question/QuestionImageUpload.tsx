
import { Image as LucideImage, ImageOff, RefreshCw } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { getContentTypeFromFile, forceCorrectContentType } from "@/utils/fileUtils";
import { Button } from "@/components/ui/button";

interface QuestionImageUploadProps {
  imageUrl?: string;
  index: number;
  onImageUpload: (file: File) => void;
}

const QuestionImageUpload = ({ imageUrl, index, onImageUpload }: QuestionImageUploadProps) => {
  const [isImageLoading, setIsImageLoading] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [retryCount, setRetryCount] = useState(0);
  const [key, setKey] = useState(Date.now()); // Used to force image refresh

  // Reset component state when imageUrl changes
  useEffect(() => {
    if (imageUrl) {
      setIsImageLoading(true);
      setImageError(false);
      setKey(Date.now());
    }
  }, [imageUrl]);

  const handleClick = () => {
    document.getElementById(`question-image-${index}`)?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    try {
      // Validate file type
      const contentType = getContentTypeFromFile(file);
      if (!contentType.startsWith('image/')) {
        toast.error("Please upload an image file");
        return;
      }
      
      // Check file size (5MB limit)
      const maxSizeInBytes = 5 * 1024 * 1024;
      if (file.size > maxSizeInBytes) {
        toast.error("Image size must be less than 5MB");
        return;
      }
      
      setIsImageLoading(true);
      setImageError(false);
      
      // Log file information for debugging
      console.log("Uploading image:", {
        name: file.name,
        type: file.type,
        detectedType: contentType,
        size: file.size,
        lastModified: new Date(file.lastModified).toISOString()
      });
      
      // Process the file to ensure correct content type
      const processedFile = await forceCorrectContentType(file);
      
      onImageUpload(processedFile);
    } catch (error) {
      console.error("Error processing image file:", error);
      toast.error("Error processing image. Please try another file.");
      setImageError(true);
      setIsImageLoading(false);
    }
  };

  const handleRetryLoad = () => {
    if (!imageUrl) return;
    
    setIsImageLoading(true);
    setImageError(false);
    setRetryCount(prev => prev + 1);
    
    // Force image reload with a new cache-busting parameter
    const timestamp = new Date().getTime();
    setKey(timestamp);
  };

  return (
    <div 
      className="border-2 border-dashed rounded-lg p-4 text-center cursor-pointer hover:bg-accent transition-colors"
      onClick={handleClick}
    >
      {imageUrl ? (
        <div className="space-y-2">
          {isImageLoading && (
            <div className="flex justify-center items-center py-4">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          )}
          
          {imageError ? (
            <div className="py-4">
              <ImageOff className="h-8 w-8 mx-auto mb-2 text-red-500" />
              <p className="text-sm text-red-500">Failed to load image</p>
              <div className="flex justify-center mt-2">
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={(e) => {
                    e.stopPropagation();
                    handleRetryLoad();
                  }}
                >
                  <RefreshCw className="h-4 w-4 mr-1" />
                  Retry
                </Button>
              </div>
              <p className="text-sm text-muted-foreground mt-2">or click to upload a new image</p>
            </div>
          ) : (
            <img 
              key={`img-${key}`}
              src={`${imageUrl}?t=${key}`}
              alt="Question"
              className={`max-w-full h-auto mx-auto rounded-md ${isImageLoading ? 'hidden' : 'block'}`}
              onLoad={() => {
                console.log("Image loaded successfully");
                setIsImageLoading(false);
                setImageError(false);
              }}
              onError={(e) => {
                console.error("Failed to load image:", imageUrl);
                setIsImageLoading(false);
                setImageError(true);
              }}
            />
          )}
          
          {!imageError && !isImageLoading && (
            <p className="text-sm text-muted-foreground">Click to change image</p>
          )}
        </div>
      ) : (
        <div className="py-4">
          <LucideImage className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
          <p className="text-sm text-muted-foreground">Click to upload an image</p>
        </div>
      )}
      <Input
        id={`question-image-${index}`}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="hidden"
      />
    </div>
  );
};

export default QuestionImageUpload;
