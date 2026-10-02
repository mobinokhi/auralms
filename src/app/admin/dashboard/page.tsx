'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { DataRepository } from '@/lib/data-repository';
import { AnalyticsKPIs, LearnerRosterItem, EnrollmentStatus, Course } from '@/types/lms';
import { 
  Gauge, 
  GraduationCap, 
  User, 
  Users, 
  TrendingUp, 
  Mail, 
  ChevronRight, 
  Search, 
  Download, 
  Plus, 
  HelpCircle, 
  X, 
  CheckCircle2, 
  Clock, 
  Award,
  ArrowRight,
  Layers,
  ChevronDown
} from 'lucide-react';

export default function AdminDashboardPage() {
  const router = useRouter();
  const [kpis, setKpis] = useState<AnalyticsKPIs | null>(null);
  const [roster, setRoster] = useState<LearnerRosterItem[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [activeTab, setActiveTab] = useState<'DASHBOARD' | 'ACTIVITY' | 'NEWS'>('DASHBOARD');
  const [activeNav, setActiveNav] = useState<'dashboard' | 'courses' | 'people' | 'teams' | 'reports' | 'messages'>('dashboard');
  
  // Modals state
  const [showCreateCourseModal, setShowCreateCourseModal] = useState(false);
  const [showCreateUserModal, setShowCreateUserModal] = useState(false);
  const [showCreateTeamModal, setShowCreateTeamModal] = useState(false);
  const [showBuyNowModal, setShowBuyNowModal] = useState(false);
  const [showGuideModal, setShowGuideModal] = useState(false);

  // Filter & Search
  const [filterStatus, setFilterStatus] = useState<'all' | EnrollmentStatus>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Form states for modals
  const [newCourseTitle, setNewCourseTitle] = useState('');
  const [newCourseCategory, setNewCourseCategory] = useState('Information Security');
  const [newCourseDescription, setNewCourseDescription] = useState('');
  const [newUserName, setNewUserName] = useState('');
  const [newUserEmail, setNewUserEmail] = useState('');
  const [newUserDept, setNewUserDept] = useState('Engineering');
  const [newTeamName, setNewTeamName] = useState('');
  const [newTeamDept, setNewTeamDept] = useState('Product Security');

  // Success toast
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  useEffect(() => {
    async function loadData() {
      const analytics = await DataRepository.getAdminAnalytics();
      const allCourses = await DataRepository.getCourses();
      setKpis(analytics.kpis);
      setRoster(analytics.roster);
      setCourses(allCourses);
    }
    loadData();
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
    a.download = `mas_lms_compliance_roster_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    showToast('Exported CSV Compliance Roster successfully.');
  };

  const handleCreateCourse = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCourseTitle.trim()) return;
    const created: Course = {
      id: 'course-' + Date.now(),
      title: newCourseTitle.trim(),
      description: newCourseDescription.trim() || 'Enterprise compliance & interactive learning course.',
      category: newCourseCategory,
      thumbnail_url: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=800&auto=format&fit=crop',
      estimated_minutes: 30,
      status: 'draft'
    };
    await DataRepository.saveCourse(created);
    setCourses(prev => [created, ...prev]);
    setShowCreateCourseModal(false);
    setNewCourseTitle('');
    setNewCourseDescription('');
    showToast(`Course "${created.title}" created. Launching Gomo Studio...`);
    setTimeout(() => {
      router.push(`/author/editor/${created.id}`);
    }, 1200);
  };

  const handleCreateUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUserName.trim() || !newUserEmail.trim()) return;
    const newItem: LearnerRosterItem = {
      id: 'roster-' + Date.now(),
      userId: 'user-' + Date.now(),
      learnerName: newUserName.trim(),
      email: newUserEmail.trim(),
      department: newUserDept,
      avatarUrl: '',
      courseId: courses[0]?.id || 'course-default',
      courseTitle: courses[0]?.title || 'Security Awareness & Hygiene',
      progressPercentage: 0,
      status: 'not_started',
      quizScore: null,
      lastActive: 'Just now'
    };
    setRoster(prev => [newItem, ...prev]);
    setShowCreateUserModal(false);
    setNewUserName('');
    setNewUserEmail('');
    showToast(`Learner "${newItem.learnerName}" added to ${newItem.department}.`);
  };

  const handleCreateTeam = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTeamName.trim()) return;
    setShowCreateTeamModal(false);
    showToast(`Team "${newTeamName.trim()}" created in ${newTeamDept}.`);
    setNewTeamName('');
  };

  // Mock Activity Feed
  const activityItems = [
    { id: 1, user: 'Sarah Jenkins', action: 'Passed Knowledge Check', course: 'Phishing & Social Engineering', score: '100%', time: '12 minutes ago', badge: 'bg-emerald-100 text-emerald-800' },
    { id: 2, user: 'David Chen', action: 'Completed Course', course: 'Cybersecurity Hygiene 2026', score: '92%', time: '45 minutes ago', badge: 'bg-emerald-100 text-emerald-800' },
    { id: 3, user: 'Alex Rivera', action: 'Started Module 2', course: 'MFA Push Fatigue & Impersonation', score: null, time: '2 hours ago', badge: 'bg-blue-100 text-blue-800' },
    { id: 4, user: 'Elena Rostova', action: 'Enrolled in Compliance Path', course: 'SOC2 Type II Annual Recertification', score: null, time: '3 hours ago', badge: 'bg-purple-100 text-purple-800' },
    { id: 5, user: 'Marcus Vance', action: 'Submitted Quiz Attempt', course: 'Data Protection & GDPR', score: '85%', time: '5 hours ago', badge: 'bg-emerald-100 text-emerald-800' }
  ];

  // Mock News Items
  const newsItems = [
    { id: 1, title: 'Q4 Enterprise Security Recertification Deadline', date: 'October 15, 2026', excerpt: 'All workforce members are required to complete the updated Generative AI & Phishing Prevention module prior to end of month audit.', tag: 'Compliance Notice' },
    { id: 2, title: 'New Gomo Authoring Blocks Released', date: 'September 28, 2026', excerpt: 'Authors can now embed responsive multi-choice quizzes with instant rationale feedback and mobile preview simulation directly in the course canvas.', tag: 'Platform Update' },
    { id: 3, title: 'Litmos Tracking & SCORM Compliance Benchmark', date: 'September 14, 2026', excerpt: 'Quarterly compliance across Engineering and Operations has exceeded 94% on first-time quiz attempts.', tag: 'Executive Report' }
  ];

  const totalCoursesCount = courses.length || 3;
  const activeCoursesCount = courses.filter(c => c.status === 'published').length || 2;
  const totalUsersCount = roster.length ? roster.length * 12 : 148;
  const activeUsersCount = kpis?.activeLearners ? kpis.activeLearners * 8 : 112;
  const avgCompletion = kpis?.averageCompletionRate ?? 78;
  const avgQuizScore = kpis?.averageQuizScore ?? 91;

  return (
    <div className="min-h-screen bg-[#f3f4f6] text-slate-800 flex flex-col font-sans relative selection:bg-lime-500 selection:text-white">
      {/* 1. Green Litmos Trial Banner */}
      <div className="bg-[#61bd1a] text-white py-2 px-4 text-xs font-semibold flex items-center justify-center gap-3 shadow-sm border-b border-lime-600/30">
        <span>Your trial expires in <strong className="text-white text-sm font-extrabold">13</strong> days. Contact Us or</span>
        <button 
          onClick={() => setShowBuyNowModal(true)}
          className="bg-black hover:bg-slate-900 text-white font-extrabold text-[11px] px-3 py-1 rounded tracking-wider uppercase transition-transform active:scale-95 shadow-sm"
        >
          BUY NOW
        </button>
      </div>

      {/* 2. Top Header Bar */}
      <header className="bg-white border-b border-slate-200 px-6 py-3 flex items-center justify-between shadow-[0_1px_3px_rgba(0,0,0,0.05)]">
        <div className="flex items-center gap-3">
          {/* Litmos Mascot / MAS LMS Logo Icon */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="relative">
              <div className="h-11 w-11 rounded-full bg-[#61bd1a] flex items-center justify-center shadow-md shadow-lime-500/20 group-hover:scale-105 transition-transform">
                {/* Friendly mascot face with glasses icon */}
                <svg className="w-7 h-7 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10" fill="#61bd1a" stroke="none" />
                  <circle cx="8" cy="12" r="2.5" fill="white" stroke="#1c1d1f" strokeWidth="1.5" />
                  <circle cx="16" cy="12" r="2.5" fill="white" stroke="#1c1d1f" strokeWidth="1.5" />
                  <path d="M10.5 12h3" stroke="#1c1d1f" strokeWidth="1.5" />
                  <path d="M8 8a3 3 0 0 1 8 0" stroke="white" strokeWidth="2" strokeLinecap="round" />
                  <path d="M10 16a2 2 0 0 0 4 0" stroke="#1c1d1f" strokeWidth="1.5" strokeLinecap="round" />
                </svg>
              </div>
            </div>
            <div className="flex flex-col">
              <span className="text-2xl font-black text-slate-900 tracking-tight leading-none">
                Litmos <span className="text-xs font-semibold text-slate-400 font-mono tracking-normal">MAS LMS</span>
              </span>
              <span className="text-[11px] font-semibold text-slate-400 tracking-wide mt-0.5">
                by CallidusCloud / MAS IT
              </span>
            </div>
          </Link>
        </div>

        {/* Right Header Controls */}
        <div className="flex items-center gap-4">
          <Link
            href="/learn"
            className="hidden sm:inline-flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 px-3 py-1.5 rounded transition-colors"
          >
            <GraduationCap className="h-3.5 w-3.5 text-lime-600" />
            Switch to Learner View
          </Link>

          <Link
            href="/author"
            className="hidden sm:inline-flex items-center gap-1.5 text-xs font-bold text-white bg-slate-800 hover:bg-slate-900 px-3 py-1.5 rounded transition-colors"
          >
            <Layers className="h-3.5 w-3.5 text-lime-400" />
            Gomo Authoring Studio
          </Link>

          <div className="flex items-center gap-2 pl-3 border-l border-slate-200 cursor-pointer group">
            <div className="h-8 w-8 rounded-full bg-slate-400 flex items-center justify-center text-white font-bold text-xs">
              <User className="h-4 w-4" />
            </div>
            <ChevronDown className="h-3.5 w-3.5 text-slate-400 group-hover:text-slate-600 transition-transform" />
          </div>
        </div>
      </header>

      {/* 3. Main Dashboard Body (Sidebar + Content Canvas) */}
      <div className="flex flex-1">
        {/* Left Dark Sidebar (Classic Litmos Black Nav) */}
        <aside className="w-56 bg-[#1b1d1f] text-slate-300 flex flex-col flex-shrink-0 select-none shadow-xl">
          <nav className="p-3 space-y-1">
            <button
              onClick={() => { setActiveNav('dashboard'); setActiveTab('DASHBOARD'); }}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded text-sm font-bold transition-all text-left ${
                activeNav === 'dashboard'
                  ? 'bg-[#2a2d31] text-white shadow-inner border-l-4 border-lime-500'
                  : 'hover:bg-[#25282c] hover:text-white text-slate-400'
              }`}
            >
              <Gauge className="h-4 w-4 text-slate-300" />
              Dashboard
            </button>

            <Link
              href="/learn"
              className="w-full flex items-center gap-3 px-4 py-3 rounded text-sm font-bold text-slate-400 hover:bg-[#25282c] hover:text-white transition-all text-left"
            >
              <GraduationCap className="h-4 w-4 text-slate-300" />
              Courses
            </Link>

            <button
              onClick={() => { setActiveNav('people'); setShowCreateUserModal(true); }}
              className="w-full flex items-center gap-3 px-4 py-3 rounded text-sm font-bold text-slate-400 hover:bg-[#25282c] hover:text-white transition-all text-left"
            >
              <User className="h-4 w-4 text-slate-300" />
              People
            </button>

            <button
              onClick={() => { setActiveNav('teams'); setShowCreateTeamModal(true); }}
              className="w-full flex items-center gap-3 px-4 py-3 rounded text-sm font-bold text-slate-400 hover:bg-[#25282c] hover:text-white transition-all text-left"
            >
              <Users className="h-4 w-4 text-slate-300" />
              Teams
            </button>

            <button
              onClick={exportCSV}
              className="w-full flex items-center gap-3 px-4 py-3 rounded text-sm font-bold text-slate-400 hover:bg-[#25282c] hover:text-white transition-all text-left"
            >
              <TrendingUp className="h-4 w-4 text-slate-300" />
              Reports
            </button>

            <button
              onClick={() => showToast('Messaging inbox loaded. 0 unread alerts.')}
              className="w-full flex items-center gap-3 px-4 py-3 rounded text-sm font-bold text-slate-400 hover:bg-[#25282c] hover:text-white transition-all text-left"
            >
              <Mail className="h-4 w-4 text-slate-300" />
              Messages
            </button>
          </nav>

          <div className="mt-auto p-4 border-t border-slate-800 text-[11px] text-slate-500">
            <div className="font-semibold text-slate-400">MAS LMS Enterprise</div>
            <div>Build v2.4 (Litmos Core)</div>
          </div>
        </aside>

        {/* Center Content Workspace */}
        <main className="flex-1 p-6 lg:p-8 overflow-y-auto">
          {/* Litmos View Tabs (DASHBOARD / ACTIVITY / NEWS) */}
          <div className="flex items-center gap-1 border-b border-slate-300 mb-6">
            <button
              onClick={() => setActiveTab('DASHBOARD')}
              className={`relative px-6 py-2.5 text-xs font-black tracking-wider uppercase transition-all ${
                activeTab === 'DASHBOARD'
                  ? 'bg-[#373a3c] text-white rounded-t'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60 rounded-t'
              }`}
            >
              DASHBOARD
              {activeTab === 'DASHBOARD' && (
                <div className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-0 h-0 border-x-4 border-x-transparent border-t-4 border-t-[#373a3c]" />
              )}
            </button>

            <button
              onClick={() => setActiveTab('ACTIVITY')}
              className={`relative px-6 py-2.5 text-xs font-black tracking-wider uppercase transition-all ${
                activeTab === 'ACTIVITY'
                  ? 'bg-[#373a3c] text-white rounded-t'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60 rounded-t'
              }`}
            >
              ACTIVITY
              {activeTab === 'ACTIVITY' && (
                <div className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-0 h-0 border-x-4 border-x-transparent border-t-4 border-t-[#373a3c]" />
              )}
            </button>

            <button
              onClick={() => setActiveTab('NEWS')}
              className={`relative px-6 py-2.5 text-xs font-black tracking-wider uppercase transition-all ${
                activeTab === 'NEWS'
                  ? 'bg-[#373a3c] text-white rounded-t'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60 rounded-t'
              }`}
            >
              NEWS
              {activeTab === 'NEWS' && (
                <div className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-0 h-0 border-x-4 border-x-transparent border-t-4 border-t-[#373a3c]" />
              )}
            </button>
          </div>

          {/* TAB 1: DASHBOARD (Identical to screenshot) */}
          {activeTab === 'DASHBOARD' && (
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
              {/* Left 3 Columns: Distinctive Litmos Donut Cards Grid */}
              <div className="lg:col-span-3 space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-2 gap-5">
                  {/* Gauge Card 1: TOTAL COURSES */}
                  <div className="bg-white rounded-lg p-8 border border-slate-200/80 shadow-[0_2px_4px_rgba(0,0,0,0.04)] flex flex-col items-center justify-center hover:shadow-md transition-shadow">
                    <div className="h-32 w-32 rounded-full bg-[#464a4e] flex flex-col items-center justify-center shadow-inner relative group">
                      <GraduationCap className="h-7 w-7 text-[#61bd1a] mb-1" />
                      <span className="text-3xl font-black text-white tracking-tight">
                        {totalCoursesCount}
                      </span>
                    </div>
                    <span className="mt-5 text-xs font-extrabold tracking-wider text-slate-600 uppercase">
                      TOTAL COURSES
                    </span>
                  </div>

                  {/* Gauge Card 2: ACTIVE COURSES */}
                  <div className="bg-white rounded-lg p-8 border border-slate-200/80 shadow-[0_2px_4px_rgba(0,0,0,0.04)] flex flex-col items-center justify-center hover:shadow-md transition-shadow">
                    <div className="h-32 w-32 rounded-full border-[10px] border-[#38bdf8] bg-[#464a4e] flex flex-col items-center justify-center shadow-inner relative">
                      <span className="text-3xl font-black text-white tracking-tight">
                        {activeCoursesCount}
                      </span>
                    </div>
                    <span className="mt-5 text-xs font-extrabold tracking-wider text-slate-600 uppercase">
                      ACTIVE COURSES
                    </span>
                  </div>

                  {/* Gauge Card 3: TOTAL USERS */}
                  <div className="bg-white rounded-lg p-8 border border-slate-200/80 shadow-[0_2px_4px_rgba(0,0,0,0.04)] flex flex-col items-center justify-center hover:shadow-md transition-shadow">
                    <div className="h-32 w-32 rounded-full bg-[#464a4e] flex flex-col items-center justify-center shadow-inner relative">
                      <Users className="h-7 w-7 text-[#61bd1a] mb-1" />
                      <span className="text-3xl font-black text-white tracking-tight">
                        {totalUsersCount}
                      </span>
                    </div>
                    <span className="mt-5 text-xs font-extrabold tracking-wider text-slate-600 uppercase">
                      TOTAL USERS
                    </span>
                  </div>

                  {/* Gauge Card 4: ACTIVE LEARNERS */}
                  <div className="bg-white rounded-lg p-8 border border-slate-200/80 shadow-[0_2px_4px_rgba(0,0,0,0.04)] flex flex-col items-center justify-center hover:shadow-md transition-shadow">
                    <div className="h-32 w-32 rounded-full border-[10px] border-[#22c55e] bg-[#464a4e] flex flex-col items-center justify-center shadow-inner relative">
                      <span className="text-3xl font-black text-white tracking-tight">
                        {activeUsersCount}
                      </span>
                    </div>
                    <span className="mt-5 text-xs font-extrabold tracking-wider text-slate-600 uppercase">
                      ACTIVE LEARNERS
                    </span>
                  </div>
                </div>

                {/* Additional Litmos KPI Summary Strip */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 bg-white p-5 rounded-lg border border-slate-200/80 shadow-sm">
                  <div className="text-center border-r border-slate-200 last:border-none">
                    <div className="text-xs font-bold text-slate-500 uppercase">Curriculum Modules</div>
                    <div className="text-2xl font-black text-slate-800 mt-1">12</div>
                  </div>
                  <div className="text-center border-r border-slate-200 last:border-none">
                    <div className="text-xs font-bold text-slate-500 uppercase">Avg Completion</div>
                    <div className="text-2xl font-black text-emerald-600 mt-1">{avgCompletion}%</div>
                  </div>
                  <div className="text-center border-r border-slate-200 last:border-none">
                    <div className="text-xs font-bold text-slate-500 uppercase">Quiz Pass Rate</div>
                    <div className="text-2xl font-black text-purple-600 mt-1">{avgQuizScore}%</div>
                  </div>
                  <div className="text-center">
                    <div className="text-xs font-bold text-slate-500 uppercase">Compliance Status</div>
                    <div className="text-xs font-extrabold text-emerald-700 bg-emerald-100 py-1 px-2.5 rounded-full inline-block mt-1">
                      AUDIT READY
                    </div>
                  </div>
                </div>

                {/* Workforce Compliance Roster */}
                <div className="bg-white rounded-lg border border-slate-200/80 shadow-sm overflow-hidden">
                  <div className="p-5 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                      <h3 className="text-sm font-black text-slate-800 uppercase tracking-wide">
                        Enterprise Learner Progress Roster
                      </h3>
                      <p className="text-xs text-slate-500 mt-0.5">
                        Real-time verification of completed topics, quiz retention scores, and last active sessions.
                      </p>
                    </div>

                    <div className="flex items-center gap-3">
                      {/* Search */}
                      <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
                        <input
                          type="text"
                          placeholder="Search learners, depts..."
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          className="rounded border border-slate-300 bg-slate-50 pl-8 pr-3 py-1.5 text-xs text-slate-800 placeholder-slate-400 focus:bg-white focus:outline-none focus:ring-1 focus:ring-slate-500"
                        />
                      </div>

                      {/* Filter */}
                      <select
                        value={filterStatus}
                        onChange={(e) => setFilterStatus(e.target.value as 'all' | EnrollmentStatus)}
                        className="rounded border border-slate-300 bg-slate-50 px-2.5 py-1.5 text-xs font-semibold text-slate-700 focus:outline-none"
                      >
                        <option value="all">All Statuses</option>
                        <option value="completed">Completed</option>
                        <option value="in_progress">In Progress</option>
                        <option value="not_started">Not Started</option>
                      </select>

                      <button
                        onClick={exportCSV}
                        className="flex items-center gap-1.5 rounded bg-slate-800 hover:bg-slate-900 text-white px-3 py-1.5 text-xs font-bold transition-colors"
                      >
                        <Download className="h-3.5 w-3.5" />
                        CSV
                      </button>
                    </div>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs text-slate-700">
                      <thead className="bg-slate-100 text-slate-600 font-bold uppercase tracking-wider text-[11px] border-b border-slate-200">
                        <tr>
                          <th className="py-3 px-4">Learner</th>
                          <th className="py-3 px-4">Department</th>
                          <th className="py-3 px-4">Enrolled Course</th>
                          <th className="py-3 px-4">Progress</th>
                          <th className="py-3 px-4">Status</th>
                          <th className="py-3 px-4">Quiz Score</th>
                          <th className="py-3 px-4">Last Active</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 font-medium">
                        {filteredRoster.map((item) => (
                          <tr key={item.id} className="hover:bg-slate-50/80 transition-colors">
                            <td className="py-3 px-4">
                              <div className="font-bold text-slate-900">{item.learnerName}</div>
                              <div className="text-[11px] text-slate-400">{item.email}</div>
                            </td>
                            <td className="py-3 px-4">{item.department}</td>
                            <td className="py-3 px-4 font-semibold text-slate-800">{item.courseTitle}</td>
                            <td className="py-3 px-4">
                              <div className="flex items-center gap-2">
                                <div className="h-2 w-20 rounded-full bg-slate-200 overflow-hidden">
                                  <div 
                                    className="h-full bg-lime-600 rounded-full" 
                                    style={{ width: `${item.progressPercentage}%` }} 
                                  />
                                </div>
                                <span className="font-bold text-[11px]">{item.progressPercentage}%</span>
                              </div>
                            </td>
                            <td className="py-3 px-4">
                              {item.status === 'completed' && (
                                <span className="inline-flex items-center gap-1 rounded bg-emerald-100 px-2 py-0.5 text-[10px] font-bold text-emerald-800">
                                  <CheckCircle2 className="h-3 w-3" /> Completed
                                </span>
                              )}
                              {item.status === 'in_progress' && (
                                <span className="inline-flex items-center gap-1 rounded bg-blue-100 px-2 py-0.5 text-[10px] font-bold text-blue-800">
                                  <Clock className="h-3 w-3" /> In Progress
                                </span>
                              )}
                              {item.status === 'not_started' && (
                                <span className="inline-flex items-center gap-1 rounded bg-slate-200 px-2 py-0.5 text-[10px] font-bold text-slate-700">
                                  Not Started
                                </span>
                              )}
                            </td>
                            <td className="py-3 px-4">
                              {item.quizScore !== null ? (
                                <span className="font-bold text-slate-900">{item.quizScore}%</span>
                              ) : (
                                <span className="text-slate-400">—</span>
                              )}
                            </td>
                            <td className="py-3 px-4 text-slate-500">{item.lastActive}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>

              {/* Right Column: "QUICK ACTIONS" (Exact Box from Screenshot) */}
              <div className="space-y-6">
                <div className="bg-white rounded-lg border border-slate-200/80 shadow-sm p-6">
                  <h3 className="text-xs font-black text-slate-600 uppercase tracking-wider mb-5">
                    QUICK ACTIONS
                  </h3>

                  <div className="space-y-3">
                    <button
                      onClick={() => setShowCreateCourseModal(true)}
                      className="w-full bg-[#464a4e] hover:bg-[#34373a] text-white flex items-center justify-between px-4 py-3.5 rounded text-xs font-black tracking-wide uppercase transition-all shadow-sm active:scale-98 group"
                    >
                      <span>CREATE A COURSE</span>
                      <ChevronRight className="h-4 w-4 text-slate-300 group-hover:translate-x-0.5 transition-transform" />
                    </button>

                    <button
                      onClick={() => setShowCreateUserModal(true)}
                      className="w-full bg-[#464a4e] hover:bg-[#34373a] text-white flex items-center justify-between px-4 py-3.5 rounded text-xs font-black tracking-wide uppercase transition-all shadow-sm active:scale-98 group"
                    >
                      <span>CREATE A USER</span>
                      <ChevronRight className="h-4 w-4 text-slate-300 group-hover:translate-x-0.5 transition-transform" />
                    </button>

                    <button
                      onClick={() => setShowCreateTeamModal(true)}
                      className="w-full bg-[#464a4e] hover:bg-[#34373a] text-white flex items-center justify-between px-4 py-3.5 rounded text-xs font-black tracking-wide uppercase transition-all shadow-sm active:scale-98 group"
                    >
                      <span>CREATE A TEAM</span>
                      <ChevronRight className="h-4 w-4 text-slate-300 group-hover:translate-x-0.5 transition-transform" />
                    </button>
                  </div>
                </div>

                {/* Litmos Quick Help & Integration Status */}
                <div className="bg-white rounded-lg border border-slate-200/80 shadow-sm p-6">
                  <h3 className="text-xs font-black text-slate-600 uppercase tracking-wider mb-3">
                    Course Authoring Engine
                  </h3>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    AuraLMS combines <strong>Gomo visual block responsive authoring</strong> with <strong>SAP Litmos corporate compliance tracking</strong>.
                  </p>

                  <div className="mt-4 pt-4 border-t border-slate-100 flex flex-col gap-2">
                    <Link
                      href="/author"
                      className="flex items-center justify-between text-xs font-bold text-slate-800 hover:text-lime-700 transition-colors"
                    >
                      <span>Open Course Canvas</span>
                      <ArrowRight className="h-3.5 w-3.5" />
                    </Link>
                    <Link
                      href="/learn"
                      className="flex items-center justify-between text-xs font-bold text-slate-800 hover:text-lime-700 transition-colors"
                    >
                      <span>Open Learner Catalog</span>
                      <ArrowRight className="h-3.5 w-3.5" />
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: ACTIVITY STREAM */}
          {activeTab === 'ACTIVITY' && (
            <div className="bg-white rounded-lg border border-slate-200/80 shadow-sm p-6">
              <div className="border-b border-slate-200 pb-4 mb-6 flex items-center justify-between">
                <div>
                  <h2 className="text-base font-black text-slate-900 uppercase tracking-wide">
                    Live Workforce Activity Stream
                  </h2>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Real-time log of module enrollments, progress milestones, and quiz score submissions.
                  </p>
                </div>
                <span className="text-xs font-bold text-lime-700 bg-lime-100 px-3 py-1 rounded-full">
                  ● Realtime Sync Active
                </span>
              </div>

              <div className="space-y-4">
                {activityItems.map((act) => (
                  <div key={act.id} className="flex items-center justify-between p-4 rounded-lg bg-slate-50 hover:bg-slate-100/80 transition-colors border border-slate-200/60">
                    <div className="flex items-center gap-3">
                      <div className="h-9 w-9 rounded-full bg-slate-800 text-white font-bold flex items-center justify-center text-xs">
                        {act.user.charAt(0)}
                      </div>
                      <div>
                        <div className="text-xs font-bold text-slate-900">
                          {act.user} <span className="font-normal text-slate-500">• {act.action}</span>
                        </div>
                        <div className="text-[11px] text-slate-600 font-semibold mt-0.5">
                          Course: {act.course}
                        </div>
                      </div>
                    </div>

                    <div className="text-right">
                      {act.score && (
                        <div className="text-xs font-extrabold text-emerald-700 mb-0.5">
                          Score: {act.score}
                        </div>
                      )}
                      <div className="text-[11px] text-slate-400">{act.time}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 3: NEWS & BULLETINS */}
          {activeTab === 'NEWS' && (
            <div className="bg-white rounded-lg border border-slate-200/80 shadow-sm p-6">
              <div className="border-b border-slate-200 pb-4 mb-6">
                <h2 className="text-base font-black text-slate-900 uppercase tracking-wide">
                  Corporate Training Bulletins & Announcements
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Publish notices to all enterprise learner dashboards and instructional designers.
                </p>
              </div>

              <div className="space-y-5">
                {newsItems.map((news) => (
                  <div key={news.id} className="p-5 rounded-lg border border-slate-200 bg-slate-50 hover:bg-white hover:border-slate-300 transition-all">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[10px] font-black uppercase tracking-wider bg-slate-200 text-slate-800 px-2 py-0.5 rounded">
                        {news.tag}
                      </span>
                      <span className="text-xs text-slate-400 font-medium">{news.date}</span>
                    </div>
                    <h3 className="text-sm font-bold text-slate-900">{news.title}</h3>
                    <p className="text-xs text-slate-600 mt-1 leading-relaxed">{news.excerpt}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </main>
      </div>

      {/* 4. Floating "GUIDE ME" Tab on Right Screen Edge (From Screenshot) */}
      <button
        onClick={() => setShowGuideModal(true)}
        className="fixed right-0 top-1/2 -translate-y-1/2 [writing-mode:vertical-rl] bg-[#9ca3af] hover:bg-[#6b7280] text-white font-extrabold px-1.5 py-4 rounded-l text-[10px] tracking-widest uppercase shadow-md transition-colors z-40"
      >
        GUIDE ME
      </button>

      {/* ========================================================================= */}
      {/* MODALS */}
      {/* ========================================================================= */}

      {/* Modal 1: CREATE A COURSE */}
      {showCreateCourseModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-2xl max-w-md w-full p-6 border border-slate-200 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <h3 className="text-sm font-black uppercase text-slate-900 tracking-wide flex items-center gap-2">
                <Plus className="h-4 w-4 text-lime-600" /> Create Course (Gomo Authoring)
              </h3>
              <button onClick={() => setShowCreateCourseModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="h-4 w-4" />
              </button>
            </div>

            <form onSubmit={handleCreateCourse} className="mt-4 space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1">
                  Course Title
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. 2026 Social Engineering & AI Hygiene"
                  value={newCourseTitle}
                  onChange={(e) => setNewCourseTitle(e.target.value)}
                  className="w-full rounded border border-slate-300 px-3 py-2 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-lime-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1">
                  Category
                </label>
                <select
                  value={newCourseCategory}
                  onChange={(e) => setNewCourseCategory(e.target.value)}
                  className="w-full rounded border border-slate-300 px-3 py-2 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-lime-500"
                >
                  <option value="Information Security">Information Security</option>
                  <option value="Compliance & Regulatory">Compliance & Regulatory</option>
                  <option value="Data Protection & Privacy">Data Protection & Privacy</option>
                  <option value="Engineering Onboarding">Engineering Onboarding</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1">
                  Description
                </label>
                <textarea
                  rows={3}
                  placeholder="Outline key learning objectives and compliance outcomes..."
                  value={newCourseDescription}
                  onChange={(e) => setNewCourseDescription(e.target.value)}
                  className="w-full rounded border border-slate-300 px-3 py-2 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-lime-500"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowCreateCourseModal(false)}
                  className="px-4 py-2 rounded text-xs font-bold text-slate-600 hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded text-xs font-extrabold text-white bg-[#61bd1a] hover:bg-[#52a215] shadow-sm"
                >
                  Save & Open Studio
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal 2: CREATE A USER */}
      {showCreateUserModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-2xl max-w-md w-full p-6 border border-slate-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <h3 className="text-sm font-black uppercase text-slate-900 tracking-wide flex items-center gap-2">
                <User className="h-4 w-4 text-blue-600" /> Create Enterprise Learner
              </h3>
              <button onClick={() => setShowCreateUserModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="h-4 w-4" />
              </button>
            </div>

            <form onSubmit={handleCreateUser} className="mt-4 space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Jordan Miller"
                  value={newUserName}
                  onChange={(e) => setNewUserName(e.target.value)}
                  className="w-full rounded border border-slate-300 px-3 py-2 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1">
                  Corporate Email
                </label>
                <input
                  type="email"
                  required
                  placeholder="jordan.miller@enterprise.internal"
                  value={newUserEmail}
                  onChange={(e) => setNewUserEmail(e.target.value)}
                  className="w-full rounded border border-slate-300 px-3 py-2 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1">
                  Department
                </label>
                <select
                  value={newUserDept}
                  onChange={(e) => setNewUserDept(e.target.value)}
                  className="w-full rounded border border-slate-300 px-3 py-2 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="Engineering">Engineering</option>
                  <option value="Product Security">Product Security</option>
                  <option value="Operations">Operations</option>
                  <option value="Finance & Legal">Finance & Legal</option>
                </select>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowCreateUserModal(false)}
                  className="px-4 py-2 rounded text-xs font-bold text-slate-600 hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded text-xs font-extrabold text-white bg-slate-900 hover:bg-black shadow-sm"
                >
                  Enroll Learner
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal 3: CREATE A TEAM */}
      {showCreateTeamModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-2xl max-w-md w-full p-6 border border-slate-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <h3 className="text-sm font-black uppercase text-slate-900 tracking-wide flex items-center gap-2">
                <Users className="h-4 w-4 text-purple-600" /> Create Compliance Team / Cohort
              </h3>
              <button onClick={() => setShowCreateTeamModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="h-4 w-4" />
              </button>
            </div>

            <form onSubmit={handleCreateTeam} className="mt-4 space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1">
                  Team Name
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Cloud Security Architects"
                  value={newTeamName}
                  onChange={(e) => setNewTeamName(e.target.value)}
                  className="w-full rounded border border-slate-300 px-3 py-2 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1">
                  Department
                </label>
                <select
                  value={newTeamDept}
                  onChange={(e) => setNewTeamDept(e.target.value)}
                  className="w-full rounded border border-slate-300 px-3 py-2 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-purple-500"
                >
                  <option value="Product Security">Product Security</option>
                  <option value="Engineering">Engineering</option>
                  <option value="Operations">Operations</option>
                  <option value="Finance & Legal">Finance & Legal</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1">
                  Assigned Mandatory Course
                </label>
                <select className="w-full rounded border border-slate-300 px-3 py-2 text-xs text-slate-900 focus:outline-none">
                  {courses.map(c => (
                    <option key={c.id} value={c.id}>{c.title}</option>
                  ))}
                </select>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowCreateTeamModal(false)}
                  className="px-4 py-2 rounded text-xs font-bold text-slate-600 hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded text-xs font-extrabold text-white bg-slate-900 hover:bg-black shadow-sm"
                >
                  Create Team
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal 4: BUY NOW / UPGRADE */}
      {showBuyNowModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-2xl max-w-lg w-full p-6 border border-slate-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <h3 className="text-base font-black uppercase text-slate-900 tracking-wide flex items-center gap-2">
                <Award className="h-5 w-5 text-lime-600" /> MAS LMS Enterprise License
              </h3>
              <button onClick={() => setShowBuyNowModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="py-4 space-y-3 text-xs text-slate-600">
              <p>Your trial of MAS LMS Enterprise includes <strong>unlimited authoring blocks</strong>, <strong>full Litmos compliance reporting</strong>, and <strong>Supabase PostgreSQL persistent storage</strong>.</p>
              
              <div className="bg-slate-50 p-4 rounded border border-slate-200 space-y-2">
                <div className="flex items-center justify-between font-bold text-slate-800">
                  <span>Enterprise Plan</span>
                  <span className="text-lime-700 font-extrabold text-sm">$499 / mo</span>
                </div>
                <div className="text-[11px] text-slate-500">Includes SSO, unlimited learner seats, and custom branding.</div>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
              <button
                onClick={() => setShowBuyNowModal(false)}
                className="px-4 py-2 rounded text-xs font-bold text-slate-600 hover:bg-slate-100"
              >
                Close
              </button>
              <button
                onClick={() => {
                  setShowBuyNowModal(false);
                  showToast('Enterprise license activated for MAS IT.');
                }}
                className="px-5 py-2 rounded text-xs font-extrabold text-white bg-[#61bd1a] hover:bg-[#52a215] shadow-sm uppercase tracking-wider"
              >
                Activate Subscription
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal 5: GUIDE ME WALKTHROUGH */}
      {showGuideModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-2xl max-w-lg w-full p-6 border border-slate-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <h3 className="text-base font-black uppercase text-slate-900 tracking-wide flex items-center gap-2">
                <HelpCircle className="h-5 w-5 text-slate-700" /> Platform Walkthrough & Guide
              </h3>
              <button onClick={() => setShowGuideModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="py-4 space-y-4 text-xs text-slate-700">
              <div className="border-l-4 border-lime-500 pl-3">
                <div className="font-extrabold text-slate-900">1. Gomo Visual Authoring (/author)</div>
                <div className="text-slate-500 mt-0.5">Use the block builder to add text, callouts, video, accordion tabs, and knowledge check quizzes with Desktop, Tablet, and Mobile preview toggles.</div>
              </div>

              <div className="border-l-4 border-blue-500 pl-3">
                <div className="font-extrabold text-slate-900">2. Litmos Learner Player (/learn)</div>
                <div className="text-slate-500 mt-0.5">Distraction-free cinema player with collapsible curriculum outlines, auto-saved page progress, and scored quizzes.</div>
              </div>

              <div className="border-l-4 border-purple-500 pl-3">
                <div className="font-extrabold text-slate-900">3. Quick Actions</div>
                <div className="text-slate-500 mt-0.5">Use the right side panel to instantly create courses, enroll users, and assign compliance teams with one click.</div>
              </div>
            </div>

            <div className="flex justify-end pt-3 border-t border-slate-100">
              <button
                onClick={() => setShowGuideModal(false)}
                className="px-5 py-2 rounded text-xs font-bold text-white bg-slate-900 hover:bg-black"
              >
                Got It
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Floating Notification Toast */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white text-xs font-bold px-4 py-3 rounded-lg shadow-xl border border-slate-700 flex items-center gap-2 animate-in slide-in-from-bottom-3 duration-200">
          <CheckCircle2 className="h-4 w-4 text-lime-400" />
          <span>{toastMessage}</span>
        </div>
      )}
    </div>
  );
}
