'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { MasDataStore } from '@/lib/mockData';
import { UserRole } from '@/types/masLms';
import {
  LayoutDashboard,
  BookOpen,
  Users,
  Building2,
  MessageSquare,
  FileText,
  BarChart3,
  Settings,
  ChevronDown,
  Menu,
  X,
  Search,
  Bell,
  CheckCircle2,
  Shield,
  ShieldCheck,
  User,
  LogOut,
  Lock,
  Edit3,
  ExternalLink,
  Sparkles,
  KeyRound,
  Check,
  ArrowRight
} from 'lucide-react';

interface AppShellProps {
  children: React.ReactNode;
}

export function AppShell({ children }: AppShellProps) {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeRole, setActiveRole] = useState<UserRole>('Admin');
  const [roleDropdownOpen, setRoleDropdownOpen] = useState(false);
  const [searchModalOpen, setSearchModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Admin Side Panel & Notifications States
  const [adminPanelOpen, setAdminPanelOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Admin Profile State
  const [adminProfile, setAdminProfile] = useState({
    name: 'Alex Morgan',
    email: 'alex.morgan@mascloud.studio',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=250&auto=format&fit=crop',
    title: 'Chief Security Officer & System Admin',
    team: 'IT Support & Platform Security',
    phone: '+1 (555) 019-2834',
    timezone: 'UTC-5 (Eastern Time)',
    securityLevel: 'Level 4 (Superadmin)',
    twoFactorEnabled: true
  });

  // Edit Form State
  const [editFormData, setEditFormData] = useState({
    name: '',
    email: '',
    title: ''
  });

  useEffect(() => {
    setActiveRole(MasDataStore.getActiveRole());
    const profile = MasDataStore.getAdminProfile();
    setAdminProfile(profile);
    setEditFormData({
      name: profile.name,
      email: profile.email,
      title: profile.title
    });
  }, []);

  const handleRoleChange = (role: UserRole) => {
    setActiveRole(role);
    MasDataStore.setActiveRole(role);
    setRoleDropdownOpen(false);
    showToast(`Switched active view to ${role} persona`);
  };

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editFormData.name.trim() || !editFormData.email.trim()) return;

    const updated = {
      name: editFormData.name.trim(),
      email: editFormData.email.trim(),
      title: editFormData.title.trim() || adminProfile.title
    };

    MasDataStore.updateAdminProfile(updated);
    setAdminProfile(prev => ({ ...prev, ...updated }));
    setIsEditingProfile(false);
    showToast('Administrator profile updated successfully!');
  };

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const navLinks = [
    { label: 'Dashboard', href: '/', icon: LayoutDashboard },
    { label: 'Courses', href: '/courses', icon: BookOpen },
    { label: 'People', href: '/people', icon: Users },
    { label: 'Teams', href: '/teams', icon: Building2 },
    { label: 'Messages', href: '/messages', icon: MessageSquare, badge: '3' },
    { label: 'Guidelines', href: '/guidelines', icon: FileText },
    { label: 'Reports', href: '/reports', icon: BarChart3 },
    { label: 'Settings', href: '/settings', icon: Settings },
  ];

  // Current active persona details
  const activeUser = activeRole === 'Admin'
    ? { 
        name: adminProfile.name, 
        email: adminProfile.email, 
        avatar: adminProfile.avatar,
        title: adminProfile.title
      }
    : activeRole === 'Instructor'
    ? { 
        name: 'Dr. Sophia Patel', 
        email: 'sophia.patel@mascloud.studio', 
        avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=250&auto=format&fit=crop',
        title: 'Lead Technical Instructor'
      }
    : { 
        name: 'Elena Rostova', 
        email: 'elena.rostova@mascloud.studio', 
        avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=250&auto=format&fit=crop',
        title: 'Senior Financial Analyst'
      };

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-[#1E293B] flex flex-col md:flex-row font-sans selection:bg-purple-100 selection:text-purple-900">
      {/* ---------------------------------------------------------------------- */}
      {/* Desktop Persistent Left-Hand Sidebar                                   */}
      {/* ---------------------------------------------------------------------- */}
      <aside className="hidden md:flex flex-col w-64 border-r border-[#E2E8F0] bg-[#FFFFFF] shadow-sm flex-shrink-0 select-none z-30">
        {/* Brand Header */}
        <div className="p-5 border-b border-[#E2E8F0]">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="h-10 w-10 rounded-xl overflow-hidden bg-white p-1 flex items-center justify-center shadow-xs border border-[#E2E8F0] group-hover:scale-105 transition-transform flex-shrink-0">
              <img
                src="/mas-lms-logo.jpg"
                alt="M.A.S LMS"
                className="w-full h-full object-contain"
              />
            </div>
            <div className="flex flex-col min-w-0">
              <span className="text-base font-extrabold text-[#1E293B] tracking-tight leading-tight flex items-center gap-1.5">
                M.A.S LMS
                <span className="text-[10px] font-semibold text-[#7C3AED] bg-purple-50 border border-purple-200 px-1 rounded">
                  v1.0
                </span>
              </span>
              <span className="text-[11px] text-[#64748B] truncate">
                by M.A.S Cloud Studio
              </span>
            </div>
          </Link>

          {/* Quick Role Switcher */}
          <div className="mt-4 relative">
            <div className="text-[10px] font-bold uppercase tracking-wider text-[#64748B] mb-1 px-1">
              Active Demo Persona
            </div>
            <button
              onClick={() => setRoleDropdownOpen(!roleDropdownOpen)}
              className="w-full flex items-center justify-between px-3 py-2 rounded-lg bg-[#F8FAFC] border border-[#E2E8F0] hover:border-slate-300 text-xs font-semibold text-[#1E293B] transition-all shadow-2xs"
            >
              <div className="flex items-center gap-2">
                <span className={`h-2 w-2 rounded-full ${
                  activeRole === 'Admin' ? 'bg-[#7C3AED] shadow-xs' :
                  activeRole === 'Instructor' ? 'bg-indigo-600' : 'bg-emerald-600'
                }`} />
                <span className="capitalize">{activeRole} View</span>
              </div>
              <ChevronDown className="h-3.5 w-3.5 text-[#64748B]" />
            </button>

            {roleDropdownOpen && (
              <div className="absolute left-0 right-0 top-full mt-1.5 z-50 rounded-xl bg-white border border-[#E2E8F0] p-1 shadow-lg animate-in fade-in zoom-in-95 duration-100">
                {(['Admin', 'Instructor', 'Learner'] as UserRole[]).map((role) => (
                  <button
                    key={role}
                    onClick={() => handleRoleChange(role)}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition-colors ${
                      activeRole === role
                        ? 'bg-purple-50 text-[#7C3AED] font-semibold'
                        : 'text-[#1E293B] hover:bg-[#F8FAFC]'
                    }`}
                  >
                    <span>{role}</span>
                    {activeRole === role && <CheckCircle2 className="h-3.5 w-3.5 text-[#7C3AED]" />}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Primary 8 Navigation Links */}
        <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
          {navLinks.map((link) => {
            const Icon = link.icon;
            const isActive = link.href === '/' 
              ? pathname === '/'
              : pathname.startsWith(link.href);

            return (
              <Link
                key={link.href}
                href={link.href}
                className={`flex items-center justify-between px-3.5 py-2.5 rounded-lg text-xs font-medium transition-all ${
                  isActive
                    ? 'bg-[#E9D5FF] text-[#7C3AED] font-bold shadow-2xs'
                    : 'text-[#64748B] hover:text-[#1E293B] hover:bg-[#F1F5F9]'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className={`h-4 w-4 ${isActive ? 'text-[#7C3AED]' : 'text-[#64748B]'}`} />
                  <span>{link.label}</span>
                </div>
                {link.badge && (
                  <span className={`text-[10px] font-bold px-1.5 py-0.2 rounded-full border ${
                    isActive
                      ? 'bg-purple-200 text-[#7C3AED] border-purple-300'
                      : 'bg-slate-100 text-[#64748B] border-slate-200'
                  }`}>
                    {link.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Footer Profile Strip (Clickable to open Admin Profile Side Panel) */}
        <div 
          onClick={() => setAdminPanelOpen(true)}
          className="p-4 border-t border-[#E2E8F0] bg-[#F8FAFC] hover:bg-slate-100 transition cursor-pointer group"
          title="Click to open Admin Profile & Security Panel"
        >
          <div className="flex items-center gap-3 mb-3">
            <div className="relative">
              <img
                src={activeUser.avatar}
                alt={activeUser.name}
                className="h-8 w-8 rounded-full object-cover ring-1 ring-[#E2E8F0] group-hover:scale-105 transition"
              />
              <span className="absolute bottom-0 right-0 h-2 w-2 rounded-full bg-emerald-500 ring-1 ring-white" />
            </div>
            <div className="flex flex-col min-w-0 flex-1">
              <span className="text-xs font-bold text-[#1E293B] group-hover:text-[#7C3AED] transition-colors truncate">
                {activeUser.name}
              </span>
              <span className="text-[10px] text-[#64748B] truncate">{activeUser.email}</span>
            </div>
          </div>

          <div className="pt-2 border-t border-[#E2E8F0] flex items-center justify-between text-[10px] text-[#64748B] font-medium">
            <span>M.A.S Cloud Studio</span>
            <span className="flex items-center gap-1 text-emerald-600 font-semibold">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
              Synced
            </span>
          </div>
        </div>
      </aside>

      {/* ---------------------------------------------------------------------- */}
      {/* Mobile Top Navigation Bar                                              */}
      {/* ---------------------------------------------------------------------- */}
      <div className="md:hidden flex items-center justify-between px-4 py-3 border-b border-[#E2E8F0] bg-white sticky top-0 z-40">
        <Link href="/" className="flex items-center gap-2.5">
          <div className="h-8 w-8 rounded-lg overflow-hidden bg-white p-0.5 flex items-center justify-center border border-[#E2E8F0]">
            <img src="/mas-lms-logo.jpg" alt="M.A.S LMS Logo" className="w-full h-full object-contain" />
          </div>
          <span className="font-extrabold text-sm text-[#1E293B]">M.A.S LMS</span>
        </Link>

        <div className="flex items-center gap-2">
          {/* Mobile Admin Profile trigger */}
          <button
            onClick={() => setAdminPanelOpen(true)}
            className="p-1 rounded-full border border-slate-200"
          >
            <img src={activeUser.avatar} alt="Profile" className="w-7 h-7 rounded-full object-cover" />
          </button>
          <button
            onClick={() => setSearchModalOpen(true)}
            className="p-2 rounded-lg bg-[#F8FAFC] border border-[#E2E8F0] text-[#64748B]"
          >
            <Search className="h-4 w-4" />
          </button>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-lg bg-[#F8FAFC] border border-[#E2E8F0] text-[#1E293B]"
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Overlay Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden fixed inset-0 top-[53px] z-50 bg-white/95 p-4 flex flex-col backdrop-blur-lg">
          <div className="mb-4 p-3 rounded-lg bg-[#F8FAFC] border border-[#E2E8F0] flex items-center justify-between">
            <span className="text-xs text-[#64748B]">Current Role:</span>
            <span className="text-xs font-bold text-[#7C3AED]">{activeRole}</span>
          </div>

          <nav className="space-y-1 flex-1 overflow-y-auto">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const isActive = link.href === '/' ? pathname === '/' : pathname.startsWith(link.href);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center justify-between px-4 py-3 rounded-lg text-sm font-semibold ${
                    isActive ? 'bg-[#E9D5FF] text-[#7C3AED]' : 'text-[#64748B] hover:bg-[#F8FAFC]'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className="h-4 w-4" />
                    <span>{link.label}</span>
                  </div>
                  {link.badge && (
                    <span className="text-[10px] bg-slate-100 px-2 py-0.5 rounded-full text-[#64748B]">{link.badge}</span>
                  )}
                </Link>
              );
            })}
          </nav>

          <div className="pt-4 border-t border-[#E2E8F0] text-center text-xs text-[#64748B]">
            M.A.S LMS — Developed by M.A.S Cloud Studio
          </div>
        </div>
      )}

      {/* ---------------------------------------------------------------------- */}
      {/* Main Content Workspace                                                 */}
      {/* ---------------------------------------------------------------------- */}
      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto bg-[#F8FAFC]">
        {/* Top Minimalist Global Bar */}
        <header className="hidden md:flex h-14 items-center justify-between px-8 border-b border-[#E2E8F0] bg-white/80 backdrop-blur-md sticky top-0 z-20">
          {/* Quick Search Bar trigger */}
          <button
            onClick={() => setSearchModalOpen(true)}
            className="flex items-center gap-3 w-80 px-3 py-1.5 rounded-lg bg-[#F1F5F9] border border-[#E2E8F0] text-xs text-[#64748B] hover:border-slate-300 transition-colors shadow-2xs group text-left"
          >
            <Search className="h-3.5 w-3.5 text-slate-400 group-hover:text-slate-600" />
            <span className="flex-1">Search courses, guidelines, learners...</span>
            <kbd className="px-1.5 py-0.5 rounded bg-white text-[10px] text-slate-500 border border-slate-200 shadow-2xs">
              ⌘K
            </kbd>
          </button>

          {/* Top Right Utilities (Interactive Bell + Admin Account Pill) */}
          <div className="flex items-center gap-3">
            {/* Notification Bell with Dropdown */}
            <div className="relative">
              <button
                onClick={() => {
                  setNotificationsOpen(!notificationsOpen);
                }}
                className="relative p-2 rounded-lg text-[#64748B] hover:text-[#1E293B] hover:bg-[#F1F5F9] transition-colors"
                title="Notifications & Announcements"
              >
                <Bell className="h-4 w-4" />
                <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-[#7C3AED] ring-2 ring-white" />
              </button>

              {/* Notification Popover Dropdown */}
              {notificationsOpen && (
                <div className="absolute right-0 top-full mt-2 w-80 rounded-2xl bg-white border border-[#E2E8F0] p-4 shadow-xl z-50 animate-in fade-in zoom-in-95 duration-100">
                  <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                    <span className="text-xs font-bold text-[#1E293B]">Announcements & Alerts</span>
                    <Link
                      href="/messages"
                      onClick={() => setNotificationsOpen(false)}
                      className="text-[11px] font-semibold text-[#7C3AED] hover:underline"
                    >
                      View All
                    </Link>
                  </div>
                  <div className="py-2 space-y-2">
                    <div className="p-2.5 rounded-xl bg-purple-50/60 border border-purple-100 text-xs">
                      <p className="font-bold text-[#1E293B]">Mandatory Q4 Recertification</p>
                      <p className="text-[11px] text-[#64748B] mt-0.5">All team members must complete the AI Hygiene module by Oct 31st.</p>
                      <span className="text-[10px] text-slate-400 mt-1 block">2 hours ago</span>
                    </div>
                    <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 text-xs">
                      <p className="font-bold text-[#1E293B]">SOC2 Type II Audit Ready</p>
                      <p className="text-[11px] text-[#64748B] mt-0.5">Overall enterprise compliance rate is at 88.4%.</p>
                      <span className="text-[10px] text-slate-400 mt-1 block">Yesterday</span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="h-4 w-px bg-[#E2E8F0]" />

            {/* CLICKABLE ADMIN ACCOUNT PILL -> OPENS ADMIN PROFILE PANEL */}
            <button
              onClick={() => {
                setAdminPanelOpen(true);
                setNotificationsOpen(false);
              }}
              className="flex items-center gap-2.5 px-3 py-1.5 rounded-xl border border-transparent hover:border-[#E2E8F0] hover:bg-[#F1F5F9] transition-all group cursor-pointer shadow-2xs"
              title="Click to open Admin Profile & Security Panel"
            >
              <div className="relative">
                <img
                  src={activeUser.avatar}
                  alt={activeUser.name}
                  className="h-7 w-7 rounded-full object-cover border border-slate-200 group-hover:scale-105 transition"
                />
                <span className="absolute bottom-0 right-0 h-2 w-2 rounded-full bg-emerald-500 ring-1 ring-white" />
              </div>

              <div className="text-left hidden lg:block">
                <span className="text-xs font-bold text-[#1E293B] group-hover:text-[#7C3AED] transition-colors block leading-tight">
                  {activeUser.name}
                </span>
                <span className="text-[10px] text-[#64748B] block truncate max-w-[130px]">
                  {activeUser.title}
                </span>
              </div>

              <span className="text-[10px] font-bold text-[#7C3AED] bg-purple-50 border border-purple-200 px-2 py-0.5 rounded-full">
                {activeRole}
              </span>

              <ChevronDown className="h-3.5 w-3.5 text-slate-400 group-hover:text-[#7C3AED] transition-transform" />
            </button>
          </div>
        </header>

        {/* Child Page Rendering Area */}
        <main className="flex-1 p-6 sm:p-8 lg:p-10 max-w-7xl mx-auto w-full">
          {children}
        </main>
      </div>

      {/* ---------------------------------------------------------------------- */}
      {/* SLIDE-OUT ADMIN PROFILE & GOVERNANCE SIDE PANEL (RIGHT DRAWER)          */}
      {/* ---------------------------------------------------------------------- */}
      {adminPanelOpen && (
        <div className="fixed inset-0 z-50 flex justify-end">
          {/* Backdrop Blur */}
          <div
            onClick={() => {
              setAdminPanelOpen(false);
              setIsEditingProfile(false);
            }}
            className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs animate-in fade-in duration-200"
          />

          {/* Drawer Body */}
          <div className="relative w-full max-w-md bg-white border-l border-[#E2E8F0] shadow-2xl h-full flex flex-col z-10 animate-in slide-in-from-right duration-300 overflow-hidden">
            {/* Drawer Header */}
            <div className="px-6 py-5 border-b border-[#E2E8F0] bg-white flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-purple-50 text-[#7C3AED] border border-purple-200">
                  <Shield className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-extrabold text-[#1E293B]">
                    Administrator Profile
                  </h3>
                  <p className="text-xs text-[#64748B]">
                    Governance &amp; Access Controls
                  </p>
                </div>
              </div>

              <button
                onClick={() => {
                  setAdminPanelOpen(false);
                  setIsEditingProfile(false);
                }}
                className="p-2 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Drawer Scrollable Content */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {/* Profile Card & Avatar */}
              <div className="p-5 rounded-2xl border border-slate-200 bg-gradient-to-b from-[#F8FAFC] to-white shadow-xs">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-4">
                    <div className="relative">
                      <img
                        src={activeUser.avatar}
                        alt={activeUser.name}
                        className="w-16 h-16 rounded-2xl object-cover border-2 border-white shadow-md ring-1 ring-slate-200"
                      />
                      <span className="absolute -bottom-1 -right-1 h-3.5 w-3.5 rounded-full bg-emerald-500 ring-2 ring-white" />
                    </div>

                    <div>
                      <h4 className="text-base font-bold text-[#1E293B]">
                        {activeUser.name}
                      </h4>
                      <p className="text-xs text-[#7C3AED] font-semibold">
                        {activeUser.title}
                      </p>
                      <p className="text-xs text-[#64748B] mt-0.5">
                        {activeUser.email}
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={() => setIsEditingProfile(!isEditingProfile)}
                    className="p-1.5 rounded-lg text-[#7C3AED] bg-purple-50 hover:bg-purple-100 transition border border-purple-200"
                    title="Edit Admin Profile"
                  >
                    <Edit3 className="w-4 h-4" />
                  </button>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-[#64748B]">
                  <span>Assigned Department:</span>
                  <strong className="text-[#1E293B]">{adminProfile.team}</strong>
                </div>
              </div>

              {/* Inline Profile Edit Form */}
              {isEditingProfile && (
                <form onSubmit={handleSaveProfile} className="p-4 rounded-2xl border border-purple-200 bg-purple-50/40 space-y-3 animate-in fade-in duration-150">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-bold text-[#1E293B]">Edit Profile Credentials</span>
                    <button
                      type="button"
                      onClick={() => setIsEditingProfile(false)}
                      className="text-xs text-slate-400 hover:text-slate-600"
                    >
                      Cancel
                    </button>
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-[#1E293B] mb-1">Full Name</label>
                    <input
                      type="text"
                      required
                      value={editFormData.name}
                      onChange={e => setEditFormData({ ...editFormData, name: e.target.value })}
                      className="w-full px-3 py-1.5 text-xs rounded-lg border border-slate-200 bg-white text-[#1E293B] focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-[#7C3AED]"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-[#1E293B] mb-1">Corporate Email</label>
                    <input
                      type="email"
                      required
                      value={editFormData.email}
                      onChange={e => setEditFormData({ ...editFormData, email: e.target.value })}
                      className="w-full px-3 py-1.5 text-xs rounded-lg border border-slate-200 bg-white text-[#1E293B] focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-[#7C3AED]"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-[#1E293B] mb-1">Job Title</label>
                    <input
                      type="text"
                      value={editFormData.title}
                      onChange={e => setEditFormData({ ...editFormData, title: e.target.value })}
                      className="w-full px-3 py-1.5 text-xs rounded-lg border border-slate-200 bg-white text-[#1E293B] focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-[#7C3AED]"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-2 px-3 rounded-lg text-xs font-bold text-white bg-[#7C3AED] hover:bg-[#6D28D9] transition shadow-xs mt-2"
                  >
                    Save Changes
                  </button>
                </form>
              )}

              {/* Workspace Persona Simulation Switcher */}
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-[#64748B] block mb-2">
                  Preview Workspace Persona
                </span>
                <div className="grid grid-cols-3 gap-2">
                  {(['Admin', 'Instructor', 'Learner'] as UserRole[]).map(role => (
                    <button
                      key={role}
                      onClick={() => handleRoleChange(role)}
                      className={`p-3 rounded-xl border text-center transition flex flex-col items-center gap-1 ${
                        activeRole === role
                          ? 'border-[#7C3AED] bg-purple-50 text-[#7C3AED] font-bold shadow-2xs'
                          : 'border-slate-200 bg-white text-[#64748B] hover:border-slate-300'
                      }`}
                    >
                      <span className="text-xs">{role}</span>
                      <span className="text-[10px] opacity-70">
                        {role === 'Admin' ? 'Superuser' : role === 'Instructor' ? 'Trainer' : 'Student'}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Security & Access Diagnostics */}
              <div className="p-4 rounded-2xl border border-slate-200 bg-white shadow-xs space-y-3">
                <span className="text-xs font-bold uppercase tracking-wider text-[#64748B] block">
                  Security Diagnostics
                </span>

                <div className="flex items-center justify-between text-xs">
                  <span className="text-[#64748B] flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4 text-emerald-600" />
                    Clearance Level
                  </span>
                  <span className="font-semibold text-[#1E293B]">{adminProfile.securityLevel}</span>
                </div>

                <div className="flex items-center justify-between text-xs">
                  <span className="text-[#64748B] flex items-center gap-1.5">
                    <KeyRound className="w-4 h-4 text-[#7C3AED]" />
                    Hardware 2FA Status
                  </span>
                  <span className="font-semibold text-emerald-600">Enforced &amp; Active</span>
                </div>

                <div className="flex items-center justify-between text-xs">
                  <span className="text-[#64748B] flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    SOC2 Compliance Audit
                  </span>
                  <span className="font-semibold text-[#1E293B]">Verified (Oct 2026)</span>
                </div>
              </div>

              {/* Quick Admin Navigation Shortcuts */}
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-[#64748B] block mb-2">
                  Governance Shortcuts
                </span>
                <div className="space-y-1.5">
                  <Link
                    href="/people"
                    onClick={() => setAdminPanelOpen(false)}
                    className="flex items-center justify-between p-3 rounded-xl bg-white border border-slate-200 hover:border-purple-200 hover:bg-purple-50/40 transition group text-xs text-[#1E293B] font-semibold"
                  >
                    <div className="flex items-center gap-2.5">
                      <Users className="w-4 h-4 text-[#7C3AED]" />
                      <span>Manage People &amp; Access Roles</span>
                    </div>
                    <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-[#7C3AED] transition-transform group-hover:translate-x-0.5" />
                  </Link>

                  <Link
                    href="/teams"
                    onClick={() => setAdminPanelOpen(false)}
                    className="flex items-center justify-between p-3 rounded-xl bg-white border border-slate-200 hover:border-purple-200 hover:bg-purple-50/40 transition group text-xs text-[#1E293B] font-semibold"
                  >
                    <div className="flex items-center gap-2.5">
                      <Building2 className="w-4 h-4 text-[#7C3AED]" />
                      <span>Manage Cohorts &amp; Departments</span>
                    </div>
                    <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-[#7C3AED] transition-transform group-hover:translate-x-0.5" />
                  </Link>

                  <Link
                    href="/courses"
                    onClick={() => setAdminPanelOpen(false)}
                    className="flex items-center justify-between p-3 rounded-xl bg-white border border-slate-200 hover:border-purple-200 hover:bg-purple-50/40 transition group text-xs text-[#1E293B] font-semibold"
                  >
                    <div className="flex items-center gap-2.5">
                      <BookOpen className="w-4 h-4 text-[#7C3AED]" />
                      <span>Course Catalog &amp; Modules</span>
                    </div>
                    <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-[#7C3AED] transition-transform group-hover:translate-x-0.5" />
                  </Link>

                  <Link
                    href="/reports"
                    onClick={() => setAdminPanelOpen(false)}
                    className="flex items-center justify-between p-3 rounded-xl bg-white border border-slate-200 hover:border-purple-200 hover:bg-purple-50/40 transition group text-xs text-[#1E293B] font-semibold"
                  >
                    <div className="flex items-center gap-2.5">
                      <BarChart3 className="w-4 h-4 text-[#7C3AED]" />
                      <span>Executive Compliance Reports</span>
                    </div>
                    <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-[#7C3AED] transition-transform group-hover:translate-x-0.5" />
                  </Link>

                  <Link
                    href="/settings"
                    onClick={() => setAdminPanelOpen(false)}
                    className="flex items-center justify-between p-3 rounded-xl bg-white border border-slate-200 hover:border-purple-200 hover:bg-purple-50/40 transition group text-xs text-[#1E293B] font-semibold"
                  >
                    <div className="flex items-center gap-2.5">
                      <Settings className="w-4 h-4 text-[#7C3AED]" />
                      <span>System Settings &amp; Studio Branding</span>
                    </div>
                    <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-[#7C3AED] transition-transform group-hover:translate-x-0.5" />
                  </Link>
                </div>
              </div>
            </div>

            {/* Drawer Footer Actions */}
            <div className="p-4 border-t border-[#E2E8F0] bg-[#F8FAFC] flex items-center justify-between gap-3">
              <button
                onClick={() => {
                  showToast('Session locked. Re-authenticate with 2FA to continue.');
                  setAdminPanelOpen(false);
                }}
                className="flex-1 py-2 px-3 rounded-xl border border-slate-200 bg-white hover:bg-slate-100 text-xs font-semibold text-[#1E293B] transition inline-flex items-center justify-center gap-1.5"
              >
                <Lock className="w-3.5 h-3.5 text-slate-500" />
                Lock Session
              </button>

              <button
                onClick={() => {
                  showToast('Signed out of M.A.S LMS demo.');
                  setAdminPanelOpen(false);
                }}
                className="py-2 px-3 rounded-xl border border-rose-200 bg-rose-50 hover:bg-rose-100 text-xs font-semibold text-rose-700 transition inline-flex items-center justify-center gap-1.5"
              >
                <LogOut className="w-3.5 h-3.5" />
                Sign Out
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ---------------------------------------------------------------------- */}
      {/* Global Quick Search Modal (⌘K)                                         */}
      {/* ---------------------------------------------------------------------- */}
      {searchModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-start justify-center pt-20 p-4">
          <div className="bg-white border border-[#E2E8F0] rounded-2xl shadow-2xl max-w-lg w-full p-4 animate-in fade-in zoom-in-95 duration-100">
            <div className="flex items-center gap-3 pb-3 border-b border-[#E2E8F0]">
              <Search className="h-4 w-4 text-[#7C3AED]" />
              <input
                type="text"
                autoFocus
                placeholder="Search across courses, teams, guidelines..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="flex-1 bg-transparent text-sm text-[#1E293B] placeholder-slate-400 focus:outline-none"
              />
              <button onClick={() => setSearchModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="py-3 space-y-1">
              <div className="text-[10px] font-bold uppercase tracking-wider text-[#64748B] px-2 py-1">
                Quick Navigation
              </div>
              {navLinks.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setSearchModalOpen(false)}
                  className="flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-medium text-[#1E293B] hover:bg-[#F8FAFC] transition-colors"
                >
                  <item.icon className="h-4 w-4 text-[#64748B]" />
                  <span>Go to {item.label}</span>
                </Link>
              ))}
            </div>

            <div className="pt-3 border-t border-[#E2E8F0] flex items-center justify-between text-[11px] text-[#64748B]">
              <span>M.A.S LMS Search</span>
              <span>ESC to exit</span>
            </div>
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
