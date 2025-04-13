
import { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Download, Search, Eye, FilePlus2 } from "lucide-react";
import { Link } from "react-router-dom";

// Mock paper data - replace with actual data from your database
const paperData = [
  {
    id: "wbjee-math-2024",
    title: "WBJEE Mathematics 2024",
    board: "WBJEE",
    subject: "Mathematics",
    year: "2024",
    class: "12",
    pdfUrl: "#",
    solutionPdfUrl: "#",
    examId: "wbjee-math-2024"
  },
  {
    id: "wbjee-math-2023",
    title: "WBJEE Mathematics 2023",
    board: "WBJEE",
    subject: "Mathematics",
    year: "2023",
    class: "12",
    pdfUrl: "#",
    solutionPdfUrl: "#",
    examId: "wbjee-math-2023"
  },
  {
    id: "wbjee-math-2022",
    title: "WBJEE Mathematics 2022",
    board: "WBJEE",
    subject: "Mathematics",
    year: "2022",
    class: "12",
    pdfUrl: "#",
    solutionPdfUrl: "#",
    examId: "wbjee-math-2022"
  },
  {
    id: "wbjee-math-2021",
    title: "WBJEE Mathematics 2021",
    board: "WBJEE",
    subject: "Mathematics",
    year: "2021",
    class: "12",
    pdfUrl: "#",
    solutionPdfUrl: "#",
    examId: "wbjee-math-2021"
  },
  {
    id: "wbjee-math-2020",
    title: "WBJEE Mathematics 2020",
    board: "WBJEE",
    subject: "Mathematics",
    year: "2020",
    class: "12",
    pdfUrl: "#",
    solutionPdfUrl: "#",
    examId: "wbjee-math-2020"
  },
  {
    id: "jeemain-math-2024",
    title: "JEE MAINS Mathematics 2024",
    board: "JEE MAINS",
    subject: "Mathematics",
    year: "2024",
    class: "12",
    pdfUrl: "#",
    solutionPdfUrl: "#",
    examId: "jeemain-math-2024"
  },
  {
    id: "jeemain-math-2023",
    title: "JEE MAINS Mathematics 2023",
    board: "JEE MAINS",
    subject: "Mathematics",
    year: "2023",
    class: "12",
    pdfUrl: "#",
    solutionPdfUrl: "#",
    examId: "jeemain-math-2023"
  },
  {
    id: "jeemain-math-2022",
    title: "JEE MAINS Mathematics 2022",
    board: "JEE MAINS",
    subject: "Mathematics",
    year: "2022",
    class: "12",
    pdfUrl: "#",
    solutionPdfUrl: "#",
    examId: "jeemain-math-2022"
  },
  {
    id: "jeemain-math-2021",
    title: "JEE MAINS Mathematics 2021",
    board: "JEE MAINS",
    subject: "Mathematics",
    year: "2021",
    class: "12",
    pdfUrl: "#",
    solutionPdfUrl: "#",
    examId: "jeemain-math-2021"
  },
  {
    id: "jeemain-math-2020",
    title: "JEE MAINS Mathematics 2020",
    board: "JEE MAINS",
    subject: "Mathematics",
    year: "2020",
    class: "12",
    pdfUrl: "#",
    solutionPdfUrl: "#",
    examId: "jeemain-math-2020"
  },
  {
    id: "jeeadv-math-2024",
    title: "JEE ADVANCED Mathematics 2024",
    board: "JEE ADVANCED",
    subject: "Mathematics",
    year: "2024",
    class: "12",
    pdfUrl: "#",
    solutionPdfUrl: "#",
    examId: "jeeadv-math-2024"
  },
  {
    id: "jeeadv-math-2023",
    title: "JEE ADVANCED Mathematics 2023",
    board: "JEE ADVANCED",
    subject: "Mathematics",
    year: "2023",
    class: "12",
    pdfUrl: "#",
    solutionPdfUrl: "#",
    examId: "jeeadv-math-2023"
  },
  {
    id: "jeeadv-math-2022",
    title: "JEE ADVANCED Mathematics 2022",
    board: "JEE ADVANCED",
    subject: "Mathematics",
    year: "2022",
    class: "12",
    pdfUrl: "#",
    solutionPdfUrl: "#",
    examId: "jeeadv-math-2022"
  },
  {
    id: "jeeadv-math-2021",
    title: "JEE ADVANCED Mathematics 2021",
    board: "JEE ADVANCED",
    subject: "Mathematics",
    year: "2021",
    class: "12",
    pdfUrl: "#",
    solutionPdfUrl: "#",
    examId: "jeeadv-math-2021"
  },
  {
    id: "jeeadv-math-2020",
    title: "JEE ADVANCED Mathematics 2020",
    board: "JEE ADVANCED",
    subject: "Mathematics",
    year: "2020",
    class: "12",
    pdfUrl: "#",
    solutionPdfUrl: "#",
    examId: "jeeadv-math-2020"
  }
];

const ExamPapersPage = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("all");
  
  const filteredPapers = paperData.filter(paper => {
    const matchesSearch = 
      paper.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      paper.board.toLowerCase().includes(searchQuery.toLowerCase()) ||
      paper.subject.toLowerCase().includes(searchQuery.toLowerCase());
      
    const matchesTab = activeTab === "all" || paper.board.toLowerCase() === activeTab.toLowerCase();
    
    return matchesSearch && matchesTab;
  });
  
  // Get unique exam types for tabs
  const exams = Array.from(new Set(paperData.map(paper => paper.board.toLowerCase())));
  
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow py-8">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl font-bold mb-6">Entrance Exam Papers</h1>
          
          <div className="flex flex-col md:flex-row gap-4 items-start md:items-center mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
              <Input
                type="text"
                placeholder="Search for exam papers..."
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
          
          <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab} className="mb-8">
            <TabsList className="w-full flex overflow-x-auto">
              <TabsTrigger value="all" className="flex-1">All Exams</TabsTrigger>
              {exams.map(exam => (
                <TabsTrigger key={exam} value={exam} className="flex-1 capitalize">
                  {exam}
                </TabsTrigger>
              ))}
            </TabsList>
            
            <TabsContent value="all" className="mt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredPapers.length > 0 ? (
                  filteredPapers.map(paper => (
                    <Card key={paper.id} className="overflow-hidden">
                      <CardHeader>
                        <CardTitle>{paper.title}</CardTitle>
                        <div className="flex flex-wrap gap-2 mt-2">
                          <Badge variant="secondary">{paper.board}</Badge>
                          <Badge variant="outline">{paper.subject}</Badge>
                          <Badge variant="outline">Year {paper.year}</Badge>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <p className="text-muted-foreground mb-2">Year: {paper.year}</p>
                      </CardContent>
                      <CardFooter className="flex flex-wrap gap-2 border-t pt-4">
                        <Button variant="outline" className="flex-1" size="sm">
                          <Download className="h-4 w-4 mr-2" />
                          Download
                        </Button>
                        <Button variant="outline" className="flex-1" size="sm">
                          <Eye className="h-4 w-4 mr-2" />
                          Solutions
                        </Button>
                        <Button className="w-full mt-2" asChild>
                          <Link to={`/exams/${paper.examId}`}>
                            <FilePlus2 className="h-4 w-4 mr-2" />
                            Attempt Paper
                          </Link>
                        </Button>
                      </CardFooter>
                    </Card>
                  ))
                ) : (
                  <div className="col-span-full text-center py-12">
                    <p className="text-muted-foreground">No exam papers found matching your search.</p>
                  </div>
                )}
              </div>
            </TabsContent>
            
            {exams.map(exam => (
              <TabsContent key={exam} value={exam} className="mt-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredPapers
                    .filter(paper => paper.board.toLowerCase() === exam)
                    .map(paper => (
                      <Card key={paper.id} className="overflow-hidden">
                        <CardHeader>
                          <CardTitle>{paper.title}</CardTitle>
                          <div className="flex flex-wrap gap-2 mt-2">
                            <Badge variant="secondary">{paper.board}</Badge>
                            <Badge variant="outline">{paper.subject}</Badge>
                            <Badge variant="outline">Year {paper.year}</Badge>
                          </div>
                        </CardHeader>
                        <CardContent>
                          <p className="text-muted-foreground mb-2">Year: {paper.year}</p>
                        </CardContent>
                        <CardFooter className="flex flex-wrap gap-2 border-t pt-4">
                          <Button variant="outline" className="flex-1" size="sm">
                            <Download className="h-4 w-4 mr-2" />
                            Download
                          </Button>
                          <Button variant="outline" className="flex-1" size="sm">
                            <Eye className="h-4 w-4 mr-2" />
                            Solutions
                          </Button>
                          <Button className="w-full mt-2" asChild>
                            <Link to={`/exams/${paper.examId}`}>
                              <FilePlus2 className="h-4 w-4 mr-2" />
                              Attempt Paper
                            </Link>
                          </Button>
                        </CardFooter>
                      </Card>
                    ))}
                </div>
              </TabsContent>
            ))}
          </Tabs>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default ExamPapersPage;
