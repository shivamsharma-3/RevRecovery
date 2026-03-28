'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  LayoutDashboard, Megaphone, Users, CreditCard, 
  Settings, BarChart3, Banknote, LogOut, PlusCircle
} from 'lucide-react';
import { useAuth } from './AuthProvider';

export function DashboardSidebar() {
  const pathname = usePathname();
  const { logout } = useAuth();

  const menuItems = [
    { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    { name: 'Campaigns', href: '/dashboard/campaigns', icon: Megaphone },
    { name: 'Patients', href: '/dashboard/patients', icon: Users },
    { name: 'Recovery Queue', href: '/dashboard/recovery', icon: CreditCard },
    { name: 'Claims', href: '/dashboard/claims', icon: Banknote },
    { name: 'Reports', href: '/dashboard/analytics', icon: BarChart3 },
  ];

  const accountItems = [
    { name: 'Settings', href: '/dashboard/settings', icon: Settings },
  ];

  return (
    <aside className="hidden lg:flex flex-col w-64 bg-white border-r border-slate-200 p-6 space-y-8 h-full overflow-y-auto">
      <div>
        <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-4">Main Menu</h3>
        <nav className="space-y-1">
          {menuItems.map((item) => {
            const isActive = pathname === item.href || (item.href !== '/dashboard' && pathname.startsWith(item.href));
            return (
              <Link 
                key={item.name}
                href={item.href} 
                className={`flex items-center gap-3 px-4 py-2.5 rounded-xl font-semibold text-sm transition-all ${
                  isActive 
                    ? 'bg-teal-50 text-teal-700 shadow-sm' 
                    : 'text-slate-600 hover:bg-slate-50 hover:text-teal-600'
                }`}
              >
                <item.icon className={`w-4 h-4 ${isActive ? 'text-teal-600' : 'text-slate-400'}`} />
                <span>{item.name}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      <div>
        <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-4">Account</h3>
        <nav className="space-y-1">
          {accountItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link 
                key={item.name}
                href={item.href} 
                className={`flex items-center gap-3 px-4 py-2.5 rounded-xl font-semibold text-sm transition-all ${
                  isActive 
                    ? 'bg-teal-50 text-teal-700 shadow-sm' 
                    : 'text-slate-600 hover:bg-slate-50 hover:text-teal-600'
                }`}
              >
                <item.icon className={`w-4 h-4 ${isActive ? 'text-teal-600' : 'text-slate-400'}`} />
                <span>{item.name}</span>
              </Link>
            );
          })}
          <button 
            onClick={() => logout()}
            className="w-full flex items-center gap-3 px-4 py-2.5 text-red-600 hover:bg-red-50 rounded-xl font-semibold text-sm transition-colors"
          >
            <LogOut className="w-4 h-4" />
            <span>Logout</span>
          </button>
        </nav>
      </div>

      <div className="mt-auto">
        <div className="bg-teal-900 rounded-2xl p-5 text-white shadow-lg shadow-teal-900/20 relative overflow-hidden group">
          <div className="relative z-10">
            <p className="text-xs font-bold mb-1">Pro Plan Active</p>
            <p className="text-[10px] text-teal-100/70 leading-relaxed mb-4">You have recovered $12k more than last month!</p>
            <Link 
              href="/pricing" 
              className="inline-flex items-center gap-1.5 text-[10px] font-bold bg-white/10 hover:bg-white/20 px-3 py-1.5 rounded-lg transition-colors"
            >
              <span>View Plans</span>
              <PlusCircle className="w-3 h-3" />
            </Link>
          </div>
          <div className="absolute -right-6 -bottom-6 w-24 h-24 bg-teal-800 rounded-full blur-2xl opacity-50 group-hover:opacity-80 transition-opacity" />
        </div>
      </div>
    </aside>
  );
}
