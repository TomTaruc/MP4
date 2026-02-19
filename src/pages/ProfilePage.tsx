import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';
import { getZodiacSign } from '../utils/zodiac';

const ZODIAC_SYMBOLS: Record<string, string> = {
  Aries: '♈', Taurus: '♉', Gemini: '♊', Cancer: '♋', Leo: '♌', Virgo: '♍',
  Libra: '♎', Scorpio: '♏', Sagittarius: '♐', Capricorn: '♑', Aquarius: '♒', Pisces: '♓',
};
const ELEMENT: Record<string, string> = {
  Aries: 'Fire', Leo: 'Fire', Sagittarius: 'Fire',
  Taurus: 'Earth', Virgo: 'Earth', Capricorn: 'Earth',
  Gemini: 'Air', Libra: 'Air', Aquarius: 'Air',
  Cancer: 'Water', Scorpio: 'Water', Pisces: 'Water',
};
const ELEMENT_COLOR: Record<string, string> = { Fire: '#FF6B35', Earth: '#8B7355', Air: '#87CEEB', Water: '#4169E1' };

const AVATAR_GLYPHS = ['✦', '☽', '☆', '⊕', '◈', '⟡', '✧', '⊛'];
const AVATAR_COLORS = ['#7B61FF', '#FF6B9D', '#06B6D4', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899'];

const cardStyle = {
  background: 'linear-gradient(135deg, rgba(45,27,105,0.6), rgba(10,1,24,0.8))',
  border: '1px solid rgba(123,97,255,0.2)',
};

export default function ProfilePage() {
  const { profile, user, refreshProfile } = useAuth();

  // ── Edit state — initialised from profile ──────────────────────────────
  const [editMode, setEditMode]     = useState(false);
  const [fullName, setFullName]     = useState(profile?.full_name || '');
  const [dob, setDob]               = useState(profile?.date_of_birth || '');
  const [gender, setGender]         = useState(profile?.gender || '');
  const [saving, setSaving]         = useState(false);
  const [saveMsg, setSaveMsg]       = useState('');

  // Re-sync local state if profile loads after mount
  useEffect(() => {
    if (profile) {
      setFullName(profile.full_name || '');
      setDob(profile.date_of_birth || '');
      setGender(profile.gender || '');
    }
  }, [profile]);

  // Auto-compute zodiac from whichever DOB is currently in state
  const computedSign = dob ? getZodiacSign(dob) : (profile?.zodiac_sign || '');

  // ── Password state ─────────────────────────────────────────────────────
  const [pwMode, setPwMode]         = useState(false);
  const [currentPw, setCurrentPw]   = useState('');
  const [newPw, setNewPw]           = useState('');
  const [confirmPw, setConfirmPw]   = useState('');
  const [pwMsg, setPwMsg]           = useState('');
  const [changingPw, setChangingPw] = useState(false);

  // ── Avatar state ───────────────────────────────────────────────────────
  const [avatarGlyph, setAvatarGlyph] = useState(0);
  const [avatarColor, setAvatarColor] = useState(0);

  // ── Notifications state ────────────────────────────────────────────────
  const [notifications, setNotifications] = useState({
    dailyHoroscope: true, fullMoonAlert: true, weeklyForecast: false,
    compatibilityUpdates: false, cosmicEvents: true, emailDigest: false,
  });

  // ── Danger zone state ──────────────────────────────────────────────────
  const [showDanger, setShowDanger]   = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState('');

  // Derived display values — always use the corrected sign from DB / computed
  const sign         = profile?.zodiac_sign || computedSign || '';
  const element      = ELEMENT[sign] || 'Air';
  const elementColor = ELEMENT_COLOR[element] || '#7B61FF';
  const memberSince  = user?.created_at
    ? new Date(user.created_at).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
    : 'Unknown';

  // ── Save profile (name + DOB + gender, recomputes zodiac) ──────────────
  async function handleSaveProfile() {
    if (!user?.id) return;
    setSaving(true);
    setSaveMsg('');

    const newZodiac = dob ? getZodiacSign(dob) : profile?.zodiac_sign || '';

    const { error } = await supabase.from('profiles').update({
      full_name:     fullName,
      date_of_birth: dob || null,
      gender:        gender || null,
      zodiac_sign:   newZodiac,
    }).eq('id', user.id);

    if (!error) {
      await refreshProfile();
      setSaveMsg('Profile updated successfully!');
      setEditMode(false);
    } else {
      setSaveMsg('Failed to save: ' + error.message);
    }
    setSaving(false);
    setTimeout(() => setSaveMsg(''), 4000);
  }

  // ── Change password ────────────────────────────────────────────────────
  async function handleChangePassword() {
    if (newPw !== confirmPw) { setPwMsg('Passwords do not match.'); return; }
    if (newPw.length < 6)   { setPwMsg('Password must be at least 6 characters.'); return; }
    setChangingPw(true);
    setPwMsg('');
    const { error } = await supabase.auth.updateUser({ password: newPw });
    setPwMsg(error ? 'Error: ' + error.message : 'Password updated successfully!');
    setChangingPw(false);
    if (!error) { setCurrentPw(''); setNewPw(''); setConfirmPw(''); setPwMode(false); }
    setTimeout(() => setPwMsg(''), 4000);
  }

  const inputClass = 'w-full px-3 py-2 rounded-xl text-white text-sm outline-none';
  const inputStyle = { background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(123,97,255,0.3)' };

  return (
    <div className="p-6 max-w-2xl mx-auto space-y-6 pb-16">
      <style>{`@keyframes avatar-pulse { 0%,100%{box-shadow:0 0 20px rgba(123,97,255,0.3)} 50%{box-shadow:0 0 40px rgba(123,97,255,0.6)} }`}</style>

      {/* ── 1. PROFILE CARD */}
      <div className="rounded-3xl p-6 text-center" style={{
        background: 'linear-gradient(135deg, rgba(45,27,105,0.9), rgba(10,1,24,0.95))',
        border: `1px solid ${elementColor}44`,
      }}>
        <div className="relative inline-block mb-4">
          <div className="w-24 h-24 rounded-full flex items-center justify-center mx-auto text-4xl font-bold cursor-pointer"
            style={{
              background: `radial-gradient(circle, ${AVATAR_COLORS[avatarColor]}55, ${AVATAR_COLORS[avatarColor]}22)`,
              border: `3px solid ${AVATAR_COLORS[avatarColor]}80`,
              animation: 'avatar-pulse 4s ease infinite',
              color: AVATAR_COLORS[avatarColor],
            }}>
            {AVATAR_GLYPHS[avatarGlyph]}
          </div>
          <div className="absolute -bottom-1 -right-1 text-2xl"
            style={{ filter: `drop-shadow(0 0 6px ${elementColor})` }}>
            {ZODIAC_SYMBOLS[sign] || '✦'}
          </div>
        </div>
        <h1 className="text-2xl font-bold text-white mb-1" style={{ fontFamily: 'Cinzel, serif' }}>
          {profile?.full_name || 'Cosmic Traveler'}
        </h1>
        <p className="text-sm text-white/50 mb-1">{user?.email}</p>
        <div className="flex justify-center gap-2 mt-2 flex-wrap">
          <span className="px-3 py-1 rounded-full text-xs font-medium" style={{ background: `${elementColor}25`, color: elementColor }}>
            {element} · {sign || 'Unknown Sign'}
          </span>
          <span className="px-3 py-1 rounded-full text-xs font-medium" style={{ background: 'rgba(255,255,255,0.08)', color: 'rgba(255,255,255,0.5)' }}>
            Member since {memberSince}
          </span>
        </div>

        {/* Avatar Customizer */}
        <div className="mt-5 pt-5 border-t border-white/10">
          <p className="text-xs text-white/40 mb-3 uppercase tracking-wider">Customize Avatar</p>
          <div className="flex justify-center gap-2 mb-3 flex-wrap">
            {AVATAR_GLYPHS.map((g, i) => (
              <button key={i} onClick={() => setAvatarGlyph(i)}
                className="w-9 h-9 rounded-lg text-lg transition-all" style={{
                  background: avatarGlyph === i ? 'rgba(123,97,255,0.4)' : 'rgba(255,255,255,0.06)',
                  border: `1px solid ${avatarGlyph === i ? 'rgba(123,97,255,0.6)' : 'rgba(255,255,255,0.1)'}`,
                  color: avatarGlyph === i ? '#e0d7ff' : 'rgba(255,255,255,0.5)',
                }}>{g}</button>
            ))}
          </div>
          <div className="flex justify-center gap-2">
            {AVATAR_COLORS.map((c, i) => (
              <button key={i} onClick={() => setAvatarColor(i)}
                className="w-7 h-7 rounded-full transition-all" style={{
                  background: c,
                  border: `2px solid ${avatarColor === i ? 'white' : 'transparent'}`,
                  transform: avatarColor === i ? 'scale(1.2)' : 'scale(1)',
                }} />
            ))}
          </div>
        </div>
      </div>

      {/* ── 2. ACCOUNT DETAILS ────────────────────────────────────────────── */}
      <div className="rounded-2xl p-6" style={cardStyle}>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold text-white flex items-center gap-2">👤 Account Details</h2>
          {!editMode ? (
            <button onClick={() => setEditMode(true)}
              className="text-xs px-3 py-1.5 rounded-lg" style={{
                background: 'rgba(123,97,255,0.2)', color: '#a78bfa',
                border: '1px solid rgba(123,97,255,0.3)',
              }}>Edit</button>
          ) : (
            <div className="flex gap-2">
              <button onClick={() => {
                setEditMode(false);
                setFullName(profile?.full_name || '');
                setDob(profile?.date_of_birth || '');
                setGender(profile?.gender || '');
              }}
                className="text-xs px-3 py-1.5 rounded-lg" style={{
                  background: 'rgba(255,255,255,0.06)', color: 'rgba(255,255,255,0.5)',
                  border: '1px solid rgba(255,255,255,0.12)',
                }}>Cancel</button>
              <button onClick={handleSaveProfile} disabled={saving}
                className="text-xs px-3 py-1.5 rounded-lg" style={{
                  background: 'rgba(34,197,94,0.25)', color: '#86efac',
                  border: '1px solid rgba(34,197,94,0.35)',
                }}>
                {saving ? 'Saving...' : 'Save'}
              </button>
            </div>
          )}
        </div>

        {saveMsg && <div className="mb-3 text-xs text-green-400">{saveMsg}</div>}

        <div className="space-y-4">
          {/* Full Name */}
          <div>
            <label className="block text-xs text-white/40 mb-1">Full Name</label>
            {editMode ? (
              <input
                value={fullName}
                onChange={e => setFullName(e.target.value)}
                className={inputClass}
                style={inputStyle}
              />
            ) : (
              <p className="text-sm text-white">{profile?.full_name || '—'}</p>
            )}
          </div>

          {/* Email — always read-only */}
          <div>
            <label className="block text-xs text-white/40 mb-1">Email</label>
            <p className="text-sm text-white">{user?.email || '—'}</p>
          </div>

          {/* Date of Birth */}
          <div>
            <label className="block text-xs text-white/40 mb-1">Date of Birth</label>
            {editMode ? (
              <div>
                <input
                  type="date"
                  value={dob}
                  onChange={e => setDob(e.target.value)}
                  className={inputClass}
                  style={{ ...inputStyle, colorScheme: 'dark' }}
                />
                {dob && (
                  <p className="mt-1 text-xs text-cyan-400">
                    Detected sign: <strong>{getZodiacSign(dob) || '—'}</strong>
                  </p>
                )}
              </div>
            ) : (
              <p className="text-sm text-white">
                {profile?.date_of_birth
                  ? new Date(profile.date_of_birth + 'T00:00:00').toLocaleDateString('en-US', {
                      year: 'numeric', month: 'long', day: 'numeric',
                    })
                  : '—'}
              </p>
            )}
          </div>

          {/* Gender */}
          <div>
            <label className="block text-xs text-white/40 mb-1">Gender</label>
            {editMode ? (
              <select
                value={gender}
                onChange={e => setGender(e.target.value)}
                className={inputClass}
                style={{ ...inputStyle, cursor: 'pointer' }}
              >
                <option value="">Select gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            ) : (
              <p className="text-sm text-white">{profile?.gender || '—'}</p>
            )}
          </div>

          {/* Zodiac Sign — always read-only, auto-computed */}
          <div>
            <label className="block text-xs text-white/40 mb-1">Zodiac Sign</label>
            <p className="text-sm text-white flex items-center gap-1">
              {sign ? (
                <>
                  <span>{ZODIAC_SYMBOLS[sign]}</span>
                  <span>{sign}</span>
                </>
              ) : (
                <span className="text-white/30">Set your date of birth to auto-detect</span>
              )}
            </p>
          </div>
        </div>
      </div>

      {/* ── 3. CHANGE PASSWORD ─────────────────────────────────────────────── */}
      <div className="rounded-2xl p-6" style={cardStyle}>
        <div className="flex justify-between items-center mb-3">
          <h2 className="text-lg font-semibold text-white flex items-center gap-2">🔒 Password</h2>
          <button onClick={() => setPwMode(!pwMode)}
            className="text-xs px-3 py-1.5 rounded-lg" style={{
              background: 'rgba(123,97,255,0.2)', color: '#a78bfa',
              border: '1px solid rgba(123,97,255,0.3)',
            }}>
            {pwMode ? 'Cancel' : 'Change Password'}
          </button>
        </div>
        {pwMsg && <div className="mb-3 text-xs text-cyan-400">{pwMsg}</div>}
        {pwMode && (
          <div className="space-y-3">
            <div>
              <label className="block text-xs text-white/40 mb-1">New Password</label>
              <input type="password" value={newPw} onChange={e => setNewPw(e.target.value)}
                placeholder="New password" className={inputClass} style={inputStyle} />
            </div>
            <div>
              <label className="block text-xs text-white/40 mb-1">Confirm New Password</label>
              <input type="password" value={confirmPw} onChange={e => setConfirmPw(e.target.value)}
                placeholder="Confirm new password" className={inputClass} style={inputStyle} />
            </div>
            <button onClick={handleChangePassword} disabled={changingPw}
              className="px-4 py-2 rounded-lg text-sm font-medium" style={{
                background: 'rgba(123,97,255,0.3)', color: '#e0d7ff',
                border: '1px solid rgba(123,97,255,0.5)',
              }}>
              {changingPw ? 'Updating...' : 'Update Password'}
            </button>
          </div>
        )}
      </div>

      {/* ── 4. ZODIAC BIRTH CHART SUMMARY ─────────────────────────────────── */}
      <div className="rounded-2xl p-6" style={cardStyle}>
        <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">🌌 Cosmic Birth Profile</h2>
        {sign ? (
          <>
            <div className="relative flex items-center justify-center mb-5" style={{ height: '200px' }}>
              <div className="w-32 h-32 rounded-full flex items-center justify-center text-5xl" style={{
                background: `radial-gradient(circle, ${elementColor}22, transparent)`,
                border: `2px solid ${elementColor}44`,
              }}>
                {ZODIAC_SYMBOLS[sign] || '✦'}
              </div>
              {[
                { label: 'Sun ☀️',     value: sign,         angle: 0   },
                { label: 'Moon ☽',    value: 'Intuitive',  angle: 60  },
                { label: 'Rising ↑',  value: 'Ambitious',  angle: 120 },
                { label: 'Venus ♀',   value: 'Romantic',   angle: 180 },
                { label: 'Mars ♂',    value: 'Dynamic',    angle: 240 },
                { label: 'Mercury ☿', value: 'Articulate', angle: 300 },
              ].map(p => {
                const r = 85;
                const rad = (p.angle - 90) * Math.PI / 180;
                const x = 50 + r * Math.cos(rad);
                const y = 50 + r * Math.sin(rad);
                return (
                  <div key={p.label} className="absolute text-center" style={{
                    left: `calc(${x}% - 32px)`, top: `calc(${y}% - 20px)`,
                    transform: 'translate(-50%,-50%)',
                  }}>
                    <div className="text-xs text-white/50 whitespace-nowrap">{p.label}</div>
                    <div className="text-xs font-medium text-purple-300 whitespace-nowrap">{p.value}</div>
                  </div>
                );
              })}
            </div>
            <div className="grid grid-cols-3 gap-2">
              {[
                { icon: '🔥', label: 'Element', value: element },
                { icon: '⭕', label: 'Quality',  value: ['Aries','Cancer','Libra','Capricorn'].includes(sign) ? 'Cardinal' : ['Taurus','Leo','Scorpio','Aquarius'].includes(sign) ? 'Fixed' : 'Mutable' },
                { icon: '🪐', label: 'Polarity', value: ['Aries','Gemini','Leo','Libra','Sagittarius','Aquarius'].includes(sign) ? 'Positive' : 'Negative' },
              ].map(f => (
                <div key={f.label} className="text-center p-3 rounded-xl" style={{ background: 'rgba(255,255,255,0.04)' }}>
                  <div className="text-xl mb-1">{f.icon}</div>
                  <div className="text-xs text-white/40">{f.label}</div>
                  <div className="text-sm font-medium" style={{ color: elementColor }}>{f.value}</div>
                </div>
              ))}
            </div>
          </>
        ) : (
          <div className="text-center py-6 text-white/40 text-sm">
            Add your date of birth above to reveal your cosmic birth profile ✨
          </div>
        )}
      </div>

      {/* ── 5. NOTIFICATIONS ──────────────────────────────────────────────── */}
      <div className="rounded-2xl p-6" style={cardStyle}>
        <h2 className="text-lg font-semibold text-white mb-4">🔔 Notifications</h2>
        <div className="space-y-3">
          {(Object.entries(notifications) as [keyof typeof notifications, boolean][]).map(([key, val]) => {
            const labels: Record<string, string> = {
              dailyHoroscope: 'Daily Horoscope',
              fullMoonAlert: 'Full Moon Alert',
              weeklyForecast: 'Weekly Forecast',
              compatibilityUpdates: 'Compatibility Updates',
              cosmicEvents: 'Cosmic Events',
              emailDigest: 'Email Digest',
            };
            return (
              <div key={key} className="flex items-center justify-between">
                <span className="text-sm text-white/70">{labels[key]}</span>
                <button onClick={() => setNotifications(n => ({ ...n, [key]: !n[key] }))}
                  className="w-10 h-5 rounded-full transition-all relative"
                  style={{ background: val ? 'rgba(123,97,255,0.6)' : 'rgba(255,255,255,0.1)' }}>
                  <div className="w-4 h-4 rounded-full bg-white absolute top-0.5 transition-all"
                    style={{ left: val ? '22px' : '2px' }} />
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* ── 6. DANGER ZONE ────────────────────────────────────────────────── */}
      <div className="rounded-2xl p-6" style={{ ...cardStyle, borderColor: 'rgba(239,68,68,0.2)' }}>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg font-semibold text-red-400">⚠️ Danger Zone</h2>
          <button onClick={() => setShowDanger(!showDanger)}
            className="text-xs px-3 py-1.5 rounded-lg" style={{
              background: 'rgba(239,68,68,0.1)', color: '#f87171',
              border: '1px solid rgba(239,68,68,0.3)',
            }}>
            {showDanger ? 'Hide' : 'Show'}
          </button>
        </div>
        {showDanger && (
          <div className="space-y-3">
            <p className="text-xs text-white/50">Type <strong className="text-white">DELETE</strong> to permanently delete your account. This cannot be undone.</p>
            <input
              value={deleteConfirm}
              onChange={e => setDeleteConfirm(e.target.value)}
              placeholder="Type DELETE to confirm"
              className={inputClass}
              style={{ ...inputStyle, borderColor: 'rgba(239,68,68,0.3)' }}
            />
            <button
              disabled={deleteConfirm !== 'DELETE'}
              className="px-4 py-2 rounded-lg text-sm font-medium transition-all"
              style={{
                background: deleteConfirm === 'DELETE' ? 'rgba(239,68,68,0.3)' : 'rgba(255,255,255,0.05)',
                color: deleteConfirm === 'DELETE' ? '#f87171' : 'rgba(255,255,255,0.2)',
                border: `1px solid ${deleteConfirm === 'DELETE' ? 'rgba(239,68,68,0.5)' : 'rgba(255,255,255,0.1)'}`,
                cursor: deleteConfirm === 'DELETE' ? 'pointer' : 'not-allowed',
              }}>
              Delete Account
            </button>
          </div>
        )}
      </div>
    </div>
  );
}