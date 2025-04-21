
/**
 * Utility functions for determining storage paths and bucket names
 */

// List of all bucket names used in the application
export const STORAGE_BUCKETS = {
  PAPERS: {
    JEE: 'jee-papers',
    WBJEE: 'wbjee-papers',
    SSC_CGL: 'ssc-cgl-papers',
    BITSAT: 'bitsat-papers',
    OTHER: 'other-papers',
  },
  SOLUTIONS: {
    JEE: 'jee-solutions',
    WBJEE: 'wbjee-solutions',
    SSC_CGL: 'ssc-cgl-solutions',
    BITSAT: 'bitsat-solutions',
    OTHER: 'other-solutions',
  },
  AVATARS: 'avatars',
  QUESTIONS: 'questions'
};

/**
 * Gets the correct bucket name based on exam board and file type
 */
export const getBucketName = (board: string, fileType: 'paper' | 'solution'): string => {
  const boardLower = board.toLowerCase().replace(/\s+/g, '_');
  
  // Map board names to bucket names
  let bucketPrefix = '';
  
  if (boardLower.includes('jee')) {
    bucketPrefix = fileType === 'paper' ? STORAGE_BUCKETS.PAPERS.JEE : STORAGE_BUCKETS.SOLUTIONS.JEE;
  } else if (boardLower.includes('wbjee')) {
    bucketPrefix = fileType === 'paper' ? STORAGE_BUCKETS.PAPERS.WBJEE : STORAGE_BUCKETS.SOLUTIONS.WBJEE;
  } else if (boardLower.includes('ssc') || boardLower.includes('cgl')) {
    bucketPrefix = fileType === 'paper' ? STORAGE_BUCKETS.PAPERS.SSC_CGL : STORAGE_BUCKETS.SOLUTIONS.SSC_CGL;
  } else if (boardLower.includes('bitsat')) {
    bucketPrefix = fileType === 'paper' ? STORAGE_BUCKETS.PAPERS.BITSAT : STORAGE_BUCKETS.SOLUTIONS.BITSAT;
  } else {
    bucketPrefix = fileType === 'paper' ? STORAGE_BUCKETS.PAPERS.OTHER : STORAGE_BUCKETS.SOLUTIONS.OTHER;
  }
  
  return bucketPrefix;
};

/**
 * Generates a standardized file name for exam files
 */
export const generateFileName = (
  examId: string, 
  fileType: 'paper' | 'solution', 
  board: string
): string => {
  const boardLower = board.toLowerCase().replace(/\s+/g, '_');
  return `${boardLower}_${fileType}_${examId}.pdf`;
};
