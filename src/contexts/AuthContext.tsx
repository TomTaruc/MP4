import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { User } from '@supabase/supabase-js';
import { supabase } from '../lib/supabase';
import { Profile } from '../types';
import { getZodiacSign } from '../utils/zodiac';

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
  const [user, setUser]       = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  function withTimeout<T>(promise: Promise<T>, ms: number): Promise<T | null> {
    return Promise.race([
      promise,
      new Promise<null>(resolve => setTimeout(() => resolve(null), ms)),
    ]);
  }

  async function fetchProfile(userId: string): Promise<Profile | null> {
    try {
      const result = await withTimeout(
        supabase.from('profiles').select('*').eq('id', userId).maybeSingle(),
        5000
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
      if (!data) return null;

      const raw = data as Profile;

      // ── AUTO-CORRECT zodiac_sign from date_of_birth ──────────────────────
      // The DB may have a stale or wrong zodiac_sign (e.g. 'Aries' from a bug).
      // Always recalculate from date_of_birth — it is the source of truth.
      if (raw.date_of_birth) {
        const correctSign = getZodiacSign(raw.date_of_birth);
        if (correctSign && correctSign !== raw.zodiac_sign) {
          console.info(
            `[AuthContext] Correcting zodiac_sign "${raw.zodiac_sign}" → "${correctSign}" for user ${userId}`
          );
          // Persist correction to DB silently in background
          supabase
            .from('profiles')
            .update({ zodiac_sign: correctSign })
            .eq('id', userId)
            .then(({ error: updateErr }) => {
              if (updateErr) console.error('zodiac_sign update error:', updateErr.message);
            });
          // Return corrected profile immediately — don't wait for DB write
          return { ...raw, zodiac_sign: correctSign };
        }
      }

      return raw;
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
          return;
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
        if (event === 'INITIAL_SESSION') return;

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