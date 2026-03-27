'use client';

import React, { useState } from 'react';
import { 
  Plus, ArrowRight, DollarSign, Clock, CheckCircle2, 
  AlertCircle, MoreHorizontal, Search, Filter,
  ArrowUpRight, Download, Share2, Trash2, Edit3,
  Calendar, User, Tag, ShieldCheck
} from 'lucide-react';

export default function RecoveryPage() {
  const [activeTab, setActiveTab] = useState('all');

  const [pipelines, setPipelines] = useState([
    {
      id: 'identified',
      title: 'Identified',
      count: 3,
      amount: '$14,200',
      color: 'bg-slate-400',
      cards: [
        { id: 'RC-101', patient: 'Sarah Jenkins', amount: '$450.00', days: 12, type: 'Co-pay', priority: 'High' },
        { id: 'RC-102', patient: 'Michael Chen', amount: '$1,240.00', days: 45, type: 'Deductible', priority: 'Medium' },
        { id: 'RC-103', patient: 'Emma Wilson', amount: '$85.00', days: 5, type: 'Co-pay', priority: 'Low' },
      ]
    },
    {
      id: 'contacted',
      title: 'Contacted (AI)',
      count: 2,
      amount: '$8,450',
      color: 'bg-blue-500',
      cards: [
        { id: 'RC-104', patient: 'James Miller', amount: '$3,200.00', days: 60, type: 'Out of Network', priority: 'High' },
        { id: 'RC-105', patient: 'Olivia Davis', amount: '$210.00', days: 18, type: 'Co-pay', priority: 'Medium' },
      ]
    },
    {
      id: 'payment-plan',
      title: 'Payment Plan',
      count: 3,
      amount: '$42,500',
      color: 'bg-amber-500',
      cards: [
        { id: 'RC-106', patient: 'William Taylor', amount: '$890.00', days: 30, type: 'Deductible', priority: 'High' },
        { id: 'RC-107', patient: 'Sophia Martinez', amount: '$1,500.00', days: 90, type: 'Procedure', priority: 'Medium' },
        { id: 'RC-108', patient: 'Lucas Anderson', amount: '$450.00', days: 15, type: 'Co-pay', priority: 'Low' },
      ]
    },
    {
      id: 'recovered',
      title: 'Recovered',
      count: 2,
      amount: '$128,400',
      color: 'bg-teal-500',
      cards: [
        { id: 'RC-109', patient: 'Isabella Thomas', amount: '$320.00', days: 0, type: 'Co-pay', priority: 'Done' },
        { id: 'RC-110', patient: 'Mason Jackson', amount: '$2,100.00', days: 0, type: 'Procedure', priority: 'Done' },
      ]
    }
  ]);

  const handleDragStart = (e: React.DragEvent, cardId: string, sourcePipelineId: string) => {
    e.dataTransfer.setData('cardId', cardId);
    e.dataTransfer.setData('sourcePipelineId', sourcePipelineId);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault(); // Necessary to allow dropping
  };

  const handleDrop = (e: React.DragEvent, targetPipelineId: string) => {
    e.preventDefault();
    const cardId = e.dataTransfer.getData('cardId');
    const sourcePipelineId = e.dataTransfer.getData('sourcePipelineId');

    if (sourcePipelineId === targetPipelineId) return;

    setPipelines(prevPipelines => {
      const newPipelines = [...prevPipelines];
      
      const sourcePipelineIndex = newPipelines.findIndex(p => p.id === sourcePipelineId);
      const targetPipelineIndex = newPipelines.findIndex(p => p.id === targetPipelineId);

      const sourcePipeline = { ...newPipelines[sourcePipelineIndex] };
      const targetPipeline = { ...newPipelines[targetPipelineIndex] };

      const cardIndex = sourcePipeline.cards.findIndex(c => c.id === cardId);
      if (cardIndex === -1) return prevPipelines; // Safety check

      const [cardToMove] = sourcePipeline.cards.splice(cardIndex, 1);

      targetPipeline.cards.push(cardToMove);

      // Update counts
      sourcePipeline.count = sourcePipeline.cards.length;
      targetPipeline.count = targetPipeline.cards.length;

      newPipelines[sourcePipelineIndex] = sourcePipeline;
      newPipelines[targetPipelineIndex] = targetPipeline;

      return newPipelines;
    });
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] flex flex-col">
      {/* Header Section */}
      <header className="bg-white border-b border-slate-200 px-8 py-6 sticky top-0 z-30">
        <div className="max-w-[1600px] mx-auto flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[10px] font-bold text-teal-600 uppercase tracking-[0.2em]">Financial Operations</span>
              <span className="text-slate-300">/</span>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">Queue</span>
            </div>
            <h1 className="text-2xl font-black text-slate-900 tracking-tight font-headline flex items-center gap-3">
              Recovery Queue
              <span className="px-2 py-0.5 bg-slate-100 text-slate-500 rounded-md text-xs font-mono">v2.4.0</span>
            </h1>
          </div>
          
          <div className="flex items-center gap-3 w-full md:w-auto">
            <div className="relative flex-1 md:flex-none">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input 
                type="text" 
                placeholder="Search by ID, Patient, or Type..." 
                className="pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:ring-2 focus:ring-teal-500/10 transition-all w-full md:w-72 outline-none"
              />
            </div>
            <button className="p-2.5 bg-white border border-slate-200 text-slate-600 rounded-xl hover:bg-slate-50 transition-all shadow-sm">
              <Filter className="w-5 h-5" />
            </button>
            <button className="flex items-center gap-2 px-5 py-2.5 bg-[#0f172a] text-white rounded-xl hover:bg-slate-800 transition-all font-bold text-sm shadow-xl shadow-slate-900/10">
              <Plus className="w-4 h-4" />
              New Case
            </button>
          </div>
        </div>

        {/* Sub-navigation/Tabs */}
        <div className="max-w-[1600px] mx-auto mt-6 flex items-center gap-8 border-t border-slate-100 pt-4">
          {['all', 'active', 'pending', 'recovered', 'flagged'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`text-[11px] font-bold uppercase tracking-widest pb-2 transition-all relative ${
                activeTab === tab ? 'text-teal-600' : 'text-slate-400 hover:text-slate-600'
              }`}
            >
              {tab}
              {activeTab === tab && (
                <div className="absolute bottom-0 left-0 w-full h-0.5 bg-teal-600 rounded-full" />
              )}
            </button>
          ))}
          <div className="ml-auto flex items-center gap-4">
            <button className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1.5 hover:text-slate-600">
              <Download className="w-3.5 h-3.5" /> Export CSV
            </button>
          </div>
        </div>
      </header>

      {/* Main Pipeline View */}
      <main className="flex-1 p-8 overflow-x-auto">
        <div className="max-w-[1600px] mx-auto flex gap-8 min-w-max h-full">
          {pipelines.map((column, i) => (
            <div 
              key={i} 
              className="w-[340px] flex flex-col"
              onDragOver={handleDragOver}
              onDrop={(e) => handleDrop(e, column.id)}
            >
              {/* Column Header */}
              <div className="flex items-center justify-between mb-6 px-2">
                <div className="flex items-center gap-3">
                  <div className={`w-2 h-2 rounded-full ${column.color}`} />
                  <h3 className="text-xs font-black text-slate-900 uppercase tracking-widest italic font-serif">
                    {column.title}
                  </h3>
                  <span className="text-[10px] font-mono bg-slate-200/50 text-slate-500 px-1.5 py-0.5 rounded">
                    {column.count}
                  </span>
                </div>
                <span className="text-[10px] font-mono font-bold text-slate-400 tracking-tighter">
                  {column.amount}
                </span>
              </div>
              
              {/* Cards Container */}
              <div className="flex-1 space-y-4">
                {column.cards.map((card, j) => (
                  <div 
                    key={j} 
                    draggable
                    onDragStart={(e) => handleDragStart(e, card.id, column.id)}
                    className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm hover:shadow-md hover:border-teal-200 transition-all group relative overflow-hidden cursor-grab active:cursor-grabbing"
                  >
                    {/* Priority Indicator */}
                    <div className={`absolute top-0 left-0 w-1 h-full ${
                      card.priority === 'High' ? 'bg-red-500' : 
                      card.priority === 'Medium' ? 'bg-amber-500' : 
                      card.priority === 'Low' ? 'bg-blue-500' : 'bg-teal-500'
                    }`} />

                    <div className="flex items-start justify-between mb-4">
                      <div className="flex flex-col">
                        <span className="text-[10px] font-mono text-slate-400 uppercase mb-1">{card.id}</span>
                        <h4 className="text-sm font-bold text-slate-900 group-hover:text-teal-700 transition-colors">
                          {card.patient}
                        </h4>
                      </div>
                      <button className="p-1.5 text-slate-300 hover:text-slate-600 hover:bg-slate-50 rounded-lg transition-all">
                        <MoreHorizontal className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="grid grid-cols-2 gap-4 mb-5">
                      <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                        <div className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-1 flex items-center gap-1">
                          <DollarSign className="w-3 h-3" /> Amount
                        </div>
                        <div className="text-sm font-mono font-black text-slate-900">{card.amount}</div>
                      </div>
                      <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                        <div className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-1 flex items-center gap-1">
                          <Clock className="w-3 h-3" /> Aging
                        </div>
                        <div className="text-sm font-mono font-black text-slate-900">{card.days}d</div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-4 border-t border-slate-50">
                      <div className="flex items-center gap-2">
                        <span className={`text-[9px] font-bold px-2 py-0.5 rounded uppercase tracking-widest ${
                          card.type === 'Co-pay' ? 'bg-blue-50 text-blue-600' :
                          card.type === 'Deductible' ? 'bg-purple-50 text-purple-600' :
                          'bg-slate-50 text-slate-600'
                        }`}>
                          {card.type}
                        </span>
                      </div>
                      <div className="flex -space-x-2">
                        <div className="w-6 h-6 rounded-full bg-teal-100 border-2 border-white flex items-center justify-center text-[8px] font-bold text-teal-700">
                          AI
                        </div>
                        <div className="w-6 h-6 rounded-full bg-slate-100 border-2 border-white flex items-center justify-center text-[8px] font-bold text-slate-500">
                          {card.patient[0]}
                        </div>
                      </div>
                    </div>

                    {/* Hover Actions */}
                    <div className="absolute inset-x-0 bottom-0 bg-white/95 backdrop-blur-sm p-3 flex items-center justify-center gap-4 translate-y-full group-hover:translate-y-0 transition-transform border-t border-slate-100">
                      <button className="p-2 text-slate-400 hover:text-teal-600 transition-all" title="Edit Case">
                        <Edit3 className="w-4 h-4" />
                      </button>
                      <button className="p-2 text-slate-400 hover:text-blue-600 transition-all" title="Share Case">
                        <Share2 className="w-4 h-4" />
                      </button>
                      <button className="p-2 text-slate-400 hover:text-red-600 transition-all" title="Delete Case">
                        <Trash2 className="w-4 h-4" />
                      </button>
                      <div className="h-4 w-px bg-slate-200 mx-1" />
                      <button className="flex items-center gap-1.5 px-3 py-1.5 bg-teal-600 text-white rounded-lg text-[10px] font-bold uppercase tracking-widest hover:bg-teal-700 transition-all">
                        Process <ArrowRight className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                ))}
                
                <button className="w-full py-6 border-2 border-dashed border-slate-200 rounded-2xl text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400 hover:text-teal-600 hover:border-teal-200 hover:bg-white transition-all flex flex-col items-center justify-center gap-2">
                  <Plus className="w-5 h-5" />
                  Initialize Case
                </button>
              </div>
            </div>
          ))}
        </div>
      </main>

      {/* Footer / Status Bar */}
      <footer className="bg-white border-t border-slate-200 px-8 py-3 flex items-center justify-between text-[10px] font-bold text-slate-400 uppercase tracking-widest">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <div className="w-1.5 h-1.5 bg-teal-500 rounded-full" />
            Live Sync Active
          </div>
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-3.5 h-3.5" />
            HIPAA Compliant Session
          </div>
        </div>
        <div className="flex items-center gap-4">
          <span>Last Updated: 08:59:49 UTC</span>
          <span className="text-slate-200">|</span>
          <span>System Load: 12%</span>
        </div>
      </footer>
    </div>
  );
}

