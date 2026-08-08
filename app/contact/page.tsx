'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { Mail, MapPin, Phone, Clock, CheckCircle2 } from 'lucide-react';
import { useSearchParams } from 'next/navigation';

function ContactForm() {
  const [submitted, setSubmitted] = useState(false);
  const searchParams = useSearchParams();
  
  const [message, setMessage] = useState(() => {
    const solution = searchParams.get('solution');
    if (solution) {
      const solutionNames: Record<string, string> = {
        dental: 'Dental Solutions',
        surgical: 'ASC Solutions',
        specialty: 'Specialty Solutions',
        enterprise: 'Enterprise Solutions'
      };
      const name = solutionNames[solution] || solution;
      return `I'm interested in learning more about your ${name}.`;
    }
    return '';
  });

  const [isSending, setIsSending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setIsSending(true);

    const data = new FormData(e.currentTarget);
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          firstName: data.get('firstName'),
          lastName: data.get('lastName'),
          email: data.get('email'),
          organization: data.get('organization'),
          message: data.get('message'),
          website: data.get('website'),
        }),
      });

      const payload = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(payload?.error || 'Something went wrong. Please try again.');
        return;
      }
      setSubmitted(true);
    } catch {
      setError('We could not reach the server. Please check your connection and try again.');
    } finally {
      setIsSending(false);
    }
  };

  if (submitted) {
    return (
      <div className="text-center py-16">
        <div className="w-20 h-20 bg-teal-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle2 className="w-10 h-10 text-teal-600" />
        </div>
        <h3 className="text-3xl font-bold text-slate-900 mb-4">Message Sent!</h3>
        <p className="text-slate-600 mb-8 text-lg">
          Thank you for reaching out. A revenue recovery specialist will get back to you within 24 hours.
        </p>
        <button 
          onClick={() => setSubmitted(false)}
          className="bg-teal-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-teal-700 transition-colors"
        >
          Send Another Message
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <h3 className="text-2xl font-bold text-slate-900 mb-6">Send us a message</h3>
      {error && (
        <div className="p-4 rounded-xl bg-red-50 border border-red-100 text-sm font-medium text-red-700">
          {error}
        </div>
      )}
      <div className="grid grid-cols-2 gap-6">
        <div>
          <label htmlFor="firstName" className="block text-sm font-bold text-slate-700 mb-2">First Name *</label>
          <input id="firstName" name="firstName" autoComplete="given-name" required type="text" className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-teal-500/50 bg-slate-50 focus:bg-white transition-colors" placeholder="Jane" />
        </div>
        <div>
          <label htmlFor="lastName" className="block text-sm font-bold text-slate-700 mb-2">Last Name *</label>
          <input id="lastName" name="lastName" autoComplete="family-name" required type="text" className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-teal-500/50 bg-slate-50 focus:bg-white transition-colors" placeholder="Doe" />
        </div>
      </div>
      <div>
        <label htmlFor="email" className="block text-sm font-bold text-slate-700 mb-2">Work Email *</label>
        <input id="email" name="email" autoComplete="email" required type="email" className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-teal-500/50 bg-slate-50 focus:bg-white transition-colors" placeholder="jane@clinic.com" />
      </div>
      <div>
        <label htmlFor="organization" className="block text-sm font-bold text-slate-700 mb-2">Organization Name</label>
        <input id="organization" name="organization" autoComplete="organization" type="text" className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-teal-500/50 bg-slate-50 focus:bg-white transition-colors" placeholder="Premier Medical Group" />
      </div>
      <div>
        <label htmlFor="message" className="block text-sm font-bold text-slate-700 mb-2">How can we help? *</label>
        <textarea id="message" name="message" required rows={4} value={message} onChange={(e) => setMessage(e.target.value)} className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-teal-500/50 bg-slate-50 focus:bg-white transition-colors resize-none" placeholder="I'm interested in learning more about..."></textarea>
      </div>
      {/* Honeypot — hidden from people, catnip for bots. */}
      <input
        type="text"
        name="website"
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
        className="absolute left-[-9999px] w-px h-px opacity-0"
      />
      <button
        type="submit"
        disabled={isSending}
        className="w-full bg-teal-600 text-white font-bold py-4 rounded-xl hover:bg-teal-700 transition-colors shadow-lg shadow-teal-600/20 disabled:opacity-60 flex items-center justify-center gap-2"
      >
        {isSending && <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />}
        {isSending ? 'Sending…' : 'Send Message'}
      </button>
      <p className="text-xs text-slate-500 text-center mt-4">
        By submitting this form, you agree to our <a href="/legal/privacy" className="text-teal-600 hover:underline">Privacy Policy</a>.
      </p>
    </form>
  );
}

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-surface text-on-surface">
      <Navbar />
      <main className="pt-32 pb-24 px-6 max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-16 items-start">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-50 text-teal-800 text-xs font-bold tracking-widest uppercase mb-6">
              <Mail className="w-4 h-4" />
              Get in Touch
            </div>
            <h1 className="text-5xl md:text-6xl font-extrabold text-teal-900 mb-6 font-headline tracking-tight">Let's talk about your revenue.</h1>
            <p className="text-xl text-slate-600 mb-12 leading-relaxed">
              Whether you're looking to automate patient collections, reduce claim denials, or just want to see a demo of our AI in action, our team is ready to help.
            </p>
            
            <div className="space-y-8 mb-12">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-teal-50 rounded-full flex items-center justify-center shrink-0">
                  <Mail className="w-6 h-6 text-teal-600" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-900 mb-1">Email</h3>
                  <p className="text-slate-600">
                    <a href="mailto:shivam.sharma4c21@gmail.com" className="hover:text-teal-700 transition-colors">
                      shivam.sharma4c21@gmail.com
                    </a>
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-teal-50 rounded-full flex items-center justify-center shrink-0">
                  <Clock className="w-6 h-6 text-teal-600" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-900 mb-1">Response time</h3>
                  <p className="text-slate-600">We reply to every enquiry within one business day.</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-teal-50 rounded-full flex items-center justify-center shrink-0">
                  <MapPin className="w-6 h-6 text-teal-600" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-900 mb-1">Where we work</h3>
                  <p className="text-slate-600">Remote-first. Demos and onboarding run over video.</p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white p-8 md:p-10 rounded-[2rem] shadow-xl border border-teal-500/10">
            <Suspense fallback={<div className="h-96 flex items-center justify-center"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal-600"></div></div>}>
              <ContactForm />
            </Suspense>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
