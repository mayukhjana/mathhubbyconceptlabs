
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1';
import { corsHeaders } from '../_shared/cors.ts';

const supabaseUrl = Deno.env.get('SUPABASE_URL');
const supabaseAnonKey = Deno.env.get('SUPABASE_ANON_KEY');
const adminEmail = "mayukhjana27@gmail.com";

interface SupportTicket {
  subject: string;
  message: string;
}

Deno.serve(async (req) => {
  // Handle CORS
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    const supabase = createClient(supabaseUrl!, supabaseAnonKey!, {
      global: { headers: { Authorization: authHeader } }
    });

    // Get user info from JWT
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    const { subject, message }: SupportTicket = await req.json();
    
    if (!subject || !message) {
      return new Response(JSON.stringify({ error: 'Subject and message are required' }), {
        status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    // Insert ticket into database
    const { data, error } = await supabase
      .from('support_tickets')
      .insert({
        user_id: user.id,
        subject,
        message
      })
      .select();

    if (error) {
      console.error("Error submitting support ticket:", error);
      return new Response(JSON.stringify({ error: 'Failed to submit support ticket' }), {
        status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }
    
    // Send email notification
    try {
      const emailBody = `
        New Support Ticket Submitted
        
        User Email: ${user.email}
        Subject: ${subject}
        Message: ${message}
        
        Ticket ID: ${data[0].id}
        Submitted at: ${new Date().toISOString()}
      `;
      
      await fetch("https://api.sendgrid.com/v3/mail/send", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${Deno.env.get('SENDGRID_API_KEY')}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          personalizations: [
            {
              to: [{ email: adminEmail }]
            }
          ],
          from: { email: "no-reply@mathhub.example.com" },
          subject: "New Support Ticket Submission",
          content: [
            {
              type: "text/plain",
              value: emailBody
            }
          ]
        })
      });
    } catch (emailError) {
      console.error("Failed to send email notification:", emailError);
      // We still return success even if email fails
    }

    return new Response(JSON.stringify({ 
      success: true, 
      message: 'Support ticket submitted successfully',
      ticket: data[0]
    }), {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error('Error processing request:', error);
    return new Response(JSON.stringify({ error: 'Internal server error' }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
});
