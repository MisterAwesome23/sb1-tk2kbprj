import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, AuthChangeEvent, Session } from '@supabase/supabase-js';
import { supabase } from '../lib/supabase';
import { Profile } from '../types';
import { toast } from 'react-toastify';

interface AuthContextType {
  user: User | null;
  profile: Profile | null;
  signOut: () => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  refreshProfile: () => Promise<void>;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        fetchProfile(session.user.id);
      } else {
        setLoading(false);
      }
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      handleAuthChange(event, session);
    });

    return () => subscription.unsubscribe();
  }, []);

  async function handleAuthChange(event: AuthChangeEvent, session: Session | null) {
    setUser(session?.user ?? null);
    
    if (session?.user) {
      await fetchProfile(session.user.id);
      
      // Handle new sign-ups
      if (event === 'SIGNED_IN') {
        const { data } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', session.user.id)
          .single();
          
        if (!data) {
          // New user needs to complete profile
          toast.info('Please complete your profile to continue');
        }
      }
    } else {
      setProfile(null);
      setLoading(false);
    }
  }

  async function fetchProfile(userId: string) {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();
      
      if (error) throw error;
      
      if (data) {
        setProfile(data as Profile);
      } else {
        // If profile doesn't exist but user does, create a default profile
        const { data: userData } = await supabase.auth.getUser();
        if (userData.user) {
          const { error: insertError } = await supabase
            .from('profiles')
            .insert({
              id: userData.user.id,
              username: userData.user.email?.split('@')[0] || 'user',
              role: 'employee',
              email: userData.user.email
            });
          
          if (insertError) throw insertError;
          
          // Fetch the newly created profile
          const { data: newProfile } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', userData.user.id)
            .single();
            
          if (newProfile) {
            setProfile(newProfile as Profile);
          }
        }
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
    } finally {
      setLoading(false);
    }
  }

  async function refreshProfile() {
    if (user) {
      await fetchProfile(user.id);
    }
  }

  async function signOut() {
    await supabase.auth.signOut();
    setUser(null);
    setProfile(null);
  }

  async function signInWithGoogle() {
    try {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
          queryParams: {
            access_type: 'offline',
            prompt: 'consent'
          }
        }
      });

      if (error) {
        console.error('Google sign in error:', error);
        toast.error(error.message);
        throw error;
      }
      
      // If we have a URL, redirect to it
      if (data?.url) {
        window.location.href = data.url;
      }
    } catch (error) {
      console.error('Google sign in error:', error);
      toast.error('Failed to connect to Google. Please try again later.');
    }
  }

  return (
    <AuthContext.Provider value={{ 
      user, 
      profile, 
      signOut, 
      signInWithGoogle,
      refreshProfile, 
      loading 
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}