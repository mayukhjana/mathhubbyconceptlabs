
import { supabase } from "@/integrations/supabase/client";
import { getBucketName, generateFileName } from "./paths";
import { getContentTypeFromFile, fileToTypedBlob } from "@/utils/fileUtils";
import { toast } from "sonner";
import { createSpecificBucket, ensureStorageBuckets } from "./buckets";

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
    
    // Force the correct content type for PDFs instead of relying on detection
    const contentType = 'application/pdf';
    console.log(`Setting fixed content type: ${contentType} for PDF file: ${file.name}`);
    
    // Create a new blob with the correct content type if needed
    let fileToUpload: File | Blob = file;
    if (file.type !== contentType) {
      console.log(`Converting file from ${file.type} to ${contentType}`);
      const arrayBuffer = await file.arrayBuffer();
      fileToUpload = new Blob([arrayBuffer], { type: contentType });
    }
    
    // Set the correct content type in upload options
    const options = {
      cacheControl: '3600',
      upsert: true,
      contentType: contentType
    };
    
    const { data, error } = await supabase
      .storage
      .from(bucketName)
      .upload(fileName, fileToUpload, options);
    
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
  return await createSpecificBucket('avatars');
};

/**
 * Ensures the questions bucket exists with proper permissions
 */
export const ensureQuestionsBucket = async (): Promise<boolean> => {
  return await createSpecificBucket('questions');
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
    
    // Ensure bucket exists
    await ensureAvatarsBucket();
    
    // Upload image with the correct content type
    const { data, error } = await supabase.storage
      .from('avatars')
      .upload(fileName, file, {
        contentType: contentType,
        upsert: true,
        cacheControl: '3600'
      });
    
    if (error) {
      console.error("Error uploading avatar:", error);
      throw error;
    }
    
    console.log("Upload successful:", data);
    
    // Get public URL with timestamp to prevent caching
    const publicUrl = supabase.storage.from('avatars').getPublicUrl(fileName).data.publicUrl;
    
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

/**
 * Uploads a question image to storage
 */
export const uploadQuestionImage = async (file: File): Promise<string | null> => {
  try {
    // Ensure it's an image file
    if (!file.type.startsWith('image/')) {
      const fileExt = file.name.split('.').pop()?.toLowerCase();
      if (!['png', 'jpg', 'jpeg', 'gif', 'webp', 'svg'].includes(fileExt || '')) {
        throw new Error('Only image files are allowed for question images');
      }
    }
    
    // Generate unique filename
    const fileExt = file.name.split('.').pop()?.toLowerCase() || 'jpg';
    const uniqueId = Date.now().toString(36) + Math.random().toString(36).substring(2, 10);
    const fileName = `question_${uniqueId}.${fileExt}`;
    
    // Get proper content type
    const contentType = getContentTypeFromFile(file);
    console.log(`Uploading question image with content type: ${contentType}`);
    
    // Ensure questions bucket exists
    await ensureQuestionsBucket();
    
    // Upload image with the correct content type
    const { data, error } = await supabase.storage
      .from('questions')
      .upload(fileName, await file.arrayBuffer(), {
        contentType: contentType,
        upsert: true,
        cacheControl: '3600'
      });
    
    if (error) {
      console.error("Error uploading question image:", error);
      throw error;
    }
    
    // Get public URL with timestamp for cache busting
    const timestamp = new Date().getTime();
    const publicUrl = `${supabase.storage.from('questions').getPublicUrl(fileName).data.publicUrl}?t=${timestamp}`;
    
    console.log("Question image uploaded successfully:", publicUrl);
    return publicUrl;
  } catch (error: any) {
    console.error("Question image upload failed:", error);
    throw error;
  }
};

// Export the main storage initialization function
export { ensureStorageBuckets };
