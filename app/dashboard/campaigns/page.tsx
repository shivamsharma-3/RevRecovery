'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { ChevronRight, Plus, Search, Filter, MoreHorizontal, ArrowRight, Bell, Info, Pause, Play, Trash2 } from 'lucide-react';

const INITIAL_CAMPAIGNS = [
  { id: 1, name: 'High-Complexity Denials', status: 'Running', rate: '54.2%', roi: '18.4x', volume: '$242,500' },
  { id: 2, name: 'Legacy Revenue Sweep', status: 'Paused', rate: '22.1%', roi: '4.2x', volume: '$89,200' },
  { id: 3, name: 'Medicare Re-processing', status: 'Completed', rate: '91.8%', roi: '22.5x', volume: '$1,240,000' },
  { id: 4, name: 'Payer Underpayment Audit', status: 'Running', rate: '38.9%', roi: '9.1x', volume: '$415,800' },
];

export default function CampaignList() {
  const [campaigns, setCampaigns] = useState(INITIAL_CAMPAIGNS);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');

  const filteredCampaigns = useMemo(() => {
    return campaigns.filter(c => {
      const matchesSearch = c.name.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus = statusFilter === 'All' || c.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [campaigns, searchQuery, statusFilter]);

  const toggleStatus = (id: number) => {
    setCampaigns(prev => prev.map(c => {
      if (c.id === id) {
        if (c.status === 'Running') return { ...c, status: 'Paused' as const };
        if (c.status === 'Paused') return { ...c, status: 'Running' as const };
      }
      return c;
    }));
  };

  const deleteCampaign = (id: number) => {
    if (confirm('Are you sure you want to delete this campaign?')) {
      setCampaigns(prev => prev.filter(c => c.id !== id));
    }
  };

  return (
    <main className="p-4 md:p-6">
      {/* Top Bar / Header Section */}
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
        <div>
          <nav className="flex items-center gap-2 text-[10px] font-bold text-slate-400 mb-1.5 tracking-wide uppercase">
            <span>Recovery Engine</span>
            <ChevronRight className="w-2.5 h-2.5" />
            <span className="text-teal-600">Active Campaigns</span>
          </nav>
          <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight leading-none mb-2 font-headline">Campaign Analytics</h2>
          <p className="text-slate-500 max-w-xl text-sm font-medium leading-relaxed">
            Deploy AI-driven recovery protocols to identify and reclaim lost clinical revenue. 
            <span className="text-teal-600 font-bold inline-flex items-center gap-1 ml-2">
              <span className="w-1.5 h-1.5 bg-teal-500 rounded-full animate-pulse" />
              Live Optimization Active
            </span>
          </p>
        </div>
        <div className="mt-4 md:mt-0">
          <Link href="/dashboard/campaigns/new">
            <button className="bg-teal-600 text-white px-5 py-2.5 rounded-xl text-sm font-bold shadow-lg shadow-teal-500/20 hover:bg-teal-700 transition-all flex items-center gap-2 group">
              <Plus className="w-4 h-4 group-hover:rotate-90 transition-transform" />
              Create New Campaign
            </button>
          </Link>
        </div>
      </header>
      {/* Metrics Overview (Editorial Bento Grid) */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="col-span-1 sm:col-span-2 bg-white p-6 rounded-[2rem] shadow-sm border border-slate-100 flex flex-col justify-between min-h-[140px] hover:shadow-md transition-all group">
          <div className="flex justify-between items-start">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">Aggregate Recovery Rate</span>
            <span className="text-teal-700 bg-teal-50 px-2 py-1 rounded-lg text-[10px] font-bold uppercase tracking-widest">+12.4% vs LY</span>
          </div>
          <div className="flex items-baseline gap-1.5 mt-2">
            <h3 className="text-4xl font-extrabold text-teal-600 tracking-tighter">42.8<span className="text-xl opacity-60">%</span></h3>
          </div>
          <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden mt-4">
            <div className="bg-teal-600 h-full w-[42.8%]" />
          </div>
        </div>
        <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-slate-100 flex flex-col justify-between hover:shadow-md transition-all group">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">Total ROI</span>
          <h3 className="text-3xl font-extrabold text-slate-900 tracking-tighter mt-2">14.2<span className="text-lg opacity-60">x</span></h3>
          <p className="text-[10px] text-slate-400 mt-1 font-bold uppercase tracking-wider">Verified Net Recovery Value</p>
        </div>
        <div className="bg-teal-600 text-white p-6 rounded-[2rem] shadow-xl shadow-teal-500/20 flex flex-col justify-between hover:shadow-2xl transition-all group">
          <span className="text-[11px] font-bold text-teal-100 uppercase tracking-widest">Active Protocols</span>
          <h3 className="text-3xl font-extrabold tracking-tighter mt-2">{campaigns.filter(c => c.status === 'Running').length}</h3>
          <p className="text-[10px] text-teal-50/70 mt-1 font-bold uppercase tracking-wider">Monitoring 2.4k Claims</p>
        </div>
      </section>
      {/* Campaign Table / List */}
      <section className="bg-white rounded-[2.5rem] shadow-sm border border-slate-100 overflow-hidden">
        <div className="p-8 border-b border-slate-50 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <h3 className="text-xl font-bold text-slate-900 font-headline">Active Protocols</h3>
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <div className="relative flex-grow sm:flex-grow-0">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
              <input 
                className="pl-10 pr-4 py-2 bg-slate-50 border-none rounded-xl text-sm focus:ring-2 focus:ring-teal-500/20 w-full sm:w-64 transition-all outline-none" 
                placeholder="Filter campaigns..." 
                type="text" 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <select 
              className="bg-slate-50 border-none rounded-xl text-sm focus:ring-2 focus:ring-teal-500/20 py-2 px-4 font-bold text-slate-600 transition-all outline-none"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="All">All Status</option>
              <option value="Running">Running</option>
              <option value="Paused">Paused</option>
              <option value="Completed">Completed</option>
            </select>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="text-[9px] uppercase tracking-widest text-slate-400 font-bold border-b border-slate-50">
                <th className="px-6 py-4">Protocol Name</th>
                <th className="px-4 py-4">Status</th>
                <th className="px-4 py-4">Success Rate</th>
                <th className="px-4 py-4">Recovery ROI</th>
                <th className="px-4 py-4">Volume</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filteredCampaigns.map((campaign) => (
                <tr key={campaign.id} className="group hover:bg-slate-50/50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex flex-col">
                      <span className="text-xs font-bold text-slate-900">{campaign.name}</span>
                      <span className="text-[10px] text-slate-400 mt-0.5">AI-Authored Appeals v2.4</span>
                    </div>
                  </td>
                  <td className="px-4 py-4">
                    <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[9px] font-bold uppercase ${
                      campaign.status === 'Running' ? 'bg-green-50 text-green-700' : 
                      campaign.status === 'Completed' ? 'bg-blue-50 text-blue-700' : 'bg-slate-100 text-slate-500'
                    }`}>
                      <div className={`w-1.5 h-1.5 rounded-full ${
                        campaign.status === 'Running' ? 'bg-green-600 animate-pulse' : 
                        campaign.status === 'Completed' ? 'bg-blue-600' : 'bg-slate-400'
                      }`} />
                      {campaign.status}
                    </span>
                  </td>
                  <td className="px-4 py-4">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-slate-900">{campaign.rate}</span>
                      <div className="flex-1 w-16 bg-slate-100 h-1.5 rounded-full overflow-hidden">
                        <div className={`h-full rounded-full ${campaign.status === 'Running' ? 'bg-teal-600' : 'bg-slate-400'}`} style={{width: campaign.rate}} />
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-4 text-xs font-bold text-slate-900">{campaign.roi}</td>
                  <td className="px-4 py-4 text-xs text-slate-500 font-medium">{campaign.volume}</td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      {campaign.status !== 'Completed' && (
                        <button 
                          onClick={() => toggleStatus(campaign.id)}
                          className="p-1.5 text-slate-400 hover:text-teal-600 transition-colors rounded-lg hover:bg-teal-50"
                          title={campaign.status === 'Running' ? 'Pause' : 'Resume'}
                        >
                          {campaign.status === 'Running' ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                        </button>
                      )}
                      <button 
                        onClick={() => deleteCampaign(campaign.id)}
                        className="p-1.5 text-slate-400 hover:text-red-600 transition-colors rounded-lg hover:bg-red-50"
                        title="Delete"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filteredCampaigns.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-slate-500 text-sm">
                    No campaigns found matching your criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        {/* Table Footer */}
        <div className="p-5 bg-slate-50/30 border-t border-slate-50 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Showing {filteredCampaigns.length} of {campaigns.length} protocols</p>
          <div className="flex gap-1.5">
            <button className="px-3 py-1.5 rounded-lg border border-slate-200 text-[10px] font-bold text-slate-400 hover:bg-white disabled:opacity-30 transition-all" disabled>Previous</button>
            <button className="px-3 py-1.5 rounded-lg border border-teal-200 text-[10px] font-bold text-teal-700 bg-teal-50 shadow-sm">1</button>
            <button className="px-3 py-1.5 rounded-lg border border-slate-200 text-[10px] font-bold text-slate-500 hover:bg-white transition-all">2</button>
            <button className="px-3 py-1.5 rounded-lg border border-slate-200 text-[10px] font-bold text-slate-500 hover:bg-white transition-all">Next</button>
          </div>
        </div>
      </section>
      {/* Insights Footer Section (Editorial) */}
      <section className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm relative overflow-hidden group">
            <div className="relative z-10">
              <h4 className="text-lg font-extrabold text-slate-900 mb-2 tracking-tight font-headline">AI Diagnostic: Denial Patterns</h4>
              <p className="text-slate-500 font-medium mb-4 text-xs leading-relaxed max-w-lg">
                We've detected a significant increase in "Coordination of Benefits" denials from top-tier payers. Activate the <span className="text-teal-600 font-bold underline decoration-teal-200 underline-offset-4">COB-Automate</span> protocol to mitigate up to 85% of these losses.
              </p>
              <button className="text-teal-600 font-bold text-xs inline-flex items-center gap-2 group/btn hover:gap-3 transition-all">
                View Diagnostic Details <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
            {/* Decorative Background Gradient */}
            <div className="absolute -right-20 -bottom-20 w-48 h-48 bg-teal-50 rounded-full blur-3xl opacity-50" />
          </div>
        </div>
        <div className="h-full bg-teal-900 p-6 rounded-2xl flex flex-col justify-center items-center text-center text-white shadow-xl shadow-teal-900/20">
          <Bell className="w-6 h-6 text-teal-400 mb-4" />
          <h5 className="text-base font-bold tracking-tight font-headline">System Alert</h5>
          <p className="text-teal-100/70 text-xs font-medium mt-2 leading-relaxed">3 campaigns require manual <br />contract verification.</p>
          <button className="mt-6 text-[10px] font-extrabold uppercase tracking-widest text-white border-b border-teal-500/30 pb-0.5 hover:border-teal-400 transition-all">Review Alerts</button>
        </div>
      </section>
    </main>
  );
}

