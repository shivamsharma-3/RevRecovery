'use client';

import React, { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { 
  Users, Search, Filter, MoreHorizontal, 
  ChevronRight, ArrowUpRight, ArrowDownRight,
  Clock, CheckCircle2, AlertCircle, Mail, Phone, X, FileText, Activity,
  Plus, User, Calendar, CreditCard, Sparkles, Loader2
} from 'lucide-react';
import { useAuth } from '@/components/AuthProvider';
import { Avatar } from '@/components/Avatar';
import { db } from '@/firebase';
import { collection, getDocs, addDoc, updateDoc, doc, query } from 'firebase/firestore';
import { scoreNoShowRisk, type NoShowRisk } from '@/lib/ai/api';
import { useScrollLock } from '@/hooks/use-scroll-lock';

const MOCK_PATIENTS = [
  { 
    name: 'Sarah Johnson', 
    email: 'sarah.j@example.com',
    status: 'Active', 
    recoveryStatus: 'In Progress',
    balance: 1240.00,
    lastVisit: '2024-03-15',
    riskScore: 'Low'
  },
  { 
    name: 'Michael Chen', 
    email: 'm.chen@example.com',
    status: 'Active', 
    recoveryStatus: 'Recovered',
    balance: 0.00,
    lastVisit: '2024-02-28',
    riskScore: 'Minimal'
  },
  { 
    name: 'Emma Wilson', 
    email: 'emma.w@example.com',
    status: 'Inactive', 
    recoveryStatus: 'Pending',
    balance: 3450.00,
    lastVisit: '2023-11-12',
    riskScore: 'High'
  },
  { 
    name: 'David Rodriguez', 
    email: 'd.rod@example.com',
    status: 'Active', 
    recoveryStatus: 'In Progress',
    balance: 850.00,
    lastVisit: '2024-03-20',
    riskScore: 'Medium'
  },
  { 
    name: 'Lisa Brown', 
    email: 'lisa.b@example.com',
    status: 'Active', 
    recoveryStatus: 'Recovered',
    balance: 0.00,
    lastVisit: '2024-03-05',
    riskScore: 'Minimal'
  },
];

export default function PatientsPage() {
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPatient, setSelectedPatient] = useState<any>(null);
  const [noShowRisk, setNoShowRisk] = useState<NoShowRisk | null>(null);
  const [isScoring, setIsScoring] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isMessageModalOpen, setIsMessageModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('All');
  const [patients, setPatients] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useScrollLock(Boolean(selectedPatient) || isAddModalOpen || isMessageModalOpen);

  useEffect(() => {
    const fetchPatients = async () => {
      if (!user?.uid) {
        setIsLoading(false);
        return;
      }
      setIsLoading(true);
      try {
        const q = query(collection(db, 'users', user.uid, 'patients'));
        const snapshot = await getDocs(q);
        const fetchedPatients = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setPatients(fetchedPatients);
      } catch (error) {
        console.error("Error fetching patients:", error);
        toast.error('Failed to fetch patients');
      } finally {
        setIsLoading(false);
      }
    };
    fetchPatients();
  }, [user]);

  const handleGenerateSampleData = async () => {
    if (!user?.uid) return;
    setIsLoading(true);
    try {
      const promises = MOCK_PATIENTS.map(p => addDoc(collection(db, 'users', user.uid, 'patients'), p));
      await Promise.all(promises);
      
      const q = query(collection(db, 'users', user.uid, 'patients'));
      const snapshot = await getDocs(q);
      setPatients(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      toast.success('Sample data generated successfully');
    } catch (error) {
      console.error("Error generating sample data:", error);
      toast.error('Failed to generate sample data');
    } finally {
      setIsLoading(false);
    }
  };

  const filteredPatients = patients.filter(p => {
    const matchesSearch = p.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.id?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesTab = activeTab === 'All' || p.status === activeTab;
    return matchesSearch && matchesTab;
  });

  const handleMarkRecovered = async (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    if (!user?.uid) return;
    try {
      const patientRef = doc(db, 'users', user.uid, 'patients', id);
      await updateDoc(patientRef, { recoveryStatus: 'Recovered', balance: 0 });
      setPatients(patients.map(p => p.id === id ? { ...p, recoveryStatus: 'Recovered', balance: 0 } : p));
      toast.success('Patient marked as recovered');
    } catch (error) {
      console.error("Error updating patient:", error);
      toast.error('Failed to update patient');
    }
  };

  const handleScoreRisk = async () => {
    if (!selectedPatient) return;
    setIsScoring(true);
    setNoShowRisk(null);
    try {
      const result = await scoreNoShowRisk({
        appointmentType: selectedPatient.appointmentType,
        lastVisit: selectedPatient.lastVisit,
        outstandingBalance:
          typeof selectedPatient.balance === 'number' ? selectedPatient.balance : undefined,
        isNewPatient: selectedPatient.status === 'New'
      });
      setNoShowRisk(result);
    } catch (error: any) {
      toast.error(error?.message || 'Could not score this patient.');
    } finally {
      setIsScoring(false);
    }
  };

  const handleMessage = (e: React.MouseEvent, patient: any) => {
    e.stopPropagation();
    setSelectedPatient(patient);
    setIsMessageModalOpen(true);
  };

  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto">
      <header className="mb-10">
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
          <div className="space-y-2">
            <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight font-headline">Patient Directory</h1>
            <p className="text-slate-500 max-w-2xl text-base font-medium leading-relaxed">Manage patient records and recovery status.</p>
          </div>
          <div className="flex items-center gap-3 shrink-0">
            <button 
              onClick={() => setIsAddModalOpen(true)}
              className="px-5 py-2.5 bg-teal-600 text-white rounded-xl text-sm font-bold shadow-lg shadow-teal-500/20 hover:bg-teal-700 transition-all active:scale-95"
            >
              Add Patient
            </button>
          </div>
        </div>
      </header>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {[
          { label: 'Total Patients', value: patients.length.toString(), icon: Users, color: 'text-blue-600', bg: 'bg-blue-50' },
          { label: 'Active Recovery', value: patients.filter(p => p.recoveryStatus === 'In Progress').length.toString(), icon: Clock, color: 'text-amber-600', bg: 'bg-amber-50' },
          { label: 'Fully Recovered', value: patients.filter(p => p.recoveryStatus === 'Recovered').length.toString(), icon: CheckCircle2, color: 'text-teal-600', bg: 'bg-teal-50' },
          { label: 'High Risk', value: patients.filter(p => p.riskScore === 'High').length.toString(), icon: AlertCircle, color: 'text-red-600', bg: 'bg-red-50' },
        ].map((stat, i) => (
          <div key={i} className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm hover:shadow-md transition-all group flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className={`p-3 rounded-2xl ${stat.bg}`}>
                  <stat.icon className={`w-6 h-6 ${stat.color}`} />
                </div>
              </div>
              <div className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-1">{stat.label}</div>
              <div className="text-3xl font-extrabold text-slate-900 tracking-tight">{stat.value}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Search Bar */}
      <div className="relative mb-8">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
        <input 
          type="text" 
          placeholder="Search by name, email, or ID..." 
          className="w-full pl-12 pr-4 py-4 bg-white border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all font-medium shadow-sm outline-none"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {/* Patients Table */}
      <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          {isLoading ? (
            <div className="p-12 text-center text-slate-500">Loading patients...</div>
          ) : patients.length === 0 ? (
            <div className="p-12 text-center">
              <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="w-8 h-8 text-slate-400" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">No patients found</h3>
              <p className="text-slate-500 mb-6">Get started by adding patients or generating sample data.</p>
              <div className="flex justify-center gap-4">
                <button 
                  onClick={() => setIsAddModalOpen(true)}
                  className="px-6 py-2.5 bg-teal-600 text-white rounded-xl text-sm font-bold shadow-lg shadow-teal-500/20 hover:bg-teal-700 transition-all"
                >
                  Add Patient
                </button>
                <button 
                  onClick={handleGenerateSampleData}
                  className="px-6 py-2.5 bg-white border border-slate-200 text-slate-700 rounded-xl text-sm font-bold hover:bg-slate-50 transition-all"
                >
                  Generate Sample Data
                </button>
              </div>
            </div>
          ) : (
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/50 border-b border-slate-100">
                <th className="px-8 py-5 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Patient</th>
                <th className="px-6 py-5 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Status</th>
                <th className="px-6 py-5 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Recovery</th>
                <th className="px-6 py-5 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Balance</th>
                <th className="px-6 py-5 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Risk Score</th>
                <th className="px-8 py-5 text-[10px] font-bold text-slate-400 uppercase tracking-widest text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filteredPatients.map((patient) => (
                <tr key={patient.id} onClick={() => { setSelectedPatient(patient); setNoShowRisk(null); }} className="hover:bg-slate-50/50 transition-colors group cursor-pointer">
                  <td className="px-8 py-5">
                    <div className="flex items-center gap-4">
                      <Avatar name={patient.name} className="w-12 h-12 border-2 border-slate-100 shadow-sm" textClassName="text-sm" />
                      <div>
                        <div className="text-sm font-bold text-slate-900">{patient.name}</div>
                        <div className="text-[11px] font-medium text-slate-500 mt-0.5">{patient.id?.substring(0, 8)} • {patient.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-5">
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest ${
                      patient.status === 'Active' ? 'bg-teal-50 text-teal-700' : 'bg-slate-100 text-slate-500'
                    }`}>
                      {patient.status}
                    </span>
                  </td>
                  <td className="px-6 py-5">
                    <div className="flex items-center gap-2">
                      <div className={`w-2 h-2 rounded-full ${
                        patient.recoveryStatus === 'Recovered' ? 'bg-teal-500' : 
                        patient.recoveryStatus === 'In Progress' ? 'bg-amber-500' : 'bg-slate-300'
                      }`} />
                      <span className="text-sm font-bold text-slate-700">{patient.recoveryStatus}</span>
                    </div>
                  </td>
                  <td className="px-6 py-5">
                    <div className="text-sm font-extrabold text-slate-900">${typeof patient.balance === 'number' ? patient.balance.toFixed(2) : patient.balance}</div>
                    <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Last Visit: {patient.lastVisit}</div>
                  </td>
                  <td className="px-6 py-5">
                    <span className={`text-xs font-bold px-3 py-1 rounded-full ${
                      patient.riskScore === 'High' ? 'bg-red-50 text-red-700' :
                      patient.riskScore === 'Medium' ? 'bg-amber-50 text-amber-700' : 'bg-teal-50 text-teal-700'
                    }`}>
                      {patient.riskScore}
                    </span>
                  </td>
                  <td className="px-8 py-5 text-right">
                    <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button 
                        onClick={(e) => handleMessage(e, patient)}
                        className="p-2 text-slate-400 hover:text-teal-600 hover:bg-teal-50 rounded-lg transition-colors"
                      >
                        <Mail className="w-4 h-4" />
                      </button>
                      {patient.recoveryStatus !== 'Recovered' && (
                        <button 
                          onClick={(e) => handleMarkRecovered(e, patient.id)}
                          className="p-2 text-slate-400 hover:text-teal-600 hover:bg-teal-50 rounded-lg transition-colors"
                          title="Mark as Recovered"
                        >
                          <CheckCircle2 className="w-4 h-4" />
                        </button>
                      )}
                      <button className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors">
                        <MoreHorizontal className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          )}
        </div>
      </div>

      {/* Patient Details Modal */}
      {selectedPatient && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-[2.5rem] w-full max-w-3xl max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="sticky top-0 bg-white/80 backdrop-blur-md border-b border-slate-100 p-6 flex items-center justify-between z-10">
              <div className="flex items-center gap-4">
                <Avatar name={selectedPatient.name} className="w-16 h-16 border-4 border-white shadow-md" textClassName="text-lg" />
                <div>
                  <h2 className="text-2xl font-bold text-slate-900 font-headline">{selectedPatient.name}</h2>
                  <div className="text-sm font-medium text-slate-500">{selectedPatient.id} • {selectedPatient.email}</div>
                </div>
              </div>
              <button 
                onClick={() => { setSelectedPatient(null); setNoShowRisk(null); }}
                className="p-2 text-slate-400 hover:bg-slate-100 rounded-full transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <div className="p-8">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="bg-slate-50 p-6 rounded-3xl border border-slate-100">
                  <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Outstanding Balance</div>
                  <div className="text-3xl font-extrabold text-slate-900">${typeof selectedPatient.balance === 'number' ? selectedPatient.balance.toFixed(2) : selectedPatient.balance}</div>
                </div>
                <div className="bg-slate-50 p-6 rounded-3xl border border-slate-100">
                  <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Recovery Status</div>
                  <div className="text-xl font-bold text-slate-700">{selectedPatient.recoveryStatus}</div>
                </div>
                <div className="bg-slate-50 p-6 rounded-3xl border border-slate-100">
                  <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Risk Score</div>
                  <div className={`text-xl font-bold ${
                    selectedPatient.riskScore === 'High' ? 'text-red-600' :
                    selectedPatient.riskScore === 'Medium' ? 'text-amber-600' : 'text-teal-600'
                  }`}>{selectedPatient.riskScore}</div>
                </div>
              </div>

              <div className="flex items-center justify-between mb-4 gap-3 flex-wrap">
                <h3 className="text-lg font-bold text-slate-900 font-headline flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-teal-600" />
                  No-Show Risk
                </h3>
                <button
                  onClick={handleScoreRisk}
                  disabled={isScoring}
                  className="px-4 py-2 bg-teal-600 text-white rounded-xl font-bold text-xs hover:bg-teal-700 transition-all disabled:opacity-60 flex items-center gap-2"
                >
                  {isScoring ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Sparkles className="w-3.5 h-3.5" />}
                  {isScoring ? 'Scoring…' : noShowRisk ? 'Re-score' : 'Score patient'}
                </button>
              </div>

              {!noShowRisk && !isScoring && (
                <p className="text-xs text-slate-500 leading-relaxed">
                  Estimate the likelihood this patient misses their next appointment, based on the
                  history recorded here.
                </p>
              )}

              {noShowRisk && (
                <div className="space-y-4">
                  <div className="flex items-center gap-6 p-5 bg-slate-50 rounded-2xl border border-slate-100">
                    <div>
                      <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Risk</div>
                      <div className={`text-3xl font-extrabold ${
                        noShowRisk.riskBand === 'High' ? 'text-red-600' :
                        noShowRisk.riskBand === 'Medium' ? 'text-amber-600' : 'text-teal-600'
                      }`}>
                        {Math.round(noShowRisk.riskScore * 100)}%
                      </div>
                    </div>
                    <div className="flex-1">
                      <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Band</div>
                      <div className="text-lg font-bold text-slate-900">{noShowRisk.riskBand}</div>
                      <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-2">
                        Confidence: {noShowRisk.confidence}
                      </div>
                    </div>
                  </div>

                  {noShowRisk.drivingFactors?.length > 0 && (
                    <div>
                      <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">What drove this</div>
                      <ul className="list-disc pl-5 space-y-1">
                        {noShowRisk.drivingFactors.map((factor, i) => (
                          <li key={i} className="text-xs text-slate-600 leading-relaxed">{factor}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  <div>
                    <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">Recommended action</div>
                    <p className="text-sm text-slate-700 leading-relaxed">{noShowRisk.recommendedIntervention}</p>
                  </div>

                  <p className="text-[10px] text-slate-400 leading-relaxed">
                    AI-generated estimate. Confidence is low when little patient history is on file.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Add Patient Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-[2.5rem] w-full max-w-md p-8 shadow-2xl">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-slate-900 font-headline">Add Patient</h2>
              <button 
                onClick={() => setIsAddModalOpen(false)}
                className="p-2 text-slate-400 hover:bg-slate-100 rounded-full transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            <p className="text-slate-500 mb-6">In a real application, this would connect to your PMS or allow manual entry.</p>
            <button 
              onClick={() => setIsAddModalOpen(false)}
              className="w-full py-3 bg-slate-100 text-slate-700 rounded-xl font-bold hover:bg-slate-200 transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* Message Modal */}
      {isMessageModalOpen && selectedPatient && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-[2.5rem] w-full max-w-lg p-8 shadow-2xl">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-slate-900 font-headline">Message {selectedPatient.name}</h2>
              <button 
                onClick={() => setIsMessageModalOpen(false)}
                className="p-2 text-slate-400 hover:bg-slate-100 rounded-full transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Template</label>
                <select className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 font-medium text-sm">
                  <option>Payment Reminder - Friendly</option>
                  <option>Payment Reminder - Urgent</option>
                  <option>Insurance Information Request</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Message</label>
                <textarea 
                  rows={4}
                  className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 font-medium text-sm resize-none"
                  defaultValue={`Hi ${selectedPatient.name.split(' ')[0]},\n\nWe noticed you have an outstanding balance of $${typeof selectedPatient.balance === 'number' ? selectedPatient.balance.toFixed(2) : selectedPatient.balance}. Please log in to your portal to review and pay.`}
                />
              </div>
              <button 
                onClick={() => {
                  toast.success('Message sent!');
                  setIsMessageModalOpen(false);
                }}
                className="w-full py-3 bg-teal-600 text-white rounded-xl font-bold shadow-lg shadow-teal-500/20 hover:bg-teal-700 transition-all"
              >
                Send Message
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
