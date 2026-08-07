'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/components/AuthProvider';
import { TrendingUp, Loader2, Eye, EyeOff } from 'lucide-react';

type Mode = 'signin' | 'signup' | 'reset';

/** Firebase error codes are not user-facing copy. */
function friendlyError(error: any): string {
  const code = error?.code ?? '';
  switch (code) {
    case 'auth/invalid-email':
      return 'That email address does not look right.';
    case 'auth/user-disabled':
      return 'This account has been disabled. Get in touch and we will sort it out.';
    case 'auth/user-not-found':
    case 'auth/wrong-password':
    case 'auth/invalid-credential':
      return 'Email or password is incorrect.';
    case 'auth/email-already-in-use':
      return 'An account already exists with that email. Try signing in instead.';
    case 'auth/weak-password':
      return 'Passwords need to be at least 6 characters.';
    case 'auth/too-many-requests':
      return 'Too many attempts. Wait a minute and try again.';
    case 'auth/network-request-failed':
      return 'Network problem — check your connection and try again.';
    case 'auth/popup-blocked':
      return 'Your browser blocked the popup. Allow popups, or use email instead.';
    case 'auth/unauthorized-domain':
      return 'Google sign-in is not enabled for this domain. Use email and password instead.';
    case 'auth/operation-not-allowed':
      return 'That sign-in method is not enabled for this project.';
    default:
      return error?.message?.replace('Firebase: ', '') || 'Something went wrong. Please try again.';
  }
}

export const AuthForm = () => {
  const [mode, setMode] = useState<Mode>('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [message, setMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  const router = useRouter();
  const { login, loginWithEmail, signUpWithEmail, resetPassword } = useAuth();

  const switchMode = (next: Mode) => {
    setMode(next);
    setMessage(null);
  };

  const handleGoogleSignIn = async () => {
    setGoogleLoading(true);
    setMessage(null);
    try {
      await login();
      router.push('/dashboard');
    } catch (error: any) {
      if (error?.code === 'auth/popup-closed-by-user' || error?.code === 'auth/cancelled-popup-request') {
        return;
      }
      setMessage({ text: friendlyError(error), type: 'error' });
    } finally {
      setGoogleLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
      if (mode === 'reset') {
        await resetPassword(email);
        setMessage({
          text: 'If an account exists for that address, a reset link is on its way.',
          type: 'success',
        });
        return;
      }

      if (mode === 'signup') {
        await signUpWithEmail(email, password, fullName);
      } else {
        await loginWithEmail(email, password);
      }
      router.push('/dashboard');
    } catch (error: any) {
      setMessage({ text: friendlyError(error), type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const heading =
    mode === 'signup' ? 'Create your account' : mode === 'reset' ? 'Reset your password' : 'Welcome back';
  const subheading =
    mode === 'signup'
      ? 'Free for 30 days. No card required.'
      : mode === 'reset'
        ? 'We will email you a link to set a new one.'
        : 'Sign in to access your practice dashboard';

  return (
    <div className="w-full max-w-md mx-auto p-8 bg-white rounded-3xl shadow-2xl border border-slate-100">
      <div className="text-center">
        <div className="w-16 h-16 bg-teal-50 rounded-2xl flex items-center justify-center mx-auto mb-6 text-teal-600">
          <TrendingUp className="w-8 h-8" />
        </div>
        <h2 className="text-2xl font-bold mb-2 text-slate-900">{heading}</h2>
        <p className="text-slate-500 text-sm mb-8">{subheading}</p>
      </div>

      {message && (
        <div
          role="alert"
          className={`p-3 rounded-xl mb-6 text-sm font-medium ${
            message.type === 'error'
              ? 'bg-red-50 text-red-600 border border-red-100'
              : 'bg-teal-50 text-teal-700 border border-teal-100'
          }`}
        >
          {message.text}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4 text-left">
        {mode === 'signup' && (
          <div>
            <label htmlFor="auth-name" className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">
              Full name
            </label>
            <input
              id="auth-name"
              type="text"
              autoComplete="name"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="Jane Doe"
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all"
            />
          </div>
        )}

        <div>
          <label htmlFor="auth-email" className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">
            Work email
          </label>
          <input
            id="auth-email"
            type="email"
            required
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="jane@clinic.com"
            className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all"
          />
        </div>

        {mode !== 'reset' && (
          <div>
            <div className="flex items-center justify-between mb-2">
              <label htmlFor="auth-password" className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                Password
              </label>
              {mode === 'signin' && (
                <button
                  type="button"
                  onClick={() => switchMode('reset')}
                  className="text-[10px] font-bold text-teal-600 hover:text-teal-800 uppercase tracking-widest"
                >
                  Forgot?
                </button>
              )}
            </div>
            <div className="relative">
              <input
                id="auth-password"
                type={showPassword ? 'text' : 'password'}
                required
                minLength={6}
                autoComplete={mode === 'signup' ? 'new-password' : 'current-password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder={mode === 'signup' ? 'At least 6 characters' : '••••••••'}
                className="w-full px-4 py-3 pr-12 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all"
              />
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-600 transition-colors"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full flex items-center justify-center gap-2 px-4 py-3.5 bg-teal-600 text-white rounded-xl font-bold text-sm hover:bg-teal-700 transition-all shadow-lg shadow-teal-500/20 disabled:opacity-60 active:scale-[0.98]"
        >
          {loading && <Loader2 className="w-4 h-4 animate-spin" />}
          {loading
            ? 'Working…'
            : mode === 'signup'
              ? 'Create account'
              : mode === 'reset'
                ? 'Send reset link'
                : 'Sign in'}
        </button>
      </form>

      {mode !== 'reset' && (
        <>
          <div className="flex items-center gap-4 my-6">
            <div className="flex-1 h-px bg-slate-100" />
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">or</span>
            <div className="flex-1 h-px bg-slate-100" />
          </div>

          <button
            type="button"
            onClick={handleGoogleSignIn}
            disabled={googleLoading}
            className="w-full flex items-center justify-center gap-3 px-4 py-3.5 border border-slate-200 rounded-xl font-semibold text-slate-700 hover:bg-slate-50 transition-all disabled:opacity-50 shadow-sm active:scale-[0.98]"
          >
            {googleLoading ? (
              <Loader2 className="w-5 h-5 animate-spin text-teal-600" />
            ) : (
              <>
                <svg className="w-5 h-5" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/>
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                </svg>
                Continue with Google
              </>
            )}
          </button>
        </>
      )}

      <div className="text-center text-xs text-slate-500 mt-6 font-medium">
        {mode === 'signin' && (
          <>
            New here?{' '}
            <button onClick={() => switchMode('signup')} className="text-teal-600 font-bold hover:underline">
              Create an account
            </button>
          </>
        )}
        {mode === 'signup' && (
          <>
            Already have an account?{' '}
            <button onClick={() => switchMode('signin')} className="text-teal-600 font-bold hover:underline">
              Sign in
            </button>
          </>
        )}
        {mode === 'reset' && (
          <button onClick={() => switchMode('signin')} className="text-teal-600 font-bold hover:underline">
            Back to sign in
          </button>
        )}
      </div>

      <div className="text-center text-[11px] text-slate-400 mt-6">
        By continuing, you agree to our <br />
        <Link href="/legal/terms" className="text-teal-600 hover:underline">Terms of Service</Link> and{' '}
        <Link href="/legal/privacy" className="text-teal-600 hover:underline">Privacy Policy</Link>.
      </div>
    </div>
  );
};
