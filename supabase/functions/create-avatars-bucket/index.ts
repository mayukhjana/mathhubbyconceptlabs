
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL');
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
    
    if (!supabaseUrl || !supabaseServiceKey) {
      console.error('Missing environment variables: SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY');
      return new Response(
        JSON.stringify({ 
          error: 'Server configuration error: Missing environment variables' 
        }),
        { 
          status: 500, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }

    // Create a Supabase client with the service role key
    // This is crucial for bypassing RLS policies
    const supabaseAdmin = createClient(
      supabaseUrl,
      supabaseServiceKey,
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false
        }
      }
    );

    // Get the request body
    const { bucketName = 'avatars' } = await req.json();
    
    // Validate bucketName
    if (!bucketName || typeof bucketName !== 'string') {
      return new Response(JSON.stringify({ error: 'Invalid bucket name' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    console.log(`Attempting to create/verify bucket: ${bucketName}`);

    // Check if bucket exists
    const { data: buckets, error: listError } = await supabaseAdmin.storage.listBuckets();
    if (listError) {
      console.error(`Error listing buckets: ${listError.message}`);
      return new Response(JSON.stringify({ error: `Error listing buckets: ${listError.message}` }), { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    // Create the bucket if it doesn't exist
    const existingBucket = buckets?.find(b => b.name === bucketName);
    if (!existingBucket) {
      // Set appropriate MIME types based on bucket
      let allowedMimeTypes: string[];
      
      if (bucketName.includes('avatar')) {
        allowedMimeTypes = ['image/png', 'image/jpeg', 'image/jpg', 'image/gif', 'image/webp'];
      } else if (bucketName.includes('question')) {
        allowedMimeTypes = ['image/png', 'image/jpeg', 'image/jpg', 'image/gif', 'image/webp', 'image/svg+xml'];
      } else if (bucketName.includes('paper') || bucketName.includes('solution')) {
        // Make sure to allow application/pdf MIME type for paper and solution buckets
        allowedMimeTypes = ['application/pdf'];
      } else {
        // Default allowed types
        allowedMimeTypes = ['image/png', 'image/jpeg', 'image/jpg', 'application/pdf'];
      }

      try {
        // Using service role key to bypass RLS policies
        const { data, error: createError } = await supabaseAdmin.storage.createBucket(bucketName, {
          public: true,
          fileSizeLimit: 10 * 1024 * 1024, // 10MB
          allowedMimeTypes: allowedMimeTypes
        });

        if (createError) {
          console.error(`Error creating bucket: ${createError.message}`);
          return new Response(JSON.stringify({ error: `Error creating ${bucketName} bucket: ${createError.message}` }), { 
            status: 500, 
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
          });
        }

        console.log(`Successfully created ${bucketName} bucket`);
      } catch (createErr: any) {
        console.error(`Exception creating bucket: ${createErr.message}`);
        return new Response(JSON.stringify({ error: `Exception creating ${bucketName} bucket: ${createErr.message}` }), { 
          status: 500, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
      }
    } else {
      console.log(`${bucketName} bucket already exists`);
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: `${bucketName} bucket created/verified successfully`,
        bucketExists: !!existingBucket
      }),
      { 
        status: 200, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  } catch (error: any) {
    console.error(`Unexpected error:`, error);
    return new Response(
      JSON.stringify({ error: `Unexpected error: ${error.message}` }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' }}
    );
  }
});
