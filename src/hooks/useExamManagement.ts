
import { useState, useCallback } from "react";
import { useToast } from "@/hooks/use-toast";
import { Exam } from "@/services/exam/types";
import { fetchEntranceExams, fetchBoardExams } from "@/services/exam/queries";
import { deleteWBJEEExams, deleteExamById } from "@/services/exam/management";

export const useExamManagement = () => {
  const [entranceExams, setEntranceExams] = useState<Exam[]>([]);
  const [boardExamsList, setBoardExamsList] = useState<Exam[]>([]);
  const [loading, setLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [lastRefreshTime, setLastRefreshTime] = useState(Date.now());
  const { toast } = useToast();

  const loadExams = useCallback(async (showToast: boolean = false) => {
    try {
      setIsRefreshing(true);
      const [entrance, board] = await Promise.all([
        fetchEntranceExams(),
        fetchBoardExams()
      ]);
      setEntranceExams(entrance);
      setBoardExamsList(board);
      setLastRefreshTime(Date.now());
      
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

  const handleDeleteBoard = async (board: string) => {
    try {
      if (board === 'WBJEE') {
        const result = await deleteWBJEEExams();
        // Update the local state immediately to reflect the deletion
        if (result.success) {
          setEntranceExams(prev => prev.filter(exam => exam.board !== 'WBJEE'));
          toast({
            title: "Success",
            description: `All WBJEE exams deleted successfully`
          });
        }
        return result;
      }
      throw new Error(`Deletion not implemented for board: ${board}`);
    } catch (error) {
      console.error(`Error deleting ${board} exams:`, error);
      toast({
        title: "Error",
        description: `Failed to delete ${board} exams: ${error instanceof Error ? error.message : "Unknown error"}`,
        variant: "destructive"
      });
      throw error;
    }
  };

  const handleDeleteExam = async (examId: string, examTitle: string) => {
    try {
      // Try deleting the exam
      await deleteExamById(examId);
      
      // If successful, update local state to remove the deleted exam immediately
      setEntranceExams(prev => prev.filter(exam => exam.id !== examId));
      setBoardExamsList(prev => prev.filter(exam => exam.id !== examId));
      
      toast({
        title: "Success",
        description: `Exam "${examTitle}" deleted successfully`
      });
      return Promise.resolve();
    } catch (error) {
      console.error(`Error deleting exam:`, error);
      toast({
        title: "Error",
        description: `Failed to delete exam: ${error instanceof Error ? error.message : "Unknown error"}`,
        variant: "destructive"
      });
      return Promise.reject(error);
    }
  };

  return {
    entranceExams,
    boardExamsList,
    loading,
    isRefreshing,
    lastRefreshTime,
    loadExams,
    handleDeleteBoard,
    handleDeleteExam
  };
};
