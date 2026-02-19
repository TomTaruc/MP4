import { LayoutDashboard, Star, Sun, Calendar, User, LogOut, Sparkles } from 'lucide-react';
import { Page } from '../types';
import { useAuth } from '../contexts/AuthContext';

interface SidebarProps {
  currentPage: Page;
  onNavigate: (page: Page) => void;
}

const navItems = [
  { page: 'dashboard' as Page, icon: LayoutDashboard, label: 'Dashboard' },
  { page: 'my-zodiac' as Page, icon: Star, label: 'My Zodiac Sign' },
  { page: 'daily' as Page, icon: Sun, label: 'Daily Horoscope' },
  { page: 'monthly' as Page, icon: Calendar, label: 'Monthly Horoscope' },
  { page: 'profile' as Page, icon: User, label: 'My Profile' },
];

export default function Sidebar({ currentPage, onNavigate }: SidebarProps) {
  const { profile, signOut } = useAuth();

  return (
    <aside className="fixed left-0 top-0 h-full w-64 z-40 flex flex-col" style={{
      background: 'linear-gradient(180deg, #1A0533 0%, #2D1B69 100%)',
      borderRight: '1px solid rgba(123,97,255,0.3)',
      boxShadow: '4px 0 20px rgba(91,45,142,0.4)',
    }}>
      <div className="px-6 py-6 border-b border-purple-900/40">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full flex items-center justify-center"
            style={{ background: 'radial-gradient(circle, #7B61FF, #2D1B69)' }}>
            <Sparkles size={20} className="text-cyan-300" />
          </div>
          <div>
            <h1 className="text-white font-bold text-lg tracking-wide" style={{ fontFamily: 'Cinzel, serif' }}>
              AstroSoul
            </h1>
            <p className="text-purple-300 text-xs">Cosmic Identity</p>
          </div>
        </div>
        {profile && (
          <div className="mt-4 text-sm">
            <p className="text-purple-200 truncate">{profile.full_name}</p>
            {/* profile.zodiac_sign is guaranteed correct by AuthContext */}
            <p className="text-cyan-400 text-xs font-medium">{profile.zodiac_sign}</p>
          </div>
        )}
      </div>

      <nav className="flex-1 py-4 overflow-y-auto">
        {navItems.map(({ page, icon: Icon, label }) => {
          const active = currentPage === page;
          return (
            <button
              key={page}
              onClick={() => onNavigate(page)}
              className="w-full flex items-center gap-3 px-5 py-3.5 text-sm transition-all duration-300 text-left"
              style={{
                color: active ? '#00BFFF' : '#F0EAFF',
                borderLeft: active ? '3px solid #00BFFF' : '3px solid transparent',
                background: active ? 'rgba(0,191,255,0.1)' : 'transparent',
                textShadow: active ? '0 0 10px rgba(0,191,255,0.5)' : 'none',
              }}>
              <Icon size={18} />
              <span>{label}</span>
            </button>
          );
        })}
      </nav>

      <div className="px-5 py-4 border-t border-purple-900/40">
        <button
          onClick={signOut}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-purple-300 hover:text-red-400 transition-all"
          style={{ background: 'rgba(255,255,255,0.04)' }}>
          <LogOut size={16} />
          <span>Sign Out</span>
        </button>
      </div>
    </aside>
  );
}