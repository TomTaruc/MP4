import { useState } from 'react';
import { Shield, Eye, EyeOff, Mail, Lock, User, KeyRound, CheckCircle } from 'lucide-react';
// Updated paths to move up two levels from src/pages/admin/ to reach src/lib and src/types
import { supabase } from '../../lib/supabase';
import { Page } from '../../types';

// ─────────────────────────────────────────────────────────────────────────────
//  ADMIN SECRET CODE
//  Only people who know this code can register as admin.
//  Change it to anything you want. Keep it private.
// ─────────────────────────────────────────────────────────────────────────────
const ADMIN_SECRET = 'ASTROSOUL_ADMIN_2024';

interface Props { onNavigate: (page: Page) => void; }

export default function AdminRegisterPage({ onNavigate }: Props) {
  const [step, setStep] = useState<'verify' | 'form' | 'success'>('verify');

  // Step 1
  const [code, setCode]           = useState('');
  const [codeError, setCodeError] = useState('');
  const [showCode, setShowCode]   = useState(false);

  // Step 2
  const [fullName, setFullName]           = useState('');
  const [email, setEmail]                 = useState('');
  const [password, setPassword]           = useState('');
  const [confirm, setConfirm]             = useState('');
  const [showPass, setShowPass]           = useState(false);
  const [loading, setLoading]             = useState(false);
  const [error, setError]                 = useState('');

  // ── Step 1: Verify secret code ──────────────────────────────────────────
  function verifyCode(e: React.FormEvent) {
    e.preventDefault();
    if (code.trim() === ADMIN_SECRET) {
      setStep('form');
    } else {
      setCodeError('Wrong access code. Contact the system administrator.');
    }
  }

  // ── Step 2: Create admin account ────────────────────────────────────────
  async function handleRegister(e: React.FormEvent) {
    e.preventDefault();
    if (!fullName.trim())   { setError('Full name is required.'); return; }
    if (password.length < 6) { setError('Password must be at least 6 characters.'); return; }
    if (password !== confirm) { setError('Passwords do not match.'); return; }

    setLoading(true);
    setError('');

    try {
      // 1. Create Supabase auth account
      const { data: authData, error: authErr } = await supabase.auth.signUp({
        email: email.trim(),
        password,
      });

      if (authErr) { setError(authErr.message); return; }
      if (!authData.user) { setError('Registration failed — please try again.'); return; }

      // 2. Insert profile with role = 'admin'
      const { error: profErr } = await supabase.from('profiles').insert({
        id:            authData.user.id,
        full_name:     fullName.trim(),
        gender:        'Other',
        date_of_birth: null,
        zodiac_sign:   '',
        role:          'admin',
      });

      if (profErr) {
        setError(`Profile creation failed: ${profErr.message}`);
        await supabase.auth.signOut();
        return;
      }

      if (authData.session) {
        onNavigate('admin-dashboard');
      } else {
        setStep('success');
      }

    } catch (err) {
      setError('An unexpected error occurred. Please try again.');
      console.error('Admin register error:', err);
    } finally {
      setLoading(false);
    }
  }

  const card = {
    background: 'linear-gradient(135deg, rgba(5,15,35,0.97), rgba(0,30,70,0.92))',
    border: '1px solid rgba(0,191,255,0.22)',
    boxShadow: '0 0 60px rgba(0,100,180,0.3)',
    backdropFilter: 'blur(14px)',
  };
  const inp = {
    background: 'rgba(0,15,35,0.8)',
    border: '1px solid rgba(0,191,255,0.3)',
  };
  const iCls = 'w-full py-3 rounded-xl text-white placeholder-slate-600 outline-none text-sm';

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-10 relative z-10">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full mb-4"
            style={{ background: 'radial-gradient(circle, #00BFFF, #0369a1)', boxShadow: '0 0 35px rgba(0,191,255,0.5)' }}>
            <Shield size={28} className="text-white" />
          </div>
          <h1 className="text-3xl font-bold text-white mb-1" style={{ fontFamily: 'Cinzel, serif' }}>
            Admin Registration
          </h1>
          <p className="text-cyan-400/60 text-sm">Create a new AstroSoul admin account</p>
        </div>

        {step !== 'success' && (
          <div className="flex items-center mb-7">
            {[{ n: 1, label: 'Verify Code' }, { n: 2, label: 'Create Account' }].map(({ n, label }, i) => {
              const done   = n === 1 && step === 'form';
              const active = (n === 1 && step === 'verify') || (n === 2 && step === 'form');
              return (
                <div key={n} className="flex items-center flex-1">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0"
                      style={{
                        background: done ? '#22c55e' : active ? 'rgba(0,191,255,0.25)' : 'rgba(255,255,255,0.06)',
                        border: `1px solid ${done ? '#22c55e' : active ? 'rgba(0,191,255,0.5)' : 'rgba(255,255,255,0.1)'}`,
                        color: done ? 'white' : active ? '#7dd3fc' : 'rgba(255,255,255,0.2)',
                      }}>
                      {done ? '✓' : n}
                    </div>
                    <span className="text-xs whitespace-nowrap"
                      style={{ color: active ? '#7dd3fc' : 'rgba(255,255,255,0.25)' }}>
                      {label}
                    </span>
                  </div>
                  {i < 1 && (
                    <div className="flex-1 mx-3 h-px"
                      style={{ background: done ? 'rgba(34,197,94,0.5)' : 'rgba(255,255,255,0.08)' }} />
                  )}
                </div>
              );
            })}
          </div>
        )}

        <div className="rounded-2xl p-8" style={card}>
          {step === 'success' && (
            <div className="text-center py-4">
              <CheckCircle size={48} className="text-green-400 mx-auto mb-4" />
              <h2 className="text-white font-bold text-xl mb-2">Account Created!</h2>
              <p className="text-slate-300 text-sm mb-2">
                Your admin account has been created successfully.
              </p>
              <button onClick={() => onNavigate('login')}
                className="w-full py-3 rounded-xl text-white font-semibold text-sm"
                style={{
                  background: 'linear-gradient(135deg, #0284c7, #0a1628)',
                  border: '1px solid rgba(0,191,255,0.4)',
                }}>
                Go to Admin Login →
              </button>
            </div>
          )}

          {step === 'verify' && (
            <form onSubmit={verifyCode} className="space-y-5">
              <div className="text-center mb-1">
                <KeyRound size={28} className="text-cyan-400 mx-auto mb-2" />
                <p className="text-white font-semibold text-sm">Enter Admin Access Code</p>
              </div>

              {codeError && (
                <div className="p-3 rounded-xl text-sm"
                  style={{ background: 'rgba(239,68,68,0.12)', border: '1px solid rgba(239,68,68,0.28)', color: '#fca5a5' }}>
                  ⚠️ {codeError}
                </div>
              )}

              <div>
                <label className="block text-cyan-300/60 text-xs mb-2 uppercase tracking-wider font-medium">
                  Access Code
                </label>
                <div className="relative">
                  <KeyRound size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-cyan-500" />
                  <input
                    type={showCode ? 'text' : 'password'}
                    value={code} onChange={e => setCode(e.target.value)} required
                    placeholder="Enter secret admin code"
                    className={`${iCls} pl-10 pr-10 tracking-widest`} style={inp}
                  />
                  <button type="button" onClick={() => setShowCode(s => !s)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-cyan-500 opacity-60 hover:opacity-100">
                    {showCode ? <EyeOff size={15} /> : <Eye size={15} />}
                  </button>
                </div>
              </div>

              <button type="submit"
                className="w-full py-3.5 rounded-xl text-white font-semibold text-sm transition-all hover:scale-[1.02]"
                style={{
                  background: 'linear-gradient(135deg, #0284c7cc, #0a1628)',
                  boxShadow: '0 4px 20px rgba(0,191,255,0.25)',
                  border: '1px solid rgba(0,191,255,0.4)',
                }}>
                Verify Code →
              </button>
            </form>
          )}

          {step === 'form' && (
            <form onSubmit={handleRegister} className="space-y-4">
              {error && (
                <div className="p-3 rounded-xl text-sm"
                  style={{ background: 'rgba(239,68,68,0.12)', border: '1px solid rgba(239,68,68,0.28)', color: '#fca5a5' }}>
                  ⚠️ {error}
                </div>
              )}

              <div>
                <label className="block text-cyan-300/60 text-xs mb-1.5 uppercase tracking-wider font-medium">Full Name</label>
                <div className="relative">
                  <User size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-cyan-500" />
                  <input type="text" value={fullName} onChange={e => setFullName(e.target.value)} required
                    placeholder="Your full name"
                    className={`${iCls} pl-10 pr-4`} style={inp} />
                </div>
              </div>

              <div>
                <label className="block text-cyan-300/60 text-xs mb-1.5 uppercase tracking-wider font-medium">Email Address</label>
                <div className="relative">
                  <Mail size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-cyan-500" />
                  <input type="email" value={email} onChange={e => setEmail(e.target.value)} required
                    placeholder="admin@example.com"
                    className={`${iCls} pl-10 pr-4`} style={inp} />
                </div>
              </div>

              <div>
                <label className="block text-cyan-300/60 text-xs mb-1.5 uppercase tracking-wider font-medium">Password</label>
                <div className="relative">
                  <Lock size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-cyan-500" />
                  <input type={showPass ? 'text' : 'password'} value={password} onChange={e => setPassword(e.target.value)} required
                    placeholder="Min. 6 characters"
                    className={`${iCls} pl-10 pr-10`} style={inp} />
                  <button type="button" onClick={() => setShowPass(s => !s)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-cyan-500 opacity-60 hover:opacity-100">
                    {showPass ? <EyeOff size={14} /> : <Eye size={14} />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-cyan-300/60 text-xs mb-1.5 uppercase tracking-wider font-medium">Confirm Password</label>
                <div className="relative">
                  <Lock size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-cyan-500" />
                  <input type={showPass ? 'text' : 'password'} value={confirm} onChange={e => setConfirm(e.target.value)} required
                    placeholder="Repeat password"
                    className={`${iCls} pl-10 pr-4`} style={inp} />
                </div>
              </div>

              <button type="submit" disabled={loading}
                className="w-full py-3.5 rounded-xl text-white font-semibold text-sm transition-all hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 mt-1"
                style={{
                  background: 'linear-gradient(135deg, #0284c7cc, #0a1628)',
                  boxShadow: '0 4px 20px rgba(0,191,255,0.25)',
                  border: '1px solid rgba(0,191,255,0.4)',
                }}>
                {loading ? 'Creating Account...' : '🛡️ Create Admin Account'}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}