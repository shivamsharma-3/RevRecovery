import React from 'react';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import Image from 'next/image';
import Link from 'next/link';
import { CheckCircle2, ArrowRight } from 'lucide-react';

export default function SolutionsPage() {
  return (
    <div className="min-h-screen bg-surface text-on-surface">
      <Navbar />
      <main className="pt-32 pb-24 px-6 max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h1 className="text-5xl md:text-6xl font-extrabold text-teal-900 mb-6 font-headline tracking-tight">Revenue Recovery Solutions</h1>
          <p className="text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed">
            Tailored, AI-driven revenue cycle management designed specifically for the complexities of modern medical practices.
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 gap-12 mb-24">
          {/* Dental Recovery */}
          <div className="bg-white rounded-[2rem] shadow-sm border border-teal-500/10 overflow-hidden group hover:shadow-md transition-all">
            <div className="relative h-64 w-full">
              <Image 
                src="https://picsum.photos/seed/dental-office/800/600" 
                alt="Modern dental clinic office" 
                fill 
                className="object-cover group-hover:scale-105 transition-transform duration-700"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
              <h3 className="absolute bottom-6 left-8 text-3xl font-bold text-white">Dental Practices</h3>
            </div>
            <div className="p-8">
              <p className="text-slate-600 mb-6 leading-relaxed">
                Dental billing involves high volumes of low-to-medium value claims. Our system integrates directly with Open Dental and Dentrix to automate follow-ups for outstanding claims and patient balances, recovering an average of $3,200/month in aged receivables.
              </p>
              <ul className="space-y-3 text-sm text-slate-700 mb-8">
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-teal-600 shrink-0" />
                  <span><strong>Automated EOB parsing:</strong> Instantly identify underpayments and missing attachments.</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-teal-600 shrink-0" />
                  <span><strong>Patient payment plans:</strong> SMS-based links for easy installment setups.</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-teal-600 shrink-0" />
                  <span><strong>Pre-auth tracking:</strong> Prevent denials before procedures occur.</span>
                </li>
              </ul>
              <Link href="/contact" className="text-teal-700 font-bold hover:text-teal-800 flex items-center gap-2">
                Explore Dental Solutions <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
          
          {/* Surgical Centers */}
          <div className="bg-white rounded-[2rem] shadow-sm border border-teal-500/10 overflow-hidden group hover:shadow-md transition-all">
            <div className="relative h-64 w-full">
              <Image 
                src="https://picsum.photos/seed/surgery-center/800/600" 
                alt="Surgical center operating room" 
                fill 
                className="object-cover group-hover:scale-105 transition-transform duration-700"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
              <h3 className="absolute bottom-6 left-8 text-3xl font-bold text-white">Surgical Centers</h3>
            </div>
            <div className="p-8">
              <p className="text-slate-600 mb-6 leading-relaxed">
                Ambulatory Surgery Centers (ASCs) face complex coding and high-value claim denials. Our AI models are trained on millions of surgical claims to predict denials and generate clinical appeal letters, improving first-pass resolution by up to 18%.
              </p>
              <ul className="space-y-3 text-sm text-slate-700 mb-8">
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-teal-600 shrink-0" />
                  <span><strong>Denial prediction AI:</strong> Flags claims likely to be denied based on historical payer behavior.</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-teal-600 shrink-0" />
                  <span><strong>Automated appeals:</strong> Drafts customized appeal letters citing specific medical necessity guidelines.</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-teal-600 shrink-0" />
                  <span><strong>Implant invoice tracking:</strong> Ensures high-cost items are properly billed and reimbursed.</span>
                </li>
              </ul>
              <Link href="/contact" className="text-teal-700 font-bold hover:text-teal-800 flex items-center gap-2">
                Explore ASC Solutions <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>

          {/* Specialty Clinics */}
          <div className="bg-white rounded-[2rem] shadow-sm border border-teal-500/10 overflow-hidden group hover:shadow-md transition-all">
            <div className="relative h-64 w-full">
              <Image 
                src="https://picsum.photos/seed/medical-clinic/800/600" 
                alt="Specialty medical clinic consultation" 
                fill 
                className="object-cover group-hover:scale-105 transition-transform duration-700"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
              <h3 className="absolute bottom-6 left-8 text-3xl font-bold text-white">Specialty Clinics</h3>
            </div>
            <div className="p-8">
              <p className="text-slate-600 mb-6 leading-relaxed">
                From dermatology to orthopedics, specialty clinics require customized recovery workflows. We adapt to your specific billing codes and payer contracts, ensuring maximum reimbursement for unique treatments and reducing days in A/R by an average of 12 days.
              </p>
              <ul className="space-y-3 text-sm text-slate-700 mb-8">
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-teal-600 shrink-0" />
                  <span><strong>Code-specific logic:</strong> Rules engines tailored to your specialty's specific CPT and ICD-10 codes.</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-teal-600 shrink-0" />
                  <span><strong>Prior authorization tracking:</strong> Automated follow-ups on pending authorizations.</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-teal-600 shrink-0" />
                  <span><strong>Modifier optimization:</strong> Identifies missing or incorrect modifiers that lead to underpayments.</span>
                </li>
              </ul>
              <Link href="/contact" className="text-teal-700 font-bold hover:text-teal-800 flex items-center gap-2">
                Explore Specialty Solutions <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>

          {/* Enterprise Systems */}
          <div className="bg-white rounded-[2rem] shadow-sm border border-teal-500/10 overflow-hidden group hover:shadow-md transition-all">
            <div className="relative h-64 w-full">
              <Image 
                src="https://picsum.photos/seed/hospital-building/800/600" 
                alt="Large healthcare hospital building" 
                fill 
                className="object-cover group-hover:scale-105 transition-transform duration-700"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
              <h3 className="absolute bottom-6 left-8 text-3xl font-bold text-white">Enterprise Systems</h3>
            </div>
            <div className="p-8">
              <p className="text-slate-600 mb-6 leading-relaxed">
                Scalable revenue cycle management for hospital networks and multi-location healthcare organizations. Our enterprise tier offers robust API access, custom reporting dashboards, and dedicated account management to handle high-volume, complex billing environments.
              </p>
              <ul className="space-y-3 text-sm text-slate-700 mb-8">
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-teal-600 shrink-0" />
                  <span><strong>Multi-tenant architecture:</strong> Manage multiple locations and tax IDs from a single interface.</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-teal-600 shrink-0" />
                  <span><strong>Advanced analytics API:</strong> Export data directly to your existing BI tools (Tableau, PowerBI).</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-teal-600 shrink-0" />
                  <span><strong>Custom workflow routing:</strong> Route specific denial types to specialized internal teams automatically.</span>
                </li>
              </ul>
              <Link href="/contact" className="text-teal-700 font-bold hover:text-teal-800 flex items-center gap-2">
                Explore Enterprise Solutions <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="bg-teal-900 rounded-[3rem] p-12 text-center text-white relative overflow-hidden">
          <div className="relative z-10">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">Not sure which solution fits your practice?</h2>
            <p className="text-teal-100 mb-8 max-w-2xl mx-auto text-lg">
              Schedule a free revenue cycle assessment. Our experts will analyze a sample of your aged receivables and provide a realistic projection of recoverable revenue.
            </p>
            <Link href="/contact">
              <button className="bg-white text-teal-900 px-8 py-4 rounded-xl font-bold hover:bg-teal-50 transition-colors shadow-lg">
                Request Free Assessment
              </button>
            </Link>
          </div>
          <div className="absolute top-0 right-0 w-64 h-64 bg-teal-800 rounded-full blur-3xl -mr-32 -mt-32" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-teal-800 rounded-full blur-3xl -ml-32 -mb-32" />
        </div>
      </main>
      <Footer />
    </div>
  );
}
