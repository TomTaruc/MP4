import { useEffect, useState } from 'react';
import { Users, Star, TrendingUp, Shield, Clock, Search, Trash2, Edit3 } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../contexts/AuthContext';
import { Profile } from '../../types';

const ZODIAC_SYMBOLS: Record<string, string> = {
  Aries:'♈', Taurus:'♉', Gemini:'♊', Cancer:'♋', Leo:'♌', Virgo:'♍',
  Libra:'♎', Scorpio:'♏', Sagittarius:'♐', Capricorn:'♑', Aquarius:'♒', Pisces:'♓',
};

export default function AdminDashboardPage() {
  const { profile: adminProfile } = useAuth();
  const [userCount, setUserCount]     = useState(0);
  const [signCount, setSignCount]     = useState(0);
  const [recentUsers, setRecentUsers] = useState<Profile[]>([]);
  const [allUsers, setAllUsers]       = useState<Profile[]>([]);
  const [loading, setLoading]         = useState(true);
  const [search, setSearch]           = useState('');
  const [activeTab, setActiveTab]     = useState<'overview' | 'users'>('overview');
  const [deleting, setDeleting]       = useState<string | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);
  const [promotingId, setPromotingId] = useState<string | null>(null);

  async function loadData() {
    setLoading(true);
    const [userRes, signRes, recentRes, allRes] = await Promise.all([
      supabase.from('profiles').select('*', { count: 'exact', head: true }).eq('role', 'user'),
      supabase.from('zodiac_signs').select('*', { count: 'exact', head: true }),
      supabase.from('profiles').select('*').order('created_at', { ascending: false }).limit(5),
      supabase.from('profiles').select('*').order('created_at', { ascending: false }),
    ]);
    setUserCount(userRes.count || 0);
    setSignCount(signRes.count || 0);
    setRecentUsers(recentRes.data || []);
    setAllUsers(allRes.data || []);
    setLoading(false);
  }

  useEffect(() => { loadData(); }, []);

  async function deleteUser(id: string) {
    setDeleting(id);
    await supabase.from('profiles').delete().eq('id', id);
    setDeleting(null);
    setConfirmDelete(null);
    await loadData();
  }

  async function toggleRole(user: Profile) {
    setPromotingId(user.id);
    const newRole = user.role === 'admin' ? 'user' : 'admin';
    await supabase.from('profiles').update({ role: newRole }).eq('id', user.id);
    setPromotingId(null);
    await loadData();
  }

  const filtered = allUsers.filter(u =>
    u.full_name?.toLowerCase().includes(search.toLowerCase()) ||
    u.zodiac_sign?.toLowerCase().includes(search.toLowerCase()) ||
    u.gender?.toLowerCase().includes(search.toLowerCase())
  );

  // Sign distribution
  const signDist: Record<string, number> = {};
  allUsers.forEach(u => {
    if (u.zodiac_sign) signDist[u.zodiac_sign] = (signDist[u.zodiac_sign] || 0) + 1;
  });
  const topSigns = Object.entries(signDist).sort((a, b) => b[1] - a[1]).slice(0, 5);
  const adminCount = allUsers.filter(u => u.role === 'admin').length;

  const now = new Date();
  const greeting = now.getHours() < 12 ? 'Good Morning' : now.getHours() < 17 ? 'Good Afternoon' : 'Good Evening';

  const cardStyle = (color: string) => ({
    background: `linear-gradient(135deg, ${color}15, rgba(10,22,40,0.95))`,
    border: `1px solid ${color}30`,
  });

  if (loading) return (
    <div className="p-8 flex items-center gap-3 text-slate-300">
      <div className="w-5 h-5 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin" />
      Loading dashboard...
    </div>
  );

  return (
    <div className="p-8 max-w-6xl">

      {/* ── HEADER */}
      <div className="mb-8">
        <p className="text-slate-500 text-xs uppercase tracking-widest mb-1">Admin Panel</p>
        <h1 className="text-3xl font-bold text-white mb-1" style={{ fontFamily: 'Cinzel, serif' }}>
          {greeting}, {adminProfile?.full_name?.split(' ')[0] || 'Admin'} 🛡️
        </h1>
        <p className="text-slate-400 text-sm">
          {now.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
        </p>
      </div>

      {/* ── TAB SWITCHER */}
      <div className="flex gap-2 mb-8">
        {(['overview', 'users'] as const).map(tab => (
          <button key={tab} onClick={() => setActiveTab(tab)}
            className="px-5 py-2 rounded-lg text-sm font-medium capitalize transition-all"
            style={{
              background: activeTab === tab ? 'rgba(0,191,255,0.2)' : 'rgba(255,255,255,0.04)',
              color: activeTab === tab ? '#7dd3fc' : 'rgba(255,255,255,0.4)',
              border: `1px solid ${activeTab === tab ? 'rgba(0,191,255,0.4)' : 'rgba(255,255,255,0.08)'}`,
            }}>
            {tab === 'overview' ? '📊 Overview' : '👥 Manage Users'}
          </button>
        ))}
      </div>

      {activeTab === 'overview' && (
        <>
          {/* ── STAT CARDS */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {[
              { icon: Users,    label: 'Total Users',  value: userCount,    color: '#00BFFF' },
              { icon: Star,     label: 'Zodiac Signs', value: signCount,    color: '#7B61FF' },
              { icon: Shield,   label: 'Admins',       value: adminCount,   color: '#F59E0B' },
              { icon: TrendingUp, label: 'Est. Active', value: Math.max(1, Math.floor(userCount * 0.3)), color: '#22c55e' },
            ].map(({ icon: Icon, label, value, color }) => (
              <div key={label} className="rounded-2xl p-5" style={cardStyle(color)}>
                <div className="flex items-center justify-between mb-3">
                  <Icon size={20} style={{ color }} />
                  <span className="text-xs px-2 py-0.5 rounded-full"
                    style={{ background: `${color}15`, color }}>live</span>
                </div>
                <p className="text-3xl font-bold text-white mb-1">{value}</p>
                <p className="text-slate-400 text-xs">{label}</p>
              </div>
            ))}
          </div>

          {/* ── RECENT USERS + TOP SIGNS */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

            {/* Recent Registrations */}
            <div className="rounded-2xl overflow-hidden"
              style={{ background: 'rgba(10,22,40,0.8)', border: '1px solid rgba(0,191,255,0.15)' }}>
              <div className="px-6 py-4 border-b border-blue-900/30 flex items-center gap-2">
                <Clock size={15} className="text-cyan-400" />
                <h3 className="text-white font-semibold text-sm">Recent Registrations</h3>
              </div>
              {recentUsers.length === 0 ? (
                <p className="px-6 py-8 text-slate-500 text-sm text-center">No users yet.</p>
              ) : (
                <div className="divide-y divide-blue-900/20">
                  {recentUsers.map(u => (
                    <div key={u.id} className="px-6 py-3 flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full flex items-center justify-center text-sm flex-shrink-0"
                        style={{ background: 'rgba(123,97,255,0.2)', color: '#a78bfa' }}>
                        {u.full_name?.[0]?.toUpperCase() || '?'}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-white text-sm font-medium truncate">{u.full_name || 'Unknown'}</p>
                        <p className="text-slate-500 text-xs">
                          {new Date(u.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                        </p>
                      </div>
                      <span className="text-lg flex-shrink-0" title={u.zodiac_sign}>
                        {ZODIAC_SYMBOLS[u.zodiac_sign] || '✦'}
                      </span>
                      <span className={`text-xs px-2 py-0.5 rounded-full flex-shrink-0 ${
                        u.role === 'admin'
                          ? 'text-yellow-400 bg-yellow-400/10 border border-yellow-400/20'
                          : 'text-slate-400 bg-slate-400/10 border border-slate-400/20'
                      }`}>{u.role}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Top Zodiac Signs */}
            <div className="rounded-2xl overflow-hidden"
              style={{ background: 'rgba(10,22,40,0.8)', border: '1px solid rgba(123,97,255,0.15)' }}>
              <div className="px-6 py-4 border-b border-purple-900/30 flex items-center gap-2">
                <Star size={15} className="text-purple-400" />
                <h3 className="text-white font-semibold text-sm">Top Zodiac Signs Among Users</h3>
              </div>
              {topSigns.length === 0 ? (
                <p className="px-6 py-8 text-slate-500 text-sm text-center">No data yet.</p>
              ) : (
                <div className="px-6 py-4 space-y-3">
                  {topSigns.map(([sign, count]) => (
                    <div key={sign} className="flex items-center gap-3">
                      <span className="text-xl w-7 text-center">{ZODIAC_SYMBOLS[sign] || '✦'}</span>
                      <span className="text-white text-sm w-24">{sign}</span>
                      <div className="flex-1 h-2 rounded-full overflow-hidden"
                        style={{ background: 'rgba(255,255,255,0.08)' }}>
                        <div className="h-full rounded-full transition-all"
                          style={{
                            width: `${(count / Math.max(1, userCount)) * 100}%`,
                            background: 'linear-gradient(90deg, #7B61FF, #00BFFF)',
                          }} />
                      </div>
                      <span className="text-cyan-400 text-sm font-bold w-6 text-right">{count}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </>
      )}

      {activeTab === 'users' && (
        <>
          {/* ── SEARCH */}
          <div className="relative mb-5 max-w-md">
            <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text" value={search} onChange={e => setSearch(e.target.value)}
              placeholder="Search by name, sign, or gender..."
              className="w-full pl-10 pr-4 py-3 rounded-xl text-white placeholder-slate-500 outline-none text-sm"
              style={{ background: 'rgba(10,22,40,0.8)', border: '1px solid rgba(0,191,255,0.2)' }}
            />
          </div>

          <p className="text-slate-500 text-xs mb-3">{filtered.length} of {allUsers.length} accounts</p>

          {/* ── USERS TABLE */}
          <div className="rounded-2xl overflow-hidden"
            style={{ background: 'rgba(10,22,40,0.7)', border: '1px solid rgba(0,191,255,0.15)' }}>
            <div className="grid px-5 py-3 border-b border-blue-900/30 text-xs uppercase tracking-wider text-slate-500"
              style={{ gridTemplateColumns: '2fr 1fr 1fr 1fr 1fr' }}>
              <div>User</div>
              <div>Sign</div>
              <div>Gender</div>
              <div>Role</div>
              <div className="text-right">Actions</div>
            </div>

            {filtered.length === 0 ? (
              <div className="px-5 py-10 text-center text-slate-500 flex flex-col items-center gap-2">
                <Users size={24} />
                <p className="text-sm">No users found.</p>
              </div>
            ) : (
              <div className="divide-y divide-blue-900/20">
                {filtered.map(u => (
                  <div key={u.id} className="grid px-5 py-4 items-center hover:bg-white/[0.02] transition-colors"
                    style={{ gridTemplateColumns: '2fr 1fr 1fr 1fr 1fr' }}>

                    {/* Name + DOB */}
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full flex items-center justify-center text-sm flex-shrink-0 font-bold"
                        style={{ background: 'rgba(123,97,255,0.2)', color: '#a78bfa' }}>
                        {u.full_name?.[0]?.toUpperCase() || '?'}
                      </div>
                      <div>
                        <p className="text-white text-sm font-medium">{u.full_name || '—'}</p>
                        <p className="text-slate-500 text-xs">{u.date_of_birth || 'No DOB'}</p>
                      </div>
                    </div>

                    {/* Sign */}
                    <div className="flex items-center gap-1.5">
                      <span className="text-lg">{ZODIAC_SYMBOLS[u.zodiac_sign] || '✦'}</span>
                      <span className="text-cyan-400 text-sm">{u.zodiac_sign || '—'}</span>
                    </div>

                    {/* Gender */}
                    <div className="text-slate-400 text-sm">{u.gender || '—'}</div>

                    {/* Role badge */}
                    <div>
                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                        u.role === 'admin'
                          ? 'text-yellow-400 bg-yellow-400/10 border border-yellow-400/20'
                          : 'text-slate-400 bg-slate-400/10 border border-slate-400/20'
                      }`}>
                        {u.role}
                      </span>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center justify-end gap-2">
                      {u.id !== adminProfile?.id ? (
                        <>
                          {/* Promote / Demote */}
                          <button
                            onClick={() => toggleRole(u)}
                            disabled={promotingId === u.id}
                            title={u.role === 'admin' ? 'Demote to user' : 'Promote to admin'}
                            className="p-1.5 rounded-lg transition-all hover:bg-yellow-400/10 disabled:opacity-50"
                            style={{ color: '#f59e0b' }}>
                            <Edit3 size={14} />
                          </button>

                          {/* Delete */}
                          {confirmDelete === u.id ? (
                            <div className="flex items-center gap-1">
                              <button onClick={() => setConfirmDelete(null)}
                                className="text-xs text-slate-400 hover:text-white px-2 py-1 rounded">
                                Cancel
                              </button>
                              <button onClick={() => deleteUser(u.id)} disabled={deleting === u.id}
                                className="text-xs px-2 py-1 rounded-lg disabled:opacity-60"
                                style={{
                                  background: 'rgba(239,68,68,0.15)',
                                  border: '1px solid rgba(239,68,68,0.3)',
                                  color: '#f87171',
                                }}>
                                {deleting === u.id ? '...' : 'Confirm'}
                              </button>
                            </div>
                          ) : (
                            <button onClick={() => setConfirmDelete(u.id)}
                              className="p-1.5 rounded-lg transition-all hover:bg-red-400/10 text-slate-500 hover:text-red-400">
                              <Trash2 size={14} />
                            </button>
                          )}
                        </>
                      ) : (
                        <span className="text-xs text-slate-600 italic">you</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}