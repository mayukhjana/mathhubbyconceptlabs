
import { useState } from "react";
import { Languages } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { TooltipProvider } from "@/components/ui/tooltip";

interface GoogleTranslateButtonProps {
  text: string;
}

const GoogleTranslateButton = ({ text }: GoogleTranslateButtonProps) => {
  const [isTranslating, setIsTranslating] = useState(false);
  const [translated, setTranslated] = useState(false);

  const handleTranslate = () => {
    setIsTranslating(true);
    
    // Create a Google Translate script if it doesn't exist
    const existingScript = document.getElementById('google-translate-api');
    
    if (!existingScript) {
      // Add Google Translate script to the page
      const googleTranslateScript = document.createElement('script');
      googleTranslateScript.id = 'google-translate-api';
      googleTranslateScript.src = '//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit';
      document.body.appendChild(googleTranslateScript);
      
      // Initialize Google Translate
      window.googleTranslateElementInit = () => {
        new window.google.translate.TranslateElement(
          {
            pageLanguage: 'en',
            autoDisplay: false,
            layout: window.google.translate.TranslateElement.InlineLayout.SIMPLE
          },
          'google-translate-element'
        );
        
        // Trigger click on the translate dropdown
        setTimeout(() => {
          const translateButton = document.querySelector('.goog-te-combo') as HTMLSelectElement;
          if (translateButton) {
            translateButton.focus();
            translateButton.click();
          }
          setIsTranslating(false);
          setTranslated(true);
        }, 1000);
      };
    } else {
      // If script already exists, just trigger the translation dropdown
      setTimeout(() => {
        const translateButton = document.querySelector('.goog-te-combo') as HTMLSelectElement;
        if (translateButton) {
          translateButton.focus();
          translateButton.click();
        }
        setIsTranslating(false);
        setTranslated(true);
      }, 300);
    }
  };

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="outline"
            size="sm"
            className={`h-7 w-7 p-0 rounded-full ${translated ? 'bg-blue-100' : ''}`}
            onClick={handleTranslate}
            disabled={isTranslating}
          >
            <Languages className={`h-4 w-4 ${translated ? 'text-blue-600' : ''}`} />
            <span className="sr-only">Translate</span>
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>Translate page</p>
        </TooltipContent>
      </Tooltip>
      
      {/* Hidden div for Google Translate to attach to */}
      <div id="google-translate-element" className="hidden"></div>
    </TooltipProvider>
  );
};

// Add the global type for the Google Translate API
declare global {
  interface Window {
    googleTranslateElementInit: () => void;
    google: {
      translate: {
        TranslateElement: any;
      };
    };
  }
}

export default GoogleTranslateButton;
