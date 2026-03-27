import React from 'react';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import Link from 'next/link';
import { Shield, ShieldCheck, CheckCircle2, Lock, FileText, Fingerprint, Eye, Server, Globe, ExternalLink, BadgeCheck, AlertCircle, ArrowRight } from 'lucide-react';

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
          <p className="text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed mb-10">
            Bank-grade security meets healthcare-grade compliance. We protect your patients' data with the same rigor we apply to recovering your revenue.
          </p>
          
          {/* Trust Badges */}
          <div className="flex flex-wrap justify-center items-center gap-8 md:gap-16 opacity-70 grayscale hover:grayscale-0 transition-all duration-500">
            <div className="flex flex-col items-center gap-2">
              <div className="w-16 h-16 bg-white rounded-full shadow-sm border border-slate-100 flex items-center justify-center">
                <ShieldCheck className="w-8 h-8 text-teal-600" />
              </div>
              <span className="text-[10px] font-bold uppercase tracking-widest text-slate-500">HIPAA Compliant</span>
            </div>
            <div className="flex flex-col items-center gap-2">
              <div className="w-16 h-16 bg-white rounded-full shadow-sm border border-slate-100 flex items-center justify-center">
                <BadgeCheck className="w-8 h-8 text-teal-600" />
              </div>
              <span className="text-[10px] font-bold uppercase tracking-widest text-slate-500">SOC 2 Type II</span>
            </div>
            <div className="flex flex-col items-center gap-2">
              <div className="w-16 h-16 bg-white rounded-full shadow-sm border border-slate-100 flex items-center justify-center">
                <Lock className="w-8 h-8 text-teal-600" />
              </div>
              <span className="text-[10px] font-bold uppercase tracking-widest text-slate-500">256-bit AES</span>
            </div>
            <div className="flex flex-col items-center gap-2">
              <div className="w-16 h-16 bg-white rounded-full shadow-sm border border-slate-100 flex items-center justify-center">
                <Globe className="w-8 h-8 text-teal-600" />
              </div>
              <span className="text-[10px] font-bold uppercase tracking-widest text-slate-500">GDPR Ready</span>
            </div>
          </div>
        </div>
        
        <div className="grid md:grid-cols-2 gap-12 mb-24">
          <div className="bg-white p-10 rounded-[2rem] shadow-sm border border-teal-500/10 hover:shadow-md transition-shadow">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 bg-teal-50 rounded-xl flex items-center justify-center">
                <ShieldCheck className="w-6 h-6 text-teal-600" />
              </div>
              <h2 className="text-2xl font-bold text-slate-900">HIPAA Compliance</h2>
            </div>
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

          <div className="bg-white p-10 rounded-[2rem] shadow-sm border border-teal-500/10 hover:shadow-md transition-shadow">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 bg-teal-50 rounded-xl flex items-center justify-center">
                <BadgeCheck className="w-6 h-6 text-teal-600" />
              </div>
              <h2 className="text-2xl font-bold text-slate-900">SOC 2 Type II Certified</h2>
            </div>
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

          <div className="bg-white p-10 rounded-[2rem] shadow-sm border border-teal-500/10 hover:shadow-md transition-shadow">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 bg-teal-50 rounded-xl flex items-center justify-center">
                <Lock className="w-6 h-6 text-teal-600" />
              </div>
              <h2 className="text-2xl font-bold text-slate-900">Data Encryption</h2>
            </div>
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

          <div className="bg-white p-10 rounded-[2rem] shadow-sm border border-teal-500/10 hover:shadow-md transition-shadow">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 bg-teal-50 rounded-xl flex items-center justify-center">
                <FileText className="w-6 h-6 text-teal-600" />
              </div>
              <h2 className="text-2xl font-bold text-slate-900">TCPA & FDCPA Compliance</h2>
            </div>
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
        <div className="bg-teal-900 rounded-[3rem] p-12 md:p-20 text-center relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-full opacity-10">
            <div className="absolute top-0 left-0 w-64 h-64 bg-teal-400 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2"></div>
            <div className="absolute bottom-0 right-0 w-96 h-96 bg-teal-400 rounded-full blur-3xl translate-x-1/2 translate-y-1/2"></div>
          </div>
          
          <div className="relative z-10">
            <h2 className="text-4xl md:text-5xl font-extrabold text-white mb-8 font-headline">Need more details?</h2>
            <p className="text-teal-100 mb-12 max-w-2xl mx-auto text-xl leading-relaxed">
              Our security team is happy to provide our full SOC 2 report or answer any specific compliance questions your IT department may have.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
              <Link href="/contact">
                <button className="bg-white text-teal-900 px-10 py-5 rounded-2xl font-black text-lg hover:bg-teal-50 transition-all shadow-2xl shadow-white/10 flex items-center gap-3">
                  Talk to Our Security Team <ArrowRight className="w-6 h-6" />
                </button>
              </Link>
              <Link href="/contact?subject=SOC2%20Report%20Request">
                <button className="bg-teal-800/50 backdrop-blur text-white border-2 border-teal-700 px-10 py-5 rounded-2xl font-bold text-lg hover:bg-teal-800 transition-all">
                  Request Full SOC 2 Report
                </button>
              </Link>
            </div>
            
            <div className="mt-12 flex flex-wrap justify-center items-center gap-8 opacity-60">
              <div className="flex items-center gap-2 text-white font-medium">
                <ShieldCheck className="w-5 h-5" /> HIPAA Compliant
              </div>
              <div className="flex items-center gap-2 text-white font-medium">
                <BadgeCheck className="w-5 h-5" /> SOC2 Type II
              </div>
              <div className="flex items-center gap-2 text-white font-medium">
                <Lock className="w-5 h-5" /> 256-bit Encryption
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
