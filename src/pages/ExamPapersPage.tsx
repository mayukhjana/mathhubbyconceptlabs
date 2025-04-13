
import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Search } from "lucide-react";
import PaperCard from "@/components/PaperCard";
import { fetchEntranceExams, getFileDownloadUrl, Exam } from "@/services/examService";
import LoadingAnimation from "@/components/LoadingAnimation";
import { useAuth } from "@/contexts/AuthContext";

const ExamPapersPage = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("all");
  const [loading, setLoading] = useState(true);
  const [exams, setExams] = useState<Exam[]>([]);
  const { user } = useAuth();
  const [userIsPremium, setUserIsPremium] = useState(false);
  
  useEffect(() => {
    // For demo, check if user is premium from localStorage
    const isPremium = localStorage.getItem("userIsPremium") === "true";
    setUserIsPremium(isPremium);
    
    const loadExams = async () => {
      setLoading(true);
      const examData = await fetchEntranceExams();
      setExams(examData);
      setLoading(false);
    };
    
    loadExams();
  }, []);
  
  // Get unique exam types for tabs
  const examBoards = Array.from(new Set(exams.map(exam => exam.board.toLowerCase())));
  
  const filteredExams = exams.filter(exam => {
    const matchesSearch = 
      exam.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      exam.board.toLowerCase().includes(searchQuery.toLowerCase());
      
    const matchesTab = activeTab === "all" || exam.board.toLowerCase() === activeTab.toLowerCase();
    
    return matchesSearch && matchesTab;
  });
  
  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-grow flex items-center justify-center">
          <LoadingAnimation />
        </div>
        <Footer />
      </div>
    );
  }
  
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
              {examBoards.map(board => (
                <TabsTrigger key={board} value={board} className="flex-1 capitalize">
                  {board}
                </TabsTrigger>
              ))}
            </TabsList>
            
            <TabsContent value="all" className="mt-6">
              <ExamsList exams={filteredExams} userIsPremium={userIsPremium} />
            </TabsContent>
            
            {examBoards.map(board => (
              <TabsContent key={board} value={board} className="mt-6">
                <ExamsList 
                  exams={filteredExams.filter(exam => exam.board.toLowerCase() === board)} 
                  userIsPremium={userIsPremium}
                />
              </TabsContent>
            ))}
          </Tabs>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

const ExamsList = ({ exams, userIsPremium }: { exams: Exam[], userIsPremium: boolean }) => {
  if (exams.length === 0) {
    return (
      <div className="col-span-full text-center py-12">
        <p className="text-muted-foreground">No exam papers found matching your search.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {exams.map(exam => (
        <ExamPaperCard key={exam.id} exam={exam} userIsPremium={userIsPremium} />
      ))}
    </div>
  );
};

const ExamPaperCard = ({ exam, userIsPremium }: { exam: Exam, userIsPremium: boolean }) => {
  const [paperUrl, setPaperUrl] = useState<string | null>(null);
  const [solutionUrl, setSolutionUrl] = useState<string | null>(null);
  
  useEffect(() => {
    // Get paper and solution URLs
    const fetchUrls = async () => {
      const paperDownloadUrl = await getFileDownloadUrl(exam.id, 'paper');
      const solutionDownloadUrl = await getFileDownloadUrl(exam.id, 'solution');
      
      setPaperUrl(paperDownloadUrl);
      setSolutionUrl(solutionDownloadUrl);
    };
    
    fetchUrls();
  }, [exam.id]);
  
  return (
    <PaperCard 
      title={exam.title}
      description={`${exam.board} ${exam.year} Entrance Exam`}
      year={exam.year}
      isPremium={exam.is_premium}
      userIsPremium={userIsPremium}
      downloadUrl={paperUrl || undefined}
      solutionUrl={solutionUrl || undefined}
      practiceUrl={`/exams/${exam.id}`}
      examBoard={exam.board}
    />
  );
};

export default ExamPapersPage;
