import { useEffect, useState } from 'react';
import { Trash2, Search, Users } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { Profile } from '../../types';
import { useAuth } from '../../contexts/AuthContext';

export default function ManageUsersPage() {
  const { profile: currentAdmin } = useAuth();
  const [users, setUsers] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [deleting, setDeleting] = useState<string | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);

  async function load() {
    const { data } = await supabase.from('profiles').select('*').order('created_at', { ascending: false });
    setUsers(data || []);
    setLoading(false);
  }

  useEffect(() => { load(); }, []);

  async function deleteUser(id: string) {
    setDeleting(id);
    await supabase.from('profiles').delete().eq('id', id);
    setDeleting(null);
    setConfirmDelete(null);
    await load();
  }

  const filtered = users.filter(u =>
    u.full_name.toLowerCase().includes(search.toLowerCase()) ||
    u.zodiac_sign.toLowerCase().includes(search.toLowerCase())
  );

  const ZODIAC_SYMBOLS: Record<string, string> = {
    Aries:'♈',Taurus:'♉',Gemini:'♊',Cancer:'♋',Leo:'♌',Virgo:'♍',
    Libra:'♎',Scorpio:'♏',Sagittarius:'♐',Capricorn:'♑',Aquarius:'♒',Pisces:'♓',
  };

  if (loading) return <div className="p-8 text-slate-300">Loading users...</div>;

  return (
    <div className="p-8 max-w-5xl">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-white mb-1" style={{ fontFamily: 'Cinzel, serif' }}>Manage Users</h1>
        <p className="text-slate-400 text-sm">{users.length} registered accounts</p>
      </div>

      <div className="relative mb-5">
        <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
        <input
          type="text" value={search} onChange={e => setSearch(e.target.value)}
          placeholder="Search by name or zodiac sign..."
          className="w-full pl-10 pr-4 py-3 rounded-xl text-white placeholder-slate-500 outline-none text-sm max-w-md"
          style={{ background: 'rgba(10,22,40,0.8)', border: '1px solid rgba(0,191,255,0.2)' }}
        />
      </div>

      <div className="rounded-2xl overflow-hidden" style={{ background: 'rgba(10,22,40,0.7)', border: '1px solid rgba(0,191,255,0.15)' }}>
        <div className="grid grid-cols-5 gap-2 px-5 py-3 border-b border-blue-900/30 text-xs uppercase tracking-wider text-slate-500">
          <div className="col-span-2">User</div>
          <div>Sign</div>
          <div>Role</div>
          <div className="text-right">Action</div>
        </div>

        {filtered.length === 0 ? (
          <div className="px-5 py-10 text-center text-slate-500 flex flex-col items-center gap-2">
            <Users size={24} />
            <p className="text-sm">No users found.</p>
          </div>
        ) : (
          <div className="divide-y divide-blue-900/20">
            {filtered.map(user => (
              <div key={user.id} className="grid grid-cols-5 gap-2 px-5 py-4 items-center hover:bg-white/[0.02] transition-colors">
                <div className="col-span-2">
                  <p className="text-white text-sm font-medium">{user.full_name}</p>
                  <p className="text-slate-500 text-xs">{user.date_of_birth || 'No DOB'} · {user.gender}</p>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="text-lg">{ZODIAC_SYMBOLS[user.zodiac_sign] || '✦'}</span>
                  <span className="text-cyan-400 text-sm">{user.zodiac_sign}</span>
                </div>
                <div>
                  <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${user.role === 'admin' ? 'text-yellow-400 bg-yellow-400/10 border border-yellow-400/20' : 'text-slate-400 bg-slate-400/10 border border-slate-400/20'}`}>
                    {user.role}
                  </span>
                </div>
                <div className="text-right">
                  {user.id !== currentAdmin?.id && (
                    <>
                      {confirmDelete === user.id ? (
                        <div className="flex items-center justify-end gap-2">
                          <button onClick={() => setConfirmDelete(null)} className="text-xs text-slate-400 hover:text-white px-2 py-1 rounded">Cancel</button>
                          <button onClick={() => deleteUser(user.id)} disabled={deleting === user.id}
                            className="text-xs text-red-400 hover:text-red-300 px-3 py-1 rounded-lg disabled:opacity-60"
                            style={{ background: 'rgba(239,68,68,0.15)', border: '1px solid rgba(239,68,68,0.3)' }}>
                            {deleting === user.id ? '...' : 'Confirm'}
                          </button>
                        </div>
                      ) : (
                        <button onClick={() => setConfirmDelete(user.id)}
                          className="text-slate-500 hover:text-red-400 transition-colors p-1.5 rounded-lg hover:bg-red-400/10">
                          <Trash2 size={15} />
                        </button>
                      )}
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
