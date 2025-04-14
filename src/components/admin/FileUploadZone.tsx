
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { File, Upload } from "lucide-react";

interface FileUploadZoneProps {
  id: string;
  label: string;
  file: File | null;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  description?: string;
  acceptFormats?: string;
  required?: boolean;
}

const FileUploadZone = ({ 
  id, 
  label, 
  file, 
  onChange, 
  description,
  acceptFormats = ".pdf",
  required = false
}: FileUploadZoneProps) => {
  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      // Create a synthetic event to pass to the onChange handler
      const fileList = e.dataTransfer.files;
      const syntheticEvent = {
        target: {
          files: fileList
        }
      } as unknown as React.ChangeEvent<HTMLInputElement>;
      
      onChange(syntheticEvent);
    }
  };

  return (
    <div className="space-y-2">
      <Label htmlFor={id}>
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </Label>
      <div 
        className="border-2 border-dashed rounded-md p-6 flex flex-col items-center justify-center cursor-pointer hover:border-mathprimary transition-colors"
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        onClick={() => document.getElementById(id)?.click()}
      >
        {file ? (
          <div className="flex items-center gap-2">
            <File size={24} className="text-mathprimary" />
            <span>{file.name}</span>
          </div>
        ) : (
          <div className="text-center">
            <Upload size={24} className="mx-auto text-muted-foreground mb-2" />
            <p className="text-sm text-muted-foreground">
              {description || "Drag and drop your file here, or click to select"}
            </p>
          </div>
        )}
        <Input 
          id={id} 
          type="file" 
          accept={acceptFormats}
          onChange={onChange}
          className="hidden" 
        />
      </div>
    </div>
  );
};

export default FileUploadZone;
