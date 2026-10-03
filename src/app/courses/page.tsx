'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  BookOpen, 
  Search, 
  Plus, 
  Clock, 
  Users, 
  CheckCircle2, 
  Play, 
  X, 
  FileText, 
  ArrowRight
} from 'lucide-react';
import { Course, CourseLevel } from '@/types/masLms';
import { MasDataStore } from '@/lib/mockData';

const CATEGORIES = ['All', 'Security', 'Compliance', 'Engineering', 'Leadership', 'Finance'] as const;

export default function CoursesPage() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedLevel, setSelectedLevel] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    title: '',
    category: 'Engineering' as Course['category'],
    level: 'Beginner' as CourseLevel,
    durationHours: 2.5,
    instructorName: 'Alex Morgan',
    description: '',
    thumbnailUrl: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=600&auto=format&fit=crop',
    initialLessonTitle: 'Introduction & Core Foundations'
  });

  useEffect(() => {
    setCourses(MasDataStore.getCourses());
  }, []);

  const filteredCourses = courses.filter(course => {
    const matchesCategory = selectedCategory === 'All' || course.category === selectedCategory;
    const matchesLevel = selectedLevel === 'All' || course.level === selectedLevel;
    const matchesSearch = 
      course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      course.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      course.instructorName.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesLevel && matchesSearch;
  });

  const handleCreateCourse = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim()) return;

    const newCourse = MasDataStore.addCourse({
      title: formData.title,
      category: formData.category,
      level: formData.level,
      durationHours: Number(formData.durationHours) || 2,
      instructorName: formData.instructorName || 'Alex Morgan',
      description: formData.description,
      thumbnailUrl: formData.thumbnailUrl || 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=600&auto=format&fit=crop',
      lessons: [
        {
          id: `lsn-${Date.now()}-1`,
          courseId: '',
          title: formData.initialLessonTitle || 'Introduction & Core Foundations',
          durationMinutes: 15,
          type: 'reading',
          completed: false,
          contentMarkdown: `### Welcome to ${formData.title}\n\nThis enterprise module covers essential practices, compliance standards, and workflows.\n\n- Understand foundational protocols\n- Complete verification drills\n- Review practical scenarios`
        },
        {
          id: `lsn-${Date.now()}-2`,
          courseId: '',
          title: 'Practical Application & Case Studies',
          durationMinutes: 25,
          type: 'video',
          completed: false,
          videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ'
        }
      ]
    });

    setCourses(prev => [newCourse, ...prev]);
    setIsModalOpen(false);
    setFormData({
      title: '',
      category: 'Engineering',
      level: 'Beginner',
      durationHours: 2.5,
      instructorName: 'Alex Morgan',
      description: '',
      thumbnailUrl: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=600&auto=format&fit=crop',
      initialLessonTitle: 'Introduction & Core Foundations'
    });
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 pb-6">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-purple-50 text-[#7C3AED] border border-purple-200">
              <BookOpen className="w-3.5 h-3.5" />
              Curriculum Catalog
            </span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-[#1E293B]">
            Enterprise Training Courses
          </h1>
          <p className="text-sm text-[#64748B] mt-1">
            Browse compliance mandates, technical training tracks, and management certifications.
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-sm font-semibold text-white bg-[#7C3AED] hover:bg-[#6D28D9] transition shadow-xs active:scale-[0.98]"
        >
          <Plus className="w-4 h-4" />
          Create New Course
        </button>
      </div>

      {/* Filter Toolbar */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
          {/* Search bar */}
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search courses, topics, or instructors..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-sm rounded-lg border border-slate-200 bg-[#F1F5F9] text-[#1E293B] placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-[#7C3AED] transition"
            />
            {searchQuery && (
              <button 
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Level Filter Dropdown */}
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-[#64748B] whitespace-nowrap">
              Level:
            </span>
            <select
              value={selectedLevel}
              onChange={e => setSelectedLevel(e.target.value)}
              className="text-xs font-medium rounded-lg border border-slate-200 bg-white text-[#1E293B] py-1.5 px-2.5 focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-[#7C3AED]"
            >
              <option value="All">All Levels</option>
              <option value="Beginner">Beginner</option>
              <option value="Intermediate">Intermediate</option>
              <option value="Advanced">Advanced</option>
            </select>
          </div>
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
          {CATEGORIES.map(category => {
            const isSelected = selectedCategory === category;
            return (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
                  isSelected
                    ? 'bg-[#7C3AED] text-white shadow-xs'
                    : 'bg-white hover:bg-slate-100 text-[#64748B] border border-slate-200'
                }`}
              >
                {category === 'All' ? 'All Curricula' : category}
              </button>
            );
          })}
        </div>
      </div>

      {/* Course Grid */}
      {filteredCourses.length === 0 ? (
        <div className="p-12 text-center border border-dashed border-slate-200 rounded-2xl bg-white">
          <BookOpen className="w-10 h-10 text-slate-400 mx-auto mb-3" />
          <h3 className="text-sm font-bold text-[#1E293B]">No courses found</h3>
          <p className="text-xs text-[#64748B] mt-1 max-w-sm mx-auto">
            Try adjusting your search criteria or filter options to discover other programs.
          </p>
          <button
            onClick={() => { setSelectedCategory('All'); setSelectedLevel('All'); setSearchQuery(''); }}
            className="mt-4 inline-flex items-center text-xs font-semibold text-[#7C3AED] hover:underline"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCourses.map(course => {
            const progress = course.progress ?? 0;
            const isCompleted = progress === 100;
            const isInProgress = progress > 0 && progress < 100;

            return (
              <div
                key={course.id}
                className="group relative flex flex-col rounded-2xl border border-slate-200 bg-white overflow-hidden hover:border-slate-300 shadow-sm hover:shadow-md transition-all duration-200"
              >
                {/* Course Card Thumbnail */}
                <div className="relative aspect-video w-full overflow-hidden bg-slate-100">
                  <img
                    src={course.thumbnailUrl}
                    alt={course.title}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                  
                  {/* Category Badge */}
                  <span className="absolute top-3 left-3 px-2 py-0.5 rounded-md text-[11px] font-bold bg-white/95 text-[#1E293B] backdrop-blur-sm shadow-xs border border-slate-200">
                    {course.category}
                  </span>

                  {/* Level Badge */}
                  <span className="absolute top-3 right-3 px-2 py-0.5 rounded-md text-[11px] font-medium bg-black/60 text-white backdrop-blur-sm">
                    {course.level}
                  </span>

                  {/* Duration & Lessons Pill */}
                  <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-xs text-white">
                    <span className="inline-flex items-center gap-1 font-semibold">
                      <Clock className="w-3 h-3" />
                      {course.durationHours} hrs
                    </span>
                    <span className="inline-flex items-center gap-1 font-semibold">
                      <FileText className="w-3 h-3" />
                      {course.lessonCount} lessons
                    </span>
                  </div>
                </div>

                {/* Course Details */}
                <div className="p-5 flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between text-xs text-[#64748B] mb-1.5">
                      <span>Instructor: {course.instructorName}</span>
                      <span className="inline-flex items-center gap-1 font-medium">
                        <Users className="w-3 h-3" />
                        {course.enrolledLearnersCount} enrolled
                      </span>
                    </div>

                    <h3 className="text-base font-bold text-[#1E293B] group-hover:text-[#7C3AED] transition-colors line-clamp-1">
                      {course.title}
                    </h3>

                    <p className="text-xs text-[#64748B] mt-1.5 line-clamp-2 leading-relaxed">
                      {course.description}
                    </p>
                  </div>

                  {/* Progress Indicator and Action */}
                  <div className="mt-5 pt-4 border-t border-slate-100">
                    <div className="flex items-center justify-between text-xs mb-1.5">
                      <span className="font-semibold text-[#64748B]">
                        {isCompleted ? 'Completed' : isInProgress ? 'In Progress' : 'Not Started'}
                      </span>
                      <span className="font-bold text-[#1E293B]">
                        {progress}%
                      </span>
                    </div>

                    {/* Progress Bar */}
                    <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden mb-4">
                      <div
                        className={`h-full transition-all duration-300 rounded-full ${
                          isCompleted
                            ? 'bg-emerald-500'
                            : isInProgress
                            ? 'bg-[#7C3AED]'
                            : 'bg-transparent'
                        }`}
                        style={{ width: `${progress}%` }}
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <Link
                        href={`/courses/${course.id}`}
                        className={`inline-flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl text-xs font-bold transition ${
                          isCompleted
                            ? 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200'
                            : isInProgress
                            ? 'bg-purple-50 text-[#7C3AED] hover:bg-[#7C3AED] hover:text-white border border-purple-200'
                            : 'bg-[#1E293B] text-white hover:bg-slate-800'
                        }`}
                      >
                        {isCompleted ? (
                          <>
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            Review
                          </>
                        ) : isInProgress ? (
                          <>
                            <Play className="w-3.5 h-3.5 fill-current" />
                            Resume
                          </>
                        ) : (
                          <>
                            Start
                            <ArrowRight className="w-3.5 h-3.5" />
                          </>
                        )}
                      </Link>

                      <Link
                        href={`/courses/${course.id}?action=add_module`}
                        className="inline-flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl text-xs font-bold text-[#7C3AED] bg-purple-50 hover:bg-purple-100 border border-purple-200 transition"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        Add Module
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Create New Course Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl max-w-xl w-full border border-slate-200 shadow-2xl overflow-hidden">
            {/* Modal Header */}
            <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold text-[#1E293B]">
                  Create Enterprise Course
                </h3>
                <p className="text-xs text-[#64748B] mt-0.5">
                  Publish a new training curriculum to the M.A.S LMS library.
                </p>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleCreateCourse} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-[#1E293B] mb-1.5">
                  Course Title *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Cloud Security Posture & Incident Protocol"
                  value={formData.title}
                  onChange={e => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-3.5 py-2 text-sm rounded-lg border border-slate-200 bg-white text-[#1E293B] placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-[#7C3AED]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-[#1E293B] mb-1.5">
                    Category
                  </label>
                  <select
                    value={formData.category}
                    onChange={e => setFormData({ ...formData, category: e.target.value as any })}
                    className="w-full px-3 py-2 text-xs font-medium rounded-lg border border-slate-200 bg-white text-[#1E293B] focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-[#7C3AED]"
                  >
                    <option value="Security">Security</option>
                    <option value="Compliance">Compliance</option>
                    <option value="Engineering">Engineering</option>
                    <option value="Leadership">Leadership</option>
                    <option value="Finance">Finance</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#1E293B] mb-1.5">
                    Skill Level
                  </label>
                  <select
                    value={formData.level}
                    onChange={e => setFormData({ ...formData, level: e.target.value as any })}
                    className="w-full px-3 py-2 text-xs font-medium rounded-lg border border-slate-200 bg-white text-[#1E293B] focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-[#7C3AED]"
                  >
                    <option value="Beginner">Beginner</option>
                    <option value="Intermediate">Intermediate</option>
                    <option value="Advanced">Advanced</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-[#1E293B] mb-1.5">
                    Estimated Duration (Hours)
                  </label>
                  <input
                    type="number"
                    step="0.5"
                    min="0.5"
                    max="100"
                    value={formData.durationHours}
                    onChange={e => setFormData({ ...formData, durationHours: parseFloat(e.target.value) || 1 })}
                    className="w-full px-3.5 py-2 text-xs rounded-lg border border-slate-200 bg-white text-[#1E293B] focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-[#7C3AED]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#1E293B] mb-1.5">
                    Lead Instructor Name
                  </label>
                  <input
                    type="text"
                    value={formData.instructorName}
                    onChange={e => setFormData({ ...formData, instructorName: e.target.value })}
                    className="w-full px-3.5 py-2 text-xs rounded-lg border border-slate-200 bg-white text-[#1E293B] focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-[#7C3AED]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#1E293B] mb-1.5">
                  Course Summary & Objectives
                </label>
                <textarea
                  rows={3}
                  required
                  placeholder="Outline key learning outcomes and target audience for this curriculum..."
                  value={formData.description}
                  onChange={e => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-3.5 py-2 text-xs rounded-lg border border-slate-200 bg-white text-[#1E293B] placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-[#7C3AED] resize-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#1E293B] mb-1.5">
                  Initial Module / Lesson Title
                </label>
                <input
                  type="text"
                  placeholder="e.g. Module 1: Architecture & Compliance Overview"
                  value={formData.initialLessonTitle}
                  onChange={e => setFormData({ ...formData, initialLessonTitle: e.target.value })}
                  className="w-full px-3.5 py-2 text-xs rounded-lg border border-slate-200 bg-white text-[#1E293B] focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-[#7C3AED]"
                />
              </div>

              {/* Modal Actions */}
              <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-lg text-xs font-medium text-[#64748B] hover:bg-slate-100 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg text-xs font-semibold text-white bg-[#7C3AED] hover:bg-[#6D28D9] transition shadow-xs"
                >
                  Publish Course
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
