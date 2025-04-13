
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Upload, Plus, X, FileUp } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { uploadExamFile } from "@/services/examService";

const formSchema = z.object({
  title: z.string().min(1, "Title is required"),
  board: z.string().min(1, "Board is required"),
  year: z.string().min(1, "Year is required"),
  class: z.string().min(1, "Class is required"),
  chapter: z.string().optional(),
  duration: z.number().min(1, "Duration is required"),
  isPremium: z.boolean().default(false),
});

type FormValues = z.infer<typeof formSchema>;

const AdminExamUploadPage = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [paperFile, setPaperFile] = useState<File | null>(null);
  const [solutionFile, setSolutionFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      board: "",
      year: new Date().getFullYear().toString(),
      class: "12",
      chapter: "",
      duration: 180,
      isPremium: false,
    },
  });
  
  const onSubmit = async (data: FormValues) => {
    if (!paperFile) {
      toast({ title: "Error", description: "Please upload a paper file" });
      return;
    }
    
    setIsUploading(true);
    
    try {
      // Step 1: Create the exam record
      const { data: examData, error: examError } = await supabase
        .from("exams")
        .insert({
          title: data.title,
          board: data.board,
          year: data.year,
          class: data.class,
          chapter: data.chapter || null,
          duration: data.duration,
          is_premium: data.isPremium,
        })
        .select("id")
        .single();
        
      if (examError) {
        throw new Error(examError.message);
      }
      
      const examId = examData.id;
      
      // Step 2: Upload the paper file
      const paperUrl = await uploadExamFile(paperFile, examId, 'paper');
      
      // Step 3: Upload the solution file if provided
      let solutionUrl = null;
      if (solutionFile) {
        solutionUrl = await uploadExamFile(solutionFile, examId, 'solution');
      }
      
      toast({ 
        title: "Success", 
        description: "Exam paper uploaded successfully" 
      });
      
      // Redirect to a page to add questions
      navigate(`/admin/exams/${examId}/questions`);
      
    } catch (error: any) {
      console.error("Upload error:", error);
      toast({ 
        title: "Error", 
        description: error.message || "Failed to upload exam paper" 
      });
    } finally {
      setIsUploading(false);
    }
  };
  
  const handlePaperUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setPaperFile(e.target.files[0]);
    }
  };
  
  const handleSolutionUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSolutionFile(e.target.files[0]);
    }
  };
  
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow py-8">
        <div className="container max-w-4xl mx-auto px-4">
          <h1 className="text-3xl font-bold mb-6">Upload New Exam Paper</h1>
          
          <Card>
            <CardHeader>
              <CardTitle>Exam Details</CardTitle>
              <CardDescription>
                Fill in the details and upload files for the new exam paper.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="title"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Exam Title</FormLabel>
                          <FormControl>
                            <Input placeholder="e.g. WBJEE Mathematics 2024" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="board"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Exam Board</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select an exam board" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="WBJEE">WBJEE</SelectItem>
                              <SelectItem value="JEE MAINS">JEE MAINS</SelectItem>
                              <SelectItem value="JEE ADVANCED">JEE ADVANCED</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="year"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Year</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select year" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {Array.from({ length: 6 }, (_, i) => (
                                <SelectItem key={2024 - i} value={(2024 - i).toString()}>
                                  {2024 - i}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="class"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Class</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select class" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="10">Class 10</SelectItem>
                              <SelectItem value="12">Class 12</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="chapter"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Chapter (Optional)</FormLabel>
                          <FormControl>
                            <Input placeholder="e.g. Calculus, Algebra" {...field} />
                          </FormControl>
                          <FormDescription>
                            Leave empty for full exam papers
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="duration"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Duration (minutes)</FormLabel>
                          <FormControl>
                            <Input 
                              type="number" 
                              {...field} 
                              onChange={(e) => field.onChange(parseInt(e.target.value))}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="isPremium"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                          <FormControl>
                            <Checkbox
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                          <div className="space-y-1 leading-none">
                            <FormLabel>Premium Content</FormLabel>
                            <FormDescription>
                              Mark this exam as premium content (requires subscription)
                            </FormDescription>
                          </div>
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  {/* File Upload Section */}
                  <div className="space-y-6">
                    <div className="space-y-2">
                      <FormLabel>Exam Paper PDF</FormLabel>
                      <div className="border rounded-md p-4">
                        {paperFile ? (
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <FileUp className="h-5 w-5 text-gray-500" />
                              <span>{paperFile.name}</span>
                            </div>
                            <Button 
                              type="button" 
                              variant="ghost" 
                              size="sm" 
                              onClick={() => setPaperFile(null)}
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </div>
                        ) : (
                          <label className="flex flex-col items-center gap-2 cursor-pointer">
                            <Upload className="h-6 w-6 text-gray-500" />
                            <span className="text-sm text-muted-foreground">
                              Click to upload PDF file
                            </span>
                            <input 
                              type="file" 
                              accept=".pdf" 
                              className="hidden" 
                              onChange={handlePaperUpload} 
                            />
                          </label>
                        )}
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <FormLabel>Solution PDF (Optional)</FormLabel>
                      <div className="border rounded-md p-4">
                        {solutionFile ? (
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <FileUp className="h-5 w-5 text-gray-500" />
                              <span>{solutionFile.name}</span>
                            </div>
                            <Button 
                              type="button" 
                              variant="ghost" 
                              size="sm" 
                              onClick={() => setSolutionFile(null)}
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </div>
                        ) : (
                          <label className="flex flex-col items-center gap-2 cursor-pointer">
                            <Upload className="h-6 w-6 text-gray-500" />
                            <span className="text-sm text-muted-foreground">
                              Click to upload solution PDF file
                            </span>
                            <input 
                              type="file" 
                              accept=".pdf" 
                              className="hidden" 
                              onChange={handleSolutionUpload} 
                            />
                          </label>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  <Button type="submit" className="w-full" disabled={isUploading}>
                    {isUploading ? "Uploading..." : "Upload Exam Paper"}
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default AdminExamUploadPage;
