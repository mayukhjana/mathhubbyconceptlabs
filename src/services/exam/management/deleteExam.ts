
import { supabase } from "@/integrations/supabase/client";

export const deleteExamById = async (examId: string) => {
  try {
    console.log(`Starting deletion process for exam ${examId}`);
    
    // Check if the exam exists first
    const { data: examExists, error: examCheckError } = await supabase
      .from('exams')
      .select('id, title')
      .eq('id', examId)
      .single();
      
    if (examCheckError) {
      if (examCheckError.code === 'PGRST116') {
        console.error(`Exam with ID ${examId} not found`);
        throw new Error(`Exam with ID ${examId} not found`);
      }
      throw examCheckError;
    }
    
    console.log(`Exam found, proceeding with deletion for "${examExists.title}" (${examId})`);
    
    // Delete operations with retry logic
    const MAX_RETRIES = 3;
    let retries = 0;
    let deletionSuccess = false;
    let lastError = null;
    
    while (retries < MAX_RETRIES && !deletionSuccess) {
      try {
        // Delete user results first
        const { error: userResultsError } = await supabase
          .from('user_results')
          .delete()
          .eq('exam_id', examId);
          
        if (userResultsError) {
          console.error(`Error deleting user results for exam ${examId}:`, userResultsError);
          lastError = new Error(`Failed to delete user results: ${userResultsError.message}`);
          throw lastError;
        }
        
        console.log(`Successfully deleted user results for exam ${examId}`);
          
        // Delete questions next
        const { error: questionsError } = await supabase
          .from('questions')
          .delete()
          .eq('exam_id', examId);
        
        if (questionsError) {
          console.error(`Error deleting questions for exam ${examId}:`, questionsError);
          lastError = new Error(`Failed to delete questions: ${questionsError.message}`);
          throw lastError;
        }
        
        console.log(`Successfully deleted questions for exam ${examId}`);
        
        // Finally delete the exam
        const { error: examError } = await supabase
          .from('exams')
          .delete()
          .eq('id', examId);
        
        if (examError) {
          console.error(`Error deleting exam ${examId}:`, examError);
          lastError = new Error(`Failed to delete exam: ${examError.message}`);
          throw lastError;
        }
        
        console.log(`Successfully deleted exam ${examId}`);
        deletionSuccess = true;
      } catch (innerError) {
        console.error(`Error during deletion attempt ${retries + 1}:`, innerError);
        lastError = innerError;
        retries++;
        // Adding a small delay before retry
        await new Promise(resolve => setTimeout(resolve, 500));
      }
    }
    
    if (!deletionSuccess) {
      throw new Error("Exam deletion failed after multiple attempts - exam may still exist in database");
    }
    
    return { success: true };
  } catch (error) {
    console.error("Error in deleteExamById:", error);
    throw error;
  }
};
