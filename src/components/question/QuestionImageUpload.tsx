
import { Image } from "lucide-react";
import { Input } from "@/components/ui/input";

interface QuestionImageUploadProps {
  imageUrl?: string;
  index: number;
  onImageUpload: (file: File) => void;
}

const QuestionImageUpload = ({ imageUrl, index, onImageUpload }: QuestionImageUploadProps) => {
  return (
    <div 
      className="border-2 border-dashed rounded-lg p-4 text-center cursor-pointer hover:bg-accent transition-colors"
      onClick={() => document.getElementById(`question-image-${index}`)?.click()}
    >
      {imageUrl ? (
        <div className="space-y-2">
          <img src={imageUrl} alt="Question" className="max-w-full h-auto mx-auto" />
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
          if (file) onImageUpload(file);
        }}
        className="hidden"
      />
    </div>
  );
};

export default QuestionImageUpload;
