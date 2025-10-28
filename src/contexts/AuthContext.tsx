
import { createContext, useContext, useEffect, useState } from 'react';
import { Session, User } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';

type AuthContextType = {
  user: User | null;
  session: Session | null;
  isLoading: boolean;
  signUp: (email: string, password: string, metadata?: { full_name?: string; username?: string }) => Promise<{ error: any | null }>;
  signIn: (email: string, password: string) => Promise<{ error: any | null }>;
  signOut: () => Promise<void>;
  isAuthenticated: boolean;
  isPremium: boolean;
  premiumExpiresAt: string | null;
  refreshPremiumStatus: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isPremium, setIsPremium] = useState(false);
  const [premiumExpiresAt, setPremiumExpiresAt] = useState<string | null>(null);

  const refreshPremiumStatus = async () => {
    if (!user) {
      setIsPremium(false);
      setPremiumExpiresAt(null);
      // For demo, save to localStorage so PaperCard component can access it
      localStorage.setItem("userIsPremium", "false");
      return;
    }

    try {
      const { data: premiumResponse, error } = await supabase.functions.invoke("check-premium");
      
      if (error) {
        console.error("Error checking premium status:", error);
        setIsPremium(false);
        return;
      }

      setIsPremium(premiumResponse.isPremium);
      setPremiumExpiresAt(premiumResponse.expiresAt);

      // For demo, save to localStorage so PaperCard component can access it
      localStorage.setItem("userIsPremium", premiumResponse.isPremium ? "true" : "false");
    } catch (error) {
      console.error("Failed to check premium status:", error);
      setIsPremium(false);
    }
  };

  useEffect(() => {
    // Set up auth state listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, currentSession) => {
        setSession(currentSession);
        setUser(currentSession?.user ?? null);
        setIsLoading(false);
        
        // Check premium status after auth state changes
        setTimeout(() => {
          if (currentSession?.user) {
            refreshPremiumStatus();
          } else {
            setIsPremium(false);
            setPremiumExpiresAt(null);
            localStorage.setItem("userIsPremium", "false");
          }
        }, 0);
      }
    );

    // THEN check for existing session
    supabase.auth.getSession().then(({ data: { session: currentSession } }) => {
      setSession(currentSession);
      setUser(currentSession?.user ?? null);
      setIsLoading(false);
      
      // Check premium status for existing session
      setTimeout(() => {
        if (currentSession?.user) {
          refreshPremiumStatus();
        }
      }, 0);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signUp = async (
    email: string,
    password: string,
    metadata?: { full_name?: string; username?: string }
  ) => {
    try {
      const redirectUrl = `${window.location.origin}/`;
      
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: redirectUrl,
          data: metadata
        }
      });
      return { error };
    } catch (error) {
      return { error };
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      return { error };
    } catch (error) {
      return { error };
    }
  };

  const signOut = async () => {
    await supabase.auth.signOut();
  };

  const value = {
    user,
    session,
    isLoading,
    signUp,
    signIn,
    signOut,
    isAuthenticated: !!user,
    isPremium,
    premiumExpiresAt,
    refreshPremiumStatus,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
