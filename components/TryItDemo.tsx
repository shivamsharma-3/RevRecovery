'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Sparkles, Loader2, AlertTriangle, ArrowRight } from 'lucide-react';

type DemoResult = {
  recoveryProbability: number;
  priority: 'Low' | 'Medium' | 'High';
  denialCategory: string;
  rootCause: string;
  recommendedAction: string;
  isPatientResponsibility: boolean;
};

const PRESETS = [
  { label: 'Missing X-ray', amount: '1240', denialReason: 'Missing documentation — radiograph not received', ageDays: '22', payer: 'Delta Dental' },
  { label: 'Timely filing', amount: '680', denialReason: 'Timely filing limit exceeded', ageDays: '430', payer: 'Aetna' },
  { label: 'Third cleaning', amount: '95', denialReason: 'Frequency limitation — plan covers two cleanings per benefit year', ageDays: '30', payer: 'Cigna' },
];

export function TryItDemo() {
  const [amount, setAmount] = useState('');
  const [denialReason, setDenialReason] = useState('');
  const [ageDays, setAgeDays] = useState('');
  const [payer, setPayer] = useState('');
  const [result, setResult] = useState<DemoResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isRunning, setIsRunning] = useState(false);

  const applyPreset = (p: (typeof PRESETS)[number]) => {
    setAmount(p.amount);
    setDenialReason(p.denialReason);
    setAgeDays(p.ageDays);
    setPayer(p.payer);
    setResult(null);
    setError(null);
  };

  const run = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsRunning(true);
    setError(null);
    setResult(null);
    try {
      const res = await fetch('/api/ai/demo', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount, denialReason, ageDays, payer }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data?.error || 'Something went wrong.');
        return;
      }
      setResult(data);
    } catch {
      setError('Could not reach the server. Check your connection and try again.');
    } finally {
      setIsRunning(false);
    }
  };

  return (
    <section id="try-it" className="scroll-mt-16 py-16 md:py-20 px-6 bg-white border-y border-slate-100">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-50 text-teal-800 text-[10px] font-bold tracking-widest uppercase mb-4">
            <Sparkles className="w-3.5 h-3.5" />
            Try it — no signup
          </div>
          <h2 className="text-2xl md:text-3xl font-extrabold tracking-tighter mb-3 font-headline">
            Test it on a denial you already know the answer to
          </h2>
          <p className="text-sm text-slate-500 max-w-2xl mx-auto font-medium leading-relaxed">
            The fastest way to judge this is to give it a claim you have already worked. If it
            disagrees with you, we would genuinely like to hear about it.
            <span className="block mt-1 text-slate-400">Please don&apos;t enter patient names or any identifying detail.</span>
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 items-start">
          <form onSubmit={run} className="bg-slate-50 rounded-[2rem] p-6 md:p-8 border border-slate-100">
            <div className="flex flex-wrap gap-2 mb-6">
              {PRESETS.map((p) => (
                <button
                  key={p.label}
                  type="button"
                  onClick={() => applyPreset(p)}
                  className="px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-[11px] font-bold text-slate-600 hover:border-teal-400 hover:text-teal-700 transition-all"
                >
                  {p.label}
                </button>
              ))}
            </div>

            <div className="space-y-4">
              <div>
                <label htmlFor="demo-reason" className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">
                  Denial reason *
                </label>
                <textarea
                  id="demo-reason"
                  required
                  rows={2}
                  value={denialReason}
                  onChange={(e) => setDenialReason(e.target.value)}
                  maxLength={300}
                  placeholder="e.g. Missing documentation — radiograph not received"
                  className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-sm font-medium outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 resize-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="demo-amount" className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">
                    Amount ($) *
                  </label>
                  <input
                    id="demo-amount"
                    required
                    type="number"
                    min="1"
                    step="0.01"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    placeholder="1240"
                    className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-sm font-medium outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500"
                  />
                </div>
                <div>
                  <label htmlFor="demo-age" className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">
                    Days old
                  </label>
                  <input
                    id="demo-age"
                    type="number"
                    min="0"
                    value={ageDays}
                    onChange={(e) => setAgeDays(e.target.value)}
                    placeholder="22"
                    className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-sm font-medium outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="demo-payer" className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">
                  Payer
                </label>
                <input
                  id="demo-payer"
                  type="text"
                  value={payer}
                  onChange={(e) => setPayer(e.target.value)}
                  placeholder="Delta Dental"
                  className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-sm font-medium outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isRunning}
              className="w-full mt-6 py-3.5 bg-teal-600 text-white rounded-xl font-bold text-sm hover:bg-teal-700 transition-all shadow-lg shadow-teal-500/20 disabled:opacity-60 flex items-center justify-center gap-2"
            >
              {isRunning ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
              {isRunning ? 'Analysing…' : 'Analyse this claim'}
            </button>
          </form>

          <div className="min-h-[280px]">
            {!result && !error && !isRunning && (
              <div className="h-full flex items-center justify-center text-center p-8 border-2 border-dashed border-slate-200 rounded-[2rem]">
                <p className="text-sm text-slate-400 font-medium max-w-xs leading-relaxed">
                  Pick an example or enter your own, and the verdict appears here.
                </p>
              </div>
            )}

            {isRunning && (
              <div className="h-full flex items-center justify-center p-8 border border-slate-100 rounded-[2rem] bg-slate-50">
                <Loader2 className="w-6 h-6 animate-spin text-teal-600" />
              </div>
            )}

            {error && (
              <div className="p-6 bg-amber-50 border border-amber-100 rounded-[2rem] flex gap-3">
                <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                <p className="text-sm text-amber-800 font-medium leading-relaxed">{error}</p>
              </div>
            )}

            {result && (
              <div className="bg-slate-50 rounded-[2rem] p-6 md:p-8 border border-slate-100 space-y-5 animate-in fade-in duration-300">
                <div className="flex items-start gap-6">
                  <div>
                    <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Recovery probability</div>
                    <div className={`text-4xl font-extrabold tracking-tight ${
                      result.recoveryProbability >= 0.6 ? 'text-teal-700' :
                      result.recoveryProbability >= 0.4 ? 'text-amber-600' : 'text-slate-400'
                    }`}>
                      {Math.round(result.recoveryProbability * 100)}%
                    </div>
                  </div>
                  <div>
                    <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Priority</div>
                    <div className="text-lg font-bold text-slate-900">{result.priority}</div>
                    <div className="text-[11px] font-medium text-slate-500 mt-1">{result.denialCategory}</div>
                  </div>
                </div>

                {result.isPatientResponsibility && (
                  <div className="flex gap-3 p-4 bg-white border border-slate-200 rounded-2xl">
                    <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                    <p className="text-xs text-slate-700 font-medium leading-relaxed">
                      Contractual — this is a patient billing conversation, not an appeal.
                    </p>
                  </div>
                )}

                <div>
                  <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">Root cause</div>
                  <p className="text-sm text-slate-700 leading-relaxed">{result.rootCause}</p>
                </div>
                <div>
                  <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">Recommended action</div>
                  <p className="text-sm text-slate-700 leading-relaxed">{result.recommendedAction}</p>
                </div>

                <div className="pt-2 border-t border-slate-200">
                  <Link
                    href="/dashboard"
                    className="inline-flex items-center gap-2 text-sm font-bold text-teal-700 hover:text-teal-900 transition-colors"
                  >
                    Run this across your whole denial list <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
