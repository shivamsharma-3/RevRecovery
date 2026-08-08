import React from 'react';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import Link from 'next/link';
import { ArrowRight, FileText, AlertTriangle, CheckCircle2, Info } from 'lucide-react';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Example Scenarios',
  description:
    'Worked examples showing how RevRecover AI triages four common denial types, including the ones it tells you not to appeal.',
  alternates: { canonical: '/case-studies' },
};

const scenarios = [
  {
    label: 'Missing documentation',
    claim: 'D2740 porcelain crown, $1,240, denied 22 days ago by a commercial payer for missing attachments.',
    verdict: 'Appeal',
    probability: 'High',
    reasoning:
      'The service is covered under the plan — the submission was incomplete. This is the most recoverable denial category there is, and the claim is young enough that the filing window is not a concern.',
    action:
      'Attach the pre-operative periapical radiograph and the clinical narrative describing the fracture, then resubmit under the original claim number.',
    tone: 'good' as const,
  },
  {
    label: 'Frequency limitation',
    claim: 'D1110 adult prophylaxis, $95, denied because the plan covers two cleanings per benefit year and this was the third.',
    verdict: 'Do not appeal',
    probability: 'Low',
    reasoning:
      'This is contractual plan design, not a payer error. Appealing it costs staff time and will not change the outcome. Most tools will happily generate an appeal here anyway; ours tells you not to bother.',
    action:
      'Bill the patient directly. If the practice did not disclose the frequency limit beforehand, consider a courtesy adjustment.',
    tone: 'warn' as const,
  },
  {
    label: 'Coordination of benefits',
    claim: 'Composite restoration, $310, denied 40 days ago pending coordination of benefits information.',
    verdict: 'Appeal',
    probability: 'Medium-high',
    reasoning:
      'Recoverable, but it depends on the patient responding to the payer — which is the part practices tend to drop. The claim is still comfortably inside the filing window.',
    action:
      'Contact the patient to update their COB record with the payer, confirm which plan is primary, then resubmit. Set a follow-up for 14 days.',
    tone: 'good' as const,
  },
  {
    label: 'Timely filing',
    claim: 'Surgical extraction, $680, denied for timely filing. Date of service is 14 months old.',
    verdict: 'Write off',
    probability: 'Very low',
    reasoning:
      'Past the payer appeal window with no documented proof of original timely submission. Chasing this is almost always a net loss of staff time.',
    action:
      'Write off or bill the patient if your financial policy allows it. Worth reviewing why the claim was never worked — that pattern is usually the real problem.',
    tone: 'bad' as const,
  },
];

const toneStyles = {
  good: { badge: 'bg-teal-50 text-teal-700', icon: CheckCircle2, iconColor: 'text-teal-600' },
  warn: { badge: 'bg-amber-50 text-amber-700', icon: AlertTriangle, iconColor: 'text-amber-600' },
  bad: { badge: 'bg-slate-100 text-slate-600', icon: Info, iconColor: 'text-slate-500' },
};

export default function CaseStudiesPage() {
  return (
    <div className="min-h-screen bg-surface text-on-surface">
      <Navbar />
      <main className="pt-32 pb-24 px-6 max-w-5xl mx-auto">
        <div className="text-center mb-8">
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
            constructed examples; the reasoning is what the product actually produces.
          </p>
        </div>

        <div className="space-y-8">
          {scenarios.map((s) => {
            const style = toneStyles[s.tone];
            const Icon = style.icon;
            return (
              <div
                key={s.label}
                className="bg-white rounded-[2rem] shadow-sm border border-teal-500/10 p-8 md:p-10"
              >
                <div className="flex items-start justify-between gap-4 mb-6 flex-wrap">
                  <div className="flex items-center gap-3">
                    <Icon className={`w-6 h-6 ${style.iconColor}`} />
                    <h2 className="text-2xl font-bold text-slate-900">{s.label}</h2>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest ${style.badge}`}>
                      {s.verdict}
                    </span>
                    <span className="px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest bg-slate-100 text-slate-500">
                      {s.probability}
                    </span>
                  </div>
                </div>

                <p className="text-sm font-mono text-slate-500 bg-slate-50 border border-slate-100 rounded-2xl p-4 mb-6 leading-relaxed">
                  {s.claim}
                </p>

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Why</div>
                    <p className="text-slate-600 leading-relaxed text-sm">{s.reasoning}</p>
                  </div>
                  <div>
                    <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">What to do</div>
                    <p className="text-slate-600 leading-relaxed text-sm">{s.action}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-20 bg-teal-900 rounded-[2.5rem] p-10 md:p-16 text-center">
          <h2 className="text-3xl md:text-4xl font-extrabold text-white mb-4 font-headline">
            Try it on your own denials
          </h2>
          <p className="text-teal-100/80 mb-8 max-w-2xl mx-auto leading-relaxed">
            The fastest way to judge this is to run it against claims you already know the answer to.
            If it disagrees with you, we want to hear about it.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/dashboard">
              <button className="bg-white text-teal-900 px-10 py-5 rounded-2xl font-bold text-lg hover:bg-teal-50 transition-all inline-flex items-center gap-2">
                Get started <ArrowRight className="w-5 h-5" />
              </button>
            </Link>
            <Link href="/contact">
              <button className="bg-teal-800/50 backdrop-blur text-white border-2 border-teal-700 px-10 py-5 rounded-2xl font-bold text-lg hover:bg-teal-800 transition-all">
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
