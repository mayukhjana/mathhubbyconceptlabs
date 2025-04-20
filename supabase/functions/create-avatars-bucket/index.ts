
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
    // Get authorization header
    const authorization = req.headers.get('Authorization');
    if (!authorization) {
      return new Response(JSON.stringify({ error: 'Missing authorization header' }), { 
        status: 401, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    // Get the request body
    const { bucketName = 'avatars' } = await req.json();
    
    // Validate bucketName
    const allowedBuckets = ['avatars', 'questions'];
    if (!allowedBuckets.includes(bucketName)) {
      return new Response(JSON.stringify({ error: 'Invalid bucket name. Only avatars and questions buckets can be created' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    // Create a Supabase client with service role key
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
      {
        global: {
          headers: { Authorization: authorization }
        }
      }
    );

    // Check if the user is authenticated
    const { data: { user }, error: userError } = await supabaseClient.auth.getUser();
    if (userError || !user) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), { 
        status: 401, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    // Check if bucket exists
    let { data: buckets, error: listError } = await supabaseClient.storage.listBuckets();
    if (listError) {
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
      if (bucketName === 'avatars') {
        allowedMimeTypes = ['image/png', 'image/jpeg', 'image/jpg', 'image/gif', 'image/webp'];
      } else if (bucketName === 'questions') {
        allowedMimeTypes = ['image/png', 'image/jpeg', 'image/jpg', 'image/gif', 'image/webp', 'image/svg+xml'];
      } else {
        allowedMimeTypes = ['image/png', 'image/jpeg', 'image/jpg'];
      }

      const { error: createError } = await supabaseClient.storage.createBucket(bucketName, {
        public: true,
        fileSizeLimit: 10 * 1024 * 1024, // 10MB
        allowedMimeTypes: allowedMimeTypes
      });

      if (createError) {
        return new Response(JSON.stringify({ error: `Error creating ${bucketName} bucket: ${createError.message}` }), { 
          status: 500, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
      }

      console.log(`Successfully created ${bucketName} bucket`);
    } else {
      console.log(`${bucketName} bucket already exists`);
    }

    // Set public access to the bucket if needed
    if (existingBucket && !existingBucket.public) {
      // Note: This would require SQL access which is not available directly in edge functions
      // For now, we'll just return success and recommend manual configuration
      console.log(`${bucketName} bucket exists but might not be public`);
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
