import { supabase } from "@/integrations/supabase/client";

export const deleteEntranceExams = async (board: string) => {
  try {
    console.log(`Starting deletion of all ${board} exams`);
    
    // First, find all exams for the specified board
    const { data: exams, error: fetchError } = await supabase
      .from('exams')
      .select('id, title')
      .eq('board', board);
    
    if (fetchError) {
      console.error(`Error fetching ${board} exams:`, fetchError);
      throw new Error(`Failed to fetch ${board} exams: ${fetchError.message}`);
    }
    
    if (!exams || exams.length === 0) {
      console.log(`No ${board} exams found to delete`);
      return { success: true };
    }
    
    console.log(`Found ${exams.length} ${board} exams to delete:`, exams.map(e => e.id));
    
    // Delete all related data for these exams
    const examIds = exams.map(exam => exam.id);
    
    console.log(`Deleting all user results for ${board} exams`);
    const { error: userResultsError } = await supabase
      .from('user_results')
      .delete()
      .in('exam_id', examIds);
      
    if (userResultsError) {
      console.error(`Error deleting user results for ${board} exams:`, userResultsError);
      throw new Error(`Failed to delete user results: ${userResultsError.message}`);
    }
    
    console.log(`Deleting all questions for ${board} exams`);
    const { error: questionsError } = await supabase
      .from('questions')
      .delete()
      .in('exam_id', examIds);
    
    if (questionsError) {
      console.error(`Error deleting questions for ${board} exams:`, questionsError);
      throw new Error(`Failed to delete questions: ${questionsError.message}`);
    }
    
    // Delete the exams
    const { error: examsError } = await supabase
      .from('exams')
      .delete()
      .eq('board', board);
    
    if (examsError) {
      console.error(`Error deleting ${board} exams:`, examsError);
      throw new Error(`Failed to delete exams: ${examsError.message}`);
    }
    
    // Additional verification step
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const { data: checkDeletion, error: checkError } = await supabase
      .from('exams')
      .select('id')
      .eq('board', board);
      
    if (checkError) {
      console.error(`Error checking if ${board} exams were deleted: ${checkError.message}`);
    }
    
    if (checkDeletion && checkDeletion.length > 0) {
      console.error(`${checkDeletion.length} ${board} exams still exist after deletion attempt!`);
      throw new Error(`${board} exams deletion failed - exams still exist in database`);
    }
    
    console.log(`Successfully deleted all ${board} exams and verified deletion`);
    
    return { success: true };
  } catch (error) {
    console.error(`Error in deleteEntranceExams for ${board}:`, error);
    throw error;
  }
};

// Keep backward compatibility for WBJEE deletion
export const deleteWBJEEExams = () => deleteEntranceExams('WBJEE');
