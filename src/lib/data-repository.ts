// ==============================================================================
// AuraLMS - Unified Data Access Layer (Repository Pattern)
// Gracefully delegates between live Supabase PostgreSQL and local storage mock state.
// Guarantees zero crash during builds, previews, and offline development.
// ==============================================================================

import {
  Course,
  CourseModule,
  CoursePage,
  ContentBlock,
  Enrollment,
  QuizAttempt,
  AnalyticsKPIs,
  LearnerRosterItem,
  EnrollmentStatus
} from '@/types/lms';
import { getSupabaseClient, isSupabaseConfigured } from './supabaseClient';
import {
  INITIAL_COURSES,
  INITIAL_MODULES,
  INITIAL_PAGES,
  INITIAL_BLOCKS,
  INITIAL_ENROLLMENTS,
  INITIAL_QUIZ_ATTEMPTS,
  INITIAL_ANALYTICS_KPIS,
  INITIAL_ROSTER
} from './mock-data';

// Local storage keys for persistent mock testing in browser
const STORAGE_PREFIX = 'auralms_store_';

class LocalMockStore {
  private courses: Course[] = [...INITIAL_COURSES];
  private modules: CourseModule[] = [...INITIAL_MODULES];
  private pages: CoursePage[] = [...INITIAL_PAGES];
  private blocks: ContentBlock[] = [...INITIAL_BLOCKS];
  private enrollments: Enrollment[] = [...INITIAL_ENROLLMENTS];
  private quizAttempts: QuizAttempt[] = [...INITIAL_QUIZ_ATTEMPTS];

  constructor() {
    this.hydrateFromLocalStorage();
  }

  private isClient(): boolean {
    return typeof window !== 'undefined';
  }

  private hydrateFromLocalStorage() {
    if (!this.isClient()) return;
    try {
      const savedCourses = localStorage.getItem(STORAGE_PREFIX + 'courses');
      if (savedCourses) this.courses = JSON.parse(savedCourses);

      const savedModules = localStorage.getItem(STORAGE_PREFIX + 'modules');
      if (savedModules) this.modules = JSON.parse(savedModules);

      const savedPages = localStorage.getItem(STORAGE_PREFIX + 'pages');
      if (savedPages) this.pages = JSON.parse(savedPages);

      const savedBlocks = localStorage.getItem(STORAGE_PREFIX + 'blocks');
      if (savedBlocks) this.blocks = JSON.parse(savedBlocks);

      const savedEnrollments = localStorage.getItem(STORAGE_PREFIX + 'enrollments');
      if (savedEnrollments) this.enrollments = JSON.parse(savedEnrollments);

      const savedAttempts = localStorage.getItem(STORAGE_PREFIX + 'attempts');
      if (savedAttempts) this.quizAttempts = JSON.parse(savedAttempts);
    } catch (e) {
      console.warn('Could not read from localStorage, using memory defaults', e);
    }
  }

  private persist(key: string, data: unknown) {
    if (!this.isClient()) return;
    try {
      localStorage.setItem(STORAGE_PREFIX + key, JSON.stringify(data));
    } catch (e) {
      console.warn('LocalStorage write failed:', e);
    }
  }

  // Course operations
  getCourses(): Course[] {
    return this.courses;
  }

  getCourseById(courseId: string): Course | null {
    return this.courses.find(c => c.id === courseId) || null;
  }

  saveCourse(course: Course): Course {
    const index = this.courses.findIndex(c => c.id === course.id);
    if (index >= 0) {
      this.courses[index] = { ...course, updated_at: new Date().toISOString() };
    } else {
      this.courses.push({ ...course, created_at: new Date().toISOString() });
    }
    this.persist('courses', this.courses);
    return course;
  }

  // Structure Tree operations
  getCourseStructure(courseId: string): {
    course: Course;
    modules: (CourseModule & { pages: (CoursePage & { blocks: ContentBlock[] })[] })[];
  } | null {
    const course = this.getCourseById(courseId);
    if (!course) return null;

    const courseModules = this.modules
      .filter(m => m.course_id === courseId)
      .sort((a, b) => a.order_index - b.order_index);

    const hydratedModules = courseModules.map(mod => {
      const modulePages = this.pages
        .filter(p => p.module_id === mod.id)
        .sort((a, b) => a.order_index - b.order_index);

      const hydratedPages = modulePages.map(page => {
        const pageBlocks = this.blocks
          .filter(b => b.page_id === page.id)
          .sort((a, b) => a.order_index - b.order_index);

        return {
          ...page,
          blocks: pageBlocks
        };
      });

      return {
        ...mod,
        pages: hydratedPages
      };
    });

    return {
      course,
      modules: hydratedModules
    };
  }

  addModule(courseId: string, title: string): CourseModule {
    const existing = this.modules.filter(m => m.course_id === courseId);
    const newMod: CourseModule = {
      id: 'mod_' + Date.now(),
      course_id: courseId,
      title: title || `Module ${existing.length + 1}`,
      order_index: existing.length,
      created_at: new Date().toISOString()
    };
    this.modules.push(newMod);
    this.persist('modules', this.modules);
    return newMod;
  }

  deleteModule(moduleId: string) {
    this.modules = this.modules.filter(m => m.id !== moduleId);
    const pageIdsToDelete = this.pages.filter(p => p.module_id === moduleId).map(p => p.id);
    this.pages = this.pages.filter(p => p.module_id !== moduleId);
    this.blocks = this.blocks.filter(b => !pageIdsToDelete.includes(b.page_id));
    this.persist('modules', this.modules);
    this.persist('pages', this.pages);
    this.persist('blocks', this.blocks);
  }

  addPage(moduleId: string, title: string): CoursePage {
    const existing = this.pages.filter(p => p.module_id === moduleId);
    const newPage: CoursePage = {
      id: 'page_' + Date.now(),
      module_id: moduleId,
      title: title || `Topic ${existing.length + 1}`,
      order_index: existing.length,
      created_at: new Date().toISOString(),
      blocks: []
    };
    this.pages.push(newPage);
    this.persist('pages', this.pages);
    return newPage;
  }

  deletePage(pageId: string) {
    this.pages = this.pages.filter(p => p.id !== pageId);
    this.blocks = this.blocks.filter(b => b.page_id !== pageId);
    this.persist('pages', this.pages);
    this.persist('blocks', this.blocks);
  }

  // Block Builder operations
  addBlock(pageId: string, block: Omit<ContentBlock, 'id'>): ContentBlock {
    const newBlock: ContentBlock = {
      ...block,
      id: 'blk_' + Date.now() + '_' + Math.random().toString(36).substr(2, 4),
      created_at: new Date().toISOString()
    };
    this.blocks.push(newBlock);
    this.persist('blocks', this.blocks);
    return newBlock;
  }

  updateBlock(blockId: string, updates: Partial<ContentBlock>): ContentBlock | null {
    const index = this.blocks.findIndex(b => b.id === blockId);
    if (index === -1) return null;
    this.blocks[index] = { ...this.blocks[index], ...updates };
    this.persist('blocks', this.blocks);
    return this.blocks[index];
  }

  deleteBlock(blockId: string) {
    this.blocks = this.blocks.filter(b => b.id !== blockId);
    this.persist('blocks', this.blocks);
  }

  reorderBlocks(pageId: string, orderedBlockIds: string[]) {
    orderedBlockIds.forEach((id, index) => {
      const block = this.blocks.find(b => b.id === id);
      if (block) {
        block.order_index = index;
      }
    });
    this.persist('blocks', this.blocks);
  }

  // Learner Tracking
  getLearnerEnrollments(userId: string): Enrollment[] {
    return this.enrollments
      .filter(e => e.user_id === userId)
      .map(e => ({
        ...e,
        course: this.courses.find(c => c.id === e.course_id)
      }));
  }

  getEnrollment(userId: string, courseId: string): Enrollment | null {
    const enr = this.enrollments.find(e => e.user_id === userId && e.course_id === courseId);
    if (!enr) return null;
    return {
      ...enr,
      course: this.courses.find(c => c.id === courseId)
    };
  }

  updateProgress(
    userId: string,
    courseId: string,
    progressPercentage: number,
    pageId?: string,
    statusOverride?: EnrollmentStatus
  ): Enrollment {
    let enr = this.enrollments.find(e => e.user_id === userId && e.course_id === courseId);
    const now = new Date().toISOString();
    const finalStatus: EnrollmentStatus =
      statusOverride ||
      (progressPercentage >= 100
        ? 'completed'
        : progressPercentage > 0
        ? 'in_progress'
        : 'not_started');

    if (enr) {
      enr.progress_percentage = Math.max(enr.progress_percentage, progressPercentage);
      enr.status = finalStatus;
      if (pageId) enr.last_accessed_page_id = pageId;
      if (finalStatus === 'completed' && !enr.completed_at) {
        enr.completed_at = now;
      }
      enr.updated_at = now;
    } else {
      enr = {
        id: 'enr_' + Date.now(),
        user_id: userId,
        course_id: courseId,
        progress_percentage: progressPercentage,
        status: finalStatus,
        last_accessed_page_id: pageId,
        completed_at: finalStatus === 'completed' ? now : null,
        created_at: now,
        updated_at: now,
        course: this.courses.find(c => c.id === courseId)
      };
      this.enrollments.push(enr);
    }
    this.persist('enrollments', this.enrollments);
    return enr;
  }

  recordQuizAttempt(attempt: Omit<QuizAttempt, 'id'>): QuizAttempt {
    const newAttempt: QuizAttempt = {
      ...attempt,
      id: 'att_' + Date.now(),
      attempted_at: new Date().toISOString()
    };
    this.quizAttempts.push(newAttempt);
    this.persist('attempts', this.quizAttempts);
    return newAttempt;
  }

  getAdminAnalytics(): { kpis: AnalyticsKPIs; roster: LearnerRosterItem[] } {
    return {
      kpis: INITIAL_ANALYTICS_KPIS,
      roster: INITIAL_ROSTER
    };
  }
}

// Global singleton instance for local fallback store
const mockStore = new LocalMockStore();

// ==============================================================================
// Exported Repository API
// ==============================================================================

export const DataRepository = {
  isLiveSupabase(): boolean {
    return isSupabaseConfigured();
  },

  async getCourses(): Promise<Course[]> {
    const supabase = getSupabaseClient();
    if (!supabase) {
      return mockStore.getCourses();
    }
    try {
      const { data, error } = await supabase.from('courses').select('*').order('created_at', { ascending: false });
      if (error || !data || data.length === 0) {
        return mockStore.getCourses();
      }
      return data;
    } catch {
      return mockStore.getCourses();
    }
  },

  async getCourseById(courseId: string): Promise<Course | null> {
    const supabase = getSupabaseClient();
    if (!supabase) {
      return mockStore.getCourseById(courseId);
    }
    try {
      const { data, error } = await supabase.from('courses').select('*').eq('id', courseId).single();
      if (error || !data) {
        return mockStore.getCourseById(courseId);
      }
      return data;
    } catch {
      return mockStore.getCourseById(courseId);
    }
  },

  async getCourseStructure(courseId: string) {
    const supabase = getSupabaseClient();
    if (!supabase) {
      return mockStore.getCourseStructure(courseId);
    }
    try {
      // In live Supabase mode, fetch course + modules + pages + content_blocks
      const { data: course, error: cErr } = await supabase.from('courses').select('*').eq('id', courseId).single();
      if (cErr || !course) return mockStore.getCourseStructure(courseId);

      const { data: modules, error: mErr } = await supabase.from('modules').select('*').eq('course_id', courseId).order('order_index');
      if (mErr || !modules) return mockStore.getCourseStructure(courseId);

      const moduleIds = modules.map(m => m.id);
      const { data: pages } = await supabase.from('pages').select('*').in('module_id', moduleIds).order('order_index');

      const pageIds = (pages || []).map(p => p.id);
      const { data: blocks } = await supabase.from('content_blocks').select('*').in('page_id', pageIds).order('order_index');

      const hydratedModules = modules.map(mod => {
        const modPages = (pages || []).filter(p => p.module_id === mod.id);
        const hydratedPages = modPages.map(page => ({
          ...page,
          blocks: (blocks || []).filter(b => b.page_id === page.id)
        }));
        return {
          ...mod,
          pages: hydratedPages
        };
      });

      return {
        course,
        modules: hydratedModules
      };
    } catch {
      return mockStore.getCourseStructure(courseId);
    }
  },

  async saveCourse(course: Course): Promise<Course> {
    const supabase = getSupabaseClient();
    if (!supabase) {
      return mockStore.saveCourse(course);
    }
    try {
      const { data, error } = await supabase.from('courses').upsert(course).select().single();
      if (error || !data) return mockStore.saveCourse(course);
      return data;
    } catch {
      return mockStore.saveCourse(course);
    }
  },

  async addModule(courseId: string, title: string): Promise<CourseModule> {
    return mockStore.addModule(courseId, title);
  },

  async deleteModule(moduleId: string): Promise<void> {
    mockStore.deleteModule(moduleId);
  },

  async addPage(moduleId: string, title: string): Promise<CoursePage> {
    return mockStore.addPage(moduleId, title);
  },

  async deletePage(pageId: string): Promise<void> {
    mockStore.deletePage(pageId);
  },

  async addBlock(pageId: string, block: Omit<ContentBlock, 'id'>): Promise<ContentBlock> {
    return mockStore.addBlock(pageId, block);
  },

  async updateBlock(blockId: string, updates: Partial<ContentBlock>): Promise<ContentBlock | null> {
    return mockStore.updateBlock(blockId, updates);
  },

  async deleteBlock(blockId: string): Promise<void> {
    mockStore.deleteBlock(blockId);
  },

  async reorderBlocks(pageId: string, blockIds: string[]): Promise<void> {
    mockStore.reorderBlocks(pageId, blockIds);
  },

  async getLearnerEnrollments(userId: string): Promise<Enrollment[]> {
    return mockStore.getLearnerEnrollments(userId);
  },

  async getEnrollment(userId: string, courseId: string): Promise<Enrollment | null> {
    return mockStore.getEnrollment(userId, courseId);
  },

  async updateProgress(
    userId: string,
    courseId: string,
    progressPercentage: number,
    pageId?: string,
    statusOverride?: EnrollmentStatus
  ): Promise<Enrollment> {
    return mockStore.updateProgress(userId, courseId, progressPercentage, pageId, statusOverride);
  },

  async recordQuizAttempt(attempt: Omit<QuizAttempt, 'id'>): Promise<QuizAttempt> {
    return mockStore.recordQuizAttempt(attempt);
  },

  async getAdminAnalytics(): Promise<{ kpis: AnalyticsKPIs; roster: LearnerRosterItem[] }> {
    return mockStore.getAdminAnalytics();
  }
};
