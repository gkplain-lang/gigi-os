# Gigi OS — Roadmap

> **Start simple. Become powerful.**

Version: `0.1`  
Status: Product Roadmap  
Owner: Germain Caplain  
Purpose: Define the build sequence of Gigi OS from documentation to daily-use product.

---

# 1. Purpose

This roadmap defines how Gigi OS should be built over time.

The goal is to avoid building too much too early.

Gigi OS must become powerful step by step.

The first objective is not to create a full AI operating system.

The first objective is to prove one thing:

> **Gigi OS can help the user know what to do next.**

Everything else comes later.

---

# 2. Roadmap Philosophy

Gigi OS must be built in layers.

Each version must answer a specific question.

```text
V0.1 — Do we understand the product?
V0.2 — Can we show the experience?
V0.3 — Can the decision engine work?
V0.4 — Can the app remember?
V0.5 — Can AI improve the system?
V1.0 — Can the user use it every day?
```

No phase should be skipped.

---

# 3. Product Stages

## Stage 1 — Foundation

Documentation, vision, rules, architecture.

## Stage 2 — Static Prototype

A visual prototype with mock data.

## Stage 3 — Functional MVP

A working local app with real interactions.

## Stage 4 — Persistent MVP

Database, login and saved user data.

## Stage 5 — AI-Assisted MVP

AI helps generate missions, explanations and summaries.

## Stage 6 — Daily Operating System

A stable version used every day.

## Stage 7 — Integrations

GitHub, Gmail, Calendar, Drive, n8n, Stripe.

## Stage 8 — SaaS Product

Multi-user version for entrepreneurs and builders.

---

# 4. Version Overview

```text
V0.1 — Documentation
V0.2 — Static UI Prototype
V0.3 — Local Functional MVP
V0.4 — Supabase MVP
V0.5 — AI-Assisted MVP
V0.6 — Agents Foundation + Daily Review System
V0.7 — Automation Preparation
V0.8 — Integrations Alpha
V0.9 — Private Beta
V1.0 — Daily Use Release
V1.1 — Daily Use Improvements
V1.2 — Visual Polish
V1.2.1 — Accent Dim Fix
V1.3 — Daily Use Refinement
V1.4 — Onboarding & First Run
V1.6 — Project Detail & Mission Suggestions
V1.7 — Action Plan Builder
V2.0 — Multi-user SaaS
```

---

# 5. V0.1 — Documentation

## Goal

Create the full product foundation before coding.

## Core Question

```text
Do we know exactly what Gigi OS is supposed to become?
```

## Required Documents

```text
README.md
docs/MASTER_PRD.md
docs/DECISION_ENGINE.md
docs/MISSION_SYSTEM.md
docs/PROJECT_MODEL.md
docs/MEMORY_SYSTEM.md
docs/UX_FLOWS.md
docs/DESIGN_SYSTEM.md
docs/ARCHITECTURE.md
docs/ROADMAP.md
```

## Optional Documents

```text
docs/MVP_SPEC.md
docs/CURSOR_BUILD_PLAN.md
docs/DATA_MODEL.md
docs/AI_MODULES.md
docs/AUTOMATION_SYSTEM.md
```

## Acceptance Criteria

V0.1 is complete when:

- the product vision is clear;
- the MVP scope is defined;
- the architecture is defined;
- the decision engine is specified;
- the mission system is specified;
- Cursor can understand what to build;
- no code has been written too early.

## Out of Scope

```text
No app
No database
No AI
No integrations
No automations
```

---

# 6. V0.2 — Static UI Prototype

## Goal

Create the first visible version of Gigi OS.

## Core Question

```text
Can the user understand the value of Gigi OS in less than 10 seconds?
```

## Features

```text
Mission screen
Projects screen
Brain screen
History screen
AppShell
Navigation
Mock data
Premium dark design
```

## Required Screens

```text
/
Mission screen

/projects
Projects screen

/brain
Brain screen

/history
History screen
```

## Data

Use mock data only.

Initial mock projects:

```text
Buildy Clear
Buildy Crafts
Linko
1Millimètre
Le Dernier Souvenir
Gigi OS
```

## No Functional Requirements Yet

The user does not need to create projects yet.

The user does not need to save data yet.

The goal is visual and experiential.

## Acceptance Criteria

V0.2 is complete when:

- the app visually looks like Gigi OS;
- the Mission screen feels like the center of the product;
- the user sees one clear recommended mission;
- project cards are readable;
- the Brain screen explains the recommendation;
- the History screen shows mock progress;
- the app does not feel like a generic todo app.

## Out of Scope

```text
No database
No authentication
No AI calls
No real persistence
No external APIs
No payments
```

---

# 7. V0.3 — Local Functional MVP

## Goal

Make Gigi OS work locally with real product logic.

## Core Question

```text
Can Gigi OS recommend a mission from project data?
```

## Features

```text
Create project
Edit project
Update progress
Set next action
Run decision engine
Generate mission recommendation
Start mission
Complete mission
Postpone mission
Reject mission
Create local history events
```

## Storage

Use:

```text
React state
localStorage
mock fixtures
```

No Supabase yet.

## Decision Engine

The Decision Engine must:

```text
read active projects
score missions
rank missions
select one mission
explain the choice
show alternatives
```

## Mission System

The Mission System must:

```text
start mission
enter Mission Mode
complete mission
postpone mission
reject mission
record feedback
```

## Acceptance Criteria

V0.3 is complete when:

- the user can create and edit projects;
- the app can recommend one mission;
- the mission can be started;
- Mission Mode works;
- mission completion creates a history event;
- rejected missions are remembered locally;
- the Brain screen uses real scoring logic;
- the app still feels simple.

## Out of Scope

```text
No login
No cloud database
No AI API
No Gmail
No Calendar
No GitHub
No n8n
```

---

# 8. V0.4 — Supabase MVP

## Goal

Add real persistence.

## Core Question

```text
Can Gigi OS remember user data across sessions?
```

## Features

```text
Supabase setup
Authentication
User profile
Projects table
Missions table
Decision records
History events
Memory records
Settings
```

## Database Tables

```text
profiles
projects
missions
mission_steps
decisions
decision_scores
history_events
memories
blockers
user_settings
```

## Requirements

The user must be able to:

```text
log in
create projects
save projects
complete missions
see history after refresh
store decision explanations
store North Star
```

## Security

Add:

```text
Row Level Security
user ownership
protected data access
environment variables
server-side secrets
```

## Acceptance Criteria

V0.4 is complete when:

- user data persists;
- each user sees only their data;
- missions and history survive refresh;
- Decision Engine works with database data;
- project state remains consistent;
- Supabase is integrated cleanly.

## Out of Scope

```text
No AI agents
No external integrations
No payments
No team accounts
```

---

# 9. V0.5 — AI-Assisted MVP

> **V0.5.0 (foundation)** — voir `docs/AI_BRAIN_FOUNDATION.md` pour l'implémentation actuelle : module `modules/ai/`, fallback local obligatoire, route `/api/ai/brain`, page `/dev/ai`.

> **V0.5.2 (memory context)** — voir `docs/AI_MEMORY_CONTEXT.md` : contexte mémoire borné injecté dans le prompt IA, sans sync/restore automatique.

> **V0.5.3 (decision quality)** — voir `docs/AI_DECISION_QUALITY.md` : contrat de décision structuré (mission + 3 tâches + ignorer + risque + prochaine étape).

> **V0.5.4 (execution loop)** — voir `docs/MISSION_EXECUTION_LOOP.md` : boucle d'exécution mission (démarrer, terminer, reporter, historique enrichi).

> **V0.6.0 (agents foundation)** — voir `docs/AGENTS_FOUNDATION.md` : agents contrôlés en dry-run, niveau max `level_1_prepare_only`, aucune exécution externe.

> **V0.6.1 (daily review)** — voir `docs/DAILY_REVIEW_SYSTEM.md` : revue quotidienne read-only depuis localStorage, signaux, projets stale, blocages.

> **V0.6.2 (action confirmation UX)** — voir `docs/ACTION_CONFIRMATION_UX.md` : confirmation dry-run des Action Proposals, aucune exécution réelle.

## Goal

Add AI carefully to improve clarity and usefulness.

## Core Question

```text
Can AI improve Gigi OS without making it unpredictable?
```

## AI Features

```text
AI mission wording
AI decision explanation
AI project summary
AI blocker detection
AI next action suggestions
AI weekly summary draft
```

## AI Rules

AI must not silently change:

```text
project status
priority
mission status
history
memory
settings
```

AI can suggest.

The user or deterministic logic decides.

## Prompt Modules

Suggested files:

```text
modules/ai/prompts/missionGeneration.ts
modules/ai/prompts/decisionExplanation.ts
modules/ai/prompts/projectSummary.ts
modules/ai/prompts/blockerDetection.ts
```

## Acceptance Criteria

V0.5 is complete when:

- AI improves explanations;
- AI can suggest clearer missions;
- AI can summarize project state;
- deterministic scoring remains the source of truth;
- the user understands what AI changed;
- the system still works without AI.

## Out of Scope

```text
No autonomous agents
No background work
No Gmail
No Calendar
No GitHub automation
```

---

# 10. V0.6 — Agents Foundation + Daily Review System

> **V0.6.0 (agents foundation)** — voir `docs/AGENTS_FOUNDATION.md` : propositions d'action dry-run, garde-fous, pas de n8n ni d'exécution externe.

> **V0.6.1 (daily review)** — voir `docs/DAILY_REVIEW_SYSTEM.md` : bilan matinal read-only, projets stale, blocages, mission du jour.

> **V0.6.2 (action confirmation UX)** — voir `docs/ACTION_CONFIRMATION_UX.md` : UX de confirmation pour proposals dry-run, exécution réelle désactivée.

## Goal (V0.6.1 — Daily Review)

Make Gigi OS useful every morning.

## Core Question

```text
Can Gigi OS prepare the user’s day?
```

## Features

```text
Daily mission
Daily review
Yesterday summary
Open blockers
Stale project detection
Mission streak
Recommended focus
```

## Daily Review Output

Example:

```text
Good morning.

Yesterday:
You completed docs/ARCHITECTURE.md.

Today:
The best mission is docs/ROADMAP.md.

Why:
Gigi OS documentation is close to being ready for Cursor.
```

## Acceptance Criteria

V0.6 is complete when:

- the user receives a clear daily mission;
- the app summarizes recent progress;
- blockers are visible;
- stale projects are detected;
- the daily view feels useful and not overwhelming.

---

# 11. V0.7 — Automation Preparation

## Goal

Prepare controlled automation architecture without connecting external systems.

## Core Question

```text
Can Gigi recognize automation requests and produce safe dry-run plans?
```

## Features

```text
Automation module (modules/automation/)
Automation Proposal (dry-run only)
Intent detection (schedule, triggers, surveillance)
Integration with Action Proposals V0.6
AutomationProposalCard in /conversation
Dev page /dev/automation
Documentation (AUTOMATION_PREPARATION.md)
```

## Not Yet Connected

Do not connect:

```text
Gmail
Calendar
GitHub
Drive
n8n
Stripe
Supabase sync/restore (automatic)
```

The goal is architecture preparation only — plans, permissions, risks, confirmation UX.

## Acceptance Criteria

V0.7 is complete when:

- automation requests produce Automation Proposals (dry-run);
- forbidden real automations are blocked with clear messaging;
- action vs automation routing works in the AI pipeline;
- /conversation displays triggers, permissions, steps, and risks;
- /dev/automation documents available and forbidden automations;
- npm run build passes;
- no external API calls, no n8n, no real scheduling.

See [AUTOMATION_PREPARATION.md](./AUTOMATION_PREPARATION.md) for full details.

---

# 12. V0.8 — Integrations Alpha

## Goal

Prepare controlled external integrations with GitHub as first candidate — dry-run only by default.

## Core Question

```text
Can Gigi produce safe GitHub integration plans without calling external APIs?
```

## Features

```text
Integration module (modules/integrations/)
GitHub alpha submodule (dry-run plans)
IntegrationProposal in AI pipeline
IntegrationProposalCard in /conversation
Dev page /dev/integrations
Documentation (INTEGRATIONS_ALPHA.md)
```

## Not Yet Connected

Do not connect or execute:

```text
GitHub API (real calls)
git commit / push / merge (real)
Gmail
Calendar
n8n
Supabase sync/restore (automatic)
```

GitHub status in V0.8: dry_run_only (default).

## Acceptance Criteria

V0.8 is complete when:

- GitHub requests produce Integration Proposals (dry-run);
- forbidden real GitHub actions are blocked with clear messaging;
- Action + Automation + Integration proposals work together;
- /dev/integrations documents dry-run and blocked actions;
- npm run build passes;
- no external API calls, no real git operations.

See [INTEGRATIONS_ALPHA.md](./INTEGRATIONS_ALPHA.md) for full details.

---

# 13. V0.9 — Private Beta Readiness

## Goal

Prepare Gigi OS for a private, invite-only beta — stable, secure, dry-run guardrails intact.

## Core Question

```text
Is Gigi OS ready for a small group of testers without real external execution?
```

## Features

```text
Beta module (modules/beta/)
Private beta checklist (16 items)
Module health dashboard
Local feedback system (localStorage)
/dev/beta readiness page
/feedback for testers
Documentation (PRIVATE_BETA_READINESS.md)
```

## Not Activated in V0.9

```text
Real GitHub API
Real n8n / agents
Gmail / Calendar
Auto Supabase sync/restore
Public landing / payment
External feedback API
```

## Acceptance Criteria

V0.9 is complete when:

- all critical routes work;
- /dev/beta shows checklist and guardrails;
- local feedback works without external send;
- dry-run guardrails from V0.6–V0.8 remain enforced;
- npm run build passes;
- no real external actions by default.

See [PRIVATE_BETA_READINESS.md](./PRIVATE_BETA_READINESS.md) for full details.

---

# 14. V1.0 — Daily Use Release

## Goal

Release the first stable version for daily use — clarity and reliability, not new external powers.

## Core Question

```text
Can the user open Gigi every morning and know what to do next?
```

## Promise

```text
Ouvre Gigi. Sache quoi faire. Exécute.
```

## Features

```text
Release module (modules/release/)
Daily use checklist (18 items)
/dev/release readiness page
DailyUseStrip on home (/)
All V0.6–V0.9 guardrails preserved
Documentation (V1_DAILY_USE_RELEASE.md)
```

## Not in V1.0

```text
Real integrations, n8n, public landing, payment
Auto Supabase sync/restore
Major design redesign
```

## Acceptance Criteria

V1.0 is complete when:

- / shows mission + daily use strip;
- all critical routes work;
- /dev/release documents checklist and guardrails;
- dry-run guardrails remain enforced;
- npm run build passes.

See [V1_DAILY_USE_RELEASE.md](./V1_DAILY_USE_RELEASE.md) for full details.

---

# 15. V1.1 — Daily Use Improvements

## Goal

Polish daily UX — clearer next actions, natural conversation, accessible feedback — without new external powers.

## Core Question

```text
Does the user immediately know what to do and feel confident nothing runs externally?
```

## Features

```text
Daily use module (modules/dailyUse/)
Improved DailyUseStrip (next action, simulation badge)
Conversation ?ask= deep link for daily review
Clearer empty states (history)
Simplified page meta copy
Feedback page polish (no dev link)
Documentation (V1_1_DAILY_USE_IMPROVEMENTS.md)
```

## Not in V1.1

```text
Real integrations, n8n, public landing, payment
Auto Supabase sync/restore
Major design redesign
New external capabilities
```

## Acceptance Criteria

V1.1 is complete when:

- / shows clearer next action and simulation note;
- /conversation supports daily review deep link;
- empty history state is helpful;
- /feedback is easier to find and use;
- dry-run guardrails remain enforced;
- npm run build passes.

See [V1_1_DAILY_USE_IMPROVEMENTS.md](./V1_1_DAILY_USE_IMPROVEMENTS.md) for full details.

---

# 16. V1.3 — Daily Use Refinement

## Goal

Refine daily UX on stable V1.2.1 — clearer copy, empty states, CTA labels, simulation messaging — without new powers or design changes.

## Core Question

```text
Does the user immediately know what to do now, on every daily page?
```

## Features

```text
Daily use refinement module (modules/dailyUseRefinement/)
Refined page meta and mission CTA labels
Feedback page integrated in AppShell
Improved empty states (history, conversation, feedback)
Clearer simulation / dry-run messaging
Documentation (V1_3_DAILY_USE_REFINEMENT.md)
```

## Not in V1.3

```text
Palette or design changes
Real integrations, n8n, payment, landing
New external capabilities
Heavy new architecture
```

## Acceptance Criteria

V1.3 is complete when:

- daily pages have clearer, shorter copy;
- empty states guide the user;
- /feedback matches app shell consistency;
- dry-run guardrails remain enforced;
- npm run build passes.

See [V1_3_DAILY_USE_REFINEMENT.md](./V1_3_DAILY_USE_REFINEMENT.md) for full details.

---

# 17. V1.4 — Onboarding & First Run

## Goal

Guide first-time users from “I don't know what to do” to “Gigi knows my projects and proposes a first mission.”

## Core Question

```text
Does a new user understand Gigi and get a first mission in under 2 minutes?
```

## Features

```text
Onboarding module (modules/onboarding/)
Five-step wizard at /onboarding (welcome, projects, goals, work style, first mission)
Local-only storage in gigi-os-v03-state (onboarding field)
Discrete banner on / when onboarding incomplete
Sidebar link "Premiers pas" when incomplete
First mission via local decision engine or /conversation?ask=
Legacy users auto-complete onboarding (soft migration)
Dev diagnostics at /dev/onboarding
Documentation (ONBOARDING_FIRST_RUN.md)
```

## Not in V1.4

```text
SaaS, payment, public landing
Real integrations (n8n, GitHub, Gmail, Calendar)
Automatic Supabase sync or restore
Palette or design overhaul
Account required
```

## Acceptance Criteria

V1.4 is complete when:

- new users can complete onboarding locally;
- completed onboarding hides banner and sidebar link;
- first mission works without OpenAI (local fallback);
- existing users are not forced through onboarding;
- dry-run guardrails remain enforced;
- npm run build passes.

See [ONBOARDING_FIRST_RUN.md](./ONBOARDING_FIRST_RUN.md) for full details.

---

# 18. V1.6 — Project Detail & Mission Suggestions

## Goal

Make `/projects` actionable: each project opens a detail view with local mission suggestions and a recommended next action.

## Core Question

```text
When I open a project, do I immediately know what to do on it today?
```

## Features

```text
Clickable project cards on /projects
Dynamic route /projects/[projectId]
Local mission catalog (modules/projectMissions/)
Recommended next action (action, why now, can ignore)
Deep-link "Demander à Gigi" → /conversation?ask=
Mission dry-run: "Préparer comme mission" / "Demander à Gigi de la choisir"
Project not-found state
Documentation (PROJECT_DETAIL_MISSION_SUGGESTIONS.md)
```

## Not in V1.6

```text
Automatic mission application
AI-generated missions
Supabase sync or restore
External API calls
New localStorage keys
n8n, GitHub, payments, landing
```

## Acceptance Criteria

V1.6 is complete when:

- projects are clickable from `/projects`;
- detail page shows context, score, missions, and next action;
- Gigi deep-links work without modifying state;
- unknown projectId shows clean not-found;
- npm run build passes (28+ routes).

See [PROJECT_DETAIL_MISSION_SUGGESTIONS.md](./PROJECT_DETAIL_MISSION_SUGGESTIONS.md) for full details.

---

# 19. V1.7 — Action Plan Builder

## Goal

Turn mission suggestions into structured, executable action plans — preparation only, no real execution.

## Core Question

```text
When the user asks how to execute a mission, does Gigi show a clear step-by-step plan?
```

## Features

```text
Local action plan module (modules/actionPlans/)
Plans per project/mission with steps, deliverables, risks
Dry-run prepared actions (cursor prompt, checklist, branch plan, …)
Project detail plan section + ?plan=missionId query param
"Préparer le plan" button on mission cards
Conversation intent detection for plan requests
Documentation (ACTION_PLAN_BUILDER.md)
```

## Not in V1.7

```text
Real execution (files, Git, agents, n8n)
Automatic mission application
AI-generated plans (optional later)
Supabase sync or restore
New localStorage keys
Payments, landing
```

## Acceptance Criteria

V1.7 is complete when:

- project detail shows action plan for recommended mission;
- ?plan=missionId selects a specific plan;
- conversation recognizes "avance [project]" and plan requests;
- all prepared actions show dry-run + validation required;
- npm run build passes.

See [ACTION_PLAN_BUILDER.md](./ACTION_PLAN_BUILDER.md) for full details.

---

# 20. V2.0 — SaaS Version

## Goal

Turn Gigi OS into a product for other entrepreneurs.

## Core Question

```text
Can Gigi OS become a business?
```

## Features

```text
public landing page
pricing
Stripe payments
multi-user accounts
onboarding templates
project templates
AI usage limits
billing dashboard
support system
feedback loop
```

## Possible Pricing

To define later.

Example:

```text
Free plan
Pro plan
Founder plan
Team plan
```

## Acceptance Criteria

V2.0 is complete when:

- users can sign up;
- users can pay;
- onboarding works;
- Gigi OS can serve multiple users;
- the product has a clear positioning;
- the business model is testable.

---

# 18. Future Versions

## V3.0 — Agent Team

Gigi OS gains specialized AI modules:

```text
CEO
Developer
Designer
Marketing
Business
Finance
Legal
Research
Automation
```

## V4.0 — Automation OS

Gigi OS connects to:

```text
n8n
GitHub
Gmail
Google Calendar
Google Drive
Slack
Telegram
Stripe
```

## V5.0 — Voice Operating System

The user can talk to Gigi.

Example:

```text
Gigi, I have two hours. What should I do?
```

Gigi answers with a mission and prepares the workspace.

## V6.0 — Company OS

Gigi OS becomes a complete operating system for small AI-driven companies.

---

# 19. Priority Rules

When deciding what to build next, use these rules.

## Rule 1

Build only what improves decisions or execution.

## Rule 2

Do not add integrations before the core product works.

## Rule 3

Do not add AI before deterministic logic works.

## Rule 4

Do not add dashboards before the Mission screen is excellent.

## Rule 5

Do not build for many users before it works for one user.

## Rule 6

Do not make Gigi OS complex to look impressive.

## Rule 7

The product must stay calm and focused.

---

# 20. Current Phase

Current phase:

```text
V0.1 — Documentation
```

Current objective:

```text
Complete the core documentation before opening Cursor for development.
```

Current completed documents:

```text
README.md
MASTER_PRD.md
DECISION_ENGINE.md
MISSION_SYSTEM.md
PROJECT_MODEL.md
MEMORY_SYSTEM.md
UX_FLOWS.md
DESIGN_SYSTEM.md
ARCHITECTURE.md
ROADMAP.md
```

Next recommended documents:

```text
MVP_SPEC.md
CURSOR_BUILD_PLAN.md
DATA_MODEL.md
AI_MODULES.md
```

---

# 21. First Development Milestone

The first real development milestone is:

```text
V0.2 — Static UI Prototype
```

Cursor should build:

```text
Next.js project
Tailwind setup
AppShell
Mission screen
Projects screen
Brain screen
History screen
Mock data
Static decision explanation
Premium dark UI
```

Cursor must not build:

```text
Supabase
AI API
Auth
Payments
Integrations
n8n
Gmail
Calendar
GitHub sync
```

---

# 22. Definition of Done

A roadmap phase is done when:

```text
its core question has been answered
its acceptance criteria are met
the product remains simple
the documentation is updated
the next phase is clear
```

A phase is not done when:

```text
features exist but the experience is confusing
the system becomes more complex than needed
the product no longer supports the core promise
the next action is unclear
```

---

# 23. Strategic Principle

Gigi OS must not grow by adding random features.

It must grow by removing friction from execution.

Every version should make this sentence more true:

```text
I opened Gigi OS and immediately knew what to do.
```

---

# 24. Final Roadmap Statement

Gigi OS starts as a simple mission recommendation system.

Then it becomes a project brain.

Then it becomes a memory system.

Then it becomes an AI-assisted execution system.

Then it becomes an operating system for builders.

The roadmap must protect this evolution.

> **Do not build everything. Build the next thing that matters.**
