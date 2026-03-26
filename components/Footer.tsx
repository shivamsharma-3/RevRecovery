'use client';

import Link from 'next/link';
import { Activity, Globe, Mail } from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-surface-container-low py-12 md:py-16 px-6 md:px-8 border-t border-teal-500/5">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8 md:gap-12">
        <div className="col-span-1 md:col-span-1">
          <div className="flex items-center gap-2 text-xl font-bold text-teal-800 tracking-tighter mb-4 font-headline">
            <Activity className="w-5 h-5 text-teal-600" />
            RevRecover AI
          </div>
          <p className="text-xs text-on-surface-variant leading-relaxed mb-4">
            Clinical-grade revenue recovery for the modern practice. Trusted by thousands of healthcare professionals nationwide.
          </p>
          <div className="flex gap-3">
            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="w-7 h-7 rounded-full bg-surface-container-high flex items-center justify-center text-primary transition-colors cursor-pointer hover:bg-primary-fixed">
              <Globe className="w-3.5 h-3.5" />
            </a>
            <a href="mailto:contact@revrecoverai.com" className="w-7 h-7 rounded-full bg-surface-container-high flex items-center justify-center text-primary transition-colors cursor-pointer hover:bg-primary-fixed">
              <Mail className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>
        <div>
          <h4 className="font-bold text-slate-800 mb-4 uppercase tracking-wider text-[10px]">Solutions</h4>
          <ul className="space-y-2.5 text-xs text-on-surface-variant flex flex-col">
            <Link href="/solutions" className="hover:text-primary transition-colors cursor-pointer">Dental Recovery</Link>
            <Link href="/solutions" className="hover:text-primary transition-colors cursor-pointer">Surgical Centers</Link>
            <Link href="/solutions" className="hover:text-primary transition-colors cursor-pointer">Specialty Clinics</Link>
            <Link href="/solutions" className="hover:text-primary transition-colors cursor-pointer">Enterprise Systems</Link>
          </ul>
        </div>
        <div>
          <h4 className="font-bold text-slate-800 mb-4 uppercase tracking-wider text-[10px]">Platform</h4>
          <ul className="space-y-2.5 text-xs text-on-surface-variant flex flex-col">
            <Link href="/how-it-works" className="hover:text-primary transition-colors cursor-pointer">How it Works</Link>
            <Link href="/solutions" className="hover:text-primary transition-colors cursor-pointer">AI Prediction</Link>
            <Link href="/solutions" className="hover:text-primary transition-colors cursor-pointer">Automated Outreach</Link>
            <Link href="/compliance" className="hover:text-primary transition-colors cursor-pointer">Security & HIPAA</Link>
          </ul>
        </div>
        <div>
          <h4 className="font-bold text-slate-800 mb-4 uppercase tracking-wider text-[10px]">Company</h4>
          <ul className="space-y-2.5 text-xs text-on-surface-variant flex flex-col">
            <Link href="/about" className="hover:text-primary transition-colors cursor-pointer">About Us</Link>
            <Link href="/contact" className="hover:text-primary transition-colors cursor-pointer">Contact</Link>
            <Link href="/case-studies" className="hover:text-primary transition-colors cursor-pointer">Case Studies</Link>
            <Link href="/pricing" className="hover:text-primary transition-colors cursor-pointer">Pricing</Link>
          </ul>
        </div>
      </div>
      <div className="max-w-7xl mx-auto mt-12 md:mt-16 pt-6 border-t border-slate-200 flex flex-col md:flex-row justify-between items-center gap-4 text-[10px] font-medium text-slate-400">
        <div>© 2026 RevRecover AI. All clinical data protected.</div>
        <div className="flex gap-4 md:gap-6">
          <Link href="/legal/privacy" className="hover:text-teal-700 transition-colors">Privacy Policy</Link>
          <Link href="/legal/terms" className="hover:text-teal-700 transition-colors">Terms of Service</Link>
          <button onClick={() => { localStorage.removeItem('cookie-consent'); window.location.reload(); }} className="hover:text-teal-700 transition-colors">Cookie Settings</button>
        </div>
      </div>
    </footer>
  );
}
