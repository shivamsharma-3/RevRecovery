'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Photo } from '@/components/Photo';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { LoginModal } from '@/components/LoginModal';
import {
  CheckCircle2, ShieldCheck, Shield, FileText, CheckCircle, Zap, TrendingUp,
  Info, UserX, ArrowRight,
} from 'lucide-react';
import { useAuth } from '@/components/AuthProvider';

const TIERS = [
  {
    name: 'Starter',
    price: '$29',
    icon: CheckCircle,
    audience: 'A single practice or solo biller working claims part-time.',
  },
  {
    name: 'Growth',
    price: '$99',
    icon: TrendingUp,
    audience: 'A growing practice or small group with a steadier claim volume.',
  },
  {
    name: 'Pro',
    price: '$199',
    icon: Zap,
    audience: 'A practice ready to make this the default way claims get worked.',
    recommended: true,
  },
];

const INCLUDED_NOW = [
  'Import denials from a CSV export — no PMS integration required',
  'Every claim gets a recovery probability, root cause, and a next action',
  'Worklist ranked by expected value, exportable to CSV',
  'Drafted appeal letters, for you to review before sending',
  'No-show risk scoring',
  'A full audit log of every change on your account',
  'Direct email support from the person who built it',
];

export default function PricingPage() {
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
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
        <section className="max-w-5xl mx-auto text-center mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary-fixed/30 text-on-primary-fixed-variant text-xs font-bold tracking-widest uppercase mb-6">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-primary" />
            </span>
            Early Access — Billing Not Live Yet
          </div>
          <h1 className="text-5xl md:text-6xl font-extrabold tracking-tighter text-on-surface mb-8 leading-[1.1]">
            What we&apos;ll charge,<br />once there&apos;s something to charge for.
          </h1>
          <p className="text-lg md:text-xl text-on-surface-variant max-w-2xl mx-auto font-body leading-relaxed">
            Every signup gets the full product today, free, while we work with early practices.
            The prices below are what we&apos;re planning to charge later — not something you&apos;ll
            be billed for now.
          </p>
        </section>

        {/* Pricing Grid */}
        <section className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch">
          {TIERS.map((tier) => (
            <div
              key={tier.name}
              className={`relative rounded-xl p-8 flex flex-col h-full transition-all duration-300 ${
                tier.recommended
                  ? 'bg-surface-container-lowest shadow-2xl shadow-primary/5 border-2 border-primary/10 md:scale-105 z-10'
                  : 'bg-surface-container-low border border-transparent hover:border-outline-variant/20'
              }`}
            >
              {tier.recommended && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-primary text-on-primary text-[10px] font-black tracking-widest uppercase px-4 py-1.5 rounded-full">
                  Recommended
                </div>
              )}
              <div className="mb-8">
                <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mb-6 text-primary">
                  <tier.icon className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-on-surface-variant font-headline mb-2">{tier.name}</h3>
                <div className="flex items-baseline gap-1">
                  <span className="text-4xl font-extrabold text-on-surface">{tier.price}</span>
                  <span className="text-on-surface-variant font-medium">/month</span>
                </div>
                <p className="mt-4 text-sm text-on-secondary-container leading-relaxed">{tier.audience}</p>
              </div>
              <div className="flex-grow" />
              <Link href="/dashboard" onClick={handleStartTrial} className="block w-full">
                <button
                  className={`w-full py-3 font-bold rounded-xl transition-all active:scale-[0.98] ${
                    tier.recommended
                      ? 'clinical-gradient text-on-primary shadow-lg shadow-primary/20 hover:scale-[1.02]'
                      : 'bg-surface-container-high text-on-surface hover:bg-surface-dim'
                  }`}
                >
                  Join Early Access
                </button>
              </Link>
            </div>
          ))}
        </section>

        {/* Enterprise strip */}
        <section className="max-w-6xl mx-auto mt-6">
          <div className="bg-surface-container-low rounded-xl p-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 border border-transparent hover:border-outline-variant/20 transition-all duration-300">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center text-primary shrink-0">
                <Shield className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-on-surface-variant font-headline mb-1">Enterprise</h3>
                <p className="text-sm text-on-secondary-container leading-relaxed max-w-md">
                  Groups, DSOs, and billing companies with volume or workflow needs beyond the above.
                  Pricing and terms would be worked out directly — nothing pre-built exists for this
                  tier yet.
                </p>
              </div>
            </div>
            <Link href="/contact" className="shrink-0">
              <button className="px-6 py-3 border-2 border-outline-variant/30 text-on-surface font-bold rounded-xl hover:bg-surface-container-high transition-colors active:scale-[0.98] whitespace-nowrap">
                Talk to Us
              </button>
            </Link>
          </div>
        </section>

        {/* What's actually included, today */}
        <section className="max-w-6xl mx-auto mt-6">
          <div className="bg-surface-container-low rounded-xl p-8 md:p-10">
            <div className="flex items-start gap-3 mb-6">
              <Info className="w-5 h-5 text-primary shrink-0 mt-0.5" />
              <div>
                <h3 className="text-lg font-bold text-on-surface font-headline mb-1">
                  Included with every plan, right now
                </h3>
                <p className="text-sm text-on-surface-variant leading-relaxed">
                  There&apos;s no billing system yet, so there&apos;s nothing to gate — every account gets
                  everything below, regardless of which tier you&apos;d eventually pick.
                </p>
              </div>
            </div>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-3">
              {INCLUDED_NOW.map((item) => (
                <li key={item} className="flex items-start gap-3">
                  <CheckCircle2 className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                  <span className="text-sm font-medium text-on-surface-variant">{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* Compliance & Trust Section */}
        <section className="max-w-7xl mx-auto mt-20 bg-white rounded-[2rem] p-12 overflow-hidden relative">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-3xl font-extrabold font-headline tracking-tight mb-6">Where we stand on security</h2>
              <p className="text-on-surface-variant text-lg leading-relaxed mb-8">
                We&apos;d rather list exactly what&apos;s true than describe something aspirational. Here&apos;s
                what&apos;s actually in place — the full picture, including what isn&apos;t yet, is on our{' '}
                <Link href="/compliance" className="text-primary font-semibold hover:underline">compliance page</Link>.
              </p>
              <div className="grid grid-cols-2 gap-6">
                <div className="flex items-center gap-3">
                  <Shield className="w-5 h-5 text-primary" />
                  <span className="text-sm font-bold tracking-tight">Encrypted in transit &amp; at rest</span>
                </div>
                <div className="flex items-center gap-3">
                  <ShieldCheck className="w-5 h-5 text-primary" />
                  <span className="text-sm font-bold tracking-tight">Per-practice data isolation</span>
                </div>
                <div className="flex items-center gap-3">
                  <UserX className="w-5 h-5 text-primary" />
                  <span className="text-sm font-bold tracking-tight">Patient names never sent to our AI</span>
                </div>
                <div className="flex items-center gap-3">
                  <FileText className="w-5 h-5 text-primary" />
                  <span className="text-sm font-bold tracking-tight">Full audit log of every change</span>
                </div>
              </div>
            </div>
            <div className="relative rounded-2xl overflow-hidden aspect-video bg-slate-100">
              <Photo variant="dashboard" />
              <div className="absolute inset-0 bg-gradient-to-tr from-primary/10 to-transparent" />
            </div>
          </div>
        </section>

        {/* FAQ Micro-section */}
        <section className="max-w-3xl mx-auto mt-32 mb-24">
          <h2 className="text-2xl font-bold font-headline text-center mb-12">Frequently Asked Questions</h2>
          <div className="space-y-8">
            <div className="group">
              <h3 className="flex justify-between items-center w-full text-left"><span className="text-lg font-semibold text-on-surface">Is this actually free right now?</span></h3>
              <div className="mt-4 text-on-surface-variant text-sm leading-relaxed">
                Yes. There&apos;s no billing system yet, so every account gets full access at no charge
                during early access. The prices above are what we plan to charge later — we&apos;ll tell
                you before that changes, and you won&apos;t be billed without notice.
              </div>
            </div>
            <div className="group">
              <h3 className="flex justify-between items-center w-full text-left"><span className="text-lg font-semibold text-on-surface">What will count as a &apos;claim&apos; once billing starts?</span></h3>
              <div className="mt-4 text-on-surface-variant text-sm leading-relaxed">
                A claim will be any individual denial or overdue balance you import or add for the
                engine to triage. Reworking the same claim again — checking it twice, redrafting a
                letter — won&apos;t count as a second one. Nothing is metered or capped today.
              </div>
            </div>
            <div className="group">
              <h3 className="flex justify-between items-center w-full text-left"><span className="text-lg font-semibold text-on-surface">Can I switch plans or cancel?</span></h3>
              <div className="mt-4 text-on-surface-variant text-sm leading-relaxed">
                There&apos;s nothing to switch or cancel yet, since nothing is being charged. Once
                billing goes live, plans will be simple month-to-month with no lock-in, changeable
                from your dashboard at any time.
              </div>
            </div>
            <div className="group">
              <h3 className="flex justify-between items-center w-full text-left"><span className="text-lg font-semibold text-on-surface">Is my patient data secure?</span></h3>
              <div className="mt-4 text-on-surface-variant text-sm leading-relaxed">
                Data is encrypted in transit and at rest, and each practice&apos;s data is isolated from every other. To be straight with you: we have not completed a HIPAA attestation or a SOC 2 audit yet, and we cannot sign BAAs, so please do not upload PHI. Our compliance page explains exactly where we stand.
              </div>
            </div>
          </div>
        </section>

        {/* Closing CTA */}
        <section className="max-w-3xl mx-auto text-center">
          <Link href="/dashboard" onClick={handleStartTrial}>
            <button className="inline-flex items-center gap-2 px-8 py-4 clinical-gradient text-on-primary font-bold rounded-xl shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all">
              Join Early Access <ArrowRight className="w-4 h-4" />
            </button>
          </Link>
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
