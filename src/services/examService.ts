import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export type Question = {
  id: string;
  exam_id: string;
  question_text: string;
  option_a: string;
  option_b: string;
  option_c: string;
  option_d: string;
  correct_answer: string; // 'a', 'b', 'c', or 'd'
  order_number: number;
};

export type Exam = {
  id: string;
  title: string;
  board: string;
  class: string;
  year: string;
  chapter: string | null;
  duration: number;
  is_premium: boolean;
};

export const fetchExam = async (examId: string): Promise<Exam | null> => {
  try {
    const { data, error } = await supabase
      .from("exams")
      .select("*")
      .eq("id", examId)
      .single();
      
    if (error) {
      console.error("Error fetching exam:", error);
      throw error;
    }
    
    return data;
  } catch (error) {
    toast.error("Failed to load exam details");
    return null;
  }
};

export const fetchExamQuestions = async (examId: string): Promise<Question[]> => {
  try {
    const { data, error } = await supabase
      .from("questions")
      .select("*")
      .eq("exam_id", examId)
      .order("order_number", { ascending: true });
      
    if (error) {
      console.error("Error fetching questions:", error);
      throw error;
    }
    
    return data || [];
  } catch (error) {
    toast.error("Failed to load exam questions");
    return [];
  }
};

export const submitExamResults = async (
  userId: string,
  examId: string,
  score: number,
  totalQuestions: number,
  timeTaken: number
) => {
  try {
    const { error } = await supabase
      .from("user_results")
      .insert({
        user_id: userId,
        exam_id: examId,
        score,
        total_questions: totalQuestions,
        time_taken: timeTaken
      });
      
    if (error) {
      console.error("Error submitting results:", error);
      throw error;
    }
    
    return true;
  } catch (error) {
    toast.error("Failed to save your exam results");
    return false;
  }
};

export const uploadExamFile = async (file: File, examId: string, fileType: 'paper' | 'solution', board: string) => {
  try {
    let bucket = '';
    
    if (fileType === 'paper') {
      switch (board.toUpperCase()) {
        case 'WBJEE':
          bucket = 'wbjee_papers';
          break;
        case 'JEE MAINS':
          bucket = 'jee_mains_papers';
          break;
        case 'JEE ADVANCED':
          bucket = 'jee_advanced_papers';
          break;
        default:
          bucket = 'exam_papers';
      }
    } else { // solution
      switch (board.toUpperCase()) {
        case 'WBJEE':
          bucket = 'wbjee_solutions';
          break;
        case 'JEE MAINS':
          bucket = 'jee_mains_solutions';
          break;
        case 'JEE ADVANCED':
          bucket = 'jee_advanced_solutions';
          break;
        default:
          bucket = 'solutions';
      }
    }
    
    const filePath = `${examId}/${file.name}`;
    
    const { error } = await supabase.storage
      .from(bucket)
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: true
      });
      
    if (error) {
      throw error;
    }
    
    const { data } = supabase.storage
      .from(bucket)
      .getPublicUrl(filePath);
      
    return data.publicUrl;
  } catch (error) {
    console.error(`Error uploading ${fileType}:`, error);
    toast.error(`Failed to upload ${fileType}`);
    return null;
  }
};

export const fetchEntranceExams = async (boardFilter?: string): Promise<Exam[]> => {
  try {
    console.log("Fetching entrance exams with filter:", boardFilter);
    
    let query = supabase
      .from("exams")
      .select("*");
    
    if (boardFilter && boardFilter.toLowerCase() !== "all") {
      query = query.eq("board", boardFilter);
    } else {
      query = query.in("board", ['WBJEE', 'JEE MAINS', 'JEE ADVANCED']);
    }
    
    query = query.order("year", { ascending: false });
    
    const { data, error } = await query;
      
    if (error) {
      console.error("Error fetching entrance exams:", error);
      throw error;
    }
    
    console.log("Fetched exams:", data);
    
    return data || [];
  } catch (error) {
    console.error("Failed to load entrance exams:", error);
    toast.error("Failed to load entrance exams");
    return [];
  }
};

export const getFileDownloadUrl = async (examId: string, fileType: 'paper' | 'solution', board: string): Promise<string | null> => {
  try {
    let bucket = '';
    
    if (fileType === 'paper') {
      switch (board.toUpperCase()) {
        case 'WBJEE':
          bucket = 'wbjee_papers';
          break;
        case 'JEE MAINS':
          bucket = 'jee_mains_papers';
          break;
        case 'JEE ADVANCED':
          bucket = 'jee_advanced_papers';
          break;
        default:
          bucket = 'exam_papers';
      }
    } else { // solution
      switch (board.toUpperCase()) {
        case 'WBJEE':
          bucket = 'wbjee_solutions';
          break;
        case 'JEE MAINS':
          bucket = 'jee_mains_solutions';
          break;
        case 'JEE ADVANCED':
          bucket = 'jee_advanced_solutions';
          break;
        default:
          bucket = 'solutions';
      }
    }
    
    const { data, error } = await supabase.storage
      .from(bucket)
      .list(`${examId}`);
      
    if (error) {
      throw error;
    }
    
    if (!data || data.length === 0) {
      return null;
    }
    
    const filePath = `${examId}/${data[0].name}`;
    
    const { data: urlData } = supabase.storage
      .from(bucket)
      .getPublicUrl(filePath);
      
    return urlData.publicUrl;
  } catch (error) {
    console.error(`Error getting ${fileType} URL:`, error);
    return null;
  }
};
