# Gigi OS — MVP Specification

> **The smallest useful version of Gigi OS.**

Version: `0.1`  
Status: MVP Specification  
Owner: Germain Caplain  
Purpose: Define exactly what must be built first, what must be excluded, and how to validate the first usable version of Gigi OS.

---

# 1. Purpose

This document defines the MVP of Gigi OS.

The MVP must prove one thing:

> **Can Gigi OS help the user know what to work on next?**

The MVP is not the final product.

The MVP is not the full AI operating system.

The MVP is the smallest version that delivers the core promise:

```text
Open Gigi. Know what matters next. Execute.
```

---

# 2. MVP Philosophy

The MVP must stay brutally simple.

Gigi OS should not start with:

```text
AI agents
Gmail
Calendar
GitHub sync
n8n
payments
advanced dashboards
multi-user SaaS
voice assistant
mobile app
```

The MVP must focus only on:

```text
projects
missions
decision logic
history
explanation
```

If the MVP cannot make the next action obvious, no future feature matters.

---

# 3. MVP Goal

The MVP goal is:

> **Create a web app where the user can manage projects and receive one recommended mission based on simple, explainable scoring.**

The app must answer:

```text
What should I do now?
Why this mission?
What project does it move forward?
What happens when I complete it?
```

---

# 4. MVP Success Criteria

The MVP is successful if the user can:

```text
1. Open Gigi OS.
2. See one recommended mission.
3. Understand why it was selected.
4. Start the mission.
5. Complete, postpone or reject the mission.
6. See project progress.
7. See decision history.
8. Feel less confused than before opening the app.
```

The MVP fails if:

```text
the user sees too many choices
the app feels like a generic todo list
the mission is vague
the recommendation is not explained
the user still has to choose manually between projects
the interface feels overloaded
```

---

# 5. MVP Product Scope

The MVP includes only four main screens:

```text
Mission
Projects
Brain
History
```

Optional after the static prototype:

```text
Onboarding
Project detail
Mission Mode
```

---

# 6. MVP Screens

## 6.1 Mission Screen

The Mission screen is the home screen.

It must display:

```text
today’s recommended mission
related project
estimated duration
expected impact
confidence
reason
primary action button
secondary actions
```

Primary action:

```text
Start Mission
```

Secondary actions:

```text
Postpone
Reject
Explain decision
```

The Mission screen must not look like a dashboard.

It must feel like a command screen.

---

## 6.2 Projects Screen

The Projects screen displays all projects.

Each project card must show:

```text
name
status
progress
priority
next action
blocker
business potential
```

Projects must be visually separated by status:

```text
active
paused
future
archived
completed
```

The MVP can initially use mock projects.

---

## 6.3 Brain Screen

The Brain screen explains the current recommendation.

It must show:

```text
selected mission
selected project
final score
scoring breakdown
reasoning
alternatives considered
why alternatives were not selected
```

The Brain screen is essential because Gigi OS must be explainable.

---

## 6.4 History Screen

The History screen shows what happened.

It must show:

```text
completed missions
postponed missions
rejected missions
decisions
project updates
blockers
```

For the first static prototype, this can use mock history.

For the functional MVP, history must update when the user acts.

---

# 7. MVP User Flow

## 7.1 Default Flow

```text
1. User opens Gigi OS.
2. User lands on Mission screen.
3. Gigi shows one recommended mission.
4. User clicks Start Mission.
5. Mission Mode opens.
6. User completes the mission.
7. Gigi records history.
8. Gigi recalculates the next mission.
```

---

## 7.2 Postpone Flow

```text
1. User clicks Postpone.
2. Gigi asks why.
3. User selects a reason.
4. Mission is marked postponed.
5. History records the decision.
6. Gigi recommends another mission or keeps the mission for later.
```

---

## 7.3 Reject Flow

```text
1. User clicks Reject.
2. Gigi asks why.
3. User selects a reason.
4. Mission is marked rejected.
5. Decision memory is updated.
6. Gigi recalculates recommendation.
```

---

## 7.4 Explain Flow

```text
1. User clicks Explain decision.
2. User opens Brain screen.
3. Brain shows scoring and reasoning.
4. User understands why this mission was selected.
```

---

# 8. Initial Mock Projects

The MVP must include these mock projects:

```text
Buildy Clear
Buildy Crafts
Linko
1Millimètre
Le Dernier Souvenir
Gigi OS
```

---

## 8.1 Buildy Clear

```text
Status:
active

Progress:
94%

Priority:
critical

Next action:
Finish the sales page and checkout flow.

Business potential:
9

Strategic value:
7

Urgency:
9

Estimated effort:
3

Clarity:
9
```

---

## 8.2 Buildy Crafts

```text
Status:
active

Progress:
72%

Priority:
high

Next action:
Continue stabilizing the app and expanding missing trade categories.

Business potential:
10

Strategic value:
10

Urgency:
6

Estimated effort:
8

Clarity:
7
```

---

## 8.3 Linko

```text
Status:
paused

Progress:
22%

Priority:
medium

Next action:
Finalize positioning and validate name availability.

Business potential:
9

Strategic value:
9

Urgency:
4

Estimated effort:
9

Clarity:
5
```

---

## 8.4 1Millimètre

```text
Status:
paused

Progress:
28%

Priority:
low

Next action:
Improve core gameplay feeling and visual polish.

Business potential:
6

Strategic value:
5

Urgency:
3

Estimated effort:
6

Clarity:
6
```

---

## 8.5 Le Dernier Souvenir

```text
Status:
future

Progress:
5%

Priority:
low

Next action:
Write the story bible and define the visual identity.

Business potential:
7

Strategic value:
6

Urgency:
2

Estimated effort:
7

Clarity:
4
```

---

## 8.6 Gigi OS

```text
Status:
active

Progress:
8%

Priority:
high

Next action:
Complete the core product documentation.

Business potential:
8

Strategic value:
10

Urgency:
7

Estimated effort:
8

Clarity:
8
```

---

# 9. MVP Decision Logic

The MVP must include a simple deterministic Decision Engine.

No AI is required.

The scoring criteria are:

```text
business impact
alignment
completion proximity
urgency
clarity
effort efficiency
risk of delay
```

The engine must:

```text
1. Read all projects.
2. Ignore archived and completed projects.
3. Generate one candidate mission per active project.
4. Score each candidate mission.
5. Select the highest-scoring mission.
6. Produce an explanation.
7. Show alternatives.
```

---

# 10. Default Score Weights

```text
Business Impact: 25%
Alignment: 20%
Completion Proximity: 15%
Urgency: 15%
Clarity: 10%
Effort Efficiency: 10%
Risk of Delay: 5%
```

The first version can hardcode these weights.

---

# 11. MVP Mission Recommendation Example

Expected output:

```text
Recommended Mission:
Finish the Buildy Clear sales page.

Project:
Buildy Clear

Estimated duration:
45 minutes

Expected impact:
High

Confidence:
87%

Reason:
Buildy Clear is the closest project to generating short-term revenue. It is near launch, the next action is clear, and completing the sales page unlocks the next step: publishing traffic videos.
```

---

# 12. MVP Mission Mode

Mission Mode should be included in the functional MVP.

Mission Mode must show:

```text
mission title
project name
mission description
estimated duration
steps
timer placeholder
complete button
exit option
```

The MVP timer can be visual only.

No real countdown is required at first.

---

# 13. MVP Mission Actions

The user must be able to:

```text
start mission
complete mission
postpone mission
reject mission
view explanation
```

For the static prototype, buttons can be non-functional.

For the local functional MVP, buttons must update local state.

---

# 14. MVP Project Actions

The user should eventually be able to:

```text
create project
edit project
update progress
change status
change priority
edit next action
add blocker
```

For V0.2 static prototype:

```text
view only
```

For V0.3 local MVP:

```text
basic create/edit
```

---

# 15. MVP History Events

The MVP must create history events for:

```text
mission_started
mission_completed
mission_postponed
mission_rejected
decision_created
project_updated
```

Example:

```text
Mission completed:
Create docs/MVP_SPEC.md
```

---

# 16. MVP Data Storage

## V0.2

```text
Mock data only.
```

## V0.3

```text
React state or localStorage.
```

## V0.4

```text
Supabase.
```

Do not add Supabase in V0.2.

---

# 17. MVP Technical Requirements

The first app prototype should use:

```text
Next.js
TypeScript
Tailwind CSS
```

The first prototype must not use:

```text
Supabase
OpenAI API
authentication
Stripe
n8n
Gmail
Calendar
GitHub API
```

---

# 18. MVP Repository Structure

Cursor should create:

```text
app/
  page.tsx
  projects/page.tsx
  brain/page.tsx
  history/page.tsx

components/
  ui/
  mission/
  projects/
  brain/
  history/

modules/
  decision-engine/
  missions/
  projects/
  memory/
  history/

data/
  mockProjects.ts
  mockMissions.ts
  mockHistory.ts
```

---

# 19. MVP Components

Required components:

```text
AppShell
GlassCard
PrimaryButton
SecondaryButton
StatusBadge
ProgressBar
MissionCard
MissionMode
ProjectCard
ProjectList
ScoreBreakdown
DecisionReason
AlternativesList
HistoryTimeline
HistoryEventCard
```

---

# 20. MVP Visual Requirements

The MVP must follow the Design System.

Visual direction:

```text
premium dark interface
glass cards
deep black background
soft borders
calm spacing
electric blue and copper accents
minimal navigation
mission-first layout
```

The Mission screen must visually dominate the product.

---

# 21. MVP Navigation

Navigation items:

```text
Mission
Projects
Brain
History
```

Desktop:

```text
left sidebar
```

Mobile:

```text
bottom navigation or simple responsive layout
```

The first prototype can be desktop-first but must remain responsive.

---

# 22. MVP Copywriting

Gigi’s tone must be:

```text
clear
calm
direct
strategic
useful
```

Good copy:

```text
Buildy Clear is the best mission today because it is closest to short-term revenue.
```

Bad copy:

```text
Let’s crush it today superstar!
```

---

# 23. MVP Empty States

## No Projects

```text
Before Gigi can choose your next mission, add your first project.
```

## No Mission

```text
Gigi needs at least one active project with a clear next action.
```

## No History

```text
Your execution history will appear here once missions are started.
```

---

# 24. MVP Edge Cases

The MVP should handle:

```text
no active project
no next action
mission too large
low confidence recommendation
two missions with similar scores
project blocked
mission rejected
mission postponed
```

For the static prototype, these can be represented with mock states.

---

# 25. MVP Acceptance Criteria

The MVP is accepted when:

```text
1. The user lands on a Mission screen.
2. One mission is clearly recommended.
3. The mission belongs to a project.
4. The reason is visible.
5. The user can view projects.
6. The user can view the decision explanation.
7. The user can view history.
8. The UI feels premium and focused.
9. The app does not feel like a todo list.
10. The project is modular enough to evolve.
```

---

# 26. MVP Rejection Criteria

The MVP must be rejected if:

```text
the first screen is a dashboard
too many tasks are shown
the recommendation is vague
the decision explanation is missing
the app requires AI to work
the UI feels generic
the code mixes business logic inside components
the app adds integrations too early
```

---

# 27. V0.2 Static Prototype Definition

The next development milestone is:

```text
V0.2 — Static UI Prototype
```

Cursor must build:

```text
a beautiful static Gigi OS interface
with four screens
using mock data
following the design system
with basic navigation
and a visible recommended mission
```

Cursor must not build:

```text
login
database
AI
payments
integrations
real CRUD
complex settings
```

---

# 28. V0.3 Functional MVP Definition

After V0.2 is approved, Cursor can build:

```text
local project creation
local project editing
mission state updates
local history events
working decision engine
working Mission Mode
localStorage persistence
```

Still no Supabase.

Still no AI.

---

# 29. What Cursor Should Build First

Cursor should first create:

```text
Next.js app structure
Tailwind setup
AppShell
Design tokens
Mock data
Mission screen
Projects screen
Brain screen
History screen
Decision Engine mock logic
```

The first output should be visually strong.

The first version should make the product feel real.

---

# 30. What Cursor Must Avoid

Cursor must avoid:

```text
overbuilding
adding backend too early
adding AI too early
creating complex dashboards
creating generic todo flows
adding many settings
creating agent modules now
adding notification systems
adding integrations
```

---

# 31. MVP Testing Checklist

Before moving past MVP, verify:

```text
Can someone understand Gigi OS in 10 seconds?
Can they identify the current mission immediately?
Can they explain why the mission matters?
Can they see project state clearly?
Can they trust the Brain explanation?
Does History show useful progress?
Does the interface feel calm?
Does the product reduce decisions?
```

---

# 32. MVP Final Statement

The MVP of Gigi OS is not about doing everything.

It is about proving the core behavior:

```text
Gigi OS looks at your projects and tells you the one thing that matters next.
```

If this is useful, the product can grow.

If this is not useful, no integration, AI agent or automation will save it.

> **Build the smallest version that creates clarity.**
