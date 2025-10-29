
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import AvatarUploader from './AvatarUploader';
import { ProfileCompletionAvatar } from './ProfileCompletionAvatar';
import { useIsMobile } from '@/hooks/use-mobile';
import { Progress } from '@/components/ui/progress';

interface AvatarSectionProps {
  avatarUrl?: string | null;
  displayName?: string;
  username?: string;
  schoolName?: string;
  board?: string;
  classValue?: string;
  uploadingAvatar?: boolean;
  setUploadingAvatar?: (uploading: boolean) => void;
}

export const AvatarSection = ({ 
  avatarUrl,
  displayName,
  username,
  schoolName,
  board,
  classValue,
  uploadingAvatar, 
  setUploadingAvatar 
}: AvatarSectionProps) => {
  const isMobile = useIsMobile();

  // Calculate profile completion percentage
  const calculateCompletion = () => {
    const fields = [avatarUrl, displayName, username, schoolName, board, classValue];
    const filledFields = fields.filter(field => field && field.trim() !== '').length;
    return Math.round((filledFields / fields.length) * 100);
  };

  const completionPercentage = calculateCompletion();

  return (
    <Card className={`col-span-1 ${isMobile ? 'shadow-sm' : ''}`}>
      <CardHeader className={isMobile ? 'p-4' : ''}>
        <CardTitle>Your Profile</CardTitle>
      </CardHeader>
      <CardContent className={`flex flex-col items-center justify-center space-y-4 ${isMobile ? 'p-4' : ''}`}>
        <ProfileCompletionAvatar 
          avatarUrl={avatarUrl}
          displayName={displayName}
          completionPercentage={completionPercentage}
        />
        <div className="w-full space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Profile Completion</span>
            <span className="font-semibold">{completionPercentage}%</span>
          </div>
          <Progress value={completionPercentage} className="h-2" />
        </div>
        <AvatarUploader />
      </CardContent>
    </Card>
  );
};
