
import { supabase } from "@/integrations/supabase/client";
import type { Exam, Question } from "../types";

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
      question_text: q.is_image_question && !q.question_text ? "See image below" : q.question_text,
      option_a: q.option_a,
      option_b: q.option_b,
      option_c: q.option_c,
      option_d: q.option_d,
      correct_answer: formattedAnswer,
      order_number: q.order_number,
      marks: q.marks,
      negative_marks: q.negative_marks,
      is_multi_correct: q.is_multi_correct || false,
      is_image_question: q.is_image_question || false,
      image_url: q.image_url || null
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
