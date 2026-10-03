'use client';

import React, { useState, useEffect, Suspense, useRef } from 'react';
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
  Upload, 
  Download, 
  Image as ImageIcon, 
  Presentation, 
  File, 
  Maximize2, 
  Minimize2, 
  Eye, 
  Layers, 
  FileCode,
  ExternalLink
} from 'lucide-react';
import { Course, Lesson, LessonType, ModuleResource, SlideItem, ResourceType } from '@/types/masLms';
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

// Convert markdown into dynamic presentation slides if none are provided
function generateSlidesFromMarkdown(title: string, markdown?: string): SlideItem[] {
  if (!markdown || !markdown.trim()) {
    return [
      {
        id: 'gen-1',
        title: title || 'Module Presentation',
        subtitle: 'Enterprise Training Curriculum',
        bulletPoints: [
          'Comprehensive operational overview',
          'Step-by-step verified procedures',
          'Compliance & audit readiness'
        ],
        callout: 'Review the attached slides and documentation resources in the Resources tab.'
      }
    ];
  }

  const sections = markdown.split(/(?=###\s+)/g).filter(s => s.trim().length > 0);
  if (sections.length === 0) {
    return [
      {
        id: 'gen-1',
        title: title,
        bulletPoints: [markdown.slice(0, 140)]
      }
    ];
  }

  return sections.map((sec, idx) => {
    const lines = sec.trim().split('\n');
    const headerLine = lines.find(l => l.startsWith('### ')) || lines[0] || `Slide ${idx + 1}`;
    const cleanHeader = headerLine.replace(/^###\s+/, '').replace(/\*\*/g, '').trim();

    const bulletPoints: string[] = [];
    let callout = '';
    let codeSnippet = '';
    let inCode = false;
    const codeAccumulator: string[] = [];

    lines.forEach(line => {
      if (line.startsWith('```')) {
        inCode = !inCode;
        return;
      }
      if (inCode) {
        codeAccumulator.push(line);
        return;
      }
      if (line.startsWith('> ')) {
        callout = line.replace('> ', '').replace(/\*\*/g, '').trim();
      } else if (line.startsWith('- ') || line.startsWith('* ')) {
        bulletPoints.push(line.replace(/^[-*]\s+/, '').replace(/\*\*/g, '').trim());
      }
    });

    if (codeAccumulator.length > 0) {
      codeSnippet = codeAccumulator.join('\n');
    }

    if (bulletPoints.length === 0 && !codeSnippet && !callout) {
      const para = lines.filter(l => !l.startsWith('#') && l.trim().length > 0).join(' ');
      if (para) bulletPoints.push(para.slice(0, 180));
    }

    return {
      id: `gen-slide-${idx + 1}`,
      title: cleanHeader || `${title} — Part ${idx + 1}`,
      subtitle: `Enterprise Learning Objective ${idx + 1}`,
      bulletPoints: bulletPoints.slice(0, 4),
      callout: callout || undefined,
      codeSnippet: codeSnippet || undefined
    };
  });
}

function RenderMarkdown({ content }: { content: string }) {
  if (!content || !content.trim()) {
    return (
      <div className="py-6 text-center text-xs text-[#64748B]">
        No written documentation published for this module yet.
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

  // Tab State: 'content' | 'resources'
  const [activeTab, setActiveTab] = useState<'content' | 'resources'>('content');
  // View Style: 'slides' (PowerPoint/PDF style) | 'document'
  const [viewStyle, setViewStyle] = useState<'slides' | 'document'>('slides');
  // Slide Index State
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [isFullscreenSlide, setIsFullscreenSlide] = useState(false);

  // Image Preview Lightbox
  const [previewImage, setPreviewImage] = useState<{ url: string; title: string } | null>(null);

  // Module Modal States
  const [isAddModuleModalOpen, setIsAddModuleModalOpen] = useState(false);
  const [editingModule, setEditingModule] = useState<Lesson | null>(null);

  // Module Form State
  const [moduleForm, setModuleForm] = useState({
    title: '',
    type: 'presentation' as LessonType,
    durationMinutes: 30,
    videoUrl: '',
    contentMarkdown: '',
    resources: [] as ModuleResource[]
  });

  const fileInputRef = useRef<HTMLInputElement>(null);
  const tabFileInputRef = useRef<HTMLInputElement>(null);

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

  // Reset slide index when active lesson changes
  useEffect(() => {
    setCurrentSlideIndex(0);
  }, [activeLessonId]);

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

  // Active Lesson Resources & Slides
  const currentResources: ModuleResource[] = activeLesson?.resources || [];
  const activeSlides: SlideItem[] = (activeLesson?.slides && activeLesson.slides.length > 0)
    ? activeLesson.slides
    : generateSlidesFromMarkdown(activeLesson?.title || 'Module Presentation', activeLesson?.contentMarkdown);

  const totalSlides = activeSlides.length;
  const currentSlide = activeSlides[currentSlideIndex] || activeSlides[0];

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

  // Slide navigation
  const nextSlide = () => {
    if (currentSlideIndex < totalSlides - 1) {
      setCurrentSlideIndex(prev => prev + 1);
    }
  };

  const prevSlide = () => {
    if (currentSlideIndex > 0) {
      setCurrentSlideIndex(prev => prev - 1);
    }
  };

  // Open Add Module Modal
  const handleOpenAddModule = () => {
    setEditingModule(null);
    setModuleForm({
      title: `Module ${course.lessons.length + 1}: `,
      type: 'presentation',
      durationMinutes: 30,
      videoUrl: '',
      contentMarkdown: `### Module Overview\n\nExplain the goals and core architectural principles of this section.\n\n#### Key Objectives:\n- Fundamental workflow principles\n- Step-by-step implementation guide\n- Real-world production scenarios\n\n> **Core Rule:** Verify credentials and review security rules before pushing changes.`,
      resources: []
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
      contentMarkdown: lesson.contentMarkdown || '',
      resources: lesson.resources || []
    });
    setIsAddModuleModalOpen(true);
  };

  // Save Module (Add or Update)
  const handleSaveModule = (e: React.FormEvent) => {
    e.preventDefault();
    if (!moduleForm.title.trim()) return;

    if (editingModule) {
      const updated = MasDataStore.updateModuleInCourse(course.id, editingModule.id, {
        title: moduleForm.title.trim(),
        type: moduleForm.type,
        durationMinutes: Number(moduleForm.durationMinutes) || 15,
        videoUrl: moduleForm.videoUrl.trim(),
        contentMarkdown: moduleForm.contentMarkdown,
        resources: moduleForm.resources
      });

      if (updated) {
        setCourse({ ...updated });
        showToast(`Updated "${moduleForm.title}" successfully!`);
      }
    } else {
      const res = MasDataStore.addModuleToCourse(course.id, {
        title: moduleForm.title.trim(),
        type: moduleForm.type,
        durationMinutes: Number(moduleForm.durationMinutes) || 15,
        videoUrl: moduleForm.videoUrl.trim(),
        contentMarkdown: moduleForm.contentMarkdown,
        resources: moduleForm.resources
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

  // File Upload Handler (For PPT, PDF, and Images)
  const handleFileUpload = (files: FileList | null, isModal = false) => {
    if (!files || files.length === 0) return;

    Array.from(files).forEach(file => {
      const fileExt = file.name.split('.').pop()?.toLowerCase();
      let resType: ResourceType = 'doc';
      if (fileExt === 'ppt' || fileExt === 'pptx') resType = 'ppt';
      else if (fileExt === 'pdf') resType = 'pdf';
      else if (['png', 'jpg', 'jpeg', 'svg', 'webp', 'gif'].includes(fileExt || '')) resType = 'image';

      const sizeStr = file.size > 1024 * 1024 
        ? `${(file.size / (1024 * 1024)).toFixed(1)} MB` 
        : `${Math.round(file.size / 1024)} KB`;

      const reader = new FileReader();
      reader.onload = (e) => {
        const fileUrl = (e.target?.result as string) || '#';
        const newResource: ModuleResource = {
          id: `res-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
          name: file.name,
          type: resType,
          size: sizeStr,
          url: fileUrl,
          uploadedAt: 'Just now'
        };

        if (isModal) {
          setModuleForm(prev => ({
            ...prev,
            resources: [...(prev.resources || []), newResource]
          }));
        } else if (activeLesson) {
          const updated = MasDataStore.addResourceToModule(course.id, activeLesson.id, newResource);
          if (updated) {
            setCourse({ ...updated });
            showToast(`Uploaded "${file.name}" to module resources!`);
          }
        }
      };
      reader.readAsDataURL(file);
    });
  };

  const handleDeleteResource = (resourceId: string, name: string) => {
    if (confirm(`Remove "${name}" from this module?`)) {
      const updated = MasDataStore.deleteResourceFromModule(course.id, activeLesson.id, resourceId);
      if (updated) {
        setCourse({ ...updated });
        showToast(`Removed "${name}".`);
      }
    }
  };

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const appendSnippet = (snippet: string) => {
    setModuleForm(prev => ({
      ...prev,
      contentMarkdown: prev.contentMarkdown ? `${prev.contentMarkdown}\n\n${snippet}` : snippet
    }));
  };

  const embedUrl = activeLesson ? getEmbedUrl(activeLesson.videoUrl) : null;

  return (
    <div className={`flex flex-col ${isFullscreenSlide ? 'fixed inset-0 z-50 bg-[#0F172A]' : 'h-[calc(100vh-7rem)] -m-6 bg-[#F8FAFC]'} overflow-hidden`}>
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
        {/* Left Drawer / Curriculum Outline */}
        <aside
          className={`${
            isSidebarOpen && !isFullscreenSlide ? 'w-80 border-r' : 'w-0 border-none'
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
              const resCount = lesson.resources?.length || 0;

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
                      <span className="capitalize">{lesson.type === 'presentation' ? 'Slides' : lesson.type}</span>
                      {resCount > 0 && (
                        <>
                          <span>•</span>
                          <span className="text-[#7C3AED] font-semibold">{resCount} Files</span>
                        </>
                      )}
                    </div>
                    <p className={`text-xs font-semibold leading-snug line-clamp-2 ${isActive ? 'text-[#7C3AED]' : 'text-[#1E293B]'}`}>
                      {lesson.title}
                    </p>
                    <span className="text-[11px] text-slate-400 inline-flex items-center gap-1 mt-1">
                      <Clock className="w-3 h-3" />
                      {lesson.durationMinutes} min
                    </span>
                  </div>

                  {/* Edit & Delete Actions */}
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

        {/* Lesson Content / Slides Reader */}
        <main className={`flex-1 overflow-y-auto ${isFullscreenSlide ? 'p-4 sm:p-8 bg-[#0B1120]' : 'p-6 md:p-10 bg-[#F8FAFC]'} flex flex-col justify-between`}>
          <div className="max-w-4xl mx-auto w-full">
            {/* Header: Breadcrumbs & Module Info */}
            <div className="mb-4 flex flex-col sm:flex-row sm:items-start justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 text-xs text-[#64748B] mb-1.5">
                  <span>{course.title}</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                  <span className="text-[#7C3AED] font-semibold">
                    Module {activeLessonIndex + 1} of {totalLessons}
                  </span>
                </div>
                <h2 className={`text-2xl font-extrabold tracking-tight ${isFullscreenSlide ? 'text-white' : 'text-[#1E293B]'}`}>
                  {activeLesson?.title || 'Untitled Module'}
                </h2>
              </div>

              {/* Edit Current Module Button */}
              {activeLesson && (
                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() => handleOpenEditModule(activeLesson)}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-[#7C3AED] bg-purple-50 hover:bg-purple-100 border border-purple-200 transition"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                    Edit Module
                  </button>
                </div>
              )}
            </div>

            {/* Navigation Tabs: Content/Slides vs Resources */}
            <div className="flex items-center justify-between border-b border-slate-200 mb-6 pb-2">
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setActiveTab('content')}
                  className={`inline-flex items-center gap-2 pb-2 text-xs font-bold border-b-2 transition ${
                    activeTab === 'content'
                      ? 'border-[#7C3AED] text-[#7C3AED]'
                      : 'border-transparent text-[#64748B] hover:text-[#1E293B]'
                  }`}
                >
                  <Presentation className="w-4 h-4" />
                  Interactive Slides & Content
                </button>

                <button
                  onClick={() => setActiveTab('resources')}
                  className={`inline-flex items-center gap-2 pb-2 text-xs font-bold border-b-2 transition ${
                    activeTab === 'resources'
                      ? 'border-[#7C3AED] text-[#7C3AED]'
                      : 'border-transparent text-[#64748B] hover:text-[#1E293B]'
                  }`}
                >
                  <File className="w-4 h-4" />
                  Resources & Attachments
                  <span className="px-1.5 py-0.5 rounded-full text-[10px] bg-purple-100 text-[#7C3AED] font-bold">
                    {currentResources.length}
                  </span>
                </button>
              </div>

              {/* View Style Switcher (Slides vs Document) */}
              {activeTab === 'content' && activeLesson?.type !== 'video' && (
                <div className="flex items-center gap-1 bg-slate-100 p-0.5 rounded-lg border border-slate-200 text-xs">
                  <button
                    onClick={() => setViewStyle('slides')}
                    className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-[11px] font-semibold transition ${
                      viewStyle === 'slides'
                        ? 'bg-white text-[#7C3AED] shadow-xs'
                        : 'text-[#64748B] hover:text-[#1E293B]'
                    }`}
                  >
                    <Presentation className="w-3 h-3" />
                    PowerPoint Mode
                  </button>
                  <button
                    onClick={() => setViewStyle('document')}
                    className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-[11px] font-semibold transition ${
                      viewStyle === 'document'
                        ? 'bg-white text-[#7C3AED] shadow-xs'
                        : 'text-[#64748B] hover:text-[#1E293B]'
                    }`}
                  >
                    <FileText className="w-3 h-3" />
                    Document Mode
                  </button>
                </div>
              )}
            </div>

            {/* TAB 1: CONTENT / POWERPOINT SLIDE VIEWER */}
            {activeTab === 'content' && (
              <div>
                {/* VIDEO LECTURE MODE */}
                {activeLesson?.type === 'video' ? (
                  <div className="bg-white rounded-2xl border border-slate-200 p-6 md:p-8 shadow-sm space-y-4">
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
                            Click &quot;Edit Module&quot; to configure a YouTube embed or video stream URL for this lesson.
                          </p>
                        </div>
                      </div>
                    )}

                    {activeLesson?.contentMarkdown && (
                      <div className="pt-4 border-t border-slate-100">
                        <h4 className="text-xs font-bold uppercase tracking-wider text-[#64748B] mb-2">
                          Lecture Notes & Synopsis
                        </h4>
                        <RenderMarkdown content={activeLesson.contentMarkdown} />
                      </div>
                    )}
                  </div>
                ) : viewStyle === 'slides' ? (
                  /* POWERPOINT / PDF STYLE INTERACTIVE PRESENTATION VIEWER */
                  <div className="rounded-2xl border border-slate-200 bg-white shadow-xl overflow-hidden flex flex-col">
                    {/* Presentation Top Ribbon */}
                    <div className="px-5 py-3 bg-[#F8FAFC] border-b border-slate-200 flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#E9D5FF] text-[#7C3AED]">
                          POWERPOINT SLIDES
                        </span>
                        <span className="font-semibold text-[#64748B]">
                          Slide {currentSlideIndex + 1} of {totalSlides}
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => setIsFullscreenSlide(!isFullscreenSlide)}
                          className="p-1.5 rounded-lg text-slate-500 hover:text-[#1E293B] hover:bg-slate-200 transition"
                          title={isFullscreenSlide ? 'Exit Fullscreen' : 'Enter Fullscreen Presentation'}
                        >
                          {isFullscreenSlide ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>

                    {/* Presentation Canvas (16:9 Styled Slide Stage) */}
                    <div className="p-8 sm:p-12 min-h-[420px] flex flex-col justify-between bg-gradient-to-br from-white to-[#F8FAFC] relative">
                      {/* Slide Body */}
                      <div className="space-y-6">
                        {currentSlide?.subtitle && (
                          <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#7C3AED]">
                            <Sparkles className="w-3.5 h-3.5" />
                            {currentSlide.subtitle}
                          </div>
                        )}

                        <h3 className="text-2xl sm:text-3xl font-extrabold text-[#1E293B] tracking-tight leading-snug">
                          {currentSlide?.title}
                        </h3>

                        {/* Slide Content: Bullets + Graphic/Code */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start pt-2">
                          {/* Bullet Points */}
                          {currentSlide?.bulletPoints && currentSlide.bulletPoints.length > 0 && (
                            <div className="space-y-3">
                              {currentSlide.bulletPoints.map((pt, pIdx) => (
                                <div
                                  key={pIdx}
                                  className="p-3.5 rounded-xl bg-white border border-slate-200/80 shadow-xs flex items-start gap-3 text-xs sm:text-sm text-[#1E293B] font-medium leading-relaxed hover:border-purple-200 transition"
                                >
                                  <div className="w-5 h-5 rounded-full bg-purple-50 text-[#7C3AED] font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                                    {pIdx + 1}
                                  </div>
                                  <span>{pt}</span>
                                </div>
                              ))}
                            </div>
                          )}

                          {/* Right Side: Image / Code / Callout */}
                          <div className="space-y-4">
                            {currentSlide?.imageUrl && (
                              <div 
                                onClick={() => setPreviewImage({ url: currentSlide.imageUrl!, title: currentSlide.title })}
                                className="rounded-xl overflow-hidden border border-slate-200 shadow-sm cursor-pointer group relative"
                              >
                                <img
                                  src={currentSlide.imageUrl}
                                  alt={currentSlide.title}
                                  className="w-full h-48 object-cover group-hover:scale-105 transition duration-300"
                                />
                                <div className="absolute inset-0 bg-slate-900/30 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white text-xs font-semibold gap-1.5 transition">
                                  <Eye className="w-4 h-4" /> Click to Expand Diagram
                                </div>
                              </div>
                            )}

                            {currentSlide?.codeSnippet && (
                              <div className="rounded-xl overflow-hidden border border-slate-800 bg-[#0F172A] shadow-md">
                                <div className="px-3.5 py-1.5 bg-slate-900 border-b border-slate-800 text-[10px] font-mono text-slate-400 flex items-center justify-between">
                                  <span>Production Code</span>
                                  <span>TypeScript / Cloud</span>
                                </div>
                                <pre className="p-4 text-xs font-mono text-emerald-400 overflow-x-auto leading-relaxed">
                                  <code>{currentSlide.codeSnippet}</code>
                                </pre>
                              </div>
                            )}

                            {currentSlide?.callout && (
                              <div className="p-4 rounded-xl bg-purple-50/80 border-l-4 border-[#7C3AED] text-xs font-semibold text-[#1E293B] leading-relaxed shadow-xs">
                                💡 {currentSlide.callout}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Slide Bottom Bar: Indicator Dots & Slide Stepper */}
                      <div className="mt-10 pt-6 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4">
                        <div className="flex items-center gap-1.5">
                          {activeSlides.map((_, dotIdx) => (
                            <button
                              key={dotIdx}
                              onClick={() => setCurrentSlideIndex(dotIdx)}
                              className={`h-2 rounded-full transition-all ${
                                dotIdx === currentSlideIndex 
                                  ? 'w-8 bg-[#7C3AED]' 
                                  : 'w-2 bg-slate-300 hover:bg-slate-400'
                              }`}
                              title={`Jump to Slide ${dotIdx + 1}`}
                            />
                          ))}
                        </div>

                        {/* Prev & Next Slide Buttons */}
                        <div className="flex items-center gap-2">
                          <button
                            disabled={currentSlideIndex === 0}
                            onClick={prevSlide}
                            className="inline-flex items-center gap-1 px-3.5 py-1.5 rounded-lg text-xs font-bold text-[#1E293B] bg-slate-100 hover:bg-slate-200 disabled:opacity-40 disabled:cursor-not-allowed transition"
                          >
                            <ChevronLeft className="w-4 h-4" />
                            Previous Slide
                          </button>

                          {currentSlideIndex < totalSlides - 1 ? (
                            <button
                              onClick={nextSlide}
                              className="inline-flex items-center gap-1 px-4 py-1.5 rounded-lg text-xs font-bold text-white bg-[#7C3AED] hover:bg-[#6D28D9] transition shadow-xs active:scale-[0.98]"
                            >
                              Next Slide
                              <ChevronRight className="w-4 h-4" />
                            </button>
                          ) : (
                            <button
                              onClick={() => handleToggleComplete(activeLesson.id)}
                              className={`inline-flex items-center gap-1 px-4 py-1.5 rounded-lg text-xs font-bold transition shadow-xs ${
                                activeLesson?.completed
                                  ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                  : 'bg-emerald-600 hover:bg-emerald-700 text-white'
                              }`}
                            >
                              <Check className="w-4 h-4" />
                              {activeLesson?.completed ? 'Module Completed' : 'Finish & Complete Module'}
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  /* DOCUMENT / WRITTEN READING VIEW */
                  <div className="bg-white rounded-2xl border border-slate-200 p-6 md:p-8 shadow-sm">
                    <article className="text-[#1E293B]">
                      {activeLesson?.contentMarkdown ? (
                        <RenderMarkdown content={activeLesson.contentMarkdown} />
                      ) : (
                        <div className="py-8 text-center text-xs text-[#64748B] space-y-3">
                          <FileText className="w-8 h-8 text-slate-300 mx-auto" />
                          <p>This module has no written documentation yet.</p>
                          <button
                            onClick={() => handleOpenEditModule(activeLesson)}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-white bg-[#7C3AED] hover:bg-[#6D28D9] transition"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                            Write Content
                          </button>
                        </div>
                      )}
                    </article>
                  </div>
                )}

                {/* Module Progression Footer */}
                <div className="mt-6 flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-xl bg-white border border-slate-200 shadow-xs">
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
                      Prev Module
                    </button>

                    <button
                      disabled={activeLessonIndex === totalLessons - 1}
                      onClick={handleNextLesson}
                      className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold text-[#1E293B] hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed transition"
                    >
                      Next Module
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 2: RESOURCES & ATTACHMENTS (PPT, PDF, IMAGES) */}
            {activeTab === 'resources' && (
              <div className="space-y-6">
                {/* Upload Action Card */}
                <div className="p-6 rounded-2xl border-2 border-dashed border-purple-200 bg-purple-50/40 text-center">
                  <input
                    type="file"
                    ref={tabFileInputRef}
                    onChange={(e) => handleFileUpload(e.target.files)}
                    accept=".ppt,.pptx,.pdf,.png,.jpg,.jpeg,.svg,.webp"
                    multiple
                    className="hidden"
                  />
                  <div className="w-12 h-12 rounded-xl bg-purple-100 text-[#7C3AED] flex items-center justify-center mx-auto mb-3">
                    <Upload className="w-6 h-6" />
                  </div>
                  <h4 className="text-sm font-bold text-[#1E293B]">
                    Upload Module Presentation, PDF, or Diagram
                  </h4>
                  <p className="text-xs text-[#64748B] mt-1 max-w-md mx-auto">
                    Attach PowerPoint decks (.ppt, .pptx), PDF documentation, or high-res architecture images for learners to download and inspect.
                  </p>
                  <button
                    onClick={() => tabFileInputRef.current?.click()}
                    className="mt-4 inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold text-white bg-[#7C3AED] hover:bg-[#6D28D9] transition shadow-xs active:scale-[0.98]"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    Browse Files to Attach
                  </button>
                </div>

                {/* Resource List / Grid */}
                <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
                  <h3 className="text-sm font-bold text-[#1E293B] mb-4 flex items-center justify-between">
                    <span>Attached Resources for this Module ({currentResources.length})</span>
                    <span className="text-xs text-[#64748B] font-normal">Click any asset to download or inspect</span>
                  </h3>

                  {currentResources.length === 0 ? (
                    <div className="py-8 text-center text-xs text-[#64748B] space-y-2">
                      <File className="w-8 h-8 text-slate-300 mx-auto" />
                      <p>No external files attached yet.</p>
                      <p className="text-slate-400">Upload a PowerPoint deck, PDF syllabus, or architecture diagram above.</p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {currentResources.map(res => {
                        const isPPT = res.type === 'ppt';
                        const isPDF = res.type === 'pdf';
                        const isImage = res.type === 'image';

                        return (
                          <div
                            key={res.id}
                            className="p-4 rounded-xl border border-slate-200 bg-white hover:border-[#7C3AED]/40 hover:shadow-md transition flex flex-col justify-between group"
                          >
                            <div className="flex items-start gap-3">
                              <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                                isPPT 
                                  ? 'bg-orange-50 text-orange-600 border border-orange-200' 
                                  : isPDF 
                                  ? 'bg-rose-50 text-rose-600 border border-rose-200' 
                                  : 'bg-blue-50 text-blue-600 border border-blue-200'
                              }`}>
                                {isPPT ? (
                                  <Presentation className="w-5 h-5" />
                                ) : isPDF ? (
                                  <FileText className="w-5 h-5" />
                                ) : (
                                  <ImageIcon className="w-5 h-5" />
                                )}
                              </div>

                              <div className="min-w-0 flex-1">
                                <h4 className="text-xs font-bold text-[#1E293B] truncate group-hover:text-[#7C3AED] transition-colors">
                                  {res.name}
                                </h4>
                                <div className="flex items-center gap-2 text-[11px] text-[#64748B] mt-0.5">
                                  <span className="uppercase font-semibold tracking-wider text-[10px] px-1.5 py-0.2 rounded bg-slate-100">
                                    {res.type}
                                  </span>
                                  <span>{res.size}</span>
                                  <span>•</span>
                                  <span>{res.uploadedAt || 'Uploaded'}</span>
                                </div>
                              </div>
                            </div>

                            {/* Resource Card Actions */}
                            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                              {isImage ? (
                                <button
                                  onClick={() => setPreviewImage({ url: res.url, title: res.name })}
                                  className="inline-flex items-center gap-1.5 text-xs font-bold text-[#7C3AED] hover:underline"
                                >
                                  <Eye className="w-3.5 h-3.5" />
                                  View Diagram
                                </button>
                              ) : (
                                <a
                                  href={res.url !== '#' ? res.url : undefined}
                                  download={res.name}
                                  onClick={() => {
                                    if (res.url === '#') {
                                      showToast(`Downloading demo ${res.type.toUpperCase()}: ${res.name}`);
                                    }
                                  }}
                                  className="inline-flex items-center gap-1.5 text-xs font-bold text-[#7C3AED] hover:underline cursor-pointer"
                                >
                                  <Download className="w-3.5 h-3.5" />
                                  Download File
                                </a>
                              )}

                              <button
                                onClick={() => handleDeleteResource(res.id, res.name)}
                                className="p-1 rounded-md text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition"
                                title="Remove file"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Footer watermark inside player */}
          <div className="mt-8 text-center text-xs text-[#64748B]">
            M.A.S LMS • PowerPoint &amp; Curriculum Engine • Developed by M.A.S Cloud Studio
          </div>
        </main>
      </div>

      {/* Image Lightbox Modal */}
      {previewImage && (
        <div 
          onClick={() => setPreviewImage(null)}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200"
        >
          <div className="max-w-4xl w-full bg-white rounded-2xl overflow-hidden shadow-2xl border border-slate-800" onClick={e => e.stopPropagation()}>
            <div className="p-4 border-b border-slate-200 flex items-center justify-between">
              <h4 className="text-xs font-bold text-[#1E293B] truncate">{previewImage.title}</h4>
              <button
                onClick={() => setPreviewImage(null)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-4 bg-slate-900 flex items-center justify-center max-h-[75vh] overflow-auto">
              <img
                src={previewImage.url}
                alt={previewImage.title}
                className="max-h-[70vh] object-contain rounded-lg shadow-md"
              />
            </div>
          </div>
        </div>
      )}

      {/* Add / Edit Module Modal with Resource Attachment */}
      {isAddModuleModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl max-w-xl w-full border border-slate-200 shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-[#1E293B]">
                  {editingModule ? 'Edit Curriculum Module' : `Add Module to ${course.title}`}
                </h3>
                <p className="text-xs text-[#64748B] mt-0.5">
                  Configure interactive PowerPoint presentation slides, attach PPT/PDF files, or write guides.
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
                    Primary Module Format
                  </label>
                  <select
                    value={moduleForm.type}
                    onChange={e => setModuleForm({ ...moduleForm, type: e.target.value as LessonType })}
                    className="w-full px-3 py-2 text-xs font-medium rounded-lg border border-slate-200 bg-white text-[#1E293B] focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-[#7C3AED]"
                  >
                    <option value="presentation">📊 PowerPoint / Presentation Slides</option>
                    <option value="reading">📄 Reading / Documentation</option>
                    <option value="video">🎥 Video Demonstration</option>
                    <option value="quiz">📝 Knowledge Check / Quiz</option>
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

              {/* Resource Attachment Box inside Module Editor */}
              <div className="p-3.5 rounded-xl border border-slate-200 bg-[#F8FAFC]">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-[#1E293B] flex items-center gap-1.5">
                    <File className="w-3.5 h-3.5 text-[#7C3AED]" />
                    Attached Resources (PPT, PDF, Images)
                  </span>
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={(e) => handleFileUpload(e.target.files, true)}
                    accept=".ppt,.pptx,.pdf,.png,.jpg,.jpeg,.svg,.webp"
                    multiple
                    className="hidden"
                  />
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="text-[11px] font-bold text-[#7C3AED] hover:underline inline-flex items-center gap-1"
                  >
                    <Plus className="w-3 h-3" />
                    Upload File
                  </button>
                </div>

                {moduleForm.resources.length === 0 ? (
                  <p className="text-[11px] text-slate-400">
                    No files attached yet. Click &quot;Upload File&quot; to attach a PowerPoint presentation (.pptx), PDF, or image diagram.
                  </p>
                ) : (
                  <div className="flex flex-wrap gap-2">
                    {moduleForm.resources.map((res, rIdx) => (
                      <div
                        key={rIdx}
                        className="px-2.5 py-1 rounded-lg bg-white border border-slate-200 text-[11px] flex items-center gap-1.5 shadow-2xs"
                      >
                        <span className="font-semibold text-[#1E293B] truncate max-w-[140px]">{res.name}</span>
                        <span className="text-slate-400">({res.type.toUpperCase()})</span>
                        <button
                          type="button"
                          onClick={() => {
                            setModuleForm(prev => ({
                              ...prev,
                              resources: prev.resources.filter((_, i) => i !== rIdx)
                            }));
                          }}
                          className="text-slate-400 hover:text-rose-600"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Content Markdown Editor */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-xs font-semibold text-[#1E293B]">
                    {moduleForm.type === 'presentation' 
                      ? 'Slide Outline & Content (Each ### creates a new slide)' 
                      : 'Module Documentation / Lesson Content'}
                  </label>
                  <span className="text-[11px] text-slate-400">Markdown formatting supported</span>
                </div>

                {/* Quick Snippet Inserts */}
                <div className="flex flex-wrap gap-1.5 mb-2">
                  <button
                    type="button"
                    onClick={() => appendSnippet('### Slide Title\n\n- Key objective 1\n- Key objective 2\n- Key objective 3')}
                    className="px-2 py-0.5 rounded text-[10px] font-medium bg-purple-50 text-[#7C3AED] hover:bg-purple-100 transition"
                  >
                    + New Slide (###)
                  </button>
                  <button
                    type="button"
                    onClick={() => appendSnippet('> **Key Takeaway:** Always test security rules with granular least-privilege assertions.')}
                    className="px-2 py-0.5 rounded text-[10px] font-medium bg-slate-100 text-[#1E293B] hover:bg-slate-200 transition"
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
                  placeholder="Write slide content or documentation. Each '### ' header automatically becomes a distinct slide in PowerPoint presentation mode..."
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
