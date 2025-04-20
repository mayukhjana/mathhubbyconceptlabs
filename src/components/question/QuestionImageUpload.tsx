
import { Image } from "lucide-react";
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
  const [cacheBustUrl, setCacheBustUrl] = useState<string | undefined>(imageUrl);

  // Reset error state and prepare image when imageUrl changes or component mounts
  useEffect(() => {
    if (imageUrl) {
      setImageError(false);
      setIsImageLoading(true);
      
      // Add cache-busting parameter to URL
      const timestamp = new Date().getTime();
      const newUrl = `${imageUrl}${imageUrl.includes('?') ? '&' : '?'}t=${timestamp}`;
      setCacheBustUrl(newUrl);
      console.log("Setting up image with cache bust URL:", newUrl);
      
      // Preload the image
      const img = new Image();
      img.crossOrigin = "anonymous";
      img.onload = () => {
        console.log("Image preloaded successfully:", newUrl);
        setIsImageLoading(false);
        setImageError(false);
      };
      img.onerror = () => {
        console.error("Failed to preload image:", newUrl);
        setIsImageLoading(false);
        setImageError(true);
        
        // Try to reload the image with a new cache-busting query parameter
        if (retryCount < 2) {
          setRetryCount(prev => prev + 1);
          const newTimestamp = new Date().getTime();
          const retryUrl = `${imageUrl}${imageUrl.includes('?') ? '&' : '?'}t=${newTimestamp}_${retryCount + 1}`;
          console.log("Retrying with cache bust URL:", retryUrl);
          setCacheBustUrl(retryUrl);
        }
      };
      img.src = newUrl;
    } else {
      setCacheBustUrl(undefined);
    }
  }, [imageUrl, retryCount]);

  const handleImageLoad = () => {
    setIsImageLoading(false);
    setImageError(false);
    console.log("Image loaded successfully:", cacheBustUrl);
  };

  const handleImageError = () => {
    setIsImageLoading(false);
    setImageError(true);
    console.error("Failed to load image:", cacheBustUrl);
    
    // Try to reload the image with a cache-busting query parameter
    if (retryCount < 2 && imageUrl) {
      setRetryCount(prev => prev + 1);
      const timestamp = new Date().getTime();
      const newCacheBustUrl = `${imageUrl}${imageUrl.includes('?') ? '&' : '?'}t=${timestamp}_${retryCount}`;
      console.log("Retrying with cache bust URL:", newCacheBustUrl);
      setCacheBustUrl(newCacheBustUrl);
      setIsImageLoading(true);
    }
  };

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
    
    // Check file size
    const maxSizeInBytes = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSizeInBytes) {
      toast.error("Image size must be less than 5MB");
      return;
    }
    
    setIsImageLoading(true);
    setImageError(false);
    console.log("Selected file:", file.name, file.type, file.size);
    onImageUpload(file);
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
              src={cacheBustUrl} 
              alt="Question" 
              className={`max-w-full h-auto mx-auto ${isImageLoading ? 'hidden' : ''}`}
              onLoad={handleImageLoad}
              onError={handleImageError}
              crossOrigin="anonymous"
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
        onChange={handleFileChange}
        className="hidden"
      />
    </div>
  );
};

export default QuestionImageUpload;
