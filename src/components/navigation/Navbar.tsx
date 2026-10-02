'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  Sparkles, 
  GraduationCap, 
  Layers, 
  BarChart3, 
  Database, 
  UserCheck, 
  ShieldCheck 
} from 'lucide-react';
import { isSupabaseConfigured } from '@/lib/supabaseClient';

export function Navbar() {
  const pathname = usePathname();
  const [showConfigModal, setShowConfigModal] = useState(false);
  const isSupabaseLive = isSupabaseConfigured();

  const navItems = [
    {
      label: 'Learner Portal',
      href: '/learn',
      icon: GraduationCap,
      description: 'Litmos-style training catalog & course player'
    },
    {
      label: 'Authoring Studio',
      href: '/author',
      icon: Layers,
      description: 'Gomo-style visual block course builder'
    },
    {
      label: 'Admin Analytics',
      href: '/admin/dashboard',
      icon: BarChart3,
      description: 'Manager KPIs, rosters & completion tracking'
    },
  ];

  return (
    <>
      <header className="sticky top-0 z-50 w-full border-b border-slate-800 bg-slate-950/80 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-8">
            <Link href="/" className="flex items-center gap-2.5 group">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 p-0.5 shadow-lg shadow-indigo-500/20 group-hover:scale-105 transition-transform">
                <div className="flex h-full w-full items-center justify-center rounded-[7px] bg-slate-950">
                  <Sparkles className="h-4 w-4 text-indigo-400" />
                </div>
              </div>
              <div className="flex flex-col">
                <span className="text-base font-bold tracking-tight text-white flex items-center gap-1.5">
                  Aura<span className="text-indigo-400">LMS</span>
                  <span className="rounded bg-indigo-500/10 px-1.5 py-0.2 text-[10px] font-semibold text-indigo-300 border border-indigo-500/20">
                    Gomo × Litmos
                  </span>
                </span>
                <span className="text-[11px] text-slate-400 hidden sm:inline">
                  Enterprise Authoring & Learning Path
                </span>
              </div>
            </Link>

            <nav className="hidden md:flex items-center gap-1">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`flex items-center gap-2 rounded-lg px-3 py-2 text-xs font-medium transition-all ${
                      isActive
                        ? 'bg-indigo-600/15 text-indigo-300 border border-indigo-500/30 shadow-sm'
                        : 'text-slate-400 hover:bg-slate-900 hover:text-slate-200'
                    }`}
                  >
                    <Icon className={`h-4 w-4 ${isActive ? 'text-indigo-400' : 'text-slate-400'}`} />
                    {item.label}
                  </Link>
                );
              })}
            </nav>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowConfigModal(true)}
              className={`flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium border transition-colors ${
                isSupabaseLive
                  ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30 hover:bg-emerald-500/20'
                  : 'bg-amber-500/10 text-amber-300 border-amber-500/30 hover:bg-amber-500/20'
              }`}
              title="Click to check Supabase configuration & mock data status"
            >
              <Database className="h-3 w-3" />
              <span className="hidden sm:inline">
                {isSupabaseLive ? 'Supabase Connected' : 'Mock State Active'}
              </span>
              <span className="sm:hidden">
                {isSupabaseLive ? 'Live' : 'Mock'}
              </span>
              <span className={`h-1.5 w-1.5 rounded-full ${isSupabaseLive ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'}`} />
            </button>

            <div className="hidden lg:flex items-center gap-2 rounded-lg border border-slate-800 bg-slate-900/60 px-2.5 py-1 text-xs text-slate-300">
              <UserCheck className="h-3.5 w-3.5 text-indigo-400" />
              <span>Demo Persona:</span>
              <span className="font-semibold text-white">Alex Mercer (Learner)</span>
            </div>

            <Link
              href="/author"
              className="hidden sm:flex items-center gap-1.5 rounded-lg bg-indigo-600 px-3 py-1.5 text-xs font-semibold text-white shadow-sm hover:bg-indigo-500 transition-colors"
            >
              <Layers className="h-3.5 w-3.5" />
              <span>Course Studio</span>
            </Link>
          </div>
        </div>
      </header>

      {showConfigModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-2xl border border-slate-800 bg-slate-900 p-6 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div className="flex items-center gap-2">
                <Database className="h-5 w-5 text-indigo-400" />
                <h3 className="font-semibold text-white">Data Architecture Status</h3>
              </div>
              <button
                onClick={() => setShowConfigModal(false)}
                className="rounded-lg p-1 text-slate-400 hover:bg-slate-800 hover:text-white"
              >
                ✕
              </button>
            </div>

            <div className="mt-4 space-y-3 text-xs text-slate-300">
              <div className={`p-3 rounded-lg border ${
                isSupabaseLive 
                  ? 'bg-emerald-950/40 border-emerald-800/60 text-emerald-200' 
                  : 'bg-amber-950/40 border-amber-800/60 text-amber-200'
              }`}>
                <div className="font-medium flex items-center gap-2">
                  <ShieldCheck className="h-4 w-4" />
                  {isSupabaseLive ? 'Connected to live Supabase project' : 'Running in Zero-Crash Local Mock Repository'}
                </div>
                <p className="mt-1 text-slate-400 text-[11px]">
                  {isSupabaseLive
                    ? 'All courses, block edits, and learner enrollments are syncing directly to your PostgreSQL database.'
                    : 'Supabase credentials are not currently supplied. The application is seamlessly utilizing client-side persistent storage with full editing and tracking functionality.'}
                </p>
              </div>

              <div className="rounded-lg bg-slate-950 p-3 border border-slate-800 space-y-1.5 font-mono text-[11px]">
                <div className="text-slate-400">Environment Keys (.env.local):</div>
                <div className="flex items-center justify-between text-slate-300">
                  <span>NEXT_PUBLIC_SUPABASE_URL</span>
                  <span className={isSupabaseLive ? 'text-emerald-400' : 'text-amber-400'}>
                    {isSupabaseLive ? 'Configured ✓' : 'Unset (Fallback active)'}
                  </span>
                </div>
                <div className="flex items-center justify-between text-slate-300">
                  <span>NEXT_PUBLIC_SUPABASE_ANON_KEY</span>
                  <span className={isSupabaseLive ? 'text-emerald-400' : 'text-amber-400'}>
                    {isSupabaseLive ? 'Configured ✓' : 'Unset (Fallback active)'}
                  </span>
                </div>
              </div>

              <p className="text-[11px] text-slate-400">
                To connect your live database, execute the SQL migration in <code className="text-indigo-300">supabase/schema.sql</code> in your Supabase SQL Editor and populate your project credentials into <code className="text-indigo-300">.env.local</code>.
              </p>
            </div>

            <div className="mt-6 flex justify-end">
              <button
                onClick={() => setShowConfigModal(false)}
                className="rounded-lg bg-indigo-600 px-4 py-2 text-xs font-semibold text-white hover:bg-indigo-500"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
