
import { supabase } from "@/integrations/supabase/client";

export const submitExamResult = async (
  userId: string,
  examId: string, 
  score: number, 
  totalQuestions: number,
  timeTaken: number
) => {
  try {
    const { data, error } = await supabase
      .from('user_results')
      .insert({
        user_id: userId,
        exam_id: examId,
        score,
        total_questions: totalQuestions,
        time_taken: timeTaken,
      })
      .select()
      .single();
      
    if (error) {
      console.error("Error submitting exam result:", error);
      return null;
    }
    
    return data;
  } catch (err) {
    console.error("Exception when submitting exam result:", err);
    return null;
  }
};

export const fetchExamResults = async (userId: string) => {
  try {
    const { data, error } = await supabase
      .from('user_results')
      .select('*, exams(title, board, year, chapter, class)')
      .eq('user_id', userId)
      .order('completed_at', { ascending: false });
      
    if (error) {
      console.error("Error fetching exam results:", error);
      return [];
    }
    
    return data || [];
  } catch (err) {
    console.error("Exception when fetching exam results:", err);
    return [];
  }
};

export const examHasMCQs = async (examId: string): Promise<boolean> => {
  try {
    const { count, error } = await supabase
      .from('questions')
      .select('*', { count: 'exact', head: true })
      .eq('exam_id', examId);
      
    if (error) {
      console.error("Error checking if exam has MCQs:", error);
      return false;
    }
    
    return count !== null && count > 0;
  } catch (err) {
    console.error("Exception when checking if exam has MCQs:", err);
    return false;
  }
};

// New function to fetch chapter-wise performance
export const fetchChapterPerformance = async (userId: string) => {
  try {
    const { data, error } = await supabase
      .from('user_results')
      .select(`
        id, 
        score, 
        total_questions,
        exams!inner(
          title, 
          board, 
          chapter
        )
      `)
      .eq('user_id', userId)
      .not('exams.chapter', 'is', null)
      .order('completed_at', { ascending: false });
    
    if (error) {
      console.error("Error fetching chapter performance:", error);
      return [];
    }
    
    return data || [];
  } catch (err) {
    console.error("Exception when fetching chapter performance:", err);
    return [];
  }
};
