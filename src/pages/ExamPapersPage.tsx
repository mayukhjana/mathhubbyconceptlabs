
import { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Book, FileText, Download, Calendar } from "lucide-react";
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

// Mock data for exam papers
const examPapers = {
  wbjee: [
    { id: 1, year: "2023", title: "WBJEE 2023", url: "#" },
    { id: 2, year: "2022", title: "WBJEE 2022", url: "#" },
    { id: 3, year: "2021", title: "WBJEE 2021", url: "#" },
    { id: 4, year: "2020", title: "WBJEE 2020", url: "#" },
    { id: 5, year: "2019", title: "WBJEE 2019", url: "#" },
    { id: 6, year: "2018", title: "WBJEE 2018", url: "#" },
    { id: 7, year: "2017", title: "WBJEE 2017", url: "#" },
    { id: 8, year: "2016", title: "WBJEE 2016", url: "#" },
    { id: 9, year: "2015", title: "WBJEE 2015", url: "#" },
    { id: 10, year: "2014", title: "WBJEE 2014", url: "#" }
  ],
  jeeMains: [
    { id: 1, year: "2023", title: "JEE Mains 2023", url: "#" },
    { id: 2, year: "2022", title: "JEE Mains 2022", url: "#" },
    { id: 3, year: "2021", title: "JEE Mains 2021", url: "#" },
    { id: 4, year: "2020", title: "JEE Mains 2020", url: "#" },
    { id: 5, year: "2019", title: "JEE Mains 2019", url: "#" },
    { id: 6, year: "2018", title: "JEE Mains 2018", url: "#" },
    { id: 7, year: "2017", title: "JEE Mains 2017", url: "#" },
    { id: 8, year: "2016", title: "JEE Mains 2016", url: "#" },
    { id: 9, year: "2015", title: "JEE Mains 2015", url: "#" },
    { id: 10, year: "2014", title: "JEE Mains 2014", url: "#" }
  ],
  jeeAdvanced: [
    { id: 1, year: "2023", title: "JEE Advanced 2023", url: "#" },
    { id: 2, year: "2022", title: "JEE Advanced 2022", url: "#" },
    { id: 3, year: "2021", title: "JEE Advanced 2021", url: "#" },
    { id: 4, year: "2020", title: "JEE Advanced 2020", url: "#" },
    { id: 5, year: "2019", title: "JEE Advanced 2019", url: "#" },
    { id: 6, year: "2018", title: "JEE Advanced 2018", url: "#" },
    { id: 7, year: "2017", title: "JEE Advanced 2017", url: "#" },
    { id: 8, year: "2016", title: "JEE Advanced 2016", url: "#" },
    { id: 9, year: "2015", title: "JEE Advanced 2015", url: "#" },
    { id: 10, year: "2014", title: "JEE Advanced 2014", url: "#" }
  ]
};

const ExamPaperCard = ({ title, year, url }: { title: string; year: string; url: string }) => {
  const [isDownloading, setIsDownloading] = useState(false);
  
  const handleDownload = () => {
    setIsDownloading(true);
    
    // Simulate download delay
    setTimeout(() => {
      setIsDownloading(false);
      toast.success(`${title} download started!`);
      // In a real app, window.location.href = url
    }, 1000);
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
          <Download size={14} />
          {isDownloading ? "Downloading..." : "Download Paper"}
        </Button>
      </CardFooter>
    </Card>
  );
}

const ExamPapersPage = () => {
  const [activeTab, setActiveTab] = useState("wbjee");
  
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
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {examPapers.wbjee.map((paper) => (
                  <ExamPaperCard 
                    key={paper.id}
                    title={paper.title}
                    year={paper.year}
                    url={paper.url}
                  />
                ))}
              </div>
            </TabsContent>
            
            <TabsContent value="jeeMains" className="mt-4">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {examPapers.jeeMains.map((paper) => (
                  <ExamPaperCard 
                    key={paper.id}
                    title={paper.title}
                    year={paper.year}
                    url={paper.url}
                  />
                ))}
              </div>
            </TabsContent>
            
            <TabsContent value="jeeAdvanced" className="mt-4">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {examPapers.jeeAdvanced.map((paper) => (
                  <ExamPaperCard 
                    key={paper.id}
                    title={paper.title}
                    year={paper.year}
                    url={paper.url}
                  />
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default ExamPapersPage;
