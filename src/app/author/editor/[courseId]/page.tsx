'use client';

import React, { useEffect, useState, use } from 'react';
import Link from 'next/link';
import { DataRepository } from '@/lib/data-repository';
import { 
  Course, 
  CourseModule, 
  CoursePage, 
  ContentBlock, 
  ViewportMode, 
  BlockType,
  BlockContentJson
} from '@/types/lms';
import { BlockRenderer } from '@/components/blocks/BlockRenderer';
import { BlockEditorModal } from '@/components/blocks/BlockEditorModal';
import { 
  Monitor, 
  Tablet, 
  Smartphone, 
  Eye, 
  Edit3, 
  Plus, 
  Trash2, 
  ArrowUp, 
  ArrowDown, 
  ExternalLink, 
  FolderPlus, 
  FilePlus, 
  Layers, 
  Check, 
  Type, 
  Award, 
  Video, 
  Image as ImageIcon, 
  ListCollapse, 
  HelpCircle,
  ArrowLeft
} from 'lucide-react';

interface PageProps {
  params: Promise<{ courseId: string }>;
}

export default function CourseEditorPage({ params }: PageProps) {
  const resolvedParams = use(params);
  const courseId = resolvedParams.courseId;

  // Core Course & Structure State
  const [loading, setLoading] = useState(true);
  const [course, setCourse] = useState<Course | null>(null);
  const [modules, setModules] = useState<(CourseModule & { pages: (CoursePage & { blocks: ContentBlock[] })[] })[]>([]);
  const [selectedPageId, setSelectedPageId] = useState<string>('');

  // Editor Viewport & Mode State
  const [viewport, setViewport] = useState<ViewportMode>('desktop');
  const [isPreviewMode, setIsPreviewMode] = useState(false);
  const [saveIndicator, setSaveIndicator] = useState<'saved' | 'saving'>('saved');

  // Modals & Block Editing
  const [editingBlock, setEditingBlock] = useState<ContentBlock | null>(null);
  const [isEditorModalOpen, setIsEditorModalOpen] = useState(false);
  const [showAddBlockMenu, setShowAddBlockMenu] = useState(false);

  // New Module/Page Modals
  const [showAddModulePrompt, setShowAddModulePrompt] = useState(false);
  const [newModuleTitle, setNewModuleTitle] = useState('');
  const [targetModuleForPage, setTargetModuleForPage] = useState<string | null>(null);
  const [newPageTitle, setNewPageTitle] = useState('');

  // Initial Load
  useEffect(() => {
    async function fetchStructure() {
      const data = await DataRepository.getCourseStructure(courseId);
      if (data) {
        setCourse(data.course);
        setModules(data.modules);
        if (data.modules.length > 0 && data.modules[0].pages.length > 0) {
          setSelectedPageId(data.modules[0].pages[0].id);
        }
      }
      setLoading(false);
    }
    fetchStructure();
  }, [courseId]);

  // Current active page and its blocks
  const activePage = modules.flatMap(m => m.pages).find(p => p.id === selectedPageId);
  const activeBlocks = activePage?.blocks || [];

  // Structure Operations
  const handleAddModule = async () => {
    if (!newModuleTitle.trim() || !course) return;
    const newMod = await DataRepository.addModule(course.id, newModuleTitle);
    const newPage = await DataRepository.addPage(newMod.id, 'Introduction & Concepts');

    const refreshed = await DataRepository.getCourseStructure(course.id);
    if (refreshed) {
      setModules(refreshed.modules);
      setSelectedPageId(newPage.id);
    }
    setNewModuleTitle('');
    setShowAddModulePrompt(false);
    triggerSaved();
  };

  const handleDeleteModule = async (moduleId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!confirm('Are you sure you want to delete this module and its topics?')) return;
    await DataRepository.deleteModule(moduleId);
    const refreshed = await DataRepository.getCourseStructure(courseId);
    if (refreshed) {
      setModules(refreshed.modules);
      if (refreshed.modules.length > 0 && refreshed.modules[0].pages.length > 0) {
        setSelectedPageId(refreshed.modules[0].pages[0].id);
      } else {
        setSelectedPageId('');
      }
    }
    triggerSaved();
  };

  const handleAddPage = async (moduleId: string) => {
    if (!newPageTitle.trim()) return;
    const newPage = await DataRepository.addPage(moduleId, newPageTitle);
    const refreshed = await DataRepository.getCourseStructure(courseId);
    if (refreshed) {
      setModules(refreshed.modules);
      setSelectedPageId(newPage.id);
    }
    setNewPageTitle('');
    setTargetModuleForPage(null);
    triggerSaved();
  };

  const handleDeletePage = async (pageId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!confirm('Are you sure you want to delete this topic?')) return;
    await DataRepository.deletePage(pageId);
    const refreshed = await DataRepository.getCourseStructure(courseId);
    if (refreshed) {
      setModules(refreshed.modules);
      if (selectedPageId === pageId) {
        const remaining = refreshed.modules.flatMap(m => m.pages);
        setSelectedPageId(remaining[0]?.id || '');
      }
    }
    triggerSaved();
  };

  // Block Operations
  const handleInsertBlock = async (type: BlockType) => {
    if (!selectedPageId) return;

    let defaultContent: BlockContentJson = { html: '' };
    if (type === 'rich_text') {
      defaultContent = {
        heading: 'New Section Heading',
        html: '<p>Write your detailed instructional content here with rich formatting.</p>'
      };
    } else if (type === 'callout') {
      defaultContent = {
        variant: 'takeaway',
        title: 'Essential Takeaway',
        text: 'Summarize the core takeaway or enterprise security requirement here.'
      };
    } else if (type === 'video') {
      defaultContent = {
        title: 'Video Lecture Briefing',
        url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
        caption: 'High-definition video lecture streaming from cloud repository.'
      };
    } else if (type === 'image') {
      defaultContent = {
        url: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=800&auto=format&fit=crop&q=80',
        alt: 'Course Diagram',
        caption: 'Visual workflow architecture.'
      };
    } else if (type === 'accordion') {
      defaultContent = {
        items: [
          { id: 'item-1', title: 'Phase 1: Preparation', content: 'Step-by-step procedural guidelines.' },
          { id: 'item-2', title: 'Phase 2: Execution', content: 'Operational details and escalation path.' }
        ]
      };
    } else if (type === 'quiz') {
      defaultContent = {
        question: 'What is the primary objective of this protocol?',
        options: [
          'Immediate risk mitigation and containment',
          'Postpone response until quarterly review',
          'Bypass two-factor authentication'
        ],
        correctOptionIndex: 0,
        explanation: 'Rapid containment ensures systems remain secure under zero-trust guidelines.'
      };
    }

    const created = await DataRepository.addBlock(selectedPageId, {
      page_id: selectedPageId,
      type,
      order_index: activeBlocks.length,
      content_json: defaultContent
    });

    const refreshed = await DataRepository.getCourseStructure(courseId);
    if (refreshed) setModules(refreshed.modules);
    setShowAddBlockMenu(false);
    triggerSaved();

    setEditingBlock(created);
    setIsEditorModalOpen(true);
  };

  const handleUpdateBlockContent = async (blockId: string, updatedContentJson: BlockContentJson) => {
    await DataRepository.updateBlock(blockId, { content_json: updatedContentJson });
    const refreshed = await DataRepository.getCourseStructure(courseId);
    if (refreshed) setModules(refreshed.modules);
    triggerSaved();
  };

  const handleDeleteBlock = async (blockId: string) => {
    if (!confirm('Delete this content block?')) return;
    await DataRepository.deleteBlock(blockId);
    const refreshed = await DataRepository.getCourseStructure(courseId);
    if (refreshed) setModules(refreshed.modules);
    triggerSaved();
  };

  const handleMoveBlock = async (index: number, direction: 'up' | 'down') => {
    if (!selectedPageId) return;
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= activeBlocks.length) return;

    const newBlocks = [...activeBlocks];
    const [moved] = newBlocks.splice(index, 1);
    newBlocks.splice(targetIndex, 0, moved);

    const orderedIds = newBlocks.map(b => b.id);
    await DataRepository.reorderBlocks(selectedPageId, orderedIds);

    const refreshed = await DataRepository.getCourseStructure(courseId);
    if (refreshed) setModules(refreshed.modules);
    triggerSaved();
  };

  const handleTogglePublish = async () => {
    if (!course) return;
    const updatedStatus = course.status === 'published' ? 'draft' : 'published';
    const updated = await DataRepository.saveCourse({ ...course, status: updatedStatus });
    setCourse(updated);
    triggerSaved();
  };

  const triggerSaved = () => {
    setSaveIndicator('saving');
    setTimeout(() => {
      setSaveIndicator('saved');
    }, 600);
  };

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-slate-950 text-slate-300">
        <div className="flex items-center gap-3">
          <div className="h-6 w-6 animate-spin rounded-full border-2 border-indigo-500 border-t-transparent" />
          <span className="text-sm">Loading Gomo Authoring Environment...</span>
        </div>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="p-8 text-center text-slate-300">
        <h2 className="text-lg font-bold">Course Not Found</h2>
        <Link href="/author" className="mt-4 text-xs text-indigo-400 underline">
          Return to Authoring Catalog
        </Link>
      </div>
    );
  }

  return (
    <div className="flex h-[calc(100vh-4rem)] flex-col bg-slate-950 text-slate-100 overflow-hidden">
      {/* Top Authoring Toolbar */}
      <header className="flex h-14 shrink-0 items-center justify-between border-b border-slate-800 bg-slate-900/90 px-4 backdrop-blur-md">
        <div className="flex items-center gap-3">
          <Link
            href="/author"
            className="flex items-center gap-1 rounded-lg p-1.5 text-slate-400 hover:bg-slate-800 hover:text-white transition-colors"
            title="Return to Studio Catalog"
          >
            <ArrowLeft className="h-4 w-4" />
          </Link>
          <div className="h-4 w-px bg-slate-800" />
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-white max-w-[260px] truncate sm:max-w-md">
                {course.title}
              </span>
              <button
                onClick={handleTogglePublish}
                className={`rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider transition-colors ${
                  course.status === 'published'
                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 hover:bg-emerald-500/30'
                    : 'bg-amber-500/20 text-amber-300 border border-amber-500/30 hover:bg-amber-500/30'
                }`}
              >
                {course.status === 'published' ? '● Published' : '○ Draft'}
              </button>
            </div>
          </div>
        </div>

        {/* Viewport Switcher Toolbar (Desktop, Tablet, Mobile) */}
        <div className="flex items-center gap-1 rounded-xl border border-slate-800 bg-slate-950 p-1">
          <button
            onClick={() => setViewport('desktop')}
            className={`flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-xs font-medium transition-all ${
              viewport === 'desktop'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
            title="Desktop 100% Fluid Viewport"
          >
            <Monitor className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Desktop</span>
          </button>
          <button
            onClick={() => setViewport('tablet')}
            className={`flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-xs font-medium transition-all ${
              viewport === 'tablet'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
            title="Tablet 768px Viewport"
          >
            <Tablet className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Tablet (768px)</span>
          </button>
          <button
            onClick={() => setViewport('mobile')}
            className={`flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-xs font-medium transition-all ${
              viewport === 'mobile'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
            title="Mobile 375px Viewport"
          >
            <Smartphone className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Mobile (375px)</span>
          </button>
        </div>

        {/* Controls */}
        <div className="flex items-center gap-3">
          <div className="hidden lg:flex items-center gap-1 text-[11px] text-slate-400">
            {saveIndicator === 'saving' ? (
              <span className="flex items-center gap-1 text-amber-400">
                <span className="h-2 w-2 rounded-full bg-amber-400 animate-ping" />
                Saving...
              </span>
            ) : (
              <span className="flex items-center gap-1 text-emerald-400">
                <Check className="h-3 w-3" />
                Changes Synced
              </span>
            )}
          </div>

          <button
            onClick={() => setIsPreviewMode(!isPreviewMode)}
            className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold border transition-all ${
              isPreviewMode
                ? 'bg-purple-600/20 text-purple-300 border-purple-500/40 shadow-sm'
                : 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700'
            }`}
          >
            {isPreviewMode ? <Edit3 className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
            <span>{isPreviewMode ? 'Edit Mode' : 'Live Preview'}</span>
          </button>

          <Link
            href={`/learn/${course.id}`}
            target="_blank"
            className="flex items-center gap-1.5 rounded-lg bg-indigo-600 px-3 py-1.5 text-xs font-semibold text-white shadow-sm hover:bg-indigo-500 transition-colors"
            title="Open in Litmos Distraction-Free Learner Player"
          >
            <ExternalLink className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Learner Player</span>
          </Link>
        </div>
      </header>

      {/* Editor Body */}
      <div className="flex flex-1 overflow-hidden">
        {/* Structure Tree */}
        <aside className="w-72 shrink-0 border-r border-slate-800 bg-slate-900/40 flex flex-col justify-between overflow-hidden">
          <div className="p-3 border-b border-slate-800 flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
              <Layers className="h-3.5 w-3.5 text-indigo-400" />
              Curriculum Tree
            </span>
            <button
              onClick={() => setShowAddModulePrompt(true)}
              className="flex items-center gap-1 rounded-md bg-indigo-600/20 border border-indigo-500/30 px-2 py-0.5 text-[11px] font-semibold text-indigo-300 hover:bg-indigo-600 hover:text-white transition-colors"
            >
              <Plus className="h-3 w-3" /> Module
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-3 space-y-3">
            {modules.map((mod, modIdx) => (
              <div key={mod.id} className="rounded-xl border border-slate-800/80 bg-slate-950/50 overflow-hidden">
                <div className="flex items-center justify-between px-3 py-2 bg-slate-900/60 border-b border-slate-800/60">
                  <span className="text-xs font-bold text-slate-200 truncate flex-1" title={mod.title}>
                    {modIdx + 1}. {mod.title}
                  </span>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => setTargetModuleForPage(mod.id)}
                      className="p-1 text-slate-400 hover:text-indigo-300"
                      title="Add Topic to Module"
                    >
                      <Plus className="h-3 w-3" />
                    </button>
                    {modules.length > 1 && (
                      <button
                        onClick={(e) => handleDeleteModule(mod.id, e)}
                        className="p-1 text-slate-500 hover:text-rose-400"
                        title="Delete Module"
                      >
                        <Trash2 className="h-3 w-3" />
                      </button>
                    )}
                  </div>
                </div>

                <div className="divide-y divide-slate-850 p-1 space-y-0.5">
                  {mod.pages.map((page, pageIdx) => {
                    const isSelected = page.id === selectedPageId;
                    return (
                      <div
                        key={page.id}
                        onClick={() => setSelectedPageId(page.id)}
                        className={`group flex items-center justify-between rounded-lg px-2.5 py-2 text-xs cursor-pointer transition-all ${
                          isSelected
                            ? 'bg-indigo-600/20 text-indigo-200 font-semibold border border-indigo-500/30 shadow-sm'
                            : 'text-slate-400 hover:bg-slate-900 hover:text-slate-200'
                        }`}
                      >
                        <div className="flex items-center gap-2 truncate">
                          <span className="text-[10px] text-slate-500 font-mono">
                            {modIdx + 1}.{pageIdx + 1}
                          </span>
                          <span className="truncate">{page.title}</span>
                        </div>
                        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          {mod.pages.length > 1 && (
                            <button
                              onClick={(e) => handleDeletePage(page.id, e)}
                              className="p-1 text-slate-500 hover:text-rose-400"
                              title="Delete Topic"
                            >
                              <Trash2 className="h-3 w-3" />
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>

          <div className="p-3 border-t border-slate-800 bg-slate-950/60 text-[11px] text-slate-400">
            <span className="font-semibold text-slate-300">Gomo Multi-Device Rule:</span>
            <p className="mt-0.5 leading-snug">
              Blocks automatically reorganize fluidly based on the learner&apos;s viewport screen.
            </p>
          </div>
        </aside>

        {/* Visual Canvas */}
        <main className="flex-1 bg-slate-950 flex flex-col items-center overflow-y-auto p-4 sm:p-6 lg:p-8">
          <div
            className={`w-full transition-all duration-300 ${
              viewport === 'desktop'
                ? 'max-w-4xl'
                : viewport === 'tablet'
                ? 'max-w-[768px] rounded-3xl border-4 border-slate-800 bg-slate-900/90 shadow-2xl p-4 my-2'
                : 'max-w-[375px] rounded-[40px] border-8 border-slate-800 bg-slate-900/90 shadow-2xl p-3 my-2'
            }`}
          >
            {viewport !== 'desktop' && (
              <div className="mb-4 pb-2 border-b border-slate-800 flex items-center justify-between text-[11px] text-slate-500">
                <span className="font-mono uppercase font-semibold">
                  {viewport === 'mobile' ? 'Mobile 375px Preview' : 'Tablet 768px Preview'}
                </span>
                <span className="h-2 w-12 rounded-full bg-slate-800 mx-auto" />
                <span>100%</span>
              </div>
            )}

            <div className="mb-6 rounded-2xl border border-slate-800/80 bg-slate-900/60 p-5 backdrop-blur-sm">
              <div className="text-[11px] font-semibold uppercase tracking-wider text-indigo-400">
                Active Topic
              </div>
              <h1 className="text-xl sm:text-2xl font-extrabold text-white mt-1">
                {activePage?.title || 'Select a topic from the structure tree'}
              </h1>
            </div>

            <div className="space-y-4">
              {activeBlocks.length === 0 ? (
                <div className="rounded-2xl border-2 border-dashed border-slate-800 p-8 text-center">
                  <p className="text-xs text-slate-400">
                    No learning blocks have been added to this topic yet.
                  </p>
                  <button
                    onClick={() => setShowAddBlockMenu(true)}
                    className="mt-3 inline-flex items-center gap-1.5 rounded-lg bg-indigo-600 px-3.5 py-2 text-xs font-semibold text-white shadow-sm hover:bg-indigo-500"
                  >
                    <Plus className="h-3.5 w-3.5" />
                    Insert First Block
                  </button>
                </div>
              ) : (
                activeBlocks.map((block, index) => (
                  <div
                    key={block.id}
                    className={`relative rounded-2xl transition-all ${
                      isPreviewMode
                        ? ''
                        : 'group border border-slate-800 bg-slate-900/40 p-4 hover:border-indigo-500/40 hover:bg-slate-900/60'
                    }`}
                  >
                    {!isPreviewMode && (
                      <div className="flex items-center justify-between border-b border-slate-850 pb-2 mb-3 text-[11px] text-slate-400">
                        <span className="font-bold uppercase tracking-wider text-indigo-400 flex items-center gap-1.5">
                          {block.type.replace('_', ' ')}
                        </span>
                        
                        <div className="flex items-center gap-1.5 opacity-90 group-hover:opacity-100">
                          <button
                            disabled={index === 0}
                            onClick={() => handleMoveBlock(index, 'up')}
                            className="p-1 rounded hover:bg-slate-800 disabled:opacity-30 text-slate-400 hover:text-white"
                            title="Move Block Up"
                          >
                            <ArrowUp className="h-3.5 w-3.5" />
                          </button>
                          <button
                            disabled={index === activeBlocks.length - 1}
                            onClick={() => handleMoveBlock(index, 'down')}
                            className="p-1 rounded hover:bg-slate-800 disabled:opacity-30 text-slate-400 hover:text-white"
                            title="Move Block Down"
                          >
                            <ArrowDown className="h-3.5 w-3.5" />
                          </button>
                          <button
                            onClick={() => {
                              setEditingBlock(block);
                              setIsEditorModalOpen(true);
                            }}
                            className="flex items-center gap-1 px-2 py-0.5 rounded bg-indigo-600/20 text-indigo-300 border border-indigo-500/30 hover:bg-indigo-600 hover:text-white transition-colors"
                          >
                            <Edit3 className="h-3 w-3" />
                            Edit
                          </button>
                          <button
                            onClick={() => handleDeleteBlock(block.id)}
                            className="p-1 rounded hover:bg-rose-950/60 text-slate-400 hover:text-rose-400"
                            title="Delete Block"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      </div>
                    )}

                    <BlockRenderer block={block} isEditable={!isPreviewMode} />
                  </div>
                ))
              )}
            </div>

            {!isPreviewMode && activePage && (
              <div className="mt-8 border-t border-slate-800/80 pt-6">
                {!showAddBlockMenu ? (
                  <button
                    onClick={() => setShowAddBlockMenu(true)}
                    className="w-full flex items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-indigo-500/30 bg-indigo-950/10 py-3 text-xs font-semibold text-indigo-300 hover:border-indigo-500 hover:bg-indigo-950/30 transition-all active:scale-[0.99]"
                  >
                    <Plus className="h-4 w-4" />
                    Insert Modular Learning Block
                  </button>
                ) : (
                  <div className="rounded-2xl border border-indigo-500/40 bg-slate-900/90 p-5 shadow-2xl backdrop-blur-md">
                    <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                      <div>
                        <h4 className="text-xs font-bold uppercase tracking-wider text-white">
                          Select Block Type
                        </h4>
                        <p className="text-[11px] text-slate-400">
                          Choose an interactive learning component to add to this topic
                        </p>
                      </div>
                      <button
                        onClick={() => setShowAddBlockMenu(false)}
                        className="text-xs text-slate-400 hover:text-white"
                      >
                        Cancel
                      </button>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mt-4">
                      <button
                        onClick={() => handleInsertBlock('rich_text')}
                        className="flex flex-col items-start p-3 rounded-xl border border-slate-800 bg-slate-950/60 hover:border-indigo-500 hover:bg-indigo-950/20 text-left transition-all group"
                      >
                        <Type className="h-5 w-5 text-indigo-400 mb-2 group-hover:scale-110 transition-transform" />
                        <span className="text-xs font-semibold text-white">Rich Text</span>
                        <span className="text-[10px] text-slate-400 mt-0.5">Headings, paragraphs & formatting</span>
                      </button>

                      <button
                        onClick={() => handleInsertBlock('callout')}
                        className="flex flex-col items-start p-3 rounded-xl border border-slate-800 bg-slate-950/60 hover:border-indigo-500 hover:bg-indigo-950/20 text-left transition-all group"
                      >
                        <Award className="h-5 w-5 text-amber-400 mb-2 group-hover:scale-110 transition-transform" />
                        <span className="text-xs font-semibold text-white">Callout Card</span>
                        <span className="text-[10px] text-slate-400 mt-0.5">Takeaways, tips, warnings</span>
                      </button>

                      <button
                        onClick={() => handleInsertBlock('video')}
                        className="flex flex-col items-start p-3 rounded-xl border border-slate-800 bg-slate-950/60 hover:border-indigo-500 hover:bg-indigo-950/20 text-left transition-all group"
                      >
                        <Video className="h-5 w-5 text-purple-400 mb-2 group-hover:scale-110 transition-transform" />
                        <span className="text-xs font-semibold text-white">Video Embed</span>
                        <span className="text-[10px] text-slate-400 mt-0.5">YouTube or direct MP4 URL</span>
                      </button>

                      <button
                        onClick={() => handleInsertBlock('image')}
                        className="flex flex-col items-start p-3 rounded-xl border border-slate-800 bg-slate-950/60 hover:border-indigo-500 hover:bg-indigo-950/20 text-left transition-all group"
                      >
                        <ImageIcon className="h-5 w-5 text-emerald-400 mb-2 group-hover:scale-110 transition-transform" />
                        <span className="text-xs font-semibold text-white">Image & Caption</span>
                        <span className="text-[10px] text-slate-400 mt-0.5">Diagrams, figures & graphics</span>
                      </button>

                      <button
                        onClick={() => handleInsertBlock('accordion')}
                        className="flex flex-col items-start p-3 rounded-xl border border-slate-800 bg-slate-950/60 hover:border-indigo-500 hover:bg-indigo-950/20 text-left transition-all group"
                      >
                        <ListCollapse className="h-5 w-5 text-sky-400 mb-2 group-hover:scale-110 transition-transform" />
                        <span className="text-xs font-semibold text-white">Accordion</span>
                        <span className="text-[10px] text-slate-400 mt-0.5">Collapsible expandable items</span>
                      </button>

                      <button
                        onClick={() => handleInsertBlock('quiz')}
                        className="flex flex-col items-start p-3 rounded-xl border border-slate-800 bg-slate-950/60 hover:border-indigo-500 hover:bg-indigo-950/20 text-left transition-all group"
                      >
                        <HelpCircle className="h-5 w-5 text-pink-400 mb-2 group-hover:scale-110 transition-transform" />
                        <span className="text-xs font-semibold text-white">Knowledge Check</span>
                        <span className="text-[10px] text-slate-400 mt-0.5">Scored quiz with feedback</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </main>
      </div>

      <BlockEditorModal
        block={editingBlock}
        isOpen={isEditorModalOpen}
        onClose={() => {
          setIsEditorModalOpen(false);
          setEditingBlock(null);
        }}
        onSave={handleUpdateBlockContent}
      />

      {showAddModulePrompt && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4 backdrop-blur-sm">
          <div className="w-full max-w-sm rounded-2xl border border-slate-800 bg-slate-900 p-5 shadow-2xl">
            <h4 className="text-sm font-bold text-white flex items-center gap-2">
              <FolderPlus className="h-4 w-4 text-indigo-400" />
              Add Curriculum Module
            </h4>
            <input
              type="text"
              autoFocus
              value={newModuleTitle}
              onChange={(e) => setNewModuleTitle(e.target.value)}
              placeholder="e.g. Module 3: Threat Mitigation"
              className="mt-3 w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-xs text-slate-200 focus:border-indigo-500 focus:outline-none"
            />
            <div className="mt-4 flex justify-end gap-2 text-xs">
              <button
                onClick={() => setShowAddModulePrompt(false)}
                className="px-3 py-1.5 text-slate-400 hover:text-white"
              >
                Cancel
              </button>
              <button
                onClick={handleAddModule}
                className="rounded-lg bg-indigo-600 px-3.5 py-1.5 font-semibold text-white hover:bg-indigo-500"
              >
                Add Module
              </button>
            </div>
          </div>
        </div>
      )}

      {targetModuleForPage && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4 backdrop-blur-sm">
          <div className="w-full max-w-sm rounded-2xl border border-slate-800 bg-slate-900 p-5 shadow-2xl">
            <h4 className="text-sm font-bold text-white flex items-center gap-2">
              <FilePlus className="h-4 w-4 text-indigo-400" />
              Add Topic / Screen
            </h4>
            <input
              type="text"
              autoFocus
              value={newPageTitle}
              onChange={(e) => setNewPageTitle(e.target.value)}
              placeholder="e.g. Passkey Configuration"
              className="mt-3 w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-xs text-slate-200 focus:border-indigo-500 focus:outline-none"
            />
            <div className="mt-4 flex justify-end gap-2 text-xs">
              <button
                onClick={() => setTargetModuleForPage(null)}
                className="px-3 py-1.5 text-slate-400 hover:text-white"
              >
                Cancel
              </button>
              <button
                onClick={() => handleAddPage(targetModuleForPage)}
                className="rounded-lg bg-indigo-600 px-3.5 py-1.5 font-semibold text-white hover:bg-indigo-500"
              >
                Add Topic
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
