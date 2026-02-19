import { useState } from 'react';
import { Sparkles, Eye, EyeOff, Mail, Lock } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { Page } from '../types';

interface LoginPageProps {
  onNavigate: (page: Page) => void;
}

export default function LoginPage({ onNavigate }: LoginPageProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const { data, error: authError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (authError) {
        setError(authError.message);
        return;
      }

      if (data.session) {
        // ✅ Navigate immediately — do NOT await any profile fetch here.
        // The profile loads asynchronously in AuthContext via onAuthStateChange.
        // Waiting for it was the cause of the infinite "Signing In..." freeze.
        onNavigate('dashboard');
      }
    } catch {
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 relative z-10">
      <div className="w-full max-w-md">
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
            Welcome Back
          </h1>
          <p className="text-purple-300 text-sm">Sign in to your cosmic portal</p>
        </div>

        <div
          className="rounded-2xl p-8"
          style={{
            background: 'linear-gradient(135deg, rgba(45,27,105,0.7), rgba(26,5,51,0.9))',
            border: '1px solid rgba(123,97,255,0.25)',
            boxShadow: '0 0 60px rgba(91,45,142,0.3)',
            backdropFilter: 'blur(12px)',
          }}
        >
          <form onSubmit={handleSubmit} className="space-y-5">
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

            <div>
              <label className="block text-purple-200 text-sm mb-2">Email Address</label>
              <div className="relative">
                <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-purple-400" />
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  required
                  placeholder="you@example.com"
                  className="w-full pl-10 pr-4 py-3 rounded-xl text-white placeholder-purple-500 outline-none focus:ring-2 text-sm"
                  style={{
                    background: 'rgba(26,5,51,0.6)',
                    border: '1px solid rgba(123,97,255,0.3)',
                  }}
                />
              </div>
            </div>

            <div>
              <label className="block text-purple-200 text-sm mb-2">Password</label>
              <div className="relative">
                <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-purple-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  required
                  placeholder="••••••••"
                  className="w-full pl-10 pr-10 py-3 rounded-xl text-white placeholder-purple-500 outline-none focus:ring-2 text-sm"
                  style={{
                    background: 'rgba(26,5,51,0.6)',
                    border: '1px solid rgba(123,97,255,0.3)',
                  }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-purple-400 hover:text-purple-200"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 rounded-xl text-white font-semibold transition-all hover:scale-105 disabled:opacity-60 disabled:cursor-not-allowed"
              style={{
                background: 'linear-gradient(135deg, #5B2D8E, #2D1B69)',
                boxShadow: '0 0 20px rgba(91,45,142,0.4)',
                border: '1px solid rgba(123,97,255,0.4)',
              }}
            >
              {loading ? 'Signing In...' : 'Sign In'}
            </button>
          </form>

          <p className="text-center text-purple-400 text-sm mt-6">
            Don't have an account?{' '}
            <button
              onClick={() => onNavigate('register')}
              className="text-cyan-400 hover:text-cyan-300 font-medium transition-colors"
            >
              Create one
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