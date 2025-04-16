
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { AuthGuard } from '@/components/AuthGuard';
import { AvatarSection } from '@/components/profile/AvatarSection';
import { ProfileForm } from '@/components/profile/ProfileForm';
import { useProfile } from '@/hooks/useProfile';

const ProfilePage = () => {
  const { signOut } = useAuth();
  const navigate = useNavigate();
  const {
    displayName,
    setDisplayName,
    username,
    setUsername,
    loading,
    avatarUrl,
    uploadingAvatar,
    setUploadingAvatar,
    handleSubmit
  } = useProfile();
  
  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };
  
  return (
    <AuthGuard>
      <div className="container max-w-4xl mx-auto py-8 px-4">
        <h1 className="text-3xl font-bold mb-6">My Profile</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <AvatarSection 
            avatarUrl={avatarUrl}
            uploadingAvatar={uploadingAvatar}
            setUploadingAvatar={setUploadingAvatar}
          />
          
          <ProfileForm
            displayName={displayName}
            username={username}
            loading={loading}
            onDisplayNameChange={setDisplayName}
            onUsernameChange={setUsername}
            onSignOut={handleSignOut}
            onSubmit={handleSubmit}
          />
        </div>
      </div>
    </AuthGuard>
  );
};

export default ProfilePage;
