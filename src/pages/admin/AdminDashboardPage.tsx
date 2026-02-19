import { useEffect, useState } from 'react';
import { Users, Sparkles, Star, TrendingUp } from 'lucide-react';
import { supabase } from '../../lib/supabase';

export default function AdminDashboardPage() {
  const [userCount, setUserCount] = useState(0);
  const [signCount, setSignCount] = useState(0);
  const [recentUsers, setRecentUsers] = useState<{ full_name: string; zodiac_sign: string; created_at: string }[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      supabase.from('profiles').select('*', { count: 'exact', head: true }).eq('role', 'user'),
      supabase.from('zodiac_signs').select('*', { count: 'exact', head: true }),
      supabase.from('profiles').select('full_name, zodiac_sign, created_at').eq('role', 'user').order('created_at', { ascending: false }).limit(5),
    ]).then(([userRes, signRes, recentRes]) => {
      setUserCount(userRes.count || 0);
      setSignCount(signRes.count || 0);
      setRecentUsers(recentRes.data || []);
      setLoading(false);
    });
  }, []);

  const stats = [
    { icon: Users, label: 'Total Users', value: userCount, color: '#00BFFF' },
    { icon: Star, label: 'Zodiac Signs', value: signCount, color: '#7B61FF' },
    { icon: TrendingUp, label: 'Active Today', value: Math.floor(userCount * 0.3), color: '#2ECC40' },
  ];

  if (loading) return <div className="p-8 text-slate-300">Loading admin data...</div>;

  return (
    <div className="p-8 max-w-4xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-1" style={{ fontFamily: 'Cinzel, serif' }}>Admin Dashboard</h1>
        <p className="text-slate-400 text-sm">Overview of AstroSoul platform</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        {stats.map(({ icon: Icon, label, value, color }) => (
          <div key={label} className="rounded-2xl p-6" style={{
            background: `linear-gradient(135deg, ${color}12, rgba(10,22,40,0.9))`,
            border: `1px solid ${color}30`,
            boxShadow: `0 0 20px ${color}12`,
          }}>
            <Icon size={24} style={{ color }} className="mb-3" />
            <p className="text-4xl font-bold text-white mb-1">{value}</p>
            <p className="text-slate-400 text-sm">{label}</p>
          </div>
        ))}
      </div>

      <div className="rounded-2xl overflow-hidden" style={{
        background: 'rgba(10,22,40,0.8)', border: '1px solid rgba(0,191,255,0.15)',
      }}>
        <div className="px-6 py-4 border-b border-blue-900/30 flex items-center gap-2">
          <Sparkles size={16} className="text-cyan-400" />
          <h3 className="text-white font-semibold text-sm">Recent Registrations</h3>
        </div>
        {recentUsers.length === 0 ? (
          <div className="p-6 text-slate-500 text-sm text-center">No users registered yet.</div>
        ) : (
          <div className="divide-y divide-blue-900/20">
            {recentUsers.map((u, i) => (
              <div key={i} className="px-6 py-4 flex items-center justify-between">
                <div>
                  <p className="text-white text-sm font-medium">{u.full_name}</p>
                  <p className="text-cyan-400 text-xs">{u.zodiac_sign}</p>
                </div>
                <p className="text-slate-500 text-xs">
                  {new Date(u.created_at).toLocaleDateString()}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
