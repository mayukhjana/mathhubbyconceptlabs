
import { ReactNode, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

type AuthGuardProps = {
  children: ReactNode;
  redirectTo?: string;
  requirePremium?: boolean;
};

export const AuthGuard = ({ 
  children, 
  redirectTo = '/auth',
  requirePremium = false
}: AuthGuardProps) => {
  const { isAuthenticated, isLoading, isPremium } = useAuth();
  const navigate = useNavigate();
  
  useEffect(() => {
    if (!isLoading) {
      if (!isAuthenticated) {
        navigate(redirectTo);
      } else if (requirePremium && !isPremium) {
        navigate('/premium');
      }
    }
  }, [isAuthenticated, isLoading, navigate, redirectTo, requirePremium, isPremium]);

  if (isLoading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-mathprimary"></div>
      </div>
    );
  }
  
  if (requirePremium && !isPremium) {
    return null;
  }

  return isAuthenticated ? <>{children}</> : null;
};
