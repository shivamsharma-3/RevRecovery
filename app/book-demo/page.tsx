import React from 'react';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';

export default async function BookDemoPage({ searchParams }: { searchParams: Promise<{ solution?: string }> }) {
  const { solution } = await searchParams;
  
  const solutionNames: Record<string, string> = {
    dental: 'Dental Practices',
    surgical: 'Surgical Centers',
    specialty: 'Specialty Clinics',
    enterprise: 'Enterprise Systems'
  };
  
  const solutionName = solution ? solutionNames[solution] : null;

  return (
    <div className="min-h-screen bg-surface text-on-surface flex flex-col">
      <Navbar />
      <main className="flex-grow pt-32 pb-24 px-6 max-w-3xl mx-auto w-full">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-extrabold text-teal-900 mb-4 font-headline tracking-tight">Schedule a Personalized Demo</h1>
          <p className="text-lg text-slate-600">
            Choose a time that works for you to see how RevRecover AI can help your practice.
          </p>
          {solutionName && (
            <div className="mt-4 inline-flex items-center gap-2 px-4 py-2 rounded-full bg-teal-50 text-teal-700 font-medium border border-teal-100">
              <span>Interested in:</span>
              <span className="font-bold">{solutionName}</span>
            </div>
          )}
        </div>
        
        <div className="bg-white rounded-[2rem] shadow-xl border border-slate-100 p-8 md:p-12 text-center">
          <div className="w-20 h-20 bg-teal-50 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-10 h-10 text-teal-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-slate-900 mb-4">Calendly Integration Placeholder</h2>
          <p className="text-slate-600 mb-8">
            In a production environment, an interactive Calendly widget would be embedded here, allowing you to select a date and time for your demo.
          </p>
          <a href={`/contact${solution ? `?solution=${solution}` : ''}`} className="inline-flex items-center justify-center px-8 py-4 bg-teal-600 text-white font-bold rounded-xl hover:bg-teal-700 transition-colors">
            Contact Us Instead
          </a>
        </div>
      </main>
      <Footer />
    </div>
  );
}
