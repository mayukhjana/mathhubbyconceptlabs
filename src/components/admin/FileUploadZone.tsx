
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { File, Upload } from "lucide-react";
import { getContentTypeFromFile, isPdfFile } from "@/utils/fileUtils";
import { useEffect, useState } from "react";

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
  const [fileDetails, setFileDetails] = useState<{size: string, type: string} | null>(null);

  useEffect(() => {
    if (file) {
      // Log file details when a file is selected
      const size = `${(file.size / (1024 * 1024)).toFixed(2)} MB`;
      const extension = file.name.split('.').pop()?.toLowerCase();
      const type = isPdfFile(file) ? "application/pdf" : (file.type || "Unknown type");
      setFileDetails({ size, type });
      
      console.log(`File selected: ${file.name}, Size: ${size}, Type: ${type}, Extension: ${extension}`);
    } else {
      setFileDetails(null);
    }
  }, [file]);

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const droppedFile = e.dataTransfer.files[0];
      const extension = droppedFile.name.split('.').pop()?.toLowerCase();
      
      // Strict check for PDF file
      if (acceptFormats === ".pdf" && extension !== 'pdf') {
        alert("Please upload a PDF document");
        return;
      }
      
      // Create a synthetic event to pass to the onChange handler
      const syntheticEvent = {
        target: {
          files: e.dataTransfer.files
        }
      } as unknown as React.ChangeEvent<HTMLInputElement>;
      
      onChange(syntheticEvent);
    }
  };

  // Get the file type description for display
  const getFileTypeDisplay = () => {
    if (!file) return "";
    
    // Always identify PDFs by extension rather than MIME type
    const extension = file.name.split(".").pop()?.toLowerCase();
    if (extension === "pdf") return "PDF Document";
    
    // For other files, use our content type helper
    switch (extension) {
      case "png": return "PNG Image";
      case "jpg":
      case "jpeg": return "JPEG Image";
      case "gif": return "GIF Image";
      case "webp": return "WebP Image";
      case "svg": return "SVG Image";
      default: return getContentTypeFromFile(file) || "Unknown type";
    }
  };

  // Validate file is PDF for exam uploads
  const validateFileType = (file: File): boolean => {
    if (acceptFormats === ".pdf") {
      const extension = file.name.split(".").pop()?.toLowerCase();
      return extension === "pdf";
    }
    return true;
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      const selectedFile = event.target.files[0];
      
      if (!validateFileType(selectedFile)) {
        alert("Please upload a PDF document for exam papers and solutions.");
        return;
      }
      
      // Log the file details for debugging purposes
      const extension = selectedFile.name.split(".").pop()?.toLowerCase();
      console.log(`Selected file: ${selectedFile.name}, type: ${selectedFile.type}, size: ${selectedFile.size} bytes, extension: ${extension}`);
      
      // Pass the file directly without modifying it
      onChange(event);
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
          <div className="flex flex-col items-center gap-2">
            <File size={24} className="text-mathprimary" />
            <div className="flex flex-col text-center">
              <span className="font-medium">{file.name}</span>
              <span className="text-xs text-muted-foreground">{getFileTypeDisplay()}</span>
              {fileDetails && (
                <span className="text-xs text-muted-foreground">
                  {fileDetails.size} - {fileDetails.type}
                </span>
              )}
            </div>
          </div>
        ) : (
          <div className="text-center">
            <Upload size={24} className="mx-auto text-muted-foreground mb-2" />
            <p className="text-sm text-muted-foreground">
              {description || "Drag and drop your file here, or click to select"}
            </p>
            {acceptFormats && (
              <p className="text-xs text-muted-foreground mt-1">
                Accepted format: {acceptFormats}
              </p>
            )}
          </div>
        )}
        <Input 
          id={id} 
          type="file" 
          accept={acceptFormats}
          onChange={handleFileChange}
          className="hidden" 
        />
      </div>
    </div>
  );
};

export default FileUploadZone;
