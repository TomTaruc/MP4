import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { User } from '@supabase/supabase-js';
import { supabase } from '../lib/supabase';
import { Profile } from '../types';

interface AuthContextType {
  user: User | null;
  profile: Profile | null;
  loading: boolean;
  signOut: () => Promise<void>;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  profile: null,
  loading: true,
  signOut: async () => {},
  refreshProfile: async () => {},
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  // Wraps any promise with a timeout so a hanging DB/network call
  // can never freeze the UI indefinitely.
  function withTimeout<T>(promise: Promise<T>, ms: number): Promise<T | null> {
    return Promise.race([
      promise,
      new Promise<null>(resolve => setTimeout(() => resolve(null), ms)),
    ]);
  }

  async function fetchProfile(userId: string): Promise<Profile | null> {
    try {
      const result = await withTimeout(
        supabase
          .from('profiles')
          .select('*')
          .eq('id', userId)
          .maybeSingle(),
        5000 // give up after 5 seconds
      );

      if (!result) {
        console.warn('fetchProfile timed out for user:', userId);
        return null;
      }

      const { data, error } = result;
      if (error) {
        console.error('fetchProfile error:', error.message);
        return null;
      }

      return (data as Profile) ?? null;
    } catch (err) {
      console.error('fetchProfile exception:', err);
      return null;
    }
  }

  async function refreshProfile() {
    try {
      const result = await withTimeout(supabase.auth.getSession(), 5000);
      if (!result) return;

      const { data: { session } } = result;
      if (session?.user) {
        setUser(session.user);
        const profileData = await fetchProfile(session.user.id);
        setProfile(profileData);
      }
    } catch (err) {
      console.error('refreshProfile error:', err);
    }
  }

  useEffect(() => {
    let mounted = true;

    async function initializeAuth() {
      try {
        const result = await withTimeout(supabase.auth.getSession(), 8000);

        if (!mounted) return;

        if (!result) {
          console.warn('getSession() timed out — treating as no session');
          return; // finally will still run
        }

        const { data: { session }, error } = result;
        if (error) console.error('getSession error:', error.message);

        const currentUser = session?.user ?? null;
        setUser(currentUser);

        if (currentUser) {
          const profileData = await fetchProfile(currentUser.id);
          if (mounted) setProfile(profileData);
        }
      } catch (err) {
        console.error('Auth init error:', err);
      } finally {
        if (mounted) setLoading(false);
      }
    }

    initializeAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (!mounted) return;
        if (event === 'INITIAL_SESSION') return; // handled by initializeAuth

        const currentUser = session?.user ?? null;
        setUser(currentUser);

        if (currentUser) {
          const profileData = await fetchProfile(currentUser.id);
          if (mounted) setProfile(profileData);
        } else {
          if (mounted) setProfile(null);
        }
      }
    );

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  async function signOut() {
    await supabase.auth.signOut();
    setUser(null);
    setProfile(null);
  }

  return (
    <AuthContext.Provider value={{ user, profile, loading, signOut, refreshProfile }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}