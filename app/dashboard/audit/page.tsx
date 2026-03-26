'use client';

import React, { useState } from 'react';
import { 
  History, User, Shield, AlertTriangle, 
  CheckCircle2, Info, Search, Filter, 
  Download, Clock, ArrowRight, Activity, Database, Key, Settings, FileText, Lock, ArrowUpRight
} from 'lucide-react';

export default function AuditLogsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [severityFilter, setSeverityFilter] = useState('All Severities');
  const [actionFilter, setActionFilter] = useState('All Actions');

  const logs = [
    { id: 'LOG-1024', user: 'Admin (John Doe)', action: 'Claim Approved', target: 'CLM-7829', date: '2024-03-25 14:20:15', status: 'Success', severity: 'Low', type: 'claim', ip: '192.168.1.45' },
    { id: 'LOG-1025', user: 'System', action: 'Security Scan', target: 'Network', date: '2024-03-25 13:45:00', status: 'Success', severity: 'Info', type: 'system', ip: 'internal' },
    { id: 'LOG-1026', user: 'Sarah Miller', action: 'Access Denied', target: 'Settings', date: '2024-03-25 12:30:12', status: 'Failed', severity: 'High', type: 'security', ip: '203.0.113.12' },
    { id: 'LOG-1027', user: 'Admin (John Doe)', action: 'User Created', target: 'Emma Wilson', date: '2024-03-25 11:15:45', status: 'Success', severity: 'Medium', type: 'user', ip: '192.168.1.45' },
    { id: 'LOG-1028', user: 'System', action: 'Data Backup', target: 'Database', date: '2024-03-25 10:00:00', status: 'Success', severity: 'Low', type: 'system', ip: 'internal' },
    { id: 'LOG-1029', user: 'Michael Chen', action: 'Password Changed', target: 'Account', date: '2024-03-25 09:45:22', status: 'Success', severity: 'Medium', type: 'security', ip: '198.51.100.4' },
    { id: 'LOG-1030', user: 'API Gateway', action: 'Rate Limit Exceeded', target: 'Endpoint /v1/claims', date: '2024-03-25 08:12:05', status: 'Failed', severity: 'High', type: 'system', ip: '10.0.0.5' },
    { id: 'LOG-1031', user: 'Admin (John Doe)', action: 'Campaign Paused', target: 'Q1 Dental Outreach', date: '2024-03-24 16:30:00', status: 'Success', severity: 'Low', type: 'campaign', ip: '192.168.1.45' },
  ];

  const filteredLogs = logs.filter(log => {
    const matchesSearch = log.user.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          log.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          log.target.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          log.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSeverity = severityFilter === 'All Severities' || log.severity === severityFilter;
    const matchesAction = actionFilter === 'All Actions' || log.type === actionFilter.toLowerCase();
    
    return matchesSearch && matchesSeverity && matchesAction;
  });

  const getIconForType = (type: string) => {
    switch (type) {
      case 'security': return <Shield className="w-5 h-5" />;
      case 'system': return <Database className="w-5 h-5" />;
      case 'user': return <User className="w-5 h-5" />;
      case 'claim': return <FileText className="w-5 h-5" />;
      case 'campaign': return <Activity className="w-5 h-5" />;
      default: return <Info className="w-5 h-5" />;
    }
  };

  return (
    <div className="p-6 md:p-10 max-w-[1600px] mx-auto">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 font-headline">Audit Logs</h1>
          <p className="text-slate-500 font-medium mt-1">Track all system activities and security events for compliance.</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="px-4 py-2 bg-white border border-slate-200 text-slate-700 rounded-xl text-sm font-bold hover:bg-slate-50 transition-all shadow-sm flex items-center gap-2">
            <Download className="w-4 h-4" />
            Export CSV
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-slate-900 text-white rounded-xl hover:bg-slate-800 transition-all font-bold text-sm shadow-lg shadow-slate-900/20">
            <Lock className="w-4 h-4" />
            Security Settings
          </button>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        {[
          { label: 'Total Events (24h)', value: '1,248', icon: Activity, color: 'text-blue-600', bg: 'bg-blue-50', trend: 'Normal volume' },
          { label: 'Security Alerts', value: '3', icon: Shield, color: 'text-amber-600', bg: 'bg-amber-50', trend: 'Requires attention' },
          { label: 'Failed Logins', value: '12', icon: Key, color: 'text-red-600', bg: 'bg-red-50', trend: '-5% vs yesterday' },
          { label: 'System Updates', value: '4', icon: Database, color: 'text-teal-600', bg: 'bg-teal-50', trend: 'All successful' },
        ].map((stat, i) => (
          <div key={i} className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm hover:shadow-md transition-all">
            <div className="flex items-center justify-between mb-4">
              <div className={`w-12 h-12 rounded-2xl ${stat.bg} ${stat.color} flex items-center justify-center`}>
                <stat.icon className="w-6 h-6" />
              </div>
            </div>
            <h3 className="text-slate-500 text-sm font-bold">{stat.label}</h3>
            <div className="flex items-end gap-2 mt-1">
              <p className="text-3xl font-extrabold text-slate-900 tracking-tight">{stat.value}</p>
            </div>
            <p className="text-xs font-medium text-slate-400 mt-3 flex items-center gap-1">
              <ArrowUpRight className="w-3 h-3" /> {stat.trend}
            </p>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-[1.5rem] border border-slate-100 shadow-sm mb-6 flex flex-col md:flex-row items-center gap-4">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
          <input 
            type="text" 
            placeholder="Search by user, action, target, or ID..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-4 py-3 bg-slate-50 border-transparent rounded-xl text-sm font-medium focus:bg-white focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all outline-none"
          />
        </div>
        <div className="flex items-center gap-3 w-full md:w-auto">
          <select 
            value={severityFilter}
            onChange={(e) => setSeverityFilter(e.target.value)}
            className="flex-1 md:flex-none bg-slate-50 border-transparent rounded-xl text-sm font-bold px-4 py-3 text-slate-700 focus:bg-white focus:ring-2 focus:ring-teal-500/20 transition-all cursor-pointer outline-none"
          >
            <option>All Severities</option>
            <option>High</option>
            <option>Medium</option>
            <option>Low</option>
            <option>Info</option>
          </select>
          <select 
            value={actionFilter}
            onChange={(e) => setActionFilter(e.target.value)}
            className="flex-1 md:flex-none bg-slate-50 border-transparent rounded-xl text-sm font-bold px-4 py-3 text-slate-700 focus:bg-white focus:ring-2 focus:ring-teal-500/20 transition-all cursor-pointer outline-none"
          >
            <option>All Actions</option>
            <option value="security">Security</option>
            <option value="system">System</option>
            <option value="user">User</option>
            <option value="claim">Claim</option>
            <option value="campaign">Campaign</option>
          </select>
          <button className="p-3 bg-slate-50 hover:bg-slate-100 rounded-xl text-slate-500 transition-colors">
            <Filter className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Logs List */}
      <div className="bg-white rounded-[2rem] border border-slate-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50/50">
                <th className="p-4 pl-6 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Event ID / Time</th>
                <th className="p-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">User / IP</th>
                <th className="p-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Action / Target</th>
                <th className="p-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Severity</th>
                <th className="p-4 pr-6 text-[10px] font-bold text-slate-400 uppercase tracking-widest text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filteredLogs.map((log) => (
                <tr key={log.id} className="hover:bg-slate-50/50 transition-colors group">
                  <td className="p-4 pl-6">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${
                        log.severity === 'High' ? 'bg-red-50 text-red-600' :
                        log.severity === 'Medium' ? 'bg-amber-50 text-amber-600' :
                        log.severity === 'Low' ? 'bg-teal-50 text-teal-600' :
                        'bg-blue-50 text-blue-600'
                      }`}>
                        {getIconForType(log.type)}
                      </div>
                      <div>
                        <p className="text-sm font-bold text-slate-900 font-mono">{log.id}</p>
                        <p className="text-xs text-slate-500 font-medium flex items-center gap-1 mt-0.5">
                          <Clock className="w-3 h-3" />
                          {log.date.split(' ')[1]}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="p-4">
                    <p className="text-sm font-bold text-slate-900">{log.user}</p>
                    <p className="text-xs text-slate-400 font-mono mt-0.5">{log.ip}</p>
                  </td>
                  <td className="p-4">
                    <p className="text-sm font-bold text-slate-700">{log.action}</p>
                    <p className="text-xs font-medium text-teal-600 mt-0.5">{log.target}</p>
                  </td>
                  <td className="p-4">
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-bold ${
                      log.severity === 'High' ? 'bg-red-50 text-red-700' :
                      log.severity === 'Medium' ? 'bg-amber-50 text-amber-700' :
                      log.severity === 'Low' ? 'bg-teal-50 text-teal-700' :
                      'bg-blue-50 text-blue-700'
                    }`}>
                      {log.severity === 'High' && <AlertTriangle className="w-3 h-3" />}
                      {log.severity}
                    </span>
                  </td>
                  <td className="p-4 pr-6 text-right">
                    <div className="flex items-center justify-end gap-4">
                      <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-bold ${
                        log.status === 'Success' ? 'bg-teal-50 text-teal-700 border border-teal-100' : 'bg-red-50 text-red-700 border border-red-100'
                      }`}>
                        {log.status === 'Success' ? <CheckCircle2 className="w-3 h-3" /> : <AlertTriangle className="w-3 h-3" />}
                        {log.status}
                      </span>
                      <button className="p-2 hover:bg-white rounded-xl text-slate-400 group-hover:text-teal-600 transition-all shadow-sm opacity-0 group-hover:opacity-100">
                        <ArrowRight className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filteredLogs.length === 0 && (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-slate-500 font-medium">
                    No logs found matching your criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        <div className="p-4 border-t border-slate-100 bg-slate-50 flex items-center justify-between">
          <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Showing {filteredLogs.length} events</p>
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
