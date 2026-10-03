'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { 
  ArrowLeft, 
  CheckCircle2, 
  Circle, 
  Play, 
  FileText, 
  Award, 
  Clock, 
  ChevronRight, 
  ChevronLeft, 
  Menu, 
  X, 
  Share2, 
  Bookmark, 
  Check, 
  Sparkles,
  BookOpen
} from 'lucide-react';
import { Course, Lesson } from '@/types/masLms';
import { MasDataStore } from '@/lib/mockData';

export default function CoursePlayerPage() {
  const params = useParams();
  const router = useRouter();
  const courseId = params?.id as string;

  const [course, setCourse] = useState<Course | null>(null);
  const [activeLessonId, setActiveLessonId] = useState<string>('');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  useEffect(() => {
    if (!courseId) return;
    const found = MasDataStore.getCourseById(courseId);
    if (found) {
      setCourse(found);
      if (found.lessons && found.lessons.length > 0) {
        setActiveLessonId(found.lessons[0].id);
      }
    }
  }, [courseId]);

  if (!course) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-center p-6">
        <BookOpen className="w-12 h-12 text-slate-400 mb-3 animate-pulse" />
        <h2 className="text-lg font-bold text-slate-900 dark:text-white">Loading Course Curriculum...</h2>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
          Preparing lessons and multimedia content from M.A.S Cloud Studio.
        </p>
        <Link
          href="/courses"
          className="mt-4 inline-flex items-center gap-2 text-xs font-semibold text-indigo-600 hover:text-indigo-700"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Courses
        </Link>
      </div>
    );
  }

  const activeLesson = course.lessons.find(l => l.id === activeLessonId) || course.lessons[0];
  const activeLessonIndex = course.lessons.findIndex(l => l.id === activeLessonId);
  const totalLessons = course.lessons.length;
  const completedCount = course.lessons.filter(l => l.completed).length;
  const completionPercentage = Math.round((completedCount / totalLessons) * 100);

  const handleToggleComplete = (lessonId: string) => {
    const updated = MasDataStore.toggleLessonComplete(course.id, lessonId);
    if (updated) {
      setCourse({ ...updated });
      const current = updated.lessons.find(l => l.id === lessonId);
      if (current?.completed) {
        showToast('Lesson marked as completed! Progress updated.');
      }
    }
  };

  const handleNextLesson = () => {
    if (activeLessonIndex < totalLessons - 1) {
      setActiveLessonId(course.lessons[activeLessonIndex + 1].id);
    }
  };

  const handlePrevLesson = () => {
    if (activeLessonIndex > 0) {
      setActiveLessonId(course.lessons[activeLessonIndex - 1].id);
    }
  };

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  return (
    <div className="flex flex-col h-[calc(100vh-7rem)] -m-6 overflow-hidden bg-slate-50 dark:bg-slate-950">
      {/* Top Header Bar */}
      <div className="h-14 border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-4 sm:px-6 flex items-center justify-between z-20">
        <div className="flex items-center gap-3">
          <Link
            href="/courses"
            className="p-1.5 rounded-lg text-slate-500 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div className="h-4 w-[1px] bg-slate-200 dark:border-slate-800 hidden sm:block" />
          <div>
            <span className="text-[10px] uppercase font-bold tracking-wider text-indigo-600 dark:text-indigo-400">
              {course.category}
            </span>
            <h1 className="text-xs sm:text-sm font-semibold text-slate-900 dark:text-white truncate max-w-xs sm:max-w-md">
              {course.title}
            </h1>
          </div>
        </div>

        {/* Right side controls */}
        <div className="flex items-center gap-4">
          {/* Progress pill */}
          <div className="hidden md:flex items-center gap-2">
            <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
              {completedCount} of {totalLessons} completed ({completionPercentage}%)
            </span>
            <div className="w-24 h-1.5 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-emerald-500 rounded-full transition-all duration-300"
                style={{ width: `${completionPercentage}%` }}
              />
            </div>
          </div>

          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="p-2 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
            title="Toggle Curriculum Drawer"
          >
            {isSidebarOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Main Content Area + Drawer */}
      <div className="flex-1 flex overflow-hidden relative">
        {/* Left Drawer / Lesson List */}
        <aside
          className={`${
            isSidebarOpen ? 'w-80 border-r' : 'w-0 border-none'
          } transition-all duration-300 ease-in-out bg-white dark:bg-slate-900/90 border-slate-200 dark:border-slate-800 flex flex-col overflow-hidden z-10`}
        >
          {/* Drawer Title */}
          <div className="p-4 border-b border-slate-100 dark:border-slate-800/80">
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Curriculum Outline
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Click any module to jump to its content.
            </p>
          </div>

          {/* Lessons List */}
          <div className="flex-1 overflow-y-auto divide-y divide-slate-100 dark:divide-slate-800/40">
            {course.lessons.map((lesson, idx) => {
              const isActive = lesson.id === activeLessonId;
              const isDone = !!lesson.completed;

              return (
                <button
                  key={lesson.id}
                  onClick={() => setActiveLessonId(lesson.id)}
                  className={`w-full text-left p-3.5 flex items-start gap-3 transition-colors ${
                    isActive
                      ? 'bg-indigo-50/80 dark:bg-indigo-950/40 border-l-2 border-indigo-600 text-indigo-900 dark:text-indigo-200'
                      : 'hover:bg-slate-50 dark:hover:bg-slate-800/50 text-slate-700 dark:text-slate-300'
                  }`}
                >
                  <div
                    onClick={(e) => {
                      e.stopPropagation();
                      handleToggleComplete(lesson.id);
                    }}
                    className="mt-0.5 text-slate-400 hover:text-emerald-500 transition cursor-pointer"
                    title={isDone ? 'Mark Incomplete' : 'Mark Completed'}
                  >
                    {isDone ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-500 fill-emerald-50 dark:fill-emerald-950" />
                    ) : (
                      <Circle className="w-4 h-4" />
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5 text-[11px] text-slate-400 mb-0.5">
                      <span>Module {idx + 1}</span>
                      <span>•</span>
                      <span className="capitalize">{lesson.type}</span>
                    </div>
                    <p className={`text-xs font-medium leading-snug truncate ${isActive ? 'font-semibold text-indigo-600 dark:text-indigo-300' : ''}`}>
                      {lesson.title}
                    </p>
                    <span className="text-[11px] text-slate-400 inline-flex items-center gap-1 mt-1">
                      <Clock className="w-3 h-3" />
                      {lesson.durationMinutes} min
                    </span>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Drawer Footer */}
          <div className="p-3.5 border-t border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50 text-center">
            <span className="text-[11px] text-slate-500 dark:text-slate-400">
              Instructor: <strong className="text-slate-700 dark:text-slate-200">{course.instructorName}</strong>
            </span>
          </div>
        </aside>

        {/* Lesson Content Reader / Video Player */}
        <main className="flex-1 overflow-y-auto p-6 md:p-10 flex flex-col justify-between">
          <div className="max-w-3xl mx-auto w-full">
            {/* Breadcrumb & Title */}
            <div className="mb-6">
              <div className="flex items-center gap-2 text-xs text-slate-400 mb-2">
                <span>{course.title}</span>
                <ChevronRight className="w-3.5 h-3.5" />
                <span className="text-indigo-600 dark:text-indigo-400 font-medium">
                  Module {activeLessonIndex + 1}
                </span>
              </div>
              <h2 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
                {activeLesson.title}
              </h2>
              <div className="flex items-center gap-4 mt-2 text-xs text-slate-500 dark:text-slate-400">
                <span className="inline-flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5" />
                  Estimated time: {activeLesson.durationMinutes} minutes
                </span>
                <span className="inline-flex items-center gap-1 capitalize">
                  <FileText className="w-3.5 h-3.5" />
                  Format: {activeLesson.type}
                </span>
              </div>
            </div>

            {/* Video Player or Reading Content Area */}
            <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200/80 dark:border-slate-800/80 p-6 md:p-8 shadow-sm">
              {activeLesson.type === 'video' ? (
                <div className="space-y-4">
                  <div className="aspect-video w-full rounded-lg overflow-hidden bg-slate-950 flex items-center justify-center relative shadow-inner">
                    <div className="text-center p-6">
                      <div className="w-14 h-14 rounded-full bg-indigo-600/90 text-white flex items-center justify-center mx-auto mb-3 shadow-lg hover:scale-105 transition cursor-pointer">
                        <Play className="w-6 h-6 fill-current ml-0.5" />
                      </div>
                      <p className="text-sm font-semibold text-white">Video Demonstration Player</p>
                      <p className="text-xs text-slate-400 mt-1 max-w-sm">
                        High-definition enterprise training stream powered by M.A.S Cloud Studio CDN.
                      </p>
                    </div>
                  </div>
                  <div className="p-4 rounded-lg bg-slate-50 dark:bg-slate-800/50 text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                    <strong>Session Synopsis:</strong> This interactive walkthrough reviews key operational checkpoints, incident triage matrices, and escalation communication guidelines.
                  </div>
                </div>
              ) : (
                <article className="prose dark:prose-invert max-w-none text-slate-700 dark:text-slate-300 space-y-4 text-sm leading-relaxed">
                  <p className="font-medium text-slate-900 dark:text-white">
                    {course.description}
                  </p>
                  <p>
                    Enterprise learning and compliance mandate systematic understanding of verified workflows. In this module, teams review authoritative standards, verify role permissions, and adhere to regulatory audit trails.
                  </p>
                  
                  <div className="my-6 p-4 rounded-lg bg-indigo-50/60 dark:bg-indigo-950/40 border border-indigo-200/60 dark:border-indigo-800/50">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-indigo-900 dark:text-indigo-200 mb-1 flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
                      Core Learning Takeaways
                    </h4>
                    <ul className="list-disc list-inside space-y-1 text-xs text-indigo-900/80 dark:text-indigo-200/80 mt-2">
                      <li>Understand access control segregation and least-privilege policies.</li>
                      <li>Document incident timelines in compliance with ISO/SOC2 specifications.</li>
                      <li>Escalate unresolved audit findings to the designated Team Lead immediately.</li>
                    </ul>
                  </div>

                  <p>
                    Upon completing your review of these documentation standards, verify your readiness using the checklist below and click <strong>Mark Lesson as Complete</strong>.
                  </p>
                </article>
              )}

              {/* Action Buttons */}
              <div className="mt-8 pt-6 border-t border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
                <button
                  onClick={() => handleToggleComplete(activeLesson.id)}
                  className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold transition ${
                    activeLesson.completed
                      ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800'
                      : 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm'
                  }`}
                >
                  <Check className="w-4 h-4" />
                  {activeLesson.completed ? 'Completed (Click to Reopen)' : 'Mark Lesson as Complete'}
                </button>

                <div className="flex items-center gap-2">
                  <button
                    disabled={activeLessonIndex === 0}
                    onClick={handlePrevLesson}
                    className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-40 disabled:cursor-not-allowed transition"
                  >
                    <ChevronLeft className="w-4 h-4" />
                    Previous
                  </button>

                  <button
                    disabled={activeLessonIndex === totalLessons - 1}
                    onClick={handleNextLesson}
                    className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-40 disabled:cursor-not-allowed transition"
                  >
                    Next
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Footer watermark inside player */}
          <div className="mt-8 text-center text-xs text-slate-400">
            M.A.S LMS • Curriculum Engine • Developed by M.A.S Cloud Studio
          </div>
        </main>
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
