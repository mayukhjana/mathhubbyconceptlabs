
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import AvatarUploader from './AvatarUploader';

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
  const handleAvatarUpdate = (url: string) => {
    console.log("Avatar updated in AvatarSection:", url);
  };

  return (
    <Card className="col-span-1">
      <CardHeader>
        <CardTitle>Your Avatar</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col items-center justify-center space-y-4">
        <AvatarUploader 
          avatarUrl={avatarUrl} 
          onAvatarUpdate={handleAvatarUpdate}
        />
      </CardContent>
    </Card>
  );
};
