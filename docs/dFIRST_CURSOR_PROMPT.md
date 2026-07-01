# Gigi OS — First Cursor Prompt

> **Build V0.2. Nothing more.**

Version: `0.1`  
Status: Ready for Cursor  
Owner: Germain Caplain  
Purpose: Provide the exact first prompt to give Cursor to build the first Gigi OS prototype.

---

# First Cursor Prompt

```text
You are the lead developer of Gigi OS.

Gigi OS is an AI-powered operating system for builders, creators and entrepreneurs.

Its core promise is:

Open Gigi. Know what matters next. Execute.

Gigi OS is not:
- a chatbot
- a generic todo app
- a Notion clone
- a Trello clone
- a Jira clone
- a dashboard-first productivity app
- a random AI agent system

Gigi OS is mission-first.

Your mission is to build:

V0.2 — Static UI Prototype

This first version must be a beautiful, premium, dark, static prototype using mock data only.

Before coding, read all documentation:

- README.md
- docs/README.md
- docs/MASTER_PRD.md
- docs/OPERATING_RULES.md
- docs/MVP_SPEC.md
- docs/UX_FLOWS.md
- docs/DESIGN_SYSTEM.md
- docs/ARCHITECTURE.md
- docs/DATA_MODEL.md
- docs/DECISION_ENGINE.md
- docs/MISSION_SYSTEM.md
- docs/PROJECT_MODEL.md
- docs/MEMORY_SYSTEM.md
- docs/ROADMAP.md
- docs/CURSOR_BUILD_PLAN.md
- docs/IMPLEMENTATION_CHECKLIST.md

The goal is NOT to build the full product.

The goal is to create the first visible version of Gigi OS with four screens:

1. Mission
2. Projects
3. Brain
4. History

The home screen must be the Mission screen.

The product must feel like a calm command center for execution.

Use:

- Next.js
- TypeScript
- Tailwind CSS
- App Router
- Mock data only

Do NOT add:

- Supabase
- authentication
- OpenAI API
- AI calls
- Stripe
- Gmail integration
- Google Calendar integration
- GitHub API
- n8n
- payments
- agents
- automations
- team accounts
- dashboard complexity
- real backend
- database
- external APIs

Build only the static prototype.

Required routes:

- /
- /projects
- /brain
- /history

Required layout:

- dark premium interface
- left sidebar navigation on desktop
- responsive layout
- glass cards
- soft borders
- generous spacing
- mission-first hierarchy

Navigation items:

- Mission
- Projects
- Brain
- History

The Mission screen must show one clear recommended mission:

Title:
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
Buildy Clear is the closest project to short-term revenue. It is near launch, the next action is clear, and completing the sales page unlocks the next step: publishing traffic videos.

Primary action:
Start Mission

Secondary actions:
Postpone
Reject
Explain decision

The Projects screen must show these mock projects:

- Buildy Clear
- Buildy Crafts
- Linko
- 1Millimètre
- Le Dernier Souvenir
- Gigi OS

Each project card must show:

- name
- status
- progress
- priority
- next action
- blocker if any
- business potential

The Brain screen must explain why Buildy Clear was selected.

Show scoring:

Business impact: 9
Alignment: 9
Completion proximity: 10
Urgency: 8
Clarity: 9
Effort efficiency: 8
Risk of delay: 6
Final score: 87%

Show alternatives:

Buildy Crafts:
Strategic but longer-term.

Gigi OS:
Important, but documentation can continue after revenue work.

Linko:
Promising but paused.

1Millimètre:
Experimental.

Le Dernier Souvenir:
Future creative project.

The History screen must show a clean progress timeline.

Mock history examples:

Today:
- Created docs/FIRST_CURSOR_PROMPT.md
- Created docs/README.md
- Created docs/IMPLEMENTATION_CHECKLIST.md

Earlier:
- Created docs/OPERATING_RULES.md
- Created docs/SECURITY_PRIVACY.md
- Created docs/AUTOMATION_SYSTEM.md
- Created docs/AI_MODULES.md
- Created docs/DATA_MODEL.md
- Created docs/MVP_SPEC.md
- Created docs/ROADMAP.md
- Created docs/ARCHITECTURE.md
- Created docs/DESIGN_SYSTEM.md
- Created docs/UX_FLOWS.md
- Created docs/MEMORY_SYSTEM.md
- Created docs/PROJECT_MODEL.md
- Created docs/MISSION_SYSTEM.md
- Created docs/DECISION_ENGINE.md

Create this structure:

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

lib/
  utils.ts
  constants.ts

Required components:

components/ui/AppShell.tsx
components/ui/GlassCard.tsx
components/ui/PrimaryButton.tsx
components/ui/SecondaryButton.tsx
components/ui/StatusBadge.tsx
components/ui/ProgressBar.tsx
components/ui/ConfidenceIndicator.tsx
components/ui/SectionHeader.tsx

components/mission/MissionCard.tsx
components/mission/MissionModePreview.tsx
components/mission/MissionActions.tsx
components/mission/MissionSteps.tsx

components/projects/ProjectCard.tsx
components/projects/ProjectList.tsx

components/brain/ScoreBreakdown.tsx
components/brain/DecisionReason.tsx
components/brain/AlternativesList.tsx

components/history/HistoryTimeline.tsx
components/history/HistoryEventCard.tsx

Create basic module files:

modules/decision-engine/decisionTypes.ts
modules/decision-engine/decisionWeights.ts
modules/decision-engine/calculateMissionScore.ts
modules/decision-engine/selectMission.ts
modules/decision-engine/explainDecision.ts

modules/projects/projectTypes.ts
modules/projects/projectFixtures.ts
modules/projects/calculateProjectHealth.ts

modules/missions/missionTypes.ts
modules/missions/missionFixtures.ts
modules/missions/createMissionFromNextAction.ts

modules/memory/memoryTypes.ts

modules/history/historyTypes.ts

For V0.2, the logic can be simple and mock-based, but the structure must be ready for V0.3.

Design rules:

- deep black background
- glassmorphism cards
- warm off-white text
- electric blue accent
- copper accent for primary action
- calm spacing
- minimal navigation
- no childish animation
- no overloaded dashboards
- no generic todo-list feeling

The interface should feel like:

A calm command center for builders.

The user should understand the current mission in less than 5 seconds.

Code quality rules:

- Use TypeScript.
- Keep components small.
- Keep business logic outside React components.
- Use mock data files instead of hardcoding everywhere.
- Avoid unnecessary dependencies.
- Keep the architecture modular.
- Do not overbuild.

At the end, provide:

1. Summary of files created.
2. How to run the project locally.
3. What is implemented.
4. What is intentionally not implemented.
5. Any assumptions made.
6. Recommended next step for V0.3.

Important:

Do not build more than V0.2.
Do not add backend.
Do not add AI.
Do not add auth.
Do not add Supabase.
Do not add integrations.

Build exactly the static prototype described in the documentation.

One mission.
One reason.
One action.
```

---

# Acceptance Checklist

Cursor’s output is accepted only if:

```text
[ ] The app runs locally.
[ ] The home screen is Mission.
[ ] One mission is clearly recommended.
[ ] The design feels premium, dark and focused.
[ ] Projects screen shows all mock projects.
[ ] Brain screen explains the recommendation.
[ ] History screen shows progress.
[ ] No Supabase was added.
[ ] No AI API was added.
[ ] No authentication was added.
[ ] No integrations were added.
[ ] Code is modular.
[ ] Mock data is separated.
[ ] The product does not feel like a generic todo app.
```

---

# Final Reminder

Cursor must not impress with features.

Cursor must impress with clarity.

> **Build the smallest version that makes Gigi OS feel real.**
