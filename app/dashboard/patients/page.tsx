'use client';

import React, { useState } from 'react';
import { 
  Users, Search, Filter, MoreHorizontal, 
  ChevronRight, ArrowUpRight, ArrowDownRight,
  Clock, CheckCircle2, AlertCircle, Mail, Phone
} from 'lucide-react';

const PATIENTS = [
  { 
    id: 'P001', 
    name: 'Sarah Johnson', 
    email: 'sarah.j@example.com',
    status: 'Active', 
    recoveryStatus: 'In Progress',
    balance: '$1,240.00',
    lastVisit: '2024-03-15',
    riskScore: 'Low',
    avatar: 'https://picsum.photos/seed/sarah/100/100'
  },
  { 
    id: 'P002', 
    name: 'Michael Chen', 
    email: 'm.chen@example.com',
    status: 'Active', 
    recoveryStatus: 'Recovered',
    balance: '$0.00',
    lastVisit: '2024-02-28',
    riskScore: 'Minimal',
    avatar: 'https://picsum.photos/seed/michael/100/100'
  },
  { 
    id: 'P003', 
    name: 'Emma Wilson', 
    email: 'emma.w@example.com',
    status: 'Inactive', 
    recoveryStatus: 'Pending',
    balance: '$3,450.00',
    lastVisit: '2023-11-12',
    riskScore: 'High',
    avatar: 'https://picsum.photos/seed/emma/100/100'
  },
  { 
    id: 'P004', 
    name: 'David Rodriguez', 
    email: 'd.rod@example.com',
    status: 'Active', 
    recoveryStatus: 'In Progress',
    balance: '$850.00',
    lastVisit: '2024-03-20',
    riskScore: 'Medium',
    avatar: 'https://picsum.photos/seed/david/100/100'
  },
  { 
    id: 'P005', 
    name: 'Lisa Brown', 
    email: 'lisa.b@example.com',
    status: 'Active', 
    recoveryStatus: 'Recovered',
    balance: '$0.00',
    lastVisit: '2024-03-05',
    riskScore: 'Minimal',
    avatar: 'https://picsum.photos/seed/lisa/100/100'
  },
];

export default function PatientsPage() {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredPatients = PATIENTS.filter(p => 
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.id.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto">
      <header className="mb-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 font-headline">Patient Directory</h1>
            <p className="text-slate-500 text-sm font-medium">Manage patient records and recovery status.</p>
          </div>
          <div className="flex items-center gap-3">
            <button className="px-4 py-2 bg-white border border-slate-200 rounded-xl text-sm font-bold text-slate-700 hover:bg-slate-50 transition-all flex items-center gap-2">
              <Filter className="w-4 h-4" />
              Filters
            </button>
            <button className="px-4 py-2 bg-teal-600 text-white rounded-xl text-sm font-bold shadow-lg shadow-teal-500/20 hover:bg-teal-700 transition-all">
              Add Patient
            </button>
          </div>
        </div>
      </header>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {[
          { label: 'Total Patients', value: '1,284', change: '+12%', icon: Users, color: 'text-blue-600', bg: 'bg-blue-50' },
          { label: 'Active Recovery', value: '156', change: '+5%', icon: Clock, color: 'text-amber-600', bg: 'bg-amber-50' },
          { label: 'Fully Recovered', value: '842', change: '+18%', icon: CheckCircle2, color: 'text-teal-600', bg: 'bg-teal-50' },
          { label: 'High Risk', value: '24', change: '-2%', icon: AlertCircle, color: 'text-red-600', bg: 'bg-red-50' },
        ].map((stat, i) => (
          <div key={i} className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm hover:shadow-md transition-all group flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className={`p-3 rounded-2xl ${stat.bg}`}>
                  <stat.icon className={`w-6 h-6 ${stat.color}`} />
                </div>
                <span className={`text-[10px] font-bold px-2 py-1 rounded-lg uppercase tracking-widest ${stat.change.startsWith('+') ? 'text-teal-600 bg-teal-50' : 'text-red-600 bg-red-50'}`}>
                  {stat.change}
                </span>
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
                <tr key={patient.id} className="hover:bg-slate-50/50 transition-colors group">
                  <td className="px-8 py-5">
                    <div className="flex items-center gap-4">
                      <img src={patient.avatar} alt="" className="w-12 h-12 rounded-full border-2 border-slate-100 shadow-sm" />
                      <div>
                        <div className="text-sm font-bold text-slate-900">{patient.name}</div>
                        <div className="text-[11px] font-medium text-slate-500 mt-0.5">{patient.id} • {patient.email}</div>
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
                    <div className="text-sm font-extrabold text-slate-900">{patient.balance}</div>
                    <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Last Visit: {patient.lastVisit}</div>
                  </td>
                  <td className="px-6 py-5">
                    <span className={`text-xs font-bold px-3 py-1 rounded-full ${
                      patient.riskScore === 'High' ? 'text-red-700 bg-red-50' : 
                      patient.riskScore === 'Medium' ? 'text-amber-700 bg-amber-50' : 'text-teal-700 bg-teal-50'
                    }`}>
                      {patient.riskScore}
                    </span>
                  </td>
                  <td className="px-8 py-5 text-right">
                    <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button className="p-2 text-slate-400 hover:text-teal-600 hover:bg-teal-50 rounded-xl transition-all">
                        <Mail className="w-4 h-4" />
                      </button>
                      <button className="p-2 text-slate-400 hover:text-teal-600 hover:bg-teal-50 rounded-xl transition-all">
                        <Phone className="w-4 h-4" />
                      </button>
                      <button className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-xl transition-all">
                        <MoreHorizontal className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="px-8 py-5 bg-slate-50/50 border-t border-slate-100 flex items-center justify-between">
          <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
            Showing {filteredPatients.length} of {PATIENTS.length} patients
          </div>
          <div className="flex items-center gap-2">
            <button className="px-4 py-2 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-400 cursor-not-allowed shadow-sm">Prev</button>
            <button className="px-4 py-2 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-700 hover:bg-slate-50 shadow-sm transition-all">Next</button>
          </div>
        </div>
      </div>
    </div>
  );
}
