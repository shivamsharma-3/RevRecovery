import React from 'react';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { Database, Cpu, MessageSquare, BarChart3, ShieldCheck, ArrowRight, CheckCircle2, Plug, Brain, DollarSign } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'How It Works',
  description:
    'From connecting your practice management system to recovering revenue - the four steps behind RevRecover AI.',
  alternates: { canonical: '/how-it-works' },
};

export default function HowItWorksPage() {
  const steps = [
    {
      icon: <Plug className="w-8 h-8 text-teal-600" />,
      title: "1. Seamless Integration",
      description: "Today you add claims directly in the dashboard or import them from a CSV export out of your practice management system. Direct PMS connectors are on the roadmap, not shipped — we would rather say so than promise an integration that does not exist yet.",
      example: "e.g., Export your outstanding claims report from Open Dental or Dentrix and import it here.",
      features: ["Manual claim entry today", "CSV import", "Encrypted storage"]
    },
    {
      icon: <Brain className="w-8 h-8 text-teal-600" />,
      title: "2. AI Analysis & Prediction",
      description: "The engine reads each denial reason, weighs it against known denial-category baselines and the age of the claim, and returns a recovery probability with the reasoning behind it.",
      example: "e.g., Flags a 14-month-old timely-filing denial as effectively dead, and a 3-week-old missing-attachment denial as worth chasing today.",
      features: ["No-Show Risk Scoring", "Denial Prediction", "Underpayment Detection"]
    },
    {
      icon: <MessageSquare className="w-8 h-8 text-teal-600" />,
      title: "3. Automated Patient Outreach",
      description: "The system initiates gentle, personalized outreach via SMS and email. It handles awkward financial conversations with compassion, offering easy mobile payment links and installment plans.",
      example: "e.g., Sends a polite SMS with a 1-click Apple Pay link to a patient with a $150 balance that is 60 days past due.",
      features: ["Behavioral Nudges", "Mobile-First Payments", "Personalized Messaging"]
    },
    {
      icon: <DollarSign className="w-8 h-8 text-teal-600" />,
      title: "4. Revenue Reclaimed",
      description: "Watch your cash flow stabilize as overdue balances are settled and insurance denials are appealed automatically. Detailed analytics show exactly how much revenue has been recovered in real-time.",
      example: "e.g., Automatically generates and submits an appeal letter for a denied panoramic X-ray claim, recovering $120.",
      features: ["Real-time Dashboard", "Automated Appeals", "ROI Tracking"]
    }
  ];

  return (
    <div className="min-h-screen bg-surface text-on-surface">
      <Navbar />
      <main className="pt-32 pb-24 px-6 max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-50 text-teal-800 text-xs font-bold tracking-widest uppercase mb-6">
            The Process
          </div>
          <h1 className="text-5xl md:text-6xl font-extrabold text-teal-900 mb-6 font-headline tracking-tight">How RevRecover AI Works</h1>
          <p className="text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed">
            A sophisticated, clinical-grade engine that turns your practice's data into recovered revenue through four simple steps.
          </p>
        </div>

        {/* Hero Image */}
        <div className="w-full max-w-5xl mx-auto aspect-[21/9] bg-slate-100 rounded-[2rem] overflow-hidden shadow-2xl border border-teal-500/10 relative mb-24 group">
          <Image 
            src="https://picsum.photos/seed/how-it-works-hero/1200/600" 
            alt="RevRecover AI dashboard showing revenue recovery process" 
            fill 
            className="object-cover group-hover:scale-105 transition-transform duration-700"
            referrerPolicy="no-referrer"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900/40 to-transparent" />
        </div>

        {/* Horizontal Flowchart */}
        <div className="hidden md:flex items-center justify-between max-w-5xl mx-auto mb-24 relative">
          <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-1 bg-teal-100 -z-10 rounded-full"></div>
          {steps.map((step, index) => (
            <div key={index} className="flex flex-col items-center relative bg-surface px-4">
              <div className="w-16 h-16 bg-white border-4 border-teal-50 rounded-full flex items-center justify-center shadow-md mb-4 text-teal-600">
                {step.icon}
              </div>
              <span className="text-sm font-bold text-slate-800 text-center max-w-[120px]">{step.title.split('. ')[1]}</span>
            </div>
          ))}
        </div>

        {/* Steps Section */}
        <div className="space-y-24 mb-32">
          {steps.map((step, index) => (
            <div key={index} className={`flex flex-col ${index % 2 === 1 ? 'md:flex-row-reverse' : 'md:flex-row'} items-center gap-12 md:gap-20`}>
              <div className="flex-1">
                <div className="w-16 h-16 bg-teal-50 rounded-2xl flex items-center justify-center mb-6 shadow-sm">
                  {step.icon}
                </div>
                <h2 className="text-3xl font-bold text-slate-900 mb-4">{step.title}</h2>
                <p className="text-lg text-slate-600 mb-6 leading-relaxed">
                  {step.description}
                </p>
                <div className="bg-slate-50 border border-slate-100 rounded-xl p-4 mb-8">
                  <p className="text-sm text-slate-700 italic font-medium">
                    {step.example}
                  </p>
                </div>
                <ul className="space-y-3">
                  {step.features.map((feature, fIndex) => (
                    <li key={fIndex} className="flex items-center gap-3 text-slate-700 font-medium">
                      <CheckCircle2 className="w-5 h-5 text-teal-500 shrink-0" />
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="flex-1 w-full relative group">
                <div className="aspect-video bg-slate-100 rounded-[2rem] overflow-hidden shadow-xl border border-teal-500/5 relative">
                  <Image 
                    src={`https://picsum.photos/seed/step-${index + 1}/800/600`} 
                    alt={`Illustration for ${step.title}`} 
                    fill 
                    className="object-cover group-hover:scale-105 transition-transform duration-700"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-gradient-to-tr from-teal-900/10 to-transparent" />
                </div>
                {/* Decorative element */}
                <div className={`absolute -z-10 w-full h-full bg-teal-50 rounded-[2rem] blur-2xl opacity-50 ${index % 2 === 1 ? '-left-8 -top-8' : '-right-8 -bottom-8'}`} />
              </div>
            </div>
          ))}
        </div>

        {/* Security Section */}
        <div className="bg-teal-900 rounded-[3rem] p-12 md:p-20 text-white relative overflow-hidden mb-32">
          <div className="relative z-10 grid md:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-teal-300 text-[10px] font-bold tracking-widest uppercase mb-6">
                Security First
              </div>
              <h2 className="text-3xl md:text-4xl font-bold mb-6 font-headline tracking-tight">How we handle your data</h2>
              <p className="text-teal-100 mb-8 text-lg leading-relaxed">
                Your data is encrypted in transit and at rest, and scoped so one practice can never read another’s. We have not completed HIPAA attestation or a SOC 2 audit yet and cannot sign BAAs — so the product is designed to work with de-identified claim data. Our compliance page spells this out in full.
              </p>
              <div className="flex flex-wrap gap-4">
                <div className="flex items-center gap-2 bg-white/5 px-4 py-2 rounded-lg border border-white/10">
                  <ShieldCheck className="w-5 h-5 text-teal-400" />
                  <span className="text-sm font-bold uppercase tracking-wider">Encrypted at rest</span>
                </div>
                <div className="flex items-center gap-2 bg-white/5 px-4 py-2 rounded-lg border border-white/10">
                  <ShieldCheck className="w-5 h-5 text-teal-400" />
                  <span className="text-sm font-bold uppercase tracking-wider">Per-practice isolation</span>
                </div>
              </div>
            </div>
            <div className="relative h-64 md:h-80 rounded-2xl overflow-hidden shadow-2xl">
              <Image 
                src="https://picsum.photos/seed/security-vault/800/600" 
                alt="Secure data vault" 
                fill 
                className="object-cover"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-teal-900/20 mix-blend-multiply" />
            </div>
          </div>
          {/* Abstract blobs */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-teal-800 rounded-full blur-3xl -mr-32 -mt-32" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-teal-800 rounded-full blur-3xl -ml-32 -mb-32" />
        </div>

        {/* Final CTA */}
        <div className="text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-6">Ready to see it in action?</h2>
          <p className="text-slate-600 mb-10 max-w-2xl mx-auto text-lg">
            See how RevRecover AI integrates with your specific Patient Management System.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/book-demo">
              <button className="bg-teal-600 text-white px-8 py-4 rounded-xl font-bold hover:bg-teal-700 transition-all shadow-lg shadow-teal-600/20 flex items-center justify-center gap-2">
                Schedule a Personalized Demo <ArrowRight className="w-4 h-4" />
              </button>
            </Link>
            <Link href="/pricing">
              <button className="bg-white text-slate-700 px-8 py-4 rounded-xl font-bold border border-slate-200 hover:bg-slate-50 transition-all shadow-sm">
                View Pricing
              </button>
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
