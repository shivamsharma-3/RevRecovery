import React from 'react';
import { Sparkles, AlertTriangle } from 'lucide-react';

/**
 * Hero visual: a faithful, static rendering of the product's actual triage
 * output. Replaces the previous stock photo, which had an invented dashboard
 * ("$14,280", "98%") composited into it — the one remaining fabricated claim
 * on the marketing site, and a 2.9MB JPEG besides.
 *
 * The rows below are the same illustrative denials used on the case-studies
 * page, and the verdicts are what the engine genuinely returns for them.
 */

const ROWS = [
  {
    initial: 'J',
    payer: 'Delta Dental',
    category: 'Missing documentation',
    amount: '$1,240',
    probability: 85,
    tone: 'high' as const,
  },
  {
    initial: 'S',
    payer: 'United Concordia',
    category: 'Medical necessity',
    amount: '$2,890',
    probability: 55,
    tone: 'mid' as const,
  },
  {
    initial: 'M',
    payer: 'Cigna',
    category: 'Frequency limitation',
    amount: '$95',
    probability: 15,
    tone: 'low' as const,
    patientResponsibility: true,
  },
];

const TONE = {
  high: 'text-teal-700',
  mid: 'text-amber-600',
  low: 'text-slate-400',
};

export function HeroVisual() {
  return (
    <div className="w-full max-w-[95%] bg-white rounded-2xl overflow-hidden shadow-2xl border border-slate-200/80">
      {/* Window chrome */}
      <div className="flex items-center gap-1.5 px-4 py-3 border-b border-slate-100 bg-slate-50/80">
        <span className="w-2.5 h-2.5 rounded-full bg-slate-200" />
        <span className="w-2.5 h-2.5 rounded-full bg-slate-200" />
        <span className="w-2.5 h-2.5 rounded-full bg-slate-200" />
        <span className="ml-3 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
          Claims — sorted by expected value
        </span>
      </div>

      <div className="p-4 sm:p-5">
        <div className="flex items-center gap-2 mb-4">
          <Sparkles className="w-3.5 h-3.5 text-teal-600" />
          <span className="text-xs font-bold text-slate-900">Today&apos;s worklist</span>
          <span className="ml-auto text-[10px] font-bold text-slate-400 uppercase tracking-widest">
            Illustrative
          </span>
        </div>

        <div className="space-y-2.5">
          {ROWS.map((row) => (
            <div
              key={row.initial + row.amount}
              className="flex items-center gap-3 p-3 rounded-xl border border-slate-100 bg-white"
            >
              <div className="w-7 h-7 shrink-0 rounded-full bg-slate-100 flex items-center justify-center text-[11px] font-bold text-slate-500">
                {row.initial}
              </div>

              <div className="min-w-0 flex-1">
                <p className="text-[11px] sm:text-xs font-bold text-slate-900 truncate">
                  {row.category}
                </p>
                <p className="text-[10px] text-slate-400 font-medium truncate">{row.payer}</p>
              </div>

              <div className="text-right shrink-0">
                <p className="text-[11px] sm:text-xs font-extrabold text-slate-900 tabular-nums">
                  {row.amount}
                </p>
                <p className={`text-[10px] font-bold tabular-nums ${TONE[row.tone]}`}>
                  {row.probability}% likely
                </p>
              </div>
            </div>
          ))}
        </div>

        <div className="flex items-start gap-2 mt-4 p-3 rounded-xl bg-amber-50 border border-amber-100">
          <AlertTriangle className="w-3.5 h-3.5 text-amber-600 shrink-0 mt-px" />
          <p className="text-[10px] sm:text-[11px] text-amber-800 font-medium leading-relaxed">
            The $95 cleaning is a frequency limit — contractual, not appealable. Bill the patient
            instead of wasting a follow-up on it.
          </p>
        </div>
      </div>
    </div>
  );
}
