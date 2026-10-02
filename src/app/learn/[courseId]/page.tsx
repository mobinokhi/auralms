'use client';

import React, { useEffect, useState, use } from 'react';
import Link from 'next/link';
import confetti from 'canvas-confetti';
import { DataRepository } from '@/lib/data-repository';
import { 
  Course, 
  CourseModule, 
  CoursePage, 
  ContentBlock 
} from '@/types/lms';
import { BlockRenderer } from '@/components/blocks/BlockRenderer';
import { 
  ChevronLeft, 
  ChevronRight, 
  CheckCircle2, 
  Circle, 
  Menu, 
  X, 
  Maximize2, 
  Minimize2, 
  Award, 
  ArrowLeft, 
  Clock, 
  Download, 
  Check, 
  ShieldCheck
} from 'lucide-react';

interface LearnerPlayerProps {
  params: Promise<{ courseId: string }>;
}

export default function CoursePlayerPage({ params }: LearnerPlayerProps) {
  const resolvedParams = use(params);
  const courseId = resolvedParams.courseId;

  // Demo user: Alex Mercer
  const currentUserId = '00000000-0000-0000-0000-000000000003';

  // State
  const [loading, setLoading] = useState(true);
  const [course, setCourse] = useState<Course | null>(null);
  const [modules, setModules] = useState<(CourseModule & { pages: (CoursePage & { blocks: ContentBlock[] })[] })[]>([]);

  // Active Navigation
  const [currentPageId, setCurrentPageId] = useState<string>('');
  const [completedPageIds, setCompletedPageIds] = useState<Set<string>>(new Set());

  // Player UI states
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [focusMode, setFocusMode] = useState(false);
  const [showCelebration, setShowCelebration] = useState(false);

  // Load course structure & enrollment state
  useEffect(() => {
    async function loadCourse() {
      const [structure, enr] = await Promise.all([
        DataRepository.getCourseStructure(courseId),
        DataRepository.getEnrollment(currentUserId, courseId)
      ]);

      if (structure) {
        setCourse(structure.course);
        setModules(structure.modules);

        const allPgs = structure.modules.flatMap(m => m.pages);

        let initialPageId = allPgs[0]?.id || '';
        if (enr?.last_accessed_page_id && allPgs.some(p => p.id === enr.last_accessed_page_id)) {
          initialPageId = enr.last_accessed_page_id;
        }
        setCurrentPageId(initialPageId);

        if (enr && enr.progress_percentage > 0) {
          const completedCount = Math.round((enr.progress_percentage / 100) * allPgs.length);
          const initialCompleted = new Set(allPgs.slice(0, completedCount).map(p => p.id));
          setCompletedPageIds(initialCompleted);
        }
      }

      setLoading(false);
    }
    loadCourse();
  }, [courseId, currentUserId]);

  const allPages = modules.flatMap(m => m.pages);
  const currentIndex = allPages.findIndex(p => p.id === currentPageId);
  const currentPage = allPages[currentIndex] || allPages[0];
  const activeBlocks = currentPage?.blocks || [];

  const progressPercentage = allPages.length > 0 
    ? Math.min(100, Math.round((completedPageIds.size / allPages.length) * 100))
    : 0;

  const saveLearnerState = async (newCompleted: Set<string>, targetPageId: string) => {
    const updatedProgress = Math.min(100, Math.round((newCompleted.size / allPages.length) * 100));
    const isFinished = updatedProgress >= 100;

    await DataRepository.updateProgress(
      currentUserId,
      courseId,
      updatedProgress,
      targetPageId,
      isFinished ? 'completed' : 'in_progress'
    );

    if (isFinished && !showCelebration) {
      triggerCelebration();
    }
  };

  const triggerCelebration = () => {
    setShowCelebration(true);
    try {
      confetti({
        particleCount: 120,
        spread: 80,
        origin: { y: 0.6 }
      });
    } catch (e) {
      console.log('Confetti triggered', e);
    }
  };

  const handleNextPage = async () => {
    const nextCompleted = new Set(completedPageIds);
    if (currentPage?.id) {
      nextCompleted.add(currentPage.id);
      setCompletedPageIds(nextCompleted);
    }

    if (currentIndex < allPages.length - 1) {
      const nextPageId = allPages[currentIndex + 1].id;
      setCurrentPageId(nextPageId);
      await saveLearnerState(nextCompleted, nextPageId);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      await saveLearnerState(nextCompleted, currentPage.id);
    }
  };

  const handlePrevPage = () => {
    if (currentIndex > 0) {
      const prevPageId = allPages[currentIndex - 1].id;
      setCurrentPageId(prevPageId);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleSelectPage = async (pageId: string) => {
    setCurrentPageId(pageId);
    await saveLearnerState(completedPageIds, pageId);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleAnswerSubmit = async (blockId: string, selectedOption: string, isCorrect: boolean) => {
    await DataRepository.recordQuizAttempt({
      user_id: currentUserId,
      course_id: courseId,
      block_id: blockId,
      selected_option: selectedOption,
      is_correct: isCorrect,
      score: isCorrect ? 100 : 0
    });
  };

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-slate-950 text-slate-300">
        <div className="flex items-center gap-3">
          <div className="h-6 w-6 animate-spin rounded-full border-2 border-indigo-500 border-t-transparent" />
          <span className="text-sm">Launching Distraction-Free Litmos Player...</span>
        </div>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="p-8 text-center text-slate-300">
        <h2 className="text-lg font-bold">Course Not Found</h2>
        <Link href="/learn" className="mt-4 text-xs text-indigo-400 underline">
          Return to Learner Catalog
        </Link>
      </div>
    );
  }

  return (
    <div className={`flex flex-col bg-slate-950 text-slate-100 ${focusMode ? 'h-screen overflow-hidden' : 'min-h-screen'}`}>
      {/* Litmos Course Player Top Header */}
      <header className="sticky top-0 z-40 flex h-14 shrink-0 items-center justify-between border-b border-slate-800 bg-slate-900/95 px-4 backdrop-blur-md">
        <div className="flex items-center gap-3">
          <Link
            href="/learn"
            className="flex items-center gap-1.5 rounded-lg p-1.5 text-slate-400 hover:bg-slate-800 hover:text-white transition-colors"
            title="Exit Player & Return to Catalog"
          >
            <ArrowLeft className="h-4 w-4" />
            <span className="hidden sm:inline text-xs font-semibold">Exit Course</span>
          </Link>
          <div className="h-4 w-px bg-slate-800" />
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="flex items-center gap-1.5 rounded-lg p-1.5 text-slate-400 hover:bg-slate-800 hover:text-white transition-colors"
            title="Toggle Curriculum Outline Sidebar"
          >
            <Menu className="h-4 w-4" />
            <span className="hidden md:inline text-xs font-medium">Outline</span>
          </button>
          <h1 className="text-xs sm:text-sm font-bold text-white truncate max-w-[200px] sm:max-w-md lg:max-w-xl">
            {course.title}
          </h1>
        </div>

        <div className="flex items-center gap-4">
          <div className="hidden sm:flex items-center gap-2.5">
            <span className="text-xs font-semibold text-slate-300">
              {progressPercentage}% Completed
            </span>
            <div className="h-2 w-24 overflow-hidden rounded-full bg-slate-800">
              <div
                className="h-full bg-gradient-to-r from-indigo-500 to-emerald-400 transition-all duration-300"
                style={{ width: `${progressPercentage}%` }}
              />
            </div>
          </div>

          <button
            onClick={() => {
              setFocusMode(!focusMode);
              if (!focusMode) setSidebarOpen(false);
            }}
            className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-800 hover:text-white transition-colors"
            title={focusMode ? 'Exit Distraction-Free Focus Mode' : 'Enter Focus Mode (Full Screen)'}
          >
            {focusMode ? <Minimize2 className="h-4 w-4 text-indigo-400" /> : <Maximize2 className="h-4 w-4" />}
          </button>
        </div>
      </header>

      {/* Main Layout */}
      <div className="flex flex-1 overflow-hidden relative">
        {/* Outline Sidebar */}
        <aside
          className={`shrink-0 border-r border-slate-800 bg-slate-900/60 backdrop-blur-md transition-all duration-300 flex flex-col justify-between z-30 ${
            sidebarOpen ? 'w-80' : 'w-0 -translate-x-full overflow-hidden'
          } ${focusMode ? 'hidden' : ''}`}
        >
          <div className="p-4 border-b border-slate-800 flex items-center justify-between">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-400">
                Course Curriculum
              </span>
              <h3 className="text-xs font-bold text-white mt-0.5">
                {modules.length} Modules • {allPages.length} Topics
              </h3>
            </div>
            <button
              onClick={() => setSidebarOpen(false)}
              className="p-1 rounded-lg text-slate-400 hover:text-white"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-3 space-y-4">
            {modules.map((mod, modIdx) => {
              const modCompleted = mod.pages.filter(p => completedPageIds.has(p.id)).length;
              const modProgress = Math.round((modCompleted / mod.pages.length) * 100);

              return (
                <div key={mod.id} className="rounded-xl border border-slate-800/80 bg-slate-950/40 overflow-hidden">
                  <div className="p-3 bg-slate-900/70 border-b border-slate-800/60">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold text-slate-200 truncate flex-1 pr-2">
                        {modIdx + 1}. {mod.title}
                      </span>
                      <span className="text-[10px] font-semibold text-slate-400">
                        {modProgress}%
                      </span>
                    </div>
                  </div>

                  <div className="p-1 space-y-0.5">
                    {mod.pages.map((page, pageIdx) => {
                      const isActive = page.id === currentPageId;
                      const isCompleted = completedPageIds.has(page.id);

                      return (
                        <button
                          key={page.id}
                          onClick={() => handleSelectPage(page.id)}
                          className={`flex w-full items-center justify-between rounded-lg px-2.5 py-2 text-left text-xs transition-all ${
                            isActive
                              ? 'bg-indigo-600/20 text-indigo-200 font-semibold border border-indigo-500/30'
                              : 'text-slate-400 hover:bg-slate-900 hover:text-slate-200'
                          }`}
                        >
                          <div className="flex items-center gap-2 truncate">
                            {isCompleted ? (
                              <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400 shrink-0" />
                            ) : (
                              <Circle className="h-3.5 w-3.5 text-slate-600 shrink-0" />
                            )}
                            <span className="truncate">
                              {modIdx + 1}.{pageIdx + 1} {page.title}
                            </span>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>

          <div className="p-3 border-t border-slate-800 bg-slate-950/80 text-[11px] text-slate-400 flex items-center justify-between">
            <span className="flex items-center gap-1.5 text-emerald-400">
              <ShieldCheck className="h-3.5 w-3.5" />
              State Auto-Saved
            </span>
            <span className="text-slate-500 font-mono">Litmos Tracker</span>
          </div>
        </aside>

        {/* Content View */}
        <main className="flex-1 flex flex-col justify-between overflow-y-auto bg-slate-950 px-4 py-8 sm:px-8 lg:px-12">
          <div className="mx-auto w-full max-w-3xl">
            <div className="mb-8 border-b border-slate-800 pb-5">
              <div className="flex items-center justify-between text-xs text-slate-400 mb-1.5">
                <span className="uppercase font-semibold tracking-wider text-indigo-400">
                  Topic {currentIndex + 1} of {allPages.length}
                </span>
                <span className="flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  Estimated: 5 mins
                </span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                {currentPage?.title || 'Learning Topic'}
              </h2>
            </div>

            <div className="space-y-6 pb-12">
              {activeBlocks.length === 0 ? (
                <div className="p-8 text-center text-xs text-slate-500 border border-dashed border-slate-800 rounded-2xl">
                  No learning blocks configured for this topic.
                </div>
              ) : (
                activeBlocks.map((block) => (
                  <div key={block.id} className="transition-all">
                    <BlockRenderer 
                      block={block} 
                      isEditable={false} 
                      onAnswerSubmit={handleAnswerSubmit}
                    />
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Footer Controls */}
          <div className="sticky bottom-0 z-30 border-t border-slate-800/80 bg-slate-950/90 py-4 backdrop-blur-md">
            <div className="mx-auto flex max-w-3xl items-center justify-between gap-4">
              <button
                disabled={currentIndex === 0}
                onClick={handlePrevPage}
                className="flex items-center gap-1.5 rounded-xl border border-slate-800 bg-slate-900/60 px-4 py-2.5 text-xs font-semibold text-slate-300 hover:bg-slate-850 hover:text-white disabled:opacity-40 transition-all"
              >
                <ChevronLeft className="h-4 w-4" />
                Previous Topic
              </button>

              <div className="hidden sm:block text-xs font-medium text-slate-400">
                Topic {currentIndex + 1} of {allPages.length}
              </div>

              <button
                onClick={handleNextPage}
                className="flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 px-5 py-2.5 text-xs font-semibold text-white shadow-lg shadow-indigo-500/20 hover:from-indigo-500 hover:to-purple-500 active:scale-95 transition-all"
              >
                <span>
                  {currentIndex === allPages.length - 1 ? 'Complete Course' : 'Next Topic'}
                </span>
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        </main>
      </div>

      {/* Completion Modal */}
      {showCelebration && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-md animate-in fade-in duration-300">
          <div className="relative w-full max-w-lg rounded-3xl border border-indigo-500/40 bg-gradient-to-b from-slate-900 to-slate-950 p-6 sm:p-8 text-center shadow-2xl">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 shadow-xl shadow-indigo-500/30">
              <Award className="h-8 w-8 text-white" />
            </div>

            <div className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/20 px-3 py-1 text-xs font-bold uppercase tracking-wider text-emerald-300 border border-emerald-500/30 mb-2">
              <Check className="h-3.5 w-3.5" />
              Course Completed
            </div>

            <h3 className="text-xl sm:text-2xl font-black text-white tracking-tight">
              Congratulations, Alex Mercer!
            </h3>
            <p className="mt-2 text-xs sm:text-sm text-slate-300">
              You have successfully completed all topics and passed the knowledge evaluations for:
            </p>
            <div className="mt-3 p-3 rounded-xl bg-slate-900 border border-slate-800 font-semibold text-white text-xs sm:text-sm">
              {course.title}
            </div>

            <div className="mt-5 grid grid-cols-2 gap-3 text-xs">
              <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-3">
                <span className="text-[11px] text-slate-400 block">Assessment Score</span>
                <span className="text-lg font-black text-emerald-400">100% Passed</span>
              </div>
              <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-3">
                <span className="text-[11px] text-slate-400 block">Compliance Status</span>
                <span className="text-lg font-black text-indigo-400">Certified</span>
              </div>
            </div>

            <div className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-3">
              <button
                onClick={() => alert('Certificate PDF generated and recorded in your compliance ledger.')}
                className="w-full sm:w-auto flex items-center justify-center gap-1.5 rounded-xl border border-slate-700 bg-slate-800 px-4 py-2.5 text-xs font-semibold text-slate-200 hover:bg-slate-700"
              >
                <Download className="h-3.5 w-3.5" />
                Download Certificate
              </button>
              <Link
                href="/learn"
                className="w-full sm:w-auto flex items-center justify-center gap-1.5 rounded-xl bg-indigo-600 px-5 py-2.5 text-xs font-semibold text-white shadow-lg shadow-indigo-500/20 hover:bg-indigo-500"
              >
                Return to Course Catalog
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
