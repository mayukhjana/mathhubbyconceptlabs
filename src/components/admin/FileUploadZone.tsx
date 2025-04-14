
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { File, Upload } from "lucide-react";

interface FileUploadZoneProps {
  id: string;
  label: string;
  file: File | null;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  description?: string;
}

const FileUploadZone = ({ 
  id, 
  label, 
  file, 
  onChange, 
  description 
}: FileUploadZoneProps) => {
  return (
    <div className="space-y-2">
      <Label htmlFor={id}>{label}</Label>
      <div className="border-2 border-dashed rounded-md p-6 flex flex-col items-center justify-center">
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
          accept=".pdf" 
          onChange={onChange}
          className="hidden" 
        />
      </div>
    </div>
  );
};

export default FileUploadZone;
