
import { Image } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useState } from "react";

interface QuestionImageUploadProps {
  imageUrl?: string;
  index: number;
  onImageUpload: (file: File) => void;
}

const QuestionImageUpload = ({ imageUrl, index, onImageUpload }: QuestionImageUploadProps) => {
  const [isImageLoading, setIsImageLoading] = useState(false);
  const [imageError, setImageError] = useState(false);

  const handleImageLoad = () => {
    setIsImageLoading(false);
    setImageError(false);
  };

  const handleImageError = () => {
    setIsImageLoading(false);
    setImageError(true);
  };

  return (
    <div 
      className="border-2 border-dashed rounded-lg p-4 text-center cursor-pointer hover:bg-accent transition-colors"
      onClick={() => document.getElementById(`question-image-${index}`)?.click()}
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
            onImageUpload(file);
          }
        }}
        className="hidden"
      />
    </div>
  );
};

export default QuestionImageUpload;
