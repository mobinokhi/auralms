'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { DataRepository } from '@/lib/data-repository';
import { Course } from '@/types/lms';
import { 
  Layers, 
  Plus, 
  Clock, 
  BookOpen, 
  Sparkles,
  FileEdit
} from 'lucide-react';

export default function AuthorStudioPage() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newCategory, setNewCategory] = useState('Information Security');
  const [newDescription, setNewDescription] = useState('');

  useEffect(() => {
    async function load() {
      const data = await DataRepository.getCourses();
      setCourses(data);
      setLoading(false);
    }
    load();
  }, []);

  const handleCreateCourse = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    const newCourse: Course = {
      id: 'course_' + Date.now(),
      title: newTitle,
      description: newDescription || 'Enterprise training curriculum created in Gomo Studio.',
      thumbnail_url: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&auto=format&fit=crop&q=80',
      category: newCategory,
      estimated_minutes: 30,
      status: 'draft',
      modules_count: 1,
      total_topics_count: 1
    };

    await DataRepository.saveCourse(newCourse);
    const mod = await DataRepository.addModule(newCourse.id, 'Module 1: Orientation & Foundations');
    await DataRepository.addPage(mod.id, 'Welcome & Overview');

    setCourses(prev => [newCourse, ...prev]);
    setShowCreateModal(false);
    setNewTitle('');
    setNewDescription('');
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-6">
          <div>
            <div className="flex items-center gap-2 text-indigo-400 text-xs font-semibold uppercase tracking-wider mb-1">
              <Layers className="h-4 w-4" />
              Gomo Visual Course Studio
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Instructional Authoring & Curriculum
            </h1>
            <p className="mt-1 text-xs sm:text-sm text-slate-400">
              Build responsive, multi-device corporate learning modules with visual blocks and real-time viewport testing.
            </p>
          </div>

          <button
            onClick={() => setShowCreateModal(true)}
            className="flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 px-4 py-2.5 text-xs font-semibold text-white shadow-lg shadow-indigo-500/20 hover:from-indigo-500 hover:to-purple-500 transition-all active:scale-95"
          >
            <Plus className="h-4 w-4" />
            Create New Course
          </button>
        </div>

        <div className="mt-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-slate-400">
              Active Curriculum ({courses.length})
            </h2>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-pulse">
              {[1, 2, 3].map(i => (
                <div key={i} className="h-64 rounded-2xl bg-slate-900/60 border border-slate-800" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {courses.map((course) => (
                <div
                  key={course.id}
                  className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/50 backdrop-blur-sm transition-all hover:border-indigo-500/50 hover:bg-slate-900/80 hover:shadow-xl hover:shadow-indigo-500/5"
                >
                  <div className="relative aspect-video w-full overflow-hidden bg-slate-950">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={course.thumbnail_url}
                      alt={course.title}
                      className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/30 to-transparent" />
                    
                    <div className="absolute top-3 right-3">
                      <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                        course.status === 'published'
                          ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 backdrop-blur-md'
                          : 'bg-amber-500/20 text-amber-300 border border-amber-500/30 backdrop-blur-md'
                      }`}>
                        {course.status === 'published' ? 'Published' : 'Draft'}
                      </span>
                    </div>

                    <div className="absolute bottom-3 left-3">
                      <span className="rounded-md bg-slate-950/80 px-2 py-0.5 text-[10px] font-medium text-slate-300 backdrop-blur-sm border border-slate-800">
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

                    <div className="mt-5 pt-4 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
                      <div className="flex items-center gap-3 text-[11px]">
                        <span className="flex items-center gap-1">
                          <Clock className="h-3 w-3 text-slate-500" />
                          {course.estimated_minutes}m
                        </span>
                        <span className="flex items-center gap-1">
                          <BookOpen className="h-3 w-3 text-slate-500" />
                          {course.modules_count || 2} Modules
                        </span>
                      </div>

                      <Link
                        href={`/author/editor/${course.id}`}
                        className="flex items-center gap-1 rounded-lg bg-indigo-600/20 border border-indigo-500/30 px-3 py-1.5 text-xs font-semibold text-indigo-300 hover:bg-indigo-600 hover:text-white transition-all shadow-sm"
                      >
                        <FileEdit className="h-3.5 w-3.5" />
                        Edit Course
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4 backdrop-blur-sm">
          <div className="w-full max-w-lg rounded-2xl border border-slate-800 bg-slate-900 p-6 shadow-2xl">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-indigo-400" />
              Create New Corporate Course
            </h3>
            <p className="mt-1 text-xs text-slate-400">
              Initialize a curriculum structure ready for Gomo block editing.
            </p>

            <form onSubmit={handleCreateCourse} className="mt-5 space-y-4 text-xs">
              <div>
                <label className="block font-medium text-slate-300 mb-1">Course Title</label>
                <input
                  type="text"
                  required
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="e.g. AI Readiness & Ethical Guidelines 2026"
                  className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-slate-200 focus:border-indigo-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-medium text-slate-300 mb-1">Category</label>
                <select
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value)}
                  className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-slate-200 focus:border-indigo-500 focus:outline-none"
                >
                  <option value="Information Security">Information Security</option>
                  <option value="Executive Leadership">Executive Leadership</option>
                  <option value="Legal & Regulatory">Legal & Regulatory</option>
                  <option value="Product & Technology">Product & Technology</option>
                </select>
              </div>

              <div>
                <label className="block font-medium text-slate-300 mb-1">Description</label>
                <textarea
                  rows={3}
                  value={newDescription}
                  onChange={(e) => setNewDescription(e.target.value)}
                  placeholder="Brief synopsis of learning objectives..."
                  className="w-full rounded-lg border border-slate-700 bg-slate-950 p-3 text-slate-200 focus:border-indigo-500 focus:outline-none"
                />
              </div>

              <div className="mt-6 flex justify-end gap-2.5 pt-2 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="rounded-lg px-4 py-2 text-xs font-semibold text-slate-400 hover:bg-slate-800 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-lg bg-indigo-600 px-4 py-2 text-xs font-semibold text-white hover:bg-indigo-500"
                >
                  Initialize Course
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
