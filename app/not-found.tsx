import Link from 'next/link';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { SearchX } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-surface text-on-surface flex flex-col">
      <Navbar />
      <main className="flex-1 flex flex-col items-center justify-center p-8 text-center pt-24">
        <div className="w-20 h-20 bg-teal-50 rounded-full flex items-center justify-center text-teal-600 mb-6">
          <SearchX className="w-10 h-10" />
        </div>
        <h1 className="text-4xl md:text-5xl font-extrabold text-teal-900 mb-4 font-headline tracking-tight">Page Not Found</h1>
        <p className="text-xl text-slate-600 mb-8 max-w-md">
          We couldn't find the page you're looking for. It might have been moved or doesn't exist.
        </p>
        <Link href="/">
          <button className="px-8 py-4 bg-teal-600 text-white rounded-xl font-bold hover:bg-teal-700 transition-colors">
            Return to Home
          </button>
        </Link>
      </main>
      <Footer />
    </div>
  );
}
