
import { supabase } from "@/integrations/supabase/client";

/**
 * Ensures all required storage buckets exist in the Supabase project
 */
export const ensureStorageBuckets = async () => {
  try {
    const { data: buckets, error } = await supabase.storage.listBuckets();
    
    if (error) {
      console.error("Error listing buckets:", error);
      return false;
    }
    
    const requiredBuckets = [
      'exam_papers', 
      'solutions', 
      'wbjee_papers', 
      'wbjee_solutions', 
      'jee_mains_papers', 
      'jee_mains_solutions', 
      'jee_advanced_papers', 
      'jee_advanced_solutions',
      'avatars',
      'questions'
    ];
    
    const existingBuckets = new Set(buckets?.map(b => b.name) || []);
    const missingBuckets = requiredBuckets.filter(bucket => !existingBuckets.has(bucket));
    
    if (missingBuckets.length > 0) {
      console.warn(`Missing buckets: ${missingBuckets.join(', ')}`);
      // Don't try to create buckets automatically - it requires admin permissions
      // Just log the warning so developers are aware
    }
    
    return true;
  } catch (error) {
    console.error("Error ensuring storage buckets:", error);
    return false;
  }
};

export const createSpecificBucket = async (bucketName: string): Promise<boolean> => {
  try {
    console.log(`Creating bucket: ${bucketName}`);
    
    const { data: existingBuckets, error: listError } = await supabase.storage.listBuckets();
    
    if (listError) {
      console.error("Error checking existing buckets:", listError);
      return false;
    }
    
    const bucketExists = existingBuckets?.some(b => b.name === bucketName);
    if (bucketExists) {
      console.log(`Bucket ${bucketName} already exists, skipping creation`);
      return true;
    }
    
    // Note: Creating buckets using the client SDK will likely fail due to RLS
    // We'll attempt it, but in production this would typically be done via SQL migrations or edge functions
    try {
      // Define allowed MIME types based on bucket type
      let allowedMimeTypes: string[];
      
      if (bucketName === 'avatars') {
        allowedMimeTypes = ['image/png', 'image/jpeg', 'image/jpg', 'image/gif', 'image/webp'];
      } else if (bucketName.includes('papers') || bucketName.includes('solutions')) {
        allowedMimeTypes = ['application/pdf'];
      } else if (bucketName === 'questions') {
        allowedMimeTypes = ['image/png', 'image/jpeg', 'image/jpg', 'image/gif', 'image/webp', 'image/svg+xml'];
      } else {
        // Default allowed types
        allowedMimeTypes = ['image/png', 'image/jpeg', 'image/jpg', 'application/pdf'];
      }
      
      // Try to create the bucket (this may fail due to RLS)
      const { error } = await supabase
        .storage
        .createBucket(bucketName, {
          public: true,
          fileSizeLimit: 1024 * 1024 * 10, // 10MB
          allowedMimeTypes: allowedMimeTypes
        });
      
      if (error) {
        // Log but don't throw - default to using edge function
        console.error(`Error creating bucket ${bucketName} via client SDK:`, error);
        
        // Use the edge function to create bucket with admin privileges
        if (bucketName === 'questions' || bucketName === 'avatars') {
          console.log(`Attempting to create ${bucketName} bucket via edge function...`);
          const { data, error: fnError } = await supabase.functions.invoke('create-avatars-bucket', {
            body: { bucketName: bucketName }
          });
          
          if (fnError) {
            console.error(`Edge function error creating bucket ${bucketName}:`, fnError);
            return false;
          }
          
          console.log(`Edge function response:`, data);
          return true;
        }
        
        return false;
      }
      
      console.log(`Successfully created bucket: ${bucketName}`);
      return true;
    } catch (createError) {
      console.error(`Error creating bucket ${bucketName}:`, createError);
      return false;
    }
  } catch (error) {
    console.error(`Error creating bucket ${bucketName}:`, error);
    return false;
  }
};

/**
 * Gets a list of files in a specific bucket
 */
export const listBucketFiles = async (bucketName: string) => {
  try {
    const { data, error } = await supabase.storage.from(bucketName).list();
    
    if (error) {
      console.error(`Error listing files in bucket ${bucketName}:`, error);
      return [];
    }
    
    return data || [];
  } catch (error) {
    console.error(`Error listing files in bucket ${bucketName}:`, error);
    return [];
  }
};
