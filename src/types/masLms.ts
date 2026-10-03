// ==============================================================================
// M.A.S LMS — Domain Types & Data Contracts
// Clean Enterprise Minimalist Schema
// Developed by M.A.S Cloud Studio
// ==============================================================================

export type UserRole = 'Admin' | 'Instructor' | 'Learner';

export type UserStatus = 'Active' | 'Invited' | 'Suspended';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  team: string;
  avatarUrl: string;
  status: UserStatus;
  joinedDate: string;
}

export interface Team {
  id: string;
  name: string;
  leadName: string;
  leadEmail: string;
  leadAvatar: string;
  memberCount: number;
  description: string;
  assignedTracks: string[];
  completionRate: number;
}

export type LessonType = 'reading' | 'video' | 'quiz';

export interface Lesson {
  id: string;
  courseId: string;
  title: string;
  durationMinutes: number;
  type: LessonType;
  completed?: boolean;
  contentMarkdown?: string;
  videoUrl?: string;
}

export type CourseLevel = 'Beginner' | 'Intermediate' | 'Advanced';

export interface Course {
  id: string;
  title: string;
  category: 'Security' | 'Compliance' | 'Engineering' | 'Leadership' | 'Finance';
  description: string;
  thumbnailUrl: string;
  durationHours: number;
  lessonCount: number;
  enrolledLearnersCount: number;
  progress?: number;
  instructorName: string;
  level: CourseLevel;
  lessons: Lesson[];
  updatedAt: string;
}

export interface ActivityItem {
  id: string;
  type: 'course_completed' | 'user_joined' | 'quiz_passed' | 'certificate_issued' | 'team_created';
  userName: string;
  userAvatar: string;
  targetTitle: string;
  timestamp: string;
}

export interface MessageReply {
  id: string;
  sender: string;
  avatar: string;
  text: string;
  date: string;
}

export interface MessageThread {
  id: string;
  title: string;
  senderName: string;
  senderRole: string;
  senderAvatar: string;
  date: string;
  preview: string;
  content: string;
  category: 'Announcement' | 'System' | 'Compliance' | 'Curriculum';
  unread: boolean;
  replies: MessageReply[];
}

export interface GuidelineSection {
  title: string;
  content: string;
}

export interface Guideline {
  id: string;
  title: string;
  category: 'Security' | 'HR & Conduct' | 'Operations' | 'Engineering SOP';
  lastUpdated: string;
  readTime: string;
  summary: string;
  sections: GuidelineSection[];
}

export interface ReportRosterRow {
  id: string;
  learnerName: string;
  email: string;
  team: string;
  courseTitle: string;
  progress: number;
  status: 'Completed' | 'In Progress' | 'Not Started';
  score: number | null;
  lastActive: string;
}
