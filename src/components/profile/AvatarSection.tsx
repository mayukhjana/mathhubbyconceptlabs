
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2 } from 'lucide-react';
import { uploadUserAvatar } from '@/services/exam/storage/operations';
import { useAuth } from '@/contexts/AuthContext';
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
  const { user } = useAuth();

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
    setUploadingAvatar(true);
    
    try {
      const url = await uploadUserAvatar(file, user.id);
      
      if (url) {
        toast.success('Avatar updated successfully');
        const event = new CustomEvent('avatar-updated', { detail: { url }});
        window.dispatchEvent(event);
      }
    } catch (error: any) {
      console.error("Error uploading avatar:", error);
      toast.error(`Failed to upload avatar: ${error.message || "Unknown error"}`);
    } finally {
      setUploadingAvatar(false);
    }
  };

  return (
    <Card className="col-span-1">
      <CardHeader>
        <CardTitle>Your Avatar</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col items-center justify-center space-y-4">
        <Avatar className="h-24 w-24 border-2 border-primary">
          {avatarUrl && (
            <AvatarImage 
              src={avatarUrl} 
              alt="Profile" 
              onError={() => console.error("Error loading avatar image")}
            />
          )}
          <AvatarFallback className="bg-mathprimary text-xl text-white">
            {getInitials()}
          </AvatarFallback>
        </Avatar>
        
        <div className="flex flex-col items-center gap-2 w-full">
          <Label 
            htmlFor="avatar-upload" 
            className="w-full py-2 px-4 bg-secondary text-center rounded-md cursor-pointer hover:bg-secondary/80 transition-colors"
          >
            {uploadingAvatar ? (
              <span className="flex items-center justify-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin" />
                Uploading...
              </span>
            ) : "Upload new image"}
          </Label>
          <Input 
            id="avatar-upload" 
            type="file" 
            accept="image/*"
            className="hidden" 
            onChange={handleAvatarChange}
            disabled={uploadingAvatar}
          />
          <p className="text-xs text-muted-foreground mt-2 text-center">
            Recommended: Square image, 500x500 pixels or larger
          </p>
          <p className="text-xs text-red-500 mt-1">
            The website is running in beta phase and hence this feature is not yet available
          </p>
        </div>
      </CardContent>
    </Card>
  );
};
