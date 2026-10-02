'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { DataRepository } from '@/lib/data-repository';
import { Course, Enrollment, EnrollmentStatus } from '@/types/lms';
import { 
  Clock, 
  CheckCircle2, 
  Search, 
  BookOpen, 
  ArrowRight, 
  TrendingUp 
} from 'lucide-react';

export default function LearnerPortalPage() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState<'all' | 'in_progress' | 'completed'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Demo user: Alex Mercer
  const currentUserId = '00000000-0000-0000-0000-000000000003';

  useEffect(() => {
    async function loadData() {
      const [allCourses, userEnrollments] = await Promise.all([
        DataRepository.getCourses(),
        DataRepository.getLearnerEnrollments(currentUserId)
      ]);
      setCourses(allCourses);
      setEnrollments(userEnrollments);
      setLoading(false);
    }
    loadData();
  }, [currentUserId]);

  const enrolledCourseCards = courses.map((course) => {
    const enr = enrollments.find((e) => e.course_id === course.id);
    const progress = enr ? enr.progress_percentage : 0;
    const status: EnrollmentStatus = enr ? enr.status : 'not_started';

    return {
      ...course,
      progress,
      status,
      completedAt: enr?.completed_at,
      lastPageId: enr?.last_accessed_page_id
    };
  });

  const filteredCourses = enrolledCourseCards.filter((c) => {
    const matchesFilter =
      activeFilter === 'all'
        ? true
        : activeFilter === 'completed'
        ? c.status === 'completed'
        : c.status === 'in_progress' || (c.status === 'not_started' && activeFilter === 'in_progress');

    const matchesSearch =
      c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.description.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesFilter && matchesSearch;
  });

  const totalAssigned = enrolledCourseCards.length;
  const completedCount = enrolledCourseCards.filter((c) => c.status === 'completed').length;
  const inProgressCount = enrolledCourseCards.filter((c) => c.status === 'in_progress').length;
  const overallCompletionRate = totalAssigned > 0 ? Math.round((completedCount / totalAssigned) * 100) : 0;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <section className="border-b border-slate-800 bg-gradient-to-b from-indigo-950/30 via-slate-950 to-slate-950 px-4 py-8 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80"
                alt="Alex Mercer"
                className="h-16 w-16 rounded-2xl object-cover ring-2 ring-indigo-500/50 shadow-xl"
              />
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold uppercase tracking-wider text-indigo-400">
                    Litmos Enterprise Learning Path
                  </span>
                  <span className="rounded-full bg-emerald-500/10 px-2 py-0.5 text-[10px] font-semibold text-emerald-400 border border-emerald-500/20">
                    Active Enrollment
                  </span>
                </div>
                <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight mt-0.5">
                  Welcome back, Alex Mercer
                </h1>
                <p className="text-xs text-slate-400 mt-1">
                  Department: <strong className="text-slate-300">Core Infrastructure</strong> • Corporate ID: <strong className="text-slate-300">ACME-9482</strong>
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 sm:gap-6 rounded-2xl border border-slate-800 bg-slate-900/60 p-4 backdrop-blur-md">
              <div className="text-center px-2">
                <span className="block text-2xl font-black text-white">{totalAssigned}</span>
                <span className="text-[11px] text-slate-400">Assigned</span>
              </div>
              <div className="h-8 w-px bg-slate-800" />
              <div className="text-center px-2">
                <span className="block text-2xl font-black text-amber-400">{inProgressCount}</span>
                <span className="text-[11px] text-slate-400">In Progress</span>
              </div>
              <div className="h-8 w-px bg-slate-800" />
              <div className="text-center px-2">
                <span className="block text-2xl font-black text-emerald-400">{completedCount}</span>
                <span className="text-[11px] text-slate-400">Completed</span>
              </div>
              <div className="h-8 w-px bg-slate-800" />
              <div className="text-center px-2">
                <span className="block text-2xl font-black text-indigo-400">{overallCompletionRate}%</span>
                <span className="text-[11px] text-slate-400">Compliance</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pb-6 border-b border-slate-800">
          <div className="flex items-center gap-1 rounded-xl border border-slate-800 bg-slate-900/80 p-1 w-full sm:w-auto">
            <button
              onClick={() => setActiveFilter('all')}
              className={`flex-1 sm:flex-initial rounded-lg px-3.5 py-1.5 text-xs font-semibold transition-all ${
                activeFilter === 'all'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              All Curriculum ({enrolledCourseCards.length})
            </button>
            <button
              onClick={() => setActiveFilter('in_progress')}
              className={`flex-1 sm:flex-initial rounded-lg px-3.5 py-1.5 text-xs font-semibold transition-all ${
                activeFilter === 'in_progress'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              In Progress ({inProgressCount})
            </button>
            <button
              onClick={() => setActiveFilter('completed')}
              className={`flex-1 sm:flex-initial rounded-lg px-3.5 py-1.5 text-xs font-semibold transition-all ${
                activeFilter === 'completed'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Completed ({completedCount})
            </button>
          </div>

          <div className="relative w-full sm:w-72">
            <Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-500" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search course title or category..."
              className="w-full rounded-xl border border-slate-800 bg-slate-900/60 pl-9 pr-3 py-1.5 text-xs text-slate-200 placeholder-slate-500 focus:border-indigo-500 focus:outline-none"
            />
          </div>
        </div>

        <div className="mt-8">
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-pulse">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-80 rounded-2xl bg-slate-900/60 border border-slate-800" />
              ))}
            </div>
          ) : filteredCourses.length === 0 ? (
            <div className="rounded-2xl border border-slate-800 bg-slate-900/30 p-12 text-center">
              <BookOpen className="mx-auto h-8 w-8 text-slate-600" />
              <h3 className="mt-3 text-sm font-semibold text-slate-300">No courses match this filter</h3>
              <p className="mt-1 text-xs text-slate-500">Try adjusting your search criteria or status filter.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredCourses.map((course) => {
                const isCompleted = course.status === 'completed';
                const isInProgress = course.status === 'in_progress';

                return (
                  <div
                    key={course.id}
                    className="flex flex-col justify-between overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/50 backdrop-blur-sm transition-all hover:border-indigo-500/50 hover:bg-slate-900/80 hover:shadow-xl hover:shadow-indigo-500/5 group"
                  >
                    <div className="relative aspect-video w-full overflow-hidden bg-slate-950">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={course.thumbnail_url}
                        alt={course.title}
                        className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />

                      <div className="absolute top-3 right-3">
                        <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider backdrop-blur-md border ${
                          isCompleted
                            ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
                            : isInProgress
                            ? 'bg-amber-500/20 text-amber-300 border-amber-500/30'
                            : 'bg-slate-800/80 text-slate-300 border-slate-700'
                        }`}>
                          {isCompleted ? (
                            <>
                              <CheckCircle2 className="h-3 w-3 text-emerald-400" /> Completed
                            </>
                          ) : isInProgress ? (
                            <>
                              <TrendingUp className="h-3 w-3 text-amber-400" /> In Progress
                            </>
                          ) : (
                            'Not Started'
                          )}
                        </span>
                      </div>

                      <div className="absolute bottom-3 left-3">
                        <span className="rounded-md bg-slate-950/90 px-2 py-0.5 text-[10px] font-semibold text-slate-300 backdrop-blur-sm border border-slate-800">
                          {course.category}
                        </span>
                      </div>
                    </div>

                    <div className="p-5 flex-1 flex flex-col justify-between">
                      <div>
                        <h3 className="text-base font-bold text-white group-hover:text-indigo-300 transition-colors line-clamp-1">
                          {course.title}
                        </h3>
                        <p className="mt-1.5 text-xs text-slate-400 line-clamp-2 leading-relaxed">
                          {course.description}
                        </p>
                      </div>

                      <div className="mt-6 pt-4 border-t border-slate-800/80">
                        <div className="mb-3">
                          <div className="flex items-center justify-between text-xs mb-1.5">
                            <span className="text-[11px] font-medium text-slate-400">
                              Curriculum Progress
                            </span>
                            <span className="text-xs font-bold text-white">
                              {course.progress}%
                            </span>
                          </div>
                          <div className="h-2 w-full overflow-hidden rounded-full bg-slate-800">
                            <div
                              className={`h-full rounded-full transition-all duration-500 ${
                                isCompleted
                                  ? 'bg-emerald-500'
                                  : 'bg-gradient-to-r from-indigo-500 to-purple-500'
                              }`}
                              style={{ width: `${course.progress}%` }}
                            />
                          </div>
                        </div>

                        <div className="flex items-center justify-between pt-1">
                          <div className="flex items-center gap-1.5 text-[11px] text-slate-500">
                            <Clock className="h-3 w-3" />
                            <span>{course.estimated_minutes} mins</span>
                          </div>

                          <Link
                            href={`/learn/${course.id}`}
                            className={`flex items-center gap-1.5 rounded-xl px-4 py-2 text-xs font-semibold transition-all shadow-md active:scale-95 ${
                              isCompleted
                                ? 'bg-slate-800 text-slate-200 hover:bg-slate-700'
                                : 'bg-indigo-600 text-white hover:bg-indigo-500 shadow-indigo-500/20'
                            }`}
                          >
                            <span>
                              {isCompleted ? 'Review Course' : isInProgress ? 'Resume' : 'Start Course'}
                            </span>
                            <ArrowRight className="h-3.5 w-3.5" />
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
