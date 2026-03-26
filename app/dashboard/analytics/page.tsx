'use client';

import React from 'react';
import { 
  TrendingUp, TrendingDown, DollarSign, Calendar, 
  ArrowUpRight, ArrowDownRight, BarChart3, PieChart,
  Download, Filter
} from 'lucide-react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  LineChart, Line, AreaChart, Area
} from 'recharts';

const data = [
  { name: 'Jan', revenue: 4000, claims: 2400 },
  { name: 'Feb', revenue: 3000, claims: 1398 },
  { name: 'Mar', revenue: 2000, claims: 9800 },
  { name: 'Apr', revenue: 2780, claims: 3908 },
  { name: 'May', revenue: 1890, claims: 4800 },
  { name: 'Jun', revenue: 2390, claims: 3800 },
  { name: 'Jul', revenue: 3490, claims: 4300 },
];

export default function RevenueAnalyticsPage() {
  return (
    <div className="p-8 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Revenue Analytics</h1>
          <p className="text-slate-500">Deep dive into your revenue performance and recovery trends.</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm font-medium text-slate-600">
            <Calendar className="w-4 h-4" />
            Last 30 Days
          </div>
          <button className="flex items-center gap-2 px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-all font-medium text-sm shadow-sm">
            <Download className="w-4 h-4" />
            Download Report
          </button>
        </div>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm hover:shadow-md transition-all group">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 rounded-2xl bg-teal-50 text-teal-600">
              <DollarSign className="w-6 h-6" />
            </div>
            <div className="flex items-center gap-1 text-teal-600 text-[10px] font-bold bg-teal-50 px-2 py-1 rounded-lg uppercase tracking-widest">
              <ArrowUpRight className="w-3 h-3" />
              +14.2%
            </div>
          </div>
          <h3 className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-1">Total Recovered Revenue</h3>
          <p className="text-3xl font-extrabold text-slate-900 tracking-tight mt-1">$1,284,500</p>
          <p className="text-[10px] text-slate-400 font-bold mt-2 uppercase tracking-wider">Compared to $1,124,000 last month</p>
        </div>

        <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm hover:shadow-md transition-all group">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 rounded-2xl bg-blue-50 text-blue-600">
              <BarChart3 className="w-6 h-6" />
            </div>
            <div className="flex items-center gap-1 text-teal-600 text-[10px] font-bold bg-teal-50 px-2 py-1 rounded-lg uppercase tracking-widest">
              <ArrowUpRight className="w-3 h-3" />
              +5.4%
            </div>
          </div>
          <h3 className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-1">Average Claim Value</h3>
          <p className="text-3xl font-extrabold text-slate-900 tracking-tight mt-1">$2,450</p>
          <p className="text-[10px] text-slate-400 font-bold mt-2 uppercase tracking-wider">Compared to $2,320 last month</p>
        </div>

        <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm hover:shadow-md transition-all group">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 rounded-2xl bg-purple-50 text-purple-600">
              <PieChart className="w-6 h-6" />
            </div>
            <div className="flex items-center gap-1 text-red-600 text-[10px] font-bold bg-red-50 px-2 py-1 rounded-lg uppercase tracking-widest">
              <ArrowDownRight className="w-3 h-3" />
              -2.1%
            </div>
          </div>
          <h3 className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-1">Recovery Rate</h3>
          <p className="text-3xl font-extrabold text-slate-900 tracking-tight mt-1">84.2%</p>
          <p className="text-[10px] text-slate-400 font-bold mt-2 uppercase tracking-wider">Compared to 86.3% last month</p>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-slate-900 font-headline">Revenue Trends</h3>
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1.5">
                <div className="w-2 h-2 rounded-full bg-teal-500"></div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Revenue</span>
              </div>
            </div>
          </div>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data}>
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#0d9488" stopOpacity={0.15}/>
                    <stop offset="95%" stopColor="#0d9488" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize: 11, fill: '#94a3b8', fontWeight: 600}} dy={15} />
                <YAxis axisLine={false} tickLine={false} tick={{fontSize: 11, fill: '#94a3b8', fontWeight: 600}} />
                <Tooltip 
                  contentStyle={{borderRadius: '16px', border: 'none', boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)'}}
                />
                <Area type="monotone" dataKey="revenue" stroke="#0d9488" strokeWidth={4} fillOpacity={1} fill="url(#colorRevenue)" dot={{ r: 6, fill: '#0d9488', strokeWidth: 3, stroke: '#fff' }} activeDot={{ r: 8, fill: '#0d9488', strokeWidth: 4, stroke: '#fff' }} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-slate-900 font-headline">Claims Volume</h3>
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1.5">
                <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Claims</span>
              </div>
            </div>
          </div>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize: 11, fill: '#94a3b8', fontWeight: 600}} dy={15} />
                <YAxis axisLine={false} tickLine={false} tick={{fontSize: 11, fill: '#94a3b8', fontWeight: 600}} />
                <Tooltip 
                  contentStyle={{borderRadius: '16px', border: 'none', boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)'}}
                  cursor={{fill: '#f8fafc'}}
                />
                <Bar dataKey="claims" fill="#3b82f6" radius={[6, 6, 0, 0]} barSize={40} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
