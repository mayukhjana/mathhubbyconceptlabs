import { useEffect, useState } from "react";
import { useParams, useNavigate, Routes, Route } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ChapterAccordion, { Chapter } from "@/components/ChapterAccordion";
import PaperCard from "@/components/PaperCard";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Star, Shield, RefreshCw } from "lucide-react";
import { toast } from "sonner";
import LoadingAnimation from "@/components/LoadingAnimation";
import BoardNavigation from "@/components/BoardNavigation";
import { fetchBoardExams, fetchBoardChapters } from "@/services/exam/queries";
import { Exam } from "@/services/exam/types";
import { getFileDownloadUrl } from "@/services/exam/storage";

const boardsInfo = {
  "icse": {
    name: "ICSE Board",
    description: "The Indian Certificate of Secondary Education (ICSE) is an examination conducted by the Council for the Indian School Certificate Examinations.",
    image: "https://images.unsplash.com/photo-1613909207039-6b173b755cc1?q=80&w=2676&auto=format&fit=crop",
  },
  "cbse": {
    name: "CBSE Board",
    description: "The Central Board of Secondary Education (CBSE) is a national level board of education in India for public and private schools.",
    image: "https://images.unsplash.com/photo-1635372722656-389f87a941b7?q=80&w=2670&auto=format&fit=crop",
  },
  "west-bengal": {
    name: "West Bengal Board",
    description: "The West Bengal Board of Secondary Education conducts the Madhyamik Pariksha (Secondary Examination) for students in West Bengal.",
    image: "https://images.unsplash.com/photo-1588072432836-e10032774350?q=80&w=2672&auto=format&fit=crop",
  }
};

const BoardDetail = () => {
  const { boardId } = useParams<{ boardId: string }>();
  const [userIsPremium, setUserIsPremium] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [fullMockExams, setFullMockExams] = useState<Record<string, Exam[]>>({});
  const [chapterExams, setChapterExams] = useState<Record<string, Chapter[]>>({});
  const navigate = useNavigate();
  
  const formattedBoardId = boardId ? boardId.toUpperCase() : "";
  
  const boardInfo = boardId ? boardsInfo[boardId as keyof typeof boardsInfo] : null;
  
  const handleGetPremium = () => {
    window.location.href = "/premium";
  };
  
  useEffect(() => {
    setUserIsPremium(localStorage.getItem("userIsPremium") === "true");
  }, []);

  const loadBoardData = async () => {
    if (!formattedBoardId) return;
    
    setLoading(true);
    setError(null);
    
    try {
      console.log(`Fetching exams for board: ${formattedBoardId}`);
      
      const class10MockExams = await fetchBoardExams(formattedBoardId, "full-mock", "10");
      const class12MockExams = await fetchBoardExams(formattedBoardId, "full-mock", "12");
      
      console.log(`Retrieved ${class10MockExams.length} Class 10 mock exams and ${class12MockExams.length} Class 12 mock exams`);
      
      setFullMockExams({
        class10: class10MockExams,
        class12: class12MockExams
      });
      
      const chapters = await fetchBoardChapters(formattedBoardId);
      console.log(`Retrieved ${chapters.length} chapters for ${formattedBoardId}:`, chapters);
      
      const class10Chapters: Chapter[] = [];
      const class12Chapters: Chapter[] = [];
      
      for (const chapter of chapters) {
        const class10ChapterExams = await fetchBoardExams(formattedBoardId, chapter, "10");
        const class12ChapterExams = await fetchBoardExams(formattedBoardId, chapter, "12");
        
        console.log(`Retrieved ${class10ChapterExams.length} Class 10 exams and ${class12ChapterExams.length} Class 12 exams for chapter ${chapter}`);
        
        if (class10ChapterExams.length > 0) {
          const formattedChapter: Chapter = {
            id: chapter,
            title: chapter.charAt(0).toUpperCase() + chapter.slice(1),
            papers: await Promise.all(class10ChapterExams.map(async (exam) => {
              const downloadUrl = await getFileDownloadUrl(exam.id, 'paper', exam.board);
              const solutionUrl = await getFileDownloadUrl(exam.id, 'solution', exam.board);
              
              return {
                id: exam.id,
                title: exam.title,
                description: `${exam.board} ${exam.year} - ${chapter}`,
                year: exam.year,
                isPremium: exam.is_premium,
                downloadUrl,
                solutionUrl,
                practiceUrl: `/exams/${exam.id}`,
                examBoard: exam.board
              };
            }))
          };
          class10Chapters.push(formattedChapter);
        }
        
        if (class12ChapterExams.length > 0) {
          const formattedChapter: Chapter = {
            id: chapter,
            title: chapter.charAt(0).toUpperCase() + chapter.slice(1),
            papers: await Promise.all(class12ChapterExams.map(async (exam) => {
              const downloadUrl = await getFileDownloadUrl(exam.id, 'paper', exam.board);
              const solutionUrl = await getFileDownloadUrl(exam.id, 'solution', exam.board);
              
              return {
                id: exam.id,
                title: exam.title,
                description: `${exam.board} ${exam.year} - ${chapter}`,
                year: exam.year,
                isPremium: exam.is_premium,
                downloadUrl,
                solutionUrl,
                practiceUrl: `/exams/${exam.id}`,
                examBoard: exam.board
              };
            }))
          };
          class12Chapters.push(formattedChapter);
        }
      }
      
      setChapterExams({
        class10: class10Chapters,
        class12: class12Chapters
      });
      
    } catch (err) {
      console.error("Error loading board data:", err);
      setError("Failed to load board exams. Please try again.");
      toast.error("Failed to load board exams");
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => {
    if (boardId) {
      loadBoardData();
    }
  }, [boardId]);
  
  const handleRefresh = () => {
    loadBoardData();
    toast.success("Refreshing board data...");
  };
  
  if (!boardInfo) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-grow flex items-center justify-center">
          <p className="text-xl text-gray-600">Board not found</p>
        </div>
        <Footer />
      </div>
    );
  }
  
  return (
    <div className="min-h-screen flex flex-col">
      {loading && <LoadingAnimation />}
      <Navbar />
      
      <main className="flex-grow">
        <div 
          className="relative bg-cover bg-center h-64"
          style={{ backgroundImage: `url(${boardInfo.image})` }}
        >
          <div className="absolute inset-0 bg-black/60"></div>
          <div className="relative container mx-auto px-4 h-full flex flex-col justify-end pb-8">
            <h1 className="text-4xl font-bold text-white mb-2">{boardInfo.name}</h1>
            <p className="text-white/80 max-w-2xl">{boardInfo.description}</p>
          </div>
        </div>
        
        {!userIsPremium && (
          <div className="bg-mathprimary/10 border-y border-mathprimary/20">
            <div className="container mx-auto px-4 py-3">
              <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-2">
                  <Star className="h-5 w-5 text-mathprimary" />
                  <p className="text-sm">
                    <span className="font-medium">Unlock all premium papers</span>
                    {" "}with a MathHub Premium subscription.
                  </p>
                </div>
                <Button onClick={handleGetPremium} className="whitespace-nowrap">
                  Get Premium
                </Button>
              </div>
            </div>
          </div>
        )}
        
        <div className="container mx-auto px-4 py-8">
          <BoardNavigation boardId={boardId} boardName={boardInfo.name} />
          
          <div className="flex justify-end mb-4">
            <Button 
              variant="outline" 
              onClick={handleRefresh}
              className="flex items-center gap-2"
              disabled={loading}
            >
              <RefreshCw className="h-4 w-4" />
              Refresh Exams
            </Button>
          </div>
          
          {error && (
            <div className="bg-red-50 text-red-700 p-4 rounded-md mb-6">
              {error}
            </div>
          )}
          
          <Routes>
            <Route 
              path="papers" 
              element={
                <PapersList 
                  boardId={boardId} 
                  userIsPremium={userIsPremium}
                  fullMockExams={fullMockExams}
                />
              } 
            />
            <Route 
              path="chapters" 
              element={
                <ChaptersList 
                  boardId={boardId}
                  chapters={chapterExams}
                  userIsPremium={userIsPremium}
                />
              } 
            />
          </Routes>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

const PapersList = ({ boardId, userIsPremium, fullMockExams }: { 
  boardId: string; 
  userIsPremium: boolean; 
  fullMockExams: Record<string, Exam[]>;
}) => {
  return (
    <div className="mt-8">
      <h2 className="text-2xl font-bold mb-6">Full Mock Test Papers</h2>
      <Tabs defaultValue="class10">
        <div className="flex items-center justify-between mb-6">
          <TabsList>
            <TabsTrigger value="class10">Class 10</TabsTrigger>
            <TabsTrigger value="class12">Class 12</TabsTrigger>
          </TabsList>
          
          {userIsPremium && (
            <div className="flex items-center gap-2 text-sm bg-mathprimary/10 px-3 py-1.5 rounded-full">
              <Shield className="h-4 w-4 text-mathprimary" />
              <span className="font-medium text-mathprimary">Premium Active</span>
            </div>
          )}
        </div>
        
        <TabsContent value="class10">
          <ExamPapersGrid 
            exams={fullMockExams.class10 || []}
            userIsPremium={userIsPremium}
          />
        </TabsContent>
        
        <TabsContent value="class12">
          <ExamPapersGrid 
            exams={fullMockExams.class12 || []}
            userIsPremium={userIsPremium}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};

const ExamPapersGrid = ({ exams, userIsPremium }: { exams: Exam[], userIsPremium: boolean }) => {
  const [paperUrls, setPaperUrls] = useState<Record<string, string>>({});
  const [solutionUrls, setSolutionUrls] = useState<Record<string, string>>({});
  
  useEffect(() => {
    const fetchUrls = async () => {
      const paperUrlsObj: Record<string, string> = {};
      const solutionUrlsObj: Record<string, string> = {};
      
      for (const exam of exams) {
        try {
          const paperUrl = await getFileDownloadUrl(exam.id, 'paper', exam.board);
          if (paperUrl) paperUrlsObj[exam.id] = paperUrl;
          
          const solutionUrl = await getFileDownloadUrl(exam.id, 'solution', exam.board);
          if (solutionUrl) solutionUrlsObj[exam.id] = solutionUrl;
        } catch (err) {
          console.error(`Error fetching URLs for exam ${exam.id}:`, err);
        }
      }
      
      setPaperUrls(paperUrlsObj);
      setSolutionUrls(solutionUrlsObj);
    };
    
    if (exams.length > 0) {
      fetchUrls();
    }
  }, [exams]);
  
  if (exams.length === 0) {
    return (
      <div className="text-center py-12 bg-gray-50 rounded-lg">
        <p className="text-muted-foreground">No mock test papers available yet. Check back later!</p>
      </div>
    );
  }
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {exams.map((exam) => (
        <PaperCard
          key={exam.id}
          title={exam.title}
          description={`Complete mock test paper from ${exam.year}`}
          year={exam.year}
          isPremium={exam.is_premium}
          userIsPremium={userIsPremium}
          downloadUrl={paperUrls[exam.id]}
          solutionUrl={solutionUrls[exam.id]}
          practiceUrl={`/exams/${exam.id}`}
          examBoard={exam.board}
          isFullMock={true}
        />
      ))}
    </div>
  );
};

const ChaptersList = ({ boardId, chapters, userIsPremium }: { 
  boardId: string;
  chapters: Record<string, Chapter[]>;
  userIsPremium: boolean;
}) => {
  return (
    <div className="mt-8">
      <h2 className="text-2xl font-bold mb-6">Practice by Chapters</h2>
      <Tabs defaultValue="class10">
        <div className="flex items-center justify-between mb-6">
          <TabsList>
            <TabsTrigger value="class10">Class 10</TabsTrigger>
            <TabsTrigger value="class12">Class 12</TabsTrigger>
          </TabsList>
          
          {userIsPremium && (
            <div className="flex items-center gap-2 text-sm bg-mathprimary/10 px-3 py-1.5 rounded-full">
              <Shield className="h-4 w-4 text-mathprimary" />
              <span className="font-medium text-mathprimary">Premium Active</span>
            </div>
          )}
        </div>
        
        <TabsContent value="class10">
          {chapters.class10 && chapters.class10.length > 0 ? (
            <ChapterAccordion
              chapters={chapters.class10}
              userIsPremium={userIsPremium}
            />
          ) : (
            <div className="text-center py-12 bg-gray-50 rounded-lg">
              <p className="text-muted-foreground">No chapter-wise papers available yet. Check back later!</p>
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="class12">
          {chapters.class12 && chapters.class12.length > 0 ? (
            <ChapterAccordion
              chapters={chapters.class12}
              userIsPremium={userIsPremium}
            />
          ) : (
            <div className="text-center py-12 bg-gray-50 rounded-lg">
              <p className="text-muted-foreground">No chapter-wise papers available yet. Check back later!</p>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default BoardDetail;
