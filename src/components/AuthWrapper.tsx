
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { Lock } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

interface AuthWrapperProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
  requireAuth?: boolean;
  tooltipText?: string;
}

const AuthWrapper: React.FC<AuthWrapperProps> = ({ 
  children, 
  fallback, 
  requireAuth = true,
  tooltipText = "Please sign in to access this feature"
}) => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleUnauthorizedClick = () => {
    toast({
      title: "Authentication Required",
      description: tooltipText,
    });
    navigate('/auth');
  };

  if (!requireAuth || isAuthenticated) {
    return <>{children}</>;
  }

  if (fallback) {
    return <>{fallback}</>;
  }

  return (
    <Button 
      onClick={handleUnauthorizedClick} 
      variant="outline" 
      className="flex items-center gap-2"
    >
      <Lock size={16} />
      <span>Sign in required</span>
    </Button>
  );
};

export default AuthWrapper;
