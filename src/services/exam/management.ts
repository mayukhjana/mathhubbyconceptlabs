import { supabase } from "@/integrations/supabase/client";
import type { Exam, Question } from "./types";

export const createExam = async (examData: Omit<Exam, 'id' | 'created_at'>) => {
  const examToInsert: any = {
    title: examData.title,
    board: examData.board,
    chapter: examData.chapter,
    year: examData.year,
    class: examData.class,
    duration: examData.duration,
    is_premium: examData.is_premium
  };

  const { data, error } = await supabase
    .from('exams')
    .insert(examToInsert)
    .select()
    .single();
    
  if (error) {
    console.error("Error creating exam:", error);
    throw error;
  }
  
  return data as Exam;
};

export const createQuestions = async (questions: Omit<Question, 'id'>[]) => {
  const questionsToInsert = questions.map(q => {
    let formattedAnswer: string;
    
    if (q.is_multi_correct) {
      if (Array.isArray(q.correct_answer)) {
        formattedAnswer = [...q.correct_answer].sort().join(',');
      } else if (typeof q.correct_answer === 'string') {
        const answerParts = q.correct_answer.split(',').map(p => p.trim());
        formattedAnswer = [...answerParts].sort().join(',');
      } else {
        formattedAnswer = 'a';
      }
    } else {
      formattedAnswer = Array.isArray(q.correct_answer) 
        ? q.correct_answer[0] 
        : String(q.correct_answer);
    }
    
    const validOptions = ['a', 'b', 'c', 'd'];
    const answerParts = formattedAnswer.split(',');
    const validAnswerParts = answerParts.filter(part => 
      validOptions.includes(part.trim())
    );
    
    formattedAnswer = validAnswerParts.length === 0 
      ? 'a' 
      : validAnswerParts.join(',');

    return {
      exam_id: q.exam_id,
      question_text: q.question_text,
      option_a: q.option_a,
      option_b: q.option_b,
      option_c: q.option_c,
      option_d: q.option_d,
      correct_answer: formattedAnswer,
      order_number: q.order_number,
      marks: q.marks,
      negative_marks: q.negative_marks,
      is_multi_correct: q.is_multi_correct || false
    };
  });

  console.log("Inserting questions:", JSON.stringify(questionsToInsert, null, 2));

  const { data, error } = await supabase
    .from('questions')
    .insert(questionsToInsert)
    .select();
    
  if (error) {
    console.error("Error creating questions:", error);
    throw error;
  }
  
  return data as Question[];
};

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
    
    // First, delete all user results associated with this exam
    const { error: userResultsError } = await supabase
      .from('user_results')
      .delete()
      .eq('exam_id', examId);
      
    if (userResultsError) {
      console.error(`Error deleting user results for exam ${examId}:`, userResultsError);
      throw new Error(`Failed to delete user results: ${userResultsError.message}`);
    }
    
    console.log(`Successfully deleted user results for exam ${examId}`);
      
    // Next, delete all questions associated with this exam
    const { error: questionsError } = await supabase
      .from('questions')
      .delete()
      .eq('exam_id', examId);
    
    if (questionsError) {
      console.error(`Error deleting questions for exam ${examId}:`, questionsError);
      throw new Error(`Failed to delete questions: ${questionsError.message}`);
    }
    
    console.log(`Successfully deleted questions for exam ${examId}`);
    
    // Finally, delete the exam itself
    const { error: examError } = await supabase
      .from('exams')
      .delete()
      .eq('id', examId);
    
    if (examError) {
      console.error(`Error deleting exam ${examId}:`, examError);
      throw new Error(`Failed to delete exam: ${examError.message}`);
    }
    
    console.log(`Successfully deleted exam ${examId}`);
    
    // Verify that the exam is actually deleted
    const { data: checkDeletion, error: checkError } = await supabase
      .from('exams')
      .select('id')
      .eq('id', examId);
      
    if (checkError) {
      console.error(`Error checking if exam was deleted: ${checkError.message}`);
    }
    
    if (checkDeletion && checkDeletion.length > 0) {
      console.error(`Exam ${examId} still exists after deletion attempt!`);
      throw new Error("Exam deletion failed - exam still exists in database");
    }
    
    console.log(`Verified exam ${examId} was successfully deleted`);
    
    return { success: true };
  } catch (error) {
    console.error("Error in deleteExamById:", error);
    throw error;
  }
};

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
    // Delete all questions for WBJEE exams in one batch
    const { error: questionsError } = await supabase
      .from('questions')
      .delete()
      .in('exam_id', examIds);
    
    if (questionsError) {
      console.error("Error deleting questions for WBJEE exams:", questionsError);
      throw new Error(`Failed to delete questions: ${questionsError.message}`);
    }
    
    console.log("Deleting all WBJEE exams");
    // Delete all WBJEE exams in one batch
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
