import { useEffect, useState } from 'react';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import StarField from './components/StarField';
import DashboardLayout from './components/DashboardLayout';
import AdminLayout from './components/AdminLayout';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';
import MyZodiacPage from './pages/MyZodiacPage';
import DailyHoroscopePage from './pages/DailyHoroscopePage';
import MonthlyHoroscopePage from './pages/MonthlyHoroscopePage';
import ProfilePage from './pages/ProfilePage';
import AdminDashboardPage from './pages/admin/AdminDashboardPage';
import ManageSignsPage from './pages/admin/ManageSignsPage';
import ManageUsersPage from './pages/admin/ManageUsersPage';
import { Page } from './types';

function AppContent() {
  const { user, profile, loading } = useAuth();
  const [page, setPage] = useState<Page>('landing');

  useEffect(() => {
    if (loading) return;
    if (user && profile) {
      if (profile.role === 'admin') {
        setPage('admin-dashboard');
      } else {
        setPage('dashboard');
      }
    } else if (!user) {
      setPage('landing');
    }
  }, [user, profile, loading]);

  if (loading) {
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

  const isAdminPage = page.startsWith('admin');
  const isPublicPage = page === 'landing' || page === 'login' || page === 'register';
  const isDashboardPage = !isAdminPage && !isPublicPage;

  const renderPage = () => {
    switch (page) {
      case 'landing': return <LandingPage onNavigate={setPage} />;
      case 'login': return <LoginPage onNavigate={setPage} />;
      case 'register': return <RegisterPage onNavigate={setPage} />;
      case 'dashboard': return <DashboardPage onNavigate={setPage} />;
      case 'my-zodiac': return <MyZodiacPage />;
      case 'daily': return <DailyHoroscopePage />;
      case 'monthly': return <MonthlyHoroscopePage />;
      case 'profile': return <ProfilePage />;
      case 'admin-dashboard': return <AdminDashboardPage />;
      case 'admin-signs': return <ManageSignsPage />;
      case 'admin-users': return <ManageUsersPage />;
      default: return <LandingPage onNavigate={setPage} />;
    }
  };

  return (
    <div className="min-h-screen" style={{
      background: 'radial-gradient(ellipse at top, #1A0533 0%, #0A0118 100%)',
    }}>
      <StarField />
      {isDashboardPage ? (
        <DashboardLayout currentPage={page} onNavigate={setPage}>
          {renderPage()}
        </DashboardLayout>
      ) : isAdminPage ? (
        <AdminLayout currentPage={page} onNavigate={setPage}>
          {renderPage()}
        </AdminLayout>
      ) : (
        <div className="relative z-10">
          {renderPage()}
        </div>
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
