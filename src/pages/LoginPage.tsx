import { useState } from 'react';
import { Sparkles, Eye, EyeOff, Mail, Lock, Shield } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { Page } from '../types';

interface LoginPageProps {
  onNavigate: (page: Page) => void;
}

export default function LoginPage({ onNavigate }: LoginPageProps) {
  const [mode, setMode]                 = useState<'user' | 'admin'>('user');
  const [email, setEmail]               = useState('');
  const [password, setPassword]         = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading]           = useState(false);
  const [error, setError]               = useState('');

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // ── 1. Sign in with Supabase Auth ──────────────────────────────────
      const { data, error: authError } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      });

      if (authError) {
        setError(authError.message);
        return;
      }

      if (!data.session || !data.user) {
        setError('Login failed — no session returned. Please try again.');
        return;
      }

      // ── 2. Fetch this user's profile to read their role ─────────────────
      //  We MUST do this synchronously here before navigating.
      //  We cannot rely on AuthContext because it fetches asynchronously
      //  and may not be ready yet when we call onNavigate().
      const { data: prof, error: profErr } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', data.user.id)
        .maybeSingle();

      if (profErr || !prof) {
        // Profile missing or DB error — sign out and show clear message
        await supabase.auth.signOut();
        setError(
          profErr
            ? `Could not load profile: ${profErr.message}`
            : 'No profile found for this account. Please register first.'
        );
        return;
      }

      const role = prof.role as string;

      // ── 3. Enforce mode restriction ─────────────────────────────────────
      if (mode === 'admin' && role !== 'admin') {
        await supabase.auth.signOut();
        setError('Access denied — this account does not have admin privileges.');
        return;
      }

      // ── 4. Navigate based on ACTUAL role ────────────────────────────────
      //  This is the definitive fix: we never blindly navigate to 'dashboard'.
      //  We always route to the correct destination based on the DB role.
      onNavigate(role === 'admin' ? 'admin-dashboard' : 'dashboard');

    } catch (err) {
      setError('An unexpected error occurred. Please try again.');
      console.error('Login error:', err);
    } finally {
      setLoading(false);
    }
  }

  const isAdmin = mode === 'admin';

  // ── Theme vars ────────────────────────────────────────────────────────────
  const accent      = isAdmin ? '#00BFFF' : '#7B61FF';
  const accent2     = isAdmin ? '#0369a1' : '#2D1B69';
  const textLight   = isAdmin ? '#7dd3fc' : '#c4b5fd';
  const inputBg     = isAdmin ? 'rgba(0,15,35,0.8)' : 'rgba(26,5,51,0.6)';
  const inputBorder = isAdmin ? 'rgba(0,191,255,0.35)' : 'rgba(123,97,255,0.35)';

  return (
    <div className="min-h-screen flex items-center justify-center px-4 relative z-10">
      <div className="w-full max-w-md">

        {/* ── LOGO ─────────────────────────────────────────────────────── */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full mb-4"
            style={{
              background: `radial-gradient(circle, ${accent}, ${accent2})`,
              boxShadow: `0 0 35px ${accent}55`,
              transition: 'all 0.3s ease',
            }}>
            {isAdmin
              ? <Shield size={28} className="text-white" />
              : <Sparkles size={28} className="text-cyan-300" />}
          </div>
          <h1 className="text-3xl font-bold text-white mb-1" style={{ fontFamily: 'Cinzel, serif' }}>
            {isAdmin ? 'Admin Portal' : 'Welcome Back'}
          </h1>
          <p className="text-sm" style={{ color: textLight }}>
            {isAdmin ? 'AstroSoul administration access' : 'Sign in to your cosmic portal'}
          </p>
        </div>

        {/* ── MODE TOGGLE ──────────────────────────────────────────────── */}
        <div className="flex rounded-xl overflow-hidden mb-6"
          style={{ border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(0,0,0,0.3)' }}>
          {(['user', 'admin'] as const).map(m => (
            <button key={m}
              onClick={() => { setMode(m); setError(''); setEmail(''); setPassword(''); }}
              className="flex-1 py-2.5 text-sm font-medium transition-all flex items-center justify-center gap-1.5"
              style={{
                background: mode === m
                  ? (m === 'admin' ? 'rgba(0,191,255,0.2)' : 'rgba(123,97,255,0.3)')
                  : 'transparent',
                color: mode === m
                  ? (m === 'admin' ? '#7dd3fc' : '#e0d7ff')
                  : 'rgba(255,255,255,0.3)',
              }}>
              {m === 'admin' ? <Shield size={13} /> : <Sparkles size={13} />}
              {m === 'user' ? 'User Login' : 'Admin Login'}
            </button>
          ))}
        </div>

        {/* ── CARD ─────────────────────────────────────────────────────── */}
        <div className="rounded-2xl p-8" style={{
          background: isAdmin
            ? 'linear-gradient(135deg, rgba(5,15,35,0.97), rgba(0,30,70,0.9))'
            : 'linear-gradient(135deg, rgba(45,27,105,0.75), rgba(26,5,51,0.92))',
          border: `1px solid ${isAdmin ? 'rgba(0,191,255,0.22)' : 'rgba(123,97,255,0.22)'}`,
          boxShadow: `0 0 60px ${isAdmin ? 'rgba(0,100,180,0.3)' : 'rgba(91,45,142,0.3)'}`,
          backdropFilter: 'blur(14px)',
          transition: 'all 0.3s ease',
        }}>

          {/* Admin info box */}
          {isAdmin && (
            <div className="mb-5 p-3.5 rounded-xl flex items-start gap-3"
              style={{ background: 'rgba(0,191,255,0.07)', border: '1px solid rgba(0,191,255,0.18)' }}>
              <Shield size={15} className="text-cyan-400 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-cyan-300 text-xs font-semibold">Restricted Access</p>
                <p className="text-slate-400 text-xs mt-0.5">
                  Don't have an admin account?{' '}
                  <button
                    type="button"
                    onClick={() => onNavigate('admin-register')}
                    className="text-cyan-400 underline hover:text-white transition-colors font-medium">
                    Register as Admin
                  </button>
                </p>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">

            {/* Error */}
            {error && (
              <div className="p-3 rounded-xl text-sm"
                style={{ background: 'rgba(239,68,68,0.12)', border: '1px solid rgba(239,68,68,0.28)', color: '#fca5a5' }}>
                ⚠️ {error}
              </div>
            )}

            {/* Email */}
            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: textLight }}>
                Email Address
              </label>
              <div className="relative">
                <Mail size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2" style={{ color: accent }} />
                <input
                  type="email" value={email} onChange={e => setEmail(e.target.value)} required
                  placeholder={isAdmin ? 'admin@example.com' : 'you@example.com'}
                  className="w-full pl-10 pr-4 py-3 rounded-xl text-white placeholder-slate-600 outline-none text-sm"
                  style={{ background: inputBg, border: `1px solid ${inputBorder}` }}
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: textLight }}>
                Password
              </label>
              <div className="relative">
                <Lock size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2" style={{ color: accent }} />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password} onChange={e => setPassword(e.target.value)} required
                  placeholder="••••••••"
                  className="w-full pl-10 pr-10 py-3 rounded-xl text-white placeholder-slate-600 outline-none text-sm"
                  style={{ background: inputBg, border: `1px solid ${inputBorder}` }}
                />
                <button type="button" onClick={() => setShowPassword(s => !s)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 transition-opacity hover:opacity-100 opacity-60"
                  style={{ color: accent }}>
                  {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit" disabled={loading}
              className="w-full py-3.5 rounded-xl text-white font-semibold text-sm transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
              style={{
                background: `linear-gradient(135deg, ${accent}cc, ${accent2})`,
                boxShadow: `0 4px 20px ${accent}33`,
                border: `1px solid ${accent}44`,
              }}>
              {loading
                ? (
                  <span className="flex items-center justify-center gap-2">
                    <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                    Signing in...
                  </span>
                )
                : isAdmin ? '🔐 Sign In as Admin' : 'Sign In'}
            </button>
          </form>

          {!isAdmin && (
            <p className="text-center text-sm mt-6" style={{ color: 'rgba(168,139,250,0.6)' }}>
              Don't have an account?{' '}
              <button onClick={() => onNavigate('register')}
                className="text-cyan-400 hover:text-cyan-200 font-semibold transition-colors">
                Create one
              </button>
            </p>
          )}
        </div>

        <button onClick={() => onNavigate('landing')}
          className="block text-center text-xs mt-5 mx-auto transition-colors"
          style={{ color: 'rgba(255,255,255,0.18)' }}
          onMouseEnter={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.55)')}
          onMouseLeave={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.18)')}>
          ← Back to home
        </button>
      </div>
    </div>
  );
}