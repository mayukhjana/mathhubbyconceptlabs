
import { supabase } from "@/integrations/supabase/client";
import { getBucketName, generateFileName } from "./paths";
import { getContentTypeFromFile, fileToTypedBlob } from "@/utils/fileUtils";
import { toast } from "sonner";

/**
 * Retrieves a signed URL for downloading an exam file
 */
export const getFileDownloadUrl = async (
  examId: string, 
  fileType: 'paper' | 'solution', 
  board: string
) => {
  try {
    const bucketName = getBucketName(board, fileType);
    const fileName = generateFileName(examId, fileType, board);
    
    console.log(`Attempting to get ${fileType} from bucket: ${bucketName}, file: ${fileName}`);
    
    const { data, error } = await supabase
      .storage
      .from(bucketName)
      .createSignedUrl(fileName, 60 * 60);
    
    if (error) {
      console.error(`Error getting ${fileType} download URL:`, error);
      return null;
    }
    
    console.log(`Successfully got signed URL for ${fileType}:`, data.signedUrl);
    return data.signedUrl;
  } catch (error) {
    console.error(`Error getting ${fileType} download URL:`, error);
    return null;
  }
};

/**
 * Uploads an exam file to the appropriate storage bucket
 */
export const uploadExamFile = async (
  file: File, 
  examId: string, 
  fileType: 'paper' | 'solution',
  board: string
) => {
  try {
    const bucketName = getBucketName(board, fileType);
    const fileName = generateFileName(examId, fileType, board);
    
    console.log(`Uploading ${fileType} to bucket: ${bucketName}, file: ${fileName}`);
    
    // Verify file is a PDF
    const extension = file.name.split('.').pop()?.toLowerCase();
    if (extension !== 'pdf') {
      const error = new Error(`Only PDF files are accepted for ${fileType}s`);
      toast.error(`Upload failed: ${error.message}`);
      throw error;
    }
    
    // Get the correct content type using our utility
    const contentType = getContentTypeFromFile(file);
    console.log(`Setting content type: ${contentType} for file: ${file.name}`);
    
    // Convert file to properly typed blob
    const typedBlob = await fileToTypedBlob(file);
    
    // Set the correct content type in upload options
    const options = {
      cacheControl: '3600',
      upsert: true,
      contentType: contentType
    };
    
    const { data, error } = await supabase
      .storage
      .from(bucketName)
      .upload(fileName, typedBlob, options);
    
    if (error) {
      console.error(`Error uploading ${fileType}:`, error);
      toast.error(`Failed to upload ${fileType}: ${error.message}`);
      throw error;
    }
    
    console.log(`Successfully uploaded ${fileType}:`, data);
    toast.success(`Successfully uploaded ${fileType}`);
    return fileName;
  } catch (error: any) {
    console.error(`Error uploading ${fileType}:`, error);
    toast.error(`Failed to upload ${fileType}: ${error.message}`);
    throw error;
  }
};

/**
 * Ensures the avatars bucket exists with proper permissions
 */
export const ensureAvatarsBucket = async (): Promise<boolean> => {
  try {
    // Check if bucket exists
    const { data: buckets, error: listError } = await supabase.storage.listBuckets();
    
    if (listError) {
      console.error("Error checking buckets:", listError);
      return false;
    }
    
    const avatarBucketExists = buckets?.some(b => b.name === 'avatars');
    
    if (!avatarBucketExists) {
      console.log("Avatars bucket does not exist, creating it...");
      
      const { error: createError } = await supabase.storage.createBucket('avatars', { 
        public: true,
        fileSizeLimit: 10 * 1024 * 1024, // 10MB
        allowedMimeTypes: ['image/png', 'image/jpeg', 'image/jpg', 'image/gif', 'image/webp']
      });
      
      if (createError) {
        console.error("Error creating avatars bucket:", createError);
        return false;
      }
      
      // Set public bucket policy
      const { error: policyError } = await supabase.storage.from('avatars').createSignedUrl('test.txt', 1);
      if (policyError && !policyError.message.includes('not found')) {
        console.error("Policy may not be set correctly:", policyError);
      }
      
      console.log("Successfully created avatars bucket");
    }
    
    return true;
  } catch (error) {
    console.error("Error ensuring avatars bucket:", error);
    return false;
  }
};

/**
 * Uploads a user avatar to the storage and updates profile
 */
export const uploadUserAvatar = async (file: File, userId: string): Promise<string | null> => {
  try {
    console.log(`Starting avatar upload process... File type: ${file.type}, Extension: ${file.name.split('.').pop()?.toLowerCase()}`);
    
    // Generate unique filename to prevent collisions
    const fileExt = file.name.split('.').pop()?.toLowerCase() || 'jpg';
    const uniqueId = Date.now().toString(36) + Math.random().toString(36).substring(2, 10);
    const fileName = `${userId}-${uniqueId}.${fileExt}`;
    
    // Ensure it's an image file
    if (!file.type.startsWith('image/') && !['png', 'jpg', 'jpeg', 'gif', 'webp'].includes(fileExt)) {
      throw new Error('Only image files are allowed for avatars');
    }
    
    // Get proper content type
    const contentType = getContentTypeFromFile(file);
    console.log(`Using content type: ${contentType}`);
    
    // Create blob with proper type
    const typedBlob = await fileToTypedBlob(file);
    console.log(`Created typed blob with type: ${typedBlob.type}`);
    
    // Ensure bucket exists
    await ensureAvatarsBucket();
    
    // Upload image
    const { data, error } = await supabase.storage
      .from('avatars')
      .upload(fileName, typedBlob, {
        contentType,
        upsert: true,
        cacheControl: '3600'
      });
    
    if (error) {
      console.error("Error uploading avatar:", error);
      throw error;
    }
    
    console.log("Upload successful:", data);
    
    // Get public URL with timestamp to prevent caching
    const timestamp = new Date().getTime();
    const publicUrl = `${supabase.storage.from('avatars').getPublicUrl(fileName).data.publicUrl}?t=${timestamp}`;
    
    // Update profile
    const { error: updateError } = await supabase
      .from('profiles')
      .update({ 
        avatar_url: publicUrl,
        updated_at: new Date().toISOString()
      })
      .eq('id', userId);
    
    if (updateError) {
      console.error("Error updating profile:", updateError);
      throw updateError;
    }
    
    console.log("Avatar uploaded successfully, public URL:", publicUrl);
    return publicUrl;
  } catch (error: any) {
    console.error("Avatar upload failed:", error);
    throw error;
  }
};
