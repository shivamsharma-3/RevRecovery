'use client';

import React, { useState, useEffect } from 'react';
import { 
  History, User, Shield, AlertTriangle, 
  CheckCircle2, Info, Search, Filter, 
  Download, Clock, ArrowRight, Activity, Database, Key, Settings, FileText, Lock, ArrowUpRight, Plus
} from 'lucide-react';
import { db, auth } from '@/firebase';
import { collection, query, orderBy, onSnapshot, addDoc, serverTimestamp, getDocs, writeBatch, doc } from 'firebase/firestore';
import { useAuth } from '@/components/AuthProvider';
import { toast } from 'sonner';

interface AuditLog {
  id: string;
  user: string;
  action: string;
  target: string;
  date: string;
  status: 'Success' | 'Failed';
  severity: 'Low' | 'Medium' | 'High' | 'Info';
  type: string;
  ip: string;
}

export default function AuditLogsPage() {
  const { user } = useAuth();
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [severityFilter, setSeverityFilter] = useState('All Severities');
  const [actionFilter, setActionFilter] = useState('All Actions');
  const [dateRange, setDateRange] = useState('Last 7 Days');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    if (!user) return;

    const logsRef = collection(db, 'users', user.uid, 'audit_logs');
    const q = query(logsRef, orderBy('date', 'desc'));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const fetchedLogs = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as AuditLog[];
      setLogs(fetchedLogs);
      setLoading(false);
    }, (error) => {
      console.error("Error fetching audit logs:", error);
      toast.error("Failed to load audit logs");
      setLoading(false);
    });

    return () => unsubscribe();
  }, [user]);

  const generateSampleLogs = async () => {
    if (!user) return;
    setLoading(true);
    try {
      const logsRef = collection(db, 'users', user.uid, 'audit_logs');
      const sampleLogs = [
        { user: 'Admin (John Doe)', action: 'Claim Approved', target: 'CLM-7829', date: new Date().toISOString(), status: 'Success', severity: 'Low', type: 'claim', ip: '192.168.1.45' },
        { user: 'System', action: 'Security Scan', target: 'Network', date: new Date(Date.now() - 3600000).toISOString(), status: 'Success', severity: 'Info', type: 'system', ip: 'internal' },
        { user: 'Sarah Miller', action: 'Access Denied', target: 'Settings', date: new Date(Date.now() - 7200000).toISOString(), status: 'Failed', severity: 'High', type: 'security', ip: '203.0.113.12' },
        { user: 'Admin (John Doe)', action: 'User Created', target: 'Emma Wilson', date: new Date(Date.now() - 86400000).toISOString(), status: 'Success', severity: 'Medium', type: 'user', ip: '192.168.1.45' },
        { user: 'System', action: 'Data Backup', target: 'Database', date: new Date(Date.now() - 172800000).toISOString(), status: 'Success', severity: 'Low', type: 'system', ip: 'internal' },
      ];

      const batch = writeBatch(db);
      sampleLogs.forEach(log => {
        const newDocRef = doc(logsRef);
        batch.set(newDocRef, log);
      });
      await batch.commit();
      toast.success("Sample logs generated successfully");
    } catch (error) {
      console.error("Error generating sample logs:", error);
      toast.error("Failed to generate sample logs");
    } finally {
      setLoading(false);
    }
  };

  const filteredLogs = logs.filter(log => {
    const matchesSearch = log.user.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          log.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          log.target.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          log.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSeverity = severityFilter === 'All Severities' || log.severity === severityFilter;
    const matchesAction = actionFilter === 'All Actions' || log.type === actionFilter.toLowerCase();
    
    // Basic date filtering
    let matchesDate = true;
    const logDate = new Date(log.date);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - logDate.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (dateRange === 'Today') matchesDate = diffDays <= 1;
    if (dateRange === 'Last 7 Days') matchesDate = diffDays <= 7;
    if (dateRange === 'Last 30 Days') matchesDate = diffDays <= 30;

    return matchesSearch && matchesSeverity && matchesAction && matchesDate;
  });

  const totalPages = Math.ceil(filteredLogs.length / itemsPerPage);
  const paginatedLogs = filteredLogs.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleExportCSV = (singleLog?: AuditLog) => {
    const dataToExport = singleLog ? [singleLog] : filteredLogs;
    const headers = ['Event ID', 'Time', 'User', 'IP', 'Action', 'Target', 'Severity', 'Status', 'Type'];
    const csvContent = [
      headers.join(','),
      ...dataToExport.map(log => 
        [log.id, log.date, `"${log.user}"`, log.ip, `"${log.action}"`, `"${log.target}"`, log.severity, log.status, log.type].join(',')
      )
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', singleLog ? `audit_log_${singleLog.id}.csv` : 'audit_logs_export.csv');
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

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
          <button 
            onClick={generateSampleLogs}
            className="px-4 py-2 bg-white border border-slate-200 text-slate-700 rounded-xl text-sm font-bold hover:bg-slate-50 transition-all shadow-sm flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Generate Sample Logs
          </button>
          <button 
            onClick={() => handleExportCSV()}
            className="px-4 py-2 bg-white border border-slate-200 text-slate-700 rounded-xl text-sm font-bold hover:bg-slate-50 transition-all shadow-sm flex items-center gap-2"
          >
            <Download className="w-4 h-4" />
            Export CSV
          </button>
          <a 
            href="/dashboard/settings"
            className="flex items-center gap-2 px-4 py-2 bg-slate-900 text-white rounded-xl hover:bg-slate-800 transition-all font-bold text-sm shadow-lg shadow-slate-900/20"
          >
            <Lock className="w-4 h-4" />
            Security Settings
          </a>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        {[
          { label: 'Total Events (24h)', value: logs.filter(l => new Date(l.date) > new Date(Date.now() - 86400000)).length.toString(), icon: Activity, color: 'text-blue-600', bg: 'bg-blue-50', trend: 'Normal volume' },
          { label: 'Security Alerts', value: logs.filter(l => l.severity === 'High').length.toString(), icon: Shield, color: 'text-amber-600', bg: 'bg-amber-50', trend: 'Requires attention' },
          { label: 'Failed Actions', value: logs.filter(l => l.status === 'Failed').length.toString(), icon: Key, color: 'text-red-600', bg: 'bg-red-50', trend: 'Monitor closely' },
          { label: 'System Events', value: logs.filter(l => l.type === 'system').length.toString(), icon: Database, color: 'text-teal-600', bg: 'bg-teal-50', trend: 'All successful' },
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
        <div className="flex items-center gap-3 w-full md:w-auto overflow-x-auto pb-2 md:pb-0">
          <select 
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
            className="flex-1 md:flex-none bg-slate-50 border-transparent rounded-xl text-sm font-bold px-4 py-3 text-slate-700 focus:bg-white focus:ring-2 focus:ring-teal-500/20 transition-all cursor-pointer outline-none whitespace-nowrap"
          >
            <option>Today</option>
            <option>Last 7 Days</option>
            <option>Last 30 Days</option>
            <option>All Time</option>
          </select>
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
              {loading ? (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-slate-500 font-medium">
                    Loading audit logs...
                  </td>
                </tr>
              ) : paginatedLogs.map((log) => (
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
                        <p className="text-sm font-bold text-slate-900 font-mono truncate max-w-[100px]">{log.id}</p>
                        <p className="text-xs text-slate-500 font-medium flex items-center gap-1 mt-0.5">
                          <Clock className="w-3 h-3" />
                          {new Date(log.date).toLocaleTimeString()}
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
                    <div className="flex items-center justify-end gap-2">
                      <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-bold mr-2 ${
                        log.status === 'Success' ? 'bg-teal-50 text-teal-700 border border-teal-100' : 'bg-red-50 text-red-700 border border-red-100'
                      }`}>
                        {log.status === 'Success' ? <CheckCircle2 className="w-3 h-3" /> : <AlertTriangle className="w-3 h-3" />}
                        {log.status}
                      </span>
                      <button 
                        onClick={() => handleExportCSV(log)}
                        className="p-2 hover:bg-slate-100 rounded-xl text-slate-400 hover:text-teal-600 transition-all shadow-sm opacity-0 group-hover:opacity-100"
                        title="Export Single Log"
                      >
                        <Download className="w-4 h-4" />
                      </button>
                      <button 
                        className="p-2 hover:bg-slate-100 rounded-xl text-slate-400 hover:text-teal-600 transition-all shadow-sm opacity-0 group-hover:opacity-100"
                        title="View Details"
                      >
                        <ArrowRight className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {!loading && paginatedLogs.length === 0 && (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-slate-500 font-medium">
                    <div className="flex flex-col items-center gap-3">
                      <History className="w-12 h-12 text-slate-200" />
                      <p>No logs found matching your criteria.</p>
                      <button 
                        onClick={generateSampleLogs}
                        className="text-teal-600 hover:text-teal-700 font-bold text-sm"
                      >
                        Generate sample logs to get started
                      </button>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        <div className="p-4 border-t border-slate-100 bg-slate-50 flex items-center justify-between">
          <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">
            Showing {(currentPage - 1) * itemsPerPage + 1} to {Math.min(currentPage * itemsPerPage, filteredLogs.length)} of {filteredLogs.length} events
          </p>
          <div className="flex items-center gap-2">
            <button 
              onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
              disabled={currentPage === 1}
              className="px-4 py-2 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-50 transition-all shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </button>
            <span className="text-xs font-bold text-slate-500 px-2">
              Page {currentPage} of {totalPages || 1}
            </span>
            <button 
              onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
              disabled={currentPage === totalPages || totalPages === 0}
              className="px-4 py-2 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-50 transition-all shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
