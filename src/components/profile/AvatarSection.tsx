
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import AvatarUploader from './AvatarUploader';
import { useState, useEffect } from 'react';
import { toast } from 'sonner';

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
  
  useEffect(() => {
    setLocalAvatarUrl(avatarUrl);
  }, [avatarUrl]);

  const handleAvatarUpdate = (url: string) => {
    console.log("Avatar updated in AvatarSection:", url);
    setLocalAvatarUrl(url);
    
    // Dispatch event so other components can update
    const event = new CustomEvent('avatar-updated', { detail: { url } });
    window.dispatchEvent(event);
    
    toast.success("Avatar updated successfully");
  };

  return (
    <Card className="col-span-1">
      <CardHeader>
        <CardTitle>Your Avatar</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col items-center justify-center space-y-4">
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
