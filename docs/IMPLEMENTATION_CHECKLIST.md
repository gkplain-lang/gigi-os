# Gigi OS — Implementation Checklist

> **Build the right thing, in the right order.**

Version: `0.1`  
Status: Build Control Checklist  
Owner: Germain Caplain  
Purpose: Provide a clear checklist to validate documentation, prototype, architecture and implementation before moving between versions.

---

# 1. Purpose

This checklist exists to keep Gigi OS disciplined.

Gigi OS must not become:

```text
too complex
too early
too vague
too dashboard-heavy
too AI-dependent
too integration-heavy
```

Before each build phase, this checklist should be used to verify that the product is still aligned with its mission:

```text
Open Gigi. Know what matters next. Execute.
```

---

# 2. Global Rule

Before building any feature, ask:

```text
Does this help the user decide better or execute faster?
```

If the answer is no, the feature should not be built yet.

---

# 3. Current Phase

Current phase:

```text
V0.1 — Documentation
```

Current goal:

```text
Finish the core documentation before starting the static prototype.
```

Current next milestone:

```text
V0.2 — Static UI Prototype
```

---

# 4. V0.1 Documentation Checklist

V0.1 is complete only when these files exist:

```text
[ ] README.md
[ ] docs/MASTER_PRD.md
[ ] docs/DECISION_ENGINE.md
[ ] docs/MISSION_SYSTEM.md
[ ] docs/PROJECT_MODEL.md
[ ] docs/MEMORY_SYSTEM.md
[ ] docs/UX_FLOWS.md
[ ] docs/DESIGN_SYSTEM.md
[ ] docs/ARCHITECTURE.md
[ ] docs/ROADMAP.md
[ ] docs/MVP_SPEC.md
[ ] docs/CURSOR_BUILD_PLAN.md
[ ] docs/DATA_MODEL.md
[ ] docs/AI_MODULES.md
[ ] docs/AUTOMATION_SYSTEM.md
[ ] docs/SECURITY_PRIVACY.md
[ ] docs/OPERATING_RULES.md
[ ] docs/IMPLEMENTATION_CHECKLIST.md
```

---

# 5. Documentation Quality Checklist

Each documentation file should be:

```text
[ ] clear
[ ] specific
[ ] useful for Cursor
[ ] aligned with mission-first philosophy
[ ] not too vague
[ ] not contradicted by another document
[ ] focused on execution
[ ] written in Markdown
```

---

# 6. Product Alignment Checklist

Before moving to development, verify:

```text
[ ] Gigi OS is mission-first.
[ ] The home screen is Mission, not Dashboard.
[ ] The MVP has only four main screens.
[ ] The Decision Engine is deterministic first.
[ ] AI is not required for V0.2.
[ ] Supabase is not required for V0.2.
[ ] Integrations are not required for V0.2.
[ ] Cursor has a clear build plan.
[ ] The product does not look like a generic todo app.
```

---

# 7. V0.2 Static UI Prototype Checklist

V0.2 objective:

```text
Create a beautiful static prototype with four screens and mock data.
```

Required screens:

```text
[ ] Mission screen
[ ] Projects screen
[ ] Brain screen
[ ] History screen
```

Required layout:

```text
[ ] App shell
[ ] Sidebar or navigation
[ ] Responsive structure
[ ] Premium dark background
[ ] Glass cards
[ ] Clear hierarchy
```

Required data:

```text
[ ] Mock projects
[ ] Mock mission
[ ] Mock decision explanation
[ ] Mock history
```

---

# 8. V0.2 Must Not Include

Cursor must not add:

```text
[ ] Supabase
[ ] authentication
[ ] OpenAI API
[ ] Stripe
[ ] Gmail integration
[ ] Calendar integration
[ ] GitHub API
[ ] n8n
[ ] real automation
[ ] real payments
[ ] team accounts
[ ] admin panel
[ ] voice mode
```

If any of these appear in V0.2, the build is off-scope.

---

# 9. V0.2 Visual Acceptance Checklist

The prototype is visually accepted if:

```text
[ ] The first screen clearly shows one mission.
[ ] The mission card is visually dominant.
[ ] The design feels premium and calm.
[ ] The interface is dark, clean and focused.
[ ] The user understands the mission in less than 5 seconds.
[ ] The primary action is obvious.
[ ] The Projects screen is readable.
[ ] The Brain screen explains the recommendation clearly.
[ ] The History screen feels like progress, not logs.
[ ] The UI does not feel like Trello, Notion, Jira or a basic todo app.
```

---

# 10. V0.2 Code Checklist

The code is accepted if:

```text
[ ] Next.js is installed.
[ ] TypeScript is used.
[ ] Tailwind CSS is configured.
[ ] Components are separated.
[ ] Mock data is separated from UI.
[ ] Domain types exist.
[ ] Basic module folders exist.
[ ] Business logic is not inside large UI components.
[ ] File names are clear.
[ ] No unnecessary dependencies are added.
```

---

# 11. Required V0.2 Structure

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

lib/
  utils.ts
  constants.ts
```

---

# 12. Required Components Checklist

UI components:

```text
[ ] AppShell
[ ] GlassCard
[ ] PrimaryButton
[ ] SecondaryButton
[ ] StatusBadge
[ ] ProgressBar
[ ] ConfidenceIndicator
[ ] SectionHeader
```

Mission components:

```text
[ ] MissionCard
[ ] MissionModePreview
[ ] MissionActions
[ ] MissionSteps
```

Project components:

```text
[ ] ProjectCard
[ ] ProjectList
```

Brain components:

```text
[ ] ScoreBreakdown
[ ] DecisionReason
[ ] AlternativesList
```

History components:

```text
[ ] HistoryTimeline
[ ] HistoryEventCard
```

---

# 13. Mock Projects Checklist

Mock data must include:

```text
[ ] Buildy Clear
[ ] Buildy Crafts
[ ] Linko
[ ] 1Millimètre
[ ] Le Dernier Souvenir
[ ] Gigi OS
```

Each project must include:

```text
[ ] name
[ ] description
[ ] status
[ ] category
[ ] progress
[ ] priority
[ ] business potential
[ ] strategic value
[ ] urgency
[ ] estimated effort
[ ] clarity
[ ] next action
[ ] blocker
```

---

# 14. Mission Screen Checklist

Mission screen must show:

```text
[ ] Today's Mission
[ ] Mission title
[ ] Related project
[ ] Estimated duration
[ ] Expected impact
[ ] Confidence
[ ] Reason
[ ] Start Mission button
[ ] Postpone action
[ ] Reject action
[ ] Explain decision action
```

The screen must not show:

```text
[ ] too many missions
[ ] full project dashboard
[ ] unrelated analytics
[ ] long task lists
[ ] random AI chat
```

---

# 15. Projects Screen Checklist

Projects screen must show:

```text
[ ] all mock projects
[ ] clear project cards
[ ] status badges
[ ] progress bars
[ ] priority
[ ] next action
[ ] blocker if present
[ ] business potential
```

The screen should make it obvious:

```text
which projects are active
which are paused
which are future ideas
```

---

# 16. Brain Screen Checklist

Brain screen must show:

```text
[ ] selected mission
[ ] selected project
[ ] final score
[ ] score breakdown
[ ] explanation
[ ] alternatives considered
[ ] why alternatives were not selected
```

The explanation must be understandable by a non-developer.

---

# 17. History Screen Checklist

History screen must show:

```text
[ ] recent completed missions
[ ] decisions
[ ] created documentation
[ ] project progress events
[ ] clean timeline layout
```

The History screen should feel like:

```text
a record of progress
```

Not:

```text
technical logs
```

---

# 18. V0.3 Local Functional MVP Checklist

Only after V0.2 is approved, move to V0.3.

V0.3 must add:

```text
[ ] project creation
[ ] project editing
[ ] mission start
[ ] mission completion
[ ] mission postponement
[ ] mission rejection
[ ] local history events
[ ] localStorage persistence
[ ] real deterministic decision scoring
```

Still no:

```text
[ ] Supabase
[ ] AI API
[ ] authentication
[ ] integrations
```

---

# 19. Decision Engine Implementation Checklist

The Decision Engine is accepted if:

```text
[ ] It reads project data.
[ ] It creates candidate missions.
[ ] It scores missions.
[ ] It ranks missions.
[ ] It selects one mission.
[ ] It explains the recommendation.
[ ] It shows alternatives.
[ ] It works without AI.
[ ] Scores are visible and understandable.
```

---

# 20. Mission System Implementation Checklist

The Mission System is accepted if:

```text
[ ] A mission can be available.
[ ] A mission can be started.
[ ] Mission Mode opens.
[ ] A mission can be completed.
[ ] A mission can be postponed.
[ ] A mission can be rejected.
[ ] Mission feedback is stored.
[ ] Completion creates history.
```

---

# 21. Project System Implementation Checklist

The Project System is accepted if:

```text
[ ] Projects can be listed.
[ ] Projects can be created.
[ ] Projects can be edited.
[ ] Projects have statuses.
[ ] Projects have progress.
[ ] Projects have next actions.
[ ] Projects have blockers.
[ ] Projects provide data to the Decision Engine.
```

---

# 22. Memory & History Implementation Checklist

Memory and history are accepted if:

```text
[ ] Completed missions are stored.
[ ] Rejected missions are stored.
[ ] Postponed missions are stored.
[ ] Decision reasons are stored.
[ ] Project updates create events.
[ ] History is readable.
[ ] Gigi does not repeat the same recommendation blindly.
```

---

# 23. V0.4 Supabase Checklist

Only after V0.3 works locally, move to V0.4.

V0.4 must add:

```text
[ ] Supabase project
[ ] authentication
[ ] profiles
[ ] projects table
[ ] missions table
[ ] mission_steps table
[ ] decisions table
[ ] decision_scores table
[ ] history_events table
[ ] memories table
[ ] blockers table
[ ] user_settings table
[ ] Row Level Security
```

V0.4 must not add:

```text
[ ] AI agents
[ ] Gmail
[ ] Calendar
[ ] GitHub sync
[ ] n8n
[ ] Stripe
```

---

# 24. V0.5 AI Checklist

Only after database persistence works, add AI.

First AI features:

```text
[ ] AI mission rewriting
[ ] AI decision explanation
[ ] AI project summary
[ ] AI blocker detection
[ ] AI Cursor prompt generation
```

AI must not:

```text
[ ] silently change priorities
[ ] silently change project status
[ ] silently change mission status
[ ] mutate memory without confirmation
[ ] execute external actions
```

---

# 25. Pre-Cursor Checklist

Before asking Cursor to code, verify:

```text
[ ] All core docs are committed.
[ ] Cursor has the build plan.
[ ] MVP scope is clear.
[ ] V0.2 target is clear.
[ ] Forbidden features are listed.
[ ] Mock data is defined.
[ ] Design system is defined.
[ ] Architecture is defined.
```

---

# 26. First Cursor Prompt Checklist

The first Cursor prompt must include:

```text
[ ] role
[ ] context
[ ] target version
[ ] docs to read
[ ] screens to build
[ ] components to create
[ ] mock data to use
[ ] what not to build
[ ] acceptance criteria
[ ] expected summary
```

Do not send Cursor a vague prompt.

Bad:

```text
Build Gigi OS.
```

Good:

```text
Build V0.2 Static UI Prototype using mock data only and following the docs.
```

---

# 27. Build Review Checklist

After Cursor finishes, review:

```text
[ ] Does the app run?
[ ] Does the home screen show Mission?
[ ] Is the mission clear?
[ ] Is the design premium?
[ ] Are there only four main screens?
[ ] Did Cursor avoid Supabase?
[ ] Did Cursor avoid AI calls?
[ ] Did Cursor avoid auth?
[ ] Is the code modular?
[ ] Is the product still mission-first?
```

---

# 28. Common Failure Signs

Stop and correct the build if:

```text
[ ] Cursor added login too early.
[ ] Cursor added Supabase too early.
[ ] Cursor added AI API too early.
[ ] Home screen became a dashboard.
[ ] Too many missions are shown.
[ ] The UI feels like a todo app.
[ ] The mission is vague.
[ ] Components are huge.
[ ] Business logic is inside JSX.
[ ] Mock data is hardcoded everywhere.
[ ] The design ignores DESIGN_SYSTEM.md.
```

---

# 29. Definition of Done for V0.2

V0.2 is done when:

```text
[ ] The static prototype runs locally.
[ ] The Mission screen is visually strong.
[ ] The Projects screen shows all mock projects.
[ ] The Brain screen explains the current mission.
[ ] The History screen shows progress.
[ ] The design follows the design system.
[ ] No forbidden systems were added.
[ ] The next step toward V0.3 is clear.
```

---

# 30. Definition of Done for V0.3

V0.3 is done when:

```text
[ ] User can create/edit projects locally.
[ ] Decision Engine recommends one mission.
[ ] Mission can be started.
[ ] Mission can be completed.
[ ] Mission can be rejected.
[ ] Mission can be postponed.
[ ] History updates locally.
[ ] Data persists in localStorage.
[ ] App still feels simple.
```

---

# 31. Final Implementation Principle

Gigi OS should not impress by having many features.

It should impress by making the next action obvious.

Every implementation phase must protect this promise:

```text
I opened Gigi OS and immediately knew what to do.
```

> **Clarity is the feature.**
