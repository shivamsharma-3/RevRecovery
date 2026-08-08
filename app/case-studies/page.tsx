import React from 'react';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { Photo, type PhotoVariant } from '@/components/Photo';
import Link from 'next/link';
import {
  ArrowRight, FileText, Stethoscope, Activity, Info,
  AlertTriangle, CheckCircle2, XCircle,
} from 'lucide-react';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Example Scenarios',
  description:
    'Worked examples showing how RevRecover AI triages four common denial types, including the ones it tells you not to appeal.',
  alternates: { canonical: '/case-studies' },
};

type Scenario = {
  category: string;
  setting: string;
  title: string;
  claim: string;
  description: string;
  stats: { value: string; label: string }[];
  reasoning: string;
  action: string;
  photo: PhotoVariant;
  icon: typeof Stethoscope;
  verdict: 'appeal' | 'patient' | 'writeoff';
};

const SCENARIOS: Scenario[] = [
  {
    category: 'Dental',
    setting: 'Missing documentation',
    title: 'The one worth chasing today',
    claim: 'D2740 porcelain crown · $1,240 · denied 22 days ago',
    description:
      'A commercial payer denied this crown for missing attachments. The service is covered under the plan — the submission was simply incomplete. This is the most recoverable denial category there is, and the claim is young enough that the filing window is not yet a concern.',
    stats: [
      { value: '85%', label: 'Recovery probability' },
      { value: 'High', label: 'Suggested priority' },
    ],
    reasoning:
      'Attach the pre-operative periapical radiograph and the clinical narrative describing the fracture, then resubmit under the original claim number.',
    action: 'Appeal',
    photo: 'dental',
    icon: Stethoscope,
    verdict: 'appeal',
  },
  {
    category: 'Dental hygiene',
    setting: 'Frequency limitation',
    title: 'The one you should not appeal',
    claim: 'D1110 adult prophylaxis · $95 · third cleaning this year',
    description:
      'The plan covers two cleanings per benefit year and this was the third. That is contractual plan design, not a payer error. Most tools will happily generate an appeal letter here anyway and burn a morning of staff time on it. Ours tells you not to bother.',
    stats: [
      { value: '15%', label: 'Recovery probability' },
      { value: 'Patient', label: 'Responsibility' },
    ],
    reasoning:
      'Bill the patient directly. If the practice did not disclose the frequency limit beforehand, consider a courtesy adjustment.',
    action: 'Do not appeal',
    photo: 'outreach',
    icon: AlertTriangle,
    verdict: 'patient',
  },
  {
    category: 'Restorative',
    setting: 'Coordination of benefits',
    title: 'The one that needs the patient',
    claim: 'Composite restoration · $310 · denied 40 days ago',
    description:
      'Recoverable, but it turns on the patient responding to their payer — which is exactly the step practices tend to drop. The claim is still comfortably inside the filing window, so the work is chasing a phone call rather than fighting the payer.',
    stats: [
      { value: '75%', label: 'Recovery probability' },
      { value: 'Medium', label: 'Suggested priority' },
    ],
    reasoning:
      'Contact the patient to update their COB record with the payer, confirm which plan is primary, then resubmit. Set a follow-up for 14 days.',
    action: 'Appeal',
    photo: 'specialty',
    icon: Activity,
    verdict: 'appeal',
  },
  {
    category: 'Oral surgery',
    setting: 'Timely filing',
    title: 'The one that is already gone',
    claim: 'Surgical extraction · $680 · date of service 14 months ago',
    description:
      'Past the payer appeal window with no documented proof of original timely submission. Chasing this is almost always a net loss of staff time. Worth reviewing why the claim was never worked, though — that pattern is usually the real problem.',
    stats: [
      { value: '5%', label: 'Recovery probability' },
      { value: 'Low', label: 'Suggested priority' },
    ],
    reasoning:
      'Write off, or bill the patient if your financial policy allows it. Then look at why it sat unworked for fourteen months.',
    action: 'Write off',
    photo: 'surgical',
    icon: XCircle,
    verdict: 'writeoff',
  },
];

const VERDICT_STYLE = {
  appeal: 'bg-teal-50 text-teal-700 border-teal-100',
  patient: 'bg-amber-50 text-amber-700 border-amber-100',
  writeoff: 'bg-slate-100 text-slate-600 border-slate-200',
};

export default function CaseStudiesPage() {
  return (
    <div className="min-h-screen bg-surface text-on-surface">
      <Navbar />
      <main className="pt-32 pb-24 px-6 max-w-7xl mx-auto">
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-50 text-teal-800 text-xs font-bold tracking-widest uppercase mb-6">
            <FileText className="w-4 h-4" />
            Example Scenarios
          </div>
          <h1 className="text-5xl md:text-6xl font-extrabold text-teal-900 mb-6 font-headline tracking-tight">
            How it actually reasons
          </h1>
          <p className="text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed">
            We are early and do not have customer results to show you yet. Publishing invented ones
            would tell you nothing about the product, so instead here is exactly how the engine
            handles four denials that land in a real practice every week.
          </p>
        </div>

        <div className="flex items-start gap-3 max-w-3xl mx-auto mb-16 p-4 rounded-2xl bg-slate-100 border border-slate-200">
          <Info className="w-5 h-5 text-slate-500 shrink-0 mt-0.5" />
          <p className="text-sm text-slate-600 leading-relaxed">
            These are illustrative scenarios, not customer case studies. The claims below are
            constructed examples; the verdicts and reasoning are what the product actually produces.
          </p>
        </div>

        <div className="space-y-12 mb-24">
          {SCENARIOS.map((s, i) => (
            <div
              key={s.title}
              className={`bg-white rounded-[2rem] shadow-sm border border-teal-500/10 overflow-hidden flex flex-col ${
                i % 2 === 1 ? 'md:flex-row-reverse' : 'md:flex-row'
              } group hover:shadow-md transition-all`}
            >
              <div className="md:w-2/5 relative h-64 md:h-auto">
                <Photo variant={s.photo} sizes="(max-width: 768px) 100vw, 40vw" />
                <div
                  className={`absolute top-6 ${i % 2 === 1 ? 'right-6' : 'left-6'} bg-white/90 backdrop-blur p-3 rounded-2xl shadow-lg`}
                >
                  <s.icon className="w-8 h-8 text-teal-600" />
                </div>
              </div>

              <div className="md:w-3/5 p-8 md:p-12 flex flex-col justify-center">
                <div className="flex items-center gap-4 mb-6 flex-wrap">
                  <div className="bg-teal-50 text-teal-800 px-3 py-1 rounded-full text-sm font-bold tracking-wide uppercase">
                    {s.category}
                  </div>
                  <div className="text-slate-400 text-sm">{s.setting}</div>
                  <div
                    className={`ml-auto px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider border ${VERDICT_STYLE[s.verdict]}`}
                  >
                    {s.action}
                  </div>
                </div>

                <h2 className="text-3xl font-bold text-slate-900 mb-3">{s.title}</h2>
                <p className="text-sm font-mono text-slate-500 bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 mb-6">
                  {s.claim}
                </p>
                <p className="text-slate-600 mb-8 leading-relaxed">{s.description}</p>

                <div className="grid grid-cols-2 gap-6 mb-8">
                  {s.stats.map((stat) => (
                    <div key={stat.label} className="bg-teal-50/50 p-4 rounded-2xl border border-teal-100">
                      <div className="text-4xl font-black text-teal-600 mb-1">{stat.value}</div>
                      <div className="text-sm text-slate-500 font-medium">{stat.label}</div>
                    </div>
                  ))}
                </div>

                <blockquote className="border-l-4 border-teal-500 pl-4 text-slate-700 mb-4 bg-slate-50/50 py-4 pr-4 rounded-r-xl leading-relaxed">
                  {s.reasoning}
                </blockquote>
                <div className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-teal-600" />
                  Recommended next step, as produced by the engine
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="bg-teal-900 rounded-[2.5rem] p-10 md:p-16 text-center">
          <h2 className="text-3xl md:text-4xl font-extrabold text-white mb-4 font-headline">
            Try it on your own denials
          </h2>
          <p className="text-teal-100/80 mb-8 max-w-2xl mx-auto leading-relaxed">
            The fastest way to judge this is to run it against claims you already know the answer to.
            If it disagrees with you, we want to hear about it.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/dashboard">
              <button className="w-full sm:w-auto bg-white text-teal-900 px-10 py-5 rounded-2xl font-bold text-lg hover:bg-teal-50 transition-all inline-flex items-center justify-center gap-2">
                Get started <ArrowRight className="w-5 h-5" />
              </button>
            </Link>
            <Link href="/contact">
              <button className="w-full sm:w-auto bg-teal-800/50 backdrop-blur text-white border-2 border-teal-700 px-10 py-5 rounded-2xl font-bold text-lg hover:bg-teal-800 transition-all">
                Talk to us first
              </button>
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
