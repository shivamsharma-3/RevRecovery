'use client';

import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import Link from 'next/link';

export function CookieConsent() {
  const [showConsent, setShowConsent] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem('cookie-consent');
    if (!consent) {
      setTimeout(() => setShowConsent(true), 0);
    }
  }, []);

  const acceptCookies = () => {
    localStorage.setItem('cookie-consent', 'true');
    setShowConsent(false);
  };

  if (!showConsent) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 p-4 md:p-6 pointer-events-none">
      <div className="max-w-4xl mx-auto bg-white border border-teal-500/20 shadow-2xl rounded-2xl p-6 md:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 pointer-events-auto animate-in slide-in-from-bottom-10 duration-500">
        <div className="flex-1">
          <h3 className="text-lg font-bold text-teal-900 mb-2">We value your privacy</h3>
          <p className="text-sm text-slate-600 leading-relaxed">
            We use cookies to enhance your browsing experience, serve personalized content, and analyze our traffic. By clicking "Accept All", you consent to our use of cookies. Read our <Link href="/legal/privacy" className="text-teal-700 font-semibold hover:underline">Privacy Policy</Link> to learn more.
          </p>
        </div>
        <div className="flex items-center gap-3 w-full md:w-auto">
          <button 
            onClick={() => setShowConsent(false)}
            className="flex-1 md:flex-none px-6 py-2.5 rounded-xl font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 transition-colors text-sm"
          >
            Decline
          </button>
          <button 
            onClick={acceptCookies}
            className="flex-1 md:flex-none px-6 py-2.5 rounded-xl font-semibold text-white bg-teal-600 hover:bg-teal-700 transition-colors shadow-lg shadow-teal-500/20 text-sm"
          >
            Accept All
          </button>
          <button 
            onClick={() => setShowConsent(false)}
            className="p-2 text-slate-400 hover:text-slate-600 transition-colors md:hidden"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}
