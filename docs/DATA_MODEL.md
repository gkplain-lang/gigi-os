# Gigi OS — Data Model

> **Structure creates memory. Memory creates better decisions.**

Version: `0.1`  
Status: Technical Specification  
Owner: Germain Caplain  
Purpose: Define the core data model of Gigi OS for projects, missions, decisions, memory and history.

---

# 1. Purpose

This document defines the data model of Gigi OS.

The goal is to make sure the product can store and understand:

- users
- projects
- missions
- mission steps
- decisions
- decision scores
- memory
- history
- blockers
- settings

The data model must support the core promise of Gigi OS:

```text
Open Gigi. Know what matters next. Execute.
```

The first prototype can use mock data.

Later versions will use Supabase and PostgreSQL.

---

# 2. Data Model Philosophy

Gigi OS is not a note app.

Gigi OS is not a todo app.

Gigi OS is a decision system.

Therefore, the data model must prioritize:

```text
clarity
history
decision traceability
project state
mission state
memory
explainability
```

Every important recommendation must be traceable.

Every project must have a next action.

Every mission must belong to a project.

Every completed mission must create history.

---

# 3. MVP Data Strategy

The data model evolves in phases.

## V0.2

```text
Mock data only.
```

## V0.3

```text
Local state and localStorage.
```

## V0.4

```text
Supabase and PostgreSQL.
```

The schema should be designed early, but implemented progressively.

---

# 4. Core Entities

The main entities are:

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

---

# 5. Entity Relationship Overview

```text
profile
  └── projects
        ├── missions
        │     └── mission_steps
        │
        ├── blockers
        ├── history_events
        └── memories

mission
  ├── decisions
  ├── decision_scores
  ├── history_events
  └── memories

decision
  └── decision_scores
```

---

# 6. profiles

The `profiles` table stores user profile information.

In early versions, Gigi OS may only have one user.

Later, every user will have a profile.

## Fields

```text
id
email
display_name
created_at
updated_at
```

## SQL Draft

```sql
create table profiles (
  id uuid primary key,
  email text,
  display_name text,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);
```

## Notes

`id` should match the authenticated user ID when Supabase Auth is added.

---

# 7. user_settings

The `user_settings` table stores the user’s North Star and execution preferences.

## Fields

```text
id
user_id
north_star
current_target
monthly_revenue_target
preferred_work_duration
default_energy_level
created_at
updated_at
```

## Field Definitions

### north_star

The user’s highest-level objective.

Example:

```text
Build profitable digital products and software.
```

### current_target

The current practical objective.

Example:

```text
Generate 300–500 € per month.
```

### monthly_revenue_target

Numeric target.

Example:

```text
500
```

### preferred_work_duration

The preferred mission duration in minutes.

Example:

```text
45
```

## SQL Draft

```sql
create table user_settings (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references profiles(id) on delete cascade,
  north_star text,
  current_target text,
  monthly_revenue_target integer,
  preferred_work_duration integer default 45,
  default_energy_level text default 'medium',
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);
```

---

# 8. projects

The `projects` table stores all projects known by Gigi OS.

## Fields

```text
id
user_id
name
slug
description
vision
status
category
progress
priority
business_potential
strategic_value
urgency
risk_level
estimated_effort
clarity
next_action
current_blocker
health_status
last_worked_on
created_at
updated_at
```

## SQL Draft

```sql
create table projects (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references profiles(id) on delete cascade,
  name text not null,
  slug text not null,
  description text,
  vision text,
  status text not null default 'future',
  category text,
  progress integer default 0,
  priority text default 'medium',
  business_potential integer default 5,
  strategic_value integer default 5,
  urgency integer default 5,
  risk_level integer default 5,
  estimated_effort integer default 5,
  clarity integer default 5,
  next_action text,
  current_blocker text,
  health_status text default 'unclear',
  last_worked_on timestamp with time zone,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);
```

---

# 9. Project Status Values

Allowed `status` values:

```text
active
paused
future
archived
completed
```

## Meaning

```text
active     = can generate daily missions
paused     = stored but usually not prioritized
future     = idea for later
archived   = ignored by decision engine
completed  = finished project
```

---

# 10. Project Priority Values

Allowed `priority` values:

```text
critical
high
medium
low
none
```

---

# 11. Project Category Values

Suggested `category` values:

```text
software
digital_product
platform
game
content
creative_project
internal_tool
business_experiment
automation
research
```

---

# 12. Project Health Values

Allowed `health_status` values:

```text
healthy
unclear
blocked
stale
overloaded
ready_to_launch
```

---

# 13. missions

The `missions` table stores missions generated or recommended by Gigi OS.

A mission is not a generic task.

A mission is the selected action that should move a project forward.

## Fields

```text
id
user_id
project_id
title
description
status
estimated_duration
duration_band
expected_impact
confidence
reason
created_at
started_at
completed_at
updated_at
```

## SQL Draft

```sql
create table missions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references profiles(id) on delete cascade,
  project_id uuid references projects(id) on delete cascade,
  title text not null,
  description text,
  status text not null default 'available',
  estimated_duration integer,
  duration_band text,
  expected_impact text,
  confidence integer,
  reason text,
  created_at timestamp with time zone default now(),
  started_at timestamp with time zone,
  completed_at timestamp with time zone,
  updated_at timestamp with time zone default now()
);
```

---

# 14. Mission Status Values

Allowed `status` values:

```text
available
started
completed
postponed
rejected
expired
```

---

# 15. Mission Impact Values

Allowed `expected_impact` values:

```text
low
medium
high
critical
```

---

# 16. Duration Band Values

Allowed `duration_band` values:

```text
micro
short
standard
deep
too_large
```

## Meaning

```text
micro      = 5–15 minutes
short      = 15–30 minutes
standard   = 30–60 minutes
deep       = 60–90 minutes
too_large  = more than 90 minutes
```

---

# 17. mission_steps

The `mission_steps` table stores steps inside a mission.

## Fields

```text
id
mission_id
title
status
position
created_at
updated_at
```

## SQL Draft

```sql
create table mission_steps (
  id uuid primary key default gen_random_uuid(),
  mission_id uuid references missions(id) on delete cascade,
  title text not null,
  status text not null default 'todo',
  position integer default 0,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);
```

---

# 18. Mission Step Status Values

Allowed `status` values:

```text
todo
done
skipped
```

---

# 19. decisions

The `decisions` table stores why Gigi OS recommended a mission.

This is critical for explainability.

## Fields

```text
id
user_id
selected_project_id
selected_mission_id
score
reason
alternatives_json
user_response
created_at
```

## SQL Draft

```sql
create table decisions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references profiles(id) on delete cascade,
  selected_project_id uuid references projects(id) on delete set null,
  selected_mission_id uuid references missions(id) on delete set null,
  score numeric,
  reason text,
  alternatives_json jsonb,
  user_response text,
  created_at timestamp with time zone default now()
);
```

---

# 20. User Response Values

Allowed `user_response` values:

```text
accepted
started
completed
postponed
rejected
ignored
```

---

# 21. decision_scores

The `decision_scores` table stores the detailed scoring breakdown.

## Fields

```text
id
decision_id
project_id
mission_id
business_impact
alignment
completion_proximity
urgency
clarity
effort_efficiency
risk_of_delay
final_score
created_at
```

## SQL Draft

```sql
create table decision_scores (
  id uuid primary key default gen_random_uuid(),
  decision_id uuid references decisions(id) on delete cascade,
  project_id uuid references projects(id) on delete cascade,
  mission_id uuid references missions(id) on delete cascade,
  business_impact integer,
  alignment integer,
  completion_proximity integer,
  urgency integer,
  clarity integer,
  effort_efficiency integer,
  risk_of_delay integer,
  final_score numeric,
  created_at timestamp with time zone default now()
);
```

---

# 22. history_events

The `history_events` table stores visible progress history.

History is the user-readable timeline of what happened.

## Fields

```text
id
user_id
event_type
project_id
mission_id
decision_id
title
description
metadata_json
created_at
```

## SQL Draft

```sql
create table history_events (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references profiles(id) on delete cascade,
  event_type text not null,
  project_id uuid references projects(id) on delete set null,
  mission_id uuid references missions(id) on delete set null,
  decision_id uuid references decisions(id) on delete set null,
  title text not null,
  description text,
  metadata_json jsonb,
  created_at timestamp with time zone default now()
);
```

---

# 23. History Event Types

Allowed `event_type` values:

```text
project_created
project_updated
project_status_changed
project_priority_changed
project_progress_changed
mission_created
mission_started
mission_completed
mission_postponed
mission_rejected
decision_created
blocker_added
blocker_resolved
goal_updated
memory_created
memory_updated
memory_archived
```

---

# 24. memories

The `memories` table stores structured memory.

Memory must not become random notes.

Memory exists to improve future decisions.

## Fields

```text
id
user_id
type
title
content
priority
status
related_project_id
related_mission_id
related_decision_id
created_at
updated_at
```

## SQL Draft

```sql
create table memories (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references profiles(id) on delete cascade,
  type text not null,
  title text not null,
  content text not null,
  priority text default 'medium',
  status text default 'active',
  related_project_id uuid references projects(id) on delete set null,
  related_mission_id uuid references missions(id) on delete set null,
  related_decision_id uuid references decisions(id) on delete set null,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);
```

---

# 25. Memory Types

Allowed `type` values:

```text
project_state
strategic_decision
mission_history
blocker
user_goal
user_preference
product_rule
lesson
system_event
```

---

# 26. Memory Priority Values

Allowed `priority` values:

```text
critical
high
medium
low
archive
```

---

# 27. Memory Status Values

Allowed `status` values:

```text
active
outdated
archived
superseded
deleted
```

---

# 28. blockers

The `blockers` table stores project blockers.

A blocker can become the reason for a mission.

## Fields

```text
id
user_id
project_id
title
description
severity
status
created_at
resolved_at
```

## SQL Draft

```sql
create table blockers (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references profiles(id) on delete cascade,
  project_id uuid references projects(id) on delete cascade,
  title text not null,
  description text,
  severity text default 'medium',
  status text default 'open',
  created_at timestamp with time zone default now(),
  resolved_at timestamp with time zone
);
```

---

# 29. Blocker Severity Values

Allowed `severity` values:

```text
low
medium
high
critical
```

---

# 30. Blocker Status Values

Allowed `status` values:

```text
open
in_progress
resolved
ignored
```

---

# 31. Initial Mock Data

The first prototype must include these projects:

```text
Buildy Clear
Buildy Crafts
Linko
1Millimètre
Le Dernier Souvenir
Gigi OS
```

---

# 32. Initial Mock Project Records

## Buildy Clear

```json
{
  "id": "project_buildy_clear",
  "name": "Buildy Clear",
  "slug": "buildy-clear",
  "description": "A digital kit that helps homeowners verify unclear construction quotes before signing.",
  "vision": "Become the simplest way for homeowners to avoid costly renovation quote mistakes.",
  "status": "active",
  "category": "digital_product",
  "progress": 94,
  "priority": "critical",
  "business_potential": 9,
  "strategic_value": 7,
  "urgency": 9,
  "risk_level": 4,
  "estimated_effort": 3,
  "clarity": 9,
  "next_action": "Finish the sales page and checkout flow.",
  "current_blocker": "The sales tunnel is not fully optimized.",
  "health_status": "ready_to_launch"
}
```

---

## Buildy Crafts

```json
{
  "id": "project_buildy_crafts",
  "name": "Buildy Crafts",
  "slug": "buildy-crafts",
  "description": "A mobile app for artisans with quotes, projects, calculators, PDF exports and a construction material library.",
  "vision": "Become the reference app for artisans who want to create professional quotes and manage construction projects.",
  "status": "active",
  "category": "software",
  "progress": 72,
  "priority": "high",
  "business_potential": 10,
  "strategic_value": 10,
  "urgency": 6,
  "risk_level": 7,
  "estimated_effort": 8,
  "clarity": 7,
  "next_action": "Continue stabilizing the app and expanding missing trade categories.",
  "current_blocker": "The content library still needs expansion.",
  "health_status": "healthy"
}
```

---

## Linko

```json
{
  "id": "project_linko",
  "name": "Linko",
  "slug": "linko",
  "description": "A trust platform for the construction industry where customers can find serious artisans and companies can claim their profiles.",
  "vision": "Become the trust layer between customers and building professionals.",
  "status": "paused",
  "category": "platform",
  "progress": 22,
  "priority": "medium",
  "business_potential": 9,
  "strategic_value": 9,
  "urgency": 4,
  "risk_level": 8,
  "estimated_effort": 9,
  "clarity": 5,
  "next_action": "Finalize positioning and validate name availability.",
  "current_blocker": "Too early for immediate monetization.",
  "health_status": "paused"
}
```

---

## 1Millimètre

```json
{
  "id": "project_1millimetre",
  "name": "1Millimètre",
  "slug": "1millimetre",
  "description": "A mobile precision-cutting game based on stopping a saw at the perfect moment.",
  "vision": "Create a simple, addictive mobile game that can generate revenue through ads or a small paid price.",
  "status": "paused",
  "category": "game",
  "progress": 28,
  "priority": "low",
  "business_potential": 6,
  "strategic_value": 5,
  "urgency": 3,
  "risk_level": 7,
  "estimated_effort": 6,
  "clarity": 6,
  "next_action": "Improve core gameplay feeling and visual polish.",
  "current_blocker": "Gameplay may not yet be addictive enough.",
  "health_status": "paused"
}
```

---

## Le Dernier Souvenir

```json
{
  "id": "project_le_dernier_souvenir",
  "name": "Le Dernier Souvenir",
  "slug": "le-dernier-souvenir",
  "description": "A short-form animated mystery series built around a small character recovering lost memories.",
  "vision": "Create a recognizable story universe that can grow into videos, games, books and merchandise.",
  "status": "future",
  "category": "creative_project",
  "progress": 5,
  "priority": "low",
  "business_potential": 7,
  "strategic_value": 6,
  "urgency": 2,
  "risk_level": 8,
  "estimated_effort": 7,
  "clarity": 4,
  "next_action": "Write the story bible and define the visual identity.",
  "current_blocker": "No production system yet.",
  "health_status": "unclear"
}
```

---

## Gigi OS

```json
{
  "id": "project_gigi_os",
  "name": "Gigi OS",
  "slug": "gigi-os",
  "description": "An AI operating system that helps builders know what to work on next.",
  "vision": "Become the central brain for projects, decisions, missions and execution.",
  "status": "active",
  "category": "internal_tool",
  "progress": 10,
  "priority": "high",
  "business_potential": 8,
  "strategic_value": 10,
  "urgency": 7,
  "risk_level": 7,
  "estimated_effort": 8,
  "clarity": 8,
  "next_action": "Complete the core product documentation.",
  "current_blocker": "The product must be clearly specified before development.",
  "health_status": "healthy"
}
```

---

# 33. Initial Recommended Mission

```json
{
  "id": "mission_buildy_clear_sales_page",
  "project_id": "project_buildy_clear",
  "title": "Finish the Buildy Clear sales page",
  "description": "Finalize the sales page headline, CTA and checkout flow so Buildy Clear can start receiving traffic.",
  "status": "available",
  "estimated_duration": 45,
  "duration_band": "standard",
  "expected_impact": "high",
  "confidence": 87,
  "reason": "Buildy Clear is the closest project to short-term revenue. It is near launch, the next action is clear, and completing the sales page unlocks the next step: publishing traffic videos."
}
```

---

# 34. Initial Mission Steps

```json
[
  {
    "id": "step_open_tunnel",
    "mission_id": "mission_buildy_clear_sales_page",
    "title": "Open the Buildy Clear sales tunnel",
    "status": "todo",
    "position": 1
  },
  {
    "id": "step_review_headline",
    "mission_id": "mission_buildy_clear_sales_page",
    "title": "Review and rewrite the main headline",
    "status": "todo",
    "position": 2
  },
  {
    "id": "step_update_cta",
    "mission_id": "mission_buildy_clear_sales_page",
    "title": "Replace the main call-to-action",
    "status": "todo",
    "position": 3
  },
  {
    "id": "step_check_payment",
    "mission_id": "mission_buildy_clear_sales_page",
    "title": "Check that the payment button is connected",
    "status": "todo",
    "position": 4
  },
  {
    "id": "step_save_review",
    "mission_id": "mission_buildy_clear_sales_page",
    "title": "Save and review the page as a visitor",
    "status": "todo",
    "position": 5
  }
]
```

---

# 35. Initial Decision Record

```json
{
  "id": "decision_initial_buildy_clear",
  "selected_project_id": "project_buildy_clear",
  "selected_mission_id": "mission_buildy_clear_sales_page",
  "score": 87,
  "reason": "Buildy Clear was selected because it is closest to short-term revenue, has high completion proximity, and has a clear next action.",
  "alternatives_json": [
    {
      "project": "Buildy Crafts",
      "reason_not_selected": "Strategic but longer-term."
    },
    {
      "project": "Gigi OS",
      "reason_not_selected": "Important, but documentation can continue after revenue work."
    },
    {
      "project": "Linko",
      "reason_not_selected": "Promising but paused."
    }
  ],
  "user_response": "pending"
}
```

---

# 36. Initial History Events

```json
[
  {
    "id": "history_mvp_spec",
    "event_type": "mission_completed",
    "title": "Created docs/MVP_SPEC.md",
    "description": "Defined the smallest useful version of Gigi OS."
  },
  {
    "id": "history_roadmap",
    "event_type": "mission_completed",
    "title": "Created docs/ROADMAP.md",
    "description": "Defined the build sequence from documentation to daily-use product."
  },
  {
    "id": "history_architecture",
    "event_type": "mission_completed",
    "title": "Created docs/ARCHITECTURE.md",
    "description": "Defined the technical structure and module boundaries."
  }
]
```

---

# 37. TypeScript Domain Types

Cursor should convert this data model into TypeScript types.

Suggested files:

```text
modules/projects/projectTypes.ts
modules/missions/missionTypes.ts
modules/decision-engine/decisionTypes.ts
modules/memory/memoryTypes.ts
modules/history/historyTypes.ts
```

---

# 38. TypeScript Types Draft

```ts
export type ProjectStatus =
  | "active"
  | "paused"
  | "future"
  | "archived"
  | "completed";

export type ProjectPriority =
  | "critical"
  | "high"
  | "medium"
  | "low"
  | "none";

export type ProjectCategory =
  | "software"
  | "digital_product"
  | "platform"
  | "game"
  | "content"
  | "creative_project"
  | "internal_tool"
  | "business_experiment"
  | "automation"
  | "research";

export type ProjectHealth =
  | "healthy"
  | "unclear"
  | "blocked"
  | "stale"
  | "overloaded"
  | "ready_to_launch"
  | "paused";

export type Project = {
  id: string;
  name: string;
  slug: string;
  description: string;
  vision: string;
  status: ProjectStatus;
  category: ProjectCategory;
  progress: number;
  priority: ProjectPriority;
  businessPotential: number;
  strategicValue: number;
  urgency: number;
  riskLevel: number;
  estimatedEffort: number;
  clarity: number;
  nextAction: string;
  currentBlocker?: string;
  healthStatus: ProjectHealth;
  lastWorkedOn?: string;
  createdAt?: string;
  updatedAt?: string;
};
```

```ts
export type MissionStatus =
  | "available"
  | "started"
  | "completed"
  | "postponed"
  | "rejected"
  | "expired";

export type MissionImpact =
  | "low"
  | "medium"
  | "high"
  | "critical";

export type DurationBand =
  | "micro"
  | "short"
  | "standard"
  | "deep"
  | "too_large";

export type Mission = {
  id: string;
  projectId: string;
  title: string;
  description: string;
  status: MissionStatus;
  estimatedDuration: number;
  durationBand: DurationBand;
  expectedImpact: MissionImpact;
  confidence: number;
  reason: string;
  createdAt?: string;
  startedAt?: string;
  completedAt?: string;
  updatedAt?: string;
};
```

```ts
export type MissionStepStatus =
  | "todo"
  | "done"
  | "skipped";

export type MissionStep = {
  id: string;
  missionId: string;
  title: string;
  status: MissionStepStatus;
  position: number;
};
```

```ts
export type DecisionScore = {
  businessImpact: number;
  alignment: number;
  completionProximity: number;
  urgency: number;
  clarity: number;
  effortEfficiency: number;
  riskOfDelay: number;
  finalScore: number;
};
```

```ts
export type Decision = {
  id: string;
  selectedProjectId: string;
  selectedMissionId: string;
  score: number;
  reason: string;
  alternatives: Array<{
    projectId: string;
    projectName: string;
    reasonNotSelected: string;
  }>;
  userResponse:
    | "pending"
    | "accepted"
    | "started"
    | "completed"
    | "postponed"
    | "rejected"
    | "ignored";
  createdAt?: string;
};
```

```ts
export type HistoryEventType =
  | "project_created"
  | "project_updated"
  | "project_status_changed"
  | "project_priority_changed"
  | "project_progress_changed"
  | "mission_created"
  | "mission_started"
  | "mission_completed"
  | "mission_postponed"
  | "mission_rejected"
  | "decision_created"
  | "blocker_added"
  | "blocker_resolved"
  | "goal_updated"
  | "memory_created"
  | "memory_updated"
  | "memory_archived";

export type HistoryEvent = {
  id: string;
  eventType: HistoryEventType;
  projectId?: string;
  missionId?: string;
  decisionId?: string;
  title: string;
  description?: string;
  metadata?: Record<string, unknown>;
  createdAt?: string;
};
```

---

# 39. Row Level Security Later

When Supabase is added, every user-owned table must use RLS.

Tables requiring RLS:

```text
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

Basic principle:

```text
A user can only read, create, update and delete their own data.
```

---

# 40. MVP Acceptance Criteria

The data model is successful if:

- all core entities are defined;
- projects can generate missions;
- missions can create history;
- decisions can be explained;
- memory can store useful context;
- the schema supports Supabase later;
- mock data can be created immediately;
- Cursor can convert the model into TypeScript types.

The data model fails if:

- missions are disconnected from projects;
- decisions cannot be explained later;
- history is not stored;
- memory becomes random notes;
- the schema forces Supabase too early;
- the model is too complex for the MVP.

---

# 41. Final Principle

The data model must make Gigi OS remember the work.

Without structured data, Gigi OS becomes another chatbot.

With structured data, Gigi OS becomes a system that can understand, remember and improve.

> **The better the structure, the better the decision.**
