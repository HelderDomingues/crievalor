# Sistema MAR - Product Requirements Document

## 1. Executive Summary

Sistema MAR (Mapa para Alto Rendimento) is a **SaaS platform for AI-driven business diagnostics and strategic planning** that democratizes access to high-level strategic consulting tools for Brazilian SMEs. The platform transforms a traditional 60-90 day consulting engagement into a **user-controlled, incremental journey** powered by specialized AI agents, delivering personalized strategic plans at 10-25x lower cost than traditional consulting. Unlike traditional consulting where clients wait for reports, MAR is a gamified, step-by-step process where users control the pace and approve each phase.

**Core Value Proposition:** Enable companies with R$150k+/month revenue to professionalize their management rapidly without stopping operations, through AI-powered analysis combined with human consultant validation.

**MVP Status:** Platform is operational with quiz system, admin panel, AI agent orchestration, and multi-step analysis workflow. Current focus is on optimizing the build process and maintaining development velocity as complexity increases.

---

## 2. Mission

**Mission Statement:** Generate clarity and direction for Brazilian SMEs, making attitude the engine of growth through accessible, AI-powered strategic intelligence.

### Core Principles

1. **Democratization** — Make premium strategic consulting accessible to companies with 15+ employees
2. **AI + Human Intelligence** — Combine specialized AI agents with experienced consultant validation
3. **Simplicity in Complexity** — Transform complex strategic analysis into clear, actionable insights
4. **LGPD Compliance** — Protect sensitive business data through anonymization and masking
5. **Zero Infrastructure Cost (MVP)** — Maintain $0/month infrastructure through Netlify/Supabase free tiers during MVP; invest in premium tools once revenue-generating
6. **User-Controlled Journey** — Incremental, gamified experience where users control pace and approve each step vs. traditional wait-for-report model

---

## 3. Target Users

### Primary Persona: SME Owner/Leader

- **Company Profile:**
  - Monthly revenue: R$150,000+ (R$1.8M+ annually)
  - Employees: 15+ team members
  - Age: 3-15 years in business
  - Sector: B2B services (consulting, agencies, IT, healthcare, education, engineering, retail)
  
- **Pain Points:**
  - Grew without formal structure
  - Founder is 60-80% operational (stuck in day-to-day)
  - Needs to professionalize to scale 2-3x in 2 years
  - Cannot afford R$30k-80k traditional consulting
  - Cannot pause operations for strategic planning

- **Goals:**
  - Gain clarity on strategic direction
  - Build sustainable growth structure
  - Free themselves from operational tasks
  - Implement professional management practices

### Secondary Persona: System Administrator (Crie Valor Team)

- **Role:** Manage platform, review AI outputs, validate strategic plans
- **Needs:** 
  - Complete visibility into all projects
  - Ability to review and edit AI-generated content
  - User management and access control
  - Analytics and reporting on platform usage

---

## 4. Product Scope

### In Scope (Current/Planned)

**Core Functionality**
- ✅ Multi-user authentication and authorization (Supabase Auth)
- ✅ 86-question MAR diagnostic quiz (11 modules)
- ✅ Multi-step AI analysis journey (16 distinct analysis types)
- ✅ AI agent orchestration system (OpenAI GPT-4o, Perplexity)
- ✅ LGPD-compliant data masking and anonymization
- ✅ Admin dashboard with full project visibility
- ✅ Client dashboard with project progress tracking
- ✅ Document generation and export (PDF reports)
- ✅ Social media analysis (Instagram via Apify scraping)
- 🔄 Gamified UX with progress visualization
- 🔄 Data visualization (charts, infographics from raw data)
- 🔄 Integration with Lumia (24/7 AI consultants)
- 🔄 Integration with Lumia (24/7 AI consultants)
- ✅ Mentor de Propósito (Discovery Journey, Identity Dashboard, Materials)

**Technical Infrastructure**
- ✅ React 18 + Vite frontend
- ✅ Supabase backend (PostgreSQL, Auth, Edge Functions)
- ✅ Netlify deployment and Background Functions
- ✅ Row Level Security (RLS) on all sensitive tables
- ✅ Webhook integration with Make.com for external workflows
- ✅ Real-time project status updates

### Out of Scope (Post-MVP / Future Implementation)

- 🔮 Mobile native apps (responsive web only for MVP)
- 🔮 Offline mode
- 🔮 Multi-language support (Portuguese only for MVP)
- 🔮 White-label/reseller capabilities
- 🔮 Advanced analytics/BI dashboards
- 🔮 Team collaboration features (comments, @mentions)
- 🔮 Light mode UI (dark mode is primary for MVP)
- ❌ API for third-party integrations (deferred indefinitely)

### 7.7 Mentor Module (Purpose Discovery)

**Purpose:** Guide users through an interactive journey to define their organizational identity (Purpose, Mantra, Values).

**Operations:**
- **Interactive Chat:** AI Mentor ("Arquiteto de Cultura") guides the user through 8 discovery phases.
- **Identity Crystallization:** Generates final artifacts for Purpose (The Why), Mantra (The Battle Cry), and Values (The How).
- **Materials Library:** Curated educational content (videos/docs) to support the journey.

**Key Features:**
- **Tabbed Dashboard:**
    - **Overview:** Hero section and linear journey progress timeline.
    - **My Identity:** "Calm & Elegant" cards displaying the crystallized identity. Uses specific color palettes (Violet/Amber/Slate) for emotional resonance. support for JSON-structured Values with icons.
    - **Materials:** Netflix-style horizontal scrolling library of resources grouped by category.
- **System Prompting:** Specialized prompts for each phase, utilizing JSON output for structured artifacts.
- **Integration:** Seamlessly connected to the main MAR ecosystem.

**Database Tables:**
- `mentor_conversations` — Chat history and state.
- `mentor_journey_phases` — Phase definitions and system prompts.
- `materials` — Educational resources library.

---

## 5. User Stories

### Client User Stories

1. **As a business owner, I want to use a familiar quiz interface instead of learning AI prompts, so that I can benefit from AI without the learning curve.**
   - Example: Answer 86 questions across 11 modules covering leadership, market, digital presence, finances, and objectives—no prompt engineering required
   - Context: Business owners understand they need AI but lack time/patience to learn chat/prompt interfaces

2. **As a business owner, I want to track my MAR journey progress, so that I know what analyses are complete and what's pending.**
   - Example: See timeline with 16 steps showing "completed", "in progress", "pending" status

3. **As a business owner, I want to review AI-generated analyses before they're finalized, so that I can approve or request changes.**
   - Example: Review behavioral analysis, approve it, then system proceeds to next step

4. **As a business owner, I want to see my strategic plan visualized with charts and infographics, so that I can quickly understand key insights.**
   - Example: View SWOT analysis as interactive diagram, not just text

5. **As a business owner, I want to download my complete strategic plan as a PDF, so that I can share it with my team.**
   - Example: Export 50+ page Manual de Bordo with all analyses and action plans

### Admin User Stories

6. **As an admin, I want to view all active projects and their status, so that I can monitor platform activity.**
   - Example: Dashboard showing 25 active projects, 10 completed, 5 in review

7. **As an admin, I want to review and edit AI-generated content before client sees it, so that I can ensure quality.**
   - Example: Review strategic positioning analysis, make edits, then release to client

8. **As an admin, I want to manage user accounts and permissions, so that I can control platform access.**
   - Example: Create new client account, assign "client_admin" role, set project access

9. **As an admin, I want to view detailed logs of AI agent executions, so that I can debug issues.**
   - Example: See full execution log for "instagram_mining_competitor_a" step that failed

---

## 6. Core Architecture & Patterns

### High-Level Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                      CLIENT BROWSER                          │
│  React 18 + Vite + Tailwind CSS + shadcn/ui                 │
│  (Deployed on Netlify CDN)                                   │
└────────────────────┬────────────────────────────────────────┘
                     │ HTTPS/REST
                     ▼
┌─────────────────────────────────────────────────────────────┐
│                   SUPABASE (BaaS)                            │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │ PostgreSQL   │  │  Auth        │  │ Edge         │      │
│  │ + RLS        │  │  (JWT)       │  │ Functions    │      │
│  └──────────────┘  └──────────────┘  └──────┬───────┘      │
│                                              │               │
└──────────────────────────────────────────────┼──────────────┘
                                               │
                     ┌─────────────────────────┼─────────────┐
                     │                         │             │
                     ▼                         ▼             ▼
            ┌────────────────┐      ┌────────────────┐  ┌────────────┐
            │ Netlify        │      │ OpenAI API     │  │ Perplexity │
            │ Background     │      │ (GPT-4o)       │  │ API        │
            │ Functions      │      │                │  │            │
            │ (Long-running  │      └────────────────┘  └────────────┘
            │  AI tasks)     │               │
            └────────┬───────┘               │
                     │                       │
                     └───────────────────────┘
                                 │
                                 ▼
                        ┌────────────────┐
                        │ Apify          │
                        │ (Instagram     │
                        │  Scraping)     │
                        └────────────────┘
```

### Directory Structure

```
sistema-mar/
├── .agent/                          # AI agent configuration (EXCLUDED from git)
│   ├── reference/                   # Reference documents (PRD, examples)
│   ├── rules/                       # Agent behavior rules
│   └── workflows/                   # Defined workflows
│
├── netlify/
│   └── functions/
│       └── agent-orchestrator-background/  # Long-running AI tasks
│
├── supabase/
│   ├── functions/                   # Edge Functions
│   │   ├── admin-actions/           # Admin operations
│   │   ├── agent-orchestrator/      # AI agent coordination
│   │   └── quiz-webhook/            # Quiz completion webhook
│   ├── migrations/                  # Database schema versions
│   └── sql/                         # SQL utilities
│
├── src/
│   ├── components/                  # React components (137 files)
│   │   ├── admin/                   # Admin-specific components
│   │   ├── quiz/                    # Quiz components
│   │   ├── mar/                     # MAR journey components
│   │   └── ui/                      # shadcn/ui components
│   ├── pages/                       # Route-level components (36 files)
│   │   ├── admin/                   # Admin pages
│   │   ├── Dashboard.tsx            # Client dashboard
│   │   └── Quiz.tsx                 # Quiz interface
│   ├── services/                    # API client services
│   ├── hooks/                       # Custom React hooks
│   ├── utils/                       # Utility functions
│   ├── types/                       # TypeScript type definitions
│   └── integrations/                # Third-party integrations
│
├── System Prompts/                  # AI agent system prompts (38 files)
├── LGPD_COMPLIANCE.md              # Data protection documentation
├── OPERATIONS_RUNBOOK.md           # Operational procedures
└── tasks.md                        # Development task tracking
```

**Note:** Directory structure shown above is representative. Some folders may have been reorganized. Verify against actual project structure.

### Key Design Patterns

- **Multi-Agent Orchestration** — Specialized AI agents for each analysis type (behavioral, segment, website, Instagram, etc.)
- **Agent Orchestration Architecture** — Quiz completion triggers orchestration agent → Background Function → Sequential AI agents
- **Row Level Security (RLS)** — PostgreSQL policies ensure users only access their own data
- **LGPD Data Masking** — Sensitive data (CNPJ, names, financials) anonymized before AI processing
- **Optimistic UI Updates** — Frontend updates immediately, syncs with backend asynchronously
- **Progressive Disclosure** — 16-step journey revealed incrementally as user completes each phase

---

## 7. Features

### 7.1 MAR Diagnostic Quiz

**Purpose:** Capture comprehensive business information through structured questionnaire

**Operations:**
- 86 questions across 11 modules
- Multiple question types: text, radio, checkbox, textarea
- Progress tracking and auto-save
- Conditional logic (questions appear based on previous answers)
- Completion validation

**Key Features:**
- Module-based organization for better UX
- "Other" option with custom text input
- Required vs. optional question handling
- Quiz state persistence across sessions
- Admin can view all quiz responses

**Database Tables:**
- `quiz_modules` — Module definitions
- `quiz_questions` — Question definitions
- `quiz_options` — Answer options
- `quiz_submissions` — User quiz instances
- `quiz_answers` — Individual question responses

### 7.2 AI Agent Orchestration

**Purpose:** Coordinate specialized AI agents to perform 16 distinct analyses

**Agent Types:**
1. **Data Treatment** — Clean and anonymize quiz data (LGPD compliance)
2. **Behavioral Analysis** — Leadership profile assessment
3. **Segment Analysis** — Market analysis (national, regional, local)
4. **Website Audit** — Digital presence analysis
5. **Instagram Audit (Client)** — Social media analysis
6. **Instagram Audit Strategist** — Deep strategic diagnostic (Specialized UI + JSON)
7. **Strategic Pillars (CORA)** — Purpose, values, vision definition
7. **Instagram Mining (Competitors A/B/C)** — Competitor social analysis
8. **Comparative Analysis** — Multi-competitor comparison
9. **Financial Analysis** — Comprehensive corporate financial health diagnostic using advanced SVG visualizations (LTV/CAC trajectory), side-by-side maturity metrics (Process/Management), and probabilistic 12-month projections.
10. **Strategic Positioning** — SWOT, PESTA, Porter, SPACE Matrix
11. **BSC Objectives** — Balanced Scorecard strategic objectives
12. **Branding Strategy** — Brand positioning definitions
13. **Business Strategies** — Commercial tactics and strategies
14. **Marketing Strategies** — Multi-channel marketing tactics

**Key Features:**
- Sequential execution with dependency management
- Variable resolution from quiz answers
- Error handling and retry logic
- Progress tracking and status updates
- Human review checkpoints

**Database Tables:**
- `system_prompts` — AI agent prompt templates
- `project_steps` — Step definitions and status
- `mar_projects` — Project metadata and current step
- Analysis-specific tables (16 tables for different analysis types)

### 7.3 LGPD Compliance & Data Masking

**Purpose:** Protect sensitive business data while enabling AI analysis

**Masking Rules:**
- **CNPJ:** Preserve only area code digits (e.g., "12.345.678/0001-90" → "12.XXX.XXX/XXXX-XX")
- **Company Name:** Deterministic hash (e.g., "Acme Corp" → "COMP_a3f7b2c1")
- **Personal Names:** First name only (e.g., "João Silva" → "João")
- **Financial Data:** Rounded to ranges (e.g., "R$ 1,234,567" → "R$ 1M-5M")

**Key Features:**
- Masking applied before AI API calls
- Original data never sent to OpenAI/Perplexity
- Audit trail of data access
- Encryption in transit (TLS 1.2+) and at rest

**Implementation:**
- Node.js masking functions in Background Functions
- Database functions for secure data retrieval
- RLS policies prevent unauthorized access

### 7.4 Admin Dashboard

**Purpose:** Platform management and oversight

**Operations:**
- View all projects and their status
- User management (create, edit, delete, role assignment)
- Review and edit AI-generated content
- View quiz responses
- Access system logs
- Generate reports

**Key Features:**
- Dark mode UI with modern aesthetics (light mode planned for post-MVP)
- Real-time status updates
- Bulk operations (e.g., approve multiple analyses)
- Audit log of admin actions
- CSV export of quiz responses

**Database Tables:**
- `profiles` — User profiles and roles
- `admin_audit_log` — Admin action tracking
- `system_config` — Platform configuration

### 7.5 Client Dashboard

**Purpose:** Project progress tracking and content access

**Operations:**
- ✅ Gamified progress visualization
- ✅ Standardized Sidebar Navigation (normalized alignment and hover transparency)
- ✅ Step-by-step approval workflow
- Access completed analyses
- Download PDF reports
- Track action plan progress
- Access exclusive materials

**Key Features:**
- Gamified progress visualization
- Step-by-step approval workflow
- Document library
- Visual data representation (charts, infographics)
- Mobile-responsive design

### 7.6 Action Plan Management (Manual de Bordo)

**Purpose:** Deliver actionable SMART plans with multiple visualization options

**Operations:**
- Generate 12+ action plans from AI analysis
- Display in multiple view types (Kanban, Gantt, Calendar, Table)
- Track progress and completion status
- Allow user to edit and customize plans

**Key Features:**
- **Kanban Board** — Drag-and-drop task management
- **Gantt Chart** — Timeline visualization with dependencies
- **Calendar View** — Date-based planning
- **Table View** — Detailed list with filters and sorting
- Export to PDF/CSV

**Database Tables:**
- `action_plans` — Individual action plan items with SMART criteria

---

## 8. Technology Stack

### Frontend

| Component | Technology | Version | Purpose |
|-----------|------------|---------|---------|
| Framework | React | 18.3.1 | UI library |
| Build Tool | Vite | 5.4.1 | Fast dev server & bundler |
| Routing | react-router-dom | 6.26.2 | Client-side routing |
| State Management | TanStack Query | 5.56.2 | Server state management |
| Styling | Tailwind CSS | 3.4.11 | Utility-first CSS |
| UI Components | shadcn/ui | — | Radix UI + Tailwind components |
| Forms | react-hook-form | 7.53.0 | Form state management |
| Validation | Zod | 3.23.8 | Schema validation |
| Charts | Recharts | 2.12.7 | Data visualization |
| PDF Generation | jsPDF | 2.5.2 | Client-side PDF creation |
| Markdown | react-markdown | 10.1.0 | Markdown rendering |
| Icons | lucide-react | 0.462.0 | Icon library |
| Animations | framer-motion | 12.24.0 | Animation library |

### Backend

| Component | Technology | Version | Purpose |
|-----------|------------|---------|---------|
| Database | PostgreSQL | 15.x | Primary data store (Supabase) |
| Auth | Supabase Auth | 2.78.0 | JWT-based authentication |
| Edge Functions | Deno | — | Serverless functions (Supabase) |
| Background Functions | Node.js | 18.x | Long-running tasks (Netlify) |
| ORM | Supabase Client | 2.78.0 | Database queries |

### AI & External Services

| Service | Purpose | API |
|---------|---------|-----|
| OpenAI | GPT-4o for strategic analysis | REST API |
| Perplexity | Market research and web search | REST API |
| Apify | Instagram/social media scraping | REST API |

### Development Tools

| Tool | Purpose |
|------|---------|
| TypeScript | Type safety |
| ESLint | Code linting |
| Git | Version control |
| GitHub | Code repository |
| Netlify | Frontend hosting & functions |
| Supabase | Backend-as-a-Service |

---

## 9. Security & Compliance

### Security Scope

**In Scope:**
- ✅ Row Level Security (RLS) on all sensitive tables
- ✅ JWT-based authentication (Supabase Auth)
- ✅ LGPD-compliant data masking
- ✅ Input validation on all API endpoints
- ✅ SQL injection prevention (Supabase client parameterized queries)
- ✅ CORS configuration
- ✅ API key rotation (quarterly)
- ✅ Encryption in transit (TLS 1.2+) and at rest
- ✅ Rate limiting on webhooks

**Out of Scope:**
- ❌ Penetration testing (deferred to post-MVP)
- ❌ SOC 2 compliance
- ❌ HIPAA compliance
- ❌ Multi-factor authentication (MFA)

### LGPD Compliance (Law No. 13,709/2018)

**Article 6, IX - Data Minimization:**
- Anonymize CNPJ, company names, personal names, financial data
- Only masked data sent to external AI providers

**Article 18 - Data Subject Rights:**
- Users can access their data
- Users can correct inaccurate data
- Users can request data portability
- Users can request data deletion

**Article 33 - International Data Transfer:**
- OpenAI, Supabase, Netlify comply with GDPR/LGPD
- OpenAI API data NOT used for model training

### Configuration

**Environment Variables (Netlify):**
```
VITE_SUPABASE_URL=https://[project].supabase.co
VITE_SUPABASE_ANON_KEY=[anon_key]
SUPABASE_SERVICE_ROLE_KEY=[service_role_key]  # Server-side only
OPENAI_API_KEY=[openai_key]
PERPLEXITY_API_KEY=[perplexity_key]
APIFY_API_KEY=[apify_key]
```

**Supabase Edge Function Secrets:**
```bash
supabase secrets set OPENAI_API_KEY=[key]
supabase secrets set PERPLEXITY_API_KEY=[key]
```

### Deployment

- **Frontend:** Netlify (automatic deploys from `main` branch)
- **Edge Functions:** Supabase (manual deploy via CLI)
- **Background Functions:** Netlify (automatic deploys with frontend)

---

## 10. Database Schema

### Core Tables

**Authentication & Users**
```sql
-- Managed by Supabase Auth
auth.users

-- Extended user profiles
profiles (
  id UUID PRIMARY KEY REFERENCES auth.users,
  full_name TEXT,
  email TEXT UNIQUE,
  role TEXT DEFAULT 'user',  -- 'user', 'client_admin', 'admin'
  company_name TEXT,
  created_at TIMESTAMPTZ,
  updated_at TIMESTAMPTZ
)
```

**Quiz System**
```sql
quiz_modules (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  order_index INTEGER,
  created_at TIMESTAMPTZ
)

quiz_questions (
  id SERIAL PRIMARY KEY,
  module_id INTEGER REFERENCES quiz_modules,
  question_text TEXT NOT NULL,
  question_type TEXT,  -- 'text', 'radio', 'checkbox', 'textarea'
  is_required BOOLEAN DEFAULT false,
  order_index INTEGER
)

quiz_options (
  id SERIAL PRIMARY KEY,
  question_id INTEGER REFERENCES quiz_questions,
  option_text TEXT NOT NULL,
  order_index INTEGER
)

quiz_submissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users,
  user_email TEXT NOT NULL,
  is_complete BOOLEAN DEFAULT false,
  started_at TIMESTAMPTZ,
  completed_at TIMESTAMPTZ
)

quiz_answers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  submission_id UUID REFERENCES quiz_submissions,
  question_id INTEGER REFERENCES quiz_questions,
  answer_text TEXT,
  selected_options INTEGER[],
  user_email TEXT NOT NULL
)
```

**MAR Project System**
```sql
mar_projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users,
  quiz_submission_id UUID REFERENCES quiz_submissions,
  project_name TEXT,
  current_step INTEGER DEFAULT 1,
  status TEXT DEFAULT 'active',  -- 'active', 'completed', 'paused'
  created_at TIMESTAMPTZ,
  updated_at TIMESTAMPTZ
)

project_steps (
  id SERIAL PRIMARY KEY,
  step_key TEXT UNIQUE NOT NULL,
  step_name TEXT NOT NULL,
  step_order INTEGER NOT NULL,
  description TEXT,
  requires_approval BOOLEAN DEFAULT false,
  estimated_duration_minutes INTEGER
)

system_prompts (
  id SERIAL PRIMARY KEY,
  step_key TEXT REFERENCES project_steps(step_key),
  api_provider TEXT,  -- 'openai_chat', 'perplexity'
  prompt_content TEXT NOT NULL,
  model_name TEXT,
  temperature NUMERIC,
  max_tokens INTEGER
)

mar_step_status (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID REFERENCES mar_projects,
  step_key TEXT REFERENCES project_steps(step_key),
  status TEXT DEFAULT 'pending',  -- 'pending', 'processing', 'completed', 'failed'
  started_at TIMESTAMPTZ,
  completed_at TIMESTAMPTZ,
  error_message TEXT,
  output_data JSONB
)
```

**Analysis Result Tables (14 tables)**
```sql
behavioral_analysis (
  id UUID PRIMARY KEY,
  project_id UUID REFERENCES mar_projects,
  profile_type TEXT,
  strengths JSONB,
  development_areas JSONB,
  leadership_style TEXT,
  created_at TIMESTAMPTZ
)

instagram_analysis (
  id UUID PRIMARY KEY,
  project_id UUID REFERENCES mar_projects,
  structured_data JSONB,
  markdown_content TEXT,
  created_at TIMESTAMPTZ,
  updated_at TIMESTAMPTZ
)

digital_presence_analysis (
  id UUID PRIMARY KEY,
  project_id UUID REFERENCES mar_projects,
  website_score INTEGER,
  instagram_score INTEGER,
  recommendations JSONB,
  created_at TIMESTAMPTZ
)

-- ... (12 more analysis tables)
```

### RLS Policies

**Example: profiles table**
```sql
-- Users can view their own profile
CREATE POLICY "Users can view own profile"
  ON profiles FOR SELECT
  USING (auth.uid() = id);

-- Admins can view all profiles
CREATE POLICY "Admins can view all profiles"
  ON profiles FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );
```

---

## 11. API Specification

### Supabase Edge Functions

#### 1. agent-orchestrator

**Purpose:** Coordinate AI agent execution for MAR steps

**Endpoint:** `POST /functions/v1/agent-orchestrator`

**Request:**
```json
{
  "projectId": "uuid",
  "stepKey": "behavioral_analysis",
  "userId": "uuid"
}
```

**Response:**
```json
{
  "success": true,
  "stepKey": "behavioral_analysis",
  "status": "completed",
  "output": { /* analysis results */ }
}
```

#### 2. quiz-webhook

**Purpose:** Trigger Make.com workflow on quiz completion

**Endpoint:** `POST /functions/v1/quiz-webhook`

**Request:**
```json
{
  "submissionId": "uuid",
  "userId": "uuid"
}
```

**Response:**
```json
{
  "success": true,
  "webhookSent": true,
  "projectCreated": true,
  "projectId": "uuid"
}
```

#### 3. admin-actions

**Purpose:** Admin operations (user management, content editing)

**Endpoint:** `POST /functions/v1/admin-actions`

**Request:**
```json
{
  "action": "update_user_role",
  "userId": "uuid",
  "newRole": "client_admin"
}
```

### Netlify Background Functions

#### agent-orchestrator-background

**Purpose:** Long-running AI analysis tasks (>10 seconds)

**Invocation:** Triggered by agent orchestrator after quiz completion

**Process:**
1. Fetch quiz data from Supabase
2. Mask sensitive data (LGPD compliance)
3. Execute AI agents sequentially
4. Store results in analysis tables
5. Update project step status

---

## 12. Success Criteria

### MVP Success Definition

The MVP is successful when:
1. A client can complete the 86-question quiz
2. Quiz completion triggers automated AI analysis
3. Client can view 16 analysis results in their dashboard
4. Admin can review and approve AI-generated content
5. Client can download complete strategic plan as PDF
6. All data processing is LGPD-compliant
7. Platform maintains $0/month infrastructure cost

### Functional Requirements

- ✅ Multi-user authentication with role-based access
- ✅ 86-question quiz with 11 modules
- ✅ AI agent orchestration system
- ✅ 16-step AI analysis journey
- ✅ LGPD-compliant data masking
- ✅ Admin dashboard with full visibility
- ✅ Client dashboard with progress tracking
- ✅ PDF report generation
- 🔄 Data visualization (charts, infographics)
- 🔄 Gamified UX elements

### Quality Indicators

- **Performance:** Page load <2s for Brazil-based users
- **Reliability:** 99% uptime (Netlify/Supabase SLA)
- **Security:** No LGPD violations, quarterly key rotation
- **UX:** <5% quiz abandonment rate
- **AI Quality:** >80% client satisfaction with AI analyses (post-human review)

---

## 13. Implementation Phases

### Phase 1: Foundation (COMPLETED)

**Goal:** Core platform infrastructure

### Phase 2: Report Optimization (IN PROGRESS)

**Current Milestone:** Standardizing report outputs (Markdown → JSON) and UI (Premium SaaS aesthetics).
- ✅ Instagram Audit Strategist (Complete)
- 🔄 Objetivos Estratégicos (Next)
- 🔮 Análise Financeira, Branding, Estratégias de Negócio, Estratégias de Marketing (Roadmap)

**Deliverables:**
- ✅ Supabase project setup (PostgreSQL, Auth, RLS)
- ✅ React + Vite frontend scaffolding
- ✅ User authentication and authorization
- ✅ Basic admin dashboard
- ✅ Database schema (60+ migrations)

**Validation:** Users can sign up, log in, access role-appropriate dashboards

---

### Phase 2: Quiz System (COMPLETED)

**Goal:** Functional diagnostic questionnaire

**Deliverables:**
- ✅ Quiz module and question management
- ✅ 86-question MAR quiz implementation
- ✅ Quiz progress tracking and auto-save
- ✅ Quiz completion logic
- ✅ Admin quiz response viewer
- ✅ CSV export of responses

**Validation:** Client can complete quiz, admin can view responses

---

### Phase 3: AI Agent Orchestration (COMPLETED)

**Goal:** Automated AI analysis pipeline

**Deliverables:**
- ✅ System prompts for 14 analysis types
- ✅ Agent orchestrator Edge Function
- ✅ Background Function for long-running tasks
- ✅ LGPD data masking implementation
- ✅ Variable resolution from quiz answers
- ✅ Error handling and retry logic
- ✅ Project step status tracking

**Validation:** Quiz completion triggers AI agents, results stored in database

---

### Phase 4: Client Experience (IN PROGRESS)

**Goal:** Polished client-facing features

**Deliverables:**
- 🔄 MAR journey timeline visualization
- 🔄 Step-by-step approval workflow
- 🔄 Data visualization (charts, infographics)
- 🔄 Gamified progress indicators
- ✅ PDF report generation
- 🔄 Document library
- 🔄 Mobile-responsive design refinement

**Validation:** Client can navigate journey, approve steps, download reports

---

### Phase 5: Integrations (PLANNED)

**Goal:** Connect to Crie Valor ecosystem

**Deliverables:**
- ⏳ Lumia integration (24/7 AI consultants)
- ⏳ Mentor de Propósito integration
- ⏳ Enhanced Make.com workflows
- ⏳ Social media analysis (LinkedIn, TikTok, X)

**Validation:** Clients can access Lumia from MAR dashboard, purpose discovery integrated

---

### Phase 6: Polish & Scale (PLANNED)

**Goal:** Production-ready platform

**Deliverables:**
- ⏳ Performance optimization (lazy loading, code splitting)
- ⏳ Comprehensive error handling and user feedback
- ⏳ Analytics and monitoring (PostHog, Sentry)
- ⏳ User onboarding flow
- ⏳ Help documentation and tooltips
- ⏳ A/B testing framework

**Validation:** Platform handles 100+ concurrent users, <2s page loads

---

## 14. Risks & Mitigations

| Risk | Impact | Probability | Mitigation |
|------|--------|-------------|------------|
| **AI hallucinations in strategic advice** | High — Incorrect advice damages client trust | Medium | Human consultant review before final delivery; prompt engineering to reduce hallucinations; client approval checkpoints |
| **Exceeding free tier limits** | High — Infrastructure costs violate $0 budget | Medium | Monitor usage dashboards; implement rate limiting; optimize function execution time; cache AI responses |
| **LGPD compliance breach** | Critical — Legal liability, reputational damage | Low | Rigorous data masking; regular compliance audits; clear data retention policies; legal review |
| **Quiz abandonment** | Medium — Lost leads, poor conversion | Medium | Progress auto-save; shorter modules; estimated time indicators; ability to pause and resume |
| **AI API downtime** | Medium — Delays in analysis delivery | Low | Retry logic with exponential backoff; fallback to alternative providers; clear user communication |
| **Scope creep** | High — Delays MVP, increases complexity | High | Strict adherence to PRD; defer features to post-MVP; regular scope reviews |
| **Database performance degradation** | Medium — Slow queries, poor UX | Medium | Proper indexing; query optimization; RLS policy review; connection pooling |
| **Complexity management** | High — Codebase becomes unmaintainable | High | **THIS PRD**, modular architecture; code reviews; refactoring sprints; comprehensive documentation |

---

## 15. Development Workflow & Best Practices

### Workflow Principles

1. **Atomic Execution** — Focus on one Task ID at a time, avoid merging multiple tasks
2. **Verification First** — Verify Supabase schema before writing code, never guess column names
3. **Local-First Logic** — Prefer Netlify-compatible Node.js, avoid Kubernetes/heavy cloud dependencies
4. **Strict Context Limit** — Never re-read unchanged files, refer to task.md for previous context
5. **Documentation First** — Maintain PRD.md and task.md as source of truth for project scope and progress
6. **Verification Mandatory** — Run verification commands before marking tasks complete

### Code Organization

**Component Structure:**
```
components/
├── admin/           # Admin-only components
├── quiz/            # Quiz-specific components
├── mar/             # MAR journey components
├── ui/              # Reusable UI components (shadcn/ui)
└── shared/          # Shared utilities
```

**Service Layer:**
```typescript
// src/services/marService.ts
export const marService = {
  async getProject(projectId: string) { /* ... */ },
  async updateStepStatus(projectId: string, stepKey: string, status: string) { /* ... */ },
  async getAnalysisResults(projectId: string, stepKey: string) { /* ... */ }
}
```

**Type Safety:**
```typescript
// src/types/mar.ts
export interface MARProject {
  id: string;
  user_id: string;
  quiz_submission_id: string;
  project_name: string;
  current_step: number;
  status: 'active' | 'completed' | 'paused';
  created_at: string;
  updated_at: string;
}
```

### Testing Strategy

**Current State:** Limited automated testing (focus on manual QA)

**Planned:**
- Unit tests for utility functions (data masking, formatting)
- Integration tests for API endpoints
- E2E tests for critical flows (quiz completion, project creation)
- Visual regression tests for UI components

### Documentation Standards

**Code Comments:**
- Use JSDoc for functions with complex logic
- Explain "why" not "what" (code should be self-documenting)
- Document LGPD compliance points

**Markdown Files:**
- `README.md` — Project overview, setup instructions
- `LGPD_COMPLIANCE.md` — Data protection documentation
- `OPERATIONS_RUNBOOK.md` — Incident response, maintenance
- `tasks.md` — Development task tracking
- **`PRD.md` (this document)** — Product requirements

---

## 16. Future Considerations

### Post-MVP Enhancements

**User Experience:**
- Real-time collaboration (multiple users on same project)
- In-app chat with Crie Valor consultants
- Customizable dashboard layouts
- Dark/light mode toggle
- Accessibility improvements (WCAG 2.1 AA)

**AI Capabilities:**
- Custom AI agents per industry vertical
- Continuous learning from consultant feedback
- Predictive analytics (forecast business outcomes)
- Automated action plan progress tracking

**Platform Features:**
- Team workspaces (multiple users per company)
- Project templates for common scenarios
- Integration marketplace (Zapier, Integromat)
- Public API for third-party developers
- White-label/reseller program

**Analytics & Insights:**
- Benchmarking against industry peers
- ROI tracking for implemented strategies
- Sentiment analysis of client feedback
- Usage analytics dashboard for admins

### Technical Improvements

**Performance:**
- Edge caching for static content
- GraphQL API for flexible queries
- WebSocket for real-time updates
- Progressive Web App (PWA) support

**Infrastructure:**
- Multi-region deployment for lower latency
- Database read replicas for scaling
- CDN for media assets
- Automated backup and disaster recovery

**Developer Experience:**
- Storybook for component documentation
- Automated E2E testing in CI/CD
- Feature flags for gradual rollouts
- Staging environment for testing

---

## 17. Appendix

### Key Dependencies

**Frontend:**
- [React Documentation](https://react.dev/)
- [Vite Documentation](https://vitejs.dev/)
- [Tailwind CSS Documentation](https://tailwindcss.com/)
- [shadcn/ui Components](https://ui.shadcn.com/)
- [TanStack Query Documentation](https://tanstack.com/query/latest)

**Backend:**
- [Supabase Documentation](https://supabase.com/docs)
- [Netlify Functions Documentation](https://docs.netlify.com/functions/overview/)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)

**AI & APIs:**
- [OpenAI API Documentation](https://platform.openai.com/docs)
- [Perplexity API Documentation](https://docs.perplexity.ai/)
- [Apify Documentation](https://docs.apify.com/)

### Glossary

- **MAR** — Mapa para Alto Rendimento (High-Performance Map)
- **LGPD** — Lei Geral de Proteção de Dados (Brazilian GDPR)
- **RLS** — Row Level Security (PostgreSQL security feature)
- **BSC** — Balanced Scorecard (strategic management framework)
- **SWOT** — Strengths, Weaknesses, Opportunities, Threats
- **PESTA** — Political, Economic, Social, Technological, Environmental Analysis
- **ICP** — Ideal Customer Profile
- **BaaS** — Backend-as-a-Service
- **Edge Function** — Serverless function running on Supabase edge network
- **Background Function** — Long-running serverless function on Netlify

### Contact & Support

- **Developer:** Helder Domingues
- **Company:** Crie Valor Inteligência Organizacional
- **Repository:** [GitHub - sistema-mar](https://github.com/helderdomingues/sistema-mar)
- **Production URL:** https://crievalor.com.br/mar

---

**Document Version:** 1.0  
**Last Updated:** 2026-01-14  
**Status:** Living Document (update as project evolves)
