import React from 'react';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';

export default function TermsOfServicePage() {
  return (
    <div className="min-h-screen bg-surface text-on-surface">
      <Navbar />
      <main className="pt-32 pb-24 px-6 max-w-4xl mx-auto">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-50 text-teal-700 text-xs font-bold mb-6 tracking-wider uppercase">
            Legal & Compliance
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold text-teal-900 mb-4 font-headline tracking-tight">Terms of Service</h1>
          <p className="text-lg text-slate-500">Effective Date: March 25, 2026</p>
        </div>
        
        <div className="prose prose-slate prose-teal lg:prose-lg mx-auto bg-white p-8 md:p-12 rounded-[2rem] shadow-sm border border-slate-100">
          <p className="lead text-xl text-slate-600 mb-8 font-medium">
            Welcome to RevRecover AI. These Terms of Service ("Terms") govern your access to and use of the RevRecover AI website, platform, and related services (collectively, the "Services"). Please read these Terms carefully before using our Services.
          </p>

          <hr className="border-slate-100 my-8" />

          <h2 className="text-2xl font-bold text-teal-900 mt-12 mb-4 flex items-center gap-3">
            <span className="flex items-center justify-center w-8 h-8 rounded-full bg-teal-50 text-teal-700 text-sm">1</span>
            Acceptance of Terms
          </h2>
        <p>
          By accessing or using the Services, you agree to be bound by these Terms and all applicable laws and regulations. If you are using the Services on behalf of an organization (such as a medical practice or hospital), you represent and warrant that you have the authority to bind that organization to these Terms. If you do not agree with any of these terms, you are prohibited from using or accessing the Services.
        </p>

          <h2 className="text-2xl font-bold text-teal-900 mt-12 mb-4 flex items-center gap-3">
            <span className="flex items-center justify-center w-8 h-8 rounded-full bg-teal-50 text-teal-700 text-sm">2</span>
            Description of Services
          </h2>
        <p>
          RevRecover AI provides an AI-driven revenue cycle management and claims recovery platform designed for healthcare providers. The Services include tools for denial prediction, automated appeals, patient billing outreach, and analytics. We reserve the right to modify, suspend, or discontinue any part of the Services at any time without notice.
        </p>

          <h2 className="text-2xl font-bold text-teal-900 mt-12 mb-4 flex items-center gap-3">
            <span className="flex items-center justify-center w-8 h-8 rounded-full bg-teal-50 text-teal-700 text-sm">3</span>
            HIPAA and Protected Health Information (PHI)
          </h2>
        <p>
          To the extent that you transmit Protected Health Information (PHI) through the Services, the terms of our Business Associate Agreement (BAA) will govern the use and disclosure of such PHI. You are solely responsible for ensuring that you have obtained all necessary patient consents and authorizations required by HIPAA and other applicable laws before uploading PHI to the platform.
        </p>

          <h2 className="text-2xl font-bold text-teal-900 mt-12 mb-4 flex items-center gap-3">
            <span className="flex items-center justify-center w-8 h-8 rounded-full bg-teal-50 text-teal-700 text-sm">4</span>
            User Accounts and Security
          </h2>
        <p>
          To access certain features of the Services, you must register for an account. You agree to provide accurate, current, and complete information during the registration process. You are responsible for safeguarding your password and for all activities that occur under your account. You must notify us immediately of any unauthorized use of your account or any other breach of security.
        </p>

          <h2 className="text-2xl font-bold text-teal-900 mt-12 mb-4 flex items-center gap-3">
            <span className="flex items-center justify-center w-8 h-8 rounded-full bg-teal-50 text-teal-700 text-sm">5</span>
            Acceptable Use Policy
          </h2>
        <p>You agree not to use the Services to:</p>
        <ul className="list-disc pl-6 space-y-2 mb-8">
          <li>Violate any local, state, national, or international law or regulation.</li>
          <li>Transmit any material that is abusive, harassing, tortious, defamatory, vulgar, pornographic, obscene, libelous, or otherwise objectionable.</li>
          <li>Interfere with or disrupt the Services or servers or networks connected to the Services.</li>
          <li>Attempt to gain unauthorized access to the Services, other accounts, computer systems, or networks.</li>
          <li>Reverse engineer, decompile, or disassemble any aspect of the Services.</li>
        </ul>

          <h2 className="text-2xl font-bold text-teal-900 mt-12 mb-4 flex items-center gap-3">
            <span className="flex items-center justify-center w-8 h-8 rounded-full bg-teal-50 text-teal-700 text-sm">6</span>
            Intellectual Property Rights
          </h2>
        <p>
          The Services and their entire contents, features, and functionality (including but not limited to all information, software, text, displays, images, video, and audio, and the design, selection, and arrangement thereof) are owned by RevRecover AI, its licensors, or other providers of such material and are protected by United States and international copyright, trademark, patent, trade secret, and other intellectual property or proprietary rights laws.
        </p>

          <h2 className="text-2xl font-bold text-teal-900 mt-12 mb-4 flex items-center gap-3">
            <span className="flex items-center justify-center w-8 h-8 rounded-full bg-teal-50 text-teal-700 text-sm">7</span>
            Disclaimer of Warranties
          </h2>
        <p>
          THE SERVICES ARE PROVIDED ON AN "AS IS" AND "AS AVAILABLE" BASIS, WITHOUT ANY WARRANTIES OF ANY KIND, EITHER EXPRESS OR IMPLIED. REVRECOVER AI DISCLAIMS ALL WARRANTIES, INCLUDING, BUT NOT LIMITED TO, IMPLIED WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, TITLE, AND NON-INFRINGEMENT. WE DO NOT WARRANT THAT THE SERVICES WILL BE UNINTERRUPTED, ERROR-FREE, OR SECURE.
        </p>

          <h2 className="text-2xl font-bold text-teal-900 mt-12 mb-4 flex items-center gap-3">
            <span className="flex items-center justify-center w-8 h-8 rounded-full bg-teal-50 text-teal-700 text-sm">8</span>
            Limitation of Liability
          </h2>
        <p>
          IN NO EVENT WILL REVRECOVER AI, ITS AFFILIATES, OR THEIR LICENSORS, SERVICE PROVIDERS, EMPLOYEES, AGENTS, OFFICERS, OR DIRECTORS BE LIABLE FOR DAMAGES OF ANY KIND, UNDER ANY LEGAL THEORY, ARISING OUT OF OR IN CONNECTION WITH YOUR USE, OR INABILITY TO USE, THE SERVICES, INCLUDING ANY DIRECT, INDIRECT, SPECIAL, INCIDENTAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES, EVEN IF FORESEEABLE.
        </p>

          <h2 className="text-2xl font-bold text-teal-900 mt-12 mb-4 flex items-center gap-3">
            <span className="flex items-center justify-center w-8 h-8 rounded-full bg-teal-50 text-teal-700 text-sm">9</span>
            Governing Law and Jurisdiction
          </h2>
        <p>
          These Terms and any dispute or claim arising out of, or related to them, shall be governed by and construed in accordance with the internal laws of the State of Delaware without giving effect to any choice or conflict of law provision or rule. Any legal suit, action, or proceeding arising out of, or related to, these Terms or the Services shall be instituted exclusively in the federal courts of the United States or the courts of the State of Delaware.
        </p>

          <h2 className="text-2xl font-bold text-teal-900 mt-12 mb-4 flex items-center gap-3">
            <span className="flex items-center justify-center w-8 h-8 rounded-full bg-teal-50 text-teal-700 text-sm">10</span>
            Contact Information
          </h2>
        <p>If you have any questions about these Terms, please contact us at:</p>
        <div className="bg-slate-50 p-6 rounded-xl border border-slate-200 mt-4">
          <p className="mb-1"><strong>Email:</strong> legal@revrecoverai.com</p>
          <p className="mb-1"><strong>Phone:</strong> +1 (800) 555-0199</p>
          <p className="mb-0"><strong>Address:</strong> 100 Healthcare Tech Blvd, Suite 400, San Francisco, CA 94105</p>
        </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
