
import { useState, useCallback, useEffect, useRef } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2, Upload, User } from 'lucide-react';
import { uploadUserAvatar } from '@/services/exam/storage/operations';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import { useIsMobile } from '@/hooks/use-mobile';

interface AvatarUploaderProps {
  avatarUrl: string | null;
  onAvatarUpdate?: (url: string) => void;
  uploading?: boolean;
  setUploading?: (uploading: boolean) => void;
}

const AvatarUploader = ({ 
  avatarUrl, 
  onAvatarUpdate, 
  uploading: externalUploading, 
  setUploading: setExternalUploading 
}: AvatarUploaderProps) => {
  const { user } = useAuth();
  const [internalUploading, setInternalUploading] = useState<boolean>(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [imageError, setImageError] = useState<boolean>(false);
  const isMobile = useIsMobile();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const uploading = externalUploading !== undefined ? externalUploading : internalUploading;
  const setUploading = setExternalUploading || setInternalUploading;
  
  useEffect(() => {
    if (avatarUrl) {
      // Add timestamp to prevent caching
      const timestamp = new Date().getTime();
      const url = avatarUrl.includes('?') 
        ? `${avatarUrl}&t=${timestamp}`
        : `${avatarUrl}?t=${timestamp}`;
      setPreviewUrl(url);
      setImageError(false);
    } else {
      setPreviewUrl(null);
    }
  }, [avatarUrl]);

  const getInitials = () => {
    if (user?.email) {
      return user.email.substring(0, 2).toUpperCase();
    }
    return 'U';
  };

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0 || !user?.id) {
      return;
    }
    
    const file = e.target.files[0];
    setUploading(true);
    
    // Create local preview immediately for better UX
    const objectUrl = URL.createObjectURL(file);
    setPreviewUrl(objectUrl);
    setImageError(false);
    
    try {
      const url = await uploadUserAvatar(file, user.id);
      
      if (url) {
        console.log("Avatar uploaded successfully, URL:", url);
        
        // Add timestamp to prevent caching
        const timestamp = new Date().getTime();
        const finalUrl = url.includes('?') 
          ? `${url}&t=${timestamp}` 
          : `${url}?t=${timestamp}`;
        
        // Call the callback if provided
        if (onAvatarUpdate) {
          onAvatarUpdate(finalUrl);
        }
      }
    } catch (error: any) {
      console.error("Error uploading avatar:", error);
      toast.error(`Failed to upload avatar: ${error.message || "Unknown error"}`);
      
      // Revert to previous avatar on error
      setPreviewUrl(avatarUrl);
      setImageError(true);
    } finally {
      setUploading(false);
      // Clear the file input so the same file can be selected again
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleImageError = useCallback(() => {
    console.error("Error loading avatar preview image");
    setImageError(true);
  }, []);

  return (
    <div className="flex flex-col items-center space-y-4">
      <Avatar className={`border-2 border-primary ${isMobile ? 'h-20 w-20' : 'h-24 w-24'}`}>
        {previewUrl && !imageError ? (
          <AvatarImage 
            src={previewUrl} 
            alt="Profile" 
            onError={handleImageError}
            className="aspect-square object-cover"
          />
        ) : (
          <AvatarFallback className="bg-mathprimary text-xl text-white">
            {getInitials()}
          </AvatarFallback>
        )}
      </Avatar>
      
      <div className="flex flex-col items-center gap-2 w-full">
        <Label 
          htmlFor="avatar-upload" 
          className={`w-full py-2 px-4 text-center rounded-md cursor-pointer transition-colors ${
            uploading 
              ? 'bg-secondary/70 cursor-not-allowed' 
              : 'bg-secondary hover:bg-secondary/80'
          }`}
        >
          {uploading ? (
            <span className="flex items-center justify-center gap-2">
              <Loader2 className="h-4 w-4 animate-spin" />
              Uploading...
            </span>
          ) : (
            <span className="flex items-center justify-center gap-2">
              <Upload className="h-4 w-4" />
              Upload new image
            </span>
          )}
        </Label>
        <Input 
          id="avatar-upload" 
          ref={fileInputRef}
          type="file" 
          accept="image/*"
          className="hidden" 
          onChange={handleAvatarChange}
          disabled={uploading}
        />
        <p className="text-xs text-muted-foreground mt-2 text-center">
          Recommended: Square image, 500x500 pixels or larger
        </p>
      </div>
    </div>
  );
};

export default AvatarUploader;
