
import { supabase } from "@/integrations/supabase/client";

export const submitExamResult = async (
  userId: string,
  examId: string, 
  score: number, 
  totalQuestions: number,
  timeTaken: number
) => {
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
};

export const fetchExamResults = async (userId: string) => {
  const { data, error } = await supabase
    .from('user_results')
    .select('*, exams(title, board, year, chapter)')
    .eq('user_id', userId)
    .order('completed_at', { ascending: false });
    
  if (error) {
    console.error("Error fetching exam results:", error);
    return [];
  }
  
  return data;
};

export const examHasMCQs = async (examId: string): Promise<boolean> => {
  const { count, error } = await supabase
    .from('questions')
    .select('*', { count: 'exact', head: true })
    .eq('exam_id', examId);
    
  if (error) {
    console.error("Error checking if exam has MCQs:", error);
    return false;
  }
  
  return count !== null && count > 0;
};
