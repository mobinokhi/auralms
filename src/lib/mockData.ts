// ==============================================================================
// M.A.S LMS — Unified Clean Mock & Persistent Data Repository
// Developed by M.A.S Cloud Studio
// Inspired by Stripe, Linear, and Notion enterprise architectures
// ==============================================================================

import {
  User,
  Team,
  Course,
  Lesson,
  LessonType,
  ActivityItem,
  MessageThread,
  Guideline,
  ReportRosterRow
} from '@/types/masLms';

// ------------------------------------------------------------------------------
// 1. Initial 8 Users (Diverse Enterprise Personas)
// ------------------------------------------------------------------------------
export const INITIAL_USERS: User[] = [
  {
    id: 'usr-1',
    name: 'Alex Morgan',
    email: 'alex.morgan@mascloud.studio',
    role: 'Admin',
    team: 'IT Support',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=250&auto=format&fit=crop',
    status: 'Active',
    joinedDate: 'Jan 15, 2025'
  },
  {
    id: 'usr-2',
    name: 'Dr. Sophia Patel',
    email: 'sophia.patel@mascloud.studio',
    role: 'Instructor',
    team: 'Operations',
    avatarUrl: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=250&auto=format&fit=crop',
    status: 'Active',
    joinedDate: 'Feb 01, 2025'
  },
  {
    id: 'usr-3',
    name: 'Marcus Vance',
    email: 'marcus.vance@mascloud.studio',
    role: 'Instructor',
    team: 'Operations',
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=250&auto=format&fit=crop',
    status: 'Active',
    joinedDate: 'Mar 10, 2025'
  },
  {
    id: 'usr-4',
    name: 'Elena Rostova',
    email: 'elena.rostova@mascloud.studio',
    role: 'Learner',
    team: 'Finance & Advisory',
    avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=250&auto=format&fit=crop',
    status: 'Active',
    joinedDate: 'Apr 04, 2025'
  },
  {
    id: 'usr-5',
    name: 'David Chen',
    email: 'david.chen@mascloud.studio',
    role: 'Learner',
    team: 'Operations',
    avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=250&auto=format&fit=crop',
    status: 'Active',
    joinedDate: 'May 18, 2025'
  },
  {
    id: 'usr-6',
    name: 'Sarah Jenkins',
    email: 'sarah.jenkins@mascloud.studio',
    role: 'Learner',
    team: 'IT Support',
    avatarUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=250&auto=format&fit=crop',
    status: 'Active',
    joinedDate: 'Jun 22, 2025'
  },
  {
    id: 'usr-7',
    name: 'Jordan Miller',
    email: 'jordan.miller@mascloud.studio',
    role: 'Learner',
    team: 'Operations',
    avatarUrl: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?q=80&w=250&auto=format&fit=crop',
    status: 'Invited',
    joinedDate: 'Sep 01, 2025'
  },
  {
    id: 'usr-8',
    name: 'Liam Gallagher',
    email: 'liam.gallagher@mascloud.studio',
    role: 'Learner',
    team: 'IT Support',
    avatarUrl: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?q=80&w=250&auto=format&fit=crop',
    status: 'Active',
    joinedDate: 'Sep 12, 2025'
  },
  {
    id: 'usr-9',
    name: 'Hasan Al Shahriar',
    email: 'hasan@mascloud.studio',
    role: 'Instructor',
    team: 'Google Firebase Team',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=250&auto=format&fit=crop',
    status: 'Active',
    joinedDate: 'Oct 01, 2026'
  }
];

// ------------------------------------------------------------------------------
// 2. Initial Teams (Departments & Cohorts)
// ------------------------------------------------------------------------------
export const INITIAL_TEAMS: Team[] = [
  {
    id: 'team-firebase',
    name: 'Google Firebase Team',
    leadName: 'Hasan Al Shahriar',
    leadEmail: 'hasan@mascloud.studio',
    leadAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=250&auto=format&fit=crop',
    memberCount: 1,
    description: 'Enterprise operational cohort.',
    assignedTracks: [
      'Security & Compliance',
      'Technical Architecture'
    ],
    completionRate: 0
  },
  {
    id: 'team-ops',
    name: 'Operations',
    leadName: 'Marcus Vance',
    leadEmail: 'marcus.vance@mascloud.studio',
    leadAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=250&auto=format&fit=crop',
    memberCount: 24,
    description: 'Field execution, workplace safety, supply chain logistics, and business continuity SOPs.',
    assignedTracks: [
      'Enterprise Cybersecurity & Generative AI Hygiene',
      'Executive Crisis Management & Incident Response',
      'Modern DevOps & Edge Observability'
    ],
    completionRate: 92
  },
  {
    id: 'team-fin',
    name: 'Finance & Advisory',
    leadName: 'Elena Rostova',
    leadEmail: 'elena.rostova@mascloud.studio',
    leadAvatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=250&auto=format&fit=crop',
    memberCount: 18,
    description: 'Statutory compliance, anti-fraud governance, AML audits, and financial reporting verification.',
    assignedTracks: [
      'Financial Controls, Anti-Fraud & Regulatory SOPs',
      'SOC2 Type II & Data Privacy Compliance (2026)'
    ],
    completionRate: 85
  },
  {
    id: 'team-it',
    name: 'IT Support',
    leadName: 'Alex Morgan',
    leadEmail: 'alex.morgan@mascloud.studio',
    leadAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=250&auto=format&fit=crop',
    memberCount: 15,
    description: 'Infrastructure hardening, zero-trust IAM policies, end-user service desk, and vulnerability management.',
    assignedTracks: [
      'Enterprise Cybersecurity & Generative AI Hygiene',
      'Zero-Trust Cloud Architecture & IAM Hardening',
      'Modern DevOps, CI/CD Pipeline & Edge Observability'
    ],
    completionRate: 96
  }
];

// ------------------------------------------------------------------------------
// 3. Initial 6 Pre-Built Courses with rich interactive lessons
// ------------------------------------------------------------------------------
export const INITIAL_COURSES: Course[] = [
  {
    id: 'crs-firebase',
    title: 'Google Firebase Course',
    category: 'Engineering',
    description: 'Master Cloud Firestore, Firebase Authentication, Cloud Storage, and Security Rules for scalable cloud infrastructure.',
    thumbnailUrl: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?q=80&w=800&auto=format&fit=crop',
    durationHours: 2.0,
    lessonCount: 2,
    enrolledLearnersCount: 1,
    progress: 0,
    instructorName: 'Hasan Al Shahnoor',
    level: 'Beginner',
    updatedAt: 'Just now',
    lessons: [
      {
        id: 'lsn-fb-1',
        courseId: 'crs-firebase',
        title: 'Module 1: Introduction to Google Firebase & Project Setup',
        durationMinutes: 45,
        type: 'reading',
        completed: false,
        contentMarkdown: `### 1. Introduction to Google Firebase Ecosystem\n\nGoogle Firebase provides managed backend infrastructure for modern enterprise web and mobile applications, eliminating boilerplate server provisioning.\n\n#### Key Firebase Core Services:\n- **Cloud Firestore:** Scalable, flexible NoSQL document database with realtime syncing.\n- **Firebase Authentication:** Turnkey multi-factor and social SSO identity.\n- **Cloud Functions:** Serverless compute that automatically triggers on database writes, auth events, or HTTP webhooks.\n- **Firebase Hosting & Storage:** Global CDN edge asset delivery.\n\n> **Core Rule:** Always configure separate Firebase environments for dev, staging, and production to isolate client data.`
      },
      {
        id: 'lsn-fb-2',
        courseId: 'crs-firebase',
        title: 'Module 2: Cloud Firestore Database Architecture & Security Rules',
        durationMinutes: 75,
        type: 'video',
        completed: false,
        videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
        contentMarkdown: `### Cloud Firestore Security Rules\n\nSecurity rules evaluate request tokens against document properties to enforce least privilege access. Never leave rules in test mode in production.`
      }
    ]
  },
  {
    id: 'crs-1',
    title: 'Enterprise Cybersecurity & Generative AI Hygiene',
    category: 'Security',
    description: 'Defend organizational assets against prompt injection, spear-phishing, MFA push fatigue, and sensitive corporate data leakage in public LLM workflows.',
    thumbnailUrl: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=800&auto=format&fit=crop',
    durationHours: 3.5,
    lessonCount: 4,
    enrolledLearnersCount: 48,
    progress: 88,
    instructorName: 'Dr. Sophia Patel',
    level: 'Intermediate',
    updatedAt: '2 days ago',
    lessons: [
      {
        id: 'lsn-1-1',
        courseId: 'crs-1',
        title: 'Modern Threat Landscape: AI-Assisted Spear Phishing',
        durationMinutes: 18,
        type: 'reading',
        completed: true,
        contentMarkdown: `### 1. The Anatomy of Next-Generation Social Engineering\n\nCybercriminals no longer simply attack machines; they compromise human trust through AI-tailored impersonation campaigns.\n\n#### Key Threat Vectors:\n- **Deepfake Voice Cloning:** Fraudulent executive transfers initiated via simulated voice calls over Teams or phone.\n- **Grammar & Tone Spoofing:** Generative AI models synthesize executive writing quirks to impersonate C-level urgency.\n- **Credential Harvesting Sites:** Automated replica login pages for corporate SSO portals.\n\n> **Core Rule:** Never authorize an out-of-band wire transfer or sensitive data export based purely on an email or chat notification.`
      },
      {
        id: 'lsn-1-2',
        courseId: 'crs-1',
        title: 'Mitigating MFA Push Fatigue & Session Hijacking',
        durationMinutes: 24,
        type: 'video',
        completed: true,
        videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
        contentMarkdown: `### MFA Push Bombing Defence\n\nAttackers flood mobile devices with dozen of push notifications at 2:00 AM hoping the victim will approve to silence the noise.\n\n1. Enable Number Matching on all authenticator apps.\n2. Disallow SMS-based OTP fallbacks for privileged accounts.\n3. Report repeated unsolicited prompts to Security Operations immediately.`
      },
      {
        id: 'lsn-1-3',
        courseId: 'crs-1',
        title: 'Generative AI Usage & Safe Sanitization Guidelines',
        durationMinutes: 20,
        type: 'reading',
        completed: true,
        contentMarkdown: `### Enterprise LLM Rules\n\n- **Zero PII/Secret Ingestion:** Never input API keys, client identifiers, customer health records, or unreleased financial earnings into public AI tools.\n- **Approved Workspaces:** Use company-governed enterprise instances with zero-retention data policies.\n- **Verification:** Always human-review generated source code for subtle algorithmic bugs or deprecated libraries.`
      },
      {
        id: 'lsn-1-4',
        courseId: 'crs-1',
        title: 'Retention Knowledge Check & Scenario Simulation',
        durationMinutes: 15,
        type: 'quiz',
        completed: false,
        contentMarkdown: `### Interactive Knowledge Check\n\nTest your readiness against realistic executive impersonation scenarios.`
      }
    ]
  },
  {
    id: 'crs-2',
    title: 'SOC2 Type II & Data Privacy Compliance (2026)',
    category: 'Compliance',
    description: 'Master the Trust Services Criteria (Security, Availability, Confidentiality, and Processing Integrity) required for annual enterprise cloud certifications.',
    thumbnailUrl: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=800&auto=format&fit=crop',
    durationHours: 4.0,
    lessonCount: 4,
    enrolledLearnersCount: 36,
    progress: 65,
    instructorName: 'Alex Morgan',
    level: 'Advanced',
    updatedAt: '1 week ago',
    lessons: [
      {
        id: 'lsn-2-1',
        courseId: 'crs-2',
        title: 'Understanding the 5 Trust Services Criteria',
        durationMinutes: 25,
        type: 'reading',
        completed: true,
        contentMarkdown: `### The Core Pillars of SOC2 Type II\n\nSOC2 compliance is an audited attestation of your company's operational control environment over a minimum 6-month observation period.`
      },
      {
        id: 'lsn-2-2',
        courseId: 'crs-2',
        title: 'Access Control, Least Privilege & Quarterly User Audits',
        durationMinutes: 30,
        type: 'reading',
        completed: true,
        contentMarkdown: `### Role-Based Access Control (RBAC)\n\nEvery employee must only hold the minimum permissions strictly required to perform their direct duties.`
      },
      {
        id: 'lsn-2-3',
        courseId: 'crs-2',
        title: 'Automated Audit Logging & Evidence Collection',
        durationMinutes: 20,
        type: 'video',
        completed: false,
        videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ'
      },
      {
        id: 'lsn-2-4',
        courseId: 'crs-2',
        title: 'Compliance Exam & Attestation Signoff',
        durationMinutes: 15,
        type: 'quiz',
        completed: false
      }
    ]
  },
  {
    id: 'crs-3',
    title: 'Zero-Trust Cloud Architecture & IAM Hardening',
    category: 'Engineering',
    description: 'Implement perimeterless security principles: explicit verification, least privileged access, and assumption of breach across multi-cloud environments.',
    thumbnailUrl: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?q=80&w=800&auto=format&fit=crop',
    durationHours: 5.0,
    lessonCount: 3,
    enrolledLearnersCount: 29,
    progress: 30,
    instructorName: 'Alex Morgan',
    level: 'Advanced',
    updatedAt: '3 days ago',
    lessons: [
      {
        id: 'lsn-3-1',
        courseId: 'crs-3',
        title: 'The Shift from Perimeter VPNs to Identity-Aware Proxies',
        durationMinutes: 25,
        type: 'reading',
        completed: true,
        contentMarkdown: `### Never Trust, Always Verify\n\nTraditional firewalls assume internal network traffic is benign. Zero-trust treats internal requests with the same scrutiny as public internet requests.`
      },
      {
        id: 'lsn-3-2',
        courseId: 'crs-3',
        title: 'Mutual TLS (mTLS) & Service Mesh Segmentation',
        durationMinutes: 35,
        type: 'video',
        completed: false,
        videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ'
      },
      {
        id: 'lsn-3-3',
        courseId: 'crs-3',
        title: 'IAM Policy Auditing & Privileged Access Workflows',
        durationMinutes: 20,
        type: 'quiz',
        completed: false
      }
    ]
  },
  {
    id: 'crs-4',
    title: 'Executive Crisis Management & Incident Response',
    category: 'Leadership',
    description: 'Protocol execution, legal liability management, external communication cadence, and post-mortem review during high-severity enterprise incidents.',
    thumbnailUrl: 'https://images.unsplash.com/photo-1521737711867-e3b97375f902?q=80&w=800&auto=format&fit=crop',
    durationHours: 2.5,
    lessonCount: 3,
    enrolledLearnersCount: 42,
    progress: 100,
    instructorName: 'Marcus Vance',
    level: 'Beginner',
    updatedAt: 'Aug 2025',
    lessons: [
      {
        id: 'lsn-4-1',
        courseId: 'crs-4',
        title: 'War Room Formation & Incident Commander Roles',
        durationMinutes: 20,
        type: 'reading',
        completed: true,
        contentMarkdown: `### The Single Point of Command\n\nWhen a Severity-1 event occurs, clear hierarchy prevents confusion between engineering, legal, communications, and executive leadership.`
      },
      {
        id: 'lsn-4-2',
        courseId: 'crs-4',
        title: 'Stakeholder Communications & Regulatory Timelines',
        durationMinutes: 25,
        type: 'reading',
        completed: true,
        contentMarkdown: `### Disclosure Windows\n\nReview mandatory 72-hour regulatory notification windows under GDPR, SEC regulations, and client SLAs.`
      },
      {
        id: 'lsn-4-3',
        courseId: 'crs-4',
        title: 'Blameless Post-Mortem & Preventative Control Architecture',
        durationMinutes: 15,
        type: 'reading',
        completed: true,
        contentMarkdown: `Focus on systemic flaws and automation failure points rather than human error.`
      }
    ]
  },
  {
    id: 'crs-5',
    title: 'Financial Controls, Anti-Fraud & Regulatory SOPs',
    category: 'Finance',
    description: 'Rigorous standard operating procedures for dual-authorization disbursements, ledger audits, anti-money laundering (AML), and foreign exchange risk control.',
    thumbnailUrl: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?q=80&w=800&auto=format&fit=crop',
    durationHours: 3.0,
    lessonCount: 3,
    enrolledLearnersCount: 18,
    progress: 0,
    instructorName: 'Elena Rostova',
    level: 'Intermediate',
    updatedAt: '2 weeks ago',
    lessons: [
      {
        id: 'lsn-5-1',
        courseId: 'crs-5',
        title: 'Segregation of Financial Duties & Dual Authorization',
        durationMinutes: 20,
        type: 'reading',
        completed: false,
        contentMarkdown: `No single individual should have the capability to initiate, approve, and execute disbursements over $10,000.`
      },
      {
        id: 'lsn-5-2',
        courseId: 'crs-5',
        title: 'Red Flags for Synthetic Identity Fraud & Shell Entities',
        durationMinutes: 30,
        type: 'reading',
        completed: false,
        contentMarkdown: `Detecting anomalous invoice patterns, mismatched tax IDs, and offshore proxy banks.`
      },
      {
        id: 'lsn-5-3',
        courseId: 'crs-5',
        title: 'Quarterly Audit Preparation & Ledger Integrity Check',
        durationMinutes: 20,
        type: 'quiz',
        completed: false
      }
    ]
  },
  {
    id: 'crs-6',
    title: 'Modern DevOps, CI/CD Pipeline & Edge Observability',
    category: 'Engineering',
    description: 'Build automated delivery pipelines with zero-downtime blue/green rollouts, synthetic transaction tracing, and OpenTelemetry instrumentation.',
    thumbnailUrl: 'https://images.unsplash.com/photo-1618401471353-b98afee0b2eb?q=80&w=800&auto=format&fit=crop',
    durationHours: 4.5,
    lessonCount: 3,
    enrolledLearnersCount: 31,
    progress: 15,
    instructorName: 'Alex Morgan',
    level: 'Advanced',
    updatedAt: 'Yesterday',
    lessons: [
      {
        id: 'lsn-6-1',
        courseId: 'crs-6',
        title: 'Declarative GitOps & Automated Canary Rollouts',
        durationMinutes: 25,
        type: 'reading',
        completed: true,
        contentMarkdown: `Treat infrastructure code as the ground truth. Progressively route 5% -> 25% -> 100% of user traffic while monitoring Core Web Vitals and error rates.`
      },
      {
        id: 'lsn-6-2',
        courseId: 'crs-6',
        title: 'Distributed Tracing with OpenTelemetry at the Edge',
        durationMinutes: 30,
        type: 'video',
        completed: false,
        videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ'
      },
      {
        id: 'lsn-6-3',
        courseId: 'crs-6',
        title: 'Pipeline Security: Supply Chain Hardening & SBOM',
        durationMinutes: 20,
        type: 'quiz',
        completed: false
      }
    ]
  }
];

// ------------------------------------------------------------------------------
// 4. Initial Activity Feed Items
// ------------------------------------------------------------------------------
export const INITIAL_ACTIVITIES: ActivityItem[] = [
  {
    id: 'act-1',
    type: 'course_completed',
    userName: 'Marcus Vance',
    userAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=250&auto=format&fit=crop',
    targetTitle: 'Executive Crisis Management & Incident Response',
    timestamp: '25 minutes ago'
  },
  {
    id: 'act-2',
    type: 'quiz_passed',
    userName: 'Sarah Jenkins',
    userAvatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=250&auto=format&fit=crop',
    targetTitle: 'Cybersecurity Hygiene 2026 (Score: 100%)',
    timestamp: '1 hour ago'
  },
  {
    id: 'act-3',
    type: 'user_joined',
    userName: 'Liam Gallagher',
    userAvatar: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?q=80&w=250&auto=format&fit=crop',
    targetTitle: 'IT Support Department',
    timestamp: '3 hours ago'
  },
  {
    id: 'act-4',
    type: 'certificate_issued',
    userName: 'David Chen',
    userAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=250&auto=format&fit=crop',
    targetTitle: 'SOC2 Type II Annual Recertification',
    timestamp: '5 hours ago'
  },
  {
    id: 'act-5',
    type: 'team_created',
    userName: 'Alex Morgan',
    userAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=250&auto=format&fit=crop',
    targetTitle: 'Cloud Security Cohort 2026',
    timestamp: 'Yesterday'
  }
];

// ------------------------------------------------------------------------------
// 5. Initial Messages / Announcements
// ------------------------------------------------------------------------------
export const INITIAL_MESSAGES: MessageThread[] = [
  {
    id: 'msg-1',
    title: 'Mandatory Q4 Cybersecurity & Social Engineering Window',
    senderName: 'Alex Morgan',
    senderRole: 'Security Administrator',
    senderAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=250&auto=format&fit=crop',
    date: 'Oct 02, 2026',
    category: 'Compliance',
    unread: false,
    preview: 'All employees in Operations, IT, and Finance must complete the 2026 AI Spear Phishing module by October 31st.',
    content: `Dear Team,\n\nOur annual Q4 compliance recertification window is now officially open. In accordance with our SOC2 Type II trust criteria and cyber liability insurance requirements, all workforce members must complete the newly updated module:\n\n**"Enterprise Cybersecurity & Generative AI Hygiene"**\n\nKey areas covered in this year's refresher:\n1. Deepfake voice synthesis verification\n2. MFA push fatigue notification protocols\n3. Data sanitization when utilizing corporate AI assistants\n\nPlease finish your assessment prior to **October 31, 2026** to ensure zero interruption to system access privileges. Reach out to the IT Support desk if you encounter any module delivery issues.\n\nBest regards,\nAlex Morgan — Security & Compliance Lead`,
    replies: [
      {
        id: 'rep-1',
        sender: 'Dr. Sophia Patel',
        avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=250&auto=format&fit=crop',
        text: 'The Operations team curriculum has been updated with matching practical exercises. Great focus on voice cloning detection.',
        date: 'Oct 02, 2:15 PM'
      },
      {
        id: 'rep-2',
        sender: 'David Chen',
        avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=250&auto=format&fit=crop',
        text: 'Completed the module this morning. The simulated number matching breakdown was very helpful.',
        date: 'Oct 02, 4:40 PM'
      }
    ]
  },
  {
    id: 'msg-2',
    title: 'New Track Published: Zero-Trust Cloud Architecture',
    senderName: 'Dr. Sophia Patel',
    senderRole: 'Lead Technical Instructor',
    senderAvatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=250&auto=format&fit=crop',
    date: 'Sep 28, 2026',
    category: 'Curriculum',
    unread: true,
    preview: 'Designed specifically for Systems Engineers, DevOps, and Platform Architects transitioning away from VPNs.',
    content: `Hello Engineering Cohort,\n\nWe have just published a brand new 5-hour technical training track dedicated to modern perimeterless infrastructure:\n\n**"Zero-Trust Cloud Architecture & IAM Hardening"**\n\nModules include:\n- Identity-Aware Proxies vs legacy VPN bottlenecks\n- Mutual TLS (mTLS) enforcement with Envoy\n- Continuous automated verification of workload credentials\n\nEnrollment is self-service in the Courses tab or automatically assigned to all members of the IT Support team. Feel free to leave questions in the course discussion thread!`,
    replies: [
      {
        id: 'rep-3',
        sender: 'Liam Gallagher',
        avatar: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?q=80&w=250&auto=format&fit=crop',
        text: 'Starting this today. Does lesson 2 cover AWS IAM Identity Center integration as well?',
        date: 'Sep 29, 9:10 AM'
      }
    ]
  },
  {
    id: 'msg-3',
    title: 'SOC2 Type II Annual Recertification Audit Ready',
    senderName: 'Marcus Vance',
    senderRole: 'Head of Business Operations',
    senderAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=250&auto=format&fit=crop',
    date: 'Sep 15, 2026',
    category: 'Announcement',
    unread: false,
    preview: 'Audit logs indicate our overall enterprise training completion rate has hit an all-time high of 88.4%.',
    content: `Team,\n\nExternal auditors have completed their mid-year sampling of our training records and verification logs inside M.A.S LMS. Thanks to everyone's timely completion of statutory compliance requirements, our overall completion rate is currently sitting at **88.4%** across all 3 business cohorts.\n\nKeep up the great momentum!`,
    replies: []
  }
];

// ------------------------------------------------------------------------------
// 6. Initial Institutional Guidelines & SOP Knowledge Base
// ------------------------------------------------------------------------------
export const INITIAL_GUIDELINES: Guideline[] = [
  {
    id: 'gdl-1',
    title: 'Enterprise Clean Desk & Credential Storage Policy',
    category: 'Security',
    lastUpdated: 'Aug 2026',
    readTime: '4 min read',
    summary: 'Standard operating procedures governing workstation locking, physical paper document shredding, and zero plaintext password storage.',
    sections: [
      {
        title: '1. Unattended Workstation Lockout',
        content: 'Workstations must be manually locked whenever stepping away, regardless of duration. Operating system screen lock timers must be enforced at a maximum 5-minute timeout window.'
      },
      {
        title: '2. Physical Document Security',
        content: 'Sensitive client contracts, financial statements, and employee PII must not remain on unattended desks overnight. Use designated locked pedestals or secure cross-cut shredder bins.'
      },
      {
        title: '3. Digital Credential Hygiene',
        content: 'Plaintext storage of passwords or private SSH keys on local disk or sticky notes is strictly prohibited. Use company-managed 1Password or Vault enterprise vaults.'
      }
    ]
  },
  {
    id: 'gdl-2',
    title: 'Generative AI Code Assistant & Intellectual Property Standards',
    category: 'Engineering SOP',
    lastUpdated: 'Sep 2026',
    readTime: '6 min read',
    summary: 'Rules of engagement for utilizing Copilot, Claude, and Gemini in production software development and client advisory deliverables.',
    sections: [
      {
        title: '1. Approved AI Environments',
        content: 'Engineers may only leverage enterprise-licensed generative models where commercial data retention and training on client prompts is explicitly disabled by contract.'
      },
      {
        title: '2. Prohibited Ingestions',
        content: 'Under no circumstances may client proprietary source code, cryptographic private keys, or non-anonymized databases be pasted into web chat interfaces.'
      },
      {
        title: '3. Mandatory Code Attribution',
        content: 'Generated code snippets exceeding 20 contiguous lines must undergo peer review for copyright licensing compatibility (GPL vs Apache/MIT) and security vulnerability scans.'
      }
    ]
  },
  {
    id: 'gdl-3',
    title: 'Phishing Simulation & Incident Escalation SOP',
    category: 'Operations',
    lastUpdated: 'Sep 2026',
    readTime: '3 min read',
    summary: 'Step-by-step reporting guide when encountering suspicious messages, unexpected invoices, or simulated training emails.',
    sections: [
      {
        title: '1. Identification Checklist',
        content: 'Inspect the sender domain name carefully (look for lookalike characters e.g. "rn" instead of "m"). Be suspicious of generic greetings coupled with urgent executive deadlines.'
      },
      {
        title: '2. Reporting in One Click',
        content: 'Click the "Report Phishing" button in your Outlook or Gmail client ribbon. Do not forward the raw email to colleagues or open attached PDFs.'
      },
      {
        title: '3. Accidental Credential Submission',
        content: 'If you entered credentials into an untrusted portal, disconnect network connectivity immediately and contact the Security Operations hotline: +1 (800) 555-M-A-S.'
      }
    ]
  },
  {
    id: 'gdl-4',
    title: 'Code of Business Conduct & Workplace Respect Guidelines',
    category: 'HR & Conduct',
    lastUpdated: 'Jul 2026',
    readTime: '5 min read',
    summary: 'Core ethical standards, anti-harassment policies, whistleblower protections, and professional collaboration expectations.',
    sections: [
      {
        title: '1. Non-Discrimination & Equal Opportunity',
        content: 'M.A.S Cloud Studio commits to fostering an inclusive, high-trust environment free from harassment, bias, or micro-aggressions based on race, gender, background, or identity.'
      },
      {
        title: '2. Conflict of Interest Disclosure',
        content: 'Employees must disclose any external consulting engagements, advisory roles, or financial investments in competing SaaS providers or vendor partners.'
      },
      {
        title: '3. Anonymous Whistleblower Channel',
        content: 'Reports of misconduct or accounting discrepancies can be submitted anonymously through our third-party ethics portal without fear of retaliation.'
      }
    ]
  }
];

// ------------------------------------------------------------------------------
// 7. Initial Executive Report Table Rows
// ------------------------------------------------------------------------------
export const INITIAL_ROSTER_REPORT: ReportRosterRow[] = [
  {
    id: 'rst-1',
    learnerName: 'Alex Morgan',
    email: 'alex.morgan@mascloud.studio',
    team: 'IT Support',
    courseTitle: 'Enterprise Cybersecurity & Generative AI Hygiene',
    progress: 100,
    status: 'Completed',
    score: 98,
    lastActive: '2 hours ago'
  },
  {
    id: 'rst-2',
    learnerName: 'Dr. Sophia Patel',
    email: 'sophia.patel@mascloud.studio',
    team: 'Operations',
    courseTitle: 'SOC2 Type II & Data Privacy Compliance (2026)',
    progress: 100,
    status: 'Completed',
    score: 100,
    lastActive: 'Yesterday'
  },
  {
    id: 'rst-3',
    learnerName: 'Marcus Vance',
    email: 'marcus.vance@mascloud.studio',
    team: 'Operations',
    courseTitle: 'Executive Crisis Management & Incident Response',
    progress: 100,
    status: 'Completed',
    score: 95,
    lastActive: '3 hours ago'
  },
  {
    id: 'rst-4',
    learnerName: 'Elena Rostova',
    email: 'elena.rostova@mascloud.studio',
    team: 'Finance & Advisory',
    courseTitle: 'Financial Controls, Anti-Fraud & Regulatory SOPs',
    progress: 75,
    status: 'In Progress',
    score: 88,
    lastActive: '4 hours ago'
  },
  {
    id: 'rst-5',
    learnerName: 'David Chen',
    email: 'david.chen@mascloud.studio',
    team: 'Operations',
    courseTitle: 'Enterprise Cybersecurity & Generative AI Hygiene',
    progress: 90,
    status: 'In Progress',
    score: 92,
    lastActive: 'Just now'
  },
  {
    id: 'rst-6',
    learnerName: 'Sarah Jenkins',
    email: 'sarah.jenkins@mascloud.studio',
    team: 'IT Support',
    courseTitle: 'Zero-Trust Cloud Architecture & IAM Hardening',
    progress: 60,
    status: 'In Progress',
    score: 85,
    lastActive: '1 hour ago'
  },
  {
    id: 'rst-7',
    learnerName: 'Jordan Miller',
    email: 'jordan.miller@mascloud.studio',
    team: 'Operations',
    courseTitle: 'Enterprise Cybersecurity & Generative AI Hygiene',
    progress: 0,
    status: 'Not Started',
    score: null,
    lastActive: 'Invited'
  },
  {
    id: 'rst-8',
    learnerName: 'Liam Gallagher',
    email: 'liam.gallagher@mascloud.studio',
    team: 'IT Support',
    courseTitle: 'Modern DevOps, CI/CD Pipeline & Edge Observability',
    progress: 25,
    status: 'In Progress',
    score: 80,
    lastActive: '5 hours ago'
  }
];

// ------------------------------------------------------------------------------
// 8. Client-Side Persistent Store Engine (Zero Crash, Clean LocalStorage Fallback)
// ------------------------------------------------------------------------------
const STORAGE_PREFIX = 'mas_lms_v1_';

export class MasDataStore {
  private static isClient(): boolean {
    return typeof window !== 'undefined';
  }

  // --- Users ---
  public static getUsers(): User[] {
    if (!this.isClient()) return INITIAL_USERS;
    const stored = localStorage.getItem(STORAGE_PREFIX + 'users');
    if (!stored) {
      localStorage.setItem(STORAGE_PREFIX + 'users', JSON.stringify(INITIAL_USERS));
      return INITIAL_USERS;
    }
    try {
      return JSON.parse(stored);
    } catch {
      return INITIAL_USERS;
    }
  }

  public static addUser(user: Omit<User, 'id' | 'joinedDate'>, skipTeamIncrement = false): User {
    const users = this.getUsers();
    const newUser: User = {
      ...user,
      id: 'usr-' + Date.now(),
      joinedDate: 'Today'
    };
    const updated = [newUser, ...users];
    if (this.isClient()) {
      localStorage.setItem(STORAGE_PREFIX + 'users', JSON.stringify(updated));
      if (!skipTeamIncrement && user.team) {
        const teams = this.getTeams();
        const tIdx = teams.findIndex(t => t.name.toLowerCase() === user.team.toLowerCase() || t.id === user.team);
        if (tIdx !== -1) {
          teams[tIdx].memberCount = (teams[tIdx].memberCount || 0) + 1;
          localStorage.setItem(STORAGE_PREFIX + 'teams', JSON.stringify(teams));
        }
      }
    }
    return newUser;
  }

  public static removeUser(id: string): void {
    const users = this.getUsers();
    const targetUser = users.find(u => u.id === id);
    const updated = users.filter(u => u.id !== id);
    if (this.isClient()) {
      localStorage.setItem(STORAGE_PREFIX + 'users', JSON.stringify(updated));
      if (targetUser?.team) {
        const teams = this.getTeams();
        const tIdx = teams.findIndex(t => t.name.toLowerCase() === targetUser.team.toLowerCase() || t.id === targetUser.team);
        if (tIdx !== -1 && teams[tIdx].memberCount > 0) {
          teams[tIdx].memberCount -= 1;
          localStorage.setItem(STORAGE_PREFIX + 'teams', JSON.stringify(teams));
        }
      }
    }
  }

  public static deleteUser(id: string): void {
    this.removeUser(id);
  }

  // --- Teams ---
  public static getTeams(): Team[] {
    if (!this.isClient()) return INITIAL_TEAMS;
    const stored = localStorage.getItem(STORAGE_PREFIX + 'teams');
    if (!stored) {
      localStorage.setItem(STORAGE_PREFIX + 'teams', JSON.stringify(INITIAL_TEAMS));
      return INITIAL_TEAMS;
    }
    try {
      const parsed = JSON.parse(stored);
      // Ensure Google Firebase Team exists even if old localStorage was seeded with 3 teams
      if (Array.isArray(parsed) && !parsed.some((t: Team) => t.name === 'Google Firebase Team')) {
        const firebaseTeam = INITIAL_TEAMS.find(t => t.name === 'Google Firebase Team');
        if (firebaseTeam) {
          parsed.unshift(firebaseTeam);
          localStorage.setItem(STORAGE_PREFIX + 'teams', JSON.stringify(parsed));
        }
      }
      return parsed;
    } catch {
      return INITIAL_TEAMS;
    }
  }

  public static addTeam(team: Omit<Team, 'id' | 'memberCount' | 'completionRate'>): Team {
    const teams = this.getTeams();
    const newTeam: Team = {
      ...team,
      id: 'team-' + Date.now(),
      memberCount: 1,
      completionRate: 0
    };
    const updated = [newTeam, ...teams];
    if (this.isClient()) {
      localStorage.setItem(STORAGE_PREFIX + 'teams', JSON.stringify(updated));
    }
    return newTeam;
  }

  public static addMemberToTeam(teamId: string, member: { name: string; email: string; role: 'Admin' | 'Instructor' | 'Learner' }): { user: User; team: Team | null } {
    const teams = this.getTeams();
    const teamIndex = teams.findIndex(t => t.id === teamId || t.name.toLowerCase() === teamId.toLowerCase());
    let targetTeamName = 'General';
    let updatedTeam: Team | null = null;

    if (teamIndex !== -1) {
      teams[teamIndex].memberCount = (teams[teamIndex].memberCount || 0) + 1;
      updatedTeam = teams[teamIndex];
      targetTeamName = teams[teamIndex].name;
      if (this.isClient()) {
        localStorage.setItem(STORAGE_PREFIX + 'teams', JSON.stringify(teams));
      }
    }

    const newUser = this.addUser({
      name: member.name,
      email: member.email,
      role: member.role,
      team: targetTeamName,
      avatarUrl: `https://images.unsplash.com/photo-${1530000000000 + Math.floor(Math.random() * 100000000)}?q=80&w=250&auto=format&fit=crop`,
      status: 'Active'
    }, true);

    return { user: newUser, team: updatedTeam };
  }

  // --- Courses ---
  public static getCourses(): Course[] {
    if (!this.isClient()) return INITIAL_COURSES;
    const stored = localStorage.getItem(STORAGE_PREFIX + 'courses');
    if (!stored) {
      localStorage.setItem(STORAGE_PREFIX + 'courses', JSON.stringify(INITIAL_COURSES));
      return INITIAL_COURSES;
    }
    try {
      const parsed = JSON.parse(stored);
      if (Array.isArray(parsed) && !parsed.some((c: Course) => c.title.toLowerCase().includes('firebase'))) {
        const firebaseCourse = INITIAL_COURSES.find(c => c.title.toLowerCase().includes('firebase'));
        if (firebaseCourse) {
          parsed.unshift(firebaseCourse);
          localStorage.setItem(STORAGE_PREFIX + 'courses', JSON.stringify(parsed));
        }
      }
      return parsed;
    } catch {
      return INITIAL_COURSES;
    }
  }

  public static getCourseById(id: string): Course | null {
    const courses = this.getCourses();
    return courses.find(c => c.id === id || c.title.toLowerCase() === id.toLowerCase()) || courses[0] || null;
  }

  public static addCourse(course: Omit<Course, 'id' | 'lessonCount' | 'enrolledLearnersCount' | 'updatedAt' | 'progress'>): Course {
    const courses = this.getCourses();
    const newCourse: Course = {
      ...course,
      id: 'crs-' + Date.now(),
      lessonCount: course.lessons.length,
      enrolledLearnersCount: 1,
      progress: 0,
      updatedAt: 'Just now'
    };
    const updated = [newCourse, ...courses];
    if (this.isClient()) {
      localStorage.setItem(STORAGE_PREFIX + 'courses', JSON.stringify(updated));
    }
    return newCourse;
  }

  public static addModuleToCourse(
    courseId: string,
    moduleData: {
      title: string;
      type: LessonType;
      durationMinutes: number;
      contentMarkdown?: string;
      videoUrl?: string;
    }
  ): { course: Course; lesson: Lesson } | null {
    const courses = this.getCourses();
    const courseIndex = courses.findIndex(c => c.id === courseId || c.title.toLowerCase() === courseId.toLowerCase());
    if (courseIndex === -1) return null;

    const course = courses[courseIndex];
    const newLesson: Lesson = {
      id: `lsn-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      courseId: course.id,
      title: moduleData.title.trim(),
      type: moduleData.type,
      durationMinutes: Number(moduleData.durationMinutes) || 15,
      completed: false,
      contentMarkdown: moduleData.contentMarkdown || '',
      videoUrl: moduleData.videoUrl || ''
    };

    const updatedLessons = [...course.lessons, newLesson];
    const totalMinutes = updatedLessons.reduce((sum, l) => sum + (l.durationMinutes || 0), 0);
    const updatedCourse: Course = {
      ...course,
      lessons: updatedLessons,
      lessonCount: updatedLessons.length,
      durationHours: Math.max(0.5, Math.round((totalMinutes / 60) * 10) / 10),
      updatedAt: 'Just now'
    };

    courses[courseIndex] = updatedCourse;
    if (this.isClient()) {
      localStorage.setItem(STORAGE_PREFIX + 'courses', JSON.stringify(courses));
    }

    return { course: updatedCourse, lesson: newLesson };
  }

  public static updateModuleInCourse(
    courseId: string,
    lessonId: string,
    updates: Partial<Lesson>
  ): Course | null {
    const courses = this.getCourses();
    const courseIndex = courses.findIndex(c => c.id === courseId || c.title.toLowerCase() === courseId.toLowerCase());
    if (courseIndex === -1) return null;

    const course = courses[courseIndex];
    const updatedLessons = course.lessons.map(l => {
      if (l.id === lessonId) {
        return { ...l, ...updates };
      }
      return l;
    });

    const totalMinutes = updatedLessons.reduce((sum, l) => sum + (l.durationMinutes || 0), 0);
    const updatedCourse: Course = {
      ...course,
      lessons: updatedLessons,
      lessonCount: updatedLessons.length,
      durationHours: Math.max(0.5, Math.round((totalMinutes / 60) * 10) / 10),
      updatedAt: 'Just now'
    };

    courses[courseIndex] = updatedCourse;
    if (this.isClient()) {
      localStorage.setItem(STORAGE_PREFIX + 'courses', JSON.stringify(courses));
    }

    return updatedCourse;
  }

  public static deleteModuleFromCourse(courseId: string, lessonId: string): Course | null {
    const courses = this.getCourses();
    const courseIndex = courses.findIndex(c => c.id === courseId || c.title.toLowerCase() === courseId.toLowerCase());
    if (courseIndex === -1) return null;

    const course = courses[courseIndex];
    const updatedLessons = course.lessons.filter(l => l.id !== lessonId);
    const totalMinutes = updatedLessons.reduce((sum, l) => sum + (l.durationMinutes || 0), 0);
    const completedCount = updatedLessons.filter(l => l.completed).length;
    const newProgress = updatedLessons.length > 0 ? Math.round((completedCount / updatedLessons.length) * 100) : 0;

    const updatedCourse: Course = {
      ...course,
      lessons: updatedLessons,
      lessonCount: updatedLessons.length,
      durationHours: Math.max(0.5, Math.round((totalMinutes / 60) * 10) / 10),
      progress: newProgress,
      updatedAt: 'Just now'
    };

    courses[courseIndex] = updatedCourse;
    if (this.isClient()) {
      localStorage.setItem(STORAGE_PREFIX + 'courses', JSON.stringify(courses));
    }

    return updatedCourse;
  }

  public static toggleLessonComplete(courseId: string, lessonId: string): Course | null {
    const courses = this.getCourses();
    const courseIndex = courses.findIndex(c => c.id === courseId);
    if (courseIndex === -1) return null;

    const course = courses[courseIndex];
    const updatedLessons = course.lessons.map(l => {
      if (l.id === lessonId) return { ...l, completed: !l.completed };
      return l;
    });

    const completedCount = updatedLessons.filter(l => l.completed).length;
    const newProgress = Math.round((completedCount / updatedLessons.length) * 100);

    const updatedCourse: Course = {
      ...course,
      lessons: updatedLessons,
      progress: newProgress,
      updatedAt: 'Just now'
    };

    courses[courseIndex] = updatedCourse;
    if (this.isClient()) {
      localStorage.setItem(STORAGE_PREFIX + 'courses', JSON.stringify(courses));
    }
    return updatedCourse;
  }

  // --- Messages & Threads ---
  public static getMessages(): MessageThread[] {
    if (!this.isClient()) return INITIAL_MESSAGES;
    const stored = localStorage.getItem(STORAGE_PREFIX + 'messages');
    if (!stored) {
      localStorage.setItem(STORAGE_PREFIX + 'messages', JSON.stringify(INITIAL_MESSAGES));
      return INITIAL_MESSAGES;
    }
    try {
      return JSON.parse(stored);
    } catch {
      return INITIAL_MESSAGES;
    }
  }

  public static addReply(threadId: string, text: string, senderName: string, avatar: string): MessageThread | null {
    const messages = this.getMessages();
    const threadIndex = messages.findIndex(m => m.id === threadId);
    if (threadIndex === -1) return null;

    const thread = messages[threadIndex];
    const newReply = {
      id: 'rep-' + Date.now(),
      sender: senderName,
      avatar,
      text,
      date: 'Just now'
    };

    const updatedThread: MessageThread = {
      ...thread,
      replies: [...thread.replies, newReply]
    };

    messages[threadIndex] = updatedThread;
    if (this.isClient()) {
      localStorage.setItem(STORAGE_PREFIX + 'messages', JSON.stringify(messages));
    }
    return updatedThread;
  }

  public static addMessage(title: string, content: string, category: 'Announcement' | 'System' | 'Compliance' | 'Curriculum', senderName: string, senderAvatar: string): MessageThread {
    const messages = this.getMessages();
    const newMsg: MessageThread = {
      id: 'msg-' + Date.now(),
      title,
      senderName,
      senderRole: 'Administrator',
      senderAvatar,
      date: 'Just now',
      category,
      unread: false,
      preview: content.slice(0, 120) + '...',
      content,
      replies: []
    };
    const updated = [newMsg, ...messages];
    if (this.isClient()) {
      localStorage.setItem(STORAGE_PREFIX + 'messages', JSON.stringify(updated));
    }
    return newMsg;
  }

  // --- Guidelines ---
  public static getGuidelines(): Guideline[] {
    if (!this.isClient()) return INITIAL_GUIDELINES;
    const stored = localStorage.getItem(STORAGE_PREFIX + 'guidelines');
    if (!stored) {
      localStorage.setItem(STORAGE_PREFIX + 'guidelines', JSON.stringify(INITIAL_GUIDELINES));
      return INITIAL_GUIDELINES;
    }
    try {
      return JSON.parse(stored);
    } catch {
      return INITIAL_GUIDELINES;
    }
  }

  // --- Activities ---
  public static getActivities(): ActivityItem[] {
    if (!this.isClient()) return INITIAL_ACTIVITIES;
    const stored = localStorage.getItem(STORAGE_PREFIX + 'activities');
    if (!stored) {
      localStorage.setItem(STORAGE_PREFIX + 'activities', JSON.stringify(INITIAL_ACTIVITIES));
      return INITIAL_ACTIVITIES;
    }
    try {
      return JSON.parse(stored);
    } catch {
      return INITIAL_ACTIVITIES;
    }
  }

  // --- Reports Roster ---
  public static getReportRoster(): ReportRosterRow[] {
    if (!this.isClient()) return INITIAL_ROSTER_REPORT;
    const stored = localStorage.getItem(STORAGE_PREFIX + 'roster');
    if (!stored) {
      localStorage.setItem(STORAGE_PREFIX + 'roster', JSON.stringify(INITIAL_ROSTER_REPORT));
      return INITIAL_ROSTER_REPORT;
    }
    try {
      return JSON.parse(stored);
    } catch {
      return INITIAL_ROSTER_REPORT;
    }
  }

  // --- Active Demo Role (Persisted in browser) ---
  public static getActiveRole(): 'Admin' | 'Instructor' | 'Learner' {
    if (!this.isClient()) return 'Admin';
    const stored = localStorage.getItem(STORAGE_PREFIX + 'active_role');
    return (stored as any) || 'Admin';
  }

  public static setActiveRole(role: 'Admin' | 'Instructor' | 'Learner'): void {
    if (this.isClient()) {
      localStorage.setItem(STORAGE_PREFIX + 'active_role', role);
    }
  }
}
