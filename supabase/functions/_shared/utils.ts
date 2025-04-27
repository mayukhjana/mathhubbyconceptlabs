import { corsHeaders } from './cors.ts';

/**
 * Converts a base64 string to a typed Blob
 * @param base64Data The base64 data string
 * @param contentType The MIME type for the blob
 */
export function base64ToBlob(base64Data: string, contentType: string): Blob {
  const byteCharacters = atob(base64Data);
  const byteArrays = [];
  
  for (let offset = 0; offset < byteCharacters.length; offset += 512) {
    const slice = byteCharacters.slice(offset, offset + 512);
    const byteNumbers = new Array(slice.length);
    
    for (let i = 0; i < slice.length; i++) {
      byteNumbers[i] = slice.charCodeAt(i);
    }
    
    const byteArray = new Uint8Array(byteNumbers);
    byteArrays.push(byteArray);
  }
  
  return new Blob(byteArrays, { type: contentType });
}

/**
 * Determines the correct MIME content type from file metadata
 */
export function getContentTypeFromFile(fileName: string, providedType: string): string {
  // If provided type is valid, use it
  if (providedType && 
      providedType !== 'application/octet-stream' && 
      providedType !== 'application/json') {
    return providedType;
  }
  
  // Otherwise, determine by extension
  const extension = fileName.split('.').pop()?.toLowerCase();
  
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
    'pdf': 'application/pdf',
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
  return providedType || 'application/octet-stream';
}

/**
 * Creates a file from base64 data with the correct content type
 */
export async function fileToTypedBlob(
  fileName: string, 
  fileType: string, 
  base64Data: string
): Promise<Blob> {
  const contentType = getContentTypeFromFile(fileName, fileType);
  console.log(`Converting to blob with content type: ${contentType}, filename: ${fileName}`);
  
  try {
    // Create new Blob with correct content type
    const blob = base64ToBlob(base64Data, contentType);
    console.log(`Created blob with type: ${blob.type}, size: ${blob.size}`);
    
    return blob;
  } catch (error) {
    console.error("Error converting to blob:", error);
    throw error;
  }
}

/**
 * Creates a standardized error response
 */
export function createErrorResponse(message: string, status = 500): Response {
  return new Response(
    JSON.stringify({ 
      error: message 
    }),
    { 
      status, 
      headers: { 
        ...corsHeaders, 
        'Content-Type': 'application/json' 
      } 
    }
  );
}
