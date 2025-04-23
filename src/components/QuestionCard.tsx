
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
  onSelectAnswer?: (questionId: string, selectedOption: string) => void;
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
  
  // Track selected checkboxes for multi-correct questions
  const [selectedOptions, setSelectedOptions] = useState<string[]>([]);
  
  // Initialize selected options from the passed selectedAnswer prop
  useEffect(() => {
    if (isMultiCorrect && selectedAnswer) {
      if (Array.isArray(selectedAnswer)) {
        setSelectedOptions(selectedAnswer);
      } else if (typeof selectedAnswer === 'string') {
        setSelectedOptions(selectedAnswer.split(',').filter(Boolean));
      }
    }
  }, [selectedAnswer, isMultiCorrect]);

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
    if (!onSelectAnswer) return;
    
    if (isMultiCorrect) {
      let newSelectedOptions: string[];
      
      // If already selected, remove it; otherwise add it
      if (selectedOptions.includes(option)) {
        newSelectedOptions = selectedOptions.filter(opt => opt !== option);
      } else {
        newSelectedOptions = [...selectedOptions, option];
      }
      
      setSelectedOptions(newSelectedOptions);
      
      // Join selected options with comma for multi-select questions
      onSelectAnswer(question.id, newSelectedOptions.sort().join(','));
    } else {
      // For single select questions, just pass the option
      onSelectAnswer(question.id, option);
    }
  };

  const isOptionSelected = (option: string) => {
    if (isMultiCorrect) {
      return selectedOptions.includes(option);
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
              id={`option-a-${question.id}`} 
              checked={isOptionSelected('a')}
              onCheckedChange={() => handleOptionSelect('a')}
              disabled={showAnswer}
            />
            <Label htmlFor={`option-a-${question.id}`} className="cursor-pointer">{question.option_a}</Label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox 
              id={`option-b-${question.id}`} 
              checked={isOptionSelected('b')}
              onCheckedChange={() => handleOptionSelect('b')}
              disabled={showAnswer}
            />
            <Label htmlFor={`option-b-${question.id}`} className="cursor-pointer">{question.option_b}</Label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox 
              id={`option-c-${question.id}`} 
              checked={isOptionSelected('c')}
              onCheckedChange={() => handleOptionSelect('c')}
              disabled={showAnswer}
            />
            <Label htmlFor={`option-c-${question.id}`} className="cursor-pointer">{question.option_c}</Label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox 
              id={`option-d-${question.id}`} 
              checked={isOptionSelected('d')}
              onCheckedChange={() => handleOptionSelect('d')}
              disabled={showAnswer}
            />
            <Label htmlFor={`option-d-${question.id}`} className="cursor-pointer">{question.option_d}</Label>
          </div>
        </div>
      ) : (
        <RadioGroup 
          value={selectedAnswer as string}
          onValueChange={(value) => onSelectAnswer && onSelectAnswer(question.id, value)}
          disabled={showAnswer} 
          className="space-y-3 mt-4"
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="a" id={`option-a-${question.id}`} />
            <Label htmlFor={`option-a-${question.id}`} className="cursor-pointer">{question.option_a}</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="b" id={`option-b-${question.id}`} />
            <Label htmlFor={`option-b-${question.id}`} className="cursor-pointer">{question.option_b}</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="c" id={`option-c-${question.id}`} />
            <Label htmlFor={`option-c-${question.id}`} className="cursor-pointer">{question.option_c}</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="d" id={`option-d-${question.id}`} />
            <Label htmlFor={`option-d-${question.id}`} className="cursor-pointer">{question.option_d}</Label>
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
