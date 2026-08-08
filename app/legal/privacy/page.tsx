import React from 'react';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';

import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Privacy Policy',
  description:
    'How RevRecover AI collects, uses, and protects your information.',
  alternates: { canonical: '/legal/privacy' },
};

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
          <p className="text-lg text-slate-500">Effective Date: 8 August 2026</p>
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
            Protected Health Information (PHI) &amp; HIPAA
          </h2>
        <p>
          <strong>We are not currently a HIPAA Business Associate and cannot sign Business Associate
          Agreements.</strong> We have not completed a third-party HIPAA attestation. Please do not
          upload Protected Health Information to the platform.
        </p>
        <p>
          The product is designed to work with de-identified claim data: procedure codes, billed
          amounts, denial reasons, dates of service, and payer names. None of those require patient
          identifiers to be useful. Where a patient name field exists, you are free to enter a
          reference or initials instead, and we recommend you do.
        </p>
        <p>
          If your practice requires a BAA before it can use a vendor, contact us and we will give
          you an honest timeline rather than a signature we are not yet in a position to provide.
        </p>

          <h2 className="text-2xl font-bold text-teal-900 mt-12 mb-4 flex items-center gap-3">
            <span className="flex items-center justify-center w-8 h-8 rounded-full bg-teal-50 text-teal-700 text-sm">3</span>
            How We Use Your Information
          </h2>
        <p>We use the information we collect to:</p>
        <ul className="list-disc pl-6 space-y-2 mb-8">
          <li>Provide, operate, and maintain the claim triage and appeal drafting platform.</li>
          <li>Send related administrative information, including technical notices and service updates.</li>
          <li>Respond to your comments, questions, and support requests.</li>
          <li>Monitor usage and errors to keep the platform secure and working.</li>
        </ul>
        <p>
          We do not sell or rent your data. <strong>We do not train any model on your data</strong>,
          and we do not use your claim data to improve our own systems.
        </p>

          <h2 className="text-2xl font-bold text-teal-900 mt-12 mb-4 flex items-center gap-3">
            <span className="flex items-center justify-center w-8 h-8 rounded-full bg-teal-50 text-teal-700 text-sm">4</span>
            AI Processing
          </h2>
        <p>
          When you run a claim analysis, draft an appeal letter, or score no-show risk, the relevant
          claim details are transmitted to <strong>Google&apos;s Gemini API</strong> for processing
          and the response is returned to you. This is the core of how the product works, so it is
          worth being precise about it.
        </p>
        <p><strong>What is sent:</strong> the billed amount, claim status, denial reason, date of
          service, claim age, payer name, procedure code, and any notes you have entered on the
          claim — plus the patient reference field if you have filled it in.</p>
        <p><strong>What is not sent:</strong> your account credentials, your email address, other
          claims in your account, or anything from other practices.</p>
        <p>
          Google&apos;s handling of API data is governed by their own terms. Because this data leaves
          our systems, it is another reason not to place patient identifiers in the platform.
        </p>

          <h2 className="text-2xl font-bold text-teal-900 mt-12 mb-4 flex items-center gap-3">
            <span className="flex items-center justify-center w-8 h-8 rounded-full bg-teal-50 text-teal-700 text-sm">5</span>
            Data Retention and Deletion
          </h2>
        <p>
          Your claims, patients, campaigns, and audit logs are stored against your account for as
          long as the account exists. You can delete individual records at any time from within the
          dashboard. To delete your account and everything in it, email us and we will action it
          within 30 days.
        </p>

          <h2 className="text-2xl font-bold text-teal-900 mt-12 mb-4 flex items-center gap-3">
            <span className="flex items-center justify-center w-8 h-8 rounded-full bg-teal-50 text-teal-700 text-sm">6</span>
            Data Sharing and Disclosure
          </h2>
        <p>We may share your information in the following situations:</p>
        <ul className="list-disc pl-6 space-y-2 mb-8">
          <li><strong>Google (Firebase):</strong> authentication and database hosting. Your account and all records you create are stored here.</li>
          <li><strong>Google (Gemini API):</strong> the AI processing described in section 4.</li>
          <li><strong>Vercel:</strong> website and application hosting, plus anonymous traffic analytics.</li>
          <li><strong>Resend:</strong> delivery of enquiries submitted through our contact form.</li>
          <li><strong>For Legal Reasons:</strong> We may disclose information if required by law, subpoena, or other legal process, or to protect the rights, property, or safety of RevRecover AI, our users, or others.</li>
          <li><strong>Business Transfers:</strong> In connection with a merger, sale of company assets, financing, or acquisition.</li>
        </ul>

          <h2 className="text-2xl font-bold text-teal-900 mt-12 mb-4 flex items-center gap-3">
            <span className="flex items-center justify-center w-8 h-8 rounded-full bg-teal-50 text-teal-700 text-sm">7</span>
            Cookies and Tracking Technologies
          </h2>
        <p>
          We use cookies, web beacons, and similar tracking technologies to track activity on our platform and store certain information. You can instruct your browser to refuse all cookies or to indicate when a cookie is being sent. However, if you do not accept cookies, you may not be able to use some portions of our service. You can manage your preferences at any time using our Cookie Settings panel.
        </p>

          <h2 className="text-2xl font-bold text-teal-900 mt-12 mb-4 flex items-center gap-3">
            <span className="flex items-center justify-center w-8 h-8 rounded-full bg-teal-50 text-teal-700 text-sm">8</span>
            Data Security
          </h2>
        <p>
          We implement enterprise-grade technical and organizational security measures designed to protect your data. While we strive to use commercially acceptable means to protect your personal information and PHI, no method of transmission over the Internet or electronic storage is 100% secure.
        </p>

          <h2 className="text-2xl font-bold text-teal-900 mt-12 mb-4 flex items-center gap-3">
            <span className="flex items-center justify-center w-8 h-8 rounded-full bg-teal-50 text-teal-700 text-sm">9</span>
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
            <span className="flex items-center justify-center w-8 h-8 rounded-full bg-teal-50 text-teal-700 text-sm">10</span>
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
