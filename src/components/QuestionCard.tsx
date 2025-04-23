
import { useState, useEffect } from "react";
import { Question } from "@/services/exam/types";
import { Image as LucideImage, ImageOff, Loader } from "lucide-react";

interface QuestionCardProps {
  question: Question;
  index: number;
  showAnswer?: boolean;
}

const QuestionCard = ({ question, index, showAnswer = false }: QuestionCardProps) => {
  const [isImageLoading, setIsImageLoading] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [retryCount, setRetryCount] = useState(0);
  const [cacheBustUrl, setCacheBustUrl] = useState<string | undefined>(question.image_url);

  useEffect(() => {
    if (question.image_url) {
      setImageError(false);
      setIsImageLoading(true);

      // Add cache-busting parameter to URL
      const timestamp = new Date().getTime();
      const newUrl = question.image_url.includes('?')
        ? `${question.image_url}&t=${timestamp}`
        : `${question.image_url}?t=${timestamp}`;

      setCacheBustUrl(newUrl);
      console.log("QuestionCard: Setting up image with cache bust URL:", newUrl);

      // Preload the image
      const img = new Image();
      img.crossOrigin = "anonymous";
      img.onload = () => {
        console.log("QuestionCard: Image preloaded successfully:", newUrl);
        setIsImageLoading(false);
        setImageError(false);
      };
      img.onerror = () => {
        console.error("QuestionCard: Failed to preload image:", newUrl);
        setIsImageLoading(false);
        setImageError(true);

        // Retry logic with exponential backoff
        if (retryCount < 3) {
          const timeout = Math.pow(2, retryCount) * 1000;
          setTimeout(() => {
            setRetryCount(prevCount => prevCount + 1);
          }, timeout);
        }
      };
      img.src = newUrl;

      return () => {
        // Clean up to prevent memory leaks
        img.onload = null;
        img.onerror = null;
      };
    } else {
      setCacheBustUrl(undefined);
      setImageError(false);
      setIsImageLoading(false);
    }
  }, [question.image_url, retryCount]);

  const handleImageLoad = () => {
    setIsImageLoading(false);
    setImageError(false);
  };

  const handleImageError = () => {
    setIsImageLoading(false);
    setImageError(true);
    
    if (retryCount < 3 && question.image_url) {
      // Try one more immediate retry with a new timestamp
      const timestamp = new Date().getTime();
      const retryUrl = question.image_url.includes('?')
        ? `${question.image_url}&t=${timestamp}_retry${retryCount}`
        : `${question.image_url}?t=${timestamp}_retry${retryCount}`;
      setCacheBustUrl(retryUrl);
    }
  };

  return (
    <div className="border rounded-md p-4 mb-4">
      <h3 className="text-lg font-semibold mb-2">Question {index + 1}</h3>
      <p className="mb-2">{question.question_text}</p>

      {question.image_url ? (
        <div className="mb-2">
          {isImageLoading && (
            <div className="flex justify-center items-center py-4">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          )}

          {imageError ? (
            <div className="py-4">
              <ImageOff className="h-8 w-8 mx-auto mb-2 text-red-500" />
              <p className="text-sm text-red-500">Failed to load image</p>
            </div>
          ) : (
            <img
              src={cacheBustUrl}
              alt={`Question ${index + 1}`}
              className={`max-w-full h-auto mx-auto ${isImageLoading ? 'hidden' : ''}`}
              onLoad={handleImageLoad}
              onError={handleImageError}
              crossOrigin="anonymous"
            />
          )}
        </div>
      ) : null}

      <ul className="list-decimal pl-5">
        <li>{question.option_a}</li>
        <li>{question.option_b}</li>
        <li>{question.option_c}</li>
        <li>{question.option_d}</li>
      </ul>

      {/* Only show correct answer if showAnswer is true */}
      {showAnswer && (
        <p className="mt-2">
          <strong>Correct Answer:</strong>{" "}
          {Array.isArray(question.correct_answer)
            ? question.correct_answer.join(", ")
            : question.correct_answer}
        </p>
      )}
    </div>
  );
};

export default QuestionCard;
