
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import AvatarUploader from './AvatarUploader';
import { useIsMobile } from '@/hooks/use-mobile';

interface AvatarSectionProps {
  avatarUrl?: string | null;
  uploadingAvatar?: boolean;
  setUploadingAvatar?: (uploading: boolean) => void;
}

export const AvatarSection = ({ 
  avatarUrl, 
  uploadingAvatar, 
  setUploadingAvatar 
}: AvatarSectionProps) => {
  const isMobile = useIsMobile();

  return (
    <Card className={`col-span-1 ${isMobile ? 'shadow-sm' : ''}`}>
      <CardHeader className={isMobile ? 'p-4' : ''}>
        <CardTitle>Your Avatar</CardTitle>
      </CardHeader>
      <CardContent className={`flex flex-col items-center justify-center space-y-4 ${isMobile ? 'p-4' : ''}`}>
        <AvatarUploader />
      </CardContent>
    </Card>
  );
};
