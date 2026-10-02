// ==============================================================================
// AuraLMS - Domain Types & Schema Interfaces
// Combining Gomo Learning authoring blocks & SAP Litmos tracking records
// ==============================================================================

export type UserRole = 'admin' | 'author' | 'learner';

export interface UserProfile {
  id: string;
  full_name: string;
  role: UserRole;
  avatar_url?: string;
  department?: string;
  created_at?: string;
  updated_at?: string;
}

export type CourseStatus = 'draft' | 'published';

export interface Course {
  id: string;
  title: string;
  description: string;
  thumbnail_url: string;
  category: string;
  estimated_minutes: number;
  status: CourseStatus;
  created_by?: string;
  created_at?: string;
  updated_at?: string;
  // Computed / joined fields
  modules_count?: number;
  total_topics_count?: number;
}

export interface CourseModule {
  id: string;
  course_id: string;
  title: string;
  description?: string;
  order_index: number;
  created_at?: string;
  pages?: CoursePage[];
}

export interface CoursePage {
  id: string;
  module_id: string;
  title: string;
  order_index: number;
  created_at?: string;
  blocks?: ContentBlock[];
}

// ------------------------------------------------------------------------------
// Gomo-Style Content Blocks
// ------------------------------------------------------------------------------
export type BlockType = 
  | 'rich_text'
  | 'callout'
  | 'video'
  | 'image'
  | 'accordion'
  | 'quiz';

export interface RichTextBlockContent {
  heading?: string;
  html: string;
}

export interface CalloutBlockContent {
  variant: 'takeaway' | 'tip' | 'warning' | 'info';
  title: string;
  text: string;
}

export interface VideoBlockContent {
  title?: string;
  url: string;
  caption?: string;
}

export interface ImageBlockContent {
  url: string;
  alt: string;
  caption?: string;
}

export interface AccordionItem {
  id: string;
  title: string;
  content: string;
}

export interface AccordionBlockContent {
  items: AccordionItem[];
}

export interface QuizBlockContent {
  question: string;
  options: string[];
  correctOptionIndex: number;
  explanation: string;
  points?: number;
}

export type BlockContentJson =
  | RichTextBlockContent
  | CalloutBlockContent
  | VideoBlockContent
  | ImageBlockContent
  | AccordionBlockContent
  | QuizBlockContent;

export interface ContentBlock {
  id: string;
  page_id: string;
  type: BlockType;
  content_json: BlockContentJson;
  order_index: number;
  created_at?: string;
}

// ------------------------------------------------------------------------------
// Litmos-Style Tracking & Enrollments
// ------------------------------------------------------------------------------
export type EnrollmentStatus = 'not_started' | 'in_progress' | 'completed';

export interface Enrollment {
  id: string;
  user_id: string;
  course_id: string;
  progress_percentage: number;
  status: EnrollmentStatus;
  last_accessed_page_id?: string;
  completed_at?: string | null;
  created_at?: string;
  updated_at?: string;
  // Hydrated fields
  course?: Course;
  learner?: UserProfile;
}

export interface QuizAttempt {
  id: string;
  user_id: string;
  block_id: string;
  course_id: string;
  selected_option: string;
  is_correct: boolean;
  score: number;
  attempted_at?: string;
}

// ------------------------------------------------------------------------------
// Admin & Analytics Dashboards
// ------------------------------------------------------------------------------
export interface AnalyticsKPIs {
  totalEnrolled: number;
  activeLearners: number;
  averageCompletionRate: number;
  averageQuizScore: number;
  totalCoursesCount: number;
  publishedCoursesCount: number;
}

export interface LearnerRosterItem {
  id: string;
  userId: string;
  learnerName: string;
  email: string;
  department: string;
  avatarUrl: string;
  courseId: string;
  courseTitle: string;
  progressPercentage: number;
  status: EnrollmentStatus;
  quizScore: number | null;
  lastActive: string;
}

export type ViewportMode = 'desktop' | 'tablet' | 'mobile';
