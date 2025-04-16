
import { ReactNode, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

type AuthGuardProps = {
  children: ReactNode;
  redirectTo?: string;
  requirePremium?: boolean;
  requireAdmin?: boolean;
};

export const AuthGuard = ({ 
  children, 
  redirectTo = '/auth',
  requirePremium = false,
  requireAdmin = false
}: AuthGuardProps) => {
  const { isAuthenticated, isLoading, isPremium } = useAuth();
  const navigate = useNavigate();
  
  // Check if user has admin role
  const { data: isAdmin, isLoading: isCheckingAdmin } = useQuery({
    queryKey: ['isAdmin'],
    queryFn: async () => {
      const { data, error } = await supabase.rpc('has_role', { _role: 'admin' });
      if (error) {
        console.error('Error checking admin role:', error);
        return false;
      }
      return data || false;
    },
    enabled: isAuthenticated && requireAdmin,
  });

  useEffect(() => {
    if (!isLoading && !isCheckingAdmin) {
      if (!isAuthenticated) {
        navigate(redirectTo);
      } else if (requirePremium && !isPremium) {
        navigate('/premium');
      } else if (requireAdmin && !isAdmin) {
        navigate('/'); // Redirect non-admin users to home
      }
    }
  }, [isAuthenticated, isLoading, navigate, redirectTo, requirePremium, isPremium, requireAdmin, isAdmin, isCheckingAdmin]);

  if (isLoading || (requireAdmin && isCheckingAdmin)) {
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-mathprimary"></div>
      </div>
    );
  }
  
  if (requireAdmin && !isAdmin) {
    return null;
  }

  if (requirePremium && !isPremium) {
    return null;
  }

  return isAuthenticated ? <>{children}</> : null;
};
