import React from 'react';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import Link from 'next/link';
import { CheckCircle2, MapPin, Clock, Code, Bot, HeadphonesIcon } from 'lucide-react';

export default function CareersPage() {
  return (
    <div className="min-h-screen bg-surface text-on-surface">
      <Navbar />
      <main className="pt-32 pb-24 px-6 max-w-7xl mx-auto">
        <div className="text-center mb-16 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-50 text-teal-700 text-xs font-bold mb-6 tracking-wider uppercase">
            Join Our Team
          </div>
          <h1 className="text-4xl md:text-6xl font-extrabold text-teal-900 mb-6 font-headline tracking-tight">
            Build the future of healthcare finance
          </h1>
          <p className="text-xl text-slate-600 leading-relaxed">
            We're on a mission to eliminate administrative waste in healthcare so providers can focus on what matters most: patient care. Join us in building intelligent, sovereign systems that recover lost revenue.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-12 mb-24 items-center">
          <div className="relative aspect-video rounded-3xl overflow-hidden shadow-xl">
            <img 
              src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=2070&auto=format&fit=crop" 
              alt="Team collaborating" 
              className="object-cover w-full h-full"
            />
            <div className="absolute inset-0 bg-teal-900/10 mix-blend-multiply"></div>
          </div>
          <div className="space-y-6">
            <h2 className="text-3xl font-bold text-teal-900">Why RevRecover AI?</h2>
            <p className="text-lg text-slate-600">
              We are a fast-growing team of engineers, healthcare experts, and designers who believe that the current state of medical billing is broken. We're building a platform that uses advanced AI to predict denials, automate appeals, and recover revenue that would otherwise be lost.
            </p>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-teal-600 mt-1 shrink-0" />
                <div>
                  <strong className="block text-teal-900">Impactful Work</strong>
                  <span className="text-slate-600">Every line of code you write helps healthcare providers stay independent and focused on patients.</span>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-teal-600 mt-1 shrink-0" />
                <div>
                  <strong className="block text-teal-900">Remote-First Culture</strong>
                  <span className="text-slate-600">Work from anywhere in the US or Canada. We value output over hours logged.</span>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-teal-600 mt-1 shrink-0" />
                <div>
                  <strong className="block text-teal-900">Competitive Benefits</strong>
                  <span className="text-slate-600">Top-tier health, dental, and vision insurance, plus a generous 401(k) match and equity.</span>
                </div>
              </li>
            </ul>
          </div>
        </div>

        <div className="bg-slate-50 rounded-3xl p-10 md:p-16 border border-slate-100 mb-24">
          <h2 className="text-3xl font-bold text-teal-900 mb-10 text-center">Open Positions</h2>
          
          <div className="space-y-4">
            {/* Job 1 */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 flex flex-col md:flex-row md:items-center justify-between gap-6 hover:shadow-md transition-shadow">
              <div>
                <h3 className="text-xl font-bold text-teal-900 mb-2">Senior Full-Stack Engineer</h3>
                <div className="flex flex-wrap gap-3 text-sm text-slate-500">
                  <span className="flex items-center gap-1"><MapPin className="w-4 h-4" /> Remote (US/Canada)</span>
                  <span className="flex items-center gap-1"><Clock className="w-4 h-4" /> Full-time</span>
                  <span className="flex items-center gap-1"><Code className="w-4 h-4" /> Engineering</span>
                </div>
              </div>
              <Link href="/contact" className="shrink-0">
                <button className="w-full md:w-auto px-6 py-3 bg-teal-600 text-white font-medium rounded-xl hover:bg-teal-700 transition-colors">
                  Apply Now
                </button>
              </Link>
            </div>

            {/* Job 2 */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 flex flex-col md:flex-row md:items-center justify-between gap-6 hover:shadow-md transition-shadow">
              <div>
                <h3 className="text-xl font-bold text-teal-900 mb-2">Machine Learning Engineer</h3>
                <div className="flex flex-wrap gap-3 text-sm text-slate-500">
                  <span className="flex items-center gap-1"><MapPin className="w-4 h-4" /> Remote (US/Canada)</span>
                  <span className="flex items-center gap-1"><Clock className="w-4 h-4" /> Full-time</span>
                  <span className="flex items-center gap-1"><Bot className="w-4 h-4" /> AI/ML</span>
                </div>
              </div>
              <Link href="/contact" className="shrink-0">
                <button className="w-full md:w-auto px-6 py-3 bg-teal-600 text-white font-medium rounded-xl hover:bg-teal-700 transition-colors">
                  Apply Now
                </button>
              </Link>
            </div>

            {/* Job 3 */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 flex flex-col md:flex-row md:items-center justify-between gap-6 hover:shadow-md transition-shadow">
              <div>
                <h3 className="text-xl font-bold text-teal-900 mb-2">Healthcare Billing Specialist</h3>
                <div className="flex flex-wrap gap-3 text-sm text-slate-500">
                  <span className="flex items-center gap-1"><MapPin className="w-4 h-4" /> Remote (US)</span>
                  <span className="flex items-center gap-1"><Clock className="w-4 h-4" /> Full-time</span>
                  <span className="flex items-center gap-1"><HeadphonesIcon className="w-4 h-4" /> Operations</span>
                </div>
              </div>
              <Link href="/contact" className="shrink-0">
                <button className="w-full md:w-auto px-6 py-3 bg-teal-600 text-white font-medium rounded-xl hover:bg-teal-700 transition-colors">
                  Apply Now
                </button>
              </Link>
            </div>
          </div>
          
          <div className="mt-12 text-center">
            <p className="text-slate-600 mb-4">Don't see a perfect fit? We're always looking for talented people.</p>
            <Link href="/contact" className="text-teal-600 font-medium hover:text-teal-700 underline underline-offset-4">
              Send us your resume anyway
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
