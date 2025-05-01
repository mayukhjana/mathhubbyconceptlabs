
import { useState, useEffect } from 'react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { User } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useIsMobile } from '@/hooks/use-mobile';

interface AvatarUploaderProps {
  avatarUrl?: string | null;
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
  const isMobile = useIsMobile();
  
  const getInitials = () => {
    if (user?.email) {
      return user.email.substring(0, 2).toUpperCase();
    }
    return 'U';
  };

  return (
    <div className="flex flex-col items-center space-y-4">
      <Avatar className={`border-2 border-primary ${isMobile ? 'h-20 w-20' : 'h-24 w-24'}`}>
        <AvatarFallback className="bg-mathprimary text-xl text-white">
          {getInitials()}
        </AvatarFallback>
      </Avatar>
      
      <div className="text-center">
        <p className="text-sm text-muted-foreground">
          Your profile uses your initials as an avatar
        </p>
      </div>
    </div>
  );
};

export default AvatarUploader;
