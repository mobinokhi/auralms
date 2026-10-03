'use client';

import React, { useState, useEffect } from 'react';
import { 
  BarChart3, 
  Search, 
  TrendingUp, 
  CheckCircle2, 
  Clock, 
  Award, 
  ShieldCheck, 
  FileSpreadsheet
} from 'lucide-react';
import { ReportRosterRow } from '@/types/masLms';
import { MasDataStore } from '@/lib/mockData';

export default function ReportsPage() {
  const [roster, setRoster] = useState<ReportRosterRow[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [teamFilter, setTeamFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  useEffect(() => {
    setRoster(MasDataStore.getReportRoster());
  }, []);

  const filteredRoster = roster.filter(row => {
    const matchesTeam = teamFilter === 'All' || row.team === teamFilter;
    const matchesStatus = statusFilter === 'All' || row.status === statusFilter;
    const matchesSearch = 
      row.learnerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      row.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      row.courseTitle.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesTeam && matchesStatus && matchesSearch;
  });

  // Calculate executive summary metrics
  const totalEnrollments = roster.length;
  const completedCount = roster.filter(r => r.status === 'Completed').length;
  const overallCompletionRate = totalEnrollments > 0 ? Math.round((completedCount / totalEnrollments) * 100) : 0;
  
  const scores = roster.map(r => r.score).filter((s): s is number => s !== null);
  const avgScore = scores.length > 0 ? (scores.reduce((a, b) => a + b, 0) / scores.length).toFixed(1) : '91.4';

  const handleExportCSV = () => {
    const headers = ['Learner Name', 'Email', 'Team', 'Course Title', 'Progress (%)', 'Status', 'Assessment Score', 'Last Active'];
    const rows = filteredRoster.map(r => [
      `"${r.learnerName}"`,
      `"${r.email}"`,
      `"${r.team}"`,
      `"${r.courseTitle}"`,
      r.progress,
      `"${r.status}"`,
      r.score !== null ? `${r.score}%` : 'N/A',
      `"${r.lastActive}"`
    ]);

    const csvContent = [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `MAS_LMS_Audit_Report_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    showToast('Exported audit report as CSV successfully.');
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
              <BarChart3 className="w-3.5 h-3.5" />
              Executive Analytics
            </span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-[#1E293B]">
            Compliance & Training Reports
          </h1>
          <p className="text-sm text-[#64748B] mt-1">
            Real-time completion tracking, audit readiness metrics, and assessment pass rates.
          </p>
        </div>

        <button
          onClick={handleExportCSV}
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-sm font-semibold text-white bg-[#7C3AED] hover:bg-[#6D28D9] transition shadow-xs active:scale-[0.98]"
        >
          <FileSpreadsheet className="w-4 h-4 text-emerald-200" />
          Export CSV Report
        </button>
      </div>

      {/* Executive Summary Metrics Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="flex items-center justify-between text-xs text-[#64748B] mb-2">
            <span className="font-semibold">Overall Completion</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          </div>
          <p className="text-2xl font-extrabold text-[#1E293B]">{overallCompletionRate}%</p>
          <p className="text-xs text-emerald-600 mt-1 font-semibold flex items-center gap-1">
            <TrendingUp className="w-3 h-3" />
            +6.4% from last quarter
          </p>
        </div>

        <div className="p-5 rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="flex items-center justify-between text-xs text-[#64748B] mb-2">
            <span className="font-semibold">Avg Assessment Score</span>
            <Award className="w-4 h-4 text-[#7C3AED]" />
          </div>
          <p className="text-2xl font-extrabold text-[#1E293B]">{avgScore}%</p>
          <p className="text-xs text-[#64748B] mt-1">Passing benchmark: 80%</p>
        </div>

        <div className="p-5 rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="flex items-center justify-between text-xs text-[#64748B] mb-2">
            <span className="font-semibold">Logged Training Hours</span>
            <Clock className="w-4 h-4 text-blue-600" />
          </div>
          <p className="text-2xl font-extrabold text-[#1E293B]">1,480 hrs</p>
          <p className="text-xs text-blue-600 mt-1 font-semibold">99.2% verifiable audit trail</p>
        </div>

        <div className="p-5 rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="flex items-center justify-between text-xs text-[#64748B] mb-2">
            <span className="font-semibold">Audit Readiness</span>
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
          </div>
          <p className="text-2xl font-extrabold text-emerald-600">96.8%</p>
          <p className="text-xs text-[#64748B] mt-1">SOC 2 & ISO 27001 aligned</p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search learner, email, or course..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-sm rounded-lg border border-slate-200 bg-[#F1F5F9] text-[#1E293B] placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-[#7C3AED] transition"
          />
        </div>

        <div className="flex items-center gap-2">
          <select
            value={teamFilter}
            onChange={e => setTeamFilter(e.target.value)}
            className="text-xs font-medium rounded-lg border border-slate-200 bg-white text-[#1E293B] py-2 px-3 focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-[#7C3AED]"
          >
            <option value="All">All Departments</option>
            <option value="Operations">Operations</option>
            <option value="Finance & Advisory">Finance & Advisory</option>
            <option value="IT Support">IT Support</option>
          </select>

          <select
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value)}
            className="text-xs font-medium rounded-lg border border-slate-200 bg-white text-[#1E293B] py-2 px-3 focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-[#7C3AED]"
          >
            <option value="All">All Statuses</option>
            <option value="Completed">Completed</option>
            <option value="In Progress">In Progress</option>
            <option value="Not Started">Not Started</option>
          </select>
        </div>
      </div>

      {/* Completion Breakdown Table */}
      <div className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
        <div className="p-4 sm:px-6 border-b border-slate-200 flex items-center justify-between">
          <h3 className="text-sm font-bold text-[#1E293B]">
            Course Completion & Assessment Roster
          </h3>
          <span className="text-xs text-[#64748B]">
            Showing {filteredRoster.length} records
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-[#1E293B]">
            <thead className="bg-[#F8FAFC] text-xs font-semibold text-[#64748B] border-b border-slate-200">
              <tr>
                <th className="py-3 px-4 sm:px-6">Learner Details</th>
                <th className="py-3 px-4">Department</th>
                <th className="py-3 px-4">Enrolled Course</th>
                <th className="py-3 px-4">Progress</th>
                <th className="py-3 px-4">Score</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 hidden md:table-cell text-right">Last Active</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredRoster.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-[#64748B] text-xs">
                    No completion records match your filters.
                  </td>
                </tr>
              ) : (
                filteredRoster.map(row => {
                  return (
                    <tr
                      key={row.id}
                      className="hover:bg-[#F8FAFC] transition-colors"
                    >
                      <td className="py-3 px-4 sm:px-6">
                        <div className="font-bold text-[#1E293B] text-xs">
                          {row.learnerName}
                        </div>
                        <div className="text-[11px] text-[#64748B] mt-0.5">
                          {row.email}
                        </div>
                      </td>

                      <td className="py-3 px-4 text-xs text-[#64748B] font-medium">
                        {row.team}
                      </td>

                      <td className="py-3 px-4 text-xs font-semibold text-[#1E293B] max-w-xs truncate">
                        {row.courseTitle}
                      </td>

                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2">
                          <div className="w-16 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                            <div
                              className={`h-full rounded-full ${
                                row.progress === 100
                                  ? 'bg-emerald-500'
                                  : row.progress > 0
                                  ? 'bg-[#7C3AED]'
                                  : 'bg-transparent'
                              }`}
                              style={{ width: `${row.progress}%` }}
                            />
                          </div>
                          <span className="text-xs font-bold text-[#1E293B]">
                            {row.progress}%
                          </span>
                        </div>
                      </td>

                      <td className="py-3 px-4 text-xs">
                        {row.score !== null ? (
                          <span className={`font-bold ${
                            row.score >= 80 ? 'text-emerald-600' : 'text-rose-500'
                          }`}>
                            {row.score}%
                          </span>
                        ) : (
                          <span className="text-slate-400">-</span>
                        )}
                      </td>

                      <td className="py-3 px-4">
                        {row.status === 'Completed' ? (
                          <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                            Completed
                          </span>
                        ) : row.status === 'In Progress' ? (
                          <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-semibold bg-purple-50 text-[#7C3AED] border border-purple-200">
                            In Progress
                          </span>
                        ) : (
                          <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-semibold bg-slate-100 text-[#64748B] border border-slate-200">
                            Not Started
                          </span>
                        )}
                      </td>

                      <td className="py-3 px-4 text-xs text-[#64748B] hidden md:table-cell text-right">
                        {row.lastActive}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
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
