import React from 'react';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { Photo } from '@/components/Photo';
import Link from 'next/link';
import { History, Heart, Lightbulb, Lock } from 'lucide-react';

import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'About',
  description:
    'The team and thinking behind RevRecover AI, a revenue recovery tool for dental and medical practices.',
  alternates: { canonical: '/about' },
};

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-surface text-on-surface">
      <Navbar />
      <main className="pt-32 pb-24 px-6 max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h1 className="text-5xl md:text-6xl font-extrabold text-teal-900 mb-6 font-headline tracking-tight">About RevRecover AI</h1>
          <p className="text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed">
            An early-stage tool that helps small practices work their denied claims properly, instead of writing them off.
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 gap-16 items-center mb-24">
          <div className="relative h-[500px] rounded-[2rem] overflow-hidden shadow-xl">
            <Photo variant="team" />
            <div className="absolute inset-0 bg-teal-900/10 mix-blend-multiply" />
          </div>
          
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-50 text-teal-800 text-xs font-bold tracking-widest uppercase mb-6">
              <History className="w-4 h-4" />
              Our Story
            </div>
            <h2 className="text-4xl font-bold text-slate-900 mb-6">Why this exists</h2>
            <p className="text-slate-600 mb-6 leading-relaxed text-lg">
              RevRecover AI started from a simple observation: denial management is well-understood work that small practices still get wrong, because it is tedious and nobody has time for it. A claim gets denied for missing documentation, nobody follows up within the filing window, and it quietly becomes a write-off.
            </p>
            <p className="text-slate-600 mb-8 leading-relaxed text-lg">
              Enterprise revenue cycle software solves this for large health systems and prices accordingly. Collection agencies solve it by damaging the patient relationship. The gap in the middle — a practice with a few thousand dollars of recoverable denials and no dedicated biller — is what this is built for.
            </p>
            <div className="border-t border-slate-200 pt-8">
              <p className="text-sm text-slate-500 leading-relaxed">
                We are pre-revenue and onboarding our first practices. When we have results worth
                quoting, they will be real ones with a named practice behind them.
              </p>
            </div>
          </div>
        </div>

        <div className="mb-24">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">Our Core Values</h2>
            <p className="text-slate-600 max-w-2xl mx-auto">The principles that guide our product development and how we serve our partners.</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white p-10 rounded-[2rem] shadow-sm border border-teal-500/10 text-center group hover:-translate-y-2 transition-transform duration-300">
              <div className="w-16 h-16 bg-teal-50 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:bg-teal-600 transition-colors">
                <Heart className="w-8 h-8 text-teal-600 group-hover:text-white transition-colors" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-4">Patient-First Empathy</h3>
              <p className="text-slate-600 leading-relaxed">
                We believe revenue recovery should never compromise the patient-provider relationship. Our outreach is designed to be helpful, clear, and compassionate, offering solutions rather than demands.
              </p>
            </div>
            
            <div className="bg-white p-10 rounded-[2rem] shadow-sm border border-teal-500/10 text-center group hover:-translate-y-2 transition-transform duration-300">
              <div className="w-16 h-16 bg-teal-50 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:bg-teal-600 transition-colors">
                <Lightbulb className="w-8 h-8 text-teal-600 group-hover:text-white transition-colors" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-4">Calibrated, not optimistic</h3>
              <p className="text-slate-600 leading-relaxed">
                The model is given explicit denial-category baselines, aging multipliers, and calibration rules so it does not simply mark every claim as highly recoverable. It is built to tell you when a denial is contractual and not worth appealing.
              </p>
            </div>
            
            <div className="bg-white p-10 rounded-[2rem] shadow-sm border border-teal-500/10 text-center group hover:-translate-y-2 transition-transform duration-300">
              <div className="w-16 h-16 bg-teal-50 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:bg-teal-600 transition-colors">
                <Lock className="w-8 h-8 text-teal-600 group-hover:text-white transition-colors" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-4">Honest about security</h3>
              <p className="text-slate-600 leading-relaxed">
                Data is encrypted in transit and at rest, and scoped so one practice can never read another's. We have not completed HIPAA attestation or a SOC 2 audit yet, and we say so plainly on our compliance page rather than implying otherwise.
              </p>
            </div>
          </div>
        </div>

        {/* Who's behind this */}
        <div className="mb-24">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">Who&apos;s behind this</h2>
          </div>

          <div className="max-w-2xl mx-auto bg-white p-8 md:p-10 rounded-[2rem] border border-teal-500/10 shadow-sm">
            <p className="text-slate-600 leading-relaxed mb-4">
              RevRecover AI is built and run by Shivam Sharma. Right now it is a one-person
              company &mdash; there is no leadership team to introduce, and pretending otherwise
              would be a strange way to start a relationship with a practice trusting us with
              their revenue.
            </p>
            <p className="text-slate-600 leading-relaxed mb-4">
              The product exists because denial management is genuinely tedious work that small
              practices either do badly or pay a lot to outsource. A model that can read a denial
              reason, weigh it honestly, and draft the appeal removes most of that drudgery.
            </p>
            <p className="text-slate-600 leading-relaxed">
              We are onboarding our first practices now and working closely with each of them.
              If that is interesting to you,{' '}
              <Link href="/contact" className="text-teal-600 font-semibold hover:underline">
                get in touch
              </Link>
              .
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
