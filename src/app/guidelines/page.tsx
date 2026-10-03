'use client';

import React, { useState, useEffect } from 'react';
import { 
  FileText, 
  Search, 
  ChevronDown, 
  ChevronUp, 
  CheckCircle2, 
  Clock, 
  Download, 
  ShieldCheck, 
  BookMarked
} from 'lucide-react';
import { Guideline } from '@/types/masLms';
import { MasDataStore } from '@/lib/mockData';

export default function GuidelinesPage() {
  const [guidelines, setGuidelines] = useState<Guideline[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [acknowledgedIds, setAcknowledgedIds] = useState<string[]>([]);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  useEffect(() => {
    const list = MasDataStore.getGuidelines();
    setGuidelines(list);
    if (list.length > 0) {
      setExpandedId(list[0].id);
    }
  }, []);

  const categories = ['All', 'Security', 'HR & Conduct', 'Operations', 'Engineering SOP'];

  const filteredGuidelines = guidelines.filter(item => {
    const matchesCategory = selectedCategory === 'All' || item.category === selectedCategory;
    const matchesSearch = 
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.summary.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const toggleExpand = (id: string) => {
    setExpandedId(prev => (prev === id ? null : id));
  };

  const handleAcknowledge = (id: string, title: string) => {
    if (!acknowledgedIds.includes(id)) {
      setAcknowledgedIds(prev => [...prev, id]);
      showToast(`Acknowledged policy: ${title}`);
    }
  };

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 pb-6">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-purple-50 text-[#7C3AED] border border-purple-200">
              <BookMarked className="w-3.5 h-3.5" />
              Institutional Knowledge Base
            </span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-[#1E293B]">
            Compliance & Operational Guidelines
          </h1>
          <p className="text-sm text-[#64748B] mt-1">
            Authoritative operating procedures, regulatory frameworks, and employee conduct standards.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs font-semibold text-[#1E293B] bg-white border border-slate-200 px-3 py-2 rounded-xl shadow-xs">
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          <span>ISO 27001 & SOC 2 Type II Aligned</span>
        </div>
      </div>

      {/* Filter Toolbar */}
      <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search policies, procedures, or SOP keywords..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-sm rounded-lg border border-slate-200 bg-[#F1F5F9] text-[#1E293B] placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-[#7C3AED] transition"
          />
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 no-scrollbar">
          {categories.map(category => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
                selectedCategory === category
                  ? 'bg-[#7C3AED] text-white shadow-xs'
                  : 'bg-white text-[#64748B] hover:bg-slate-100 border border-slate-200'
              }`}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      {/* Guidelines Accordion List */}
      <div className="space-y-4">
        {filteredGuidelines.length === 0 ? (
          <div className="p-12 text-center border border-dashed border-slate-200 rounded-2xl bg-white">
            <FileText className="w-10 h-10 text-slate-400 mx-auto mb-3" />
            <h3 className="text-sm font-bold text-[#1E293B]">No policies found</h3>
            <p className="text-xs text-[#64748B] mt-1">
              No institutional guidelines match your current filter selection.
            </p>
          </div>
        ) : (
          filteredGuidelines.map(item => {
            const isExpanded = expandedId === item.id;
            const isAcknowledged = acknowledgedIds.includes(item.id);

            return (
              <div
                key={item.id}
                className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden transition-all duration-200"
              >
                {/* Guideline Header */}
                <div
                  onClick={() => toggleExpand(item.id)}
                  className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 cursor-pointer hover:bg-[#F8FAFC] transition select-none"
                >
                  <div className="space-y-1.5 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-purple-50 text-[#7C3AED] border border-purple-200">
                        {item.category}
                      </span>
                      <span className="text-xs text-[#64748B] flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {item.readTime} read
                      </span>
                      <span className="text-xs text-[#64748B] hidden md:inline">
                        • Last revised: {item.lastUpdated}
                      </span>
                    </div>

                    <h3 className="text-base font-bold text-[#1E293B] flex items-center gap-2">
                      {item.title}
                      {isAcknowledged && (
                        <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                          <CheckCircle2 className="w-3 h-3" />
                          Acknowledged
                        </span>
                      )}
                    </h3>

                    <p className="text-xs text-[#64748B] line-clamp-1">
                      {item.summary}
                    </p>
                  </div>

                  <div className="flex items-center gap-3 self-end sm:self-center">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        showToast(`Exporting ${item.title} as PDF...`);
                      }}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition"
                      title="Download PDF"
                    >
                      <Download className="w-4 h-4" />
                    </button>
                    <div className="p-1 rounded-lg text-slate-400">
                      {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                    </div>
                  </div>
                </div>

                {/* Expanded Policy Detail Sections */}
                {isExpanded && (
                  <div className="px-6 pb-6 pt-2 border-t border-slate-100 space-y-5 animate-in fade-in duration-200">
                    <div className="text-xs text-[#1E293B] leading-relaxed bg-[#F8FAFC] p-4 rounded-xl border border-slate-200">
                      <strong>Executive Summary:</strong> {item.summary}
                    </div>

                    <div className="space-y-4">
                      {item.sections.map((sec, idx) => (
                        <div key={idx} className="space-y-1.5">
                          <h4 className="text-xs font-bold uppercase tracking-wider text-[#1E293B]">
                            {sec.title}
                          </h4>
                          <p className="text-xs text-[#64748B] leading-relaxed whitespace-pre-line">
                            {sec.content}
                          </p>
                        </div>
                      ))}
                    </div>

                    {/* Bottom Acknowledgment Bar */}
                    <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3">
                      <span className="text-[11px] text-[#64748B]">
                        Official Guideline Document • Version 2.4 • M.A.S Cloud Studio
                      </span>

                      <button
                        onClick={() => handleAcknowledge(item.id, item.title)}
                        disabled={isAcknowledged}
                        className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition ${
                          isAcknowledged
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200 cursor-default'
                            : 'bg-[#7C3AED] hover:bg-[#6D28D9] text-white shadow-xs'
                        }`}
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        {isAcknowledged ? 'Guideline Acknowledged' : 'Sign & Acknowledge Policy'}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2 px-4 py-2.5 rounded-lg bg-[#1E293B] text-white text-xs font-medium shadow-xl border border-slate-700 animate-in slide-in-from-bottom-2 duration-200">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}
    </div>
  );
}
