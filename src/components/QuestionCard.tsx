
import { useState, useEffect } from "react";
import { Question } from "@/services/exam/types";
import { Image as LucideImage, ImageOff, Loader } from "lucide-react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";

interface QuestionCardProps {
  question: Question;
  index: number;
  showAnswer?: boolean;
  onSelectAnswer?: (selectedOption: string) => void;
  selectedAnswer?: string | string[];
}

const QuestionCard = ({ 
  question, 
  index, 
  showAnswer = false,
  onSelectAnswer,
  selectedAnswer
}: QuestionCardProps) => {
  const [isImageLoading, setIsImageLoading] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [retryCount, setRetryCount] = useState(0);
  const [cacheBustUrl, setCacheBustUrl] = useState<string | undefined>(question.image_url);
  const isMultiCorrect = question.is_multi_correct || false;

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

  const handleOptionSelect = (option: string) => {
    if (onSelectAnswer) {
      onSelectAnswer(option);
    }
  };

  const isOptionSelected = (option: string) => {
    if (!selectedAnswer) return false;
    
    if (Array.isArray(selectedAnswer)) {
      return selectedAnswer.includes(option);
    }
    
    return selectedAnswer === option;
  };

  return (
    <div className="border rounded-md p-4 mb-4">
      <h3 className="text-lg font-semibold mb-2">Question {index + 1}</h3>
      <p className="mb-2">{question.question_text}</p>

      {question.image_url ? (
        <div className="mb-4">
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

      {isMultiCorrect ? (
        <div className="space-y-3 mt-4">
          <div className="flex items-center space-x-2">
            <Checkbox 
              id={`option-a-${index}`} 
              checked={isOptionSelected('a')}
              onCheckedChange={() => handleOptionSelect('a')}
              disabled={showAnswer}
            />
            <Label htmlFor={`option-a-${index}`} className="cursor-pointer">{question.option_a}</Label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox 
              id={`option-b-${index}`} 
              checked={isOptionSelected('b')}
              onCheckedChange={() => handleOptionSelect('b')}
              disabled={showAnswer}
            />
            <Label htmlFor={`option-b-${index}`} className="cursor-pointer">{question.option_b}</Label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox 
              id={`option-c-${index}`} 
              checked={isOptionSelected('c')}
              onCheckedChange={() => handleOptionSelect('c')}
              disabled={showAnswer}
            />
            <Label htmlFor={`option-c-${index}`} className="cursor-pointer">{question.option_c}</Label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox 
              id={`option-d-${index}`} 
              checked={isOptionSelected('d')}
              onCheckedChange={() => handleOptionSelect('d')}
              disabled={showAnswer}
            />
            <Label htmlFor={`option-d-${index}`} className="cursor-pointer">{question.option_d}</Label>
          </div>
        </div>
      ) : (
        <RadioGroup 
          value={selectedAnswer as string}
          onValueChange={handleOptionSelect}
          disabled={showAnswer} 
          className="space-y-3 mt-4"
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="a" id={`option-a-${index}`} />
            <Label htmlFor={`option-a-${index}`} className="cursor-pointer">{question.option_a}</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="b" id={`option-b-${index}`} />
            <Label htmlFor={`option-b-${index}`} className="cursor-pointer">{question.option_b}</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="c" id={`option-c-${index}`} />
            <Label htmlFor={`option-c-${index}`} className="cursor-pointer">{question.option_c}</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="d" id={`option-d-${index}`} />
            <Label htmlFor={`option-d-${index}`} className="cursor-pointer">{question.option_d}</Label>
          </div>
        </RadioGroup>
      )}

      {/* Only show correct answer if showAnswer is true */}
      {showAnswer && (
        <p className="mt-4 text-green-600 font-medium">
          <strong>Correct Answer:</strong>{" "}
          {Array.isArray(question.correct_answer)
            ? question.correct_answer.map(opt => opt.toUpperCase()).join(", ")
            : question.correct_answer.toUpperCase()}
        </p>
      )}
    </div>
  );
};

export default QuestionCard;
