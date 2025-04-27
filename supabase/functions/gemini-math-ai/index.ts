
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import "https://deno.land/x/xhr@0.1.0/mod.ts";

const GEMINI_API_KEY = Deno.env.get("GEMINI_API_KEY");

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  console.log("Function invoked: gemini-math-ai");
  
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    console.log("Handling OPTIONS preflight request");
    return new Response(null, { 
      status: 200,
      headers: corsHeaders 
    });
  }

  try {
    // Validate API key
    if (!GEMINI_API_KEY) {
      console.error("GEMINI_API_KEY not configured");
      return new Response(
        JSON.stringify({ 
          error: "Server configuration error", 
          details: "GEMINI_API_KEY is not configured" 
        }),
        { 
          status: 500, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    // Parse request body
    let requestData;
    try {
      requestData = await req.json();
    } catch (parseError) {
      console.error("Error parsing request JSON:", parseError);
      return new Response(
        JSON.stringify({ 
          error: "Invalid request format", 
          details: "Could not parse request body as JSON" 
        }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    const { question, image } = requestData;
    
    // Validate input
    if (!question && !image) {
      console.error("Missing input: no question or image provided");
      return new Response(
        JSON.stringify({ 
          error: "Missing input", 
          details: "Please provide a question or an image" 
        }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    console.log("Processing request with:", 
      question ? `question: ${question.substring(0, 50)}...` : "no question", 
      image ? "image provided" : "no image"
    );
    
    // Build request for Gemini
    const requestBody = {
      contents: [
        {
          parts: []
        }
      ],
      generationConfig: {
        temperature: 0.4,
        topK: 32,
        topP: 1,
        maxOutputTokens: 2048,
      },
      safetySettings: [
        {
          category: "HARM_CATEGORY_HARASSMENT",
          threshold: "BLOCK_MEDIUM_AND_ABOVE"
        },
        {
          category: "HARM_CATEGORY_HATE_SPEECH",
          threshold: "BLOCK_MEDIUM_AND_ABOVE"
        },
        {
          category: "HARM_CATEGORY_SEXUALLY_EXPLICIT",
          threshold: "BLOCK_MEDIUM_AND_ABOVE"
        },
        {
          category: "HARM_CATEGORY_DANGEROUS_CONTENT",
          threshold: "BLOCK_MEDIUM_AND_ABOVE"
        }
      ]
    };
    
    // Setup system prompt
    const systemPrompt = `You are MathHub AI, a specialized math tutor developed by MathHub. 
    You are an expert in all areas of mathematics including algebra, calculus, geometry, statistics, 
    and more. Your goal is to help students understand mathematical concepts and solve problems. 
    Provide clear step-by-step explanations. Format your answers using markdown, including LaTeX 
    for mathematical expressions where appropriate. Be thorough but concise.`;
    
    // Add system prompt
    requestBody.contents[0].parts.push({
      text: systemPrompt
    });
    
    // Add user's question
    if (question) {
      requestBody.contents[0].parts.push({
        text: question
      });
    }
    
    // Add image if provided
    if (image) {
      try {
        requestBody.contents[0].parts.push({
          inlineData: {
            mimeType: "image/jpeg",
            data: image
          }
        });
      } catch (imageError) {
        console.error("Error processing image:", imageError);
        // Continue without image if there's an error processing it
      }
    }

    // Call Gemini API
    const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-pro:generateContent?key=${GEMINI_API_KEY}`;
    
    console.log("Calling Gemini API...");
    
    let response;
    try {
      response = await fetch(apiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(requestBody)
      });
    } catch (fetchError) {
      console.error("Network error calling Gemini API:", fetchError);
      return new Response(
        JSON.stringify({ 
          error: "Network error", 
          details: "Failed to connect to Gemini API"
        }),
        { 
          status: 500, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }
    
    // Check response status
    if (!response.ok) {
      const errorBody = await response.text();
      console.error(`Gemini API error: ${response.status} ${response.statusText}`, errorBody);
      
      let errorDetails;
      try {
        errorDetails = JSON.parse(errorBody);
      } catch (e) {
        errorDetails = errorBody.substring(0, 200) + (errorBody.length > 200 ? '...' : '');
      }
      
      return new Response(
        JSON.stringify({ 
          error: "Gemini API error", 
          details: `Status ${response.status}: ${JSON.stringify(errorDetails)}`
        }),
        { 
          status: 502, // Gateway error 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }
    
    // Parse API response
    let data;
    try {
      data = await response.json();
    } catch (parseError) {
      console.error("Error parsing Gemini API response:", parseError);
      return new Response(
        JSON.stringify({ 
          error: "Invalid response format", 
          details: "Could not parse Gemini API response as JSON"
        }),
        { 
          status: 500, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }
    
    // Validate response content
    if (!data.candidates || data.candidates.length === 0 || !data.candidates[0].content) {
      console.error("Invalid response structure from Gemini:", JSON.stringify(data));
      return new Response(
        JSON.stringify({ 
          error: "Invalid response from Gemini AI",
          details: "Expected response structure not found" 
        }),
        { 
          status: 500, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }
    
    // Extract answer
    const answer = data.candidates[0].content.parts[0].text;
    if (!answer) {
      console.error("Empty answer from Gemini API");
      return new Response(
        JSON.stringify({ 
          error: "Empty response", 
          details: "Gemini AI returned an empty answer"
        }),
        { 
          status: 500, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }
    
    console.log("Successfully generated response from Gemini");
    
    // Return successful response
    return new Response(
      JSON.stringify({ answer }),
      { 
        status: 200, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
    
  } catch (error) {
    // Catch-all error handler
    console.error("Unhandled error in gemini-math-ai function:", error);
    return new Response(
      JSON.stringify({ 
        error: "Internal server error", 
        details: error.message || "An unexpected error occurred"
      }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});
