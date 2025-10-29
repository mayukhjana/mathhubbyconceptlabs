
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
import { useIsMobile } from "@/hooks/use-mobile";

const UserProfileMenu = () => {
  const { user, signOut, isAuthenticated, isPremium } = useAuth();
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [profileData, setProfileData] = useState<any>(null);
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  
  useEffect(() => {
    const fetchProfileData = async () => {
      if (!user?.id) return;
      
      try {
        const { data } = await supabase
          .from('profiles')
          .select('avatar_url, full_name, username, school_name, board, class')
          .eq('id', user.id)
          .single();
        
        if (data) {
          setProfileData(data);
          if (data.avatar_url) {
            setAvatarUrl(data.avatar_url);
          }
        }
      } catch (error) {
        console.error('Error fetching profile:', error);
      }
    };

    fetchProfileData();

    // Listen for avatar updates
    const handleAvatarUpdated = (event: CustomEvent) => {
      if (event.detail?.url) {
        setAvatarUrl(event.detail.url);
      }
    };
    
    window.addEventListener('avatar-updated', handleAvatarUpdated as EventListener);
    
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

  // Calculate profile completion
  const calculateCompletion = () => {
    if (!profileData) return 0;
    const fields = [
      avatarUrl, 
      profileData.full_name, 
      profileData.username, 
      profileData.school_name, 
      profileData.board, 
      profileData.class
    ];
    const filledFields = fields.filter(field => field && field.trim && field.trim() !== '').length;
    return Math.round((filledFields / fields.length) * 100);
  };

  const completionPercentage = calculateCompletion();
  const radius = 20;
  const strokeWidth = 2;
  const normalizedRadius = radius - strokeWidth * 2;
  const circumference = normalizedRadius * 2 * Math.PI;
  const strokeDashoffset = circumference - (completionPercentage / 100) * circumference;
  
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-10 w-10 rounded-full p-0">
          <div className="relative inline-flex items-center justify-center">
            <svg
              height={radius * 2}
              width={radius * 2}
              className="absolute"
            >
              <circle
                stroke="hsl(var(--muted))"
                fill="transparent"
                strokeWidth={strokeWidth}
                r={normalizedRadius}
                cx={radius}
                cy={radius}
              />
              <circle
                stroke="hsl(var(--primary))"
                fill="transparent"
                strokeWidth={strokeWidth}
                strokeDasharray={circumference + ' ' + circumference}
                style={{ strokeDashoffset, transition: 'stroke-dashoffset 0.5s ease' }}
                strokeLinecap="round"
                r={normalizedRadius}
                cx={radius}
                cy={radius}
                transform={`rotate(-90 ${radius} ${radius})`}
              />
            </svg>
            <Avatar className="h-8 w-8">
              <AvatarImage src={avatarUrl || undefined} alt={profileData?.full_name || 'User'} />
              <AvatarFallback className="bg-mathprimary text-white text-xs">
                {getInitials()}
              </AvatarFallback>
            </Avatar>
          </div>
          {isPremium && (
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
            <span>Profile ({completionPercentage}% complete)</span>
          </Link>
        </DropdownMenuItem>
        
        {!isPremium && (
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
