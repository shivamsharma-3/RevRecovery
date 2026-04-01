'use client';

import React, { useState, useMemo, useEffect } from 'react';
import { toast } from 'sonner';
import { 
  Search, Filter, Download, Plus, 
  CheckCircle2, AlertCircle, Clock,
  FileText, Activity, Users, Megaphone, BarChart3, X, Eye, RefreshCw, Check
} from 'lucide-react';
import { useAuth } from '@/components/AuthProvider';
import { db } from '@/firebase';
import { collection, getDocs, addDoc, updateDoc, doc, query, orderBy } from 'firebase/firestore';
import { logAuditAction } from '@/lib/audit';

export default function ClaimsRecoveryPage() {
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All Statuses');
  const [selectedClaim, setSelectedClaim] = useState<any>(null);
  const [isNewClaimModalOpen, setIsNewClaimModalOpen] = useState(false);
  const [claims, setClaims] = useState<any[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const itemsPerPage = 10;

  useEffect(() => {
    const fetchClaims = async () => {
      if (!user?.uid) return;
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

  const totalPages = Math.ceil(filteredClaims.length / itemsPerPage) || 1;
  const paginatedClaims = filteredClaims.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

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

  return (
    <div className="p-6 md:p-10 max-w-[1600px] mx-auto">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 font-headline">Claims Recovery</h1>
          <p className="text-slate-500 font-medium mt-1">Monitor and manage your insurance claim recovery process.</p>
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={handleExportCSV}
            className="px-4 py-2 bg-white border border-slate-200 text-slate-700 rounded-xl text-sm font-bold hover:bg-slate-50 transition-all shadow-sm flex items-center gap-2"
          >
            <Download className="w-4 h-4" />
            Export CSV
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
                    <th className="p-4 pr-6 text-[10px] font-bold text-slate-400 uppercase tracking-widest text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {paginatedClaims.map((claim) => {
                    const patientName = claim.patientName || claim.patient || 'Unknown';
                    const amountValue = typeof claim.amount === 'number' ? claim.amount : parseFloat((claim.amount || '0').toString().replace(/[^0-9.-]+/g, ""));
                    
                    return (
                    <tr key={claim.id} className="hover:bg-slate-50/50 transition-colors group">
                      <td className="p-4 pl-6 cursor-pointer" onClick={() => setSelectedClaim(claim)}>
                        <p className="text-sm font-bold text-teal-600 font-mono">{claim.id.substring(0, 8)}...</p>
                        <p className="text-xs text-slate-500 font-medium flex items-center gap-1 mt-0.5">
                          <Clock className="w-3 h-3" />
                          {claim.date ? new Date(claim.date).toLocaleDateString() : 'N/A'}
                        </p>
                      </td>
                      <td className="p-4 cursor-pointer" onClick={() => setSelectedClaim(claim)}>
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 font-bold text-xs">
                            {patientName.charAt(0)}
                          </div>
                          <span className="text-sm font-bold text-slate-900">{patientName}</span>
                        </div>
                      </td>
                      <td className="p-4 cursor-pointer" onClick={() => setSelectedClaim(claim)}>
                        <p className="text-sm font-bold text-slate-700">{claim.insurance || 'Unknown'}</p>
                        <p className="text-xs font-medium text-slate-500 mt-0.5">{claim.type || 'Outpatient'}</p>
                      </td>
                      <td className="p-4 cursor-pointer" onClick={() => setSelectedClaim(claim)}>
                        <span className="text-sm font-extrabold text-slate-900">{formatCurrency(amountValue)}</span>
                      </td>
                      <td className="p-4 cursor-pointer" onClick={() => setSelectedClaim(claim)}>
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
                      <td className="p-4 pr-6 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button 
                            onClick={() => setSelectedClaim(claim)}
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
                      <td colSpan={6} className="p-12 text-center">
                        <div className="flex flex-col items-center justify-center text-slate-500">
                          <FileText className="w-12 h-12 text-slate-300 mb-4" />
                          <p className="text-lg font-bold text-slate-900 mb-1">No claims yet</p>
                          <p className="text-sm font-medium mb-4">Create your first claim to start recovering revenue.</p>
                          <button 
                            onClick={() => setIsNewClaimModalOpen(true)}
                            className="flex items-center gap-2 px-4 py-2 bg-teal-600 text-white rounded-xl hover:bg-teal-700 transition-all font-bold text-sm shadow-lg shadow-teal-900/20"
                          >
                            <Plus className="w-4 h-4" />
                            New Claim
                          </button>
                        </div>
                      </td>
                    </tr>
                  )}
                  {claims.length > 0 && filteredClaims.length === 0 && (
                    <tr>
                      <td colSpan={6} className="p-8 text-center text-slate-500 font-medium">
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
                onClick={() => setSelectedClaim(null)}
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
                onClick={() => setSelectedClaim(null)}
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
