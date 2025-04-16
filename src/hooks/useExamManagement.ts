
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
        await deleteWBJEEExams();
        await loadExams(true);
        return;
      }
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
      await deleteExamById(examId);
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
