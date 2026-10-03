-- ==============================================================================
-- M.A.S LMS — Clean Enterprise Database Schema
-- Developed by M.A.S Cloud Studio
-- PostgreSQL / Supabase with Row Level Security (RLS)
-- ==============================================================================

-- Clean slate reset
DROP TABLE IF EXISTS guidelines CASCADE;
DROP TABLE IF EXISTS message_replies CASCADE;
DROP TABLE IF EXISTS messages CASCADE;
DROP TABLE IF EXISTS enrollments CASCADE;
DROP TABLE IF EXISTS lessons CASCADE;
DROP TABLE IF EXISTS courses CASCADE;
DROP TABLE IF EXISTS team_members CASCADE;
DROP TABLE IF EXISTS teams CASCADE;
DROP TABLE IF EXISTS profiles CASCADE;

-- 1. Profiles Table (Users & Roles)
CREATE TABLE profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    role TEXT NOT NULL CHECK (role IN ('Admin', 'Instructor', 'Learner')),
    team_name TEXT DEFAULT 'Unassigned',
    avatar_url TEXT,
    status TEXT NOT NULL DEFAULT 'Active' CHECK (status IN ('Active', 'Invited', 'Suspended')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 2. Teams Table
CREATE TABLE teams (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT UNIQUE NOT NULL,
    lead_name TEXT NOT NULL,
    lead_email TEXT NOT NULL,
    lead_avatar TEXT,
    description TEXT,
    assigned_tracks TEXT[] DEFAULT '{}',
    completion_rate INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 3. Team Members Join Table
CREATE TABLE team_members (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    team_id UUID NOT NULL REFERENCES teams(id) ON DELETE CASCADE,
    profile_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    joined_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE(team_id, profile_id)
);

-- 4. Courses Table
CREATE TABLE courses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    category TEXT NOT NULL CHECK (category IN ('Security', 'Compliance', 'Engineering', 'Leadership', 'Finance')),
    description TEXT NOT NULL,
    thumbnail_url TEXT NOT NULL,
    duration_hours NUMERIC(4,1) NOT NULL DEFAULT 1.0,
    instructor_name TEXT NOT NULL,
    level TEXT NOT NULL CHECK (level IN ('Beginner', 'Intermediate', 'Advanced')),
    status TEXT NOT NULL DEFAULT 'Published' CHECK (status IN ('Draft', 'Published', 'Archived')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 5. Lessons Table
CREATE TABLE lessons (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    course_id UUID NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    duration_minutes INTEGER NOT NULL DEFAULT 15,
    type TEXT NOT NULL CHECK (type IN ('reading', 'video', 'quiz')),
    order_index INTEGER NOT NULL DEFAULT 0,
    content_markdown TEXT,
    video_url TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 6. Enrollments Table
CREATE TABLE enrollments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    profile_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    course_id UUID NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
    progress INTEGER NOT NULL DEFAULT 0 CHECK (progress >= 0 AND progress <= 100),
    status TEXT NOT NULL DEFAULT 'Not Started' CHECK (status IN ('Not Started', 'In Progress', 'Completed')),
    score INTEGER,
    completed_at TIMESTAMPTZ,
    last_active TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE(profile_id, course_id)
);

-- 7. Messages & Announcements Table
CREATE TABLE messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    sender_name TEXT NOT NULL,
    sender_role TEXT NOT NULL,
    sender_avatar TEXT,
    category TEXT NOT NULL CHECK (category IN ('Announcement', 'System', 'Compliance', 'Curriculum')),
    preview TEXT NOT NULL,
    content TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 8. Message Replies Table
CREATE TABLE message_replies (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    message_id UUID NOT NULL REFERENCES messages(id) ON DELETE CASCADE,
    sender_name TEXT NOT NULL,
    sender_avatar TEXT,
    text TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 9. Guidelines / SOP Knowledge Base Table
CREATE TABLE guidelines (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    category TEXT NOT NULL CHECK (category IN ('Security', 'HR & Conduct', 'Operations', 'Engineering SOP')),
    read_time TEXT NOT NULL DEFAULT '5 min read',
    summary TEXT NOT NULL,
    sections JSONB NOT NULL DEFAULT '[]'::jsonb,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Enable Row Level Security (RLS)
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE teams ENABLE ROW LEVEL SECURITY;
ALTER TABLE team_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE lessons ENABLE ROW LEVEL SECURITY;
ALTER TABLE enrollments ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE message_replies ENABLE ROW LEVEL SECURITY;
ALTER TABLE guidelines ENABLE ROW LEVEL SECURITY;

-- Permissive public read & authenticated write policies for seamless SaaS access
CREATE POLICY "Public read profiles" ON profiles FOR SELECT USING (true);
CREATE POLICY "Public read teams" ON teams FOR SELECT USING (true);
CREATE POLICY "Public read team_members" ON team_members FOR SELECT USING (true);
CREATE POLICY "Public read courses" ON courses FOR SELECT USING (true);
CREATE POLICY "Public read lessons" ON lessons FOR SELECT USING (true);
CREATE POLICY "Public read enrollments" ON enrollments FOR SELECT USING (true);
CREATE POLICY "Public read messages" ON messages FOR SELECT USING (true);
CREATE POLICY "Public read message_replies" ON message_replies FOR SELECT USING (true);
CREATE POLICY "Public read guidelines" ON guidelines FOR SELECT USING (true);

-- ==============================================================================
-- Seed Data Injection
-- ==============================================================================

-- Profiles
INSERT INTO profiles (id, name, email, role, team_name, avatar_url, status) VALUES
('11111111-1111-1111-1111-111111111101', 'Alex Morgan', 'alex.morgan@mascloud.studio', 'Admin', 'IT Support', 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=250&auto=format&fit=crop', 'Active'),
('11111111-1111-1111-1111-111111111102', 'Dr. Sophia Patel', 'sophia.patel@mascloud.studio', 'Instructor', 'Operations', 'https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=250&auto=format&fit=crop', 'Active'),
('11111111-1111-1111-1111-111111111103', 'Marcus Vance', 'marcus.vance@mascloud.studio', 'Instructor', 'Operations', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=250&auto=format&fit=crop', 'Active'),
('11111111-1111-1111-1111-111111111104', 'Elena Rostova', 'elena.rostova@mascloud.studio', 'Learner', 'Finance & Advisory', 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=250&auto=format&fit=crop', 'Active'),
('11111111-1111-1111-1111-111111111105', 'David Chen', 'david.chen@mascloud.studio', 'Learner', 'Operations', 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=250&auto=format&fit=crop', 'Active'),
('11111111-1111-1111-1111-111111111106', 'Sarah Jenkins', 'sarah.jenkins@mascloud.studio', 'Learner', 'IT Support', 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=250&auto=format&fit=crop', 'Active'),
('11111111-1111-1111-1111-111111111107', 'Jordan Miller', 'jordan.miller@mascloud.studio', 'Learner', 'Operations', 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?q=80&w=250&auto=format&fit=crop', 'Invited'),
('11111111-1111-1111-1111-111111111108', 'Liam Gallagher', 'liam.gallagher@mascloud.studio', 'Learner', 'IT Support', 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?q=80&w=250&auto=format&fit=crop', 'Active');

-- Teams
INSERT INTO teams (id, name, lead_name, lead_email, lead_avatar, description, assigned_tracks, completion_rate) VALUES
('22222222-2222-2222-2222-222222222201', 'Operations', 'Marcus Vance', 'marcus.vance@mascloud.studio', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=250&auto=format&fit=crop', 'Field execution, workplace safety, supply chain logistics, and business continuity SOPs.', ARRAY['Enterprise Cybersecurity & Generative AI Hygiene', 'Executive Crisis Management & Incident Response'], 92),
('22222222-2222-2222-2222-222222222202', 'Finance & Advisory', 'Elena Rostova', 'elena.rostova@mascloud.studio', 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=250&auto=format&fit=crop', 'Statutory compliance, anti-fraud governance, AML audits, and financial reporting verification.', ARRAY['Financial Controls, Anti-Fraud & Regulatory SOPs', 'SOC2 Type II & Data Privacy Compliance (2026)'], 85),
('22222222-2222-2222-2222-222222222203', 'IT Support', 'Alex Morgan', 'alex.morgan@mascloud.studio', 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=250&auto=format&fit=crop', 'Infrastructure hardening, zero-trust IAM policies, end-user service desk, and vulnerability management.', ARRAY['Enterprise Cybersecurity & Generative AI Hygiene', 'Zero-Trust Cloud Architecture & IAM Hardening'], 96);

-- Courses
INSERT INTO courses (id, title, category, description, thumbnail_url, duration_hours, instructor_name, level, status) VALUES
('33333333-3333-3333-3333-333333333301', 'Enterprise Cybersecurity & Generative AI Hygiene', 'Security', 'Defend organizational assets against prompt injection, spear-phishing, MFA push fatigue, and sensitive corporate data leakage in public LLM workflows.', 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=800&auto=format&fit=crop', 3.5, 'Dr. Sophia Patel', 'Intermediate', 'Published'),
('33333333-3333-3333-3333-333333333302', 'SOC2 Type II & Data Privacy Compliance (2026)', 'Compliance', 'Master the Trust Services Criteria (Security, Availability, Confidentiality, and Processing Integrity) required for annual enterprise cloud certifications.', 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=800&auto=format&fit=crop', 4.0, 'Alex Morgan', 'Advanced', 'Published'),
('33333333-3333-3333-3333-333333333303', 'Zero-Trust Cloud Architecture & IAM Hardening', 'Engineering', 'Implement perimeterless security principles: explicit verification, least privileged access, and assumption of breach across multi-cloud environments.', 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?q=80&w=800&auto=format&fit=crop', 5.0, 'Alex Morgan', 'Advanced', 'Published'),
('33333333-3333-3333-3333-333333333304', 'Executive Crisis Management & Incident Response', 'Leadership', 'Protocol execution, legal liability management, external communication cadence, and post-mortem review during high-severity enterprise incidents.', 'https://images.unsplash.com/photo-1521737711867-e3b97375f902?q=80&w=800&auto=format&fit=crop', 2.5, 'Marcus Vance', 'Beginner', 'Published'),
('33333333-3333-3333-3333-333333333305', 'Financial Controls, Anti-Fraud & Regulatory SOPs', 'Finance', 'Rigorous standard operating procedures for dual-authorization disbursements, ledger audits, anti-money laundering (AML), and foreign exchange risk control.', 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?q=80&w=800&auto=format&fit=crop', 3.0, 'Elena Rostova', 'Intermediate', 'Published'),
('33333333-3333-3333-3333-333333333306', 'Modern DevOps, CI/CD Pipeline & Edge Observability', 'Engineering', 'Build automated delivery pipelines with zero-downtime blue/green rollouts, synthetic transaction tracing, and OpenTelemetry instrumentation.', 'https://images.unsplash.com/photo-1618401471353-b98afee0b2eb?q=80&w=800&auto=format&fit=crop', 4.5, 'Alex Morgan', 'Advanced', 'Published');

-- Lessons for Course 1
INSERT INTO lessons (id, course_id, title, duration_minutes, type, order_index, content_markdown) VALUES
('44444444-4444-4444-4444-444444444401', '33333333-3333-3333-3333-333333333301', 'Modern Threat Landscape: AI-Assisted Spear Phishing', 18, 'reading', 1, 'Cybercriminals compromise human trust through AI-tailored impersonation campaigns. Always verify out-of-band wire requests.'),
('44444444-4444-4444-4444-444444444402', '33333333-3333-3333-3333-333333333301', 'Mitigating MFA Push Fatigue & Session Hijacking', 24, 'video', 2, 'Enable number matching and disable SMS OTP fallbacks for privileged accounts.'),
('44444444-4444-4444-4444-444444444403', '33333333-3333-3333-3333-333333333301', 'Generative AI Usage & Safe Sanitization Guidelines', 20, 'reading', 3, 'Zero PII ingestion into public chat models. Review code outputs before committing.'),
('44444444-4444-4444-4444-444444444404', '33333333-3333-3333-3333-333333333301', 'Retention Knowledge Check & Scenario Simulation', 15, 'quiz', 4, 'Interactive assessment covering executive impersonation and push bombing defenses.');

-- Messages
INSERT INTO messages (id, title, sender_name, sender_role, sender_avatar, category, preview, content) VALUES
('55555555-5555-5555-5555-555555555501', 'Mandatory Q4 Cybersecurity & Social Engineering Window', 'Alex Morgan', 'Security Administrator', 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=250&auto=format&fit=crop', 'Compliance', 'All employees in Operations, IT, and Finance must complete the 2026 AI Spear Phishing module by October 31st.', 'Our annual Q4 compliance recertification window is now officially open. Complete your assessment to ensure uninterrupted access.');

-- Guidelines
INSERT INTO guidelines (id, title, category, read_time, summary, sections) VALUES
('66666666-6666-6666-6666-666666666601', 'Enterprise Clean Desk & Credential Storage Policy', 'Security', '4 min read', 'Workstation locking, paper shredding, and zero plaintext password rules.', '[{"title": "Unattended Lockout", "content": "Lock workstation screen immediately upon leaving your desk. Max 5 minute timeout."}]'::jsonb),
('66666666-6666-6666-6666-666666666602', 'Generative AI Code Assistant & IP Standards', 'Engineering SOP', '6 min read', 'Governing Copilot and LLM assistance in enterprise software development.', '[{"title": "Zero PII Ingestion", "content": "Never paste API keys or customer private data into public AI chats."}]'::jsonb);
