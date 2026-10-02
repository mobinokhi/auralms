# AuraLMS — Gomo Authoring × SAP Litmos Learning Experience

> A unified, enterprise-grade Learning Management System (LMS) and Authoring Tool combining the visual, responsive course creation of **Gomo Learning** with the corporate learning path, distraction-free player, and compliance tracking capabilities of **SAP Litmos**.

---

## 🚀 Architecture & Key Modules

### 1. Gomo-Style Visual Course Authoring (`/author/editor/[courseId]`)
- **Curriculum Structure Tree:** Hierarchical navigation (`Course > Modules > Topics/Pages`) with real-time add, delete, and reorder controls.
- **Visual Modular Block Builder:**
  - **Rich Text / Heading:** Structured corporate typography and headings.
  - **Callout / Key Takeaway Cards:** Multi-variant cards (`takeaway`, `tip`, `warning`, `info`) with status badges.
  - **Video Embed Block:** 16:9 responsive aspect ratio supporting YouTube embeds or direct MP4 streams.
  - **Image with Caption:** Accessible images with alt attributes and captions.
  - **Expandable Accordion / Tabs:** Collapsible panels for progressive disclosure.
  - **Knowledge Check:** Scored multiple-choice quiz engine with instant rationale feedback.
- **Viewport Switcher:** Real-time canvas simulation across **Desktop (100% fluid)**, **Tablet (768px frame)**, and **Mobile (375px frame)**.

### 2. Litmos-Style Learner Experience (`/learn` and `/learn/[courseId]`)
- **Learner Portal:** Corporate curriculum catalog with "In Progress", "Completed", and "All" filters.
- **Distraction-Free Course Player:** Collapsible curriculum outline drawer, focus mode (cinema view), forward/back pagination, and automatic state persistence.
- **Scored Quiz Evaluations & Celebration:** Interactive knowledge checks with pass/fail thresholds and celebratory confetti cards upon completion.

### 3. Manager & Admin Intelligence (`/admin/dashboard`)
- **Executive KPI Cards:** Total Enrolled Learners, Active Learners, Average Completion Rate, and Average Quiz Scores.
- **Learner Audit Roster:** Filterable by enrollment status (`Not Started`, `In Progress`, `Completed`) with real-time search and CSV export.

---

## 🛠️ Technology Stack
- **Framework:** Next.js (App Router, Turbopack, React 19)
- **Styling:** Tailwind CSS (modern curated dark-mode palette, glassmorphism)
- **Icons & UI:** Lucide React & Radix-inspired modular components
- **Database & Auth:** Supabase (PostgreSQL with Row Level Security policies)
- **Hosting & CI/CD:** Vercel (zero-config edge/serverless deployment)

---

## 🛡️ Zero-Crash Architecture (Local & Vercel Preview)

AuraLMS implements a **Dual-Layer Data Repository Pattern** (`src/lib/data-repository.ts`):
- If `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` are unset or placeholders (such as on initial git clone or preview branches), AuraLMS **gracefully falls back to high-fidelity persistent local storage**.
- `npm run build` will **never fail** due to missing credentials.
- When Supabase credentials are provided, AuraLMS immediately queries PostgreSQL.

---

## 📦 Supabase Setup (PostgreSQL Migration)

1. Open your [Supabase Dashboard](https://supabase.com/dashboard) and create a new project.
2. In the left navigation, click on **SQL Editor**.
3. Click **New query**, then copy and paste the contents of:
   ```
   supabase/schema.sql
   ```
4. Click **Run**. This will execute the migration:
   - Creates the 7 core tables: `profiles`, `courses`, `modules`, `pages`, `content_blocks`, `enrollments`, and `quiz_attempts`.
   - Enables Row Level Security (RLS) policies for authors, admins, and learners.
   - Configures automatic triggers for `updated_at` timestamps.
   - Seeds realistic enterprise courses, modules, blocks, and learner progress.

---

## ⚙️ Environment Configuration

Copy `.env.example` to `.env.local`:

```bash
cp .env.example .env.local
```

Populate your Supabase credentials (found in **Project Settings > API**):

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

---

## 💻 Local Development

```bash
# Install dependencies
npm install

# Run local development server
npm run dev

# Run type check and production build
npm run build

# Run linter
npm run lint
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

---

## 🚢 Pushing to GitHub & Deploying to Vercel

### Step 1: Initialize Git and Push to GitHub

```bash
# Initialize git repository (if not already initialized)
git init

# Stage all files (sensitive keys are omitted via .gitignore)
git add .

# Create initial commit
git commit -m "feat: complete AuraLMS Gomo authoring and Litmos tracking platform"

# Link to your GitHub repository
git branch -M main
git remote add origin https://github.com/<your-username>/<your-repo-name>.git

# Push to GitHub
git push -u origin main
```

### Step 2: Deploy to Vercel

1. Log in to [Vercel](https://vercel.com) and click **Add New... > Project**.
2. Select your newly pushed GitHub repository.
3. In the **Environment Variables** section, add:
   - `NEXT_PUBLIC_SUPABASE_URL`: Your Supabase Project URL
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`: Your Supabase Anon Key
   *(Note: You can even leave them blank initially to verify the zero-crash preview deployment)*
4. Click **Deploy**. Vercel will build and deploy your application globally on its edge network with zero configuration required.
