'use client';

import React, { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useParams, useSearchParams } from 'next/navigation';
import { 
  ArrowLeft, 
  CheckCircle2, 
  Circle, 
  Play, 
  FileText, 
  Clock, 
  ChevronRight, 
  ChevronLeft, 
  Menu, 
  X, 
  Check, 
  Sparkles,
  BookOpen,
  Plus,
  Edit3,
  Trash2,
  Video,
  HelpCircle,
  Code,
  AlertCircle
} from 'lucide-react';
import { Course, Lesson, LessonType } from '@/types/masLms';
import { MasDataStore } from '@/lib/mockData';

function getEmbedUrl(url?: string): string | null {
  if (!url || !url.trim()) return null;
  const trimmed = url.trim();
  if (trimmed.includes('youtube.com/embed/')) return trimmed;
  const ytMatch = trimmed.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([\w-]{11})/);
  if (ytMatch && ytMatch[1]) {
    return `https://www.youtube.com/embed/${ytMatch[1]}`;
  }
  if (trimmed.startsWith('http://') || trimmed.startsWith('https://')) {
    return trimmed;
  }
  return null;
}

function RenderMarkdown({ content }: { content: string }) {
  if (!content || !content.trim()) {
    return (
      <div className="py-6 text-center text-xs text-[#64748B]">
        No written content published for this module yet. Click <strong>Edit Module</strong> above to add lesson text, documentation, or code examples.
      </div>
    );
  }

  const lines = content.split('\n');
  const elements: React.ReactNode[] = [];
  let inCodeBlock = false;
  let codeLines: string[] = [];
  let blockKey = 0;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    if (line.startsWith('```')) {
      if (inCodeBlock) {
        elements.push(
          <div key={`code-wrapper-${blockKey++}`} className="my-4 rounded-xl overflow-hidden border border-slate-800 bg-[#0F172A] shadow-xs">
            <div className="px-4 py-2 bg-slate-900 border-b border-slate-800 flex items-center justify-between text-[11px] text-slate-400 font-mono">
              <span>Code Snippet</span>
              <span>UTF-8</span>
            </div>
            <pre className="p-4 text-xs font-mono text-emerald-400 overflow-x-auto leading-relaxed">
              <code>{codeLines.join('\n')}</code>
            </pre>
          </div>
        );
        codeLines = [];
        inCodeBlock = false;
      } else {
        inCodeBlock = true;
      }
      continue;
    }

    if (inCodeBlock) {
      codeLines.push(line);
      continue;
    }

    if (line.startsWith('### ')) {
      elements.push(
        <h3 key={`h3-${blockKey++}`} className="text-base font-bold text-[#1E293B] mt-6 mb-2">
          {line.replace('### ', '')}
        </h3>
      );
    } else if (line.startsWith('#### ')) {
      elements.push(
        <h4 key={`h4-${blockKey++}`} className="text-xs font-bold uppercase tracking-wider text-[#7C3AED] mt-4 mb-1.5 flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5" />
          {line.replace('#### ', '')}
        </h4>
      );
    } else if (line.startsWith('> ')) {
      elements.push(
        <blockquote key={`quote-${blockKey++}`} className="p-3.5 rounded-xl bg-purple-50/70 border-l-4 border-[#7C3AED] my-4 text-xs font-medium text-[#1E293B] leading-relaxed">
          {line.replace('> ', '')}
        </blockquote>
      );
    } else if (line.startsWith('- ') || line.startsWith('* ')) {
      elements.push(
        <div key={`li-${blockKey++}`} className="flex items-start gap-2.5 text-xs text-[#334155] my-1 ml-1 leading-relaxed">
          <span className="w-1.5 h-1.5 rounded-full bg-[#7C3AED] mt-1.5 shrink-0" />
          <span>{line.replace(/^[-*]\s+/, '')}</span>
        </div>
      );
    } else if (line.trim().length === 0) {
      elements.push(<div key={`spacer-${blockKey++}`} className="h-2" />);
    } else {
      elements.push(
        <p key={`p-${blockKey++}`} className="text-xs sm:text-sm text-[#334155] leading-relaxed my-1">
          {line}
        </p>
      );
    }
  }

  if (inCodeBlock && codeLines.length > 0) {
    elements.push(
      <pre key={`code-tail-${blockKey++}`} className="p-4 rounded-xl bg-slate-900 text-emerald-400 text-xs font-mono overflow-x-auto my-4 border border-slate-800">
        <code>{codeLines.join('\n')}</code>
      </pre>
    );
  }

  return <div className="space-y-1">{elements}</div>;
}

function CoursePlayerInner() {
  const params = useParams();
  const searchParams = useSearchParams();
  const courseId = params?.id as string;
  const initialAction = searchParams.get('action');

  const [course, setCourse] = useState<Course | null>(null);
  const [activeLessonId, setActiveLessonId] = useState<string>('');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Module Modal States
  const [isAddModuleModalOpen, setIsAddModuleModalOpen] = useState(false);
  const [editingModule, setEditingModule] = useState<Lesson | null>(null);

  // Module Form State
  const [moduleForm, setModuleForm] = useState({
    title: '',
    type: 'reading' as LessonType,
    durationMinutes: 30,
    videoUrl: '',
    contentMarkdown: ''
  });

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

  useEffect(() => {
    if (initialAction === 'add_module') {
      handleOpenAddModule();
    }
  }, [initialAction]);

  if (!course) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-center p-6 bg-[#F8FAFC]">
        <BookOpen className="w-12 h-12 text-[#7C3AED] mb-3 animate-pulse" />
        <h2 className="text-lg font-bold text-[#1E293B]">Loading Course Curriculum...</h2>
        <p className="text-xs text-[#64748B] mt-1">
          Preparing lessons and multimedia content from M.A.S Cloud Studio.
        </p>
        <Link
          href="/courses"
          className="mt-4 inline-flex items-center gap-2 text-xs font-semibold text-[#7C3AED] hover:underline"
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
  const completionPercentage = totalLessons > 0 ? Math.round((completedCount / totalLessons) * 100) : 0;

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

  // Open Add Module Modal
  const handleOpenAddModule = () => {
    setEditingModule(null);
    setModuleForm({
      title: `Module ${course.lessons.length + 1}: `,
      type: 'reading',
      durationMinutes: 30,
      videoUrl: '',
      contentMarkdown: `### Module Overview\n\nExplain the goals and core principles of this section.\n\n#### Key Objectives:\n- Fundamental workflow principles\n- Step-by-step implementation guide\n- Real-world production scenarios\n\n> **Core Rule:** Verify credentials and review security rules before pushing changes.`
    });
    setIsAddModuleModalOpen(true);
  };

  // Open Edit Module Modal
  const handleOpenEditModule = (lesson: Lesson) => {
    setEditingModule(lesson);
    setModuleForm({
      title: lesson.title,
      type: lesson.type,
      durationMinutes: lesson.durationMinutes,
      videoUrl: lesson.videoUrl || '',
      contentMarkdown: lesson.contentMarkdown || ''
    });
    setIsAddModuleModalOpen(true);
  };

  // Save Module (Add or Update)
  const handleSaveModule = (e: React.FormEvent) => {
    e.preventDefault();
    if (!moduleForm.title.trim()) return;

    if (editingModule) {
      // Update existing module
      const updated = MasDataStore.updateModuleInCourse(course.id, editingModule.id, {
        title: moduleForm.title.trim(),
        type: moduleForm.type,
        durationMinutes: Number(moduleForm.durationMinutes) || 15,
        videoUrl: moduleForm.videoUrl.trim(),
        contentMarkdown: moduleForm.contentMarkdown
      });

      if (updated) {
        setCourse({ ...updated });
        showToast(`Updated "${moduleForm.title}" successfully!`);
      }
    } else {
      // Add new module to curriculum
      const res = MasDataStore.addModuleToCourse(course.id, {
        title: moduleForm.title.trim(),
        type: moduleForm.type,
        durationMinutes: Number(moduleForm.durationMinutes) || 15,
        videoUrl: moduleForm.videoUrl.trim(),
        contentMarkdown: moduleForm.contentMarkdown
      });

      if (res) {
        setCourse({ ...res.course });
        setActiveLessonId(res.lesson.id);
        showToast(`Module added to ${course.title}!`);
      }
    }

    setIsAddModuleModalOpen(false);
  };

  // Delete Module
  const handleDeleteModule = (lessonId: string, lessonTitle: string) => {
    if (course.lessons.length <= 1) {
      alert('A course must have at least one module.');
      return;
    }

    if (confirm(`Are you sure you want to delete "${lessonTitle}"?`)) {
      const updated = MasDataStore.deleteModuleFromCourse(course.id, lessonId);
      if (updated) {
        setCourse({ ...updated });
        if (activeLessonId === lessonId && updated.lessons.length > 0) {
          setActiveLessonId(updated.lessons[0].id);
        }
        showToast(`Deleted "${lessonTitle}" from curriculum.`);
      }
    }
  };

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Fast snippet appenders for authoring
  const appendSnippet = (snippet: string) => {
    setModuleForm(prev => ({
      ...prev,
      contentMarkdown: prev.contentMarkdown ? `${prev.contentMarkdown}\n\n${snippet}` : snippet
    }));
  };

  const embedUrl = activeLesson ? getEmbedUrl(activeLesson.videoUrl) : null;

  return (
    <div className="flex flex-col h-[calc(100vh-7rem)] -m-6 overflow-hidden bg-[#F8FAFC]">
      {/* Top Header Bar */}
      <div className="h-14 border-b border-slate-200 bg-white px-4 sm:px-6 flex items-center justify-between z-20">
        <div className="flex items-center gap-3">
          <Link
            href="/courses"
            className="p-1.5 rounded-lg text-[#64748B] hover:text-[#1E293B] hover:bg-slate-100 transition"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div className="h-4 w-[1px] bg-slate-200 hidden sm:block" />
          <div>
            <span className="text-[10px] uppercase font-bold tracking-wider text-[#7C3AED]">
              {course.category} • {course.level}
            </span>
            <h1 className="text-xs sm:text-sm font-bold text-[#1E293B] truncate max-w-xs sm:max-w-md">
              {course.title}
            </h1>
          </div>
        </div>

        {/* Right side controls */}
        <div className="flex items-center gap-3 sm:gap-4">
          <button
            onClick={handleOpenAddModule}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-white bg-[#7C3AED] hover:bg-[#6D28D9] transition shadow-xs active:scale-[0.98]"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Module</span>
          </button>

          <div className="hidden md:flex items-center gap-2">
            <span className="text-xs font-semibold text-[#64748B]">
              {completedCount} of {totalLessons} completed ({completionPercentage}%)
            </span>
            <div className="w-24 h-1.5 bg-slate-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-emerald-500 rounded-full transition-all duration-300"
                style={{ width: `${completionPercentage}%` }}
              />
            </div>
          </div>

          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="p-2 rounded-lg text-[#64748B] hover:text-[#1E293B] hover:bg-slate-100 transition"
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
          } transition-all duration-300 ease-in-out bg-white border-slate-200 flex flex-col overflow-hidden z-10`}
        >
          {/* Drawer Title & Quick Add */}
          <div className="p-4 border-b border-slate-100 flex items-center justify-between">
            <div>
              <h2 className="text-xs font-bold uppercase tracking-wider text-[#64748B]">
                Curriculum Outline
              </h2>
              <p className="text-[11px] text-slate-400 mt-0.5">
                {course.lessons.length} Modules • {course.durationHours} hrs total
              </p>
            </div>
            <button
              onClick={handleOpenAddModule}
              className="p-1 rounded-md text-[#7C3AED] hover:bg-purple-50 transition"
              title="Add New Module"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>

          {/* Lessons List */}
          <div className="flex-1 overflow-y-auto divide-y divide-slate-100">
            {course.lessons.map((lesson, idx) => {
              const isActive = lesson.id === activeLessonId;
              const isDone = !!lesson.completed;

              return (
                <div
                  key={lesson.id}
                  className={`w-full text-left p-3 flex items-start gap-2.5 transition-colors group cursor-pointer ${
                    isActive
                      ? 'bg-purple-50/80 border-l-2 border-[#7C3AED]'
                      : 'hover:bg-[#F8FAFC]'
                  }`}
                  onClick={() => setActiveLessonId(lesson.id)}
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
                      <CheckCircle2 className="w-4 h-4 text-emerald-500 fill-emerald-50" />
                    ) : (
                      <Circle className="w-4 h-4" />
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5 text-[11px] text-[#64748B] mb-0.5">
                      <span>Module {idx + 1}</span>
                      <span>•</span>
                      <span className="capitalize">{lesson.type}</span>
                    </div>
                    <p className={`text-xs font-semibold leading-snug line-clamp-2 ${isActive ? 'text-[#7C3AED]' : 'text-[#1E293B]'}`}>
                      {lesson.title}
                    </p>
                    <span className="text-[11px] text-slate-400 inline-flex items-center gap-1 mt-1">
                      <Clock className="w-3 h-3" />
                      {lesson.durationMinutes} min
                    </span>
                  </div>

                  {/* Edit & Delete Module Actions */}
                  <div className="opacity-0 group-hover:opacity-100 flex items-center gap-1 transition">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleOpenEditModule(lesson);
                      }}
                      className="p-1 rounded-md text-slate-400 hover:text-[#7C3AED] hover:bg-white transition"
                      title="Edit Module Content"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                    </button>
                    {course.lessons.length > 1 && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteModule(lesson.id, lesson.title);
                        }}
                        className="p-1 rounded-md text-slate-400 hover:text-rose-600 hover:bg-white transition"
                        title="Delete Module"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Drawer Footer */}
          <div className="p-3.5 border-t border-slate-100 bg-[#F8FAFC] flex items-center justify-between">
            <span className="text-[11px] text-[#64748B]">
              Lead: <strong className="text-[#1E293B]">{course.instructorName}</strong>
            </span>
            <button
              onClick={handleOpenAddModule}
              className="text-xs font-bold text-[#7C3AED] hover:underline inline-flex items-center gap-1"
            >
              <Plus className="w-3 h-3" />
              Add Next
            </button>
          </div>
        </aside>

        {/* Lesson Content Reader / Video Player */}
        <main className="flex-1 overflow-y-auto p-6 md:p-10 flex flex-col justify-between bg-[#F8FAFC]">
          <div className="max-w-3xl mx-auto w-full">
            {/* Breadcrumb, Title & Module Actions */}
            <div className="mb-6 flex flex-col sm:flex-row sm:items-start justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 text-xs text-[#64748B] mb-2">
                  <span>{course.title}</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                  <span className="text-[#7C3AED] font-semibold">
                    Module {activeLessonIndex + 1} of {totalLessons}
                  </span>
                </div>
                <h2 className="text-2xl font-extrabold tracking-tight text-[#1E293B]">
                  {activeLesson?.title || 'Untitled Module'}
                </h2>
                <div className="flex items-center gap-4 mt-2 text-xs text-[#64748B]">
                  <span className="inline-flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-slate-400" />
                    Estimated time: {activeLesson?.durationMinutes || 15} minutes
                  </span>
                  <span className="inline-flex items-center gap-1 capitalize">
                    {activeLesson?.type === 'video' ? (
                      <Video className="w-3.5 h-3.5 text-[#7C3AED]" />
                    ) : (
                      <FileText className="w-3.5 h-3.5 text-[#7C3AED]" />
                    )}
                    Format: {activeLesson?.type || 'reading'}
                  </span>
                </div>
              </div>

              {/* Edit Current Module Button */}
              {activeLesson && (
                <button
                  onClick={() => handleOpenEditModule(activeLesson)}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-[#7C3AED] bg-purple-50 hover:bg-purple-100 border border-purple-200 transition shrink-0"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                  Edit This Module
                </button>
              )}
            </div>

            {/* Video Player or Reading Content Area */}
            <div className="bg-white rounded-2xl border border-slate-200 p-6 md:p-8 shadow-sm">
              {activeLesson?.type === 'video' ? (
                <div className="space-y-4">
                  {embedUrl ? (
                    <div className="aspect-video w-full rounded-xl overflow-hidden bg-black shadow-inner">
                      <iframe
                        src={embedUrl}
                        title={activeLesson.title}
                        className="w-full h-full"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                      />
                    </div>
                  ) : (
                    <div className="aspect-video w-full rounded-xl overflow-hidden bg-slate-900 flex items-center justify-center relative shadow-inner">
                      <div className="text-center p-6">
                        <div 
                          onClick={() => handleOpenEditModule(activeLesson)}
                          className="w-14 h-14 rounded-full bg-[#7C3AED] text-white flex items-center justify-center mx-auto mb-3 shadow-lg hover:scale-105 transition cursor-pointer"
                        >
                          <Play className="w-6 h-6 fill-current ml-0.5" />
                        </div>
                        <p className="text-sm font-bold text-white">Video Walkthrough</p>
                        <p className="text-xs text-slate-300 mt-1 max-w-sm">
                          Click &quot;Edit This Module&quot; to configure a YouTube embed or video URL for this lesson.
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Synopsis / Module Markdown under video */}
                  {activeLesson?.contentMarkdown && (
                    <div className="pt-4 border-t border-slate-100">
                      <h4 className="text-xs font-bold uppercase tracking-wider text-[#64748B] mb-2">
                        Lecture Notes & Synopsis
                      </h4>
                      <RenderMarkdown content={activeLesson.contentMarkdown} />
                    </div>
                  )}
                </div>
              ) : (
                <article className="text-[#1E293B]">
                  {activeLesson?.contentMarkdown ? (
                    <RenderMarkdown content={activeLesson.contentMarkdown} />
                  ) : (
                    <div className="py-8 text-center text-xs text-[#64748B] space-y-3">
                      <FileText className="w-8 h-8 text-slate-300 mx-auto" />
                      <p>This module has no written content yet.</p>
                      <button
                        onClick={() => handleOpenEditModule(activeLesson)}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-white bg-[#7C3AED] hover:bg-[#6D28D9] transition"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                        Write Module Content
                      </button>
                    </div>
                  )}
                </article>
              )}

              {/* Action Buttons */}
              <div className="mt-8 pt-6 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4">
                <button
                  onClick={() => handleToggleComplete(activeLesson.id)}
                  className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition ${
                    activeLesson?.completed
                      ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                      : 'bg-[#7C3AED] hover:bg-[#6D28D9] text-white shadow-xs'
                  }`}
                >
                  <Check className="w-4 h-4" />
                  {activeLesson?.completed ? 'Completed (Click to Reopen)' : 'Mark Module as Complete'}
                </button>

                <div className="flex items-center gap-2">
                  <button
                    disabled={activeLessonIndex === 0}
                    onClick={handlePrevLesson}
                    className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold text-[#1E293B] hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed transition"
                  >
                    <ChevronLeft className="w-4 h-4" />
                    Previous
                  </button>

                  <button
                    disabled={activeLessonIndex === totalLessons - 1}
                    onClick={handleNextLesson}
                    className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold text-[#1E293B] hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed transition"
                  >
                    Next
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>

            {/* Quick Action to Add Next Module */}
            <div className="mt-6 p-4 rounded-xl border border-dashed border-slate-300 bg-white flex items-center justify-between">
              <div>
                <p className="text-xs font-bold text-[#1E293B]">Want to extend this curriculum?</p>
                <p className="text-[11px] text-[#64748B]">Add another module with reading material, video walkthrough, or quiz.</p>
              </div>
              <button
                onClick={handleOpenAddModule}
                className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold text-[#7C3AED] bg-purple-50 hover:bg-purple-100 border border-purple-200 transition"
              >
                <Plus className="w-3.5 h-3.5" />
                Add Module {course.lessons.length + 1}
              </button>
            </div>
          </div>

          {/* Footer watermark inside player */}
          <div className="mt-8 text-center text-xs text-[#64748B]">
            M.A.S LMS • Curriculum Engine • Developed by M.A.S Cloud Studio
          </div>
        </main>
      </div>

      {/* Add / Edit Module Modal */}
      {isAddModuleModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl max-w-xl w-full border border-slate-200 shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-[#1E293B]">
                  {editingModule ? 'Edit Curriculum Module' : `Add Module to ${course.title}`}
                </h3>
                <p className="text-xs text-[#64748B] mt-0.5">
                  Publish written lessons, embed video lectures, or configure exercises.
                </p>
              </div>
              <button
                onClick={() => setIsAddModuleModalOpen(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveModule} className="p-6 space-y-4 overflow-y-auto flex-1">
              <div>
                <label className="block text-xs font-semibold text-[#1E293B] mb-1.5">
                  Module Title *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Module 3: Cloud Firestore Setup & Security Rules"
                  value={moduleForm.title}
                  onChange={e => setModuleForm({ ...moduleForm, title: e.target.value })}
                  className="w-full px-3.5 py-2 text-sm rounded-lg border border-slate-200 bg-white text-[#1E293B] placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-[#7C3AED]"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-[#1E293B] mb-1.5">
                    Module Format
                  </label>
                  <select
                    value={moduleForm.type}
                    onChange={e => setModuleForm({ ...moduleForm, type: e.target.value as LessonType })}
                    className="w-full px-3 py-2 text-xs font-medium rounded-lg border border-slate-200 bg-white text-[#1E293B] focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-[#7C3AED]"
                  >
                    <option value="reading">Reading / Documentation</option>
                    <option value="video">Video Demonstration</option>
                    <option value="quiz">Knowledge Check / Quiz</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#1E293B] mb-1.5">
                    Estimated Duration (Minutes)
                  </label>
                  <input
                    type="number"
                    min={1}
                    max={360}
                    value={moduleForm.durationMinutes}
                    onChange={e => setModuleForm({ ...moduleForm, durationMinutes: Number(e.target.value) || 15 })}
                    className="w-full px-3.5 py-2 text-xs font-medium rounded-lg border border-slate-200 bg-white text-[#1E293B] focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-[#7C3AED]"
                  />
                </div>
              </div>

              {/* Video URL Input if format is video */}
              {moduleForm.type === 'video' && (
                <div>
                  <label className="block text-xs font-semibold text-[#1E293B] mb-1.5">
                    Video Stream / YouTube Embed URL
                  </label>
                  <input
                    type="text"
                    placeholder="https://www.youtube.com/watch?v=... or https://..."
                    value={moduleForm.videoUrl}
                    onChange={e => setModuleForm({ ...moduleForm, videoUrl: e.target.value })}
                    className="w-full px-3.5 py-2 text-xs rounded-lg border border-slate-200 bg-white text-[#1E293B] placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-[#7C3AED]"
                  />
                </div>
              )}

              {/* Content Markdown Editor */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-xs font-semibold text-[#1E293B]">
                    {moduleForm.type === 'video' ? 'Lecture Notes & Session Highlights' : 'Module Documentation / Lesson Content'}
                  </label>
                  <span className="text-[11px] text-slate-400">Markdown formatting supported</span>
                </div>

                {/* Quick Snippet Inserts */}
                <div className="flex flex-wrap gap-1.5 mb-2">
                  <button
                    type="button"
                    onClick={() => appendSnippet('### Overview\n\nExplain core architectural concepts and prerequisites.')}
                    className="px-2 py-0.5 rounded text-[10px] font-medium bg-slate-100 text-[#1E293B] hover:bg-slate-200 transition"
                  >
                    + Heading
                  </button>
                  <button
                    type="button"
                    onClick={() => appendSnippet('> **Key Takeaway:** Always test security rules with granular least-privilege assertions.')}
                    className="px-2 py-0.5 rounded text-[10px] font-medium bg-purple-50 text-[#7C3AED] hover:bg-purple-100 transition"
                  >
                    + Callout
                  </button>
                  <button
                    type="button"
                    onClick={() => appendSnippet('```typescript\nimport { initializeApp } from "firebase/app";\nimport { getFirestore } from "firebase/firestore";\n```')}
                    className="px-2 py-0.5 rounded text-[10px] font-medium bg-slate-100 text-[#1E293B] hover:bg-slate-200 transition"
                  >
                    + Code Block
                  </button>
                  <button
                    type="button"
                    onClick={() => appendSnippet('- Step 1: Initialize SDK credentials\n- Step 2: Configure firestore.rules\n- Step 3: Run client integration tests')}
                    className="px-2 py-0.5 rounded text-[10px] font-medium bg-slate-100 text-[#1E293B] hover:bg-slate-200 transition"
                  >
                    + Checklist
                  </button>
                </div>

                <textarea
                  rows={8}
                  placeholder="Write module content, architectural steps, or lesson notes..."
                  value={moduleForm.contentMarkdown}
                  onChange={e => setModuleForm({ ...moduleForm, contentMarkdown: e.target.value })}
                  className="w-full px-3.5 py-2.5 text-xs font-mono rounded-lg border border-slate-200 bg-white text-[#1E293B] placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-[#7C3AED] leading-relaxed resize-y"
                />
              </div>

              <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsAddModuleModalOpen(false)}
                  className="px-4 py-2 rounded-lg text-xs font-medium text-[#64748B] hover:bg-slate-100 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg text-xs font-semibold text-white bg-[#7C3AED] hover:bg-[#6D28D9] transition shadow-xs"
                >
                  {editingModule ? 'Save Module Changes' : 'Add Module to Curriculum'}
                </button>
              </div>
            </form>
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

export default function CoursePlayerPage() {
  return (
    <Suspense fallback={
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-center p-6 bg-[#F8FAFC]">
        <BookOpen className="w-12 h-12 text-[#7C3AED] mb-3 animate-pulse" />
        <h2 className="text-lg font-bold text-[#1E293B]">Loading Course Curriculum...</h2>
      </div>
    }>
      <CoursePlayerInner />
    </Suspense>
  );
}
