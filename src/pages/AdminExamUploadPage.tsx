
import { useState, useEffect, useCallback } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { fetchEntranceExams, fetchBoardExams } from "@/services/exam/queries";
import { deleteWBJEEExams, deleteExamById } from "@/services/exam/management";
import { Exam, BOARD_OPTIONS, ENTRANCE_OPTIONS } from "@/services/exam/types";
import { useNavigate } from "react-router-dom";
import LoadingAnimation from "@/components/LoadingAnimation";
import ExamSection from "@/components/admin/ExamSection";
import { RefreshCw } from "lucide-react";

const AdminExamUploadPage = () => {
  const [entranceExams, setEntranceExams] = useState<Exam[]>([]);
  const [boardExamsList, setBoardExamsList] = useState<Exam[]>([]);
  const [loading, setLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  const loadExams = useCallback(async (showToast: boolean = false) => {
    try {
      setIsRefreshing(true);
      const [entrance, board] = await Promise.all([
        fetchEntranceExams(),
        fetchBoardExams()
      ]);
      console.log("Loaded entrance exams:", entrance);
      console.log("Loaded board exams:", board);
      setEntranceExams(entrance);
      setBoardExamsList(board);
      
      if (showToast) {
        toast({
          title: "Refreshed",
          description: `Successfully loaded ${entrance.length + board.length} exams`
        });
      }
    } catch (error) {
      console.error("Error loading exams:", error);
      toast({
        title: "Error",
        description: "Failed to load exams",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
      setIsRefreshing(false);
    }
  }, [toast]);

  useEffect(() => {
    loadExams();
    
    // Set up a focus event listener to refresh data when user returns to the tab
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        loadExams(false); // Don't show toast on visibility change refresh
      }
    };
    
    document.addEventListener('visibilitychange', handleVisibilityChange);
    
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [loadExams]);

  const handleRefresh = () => {
    loadExams(true); // Show toast on manual refresh
  };

  const handleDeleteBoard = async (board: string) => {
    try {
      if (board === 'WBJEE') {
        console.log("Deleting all WBJEE exams...");
        await deleteWBJEEExams();
        // Wait a moment before reloading to let the database process deletion
        setTimeout(() => {
          loadExams(true); // Force reload and show toast after deletion
        }, 1000);
      }
    } catch (error) {
      console.error(`Error deleting ${board} exams:`, error);
      toast({
        title: "Error",
        description: `Failed to delete ${board} exams: ${error instanceof Error ? error.message : "Unknown error"}`,
        variant: "destructive"
      });
      throw error; // Propagate error to component
    }
  };

  const handleDeleteExam = async (examId: string, examTitle: string) => {
    try {
      console.log(`Deleting exam with ID: ${examId} and title: ${examTitle}`);
      await deleteExamById(examId);
      
      toast({
        title: "Success",
        description: `Exam "${examTitle}" deleted successfully`
      });
      
      // Return without throwing to allow the ExamCard to show success
    } catch (error) {
      console.error(`Error deleting exam:`, error);
      toast({
        title: "Error",
        description: `Failed to delete exam: ${error instanceof Error ? error.message : "Unknown error"}`,
        variant: "destructive"
      });
      throw error; // Propagate error to component
    }
  };

  const handleDeleteComplete = useCallback(() => {
    console.log("Delete operation completed, refreshing exam data...");
    // Add a small delay to ensure database operations have completed
    setTimeout(() => {
      loadExams(false); // Don't show toast as the component already showed success
    }, 500);
  }, [loadExams]);

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
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold">Exam Management</h1>
            <div className="space-x-2">
              <Button 
                variant="outline" 
                onClick={handleRefresh}
                disabled={isRefreshing}
              >
                <RefreshCw className={`mr-2 h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
                {isRefreshing ? "Refreshing..." : "Refresh"}
              </Button>
              <Button onClick={() => navigate("/admin/exam-upload/new")}>
                Add New Exam
              </Button>
            </div>
          </div>

          <Tabs defaultValue="entrance" className="space-y-4">
            <TabsList>
              <TabsTrigger value="entrance">Entrance Exams</TabsTrigger>
              <TabsTrigger value="board">Board Exams</TabsTrigger>
            </TabsList>

            <TabsContent value="entrance" className="space-y-6">
              {ENTRANCE_OPTIONS.map(board => {
                const boardExams = entranceExams.filter(exam => exam.board === board);
                return (
                  <ExamSection
                    key={board}
                    title={board}
                    exams={boardExams}
                    onDeleteExam={handleDeleteExam}
                    onDeleteComplete={handleDeleteComplete}
                    onDeleteAll={board === 'WBJEE' ? () => handleDeleteBoard(board) : undefined}
                    showDeleteAll={board === 'WBJEE'}
                  />
                );
              })}
            </TabsContent>

            <TabsContent value="board" className="space-y-6">
              {BOARD_OPTIONS.map(board => {
                const filteredBoardExams = boardExamsList.filter(exam => exam.board === board);
                return (
                  <ExamSection
                    key={board}
                    title={board}
                    exams={filteredBoardExams}
                    onDeleteExam={handleDeleteExam}
                    onDeleteComplete={handleDeleteComplete}
                  />
                );
              })}
            </TabsContent>
          </Tabs>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default AdminExamUploadPage;
