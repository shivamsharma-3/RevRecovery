'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/components/AuthProvider';

export const AuthForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);
  const router = useRouter();
  const { login } = useAuth();

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setMessage({ text: 'Please enter both email and password.', type: 'error' });
      return;
    }
    setLoading(true);
    setMessage(null);
    
    // Mock signup
    setTimeout(() => {
      login(email);
      router.push('/dashboard');
      setLoading(false);
    }, 1000);
  };

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setMessage({ text: 'Please enter both email and password.', type: 'error' });
      return;
    }
    setLoading(true);
    setMessage(null);
    
    // Mock login
    setTimeout(() => {
      login(email);
      router.push('/dashboard');
      setLoading(false);
    }, 1000);
  };

  const handleGoogleSignIn = async () => {
    setLoading(true);
    // Mock Google login
    setTimeout(() => {
      login('test@revrecover.ai');
      router.push('/dashboard');
      setLoading(false);
    }, 1000);
  };

  return (
    <div className="max-w-md mx-auto p-8 bg-white rounded-3xl shadow-2xl border border-teal-500/10">
      <h2 className="text-2xl font-bold mb-6 text-teal-800 font-headline">Welcome to RevRecover AI</h2>
      
      <button
        type="button"
        onClick={handleGoogleSignIn}
        disabled={loading}
        className="w-full flex items-center justify-center gap-3 px-4 py-3 border border-slate-200 rounded-xl font-semibold text-slate-700 hover:bg-slate-50 transition-all mb-6 disabled:opacity-50"
      >
        <svg className="w-5 h-5" viewBox="0 0 24 24">
          <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
          <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
          <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/>
          <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
        </svg>
        Continue with Google
      </button>

      <div className="relative mb-6">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-slate-200"></div>
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="px-2 bg-white text-slate-500 font-medium uppercase tracking-wider text-[10px]">or use email</span>
        </div>
      </div>

      <form className="space-y-4" onSubmit={handleSignIn}>
        <div>
          <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-1.5">Email Address</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none transition-all text-sm"
            placeholder="dr.chen@clinic.com"
            required
          />
        </div>
        <div>
          <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-1.5">Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none transition-all text-sm"
            placeholder="••••••••"
            required
          />
        </div>
        <div className="flex flex-col gap-3 pt-2">
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-teal-600 text-white py-3 rounded-xl font-bold hover:bg-teal-700 transition-all shadow-lg shadow-teal-500/20 disabled:opacity-50 active:scale-[0.98]"
          >
            {loading ? 'Processing...' : 'Sign In'}
          </button>
          <button
            type="button"
            onClick={handleSignUp}
            disabled={loading}
            className="w-full bg-slate-50 text-slate-700 py-3 rounded-xl font-bold hover:bg-slate-100 transition-all disabled:opacity-50"
          >
            Create Account
          </button>
        </div>
      </form>

      {message && (
        <div className={`mt-6 p-4 rounded-xl text-sm font-medium text-center ${
          message.type === 'success' ? 'bg-teal-50 text-teal-700 border border-teal-100' : 'bg-red-50 text-red-700 border border-red-100'
        }`}>
          {message.text}
        </div>
      )}

      <p className="mt-6 text-[10px] text-center text-slate-400 font-medium leading-relaxed">
        By continuing, you agree to RevRecover AI's <br />
        <span className="text-teal-600 cursor-pointer hover:underline">Terms of Service</span> and <span className="text-teal-600 cursor-pointer hover:underline">Privacy Policy</span>.
      </p>
    </div>
  );
};
