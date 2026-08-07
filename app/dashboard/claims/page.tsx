'use client';

import React, { useState, useMemo, useEffect } from 'react';
import Link from 'next/link';
import { toast } from 'sonner';
import {
  Search, Filter, Download, Plus,
  CheckCircle2, AlertCircle, Clock,
  FileText, Activity, Users, Megaphone, BarChart3, X, Eye, RefreshCw, Check,
  Sparkles, Loader2, Copy, AlertTriangle, Upload
} from 'lucide-react';
import { useAuth } from '@/components/AuthProvider';
import { db } from '@/firebase';
import { collection, getDocs, addDoc, updateDoc, doc, query, orderBy } from 'firebase/firestore';
import { logAuditAction } from '@/lib/audit';
import { analyzeClaim, generateAppealLetter, type ClaimAnalysis } from '@/lib/ai/api';
import { toCsv } from '@/lib/csv';

export default function ClaimsRecoveryPage() {
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All Statuses');
  const [selectedClaim, setSelectedClaim] = useState<any>(null);
  const [isNewClaimModalOpen, setIsNewClaimModalOpen] = useState(false);
  const [aiAnalysis, setAiAnalysis] = useState<ClaimAnalysis | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [appealLetter, setAppealLetter] = useState<string | null>(null);
  const [isDrafting, setIsDrafting] = useState(false);
  const [bulkProgress, setBulkProgress] = useState<{ done: number; total: number } | null>(null);
  const [sortByValue, setSortByValue] = useState(true);
  const [claims, setClaims] = useState<any[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const itemsPerPage = 10;

  useEffect(() => {
    const fetchClaims = async () => {
      if (!user?.uid) {
        setIsLoading(false);
        return;
      }
      setIsLoading(true);
      try {
        const q = query(collection(db, 'users', user.uid, 'claims'));
        const snapshot = await getDocs(q);
        const fetchedClaims = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        // Sort by date descending
        fetchedClaims.sort((a: any, b: any) => new Date(b.date).getTime() - new Date(a.date).getTime());
        setClaims(fetchedClaims);
      } catch (error) {
        console.error("Error fetching claims:", error);
        toast.error('Failed to fetch claims');
      } finally {
        setIsLoading(false);
      }
    };
    fetchClaims();
  }, [user]);

  // New Claim Form State
  const [newClaim, setNewClaim] = useState({
    patient: '',
    amount: '',
    insurance: '',
    type: 'Outpatient'
  });

  const handleExportCSV = () => {
    const headers = ['Claim ID', 'Patient', 'Date', 'Amount', 'Status', 'Insurance', 'Type'];
    const csvContent = [
      headers.join(','),
      ...claims.map(c => {
        const patientName = c.patientName || c.patient || 'Unknown';
        const amountValue = typeof c.amount === 'number' ? c.amount : parseFloat((c.amount || '0').toString().replace(/[^0-9.-]+/g, ""));
        return `${c.id},${patientName},${c.date},"${amountValue}",${c.status},${c.insurance},${c.type}`;
      })
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', 'claims_export.csv');
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleCreateClaim = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user?.uid) return;
    
    const newClaimData = {
      patientName: newClaim.patient,
      date: new Date().toISOString().split('T')[0],
      amount: parseFloat(newClaim.amount),
      status: 'Pending',
      insurance: newClaim.insurance,
      type: newClaim.type,
      denialReason: 'N/A',
      probability: 0.5
    };

    try {
      const docRef = await addDoc(collection(db, 'users', user.uid, 'claims'), newClaimData);
      
      await logAuditAction(user.uid, {
        user: user.displayName || user.email || 'User',
        action: 'Created Claim',
        target: `Claim for ${newClaimData.patientName}`,
        status: 'Success',
        severity: 'Low',
        type: 'claim'
      });

      setClaims([{ id: docRef.id, ...newClaimData }, ...claims]);
      setIsNewClaimModalOpen(false);
      setNewClaim({ patient: '', amount: '', insurance: '', type: 'Outpatient' });
      toast.success('Claim created successfully');
    } catch (error) {
      console.error("Error creating claim:", error);
      await logAuditAction(user.uid, {
        user: user.displayName || user.email || 'User',
        action: 'Claim Creation Failed',
        target: `Claim for ${newClaim.patient}`,
        status: 'Failed',
        severity: 'Medium',
        type: 'claim'
      });
      toast.error('Failed to create claim');
    }
  };

  const updateClaimStatus = async (id: string, newStatus: string) => {
    if (!user?.uid) return;
    const claim = claims.find(c => c.id === id);
    const patientName = claim?.patientName || claim?.patient || 'Unknown';

    try {
      await updateDoc(doc(db, 'users', user.uid, 'claims', id), { status: newStatus });
      
      await logAuditAction(user.uid, {
        user: user.displayName || user.email || 'User',
        action: 'Updated Claim Status',
        target: `Claim for ${patientName} to ${newStatus}`,
        status: 'Success',
        severity: 'Low',
        type: 'claim'
      });

      setClaims(claims.map(c => c.id === id ? { ...c, status: newStatus } : c));
      toast.success(`Claim status updated to ${newStatus}`);
    } catch (error) {
      console.error("Error updating claim status:", error);
      await logAuditAction(user.uid, {
        user: user.displayName || user.email || 'User',
        action: 'Claim Status Update Failed',
        target: `Claim for ${patientName}`,
        status: 'Failed',
        severity: 'Medium',
        type: 'claim'
      });
      toast.error('Failed to update claim status');
    }
  };

  const filteredClaims = useMemo(() => {
    return claims.filter(claim => {
      const patientName = claim.patientName || claim.patient || '';
      const claimId = claim.id || '';
      const insurance = claim.insurance || '';
      
      const matchesSearch = patientName.toLowerCase().includes(searchTerm.toLowerCase()) || 
                            claimId.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            insurance.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = statusFilter === 'All Statuses' || claim.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [claims, searchTerm, statusFilter]);

  const getAmountValue = (claim: any) => {
    if (typeof claim.amount === 'number') return claim.amount;
    if (typeof claim.amount === 'string') return parseFloat(claim.amount.replace(/[^0-9.-]+/g, "")) || 0;
    return 0;
  };

  const totalAmount = claims.reduce((sum, claim) => sum + getAmountValue(claim), 0);
  const recoveredAmount = claims.filter(c => c.status === 'Recovered').reduce((sum, claim) => sum + getAmountValue(claim), 0);
  const pendingAmount = claims.filter(c => c.status === 'Pending' || c.status === 'In Review' || c.status === 'In Progress').reduce((sum, claim) => sum + getAmountValue(claim), 0);
  const deniedAmount = claims.filter(c => c.status === 'Denied').reduce((sum, claim) => sum + getAmountValue(claim), 0);

  const formatCurrency = (val: number) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(val);

  // Expected value, not raw probability — a 90%-likely $80 claim is not worth
  // working before a 55%-likely $4,000 one.
  const expectedValue = (claim: any) =>
    typeof claim.aiRecoveryProbability === 'number'
      ? claim.aiRecoveryProbability * getAmountValue(claim)
      : -1;

  const triagedCount = claims.filter((c) => typeof c.aiRecoveryProbability === 'number').length;
  const unanalysedCount = claims.filter(
    (c) => typeof c.aiRecoveryProbability !== 'number' && c.status !== 'Recovered'
  ).length;

  const worklist = claims.filter(
    (c) => typeof c.aiRecoveryProbability === 'number' && !c.aiPatientResponsibility && c.aiRecoveryProbability >= 0.4
  );
  const worklistValue = worklist.reduce((sum, c) => sum + expectedValue(c), 0);

  /**
   * Triage every untriaged claim. Runs a small worker pool rather than firing
   * every request at once — the route is rate-limited per user, and a 200-claim
   * import would otherwise trip it immediately.
   */
  const handleTriageAll = async () => {
    if (!user?.uid) return;
    const pending = claims.filter(
      (c) => typeof c.aiRecoveryProbability !== 'number' && c.status !== 'Recovered'
    );
    if (pending.length === 0) {
      toast.info('Every claim has already been triaged.');
      return;
    }

    setBulkProgress({ done: 0, total: pending.length });
    let done = 0;
    let failed = 0;
    const results = new Map<string, any>();

    const CONCURRENCY = 3;
    const queue = [...pending];

    const worker = async () => {
      while (queue.length > 0) {
        const claim = queue.shift();
        if (!claim) break;
        try {
          const result = await analyzeClaim({
            patientName: claim.patientName || claim.patient,
            amount: getAmountValue(claim),
            status: claim.status,
            denialReason: claim.denialReason,
            date: claim.date,
            payer: claim.insurance,
            procedureCode: claim.procedureCode,
          });

          const fields = {
            aiRecoveryProbability: result.recoveryProbability,
            aiPriority: result.priority,
            aiDenialCategory: result.denialCategory,
            aiRootCause: result.rootCause,
            aiRecommendedAction: result.recommendedAction,
            aiPatientResponsibility: result.isPatientResponsibility,
            aiAnalysedAt: new Date().toISOString(),
          };
          results.set(claim.id, fields);
          await updateDoc(doc(db, 'users', user.uid, 'claims', claim.id), fields);
        } catch (error: any) {
          failed++;
          // A quota error will hit every remaining claim — stop rather than
          // grinding through 200 guaranteed failures.
          if (/quota|429/i.test(error?.message || '')) {
            queue.length = 0;
            toast.error('AI quota reached. Triage paused — try again shortly.');
          }
        } finally {
          done++;
          setBulkProgress({ done, total: pending.length });
        }
      }
    };

    try {
      await Promise.all(Array.from({ length: Math.min(CONCURRENCY, pending.length) }, worker));

      setClaims((prev) => prev.map((c) => (results.has(c.id) ? { ...c, ...results.get(c.id) } : c)));

      await logAuditAction(user.uid, {
        user: user.displayName || user.email || 'User',
        action: 'Bulk AI Triage',
        target: `${results.size} claims triaged`,
        status: 'Success',
        severity: 'Info',
        type: 'claim',
      });

      if (results.size > 0) {
        toast.success(
          `Triaged ${results.size} claim${results.size === 1 ? '' : 's'}${failed ? ` — ${failed} failed` : ''}`
        );
      } else if (failed > 0) {
        toast.error('Triage failed. Check your connection and try again.');
      }
    } finally {
      setBulkProgress(null);
    }
  };

  const handleExportWorklist = () => {
    const ranked = [...worklist].sort((a, b) => expectedValue(b) - expectedValue(a));
    const headers = [
      'Patient', 'Date', 'Payer', 'Code', 'Amount', 'Recovery probability',
      'Expected value', 'Priority', 'Denial category', 'Recommended action',
    ];
    const rows = ranked.map((c) => [
      c.patientName || c.patient || 'Unknown',
      c.date || '',
      c.insurance || '',
      c.procedureCode || '',
      getAmountValue(c).toFixed(2),
      `${Math.round((c.aiRecoveryProbability || 0) * 100)}%`,
      expectedValue(c).toFixed(2),
      c.aiPriority || '',
      c.aiDenialCategory || '',
      c.aiRecommendedAction || '',
    ]);

    const blob = new Blob([toCsv([headers, ...rows])], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `revrecover-worklist-${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
    URL.revokeObjectURL(link.href);
    toast.success('Worklist exported');
  };

  // Untriaged claims sort last so the ranked worklist stays at the top.
  const displayClaims = useMemo(() => {
    if (!sortByValue) return filteredClaims;
    return [...filteredClaims].sort((a, b) => expectedValue(b) - expectedValue(a));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filteredClaims, sortByValue]);

  const totalPages = Math.ceil(displayClaims.length / itemsPerPage) || 1;
  const paginatedClaims = displayClaims.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const openClaim = (claim: any) => {
    setSelectedClaim(claim);
    setAiAnalysis(null);
    setAppealLetter(null);
  };

  const closeClaim = () => {
    setSelectedClaim(null);
    setAiAnalysis(null);
    setAppealLetter(null);
  };

  const handleAnalyze = async () => {
    if (!selectedClaim) return;
    setIsAnalyzing(true);
    setAiAnalysis(null);
    try {
      const result = await analyzeClaim({
        patientName: selectedClaim.patientName || selectedClaim.patient,
        amount: getAmountValue(selectedClaim),
        status: selectedClaim.status,
        denialReason: selectedClaim.denialReason,
        date: selectedClaim.date,
        payer: selectedClaim.insurance,
        procedureCode: selectedClaim.procedureCode,
      });
      setAiAnalysis(result);

      // Persist so the claim joins the ranked worklist instead of the result
      // vanishing when the modal closes.
      if (user?.uid) {
        const fields = {
          aiRecoveryProbability: result.recoveryProbability,
          aiPriority: result.priority,
          aiDenialCategory: result.denialCategory,
          aiRootCause: result.rootCause,
          aiRecommendedAction: result.recommendedAction,
          aiPatientResponsibility: result.isPatientResponsibility,
          aiAnalysedAt: new Date().toISOString(),
        };
        await updateDoc(doc(db, 'users', user.uid, 'claims', selectedClaim.id), fields);
        setClaims((prev) => prev.map((c) => (c.id === selectedClaim.id ? { ...c, ...fields } : c)));

        await logAuditAction(user.uid, {
          user: user.displayName || user.email || 'User',
          action: 'AI Claim Analysis',
          target: `Claim ${String(selectedClaim.id).substring(0, 8)}`,
          status: 'Success',
          severity: 'Info',
          type: 'claim',
        });
      }
    } catch (error: any) {
      toast.error(error?.message || 'Analysis failed.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleDraftAppeal = async () => {
    if (!selectedClaim) return;
    if (!selectedClaim.denialReason) {
      toast.error('This claim has no denial reason recorded — add one before drafting an appeal.');
      return;
    }
    setIsDrafting(true);
    try {
      const { letter } = await generateAppealLetter({
        patientName: selectedClaim.patientName || selectedClaim.patient,
        amount: getAmountValue(selectedClaim),
        denialReason: selectedClaim.denialReason,
        date: selectedClaim.date,
        payer: selectedClaim.insurance,
        procedureCode: selectedClaim.procedureCode,
        claimNumber: String(selectedClaim.id),
      });
      setAppealLetter(letter);
      if (user?.uid) {
        await logAuditAction(user.uid, {
          user: user.displayName || user.email || 'User',
          action: 'Generated Appeal Letter',
          target: `Claim ${String(selectedClaim.id).substring(0, 8)}`,
          status: 'Success',
          severity: 'Medium',
          type: 'claim',
        });
      }
    } catch (error: any) {
      toast.error(error?.message || 'Could not draft the appeal.');
    } finally {
      setIsDrafting(false);
    }
  };

  return (
    <div className="p-6 md:p-10 max-w-[1600px] mx-auto">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 font-headline">Claims Recovery</h1>
          <p className="text-slate-500 font-medium mt-1">Monitor and manage your insurance claim recovery process.</p>
        </div>
        <div className="flex items-center gap-3 flex-wrap">
          <button
            onClick={handleExportCSV}
            className="px-4 py-2 bg-white border border-slate-200 text-slate-700 rounded-xl text-sm font-bold hover:bg-slate-50 transition-all shadow-sm flex items-center gap-2"
          >
            <Download className="w-4 h-4" />
            Export CSV
          </button>
          <Link href="/dashboard/claims/import">
            <button className="px-4 py-2 bg-white border border-slate-200 text-slate-700 rounded-xl text-sm font-bold hover:bg-slate-50 transition-all shadow-sm flex items-center gap-2">
              <Upload className="w-4 h-4" />
              Import CSV
            </button>
          </Link>
          <button
            onClick={handleTriageAll}
            disabled={bulkProgress !== null || unanalysedCount === 0}
            className="px-4 py-2 bg-slate-900 text-white rounded-xl text-sm font-bold hover:bg-slate-800 transition-all shadow-lg shadow-slate-900/10 flex items-center gap-2 disabled:opacity-50"
            title={unanalysedCount === 0 ? 'Every claim has already been triaged' : undefined}
          >
            {bulkProgress ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
            {bulkProgress
              ? `Triaging ${bulkProgress.done}/${bulkProgress.total}…`
              : `Triage ${unanalysedCount || ''} with AI`.replace('  ', ' ')}
          </button>
          <button
            onClick={() => setIsNewClaimModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2 bg-teal-600 text-white rounded-xl hover:bg-teal-700 transition-all font-bold text-sm shadow-lg shadow-teal-900/20"
          >
            <Plus className="w-4 h-4" />
            New Claim
          </button>
        </div>
      </div>

      {/* Worklist summary — appears once anything has been triaged */}
      {triagedCount > 0 && (
        <div className="mb-8 p-6 bg-white rounded-[2rem] border border-slate-200 shadow-sm">
          <div className="flex items-start justify-between gap-6 flex-wrap">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Sparkles className="w-4 h-4 text-teal-600" />
                <h2 className="text-sm font-bold text-slate-900">Today&apos;s worklist</h2>
              </div>
              <p className="text-sm text-slate-500 font-medium leading-relaxed max-w-xl">
                {worklist.length} of {triagedCount} triaged claims are worth chasing, carrying{' '}
                <strong className="text-slate-900">{formatCurrency(worklistValue)}</strong> in
                weighted recoverable value. The rest are contractual or too old to appeal.
              </p>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setSortByValue((v) => !v)}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all border ${
                  sortByValue
                    ? 'bg-teal-50 border-teal-200 text-teal-700'
                    : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                {sortByValue ? '✓ Sorted by expected value' : 'Sort by expected value'}
              </button>
              <button
                onClick={handleExportWorklist}
                className="px-4 py-2 bg-white border border-slate-200 text-slate-700 rounded-xl text-xs font-bold hover:bg-slate-50 transition-all flex items-center gap-2"
              >
                <Download className="w-3.5 h-3.5" /> Export worklist
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Main Content */}
        <div className="flex-1 min-w-0">
          {/* Stats Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-8">
            {[
              { label: 'Total Claims', value: claims.length, icon: FileText, color: 'text-blue-600', bg: 'bg-blue-50' },
              { label: 'Recovered', value: formatCurrency(recoveredAmount), icon: CheckCircle2, color: 'text-teal-600', bg: 'bg-teal-50' },
              { label: 'Pending', value: formatCurrency(pendingAmount), icon: Clock, color: 'text-amber-600', bg: 'bg-amber-50' },
              { label: 'Denied', value: formatCurrency(deniedAmount), icon: AlertCircle, color: 'text-red-600', bg: 'bg-red-50' },
            ].map((stat, i) => (
              <div key={i} className="bg-white p-5 rounded-[1.5rem] border border-slate-100 shadow-sm flex flex-col justify-between">
                <div className="flex items-center justify-between mb-3">
                  <div className={`w-10 h-10 rounded-xl ${stat.bg} ${stat.color} flex items-center justify-center`}>
                    <stat.icon className="w-5 h-5" />
                  </div>
                </div>
                <h3 className="text-slate-500 text-xs font-bold uppercase tracking-wider">{stat.label}</h3>
                <p className="text-2xl font-extrabold text-slate-900 tracking-tight mt-1">{stat.value}</p>
              </div>
            ))}
          </div>

          {/* Claims Table */}
          <div className="bg-white rounded-[2rem] border border-slate-100 shadow-sm overflow-hidden">
            <div className="p-4 border-b border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="relative flex-1 w-full md:max-w-md">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input 
                  type="text" 
                  placeholder="Search claims, patients, or insurance..." 
                  value={searchTerm}
                  onChange={(e) => {
                    setSearchTerm(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="w-full pl-12 pr-4 py-3 bg-slate-50 border-transparent rounded-xl text-sm font-medium focus:bg-white focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all outline-none"
                />
              </div>
              <div className="flex items-center gap-3 w-full md:w-auto">
                <select 
                  value={statusFilter}
                  onChange={(e) => {
                    setStatusFilter(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="flex-1 md:flex-none bg-slate-50 border-transparent rounded-xl text-sm font-bold px-4 py-3 text-slate-700 focus:bg-white focus:ring-2 focus:ring-teal-500/20 transition-all cursor-pointer outline-none"
                >
                  <option>All Statuses</option>
                  <option>Recovered</option>
                  <option>Pending</option>
                  <option>In Review</option>
                  <option>Denied</option>
                </select>
                <button className="p-3 bg-slate-50 hover:bg-slate-100 rounded-xl text-slate-500 transition-colors">
                  <Filter className="w-5 h-5" />
                </button>
              </div>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse min-w-[800px]">
                <thead>
                  <tr className="bg-slate-50/50 border-b border-slate-100">
                    <th className="p-4 pl-6 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Claim ID / Date</th>
                    <th className="p-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Patient</th>
                    <th className="p-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Insurance / Type</th>
                    <th className="p-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Amount</th>
                    <th className="p-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Status</th>
                    <th className="p-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">AI verdict</th>
                    <th className="p-4 pr-6 text-[10px] font-bold text-slate-400 uppercase tracking-widest text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {paginatedClaims.map((claim) => {
                    const patientName = claim.patientName || claim.patient || 'Unknown';
                    const amountValue = typeof claim.amount === 'number' ? claim.amount : parseFloat((claim.amount || '0').toString().replace(/[^0-9.-]+/g, ""));
                    
                    return (
                    <tr key={claim.id} className="hover:bg-slate-50/50 transition-colors group">
                      <td className="p-4 pl-6 cursor-pointer" onClick={() => openClaim(claim)}>
                        <p className="text-sm font-bold text-teal-600 font-mono">{claim.id.substring(0, 8)}...</p>
                        <p className="text-xs text-slate-500 font-medium flex items-center gap-1 mt-0.5">
                          <Clock className="w-3 h-3" />
                          {claim.date ? new Date(claim.date).toLocaleDateString() : 'N/A'}
                        </p>
                      </td>
                      <td className="p-4 cursor-pointer" onClick={() => openClaim(claim)}>
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 font-bold text-xs">
                            {patientName.charAt(0)}
                          </div>
                          <span className="text-sm font-bold text-slate-900">{patientName}</span>
                        </div>
                      </td>
                      <td className="p-4 cursor-pointer" onClick={() => openClaim(claim)}>
                        <p className="text-sm font-bold text-slate-700">{claim.insurance || 'Unknown'}</p>
                        <p className="text-xs font-medium text-slate-500 mt-0.5">{claim.type || 'Outpatient'}</p>
                      </td>
                      <td className="p-4 cursor-pointer" onClick={() => openClaim(claim)}>
                        <span className="text-sm font-extrabold text-slate-900">{formatCurrency(amountValue)}</span>
                      </td>
                      <td className="p-4 cursor-pointer" onClick={() => openClaim(claim)}>
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-bold ${
                          claim.status === 'Recovered' ? 'bg-teal-50 text-teal-700' :
                          claim.status === 'Pending' ? 'bg-amber-50 text-amber-700' :
                          claim.status === 'In Review' || claim.status === 'In Progress' ? 'bg-blue-50 text-blue-700' :
                          'bg-red-50 text-red-700'
                        }`}>
                          {claim.status === 'Recovered' && <CheckCircle2 className="w-3 h-3" />}
                          {claim.status === 'Pending' && <Clock className="w-3 h-3" />}
                          {(claim.status === 'In Review' || claim.status === 'In Progress') && <Activity className="w-3 h-3" />}
                          {claim.status === 'Denied' && <AlertCircle className="w-3 h-3" />}
                          {claim.status}
                        </span>
                      </td>
                      <td className="p-4 cursor-pointer" onClick={() => openClaim(claim)}>
                        {typeof claim.aiRecoveryProbability === 'number' ? (
                          <div>
                            <div className="flex items-center gap-2">
                              <span className={`text-sm font-extrabold ${
                                claim.aiRecoveryProbability >= 0.6 ? 'text-teal-700' :
                                claim.aiRecoveryProbability >= 0.4 ? 'text-amber-600' : 'text-slate-400'
                              }`}>
                                {Math.round(claim.aiRecoveryProbability * 100)}%
                              </span>
                              {claim.aiPatientResponsibility && (
                                <span className="px-1.5 py-0.5 bg-slate-100 text-slate-500 rounded text-[9px] font-bold uppercase tracking-wider">
                                  Patient
                                </span>
                              )}
                            </div>
                            <p className="text-[11px] text-slate-500 font-medium mt-0.5 max-w-[180px] truncate" title={claim.aiDenialCategory}>
                              {claim.aiDenialCategory}
                            </p>
                          </div>
                        ) : (
                          <span className="text-xs font-medium text-slate-300">Not triaged</span>
                        )}
                      </td>
                      <td className="p-4 pr-6 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button 
                            onClick={() => openClaim(claim)}
                            className="p-2 bg-white border border-slate-200 hover:bg-slate-50 rounded-lg text-slate-600 transition-all shadow-sm flex items-center gap-1 text-xs font-bold"
                            title="View Details"
                          >
                            <Eye className="w-3.5 h-3.5" /> View
                          </button>
                          {claim.status === 'Denied' && (
                            <button 
                              onClick={() => updateClaimStatus(claim.id, 'In Review')}
                              className="p-2 bg-amber-50 text-amber-700 hover:bg-amber-100 rounded-lg transition-all shadow-sm flex items-center gap-1 text-xs font-bold"
                              title="Appeal Claim"
                            >
                              <RefreshCw className="w-3.5 h-3.5" /> Appeal
                            </button>
                          )}
                          {claim.status !== 'Recovered' && (
                            <button 
                              onClick={() => updateClaimStatus(claim.id, 'Recovered')}
                              className="p-2 bg-teal-50 text-teal-700 hover:bg-teal-100 rounded-lg transition-all shadow-sm flex items-center gap-1 text-xs font-bold"
                              title="Mark as Paid"
                            >
                              <Check className="w-3.5 h-3.5" /> Paid
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  )})}
                  {claims.length === 0 && (
                    <tr>
                      <td colSpan={7} className="p-12 text-center">
                        <div className="flex flex-col items-center justify-center text-slate-500">
                          <FileText className="w-12 h-12 text-slate-300 mb-4" />
                          <p className="text-lg font-bold text-slate-900 mb-1">No claims yet</p>
                          <p className="text-sm font-medium mb-5 max-w-sm">
                            Export your denied or outstanding claims report as CSV and import it —
                            that is the fastest way to see what the engine does with real data.
                          </p>
                          <div className="flex items-center gap-3 flex-wrap justify-center">
                            <Link href="/dashboard/claims/import">
                              <button className="flex items-center gap-2 px-4 py-2 bg-teal-600 text-white rounded-xl hover:bg-teal-700 transition-all font-bold text-sm shadow-lg shadow-teal-900/20">
                                <Upload className="w-4 h-4" />
                                Import CSV
                              </button>
                            </Link>
                            <button
                              onClick={() => setIsNewClaimModalOpen(true)}
                              className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 text-slate-700 rounded-xl hover:bg-slate-50 transition-all font-bold text-sm"
                            >
                              <Plus className="w-4 h-4" />
                              Add one manually
                            </button>
                          </div>
                        </div>
                      </td>
                    </tr>
                  )}
                  {claims.length > 0 && filteredClaims.length === 0 && (
                    <tr>
                      <td colSpan={7} className="p-8 text-center text-slate-500 font-medium">
                        No claims found matching your criteria.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
            
            {/* Pagination */}
            {filteredClaims.length > 0 && (
              <div className="p-4 border-t border-slate-100 bg-slate-50 flex items-center justify-between">
                <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                  Showing {(currentPage - 1) * itemsPerPage + 1} to {Math.min(currentPage * itemsPerPage, filteredClaims.length)} of {filteredClaims.length} claims
                </p>
                <div className="flex items-center gap-2">
                  <button 
                    onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                    className="px-4 py-2 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-50 transition-all shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Previous
                  </button>
                  <div className="text-xs font-bold text-slate-600 px-2">
                    Page {currentPage} of {totalPages}
                  </div>
                  <button 
                    onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                    disabled={currentPage === totalPages}
                    className="px-4 py-2 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-50 transition-all shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Next
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* New Claim Modal */}
      {isNewClaimModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
          <div className="bg-white rounded-3xl shadow-xl w-full max-w-md overflow-hidden border border-slate-100">
            <div className="p-6 border-b border-slate-100 flex items-center justify-between">
              <h3 className="text-xl font-bold text-slate-900 font-headline">Create New Claim</h3>
              <button 
                onClick={() => setIsNewClaimModalOpen(false)}
                className="p-2 hover:bg-slate-100 rounded-full text-slate-500 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleCreateClaim} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Patient Name</label>
                <input 
                  type="text" 
                  required
                  value={newClaim.patient}
                  onChange={e => setNewClaim({...newClaim, patient: e.target.value})}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all outline-none"
                  placeholder="e.g. Jane Doe"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Claim Amount ($)</label>
                <input 
                  type="number" 
                  required
                  min="0"
                  step="0.01"
                  value={newClaim.amount}
                  onChange={e => setNewClaim({...newClaim, amount: e.target.value})}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all outline-none"
                  placeholder="e.g. 1500.00"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Insurance Provider</label>
                <input 
                  type="text" 
                  required
                  value={newClaim.insurance}
                  onChange={e => setNewClaim({...newClaim, insurance: e.target.value})}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all outline-none"
                  placeholder="e.g. Blue Cross"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Claim Type</label>
                <select 
                  value={newClaim.type}
                  onChange={e => setNewClaim({...newClaim, type: e.target.value})}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all outline-none"
                >
                  <option>Outpatient</option>
                  <option>Inpatient</option>
                  <option>Dental</option>
                  <option>Specialist</option>
                  <option>Surgery</option>
                  <option>Imaging</option>
                  <option>Primary Care</option>
                </select>
              </div>
              <div className="pt-4 flex justify-end gap-3">
                <button 
                  type="button"
                  onClick={() => setIsNewClaimModalOpen(false)}
                  className="px-6 py-2.5 bg-white border border-slate-200 text-slate-700 rounded-xl font-bold hover:bg-slate-50 transition-all text-sm"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="px-6 py-2.5 bg-teal-600 text-white rounded-xl font-bold hover:bg-teal-700 transition-all shadow-lg shadow-teal-900/20 text-sm"
                >
                  Create Claim
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Claim Details Modal */}
      {selectedClaim && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
          <div className="bg-white rounded-3xl shadow-xl w-full max-w-2xl overflow-hidden border border-slate-100">
            <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-teal-50 flex items-center justify-center text-teal-600">
                  <FileText className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-slate-900 font-headline">Claim {selectedClaim.id.substring(0, 8)}...</h3>
                  <p className="text-sm text-slate-500 font-medium">Submitted on {selectedClaim.date ? new Date(selectedClaim.date).toLocaleDateString() : 'N/A'}</p>
                </div>
              </div>
              <button 
                onClick={closeClaim}
                className="p-2 hover:bg-slate-200 rounded-full text-slate-500 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-2 gap-6 mb-8">
                <div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Patient Name</p>
                  <p className="text-base font-bold text-slate-900">{selectedClaim.patientName || selectedClaim.patient || 'Unknown'}</p>
                </div>
                <div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Claim Amount</p>
                  <p className="text-base font-extrabold text-teal-700">{formatCurrency(typeof selectedClaim.amount === 'number' ? selectedClaim.amount : parseFloat((selectedClaim.amount || '0').toString().replace(/[^0-9.-]+/g, "")))}</p>
                </div>
                <div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Insurance Provider</p>
                  <p className="text-base font-bold text-slate-900">{selectedClaim.insurance || 'Unknown'}</p>
                </div>
                <div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Claim Type</p>
                  <p className="text-base font-bold text-slate-900">{selectedClaim.type || 'Outpatient'}</p>
                </div>
                <div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Current Status</p>
                  <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-bold mt-1 ${
                    selectedClaim.status === 'Recovered' ? 'bg-teal-50 text-teal-700' :
                    selectedClaim.status === 'Pending' ? 'bg-amber-50 text-amber-700' :
                    selectedClaim.status === 'In Review' || selectedClaim.status === 'In Progress' ? 'bg-blue-50 text-blue-700' :
                    'bg-red-50 text-red-700'
                  }`}>
                    {selectedClaim.status}
                  </span>
                </div>
              </div>
              
              {/* AI Recovery Analysis */}
              <div className="border-t border-slate-100 pt-6 mb-6">
                <div className="flex items-center justify-between mb-4 gap-3 flex-wrap">
                  <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-teal-600" />
                    AI Recovery Analysis
                  </h4>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={handleAnalyze}
                      disabled={isAnalyzing}
                      className="px-4 py-2 bg-teal-600 text-white rounded-xl font-bold text-xs hover:bg-teal-700 transition-all disabled:opacity-60 flex items-center gap-2"
                    >
                      {isAnalyzing ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Sparkles className="w-3.5 h-3.5" />}
                      {isAnalyzing ? 'Analysing…' : aiAnalysis ? 'Re-analyse' : 'Analyse claim'}
                    </button>
                    <button
                      onClick={handleDraftAppeal}
                      disabled={isDrafting}
                      className="px-4 py-2 bg-white border border-slate-200 text-slate-700 rounded-xl font-bold text-xs hover:bg-slate-50 transition-all disabled:opacity-60 flex items-center gap-2"
                    >
                      {isDrafting ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <FileText className="w-3.5 h-3.5" />}
                      {isDrafting ? 'Drafting…' : 'Draft appeal'}
                    </button>
                  </div>
                </div>

                {!aiAnalysis && !isAnalyzing && (
                  <p className="text-xs text-slate-500 leading-relaxed">
                    Run the recovery engine to estimate how collectable this claim is, identify the
                    denial category, and get the next concrete step.
                  </p>
                )}

                {aiAnalysis && (
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100">
                        <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">
                          Recovery Probability
                        </div>
                        <div className="text-2xl font-extrabold text-slate-900">
                          {Math.round(aiAnalysis.recoveryProbability * 100)}%
                        </div>
                      </div>
                      <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100">
                        <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">
                          Priority
                        </div>
                        <div className={`text-2xl font-extrabold ${
                          aiAnalysis.priority === 'High' ? 'text-red-600' :
                          aiAnalysis.priority === 'Medium' ? 'text-amber-600' : 'text-slate-500'
                        }`}>
                          {aiAnalysis.priority}
                        </div>
                      </div>
                      <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100">
                        <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">
                          Category
                        </div>
                        <div className="text-sm font-bold text-slate-900 leading-snug">
                          {aiAnalysis.denialCategory}
                        </div>
                      </div>
                    </div>

                    {aiAnalysis.isPatientResponsibility && (
                      <div className="flex gap-3 p-4 bg-amber-50 border border-amber-100 rounded-2xl">
                        <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                        <p className="text-xs text-amber-800 font-medium leading-relaxed">
                          This looks contractual rather than an error — it is likely patient
                          responsibility, not an appeal.
                        </p>
                      </div>
                    )}

                    <div>
                      <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">Root cause</div>
                      <p className="text-sm text-slate-700 leading-relaxed">{aiAnalysis.rootCause}</p>
                    </div>
                    <div>
                      <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">Recommended action</div>
                      <p className="text-sm text-slate-700 leading-relaxed">{aiAnalysis.recommendedAction}</p>
                    </div>

                    {aiAnalysis.missingInformation?.length > 0 && (
                      <div>
                        <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">Missing information</div>
                        <ul className="list-disc pl-5 space-y-1">
                          {aiAnalysis.missingInformation.map((item, i) => (
                            <li key={i} className="text-xs text-slate-600 leading-relaxed">{item}</li>
                          ))}
                        </ul>
                      </div>
                    )}

                    <p className="text-[10px] text-slate-400 leading-relaxed">
                      AI-generated estimate based on the claim data recorded here. Verify against the
                      payer&apos;s remittance advice before acting.
                    </p>
                  </div>
                )}

                {appealLetter && (
                  <div className="mt-6">
                    <div className="flex items-center justify-between mb-2">
                      <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Draft appeal letter</div>
                      <button
                        onClick={() => {
                          navigator.clipboard.writeText(appealLetter);
                          toast.success('Appeal letter copied');
                        }}
                        className="text-[10px] font-bold text-teal-600 hover:text-teal-800 uppercase tracking-widest flex items-center gap-1.5"
                      >
                        <Copy className="w-3 h-3" /> Copy
                      </button>
                    </div>
                    <pre className="whitespace-pre-wrap font-body text-xs text-slate-700 leading-relaxed bg-slate-50 border border-slate-200 rounded-2xl p-5 max-h-72 overflow-y-auto">
                      {appealLetter}
                    </pre>
                    <p className="text-[10px] text-slate-400 mt-2 leading-relaxed">
                      Review every bracketed placeholder and confirm the clinical detail before sending.
                    </p>
                  </div>
                )}
              </div>

              <div className="border-t border-slate-100 pt-6">
                <h4 className="text-sm font-bold text-slate-900 mb-4">Activity Log</h4>
                <div className="space-y-4">
                  <div className="flex gap-4">
                    <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 shrink-0">
                      <Activity className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-slate-900">Status updated to {selectedClaim.status}</p>
                      <p className="text-xs text-slate-500 mt-0.5">Today at 10:42 AM</p>
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 shrink-0">
                      <FileText className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-slate-900">Claim submitted to {selectedClaim.insurance}</p>
                      <p className="text-xs text-slate-500 mt-0.5">{selectedClaim.date}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="p-6 border-t border-slate-100 bg-slate-50 flex justify-end gap-3">
              <button 
                onClick={closeClaim}
                className="px-6 py-2.5 bg-white border border-slate-200 text-slate-700 rounded-xl font-bold hover:bg-slate-50 transition-all shadow-sm text-sm"
              >
                Close
              </button>
              {selectedClaim.status === 'Denied' && (
                <button 
                  onClick={() => {
                    updateClaimStatus(selectedClaim.id, 'In Review');
                    setSelectedClaim({...selectedClaim, status: 'In Review'});
                  }}
                  className="px-6 py-2.5 bg-amber-50 text-amber-700 rounded-xl font-bold hover:bg-amber-100 transition-all shadow-sm text-sm"
                >
                  Appeal Claim
                </button>
              )}
              {selectedClaim.status !== 'Recovered' && (
                <button 
                  onClick={() => {
                    updateClaimStatus(selectedClaim.id, 'Recovered');
                    setSelectedClaim({...selectedClaim, status: 'Recovered'});
                  }}
                  className="px-6 py-2.5 bg-teal-600 text-white rounded-xl font-bold hover:bg-teal-700 transition-all shadow-lg shadow-teal-900/20 text-sm"
                >
                  Mark as Paid
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
