'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { 
  Users, 
  Search, 
  UserPlus, 
  Mail, 
  Building2, 
  Trash2, 
  X, 
  CheckCircle2, 
  Clock,
  Filter
} from 'lucide-react';
import { User, UserRole, Team } from '@/types/masLms';
import { MasDataStore } from '@/lib/mockData';

function PeopleDirectoryContent() {
  const searchParams = useSearchParams();
  const urlTeam = searchParams.get('team') || 'All';

  const [users, setUsers] = useState<User[]>([]);
  const [teams, setTeams] = useState<Team[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [teamFilter, setTeamFilter] = useState<string>(urlTeam);
  const [roleFilter, setRoleFilter] = useState<string>('All');
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Invite Form State
  const [inviteForm, setInviteForm] = useState({
    name: '',
    email: '',
    role: 'Learner' as UserRole,
    team: 'Operations'
  });

  useEffect(() => {
    const loadedUsers = MasDataStore.getUsers();
    const loadedTeams = MasDataStore.getTeams();
    setUsers(loadedUsers);
    setTeams(loadedTeams);
    if (loadedTeams.length > 0) {
      setInviteForm(prev => ({
        ...prev,
        team: urlTeam !== 'All' ? urlTeam : loadedTeams[0].name
      }));
    }
  }, [urlTeam]);

  useEffect(() => {
    if (urlTeam && urlTeam !== 'All') {
      setTeamFilter(urlTeam);
    }
  }, [urlTeam]);

  const filteredUsers = users.filter(user => {
    const matchesTeam = teamFilter === 'All' || user.team.toLowerCase() === teamFilter.toLowerCase();
    const matchesRole = roleFilter === 'All' || user.role === roleFilter;
    const matchesStatus = statusFilter === 'All' || user.status === statusFilter;
    const matchesSearch = 
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.team.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesTeam && matchesRole && matchesStatus && matchesSearch;
  });

  const handleOpenInvite = (presetTeam?: string) => {
    const defaultTeam = presetTeam || (teamFilter !== 'All' ? teamFilter : (teams[0]?.name || 'General'));
    setInviteForm({
      name: '',
      email: '',
      role: 'Learner',
      team: defaultTeam
    });
    setIsInviteModalOpen(true);
  };

  const handleInviteSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inviteForm.name.trim() || !inviteForm.email.trim()) return;

    const newUser = MasDataStore.addUser({
      name: inviteForm.name.trim(),
      email: inviteForm.email.trim(),
      role: inviteForm.role,
      team: inviteForm.team,
      avatarUrl: `https://images.unsplash.com/photo-${1530000000000 + Math.floor(Math.random() * 100000000)}?q=80&w=250&auto=format&fit=crop`,
      status: 'Active'
    });

    setUsers(MasDataStore.getUsers());
    setTeams(MasDataStore.getTeams());
    setIsInviteModalOpen(false);
    setInviteForm({
      name: '',
      email: '',
      role: 'Learner',
      team: teams[0]?.name || 'Operations'
    });
    showToast(`Added ${newUser.name} to ${inviteForm.team}!`);
  };

  const handleDeleteUser = (userId: string, name: string) => {
    if (confirm(`Are you sure you want to remove ${name} from M.A.S LMS?`)) {
      MasDataStore.removeUser(userId);
      setUsers(MasDataStore.getUsers());
      setTeams(MasDataStore.getTeams());
      showToast(`${name} removed from organization.`);
    }
  };

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const getRoleBadge = (role: UserRole) => {
    switch (role) {
      case 'Admin':
        return 'bg-purple-50 text-[#7C3AED] border-purple-200';
      case 'Instructor':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      default:
        return 'bg-slate-100 text-[#64748B] border-slate-200';
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 pb-6">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-purple-50 text-[#7C3AED] border border-purple-200">
              <Users className="w-3.5 h-3.5" />
              Directory & Access Control
            </span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-[#1E293B]">
            People & Permissions
          </h1>
          <p className="text-sm text-[#64748B] mt-1">
            Manage organization members, assign training tracks, and oversee role governance.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={() => handleOpenInvite()}
            className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-sm font-semibold text-white bg-[#7C3AED] hover:bg-[#6D28D9] transition shadow-xs active:scale-[0.98]"
          >
            <UserPlus className="w-4 h-4" />
            {teamFilter !== 'All' ? `Add Member to ${teamFilter}` : 'Add / Invite Member'}
          </button>
        </div>
      </div>

      {/* Directory Metrics Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-4 rounded-2xl border border-slate-200 bg-white shadow-sm">
          <p className="text-xs font-semibold text-[#64748B]">Total Members</p>
          <p className="text-2xl font-extrabold text-[#1E293B] mt-1">{users.length}</p>
        </div>
        <div className="p-4 rounded-2xl border border-slate-200 bg-white shadow-sm">
          <p className="text-xs font-semibold text-[#64748B]">Active Learners</p>
          <p className="text-2xl font-extrabold text-emerald-600 mt-1">
            {users.filter(u => u.status === 'Active' && u.role === 'Learner').length}
          </p>
        </div>
        <div className="p-4 rounded-2xl border border-slate-200 bg-white shadow-sm">
          <p className="text-xs font-semibold text-[#64748B]">Instructors & Leads</p>
          <p className="text-2xl font-extrabold text-[#7C3AED] mt-1">
            {users.filter(u => u.role === 'Instructor' || u.role === 'Admin').length}
          </p>
        </div>
        <div className="p-4 rounded-2xl border border-slate-200 bg-white shadow-sm">
          <p className="text-xs font-semibold text-[#64748B]">Configured Teams</p>
          <p className="text-2xl font-extrabold text-[#7C3AED] mt-1">
            {teams.length}
          </p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by name, email, or department..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-sm rounded-lg border border-slate-200 bg-[#F1F5F9] text-[#1E293B] placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-[#7C3AED] transition"
          />
          {searchQuery && (
            <button 
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0">
          {/* Team Filter Dropdown */}
          <select
            value={teamFilter}
            onChange={e => setTeamFilter(e.target.value)}
            className="text-xs font-medium rounded-lg border border-slate-200 bg-white text-[#1E293B] py-2 px-3 focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-[#7C3AED]"
          >
            <option value="All">All Teams ({teams.length})</option>
            {teams.map(t => (
              <option key={t.id} value={t.name}>{t.name}</option>
            ))}
          </select>

          <select
            value={roleFilter}
            onChange={e => setRoleFilter(e.target.value)}
            className="text-xs font-medium rounded-lg border border-slate-200 bg-white text-[#1E293B] py-2 px-3 focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-[#7C3AED]"
          >
            <option value="All">All Roles</option>
            <option value="Admin">Admin</option>
            <option value="Instructor">Instructor</option>
            <option value="Learner">Learner</option>
          </select>

          <select
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value)}
            className="text-xs font-medium rounded-lg border border-slate-200 bg-white text-[#1E293B] py-2 px-3 focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-[#7C3AED]"
          >
            <option value="All">All Statuses</option>
            <option value="Active">Active</option>
            <option value="Invited">Invited</option>
          </select>
        </div>
      </div>

      {/* Active Team Filter Banner */}
      {teamFilter !== 'All' && (
        <div className="flex items-center justify-between p-3 rounded-xl bg-purple-50/70 border border-purple-200 text-xs text-[#7C3AED]">
          <div className="flex items-center gap-2">
            <Building2 className="w-4 h-4" />
            <span>Showing members for <strong>{teamFilter}</strong> ({filteredUsers.length} found)</span>
          </div>
          <button
            onClick={() => setTeamFilter('All')}
            className="text-xs font-bold hover:underline inline-flex items-center gap-1"
          >
            <X className="w-3.5 h-3.5" />
            Show All Teams
          </button>
        </div>
      )}

      {/* Directory Table */}
      <div className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-[#1E293B]">
            <thead className="bg-[#F8FAFC] text-xs font-semibold text-[#64748B] border-b border-slate-200">
              <tr>
                <th className="py-3.5 px-4 sm:px-6">Member Name</th>
                <th className="py-3.5 px-4">Role</th>
                <th className="py-3.5 px-4">Assigned Team</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4 hidden md:table-cell">Joined Date</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-[#64748B]">
                    <div className="max-w-xs mx-auto space-y-3">
                      <p>No members currently in {teamFilter !== 'All' ? `team "${teamFilter}"` : 'this directory view'}.</p>
                      <button
                        onClick={() => handleOpenInvite(teamFilter !== 'All' ? teamFilter : undefined)}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-white bg-[#7C3AED] hover:bg-[#6D28D9] transition"
                      >
                        <UserPlus className="w-3.5 h-3.5" />
                        Add Member Now
                      </button>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredUsers.map(user => {
                  return (
                    <tr 
                      key={user.id} 
                      className="hover:bg-[#F8FAFC] transition-colors group"
                    >
                      <td className="py-3.5 px-4 sm:px-6">
                        <div className="flex items-center gap-3">
                          <img
                            src={user.avatarUrl}
                            alt={user.name}
                            className="w-9 h-9 rounded-full object-cover border border-slate-200 bg-slate-100"
                          />
                          <div>
                            <div className="font-bold text-[#1E293B] text-sm">
                              {user.name}
                            </div>
                            <div className="text-xs text-[#64748B] flex items-center gap-1 mt-0.5">
                              <Mail className="w-3 h-3" />
                              {user.email}
                            </div>
                          </div>
                        </div>
                      </td>

                      <td className="py-3.5 px-4">
                        <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-xs font-semibold border ${getRoleBadge(user.role)}`}>
                          {user.role}
                        </span>
                      </td>

                      <td className="py-3.5 px-4">
                        <div className="inline-flex items-center gap-1.5 text-xs text-[#1E293B] font-semibold">
                          <Building2 className="w-3.5 h-3.5 text-[#7C3AED]" />
                          {user.team}
                        </div>
                      </td>

                      <td className="py-3.5 px-4">
                        {user.status === 'Active' ? (
                          <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-600">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                            Active
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-amber-600">
                            <Clock className="w-3 h-3 text-amber-500" />
                            Invited
                          </span>
                        )}
                      </td>

                      <td className="py-3.5 px-4 text-xs text-[#64748B] hidden md:table-cell">
                        {user.joinedDate}
                      </td>

                      <td className="py-3.5 px-4 text-right">
                        <button
                          onClick={() => handleDeleteUser(user.id, user.name)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition opacity-0 group-hover:opacity-100"
                          title="Remove user"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add / Invite Member Modal */}
      {isInviteModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl max-w-md w-full border border-slate-200 shadow-2xl overflow-hidden">
            <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-[#1E293B]">
                  Add Member to Team
                </h3>
                <p className="text-xs text-[#64748B] mt-0.5">
                  Register a teammate and assign them to a training cohort.
                </p>
              </div>
              <button
                onClick={() => setIsInviteModalOpen(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleInviteSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-[#1E293B] mb-1.5">
                  Full Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Jordan Hayes"
                  value={inviteForm.name}
                  onChange={e => setInviteForm({ ...inviteForm, name: e.target.value })}
                  className="w-full px-3.5 py-2 text-sm rounded-lg border border-slate-200 bg-white text-[#1E293B] placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-[#7C3AED]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#1E293B] mb-1.5">
                  Corporate Email Address *
                </label>
                <input
                  type="email"
                  required
                  placeholder="jordan.hayes@mascloud.studio"
                  value={inviteForm.email}
                  onChange={e => setInviteForm({ ...inviteForm, email: e.target.value })}
                  className="w-full px-3.5 py-2 text-sm rounded-lg border border-slate-200 bg-white text-[#1E293B] placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-[#7C3AED]"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-[#1E293B] mb-1.5">
                    Platform Role
                  </label>
                  <select
                    value={inviteForm.role}
                    onChange={e => setInviteForm({ ...inviteForm, role: e.target.value as UserRole })}
                    className="w-full px-3 py-2 text-xs font-medium rounded-lg border border-slate-200 bg-white text-[#1E293B] focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-[#7C3AED]"
                  >
                    <option value="Learner">Learner</option>
                    <option value="Instructor">Instructor</option>
                    <option value="Admin">Admin</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#1E293B] mb-1.5">
                    Assigned Team *
                  </label>
                  <select
                    value={inviteForm.team}
                    onChange={e => setInviteForm({ ...inviteForm, team: e.target.value })}
                    className="w-full px-3 py-2 text-xs font-medium rounded-lg border border-slate-200 bg-white text-[#1E293B] focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-[#7C3AED]"
                  >
                    {teams.map(t => (
                      <option key={t.id} value={t.name}>{t.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsInviteModalOpen(false)}
                  className="px-4 py-2 rounded-lg text-xs font-medium text-[#64748B] hover:bg-slate-100 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg text-xs font-semibold text-white bg-[#7C3AED] hover:bg-[#6D28D9] transition shadow-xs"
                >
                  Add Team Member
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

export default function PeoplePage() {
  return (
    <Suspense fallback={
      <div className="p-8 text-center text-xs text-[#64748B]">
        Loading directory...
      </div>
    }>
      <PeopleDirectoryContent />
    </Suspense>
  );
}
