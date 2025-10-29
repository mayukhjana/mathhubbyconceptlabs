
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ProfileCompletionAvatar } from './ProfileCompletionAvatar';
import { useIsMobile } from '@/hooks/use-mobile';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { Upload } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { useState } from 'react';

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
  const { user } = useAuth();
  const [uploading, setUploading] = useState(false);

  // Calculate profile completion percentage
  const calculateCompletion = () => {
    const fields = [avatarUrl, displayName, username, schoolName, board, classValue];
    const filledFields = fields.filter(field => field && field.trim() !== '').length;
    return Math.round((filledFields / fields.length) * 100);
  };

  const completionPercentage = calculateCompletion();

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    try {
      const file = event.target.files?.[0];
      if (!file) return;

      // Validate file type
      if (!file.type.startsWith('image/')) {
        toast.error('Please upload an image file');
        return;
      }

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast.error('Image size must be less than 5MB');
        return;
      }

      setUploading(true);
      if (setUploadingAvatar) setUploadingAvatar(true);

      const fileExt = file.name.split('.').pop();
      const fileName = `${user?.id}-${Math.random()}.${fileExt}`;
      const filePath = `${user?.id}/${fileName}`;

      // Upload file to Supabase Storage
      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, file, { upsert: true });

      if (uploadError) throw uploadError;

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('avatars')
        .getPublicUrl(filePath);

      // Update profile with new avatar URL
      const { error: updateError } = await supabase
        .from('profiles')
        .update({ 
          avatar_url: publicUrl,
          updated_at: new Date().toISOString()
        })
        .eq('id', user?.id);

      if (updateError) throw updateError;

      // Dispatch custom event to notify other components
      window.dispatchEvent(new CustomEvent('avatar-updated', { 
        detail: { url: publicUrl } 
      }));

      toast.success('Avatar updated successfully!');
      
      // Reload the page to reflect changes
      setTimeout(() => window.location.reload(), 500);
    } catch (error: any) {
      console.error('Error uploading avatar:', error);
      toast.error('Failed to upload avatar');
    } finally {
      setUploading(false);
      if (setUploadingAvatar) setUploadingAvatar(false);
    }
  };

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
        
        <div className="w-full">
          <input
            type="file"
            id="avatar-upload"
            accept="image/*"
            onChange={handleFileUpload}
            className="hidden"
            disabled={uploading}
          />
          <label htmlFor="avatar-upload">
            <Button 
              variant="outline" 
              className="w-full" 
              disabled={uploading}
              asChild
            >
              <span className="flex items-center gap-2 cursor-pointer">
                <Upload className="h-4 w-4" />
                {uploading ? 'Uploading...' : 'Upload Avatar'}
              </span>
            </Button>
          </label>
        </div>
      </CardContent>
    </Card>
  );
};
