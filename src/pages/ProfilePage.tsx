import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';

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

export default function ProfilePage() {
  const { profile, user, refreshProfile } = useAuth();
  const [editMode, setEditMode] = useState(false);
  const [fullName, setFullName] = useState(profile?.full_name || '');
  const [saving, setSaving] = useState(false);
  const [saveMsg, setSaveMsg] = useState('');

  const [pwMode, setPwMode] = useState(false);
  const [currentPw, setCurrentPw] = useState('');
  const [newPw, setNewPw] = useState('');
  const [confirmPw, setConfirmPw] = useState('');
  const [pwMsg, setPwMsg] = useState('');
  const [changingPw, setChangingPw] = useState(false);

  const [avatarGlyph, setAvatarGlyph] = useState(0);
  const [avatarColor, setAvatarColor] = useState(0);

  const [notifications, setNotifications] = useState({
    dailyHoroscope: true, fullMoonAlert: true, weeklyForecast: false,
    compatibilityUpdates: false, cosmicEvents: true, emailDigest: false,
  });

  const [showDanger, setShowDanger] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState('');

  const sign = profile?.zodiac_sign || '';
  const element = ELEMENT[sign] || 'Fire';
  const elementColor = ELEMENT_COLOR[element] || '#7B61FF';
  const memberSince = user?.created_at ? new Date(user.created_at).toLocaleDateString('en-US', { month: 'long', year: 'numeric' }) : 'Unknown';

  async function handleSaveProfile() {
    setSaving(true);
    setSaveMsg('');
    const { error } = await supabase.from('profiles').update({ full_name: fullName }).eq('id', user?.id);
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

  async function handleChangePassword() {
    if (newPw !== confirmPw) { setPwMsg('Passwords do not match.'); return; }
    if (newPw.length < 6) { setPwMsg('Password must be at least 6 characters.'); return; }
    setChangingPw(true);
    setPwMsg('');
    const { error } = await supabase.auth.updateUser({ password: newPw });
    if (!error) {
      setPwMsg('✓ Password changed successfully!');
      setCurrentPw(''); setNewPw(''); setConfirmPw('');
      setPwMode(false);
    } else {
      setPwMsg('Error: ' + error.message);
    }
    setChangingPw(false);
    setTimeout(() => setPwMsg(''), 5000);
  }

  const inputClass = 'w-full px-4 py-2.5 rounded-xl text-white text-sm outline-none';
  const inputStyle = { background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.15)' };
  const cardStyle = { background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '16px' };

  return (
    <div className="p-6 space-y-6 max-w-2xl mx-auto pb-16 relative z-10">
      <style>{`
        .toggle-on { background: rgba(123,97,255,0.5) !important; }
        .toggle-thumb { transition: transform .2s; }
        .toggle-on .toggle-thumb { transform: translateX(20px) !important; }
        @keyframes avatar-pulse { 0%,100%{box-shadow: 0 0 20px rgba(123,97,255,0.3)} 50%{box-shadow: 0 0 40px rgba(123,97,255,0.7)} }
      `}</style>

      {/* ── 1. PROFILE CARD WITH AVATAR */}
      <div className="rounded-3xl p-6 text-center" style={{
        background: 'linear-gradient(135deg, rgba(45,27,105,0.9), rgba(10,1,24,0.95))',
        border: `1px solid ${elementColor}44`,
      }}>
        {/* Avatar */}
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
        <div className="flex justify-center gap-2 mt-2">
          <span className="px-3 py-1 rounded-full text-xs font-medium" style={{ background: `${elementColor}25`, color: elementColor }}>
            {element} · {sign}
          </span>
          <span className="px-3 py-1 rounded-full text-xs font-medium" style={{ background: 'rgba(255,255,255,0.08)', color: 'rgba(255,255,255,0.5)' }}>
            Member since {memberSince}
          </span>
        </div>

        {/* Avatar Customizer (feature 1 part 2) */}
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

      {/* ── 2. ACCOUNT INFO & EDIT */}
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
              <button onClick={() => { setEditMode(false); setFullName(profile?.full_name || ''); }}
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
        <div className="space-y-3">
          <div>
            <label className="block text-xs text-white/40 mb-1">Full Name</label>
            {editMode ? (
              <input value={fullName} onChange={e => setFullName(e.target.value)}
                className={inputClass} style={inputStyle} />
            ) : (
              <div className="text-sm text-white">{profile?.full_name || '—'}</div>
            )}
          </div>
          {[
            { label: 'Email', value: user?.email || '—' },
            { label: 'Date of Birth', value: profile?.date_of_birth || '—' },
            { label: 'Gender', value: profile?.gender || '—' },
            { label: 'Zodiac Sign', value: `${ZODIAC_SYMBOLS[sign] || ''} ${sign}` },
          ].map(f => (
            <div key={f.label}>
              <label className="block text-xs text-white/40 mb-1">{f.label}</label>
              <div className="text-sm text-white">{f.value}</div>
            </div>
          ))}
        </div>
      </div>

      {/* ── 3. CHANGE PASSWORD */}
      <div className="rounded-2xl p-6" style={cardStyle}>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold text-white flex items-center gap-2">🔐 Password</h2>
          <button onClick={() => setPwMode(!pwMode)}
            className="text-xs px-3 py-1.5 rounded-lg" style={{
              background: pwMode ? 'rgba(239,68,68,0.15)' : 'rgba(123,97,255,0.2)',
              color: pwMode ? '#fca5a5' : '#a78bfa',
              border: `1px solid ${pwMode ? 'rgba(239,68,68,0.3)' : 'rgba(123,97,255,0.3)'}`,
            }}>
            {pwMode ? 'Cancel' : 'Change Password'}
          </button>
        </div>
        {pwMsg && <div className="mb-3 text-xs" style={{ color: pwMsg.startsWith('✓') ? '#86efac' : '#fca5a5' }}>{pwMsg}</div>}
        {pwMode && (
          <div className="space-y-3">
            {[
              { label: 'New Password', value: newPw, setter: setNewPw },
              { label: 'Confirm Password', value: confirmPw, setter: setConfirmPw },
            ].map(f => (
              <div key={f.label}>
                <label className="block text-xs text-white/40 mb-1">{f.label}</label>
                <input type="password" value={f.value} onChange={e => f.setter(e.target.value)}
                  className={inputClass} style={inputStyle} />
              </div>
            ))}
            <button onClick={handleChangePassword} disabled={changingPw}
              className="w-full py-2.5 rounded-xl text-sm font-semibold text-white mt-2" style={{
                background: 'linear-gradient(135deg, #5B2D8E, #2D1B69)',
                border: '1px solid rgba(123,97,255,0.4)',
              }}>
              {changingPw ? 'Updating...' : 'Update Password'}
            </button>
          </div>
        )}
      </div>

      {/* ── 4. ZODIAC BIRTH CHART SUMMARY */}
      <div className="rounded-2xl p-6" style={cardStyle}>
        <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">🌌 Cosmic Birth Profile</h2>
        <div className="relative flex items-center justify-center mb-5">
          <div className="w-32 h-32 rounded-full flex items-center justify-center text-5xl" style={{
            background: `radial-gradient(circle, ${elementColor}22, transparent)`,
            border: `2px solid ${elementColor}44`,
          }}>
            {ZODIAC_SYMBOLS[sign] || '✦'}
          </div>
          {[
            { label: 'Sun ☀️', value: sign, angle: 0 },
            { label: 'Moon ☽', value: 'Intuitive', angle: 60 },
            { label: 'Rising ↑', value: 'Ambitious', angle: 120 },
            { label: 'Venus ♀', value: 'Romantic', angle: 180 },
            { label: 'Mars ♂', value: 'Dynamic', angle: 240 },
            { label: 'Mercury ☿', value: 'Articulate', angle: 300 },
          ].map(p => {
            const r = 90;
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
        <div className="grid grid-cols-3 gap-2 mt-2">
          {[
            { icon: '🔥', label: 'Element', value: element },
            { icon: '⭕', label: 'Quality', value: ['Aries','Cancer','Libra','Capricorn'].includes(sign) ? 'Cardinal' : ['Taurus','Leo','Scorpio','Aquarius'].includes(sign) ? 'Fixed' : 'Mutable' },
            { icon: '🪐', label: 'Polarity', value: ['Aries','Gemini','Leo','Libra','Sagittarius','Aquarius'].includes(sign) ? 'Positive' : 'Negative' },
          ].map(f => (
            <div key={f.label} className="text-center p-3 rounded-xl" style={{ background: 'rgba(255,255,255,0.04)' }}>
              <div className="text-xl mb-1">{f.icon}</div>
              <div className="text-xs text-white/40">{f.label}</div>
              <div className="text-sm font-medium" style={{ color: elementColor }}>{f.value}</div>
            </div>
          ))}
        </div>
      </div>

      {/* ── 5. NOTIFICATION PREFERENCES */}
      <div className="rounded-2xl p-6" style={cardStyle}>
        <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">🔔 Notifications</h2>
        <div className="space-y-3">
          {(Object.entries(notifications) as [keyof typeof notifications, boolean][]).map(([key, val]) => {
            const labels: Record<string, { label: string; desc: string }> = {
              dailyHoroscope: { label: 'Daily Horoscope', desc: 'Receive your daily reading each morning' },
              fullMoonAlert: { label: 'Full Moon Alerts', desc: 'Get notified before significant lunar events' },
              weeklyForecast: { label: 'Weekly Forecast', desc: 'A summary of your week ahead every Sunday' },
              compatibilityUpdates: { label: 'Compatibility Tips', desc: 'Relationship insights with cosmic context' },
              cosmicEvents: { label: 'Cosmic Events', desc: 'Eclipses, retrogrades, and rare transits' },
              emailDigest: { label: 'Email Digest', desc: 'Monthly astrology insights to your inbox' },
            };
            const meta = labels[key];
            return (
              <div key={key} className="flex items-center justify-between py-2">
                <div>
                  <div className="text-sm text-white font-medium">{meta.label}</div>
                  <div className="text-xs text-white/40">{meta.desc}</div>
                </div>
                <button onClick={() => setNotifications(prev => ({ ...prev, [key]: !prev[key] }))}
                  className={`relative w-10 h-5 rounded-full transition-all flex items-center px-0.5 ${val ? 'toggle-on' : ''}`}
                  style={{ background: val ? 'rgba(123,97,255,0.5)' : 'rgba(255,255,255,0.15)' }}>
                  <div className="toggle-thumb w-4 h-4 rounded-full bg-white" style={{
                    transform: val ? 'translateX(20px)' : 'translateX(0px)',
                    transition: 'transform .2s',
                  }} />
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* ── 6. ACCOUNT STATS */}
      <div className="rounded-2xl p-6" style={cardStyle}>
        <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">📈 Your Cosmic Journey</h2>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {[
            { icon: '📖', label: 'Readings Read', value: '47' },
            { icon: '⭐', label: 'Days Active', value: '23' },
            { icon: '🔮', label: 'Insights Saved', value: '12' },
            { icon: '🌙', label: 'Moon Cycles', value: '3' },
          ].map(stat => (
            <div key={stat.label} className="text-center p-4 rounded-xl" style={{ background: 'rgba(255,255,255,0.04)' }}>
              <div className="text-2xl mb-1">{stat.icon}</div>
              <div className="text-xl font-bold text-white">{stat.value}</div>
              <div className="text-xs text-white/40">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* ── 7. DANGER ZONE */}
      <div className="rounded-2xl p-6" style={{ background: 'rgba(239,68,68,0.05)', border: '1px solid rgba(239,68,68,0.2)', borderRadius: '16px' }}>
        <button onClick={() => setShowDanger(!showDanger)}
          className="flex items-center gap-2 text-red-400 text-sm font-medium">
          <span>⚠️</span> Danger Zone {showDanger ? '▲' : '▼'}
        </button>
        {showDanger && (
          <div className="mt-4 space-y-4">
            <p className="text-xs text-white/50">
              Deleting your account is permanent and irreversible. All your data, readings, and preferences will be lost. Type <span className="font-mono text-red-400 font-bold">DELETE</span> to confirm.
            </p>
            <input value={deleteConfirm} onChange={e => setDeleteConfirm(e.target.value)}
              placeholder='Type "DELETE" to confirm'
              className="w-full px-4 py-2.5 rounded-xl text-sm outline-none" style={{
                background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', color: '#fca5a5',
              }} />
            <button disabled={deleteConfirm !== 'DELETE'}
              className="w-full py-2.5 rounded-xl text-sm font-semibold transition-all" style={{
                background: deleteConfirm === 'DELETE' ? 'rgba(239,68,68,0.3)' : 'rgba(239,68,68,0.1)',
                border: '1px solid rgba(239,68,68,0.4)', color: '#fca5a5',
                opacity: deleteConfirm === 'DELETE' ? 1 : 0.5, cursor: deleteConfirm === 'DELETE' ? 'pointer' : 'not-allowed',
              }}>
              Delete My Account Forever
            </button>
          </div>
        )}
      </div>
    </div>
  );
}