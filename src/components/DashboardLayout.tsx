import { ReactNode } from 'react';
import Sidebar from './Sidebar';
import { Page } from '../types';

interface DashboardLayoutProps {
  children: ReactNode;
  currentPage: Page;
  onNavigate: (page: Page) => void;
}

export default function DashboardLayout({ children, currentPage, onNavigate }: DashboardLayoutProps) {
  return (
    <div className="min-h-screen flex">
      <Sidebar currentPage={currentPage} onNavigate={onNavigate} />
      <main className="ml-64 flex-1 min-h-screen overflow-y-auto" style={{ background: 'transparent' }}>
        {children}
      </main>
    </div>
  );
}
