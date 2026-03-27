'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useAuth } from '@/components/AuthProvider';
import OnboardingTour from '@/components/OnboardingTour';
import { useRouter, usePathname } from 'next/navigation';
import { 
  Activity, ChevronLeft, ChevronRight, LayoutDashboard, 
  Megaphone, Users, CreditCard, Settings, LogOut, 
  Menu, Bell, Search, HelpCircle, PlusCircle, FileText, BarChart3,
  Banknote, TrendingUp, Stethoscope, History, X
} from 'lucide-react';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { user, loading, logout } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [isMounted, setIsMounted] = useState(true);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    /* Redirect to auth commented out for testing
    if (!loading && !user) {
      router.push('/auth');
    }
    */
  }, [user, loading, router]);

  const handleSignOut = async () => {
    logout();
    router.push('/');
  };

  if (!isMounted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-surface text-on-surface">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  const navItems = [
    { name: 'Recovery Engine', href: '/dashboard', icon: LayoutDashboard },
    { name: 'Campaigns', href: '/dashboard/campaigns', icon: Megaphone },
    { name: 'Patients', href: '/dashboard/patients', icon: Users },
    { name: 'Recovery Queue', href: '/dashboard/recovery', icon: CreditCard },
  ];

  const mainNavItems = [
    { name: 'Executive', href: '/dashboard', icon: LayoutDashboard },
    { name: 'Claims', href: '/dashboard/claims', icon: Banknote },
    { name: 'Analytics', href: '/dashboard/analytics', icon: TrendingUp },
    { name: 'Insights', href: '/dashboard/clinic', icon: Stethoscope },
    { name: 'Audit', href: '/dashboard/audit', icon: History },
    { name: 'Settings', href: '/dashboard/settings', icon: Settings },
  ];

  const showSecondarySidebar = navItems.some(item => pathname === item.href || (item.href !== '/dashboard' && pathname.startsWith(item.href)));

  return (
    <div className="bg-slate-50 text-slate-900 min-h-screen flex flex-col md:flex-row overflow-hidden">
      {/* Primary Rail (Thin) */}
      <aside className="hidden md:flex flex-col w-20 bg-[#050b18] text-slate-400 border-r border-slate-800 z-50">
        <div className="p-6 flex items-center justify-center">
          <Link href="/" className="hover:opacity-80 transition-opacity">
            <Activity className="w-6 h-6 text-teal-400" />
          </Link>
        </div>
        <nav className="flex-grow px-2 py-4 space-y-4">
          {mainNavItems.map((item) => {
            const isActive = pathname === item.href || (item.href !== '/dashboard' && pathname.startsWith(item.href));
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`flex flex-col items-center gap-1 p-2 rounded-xl transition-all group ${
                  isActive ? 'bg-[#0d2a2d] text-teal-400' : 'hover:bg-white/5 hover:text-white'
                }`}
                title={item.name}
              >
                <item.icon className={`w-5 h-5 ${isActive ? 'text-teal-400' : 'text-slate-500 group-hover:text-white'}`} />
                <span className="text-[10px] font-bold uppercase tracking-tighter opacity-60 group-hover:opacity-100">{item.name}</span>
              </Link>
            );
          })}
        </nav>
        <div className="p-4 mt-auto border-t border-slate-800/50 flex flex-col items-center gap-4">
          <Link href="/dashboard/help" className="p-2 hover:bg-white/5 rounded-lg text-slate-500 hover:text-white transition-all" title="Help Center">
            <HelpCircle className="w-5 h-5" />
          </Link>
          <button onClick={handleSignOut} className="p-2 hover:bg-white/5 rounded-lg text-slate-500 hover:text-white transition-all" title="Sign Out">
            <LogOut className="w-5 h-5" />
          </button>
        </div>
      </aside>

      {/* Secondary Sidebar (Wider) - Only shown on specific pages */}
      {showSecondarySidebar && (
        <aside className={`hidden md:flex flex-col bg-white border-r border-slate-200 transition-all duration-300 ease-in-out ${isSidebarCollapsed ? 'w-0 overflow-hidden opacity-0' : 'w-64'}`}>
          <div className="p-6 flex items-center justify-between border-b border-slate-100">
            <h2 className="text-sm font-black uppercase tracking-widest text-slate-400">Recovery Engine</h2>
            <button 
              onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
              className="p-1.5 rounded-lg hover:bg-slate-50 text-slate-400 transition-all"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
          </div>
          <nav className="p-4 space-y-1">
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-semibold text-sm ${
                    isActive ? 'bg-teal-50 text-teal-700' : 'text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  <item.icon className={`w-4 h-4 ${isActive ? 'text-teal-600' : 'text-slate-400'}`} />
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </nav>
          <div className="mt-auto p-4 space-y-4">
            <Link 
              href="/dashboard/recovery" 
              className="flex items-center justify-center gap-2 w-full py-3 bg-teal-600 hover:bg-teal-700 text-white rounded-xl font-bold transition-all shadow-lg shadow-teal-900/20"
            >
              <PlusCircle className="w-4 h-4" />
              <span className="text-xs">New Recovery Case</span>
            </Link>
            <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-2 h-2 bg-teal-500 rounded-full animate-pulse" />
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">System Status</span>
              </div>
              <p className="text-[11px] text-slate-600 font-medium leading-relaxed">AI Engine is currently processing 142 claims across 3 clinics.</p>
            </div>
          </div>
        </aside>
      )}

      {/* Mobile Header */}
      <header className="md:hidden bg-white border-b border-slate-200 px-4 py-3 flex items-center justify-between sticky top-0 z-[60]">
        <Link href="/" className="flex items-center gap-2">
          <Activity className="w-5 h-5 text-teal-600" />
          <span className="text-lg font-bold tracking-tighter text-teal-800 font-headline">RevRecover AI</span>
        </Link>
        <button 
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="p-1.5 text-slate-600 hover:bg-slate-50 rounded-lg"
        >
          <Menu className="w-5 h-5" />
        </button>
      </header>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div className="md:hidden fixed inset-0 bg-black/50 z-[70]" onClick={() => setIsMobileMenuOpen(false)}>
          <div className="absolute right-0 top-0 h-full w-64 bg-white p-6 shadow-2xl animate-in slide-in-from-right duration-300" onClick={e => e.stopPropagation()}>
            <div className="flex justify-between items-center mb-8">
              <h3 className="text-xl font-bold text-teal-800">Menu</h3>
              <button onClick={() => setIsMobileMenuOpen(false)} className="p-2 text-slate-500"><X className="w-6 h-6" /></button>
            </div>
            <nav className="space-y-4">
              <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Executive</div>
              {mainNavItems.map((item) => (
                <Link 
                  key={item.name}
                  href={item.href} 
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl font-semibold transition-all ${
                    pathname === item.href ? 'bg-teal-50 text-teal-700' : 'text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  <item.icon className={`w-5 h-5 ${pathname === item.href ? 'text-teal-600' : 'text-slate-400'}`} />
                  <span>{item.name}</span>
                </Link>
              ))}
              <hr className="border-slate-100" />
              <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Recovery Engine</div>
              {navItems.map((item) => (
                <Link 
                  key={item.name}
                  href={item.href} 
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl font-semibold transition-all ${
                    pathname === item.href ? 'bg-teal-50 text-teal-700' : 'text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  <item.icon className={`w-5 h-5 ${pathname === item.href ? 'text-teal-600' : 'text-slate-400'}`} />
                  <span>{item.name}</span>
                </Link>
              ))}
              <hr className="border-slate-100" />
              <button 
                onClick={handleSignOut}
                className="w-full flex items-center gap-3 px-4 py-3 text-red-600 hover:bg-red-50 rounded-xl font-bold transition-all"
              >
                <LogOut className="w-5 h-5" />
                <span>Sign Out</span>
              </button>
            </nav>
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <div className="flex-1 overflow-y-auto h-screen relative pb-24 md:pb-0">
        {isSidebarCollapsed && (
          <button 
            onClick={() => setIsSidebarCollapsed(false)}
            className="hidden md:flex absolute top-6 left-6 z-40 p-2 bg-white shadow-md border border-slate-200 rounded-lg text-slate-400 hover:text-teal-600 transition-all"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        )}
        
        {/* Breadcrumbs */}
        {pathname !== '/dashboard' && (
          <div className="px-6 md:px-10 pt-6 pb-2 flex items-center gap-2 text-sm font-medium text-slate-500">
            <Link href="/dashboard" className="hover:text-teal-600 transition-colors">Dashboard</Link>
            <ChevronRight className="w-4 h-4 text-slate-400" />
            <span className="text-slate-900 capitalize">
              {pathname.split('/').pop()?.replace(/-/g, ' ')}
            </span>
          </div>
        )}

        {children}
      </div>

      <OnboardingTour />

      {/* Floating Action Button (Mobile) */}
      <Link 
        href="/dashboard/recovery" 
        className="md:hidden fixed bottom-24 right-6 w-14 h-14 bg-[#1a1a1a] text-white rounded-full flex items-center justify-center shadow-2xl z-[55] active:scale-95 transition-transform border border-white/10"
      >
        <PlusCircle className="w-6 h-6" />
      </Link>

      {/* Bottom NavBar (Mobile) */}
      <nav className="md:hidden fixed bottom-0 left-0 w-full flex justify-around items-center px-2 pb-6 pt-2 bg-white/90 backdrop-blur-lg z-50 border-t border-slate-100">
        <Link href="/dashboard" className={`flex flex-col items-center justify-center rounded-xl px-2 py-1 ${pathname === '/dashboard' ? 'bg-teal-50 text-teal-700' : 'text-slate-400'}`}>
          <LayoutDashboard className="w-5 h-5" />
          <span className="font-inter text-[9px] font-bold uppercase tracking-wider mt-0.5">Home</span>
        </Link>
        <Link href="/dashboard/claims" className={`flex flex-col items-center justify-center rounded-xl px-2 py-1 ${pathname === '/dashboard/claims' ? 'bg-teal-50 text-teal-700' : 'text-slate-400'}`}>
          <Banknote className="w-5 h-5" />
          <span className="font-inter text-[9px] font-bold uppercase tracking-wider mt-0.5">Claims</span>
        </Link>
        <Link href="/dashboard/analytics" className={`flex flex-col items-center justify-center rounded-xl px-2 py-1 ${pathname === '/dashboard/analytics' ? 'bg-teal-50 text-teal-700' : 'text-slate-400'}`}>
          <TrendingUp className="w-5 h-5" />
          <span className="font-inter text-[9px] font-bold uppercase tracking-wider mt-0.5">Stats</span>
        </Link>
        <Link href="/dashboard/settings" className={`flex flex-col items-center justify-center rounded-xl px-2 py-1 ${pathname === '/dashboard/settings' ? 'bg-teal-50 text-teal-700' : 'text-slate-400'}`}>
          <Settings className="w-5 h-5" />
          <span className="font-inter text-[9px] font-bold uppercase tracking-wider mt-0.5">Settings</span>
        </Link>
      </nav>
    </div>
  );
}
