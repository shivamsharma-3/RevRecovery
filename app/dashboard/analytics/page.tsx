'use client';

import React, { useState, useEffect } from 'react';
import { 
  TrendingUp, TrendingDown, DollarSign, Calendar, 
  ArrowUpRight, ArrowDownRight, BarChart3, PieChart,
  Download, Filter, ChevronDown, FileText, Users, Megaphone, Lightbulb, CheckCircle2
} from 'lucide-react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  LineChart, Line, AreaChart, Area
} from 'recharts';
import { collection, getDocs, query } from 'firebase/firestore';
import { db } from '@/firebase';
import { useAuth } from '@/components/AuthProvider';

export default function RevenueAnalyticsPage() {
  const { user } = useAuth();
  const [dateRange, setDateRange] = useState('Last 30 Days');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [claimsData, setClaimsData] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      if (!user?.uid) return;
      setIsLoading(true);
      try {
        const q = query(collection(db, 'users', user.uid, 'claims'));
        const snapshot = await getDocs(q);
        const fetchedClaims = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setClaimsData(fetchedClaims);
      } catch (error) {
        console.error("Error fetching analytics data:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [user]);

  // Generate dynamic data based on selected range
  const generateChartData = () => {
    const now = new Date();
    let data = [];
    
    if (dateRange === 'Last 7 Days') {
      for (let i = 6; i >= 0; i--) {
        const d = new Date(now);
        d.setDate(d.getDate() - i);
        const dayName = d.toLocaleDateString('en-US', { weekday: 'short' });
        
        const dayClaims = claimsData.filter(c => {
          if (!c.date) return false;
          const cd = new Date(c.date);
          return cd.getDate() === d.getDate() && cd.getMonth() === d.getMonth() && cd.getFullYear() === d.getFullYear();
        });
        
        const revenue = dayClaims.filter(c => c.status === 'Recovered').reduce((sum, c) => sum + (c.amount || 0), 0);
        const claimsCount = dayClaims.length;
        data.push({ name: dayName, revenue, claims: claimsCount });
      }
    } else if (dateRange === 'Last 30 Days') {
      for (let i = 3; i >= 0; i--) {
        const weekStart = new Date(now);
        weekStart.setDate(weekStart.getDate() - (i * 7 + 7));
        const weekEnd = new Date(now);
        weekEnd.setDate(weekEnd.getDate() - (i * 7));
        
        const weekClaims = claimsData.filter(c => {
          if (!c.date) return false;
          const cd = new Date(c.date);
          return cd >= weekStart && cd < weekEnd;
        });
        
        const revenue = weekClaims.filter(c => c.status === 'Recovered').reduce((sum, c) => sum + (c.amount || 0), 0);
        const claimsCount = weekClaims.length;
        data.push({ name: `Week ${4 - i}`, revenue, claims: claimsCount });
      }
    } else if (dateRange === 'Last 90 Days') {
      for (let i = 2; i >= 0; i--) {
        const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
        const monthName = d.toLocaleDateString('en-US', { month: 'short' });
        
        const monthClaims = claimsData.filter(c => {
          if (!c.date) return false;
          const cd = new Date(c.date);
          return cd.getMonth() === d.getMonth() && cd.getFullYear() === d.getFullYear();
        });
        
        const revenue = monthClaims.filter(c => c.status === 'Recovered').reduce((sum, c) => sum + (c.amount || 0), 0);
        const claimsCount = monthClaims.length;
        data.push({ name: monthName, revenue, claims: claimsCount });
      }
    } else { // YTD
      for (let i = 11; i >= 0; i--) {
        const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
        const monthName = d.toLocaleDateString('en-US', { month: 'short' });
        
        const monthClaims = claimsData.filter(c => {
          if (!c.date) return false;
          const cd = new Date(c.date);
          return cd.getMonth() === d.getMonth() && cd.getFullYear() === d.getFullYear();
        });
        
        const revenue = monthClaims.filter(c => c.status === 'Recovered').reduce((sum, c) => sum + (c.amount || 0), 0);
        const claimsCount = monthClaims.length;
        data.push({ name: monthName, revenue, claims: claimsCount });
      }
    }
    return data;
  };

  const currentData = generateChartData();

  const totalRevenue = currentData.reduce((sum, item) => sum + item.revenue, 0);
  const totalClaims = currentData.reduce((sum, item) => sum + item.claims, 0);
  const avgClaimValue = totalClaims > 0 ? totalRevenue / totalClaims : 0;
  
  // Calculate recovery rate based on all claims
  const recoveredCount = claimsData.filter(c => c.status === 'Recovered').length;
  const recoveryRate = claimsData.length > 0 ? (recoveredCount / claimsData.length) * 100 : 0;

  const handleDownloadReport = () => {
    const csvContent = [
      ['Period', 'Revenue', 'Claims'].join(','),
      ...currentData.map(row => `${row.name},${row.revenue},${row.claims}`)
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `analytics_report_${dateRange.replace(/ /g, '_').toLowerCase()}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600"></div>
      </div>
    );
  }

  return (
    <div className="p-6 md:p-10 max-w-[1600px] mx-auto">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 font-headline">Revenue Analytics</h1>
          <p className="text-slate-500 font-medium mt-1">Deep dive into your revenue performance and recovery trends.</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative">
            <button 
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-xl text-sm font-bold text-slate-700 hover:bg-slate-50 transition-all shadow-sm"
            >
              <Calendar className="w-4 h-4" />
              {dateRange}
              <ChevronDown className="w-4 h-4 ml-1" />
            </button>
            {isDropdownOpen && (
              <div className="absolute top-full right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-slate-100 overflow-hidden z-20">
                {['Last 7 Days', 'Last 30 Days', 'Last 90 Days', 'YTD'].map(range => (
                  <button
                    key={range}
                    onClick={() => {
                      setDateRange(range);
                      setIsDropdownOpen(false);
                    }}
                    className="w-full text-left px-4 py-3 text-sm font-bold text-slate-700 hover:bg-slate-50 hover:text-teal-600 transition-colors border-b border-slate-50 last:border-0"
                  >
                    {range}
                  </button>
                ))}
              </div>
            )}
          </div>
          <button 
            onClick={handleDownloadReport}
            className="flex items-center gap-2 px-4 py-2 bg-teal-600 text-white rounded-xl hover:bg-teal-700 transition-all font-bold text-sm shadow-lg shadow-teal-900/20"
          >
            <Download className="w-4 h-4" />
            Download Report
          </button>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Main Content */}
        <div className="flex-1 min-w-0">
          {/* Overview Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <div className="bg-white p-6 rounded-[1.5rem] border border-slate-100 shadow-sm hover:shadow-md transition-all group">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 rounded-xl bg-teal-50 text-teal-600">
                  <DollarSign className="w-5 h-5" />
                </div>
                <div className="flex items-center gap-1 text-teal-600 text-[10px] font-bold bg-teal-50 px-2 py-1 rounded-lg uppercase tracking-widest">
                  <ArrowUpRight className="w-3 h-3" />
                  +14.2%
                </div>
              </div>
              <h3 className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-1">Total Recovered Revenue</h3>
              <p className="text-3xl font-extrabold text-slate-900 tracking-tight mt-1">${totalRevenue.toLocaleString()}</p>
              <p className="text-[10px] text-slate-400 font-bold mt-2 uppercase tracking-wider">In selected period</p>
            </div>

            <div className="bg-white p-6 rounded-[1.5rem] border border-slate-100 shadow-sm hover:shadow-md transition-all group">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 rounded-xl bg-blue-50 text-blue-600">
                  <BarChart3 className="w-5 h-5" />
                </div>
                <div className="flex items-center gap-1 text-teal-600 text-[10px] font-bold bg-teal-50 px-2 py-1 rounded-lg uppercase tracking-widest">
                  <ArrowUpRight className="w-3 h-3" />
                  +5.4%
                </div>
              </div>
              <h3 className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-1">Average Claim Value</h3>
              <p className="text-3xl font-extrabold text-slate-900 tracking-tight mt-1">${avgClaimValue.toLocaleString(undefined, { maximumFractionDigits: 0 })}</p>
              <p className="text-[10px] text-slate-400 font-bold mt-2 uppercase tracking-wider">In selected period</p>
            </div>

            <div className="bg-white p-6 rounded-[1.5rem] border border-slate-100 shadow-sm hover:shadow-md transition-all group">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 rounded-xl bg-purple-50 text-purple-600">
                  <PieChart className="w-5 h-5" />
                </div>
                <div className="flex items-center gap-1 text-teal-600 text-[10px] font-bold bg-teal-50 px-2 py-1 rounded-lg uppercase tracking-widest">
                  <ArrowUpRight className="w-3 h-3" />
                  +2.1%
                </div>
              </div>
              <h3 className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-1">Overall Recovery Rate</h3>
              <p className="text-3xl font-extrabold text-slate-900 tracking-tight mt-1">{recoveryRate.toFixed(1)}%</p>
              <p className="text-[10px] text-slate-400 font-bold mt-2 uppercase tracking-wider">Across all time</p>
            </div>
          </div>

          {/* Key Insights */}
          <div className="bg-teal-50 border border-teal-100 rounded-[1.5rem] p-6 mb-8 flex flex-col md:flex-row gap-6 items-start md:items-center">
            <div className="w-12 h-12 rounded-full bg-teal-100 flex items-center justify-center text-teal-600 shrink-0">
              <Lightbulb className="w-6 h-6" />
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-bold text-teal-900 mb-2 font-headline">Key Insights</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-teal-600 mt-0.5 shrink-0" />
                  <p className="text-sm text-teal-800 font-medium"><strong>Highest Recovery</strong> period was {currentData.reduce((max, item) => item.revenue > max.revenue ? item : max, currentData[0] || {name: 'N/A', revenue: 0}).name} (${currentData.reduce((max, item) => item.revenue > max.revenue ? item : max, currentData[0] || {name: 'N/A', revenue: 0}).revenue.toLocaleString()}).</p>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-teal-600 mt-0.5 shrink-0" />
                  <p className="text-sm text-teal-800 font-medium"><strong>Total Claims</strong> processed in this period: {totalClaims.toLocaleString()}.</p>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-teal-600 mt-0.5 shrink-0" />
                  <p className="text-sm text-teal-800 font-medium"><strong>Average Value</strong> is tracking well at ${avgClaimValue.toLocaleString(undefined, { maximumFractionDigits: 0 })} per claim.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Charts Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm">
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
                  <AreaChart data={currentData}>
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

            <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm">
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
                  <BarChart data={currentData}>
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
      </div>
    </div>
  );
}
