// ==============================================================================
// AuraLMS - High Fidelity Seed & Local Mock Repository
// Enables complete visual authoring and interactive learning offline or without Supabase keys
// ==============================================================================

import { Course, CourseModule, CoursePage, ContentBlock, Enrollment, QuizAttempt, UserProfile, LearnerRosterItem, AnalyticsKPIs } from '@/types/lms';

export const INITIAL_PROFILES: UserProfile[] = [
  {
    id: '00000000-0000-0000-0000-000000000001',
    full_name: 'Sarah Jenkins',
    role: 'author',
    avatar_url: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
    department: 'Instructional Design'
  },
  {
    id: '00000000-0000-0000-0000-000000000002',
    full_name: 'Marcus Sterling',
    role: 'admin',
    avatar_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    department: 'Talent & Compliance Ops'
  },
  {
    id: '00000000-0000-0000-0000-000000000003',
    full_name: 'Alex Mercer',
    role: 'learner',
    avatar_url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    department: 'Core Infrastructure'
  },
  {
    id: '00000000-0000-0000-0000-000000000004',
    full_name: 'Priya Sharma',
    role: 'learner',
    avatar_url: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
    department: 'Product Management'
  },
  {
    id: '00000000-0000-0000-0000-000000000005',
    full_name: 'David Chen',
    role: 'learner',
    avatar_url: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    department: 'Enterprise Sales'
  }
];

export const INITIAL_COURSES: Course[] = [
  {
    id: '11111111-1111-1111-1111-111111111111',
    title: 'Cybersecurity Awareness & Incident Response 2026',
    description: 'Master essential protocols for phishing mitigation, credential hygiene, zero-trust perimeter defense, and rapid threat escalation.',
    thumbnail_url: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=800&auto=format&fit=crop&q=80',
    category: 'Information Security',
    estimated_minutes: 35,
    status: 'published',
    created_by: '00000000-0000-0000-0000-000000000001',
    created_at: '2026-01-10T10:00:00Z',
    modules_count: 2,
    total_topics_count: 3
  },
  {
    id: '22222222-2222-2222-2222-222222222222',
    title: 'Enterprise Leadership & High-Performance Coaching',
    description: 'Actionable frameworks for engineering managers and team leads to provide radical candor, quarterly alignment, and psychological safety.',
    thumbnail_url: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=800&auto=format&fit=crop&q=80',
    category: 'Executive Leadership',
    estimated_minutes: 45,
    status: 'published',
    created_by: '00000000-0000-0000-0000-000000000001',
    created_at: '2026-02-01T12:00:00Z',
    modules_count: 3,
    total_topics_count: 5
  },
  {
    id: '33333333-3333-3333-3333-333333333333',
    title: 'Global Data Privacy & AI Governance (GDPR / CCPA)',
    description: 'Regulatory compliance requirements when implementing GenAI pipelines, data residency policies, and customer privacy rights.',
    thumbnail_url: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800&auto=format&fit=crop&q=80',
    category: 'Legal & Regulatory',
    estimated_minutes: 25,
    status: 'published',
    created_by: '00000000-0000-0000-0000-000000000001',
    created_at: '2026-02-15T09:30:00Z',
    modules_count: 2,
    total_topics_count: 4
  }
];

export const INITIAL_MODULES: CourseModule[] = [
  {
    id: 'mod-1',
    course_id: '11111111-1111-1111-1111-111111111111',
    title: 'Module 1: The Modern Threat Landscape',
    description: 'Anatomy of social engineering, spear-phishing, and insider threats.',
    order_index: 0
  },
  {
    id: 'mod-2',
    course_id: '11111111-1111-1111-1111-111111111111',
    title: 'Module 2: Zero-Trust Defense & Incident Protocols',
    description: 'Multi-factor authentication protocols and 15-minute containment SLA.',
    order_index: 1
  }
];

export const INITIAL_PAGES: CoursePage[] = [
  {
    id: 'page-1',
    module_id: 'mod-1',
    title: 'Recognizing Spear-Phishing Vectors',
    order_index: 0
  },
  {
    id: 'page-2',
    module_id: 'mod-1',
    title: 'Credential Vaults & Passkey Hygiene',
    order_index: 1
  },
  {
    id: 'page-3',
    module_id: 'mod-2',
    title: 'Immediate Breach Escalation Workflow',
    order_index: 0
  }
];

export const INITIAL_BLOCKS: ContentBlock[] = [
  // Page 1 Blocks
  {
    id: 'blk-1',
    page_id: 'page-1',
    type: 'rich_text',
    order_index: 0,
    content_json: {
      heading: 'The Anatomy of Modern Social Engineering',
      html: '<p>Cybercriminals no longer simply "hack" software vulnerabilities; they hack human trust. Over <strong>82% of enterprise security incidents in 2025</strong> originated through targeted social engineering and spear-phishing campaigns constructed with synthetic media and generative AI.</p><p>As an employee at our organization, you are the first line of defense. In this module, you will learn to spot urgent spoofed messages, recognize MFA fatigue attacks, and verify internal requests without friction.</p>'
    }
  },
  {
    id: 'blk-2',
    page_id: 'page-1',
    type: 'callout',
    order_index: 1,
    content_json: {
      variant: 'takeaway',
      title: 'Golden Security Principle',
      text: 'The Corporate IT Security Team will NEVER ask you for your one-time passwords (OTP), hardware passkey codes, or request you to approve an unexpected Okta push alert via Slack or phone.'
    }
  },
  {
    id: 'blk-3',
    page_id: 'page-1',
    type: 'video',
    order_index: 2,
    content_json: {
      title: 'Deconstructing an Executive Voice Clone Attack',
      url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
      caption: 'Briefing breakdown: How bad actors combine public conference audio with urgent finance requests.'
    }
  },
  {
    id: 'blk-4',
    page_id: 'page-1',
    type: 'accordion',
    order_index: 3,
    content_json: {
      items: [
        {
          id: 'acc-1',
          title: 'Red Flag 1: Manufactured Urgency & Secret Channels',
          content: 'Attackers frequently pressure team members to bypass formal verification channels because "the VP is currently on a confidential flight" or "the acquisition deadline is in 20 minutes". Always follow standard procurement & approval gates.'
        },
        {
          id: 'acc-2',
          title: 'Red Flag 2: Subtle Domain Lookalikes (Typosquatting)',
          content: 'Carefully inspect reply-to headers. Domains such as @corp-global-auth.com or @acme-support.co are designed to spoof legitimate corporate directories.'
        },
        {
          id: 'acc-3',
          title: 'Red Flag 3: Unsolicited MFA Push Notifications',
          content: 'If your authenticator prompts you for a verification code while you are not actively logging in, select "Deny" immediately and report the event to #security-ops.'
        }
      ]
    }
  },
  {
    id: 'blk-5',
    page_id: 'page-1',
    type: 'quiz',
    order_index: 4,
    content_json: {
      question: 'You receive a Slack message from an account using the CTO\'s portrait, stating they are in an urgent board review and instructing you to export production database credentials to their personal Gmail. What is the mandatory protocol?',
      options: [
        'Send the credentials immediately to avoid blocking the board meeting.',
        'Encrypt the file with a temporary password and send via Google Drive.',
        'Refuse, do not send credentials outside audited infrastructure, and report the message to Security immediately.',
        'Ask the requester to provide their employee badge ID before emailing.'
      ],
      correctOptionIndex: 2,
      explanation: 'Internal credentials and customer data must never be shared across unverified or personal channels, regardless of stated rank or apparent authority.'
    }
  },

  // Page 2 Blocks
  {
    id: 'blk-6',
    page_id: 'page-2',
    type: 'rich_text',
    order_index: 0,
    content_json: {
      heading: 'Hardware Passkeys & WebAuthn Defense',
      html: '<p>Traditional passwords remain susceptible to phishing proxy servers (Adversary-in-the-Middle). <strong>FIDO2 and WebAuthn hardware tokens</strong> mathematically isolate authentication tokens to the registered domain origin, rendering credential theft impossible.</p>'
    }
  },
  {
    id: 'blk-7',
    page_id: 'page-2',
    type: 'image',
    order_index: 1,
    content_json: {
      url: 'https://images.unsplash.com/photo-1614064641938-3bbee52942c7?w=1000&auto=format&fit=crop&q=80',
      alt: 'Hardware security key cryptographic exchange diagram',
      caption: 'Cryptographic security keys sign auth challenges locally on-chip, preventing reverse-proxy interception.'
    }
  },
  {
    id: 'blk-8',
    page_id: 'page-2',
    type: 'callout',
    order_index: 2,
    content_json: {
      variant: 'tip',
      title: 'IT Helpdesk Best Practice',
      text: 'Every team member is provisioned two physical keys. Register your backup key in the corporate identity portal and keep it secured in your home office safe.'
    }
  },

  // Page 3 Blocks
  {
    id: 'blk-9',
    page_id: 'page-3',
    type: 'rich_text',
    order_index: 0,
    content_json: {
      heading: '15-Minute Incident Containment Protocol',
      html: '<p>If you suspect you have clicked a malicious link or entered credentials on an unauthorized page, <strong>speed of reporting is critical</strong>. You will not face disciplinary consequences for reporting accidental clicks promptly.</p>'
    }
  },
  {
    id: 'blk-10',
    page_id: 'page-3',
    type: 'callout',
    order_index: 1,
    content_json: {
      variant: 'warning',
      title: 'Immediate Emergency Action',
      text: 'Lock your workstation (Win+L / Cmd+Ctrl+Q), disconnect from VPN, and dial the 24/7 Security Operations Hotline at ext. 4357 (HELP).'
    }
  },
  {
    id: 'blk-11',
    page_id: 'page-3',
    type: 'quiz',
    order_index: 2,
    content_json: {
      question: 'Which of the following describes the company policy regarding accidentally clicking a suspicious link?',
      options: [
        'Attempt to scan and repair the laptop personally using third-party antivirus software.',
        'Wait 24 hours to observe whether unusual system behavior occurs.',
        'Immediately report the incident to IT Security — fast disclosure ensures rapid containment with zero blame.',
        'Delete the email and restart the workstation.'
      ],
      correctOptionIndex: 2,
      explanation: 'Our blameless security culture prioritizes immediate escalation so network defenders can revoke sessions before lateral movement occurs.'
    }
  }
];

export const INITIAL_ENROLLMENTS: Enrollment[] = [
  {
    id: 'enr-1',
    user_id: '00000000-0000-0000-0000-000000000003', // Alex Mercer
    course_id: '11111111-1111-1111-1111-111111111111',
    progress_percentage: 66,
    status: 'in_progress',
    last_accessed_page_id: 'page-2',
    completed_at: null,
    created_at: '2026-02-10T08:00:00Z',
    course: INITIAL_COURSES[0],
    learner: INITIAL_PROFILES[2]
  },
  {
    id: 'enr-2',
    user_id: '00000000-0000-0000-0000-000000000003', // Alex Mercer
    course_id: '22222222-2222-2222-2222-222222222222',
    progress_percentage: 100,
    status: 'completed',
    last_accessed_page_id: undefined,
    completed_at: '2026-02-28T14:20:00Z',
    created_at: '2026-02-05T09:00:00Z',
    course: INITIAL_COURSES[1],
    learner: INITIAL_PROFILES[2]
  },
  {
    id: 'enr-3',
    user_id: '00000000-0000-0000-0000-000000000004', // Priya Sharma
    course_id: '11111111-1111-1111-1111-111111111111',
    progress_percentage: 100,
    status: 'completed',
    last_accessed_page_id: undefined,
    completed_at: '2026-02-20T11:15:00Z',
    created_at: '2026-02-01T10:00:00Z',
    course: INITIAL_COURSES[0],
    learner: INITIAL_PROFILES[3]
  },
  {
    id: 'enr-4',
    user_id: '00000000-0000-0000-0000-000000000004', // Priya Sharma
    course_id: '33333333-3333-3333-3333-333333333333',
    progress_percentage: 40,
    status: 'in_progress',
    last_accessed_page_id: undefined,
    completed_at: null,
    created_at: '2026-02-22T15:30:00Z',
    course: INITIAL_COURSES[2],
    learner: INITIAL_PROFILES[3]
  },
  {
    id: 'enr-5',
    user_id: '00000000-0000-0000-0000-000000000005', // David Chen
    course_id: '11111111-1111-1111-1111-111111111111',
    progress_percentage: 0,
    status: 'not_started',
    last_accessed_page_id: undefined,
    completed_at: null,
    created_at: '2026-03-01T08:00:00Z',
    course: INITIAL_COURSES[0],
    learner: INITIAL_PROFILES[4]
  }
];

export const INITIAL_QUIZ_ATTEMPTS: QuizAttempt[] = [
  {
    id: 'att-1',
    user_id: '00000000-0000-0000-0000-000000000003',
    block_id: 'blk-5',
    course_id: '11111111-1111-1111-1111-111111111111',
    selected_option: 'Refuse, do not send credentials outside audited infrastructure, and report the message to Security immediately.',
    is_correct: true,
    score: 100,
    attempted_at: '2026-02-12T10:14:00Z'
  },
  {
    id: 'att-2',
    user_id: '00000000-0000-0000-0000-000000000004',
    block_id: 'blk-5',
    course_id: '11111111-1111-1111-1111-111111111111',
    selected_option: 'Refuse, do not send credentials outside audited infrastructure, and report the message to Security immediately.',
    is_correct: true,
    score: 100,
    attempted_at: '2026-02-20T11:05:00Z'
  }
];

export const INITIAL_ANALYTICS_KPIS: AnalyticsKPIs = {
  totalEnrolled: 1420,
  activeLearners: 984,
  averageCompletionRate: 84.6,
  averageQuizScore: 92.4,
  totalCoursesCount: 18,
  publishedCoursesCount: 14
};

export const INITIAL_ROSTER: LearnerRosterItem[] = [
  {
    id: 'r-1',
    userId: '00000000-0000-0000-0000-000000000003',
    learnerName: 'Alex Mercer',
    email: 'alex.mercer@acmecorp.internal',
    department: 'Core Infrastructure',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    courseId: '11111111-1111-1111-1111-111111111111',
    courseTitle: 'Cybersecurity Awareness 2026',
    progressPercentage: 66,
    status: 'in_progress',
    quizScore: 100,
    lastActive: '20 minutes ago'
  },
  {
    id: 'r-2',
    userId: '00000000-0000-0000-0000-000000000004',
    learnerName: 'Priya Sharma',
    email: 'priya.sharma@acmecorp.internal',
    department: 'Product Management',
    avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
    courseId: '11111111-1111-1111-1111-111111111111',
    courseTitle: 'Cybersecurity Awareness 2026',
    progressPercentage: 100,
    status: 'completed',
    quizScore: 100,
    lastActive: 'Yesterday'
  },
  {
    id: 'r-3',
    userId: '00000000-0000-0000-0000-000000000005',
    learnerName: 'David Chen',
    email: 'david.chen@acmecorp.internal',
    department: 'Enterprise Sales',
    avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    courseId: '11111111-1111-1111-1111-111111111111',
    courseTitle: 'Cybersecurity Awareness 2026',
    progressPercentage: 0,
    status: 'not_started',
    quizScore: null,
    lastActive: '3 days ago'
  },
  {
    id: 'r-4',
    userId: '00000000-0000-0000-0000-000000000006',
    learnerName: 'Elena Rostova',
    email: 'elena.rostova@acmecorp.internal',
    department: 'People Operations',
    avatarUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80',
    courseId: '22222222-2222-2222-2222-222222222222',
    courseTitle: 'Enterprise Leadership & Coaching',
    progressPercentage: 100,
    status: 'completed',
    quizScore: 94,
    lastActive: '1 hour ago'
  },
  {
    id: 'r-5',
    userId: '00000000-0000-0000-0000-000000000007',
    learnerName: 'Jonathan Hayes',
    email: 'jonathan.hayes@acmecorp.internal',
    department: 'Data Platform',
    avatarUrl: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&auto=format&fit=crop&q=80',
    courseId: '33333333-3333-3333-3333-333333333333',
    courseTitle: 'Global Data Privacy & AI Governance',
    progressPercentage: 45,
    status: 'in_progress',
    quizScore: 80,
    lastActive: '5 hours ago'
  }
];
