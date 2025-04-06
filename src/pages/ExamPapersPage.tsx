
import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Book, FileText, Download, Calendar, Loader2 } from "lucide-react";
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle,
  CardDescription,
  CardFooter
} from "@/components/ui/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

// Interface for exam paper data
interface ExamPaper {
  id: number;
  year: string;
  title: string;
  url: string;
  filePath?: string; // Path in Supabase storage
}

// Mock data structure to map to storage files
const examPapersList = {
  wbjee: [
    { id: 1, year: "2023", title: "WBJEE 2023", filePath: "wbjee/2023/paper.pdf" },
    { id: 2, year: "2022", title: "WBJEE 2022", filePath: "wbjee/2022/paper.pdf" },
    { id: 3, year: "2021", title: "WBJEE 2021", filePath: "wbjee/2021/paper.pdf" },
    { id: 4, year: "2020", title: "WBJEE 2020", filePath: "wbjee/2020/paper.pdf" },
    { id: 5, year: "2019", title: "WBJEE 2019", filePath: "wbjee/2019/paper.pdf" },
    { id: 6, year: "2018", title: "WBJEE 2018", filePath: "wbjee/2018/paper.pdf" },
    { id: 7, year: "2017", title: "WBJEE 2017", filePath: "wbjee/2017/paper.pdf" },
    { id: 8, year: "2016", title: "WBJEE 2016", filePath: "wbjee/2016/paper.pdf" },
    { id: 9, year: "2015", title: "WBJEE 2015", filePath: "wbjee/2015/paper.pdf" },
    { id: 10, year: "2014", title: "WBJEE 2014", filePath: "wbjee/2014/paper.pdf" }
  ],
  jeeMains: [
    { id: 1, year: "2023", title: "JEE Mains 2023", filePath: "jee_mains/2023/paper.pdf" },
    { id: 2, year: "2022", title: "JEE Mains 2022", filePath: "jee_mains/2022/paper.pdf" },
    { id: 3, year: "2021", title: "JEE Mains 2021", filePath: "jee_mains/2021/paper.pdf" },
    { id: 4, year: "2020", title: "JEE Mains 2020", filePath: "jee_mains/2020/paper.pdf" },
    { id: 5, year: "2019", title: "JEE Mains 2019", filePath: "jee_mains/2019/paper.pdf" },
    { id: 6, year: "2018", title: "JEE Mains 2018", filePath: "jee_mains/2018/paper.pdf" },
    { id: 7, year: "2017", title: "JEE Mains 2017", filePath: "jee_mains/2017/paper.pdf" },
    { id: 8, year: "2016", title: "JEE Mains 2016", filePath: "jee_mains/2016/paper.pdf" },
    { id: 9, year: "2015", title: "JEE Mains 2015", filePath: "jee_mains/2015/paper.pdf" },
    { id: 10, year: "2014", title: "JEE Mains 2014", filePath: "jee_mains/2014/paper.pdf" }
  ],
  jeeAdvanced: [
    { id: 1, year: "2023", title: "JEE Advanced 2023", filePath: "jee_advanced/2023/paper.pdf" },
    { id: 2, year: "2022", title: "JEE Advanced 2022", filePath: "jee_advanced/2022/paper.pdf" },
    { id: 3, year: "2021", title: "JEE Advanced 2021", filePath: "jee_advanced/2021/paper.pdf" },
    { id: 4, year: "2020", title: "JEE Advanced 2020", filePath: "jee_advanced/2020/paper.pdf" },
    { id: 5, year: "2019", title: "JEE Advanced 2019", filePath: "jee_advanced/2019/paper.pdf" },
    { id: 6, year: "2018", title: "JEE Advanced 2018", filePath: "jee_advanced/2018/paper.pdf" },
    { id: 7, year: "2017", title: "JEE Advanced 2017", filePath: "jee_advanced/2017/paper.pdf" },
    { id: 8, year: "2016", title: "JEE Advanced 2016", filePath: "jee_advanced/2016/paper.pdf" },
    { id: 9, year: "2015", title: "JEE Advanced 2015", filePath: "jee_advanced/2015/paper.pdf" },
    { id: 10, year: "2014", title: "JEE Advanced 2014", filePath: "jee_advanced/2014/paper.pdf" }
  ]
};

const ExamPaperCard = ({ title, year, filePath }: { title: string; year: string; filePath: string }) => {
  const [isDownloading, setIsDownloading] = useState(false);
  
  const handleDownload = async () => {
    setIsDownloading(true);
    
    try {
      // Get the file from Supabase storage
      const { data, error } = await supabase.storage
        .from('exam_papers')
        .download(filePath);
      
      if (error) {
        throw error;
      }
      
      if (!data) {
        throw new Error("File not found");
      }
      
      // Create a URL for the downloaded file
      const url = URL.createObjectURL(data);
      
      // Create a temporary anchor to trigger download
      const a = document.createElement('a');
      a.href = url;
      a.download = `${title}.pdf`; // Set the file name for download
      document.body.appendChild(a);
      a.click();
      
      // Clean up
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      
      toast.success(`${title} download started!`);
    } catch (error) {
      console.error("Download error:", error);
      toast.error("Failed to download paper. The file might not exist yet.");
    } finally {
      setIsDownloading(false);
    }
  };
  
  return (
    <Card className="h-full hover:border-mathprimary/50 transition-all duration-300">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg">{title}</CardTitle>
        <CardDescription>Mathematics, Physics and Chemistry</CardDescription>
      </CardHeader>
      <CardContent className="pb-2">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Calendar size={14} />
          <span>Year: {year}</span>
        </div>
      </CardContent>
      <CardFooter className="pt-2 border-t">
        <Button 
          variant="outline" 
          size="sm" 
          onClick={handleDownload}
          disabled={isDownloading}
          className="w-full flex items-center gap-2"
        >
          {isDownloading ? (
            <>
              <Loader2 size={14} className="animate-spin" />
              Downloading...
            </>
          ) : (
            <>
              <Download size={14} />
              Download Paper
            </>
          )}
        </Button>
      </CardFooter>
    </Card>
  );
};

const ExamPapersPage = () => {
  const [activeTab, setActiveTab] = useState("wbjee");
  const [examPapers, setExamPapers] = useState(examPapersList);
  const [isLoading, setIsLoading] = useState(false);
  
  // Function to check if files exist in Supabase
  const checkExistingPapers = async () => {
    setIsLoading(true);
    try {
      // List all files in the exam_papers bucket
      const { data: files, error } = await supabase.storage
        .from('exam_papers')
        .list();
      
      if (error) {
        console.error("Error listing files:", error);
        return;
      }
      
      // Log the available files for debugging
      console.log("Available files in storage:", files);
      
    } catch (error) {
      console.error("Error checking papers:", error);
    } finally {
      setIsLoading(false);
    }
  };
  
  useEffect(() => {
    checkExistingPapers();
  }, []);
  
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1">
        <div className="container mx-auto px-4 py-10">
          <div className="mb-10 text-center">
            <h1 className="text-4xl font-bold mb-2">Exam Papers</h1>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Download previous years' question papers for WBJEE, JEE Mains, and JEE Advanced exams to practice and prepare for your upcoming exams.
            </p>
          </div>
          
          <Tabs 
            defaultValue="wbjee" 
            value={activeTab} 
            onValueChange={setActiveTab}
            className="max-w-4xl mx-auto"
          >
            <div className="flex justify-center mb-6">
              <TabsList className="grid w-full max-w-lg grid-cols-3">
                <TabsTrigger value="wbjee" className="flex items-center gap-1">
                  <Book size={16} />
                  <span className="hidden sm:inline">WBJEE</span>
                </TabsTrigger>
                <TabsTrigger value="jeeMains" className="flex items-center gap-1">
                  <FileText size={16} />
                  <span className="hidden sm:inline">JEE Mains</span>
                </TabsTrigger>
                <TabsTrigger value="jeeAdvanced" className="flex items-center gap-1">
                  <Book size={16} />
                  <span className="hidden sm:inline">JEE Advanced</span>
                </TabsTrigger>
              </TabsList>
            </div>
            
            <TabsContent value="wbjee" className="mt-4">
              {isLoading ? (
                <div className="flex justify-center py-8">
                  <Loader2 size={32} className="animate-spin text-mathprimary" />
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {examPapers.wbjee.map((paper) => (
                    <ExamPaperCard 
                      key={paper.id}
                      title={paper.title}
                      year={paper.year}
                      filePath={paper.filePath}
                    />
                  ))}
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="jeeMains" className="mt-4">
              {isLoading ? (
                <div className="flex justify-center py-8">
                  <Loader2 size={32} className="animate-spin text-mathprimary" />
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {examPapers.jeeMains.map((paper) => (
                    <ExamPaperCard 
                      key={paper.id}
                      title={paper.title}
                      year={paper.year}
                      filePath={paper.filePath}
                    />
                  ))}
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="jeeAdvanced" className="mt-4">
              {isLoading ? (
                <div className="flex justify-center py-8">
                  <Loader2 size={32} className="animate-spin text-mathprimary" />
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {examPapers.jeeAdvanced.map((paper) => (
                    <ExamPaperCard 
                      key={paper.id}
                      title={paper.title}
                      year={paper.year}
                      filePath={paper.filePath}
                    />
                  ))}
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default ExamPapersPage;
