import React from 'react';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import Image from 'next/image';
import Link from 'next/link';
import { CheckCircle2, ArrowRight, ArrowLeft } from 'lucide-react';
import { notFound } from 'next/navigation';

const solutionsData = {
  'dental': {
    title: 'Dental Practices',
    image: 'https://picsum.photos/seed/dental-office/1200/600',
    description: 'Dental billing involves high volumes of low-to-medium value claims. Our system integrates directly with Open Dental and Dentrix to automate follow-ups for outstanding claims and patient balances, recovering an average of $3,200/month in aged receivables.',
    features: [
      { title: 'Automated EOB parsing', desc: 'Instantly identify underpayments and missing attachments.' },
      { title: 'Patient payment plans', desc: 'SMS-based links for easy installment setups.' },
      { title: 'Pre-auth tracking', desc: 'Prevent denials before procedures occur.' }
    ],
    stats: [
      { value: '$3.2k', label: 'Avg. Monthly Recovery' },
      { value: '45%', label: 'Reduction in AR Days' },
      { value: '98%', label: 'Clean Claim Rate' }
    ]
  },
  'surgical': {
    title: 'Surgical Centers',
    image: 'https://picsum.photos/seed/surgery-center/1200/600',
    description: 'Ambulatory Surgery Centers (ASCs) face complex coding and high-value claim denials. Our AI models are trained on millions of surgical claims to predict denials and generate clinical appeal letters, improving first-pass resolution by up to 18%.',
    features: [
      { title: 'Denial prediction AI', desc: 'Flags claims likely to be denied based on historical payer behavior.' },
      { title: 'Automated appeals', desc: 'Drafts customized appeal letters citing specific medical necessity guidelines.' },
      { title: 'Implant invoice tracking', desc: 'Ensures high-cost items are properly billed and reimbursed.' }
    ],
    stats: [
      { value: '18%', label: 'First-pass Resolution Increase' },
      { value: '3x', label: 'Faster Appeal Processing' },
      { value: '95%', label: 'Implant Reimbursement Rate' }
    ]
  },
  'specialty': {
    title: 'Specialty Clinics',
    image: 'https://picsum.photos/seed/medical-clinic/1200/600',
    description: 'Specialty practices deal with high-cost treatments and complex prior authorizations. Our platform streamlines the authorization process and ensures accurate coding for specialized procedures, minimizing delays and maximizing revenue.',
    features: [
      { title: 'Automated prior auths', desc: 'Submit and track authorizations directly from your EHR.' },
      { title: 'Specialty coding rules', desc: 'Built-in edits for complex procedures to prevent coding errors.' },
      { title: 'Patient financial counseling', desc: 'Clear cost estimates to improve upfront collections.' }
    ],
    stats: [
      { value: '60%', label: 'Faster Prior Auths' },
      { value: '25%', label: 'Increase in Upfront Collections' },
      { value: '99%', label: 'Coding Accuracy' }
    ]
  },
  'enterprise': {
    title: 'Enterprise Health Systems',
    image: 'https://picsum.photos/seed/hospital-building/1200/600',
    description: 'Large health systems require scalable, enterprise-grade revenue cycle management. Our platform integrates seamlessly with Epic, Cerner, and other major EHRs to provide centralized visibility and automated workflows across multiple facilities.',
    features: [
      { title: 'Centralized dashboard', desc: 'Real-time visibility into financial performance across all locations.' },
      { title: 'Custom API integrations', desc: 'Seamless data flow between your existing systems.' },
      { title: 'Advanced analytics', desc: 'Predictive modeling to identify revenue leakage and optimize workflows.' }
    ],
    stats: [
      { value: '$2M+', label: 'Avg. Annual Revenue Found' },
      { value: '30%', label: 'Reduction in Denial Rate' },
      { value: '100%', label: 'System Integration' }
    ]
  }
};

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
            <Image 
              src={solution.image} 
              alt={solution.title} 
              fill 
              className="object-cover"
              referrerPolicy="no-referrer"
            />
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
