'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  Building2, 
  Users, 
  Plus, 
  CheckCircle2, 
  ArrowRight, 
  X, 
  Search
} from 'lucide-react';
import { Team } from '@/types/masLms';
import { MasDataStore } from '@/lib/mockData';

export default function TeamsPage() {
  const [teams, setTeams] = useState<Team[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // New Team Form State
  const [newTeam, setNewTeam] = useState({
    name: '',
    leadName: 'Alex Morgan',
    leadEmail: 'alex.morgan@mascloud.studio',
    description: '',
    assignedTracks: 'Security & Compliance, Technical Architecture'
  });

  useEffect(() => {
    setTeams(MasDataStore.getTeams());
  }, []);

  const filteredTeams = teams.filter(team =>
    team.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    team.leadName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    team.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleCreateTeam = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTeam.name.trim()) return;

    const tracks = newTeam.assignedTracks
      .split(',')
      .map(t => t.trim())
      .filter(Boolean);

    const created = MasDataStore.addTeam({
      name: newTeam.name.trim(),
      leadName: newTeam.leadName.trim() || 'Alex Morgan',
      leadEmail: newTeam.leadEmail.trim() || 'alex.morgan@mascloud.studio',
      leadAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=250&auto=format&fit=crop',
      description: newTeam.description.trim() || 'Enterprise operational cohort.',
      assignedTracks: tracks.length > 0 ? tracks : ['General Onboarding']
    });

    setTeams(prev => [created, ...prev]);
    setIsModalOpen(false);
    setNewTeam({
      name: '',
      leadName: 'Alex Morgan',
      leadEmail: 'alex.morgan@mascloud.studio',
      description: '',
      assignedTracks: 'Security & Compliance, Technical Architecture'
    });
    showToast(`Team "${created.name}" created successfully!`);
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
              <Building2 className="w-3.5 h-3.5" />
              Organizational Cohorts
            </span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-[#1E293B]">
            Enterprise Teams & Departments
          </h1>
          <p className="text-sm text-[#64748B] mt-1">
            Group learners by department, designate team leads, and monitor collective training progress.
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-sm font-semibold text-white bg-[#7C3AED] hover:bg-[#6D28D9] transition shadow-xs hover:shadow active:scale-[0.98]"
        >
          <Plus className="w-4 h-4" />
          Create Team
        </button>
      </div>

      {/* Search and Filters */}
      <div className="flex items-center justify-between gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search teams by name, lead, or description..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-sm rounded-lg border border-slate-200 bg-[#F1F5F9] text-[#1E293B] placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-[#7C3AED] transition"
          />
        </div>
        <div className="text-xs text-[#64748B] font-medium">
          Showing {filteredTeams.length} of {teams.length} teams
        </div>
      </div>

      {/* Teams Grid (Pure White Cards, Crisp Borders) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredTeams.map(team => {
          return (
            <div
              key={team.id}
              className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm hover:border-slate-300 hover:shadow-md transition flex flex-col justify-between"
            >
              <div>
                {/* Team Card Header */}
                <div className="flex items-start justify-between gap-3 mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-purple-50 border border-purple-100 flex items-center justify-center text-[#7C3AED] font-bold text-sm">
                      {team.name.substring(0, 2).toUpperCase()}
                    </div>
                    <div>
                      <h3 className="font-bold text-[#1E293B] text-base">
                        {team.name}
                      </h3>
                      <span className="text-xs text-[#64748B] inline-flex items-center gap-1 mt-0.5">
                        <Users className="w-3 h-3" />
                        {team.memberCount} Members
                      </span>
                    </div>
                  </div>

                  <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                    {team.completionRate}% Done
                  </span>
                </div>

                <p className="text-xs text-[#64748B] line-clamp-2 mb-4 leading-relaxed">
                  {team.description}
                </p>

                {/* Team Lead Info */}
                <div className="p-3 rounded-xl bg-[#F8FAFC] border border-slate-100 mb-4 flex items-center gap-3">
                  <img
                    src={team.leadAvatar}
                    alt={team.leadName}
                    className="w-9 h-9 rounded-full object-cover border border-slate-200"
                  />
                  <div className="min-w-0">
                    <span className="text-[10px] uppercase font-semibold text-[#64748B] block tracking-wider">
                      Team Lead
                    </span>
                    <p className="text-xs font-bold text-[#1E293B] truncate">
                      {team.leadName}
                    </p>
                  </div>
                </div>

                {/* Assigned Tracks */}
                <div className="mb-4">
                  <span className="text-[11px] font-semibold text-[#64748B] uppercase tracking-wider block mb-2">
                    Assigned Training Tracks
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {team.assignedTracks.map((track, i) => (
                      <span
                        key={i}
                        className="px-2.5 py-1 rounded-md text-[11px] font-medium bg-[#F1F5F9] text-[#1E293B] border border-slate-200"
                      >
                        {track}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Progress Bar & Actions */}
              <div className="pt-4 border-t border-slate-100">
                <div className="flex items-center justify-between text-xs text-[#64748B] mb-1.5">
                  <span>Track Completion</span>
                  <span className="font-bold text-[#1E293B]">
                    {team.completionRate}%
                  </span>
                </div>
                <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden mb-4">
                  <div
                    className="h-full bg-[#7C3AED] rounded-full transition-all duration-300"
                    style={{ width: `${team.completionRate}%` }}
                  />
                </div>

                <Link
                  href="/people"
                  className="w-full inline-flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl text-xs font-bold text-[#7C3AED] bg-purple-50 hover:bg-purple-100 border border-purple-100 transition"
                >
                  View Team Roster
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          );
        })}
      </div>

      {/* Create Team Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl max-w-md w-full border border-slate-200 shadow-2xl overflow-hidden">
            <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-[#1E293B]">
                  Create Cohort / Team
                </h3>
                <p className="text-xs text-[#64748B] mt-0.5">
                  Set up a department group to streamline curricula assignments.
                </p>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateTeam} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-[#1E293B] mb-1.5">
                  Team Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Compliance & Legal Review"
                  value={newTeam.name}
                  onChange={e => setNewTeam({ ...newTeam, name: e.target.value })}
                  className="w-full px-3.5 py-2 text-sm rounded-lg border border-slate-200 bg-white text-[#1E293B] placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-[#7C3AED]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#1E293B] mb-1.5">
                  Designated Team Lead Name
                </label>
                <input
                  type="text"
                  placeholder="Alex Morgan"
                  value={newTeam.leadName}
                  onChange={e => setNewTeam({ ...newTeam, leadName: e.target.value })}
                  className="w-full px-3.5 py-2 text-sm rounded-lg border border-slate-200 bg-white text-[#1E293B] focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-[#7C3AED]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#1E293B] mb-1.5">
                  Description & Department Scope
                </label>
                <textarea
                  rows={2}
                  placeholder="Briefly describe this cohort's operational focus..."
                  value={newTeam.description}
                  onChange={e => setNewTeam({ ...newTeam, description: e.target.value })}
                  className="w-full px-3.5 py-2 text-xs rounded-lg border border-slate-200 bg-white text-[#1E293B] placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-[#7C3AED] resize-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#1E293B] mb-1.5">
                  Assigned Training Tracks (comma separated)
                </label>
                <input
                  type="text"
                  placeholder="Cybersecurity, Financial Audit, Ethics"
                  value={newTeam.assignedTracks}
                  onChange={e => setNewTeam({ ...newTeam, assignedTracks: e.target.value })}
                  className="w-full px-3.5 py-2 text-xs rounded-lg border border-slate-200 bg-white text-[#1E293B] focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-[#7C3AED]"
                />
              </div>

              <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-lg text-xs font-medium text-[#64748B] hover:bg-slate-100 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg text-xs font-semibold text-white bg-[#7C3AED] hover:bg-[#6D28D9] transition shadow-xs"
                >
                  Create Team
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

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
