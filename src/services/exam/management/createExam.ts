
import { supabase } from "@/integrations/supabase/client";
import type { Exam, Question } from "../types";

export const createExam = async (examData: Omit<Exam, 'id' | 'created_at' | 'updated_at'>) => {
  try {
    console.log("Creating exam with data:", examData);
    
    const { data, error } = await supabase
      .from('exams')
      .insert([examData])
      .select()
      .single();
      
    if (error) {
      console.error("Error creating exam:", error);
      throw new Error(`Failed to create exam: ${error.message}`);
    }
    
    console.log("Created exam:", data);
    return data as Exam;
  } catch (error) {
    console.error("Exception creating exam:", error);
    throw error;
  }
};

export const createQuestions = async (questions: Omit<Question, 'id'>[]) => {
  try {
    console.log("Creating questions:", questions);
    
    // Handle the string[] type for correct_answer by converting arrays to strings if needed
    const processedQuestions = questions.map(q => ({
      ...q,
      is_multi_correct: q.is_multi_correct,
      // Convert array answers to string format for database storage if needed
      correct_answer: Array.isArray(q.correct_answer) ? q.correct_answer.join(',') : q.correct_answer
    }));
    
    const { data, error } = await supabase
      .from('questions')
      .insert(processedQuestions)
      .select();
      
    if (error) {
      console.error("Error creating questions:", error);
      throw new Error(`Failed to create questions: ${error.message}`);
    }
    
    console.log("Created questions:", data);
    return data as Question[];
  } catch (error) {
    console.error("Exception creating questions:", error);
    throw error;
  }
};
