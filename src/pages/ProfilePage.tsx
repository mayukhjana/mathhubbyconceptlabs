
import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Pencil, Upload, User, Mail, Crown, Shield } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import LoadingAnimation from "@/components/LoadingAnimation";

const ProfilePage = () => {
  const { user, isAuthenticated, isLoading } = useAuth();
  const navigate = useNavigate();
  const [fullName, setFullName] = useState("");
  const [username, setUsername] = useState("");
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [userIsPremium, setUserIsPremium] = useState(false);
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      navigate("/auth");
    }
    
    const fetchProfile = async () => {
      if (!user) return;
      
      try {
        const { data, error } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", user.id)
          .single();
          
        if (error) throw error;
        
        if (data) {
          setFullName(data.full_name || "");
          setUsername(data.username || "");
          setAvatarUrl(data.avatar_url);
          
          // In real app, this would check subscription status
          // For now, we're just mocking premium status
          setUserIsPremium(localStorage.getItem("userIsPremium") === "true");
        }
      } catch (error) {
        console.error("Error fetching profile:", error);
        toast.error("Failed to load profile");
      }
    };
    
    fetchProfile();
  }, [user, isAuthenticated, isLoading, navigate]);
  
  const handleAvatarUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!event.target.files || event.target.files.length === 0) {
      return;
    }
    
    try {
      setUploading(true);
      const file = event.target.files[0];
      const fileExt = file.name.split('.').pop();
      const fileName = `${user!.id}-${Math.random().toString(36).substring(2)}.${fileExt}`;
      const filePath = `${fileName}`;
      
      // Upload image to Supabase Storage
      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: true
        });
        
      if (uploadError) throw uploadError;
      
      // Get public URL
      const { data } = await supabase.storage
        .from('avatars')
        .getPublicUrl(filePath);
      
      const publicUrl = data.publicUrl;
        
      // Update profile with new avatar URL
      const { error: updateError } = await supabase
        .from('profiles')
        .update({ avatar_url: publicUrl })
        .eq('id', user!.id);
        
      if (updateError) throw updateError;
      
      setAvatarUrl(publicUrl);
      toast.success("Avatar updated successfully");
      
    } catch (error: any) {
      console.error("Error uploading avatar:", error);
      toast.error(`Failed to upload avatar: ${error.message}`);
    } finally {
      setUploading(false);
    }
  };
  
  const handleUpdateProfile = async () => {
    if (!user) return;
    
    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          full_name: fullName,
          username: username,
        })
        .eq('id', user.id);
        
      if (error) throw error;
      
      toast.success("Profile updated successfully");
      setIsEditingProfile(false);
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error("Failed to update profile");
    }
  };
  
  // Always navigate to premium page when clicked
  const navigateToPremium = () => {
    navigate("/premium");
  };
  
  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-grow flex items-center justify-center">
          <LoadingAnimation />
        </div>
        <Footer />
      </div>
    );
  }
  
  const getInitials = () => {
    if (fullName) return fullName.substring(0, 2).toUpperCase();
    if (user?.email) return user.email.substring(0, 2).toUpperCase();
    return "U";
  };
  
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow py-8">
        <div className="container mx-auto px-4 max-w-4xl">
          <h1 className="text-3xl font-bold mb-8">User Profile</h1>
          
          <div className="grid gap-8 md:grid-cols-[1fr_2fr]">
            {/* Avatar Card */}
            <Card>
              <CardHeader>
                <CardTitle>Profile Picture</CardTitle>
                <CardDescription>Your avatar is visible to other users</CardDescription>
              </CardHeader>
              <CardContent className="flex flex-col items-center">
                <div className="relative mb-4">
                  <Avatar className="w-32 h-32 border-4 border-background">
                    <AvatarImage src={avatarUrl || undefined} />
                    <AvatarFallback className="bg-mathprimary text-white text-xl">
                      {getInitials()}
                    </AvatarFallback>
                  </Avatar>
                  
                  {userIsPremium && (
                    <div className="absolute -top-2 -right-2 bg-yellow-500 text-white p-1 rounded-full">
                      <Crown size={18} />
                    </div>
                  )}
                </div>
                
                <label htmlFor="avatar-upload" className="w-full">
                  <div className="flex items-center justify-center gap-2 border rounded-md px-3 py-2 hover:bg-muted cursor-pointer">
                    <Upload size={16} />
                    <span>{uploading ? "Uploading..." : "Upload new image"}</span>
                  </div>
                  <Input 
                    id="avatar-upload" 
                    type="file" 
                    accept="image/*" 
                    className="hidden" 
                    disabled={uploading} 
                    onChange={handleAvatarUpload}
                  />
                </label>
              </CardContent>
            </Card>
            
            {/* User Info Card */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>Account Information</CardTitle>
                  <CardDescription>Manage your account details</CardDescription>
                </div>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => setIsEditingProfile(!isEditingProfile)}
                >
                  <Pencil size={16} className="mr-2" />
                  {isEditingProfile ? "Cancel" : "Edit"}
                </Button>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Email</Label>
                  <div className="flex items-center gap-2 px-3 py-2 border rounded-md bg-muted/50">
                    <Mail size={16} className="text-muted-foreground" />
                    <span>{user?.email}</span>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="full-name">Full Name</Label>
                  {isEditingProfile ? (
                    <Input
                      id="full-name"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="Enter your full name"
                    />
                  ) : (
                    <div className="flex items-center gap-2 px-3 py-2 border rounded-md">
                      <User size={16} className="text-muted-foreground" />
                      <span>{fullName || "Not set"}</span>
                    </div>
                  )}
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="username">Username</Label>
                  {isEditingProfile ? (
                    <Input
                      id="username"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      placeholder="Choose a username"
                    />
                  ) : (
                    <div className="flex items-center gap-2 px-3 py-2 border rounded-md">
                      <User size={16} className="text-muted-foreground" />
                      <span>{username || "Not set"}</span>
                    </div>
                  )}
                </div>
                
                <div className="space-y-2">
                  <Label>Subscription Status</Label>
                  <div className="flex items-center justify-between px-3 py-2 border rounded-md">
                    <div className="flex items-center gap-2">
                      <Shield size={16} className={userIsPremium ? "text-yellow-500" : "text-muted-foreground"} />
                      <span>{userIsPremium ? "Premium Member" : "Free Account"}</span>
                    </div>
                    
                    <Button 
                      variant={userIsPremium ? "destructive" : "default"} 
                      size="sm"
                      onClick={navigateToPremium}
                    >
                      {userIsPremium ? "Manage Premium" : "Upgrade to Premium"}
                    </Button>
                  </div>
                </div>
              </CardContent>
              {isEditingProfile && (
                <CardFooter className="border-t pt-4 flex justify-end">
                  <Button onClick={handleUpdateProfile}>Save Changes</Button>
                </CardFooter>
              )}
            </Card>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default ProfilePage;
