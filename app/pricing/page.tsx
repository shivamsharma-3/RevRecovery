'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { LoginModal } from '@/components/LoginModal';
import { CheckCircle2, ShieldCheck, Shield, Lock, FileText, ChevronDown, X, CheckCircle, Mail } from 'lucide-react';
import { useAuth } from '@/components/AuthProvider';

export default function PricingPage() {
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isSalesModalOpen, setIsSalesModalOpen] = useState(false);
  const { user } = useAuth();

  const handleStartTrial = (e: React.MouseEvent) => {
    if (!user) {
      e.preventDefault();
      setIsLoginModalOpen(true);
    }
  };

  return (
    <div className="min-h-screen bg-surface text-on-surface">
      <Navbar />
      <main className="pt-32 pb-24 px-6">
        {/* Hero Section */}
        <section className="max-w-5xl mx-auto text-center mb-20">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary-fixed/30 text-on-primary-fixed-variant text-xs font-bold tracking-widest uppercase mb-6">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-primary" />
            </span>
            Clinical Precision Pricing
          </div>
          <h1 className="text-5xl md:text-6xl font-extrabold tracking-tighter text-on-surface mb-8 leading-[1.1]">
            Recover <span className="text-primary-container">14-22%</span> of lost revenue<br />from no-shows.
          </h1>
          <p className="text-lg md:text-xl text-on-surface-variant max-w-2xl mx-auto font-body leading-relaxed">
            Automatically resolve overdue payments and missed appointments with clinical precision. Choose the recovery plan that fits your facility's volume.
          </p>
        </section>
        {/* Pricing Grid */}
        <section className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 items-end">
          {/* Tier 1: Starter */}
          <div className="bg-surface-container-low rounded-xl p-8 flex flex-col h-full border border-transparent hover:border-outline-variant/20 transition-all duration-300">
            <div className="mb-8">
              <h3 className="text-lg font-bold text-on-surface-variant font-headline mb-2">Starter</h3>
              <div className="flex items-baseline gap-1">
                <span className="text-4xl font-extrabold text-on-surface">$29</span>
                <span className="text-on-surface-variant font-medium">/month</span>
              </div>
              <p className="mt-4 text-sm text-on-secondary-container leading-relaxed">Essential recovery tools for smaller clinics and independent practices.</p>
            </div>
            <div className="space-y-4 mb-10 flex-grow">
              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-primary shrink-0" />
                <span className="text-sm font-medium text-on-surface-variant">Up to 50 Monthly Claims</span>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-primary shrink-0" />
                <span className="text-sm font-medium text-on-surface-variant">Basic Analytics</span>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-primary shrink-0" />
                <span className="text-sm font-medium text-on-surface-variant">Email Support</span>
              </div>
            </div>
            <Link href="/dashboard" onClick={handleStartTrial} className="block w-full">
              <button className="w-full py-3 bg-surface-container-high text-on-surface font-bold rounded-xl hover:bg-surface-dim transition-colors active:scale-[0.98]">
                Start Trial
              </button>
            </Link>
          </div>
          {/* Tier 2: Pro (Highlighted) */}
          <div className="relative bg-surface-container-lowest rounded-xl p-10 flex flex-col h-full shadow-2xl shadow-primary/5 border-2 border-primary/10 transform md:scale-105 z-10">
            <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-primary text-on-primary text-[10px] font-black tracking-widest uppercase px-4 py-1.5 rounded-full">
              Recommended
            </div>
            <div className="mb-8">
              <h3 className="text-xl font-bold text-primary font-headline mb-2">Pro</h3>
              <div className="flex items-baseline gap-1">
                <span className="text-5xl font-extrabold text-on-surface">$79</span>
                <span className="text-on-surface-variant font-medium">/month</span>
              </div>
              <p className="mt-4 text-sm text-on-secondary-container leading-relaxed">The standard for growing healthcare groups requiring full AI automation.</p>
            </div>
            <div className="space-y-5 mb-10 flex-grow">
              <div className="flex items-start gap-3">
                <ShieldCheck className="w-5 h-5 text-primary-container shrink-0" />
                <span className="text-sm font-semibold text-on-surface">Unlimited Claims</span>
              </div>
              <div className="flex items-start gap-3">
                <ShieldCheck className="w-5 h-5 text-primary-container shrink-0" />
                <span className="text-sm font-semibold text-on-surface">Advanced AI Personalization</span>
              </div>
              <div className="flex items-start gap-3">
                <ShieldCheck className="w-5 h-5 text-primary-container shrink-0" />
                <span className="text-sm font-semibold text-on-surface">Priority Support</span>
              </div>
              <div className="flex items-start gap-3">
                <ShieldCheck className="w-5 h-5 text-primary-container shrink-0" />
                <span className="text-sm font-semibold text-on-surface">Real-time Dashboard</span>
              </div>
            </div>
            <Link href="/dashboard" onClick={handleStartTrial} className="block w-full">
              <button className="w-full py-4 clinical-gradient text-on-primary font-bold rounded-xl shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all">
                Get Started Now
              </button>
            </Link>
          </div>
          {/* Tier 3: Enterprise */}
          <div className="bg-surface-container-low rounded-xl p-8 flex flex-col h-full border border-transparent hover:border-outline-variant/20 transition-all duration-300">
            <div className="mb-8">
              <h3 className="text-lg font-bold text-on-surface-variant font-headline mb-2">Enterprise</h3>
              <div className="flex items-baseline gap-1">
                <span className="text-4xl font-extrabold text-on-surface">Custom</span>
              </div>
              <p className="mt-4 text-sm text-on-secondary-container leading-relaxed">Full-scale financial recovery infrastructure for large hospital networks.</p>
            </div>
            <div className="space-y-4 mb-10 flex-grow">
              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-primary shrink-0" />
                <span className="text-sm font-medium text-on-surface-variant">Custom API Integrations</span>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-primary shrink-0" />
                <span className="text-sm font-medium text-on-surface-variant">Dedicated Account Manager</span>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-primary shrink-0" />
                <span className="text-sm font-medium text-on-surface-variant">SOC2 Compliance</span>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-primary shrink-0" />
                <span className="text-sm font-medium text-on-surface-variant">Custom Contract Terms</span>
              </div>
            </div>
            <button 
              onClick={() => setIsSalesModalOpen(true)}
              className="w-full py-3 border-2 border-outline-variant/30 text-on-surface font-bold rounded-xl hover:bg-surface-container-high transition-colors active:scale-[0.98]"
            >
              Contact Sales
            </button>
          </div>
        </section>
        {/* Compliance & Trust Section */}
        <section className="max-w-7xl mx-auto mt-32 bg-white rounded-[2rem] p-12 overflow-hidden relative">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-3xl font-extrabold font-headline tracking-tight mb-6">Built for Medical Standards</h2>
              <p className="text-on-surface-variant text-lg leading-relaxed mb-8">
                Our recovery engine is designed with the same rigor as clinical software. We ensure every touchpoint maintains patient trust while securing your practice's financial health.
              </p>
              <div className="grid grid-cols-2 gap-6">
                <div className="flex items-center gap-3">
                  <Shield className="w-5 h-5 text-primary" />
                  <span className="text-sm font-bold tracking-tight">HIPAA Compliant</span>
                </div>
                <div className="flex items-center gap-3">
                  <ShieldCheck className="w-5 h-5 text-primary" />
                  <span className="text-sm font-bold tracking-tight">SOC2 Certified</span>
                </div>
                <div className="flex items-center gap-3">
                  <Lock className="w-5 h-5 text-primary" />
                  <span className="text-sm font-bold tracking-tight">End-to-End Encryption</span>
                </div>
                <div className="flex items-center gap-3">
                  <FileText className="w-5 h-5 text-primary" />
                  <span className="text-sm font-bold tracking-tight">Audit-Ready Logs</span>
                </div>
              </div>
            </div>
            <div className="relative rounded-2xl overflow-hidden aspect-video bg-slate-100">
              <Image 
                src="https://picsum.photos/seed/dashboard/800/600" 
                alt="Modern clinical data dashboard showing revenue recovery metrics" 
                fill
                className="object-cover"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-tr from-primary/10 to-transparent" />
            </div>
          </div>
        </section>
        {/* FAQ Micro-section */}
        <section className="max-w-3xl mx-auto mt-32">
          <h2 className="text-2xl font-bold font-headline text-center mb-12">Frequently Asked Questions</h2>
          <div className="space-y-8">
            <div className="group">
              <button className="flex justify-between items-center w-full text-left">
                <span className="text-lg font-semibold text-on-surface">How does the 30-day trial work?</span>
                <ChevronDown className="w-5 h-5 text-on-surface-variant group-hover:text-primary transition-colors" />
              </button>
              <div className="mt-4 text-on-surface-variant text-sm leading-relaxed">
                Every plan starts with a full-featured 30-day trial. We'll help you integrate your existing patient management system and start recovering revenue immediately. No credit card required.
              </div>
            </div>
            <div className="group">
              <button className="flex justify-between items-center w-full text-left">
                <span className="text-lg font-semibold text-on-surface">What counts as a 'Monthly Claim'?</span>
                <ChevronDown className="w-5 h-5 text-on-surface-variant group-hover:text-primary transition-colors" />
              </button>
              <div className="mt-4 text-on-surface-variant text-sm leading-relaxed">
                A claim is any individual no-show or overdue balance entry that the AI begins working to recover. We do not count successful follow-ups or multiple touches on the same claim as new claims.
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />

      {/* Login Modal */}
      <LoginModal 
        isOpen={isLoginModalOpen} 
        onClose={() => setIsLoginModalOpen(false)} 
      />

      {/* Sales Success Modal */}
      {isSalesModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[100] flex items-center justify-center p-6 animate-in fade-in duration-300">
          <div className="relative w-full max-w-md bg-white rounded-3xl p-10 text-center shadow-2xl animate-in zoom-in-95 duration-300 border border-teal-500/10">
            <button 
              onClick={() => setIsSalesModalOpen(false)}
              className="absolute top-6 right-6 p-2 text-slate-400 hover:text-slate-600 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
            
            <div className="w-16 h-16 bg-teal-50 rounded-full flex items-center justify-center mx-auto mb-6 text-teal-600">
              <Mail className="w-8 h-8" />
            </div>
            
            <h3 className="text-2xl font-bold mb-3 text-slate-900 font-headline">Request Received</h3>
            <p className="text-slate-600 font-medium leading-relaxed mb-8">Our enterprise sales team will contact you within 24 hours to discuss your clinical infrastructure needs.</p>
            
            <button 
              onClick={() => setIsSalesModalOpen(false)}
              className="w-full bg-teal-600 text-white py-3.5 rounded-xl font-bold hover:bg-teal-700 transition-all shadow-lg shadow-teal-500/20 active:scale-[0.98]"
            >
              Got it, thanks
            </button>
          </div>
        </div>
      )}

      {/* Compliance & Trust Section */}
      <section className="max-w-7xl mx-auto mt-32 bg-white rounded-[2rem] p-12 overflow-hidden relative">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div>
            <h2 className="text-3xl font-extrabold font-headline tracking-tight mb-6">Built for Medical Standards</h2>
            <p className="text-on-surface-variant text-lg leading-relaxed mb-8">
              Our recovery engine is designed with the same rigor as clinical software. We ensure every touchpoint maintains patient trust while securing your practice's financial health.
            </p>
            <div className="grid grid-cols-2 gap-6">
              <div className="flex items-center gap-3">
                <Shield className="w-5 h-5 text-primary" />
                <span className="text-sm font-bold tracking-tight">HIPAA Compliant</span>
              </div>
              <div className="flex items-center gap-3">
                <ShieldCheck className="w-5 h-5 text-primary" />
                <span className="text-sm font-bold tracking-tight">SOC2 Certified</span>
              </div>
              <div className="flex items-center gap-3">
                <Lock className="w-5 h-5 text-primary" />
                <span className="text-sm font-bold tracking-tight">End-to-End Encryption</span>
              </div>
              <div className="flex items-center gap-3">
                <FileText className="w-5 h-5 text-primary" />
                <span className="text-sm font-bold tracking-tight">Audit-Ready Logs</span>
              </div>
            </div>
          </div>
          <div className="relative rounded-2xl overflow-hidden aspect-video bg-slate-100">
            <Image 
              src="https://picsum.photos/seed/dashboard/800/600" 
              alt="Modern clinical data dashboard showing revenue recovery metrics" 
              fill
              className="object-cover"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-gradient-to-tr from-primary/10 to-transparent" />
          </div>
        </div>
      </section>

      {/* FAQ Micro-section */}
      <section className="max-w-3xl mx-auto mt-32 px-6 mb-24">
        <h2 className="text-2xl font-bold font-headline text-center mb-12">Frequently Asked Questions</h2>
        <div className="space-y-8">
          <div className="group">
            <button className="flex justify-between items-center w-full text-left">
              <span className="text-lg font-semibold text-on-surface">How does the 30-day trial work?</span>
              <ChevronDown className="w-5 h-5 text-on-surface-variant group-hover:text-primary transition-colors" />
            </button>
            <div className="mt-4 text-on-surface-variant text-sm leading-relaxed">
              Every plan starts with a full-featured 30-day trial. We'll help you integrate your existing patient management system and start recovering revenue immediately. No credit card required.
            </div>
          </div>
          <div className="group">
            <button className="flex justify-between items-center w-full text-left">
              <span className="text-lg font-semibold text-on-surface">What counts as a 'Monthly Claim'?</span>
              <ChevronDown className="w-5 h-5 text-on-surface-variant group-hover:text-primary transition-colors" />
            </button>
            <div className="mt-4 text-on-surface-variant text-sm leading-relaxed">
              A claim is any individual no-show or overdue balance entry that the AI begins working to recover. We do not count successful follow-ups or multiple touches on the same claim as new claims.
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
