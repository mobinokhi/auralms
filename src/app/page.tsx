'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { MasDataStore } from '@/lib/mockData';
import { Course, ActivityItem } from '@/types/masLms';
import {
  Users,
  BookOpen,
  CheckCircle2,
  TrendingUp,
  ArrowRight,
  Clock,
  Award,
  Sparkles,
  PlayCircle,
  ShieldCheck,
  Building2,
  FileText
} from 'lucide-react';

export default function DashboardPage() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [activities, setActivities] = useState<ActivityItem[]>([]);
  const [activeRole, setActiveRole] = useState<'Admin' | 'Instructor' | 'Learner'>('Admin');

  useEffect(() => {
    setCourses(MasDataStore.getCourses());
    setActivities(MasDataStore.getActivities());
    setActiveRole(MasDataStore.getActiveRole());
  }, []);

  // Filter in-progress or recommended courses
  const inProgressCourses = courses.filter((c) => (c.progress ?? 0) > 0 && (c.progress ?? 0) < 100);
  const completedCourses = courses.filter((c) => (c.progress ?? 0) === 100);

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      {/* ---------------------------------------------------------------------- */}
      {/* 1. Header Greeting & Welcome Banner                                    */}
      {/* ---------------------------------------------------------------------- */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-800/80">
        <div>
          <div className="flex items-center gap-2 text-indigo-400 text-xs font-bold uppercase tracking-wider mb-1.5">
            <Sparkles className="h-3.5 w-3.5" />
            <span>M.A.S Enterprise Intelligence</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Workforce Learning & Compliance Hub
          </h1>
          <p className="mt-1 text-xs sm:text-sm text-slate-400">
            Monitor real-time training velocity, course retention benchmarks, and regulatory compliance across teams.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/courses"
            className="flex items-center gap-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold px-4 py-2.5 shadow-lg shadow-indigo-600/20 active:scale-95 transition-all"
          >
            <BookOpen className="h-4 w-4" />
            <span>Browse All Courses</span>
          </Link>
          <Link
            href="/reports"
            className="flex items-center gap-2 rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-300 hover:text-white text-xs font-bold px-4 py-2.5 transition-all"
          >
            <TrendingUp className="h-4 w-4 text-emerald-400" />
            <span>Executive Reports</span>
          </Link>
        </div>
      </div>

      {/* ---------------------------------------------------------------------- */}
      {/* 2. Top 4 Metric KPI Cards                                              */}
      {/* ---------------------------------------------------------------------- */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Metric 1 */}
        <div className="rounded-2xl border border-slate-800/80 bg-slate-900/60 p-5 backdrop-blur-xs relative overflow-hidden group hover:border-slate-700 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Active Learners
            </span>
            <div className="h-8 w-8 rounded-lg bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
              <Users className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-white">142</span>
            <span className="text-xs font-semibold text-emerald-400">↑ +12% this mo</span>
          </div>
          <div className="mt-2 text-[11px] text-slate-500">
            Across 3 operational business teams
          </div>
        </div>

        {/* Metric 2 */}
        <div className="rounded-2xl border border-slate-800/80 bg-slate-900/60 p-5 backdrop-blur-xs relative overflow-hidden group hover:border-slate-700 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Enrolled Courses
            </span>
            <div className="h-8 w-8 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
              <BookOpen className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-white">6</span>
            <span className="text-xs font-semibold text-slate-400">Curriculums</span>
          </div>
          <div className="mt-2 text-[11px] text-slate-500">
            21 interactive modular lessons
          </div>
        </div>

        {/* Metric 3 */}
        <div className="rounded-2xl border border-slate-800/80 bg-slate-900/60 p-5 backdrop-blur-xs relative overflow-hidden group hover:border-slate-700 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Completion Rate
            </span>
            <div className="h-8 w-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
              <CheckCircle2 className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-white">88.4%</span>
            <span className="text-xs font-semibold text-emerald-400">Audit Ready</span>
          </div>
          <div className="mt-2 text-[11px] text-slate-500">
            Target benchmark: 80.0%
          </div>
        </div>

        {/* Metric 4 */}
        <div className="rounded-2xl border border-slate-800/80 bg-slate-900/60 p-5 backdrop-blur-xs relative overflow-hidden group hover:border-slate-700 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Assessment Score
            </span>
            <div className="h-8 w-8 rounded-lg bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400">
              <Award className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-white">93.2%</span>
            <span className="text-xs font-semibold text-purple-400">Retention</span>
          </div>
          <div className="mt-2 text-[11px] text-slate-500">
            First-attempt quiz pass benchmark
          </div>
        </div>
      </div>

      {/* ---------------------------------------------------------------------- */}
      {/* 3. In Progress Training & Quick Actions                                 */}
      {/* ---------------------------------------------------------------------- */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left 2 Columns: In Progress Courses */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-extrabold text-white tracking-tight">
                In-Progress Curriculums
              </h2>
              <p className="text-xs text-slate-400">
                Pick up right where your workforce left off
              </p>
            </div>
            <Link
              href="/courses"
              className="text-xs font-bold text-indigo-400 hover:text-indigo-300 flex items-center gap-1 transition-colors"
            >
              <span>View all ({courses.length})</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {inProgressCourses.map((course) => (
              <div
                key={course.id}
                className="rounded-2xl border border-slate-800/80 bg-slate-900/40 p-4 hover:border-slate-700/80 transition-all flex flex-col justify-between group"
              >
                <div>
                  <div className="relative h-32 w-full rounded-xl overflow-hidden mb-3.5 bg-slate-950">
                    <img
                      src={course.thumbnailUrl}
                      alt={course.title}
                      className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute top-2.5 left-2.5">
                      <span className="text-[10px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded-full bg-slate-900/90 text-white backdrop-blur-md border border-slate-700">
                        {course.category}
                      </span>
                    </div>
                  </div>

                  <h3 className="text-sm font-bold text-white line-clamp-1 group-hover:text-indigo-300 transition-colors">
                    {course.title}
                  </h3>
                  <p className="text-xs text-slate-400 line-clamp-2 mt-1 leading-relaxed">
                    {course.description}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-800/60">
                  <div className="flex items-center justify-between text-xs mb-1.5">
                    <span className="text-slate-400 font-medium">Progress</span>
                    <span className="font-extrabold text-white">{course.progress}%</span>
                  </div>
                  <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden mb-3">
                    <div
                      className="h-full bg-gradient-to-r from-indigo-500 to-violet-500 rounded-full transition-all duration-500"
                      style={{ width: `${course.progress}%` }}
                    />
                  </div>

                  <Link
                    href={`/courses/${course.id}`}
                    className="w-full flex items-center justify-center gap-1.5 py-2 rounded-xl bg-slate-800 hover:bg-indigo-600 text-xs font-bold text-white transition-all shadow-xs group-hover:bg-indigo-600"
                  >
                    <PlayCircle className="h-3.5 w-3.5" />
                    <span>Continue Lesson</span>
                  </Link>
                </div>
              </div>
            ))}
          </div>

          {/* Quick Shortcuts Banner */}
          <div className="rounded-2xl border border-indigo-500/20 bg-gradient-to-r from-indigo-950/40 via-purple-950/20 to-slate-900/60 p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 mt-6">
            <div className="flex items-center gap-3.5">
              <div className="h-10 w-10 rounded-xl bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400 flex-shrink-0">
                <ShieldCheck className="h-5 w-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-white">Q4 Compliance Recertification Live</h4>
                <p className="text-xs text-slate-400 mt-0.5">
                  100% workforce audit readiness required before October 31, 2026.
                </p>
              </div>
            </div>
            <Link
              href="/guidelines"
              className="text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-500 px-4 py-2 rounded-xl transition-colors whitespace-nowrap shadow-sm"
            >
              Review Policies
            </Link>
          </div>
        </div>

        {/* Right 1 Column: Real-Time Activity Feed */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-extrabold text-white tracking-tight">
                Live Activity Stream
              </h2>
              <p className="text-xs text-slate-400">
                Real-time training milestones
              </p>
            </div>
            <span className="h-2 w-2 rounded-full bg-emerald-400 animate-ping" />
          </div>

          <div className="rounded-2xl border border-slate-800/80 bg-slate-900/40 p-4 divide-y divide-slate-800/60">
            {activities.map((act) => (
              <div key={act.id} className="py-3.5 first:pt-0 last:pb-0 flex items-start gap-3">
                <img
                  src={act.userAvatar}
                  alt={act.userName}
                  className="h-8 w-8 rounded-full object-cover ring-1 ring-slate-700 flex-shrink-0 mt-0.5"
                />
                <div className="min-w-0 flex-1">
                  <div className="text-xs font-bold text-white leading-snug">
                    {act.userName}
                  </div>
                  <div className="text-xs text-slate-400 truncate mt-0.5">
                    {act.type === 'course_completed' && 'Completed course: '}
                    {act.type === 'quiz_passed' && 'Passed assessment: '}
                    {act.type === 'user_joined' && 'Joined: '}
                    {act.type === 'certificate_issued' && 'Certified in: '}
                    {act.type === 'team_created' && 'Provisioned: '}
                    <span className="font-semibold text-slate-300">{act.targetTitle}</span>
                  </div>
                  <div className="text-[10px] text-slate-500 font-medium mt-1">
                    {act.timestamp}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Quick Team Status Card */}
          <div className="rounded-2xl border border-slate-800/80 bg-slate-900/40 p-5 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-white uppercase tracking-wider">
                Teams Overview
              </span>
              <Link href="/teams" className="text-xs text-indigo-400 hover:text-indigo-300 font-semibold">
                Manage
              </Link>
            </div>
            <div className="space-y-2.5 text-xs text-slate-300">
              <div className="flex items-center justify-between">
                <span>Operations</span>
                <span className="font-bold text-emerald-400">92% Done</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Finance & Advisory</span>
                <span className="font-bold text-indigo-400">85% Done</span>
              </div>
              <div className="flex items-center justify-between">
                <span>IT Support</span>
                <span className="font-bold text-emerald-400">96% Done</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
