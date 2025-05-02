
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const GEMINI_API_KEY = Deno.env.get('GEMINI_API_KEY');

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { results } = await req.json();
    
    // Format the results data for the prompt
    const formattedData = results.map((result: any) => {
      return `
        Exam: ${result.exams?.title || 'Unknown'}
        Board: ${result.exams?.board || 'Unknown'}
        Score: ${result.score}%
        Date: ${new Date(result.completed_at).toLocaleDateString()}
        Questions: ${result.total_questions}
        Time Taken: ${Math.floor(result.time_taken / 60)} minutes ${result.time_taken % 60} seconds
      `;
    }).join('\n');

    // Create a prompt for Gemini to analyze the results
    const prompt = `
      You are an expert education analyst. Analyze these exam results and provide personalized insights and advice.
      Focus on strengths, weaknesses, trends over time, and specific actionable recommendations for improvement.
      Also suggest what topics the student should focus on next based on their performance patterns.
      
      Results Data:
      ${formattedData}
      
      Please provide:
      1. A brief overview of the student's performance
      2. Key strengths identified
      3. Areas that need improvement
      4. Performance trends over time (if multiple exams)
      5. Three specific, actionable recommendations
      6. Suggested next topics to study
      
      Format the response to be encouraging, specific, and clear.
    `;

    console.log("Sending prompt to Gemini API:", prompt.substring(0, 100) + "...");

    // Call Gemini API for analysis
    const response = await fetch('https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-pro:generateContent', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-goog-api-key': GEMINI_API_KEY || '',
      },
      body: JSON.stringify({
        contents: [{
          parts: [{ text: prompt }]
        }]
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Gemini API error:", errorText);
      throw new Error(`Gemini API error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    console.log("Received response from Gemini API");
    
    let analysisText = '';
    if (data.candidates && data.candidates.length > 0 && data.candidates[0].content) {
      analysisText = data.candidates[0].content.parts[0].text;
    } else {
      throw new Error('Invalid response format from Gemini API');
    }

    // Return the analysis
    return new Response(
      JSON.stringify({
        analysis: analysisText,
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  } catch (error) {
    console.error("Error generating insights:", error);
    return new Response(
      JSON.stringify({
        error: error.message || 'Failed to generate insights',
      }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});
