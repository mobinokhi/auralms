'use client';

import React, { useState, useEffect } from 'react';
import { 
  Settings, 
  User as UserIcon, 
  ShieldCheck, 
  Database, 
  CheckCircle2, 
  Cloud, 
  Sparkles, 
  Bell, 
  Save, 
  Building2, 
  Lock, 
  Check
} from 'lucide-react';
import { MasDataStore } from '@/lib/mockData';
import { UserRole } from '@/types/masLms';

export default function SettingsPage() {
  const [activeRole, setActiveRole] = useState<UserRole>('Admin');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Profile Form State
  const [profile, setProfile] = useState({
    name: 'Alex Morgan',
    email: 'alex.morgan@mascloud.studio',
    team: 'IT Support',
    title: 'Principal Systems Architect',
    bio: 'Oversees enterprise training compliance, infrastructure security protocols, and engineering curriculum tracks across M.A.S LMS.'
  });

  // Notification Toggles
  const [notifications, setNotifications] = useState({
    complianceDeadlines: true,
    courseUpdates: true,
    weeklyDigest: false,
    teamEnrollments: true
  });

  useEffect(() => {
    setActiveRole(MasDataStore.getActiveRole());
  }, []);

  const handleRoleSwitch = (newRole: UserRole) => {
    MasDataStore.setActiveRole(newRole);
    setActiveRole(newRole);
    if (newRole === 'Admin') {
      setProfile({
        name: 'Alex Morgan',
        email: 'alex.morgan@mascloud.studio',
        team: 'IT Support',
        title: 'Principal Systems Architect',
        bio: 'Oversees enterprise training compliance and technical curriculum.'
      });
    } else if (newRole === 'Instructor') {
      setProfile({
        name: 'Dr. Sophia Patel',
        email: 'sophia.patel@mascloud.studio',
        team: 'Operations',
        title: 'Senior Compliance Director',
        bio: 'Designs institutional regulatory standards, GDPR compliance, and audits.'
      });
    } else {
      setProfile({
        name: 'Elena Rostova',
        email: 'elena.rostova@mascloud.studio',
        team: 'Finance & Advisory',
        title: 'Financial Risk Analyst',
        bio: 'Enrolled in cyber defense, risk assessment, and fiduciary certifications.'
      });
    }
    showToast(`Switched active demo persona to ${newRole}`);
  };

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    showToast('Profile configuration updated successfully.');
  };

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300 max-w-5xl">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800/80 pb-6">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 border border-indigo-200/60 dark:border-indigo-800/50">
              <Settings className="w-3 h-3" />
              Enterprise Configuration
            </span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
            System & Account Settings
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Manage your personal credentials, demo personas, and enterprise branding status.
          </p>
        </div>
      </div>

      {/* 1. System Branding & Cloud Status Card (Mandatory Requirement) */}
      <div className="rounded-xl border border-slate-200/80 dark:border-slate-800/80 bg-white dark:bg-slate-900 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-100 dark:border-slate-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="h-16 w-32 rounded-xl bg-white p-1.5 flex items-center justify-center border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden flex-shrink-0">
              <img
                src="/mas-lms-logo.jpg"
                alt="M.A.S LMS - Developed by M.A.S Cloud Studio"
                className="w-full h-full object-contain"
              />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  M.A.S LMS
                </h3>
                <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-indigo-50 text-indigo-700 dark:bg-indigo-950/60 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800">
                  v1.0.0
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Developed by M.A.S Cloud Studio
              </p>
              <p className="text-[11px] text-slate-400 mt-0.5">
                An Modern Learning Management System Tool
              </p>
            </div>
          </div>

          {/* Cloud Database Connection Status Pill */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 shadow-sm self-start sm:self-auto">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>Cloud Database: Connected & Active</span>
          </div>
        </div>

        <div className="p-6 grid grid-cols-1 sm:grid-cols-3 gap-6 bg-slate-50/50 dark:bg-slate-900/50 text-xs">
          <div>
            <span className="font-semibold text-slate-400 uppercase tracking-wider block mb-1">
              Backend Architecture
            </span>
            <p className="font-medium text-slate-800 dark:text-slate-200">
              Supabase PostgreSQL • RLS Enabled
            </p>
          </div>
          <div>
            <span className="font-semibold text-slate-400 uppercase tracking-wider block mb-1">
              Hosting & Edge Runtime
            </span>
            <p className="font-medium text-slate-800 dark:text-slate-200">
              Vercel Edge Global Network
            </p>
          </div>
          <div>
            <span className="font-semibold text-slate-400 uppercase tracking-wider block mb-1">
              Compliance Standard
            </span>
            <p className="font-medium text-slate-800 dark:text-slate-200">
              SOC 2 Type II & ISO 27001 Ready
            </p>
          </div>
        </div>
      </div>

      {/* 2. Quick Demo Role Switcher */}
      <div className="rounded-xl border border-slate-200/80 dark:border-slate-800/80 bg-white dark:bg-slate-900 p-6 shadow-sm">
        <div className="mb-4">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white">
            Quick Persona Switcher (Client Demo Mode)
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Instantly toggle platform perspectives to demonstrate role-based access control.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {(['Admin', 'Instructor', 'Learner'] as const).map(role => {
            const isSelected = activeRole === role;
            return (
              <button
                key={role}
                onClick={() => handleRoleSwitch(role)}
                className={`p-4 rounded-xl border text-left transition-all ${
                  isSelected
                    ? 'border-indigo-600 bg-indigo-50/60 dark:bg-indigo-950/40 ring-2 ring-indigo-500/20'
                    : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 bg-white dark:bg-slate-950'
                }`}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-xs font-bold text-slate-900 dark:text-white">
                    {role}
                  </span>
                  {isSelected && <Check className="w-4 h-4 text-indigo-600" />}
                </div>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">
                  {role === 'Admin'
                    ? 'Full governance, user provisioning & reports.'
                    : role === 'Instructor'
                    ? 'Curriculum builder, grading & course authoring.'
                    : 'Learning dashboard, player & certifications.'}
                </p>
              </button>
            );
          })}
        </div>
      </div>

      {/* 3. Personal Profile Settings */}
      <div className="rounded-xl border border-slate-200/80 dark:border-slate-800/80 bg-white dark:bg-slate-900 p-6 shadow-sm">
        <div className="mb-6 border-b border-slate-100 dark:border-slate-800/80 pb-4">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white">
            Personal Information & Credentials
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Update your enterprise profile details and email notifications.
          </p>
        </div>

        <form onSubmit={handleSaveProfile} className="space-y-4">
          <div className="flex items-center gap-4 mb-6">
            <img
              src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=250&auto=format&fit=crop"
              alt="Avatar"
              className="w-14 h-14 rounded-full object-cover border-2 border-slate-200 dark:border-slate-700 shadow-sm"
            />
            <div>
              <p className="text-xs font-semibold text-slate-900 dark:text-white">
                Profile Avatar
              </p>
              <p className="text-[11px] text-slate-400">
                Managed via corporate single sign-on (SSO).
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                Full Name
              </label>
              <input
                type="text"
                value={profile.name}
                onChange={e => setProfile({ ...profile, name: e.target.value })}
                className="w-full px-3.5 py-2 text-xs rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                Work Email Address
              </label>
              <input
                type="email"
                value={profile.email}
                onChange={e => setProfile({ ...profile, email: e.target.value })}
                className="w-full px-3.5 py-2 text-xs rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                Department / Team
              </label>
              <input
                type="text"
                value={profile.team}
                onChange={e => setProfile({ ...profile, team: e.target.value })}
                className="w-full px-3.5 py-2 text-xs rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                Job Title
              </label>
              <input
                type="text"
                value={profile.title}
                onChange={e => setProfile({ ...profile, title: e.target.value })}
                className="w-full px-3.5 py-2 text-xs rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
              Professional Bio
            </label>
            <textarea
              rows={2}
              value={profile.bio}
              onChange={e => setProfile({ ...profile, bio: e.target.value })}
              className="w-full px-3.5 py-2 text-xs rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 resize-none"
            />
          </div>

          {/* Notification Preferences */}
          <div className="pt-4 border-t border-slate-100 dark:border-slate-800/80 space-y-3">
            <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
              Communication Preferences
            </h4>

            <div className="space-y-2">
              <label className="flex items-center gap-2.5 text-xs text-slate-700 dark:text-slate-300 cursor-pointer">
                <input
                  type="checkbox"
                  checked={notifications.complianceDeadlines}
                  onChange={e => setNotifications({ ...notifications, complianceDeadlines: e.target.checked })}
                  className="rounded text-indigo-600 focus:ring-indigo-500"
                />
                <span>Mandatory compliance deadline reminders (High priority)</span>
              </label>

              <label className="flex items-center gap-2.5 text-xs text-slate-700 dark:text-slate-300 cursor-pointer">
                <input
                  type="checkbox"
                  checked={notifications.courseUpdates}
                  onChange={e => setNotifications({ ...notifications, courseUpdates: e.target.checked })}
                  className="rounded text-indigo-600 focus:ring-indigo-500"
                />
                <span>Course enrollment and curriculum release updates</span>
              </label>
            </div>
          </div>

          <div className="pt-4 flex justify-end">
            <button
              type="submit"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 transition shadow-sm"
            >
              <Save className="w-3.5 h-3.5" />
              Save Account Changes
            </button>
          </div>
        </form>
      </div>

      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2 px-4 py-2.5 rounded-lg bg-slate-900 text-white text-xs font-medium shadow-xl border border-slate-700 animate-in slide-in-from-bottom-2 duration-200">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}
    </div>
  );
}
