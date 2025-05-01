
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import AvatarUploader from './AvatarUploader';
import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { useIsMobile } from '@/hooks/use-mobile';

interface AvatarSectionProps {
  avatarUrl: string | null;
  uploadingAvatar: boolean;
  setUploadingAvatar: (uploading: boolean) => void;
}

export const AvatarSection = ({ 
  avatarUrl, 
  uploadingAvatar, 
  setUploadingAvatar 
}: AvatarSectionProps) => {
  const [localAvatarUrl, setLocalAvatarUrl] = useState<string | null>(avatarUrl);
  const isMobile = useIsMobile();
  
  useEffect(() => {
    // Ensure local state syncs with props when they change
    if (avatarUrl !== localAvatarUrl) {
      setLocalAvatarUrl(avatarUrl);
    }
  }, [avatarUrl]);

  const handleAvatarUpdate = (url: string) => {
    console.log("Avatar updated in AvatarSection:", url);
    setLocalAvatarUrl(url);
    
    // Dispatch event so other components can update
    const event = new CustomEvent('avatar-updated', { 
      detail: { url, timestamp: new Date().getTime() }
    });
    window.dispatchEvent(event);
    
    toast.success("Avatar updated successfully");
  };

  return (
    <Card className={`col-span-1 ${isMobile ? 'shadow-sm' : ''}`}>
      <CardHeader className={isMobile ? 'p-4' : ''}>
        <CardTitle>Your Avatar</CardTitle>
      </CardHeader>
      <CardContent className={`flex flex-col items-center justify-center space-y-4 ${isMobile ? 'p-4' : ''}`}>
        <AvatarUploader 
          avatarUrl={localAvatarUrl} 
          onAvatarUpdate={handleAvatarUpdate}
          uploading={uploadingAvatar}
          setUploading={setUploadingAvatar}
        />
      </CardContent>
    </Card>
  );
};
