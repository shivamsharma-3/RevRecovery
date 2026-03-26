import React from 'react';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import Image from 'next/image';
import Link from 'next/link';

export default function CaseStudiesPage() {
  return (
    <div className="min-h-screen bg-surface text-on-surface">
      <Navbar />
      <main className="pt-32 pb-24 px-6 max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h1 className="text-5xl md:text-6xl font-extrabold text-teal-900 mb-6 font-headline tracking-tight">Proven Results</h1>
          <p className="text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed">
            See how healthcare organizations across the country are recovering millions in lost revenue with RevRecover AI.
          </p>
        </div>
        
        <div className="space-y-16 mb-24">
          {/* Case Study 1 */}
          <div className="bg-white rounded-[2rem] shadow-sm border border-teal-500/10 overflow-hidden flex flex-col md:flex-row group hover:shadow-md transition-all">
            <div className="md:w-2/5 relative h-64 md:h-auto">
              <Image 
                src="https://picsum.photos/seed/dental-practice/800/800" 
                alt="Modern dental practice office" 
                fill 
                className="object-cover group-hover:scale-105 transition-transform duration-700"
                referrerPolicy="no-referrer"
              />
            </div>
            <div className="md:w-3/5 p-8 md:p-12 flex flex-col justify-center">
              <div className="flex items-center gap-4 mb-6">
                <div className="bg-teal-50 text-teal-800 px-3 py-1 rounded-full text-sm font-bold tracking-wide uppercase">Dental</div>
                <div className="text-slate-400 text-sm">Multi-location Practice</div>
              </div>
              <h2 className="text-3xl font-bold text-slate-900 mb-4">Premier Dental Group</h2>
              <p className="text-slate-600 mb-8 leading-relaxed">
                Struggling with a growing backlog of patient balances and understaffed front desks across 5 locations, Premier Dental implemented RevRecover AI's automated SMS and email outreach.
              </p>
              <div className="grid grid-cols-2 gap-6 mb-8">
                <div>
                  <div className="text-4xl font-black text-teal-600 mb-1">+18%</div>
                  <div className="text-sm text-slate-500 font-medium">Increase in patient collections</div>
                </div>
                <div>
                  <div className="text-4xl font-black text-teal-600 mb-1">90 Days</div>
                  <div className="text-sm text-slate-500 font-medium">Time to achieve ROI</div>
                </div>
              </div>
              <blockquote className="border-l-4 border-teal-500 pl-4 italic text-slate-700 mb-6">
                "The AI handles the awkward financial conversations we used to dread. Patients appreciate the easy payment links, and our staff can focus on care."
              </blockquote>
              <div className="text-sm font-bold text-slate-900">— Dr. Sarah Jenkins, Clinical Director</div>
            </div>
          </div>
          
          {/* Case Study 2 */}
          <div className="bg-white rounded-[2rem] shadow-sm border border-teal-500/10 overflow-hidden flex flex-col md:flex-row-reverse group hover:shadow-md transition-all">
            <div className="md:w-2/5 relative h-64 md:h-auto">
              <Image 
                src="https://picsum.photos/seed/surgical-facility/800/800" 
                alt="Modern surgical facility" 
                fill 
                className="object-cover group-hover:scale-105 transition-transform duration-700"
                referrerPolicy="no-referrer"
              />
            </div>
            <div className="md:w-3/5 p-8 md:p-12 flex flex-col justify-center">
              <div className="flex items-center gap-4 mb-6">
                <div className="bg-teal-50 text-teal-800 px-3 py-1 rounded-full text-sm font-bold tracking-wide uppercase">Ambulatory Surgery</div>
                <div className="text-slate-400 text-sm">Regional ASC</div>
              </div>
              <h2 className="text-3xl font-bold text-slate-900 mb-4">Valley Surgical Center</h2>
              <p className="text-slate-600 mb-8 leading-relaxed">
                Facing high denial rates on complex orthopedic procedures, Valley Surgical deployed our Denial Prediction AI to catch coding errors before submission and automate appeals for rejected claims.
              </p>
              <div className="grid grid-cols-2 gap-6 mb-8">
                <div>
                  <div className="text-4xl font-black text-teal-600 mb-1">28 Days</div>
                  <div className="text-sm text-slate-500 font-medium">Average days in A/R (Down from 45)</div>
                </div>
                <div>
                  <div className="text-4xl font-black text-teal-600 mb-1">-42%</div>
                  <div className="text-sm text-slate-500 font-medium">Reduction in initial denials</div>
                </div>
              </div>
              <blockquote className="border-l-4 border-teal-500 pl-4 italic text-slate-700 mb-6">
                "The automated appeal letters are incredibly detailed, citing specific medical necessity guidelines that our billing team simply didn't have time to research."
              </blockquote>
              <div className="text-sm font-bold text-slate-900">— Michael Chen, CFO</div>
            </div>
          </div>

          {/* Case Study 3 */}
          <div className="bg-white rounded-[2rem] shadow-sm border border-teal-500/10 overflow-hidden flex flex-col md:flex-row group hover:shadow-md transition-all">
            <div className="md:w-2/5 relative h-64 md:h-auto">
              <Image 
                src="https://picsum.photos/seed/orthopedic-clinic/800/800" 
                alt="Orthopedic specialty clinic" 
                fill 
                className="object-cover group-hover:scale-105 transition-transform duration-700"
                referrerPolicy="no-referrer"
              />
            </div>
            <div className="md:w-3/5 p-8 md:p-12 flex flex-col justify-center">
              <div className="flex items-center gap-4 mb-6">
                <div className="bg-teal-50 text-teal-800 px-3 py-1 rounded-full text-sm font-bold tracking-wide uppercase">Specialty Clinic</div>
                <div className="text-slate-400 text-sm">Orthopedic Network</div>
              </div>
              <h2 className="text-3xl font-bold text-slate-900 mb-4">Metro Orthopedics</h2>
              <p className="text-slate-600 mb-8 leading-relaxed">
                Metro Orthopedics had accumulated significant "uncollectible" debt. We ran our historical recovery engine on their past 12 months of written-off claims, identifying missed modifier opportunities.
              </p>
              <div className="grid grid-cols-2 gap-6 mb-8">
                <div>
                  <div className="text-4xl font-black text-teal-600 mb-1">$120k</div>
                  <div className="text-sm text-slate-500 font-medium">Recovered from written-off claims</div>
                </div>
                <div>
                  <div className="text-4xl font-black text-teal-600 mb-1">3.5x</div>
                  <div className="text-sm text-slate-500 font-medium">Return on investment</div>
                </div>
              </div>
              <blockquote className="border-l-4 border-teal-500 pl-4 italic text-slate-700 mb-6">
                "Finding $120,000 in revenue we had already written off was a game-changer for our quarterly financials. It's like finding money in the couch cushions, but at an enterprise scale."
              </blockquote>
              <div className="text-sm font-bold text-slate-900">— Elena Rodriguez, Director of Revenue Cycle</div>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="bg-slate-50 rounded-[2rem] p-12 text-center border border-slate-200">
          <h2 className="text-3xl font-bold text-slate-900 mb-6">Ready to write your own success story?</h2>
          <p className="text-slate-600 mb-8 max-w-2xl mx-auto text-lg">
            Join hundreds of healthcare providers who have transformed their revenue cycle with our AI-driven platform.
          </p>
          <Link href="/auth">
            <button className="bg-teal-600 text-white px-8 py-4 rounded-xl font-bold hover:bg-teal-700 transition-colors shadow-lg shadow-teal-600/20">
              Start Your Free Trial
            </button>
          </Link>
        </div>
      </main>
      <Footer />
    </div>
  );
}
