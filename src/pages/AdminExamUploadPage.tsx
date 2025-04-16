
import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { 
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription
} from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Trash2, AlertCircle } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useToast } from "@/hooks/use-toast";
import { 
  fetchEntranceExams, 
  fetchBoardExams
} from "@/services/exam/queries";
import { deleteWBJEEExams, deleteExamById } from "@/services/exam/management";
import { Exam, BOARD_OPTIONS, ENTRANCE_OPTIONS } from "@/services/exam/types";
import { useNavigate } from "react-router-dom";
import LoadingAnimation from "@/components/LoadingAnimation";

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
        // Refresh the entrance exams list after deletion
        const updatedExams = await fetchEntranceExams();
        setEntranceExams(updatedExams);
        toast({
          title: "Success",
          description: `All ${board} exams deleted successfully`
        });
      }
      // Add support for other board deletions here
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
      
      // Refresh both exam lists to ensure UI is up to date
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

  const groupExamsByType = (exams: Exam[], type: string) => {
    const grouped: { [key: string]: Exam[] } = {};
    
    exams.forEach(exam => {
      if (!grouped[exam.board]) {
        grouped[exam.board] = [];
      }
      grouped[exam.board].push(exam);
    });
    
    return grouped;
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
                  <Card key={board}>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle>{board}</CardTitle>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="destructive" size="sm">
                            <Trash2 className="mr-2 h-4 w-4" />
                            Delete All
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                            <AlertDialogDescription>
                              This will permanently delete all {board} exams. This action cannot be undone.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction 
                              onClick={() => handleDeleteBoard(board)}
                              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                            >
                              Delete All
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </CardHeader>
                    <CardContent>
                      {boardExams.length === 0 ? (
                        <div className="text-center py-4 text-muted-foreground">
                          <AlertCircle className="mx-auto h-6 w-6 mb-2" />
                          <p>No exams found for {board}</p>
                        </div>
                      ) : (
                        <ScrollArea className="h-[300px]">
                          <div className="space-y-2">
                            {boardExams.map(exam => (
                              <div key={exam.id} className="flex items-center justify-between p-2 rounded-lg border">
                                <div>
                                  <h4 className="font-medium">{exam.title}</h4>
                                  <p className="text-sm text-muted-foreground">
                                    Year: {exam.year} | Duration: {exam.duration} mins
                                  </p>
                                </div>
                                <AlertDialog>
                                  <AlertDialogTrigger asChild>
                                    <Button variant="destructive" size="sm">Delete</Button>
                                  </AlertDialogTrigger>
                                  <AlertDialogContent>
                                    <AlertDialogHeader>
                                      <AlertDialogTitle>Delete Exam</AlertDialogTitle>
                                      <AlertDialogDescription>
                                        Are you sure you want to delete "{exam.title}"? This action cannot be undone.
                                      </AlertDialogDescription>
                                    </AlertDialogHeader>
                                    <AlertDialogFooter>
                                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                                      <AlertDialogAction 
                                        onClick={() => handleDeleteExam(exam.id, exam.title)}
                                        className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                      >
                                        Delete
                                      </AlertDialogAction>
                                    </AlertDialogFooter>
                                  </AlertDialogContent>
                                </AlertDialog>
                              </div>
                            ))}
                          </div>
                        </ScrollArea>
                      )}
                    </CardContent>
                  </Card>
                );
              })}
            </TabsContent>

            <TabsContent value="board" className="space-y-6">
              {BOARD_OPTIONS.map(board => {
                const filteredBoardExams = boardExamsList.filter(exam => exam.board === board);
                return (
                  <Card key={board}>
                    <CardHeader>
                      <CardTitle>{board}</CardTitle>
                      <CardDescription>
                        Total Exams: {filteredBoardExams.length}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      {filteredBoardExams.length === 0 ? (
                        <div className="text-center py-4 text-muted-foreground">
                          <AlertCircle className="mx-auto h-6 w-6 mb-2" />
                          <p>No exams found for {board}</p>
                        </div>
                      ) : (
                        <ScrollArea className="h-[300px]">
                          <div className="space-y-2">
                            {filteredBoardExams.map(exam => (
                              <div key={exam.id} className="flex items-center justify-between p-2 rounded-lg border">
                                <div>
                                  <h4 className="font-medium">{exam.title}</h4>
                                  <p className="text-sm text-muted-foreground">
                                    Year: {exam.year} | Duration: {exam.duration} mins
                                  </p>
                                </div>
                                <AlertDialog>
                                  <AlertDialogTrigger asChild>
                                    <Button variant="destructive" size="sm">Delete</Button>
                                  </AlertDialogTrigger>
                                  <AlertDialogContent>
                                    <AlertDialogHeader>
                                      <AlertDialogTitle>Delete Exam</AlertDialogTitle>
                                      <AlertDialogDescription>
                                        Are you sure you want to delete "{exam.title}"? This action cannot be undone.
                                      </AlertDialogDescription>
                                    </AlertDialogHeader>
                                    <AlertDialogFooter>
                                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                                      <AlertDialogAction 
                                        onClick={() => handleDeleteExam(exam.id, exam.title)}
                                        className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                      >
                                        Delete
                                      </AlertDialogAction>
                                    </AlertDialogFooter>
                                  </AlertDialogContent>
                                </AlertDialog>
                              </div>
                            ))}
                          </div>
                        </ScrollArea>
                      )}
                    </CardContent>
                  </Card>
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
