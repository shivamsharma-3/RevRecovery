'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { LoginModal } from '@/components/LoginModal';
import { Photo } from '@/components/Photo';
import { TryItDemo } from '@/components/TryItDemo';
import { PlayCircle, TrendingUp, Brain, CreditCard, Shield, CheckCircle } from 'lucide-react';
import { useAuth } from '@/components/AuthProvider';

/** Denial categories the engine is calibrated for, scrolled in the trust strip. */
const DENIAL_REASONS = [
  'Missing documentation',
  'Coordination of benefits',
  'Coding errors',
  'Timely filing',
  'Medical necessity',
  'Prior authorisation',
  'Frequency limitations',
  'Bundling and NCCI edits',
  'Eligibility lapses',
  'Alternate benefit downgrades',
];

export default function LandingPage() {
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const { user } = useAuth();

  const handleStartTrial = (e: React.MouseEvent) => {
    if (!user) {
      e.preventDefault();
      setIsLoginModalOpen(true);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <Navbar />
      <main className="pt-14">
        {/* Hero Section */}
        <section className="relative overflow-hidden pt-16 md:pt-24 pb-20 md:pb-28 px-6">
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center gap-12 lg:gap-16">
            <div className="flex-1 text-left z-10">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-100 text-teal-800 text-[10px] font-bold mb-6 tracking-wider uppercase">
                <span className="relative flex h-1.5 w-1.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-teal-500 opacity-75" />
                  <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-teal-600" />
                </span>
                EARLY ACCESS — NOW ONBOARDING PRACTICES
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-slate-900 leading-[1.05] tracking-tighter mb-6 font-headline">
                Stop writing off <span className="text-teal-600">recoverable</span> revenue
              </h1>
              <p className="text-base md:text-lg text-slate-600 max-w-xl mb-6 leading-relaxed font-medium">
                RevRecover AI reads your denied claims, tells you which ones are actually worth
                chasing, and drafts the appeal letter for you. Built for dental and medical practices
                that don&apos;t have a full-time billing team.
              </p>

              {/* Three-point summary — gives the hero substance without another scroll */}
              <ul className="space-y-2.5 mb-9">
                {[
                  'Import your denials from a CSV export in one step',
                  'Every claim gets a recovery probability and a next action',
                  'Contractual denials are flagged so you stop chasing them',
                ].map((point) => (
                  <li key={point} className="flex items-start gap-2.5 text-sm text-slate-600 font-medium">
                    <CheckCircle className="w-4 h-4 text-teal-600 shrink-0 mt-0.5" />
                    {point}
                  </li>
                ))}
              </ul>
              <div className="flex flex-col sm:flex-row gap-3">
                <Link href="/dashboard" onClick={handleStartTrial} className="w-full sm:w-auto">
                  <button className="w-full sm:w-auto bg-teal-600 text-white text-sm px-6 py-3.5 rounded-xl font-bold transition-all hover:bg-teal-700 shadow-lg shadow-teal-500/20 active:scale-[0.98]">
                    Get Started
                  </button>
                </Link>
                <a href="#try-it" className="w-full sm:w-auto">
                  <button className="w-full sm:w-auto bg-white text-slate-700 text-sm px-6 py-3.5 rounded-xl font-bold flex items-center justify-center gap-2 border border-slate-200 hover:bg-slate-50 transition-colors">
                    <PlayCircle className="w-4 h-4 text-teal-600" />
                    Try it on a denial
                  </button>
                </a>
              </div>
            </div>
            <div className="flex-1 relative w-full mt-10 md:mt-0 flex justify-center md:justify-end">
              <div className="relative w-full max-w-[95%] aspect-[16/10] rounded-2xl overflow-hidden shadow-2xl border border-slate-200/70">
                <Photo variant="hero" priority sizes="(max-width: 768px) 100vw, 55vw" />
              </div>
              <div className="absolute -bottom-5 left-2 md:-bottom-6 md:-left-4 bg-white/95 backdrop-blur-xl p-3 md:p-4 rounded-xl shadow-xl border border-teal-500/10 flex items-center gap-3 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-300">
                <div className="w-8 h-8 md:w-10 md:h-10 bg-teal-50 rounded-full flex items-center justify-center text-teal-600">
                  <TrendingUp className="w-4 h-4 md:w-5 md:h-5" />
                </div>
                <div>
                  <div className="text-[8px] md:text-[10px] font-bold text-slate-400 uppercase tracking-widest">TRIAGE A DENIED CLAIM IN</div>
                  <div className="text-lg md:text-xl font-extrabold text-teal-700 tracking-tight font-headline">~10 seconds</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Trust Signals — scrolling denial categories */}
        <section className="py-8 bg-white border-y border-slate-100">
          <p className="text-center text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] mb-6 px-6">
            Built for the denial reasons that cost practices the most
          </p>

          {/* Edges fade so items enter and leave rather than popping */}
          <div className="marquee-viewport relative overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_8%,black_92%,transparent)]">
            <div className="marquee-track">
              {[0, 1].map((copy) => (
                <div key={copy} className="flex items-center shrink-0" aria-hidden={copy === 1}>
                  {DENIAL_REASONS.map((label) => (
                    <div key={label} className="flex items-center shrink-0">
                      <span className="px-10 md:px-16 text-base md:text-lg font-bold text-slate-600 tracking-tight whitespace-nowrap">
                        {label}
                      </span>
                      <span className="w-1.5 h-1.5 rounded-full bg-teal-500/40 shrink-0" />
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>
        </section>

        <TryItDemo />

        {/* Bento Grid Features */}
        <section className="py-16 md:py-20 px-6">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-2xl md:text-3xl font-extrabold tracking-tighter mb-3 font-headline">What it actually does</h2>
              <p className="text-sm text-slate-500 max-w-2xl mx-auto font-medium">Denial management is well-understood work that small practices skip because it is tedious. This does the tedious part.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 auto-rows-[220px] md:auto-rows-[260px]">
              {/* Large Feature Card */}
              <div className="md:col-span-2 md:row-span-2 bg-white rounded-2xl p-6 md:p-8 flex flex-col justify-between overflow-hidden relative shadow-sm border border-slate-100 hover:shadow-md transition-shadow group cursor-pointer">
                <div className="relative z-10">
                  <div className="w-10 h-10 bg-teal-50 rounded-xl flex items-center justify-center text-teal-600 mb-4 group-hover:scale-110 transition-transform">
                    <Brain className="w-6 h-6" />
                  </div>
                  <h3 className="text-xl md:text-2xl font-extrabold tracking-tight mb-3 font-headline text-slate-900 group-hover:text-teal-700 transition-colors">Denial triage that tells you the truth</h3>
                  <p className="text-xs md:text-sm text-slate-600 max-w-md leading-relaxed font-medium">Every denied claim gets a recovery probability, a root cause, and a specific next step — including when the honest answer is &ldquo;this one is contractual, bill the patient.&rdquo;</p>
                </div>
                <div className="relative z-10 mt-6 flex gap-2 flex-wrap">
                  <span className="px-3 py-1 bg-teal-50 rounded-full text-[9px] font-bold text-teal-800 uppercase tracking-wider">RECOVERY PROBABILITY</span>
                  <span className="px-3 py-1 bg-teal-50 rounded-full text-[9px] font-bold text-teal-800 uppercase tracking-wider">DRAFT APPEAL LETTERS</span>
                </div>
                <div className="absolute right-[-5%] bottom-[-5%] w-1/2 h-1/2 opacity-5 rotate-[-12deg] group-hover:rotate-0 transition-transform duration-700 z-0">
                  <Brain className="w-full h-full text-teal-600" />
                </div>
              </div>
              {/* Small Feature Card 1 */}
              <div className="bg-teal-600 text-white rounded-2xl p-6 flex flex-col justify-between shadow-lg shadow-teal-600/10 relative overflow-hidden group cursor-pointer">
                <div className="relative z-10">
                  <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center text-white mb-4 group-hover:scale-110 transition-transform">
                    <CreditCard className="w-5 h-5" />
                  </div>
                  <h3 className="text-lg font-extrabold tracking-tight mb-1.5 font-headline">Patient balance pipeline</h3>
                  <p className="text-[11px] opacity-90 leading-relaxed font-medium">Track outstanding patient balances through a simple pipeline, with AI guidance on which are worth pursuing. Automated SMS and email sending is not live yet.</p>
                </div>
              </div>
              {/* Small Feature Card 2 */}
              <div className="bg-white rounded-2xl p-6 flex flex-col justify-between border border-slate-100 shadow-sm relative overflow-hidden group cursor-pointer">
                <div className="relative z-10">
                  <div className="w-10 h-10 bg-teal-50 rounded-xl flex items-center justify-center text-teal-600 mb-4 group-hover:scale-110 transition-transform">
                    <Shield className="w-5 h-5" />
                  </div>
                  <h3 className="text-lg font-extrabold tracking-tight mb-1.5 font-headline text-slate-900 group-hover:text-teal-700 transition-colors">Built for sensitive data</h3>
                  <p className="text-[11px] text-slate-500 leading-relaxed font-medium">Encrypted in transit and at rest, scoped per practice. Formal HIPAA and SOC 2 work is in progress — see our compliance page.</p>
                </div>
              </div>
              {/* Wide Card */}
              <div className="md:col-span-3 bg-slate-100 rounded-2xl p-6 md:p-8 flex flex-col md:flex-row items-center gap-8 md:gap-12 hover:bg-slate-200/50 transition-colors cursor-default">
                <div className="flex-1">
                  <h3 className="text-lg font-extrabold tracking-tight mb-3 font-headline">Getting your claims in</h3>
                  <p className="text-xs text-slate-600 mb-4 font-medium leading-relaxed">Import your outstanding claims from a CSV export today. Direct connectors to Open Dental, Dentrix and Eaglesoft are on the roadmap, not shipped yet.</p>
                  <div className="flex flex-wrap gap-2">
                    <div className="px-3 py-1 bg-white rounded-lg shadow-sm font-bold text-[9px] text-slate-400 uppercase tracking-wider hover:text-teal-600 transition-colors cursor-pointer">DENTRIX GOLD</div>
                    <div className="px-3 py-1 bg-white rounded-lg shadow-sm font-bold text-[9px] text-slate-400 uppercase tracking-wider hover:text-teal-600 transition-colors cursor-pointer">OPEN DENTAL</div>
                    <div className="px-3 py-1 bg-white rounded-lg shadow-sm font-bold text-[9px] text-slate-400 uppercase tracking-wider hover:text-teal-600 transition-colors cursor-pointer">EAGLESOFT</div>
                  </div>
                </div>
                <div className="flex-1 flex justify-end w-full md:w-auto">
                  <div className="grid grid-cols-2 gap-3 w-full max-w-[280px]">
                    <div className="bg-white p-3 rounded-xl shadow-sm text-center transform hover:scale-105 transition-transform cursor-default">
                      <div className="text-xl font-extrabold text-teal-600 tracking-tighter font-headline">CSV</div>
                      <div className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Import today</div>
                    </div>
                    <div className="bg-white p-3 rounded-xl shadow-sm text-center transform hover:scale-105 transition-transform cursor-default">
                      <div className="text-xl font-extrabold text-teal-600 tracking-tighter font-headline">0</div>
                      <div className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Code required</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Revenue Recovery Section (Metric focus) */}
        <section className="py-16 md:py-20 bg-teal-900 text-white">
          <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-12 md:gap-20 items-center">
            <div>
              <h2 className="text-2xl md:text-3xl font-extrabold tracking-tighter mb-6 leading-tight font-headline">Most write-offs were never actually worked.</h2>
              <ul className="space-y-4">
                <li className="flex gap-3 group">
                  <CheckCircle className="w-5 h-5 text-teal-400 shrink-0 group-hover:scale-110 transition-transform" />
                  <span className="text-sm font-medium">See which denials are genuinely appealable — and which are contractual write-offs.</span>
                </li>
                <li className="flex gap-3 group">
                  <CheckCircle className="w-5 h-5 text-teal-400 shrink-0 group-hover:scale-110 transition-transform" />
                  <span className="text-sm font-medium">Get a drafted appeal letter instead of a blank page.</span>
                </li>
                <li className="flex gap-3 group">
                  <CheckCircle className="w-5 h-5 text-teal-400 shrink-0 group-hover:scale-110 transition-transform" />
                  <span className="text-sm font-medium">Flag the appointments most likely to no-show, before the slot is lost.</span>
                </li>
              </ul>
            </div>
            <div className="bg-white/5 backdrop-blur-md p-6 md:p-8 rounded-2xl border border-white/10 hover:bg-white/10 transition-colors cursor-default">
              <div className="mb-6">
                <div className="text-[9px] font-bold text-teal-400 uppercase tracking-[0.2em] mb-1.5">Example output</div>
                <div className="flex items-center gap-2.5">
                  <div className="text-lg font-bold font-headline tracking-tight">What the engine surfaces</div>
                </div>
              </div>
              <div className="space-y-3">
                <div className="flex justify-between items-center py-2.5 border-b border-white/5 text-xs hover:bg-white/5 px-2 -mx-2 rounded-lg transition-colors">
                  <span className="opacity-70 font-medium">Uncollected Balance Detected</span>
                  <span className="font-bold text-teal-400">+$420.00</span>
                </div>
                <div className="flex justify-between items-center py-2.5 border-b border-white/5 text-xs hover:bg-white/5 px-2 -mx-2 rounded-lg transition-colors">
                  <span className="opacity-70 font-medium">Patient "John D." No-Show Risk</span>
                  <span className="font-bold text-teal-400">78% (High)</span>
                </div>
                <div className="flex justify-between items-center py-2.5 border-b border-white/5 text-xs hover:bg-white/5 px-2 -mx-2 rounded-lg transition-colors">
                  <span className="opacity-70 font-medium">Auto-Recovery Sequence Sent</span>
                  <span className="font-bold text-teal-400">Confirmed</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Final CTA */}
        <section className="py-16 md:py-24 px-6">
          <div className="max-w-5xl mx-auto bg-teal-50 rounded-3xl p-8 md:p-16 text-center relative overflow-hidden border border-teal-100">
            <div className="z-10 relative">
              <h2 className="text-2xl md:text-4xl font-extrabold tracking-tighter mb-4 font-headline text-slate-900">Ready to reclaim your <span className="text-teal-600">full potential?</span></h2>
              <p className="text-sm md:text-base text-slate-600 mb-8 max-w-2xl mx-auto font-medium">We&apos;re onboarding our first practices now, and working closely with each one. 30-day free trial. No credit card required.</p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Link href="/dashboard" onClick={handleStartTrial}>
                  <button className="bg-teal-600 text-white text-sm px-8 py-3.5 rounded-xl font-bold shadow-lg shadow-teal-500/20 transition-all hover:bg-teal-700 hover:scale-[1.02] active:scale-[0.98]">
                    Get Started
                  </button>
                </Link>
                <Link href="/contact">
                  <button className="bg-white text-slate-700 text-sm px-8 py-3.5 rounded-xl font-bold border border-slate-200 hover:bg-slate-50 transition-all shadow-sm">
                    Book Strategy Call
                  </button>
                </Link>
              </div>
            </div>
            {/* Abstract Design Elements */}
            <div className="absolute top-0 right-0 w-48 h-48 bg-teal-200/20 rounded-full blur-3xl -mr-24 -mt-24" />
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-teal-300/10 rounded-full blur-3xl -ml-24 -mb-24" />
          </div>
        </section>
      </main>
      <Footer />

      {/* Login Modal */}
      <LoginModal 
        isOpen={isLoginModalOpen} 
        onClose={() => setIsLoginModalOpen(false)} 
      />
    </div>
  );
}

