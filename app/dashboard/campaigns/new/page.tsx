'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/navigation';
import { useRouter } from 'next/navigation';
import { Check, MessageSquare, Mail, MessageCircle, ArrowLeft, Send, BarChart, Zap, Shield, Sparkles, Upload, FileText, Loader2 } from 'lucide-react';

export default function CreateCampaign() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [strategy, setStrategy] = useState<'empathy' | 'direct'>('empathy');
  const [channels, setChannels] = useState({
    whatsapp: true,
    email: false,
    sms: true
  });
  const [isGenerating, setIsGenerating] = useState(false);
  const [isDeploying, setIsDeploying] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  useEffect(() => {
    if (step === 2) {
      const timer = setTimeout(() => setIsGenerating(false), 2000);
      return () => clearTimeout(timer);
    }
  }, [step, strategy]);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setIsUploading(true);
      setUploadedFile(file);
      setTimeout(() => {
        setIsUploading(false);
        setStep(2);
        setIsGenerating(true);
      }, 2000);
    }
  };

  const handleDeploy = () => {
    setIsDeploying(true);
    setTimeout(() => {
      setIsDeploying(false);
      setIsSuccess(true);
    }, 3000);
  };

  if (isSuccess) {
    return (
      <main className="p-4 md:p-6 max-w-2xl mx-auto flex flex-col items-center justify-center min-h-[70vh] text-center">
        <div className="w-20 h-20 bg-teal-100 text-teal-600 rounded-full flex items-center justify-center mb-6 animate-bounce">
          <Check className="w-10 h-10" />
        </div>
        <h1 className="text-3xl font-extrabold text-slate-900 mb-4 font-headline">Campaign Deployed!</h1>
        <p className="text-slate-500 mb-8">
          Your recovery protocol is now live. AI is beginning to process and send personalized appeals for {uploadedFile?.name || 'your claims'}.
        </p>
        <div className="flex gap-4">
          <button 
            onClick={() => router.push('/dashboard/campaigns')}
            className="px-6 py-3 bg-teal-600 text-white rounded-xl font-bold hover:bg-teal-700 transition-all shadow-lg shadow-teal-500/20"
          >
            View Active Campaigns
          </button>
          <button 
            onClick={() => router.push('/dashboard')}
            className="px-6 py-3 bg-white text-slate-600 border border-slate-200 rounded-xl font-bold hover:bg-slate-50 transition-all"
          >
            Back to Dashboard
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="p-4 md:p-6 max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8">
      {/* Left Section: Campaign Wizard (8 Columns) */}
      <div className="lg:col-span-7 space-y-8">
        {/* Header */}
        <header>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight mb-1.5 font-headline">Create Recovery Campaign</h1>
          <p className="text-slate-500 text-sm font-medium">Deploy clinically precise outreach to maximize claim recovery.</p>
        </header>
        {/* 3-Step Wizard Progress Indicator */}
        <div className="relative flex justify-between items-center max-w-md mx-auto lg:mx-0">
          {/* Progress Line */}
          <div className="absolute top-1/2 left-0 w-full h-0.5 bg-slate-100 -translate-y-1/2 z-0" />
          <div className={`absolute top-1/2 left-0 h-0.5 bg-teal-600 -translate-y-1/2 z-0 transition-all duration-500 ${step === 1 ? 'w-0' : step === 2 ? 'w-1/2' : 'w-full'}`} />
          
          {/* Step 1 */}
          <div className="relative z-10 flex flex-col items-center gap-1.5 bg-slate-50 lg:bg-transparent px-2">
            <div className={`w-7 h-7 md:w-8 md:h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all ${step > 1 ? 'bg-teal-600 text-white' : 'bg-teal-600 text-white ring-4 ring-teal-100'}`}>
              {step > 1 ? <Check className="w-4 h-4" /> : '1'}
            </div>
            <span className={`text-[8px] md:text-[9px] font-bold uppercase tracking-widest ${step >= 1 ? 'text-teal-600' : 'text-slate-400'}`}>Upload</span>
          </div>
          {/* Step 2 */}
          <div className="relative z-10 flex flex-col items-center gap-1.5 bg-slate-50 lg:bg-transparent px-2">
            <div className={`w-7 h-7 md:w-8 md:h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all ${step > 2 ? 'bg-teal-600 text-white' : step === 2 ? 'bg-teal-600 text-white ring-4 ring-teal-100' : 'bg-slate-100 text-slate-400'}`}>
              {step > 2 ? <Check className="w-4 h-4" /> : '2'}
            </div>
            <span className={`text-[8px] md:text-[9px] font-bold uppercase tracking-widest ${step >= 2 ? 'text-teal-600' : 'text-slate-400'}`}>Personalize</span>
          </div>
          {/* Step 3 */}
          <div className="relative z-10 flex flex-col items-center gap-1.5 bg-slate-50 lg:bg-transparent px-2">
            <div className={`w-7 h-7 md:w-8 md:h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all ${step === 3 ? 'bg-teal-600 text-white ring-4 ring-teal-100' : 'bg-slate-100 text-slate-400'}`}>
              3
            </div>
            <span className={`text-[8px] md:text-[9px] font-bold uppercase tracking-widest ${step === 3 ? 'text-teal-600' : 'text-slate-400'}`}>Channels</span>
          </div>
        </div>

        {/* Wizard Step Content */}
        {step === 1 && (
          <section className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="p-10 rounded-3xl bg-white shadow-sm border-2 border-dashed border-slate-200 flex flex-col items-center text-center group hover:border-teal-500/50 transition-all">
              <div className="w-16 h-16 bg-teal-50 rounded-full flex items-center justify-center text-teal-600 mb-6 group-hover:scale-110 transition-transform">
                {isUploading ? <Loader2 className="w-8 h-8 animate-spin" /> : <Upload className="w-8 h-8" />}
              </div>
              <h2 className="text-xl font-bold text-slate-900 mb-2">Upload Denial Data</h2>
              <p className="text-slate-500 text-sm max-w-xs mb-8">Drop your CSV or Excel file here to begin the AI analysis.</p>
              
              <label className="cursor-pointer">
                <input type="file" className="hidden" accept=".csv,.xlsx,.xls" onChange={handleFileUpload} disabled={isUploading} />
                <div className="px-8 py-3 bg-teal-600 text-white rounded-xl font-bold text-sm shadow-lg shadow-teal-500/20 hover:bg-teal-700 transition-all flex items-center gap-2">
                  {isUploading ? 'Processing File...' : 'Select File'}
                </div>
              </label>
              <p className="mt-4 text-[10px] text-slate-400 font-medium uppercase tracking-widest">Supports CSV, XLSX up to 50MB</p>
            </div>
          </section>
        )}

        {step === 2 && (
          <section className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="p-6 rounded-2xl bg-white shadow-sm border border-slate-100">
              <div className="flex items-start gap-3.5 mb-6">
                <div className="p-2.5 bg-teal-50 rounded-xl text-teal-600">
                  <Sparkles className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-slate-900 font-headline">AI Message Personalization</h2>
                  <p className="text-slate-500 text-xs font-medium">Our clinical AI is processing your list of 1,240 outstanding claims.</p>
                </div>
              </div>
              {/* Options Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-8">
                <button 
                  onClick={() => {
                    setStrategy('empathy');
                    setIsGenerating(true);
                  }}
                  className={`flex items-center gap-3 p-4 rounded-xl border-2 transition-all text-left ${strategy === 'empathy' ? 'border-teal-600 bg-teal-50/50' : 'border-slate-100 bg-white hover:border-teal-600/30'}`}
                >
                  <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${strategy === 'empathy' ? 'border-teal-600' : 'border-slate-300'}`}>
                    {strategy === 'empathy' && <div className="w-2 h-2 rounded-full bg-teal-600" />}
                  </div>
                  <div>
                    <div className="text-sm font-bold text-slate-900">Clinical Empathy</div>
                    <div className="text-[10px] text-slate-500 font-medium">Best for patient relationships</div>
                  </div>
                </button>
                <button 
                  onClick={() => {
                    setStrategy('direct');
                    setIsGenerating(true);
                  }}
                  className={`flex items-center gap-3 p-4 rounded-xl border-2 transition-all text-left ${strategy === 'direct' ? 'border-teal-600 bg-teal-50/50' : 'border-slate-100 bg-white hover:border-teal-600/30'}`}
                >
                  <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${strategy === 'direct' ? 'border-teal-600' : 'border-slate-300'}`}>
                    {strategy === 'direct' && <div className="w-2 h-2 rounded-full bg-teal-600" />}
                  </div>
                  <div>
                    <div className="text-sm font-bold text-slate-900">Direct Recovery</div>
                    <div className="text-[10px] text-slate-500 font-medium">Best for aged receivables</div>
                  </div>
                </button>
              </div>
              {/* AI Tuning */}
              <div className="space-y-4">
                <div className="flex justify-between items-center text-xs">
                  <label className="font-bold text-slate-900">AI Confidence Threshold</label>
                  <span className="text-teal-600 font-bold">98% Precise</span>
                </div>
                <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                  <div className="h-full bg-teal-600 w-[98%]" />
                </div>
                <p className="text-[10px] text-slate-400 font-medium italic">The AI will only personalize messages where clinical data is 100% verified against EMR logs.</p>
              </div>
            </div>
            
            <div className="flex items-center justify-between pt-4">
              <button 
                onClick={() => setStep(1)}
                className="px-4 py-2 text-slate-500 text-sm font-bold hover:text-slate-900 transition-colors flex items-center gap-1.5"
              >
                <ArrowLeft className="w-4 h-4" />
                Back to Upload
              </button>
              <button 
                onClick={() => setStep(3)}
                className="px-8 py-3 bg-teal-600 text-white rounded-xl font-bold text-base shadow-xl shadow-teal-500/20 hover:bg-teal-700 transition-all flex items-center gap-2.5"
              >
                Next: Select Channels
              </button>
            </div>
          </section>
        )}

        {step === 3 && (
          <section className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="p-6 rounded-2xl bg-white shadow-sm border border-slate-100">
              <h2 className="text-lg font-bold text-slate-900 font-headline mb-6">Distribution Channels</h2>
              <div className="space-y-4">
                <div 
                  onClick={() => setChannels(prev => ({ ...prev, whatsapp: !prev.whatsapp }))}
                  className={`flex items-center justify-between p-4 rounded-xl border-2 cursor-pointer transition-all ${channels.whatsapp ? 'border-teal-600 bg-teal-50/50' : 'border-slate-100 bg-white'}`}
                >
                  <div className="flex items-center gap-4">
                    <div className={`p-2 rounded-lg ${channels.whatsapp ? 'bg-teal-600 text-white' : 'bg-slate-100 text-slate-400'}`}>
                      <MessageCircle className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-slate-900">WhatsApp Business</p>
                      <p className="text-[10px] text-slate-500 font-medium">98% Open Rate • Instant Recovery</p>
                    </div>
                  </div>
                  <div className={`w-5 h-5 rounded-full flex items-center justify-center ${channels.whatsapp ? 'bg-teal-600 text-white' : 'border-2 border-slate-200'}`}>
                    {channels.whatsapp && <Check className="w-3 h-3" />}
                  </div>
                </div>

                <div 
                  onClick={() => setChannels(prev => ({ ...prev, email: !prev.email }))}
                  className={`flex items-center justify-between p-4 rounded-xl border-2 cursor-pointer transition-all ${channels.email ? 'border-teal-600 bg-teal-50/50' : 'border-slate-100 bg-white'}`}
                >
                  <div className="flex items-center gap-4">
                    <div className={`p-2 rounded-lg ${channels.email ? 'bg-teal-600 text-white' : 'bg-slate-100 text-slate-400'}`}>
                      <Mail className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-slate-900">Secure Email</p>
                      <p className="text-[10px] text-slate-500 font-medium">Formal Documentation • HIPAA Compliant</p>
                    </div>
                  </div>
                  <div className={`w-5 h-5 rounded-full flex items-center justify-center ${channels.email ? 'bg-teal-600 text-white' : 'border-2 border-slate-200'}`}>
                    {channels.email && <Check className="w-3 h-3" />}
                  </div>
                </div>

                <div 
                  onClick={() => setChannels(prev => ({ ...prev, sms: !prev.sms }))}
                  className={`flex items-center justify-between p-4 rounded-xl border-2 cursor-pointer transition-all ${channels.sms ? 'border-teal-600 bg-teal-50/50' : 'border-slate-100 bg-white'}`}
                >
                  <div className="flex items-center gap-4">
                    <div className={`p-2 rounded-lg ${channels.sms ? 'bg-teal-600 text-white' : 'bg-slate-100 text-slate-400'}`}>
                      <MessageSquare className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-slate-900">SMS Gateway</p>
                      <p className="text-[10px] text-slate-500 font-medium">High Reach • Simple Interaction</p>
                    </div>
                  </div>
                  <div className={`w-5 h-5 rounded-full flex items-center justify-center ${channels.sms ? 'bg-teal-600 text-white' : 'border-2 border-slate-200'}`}>
                    {channels.sms && <Check className="w-3 h-3" />}
                  </div>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between pt-4">
              <button 
                onClick={() => {
                  setStep(2);
                  setIsGenerating(true);
                }}
                className="px-4 py-2 text-slate-500 text-sm font-bold hover:text-slate-900 transition-colors flex items-center gap-1.5"
              >
                <ArrowLeft className="w-4 h-4" />
                Back to Personalize
              </button>
              <button 
                onClick={handleDeploy}
                disabled={isDeploying || (!channels.whatsapp && !channels.email && !channels.sms)}
                className="px-8 py-3 bg-teal-600 text-white rounded-xl font-bold text-base shadow-xl shadow-teal-500/20 hover:bg-teal-700 transition-all flex items-center gap-2.5 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isDeploying ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Deploying...
                  </>
                ) : (
                  <>
                    Deploy Campaign
                    <Send className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>
          </section>
        )}
      </div>

      {/* Right Section: Realistic Preview (5 Columns) */}
      <div className="lg:col-span-5 flex flex-col gap-6">
        {/* Preview Label */}
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Live Preview</span>
          <div className="flex items-center gap-1.5">
            <div className={`w-1.5 h-1.5 rounded-full bg-teal-500 ${isGenerating ? 'animate-pulse' : ''}`} />
            <span className="text-[10px] font-bold text-teal-600">{isGenerating ? 'AI Generating...' : 'AI Ready'}</span>
          </div>
        </div>
        {/* Smartphone Mockup for Preview */}
        <div className="relative mx-auto w-full max-w-[280px] aspect-[9/19] bg-slate-900 rounded-[2.5rem] border-[6px] border-slate-800 shadow-2xl p-3 flex flex-col overflow-hidden">
          {/* Status Bar */}
          <div className="flex justify-between items-center px-5 py-2 mb-1.5 text-white/50 text-[9px] font-bold">
            <span>9:41</span>
            <div className="flex items-center gap-1">
              <Zap className="w-2.5 h-2.5" />
              <Shield className="w-2.5 h-2.5" />
            </div>
          </div>
          {/* App Header */}
          <div className="flex items-center gap-2.5 mb-6 px-1.5">
            <div className="w-8 h-8 rounded-full bg-teal-100 flex items-center justify-center text-teal-800 text-[10px] font-bold">CA</div>
            <div className="flex-1">
              <div className="text-white text-[10px] font-bold">Clinic Administration</div>
              <div className="text-white/40 text-[8px] font-medium">Secure Recovery Portal</div>
            </div>
          </div>
          {/* Message Bubble: AI Personalization */}
          <div className="space-y-3 flex-1">
            <div className="bg-slate-800 text-white/90 p-3 rounded-xl rounded-tl-none text-[10px] leading-relaxed max-w-[85%] border border-white/5">
              Hello Sarah, this is the clinical billing coordinator at <span className="text-teal-400 font-bold">Evergreen Health</span>.
            </div>
            <div className="bg-slate-800 text-white/90 p-4 rounded-xl rounded-tl-none text-[10px] leading-relaxed max-w-[90%] border border-white/5 relative">
              {isGenerating ? (
                <div className="flex gap-1 py-2">
                  <div className="w-1 h-1 bg-teal-400 rounded-full animate-bounce" />
                  <div className="w-1 h-1 bg-teal-400 rounded-full animate-bounce [animation-delay:0.2s]" />
                  <div className="w-1 h-1 bg-teal-400 rounded-full animate-bounce [animation-delay:0.4s]" />
                </div>
              ) : strategy === 'empathy' ? (
                <>
                  We're reviewing your follow-up visit from <span className="font-bold text-teal-400">March 12th</span>. We understand insurance can be confusing, and we're here to help.
                  <br /><br />
                  We've identified a <span className="text-teal-400 font-bold">$142.50 recovery opportunity</span> that we can handle on your behalf today. 
                  <br /><br />
                  Would you like us to resubmit this automatically?
                </>
              ) : (
                <>
                  Our records indicate an outstanding balance of <span className="text-teal-400 font-bold">$142.50</span> for your visit on <span className="font-bold text-teal-400">March 12th</span>.
                  <br /><br />
                  To avoid further billing cycles, we can initiate an automated appeal process now.
                  <br /><br />
                  Reply <span className="font-bold text-teal-400">YES</span> to proceed with the recovery.
                </>
              )}
            </div>
            {!isGenerating && (
              <div className="flex justify-end">
                <div className="bg-teal-600 text-white p-3 rounded-xl rounded-br-none text-[10px] font-bold shadow-lg shadow-teal-500/20">
                  Yes, please proceed.
                </div>
              </div>
            )}
          </div>
          {/* Interaction Elements */}
          <div className="mt-auto mb-4 bg-slate-800/50 rounded-full h-10 flex items-center px-5 text-white/30 text-[9px] italic font-medium">
            Type a message...
          </div>
          {/* Home Indicator */}
          <div className="w-20 h-1 bg-white/20 mx-auto rounded-full mb-1.5" />
        </div>
        {/* Campaign Stats Card */}
        <div className="p-6 rounded-2xl bg-white shadow-sm border border-slate-100">
          <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-6">Projected Impact</h4>
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-1.5 bg-teal-50 rounded-lg text-teal-600">
                  <BarChart className="w-4 h-4" />
                </div>
                <span className="text-xs font-bold text-slate-700">Recovery Rate</span>
              </div>
              <span className="text-lg font-extrabold text-teal-600">+{strategy === 'empathy' ? '42%' : '38%'}</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-1.5 bg-teal-50 rounded-lg text-teal-600">
                  <Zap className="w-4 h-4" />
                </div>
                <span className="text-xs font-bold text-slate-700">Days to Recovery</span>
              </div>
              <span className="text-lg font-extrabold text-slate-900">{strategy === 'empathy' ? '3.2' : '2.1'} Days</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-1.5 bg-teal-50 rounded-lg text-teal-600">
                  <Shield className="w-4 h-4" />
                </div>
                <span className="text-xs font-bold text-slate-700">Compliance Score</span>
              </div>
              <span className="text-lg font-extrabold text-teal-600">Perfect</span>
            </div>
          </div>
        </div>
      </div>
      {/* Floating AI Pulse */}
      <div className="fixed bottom-6 right-6 flex items-center gap-2.5 bg-white shadow-2xl px-4 py-2.5 rounded-full border border-teal-100 z-50">
        <div className="relative flex h-2.5 w-2.5">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-teal-500 opacity-75" />
          <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-teal-500" />
        </div>
        <span className="text-[10px] font-bold text-slate-600 tracking-tight uppercase tracking-widest">AI Engine Active</span>
      </div>
    </main>
  );
}

