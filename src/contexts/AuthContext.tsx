
import { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Session, User } from '@supabase/supabase-js';

interface AuthContextType {
  isLoading: boolean;
  isAuthenticated: boolean;
  user: User | null;
  session: Session | null;
  isPremium: boolean;
  premiumExpiresAt: string | null;
  signIn: (email: string, password: string) => Promise<{
    error: any;
  }>;
  signUp: (email: string, password: string, metadata?: { [key: string]: any }) => Promise<{
    error: any;
  }>;
  signOut: () => Promise<void>;
  refreshPremiumStatus: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  isLoading: true,
  isAuthenticated: false,
  user: null,
  session: null,
  isPremium: false,
  premiumExpiresAt: null,
  signIn: async () => ({ error: null }),
  signUp: async () => ({ error: null }),
  signOut: async () => {},
  refreshPremiumStatus: async () => {},
});

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [isLoading, setIsLoading] = useState(true);
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [isPremium, setIsPremium] = useState(false);
  const [premiumExpiresAt, setPremiumExpiresAt] = useState<string | null>(null);

  // Check if the user has a premium subscription
  const checkPremiumStatus = async (sessionToken: string | undefined) => {
    if (!sessionToken) {
      setIsPremium(false);
      setPremiumExpiresAt(null);
      return;
    }
    
    try {
      const { data, error } = await supabase.functions.invoke('check-premium');
      
      if (error) {
        console.error('Error checking premium status:', error);
        setIsPremium(false);
        setPremiumExpiresAt(null);
        return;
      }
      
      setIsPremium(data.isPremium || false);
      setPremiumExpiresAt(data.expiresAt || null);
      
      console.log('Premium status:', data.isPremium ? 'Active' : 'Inactive');
      if (data.isPremium && data.expiresAt) {
        console.log('Premium expires at:', new Date(data.expiresAt).toLocaleString());
      }
    } catch (err) {
      console.error('Failed to check premium status:', err);
      setIsPremium(false);
      setPremiumExpiresAt(null);
    }
  };
  
  // Manually refresh premium status (e.g., after purchase)
  const refreshPremiumStatus = async () => {
    if (!session?.access_token) return;
    
    try {
      await checkPremiumStatus(session.access_token);
    } catch (err) {
      console.error('Failed to refresh premium status:', err);
    }
  };

  useEffect(() => {
    // Set up auth state listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, currentSession) => {
        setSession(currentSession);
        setUser(currentSession?.user ?? null);
        
        // Check premium status when session changes
        if (currentSession?.access_token) {
          // Use setTimeout to avoid potential deadlock with the auth state listener
          setTimeout(() => {
            checkPremiumStatus(currentSession.access_token);
          }, 0);
        } else {
          setIsPremium(false);
          setPremiumExpiresAt(null);
        }
        
        setIsLoading(false);
      }
    );

    // THEN check for existing session
    supabase.auth.getSession().then(({ data: { session: currentSession } }) => {
      setSession(currentSession);
      setUser(currentSession?.user ?? null);
      
      // Check premium status for existing session
      if (currentSession?.access_token) {
        checkPremiumStatus(currentSession.access_token);
      }
      
      setIsLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const signIn = async (email: string, password: string) => {
    try {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      return { error };
    } catch (error) {
      return { error };
    }
  };
  
  const signUp = async (email: string, password: string, metadata?: { [key: string]: any }) => {
    try {
      const { error } = await supabase.auth.signUp({ 
        email, 
        password,
        options: {
          data: metadata
        }
      });
      return { error };
    } catch (error) {
      return { error };
    }
  };

  const signOut = async () => {
    try {
      await supabase.auth.signOut();
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        isLoading,
        isAuthenticated: !!user,
        user,
        session,
        isPremium,
        premiumExpiresAt,
        signIn,
        signUp,
        signOut,
        refreshPremiumStatus,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
