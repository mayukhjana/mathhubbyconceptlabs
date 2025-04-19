
import { Image } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useState, useEffect } from "react";
import { toast } from "sonner";

interface QuestionImageUploadProps {
  imageUrl?: string;
  index: number;
  onImageUpload: (file: File) => void;
}

const QuestionImageUpload = ({ imageUrl, index, onImageUpload }: QuestionImageUploadProps) => {
  const [isImageLoading, setIsImageLoading] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [retryCount, setRetryCount] = useState(0);

  // Reset error state when imageUrl changes or component mounts
  useEffect(() => {
    if (imageUrl) {
      setImageError(false);
      setIsImageLoading(true);
    }
  }, [imageUrl]);

  const handleImageLoad = () => {
    setIsImageLoading(false);
    setImageError(false);
    console.log("Image loaded successfully:", imageUrl);
  };

  const handleImageError = () => {
    setIsImageLoading(false);
    setImageError(true);
    console.error("Failed to load image:", imageUrl);
    
    // Try to reload the image with a cache-busting query parameter
    if (retryCount < 2 && imageUrl) {
      setRetryCount(prev => prev + 1);
      const cacheBustUrl = `${imageUrl}?t=${Date.now()}`;
      console.log("Retrying with cache bust URL:", cacheBustUrl);
    }
  };

  const handleClick = () => {
    document.getElementById(`question-image-${index}`)?.click();
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
              <Image className="h-8 w-8 mx-auto mb-2 text-red-500" />
              <p className="text-sm text-red-500">Failed to load image</p>
              <p className="text-xs text-muted-foreground mt-1">Click to upload a new one</p>
            </div>
          ) : (
            <img 
              src={imageUrl} 
              alt="Question" 
              className={`max-w-full h-auto mx-auto ${isImageLoading ? 'hidden' : ''}`}
              onLoad={handleImageLoad}
              onError={handleImageError}
              key={retryCount} // Force reload when retryCount changes
            />
          )}
          
          <p className="text-sm text-muted-foreground">Click to change image</p>
        </div>
      ) : (
        <div className="py-4">
          <Image className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
          <p className="text-sm text-muted-foreground">Click to upload an image</p>
        </div>
      )}
      <Input
        id={`question-image-${index}`}
        type="file"
        accept="image/*"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) {
            setIsImageLoading(true);
            setImageError(false);
            console.log("Selected file:", file.name, file.type, file.size);
            onImageUpload(file);
          }
        }}
        className="hidden"
      />
    </div>
  );
};

export default QuestionImageUpload;
