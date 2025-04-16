
import { useState, useEffect } from "react";
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

const AdminExamUploadPage = () => {
  const [entranceExams, setEntranceExams] = useState<Exam[]>([]);
  const [boardExamsList, setBoardExamsList] = useState<Exam[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const { toast } = useToast();
  const navigate = useNavigate();

  const loadExams = async () => {
    try {
      setLoading(true);
      const [entrance, board] = await Promise.all([
        fetchEntranceExams(),
        fetchBoardExams()
      ]);
      console.log("Loaded entrance exams:", entrance);
      console.log("Loaded board exams:", board);
      setEntranceExams(entrance);
      setBoardExamsList(board);
    } catch (error) {
      console.error("Error loading exams:", error);
      toast({
        title: "Error",
        description: "Failed to load exams",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadExams();
  }, [toast, refreshTrigger]);

  const handleRefresh = () => {
    setRefreshTrigger(prev => prev + 1);
  };

  const handleDeleteBoard = async (board: string) => {
    try {
      if (board === 'WBJEE') {
        console.log("Deleting all WBJEE exams...");
        await deleteWBJEEExams();
        handleRefresh();
        toast({
          title: "Success",
          description: `All ${board} exams deleted successfully`
        });
      }
    } catch (error) {
      console.error(`Error deleting ${board} exams:`, error);
      toast({
        title: "Error",
        description: `Failed to delete ${board} exams`,
        variant: "destructive"
      });
    }
  };

  const handleDeleteExam = async (examId: string, examTitle: string) => {
    try {
      console.log(`Deleting exam with ID: ${examId}`);
      await deleteExamById(examId);
      handleRefresh();
      
      toast({
        title: "Success",
        description: `Exam "${examTitle}" deleted successfully`
      });
    } catch (error) {
      console.error(`Error deleting exam:`, error);
      toast({
        title: "Error",
        description: "Failed to delete exam",
        variant: "destructive"
      });
    }
  };

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
              >
                Refresh
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
                    onDeleteComplete={handleRefresh}
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
                    onDeleteComplete={handleRefresh}
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
