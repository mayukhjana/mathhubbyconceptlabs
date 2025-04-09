
import { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useAuth } from "@/contexts/AuthContext";
import { AuthGuard } from "@/components/AuthGuard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Upload, File, Check } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

const AdminUploadPage = () => {
  const [selectedBoard, setSelectedBoard] = useState("");
  const [selectedClass, setSelectedClass] = useState("");
  const [selectedYear, setSelectedYear] = useState("");
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [recentUploads, setRecentUploads] = useState<{
    id: string;
    name: string;
    board: string;
    class: string;
    year: string;
    url: string;
  }[]>([]);
  
  // Available boards and classes
  const boards = ["icse", "cbse", "west-bengal"];
  const classes = ["10", "12"];
  const years = Array.from({ length: 6 }, (_, i) => (2025 - i).toString());
  
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!event.target.files || event.target.files.length === 0) {
      setUploadedFile(null);
      return;
    }
    setUploadedFile(event.target.files[0]);
  };
  
  const handleUpload = async () => {
    if (!uploadedFile || !selectedBoard || !selectedClass || !selectedYear) {
      toast.error("Please fill in all fields and select a file to upload");
      return;
    }
    
    setIsUploading(true);
    setUploadProgress(0);
    
    try {
      // Create a file path format like: icse_class10_2022.pdf
      const fileExt = uploadedFile.name.split('.').pop();
      const fileName = `${selectedBoard}_class${selectedClass}_${selectedYear}.${fileExt}`;
      const filePath = `exam_papers/${fileName}`;
      
      // Mock file upload with progress for demo
      // In a real app, we would upload to Supabase Storage
      
      // Simulate upload progress
      const interval = setInterval(() => {
        setUploadProgress(prev => {
          const next = prev + 10;
          if (next >= 100) {
            clearInterval(interval);
            return 100;
          }
          return next;
        });
      }, 400);
      
      // Wait for "upload" to complete (simulation for demo)
      await new Promise(resolve => setTimeout(resolve, 4000));
      
      // Get public URL (in a real app, this would be from Supabase)
      const publicUrl = `/exam_papers/${fileName}`;
      
      // Add to recent uploads
      setRecentUploads(prev => [
        {
          id: Date.now().toString(),
          name: fileName,
          board: selectedBoard,
          class: selectedClass,
          year: selectedYear,
          url: publicUrl
        },
        ...prev.slice(0, 4) // Keep only 5 most recent
      ]);
      
      // Reset form
      setSelectedBoard("");
      setSelectedClass("");
      setSelectedYear("");
      setUploadedFile(null);
      
      // Show success message
      toast.success("File uploaded successfully!");
      
    } catch (error) {
      console.error("Error uploading file:", error);
      toast.error("Failed to upload file. Please try again.");
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
    }
  };
  
  return (
    <AuthGuard>
      <div className="min-h-screen flex flex-col">
        <Navbar />
        
        <main className="flex-grow py-8">
          <div className="container mx-auto px-4">
            <h1 className="text-3xl font-bold mb-2">Admin Upload Panel</h1>
            <p className="text-muted-foreground mb-8">
              Upload exam papers for students to practice
            </p>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Upload Form */}
              <div className="lg:col-span-2">
                <Card>
                  <CardHeader>
                    <CardTitle>Upload Exam Paper</CardTitle>
                    <CardDescription>
                      Upload PDF files of exam papers to make them available to students
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="board">Board</Label>
                        <Select 
                          value={selectedBoard} 
                          onValueChange={setSelectedBoard}
                        >
                          <SelectTrigger id="board">
                            <SelectValue placeholder="Select Board" />
                          </SelectTrigger>
                          <SelectContent>
                            {boards.map(board => (
                              <SelectItem key={board} value={board}>
                                {board.toUpperCase()}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="class">Class</Label>
                        <Select 
                          value={selectedClass} 
                          onValueChange={setSelectedClass}
                        >
                          <SelectTrigger id="class">
                            <SelectValue placeholder="Select Class" />
                          </SelectTrigger>
                          <SelectContent>
                            {classes.map(cls => (
                              <SelectItem key={cls} value={cls}>
                                Class {cls}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="year">Year</Label>
                        <Select 
                          value={selectedYear} 
                          onValueChange={setSelectedYear}
                        >
                          <SelectTrigger id="year">
                            <SelectValue placeholder="Select Year" />
                          </SelectTrigger>
                          <SelectContent>
                            {years.map(year => (
                              <SelectItem key={year} value={year}>
                                {year}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="file-upload">Exam Paper (PDF)</Label>
                      <div className="border-2 border-dashed rounded-md p-6 flex flex-col items-center justify-center">
                        {uploadedFile ? (
                          <div className="flex items-center gap-2">
                            <File size={24} className="text-mathprimary" />
                            <span>{uploadedFile.name}</span>
                          </div>
                        ) : (
                          <div className="text-center">
                            <Upload size={24} className="mx-auto text-muted-foreground mb-2" />
                            <p className="text-sm text-muted-foreground">
                              Drag and drop your file here, or click to select
                            </p>
                          </div>
                        )}
                        <Input 
                          id="file-upload" 
                          type="file" 
                          accept=".pdf" 
                          onChange={handleFileChange}
                          className="hidden" 
                        />
                      </div>
                    </div>
                    
                    {isUploading && (
                      <div className="w-full bg-gray-200 rounded-full h-2.5">
                        <div 
                          className="bg-mathprimary h-2.5 rounded-full" 
                          style={{ width: `${uploadProgress}%` }}
                        ></div>
                      </div>
                    )}
                  </CardContent>
                  <CardFooter>
                    <Button 
                      onClick={handleUpload} 
                      disabled={!uploadedFile || !selectedBoard || !selectedClass || !selectedYear || isUploading}
                      className="ml-auto"
                    >
                      {isUploading ? "Uploading..." : "Upload Paper"}
                    </Button>
                  </CardFooter>
                </Card>
              </div>
              
              {/* Recent Uploads */}
              <div>
                <Card>
                  <CardHeader>
                    <CardTitle>Recent Uploads</CardTitle>
                    <CardDescription>
                      Recently uploaded exam papers
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {recentUploads.length > 0 ? (
                      <ul className="space-y-3">
                        {recentUploads.map(upload => (
                          <li key={upload.id} className="border rounded-md p-3">
                            <div className="flex items-start justify-between">
                              <div>
                                <div className="font-medium">{upload.board.toUpperCase()} Class {upload.class}</div>
                                <div className="text-sm text-muted-foreground">Year: {upload.year}</div>
                              </div>
                              <div className="bg-green-100 text-green-800 p-1 rounded">
                                <Check size={14} />
                              </div>
                            </div>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-muted-foreground text-sm">No recent uploads</p>
                    )}
                  </CardContent>
                </Card>
                
                <Card className="mt-4">
                  <CardHeader>
                    <CardTitle>Upload Instructions</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="list-disc pl-5 space-y-2 text-sm">
                      <li>Upload files in PDF format</li>
                      <li>Maximum file size: 10MB</li>
                      <li>Name format will be automatically generated</li>
                      <li>Uploaded papers will be immediately available to students</li>
                      <li>For premium papers, students will need a subscription</li>
                    </ul>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </main>
        
        <Footer />
      </div>
    </AuthGuard>
  );
};

export default AdminUploadPage;
