'use client';

import Link from 'next/link';
import { useState } from 'react';
import { useAuth } from './AuthProvider';
import { useRouter, usePathname } from 'next/navigation';
import { Activity, Menu, X } from 'lucide-react';

export function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, loading, logout } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  const handleSignOut = async () => {
    logout();
    router.push('/');
    setIsMenuOpen(false);
  };

  return (
    <nav className="fixed top-0 w-full z-50 bg-white/85 backdrop-blur-md border-b border-teal-500/10 shadow-sm">
      <div className="flex justify-between items-center h-14 px-5 md:px-6 max-w-7xl mx-auto">
        <div className="flex items-center gap-2.5">
          <Link href="/" className="flex items-center gap-1.5 text-lg font-bold tracking-tighter text-teal-800 font-headline">
            <Activity className="w-5 h-5 text-teal-600" />
            RevRecover AI
          </Link>
        </div>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center space-x-6">
          <Link 
            href="/how-it-works" 
            className={`${pathname === '/how-it-works' ? 'text-teal-600 border-b-2 border-teal-600' : 'text-slate-600 hover:text-teal-600'} transition-all font-headline tracking-tight font-semibold py-1 text-sm`}
          >
            How it Works
          </Link>
          <Link 
            href="/solutions" 
            className={`${pathname === '/solutions' ? 'text-teal-600 border-b-2 border-teal-600' : 'text-slate-600 hover:text-teal-600'} transition-all font-headline tracking-tight font-semibold py-1 text-sm`}
          >
            Solutions
          </Link>
          <Link 
            href="/pricing" 
            className={`${pathname === '/pricing' ? 'text-teal-600 border-b-2 border-teal-600' : 'text-slate-600 hover:text-teal-600'} transition-all font-headline tracking-tight font-semibold py-1 text-sm`}
          >
            Pricing
          </Link>
          <Link 
            href="/case-studies" 
            className={`${pathname === '/case-studies' ? 'text-teal-600 border-b-2 border-teal-600' : 'text-slate-600 hover:text-teal-600'} transition-all font-headline tracking-tight font-semibold py-1 text-sm`}
          >
            Case Studies
          </Link>
          <Link 
            href="/compliance" 
            className={`${pathname === '/compliance' ? 'text-teal-600 border-b-2 border-teal-600' : 'text-slate-600 hover:text-teal-600'} transition-all font-headline tracking-tight font-semibold py-1 text-sm`}
          >
            Compliance
          </Link>
        </div>

        <div className="flex items-center space-x-3">
          {!loading && (
            <>
              {user ? (
                <>
                  <Link href="/dashboard" className="hidden md:block text-slate-600 hover:text-teal-700 font-semibold px-3 py-1.5 transition-colors text-sm">Dashboard</Link>
                  <button 
                    onClick={handleSignOut}
                    className="hidden md:block bg-slate-100 text-slate-700 px-4 py-1.5 rounded-lg font-semibold shadow-sm hover:bg-slate-200 transition-all text-xs md:text-sm"
                  >
                    Sign Out
                  </button>
                </>
              ) : (
                <>
                  <Link href="/dashboard" className="hidden md:block text-slate-600 hover:text-teal-700 font-semibold px-3 py-1.5 transition-colors text-sm">Login</Link>
                  <Link href="/dashboard" className="hidden md:block bg-gradient-to-b from-primary to-primary-container text-on-primary px-4 py-1.5 rounded-lg font-semibold shadow-sm hover:opacity-90 transition-all text-xs md:text-sm">
                    Get Started
                  </Link>
                </>
              )}
            </>
          )}
          
          {/* Mobile Hamburger Menu */}
          <button 
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="text-teal-700 md:hidden p-1.5 hover:bg-teal-50 rounded-lg transition-colors ml-1"
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      {isMenuOpen && (
        <div className="md:hidden absolute top-14 left-0 w-full bg-white border-b border-teal-500/10 shadow-xl p-5 space-y-3 animate-in fade-in slide-in-from-top-4 duration-200">
          <Link 
            href="/how-it-works" 
            onClick={() => setIsMenuOpen(false)} 
            className={`block text-base font-semibold ${pathname === '/how-it-works' ? 'text-teal-600' : 'text-slate-700 hover:text-teal-600'}`}
          >
            How it Works
          </Link>
          <Link 
            href="/solutions" 
            onClick={() => setIsMenuOpen(false)} 
            className={`block text-base font-semibold ${pathname === '/solutions' ? 'text-teal-600' : 'text-slate-700 hover:text-teal-600'}`}
          >
            Solutions
          </Link>
          <Link 
            href="/pricing" 
            onClick={() => setIsMenuOpen(false)} 
            className={`block text-base font-semibold ${pathname === '/pricing' ? 'text-teal-600' : 'text-slate-700 hover:text-teal-600'}`}
          >
            Pricing
          </Link>
          <Link 
            href="/case-studies" 
            onClick={() => setIsMenuOpen(false)} 
            className={`block text-base font-semibold ${pathname === '/case-studies' ? 'text-teal-600' : 'text-slate-700 hover:text-teal-600'}`}
          >
            Case Studies
          </Link>
          <Link 
            href="/compliance" 
            onClick={() => setIsMenuOpen(false)} 
            className={`block text-base font-semibold ${pathname === '/compliance' ? 'text-teal-600' : 'text-slate-700 hover:text-teal-600'}`}
          >
            Compliance
          </Link>
          <hr className="border-slate-100" />
          {user ? (
            <>
              <Link href="/dashboard" onClick={() => setIsMenuOpen(false)} className="block text-base font-semibold text-teal-700">Go to Dashboard</Link>
              <button onClick={handleSignOut} className="block text-base font-semibold text-slate-600 hover:text-teal-700 text-left w-full">Sign Out</button>
            </>
          ) : (
            <Link href="/dashboard" onClick={() => setIsMenuOpen(false)} className="block text-base font-semibold text-teal-700">Login / Sign Up</Link>
          )}
        </div>
      )}
    </nav>
  );
}
