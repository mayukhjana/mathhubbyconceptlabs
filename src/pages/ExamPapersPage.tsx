
import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Book, FileText, Download, Calendar, Loader2, BookOpen } from "lucide-react";
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
import PaperCard from "@/components/PaperCard";

// Interface for exam paper data
interface ExamPaper {
  id: number;
  year: string;
  title: string;
  url: string;
  filePath?: string; // Path in Supabase storage
  description?: string;
  examBoard: string;
  isPremium?: boolean;
}

// Updated file paths that don't use slashes in folder names
const examPapersList = {
  wbjee: [
    { id: 1, year: "2025", title: "WBJEE 2025", filePath: "wbjee_2025_paper.pdf", description: "Mathematics, Physics and Chemistry", examBoard: "WBJEE", isPremium: true },
    { id: 2, year: "2024", title: "WBJEE 2024", filePath: "wbjee_2024_paper.pdf", description: "Mathematics, Physics and Chemistry", examBoard: "WBJEE" },
    { id: 3, year: "2023", title: "WBJEE 2023", filePath: "wbjee_2023_paper.pdf", description: "Mathematics, Physics and Chemistry", examBoard: "WBJEE" },
    { id: 4, year: "2022", title: "WBJEE 2022", filePath: "wbjee_2022_paper.pdf", description: "Mathematics, Physics and Chemistry", examBoard: "WBJEE" },
    { id: 5, year: "2021", title: "WBJEE 2021", filePath: "wbjee_2021_paper.pdf", description: "Mathematics, Physics and Chemistry", examBoard: "WBJEE" },
    { id: 6, year: "2020", title: "WBJEE 2020", filePath: "wbjee_2020_paper.pdf", description: "Mathematics, Physics and Chemistry", examBoard: "WBJEE" },
    { id: 7, year: "2019", title: "WBJEE 2019", filePath: "wbjee_2019_paper.pdf", description: "Mathematics, Physics and Chemistry", examBoard: "WBJEE" },
    { id: 8, year: "2018", title: "WBJEE 2018", filePath: "wbjee_2018_paper.pdf", description: "Mathematics, Physics and Chemistry", examBoard: "WBJEE" },
    { id: 9, year: "2017", title: "WBJEE 2017", filePath: "wbjee_2017_paper.pdf", description: "Mathematics, Physics and Chemistry", examBoard: "WBJEE" },
    { id: 10, year: "2016", title: "WBJEE 2016", filePath: "wbjee_2016_paper.pdf", description: "Mathematics, Physics and Chemistry", examBoard: "WBJEE", isPremium: true }
  ],
  jeeMains: [
    { id: 1, year: "2023", title: "JEE Mains 2023", filePath: "jee_mains_2023_paper.pdf", description: "Mathematics, Physics and Chemistry", examBoard: "JEE Mains", isPremium: true },
    { id: 2, year: "2022", title: "JEE Mains 2022", filePath: "jee_mains_2022_paper.pdf", description: "Mathematics, Physics and Chemistry", examBoard: "JEE Mains" },
    { id: 3, year: "2021", title: "JEE Mains 2021", filePath: "jee_mains_2021_paper.pdf", description: "Mathematics, Physics and Chemistry", examBoard: "JEE Mains" },
    { id: 4, year: "2020", title: "JEE Mains 2020", filePath: "jee_mains_2020_paper.pdf", description: "Mathematics, Physics and Chemistry", examBoard: "JEE Mains" },
    { id: 5, year: "2019", title: "JEE Mains 2019", filePath: "jee_mains_2019_paper.pdf", description: "Mathematics, Physics and Chemistry", examBoard: "JEE Mains" },
    { id: 6, year: "2018", title: "JEE Mains 2018", filePath: "jee_mains_2018_paper.pdf", description: "Mathematics, Physics and Chemistry", examBoard: "JEE Mains" },
    { id: 7, year: "2017", title: "JEE Mains 2017", filePath: "jee_mains_2017_paper.pdf", description: "Mathematics, Physics and Chemistry", examBoard: "JEE Mains" },
    { id: 8, year: "2016", title: "JEE Mains 2016", filePath: "jee_mains_2016_paper.pdf", description: "Mathematics, Physics and Chemistry", examBoard: "JEE Mains" },
    { id: 9, year: "2015", title: "JEE Mains 2015", filePath: "jee_mains_2015_paper.pdf", description: "Mathematics, Physics and Chemistry", examBoard: "JEE Mains" },
    { id: 10, year: "2014", title: "JEE Mains 2014", filePath: "jee_mains_2014_paper.pdf", description: "Mathematics, Physics and Chemistry", examBoard: "JEE Mains", isPremium: true }
  ],
  jeeAdvanced: [
    { id: 1, year: "2023", title: "JEE Advanced 2023", filePath: "jee_advanced_2023_paper.pdf", description: "Mathematics, Physics and Chemistry", examBoard: "JEE Advanced", isPremium: true },
    { id: 2, year: "2022", title: "JEE Advanced 2022", filePath: "jee_advanced_2022_paper.pdf", description: "Mathematics, Physics and Chemistry", examBoard: "JEE Advanced" },
    { id: 3, year: "2021", title: "JEE Advanced 2021", filePath: "jee_advanced_2021_paper.pdf", description: "Mathematics, Physics and Chemistry", examBoard: "JEE Advanced" },
    { id: 4, year: "2020", title: "JEE Advanced 2020", filePath: "jee_advanced_2020_paper.pdf", description: "Mathematics, Physics and Chemistry", examBoard: "JEE Advanced" },
    { id: 5, year: "2019", title: "JEE Advanced 2019", filePath: "jee_advanced_2019_paper.pdf", description: "Mathematics, Physics and Chemistry", examBoard: "JEE Advanced" },
    { id: 6, year: "2018", title: "JEE Advanced 2018", filePath: "jee_advanced_2018_paper.pdf", description: "Mathematics, Physics and Chemistry", examBoard: "JEE Advanced" },
    { id: 7, year: "2017", title: "JEE Advanced 2017", filePath: "jee_advanced_2017_paper.pdf", description: "Mathematics, Physics and Chemistry", examBoard: "JEE Advanced" },
    { id: 8, year: "2016", title: "JEE Advanced 2016", filePath: "jee_advanced_2016_paper.pdf", description: "Mathematics, Physics and Chemistry", examBoard: "JEE Advanced" },
    { id: 9, year: "2015", title: "JEE Advanced 2015", filePath: "jee_advanced_2015_paper.pdf", description: "Mathematics, Physics and Chemistry", examBoard: "JEE Advanced" },
    { id: 10, year: "2014", title: "JEE Advanced 2014", filePath: "jee_advanced_2014_paper.pdf", description: "Mathematics, Physics and Chemistry", examBoard: "JEE Advanced", isPremium: true }
  ]
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
    <div className="min-h-screen flex flex-col bg-background">
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
                    <PaperCard 
                      key={paper.id}
                      title={paper.title}
                      description={paper.description || ""}
                      year={paper.year}
                      isPremium={paper.isPremium || false}
                      downloadUrl={paper.filePath}
                      examBoard={paper.examBoard}
                      solutionUrl={paper.filePath?.replace(".pdf", "_solution.pdf")}
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
                    <PaperCard 
                      key={paper.id}
                      title={paper.title}
                      description={paper.description || ""}
                      year={paper.year}
                      isPremium={paper.isPremium || false}
                      downloadUrl={paper.filePath}
                      examBoard={paper.examBoard}
                      solutionUrl={paper.filePath?.replace(".pdf", "_solution.pdf")}
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
                    <PaperCard 
                      key={paper.id}
                      title={paper.title}
                      description={paper.description || ""}
                      year={paper.year}
                      isPremium={paper.isPremium || false}
                      downloadUrl={paper.filePath}
                      examBoard={paper.examBoard}
                      solutionUrl={paper.filePath?.replace(".pdf", "_solution.pdf")}
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
