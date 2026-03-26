import React from 'react';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-surface text-on-surface">
      <Navbar />
      <main className="pt-32 pb-24 px-6 max-w-4xl mx-auto">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-50 text-teal-700 text-xs font-bold mb-6 tracking-wider uppercase">
            Legal & Compliance
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold text-teal-900 mb-4 font-headline tracking-tight">Privacy Policy</h1>
          <p className="text-lg text-slate-500">Effective Date: March 25, 2026</p>
        </div>
        
        <div className="prose prose-slate prose-teal lg:prose-lg mx-auto bg-white p-8 md:p-12 rounded-[2rem] shadow-sm border border-slate-100">
          <p className="lead text-xl text-slate-600 mb-8 font-medium">
            RevRecover AI ("we", "our", or "us") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website or use our revenue recovery platform and services.
          </p>

          <hr className="border-slate-100 my-8" />

          <h2 className="text-2xl font-bold text-teal-900 mt-12 mb-4 flex items-center gap-3">
            <span className="flex items-center justify-center w-8 h-8 rounded-full bg-teal-50 text-teal-700 text-sm">1</span>
            Information We Collect
          </h2>
        <p>We collect information that you provide directly to us, as well as data gathered automatically when you interact with our platform. This includes:</p>
        <ul className="list-disc pl-6 space-y-2 mb-8">
          <li><strong>Account Information:</strong> Name, professional email address, phone number, and job title.</li>
          <li><strong>Practice Information:</strong> Clinic name, National Provider Identifier (NPI), physical address, and billing details.</li>
          <li><strong>Technical Data:</strong> IP addresses, browser types, operating systems, and usage metrics collected via cookies and similar tracking technologies.</li>
        </ul>

          <h2 className="text-2xl font-bold text-teal-900 mt-12 mb-4 flex items-center gap-3">
            <span className="flex items-center justify-center w-8 h-8 rounded-full bg-teal-50 text-teal-700 text-sm">2</span>
            Protected Health Information (PHI) & HIPAA Compliance
          </h2>
        <p>
          As a healthcare technology provider, RevRecover AI acts as a Business Associate under the Health Insurance Portability and Accountability Act (HIPAA). We handle all Protected Health Information (PHI) in strict accordance with our Business Associate Agreements (BAAs) and applicable federal and state laws.
        </p>
        <p>
          PHI is encrypted both at rest (AES-256) and in transit (TLS 1.3). Access to PHI is strictly limited to authorized personnel and automated systems necessary to provide our revenue recovery services. We do not sell, rent, or share PHI for marketing purposes under any circumstances.
        </p>

          <h2 className="text-2xl font-bold text-teal-900 mt-12 mb-4 flex items-center gap-3">
            <span className="flex items-center justify-center w-8 h-8 rounded-full bg-teal-50 text-teal-700 text-sm">3</span>
            How We Use Your Information
          </h2>
        <p>We use the information we collect (excluding PHI, which is governed strictly by BAAs) to:</p>
        <ul className="list-disc pl-6 space-y-2 mb-8">
          <li>Provide, operate, and maintain our AI-driven revenue recovery platform.</li>
          <li>Process transactions and send related administrative information, including invoices and technical notices.</li>
          <li>Improve our machine learning models (using strictly de-identified and aggregated data).</li>
          <li>Respond to your comments, questions, and customer service requests.</li>
          <li>Monitor and analyze trends, usage, and activities to enhance platform security and performance.</li>
        </ul>

          <h2 className="text-2xl font-bold text-teal-900 mt-12 mb-4 flex items-center gap-3">
            <span className="flex items-center justify-center w-8 h-8 rounded-full bg-teal-50 text-teal-700 text-sm">4</span>
            Data Sharing and Disclosure
          </h2>
        <p>We may share your information in the following situations:</p>
        <ul className="list-disc pl-6 space-y-2 mb-8">
          <li><strong>With Service Providers:</strong> We share data with trusted third-party vendors (e.g., cloud hosting providers like Google Cloud) who assist us in operating our platform, subject to strict confidentiality agreements.</li>
          <li><strong>For Legal Reasons:</strong> We may disclose information if required by law, subpoena, or other legal process, or to protect the rights, property, or safety of RevRecover AI, our users, or others.</li>
          <li><strong>Business Transfers:</strong> In connection with a merger, sale of company assets, financing, or acquisition.</li>
        </ul>

          <h2 className="text-2xl font-bold text-teal-900 mt-12 mb-4 flex items-center gap-3">
            <span className="flex items-center justify-center w-8 h-8 rounded-full bg-teal-50 text-teal-700 text-sm">5</span>
            Cookies and Tracking Technologies
          </h2>
        <p>
          We use cookies, web beacons, and similar tracking technologies to track activity on our platform and store certain information. You can instruct your browser to refuse all cookies or to indicate when a cookie is being sent. However, if you do not accept cookies, you may not be able to use some portions of our service. You can manage your preferences at any time using our Cookie Settings panel.
        </p>

          <h2 className="text-2xl font-bold text-teal-900 mt-12 mb-4 flex items-center gap-3">
            <span className="flex items-center justify-center w-8 h-8 rounded-full bg-teal-50 text-teal-700 text-sm">6</span>
            Data Security
          </h2>
        <p>
          We implement enterprise-grade technical and organizational security measures designed to protect your data. While we strive to use commercially acceptable means to protect your personal information and PHI, no method of transmission over the Internet or electronic storage is 100% secure.
        </p>

          <h2 className="text-2xl font-bold text-teal-900 mt-12 mb-4 flex items-center gap-3">
            <span className="flex items-center justify-center w-8 h-8 rounded-full bg-teal-50 text-teal-700 text-sm">7</span>
            Your Data Rights
          </h2>
        <p>Depending on your jurisdiction (e.g., CCPA for California residents), you may have the right to:</p>
        <ul className="list-disc pl-6 space-y-2 mb-8">
          <li>Access the personal information we hold about you.</li>
          <li>Request the deletion of your personal data.</li>
          <li>Opt-out of certain data processing activities.</li>
        </ul>
        <p>To exercise these rights, please contact our Data Protection Officer using the details below.</p>

          <h2 className="text-2xl font-bold text-teal-900 mt-12 mb-4 flex items-center gap-3">
            <span className="flex items-center justify-center w-8 h-8 rounded-full bg-teal-50 text-teal-700 text-sm">8</span>
            Contact Us
          </h2>
        <p>If you have any questions, concerns, or requests regarding this Privacy Policy or our data practices, please contact our Privacy Team and Data Protection Officer at:</p>
        <div className="bg-slate-50 p-6 rounded-xl border border-slate-200 mt-4">
          <p className="mb-1"><strong>Email:</strong> privacy@revrecoverai.com</p>
          <p className="mb-1"><strong>Phone:</strong> +1 (800) 555-0199</p>
          <p className="mb-0"><strong>Address:</strong> 100 Healthcare Tech Blvd, Suite 400, San Francisco, CA 94105</p>
        </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
