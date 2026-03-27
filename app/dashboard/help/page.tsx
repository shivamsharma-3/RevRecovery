'use client';

import React, { useState } from 'react';
import { Search, Book, MessageCircle, Phone, FileText, ExternalLink, ChevronRight, HelpCircle } from 'lucide-react';

export default function HelpCenterPage() {
  const [searchQuery, setSearchQuery] = useState('');

  const faqs = [
    { q: "How does the AI predict no-shows?", a: "Our AI analyzes over 40 behavioral variables including past attendance, appointment type, weather, and communication responsiveness to assign a risk score." },
    { q: "Is patient data secure and HIPAA compliant?", a: "Yes. All data is encrypted at rest and in transit. We are fully SOC2 Type II and HIPAA compliant, ensuring clinical data never leaves our secure vault." },
    { q: "How do I integrate with Dentrix?", a: "Navigate to Settings > PMS Integrations, select Dentrix, and follow the OAuth flow. The sync typically takes less than 15 minutes." },
    { q: "Can I customize the automated SMS messages?", a: "Absolutely. Go to Campaigns > Templates to modify the tone, timing, and content of all automated outreach." }
  ];

  const filteredFaqs = faqs.filter(faq => 
    faq.q.toLowerCase().includes(searchQuery.toLowerCase()) || 
    faq.a.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="p-6 md:p-10 max-w-6xl mx-auto">
      <div className="text-center mb-12">
        <h1 className="text-3xl font-extrabold text-slate-900 font-headline mb-4">How can we help you today?</h1>
        <div className="relative max-w-2xl mx-auto">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
          <input 
            type="text" 
            placeholder="Search for articles, guides, or troubleshooting..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-4 bg-white border border-slate-200 rounded-2xl shadow-sm text-base focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all outline-none"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm hover:shadow-md transition-all cursor-pointer group flex flex-col justify-between">
          <div>
            <div className="w-12 h-12 bg-teal-50 rounded-2xl flex items-center justify-center text-teal-600 mb-6 group-hover:scale-110 transition-transform">
              <Book className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-2">Documentation</h3>
            <p className="text-sm text-slate-500 mb-6">Detailed guides on setting up and optimizing your RevRecover AI instance.</p>
          </div>
          <span className="text-teal-600 text-[10px] font-bold uppercase tracking-widest flex items-center gap-1 group-hover:gap-2 transition-all">Read Docs <ChevronRight className="w-4 h-4" /></span>
        </div>
        
        <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm hover:shadow-md transition-all cursor-pointer group flex flex-col justify-between">
          <div>
            <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600 mb-6 group-hover:scale-110 transition-transform">
              <MessageCircle className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-2">Live Chat Support</h3>
            <p className="text-sm text-slate-500 mb-6">Connect with our clinical success team for real-time assistance.</p>
          </div>
          <span className="text-blue-600 text-[10px] font-bold uppercase tracking-widest flex items-center gap-1 group-hover:gap-2 transition-all">Start Chat <ChevronRight className="w-4 h-4" /></span>
        </div>

        <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm hover:shadow-md transition-all cursor-pointer group flex flex-col justify-between">
          <div>
            <div className="w-12 h-12 bg-purple-50 rounded-2xl flex items-center justify-center text-purple-600 mb-6 group-hover:scale-110 transition-transform">
              <Phone className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-2">Phone Support</h3>
            <p className="text-sm text-slate-500 mb-6">Available 24/7 for Enterprise customers and critical system issues.</p>
          </div>
          <span className="text-purple-600 text-[10px] font-bold uppercase tracking-widest flex items-center gap-1 group-hover:gap-2 transition-all">View Numbers <ChevronRight className="w-4 h-4" /></span>
        </div>
      </div>

      <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden">
        <div className="p-8 border-b border-slate-100 flex items-center gap-3">
          <HelpCircle className="w-6 h-6 text-teal-600" />
          <h2 className="text-xl font-bold text-slate-900 font-headline">Frequently Asked Questions</h2>
        </div>
        <div className="divide-y divide-slate-100">
          {filteredFaqs.length > 0 ? (
            filteredFaqs.map((faq, i) => (
              <div key={i} className="p-8 hover:bg-slate-50 transition-colors">
                <h4 className="text-base font-bold text-slate-900 mb-2">{faq.q}</h4>
                <p className="text-sm text-slate-600 leading-relaxed">{faq.a}</p>
              </div>
            ))
          ) : (
            <div className="p-8 text-center text-slate-500">
              No FAQs found matching "{searchQuery}".
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
