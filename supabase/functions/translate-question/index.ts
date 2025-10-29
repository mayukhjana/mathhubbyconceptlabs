import { corsHeaders } from '../_shared/cors.ts';

const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const { text, targetLanguage, targetLanguageName } = await req.json();

    // Input validation
    if (!text || !targetLanguage) {
      return new Response(
        JSON.stringify({ error: 'Missing required parameters' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Validate text length (max 5000 characters)
    if (typeof text !== 'string' || text.length > 5000) {
      return new Response(
        JSON.stringify({ error: 'Text must be a string with maximum 5000 characters' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Validate language code format
    if (typeof targetLanguage !== 'string' || !/^[a-z]{2}$/.test(targetLanguage)) {
      return new Response(
        JSON.stringify({ error: 'Invalid language code format' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Validate language name if provided
    if (targetLanguageName && (typeof targetLanguageName !== 'string' || targetLanguageName.length > 100)) {
      return new Response(
        JSON.stringify({ error: 'Language name must be a string with maximum 100 characters' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // If target language is English, return original text
    if (targetLanguage === 'en') {
      return new Response(
        JSON.stringify({ translatedText: text }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const systemPrompt = `You are a professional translator specializing in educational content, particularly mathematics and science questions. 
Translate the following text to ${targetLanguageName || targetLanguage} while preserving:
1. All mathematical formulas and symbols exactly as they are (e.g., x², ∫, ∑, √)
2. All numbers and numerical values
3. Technical terms and their meaning
4. The exact structure and formatting

Only translate the descriptive text, never modify mathematical expressions, formulas, or symbols.
Return ONLY the translated text without any explanations or additional comments.`;

    const response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${LOVABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: text }
        ],
      }),
    });

    if (!response.ok) {
      console.error('Translation API error:', response.status, await response.text());
      return new Response(
        JSON.stringify({ error: 'Translation service error' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const data = await response.json();
    const translatedText = data.choices[0].message.content;

    return new Response(
      JSON.stringify({ translatedText }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error in translate-question:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
