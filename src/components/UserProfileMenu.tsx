
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
  const navigate = useNavigate();
  
  useEffect(() => {
    // In a real app, this would fetch premium status from a subscription service
    // For demo, we're using localStorage
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
          console.log("Avatar URL from database:", data.avatar_url);
          setAvatarUrl(data.avatar_url);
        } else {
          console.log("No avatar URL found in profile data:", data);
        }
      } catch (error) {
        console.error('Error fetching user avatar:', error);
      }
    };
    
    fetchUserAvatar();
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
    setAvatarLoaded(true);
  };
  
  const handleImageError = () => {
    console.error("Error loading avatar image from URL:", avatarUrl);
    setAvatarLoaded(false);
  };
  
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-10 w-10 rounded-full">
          <Avatar className="h-10 w-10">
            {avatarUrl && (
              <AvatarImage 
                src={avatarUrl} 
                alt="User avatar"
                onLoad={handleImageLoad}
                onError={handleImageError}
              />
            )}
            <AvatarFallback className="bg-mathprimary text-white">
              {getInitials()}
            </AvatarFallback>
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
