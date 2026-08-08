'use client';

import Link from 'next/link';
import { AuthForm } from '@/components/AuthForm';
import { useAuth } from '@/components/AuthProvider';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function AuthPage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (user && !loading) {
      router.push('/dashboard');
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-teal-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-12">
          <Link href="/" className="inline-block hover:opacity-80 transition-opacity">
            <h1 className="text-4xl font-extrabold text-teal-800 tracking-tighter mb-2">RevRecover AI</h1>
          </Link>
          <p className="text-slate-500 font-medium">Denial triage and appeal drafting for practices</p>
        </div>
        <AuthForm />
        <div className="text-center mt-8">
          <Link href="/" className="text-sm font-semibold text-slate-500 hover:text-teal-700 transition-colors">
            ← Back to site
          </Link>
        </div>
      </div>
    </div>
  );
}
