'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { DataRepository } from '@/lib/data-repository';
import { AnalyticsKPIs, LearnerRosterItem, EnrollmentStatus } from '@/types/lms';
import { 
  BarChart3, 
  Users, 
  CheckCircle2, 
  TrendingUp, 
  HelpCircle, 
  Search, 
  Download, 
  ArrowUpRight, 
  Building, 
  Layers 
} from 'lucide-react';

export default function AdminDashboardPage() {
  const [kpis, setKpis] = useState<AnalyticsKPIs | null>(null);
  const [roster, setRoster] = useState<LearnerRosterItem[]>([]);
  const [filterStatus, setFilterStatus] = useState<'all' | EnrollmentStatus>('all');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    async function loadAnalytics() {
      const data = await DataRepository.getAdminAnalytics();
      setKpis(data.kpis);
      setRoster(data.roster);
    }
    loadAnalytics();
  }, []);

  const filteredRoster = roster.filter((item) => {
    const matchesFilter = filterStatus === 'all' ? true : item.status === filterStatus;
    const matchesSearch =
      item.learnerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.courseTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.department.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const exportCSV = () => {
    const headers = ['Learner Name,Email,Department,Course,Progress %,Status,Quiz Score,Last Active'];
    const rows = filteredRoster.map(r => 
      `"${r.learnerName}","${r.email}","${r.department}","${r.courseTitle}",${r.progressPercentage}%,"${r.status}",${r.quizScore ?? 'N/A'},"${r.lastActive}"`
    );
    const blob = new Blob([[headers, ...rows].join('\n')], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `litmos_compliance_roster_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Header & Controls */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-6">
          <div>
            <div className="flex items-center gap-2 text-indigo-400 text-xs font-semibold uppercase tracking-wider mb-1">
              <BarChart3 className="h-4 w-4" />
              Litmos Enterprise Intelligence
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Compliance & Learner Analytics
            </h1>
            <p className="mt-1 text-xs sm:text-sm text-slate-400">
              Track workforce compliance velocity, curriculum completion rates, and knowledge retention benchmarks.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={exportCSV}
              className="flex items-center gap-2 rounded-xl border border-slate-800 bg-slate-900 px-4 py-2 text-xs font-semibold text-slate-200 hover:bg-slate-800 transition-colors shadow-sm"
            >
              <Download className="h-3.5 w-3.5 text-indigo-400" />
              Export Roster (CSV)
            </button>
            <Link
              href="/author"
              className="flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2 text-xs font-semibold text-white hover:bg-indigo-500 shadow-md shadow-indigo-500/20"
            >
              <Layers className="h-3.5 w-3.5" />
              Authoring Studio
            </Link>
          </div>
        </div>

        {/* KPI Summary Cards */}
        <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {/* 1. Total Enrolled */}
          <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5 backdrop-blur-sm">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                Total Enrolled
              </span>
              <div className="rounded-lg bg-indigo-500/20 p-2 text-indigo-400">
                <Users className="h-4 w-4" />
              </div>
            </div>
            <div className="mt-3 flex items-baseline gap-2">
              <span className="text-3xl font-black text-white">
                {kpis ? kpis.totalEnrolled.toLocaleString() : '1,420'}
              </span>
              <span className="flex items-center text-xs font-semibold text-emerald-400">
                <ArrowUpRight className="h-3.5 w-3.5" /> +12% MoM
              </span>
            </div>
            <p className="mt-1 text-[11px] text-slate-500">Across 18 enterprise curricula</p>
          </div>

          {/* 2. Active Learners */}
          <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5 backdrop-blur-sm">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                Active Learners
              </span>
              <div className="rounded-lg bg-purple-500/20 p-2 text-purple-400">
                <TrendingUp className="h-4 w-4" />
              </div>
            </div>
            <div className="mt-3 flex items-baseline gap-2">
              <span className="text-3xl font-black text-white">
                {kpis ? kpis.activeLearners.toLocaleString() : '984'}
              </span>
              <span className="text-xs font-semibold text-slate-400">
                (69.2% engagement)
              </span>
            </div>
            <p className="mt-1 text-[11px] text-slate-500">Learners active in past 14 days</p>
          </div>

          {/* 3. Average Completion Rate */}
          <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5 backdrop-blur-sm">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                Avg Completion Rate
              </span>
              <div className="rounded-lg bg-emerald-500/20 p-2 text-emerald-400">
                <CheckCircle2 className="h-4 w-4" />
              </div>
            </div>
            <div className="mt-3 flex items-baseline gap-2">
              <span className="text-3xl font-black text-emerald-400">
                {kpis ? `${kpis.averageCompletionRate}%` : '84.6%'}
              </span>
              <span className="flex items-center text-xs font-semibold text-emerald-400">
                <ArrowUpRight className="h-3.5 w-3.5" /> On Target
              </span>
            </div>
            <p className="mt-1 text-[11px] text-slate-500">Exceeds corporate SLA threshold (80%)</p>
          </div>

          {/* 4. Average Quiz Score */}
          <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5 backdrop-blur-sm">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                Avg Quiz Score
              </span>
              <div className="rounded-lg bg-pink-500/20 p-2 text-pink-400">
                <HelpCircle className="h-4 w-4" />
              </div>
            </div>
            <div className="mt-3 flex items-baseline gap-2">
              <span className="text-3xl font-black text-white">
                {kpis ? `${kpis.averageQuizScore}%` : '92.4%'}
              </span>
              <span className="text-xs font-semibold text-indigo-400">
                First Attempt
              </span>
            </div>
            <p className="mt-1 text-[11px] text-slate-500">Based on 2,840 knowledge checks</p>
          </div>
        </div>

        {/* Tabular Roster */}
        <div className="mt-10 rounded-2xl border border-slate-800 bg-slate-900/50 backdrop-blur-md overflow-hidden shadow-xl">
          <div className="p-5 border-b border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900/80">
            <div>
              <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                Workforce Enrollment Roster
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Audit trail of individual employee progress and certification status
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <div className="flex items-center rounded-lg border border-slate-800 bg-slate-950 p-1 text-xs">
                {(['all', 'in_progress', 'completed', 'not_started'] as const).map((s) => (
                  <button
                    key={s}
                    onClick={() => setFilterStatus(s)}
                    className={`px-3 py-1 rounded-md capitalize font-medium transition-colors ${
                      filterStatus === s
                        ? 'bg-indigo-600 text-white shadow-sm'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    {s.replace('_', ' ')}
                  </button>
                ))}
              </div>

              <div className="relative w-64">
                <Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-500" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search learner, email, dept..."
                  className="w-full rounded-lg border border-slate-800 bg-slate-950 pl-9 pr-3 py-1.5 text-xs text-slate-200 placeholder-slate-500 focus:border-indigo-500 focus:outline-none"
                />
              </div>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-slate-800 bg-slate-950/60 font-semibold uppercase tracking-wider text-slate-400 text-[10px]">
                <tr>
                  <th className="px-5 py-3.5">Learner & Department</th>
                  <th className="px-5 py-3.5">Enrolled Course</th>
                  <th className="px-5 py-3.5">Progress</th>
                  <th className="px-5 py-3.5">Quiz Score</th>
                  <th className="px-5 py-3.5">Status</th>
                  <th className="px-5 py-3.5">Last Active</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/80">
                {filteredRoster.map((item) => {
                  const isCompleted = item.status === 'completed';
                  const isInProgress = item.status === 'in_progress';

                  return (
                    <tr key={item.id} className="hover:bg-slate-850/40 transition-colors">
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={item.avatarUrl}
                            alt={item.learnerName}
                            className="h-9 w-9 rounded-full object-cover ring-1 ring-slate-700"
                          />
                          <div>
                            <div className="font-bold text-white">{item.learnerName}</div>
                            <div className="text-[11px] text-slate-400">{item.email}</div>
                            <div className="text-[10px] text-indigo-400 flex items-center gap-1 mt-0.5">
                              <Building className="h-3 w-3" />
                              {item.department}
                            </div>
                          </div>
                        </div>
                      </td>

                      <td className="px-5 py-4 font-medium text-slate-200">
                        {item.courseTitle}
                      </td>

                      <td className="px-5 py-4">
                        <div className="w-32">
                          <div className="flex items-center justify-between text-[11px] mb-1">
                            <span className="text-slate-400">{item.progressPercentage}%</span>
                          </div>
                          <div className="h-1.5 w-full rounded-full bg-slate-800 overflow-hidden">
                            <div
                              className={`h-full rounded-full ${
                                isCompleted
                                  ? 'bg-emerald-500'
                                  : 'bg-gradient-to-r from-indigo-500 to-purple-500'
                              }`}
                              style={{ width: `${item.progressPercentage}%` }}
                            />
                          </div>
                        </div>
                      </td>

                      <td className="px-5 py-4">
                        {item.quizScore !== null ? (
                          <span className={`inline-flex items-center gap-1 font-bold ${
                            item.quizScore >= 80 ? 'text-emerald-400' : 'text-amber-400'
                          }`}>
                            {item.quizScore}%
                          </span>
                        ) : (
                          <span className="text-slate-500 text-[11px]">Unassessed</span>
                        )}
                      </td>

                      <td className="px-5 py-4">
                        <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border ${
                          isCompleted
                            ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
                            : isInProgress
                            ? 'bg-amber-500/20 text-amber-300 border-amber-500/30'
                            : 'bg-slate-800 text-slate-400 border-slate-700'
                        }`}>
                          {item.status.replace('_', ' ')}
                        </span>
                      </td>

                      <td className="px-5 py-4 text-slate-400 text-[11px]">
                        {item.lastActive}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
