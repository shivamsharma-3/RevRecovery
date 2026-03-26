'use client';

import React, { useState } from 'react';
import { 
  Search, Filter, Download, Plus, 
  CheckCircle2, AlertCircle, Clock, ArrowUpRight,
  MoreHorizontal, FileText, Activity, Users, Database, ArrowRight
} from 'lucide-react';

export default function ClaimsRecoveryPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All Statuses');

  const claims = [
    { id: 'CLM-7829', patient: 'Sarah Johnson', date: '2024-03-20', amount: '$1,240.00', status: 'Recovered', insurance: 'Blue Cross', type: 'Outpatient' },
    { id: 'CLM-7830', patient: 'Michael Chen', date: '2024-03-21', amount: '$850.00', status: 'Pending', insurance: 'Aetna', type: 'Dental' },
    { id: 'CLM-7831', patient: 'Emma Wilson', date: '2024-03-22', amount: '$2,100.00', status: 'In Review', insurance: 'UnitedHealth', type: 'Inpatient' },
    { id: 'CLM-7832', patient: 'James Miller', date: '2024-03-22', amount: '$450.00', status: 'Recovered', insurance: 'Cigna', type: 'Specialist' },
    { id: 'CLM-7833', patient: 'Olivia Davis', date: '2024-03-23', amount: '$3,200.00', status: 'Denied', insurance: 'Medicare', type: 'Surgery' },
    { id: 'CLM-7834', patient: 'William Taylor', date: '2024-03-24', amount: '$150.00', status: 'Recovered', insurance: 'Humana', type: 'Primary Care' },
    { id: 'CLM-7835', patient: 'Sophia Martinez', date: '2024-03-24', amount: '$980.00', status: 'Pending', insurance: 'Blue Shield', type: 'Imaging' },
    { id: 'CLM-7836', patient: 'Alexander White', date: '2024-03-25', amount: '$4,500.00', status: 'In Review', insurance: 'Aetna', type: 'Inpatient' },
  ];

  const filteredClaims = claims.filter(claim => {
    const matchesSearch = claim.patient.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          claim.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          claim.insurance.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'All Statuses' || claim.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="p-6 md:p-10 max-w-[1600px] mx-auto">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 font-headline">Claims Recovery</h1>
          <p className="text-slate-500 font-medium mt-1">Monitor and manage your insurance claim recovery process.</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="px-4 py-2 bg-white border border-slate-200 text-slate-700 rounded-xl text-sm font-bold hover:bg-slate-50 transition-all shadow-sm flex items-center gap-2">
            <Download className="w-4 h-4" />
            Export CSV
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-teal-600 text-white rounded-xl hover:bg-teal-700 transition-all font-bold text-sm shadow-lg shadow-teal-900/20">
            <Plus className="w-4 h-4" />
            New Claim
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        {[
          { label: 'Total Claims', value: '1,284', change: '+12%', icon: FileText, color: 'text-blue-600', bg: 'bg-blue-50' },
          { label: 'Recovered', value: '$428.5k', change: '+8%', icon: CheckCircle2, color: 'text-teal-600', bg: 'bg-teal-50' },
          { label: 'Pending', value: '$84.2k', change: '-3%', icon: Clock, color: 'text-amber-600', bg: 'bg-amber-50' },
          { label: 'Denied', value: '$12.4k', change: '+2%', icon: AlertCircle, color: 'text-red-600', bg: 'bg-red-50' },
        ].map((stat, i) => (
          <div key={i} className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm hover:shadow-md transition-all flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className={`w-12 h-12 rounded-2xl ${stat.bg} ${stat.color} flex items-center justify-center`}>
                  <stat.icon className="w-6 h-6" />
                </div>
                <span className={`text-[10px] font-bold uppercase tracking-widest px-2 py-1 rounded-lg ${
                  stat.change.startsWith('+') ? 'bg-teal-50 text-teal-600' : 'bg-red-50 text-red-600'
                }`}>
                  {stat.change}
                </span>
              </div>
              <h3 className="text-slate-500 text-sm font-bold">{stat.label}</h3>
              <div className="flex items-end gap-2 mt-1">
                <p className="text-3xl font-extrabold text-slate-900 tracking-tight">{stat.value}</p>
              </div>
            </div>
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
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-slate-50 border-transparent rounded-xl text-sm font-medium focus:bg-white focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all outline-none"
            />
          </div>
          <div className="flex items-center gap-3 w-full md:w-auto">
            <select 
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
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
          <table className="w-full text-left border-collapse">
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
              {filteredClaims.map((claim) => (
                <tr key={claim.id} className="hover:bg-slate-50/50 transition-colors group cursor-pointer">
                  <td className="p-4 pl-6">
                    <p className="text-sm font-bold text-teal-600 font-mono">{claim.id}</p>
                    <p className="text-xs text-slate-500 font-medium flex items-center gap-1 mt-0.5">
                      <Clock className="w-3 h-3" />
                      {claim.date}
                    </p>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 font-bold text-xs">
                        {claim.patient.charAt(0)}
                      </div>
                      <span className="text-sm font-bold text-slate-900">{claim.patient}</span>
                    </div>
                  </td>
                  <td className="p-4">
                    <p className="text-sm font-bold text-slate-700">{claim.insurance}</p>
                    <p className="text-xs font-medium text-slate-500 mt-0.5">{claim.type}</p>
                  </td>
                  <td className="p-4">
                    <span className="text-sm font-extrabold text-slate-900">{claim.amount}</span>
                  </td>
                  <td className="p-4">
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-bold ${
                      claim.status === 'Recovered' ? 'bg-teal-50 text-teal-700' :
                      claim.status === 'Pending' ? 'bg-amber-50 text-amber-700' :
                      claim.status === 'In Review' ? 'bg-blue-50 text-blue-700' :
                      'bg-red-50 text-red-700'
                    }`}>
                      {claim.status === 'Recovered' && <CheckCircle2 className="w-3 h-3" />}
                      {claim.status === 'Pending' && <Clock className="w-3 h-3" />}
                      {claim.status === 'In Review' && <Activity className="w-3 h-3" />}
                      {claim.status === 'Denied' && <AlertCircle className="w-3 h-3" />}
                      {claim.status}
                    </span>
                  </td>
                  <td className="p-4 pr-6 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button className="p-2 hover:bg-white rounded-xl text-slate-400 group-hover:text-teal-600 transition-all shadow-sm opacity-0 group-hover:opacity-100">
                        <ArrowRight className="w-4 h-4" />
                      </button>
                      <button className="p-2 hover:bg-slate-100 rounded-xl text-slate-400 transition-all">
                        <MoreHorizontal className="w-5 h-5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filteredClaims.length === 0 && (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-slate-500 font-medium">
                    No claims found matching your criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        <div className="p-4 border-t border-slate-100 bg-slate-50 flex items-center justify-between">
          <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Showing {filteredClaims.length} of 1,284 claims</p>
          <div className="flex items-center gap-2">
            <button className="px-4 py-2 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-50 transition-all shadow-sm disabled:opacity-50">
              Previous
            </button>
            <button className="px-4 py-2 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-50 transition-all shadow-sm">
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
