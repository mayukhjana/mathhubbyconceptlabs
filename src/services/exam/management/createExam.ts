
import { supabase } from "@/integrations/supabase/client";
import type { Exam } from "../types";

export const createExam = async (examData: Omit<Exam, 'id' | 'created_at' | 'updated_at'>) => {
  try {
    console.log("Creating exam with data:", examData);
    
    // Prepare data for insertion, ensuring all required fields are present
    const insertData = {
      ...examData,
      // Set default values for any potentially missing fields
      allow_paper_download: examData.allow_paper_download ?? true,
      allow_solution_download: examData.allow_solution_download ?? true,
    };
    
    // Insert exam into database
    const { data, error } = await supabase
      .from('exams')
      .insert([insertData])
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
    
    // Insert questions into database
    const { data, error } = await supabase
      .from('questions')
      .insert(questions)
      .select();
      
    if (error) {
      console.error("Error creating questions:", error);
      throw new Error(`Failed to create questions: ${error.message}`);
    }
    
    console.log("Created questions:", data);
    return data;
  } catch (error) {
    console.error("Exception creating questions:", error);
    throw error;
  }
};
