'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { toast } from 'sonner';
import { 
  Plus, ArrowRight, DollarSign, Clock, CheckCircle2, 
  AlertCircle, MoreHorizontal, Search, Filter,
  ArrowUpRight, Download, Share2, Trash2, Edit3,
  Calendar, User, Tag, ShieldCheck, X, Sparkles, Loader2, AlertTriangle
} from 'lucide-react';
import { useAuth } from '@/components/AuthProvider';
import { db } from '@/firebase';
import { collection, getDocs, addDoc, updateDoc, doc, query, deleteDoc } from 'firebase/firestore';
import { logAuditAction } from '@/lib/audit';
import { analyzeClaim, type ClaimAnalysis } from '@/lib/ai/api';
import { useScrollLock } from '@/hooks/use-scroll-lock';

const INITIAL_PIPELINES = [
  { id: 'identified', title: 'Identified', color: 'bg-slate-400' },
  { id: 'contacted', title: 'Contacted (AI)', color: 'bg-blue-500' },
  { id: 'payment-plan', title: 'Payment Plan', color: 'bg-amber-500' },
  { id: 'recovered', title: 'Recovered', color: 'bg-teal-500' }
];

export default function RecoveryPage() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('all');
  const [selectedCase, setSelectedCase] = useState<any>(null);
  const [isNewCaseModalOpen, setIsNewCaseModalOpen] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [caseAnalysis, setCaseAnalysis] = useState<ClaimAnalysis | null>(null);
  const [cases, setCases] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useScrollLock(Boolean(selectedCase) || isNewCaseModalOpen);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchCases = async () => {
      if (!user?.uid) {
        setIsLoading(false);
        return;
      }
      setIsLoading(true);
      try {
        const q = query(collection(db, 'users', user.uid, 'recovery_cases'));
        const snapshot = await getDocs(q);
        const fetchedCases = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setCases(fetchedCases);
      } catch (error) {
        console.error("Error fetching recovery cases:", error);
        if (error instanceof Error) {
          toast.error(`Failed to fetch recovery cases: ${error.message}`);
        } else {
          toast.error('Failed to fetch recovery cases');
        }
      } finally {
        setIsLoading(false);
      }
    };
    fetchCases();
  }, [user]);

  const handleDragStart = (e: React.DragEvent, cardId: string, sourcePipelineId: string) => {
    e.dataTransfer.setData('cardId', cardId);
    e.dataTransfer.setData('sourcePipelineId', sourcePipelineId);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault(); // Necessary to allow dropping
  };

  const handleDrop = async (e: React.DragEvent, targetPipelineId: string) => {
    e.preventDefault();
    if (!user?.uid) return;

    const cardId = e.dataTransfer.getData('cardId');
    const sourcePipelineId = e.dataTransfer.getData('sourcePipelineId');

    if (sourcePipelineId === targetPipelineId) return;

    const recoveryCase = cases.find(c => c.id === cardId);
    const patientName = recoveryCase?.patient || 'Unknown';

    try {
      const caseRef = doc(db, 'users', user.uid, 'recovery_cases', cardId);
      await updateDoc(caseRef, { pipelineId: targetPipelineId });
      
      await logAuditAction(user.uid, {
        user: user.displayName || user.email || 'User',
        action: 'Updated Case Pipeline',
        target: `Case for ${patientName} moved to ${targetPipelineId}`,
        status: 'Success',
        severity: 'Low',
        type: 'recovery'
      });

      setCases(prevCases => prevCases.map(c => 
        c.id === cardId ? { ...c, pipelineId: targetPipelineId } : c
      ));
      toast.success(`Case moved to ${targetPipelineId}`);
    } catch (error) {
      console.error("Error updating case pipeline:", error);
      await logAuditAction(user.uid, {
        user: user.displayName || user.email || 'User',
        action: 'Case Pipeline Update Failed',
        target: `Case for ${patientName}`,
        status: 'Failed',
        severity: 'Medium',
        type: 'recovery'
      });
      toast.error('Failed to update case pipeline');
    }
  };

  const handleCreateCase = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user?.uid) return;
    
    const form = e.target as HTMLFormElement;
    const formData = new FormData(form);
    
    const newCaseData = {
      patient: formData.get('patient') as string,
      amount: parseFloat(formData.get('amount') as string),
      days: parseInt(formData.get('days') as string, 10),
      type: formData.get('type') as string,
      priority: formData.get('priority') as string,
      pipelineId: 'identified'
    };

    try {
      const docRef = await addDoc(collection(db, 'users', user.uid, 'recovery_cases'), newCaseData);
      
      await logAuditAction(user.uid, {
        user: user.displayName || user.email || 'User',
        action: 'Created Recovery Case',
        target: `Case for ${newCaseData.patient}`,
        status: 'Success',
        severity: 'Low',
        type: 'recovery'
      });

      setCases([{ id: docRef.id, ...newCaseData }, ...cases]);
      setIsNewCaseModalOpen(false);
      toast.success('Recovery case created successfully');
    } catch (error) {
      console.error("Error creating case:", error);
      await logAuditAction(user.uid, {
        user: user.displayName || user.email || 'User',
        action: 'Recovery Case Creation Failed',
        target: `Case for ${formData.get('patient')}`,
        status: 'Failed',
        severity: 'Medium',
        type: 'recovery'
      });
      toast.error('Failed to create recovery case');
    }
  };

  const handleDeleteCase = async (id: string) => {
    if (!user?.uid) return;
    if (!confirm('Are you sure you want to delete this case?')) return;
    
    const recoveryCase = cases.find(c => c.id === id);
    const patientName = recoveryCase?.patient || 'Unknown';

    try {
      await deleteDoc(doc(db, 'users', user.uid, 'recovery_cases', id));
      
      await logAuditAction(user.uid, {
        user: user.displayName || user.email || 'User',
        action: 'Deleted Recovery Case',
        target: `Case for ${patientName}`,
        status: 'Success',
        severity: 'Medium',
        type: 'recovery'
      });

      setCases(cases.filter(c => c.id !== id));
      setSelectedCase(null);
      toast.success('Recovery case deleted successfully');
    } catch (error) {
      console.error("Error deleting case:", error);
      await logAuditAction(user.uid, {
        user: user.displayName || user.email || 'User',
        action: 'Recovery Case Deletion Failed',
        target: `Case for ${patientName}`,
        status: 'Failed',
        severity: 'High',
        type: 'recovery'
      });
      toast.error('Failed to delete recovery case');
    }
  };

  const handleMoveCase = async (cardId: string, targetPipelineId: string) => {
    if (!user?.uid) return;
    const recoveryCase = cases.find(c => c.id === cardId);
    const patientName = recoveryCase?.patient || 'Unknown';

    try {
      await updateDoc(doc(db, 'users', user.uid, 'recovery_cases', cardId), { pipelineId: targetPipelineId });
      await logAuditAction(user.uid, {
        user: user.displayName || user.email || 'User',
        action: 'Updated Case Pipeline',
        target: `Case for ${patientName} moved to ${targetPipelineId}`,
        status: 'Success',
        severity: 'Low',
        type: 'recovery'
      });
      setCases(prev => prev.map(c => (c.id === cardId ? { ...c, pipelineId: targetPipelineId } : c)));
      setSelectedCase((prev: any) => (prev && prev.id === cardId ? { ...prev, pipelineId: targetPipelineId } : prev));
      toast.success(`Case moved to ${targetPipelineId.replace('-', ' ')}`);
    } catch (error) {
      console.error('Error updating case pipeline:', error);
      toast.error('Failed to update case pipeline');
    }
  };

  const handleAnalyseCase = async () => {
    if (!selectedCase) return;
    setIsProcessing(true);
    setCaseAnalysis(null);
    try {
      const dateOfService = selectedCase.days
        ? new Date(Date.now() - Number(selectedCase.days) * 86_400_000).toISOString().split('T')[0]
        : undefined;

      const result = await analyzeClaim({
        amount: Number(selectedCase.amount) || 0,
        status: 'Outstanding patient balance',
        denialReason: `Patient balance of type "${selectedCase.type}" outstanding for ${selectedCase.days} days`,
        date: dateOfService,
        notes: `Pipeline stage: ${selectedCase.pipelineId}. Practice-assigned priority: ${selectedCase.priority}.`,
      });
      setCaseAnalysis(result);

      await logAuditAction(user!.uid, {
        user: user!.displayName || user!.email || 'User',
        action: 'AI Case Analysis',
        target: `Case for ${selectedCase.patient}`,
        status: 'Success',
        severity: 'Info',
        type: 'recovery'
      });
    } catch (error: any) {
      toast.error(error?.message || 'Analysis failed.');
    } finally {
      setIsProcessing(false);
    }
  };

  const filteredCases = cases.filter(c => {
    const matchesSearch = c.patient?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          c.id?.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  });

  const pipelines = INITIAL_PIPELINES.map(pipeline => {
    const pipelineCases = filteredCases.filter(c => c.pipelineId === pipeline.id);
    const amount = pipelineCases.reduce((sum, c) => sum + (c.amount || 0), 0);
    return {
      ...pipeline,
      count: pipelineCases.length,
      amount: new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount),
      cards: pipelineCases
    };
  });

  return (
    <div className="bg-[#f8fafc] flex flex-col h-full">
      {/* Header Section */}
      <header className="bg-white border-b border-slate-200 px-8 py-6 sticky top-0 z-30">
        <div className="max-w-[1600px] mx-auto flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[10px] font-bold text-teal-600 uppercase tracking-[0.2em]">Recovery Engine</span>
              <span className="text-slate-300">/</span>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">Queue</span>
            </div>
            <h1 className="text-2xl font-black text-slate-900 tracking-tight font-headline flex items-center gap-3">
              Recovery Queue
              <span className="px-2 py-0.5 bg-slate-100 text-slate-500 rounded-md text-xs font-mono">v2.4.0</span>
            </h1>
          </div>
          
          <div className="flex items-center gap-3 w-full md:w-auto">
            <div className="relative flex-1 md:flex-none">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input 
                type="text" 
                placeholder="Search by ID, Patient, or Type..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:ring-2 focus:ring-teal-500/10 transition-all w-full md:w-72 outline-none"
              />
            </div>
            <button className="p-2.5 bg-white border border-slate-200 text-slate-600 rounded-xl hover:bg-slate-50 transition-all shadow-sm">
              <Filter className="w-5 h-5" />
            </button>
            <button 
              onClick={() => setIsNewCaseModalOpen(true)}
              className="flex items-center gap-2 px-5 py-2.5 bg-[#0f172a] text-white rounded-xl hover:bg-slate-800 transition-all font-bold text-sm shadow-xl shadow-slate-900/10 active:scale-95"
            >
              <Plus className="w-4 h-4" />
              New Case
            </button>
          </div>
        </div>

        {/* Sub-navigation/Tabs */}
        <div className="max-w-[1600px] mx-auto mt-6 flex items-center gap-8 border-t border-slate-100 pt-4 overflow-x-auto">
          {['all', 'active', 'pending', 'recovered', 'flagged'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`text-[11px] font-bold uppercase tracking-widest pb-2 transition-all relative ${
                activeTab === tab ? 'text-teal-600' : 'text-slate-400 hover:text-slate-600'
              }`}
            >
              {tab}
              {activeTab === tab && (
                <div className="absolute bottom-0 left-0 w-full h-0.5 bg-teal-600 rounded-full" />
              )}
            </button>
          ))}
          <div className="ml-auto flex items-center gap-4 shrink-0">
            <button 
              onClick={() => toast.info('Exporting queue to CSV...')}
              className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1.5 hover:text-slate-600 transition-colors"
            >
              <Download className="w-3.5 h-3.5" /> Export CSV
            </button>
          </div>
        </div>
      </header>

      {/* Main Pipeline View */}
      <main className="flex-1 p-8 overflow-x-auto">
        <div className="max-w-[1600px] mx-auto flex gap-8 min-w-max h-full">
          {isLoading ? (
            <div className="w-full flex items-center justify-center p-12 text-slate-500">Loading cases...</div>
          ) : cases.length === 0 ? (
            <div className="w-full flex flex-col items-center justify-center text-center p-12 gap-3">
              <div className="w-12 h-12 rounded-2xl bg-slate-100 flex items-center justify-center text-slate-400">
                <DollarSign className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-slate-900">No balances in the queue yet</h3>
              <p className="text-sm text-slate-500 max-w-md leading-relaxed">
                Cases arrive here from triaged claims. When the engine decides a denial is the patient&apos;s
                responsibility rather than something to appeal, send it over from the claims screen — or add one by hand.
              </p>
              <Link
                href="/dashboard/claims"
                className="mt-2 px-4 py-2.5 bg-slate-900 text-white rounded-xl text-xs font-bold hover:bg-slate-800 transition-all"
              >
                Go to claims
              </Link>
            </div>
          ) : pipelines.map((column, i) => (
            <div 
              key={i} 
              className="w-[340px] flex flex-col"
              onDragOver={handleDragOver}
              onDrop={(e) => handleDrop(e, column.id)}
            >
              {/* Column Header */}
              <div className="flex items-center justify-between mb-6 px-2">
                <div className="flex items-center gap-3">
                  <div className={`w-2 h-2 rounded-full ${column.color}`} />
                  <h3 className="text-xs font-black text-slate-900 uppercase tracking-widest italic font-serif">
                    {column.title}
                  </h3>
                  <span className="text-[10px] font-mono bg-slate-200/50 text-slate-500 px-1.5 py-0.5 rounded">
                    {column.count}
                  </span>
                </div>
                <span className="text-[10px] font-mono font-bold text-slate-400 tracking-tighter">
                  {column.amount}
                </span>
              </div>
              
              {/* Cards Container */}
              <div className="flex-1 flex flex-col gap-4 bg-slate-100/50 rounded-[2rem] p-4 border border-slate-200/50 min-h-[500px]">
                {column.cards.map((card: any) => (
                  <div 
                    key={card.id}
                    draggable
                    onDragStart={(e) => handleDragStart(e, card.id, column.id)}
                    onClick={() => { setSelectedCase(card); setCaseAnalysis(null); }}
                    className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm hover:shadow-md hover:border-slate-300 transition-all cursor-grab active:cursor-grabbing group relative overflow-hidden"
                  >
                    {/* Priority Indicator Line */}
                    <div className={`absolute left-0 top-0 bottom-0 w-1 ${
                      card.priority === 'High' ? 'bg-red-500' :
                      card.priority === 'Medium' ? 'bg-amber-500' :
                      card.priority === 'Low' ? 'bg-blue-500' : 'bg-teal-500'
                    }`} />

                    <div className="pl-2">
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-[10px] font-mono font-bold text-slate-400 bg-slate-50 px-2 py-1 rounded-md">
                          {card.id.substring(0, 8)}
                        </span>
                        <div className="flex items-center gap-2">
                          <span className={`text-[9px] font-bold uppercase tracking-widest px-2 py-1 rounded-full ${
                            card.priority === 'High' ? 'bg-red-50 text-red-600' :
                            card.priority === 'Medium' ? 'bg-amber-50 text-amber-600' :
                            card.priority === 'Low' ? 'bg-blue-50 text-blue-600' : 'bg-teal-50 text-teal-600'
                          }`}>
                            {card.priority}
                          </span>
                        </div>
                      </div>
                      
                      <h4 className="text-base font-bold text-slate-900 mb-1 font-headline">{card.patient}</h4>
                      
                      <div className="flex items-center gap-4 text-xs font-medium text-slate-500 mb-4">
                        <span className="flex items-center gap-1.5">
                          <Tag className="w-3.5 h-3.5" />
                          {card.type}
                        </span>
                        <span className="flex items-center gap-1.5">
                          <Clock className="w-3.5 h-3.5" />
                          {card.days} days
                        </span>
                      </div>

                      <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                        <div className="text-lg font-black text-slate-900 tracking-tight">
                          ${typeof card.amount === 'number' ? card.amount.toFixed(2) : card.amount}
                        </div>
                        <button className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 hover:bg-teal-50 hover:text-teal-600 transition-colors opacity-0 group-hover:opacity-100">
                          <ArrowRight className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
                
                {/* Empty State for Column */}
                {column.cards.length === 0 && (
                  <div className="flex-1 flex flex-col items-center justify-center text-center p-6 border-2 border-dashed border-slate-200 rounded-3xl">
                    <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center mb-3 shadow-sm">
                      <Plus className="w-5 h-5 text-slate-300" />
                    </div>
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Drop cases here</p>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </main>

      {/* Case Details Modal */}
      {selectedCase && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-[2.5rem] w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="sticky top-0 bg-white/80 backdrop-blur-md border-b border-slate-100 p-6 flex items-center justify-between z-10">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-slate-100 rounded-2xl flex items-center justify-center">
                  <User className="w-6 h-6 text-slate-600" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-slate-900 font-headline">{selectedCase.patient}</h2>
                  <div className="text-sm font-medium text-slate-500">{selectedCase.id}</div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button 
                  onClick={() => handleDeleteCase(selectedCase.id)}
                  className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-full transition-colors"
                  title="Delete Case"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
                <button 
                  onClick={() => { setSelectedCase(null); setCaseAnalysis(null); }}
                  className="p-2 text-slate-400 hover:bg-slate-100 rounded-full transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
            </div>
            
            <div className="p-8">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="bg-slate-50 p-6 rounded-3xl border border-slate-100">
                  <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Amount Due</div>
                  <div className="text-3xl font-extrabold text-slate-900">${typeof selectedCase.amount === 'number' ? selectedCase.amount.toFixed(2) : selectedCase.amount}</div>
                </div>
                <div className="bg-slate-50 p-6 rounded-3xl border border-slate-100">
                  <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Days Aging</div>
                  <div className="text-xl font-bold text-slate-700">{selectedCase.days} Days</div>
                </div>
                <div className="bg-slate-50 p-6 rounded-3xl border border-slate-100">
                  <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Priority</div>
                  <div className={`text-xl font-bold ${
                    selectedCase.priority === 'High' ? 'text-red-600' :
                    selectedCase.priority === 'Medium' ? 'text-amber-600' : 'text-teal-600'
                  }`}>{selectedCase.priority}</div>
                </div>
              </div>

              <h3 className="text-lg font-bold text-slate-900 mb-4 font-headline">Case Details</h3>
              <div className="space-y-4 mb-8">
                <div className="flex items-center justify-between p-4 rounded-2xl border border-slate-100">
                  <span className="text-sm font-bold text-slate-500">Type</span>
                  <span className="text-sm font-bold text-slate-900">{selectedCase.type}</span>
                </div>
                <div className="flex items-center justify-between p-4 rounded-2xl border border-slate-100">
                  <span className="text-sm font-bold text-slate-500">Current Stage</span>
                  <span className="text-sm font-bold text-slate-900 capitalize">{selectedCase.pipelineId.replace('-', ' ')}</span>
                </div>
                {selectedCase.sourceClaimId && (
                  <div className="p-4 rounded-2xl border border-teal-100 bg-teal-50">
                    <div className="flex items-center justify-between gap-4">
                      <span className="text-sm font-bold text-teal-800">Came from a claim</span>
                      <Link
                        href="/dashboard/claims"
                        className="text-xs font-bold text-teal-700 underline hover:text-teal-900 shrink-0"
                      >
                        View claims
                      </Link>
                    </div>
                    {selectedCase.sourceDenialReason && (
                      <p className="text-xs text-teal-800 mt-2 leading-relaxed">
                        Denied for: {selectedCase.sourceDenialReason}
                      </p>
                    )}
                  </div>
                )}
              </div>

              {caseAnalysis && (
                <div className="mb-8 p-6 bg-slate-50 border border-slate-100 rounded-3xl space-y-4">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-teal-600" />
                    <h4 className="text-sm font-bold text-slate-900">AI Recovery Analysis</h4>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Recovery probability</div>
                      <div className="text-2xl font-extrabold text-slate-900">{Math.round(caseAnalysis.recoveryProbability * 100)}%</div>
                    </div>
                    <div>
                      <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Suggested priority</div>
                      <div className={`text-2xl font-extrabold ${
                        caseAnalysis.priority === 'High' ? 'text-red-600' :
                        caseAnalysis.priority === 'Medium' ? 'text-amber-600' : 'text-slate-500'
                      }`}>{caseAnalysis.priority}</div>
                    </div>
                  </div>

                  {caseAnalysis.isPatientResponsibility && (
                    <div className="flex gap-3 p-3 bg-amber-50 border border-amber-100 rounded-2xl">
                      <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                      <p className="text-xs text-amber-800 font-medium leading-relaxed">
                        Treat this as a patient billing conversation rather than a payer appeal.
                      </p>
                    </div>
                  )}

                  <div>
                    <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">Assessment</div>
                    <p className="text-sm text-slate-700 leading-relaxed">{caseAnalysis.rootCause}</p>
                  </div>
                  <div>
                    <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">Recommended next step</div>
                    <p className="text-sm text-slate-700 leading-relaxed">{caseAnalysis.recommendedAction}</p>
                  </div>
                  <p className="text-[10px] text-slate-400 leading-relaxed">
                    AI-generated estimate from the data recorded on this case. Not a guarantee of collection.
                  </p>
                </div>
              )}

              <div className="flex gap-4">
                <button
                  onClick={handleAnalyseCase}
                  disabled={isProcessing}
                  className="flex-1 py-4 bg-teal-600 text-white rounded-2xl font-bold shadow-lg shadow-teal-500/20 hover:bg-teal-700 transition-all disabled:opacity-70 flex items-center justify-center gap-2"
                >
                  {isProcessing ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Analysing…
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-5 h-5" />
                      {caseAnalysis ? 'Re-run AI analysis' : 'Run AI analysis'}
                    </>
                  )}
                </button>
                <button
                  onClick={() => {
                    const next = selectedCase.pipelineId === 'recovered' ? 'identified' : 'recovered';
                    handleMoveCase(selectedCase.id, next);
                  }}
                  className="px-6 py-4 bg-slate-100 text-slate-700 rounded-2xl font-bold hover:bg-slate-200 transition-colors"
                >
                  {selectedCase.pipelineId === 'recovered' ? 'Reopen case' : 'Mark recovered'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* New Case Modal */}
      {isNewCaseModalOpen && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-[2.5rem] w-full max-w-md p-8 shadow-2xl">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-slate-900 font-headline">New Recovery Case</h2>
              <button 
                onClick={() => setIsNewCaseModalOpen(false)}
                className="p-2 text-slate-400 hover:bg-slate-100 rounded-full transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <form onSubmit={handleCreateCase} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Patient Reference</label>
                <input
                  type="text"
                  name="patient"
                  required
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 font-medium text-sm"
                  placeholder="e.g. Case #4021, or initials"
                />
                <p className="text-[11px] text-slate-400 mt-1.5 leading-snug">
                  Never sent to our AI provider. A case ID or initials work just as well as a full name.
                </p>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Amount ($)</label>
                  <input 
                    type="number" 
                    name="amount"
                    step="0.01"
                    required
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 font-medium text-sm"
                    placeholder="0.00"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Days Aging</label>
                  <input 
                    type="number" 
                    name="days"
                    required
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 font-medium text-sm"
                    placeholder="e.g. 30"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Type</label>
                <select 
                  name="type"
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 font-medium text-sm"
                >
                  <option value="Co-pay">Co-pay</option>
                  <option value="Deductible">Deductible</option>
                  <option value="Out of Network">Out of Network</option>
                  <option value="Procedure">Procedure</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Priority</label>
                <select 
                  name="priority"
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 font-medium text-sm"
                >
                  <option value="Low">Low</option>
                  <option value="Medium">Medium</option>
                  <option value="High">High</option>
                </select>
              </div>

              <div className="pt-4 flex gap-3">
                <button 
                  type="button"
                  onClick={() => setIsNewCaseModalOpen(false)}
                  className="flex-1 py-3 bg-slate-100 text-slate-700 rounded-xl font-bold hover:bg-slate-200 transition-colors"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="flex-1 py-3 bg-teal-600 text-white rounded-xl font-bold shadow-lg shadow-teal-500/20 hover:bg-teal-700 transition-all"
                >
                  Create Case
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
