import { useEffect, useRef, useState } from 'react';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import StarField from './components/StarField';
import DashboardLayout from './components/DashboardLayout';
import AdminLayout from './components/AdminLayout';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage'; //
import AdminRegisterPage from "./pages/admin/AdminRegisterPage";
import MyZodiacPage from './pages/MyZodiacPage';
import DailyHoroscopePage from './pages/DailyHoroscopePage';
import MonthlyHoroscopePage from './pages/MonthlyHoroscopePage';
import ProfilePage from './pages/ProfilePage';
import AdminDashboardPage from './pages/admin/AdminDashboardPage';
import ManageSignsPage from './pages/admin/ManageSignsPage';
import ManageUsersPage from './pages/admin/ManageUsersPage';
import { Page } from './types';

function LoadingScreen() {
  return (
    <div className="min-h-screen flex items-center justify-center"
      style={{ background: 'radial-gradient(ellipse at top, #1A0533 0%, #0A0118 100%)' }}>
      <StarField />
      <div className="relative z-10 text-center">
        <div className="text-5xl mb-4 animate-pulse">✦</div>
        <p className="text-purple-300 text-sm tracking-widest uppercase">Aligning the stars...</p>
      </div>
    </div>
  );
}

const PUBLIC_PAGES: Page[]    = ['landing', 'login', 'register', 'admin-register'];
const PROTECTED_PAGES: Page[] = ['dashboard', 'my-zodiac', 'daily', 'monthly', 'profile',
                                  'admin-dashboard', 'admin-signs', 'admin-users'];

function AppContent() {
  const { user, profile, loading } = useAuth();
  const [page, setPage] = useState<Page>('landing');

  // Track whether the current page was set intentionally by the user
  // (via a login/register action) vs. by the auto-routing effect.
  // This prevents the auth effect from overriding a freshly-set page.
  const intentionalNavRef = useRef(false);

  // ── NAVIGATION HANDLER ──────────────────────────────────────────────────
  // All navigation goes through here. We mark it as intentional so the
  // auth effect doesn't immediately override it.
  function navigate(target: Page) {
    intentionalNavRef.current = true;
    setPage(target);
    // Reset after one tick — the auth effect will have already run by then
    setTimeout(() => { intentionalNavRef.current = false; }, 100);
  }

  // ── AUTH-DRIVEN ROUTING ─────────────────────────────────────────────────
  useEffect(() => {
    if (loading) return;
    // Don't override a page that was just intentionally set by the user
    if (intentionalNavRef.current) return;

    if (!user) {
      // Signed out: kick off protected pages only
      if (PROTECTED_PAGES.includes(page)) {
        setPage('landing');
      }
    } else if (user && profile) {
      // Signed in with profile: redirect away from public pages only
      if (PUBLIC_PAGES.includes(page)) {
        setPage(profile.role === 'admin' ? 'admin-dashboard' : 'dashboard');
      }
      // If on a protected page already — stay there, no matter what
    }
    // user && !profile: profile still loading from DB — do nothing
  }, [user, profile, loading, page]);

  if (loading) return <LoadingScreen />;

  const isAdminPage     = page.startsWith('admin-') && page !== 'admin-register';
  const isPublicPage    = PUBLIC_PAGES.includes(page);
  const isDashboardPage = !isAdminPage && !isPublicPage;

  const renderPage = () => {
    switch (page) {
      case 'landing':         return <LandingPage        onNavigate={navigate} />;
      case 'login':           return <LoginPage           onNavigate={navigate} />;
      case 'register':        return <RegisterPage        onNavigate={navigate} />;
      case 'admin-register':  return <AdminRegisterPage   onNavigate={navigate} />;
      case 'dashboard':       return <DashboardPage       onNavigate={navigate} />;
      case 'my-zodiac':       return <MyZodiacPage />;
      case 'daily':           return <DailyHoroscopePage />;
      case 'monthly':         return <MonthlyHoroscopePage />;
      case 'profile':         return <ProfilePage />;
      case 'admin-dashboard': return <AdminDashboardPage />;
      case 'admin-signs':     return <ManageSignsPage />;
      case 'admin-users':     return <ManageUsersPage />;
      default:                return <LandingPage onNavigate={navigate} />;
    }
  };

  return (
    <div className="min-h-screen"
      style={{ background: 'radial-gradient(ellipse at top, #1A0533 0%, #0A0118 100%)' }}>
      <StarField />
      {isDashboardPage ? (
        <DashboardLayout currentPage={page} onNavigate={navigate}>
          {renderPage()}
        </DashboardLayout>
      ) : isAdminPage ? (
        <AdminLayout currentPage={page} onNavigate={navigate}>
          {renderPage()}
        </AdminLayout>
      ) : (
        <div className="relative z-10">{renderPage()}</div>
      )}
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}