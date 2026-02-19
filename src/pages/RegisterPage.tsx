import { useState } from 'react';
import { Sparkles, Eye, EyeOff, Mail, Lock, User, Calendar } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { getZodiacSign } from '../utils/zodiac';
import { Page } from '../types';
import { useAuth } from '../contexts/AuthContext';

interface RegisterPageProps {
  onNavigate: (page: Page) => void;
}

export default function RegisterPage({ onNavigate }: RegisterPageProps) {
  const { refreshProfile } = useAuth();
  const [fullName, setFullName] = useState('');
  const [gender, setGender] = useState('');
  const [dob, setDob] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [info, setInfo] = useState('');

  const detectedSign = dob ? getZodiacSign(dob) : '';

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }

    setLoading(true);
    setError('');
    setInfo('');

    const zodiacSign = getZodiacSign(dob);

    const { data, error: authError } = await supabase.auth.signUp({
      email,
      password,
    });

    if (authError) {
      setError(authError.message);
      setLoading(false);
      return;
    }

    // Supabase may require email confirmation (default in hosted projects).
    // When confirmation is required, data.session is null even though data.user is set.
    // Without a session, the RLS policy on `profiles` would reject the INSERT.
    if (!data.session) {
      setInfo(
        'Account created! Please check your email to confirm your account, then sign in.'
      );
      setLoading(false);
      return;
    }

    if (data.user) {
      // Session is available — safe to insert the profile row.
      const { error: profileError } = await supabase.from('profiles').insert({
        id: data.user.id,
        full_name: fullName,
        gender,
        date_of_birth: dob,
        zodiac_sign: zodiacSign,
        role: 'user',
      });

      if (profileError) {
        setError(profileError.message);
        setLoading(false);
        return;
      }

      // onAuthStateChange fires on sign-up BEFORE the profile row exists,
      // so it would have stored profile=null. We must call refreshProfile()
      // here after a successful INSERT to push the real profile into context,
      // which then triggers App.tsx navigation to the dashboard.
      await refreshProfile();
    } else {
      setLoading(false);
    }
  }

  const inputClass =
    'w-full px-4 py-3 rounded-xl text-white placeholder-purple-500 outline-none text-sm';
  const inputStyle = {
    background: 'rgba(26,5,51,0.6)',
    border: '1px solid rgba(123,97,255,0.3)',
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-10 relative z-10">
      <div className="w-full max-w-lg">
        <div className="text-center mb-8">
          <div
            className="inline-flex items-center justify-center w-16 h-16 rounded-full mb-4"
            style={{
              background: 'radial-gradient(circle, #7B61FF, #2D1B69)',
              boxShadow: '0 0 30px rgba(123,97,255,0.4)',
            }}
          >
            <Sparkles size={28} className="text-cyan-300" />
          </div>
          <h1
            className="text-3xl font-bold text-white mb-1"
            style={{ fontFamily: 'Cinzel, serif' }}
          >
            Join AstroSoul
          </h1>
          <p className="text-purple-300 text-sm">Begin your cosmic journey today</p>
        </div>

        <div
          className="rounded-2xl p-8"
          style={{
            background:
              'linear-gradient(135deg, rgba(45,27,105,0.7), rgba(26,5,51,0.9))',
            border: '1px solid rgba(123,97,255,0.25)',
            boxShadow: '0 0 60px rgba(91,45,142,0.3)',
            backdropFilter: 'blur(12px)',
          }}
        >
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div
                className="p-3 rounded-lg text-red-300 text-sm"
                style={{
                  background: 'rgba(239,68,68,0.1)',
                  border: '1px solid rgba(239,68,68,0.25)',
                }}
              >
                {error}
              </div>
            )}

            {info && (
              <div
                className="p-3 rounded-lg text-cyan-300 text-sm"
                style={{
                  background: 'rgba(0,191,255,0.1)',
                  border: '1px solid rgba(0,191,255,0.3)',
                }}
              >
                {info}
              </div>
            )}

            <div>
              <label className="block text-purple-200 text-sm mb-2">Full Name</label>
              <div className="relative">
                <User
                  size={16}
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 text-purple-400"
                />
                <input
                  type="text"
                  value={fullName}
                  onChange={e => setFullName(e.target.value)}
                  required
                  placeholder="Your full name"
                  className={`${inputClass} pl-10`}
                  style={inputStyle}
                />
              </div>
            </div>

            <div>
              <label className="block text-purple-200 text-sm mb-2">Gender</label>
              <select
                value={gender}
                onChange={e => setGender(e.target.value)}
                required
                className={inputClass}
                style={{ ...inputStyle, WebkitAppearance: 'none' }}
              >
                <option value="" disabled>
                  Select gender
                </option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div>
              <label className="block text-purple-200 text-sm mb-2">Date of Birth</label>
              <div className="relative">
                <Calendar
                  size={16}
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 text-purple-400"
                />
                <input
                  type="date"
                  value={dob}
                  onChange={e => setDob(e.target.value)}
                  required
                  className={`${inputClass} pl-10`}
                  style={{ ...inputStyle, colorScheme: 'dark' }}
                />
              </div>
              {detectedSign && (
                <p className="mt-1.5 text-xs text-cyan-400 flex items-center gap-1">
                  <span>Detected zodiac sign:</span>
                  <span className="font-semibold">{detectedSign}</span>
                </p>
              )}
            </div>

            <div>
              <label className="block text-purple-200 text-sm mb-2">Email Address</label>
              <div className="relative">
                <Mail
                  size={16}
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 text-purple-400"
                />
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  required
                  placeholder="you@example.com"
                  className={`${inputClass} pl-10`}
                  style={inputStyle}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-purple-200 text-sm mb-2">Password</label>
                <div className="relative">
                  <Lock
                    size={16}
                    className="absolute left-3.5 top-1/2 -translate-y-1/2 text-purple-400"
                  />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    required
                    placeholder="••••••••"
                    className={`${inputClass} pl-10 pr-10`}
                    style={inputStyle}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-purple-400 hover:text-purple-200"
                  >
                    {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                  </button>
                </div>
              </div>
              <div>
                <label className="block text-purple-200 text-sm mb-2">Confirm</label>
                <div className="relative">
                  <Lock
                    size={16}
                    className="absolute left-3.5 top-1/2 -translate-y-1/2 text-purple-400"
                  />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={confirmPassword}
                    onChange={e => setConfirmPassword(e.target.value)}
                    required
                    placeholder="••••••••"
                    className={`${inputClass} pl-10`}
                    style={inputStyle}
                  />
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 rounded-xl text-white font-semibold transition-all hover:scale-105 disabled:opacity-60 mt-2"
              style={{
                background: 'linear-gradient(135deg, #5B2D8E, #2D1B69)',
                boxShadow: '0 0 20px rgba(91,45,142,0.4)',
                border: '1px solid rgba(123,97,255,0.4)',
              }}
            >
              {loading ? 'Creating Account...' : 'Create My Account'}
            </button>
          </form>

          <p className="text-center text-purple-400 text-sm mt-6">
            Already have an account?{' '}
            <button
              onClick={() => onNavigate('login')}
              className="text-cyan-400 hover:text-cyan-300 font-medium"
            >
              Sign in
            </button>
          </p>
        </div>

        <button
          onClick={() => onNavigate('landing')}
          className="block text-center text-purple-500 hover:text-purple-300 text-sm mt-4 mx-auto transition-colors"
        >
          Back to home
        </button>
      </div>
    </div>
  );
}