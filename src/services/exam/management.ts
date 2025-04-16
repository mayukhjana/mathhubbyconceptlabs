
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
    // Format the correct_answer based on whether it's a multi-correct answer
    let formattedAnswer: string;
    
    if (q.is_multi_correct) {
      // If it's a multi-correct question, handle both array and string inputs
      if (Array.isArray(q.correct_answer)) {
        formattedAnswer = [...q.correct_answer].sort().join(',');
      } else if (typeof q.correct_answer === 'string') {
        const answerParts = q.correct_answer.split(',').map(p => p.trim());
        formattedAnswer = [...answerParts].sort().join(',');
      } else {
        formattedAnswer = 'a'; // Default to 'a' if input is invalid
      }
    } else {
      // For single answers, ensure we get a single value
      formattedAnswer = Array.isArray(q.correct_answer) 
        ? q.correct_answer[0] 
        : String(q.correct_answer);
    }
    
    // Make sure formattedAnswer only contains valid option values (a,b,c,d)
    const validOptions = ['a', 'b', 'c', 'd'];
    const answerParts = formattedAnswer.split(',');
    const validAnswerParts = answerParts.filter(part => 
      validOptions.includes(part.trim())
    );
    
    // If no valid options remain, default to 'a'
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
    
    // First delete all questions associated with this exam
    const { error: questionsError } = await supabase
      .from('questions')
      .delete()
      .eq('exam_id', examId);
    
    if (questionsError) {
      console.error("Error deleting questions:", questionsError);
      throw questionsError;
    }
    
    console.log(`Successfully deleted questions for exam ${examId}`);
    
    // Then delete the exam itself
    const { error: examError } = await supabase
      .from('exams')
      .delete()
      .eq('id', examId);
    
    if (examError) {
      console.error("Error deleting exam:", examError);
      throw examError;
    }
    
    console.log(`Successfully deleted exam ${examId}`);
    
    return { success: true, message: `Exam deleted successfully` };
  } catch (error) {
    console.error("Error in deleteExamById:", error);
    throw error;
  }
};

export const deleteWBJEEExams = async () => {
  try {
    console.log("Starting deletion of all WBJEE exams");
    
    // Fetch all WBJEE exam IDs
    const { data: wbjeeExams, error: fetchError } = await supabase
      .from('exams')
      .select('id')
      .eq('board', 'WBJEE');
    
    if (fetchError) {
      console.error("Error fetching WBJEE exams:", fetchError);
      throw fetchError;
    }
    
    if (wbjeeExams && wbjeeExams.length > 0) {
      console.log(`Found ${wbjeeExams.length} WBJEE exams to delete`);
      const examIds = wbjeeExams.map(exam => exam.id);
      
      // Delete all questions for these exams
      const { error: questionsError } = await supabase
        .from('questions')
        .delete()
        .in('exam_id', examIds);
      
      if (questionsError) {
        console.error("Error deleting WBJEE exam questions:", questionsError);
        throw questionsError;
      }
      
      console.log("Successfully deleted WBJEE exam questions");
      
      // Then delete all the exams
      const { error } = await supabase
        .from('exams')
        .delete()
        .eq('board', 'WBJEE');
      
      if (error) {
        console.error("Error deleting WBJEE exams:", error);
        throw error;
      }
      
      console.log(`Successfully deleted ${wbjeeExams.length} WBJEE exams`);
      
      return { success: true, message: `Deleted ${wbjeeExams.length} WBJEE exams` };
    }
    
    console.log("No WBJEE exams found to delete");
    return { success: true, message: "No WBJEE exams to delete" };
  } catch (error) {
    console.error("Error in deleteWBJEEExams:", error);
    throw error;
  }
};
