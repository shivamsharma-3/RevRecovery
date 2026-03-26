import React from 'react';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import Image from 'next/image';
import { History, Heart, Lightbulb, Lock } from 'lucide-react';

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-surface text-on-surface">
      <Navbar />
      <main className="pt-32 pb-24 px-6 max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h1 className="text-5xl md:text-6xl font-extrabold text-teal-900 mb-6 font-headline tracking-tight">About RevRecover AI</h1>
          <p className="text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed">
            We are on a mission to bring clinical-grade revenue recovery to modern healthcare practices, ensuring providers get paid for the care they deliver.
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 gap-16 items-center mb-24">
          <div className="relative h-[500px] rounded-[2rem] overflow-hidden shadow-xl">
            <Image 
              src="https://picsum.photos/seed/teamwork/800/1000" 
              alt="Healthcare administrators and engineers collaborating" 
              fill 
              className="object-cover"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-teal-900/10 mix-blend-multiply" />
          </div>
          
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-50 text-teal-800 text-xs font-bold tracking-widest uppercase mb-6">
              <History className="w-4 h-4" />
              Our Story
            </div>
            <h2 className="text-4xl font-bold text-slate-900 mb-6">Built by providers, for providers.</h2>
            <p className="text-slate-600 mb-6 leading-relaxed text-lg">
              Founded in 2023 by a team of former healthcare administrators and AI engineers, RevRecover AI was born out of frustration. We watched our own clinics leave millions of dollars on the table due to inefficient billing processes, complex insurance denials, and understaffed front desks.
            </p>
            <p className="text-slate-600 mb-8 leading-relaxed text-lg">
              Traditional collection agencies alienated patients, and existing software was too rigid. We realized that to truly solve the revenue cycle problem, we needed a system that understood clinical context—a system that could parse an EOB like a seasoned biller and communicate with a patient like a compassionate care coordinator.
            </p>
            <div className="grid grid-cols-2 gap-6 border-t border-slate-200 pt-8">
              <div>
                <div className="text-4xl font-black text-teal-600 mb-2">$500M+</div>
                <div className="text-sm font-bold text-slate-500 uppercase tracking-wider">Revenue Recovered</div>
              </div>
              <div>
                <div className="text-4xl font-black text-teal-600 mb-2">1,200+</div>
                <div className="text-sm font-bold text-slate-500 uppercase tracking-wider">Clinics Supported</div>
              </div>
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
              <h3 className="text-xl font-bold text-slate-900 mb-4">Clinical Precision</h3>
              <p className="text-slate-600 leading-relaxed">
                General AI isn't enough for healthcare. Every decision our platform makes is backed by millions of clinical data points, specific CPT codes, and historical payer behavior.
              </p>
            </div>
            
            <div className="bg-white p-10 rounded-[2rem] shadow-sm border border-teal-500/10 text-center group hover:-translate-y-2 transition-transform duration-300">
              <div className="w-16 h-16 bg-teal-50 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:bg-teal-600 transition-colors">
                <Lock className="w-8 h-8 text-teal-600 group-hover:text-white transition-colors" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-4">Uncompromising Security</h3>
              <p className="text-slate-600 leading-relaxed">
                We treat your patients' data with the highest level of security. We don't just meet industry compliance standards like HIPAA and SOC 2; we aim to exceed them.
              </p>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
