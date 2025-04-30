
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { LogOut, User, Crown, LifeBuoy } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

const UserProfileMenu = () => {
  const { user, signOut, isAuthenticated } = useAuth();
  const [userIsPremium, setUserIsPremium] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [avatarLoaded, setAvatarLoaded] = useState(false);
  const [avatarError, setAvatarError] = useState(false);
  const navigate = useNavigate();
  
  useEffect(() => {
    // In a real app, this would fetch premium status from a subscription service
    setUserIsPremium(localStorage.getItem("userIsPremium") === "true");
    
    // Fetch user avatar if authenticated
    const fetchUserAvatar = async () => {
      if (!user) return;
      
      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('avatar_url')
          .eq('id', user.id)
          .single();
          
        if (error) {
          console.error("Error fetching avatar URL:", error);
          return;
        }
        
        if (data && data.avatar_url) {
          // Add timestamp to URL to prevent caching
          const timestamp = new Date().getTime();
          // Ensure we have the correct URL format by checking for existing query parameters
          const url = data.avatar_url.includes('?') 
            ? `${data.avatar_url}&t=${timestamp}` 
            : `${data.avatar_url}?t=${timestamp}`;
            
          setAvatarUrl(url);
          setAvatarError(false);
        } else {
          setAvatarError(true);
        }
      } catch (error) {
        console.error('Error fetching user avatar:', error);
        setAvatarError(true);
      }
    };
    
    fetchUserAvatar();
    
    // Listen for avatar update events
    const handleAvatarUpdated = (event: CustomEvent) => {
      if (event.detail?.url) {
        const timestamp = new Date().getTime();
        const url = event.detail.url.includes('?') 
          ? `${event.detail.url}&t=${timestamp}` 
          : `${event.detail.url}?t=${timestamp}`;
        
        console.log("Setting new avatar URL:", url);
        setAvatarUrl(url);
        setAvatarError(false);
      }
    };
    
    window.addEventListener('avatar-updated', handleAvatarUpdated as EventListener);
    
    // Clear event listener on component unmount
    return () => {
      window.removeEventListener('avatar-updated', handleAvatarUpdated as EventListener);
    };
  }, [user]);
  
  if (!isAuthenticated) {
    return null;
  }
  
  const handleSignOut = async () => {
    await signOut();
    toast.success("Signed out successfully");
  };
  
  const getInitials = () => {
    if (!user?.email) return "U";
    return user.email.substring(0, 2).toUpperCase();
  };

  const handleUpgradeToPremium = () => {
    navigate('/premium');
  };
  
  const handleImageLoad = () => {
    console.log("Avatar image loaded successfully");
    setAvatarLoaded(true);
    setAvatarError(false);
  };
  
  const handleImageError = () => {
    console.error("Error loading avatar image from URL:", avatarUrl);
    setAvatarLoaded(false);
    setAvatarError(true);
  };
  
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-10 w-10 rounded-full">
          <Avatar className="h-10 w-10">
            {avatarUrl && !avatarError ? (
              <AvatarImage 
                src={avatarUrl} 
                alt="User avatar"
                onLoad={handleImageLoad}
                onError={handleImageError}
              />
            ) : (
              <AvatarFallback className="bg-mathprimary text-white">
                {getInitials()}
              </AvatarFallback>
            )}
          </Avatar>
          {userIsPremium && (
            <div className="absolute -top-1 -right-1 bg-yellow-500 text-white rounded-full p-0.5">
              <Crown size={12} />
            </div>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <DropdownMenuLabel>My Account</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link to="/profile" className="flex w-full cursor-pointer items-center">
            <User className="mr-2 h-4 w-4" />
            <span>Profile</span>
          </Link>
        </DropdownMenuItem>
        
        {!userIsPremium && (
          <DropdownMenuItem onClick={handleUpgradeToPremium} className="flex cursor-pointer items-center">
            <Crown className="mr-2 h-4 w-4 text-yellow-500" />
            <span>Upgrade to Premium</span>
          </DropdownMenuItem>
        )}
        
        <DropdownMenuItem asChild>
          <Link to="/support" className="flex w-full cursor-pointer items-center">
            <LifeBuoy className="mr-2 h-4 w-4" />
            <span>Support</span>
          </Link>
        </DropdownMenuItem>
        
        <DropdownMenuSeparator />
        <DropdownMenuItem 
          className="flex cursor-pointer items-center text-red-600 focus:text-red-500"
          onClick={handleSignOut}
        >
          <LogOut className="mr-2 h-4 w-4" />
          <span>Sign out</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default UserProfileMenu;
