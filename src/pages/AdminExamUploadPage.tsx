
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
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    const loadExams = async () => {
      try {
        const [entrance, board] = await Promise.all([
          fetchEntranceExams(),
          fetchBoardExams()
        ]);
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

    loadExams();
  }, [toast]);

  const handleDeleteBoard = async (board: string) => {
    try {
      if (board === 'WBJEE') {
        await deleteWBJEEExams();
        const updatedExams = await fetchEntranceExams();
        setEntranceExams(updatedExams);
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
      await deleteExamById(examId);
      
      const [updatedEntranceExams, updatedBoardExams] = await Promise.all([
        fetchEntranceExams(),
        fetchBoardExams()
      ]);
      
      setEntranceExams(updatedEntranceExams);
      setBoardExamsList(updatedBoardExams);
      
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
            <Button onClick={() => navigate("/admin/exam-upload/new")}>
              Add New Exam
            </Button>
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
