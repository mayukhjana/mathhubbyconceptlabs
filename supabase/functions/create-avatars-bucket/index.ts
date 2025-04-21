
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
    // Create a Supabase client with service role key
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
      {
        global: {
          headers: { Authorization: req.headers.get('Authorization') || '' }
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
    const { data: buckets, error: listError } = await supabaseClient.storage.listBuckets();
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
        allowedMimeTypes = ['application/pdf'];
      } else {
        allowedMimeTypes = ['image/png', 'image/jpeg', 'image/jpg', 'application/pdf'];
      }

      const { error: createError } = await supabaseClient.storage.createBucket(bucketName, {
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

      // Update the bucket policy to make files publicly accessible
      // This is done automatically with 'public: true' in createBucket
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
  } catch (error) {
    console.error(`Unexpected error:`, error);
    return new Response(
      JSON.stringify({ error: `Unexpected error: ${error.message}` }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' }}
    );
  }
});
