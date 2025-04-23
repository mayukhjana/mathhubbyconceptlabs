
/**
 * Utility functions for file handling and content type detection
 */

/**
 * Determines the correct MIME content type from a file object
 * based on its extension or type property
 */
export const getContentTypeFromFile = (file: File): string => {
  // First check for PDF files by extension (most reliable way)
  const extension = file.name.split('.').pop()?.toLowerCase();
  if (extension === 'pdf') {
    return 'application/pdf';
  }
  
  // For images, determine by extension for maximum reliability
  switch (extension) {
    case 'png': return 'image/png';
    case 'jpg':
    case 'jpeg': return 'image/jpeg';
    case 'gif': return 'image/gif';
    case 'webp': return 'image/webp';
    case 'svg': return 'image/svg+xml';
    case 'bmp': return 'image/bmp';
    default: break;
  }
  
  // Then check the native type if it seems valid
  if (file.type && 
      file.type !== 'application/octet-stream' && 
      file.type !== 'application/json') {
    return file.type;
  }
  
  // Map of common file extensions to MIME types
  const contentTypeMap: Record<string, string> = {
    // Images
    'png': 'image/png',
    'jpg': 'image/jpeg',
    'jpeg': 'image/jpeg',
    'gif': 'image/gif',
    'webp': 'image/webp',
    'svg': 'image/svg+xml',
    'bmp': 'image/bmp',
    
    // Documents
    'pdf': 'application/pdf', // Added again for redundancy
    'doc': 'application/msword',
    'docx': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'xls': 'application/vnd.ms-excel',
    'xlsx': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'txt': 'text/plain',
  };
  
  // Try to get the content type from the extension map
  if (extension && contentTypeMap[extension]) {
    return contentTypeMap[extension];
  }
  
  // Last resort fallback
  return file.type || 'application/octet-stream';
};

/**
 * Checks if a file is an image based on its content type
 */
export const isImageFile = (file: File): boolean => {
  const contentType = getContentTypeFromFile(file);
  return contentType.startsWith('image/');
};

/**
 * Checks if a file is a PDF based on its extension
 */
export const isPdfFile = (file: File): boolean => {
  const extension = file.name.split('.').pop()?.toLowerCase();
  return extension === 'pdf';
};

/**
 * Converts a File object to a Blob with the correct content type
 */
export const fileToTypedBlob = async (file: File): Promise<Blob> => {
  // For PDFs, always use application/pdf content type
  if (isPdfFile(file)) {
    const arrayBuffer = await file.arrayBuffer();
    return new Blob([arrayBuffer], { type: 'application/pdf' });
  }
  
  // For images, use extension-based detection
  const extension = file.name.split('.').pop()?.toLowerCase();
  let contentType = file.type;
  
  // Override content type for common image formats to avoid MIME type issues
  switch (extension) {
    case 'png': contentType = 'image/png'; break;
    case 'jpg':
    case 'jpeg': contentType = 'image/jpeg'; break;
    case 'gif': contentType = 'image/gif'; break;
    case 'webp': contentType = 'image/webp'; break;
    case 'svg': contentType = 'image/svg+xml'; break;
    default: contentType = getContentTypeFromFile(file); break;
  }
  
  console.log(`Converting file to blob with content type: ${contentType}, filename: ${file.name}`);
  
  // Read file as ArrayBuffer
  const arrayBuffer = await file.arrayBuffer();
  
  // Create new Blob with correct content type
  const blob = new Blob([arrayBuffer], { type: contentType });
  console.log(`Created blob with type: ${blob.type}, size: ${blob.size}`);
  
  return blob;
};
