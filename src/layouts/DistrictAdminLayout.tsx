import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Navbar } from '../components/navigation/Navbar';
import { Sidebar } from '../components/navigation/Sidebar';
import { MobileNav } from '../components/navigation/MobileNav';
import { RoleSwitcherBanner } from '../components/navigation/RoleSwitcherBanner';

export const DistrictAdminLayout: React.FC = () => {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* Top Demo Banner */}
      <RoleSwitcherBanner />

      {/* Global Navbar */}
      <Navbar
        onToggleSidebar={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        isSidebarOpen={isMobileMenuOpen}
      />

      {/* Body container */}
      <div className="flex-1 flex overflow-hidden">
        {/* Desktop Sidebar */}
        <div className="hidden lg:block">
          <Sidebar
            isCollapsed={isSidebarCollapsed}
            onToggleCollapse={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
          />
        </div>

        {/* Mobile Drawer */}
        {isMobileMenuOpen && (
          <div className="fixed inset-0 z-50 lg:hidden flex">
            <div
              className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs"
              onClick={() => setIsMobileMenuOpen(false)}
            />
            <div className="relative z-10 w-72 max-w-[80vw] h-full bg-slate-900 shadow-2xl">
              <Sidebar onNavigate={() => setIsMobileMenuOpen(false)} />
            </div>
          </div>
        )}

        {/* Main Administrative Command Area */}
        <main className="flex-1 overflow-y-auto px-3 sm:px-6 lg:px-8 py-4 sm:py-6 pb-24 lg:pb-12 max-w-7xl mx-auto w-full">
          <Outlet />
        </main>
      </div>

      {/* Mobile Nav */}
      <MobileNav />
    </div>
  );
};
