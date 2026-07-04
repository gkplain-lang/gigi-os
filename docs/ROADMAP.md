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

Prepare the system for future automation without connecting everything yet.

## Core Question

```text
Is the architecture ready for agents and integrations?
```

## Features

```text
Automation module specification
Integration abstraction layer
Event system
Action queue
Webhook preparation
Agent task format
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
```

The goal is architecture preparation only.

## Acceptance Criteria

V0.7 is complete when:

- future integrations have a clean structure;
- events can trigger internal actions;
- agent task format exists;
- automation logic does not pollute core modules.

---

# 12. V0.8 — Integrations Alpha

## Goal

Add first external integrations carefully.

## Core Question

```text
Can Gigi OS read external signals and improve decisions?
```

## Candidate Integrations

Start with one only.

Possible first integration:

```text
GitHub
```

Why GitHub first:

- project progress can be measured;
- commits and issues can become history;
- Cursor workflows can be prepared later.

## GitHub Alpha Features

```text
connect repository
read commits
read issues
read README
summarize project activity
suggest project status update
```

## Acceptance Criteria

V0.8 is complete when:

- one integration works cleanly;
- external data improves project memory;
- Gigi does not become noisy;
- the integration is optional;
- the core product still works without it.

---

# 13. V0.9 — Private Beta

## Goal

Test Gigi OS with real users beyond Germain.

## Core Question

```text
Does Gigi OS help other builders know what to do next?
```

## Beta Users

Possible users:

```text
indie hackers
freelancers
small business creators
AI builders
solo founders
```

## Beta Requirements

```text
simple onboarding
project creation
mission recommendation
mission history
feedback collection
bug reporting
basic analytics
```

## Metrics

Track:

```text
daily active use
missions completed
missions rejected
time to first mission
project creation rate
return rate
user feedback
```

## Acceptance Criteria

V0.9 is complete when:

- at least a small group uses the product;
- users understand the value;
- users complete missions;
- feedback confirms the core problem;
- product confusion is reduced.

---

# 14. V1.0 — Daily Use Release

## Goal

Release the first stable version.

## Core Question

```text
Can Gigi OS become part of the user’s daily routine?
```

## Features

```text
stable mission system
project management
decision explanations
mission history
memory
daily review
AI-assisted summaries
clean design
basic settings
secure user data
```

## V1.0 Must Feel

```text
simple
reliable
focused
premium
useful every day
```

## Acceptance Criteria

V1.0 is complete when:

- Gigi OS can be used every morning;
- recommendations are useful;
- project memory works;
- missions are completed regularly;
- the product feels stable;
- the system does not feel overloaded.

---

# 15. V2.0 — SaaS Version

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

# 16. Future Versions

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

# 17. Priority Rules

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

# 18. Current Phase

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

# 19. First Development Milestone

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

# 20. Definition of Done

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

# 21. Strategic Principle

Gigi OS must not grow by adding random features.

It must grow by removing friction from execution.

Every version should make this sentence more true:

```text
I opened Gigi OS and immediately knew what to do.
```

---

# 22. Final Roadmap Statement

Gigi OS starts as a simple mission recommendation system.

Then it becomes a project brain.

Then it becomes a memory system.

Then it becomes an AI-assisted execution system.

Then it becomes an operating system for builders.

The roadmap must protect this evolution.

> **Do not build everything. Build the next thing that matters.**
