'use client';

import React, { useState, useMemo, useEffect } from 'react';
import { toast } from 'sonner';
import Link from 'next/link';
import { 
  Activity, Users, Calendar, Clock, 
  MapPin, Phone, Mail, Globe,
  Star, ShieldCheck, TrendingUp, ArrowUpRight,
  Building2, Stethoscope, FileText, CheckCircle2, AlertCircle, MoreHorizontal, Database, Search, X, Megaphone, Map
} from 'lucide-react';
import { useAuth } from '@/components/AuthProvider';
import { db } from '@/firebase';
import { collection, getDocs, addDoc, query, orderBy } from 'firebase/firestore';
import { useScrollLock } from '@/hooks/use-scroll-lock';

const MOCK_CLINICS = [
  { 
    name: 'Downtown Medical Center', 
    location: 'New York, NY', 
    patients: 1240, 
    rating: 4.8, 
    status: 'Active',
    recoveryRate: '82%',
    aiAdoption: 'High',
    lastSync: '10 mins ago',
    type: 'Multi-Specialty'
  },
  { 
    name: 'Westside Health Clinic', 
    location: 'Los Angeles, CA', 
    patients: 850, 
    rating: 4.6, 
    status: 'Active',
    recoveryRate: '76%',
    aiAdoption: 'Medium',
    lastSync: '1 hour ago',
    type: 'Primary Care'
  },
  { 
    name: 'Northshore Dental', 
    location: 'Chicago, IL', 
    patients: 2100, 
    rating: 4.9, 
    status: 'Active',
    recoveryRate: '89%',
    aiAdoption: 'High',
    lastSync: '5 mins ago',
    type: 'Dental'
  },
  { 
    name: 'Eastview Family Practice', 
    location: 'Houston, TX', 
    patients: 450, 
    rating: 4.5, 
    status: 'Warning',
    recoveryRate: '62%',
    aiAdoption: 'Low',
    lastSync: '2 days ago',
    type: 'Family Medicine'
  },
];

export default function ClinicInsightsPage() {
  const { user } = useAuth();
  const [clinics, setClinics] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedClinic, setSelectedClinic] = useState<any | null>(null);
  const [isAddClinicModalOpen, setIsAddClinicModalOpen] = useState(false);
  const [viewMode, setViewMode] = useState<'list' | 'map'>('list');
  const [activeFilter, setActiveFilter] = useState<string | null>(null);

  const [newClinicName, setNewClinicName] = useState('');
  const [newClinicLocation, setNewClinicLocation] = useState('');
  const [newClinicType, setNewClinicType] = useState('Primary Care');

  useScrollLock(Boolean(selectedClinic) || isAddClinicModalOpen);

  useEffect(() => {
    const fetchClinics = async () => {
      if (!user?.uid) {
        setIsLoading(false);
        return;
      }
      setIsLoading(true);
      try {
        const q = query(collection(db, 'users', user.uid, 'clinics'));
        const snapshot = await getDocs(q);
        const fetchedClinics = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setClinics(fetchedClinics);
      } catch (error) {
        console.error("Error fetching clinics:", error);
        toast.error('Failed to fetch clinics');
      } finally {
        setIsLoading(false);
      }
    };
    fetchClinics();
  }, [user]);

  const handleAddClinic = async () => {
    if (!newClinicName || !newClinicLocation || !user?.uid) return;
    
    const newClinic = {
      name: newClinicName,
      location: newClinicLocation,
      patients: 0,
      rating: 0,
      status: 'Active',
      recoveryRate: '0%',
      aiAdoption: 'Low',
      lastSync: 'Just now',
      type: newClinicType
    };
    
    try {
      const docRef = await addDoc(collection(db, 'users', user.uid, 'clinics'), newClinic);
      setClinics([...clinics, { id: docRef.id, ...newClinic }]);
      setIsAddClinicModalOpen(false);
      setNewClinicName('');
      setNewClinicLocation('');
      setNewClinicType('Primary Care');
      toast.success('Clinic added successfully');
    } catch (error) {
      console.error("Error adding clinic:", error);
      toast.error('Failed to add clinic');
    }
  };

  const handleGenerateSampleData = async () => {
    if (!user?.uid) return;
    setIsLoading(true);
    try {
      const promises = MOCK_CLINICS.map(c => addDoc(collection(db, 'users', user.uid, 'clinics'), c));
      await Promise.all(promises);
      
      const q = query(collection(db, 'users', user.uid, 'clinics'));
      const snapshot = await getDocs(q);
      setClinics(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      toast.success('Sample data generated successfully');
    } catch (error) {
      console.error("Error generating sample data:", error);
      toast.error('Failed to generate sample data');
    } finally {
      setIsLoading(false);
    }
  };

  const filteredClinics = useMemo(() => {
    return clinics.filter(c => {
      const matchesSearch = c.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            c.location?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            c.id?.toLowerCase().includes(searchQuery.toLowerCase());
      
      if (!matchesSearch) return false;

      if (activeFilter === 'recovery') {
        return parseInt(c.recoveryRate || '0') >= 80;
      }
      if (activeFilter === 'adoption') {
        return c.aiAdoption === 'High';
      }
      return true;
    });
  }, [clinics, searchQuery, activeFilter]);

  const totalPatients = clinics.reduce((sum, c) => sum + (c.patients || 0), 0);
  const avgRecoveryRate = clinics.length > 0 
    ? (clinics.reduce((sum, c) => sum + parseInt(c.recoveryRate || '0'), 0) / clinics.length).toFixed(1) + '%'
    : '0%';

  return (
    <div className="p-6 md:p-10 max-w-[1600px] mx-auto">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 font-headline">Clinic Insights</h1>
          <p className="text-slate-500 font-medium mt-1">Performance metrics and operational data for your clinical network.</p>
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={() => setViewMode(viewMode === 'list' ? 'map' : 'list')}
            className="px-4 py-2 bg-white border border-slate-200 text-slate-700 rounded-xl text-sm font-bold hover:bg-slate-50 transition-all shadow-sm flex items-center gap-2"
          >
            {viewMode === 'list' ? <Globe className="w-4 h-4" /> : <Building2 className="w-4 h-4" />}
            {viewMode === 'list' ? 'Network Map' : 'List View'}
          </button>
          <button 
            onClick={() => setIsAddClinicModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2 bg-teal-600 text-white rounded-xl hover:bg-teal-700 transition-all font-bold text-sm shadow-lg shadow-teal-900/20"
          >
            <Building2 className="w-4 h-4" />
            Add Clinic
          </button>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Main Content */}
        <div className="flex-1 min-w-0">
          {/* Network Overview */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {[
              { label: 'Total Clinics', value: clinics.length.toString(), icon: Building2, color: 'text-blue-600', bg: 'bg-blue-50', trend: '+2 this quarter', filter: null },
              { label: 'Active Patients', value: totalPatients.toLocaleString(), icon: Users, color: 'text-teal-600', bg: 'bg-teal-50', trend: '+15% vs last month', filter: null },
              { label: 'Avg. Recovery Rate', value: avgRecoveryRate, icon: TrendingUp, color: 'text-amber-600', bg: 'bg-amber-50', trend: 'Across your clinics', filter: 'recovery' },
              { label: 'Clinics Tracked', value: clinics.length.toString(), icon: Activity, color: 'text-purple-600', bg: 'bg-purple-50', trend: 'In your network', filter: 'adoption' },
            ].map((stat, i) => (
              <div 
                key={i} 
                onClick={() => stat.filter && setActiveFilter(activeFilter === stat.filter ? null : stat.filter)}
                className={`bg-white p-6 rounded-[1.5rem] border ${activeFilter === stat.filter ? 'border-teal-500 ring-2 ring-teal-500/20' : 'border-slate-100'} shadow-sm hover:shadow-md transition-all flex flex-col justify-between ${stat.filter ? 'cursor-pointer' : ''}`}
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className={`w-10 h-10 rounded-xl ${stat.bg} ${stat.color} flex items-center justify-center`}>
                      <stat.icon className="w-5 h-5" />
                    </div>
                  </div>
                  <h3 className="text-slate-500 text-xs font-bold">{stat.label}</h3>
                  <div className="flex items-end gap-2 mt-1">
                    <p className="text-2xl font-extrabold text-slate-900 tracking-tight">{stat.value}</p>
                  </div>
                </div>
                <p className="text-[10px] font-medium text-slate-400 mt-3 flex items-center gap-1">
                  <ArrowUpRight className="w-3 h-3" /> {stat.trend}
                </p>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Clinic List */}
            <div className="lg:col-span-2 space-y-6">
              <div className="flex items-center justify-between mb-2">
                <h2 className="text-xl font-bold text-slate-900 font-headline">
                  {viewMode === 'list' ? 'Network Directory' : 'Network Map'}
                </h2>
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input 
                      type="text" 
                      placeholder="Search clinics..." 
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 w-full sm:w-64 transition-all"
                    />
                  </div>
                  {activeFilter && (
                    <button 
                      onClick={() => setActiveFilter(null)}
                      className="text-xs font-bold text-teal-600 bg-teal-50 px-3 py-2 rounded-xl flex items-center gap-1"
                    >
                      Clear Filter <X className="w-3 h-3" />
                    </button>
                  )}
                </div>
              </div>
              
              {viewMode === 'map' ? (
                <div className="bg-slate-100 rounded-[2rem] h-[600px] border border-slate-200 flex items-center justify-center flex-col text-slate-400">
                  <Map className="w-16 h-16 mb-4 text-slate-300" />
                  <p className="font-medium">Interactive Map View</p>
                  <p className="text-sm">Connect a map provider (e.g. Mapbox/Google Maps) to visualize locations.</p>
                </div>
              ) : isLoading ? (
                <div className="p-12 text-center text-slate-500">Loading clinics...</div>
              ) : clinics.length === 0 ? (
                <div className="p-12 text-center bg-white rounded-[2rem] border border-slate-100 shadow-sm">
                  <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Building2 className="w-8 h-8 text-slate-400" />
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 mb-2">No clinics found</h3>
                  <p className="text-slate-500 mb-6">Start by adding a clinic or generating sample data.</p>
                  <div className="flex justify-center gap-4">
                    <button 
                      onClick={() => setIsAddClinicModalOpen(true)}
                      className="px-6 py-2.5 bg-teal-600 text-white rounded-xl text-sm font-bold shadow-lg shadow-teal-500/20 hover:bg-teal-700 transition-all"
                    >
                      Add Clinic
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
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {filteredClinics.map((clinic, i) => (
              <div key={i} className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm hover:shadow-md transition-all group relative overflow-hidden cursor-pointer" onClick={() => setSelectedClinic(clinic)}>
                {clinic.status === 'Warning' && (
                  <div className="absolute top-0 left-0 w-full h-1 bg-amber-400" />
                )}
                <div className="flex items-start justify-between mb-6">
                  <div className="flex items-center gap-4">
                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-bold text-xl transition-all ${
                      clinic.status === 'Warning' ? 'bg-amber-50 text-amber-600' : 'bg-teal-50 text-teal-600 group-hover:bg-teal-100'
                    }`}>
                      {clinic.name?.charAt(0)}
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-900 group-hover:text-teal-600 transition-all">{clinic.name}</h3>
                      <p className="text-xs text-slate-500 flex items-center gap-1 mt-0.5 font-medium">
                        <MapPin className="w-3 h-3" />
                        {clinic.location}
                      </p>
                    </div>
                  </div>
                  <button 
                    onClick={(e) => { e.stopPropagation(); setSelectedClinic(clinic); }}
                    className="text-slate-300 hover:text-slate-600 transition-colors"
                  >
                    <MoreHorizontal className="w-5 h-5" />
                  </button>
                </div>
                
                <div className="grid grid-cols-2 gap-4 py-4 border-y border-slate-50 mb-4">
                  <div>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Recovery Rate</p>
                    <div className="flex items-center gap-1.5">
                      <p className={`text-lg font-extrabold ${clinic.status === 'Warning' ? 'text-amber-600' : 'text-teal-600'}`}>
                        {clinic.recoveryRate}
                      </p>
                      {clinic.status !== 'Warning' && <ArrowUpRight className="w-4 h-4 text-teal-600" />}
                    </div>
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">AI Adoption</p>
                    <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider ${
                      clinic.aiAdoption === 'High' ? 'bg-teal-50 text-teal-700' :
                      clinic.aiAdoption === 'Medium' ? 'bg-blue-50 text-blue-700' : 'bg-slate-100 text-slate-600'
                    }`}>
                      {clinic.aiAdoption}
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2 text-slate-500 font-medium">
                    <Stethoscope className="w-4 h-4" />
                    {clinic.type}
                  </div>
                  <div className="flex items-center gap-1 text-slate-400 font-medium">
                    <Clock className="w-3 h-3" />
                    Sync: {clinic.lastSync}
                  </div>
                </div>

                <div className="mt-6 flex items-center gap-2">
                  <Link href={`/dashboard/clinic/${clinic.id}`} className="flex-1 py-2.5 bg-slate-50 hover:bg-slate-100 rounded-xl text-xs font-bold text-slate-700 transition-all border border-slate-200 text-center" onClick={(e) => e.stopPropagation()}>
                    View Dashboard
                  </Link>
                  <Link href={`/dashboard/clinic/${clinic.id}/settings`} className="px-4 py-2.5 bg-white border border-slate-200 hover:bg-slate-50 rounded-xl text-xs font-bold text-slate-600 transition-all shadow-sm text-center" onClick={(e) => e.stopPropagation()}>
                    Settings
                  </Link>
                </div>
              </div>
              ))}
            </div>
            )}
            </div>

            {/* Network Health Sidebar */}
            <div className="space-y-6">
              <div className="bg-slate-900 p-8 rounded-[2.5rem] text-white shadow-xl relative overflow-hidden">
                <div className="absolute top-0 right-0 p-6 opacity-10">
                  <Activity className="w-32 h-32 -mr-8 -mt-8" />
                </div>
                <div className="relative z-10">
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-white/10 rounded-full text-xs font-bold mb-6">
                    <span className="w-2 h-2 rounded-full bg-teal-400 animate-pulse" />
                    Network Health
                  </div>
                  <h3 className="text-2xl font-extrabold mb-2">Network Overview</h3>
                  <p className="text-sm text-slate-400 font-medium mb-8">Practice management system integrations are not connected yet. Clinics and claims you add here are stored against your account only.</p>
                  
                  <div className="space-y-4">
                    {[
                      { name: 'API Gateway', status: 'Operational', icon: Globe },
                      { name: 'AI Negotiation Engine', status: 'Operational', icon: Activity },
                      { name: 'Epic Integration', status: 'Operational', icon: Database },
                      { name: 'Cerner Integration', status: 'Degraded', icon: AlertCircle, warning: true },
                    ].map((service, i) => (
                      <div key={i} className="flex items-center justify-between p-3 bg-white/5 rounded-xl border border-white/10">
                        <div className="flex items-center gap-3">
                          <service.icon className={`w-4 h-4 ${service.warning ? 'text-amber-400' : 'text-teal-400'}`} />
                          <span className="text-sm font-bold">{service.name}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          {service.warning && (
                            <button className="text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-md bg-white/10 text-white hover:bg-white/20 transition-colors">
                              Not connected
                            </button>
                          )}
                          <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-md ${
                            service.warning ? 'bg-amber-500/20 text-amber-300' : 'bg-teal-500/20 text-teal-300'
                          }`}>
                            {service.status}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm">
                <h3 className="text-lg font-bold text-slate-900 font-headline mb-6 flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5 text-teal-600" />
                  Compliance Status
                </h3>
                <div className="space-y-6">
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-bold text-slate-700">HIPAA Training</span>
                      <span className="text-sm font-bold text-teal-600">100%</span>
                    </div>
                    <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                      <div className="bg-teal-500 h-full w-full" />
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-bold text-slate-700">Security Audits</span>
                      <span className="text-sm font-bold text-amber-600">Pending (2)</span>
                    </div>
                    <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                      <div className="bg-amber-500 h-full w-[80%]" />
                    </div>
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mt-2">Eastview & Westside due this month</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Add Clinic Modal */}
      {isAddClinicModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
          <div className="bg-white rounded-[2rem] shadow-2xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center">
              <h2 className="text-xl font-extrabold text-slate-900">Add New Clinic</h2>
              <button 
                onClick={() => setIsAddClinicModalOpen(false)}
                className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1">Clinic Name</label>
                <input 
                  type="text" 
                  value={newClinicName}
                  onChange={(e) => setNewClinicName(e.target.value)}
                  className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500" 
                  placeholder="e.g. Memorial Hospital" 
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1">Location</label>
                <input 
                  type="text" 
                  value={newClinicLocation}
                  onChange={(e) => setNewClinicLocation(e.target.value)}
                  className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500" 
                  placeholder="e.g. Seattle, WA" 
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1">Clinic Type</label>
                <select 
                  value={newClinicType}
                  onChange={(e) => setNewClinicType(e.target.value)}
                  className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500"
                >
                  <option value="Primary Care">Primary Care</option>
                  <option value="Dental">Dental</option>
                  <option value="Multi-Specialty">Multi-Specialty</option>
                  <option value="Family Medicine">Family Medicine</option>
                </select>
              </div>
              <button 
                onClick={handleAddClinic}
                disabled={!newClinicName || !newClinicLocation}
                className="w-full py-3 bg-teal-600 text-white rounded-xl font-bold hover:bg-teal-700 transition-colors mt-4 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Add Clinic
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Clinic Details Modal */}
      {selectedClinic && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
          <div className="bg-white rounded-[2rem] shadow-2xl w-full max-w-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="p-6 border-b border-slate-100 flex justify-between items-start bg-slate-50/50">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-teal-100 text-teal-700 flex items-center justify-center shrink-0">
                  <Building2 className="w-6 h-6" />
                </div>
                <div>
                  <h2 className="text-xl font-extrabold text-slate-900">{selectedClinic.name}</h2>
                  <p className="text-sm text-slate-500 font-medium flex items-center gap-2">
                    {selectedClinic.id} • <MapPin className="w-3 h-3" /> {selectedClinic.location}
                  </p>
                </div>
              </div>
              <button 
                onClick={() => setSelectedClinic(null)}
                className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-6">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Status</p>
                  <p className={`text-sm font-bold ${selectedClinic.status === 'Active' ? 'text-teal-600' : 'text-amber-600'}`}>
                    {selectedClinic.status}
                  </p>
                </div>
                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Patients</p>
                  <p className="text-sm font-bold text-slate-900">{selectedClinic.patients?.toLocaleString()}</p>
                </div>
                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Recovery Rate</p>
                  <p className="text-sm font-bold text-slate-900">{selectedClinic.recoveryRate}</p>
                </div>
                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">AI Adoption</p>
                  <p className="text-sm font-bold text-slate-900">{selectedClinic.aiAdoption}</p>
                </div>
              </div>

              <div className="space-y-6">
                <div>
                  <h3 className="text-sm font-bold text-slate-900 mb-3">Integration Status</h3>
                  <div className="flex items-center justify-between p-4 bg-teal-50/50 border border-teal-100 rounded-xl">
                    <div className="flex items-center gap-3">
                      <Database className="w-5 h-5 text-teal-600" />
                      <div>
                        <p className="text-sm font-bold text-slate-900">EHR Sync Active</p>
                        <p className="text-xs text-slate-500">Last synced: {selectedClinic.lastSync}</p>
                      </div>
                    </div>
                    <span className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-widest text-teal-700 bg-teal-100 px-2 py-1 rounded-md">
                      <CheckCircle2 className="w-3 h-3" /> Connected
                    </span>
                  </div>
                </div>
                
                <div className="flex gap-3 pt-4 border-t border-slate-100">
                  <Link href={`/dashboard/clinic/${selectedClinic.id}`} className="flex-1 bg-teal-600 text-white py-2.5 rounded-xl font-bold text-sm hover:bg-teal-700 transition-all shadow-md shadow-teal-500/20 text-center">
                    View Full Analytics
                  </Link>
                  <Link href={`/dashboard/clinic/${selectedClinic.id}/settings`} className="flex-1 bg-slate-100 text-slate-700 py-2.5 rounded-xl font-bold text-sm hover:bg-slate-200 transition-all text-center">
                    Manage Settings
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
