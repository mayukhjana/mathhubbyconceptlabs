
import { supabase } from "@/integrations/supabase/client";

export const deleteWBJEEExams = async () => {
  try {
    console.log("Starting deletion of all WBJEE exams");
    
    // First, find all WBJEE exams
    const { data: wbjeeExams, error: fetchError } = await supabase
      .from('exams')
      .select('id, title')
      .eq('board', 'WBJEE');
    
    if (fetchError) {
      console.error("Error fetching WBJEE exams:", fetchError);
      throw new Error(`Failed to fetch WBJEE exams: ${fetchError.message}`);
    }
    
    if (!wbjeeExams || wbjeeExams.length === 0) {
      console.log("No WBJEE exams found to delete");
      return { success: true };
    }
    
    console.log(`Found ${wbjeeExams.length} WBJEE exams to delete:`, wbjeeExams.map(e => e.id));
    
    // Delete all user results for WBJEE exams in one batch
    const examIds = wbjeeExams.map(exam => exam.id);
    
    console.log("Deleting all user results for WBJEE exams");
    const { error: userResultsError } = await supabase
      .from('user_results')
      .delete()
      .in('exam_id', examIds);
      
    if (userResultsError) {
      console.error("Error deleting user results for WBJEE exams:", userResultsError);
      throw new Error(`Failed to delete user results: ${userResultsError.message}`);
    }
    
    console.log("Deleting all questions for WBJEE exams");
    const { error: questionsError } = await supabase
      .from('questions')
      .delete()
      .in('exam_id', examIds);
    
    if (questionsError) {
      console.error("Error deleting questions for WBJEE exams:", questionsError);
      throw new Error(`Failed to delete questions: ${questionsError.message}`);
    }
    
    console.log("Deleting all WBJEE exams");
    const { error: examsError } = await supabase
      .from('exams')
      .delete()
      .eq('board', 'WBJEE');
    
    if (examsError) {
      console.error("Error deleting WBJEE exams:", examsError);
      throw new Error(`Failed to delete exams: ${examsError.message}`);
    }
    
    // Verify deletion was successful
    const { data: checkDeletion, error: checkError } = await supabase
      .from('exams')
      .select('id')
      .eq('board', 'WBJEE');
      
    if (checkError) {
      console.error(`Error checking if exams were deleted: ${checkError.message}`);
    }
    
    if (checkDeletion && checkDeletion.length > 0) {
      console.error(`${checkDeletion.length} WBJEE exams still exist after deletion attempt!`);
      throw new Error("WBJEE exams deletion failed - exams still exist in database");
    }
    
    console.log("Successfully deleted all WBJEE exams and verified deletion");
    
    return { success: true };
  } catch (error) {
    console.error("Error in deleteWBJEEExams:", error);
    throw error;
  }
};
