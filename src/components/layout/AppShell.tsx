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
  CheckCircle2
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

  useEffect(() => {
    setActiveRole(MasDataStore.getActiveRole());
  }, []);

  const handleRoleChange = (role: UserRole) => {
    setActiveRole(role);
    MasDataStore.setActiveRole(role);
    setRoleDropdownOpen(false);
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

  // Current active demo persona based on activeRole
  const activeUser = activeRole === 'Admin'
    ? { name: 'Alex Morgan', email: 'alex.morgan@mascloud.studio', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=250&auto=format&fit=crop' }
    : activeRole === 'Instructor'
    ? { name: 'Dr. Sophia Patel', email: 'sophia.patel@mascloud.studio', avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=250&auto=format&fit=crop' }
    : { name: 'Elena Rostova', email: 'elena.rostova@mascloud.studio', avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=250&auto=format&fit=crop' };

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-[#1E293B] flex flex-col md:flex-row font-sans selection:bg-purple-100 selection:text-purple-900">
      {/* ---------------------------------------------------------------------- */}
      {/* Desktop Persistent Left-Hand Sidebar (Clean Light Theme)              */}
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

          {/* Quick Role Switcher (Client Demo Dropdown) */}
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

        {/* Footer Profile & Studio Watermark */}
        <div className="p-4 border-t border-[#E2E8F0] bg-[#F8FAFC]">
          <div className="flex items-center gap-3 mb-3">
            <img
              src={activeUser.avatar}
              alt={activeUser.name}
              className="h-8 w-8 rounded-full object-cover ring-1 ring-[#E2E8F0]"
            />
            <div className="flex flex-col min-w-0">
              <span className="text-xs font-bold text-[#1E293B] truncate">{activeUser.name}</span>
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

          {/* Top Right Utilities */}
          <div className="flex items-center gap-4">
            <Link
              href="/messages"
              className="relative p-2 rounded-lg text-[#64748B] hover:text-[#1E293B] hover:bg-[#F1F5F9] transition-colors"
              title="Notifications & Announcements"
            >
              <Bell className="h-4 w-4" />
              <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-[#7C3AED] ring-2 ring-white" />
            </Link>

            <div className="h-4 w-px bg-[#E2E8F0]" />

            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-[#1E293B]">{activeUser.name}</span>
              <span className="text-[10px] font-bold text-[#7C3AED] bg-purple-50 border border-purple-200 px-1.5 py-0.5 rounded">
                {activeRole}
              </span>
            </div>
          </div>
        </header>

        {/* Child Page Rendering Area */}
        <main className="flex-1 p-6 sm:p-8 lg:p-10 max-w-7xl mx-auto w-full">
          {children}
        </main>
      </div>

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
    </div>
  );
}
