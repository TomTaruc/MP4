import { useState } from 'react';
import { User, Calendar, Save, Lock } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';
import { getZodiacSign } from '../utils/zodiac';

export default function ProfilePage() {
  const { profile, refreshProfile } = useAuth();
  const [fullName, setFullName] = useState(profile?.full_name || '');
  const [gender, setGender] = useState(profile?.gender || '');
  const [dob, setDob] = useState(profile?.date_of_birth || '');
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [profileError, setProfileError] = useState('');

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNew, setConfirmNew] = useState('');
  const [changingPw, setChangingPw] = useState(false);
  const [pwMessage, setPwMessage] = useState('');
  const [pwError, setPwError] = useState('');

  async function saveProfile(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setProfileError('');
    const zodiacSign = dob ? getZodiacSign(dob) : profile?.zodiac_sign;
    const { error } = await supabase.from('profiles').update({
      full_name: fullName, gender, date_of_birth: dob || null, zodiac_sign: zodiacSign,
    }).eq('id', profile!.id);
    setSaving(false);
    if (error) { setProfileError(error.message); return; }
    await refreshProfile();
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  }

  async function changePassword(e: React.FormEvent) {
    e.preventDefault();
    setPwError('');
    setPwMessage('');
    if (newPassword !== confirmNew) { setPwError('Passwords do not match.'); return; }
    if (newPassword.length < 6) { setPwError('Password must be at least 6 characters.'); return; }
    setChangingPw(true);
    const { error } = await supabase.auth.updateUser({ password: newPassword });
    setChangingPw(false);
    if (error) { setPwError(error.message); return; }
    setPwMessage('Password updated successfully!');
    setCurrentPassword(''); setNewPassword(''); setConfirmNew('');
  }

  const inputClass = "w-full px-4 py-3 rounded-xl text-white placeholder-purple-500 outline-none text-sm";
  const inputStyle = { background: 'rgba(26,5,51,0.6)', border: '1px solid rgba(123,97,255,0.3)' };

  return (
    <div className="p-8 max-w-2xl">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-white mb-1" style={{ fontFamily: 'Cinzel, serif' }}>My Profile</h1>
        <p className="text-purple-400 text-sm">Manage your cosmic identity</p>
      </div>

      <div className="rounded-2xl p-6 mb-5 flex items-center gap-4"
        style={{ background: 'linear-gradient(135deg, rgba(123,97,255,0.15), #1A0533)', border: '1px solid rgba(123,97,255,0.25)' }}>
        <div className="w-16 h-16 rounded-full flex items-center justify-center text-2xl"
          style={{ background: 'radial-gradient(circle, rgba(123,97,255,0.4), rgba(45,27,105,0.8))', border: '2px solid rgba(123,97,255,0.5)' }}>
          {profile?.zodiac_sign ? { Aries:'♈',Taurus:'♉',Gemini:'♊',Cancer:'♋',Leo:'♌',Virgo:'♍',Libra:'♎',Scorpio:'♏',Sagittarius:'♐',Capricorn:'♑',Aquarius:'♒',Pisces:'♓' }[profile.zodiac_sign] || '✦' : '✦'}
        </div>
        <div>
          <h2 className="text-white font-bold text-lg">{profile?.full_name}</h2>
          <p className="text-cyan-400 text-sm">{profile?.zodiac_sign}</p>
          <p className="text-purple-400 text-xs capitalize">{profile?.role} account</p>
        </div>
      </div>

      {/* Profile Form */}
      <div className="rounded-2xl p-6 mb-5" style={{ background: 'linear-gradient(135deg, rgba(45,27,105,0.6), rgba(26,5,51,0.9))', border: '1px solid rgba(123,97,255,0.2)' }}>
        <div className="flex items-center gap-2 mb-5">
          <User size={18} className="text-cyan-400" />
          <h3 className="text-white font-semibold">Personal Information</h3>
        </div>
        <form onSubmit={saveProfile} className="space-y-4">
          {profileError && (
            <div className="p-3 rounded-lg text-red-300 text-sm" style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.25)' }}>
              {profileError}
            </div>
          )}
          {saved && (
            <div className="p-3 rounded-lg text-green-300 text-sm" style={{ background: 'rgba(34,197,94,0.1)', border: '1px solid rgba(34,197,94,0.25)' }}>
              Profile saved successfully!
            </div>
          )}
          <div>
            <label className="block text-purple-200 text-sm mb-2">Full Name</label>
            <input type="text" value={fullName} onChange={e => setFullName(e.target.value)}
              className={inputClass} style={inputStyle} />
          </div>
          <div>
            <label className="block text-purple-200 text-sm mb-2">Gender</label>
            <select value={gender} onChange={e => setGender(e.target.value)}
              className={inputClass} style={{ ...inputStyle, WebkitAppearance: 'none' }}>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>
          </div>
          <div>
            <label className="block text-purple-200 text-sm mb-2">Date of Birth</label>
            <div className="relative">
              <Calendar size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-purple-400" />
              <input type="date" value={dob} onChange={e => setDob(e.target.value)}
                className={`${inputClass} pl-10`} style={{ ...inputStyle, colorScheme: 'dark' }} />
            </div>
            {dob && <p className="mt-1 text-xs text-cyan-400">Zodiac: {getZodiacSign(dob)}</p>}
          </div>
          <button type="submit" disabled={saving}
            className="flex items-center gap-2 px-6 py-2.5 rounded-xl text-white text-sm font-medium transition-all hover:scale-105 disabled:opacity-60"
            style={{ background: 'linear-gradient(135deg, #5B2D8E, #2D1B69)', border: '1px solid rgba(123,97,255,0.4)' }}>
            <Save size={15} />
            {saving ? 'Saving...' : 'Save Changes'}
          </button>
        </form>
      </div>

      {/* Password Form */}
      <div className="rounded-2xl p-6" style={{ background: 'linear-gradient(135deg, rgba(45,27,105,0.6), rgba(26,5,51,0.9))', border: '1px solid rgba(123,97,255,0.2)' }}>
        <div className="flex items-center gap-2 mb-5">
          <Lock size={18} className="text-cyan-400" />
          <h3 className="text-white font-semibold">Change Password</h3>
        </div>
        <form onSubmit={changePassword} className="space-y-4">
          {pwError && (
            <div className="p-3 rounded-lg text-red-300 text-sm" style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.25)' }}>
              {pwError}
            </div>
          )}
          {pwMessage && (
            <div className="p-3 rounded-lg text-green-300 text-sm" style={{ background: 'rgba(34,197,94,0.1)', border: '1px solid rgba(34,197,94,0.25)' }}>
              {pwMessage}
            </div>
          )}
          <div>
            <label className="block text-purple-200 text-sm mb-2">Current Password</label>
            <input type="password" value={currentPassword} onChange={e => setCurrentPassword(e.target.value)}
              placeholder="••••••••" className={inputClass} style={inputStyle} />
          </div>
          <div>
            <label className="block text-purple-200 text-sm mb-2">New Password</label>
            <input type="password" value={newPassword} onChange={e => setNewPassword(e.target.value)}
              placeholder="••••••••" className={inputClass} style={inputStyle} />
          </div>
          <div>
            <label className="block text-purple-200 text-sm mb-2">Confirm New Password</label>
            <input type="password" value={confirmNew} onChange={e => setConfirmNew(e.target.value)}
              placeholder="••••••••" className={inputClass} style={inputStyle} />
          </div>
          <button type="submit" disabled={changingPw}
            className="flex items-center gap-2 px-6 py-2.5 rounded-xl text-white text-sm font-medium transition-all hover:scale-105 disabled:opacity-60"
            style={{ background: 'linear-gradient(135deg, #0A3D62, #1A6B9A)', border: '1px solid rgba(0,191,255,0.3)' }}>
            <Lock size={15} />
            {changingPw ? 'Updating...' : 'Update Password'}
          </button>
        </form>
      </div>
    </div>
  );
}
