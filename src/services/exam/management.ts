
import { supabase } from "@/integrations/supabase/client";
import type { Exam, Question } from "./types";

export const createExam = async (examData: Omit<Exam, 'id' | 'created_at'>) => {
  const { data, error } = await supabase
    .from('exams')
    .insert(examData)
    .select()
    .single();
    
  if (error) {
    console.error("Error creating exam:", error);
    throw error;
  }
  
  return data as Exam;
};

export const createQuestions = async (questions: Omit<Question, 'id'>[]) => {
  const { data, error } = await supabase
    .from('questions')
    .insert(questions)
    .select();
    
  if (error) {
    console.error("Error creating questions:", error);
    throw error;
  }
  
  return data as Question[];
};

export const deleteWBJEEExams = async () => {
  try {
    const { data: wbjeeExams } = await supabase
      .from('exams')
      .select('id')
      .eq('board', 'WBJEE');
    
    if (wbjeeExams && wbjeeExams.length > 0) {
      const examIds = wbjeeExams.map(exam => exam.id);
      
      await supabase
        .from('questions')
        .delete()
        .in('exam_id', examIds);
      
      const { error } = await supabase
        .from('exams')
        .delete()
        .eq('board', 'WBJEE');
      
      if (error) throw error;
      
      return { success: true, message: `Deleted ${wbjeeExams.length} WBJEE exams` };
    }
    
    return { success: true, message: "No WBJEE exams to delete" };
  } catch (error) {
    console.error("Error deleting WBJEE exams:", error);
    throw error;
  }
};
