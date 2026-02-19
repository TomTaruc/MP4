import { LayoutDashboard, Sparkles as SignsIcon, Users, LogOut, Sparkles } from 'lucide-react';
import { Page } from '../types';
import { useAuth } from '../contexts/AuthContext';

interface AdminSidebarProps {
  currentPage: Page;
  onNavigate: (page: Page) => void;
}

const navItems = [
  { page: 'admin-dashboard' as Page, icon: LayoutDashboard, label: 'Dashboard' },
  { page: 'admin-signs' as Page, icon: SignsIcon, label: 'Manage Zodiac Signs' },
  { page: 'admin-users' as Page, icon: Users, label: 'Manage Users' },
];

export default function AdminSidebar({ currentPage, onNavigate }: AdminSidebarProps) {
  const { signOut } = useAuth();

  return (
    <aside className="fixed left-0 top-0 h-full w-64 z-40 flex flex-col" style={{
      background: 'linear-gradient(180deg, #0A1628 0%, #1A2744 100%)',
      borderRight: '1px solid rgba(0,191,255,0.2)',
      boxShadow: '4px 0 20px rgba(0,100,160,0.3)',
    }}>
      <div className="px-6 py-6 border-b border-blue-900/40">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full flex items-center justify-center"
            style={{ background: 'radial-gradient(circle, #00BFFF, #1A2744)' }}>
            <Sparkles size={20} className="text-white" />
          </div>
          <div>
            <h1 className="text-white font-bold text-lg tracking-wide" style={{ fontFamily: 'Cinzel, serif' }}>
              AstroSoul
            </h1>
            <p className="text-cyan-400 text-xs font-medium">Admin Panel</p>
          </div>
        </div>
      </div>

      <nav className="flex-1 py-4">
        {navItems.map(({ page, icon: Icon, label }) => {
          const active = currentPage === page;
          return (
            <button
              key={page}
              onClick={() => onNavigate(page)}
              className="w-full flex items-center gap-3 px-5 py-3.5 text-sm transition-all duration-300 text-left"
              style={{
                color: active ? '#00BFFF' : '#CBD5E1',
                borderLeft: active ? '3px solid #00BFFF' : '3px solid transparent',
                background: active ? 'rgba(0,191,255,0.08)' : 'transparent',
              }}
            >
              <Icon size={18} />
              <span>{label}</span>
            </button>
          );
        })}
      </nav>

      <div className="px-4 py-4 border-t border-blue-900/40">
        <button
          onClick={signOut}
          className="w-full flex items-center gap-3 px-3 py-3 rounded-lg text-sm text-red-400 hover:bg-red-900/20 transition-all duration-200"
        >
          <LogOut size={18} />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
}
