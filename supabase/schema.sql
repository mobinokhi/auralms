-- ==============================================================================
-- AuraLMS Database Architecture & Schema (Supabase PostgreSQL)
-- Combining Gomo Learning visual course authoring & SAP Litmos enterprise tracking
-- ==============================================================================

-- 1. Enable necessary extensions
create extension if not exists "uuid-ossp";

-- 2. Drop existing tables if re-running migration (in reverse dependency order)
drop table if exists public.quiz_attempts cascade;
drop table if exists public.enrollments cascade;
drop table if exists public.content_blocks cascade;
drop table if exists public.pages cascade;
drop table if exists public.modules cascade;
drop table if exists public.courses cascade;
drop table if exists public.profiles cascade;

-- ==============================================================================
-- 3. Table Definitions
-- ==============================================================================

-- PROFILES: Extended profile for auth.users with corporate role attribution
create table public.profiles (
    id uuid primary key references auth.users(id) on delete cascade,
    full_name text not null,
    role text not null check (role in ('admin', 'author', 'learner')) default 'learner',
    avatar_url text,
    department text default 'General',
    created_at timestamptz not null default timezone('utc'::text, now()),
    updated_at timestamptz not null default timezone('utc'::text, now())
);

-- COURSES: Course metadata, publishing status, and estimated duration
create table public.courses (
    id uuid primary key default uuid_generate_v4(),
    title text not null,
    description text,
    thumbnail_url text,
    category text default 'Compliance & Training',
    estimated_minutes integer default 30,
    status text not null check (status in ('draft', 'published')) default 'draft',
    created_by uuid references public.profiles(id) on delete set null,
    created_at timestamptz not null default timezone('utc'::text, now()),
    updated_at timestamptz not null default timezone('utc'::text, now())
);

-- MODULES: High-level curriculum chapters within a course
create table public.modules (
    id uuid primary key default uuid_generate_v4(),
    course_id uuid not null references public.courses(id) on delete cascade,
    title text not null,
    description text,
    order_index integer not null default 0,
    created_at timestamptz not null default timezone('utc'::text, now())
);

-- PAGES: Individual learning topics or screens inside a module
create table public.pages (
    id uuid primary key default uuid_generate_v4(),
    module_id uuid not null references public.modules(id) on delete cascade,
    title text not null,
    order_index integer not null default 0,
    created_at timestamptz not null default timezone('utc'::text, now())
);

-- CONTENT_BLOCKS: Modular Gomo-style visual blocks (rich text, callout, video, image, accordion, quiz)
create table public.content_blocks (
    id uuid primary key default uuid_generate_v4(),
    page_id uuid not null references public.pages(id) on delete cascade,
    type text not null check (type in ('rich_text', 'callout', 'video', 'image', 'accordion', 'quiz')),
    content_json jsonb not null default '{}'::jsonb,
    order_index integer not null default 0,
    created_at timestamptz not null default timezone('utc'::text, now())
);

-- ENROLLMENTS: Corporate Litmos-style enrollment tracking & progression
create table public.enrollments (
    id uuid primary key default uuid_generate_v4(),
    user_id uuid not null references public.profiles(id) on delete cascade,
    course_id uuid not null references public.courses(id) on delete cascade,
    progress_percentage integer not null default 0 check (progress_percentage between 0 and 100),
    status text not null check (status in ('not_started', 'in_progress', 'completed')) default 'not_started',
    last_accessed_page_id uuid references public.pages(id) on delete set null,
    completed_at timestamptz,
    created_at timestamptz not null default timezone('utc'::text, now()),
    updated_at timestamptz not null default timezone('utc'::text, now()),
    unique(user_id, course_id)
);

-- QUIZ_ATTEMPTS: Knowledge check audit log and assessment scoring
create table public.quiz_attempts (
    id uuid primary key default uuid_generate_v4(),
    user_id uuid not null references public.profiles(id) on delete cascade,
    block_id uuid not null references public.content_blocks(id) on delete cascade,
    course_id uuid references public.courses(id) on delete cascade,
    selected_option text not null,
    is_correct boolean not null,
    score numeric not null default 0,
    attempted_at timestamptz not null default timezone('utc'::text, now())
);

-- ==============================================================================
-- 4. Indexes for Query Performance
-- ==============================================================================
create index if not exists idx_courses_status on public.courses(status);
create index if not exists idx_modules_course on public.modules(course_id, order_index);
create index if not exists idx_pages_module on public.pages(module_id, order_index);
create index if not exists idx_blocks_page on public.content_blocks(page_id, order_index);
create index if not exists idx_enrollments_user_course on public.enrollments(user_id, course_id);
create index if not exists idx_enrollments_status on public.enrollments(status);
create index if not exists idx_quiz_attempts_user_block on public.quiz_attempts(user_id, block_id);

-- ==============================================================================
-- 5. Automatic `updated_at` Trigger Functions
-- ==============================================================================
create or replace function public.handle_updated_at()
returns trigger as $$
begin
    new.updated_at = timezone('utc'::text, now());
    return new;
end;
$$ language plpgsql;

create trigger tr_profiles_updated_at
    before update on public.profiles
    for each row execute function public.handle_updated_at();

create trigger tr_courses_updated_at
    before update on public.courses
    for each row execute function public.handle_updated_at();

create trigger tr_enrollments_updated_at
    before update on public.enrollments
    for each row execute function public.handle_updated_at();

-- Auto-provision profile on Supabase auth.users signup
create or replace function public.handle_new_user()
returns trigger as $$
begin
    insert into public.profiles (id, full_name, role, avatar_url, department)
    values (
        new.id,
        coalesce(new.raw_user_meta_data->>'full_name', 'Corporate Learner'),
        coalesce(new.raw_user_meta_data->>'role', 'learner'),
        coalesce(new.raw_user_meta_data->>'avatar_url', 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'),
        coalesce(new.raw_user_meta_data->>'department', 'Information Technology')
    )
    on conflict (id) do update set
        full_name = excluded.full_name,
        avatar_url = excluded.avatar_url;
    return new;
end;
$$ language plpgsql security definer;

-- Drop trigger if exists before re-creating
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
    after insert on auth.users
    for each row execute function public.handle_new_user();

-- ==============================================================================
-- 6. Row Level Security (RLS) Policies
-- ==============================================================================
alter table public.profiles enable row level security;
alter table public.courses enable row level security;
alter table public.modules enable row level security;
alter table public.pages enable row level security;
alter table public.content_blocks enable row level security;
alter table public.enrollments enable row level security;
alter table public.quiz_attempts enable row level security;

-- PROFILES policies
create policy "Public profiles are viewable by authenticated users"
    on public.profiles for select
    to authenticated
    using (true);

create policy "Users can update their own profile"
    on public.profiles for update
    to authenticated
    using (auth.uid() = id);

-- COURSES policies
create policy "Anyone authenticated can view published courses"
    on public.courses for select
    to authenticated
    using (status = 'published' or auth.uid() = created_by or exists (
        select 1 from public.profiles where id = auth.uid() and role in ('admin', 'author')
    ));

create policy "Authors and Admins can create courses"
    on public.courses for insert
    to authenticated
    with check (exists (
        select 1 from public.profiles where id = auth.uid() and role in ('admin', 'author')
    ));

create policy "Authors and Admins can update their courses"
    on public.courses for update
    to authenticated
    using (auth.uid() = created_by or exists (
        select 1 from public.profiles where id = auth.uid() and role = 'admin'
    ));

create policy "Admins and Authors can delete courses"
    on public.courses for delete
    to authenticated
    using (auth.uid() = created_by or exists (
        select 1 from public.profiles where id = auth.uid() and role = 'admin'
    ));

-- MODULES, PAGES, CONTENT_BLOCKS policies
create policy "Modules viewable if course viewable"
    on public.modules for select
    to authenticated
    using (true);

create policy "Modules editable by authors and admins"
    on public.modules for all
    to authenticated
    using (exists (
        select 1 from public.profiles where id = auth.uid() and role in ('admin', 'author')
    ));

create policy "Pages viewable if module viewable"
    on public.pages for select
    to authenticated
    using (true);

create policy "Pages editable by authors and admins"
    on public.pages for all
    to authenticated
    using (exists (
        select 1 from public.profiles where id = auth.uid() and role in ('admin', 'author')
    ));

create policy "Content blocks viewable by authenticated"
    on public.content_blocks for select
    to authenticated
    using (true);

create policy "Content blocks editable by authors and admins"
    on public.content_blocks for all
    to authenticated
    using (exists (
        select 1 from public.profiles where id = auth.uid() and role in ('admin', 'author')
    ));

-- ENROLLMENTS policies
create policy "Learners can view their own enrollments"
    on public.enrollments for select
    to authenticated
    using (auth.uid() = user_id or exists (
        select 1 from public.profiles where id = auth.uid() and role in ('admin', 'author')
    ));

create policy "Learners can insert and update their own enrollments"
    on public.enrollments for all
    to authenticated
    using (auth.uid() = user_id or exists (
        select 1 from public.profiles where id = auth.uid() and role = 'admin'
    ));

-- QUIZ_ATTEMPTS policies
create policy "Learners can record their own quiz attempts"
    on public.quiz_attempts for insert
    to authenticated
    with check (auth.uid() = user_id);

create policy "Learners and Admins can view quiz attempts"
    on public.quiz_attempts for select
    to authenticated
    using (auth.uid() = user_id or exists (
        select 1 from public.profiles where id = auth.uid() and role = 'admin'
    ));

-- ==============================================================================
-- 7. High-Fidelity Seed Data for Instant Corporate LMS Demo
-- ==============================================================================

-- A. Seed Auth Users for foreign key integrity
insert into auth.users (
    id,
    instance_id,
    aud,
    role,
    email,
    encrypted_password,
    email_confirmed_at,
    raw_app_meta_data,
    raw_user_meta_data,
    created_at,
    updated_at
) values
(
    '00000000-0000-0000-0000-000000000001',
    '00000000-0000-0000-0000-000000000000',
    'authenticated',
    'authenticated',
    'sarah.jenkins@acmecorp.internal',
    '',
    now(),
    '{"provider":"email","providers":["email"]}',
    '{"full_name":"Sarah Jenkins","role":"author"}',
    now(),
    now()
),
(
    '00000000-0000-0000-0000-000000000002',
    '00000000-0000-0000-0000-000000000000',
    'authenticated',
    'authenticated',
    'marcus.sterling@acmecorp.internal',
    '',
    now(),
    '{"provider":"email","providers":["email"]}',
    '{"full_name":"Marcus Sterling","role":"admin"}',
    now(),
    now()
),
(
    '00000000-0000-0000-0000-000000000003',
    '00000000-0000-0000-0000-000000000000',
    'authenticated',
    'authenticated',
    'alex.mercer@acmecorp.internal',
    '',
    now(),
    '{"provider":"email","providers":["email"]}',
    '{"full_name":"Alex Mercer","role":"learner"}',
    now(),
    now()
),
(
    '00000000-0000-0000-0000-000000000004',
    '00000000-0000-0000-0000-000000000000',
    'authenticated',
    'authenticated',
    'priya.sharma@acmecorp.internal',
    '',
    now(),
    '{"provider":"email","providers":["email"]}',
    '{"full_name":"Priya Sharma","role":"learner"}',
    now(),
    now()
),
(
    '00000000-0000-0000-0000-000000000005',
    '00000000-0000-0000-0000-000000000000',
    'authenticated',
    'authenticated',
    'david.chen@acmecorp.internal',
    '',
    now(),
    '{"provider":"email","providers":["email"]}',
    '{"full_name":"David Chen","role":"learner"}',
    now(),
    now()
)
on conflict (id) do nothing;

-- B. Seed Profiles
insert into public.profiles (id, full_name, role, avatar_url, department) values
('00000000-0000-0000-0000-000000000001', 'Sarah Jenkins', 'author', 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80', 'Instructional Design'),
('00000000-0000-0000-0000-000000000002', 'Marcus Sterling', 'admin', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80', 'Talent & Compliance Ops'),
('00000000-0000-0000-0000-000000000003', 'Alex Mercer', 'learner', 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80', 'Core Infrastructure'),
('00000000-0000-0000-0000-000000000004', 'Priya Sharma', 'learner', 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80', 'Product Management'),
('00000000-0000-0000-0000-000000000005', 'David Chen', 'learner', 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80', 'Enterprise Sales')
on conflict (id) do update set
    full_name = excluded.full_name,
    role = excluded.role,
    avatar_url = excluded.avatar_url,
    department = excluded.department;

-- C. Seed Courses
insert into public.courses (id, title, description, thumbnail_url, category, estimated_minutes, status, created_by) values
('11111111-1111-1111-1111-111111111111', 'Cybersecurity Awareness & Incident Response 2026', 'Master essential protocols for phishing mitigation, credential hygiene, zero-trust perimeter defense, and rapid threat escalation.', 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=800&auto=format&fit=crop&q=80', 'Information Security', 35, 'published', '00000000-0000-0000-0000-000000000001'),
('22222222-2222-2222-2222-222222222222', 'Enterprise Leadership & High-Performance Coaching', 'Actionable frameworks for engineering managers and team leads to provide radical candor, quarterly alignment, and psychological safety.', 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=800&auto=format&fit=crop&q=80', 'Executive Leadership', 45, 'published', '00000000-0000-0000-0000-000000000001'),
('33333333-3333-3333-3333-333333333333', 'Global Data Privacy & AI Governance (GDPR / CCPA)', 'Regulatory compliance requirements when implementing GenAI pipelines, data residency policies, and customer privacy rights.', 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800&auto=format&fit=crop&q=80', 'Legal & Regulatory', 25, 'published', '00000000-0000-0000-0000-000000000001')
on conflict (id) do nothing;

-- D. Seed Modules
insert into public.modules (id, course_id, title, description, order_index) values
('11111111-1111-1111-1111-000000000001', '11111111-1111-1111-1111-111111111111', 'Module 1: The Modern Threat Landscape', 'Anatomy of social engineering, spear-phishing, and insider threats.', 0),
('11111111-1111-1111-1111-000000000002', '11111111-1111-1111-1111-111111111111', 'Module 2: Zero-Trust Defense & Incident Protocols', 'Multi-factor authentication protocols and 15-minute containment SLA.', 1)
on conflict (id) do nothing;

-- E. Seed Pages
insert into public.pages (id, module_id, title, order_index) values
('11111111-1111-1111-1111-000000000011', '11111111-1111-1111-1111-000000000001', 'Recognizing Spear-Phishing Vectors', 0),
('11111111-1111-1111-1111-000000000012', '11111111-1111-1111-1111-000000000001', 'Credential Vaults & Passkey Hygiene', 1),
('11111111-1111-1111-1111-000000000013', '11111111-1111-1111-1111-000000000002', 'Immediate Breach Escalation Workflow', 0)
on conflict (id) do nothing;

-- F. Seed Content Blocks (Dollar quoted strings $json$...$json$ to guarantee zero escaping syntax errors)
insert into public.content_blocks (id, page_id, type, content_json, order_index) values
(
    '11111111-1111-1111-1111-000000000101',
    '11111111-1111-1111-1111-000000000011',
    'rich_text',
    $json${
        "heading": "The Anatomy of Modern Social Engineering",
        "html": "<p>Cybercriminals no longer simply 'hack' computers; they hack human trust. Over 82% of enterprise data breaches in 2025 originated through sophisticated social engineering and spear-phishing campaigns tailored with generative AI.</p><p>In this module, you will learn how to identify urgent spoofing requests, fake MFA push fatigue attacks, and impersonation attempts targeting corporate Slack and email accounts.</p>"
    }$json$::jsonb,
    0
),
(
    '11111111-1111-1111-1111-000000000102',
    '11111111-1111-1111-1111-000000000011',
    'callout',
    $json${
        "variant": "takeaway",
        "title": "Core Security Mandate",
        "text": "The IT Security Team will NEVER ask you for your one-time passcodes, passkeys, or prompt you to approve an unexpected Okta push notification over chat or phone."
    }$json$::jsonb,
    1
),
(
    '11111111-1111-1111-1111-000000000103',
    '11111111-1111-1111-1111-000000000011',
    'video',
    $json${
        "title": "Deconstructing an AI Voice Cloning Attack (Case Study)",
        "url": "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
        "caption": "A 3-minute executive briefing on multi-channel executive impersonation fraud."
    }$json$::jsonb,
    2
),
(
    '11111111-1111-1111-1111-000000000104',
    '11111111-1111-1111-1111-000000000011',
    'accordion',
    $json${
        "items": [
            {
                "id": "item-1",
                "title": "Red Flag 1: Artificial Urgency & Bypass Requests",
                "content": "Attackers frequently demand immediate wire transfers, confidential code deployment, or gift card purchases while claiming the executive is currently in a closed-door meeting."
            },
            {
                "id": "item-2",
                "title": "Red Flag 2: Subtle Domain Lookalikes (Typosquatting)",
                "content": "Check headers carefully. Domains like '@corp-secure-login.com' or '@acme-support.co' are configured to mimic official communication channels."
            },
            {
                "id": "item-3",
                "title": "Red Flag 3: Unexpected Password Reset Links",
                "content": "If you receive a prompt to verify login activity you did not initiate, report it to the #security-ops channel immediately."
            }
        ]
    }$json$::jsonb,
    3
),
(
    '11111111-1111-1111-1111-000000000105',
    '11111111-1111-1111-1111-000000000011',
    'quiz',
    $json${
        "question": "You receive a Slack direct message from a user with the CEO's avatar claiming they are in an urgent executive board meeting and require you to send an internal API key to their personal email address. What is the correct response?",
        "options": [
            "Send the API key immediately to avoid stalling the board meeting.",
            "Verify their identity by sending the key with a self-destructing link.",
            "Decline, do not share credentials outside verified channels, and report the message to Security.",
            "Ask them to confirm their employee ID before emailing the credential."
        ],
        "correctOptionIndex": 2,
        "explanation": "Corporate credentials, API tokens, and customer secrets must never be transmitted via insecure channels or to personal accounts, regardless of the sender's stated authority."
    }$json$::jsonb,
    4
),
(
    '11111111-1111-1111-1111-000000000201',
    '11111111-1111-1111-1111-000000000012',
    'rich_text',
    $json${
        "heading": "Credential Vaulting & Hardware Passkeys",
        "html": "<p>Traditional passwords, even complex ones, are vulnerable to database leaks, keyloggers, and reverse-proxy phishing. Modern enterprise security relies on FIDO2/WebAuthn passkeys backed by secure hardware enclaves.</p>"
    }$json$::jsonb,
    0
),
(
    '11111111-1111-1111-1111-000000000202',
    '11111111-1111-1111-1111-000000000012',
    'image',
    $json${
        "url": "https://images.unsplash.com/photo-1614064641938-3bbee52942c7?w=1000&auto=format&fit=crop&q=80",
        "alt": "Cryptographic hardware key authentication diagram",
        "caption": "Hardware-bound keys mathematically prevent credential relay attacks by binding auth to the registered origin."
    }$json$::jsonb,
    1
),
(
    '11111111-1111-1111-1111-000000000203',
    '11111111-1111-1111-1111-000000000012',
    'callout',
    $json${
        "variant": "tip",
        "title": "Best Practice",
        "text": "Enroll at least two physical security keys (Primary YubiKey and a Backup Key stored in your office locker) to ensure zero lockout downtime."
    }$json$::jsonb,
    2
)
on conflict (id) do nothing;

-- G. Seed Enrollments (Litmos Progress Tracking)
insert into public.enrollments (id, user_id, course_id, progress_percentage, status, last_accessed_page_id, completed_at) values
('44444444-4444-4444-4444-000000000001', '00000000-0000-0000-0000-000000000003', '11111111-1111-1111-1111-111111111111', 66, 'in_progress', '11111111-1111-1111-1111-000000000012', null),
('44444444-4444-4444-4444-000000000002', '00000000-0000-0000-0000-000000000003', '22222222-2222-2222-2222-222222222222', 100, 'completed', null, timezone('utc'::text, now() - interval '2 days')),
('44444444-4444-4444-4444-000000000003', '00000000-0000-0000-0000-000000000004', '11111111-1111-1111-1111-111111111111', 100, 'completed', null, timezone('utc'::text, now() - interval '5 days')),
('44444444-4444-4444-4444-000000000004', '00000000-0000-0000-0000-000000000004', '33333333-3333-3333-3333-333333333333', 40, 'in_progress', null, null),
('44444444-4444-4444-4444-000000000005', '00000000-0000-0000-0000-000000000005', '11111111-1111-1111-1111-111111111111', 0, 'not_started', null, null)
on conflict (user_id, course_id) do update set
    progress_percentage = excluded.progress_percentage,
    status = excluded.status;

-- H. Seed Quiz Attempts
insert into public.quiz_attempts (id, user_id, block_id, course_id, selected_option, is_correct, score) values
('55555555-5555-5555-5555-000000000001', '00000000-0000-0000-0000-000000000003', '11111111-1111-1111-1111-000000000105', '11111111-1111-1111-1111-111111111111', 'Decline, do not share credentials outside verified channels, and report the message to Security.', true, 100),
('55555555-5555-5555-5555-000000000002', '00000000-0000-0000-0000-000000000004', '11111111-1111-1111-1111-000000000105', '11111111-1111-1111-1111-111111111111', 'Decline, do not share credentials outside verified channels, and report the message to Security.', true, 100)
on conflict (id) do nothing;
