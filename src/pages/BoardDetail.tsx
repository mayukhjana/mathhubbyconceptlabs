import { useEffect, useState } from "react";
import { useParams, useNavigate, Routes, Route } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ChapterAccordion, { Chapter } from "@/components/ChapterAccordion";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Star, Shield } from "lucide-react";
import { toast } from "sonner";
import LoadingAnimation from "@/components/LoadingAnimation";
import BoardNavigation from "@/components/BoardNavigation";

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

const chaptersByBoard: Record<string, Record<string, Chapter[]>> = {
  "icse": {
    "class10": [
      {
        id: "algebra",
        title: "Algebra",
        papers: [
          {
            id: "icse-alg-2022",
            title: "Algebra Paper 2022",
            description: "ICSE Class 10 Algebra Paper from 2022 examination",
            year: "2022",
            isPremium: false,
            downloadUrl: "/download/icse-alg-2022",
            practiceUrl: "/exams/icse-alg-2022"
          },
          {
            id: "icse-alg-2021",
            title: "Algebra Paper 2021",
            description: "ICSE Class 10 Algebra Paper from 2021 examination",
            year: "2021",
            isPremium: false,
            downloadUrl: "/download/icse-alg-2021",
            practiceUrl: "/exams/icse-alg-2021"
          },
          {
            id: "icse-alg-2020",
            title: "Algebra Paper 2020",
            description: "ICSE Class 10 Algebra Paper from 2020 examination",
            year: "2020",
            isPremium: true,
            downloadUrl: "/download/icse-alg-2020",
            practiceUrl: "/exams/icse-alg-2020"
          }
        ]
      },
      {
        id: "geometry",
        title: "Geometry",
        papers: [
          {
            id: "icse-geo-2022",
            title: "Geometry Paper 2022",
            description: "ICSE Class 10 Geometry Paper from 2022 examination",
            year: "2022",
            isPremium: false,
            downloadUrl: "/download/icse-geo-2022",
            practiceUrl: "/exams/icse-geo-2022"
          },
          {
            id: "icse-geo-2021",
            title: "Geometry Paper 2021",
            description: "ICSE Class 10 Geometry Paper from 2021 examination",
            year: "2021",
            isPremium: true,
            downloadUrl: "/download/icse-geo-2021",
            practiceUrl: "/exams/icse-geo-2021"
          }
        ]
      },
      {
        id: "trigonometry",
        title: "Trigonometry",
        papers: [
          {
            id: "icse-trig-2022",
            title: "Trigonometry Paper 2022",
            description: "ICSE Class 10 Trigonometry Paper from 2022 examination",
            year: "2022",
            isPremium: false,
            downloadUrl: "/download/icse-trig-2022",
            practiceUrl: "/exams/icse-trig-2022"
          },
          {
            id: "icse-trig-2021",
            title: "Trigonometry Paper 2021",
            description: "ICSE Class 10 Trigonometry Paper from 2021 examination",
            year: "2021",
            isPremium: true,
            downloadUrl: "/download/icse-trig-2021",
            practiceUrl: "/exams/icse-trig-2021"
          }
        ]
      }
    ],
    "class12": [
      {
        id: "calculus",
        title: "Calculus",
        papers: [
          {
            id: "icse-calc-2022",
            title: "Calculus Paper 2022",
            description: "ICSE Class 12 Calculus Paper from 2022 examination",
            year: "2022",
            isPremium: false,
            downloadUrl: "/download/icse-calc-2022",
            practiceUrl: "/exams/icse-calc-2022"
          },
          {
            id: "icse-calc-2021",
            title: "Calculus Paper 2021",
            description: "ICSE Class 12 Calculus Paper from 2021 examination",
            year: "2021",
            isPremium: true,
            downloadUrl: "/download/icse-calc-2021",
            practiceUrl: "/exams/icse-calc-2021"
          }
        ]
      }
    ]
  },
  "cbse": {
    "class10": [
      {
        id: "number-system",
        title: "Number Systems",
        papers: [
          {
            id: "cbse-num-2022",
            title: "Number Systems Paper 2022",
            description: "CBSE Class 10 Number Systems Paper from 2022 examination",
            year: "2022",
            isPremium: false,
            downloadUrl: "/download/cbse-num-2022",
            practiceUrl: "/exams/cbse-num-2022"
          },
          {
            id: "cbse-num-2021",
            title: "Number Systems Paper 2021",
            description: "CBSE Class 10 Number Systems Paper from 2021 examination",
            year: "2021",
            isPremium: true,
            downloadUrl: "/download/cbse-num-2021",
            practiceUrl: "/exams/cbse-num-2021"
          }
        ]
      }
    ],
    "class12": [
      {
        id: "relations-functions",
        title: "Relations and Functions",
        papers: [
          {
            id: "cbse-rel-2022",
            title: "Relations and Functions Paper 2022",
            description: "CBSE Class 12 Relations and Functions from 2022 examination",
            year: "2022",
            isPremium: false,
            downloadUrl: "/download/cbse-rel-2022",
            practiceUrl: "/exams/cbse-rel-2022"
          },
          {
            id: "cbse-rel-2021",
            title: "Relations and Functions Paper 2021",
            description: "CBSE Class 12 Relations and Functions from 2021 examination",
            year: "2021",
            isPremium: true,
            downloadUrl: "/download/cbse-rel-2021",
            practiceUrl: "/exams/cbse-rel-2021"
          }
        ]
      }
    ]
  },
  "west-bengal": {
    "class10": [
      {
        id: "algebra-wb",
        title: "Algebra",
        papers: [
          {
            id: "wb-alg-2022",
            title: "Algebra Paper 2022",
            description: "West Bengal Class 10 Algebra Paper from 2022 examination",
            year: "2022",
            isPremium: false,
            downloadUrl: "/download/wb-alg-2022",
            practiceUrl: "/exams/wb-alg-2022"
          },
          {
            id: "wb-alg-2021",
            title: "Algebra Paper 2021",
            description: "West Bengal Class 10 Algebra Paper from 2021 examination",
            year: "2021",
            isPremium: true,
            downloadUrl: "/download/wb-alg-2021",
            practiceUrl: "/exams/wb-alg-2021"
          }
        ]
      }
    ],
    "class12": [
      {
        id: "calculus-wb",
        title: "Calculus",
        papers: [
          {
            id: "wb-calc-2022",
            title: "Calculus Paper 2022",
            description: "West Bengal Class 12 Calculus Paper from 2022 examination",
            year: "2022",
            isPremium: false,
            downloadUrl: "/download/wb-calc-2022",
            practiceUrl: "/exams/wb-calc-2022"
          },
          {
            id: "wb-calc-2021",
            title: "Calculus Paper 2021",
            description: "West Bengal Class 12 Calculus Paper from 2021 examination",
            year: "2021",
            isPremium: true,
            downloadUrl: "/download/wb-calc-2021",
            practiceUrl: "/exams/wb-calc-2021"
          }
        ]
      }
    ]
  }
};

const BoardDetail = () => {
  const { boardId } = useParams<{ boardId: string }>();
  const [userIsPremium, setUserIsPremium] = useState(false);
  const navigate = useNavigate();
  
  const boardInfo = boardId ? boardsInfo[boardId as keyof typeof boardsInfo] : null;
  const chapters = boardId ? chaptersByBoard[boardId as keyof typeof chaptersByBoard] : null;
  
  const handleGetPremium = () => {
    window.location.href = "/premium";
  };
  
  useEffect(() => {
    setUserIsPremium(localStorage.getItem("userIsPremium") === "true");
  }, []);
  
  if (!boardInfo || !chapters) {
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
      <LoadingAnimation />
      <Navbar />
      
      <main className="flex-grow">
        {/* Board Header */}
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
        
        {/* Premium Notice */}
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
        
        {/* Content */}
        <div className="container mx-auto px-4 py-8">
          {/* Show the board navigation options */}
          <BoardNavigation boardId={boardId} boardName={boardInfo.name} />
          
          {/* This section will be shown in child routes */}
          <Routes>
            <Route 
              path="papers" 
              element={
                <PapersList 
                  boardId={boardId} 
                  userIsPremium={userIsPremium} 
                />
              } 
            />
            <Route 
              path="chapters" 
              element={
                <ChaptersList 
                  boardId={boardId}
                  chapters={chapters}
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

const PapersList = ({ boardId, userIsPremium }: { boardId: string; userIsPremium: boolean }) => {
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
          <PapersGrid 
            papers={Array.from({ length: 6 }, (_, i) => ({
              id: `${boardId}-class10-${2025 - i}`,
              title: `${boardId.toUpperCase()} Class 10 Paper ${2025 - i}`,
              description: `Complete mock test paper from ${2025 - i}`,
              year: (2025 - i).toString(),
              isPremium: i >= 2, // Make only 2020-2021 free, rest premium
              downloadUrl: `/download/${boardId}-class10-${2025 - i}`,
              practiceUrl: `/exams/${boardId}-class10-${2025 - i}`
            }))}
            userIsPremium={userIsPremium}
          />
        </TabsContent>
        
        <TabsContent value="class12">
          <PapersGrid 
            papers={Array.from({ length: 6 }, (_, i) => ({
              id: `${boardId}-class12-${2025 - i}`,
              title: `${boardId.toUpperCase()} Class 12 Paper ${2025 - i}`,
              description: `Complete mock test paper from ${2025 - i}`,
              year: (2025 - i).toString(),
              isPremium: i >= 2, // Make only 2020-2021 free, rest premium
              downloadUrl: `/download/${boardId}-class12-${2025 - i}`,
              practiceUrl: `/exams/${boardId}-class12-${2025 - i}`
            }))}
            userIsPremium={userIsPremium}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};

const PapersGrid = ({ papers, userIsPremium }: { 
  papers: {
    id: string;
    title: string;
    description: string;
    year: string;
    isPremium: boolean;
    downloadUrl?: string;
    practiceUrl?: string;
  }[]; 
  userIsPremium: boolean;
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {papers.map((paper) => (
        <PaperCard
          key={paper.id}
          title={paper.title}
          description={paper.description}
          year={paper.year}
          isPremium={paper.isPremium}
          userIsPremium={userIsPremium}
          downloadUrl={paper.downloadUrl}
          practiceUrl={paper.practiceUrl}
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
          <ChapterAccordion
            chapters={chapters.class10.map(chapter => {
              // Mark first 2 papers in each chapter as free, rest as premium
              return {
                ...chapter,
                papers: chapter.papers.map((paper, index) => ({
                  ...paper,
                  isPremium: index >= 2
                }))
              };
            })}
            userIsPremium={userIsPremium}
          />
        </TabsContent>
        
        <TabsContent value="class12">
          <ChapterAccordion
            chapters={chapters.class12.map(chapter => {
              // Mark first 2 papers in each chapter as free, rest as premium
              return {
                ...chapter,
                papers: chapter.papers.map((paper, index) => ({
                  ...paper,
                  isPremium: index >= 2
                }))
              };
            })}
            userIsPremium={userIsPremium}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default BoardDetail;
