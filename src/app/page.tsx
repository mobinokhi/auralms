import Link from 'next/link';
import { 
  Sparkles, 
  Layers, 
  GraduationCap, 
  BarChart3, 
  Monitor, 
  CheckCircle2, 
  ShieldCheck, 
  ArrowRight, 
  Award,
  FileCode2
} from 'lucide-react';

export default function HomePage() {
  const sampleCourseId = '11111111-1111-1111-1111-111111111111';

  return (
    <div className="flex-1 bg-slate-950 text-slate-100">
      {/* Hero Section */}
      <section className="relative overflow-hidden border-b border-slate-800 bg-gradient-to-b from-indigo-950/20 via-slate-950 to-slate-950 py-16 sm:py-24">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 h-96 w-[600px] rounded-full bg-gradient-to-tr from-indigo-600/15 via-purple-600/15 to-pink-600/10 blur-[120px] pointer-events-none" />

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-indigo-500/30 bg-indigo-500/10 px-3.5 py-1 text-xs font-semibold text-indigo-300 backdrop-blur-md mb-6">
            <Sparkles className="h-3.5 w-3.5 text-indigo-400" />
            <span>Hybrid Architecture: Gomo Authoring × SAP Litmos Tracking</span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-black tracking-tight text-white max-w-4xl mx-auto leading-tight">
            Responsive Course Studio & Enterprise Learning Path
          </h1>

          <p className="mt-6 text-base sm:text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed">
            Create modular, multi-device corporate training with visual block authoring and real-time viewport simulation, backed by Litmos-grade learner progress tracking and manager compliance analytics.
          </p>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <Link
              href={`/author/editor/${sampleCourseId}`}
              className="flex items-center gap-2 rounded-xl bg-indigo-600 px-6 py-3 text-sm font-bold text-white shadow-xl shadow-indigo-500/25 hover:bg-indigo-500 active:scale-95 transition-all"
            >
              <Layers className="h-4 w-4" />
              Launch Gomo Course Editor
            </Link>

            <Link
              href={`/learn/${sampleCourseId}`}
              className="flex items-center gap-2 rounded-xl border border-slate-700 bg-slate-900/80 px-6 py-3 text-sm font-bold text-slate-200 hover:bg-slate-800 hover:text-white active:scale-95 transition-all shadow-sm"
            >
              <GraduationCap className="h-4 w-4 text-emerald-400" />
              Open Litmos Learner Player
            </Link>

            <Link
              href="/admin/dashboard"
              className="flex items-center gap-2 rounded-xl border border-slate-800 bg-slate-950/80 px-5 py-3 text-sm font-semibold text-slate-300 hover:bg-slate-900 hover:text-white transition-all"
            >
              <BarChart3 className="h-4 w-4 text-purple-400" />
              Manager Analytics
            </Link>
          </div>
        </div>
      </section>

      {/* 3 Core Functional Modules */}
      <section className="py-16 sm:py-20 border-b border-slate-800/80 bg-slate-950">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-xs font-bold uppercase tracking-wider text-indigo-400">
              Core Functional Modules
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-white mt-1">
              End-to-End Enterprise LMS Workflow
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 mt-2">
              Explore the dedicated interfaces built for instructional authors, corporate learners, and people operations managers.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Module 1: Gomo Visual Editor */}
            <div className="flex flex-col justify-between rounded-3xl border border-slate-800 bg-gradient-to-b from-slate-900/80 to-slate-900/40 p-6 backdrop-blur-sm hover:border-indigo-500/50 hover:shadow-xl hover:shadow-indigo-500/5 transition-all group">
              <div>
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 mb-5 group-hover:scale-110 transition-transform">
                  <Layers className="h-6 w-6" />
                </div>
                <div className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-wider text-indigo-400">
                  <span>Module 1</span>
                  <span>•</span>
                  <span>Instructional Design</span>
                </div>
                <h3 className="text-xl font-bold text-white mt-1">
                  Gomo Visual Block Authoring
                </h3>
                <p className="text-xs text-slate-400 mt-2.5 leading-relaxed">
                  Modular course creation with dynamic tree navigation (Course &gt; Modules &gt; Topics) and 6 rich block primitives: Rich Text, Callouts, 16:9 Video, Responsive Images, Accordions, and Scored Knowledge Checks.
                </p>

                <div className="mt-4 pt-4 border-t border-slate-800 space-y-2 text-xs text-slate-300">
                  <div className="flex items-center gap-2">
                    <Monitor className="h-3.5 w-3.5 text-indigo-400" />
                    <span>Real-time Desktop, Tablet & Mobile Viewports</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
                    <span>Drag/Reorder, Instant Editing & Autosave</span>
                  </div>
                </div>
              </div>

              <div className="mt-6 pt-4">
                <Link
                  href={`/author/editor/${sampleCourseId}`}
                  className="flex items-center justify-between w-full rounded-xl bg-indigo-600/20 border border-indigo-500/30 px-4 py-2.5 text-xs font-bold text-indigo-300 hover:bg-indigo-600 hover:text-white transition-all"
                >
                  <span>Open Visual Editor</span>
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </div>

            {/* Module 2: Litmos Learner Experience */}
            <div className="flex flex-col justify-between rounded-3xl border border-slate-800 bg-gradient-to-b from-slate-900/80 to-slate-900/40 p-6 backdrop-blur-sm hover:border-emerald-500/50 hover:shadow-xl hover:shadow-emerald-500/5 transition-all group">
              <div>
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 mb-5 group-hover:scale-110 transition-transform">
                  <GraduationCap className="h-6 w-6" />
                </div>
                <div className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-wider text-emerald-400">
                  <span>Module 2</span>
                  <span>•</span>
                  <span>Learner Experience</span>
                </div>
                <h3 className="text-xl font-bold text-white mt-1">
                  Litmos Distraction-Free Player
                </h3>
                <p className="text-xs text-slate-400 mt-2.5 leading-relaxed">
                  Clean learner portal with curriculum catalogs and in-progress filters. Distraction-free course player featuring collapsible outline drawers, cinema focus mode, and automatic state saving.
                </p>

                <div className="mt-4 pt-4 border-t border-slate-800 space-y-2 text-xs text-slate-300">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
                    <span>Scored Quiz Engine with Instant Feedback</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Award className="h-3.5 w-3.5 text-amber-400" />
                    <span>Completion Celebration & Certificate Modal</span>
                  </div>
                </div>
              </div>

              <div className="mt-6 pt-4">
                <Link
                  href="/learn"
                  className="flex items-center justify-between w-full rounded-xl bg-emerald-600/20 border border-emerald-500/30 px-4 py-2.5 text-xs font-bold text-emerald-300 hover:bg-emerald-600 hover:text-white transition-all"
                >
                  <span>Launch Learner Portal</span>
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </div>

            {/* Module 3: Manager Analytics */}
            <div className="flex flex-col justify-between rounded-3xl border border-slate-800 bg-gradient-to-b from-slate-900/80 to-slate-900/40 p-6 backdrop-blur-sm hover:border-purple-500/50 hover:shadow-xl hover:shadow-purple-500/5 transition-all group">
              <div>
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-purple-500/10 text-purple-400 border border-purple-500/20 mb-5 group-hover:scale-110 transition-transform">
                  <BarChart3 className="h-6 w-6" />
                </div>
                <div className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-wider text-purple-400">
                  <span>Module 3</span>
                  <span>•</span>
                  <span>Operations & Audit</span>
                </div>
                <h3 className="text-xl font-bold text-white mt-1">
                  Manager & Admin Analytics
                </h3>
                <p className="text-xs text-slate-400 mt-2.5 leading-relaxed">
                  Real-time intelligence dashboard featuring high-level KPIs: Total Enrolled, Active Learners, Average Completion Rate, and Average Quiz Scores across departments.
                </p>

                <div className="mt-4 pt-4 border-t border-slate-800 space-y-2 text-xs text-slate-300">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-3.5 w-3.5 text-purple-400" />
                    <span>Interactive Roster with Status Tags</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <FileCode2 className="h-3.5 w-3.5 text-indigo-400" />
                    <span>One-Click Compliance CSV Export</span>
                  </div>
                </div>
              </div>

              <div className="mt-6 pt-4">
                <Link
                  href="/admin/dashboard"
                  className="flex items-center justify-between w-full rounded-xl bg-purple-600/20 border border-purple-500/30 px-4 py-2.5 text-xs font-bold text-purple-300 hover:bg-purple-600 hover:text-white transition-all"
                >
                  <span>View Admin Dashboard</span>
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Infrastructure & Zero-Crash Architecture */}
      <section className="py-16 sm:py-20 bg-slate-900/30">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="rounded-3xl border border-slate-800 bg-slate-900/60 p-8 sm:p-10 backdrop-blur-md">
            <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8">
              <div className="max-w-2xl">
                <div className="flex items-center gap-2 text-indigo-400 text-xs font-bold uppercase tracking-wider mb-2">
                  <ShieldCheck className="h-4 w-4" />
                  Enterprise Reliability & Zero-Crash Execution
                </div>
                <h3 className="text-2xl font-bold text-white">
                  Designed for Seamless Vercel Preview & Supabase Postgres
                </h3>
                <p className="mt-2 text-xs sm:text-sm text-slate-300 leading-relaxed">
                  AuraLMS includes an intelligent data-repository abstraction. If Supabase keys are not set during a Vercel preview build or local checkout, it automatically and gracefully routes to persistent local mock storage. When you provide your Supabase URL and anon key, it seamlessly switches to live PostgreSQL with Row Level Security.
                </p>

                <div className="mt-6 grid grid-cols-2 sm:grid-cols-3 gap-4 font-mono text-[11px] text-slate-400">
                  <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800">
                    <span className="text-white block font-bold">PostgreSQL RLS</span>
                    7 Tables & Security Policies
                  </div>
                  <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800">
                    <span className="text-white block font-bold">Zero-Crash Build</span>
                    Passes `next build` anytime
                  </div>
                  <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800">
                    <span className="text-white block font-bold">App Router Ready</span>
                    Edge & Serverless Optimized
                  </div>
                </div>
              </div>

              <div className="w-full lg:w-auto flex flex-col gap-3">
                <Link
                  href={`/learn/${sampleCourseId}`}
                  className="rounded-xl bg-indigo-600 px-6 py-3 text-xs font-bold text-white text-center hover:bg-indigo-500 shadow-lg shadow-indigo-500/20"
                >
                  Test Demo Course Player
                </Link>
                <Link
                  href={`/author/editor/${sampleCourseId}`}
                  className="rounded-xl border border-slate-700 bg-slate-800 px-6 py-3 text-xs font-bold text-slate-200 text-center hover:bg-slate-700"
                >
                  Test Gomo Block Authoring
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
