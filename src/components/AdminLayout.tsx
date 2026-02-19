import { ReactNode } from 'react';
import AdminSidebar from './AdminSidebar';
import { Page } from '../types';

interface AdminLayoutProps {
  children: ReactNode;
  currentPage: Page;
  onNavigate: (page: Page) => void;
}

export default function AdminLayout({ children, currentPage, onNavigate }: AdminLayoutProps) {
  return (
    <div className="min-h-screen flex">
      <AdminSidebar currentPage={currentPage} onNavigate={onNavigate} />
      <main className="ml-64 flex-1 min-h-screen overflow-y-auto" style={{ background: 'transparent' }}>
        {children}
      </main>
    </div>
  );
}
