import React from 'react';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import Link from 'next/link';
import { Shield, ShieldCheck, CheckCircle2, Lock, FileText } from 'lucide-react';

export default function CompliancePage() {
  return (
    <div className="min-h-screen bg-surface text-on-surface">
      <Navbar />
      <main className="pt-32 pb-24 px-6 max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-50 text-teal-800 text-xs font-bold tracking-widest uppercase mb-6">
            <Shield className="w-4 h-4" />
            Trust & Security
          </div>
          <h1 className="text-5xl md:text-6xl font-extrabold text-teal-900 mb-6 font-headline tracking-tight">Security & Compliance</h1>
          <p className="text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed">
            Bank-grade security meets healthcare-grade compliance. We protect your patients' data with the same rigor we apply to recovering your revenue.
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 gap-12 mb-24">
          <div className="bg-white p-10 rounded-[2rem] shadow-sm border border-teal-500/10">
            <div className="w-16 h-16 bg-teal-50 rounded-2xl flex items-center justify-center mb-6">
              <ShieldCheck className="w-8 h-8 text-teal-600" />
            </div>
            <h2 className="text-3xl font-bold text-slate-900 mb-4">HIPAA Compliance</h2>
            <p className="text-slate-600 mb-6 leading-relaxed">
              RevRecover AI is fully compliant with the Health Insurance Portability and Accountability Act (HIPAA). We implement strict physical, network, and process security measures to protect Protected Health Information (PHI) at every touchpoint.
            </p>
            <ul className="space-y-3 text-sm text-slate-700">
              <li className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-teal-600 shrink-0" /> 
                <span><strong>Business Associate Agreements (BAAs):</strong> Standard for all clients.</span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-teal-600 shrink-0" /> 
                <span><strong>Minimum Necessary Rule:</strong> AI models only access data required for recovery.</span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-teal-600 shrink-0" /> 
                <span><strong>Audit Logging:</strong> Comprehensive tracking of all PHI access and modifications.</span>
              </li>
            </ul>
          </div>

          <div className="bg-white p-10 rounded-[2rem] shadow-sm border border-teal-500/10">
            <div className="w-16 h-16 bg-teal-50 rounded-2xl flex items-center justify-center mb-6">
              <Shield className="w-8 h-8 text-teal-600" />
            </div>
            <h2 className="text-3xl font-bold text-slate-900 mb-4">SOC 2 Type II Certified</h2>
            <p className="text-slate-600 mb-6 leading-relaxed">
              Our infrastructure, software development lifecycle, and internal processes are audited annually by independent third parties to ensure we meet the rigorous standards of SOC 2 Type II for security, availability, and confidentiality.
            </p>
            <ul className="space-y-3 text-sm text-slate-700">
              <li className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-teal-600 shrink-0" /> 
                <span><strong>Continuous Monitoring:</strong> 24/7 threat detection and response.</span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-teal-600 shrink-0" /> 
                <span><strong>Access Controls:</strong> Role-based access with mandatory MFA.</span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-teal-600 shrink-0" /> 
                <span><strong>Incident Response:</strong> Tested and documented incident management plans.</span>
              </li>
            </ul>
          </div>

          <div className="bg-white p-10 rounded-[2rem] shadow-sm border border-teal-500/10">
            <div className="w-16 h-16 bg-teal-50 rounded-2xl flex items-center justify-center mb-6">
              <Lock className="w-8 h-8 text-teal-600" />
            </div>
            <h2 className="text-3xl font-bold text-slate-900 mb-4">Data Encryption</h2>
            <p className="text-slate-600 mb-6 leading-relaxed">
              We employ military-grade encryption protocols to ensure your data is unreadable to unauthorized parties, whether it's moving across the internet or stored in our databases.
            </p>
            <ul className="space-y-3 text-sm text-slate-700">
              <li className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-teal-600 shrink-0" /> 
                <span><strong>In Transit:</strong> TLS 1.3 encryption for all network communications.</span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-teal-600 shrink-0" /> 
                <span><strong>At Rest:</strong> AES-256 encryption for all stored data and backups.</span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-teal-600 shrink-0" /> 
                <span><strong>Key Management:</strong> Enterprise-grade KMS with automated rotation.</span>
              </li>
            </ul>
          </div>

          <div className="bg-white p-10 rounded-[2rem] shadow-sm border border-teal-500/10">
            <div className="w-16 h-16 bg-teal-50 rounded-2xl flex items-center justify-center mb-6">
              <FileText className="w-8 h-8 text-teal-600" />
            </div>
            <h2 className="text-3xl font-bold text-slate-900 mb-4">TCPA & FDCPA Compliance</h2>
            <p className="text-slate-600 mb-6 leading-relaxed">
              Our automated outreach engine is built with strict adherence to the Telephone Consumer Protection Act (TCPA) and the Fair Debt Collection Practices Act (FDCPA).
            </p>
            <ul className="space-y-3 text-sm text-slate-700">
              <li className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-teal-600 shrink-0" /> 
                <span><strong>Consent Management:</strong> Automated opt-in/opt-out tracking for SMS.</span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-teal-600 shrink-0" /> 
                <span><strong>Time Restrictions:</strong> Outreach restricted to legally permissible hours.</span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-teal-600 shrink-0" /> 
                <span><strong>Message Content:</strong> Pre-approved templates that avoid aggressive language.</span>
              </li>
            </ul>
          </div>
        </div>

        {/* CTA Section */}
        <div className="bg-slate-50 rounded-[2rem] p-12 text-center border border-slate-200">
          <h2 className="text-3xl font-bold text-slate-900 mb-6">Need more details?</h2>
          <p className="text-slate-600 mb-8 max-w-2xl mx-auto text-lg">
            Our security team is happy to provide our full SOC 2 report or answer any specific compliance questions your IT department may have.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link href="/contact">
              <button className="bg-teal-600 text-white px-8 py-4 rounded-xl font-bold hover:bg-teal-700 transition-colors shadow-lg shadow-teal-600/20 w-full sm:w-auto">
                Contact Security Team
              </button>
            </Link>
            <Link href="/legal/privacy">
              <button className="bg-white text-teal-900 border border-teal-200 px-8 py-4 rounded-xl font-bold hover:bg-teal-50 transition-colors w-full sm:w-auto">
                Read Privacy Policy
              </button>
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
