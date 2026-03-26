'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useAuth } from '@/components/AuthProvider';
import { useRouter } from 'next/navigation';
import { 
  Activity, Megaphone, CreditCard, Settings, Bell, Search, 
  LayoutDashboard, PlusCircle, Zap, ShieldCheck, Users, 
  TrendingUp, MessageSquare, ChevronRight, MoreHorizontal,
  Plus
} from 'lucide-react';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell 
} from 'recharts';

const recoveryData = [
  { name: 'Jan', amount: 45000, projected: 48000 },
  { name: 'Feb', amount: 52000, projected: 55000 },
  { name: 'Mar', amount: 48000, projected: 60000 },
  { name: 'Apr', amount: 61000, projected: 65000 },
  { name: 'May', amount: 55000, projected: 70000 },
  { name: 'Jun', amount: 67000, projected: 75000 },
  { name: 'Jul', amount: 72000, projected: 80000 },
];

const denialPatterns = [
  { name: 'Coding Errors', value: 35 },
  { name: 'Eligibility', value: 25 },
  { name: 'Auth Issues', value: 20 },
  { name: 'COB Denials', value: 15 },
  { name: 'Other', value: 5 },
];

const COLORS = ['#0d9488', '#0f766e', '#115e59', '#134e4a', '#14b8a6'];

export default function DashboardHome() {
  const { user, loading } = useAuth();
  const [isMounted, setIsMounted] = useState(true);
  const [hasData, setHasData] = useState(true); // Default to true to match screenshot
  const [metrics, setMetrics] = useState({
    totalRecovered: 412890,
    recoveryRate: 94.2,
    activeCampaigns: 18,
    messagesSent: 4291
  });

  useEffect(() => {
    // Simulate data loading if hasData is true
    if (hasData) {
      const interval = setInterval(() => {
        setMetrics(prev => ({
          ...prev,
          totalRecovered: +(prev.totalRecovered + Math.random() * 0.01).toFixed(2),
          recoveryRate: +(prev.recoveryRate + (Math.random() - 0.5) * 0.2).toFixed(1)
        }));
      }, 5000);
      return () => clearInterval(interval);
    }
  }, [hasData]);

  if (!isMounted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-teal-600"></div>
      </div>
    );
  }

  if (!hasData) {
    return (
      <main className="flex-grow p-4 md:p-8 overflow-y-auto bg-slate-50/50">
        <header className="mb-8">
          <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight font-headline">Welcome to RevRecover AI</h2>
          <p className="text-slate-500 font-medium text-sm">Get started by launching your first revenue recovery campaign.</p>
        </header>

        <div className="max-w-4xl mx-auto mt-8 text-center">
          <div className="bg-white p-8 md:p-12 rounded-3xl shadow-sm border border-slate-100 flex flex-col items-center">
            <div className="w-16 h-16 bg-teal-50 rounded-full flex items-center justify-center text-teal-600 mb-6">
              <Megaphone className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-3">No active campaigns yet</h3>
            <p className="text-slate-500 max-w-md mb-8 text-sm leading-relaxed">
              Connect your billing data or upload claim denials to start recovering revenue with AI-powered appeals.
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <Link href="/dashboard/campaigns/new">
                <button className="px-6 py-3 bg-teal-600 text-white rounded-xl font-bold hover:bg-teal-700 transition-all shadow-lg shadow-teal-500/20 flex items-center gap-2 text-sm">
                  <PlusCircle className="w-4 h-4" />
                  Create First Campaign
                </button>
              </Link>
              <button className="px-6 py-3 bg-white text-slate-600 border border-slate-200 rounded-xl font-bold hover:bg-slate-50 transition-all text-sm">
                Watch Tutorial
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-10">
            <div className="p-5 bg-white rounded-2xl border border-slate-100 text-left">
              <div className="w-9 h-9 bg-blue-50 text-blue-600 rounded-lg flex items-center justify-center mb-4">
                <Activity className="w-5 h-5" />
              </div>
              <h4 className="font-bold text-slate-900 mb-1 text-sm">Real-time Monitoring</h4>
              <p className="text-[11px] text-slate-500 leading-relaxed">Track every appeal and recovery cycle as it happens.</p>
            </div>
            <div className="p-5 bg-white rounded-2xl border border-slate-100 text-left">
              <div className="w-9 h-9 bg-purple-50 text-purple-600 rounded-lg flex items-center justify-center mb-4">
                <Zap className="w-5 h-5" />
              </div>
              <h4 className="font-bold text-slate-900 mb-1 text-sm">AI Personalization</h4>
              <p className="text-[11px] text-slate-500 leading-relaxed">Our engine crafts unique appeals based on clinical data.</p>
            </div>
            <div className="p-5 bg-white rounded-2xl border border-slate-100 text-left">
              <div className="w-9 h-9 bg-amber-50 text-amber-600 rounded-lg flex items-center justify-center mb-4">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h4 className="font-bold text-slate-900 mb-1 text-sm">Compliance First</h4>
              <p className="text-[11px] text-slate-500 leading-relaxed">Built-in safeguards ensure all outreach meets regulations.</p>
            </div>
          </div>
          
          <button 
            onClick={() => setHasData(true)}
            className="mt-12 text-[10px] font-bold text-slate-400 uppercase tracking-widest hover:text-teal-600 transition-colors"
          >
            Preview with Demo Data
          </button>
        </div>
      </main>
    );
  }

  return (
    <div className="flex h-full bg-[#F8FAFB]">
      {/* Main Content Area */}
      <main className="flex-1 p-6 md:p-10 overflow-y-auto">
        {/* Top Navigation / Header */}
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-10">
          <div>
            <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight font-headline">Executive Dashboard</h2>
            <p className="text-slate-500 font-medium text-sm mt-1">Monitoring clinical revenue health and active recovery cycles.</p>
          </div>
          <div className="flex items-center gap-6">
            <div className="hidden sm:flex items-center gap-2 px-4 py-2 bg-[#F0F9F9] rounded-full border border-teal-100">
              <div className="w-2 h-2 bg-teal-500 rounded-full animate-pulse" />
              <span className="text-[11px] font-bold text-teal-700 uppercase tracking-wider">Live Recovery Active</span>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-bold leading-none text-slate-900">{user?.email?.split('@')[0] || 'Administrator'}</p>
                <p className="text-[10px] text-slate-500 font-bold uppercase mt-1 tracking-tight">{user?.email}</p>
              </div>
              <div className="w-11 h-11 rounded-full overflow-hidden border-2 border-white shadow-md bg-teal-600 flex items-center justify-center">
                <Image 
                  src={`https://ui-avatars.com/api/?name=${user?.email || 'Admin'}&background=0d9488&color=fff`} 
                  alt="Avatar" 
                  width={44} 
                  height={44} 
                  referrerPolicy="no-referrer"
                />
              </div>
            </div>
          </div>
        </header>

        {/* Metrics Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-slate-100 hover:shadow-md transition-all group flex flex-col justify-between">
            <div>
              <div className="flex justify-between items-start mb-6">
                <div className="p-3 bg-slate-50 rounded-2xl text-teal-600">
                  <CreditCard className="w-6 h-6" />
                </div>
                <span className="text-[10px] font-bold text-teal-600 bg-teal-50 px-2 py-1 rounded-lg uppercase tracking-widest">+12.4%</span>
              </div>
              <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-1">Total Recovered</p>
              <h3 className="text-3xl font-extrabold text-slate-900 tracking-tight">${(metrics.totalRecovered / 1000).toFixed(0)}k</h3>
            </div>
            <p className="text-[10px] text-slate-400 font-bold mt-4 uppercase tracking-wider">Fiscal year to date</p>
          </div>

          <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-slate-100 hover:shadow-md transition-all group flex flex-col justify-between">
            <div>
              <div className="flex justify-between items-start mb-6">
                <div className="p-3 bg-slate-50 rounded-2xl text-teal-600">
                  <TrendingUp className="w-6 h-6" />
                </div>
                <span className="text-[10px] font-bold text-teal-600 bg-teal-50 px-2 py-1 rounded-lg uppercase tracking-widest">Optimal</span>
              </div>
              <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-1">Recovery Rate</p>
              <h3 className="text-3xl font-extrabold text-slate-900 tracking-tight">{metrics.recoveryRate}%</h3>
            </div>
            <p className="text-[10px] text-slate-400 font-bold mt-4 uppercase tracking-wider">Against industry benchmark 82%</p>
          </div>

          <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-slate-100 hover:shadow-md transition-all group flex flex-col justify-between">
            <div>
              <div className="flex justify-between items-start mb-6">
                <div className="p-3 bg-slate-50 rounded-2xl text-teal-600">
                  <Megaphone className="w-6 h-6" />
                </div>
                <span className="text-[10px] font-bold text-teal-600 bg-teal-50 px-2 py-1 rounded-lg uppercase tracking-widest">Active</span>
              </div>
              <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-1">Active Campaigns</p>
              <h3 className="text-3xl font-extrabold text-slate-900 tracking-tight">{metrics.activeCampaigns}</h3>
            </div>
            <p className="text-[10px] text-slate-400 font-bold mt-4 uppercase tracking-wider">7 ending within 48 hours</p>
          </div>

          <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-slate-100 hover:shadow-md transition-all group flex flex-col justify-between">
            <div>
              <div className="flex justify-between items-start mb-6">
                <div className="p-3 bg-slate-50 rounded-2xl text-teal-600">
                  <MessageSquare className="w-6 h-6" />
                </div>
                <span className="text-[10px] font-bold text-slate-600 bg-slate-100 px-2 py-1 rounded-lg uppercase tracking-widest">Live</span>
              </div>
              <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-1">Messages Sent</p>
              <h3 className="text-3xl font-extrabold text-slate-900 tracking-tight">{metrics.messagesSent.toLocaleString()}</h3>
            </div>
            <p className="text-[10px] text-slate-400 font-bold mt-4 uppercase tracking-wider">AI-optimized patient outreach</p>
          </div>
        </div>

        {/* Charts and Scale Card Section */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 mb-10">
          <div className="lg:col-span-3 bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-100">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-10">
              <div>
                <h3 className="text-xl font-bold text-slate-900 font-headline">Recovery Performance Trends</h3>
                <p className="text-sm text-slate-500 mt-1">Revenue recovery yield vs. campaign expenditure</p>
              </div>
              <div className="flex bg-slate-100 p-1 rounded-xl">
                {['Week', 'Month', 'Year'].map((period) => (
                  <button 
                    key={period}
                    className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${
                      period === 'Month' ? 'bg-teal-800 text-white shadow-md' : 'text-slate-500 hover:text-slate-700'
                    }`}
                  >
                    {period}
                  </button>
                ))}
              </div>
            </div>
            <div className="h-[350px] w-full relative">
              <div className="absolute top-0 right-0 bg-white p-4 rounded-2xl shadow-lg border border-slate-100 z-10">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Current Peak</p>
                <p className="text-xl font-extrabold text-teal-800 font-headline">$84,200</p>
              </div>
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={recoveryData}>
                  <defs>
                    <linearGradient id="colorAmount" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#0d9488" stopOpacity={0.15}/>
                      <stop offset="95%" stopColor="#0d9488" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis 
                    dataKey="name" 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{fontSize: 11, fill: '#94a3b8', fontWeight: 600}} 
                    dy={15}
                  />
                  <YAxis hide />
                  <Tooltip 
                    contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)' }}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="amount" 
                    stroke="#0d9488" 
                    strokeWidth={4} 
                    fillOpacity={1} 
                    fill="url(#colorAmount)" 
                    dot={{ r: 6, fill: '#0d9488', strokeWidth: 3, stroke: '#fff' }}
                    activeDot={{ r: 8, fill: '#0d9488', strokeWidth: 4, stroke: '#fff' }}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="flex flex-col gap-6">
            <div className="bg-[#11766D] p-8 rounded-[2.5rem] text-white shadow-xl relative overflow-hidden group flex flex-col justify-between h-full">
              <div className="relative z-10">
                <h4 className="text-2xl font-extrabold font-headline mb-4 leading-tight">Scale Your Recovery</h4>
                <p className="text-teal-50/80 text-sm mb-8 leading-relaxed">
                  Launch a new targeted AI campaign to recover outstanding patient balances from Q3.
                </p>
                <button className="w-full py-4 bg-white text-teal-900 font-bold rounded-2xl flex items-center justify-center gap-2 hover:bg-teal-50 transition-all shadow-lg shadow-black/10 text-sm">
                  <PlusCircle className="w-5 h-5" />
                  <span>Create New Campaign</span>
                </button>
              </div>
              <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-teal-800 rounded-full blur-3xl opacity-50 group-hover:opacity-80 transition-opacity" />
            </div>
            
            <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-100">
              <div className="flex justify-between items-center mb-8">
                <h4 className="text-[11px] font-bold uppercase tracking-widest text-slate-400">Recent Insights</h4>
                <MoreHorizontal className="w-5 h-5 text-slate-300 cursor-pointer" />
              </div>
              <div className="space-y-8">
                {[
                  { title: 'High-Yield Opportunity', desc: 'AI detected 14 unfiled claims in Cardiology ($24k total).', time: '2 mins ago', color: 'bg-teal-500' },
                  { title: 'Audit Warning', desc: 'Minor compliance gap in Patient Form 4-B.', time: '45 mins ago', color: 'bg-amber-500' },
                ].map((insight, i) => (
                  <div key={i} className="flex gap-4">
                    <div className={`w-1.5 h-1.5 rounded-full ${insight.color} mt-2 shrink-0`} />
                    <div>
                      <p className="text-sm font-bold text-slate-900">{insight.title}</p>
                      <p className="text-xs text-slate-500 mt-1 leading-relaxed">{insight.desc}</p>
                      <p className="text-[10px] text-slate-400 mt-2 font-bold uppercase tracking-wider">{insight.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
