import React from 'react';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { Photo } from '@/components/Photo';
import Link from 'next/link';
import { CheckCircle2, ArrowRight, ArrowLeft } from 'lucide-react';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';

const solutionsData = {
  'dental': {
    title: 'Dental Practices',
    variant: 'dental-detail' as const,
    description: 'Dental billing is high-volume and low-value per claim, which is exactly why denials get abandoned rather than worked. RevRecover AI reads each denial, tells you whether it is genuinely appealable, and drafts the letter so the follow-up actually happens.',
    features: [
      { title: 'Denial triage', desc: 'Every denied claim gets a recovery probability and a root cause, not just a status.' },
      { title: 'Drafted appeals', desc: 'Appeal letters written against the specific denial reason, with placeholders where clinical detail is needed.' },
      { title: 'Honest write-off calls', desc: 'Frequency limits and alternate-benefit downgrades are flagged as patient billing, not appeals.' }
    ],
    stats: [
      { value: 'CDT', label: 'Dental coding aware' },
      { value: '~10s', label: 'Per claim triage' },
      { value: '0', label: 'Setup cost' }
    ]
  },
  'surgical': {
    title: 'Surgical Centers',
    variant: 'surgical-detail' as const,
    description: 'Ambulatory surgery centres carry fewer claims but far more dollars per denial, so a single abandoned appeal is expensive. The engine weighs each denial against known payer behaviour patterns and drafts a clinical appeal you can review and send.',
    features: [
      { title: 'High-value prioritisation', desc: 'Priority reflects expected recovered dollars and filing deadlines, not probability alone.' },
      { title: 'Medical necessity appeals', desc: 'Drafts the clinical argument and tells you exactly which documentation to attach.' },
      { title: 'Bundling and modifier denials', desc: 'Explains why services may be separately billable and what supports it.' }
    ],
    stats: [
      { value: 'CPT', label: 'Medical coding aware' },
      { value: 'Aging', label: 'Filing windows factored in' },
      { value: 'Draft', label: 'Review before sending' }
    ]
  },
  'specialty': {
    title: 'Specialty Clinics',
    variant: 'specialty-detail' as const,
    description: 'Specialty practices deal with high-cost treatments and complex prior authorisations, where a denial can sit unworked for months. The engine classifies the denial, estimates recoverability honestly, and gives the front office a concrete next step.',
    features: [
      { title: 'Prior authorisation denials', desc: 'Flags where retro-authorisation is plausible and where it is not.' },
      { title: 'Coding error detection', desc: 'Identifies likely coding causes so the claim can be corrected and resubmitted.' },
      { title: 'Clear next actions', desc: 'Names the payer, document, or code involved instead of saying "follow up".' }
    ],
    stats: [
      { value: 'Calibrated', label: 'Not blindly optimistic' },
      { value: 'Per-claim', label: 'Reasoning you can audit' },
      { value: 'Trial', label: '30 days, no card' }
    ]
  },
  'enterprise': {
    title: 'Enterprise Health Systems',
    variant: 'enterprise-detail' as const,
    description: 'We are early, and we will be straight with you: we do not yet have EHR integrations with Epic or Cerner, and we have not completed a SOC 2 audit. If you are an enterprise system, talk to us about what you would need before this is viable for you.',
    features: [
      { title: 'Multi-location view', desc: 'Track claims and clinics across your account in one place.' },
      { title: 'Audit logging', desc: 'Every data change is recorded against the user who made it.' },
      { title: 'Integrations on request', desc: 'No EHR connectors yet. Tell us which one matters and we will discuss scope.' }
    ],
    stats: [
      { value: 'Early', label: 'Access stage' },
      { value: 'Manual', label: 'Import today' },
      { value: 'Talk', label: 'To us first' }
    ]
  }
};

export function generateStaticParams() {
  return Object.keys(solutionsData).map((type) => ({ type }));
}

export async function generateMetadata({ params }: { params: Promise<{ type: string }> }): Promise<Metadata> {
  const { type } = await params;
  const solution = solutionsData[type as keyof typeof solutionsData];
  if (!solution) return { title: 'Solution not found' };

  return {
    title: solution.title,
    description: solution.description.slice(0, 155),
    alternates: { canonical: `/solutions/${type}` },
    openGraph: {
      title: `${solution.title} | RevRecover AI`,
      description: solution.description.slice(0, 155),
    },
  };
}

export default async function SolutionDetailPage({ params }: { params: Promise<{ type: string }> }) {
  const { type } = await params;
  const solution = solutionsData[type as keyof typeof solutionsData];

  if (!solution) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-surface text-on-surface">
      <Navbar />
      <main className="pt-32 pb-24 px-6 max-w-7xl mx-auto">
        <div className="mb-8">
          <Link href="/solutions" className="inline-flex items-center gap-2 text-teal-600 hover:text-teal-700 font-medium transition-colors">
            <ArrowLeft className="w-4 h-4" />
            Back to Solutions
          </Link>
        </div>

        <div className="bg-white rounded-[2rem] shadow-xl border border-teal-500/10 overflow-hidden mb-16">
          <div className="relative h-64 md:h-96 w-full">
            <Photo variant={solution.variant} priority sizes="100vw" />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-slate-900/20 to-transparent" />
            <div className="absolute bottom-8 left-8 md:bottom-12 md:left-12">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-500/20 backdrop-blur-md text-teal-50 text-xs font-bold tracking-widest uppercase mb-4 border border-teal-400/30">
                Solution Overview
              </div>
              <h1 className="text-4xl md:text-6xl font-extrabold text-white font-headline tracking-tight">{solution.title}</h1>
            </div>
          </div>
          
          <div className="p-8 md:p-12 lg:p-16">
            <div className="grid lg:grid-cols-3 gap-16">
              <div className="lg:col-span-2">
                <h2 className="text-2xl font-bold text-slate-900 mb-6">The Challenge & Our Approach</h2>
                <p className="text-lg text-slate-600 leading-relaxed mb-12">
                  {solution.description}
                </p>
                
                <h3 className="text-xl font-bold text-slate-900 mb-6">Key Capabilities</h3>
                <div className="space-y-6">
                  {solution.features.map((feature, index) => (
                    <div key={index} className="flex items-start gap-4 p-6 rounded-2xl bg-slate-50 border border-slate-100">
                      <div className="w-12 h-12 bg-teal-100 rounded-full flex items-center justify-center shrink-0">
                        <CheckCircle2 className="w-6 h-6 text-teal-600" />
                      </div>
                      <div>
                        <h4 className="text-lg font-bold text-slate-900 mb-2">{feature.title}</h4>
                        <p className="text-slate-600 leading-relaxed">{feature.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              <div>
                <div className="bg-teal-900 rounded-3xl p-8 text-white sticky top-32 shadow-2xl shadow-teal-900/20">
                  <h3 className="text-xl font-bold mb-8 text-teal-50">Impact Metrics</h3>
                  <div className="space-y-8">
                    {solution.stats.map((stat, index) => (
                      <div key={index}>
                        <div className="text-4xl font-black text-teal-400 mb-2">{stat.value}</div>
                        <div className="text-sm font-medium text-teal-100/80 uppercase tracking-wide">{stat.label}</div>
                        {index < solution.stats.length - 1 && <div className="h-px w-full bg-teal-800 mt-8" />}
                      </div>
                    ))}
                  </div>
                  
                  <div className="mt-12 pt-8 border-t border-teal-800">
                    <p className="text-teal-100/80 text-sm mb-6">Ready to transform your {solution.title.toLowerCase()} revenue cycle?</p>
                    <Link href={`/book-demo?solution=${type}`} className="block w-full">
                      <button className="w-full py-4 bg-teal-500 text-white font-bold rounded-xl hover:bg-teal-400 transition-colors shadow-lg shadow-teal-500/25 active:scale-[0.98]">
                        Get My {solution.title} Demo
                      </button>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
