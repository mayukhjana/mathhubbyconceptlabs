
import { Image as LucideImage, ImageOff } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { getContentTypeFromFile } from "@/utils/fileUtils";

interface QuestionImageUploadProps {
  imageUrl?: string;
  index: number;
  onImageUpload: (file: File) => void;
}

const QuestionImageUpload = ({ imageUrl, index, onImageUpload }: QuestionImageUploadProps) => {
  const [isImageLoading, setIsImageLoading] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [retryCount, setRetryCount] = useState(0);

  useEffect(() => {
    // Reset loading and error states when imageUrl changes
    if (imageUrl) {
      setIsImageLoading(true);
      setImageError(false);
      
      // Preload the image
      const img = new Image();
      img.src = imageUrl;
      img.onload = () => {
        setIsImageLoading(false);
        setImageError(false);
      };
      img.onerror = () => {
        setIsImageLoading(false);
        setImageError(true);
        console.error("Failed to load image:", imageUrl);
      };
    }
  }, [imageUrl]);

  const handleClick = () => {
    document.getElementById(`question-image-${index}`)?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
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
    onImageUpload(file);
  };

  return (
    <div 
      className="border-2 border-dashed rounded-lg p-4 text-center cursor-pointer hover:bg-accent transition-colors"
      onClick={handleClick}
    >
      {imageUrl ? (
        <div className="space-y-2">
          {isImageLoading ? (
            <div className="flex justify-center items-center py-4">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          ) : imageError ? (
            <div className="py-4">
              <ImageOff className="h-8 w-8 mx-auto mb-2 text-red-500" />
              <p className="text-sm text-red-500">Failed to load image</p>
              <p className="text-sm text-muted-foreground">Click to upload a new image</p>
            </div>
          ) : (
            <img 
              src={imageUrl} 
              alt="Question"
              className="max-w-full h-auto mx-auto rounded-md"
              onLoad={() => setIsImageLoading(false)}
              onError={() => setImageError(true)}
            />
          )}
          <p className="text-sm text-muted-foreground">Click to change image</p>
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
