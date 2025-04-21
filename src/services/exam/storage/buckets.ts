
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

/**
 * Creates a specific storage bucket with proper configuration
 */
export const createSpecificBucket = async (bucketName: string): Promise<boolean> => {
  try {
    console.log(`Creating or verifying storage bucket: ${bucketName}`);
    
    // Check if bucket exists first
    const { data: bucketList } = await supabase.storage.listBuckets();
    const bucketExists = bucketList?.find(bucket => bucket.name === bucketName);
    
    if (bucketExists) {
      console.log(`Bucket ${bucketName} already exists`);
      return true;
    }
    
    // Create bucket with proper permissions
    const { error } = await supabase.storage.createBucket(bucketName, {
      public: true, // Make bucket publicly accessible
      fileSizeLimit: 5 * 1024 * 1024, // 5MB limit
      allowedMimeTypes: ['image/png', 'image/jpeg', 'image/jpg', 'image/gif', 'image/webp', 'image/svg+xml']
    });
    
    if (error) {
      console.error(`Error creating ${bucketName} bucket:`, error);
      return false;
    }
    
    console.log(`Successfully created ${bucketName} bucket`);
    
    // Instead of using RPC for policy, we'll set up public file access directly
    // Remove the RPC call that doesn't exist in this project
    // This will make buckets public by default, which is okay for this use case
    console.log(`Bucket ${bucketName} is set to public access by default`);
    
    return true;
  } catch (error) {
    console.error(`Error setting up ${bucketName} bucket:`, error);
    return false;
  }
};

/**
 * Ensures that all required storage buckets exist
 */
export const ensureStorageBuckets = async (): Promise<boolean> => {
  try {
    // Initialize paper and solution buckets for different boards
    const paperBucketsPromise = [
      'jee-papers',
      'wbjee-papers',
      'ssc-cgl-papers',
      'bitsat-papers',
      'other-papers',
    ].map(bucketName => createSpecificBucket(bucketName));
    
    const solutionBucketsPromise = [
      'jee-solutions',
      'wbjee-solutions',
      'ssc-cgl-solutions',
      'bitsat-solutions',
      'other-solutions',
    ].map(bucketName => createSpecificBucket(bucketName));
    
    // Create avatars bucket
    const avatarsBucketPromise = createSpecificBucket('avatars');
    
    // Create questions images bucket
    const questionsBucketPromise = createSpecificBucket('questions');
    
    // Wait for all buckets to be created
    const results = await Promise.all([
      ...paperBucketsPromise,
      ...solutionBucketsPromise,
      avatarsBucketPromise,
      questionsBucketPromise
    ]);
    
    // Check if all buckets were created successfully
    const allBucketsCreated = results.every(result => result === true);
    
    return allBucketsCreated;
  } catch (error) {
    console.error('Error ensuring storage buckets:', error);
    toast.error('Failed to initialize storage buckets');
    return false;
  }
};
