import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { PlayCircle, TrendingUp, Brain, CreditCard, Shield, CheckCircle, ArrowRight } from 'lucide-react';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <Navbar />
      <main className="pt-14">
        {/* Hero Section */}
        <section className="relative overflow-hidden pt-12 pb-10 px-6">
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center gap-10">
            <div className="flex-1 text-left z-10">
              <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-teal-100 text-teal-800 text-[10px] font-bold mb-4 tracking-wider uppercase">
                <span className="relative flex h-1.5 w-1.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-teal-500 opacity-75" />
                  <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-teal-600" />
                </span>
                NEW: AI PATIENT PREDICTION V2.0
              </div>
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-slate-900 leading-[1.1] tracking-tighter mb-5 font-headline">
                Recover <span className="text-teal-600">14-22%</span> of lost revenue — automatically
              </h1>
              <p className="text-sm md:text-base text-slate-600 max-w-lg mb-8 leading-relaxed font-medium">
                The clinical-grade engine that predicts patient no-shows and recovers overdue payments with sovereign precision. Built for modern dental and medical practices.
              </p>
              <div className="flex flex-col sm:flex-row gap-3">
                <Link href="/dashboard">
                  <button className="bg-teal-600 text-white text-sm px-6 py-3 rounded-xl font-bold transition-all hover:bg-teal-700 shadow-lg shadow-teal-500/20 active:scale-[0.98]">
                    Start Free Trial
                  </button>
                </Link>
                <Link href="/solutions">
                  <button className="bg-white text-slate-700 text-sm px-6 py-3 rounded-xl font-bold flex items-center justify-center gap-2 border border-slate-200 hover:bg-slate-50 transition-colors">
                    <PlayCircle className="w-4 h-4 text-teal-600" />
                    Watch 1-min demo
                  </button>
                </Link>
              </div>
            </div>
            <div className="flex-1 relative w-full mt-8 md:mt-0 flex justify-center md:justify-end">
              <div className="w-full max-w-[95%] aspect-video md:aspect-[16/10] bg-white rounded-2xl overflow-hidden shadow-2xl border border-slate-100 relative group">
                <Image 
                  alt="RevRecover AI Hero Image" 
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" 
                  src="/hero.jpeg"
                  width={1600}
                  height={1000}
                  referrerPolicy="no-referrer"
                  priority
                  sizes="(max-width: 768px) 100vw, 95vw"
                />
                <div className="absolute inset-0 bg-gradient-to-tr from-teal-600/10 to-transparent pointer-events-none" />
              </div>
              {/* Floating Stat Card */}
              <div className="absolute -bottom-4 -left-4 bg-white/95 backdrop-blur-xl p-3 md:p-4 rounded-xl shadow-xl border border-teal-500/10 flex items-center gap-3 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-300">
                <div className="w-8 h-8 md:w-10 md:h-10 bg-teal-50 rounded-full flex items-center justify-center text-teal-600">
                  <TrendingUp className="w-4 h-4 md:w-5 md:h-5" />
                </div>
                <div>
                  <div className="text-[8px] md:text-[10px] font-bold text-slate-400 uppercase tracking-widest">AVG. MONTHLY RECOVERY</div>
                  <div className="text-lg md:text-xl font-extrabold text-teal-700 tracking-tight font-headline">$4,280/mo</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Trust Signals */}
        <section className="py-6 bg-white border-y border-slate-100">
          <div className="max-w-7xl mx-auto px-6">
            <p className="text-center text-[9px] font-bold text-slate-400 uppercase tracking-[0.2em] mb-6">Trusted by leading clinics and surgical centers</p>
            <div className="flex flex-wrap justify-center items-center gap-8 md:gap-16 opacity-50 grayscale hover:grayscale-0 transition-all duration-500">
              <div className="text-base font-bold text-slate-800 tracking-tighter flex items-center gap-1.5">
                PURE DENTAL
              </div>
              <div className="text-base font-bold text-slate-800 tracking-tighter flex items-center gap-1.5">
                CLINIC PLUS
              </div>
              <div className="text-base font-bold text-slate-800 tracking-tighter flex items-center gap-1.5">
                ORTHO VEDA
              </div>
              <div className="text-base font-bold text-slate-800 tracking-tighter flex items-center gap-1.5">
                REGEN HUB
              </div>
            </div>
          </div>
        </section>

        {/* Bento Grid Features */}
        <section className="py-16 md:py-20 px-6">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-2xl md:text-3xl font-extrabold tracking-tighter mb-3 font-headline">Precision tools for sovereign analysts</h2>
              <p className="text-sm text-slate-500 max-w-2xl mx-auto font-medium">Stop managing spreadsheet chaos. Our AI handles the heavy lifting of financial recovery so you can focus on patient care.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 auto-rows-[220px] md:auto-rows-[260px]">
              {/* Large Feature Card */}
              <div className="md:col-span-2 md:row-span-2 bg-white rounded-2xl p-6 md:p-8 flex flex-col justify-between overflow-hidden relative shadow-sm border border-slate-100 hover:shadow-md transition-shadow group">
                <div className="absolute inset-0 z-0 opacity-[0.03] group-hover:opacity-[0.05] transition-opacity">
                  <Image 
                    src="https://picsum.photos/seed/patient-care/800/800" 
                    alt="Background" 
                    fill 
                    className="object-cover"
                    referrerPolicy="no-referrer"
                    sizes="(max-width: 768px) 100vw, 66vw"
                  />
                </div>
                <div className="relative z-10">
                  <div className="w-10 h-10 bg-teal-50 rounded-xl flex items-center justify-center text-teal-600 mb-4">
                    <Brain className="w-6 h-6" />
                  </div>
                  <h3 className="text-xl md:text-2xl font-extrabold tracking-tight mb-3 font-headline text-slate-900">Predictive No-Show Engine</h3>
                  <p className="text-xs md:text-sm text-slate-600 max-w-md leading-relaxed font-medium">Our neural networks analyze 40+ behavioral variables to flag "high-risk" appointments 48 hours in advance.</p>
                </div>
                <div className="relative z-10 mt-6 flex gap-2">
                  <span className="px-3 py-1 bg-teal-50 rounded-full text-[9px] font-bold text-teal-800 uppercase tracking-wider">84% ACCURACY</span>
                  <span className="px-3 py-1 bg-teal-50 rounded-full text-[9px] font-bold text-teal-800 uppercase tracking-wider">REAL-TIME ALERTS</span>
                </div>
                <div className="absolute right-[-5%] bottom-[-5%] w-1/2 h-1/2 opacity-5 rotate-[-12deg] group-hover:rotate-0 transition-transform duration-700 z-0">
                  <Brain className="w-full h-full text-teal-600" />
                </div>
              </div>
              {/* Small Feature Card 1 */}
              <div className="bg-teal-600 text-white rounded-2xl p-6 flex flex-col justify-between shadow-lg shadow-teal-600/10 relative overflow-hidden group">
                <div className="absolute inset-0 z-0 opacity-10 group-hover:opacity-20 transition-opacity">
                  <Image 
                    src="https://picsum.photos/seed/digital-payment/400/400" 
                    alt="Background" 
                    fill 
                    className="object-cover"
                    referrerPolicy="no-referrer"
                    sizes="(max-width: 768px) 100vw, 33vw"
                  />
                </div>
                <div className="relative z-10">
                  <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center text-white mb-4">
                    <CreditCard className="w-5 h-5" />
                  </div>
                  <h3 className="text-lg font-extrabold tracking-tight mb-1.5 font-headline">Automated Arrears</h3>
                  <p className="text-[11px] opacity-90 leading-relaxed font-medium">Gentle, systematic recovery of overdue balances via SMS and email that feels personal, not robotic.</p>
                </div>
              </div>
              {/* Small Feature Card 2 */}
              <div className="bg-white rounded-2xl p-6 flex flex-col justify-between border border-slate-100 shadow-sm relative overflow-hidden group">
                <div className="absolute inset-0 z-0 opacity-[0.03] group-hover:opacity-[0.05] transition-opacity">
                  <Image 
                    src="https://picsum.photos/seed/data-security/400/400" 
                    alt="Background" 
                    fill 
                    className="object-cover"
                    referrerPolicy="no-referrer"
                    sizes="(max-width: 768px) 100vw, 33vw"
                  />
                </div>
                <div className="relative z-10">
                  <div className="w-10 h-10 bg-teal-50 rounded-xl flex items-center justify-center text-teal-600 mb-4">
                    <Shield className="w-5 h-5" />
                  </div>
                  <h3 className="text-lg font-extrabold tracking-tight mb-1.5 font-headline text-slate-900">Sovereign Security</h3>
                  <p className="text-[11px] text-slate-500 leading-relaxed font-medium">SOC2 Type II &amp; HIPAA compliant. Your clinical data never leaves the encrypted vault.</p>
                </div>
              </div>
              {/* Wide Card */}
              <div className="md:col-span-3 bg-slate-100 rounded-2xl p-6 md:p-8 flex flex-col md:flex-row items-center gap-8 md:gap-12">
                <div className="flex-1">
                  <h3 className="text-lg font-extrabold tracking-tight mb-3 font-headline">Deep Integration Ecosystem</h3>
                  <p className="text-xs text-slate-600 mb-4 font-medium leading-relaxed">Connects seamlessly with Open Dental, Dentrix, and Eaglesoft in under 15 minutes. No manual data entry required.</p>
                  <div className="flex flex-wrap gap-2">
                    <div className="px-3 py-1 bg-white rounded-lg shadow-sm font-bold text-[9px] text-slate-400 uppercase tracking-wider">DENTRIX GOLD</div>
                    <div className="px-3 py-1 bg-white rounded-lg shadow-sm font-bold text-[9px] text-slate-400 uppercase tracking-wider">OPEN DENTAL</div>
                    <div className="px-3 py-1 bg-white rounded-lg shadow-sm font-bold text-[9px] text-slate-400 uppercase tracking-wider">EAGLESOFT</div>
                  </div>
                </div>
                <div className="flex-1 flex justify-end w-full md:w-auto">
                  <div className="grid grid-cols-2 gap-3 w-full max-w-[280px]">
                    <div className="bg-white p-3 rounded-xl shadow-sm text-center">
                      <div className="text-xl font-extrabold text-teal-600 tracking-tighter font-headline">15m</div>
                      <div className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Setup Time</div>
                    </div>
                    <div className="bg-white p-3 rounded-xl shadow-sm text-center">
                      <div className="text-xl font-extrabold text-teal-600 tracking-tighter font-headline">0</div>
                      <div className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Code Required</div>
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
              <h2 className="text-2xl md:text-3xl font-extrabold tracking-tighter mb-6 leading-tight font-headline">Your practice is leaking revenue. We fix the plumbing.</h2>
              <ul className="space-y-4">
                <li className="flex gap-3">
                  <CheckCircle className="w-5 h-5 text-teal-400 shrink-0" />
                  <span className="text-sm font-medium">Recover $2k - $8k per month in uncollected insurance claims.</span>
                </li>
                <li className="flex gap-3">
                  <CheckCircle className="w-5 h-5 text-teal-400 shrink-0" />
                  <span className="text-sm font-medium">Reduce no-shows by 25% using behavioral nudges.</span>
                </li>
                <li className="flex gap-3">
                  <CheckCircle className="w-5 h-5 text-teal-400 shrink-0" />
                  <span className="text-sm font-medium">Clean up historical arrears going back 12 months.</span>
                </li>
              </ul>
            </div>
            <div className="bg-white/5 backdrop-blur-md p-6 md:p-8 rounded-2xl border border-white/10">
              <div className="mb-6">
                <div className="text-[9px] font-bold text-teal-400 uppercase tracking-[0.2em] mb-1.5">Live Recovery Pulse</div>
                <div className="flex items-center gap-2.5">
                  <div className="w-2 h-2 bg-teal-400 rounded-full animate-pulse" />
                  <div className="text-lg font-bold font-headline tracking-tight">Active Recovery Session...</div>
                </div>
              </div>
              <div className="space-y-3">
                <div className="flex justify-between items-center py-2.5 border-b border-white/5 text-xs">
                  <span className="opacity-70 font-medium">Uncollected Balance Detected</span>
                  <span className="font-bold text-teal-400">+$420.00</span>
                </div>
                <div className="flex justify-between items-center py-2.5 border-b border-white/5 text-xs">
                  <span className="opacity-70 font-medium">Patient "John D." No-Show Risk</span>
                  <span className="font-bold text-teal-400">78% (High)</span>
                </div>
                <div className="flex justify-between items-center py-2.5 border-b border-white/5 text-xs">
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
              <p className="text-sm md:text-base text-slate-600 mb-8 max-w-2xl mx-auto font-medium">Join over 450 clinics using RevRecover AI to stabilize their cash flow. 14-day free trial. No credit card required.</p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Link href="/auth">
                  <button className="bg-teal-600 text-white text-sm px-8 py-3.5 rounded-xl font-bold shadow-lg shadow-teal-500/20 transition-all hover:bg-teal-700 hover:scale-[1.02] active:scale-[0.98]">
                    Start Free Trial
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
    </div>
  );
}

