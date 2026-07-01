# Gigi OS — Design System

> **A calm command center for builders.**

Version: `0.1`  
Status: Product Specification  
Module: Design System  
Owner: Germain Caplain  
Purpose: Define the visual identity, interface rules and emotional direction of Gigi OS.

---

# 1. Purpose

The Design System defines how Gigi OS should look, feel and behave visually.

Gigi OS must not look like a generic productivity app.

It must feel like:

```text
a premium operating system for execution
```

The design must support the core product promise:

```text
Open Gigi. Know what matters next. Execute.
```

The interface should reduce noise, not add it.

---

# 2. Design Vision

Gigi OS should feel like a calm, intelligent command center.

The user should feel:

```text
I am in control.
I know what matters.
I can move forward now.
```

The design must communicate:

- focus;
- clarity;
- intelligence;
- calm power;
- premium execution;
- strategic direction.

---

# 3. Visual Identity

## 3.1 Keywords

```text
dark
premium
calm
minimal
cinematic
focused
intelligent
precise
futuristic
soft
```

## 3.2 What Gigi OS Should Feel Like

```text
A private operating system for building projects.
```

## 3.3 What Gigi OS Should Not Feel Like

```text
A colorful todo app.
A childish gamified app.
A corporate dashboard.
A chaotic AI chatbot.
A generic SaaS interface.
```

---

# 4. Core Design Principle

The main design principle is:

> **The interface must protect focus.**

Every visual decision should help the user understand:

```text
What matters now?
What should I ignore?
What action should I take?
```

---

# 5. Color Palette

## 5.1 Background Colors

The app should use deep dark backgrounds.

```text
Deep Black: #050507
Night Black: #090A0F
Soft Graphite: #11131A
Glass Surface: rgba(255, 255, 255, 0.06)
```

The background should never be pure flat black everywhere.

It should feel layered and premium.

---

## 5.2 Text Colors

```text
Primary Text: #F5F2EA
Secondary Text: #A9ADB8
Muted Text: #6F7480
Disabled Text: #444852
```

Primary text should be warm white, not harsh white.

---

## 5.3 Accent Colors

Gigi OS should use few accents.

```text
Electric Blue: #38BDF8
Deep Violet: #8B5CF6
Copper: #B87333
Soft Gold: #D6A85A
```

### Usage

```text
Electric Blue:
Main intelligence / active states / focus indicators

Deep Violet:
Brain / memory / AI-related elements

Copper:
Important action / execution / mission start

Soft Gold:
Milestones / achievements / premium highlights
```

---

## 5.4 Status Colors

Status colors must stay subtle.

```text
Success: #22C55E
Warning: #F59E0B
Danger: #EF4444
Info: #38BDF8
Neutral: #6B7280
```

No aggressive red unless there is a real destructive action.

---

# 6. Typography

## 6.1 Font Direction

The typography should feel modern, clear and premium.

Recommended font style:

```text
Modern sans-serif for interface
Slightly editorial serif only for rare hero moments
```

Possible font stack:

```text
Inter
SF Pro
Geist
Manrope
```

For a premium feel, titles may later use:

```text
Cormorant Garamond
Fraunces
Playfair Display
```

But the MVP should remain simple.

---

## 6.2 Type Scale

```text
Display: 48–64px
Page Title: 32–40px
Section Title: 22–28px
Card Title: 18–22px
Body: 15–17px
Small: 13–14px
Caption: 11–12px
```

---

## 6.3 Text Rules

Text must be:

```text
short
direct
clear
calm
useful
```

Avoid long paragraphs in the UI.

The app should feel like it has already thought for the user.

---

# 7. Layout System

## 7.1 Global Layout

The app should use a centered, spacious layout.

Recommended max width:

```text
1200px desktop
100% mobile
```

Spacing should be generous.

The interface should never feel crowded.

---

## 7.2 Grid

Suggested grid:

```text
Desktop:
12-column grid

Tablet:
8-column grid

Mobile:
1-column stacked layout
```

---

## 7.3 Spacing Scale

```text
4px
8px
12px
16px
24px
32px
48px
64px
96px
```

Use spacing to create calm.

Do not rely on borders everywhere.

---

# 8. Surfaces

## 8.1 Cards

Cards are the main interface surface.

Card style:

```text
dark translucent background
soft border
subtle blur
soft shadow
rounded corners
```

Recommended CSS direction:

```css
background: rgba(255, 255, 255, 0.06);
border: 1px solid rgba(255, 255, 255, 0.10);
backdrop-filter: blur(20px);
border-radius: 24px;
```

---

## 8.2 Mission Card

The Mission Card is the most important card in the app.

It must feel dominant but calm.

It should include:

```text
mission title
project
reason
estimated time
impact
confidence
primary action
```

It must not include too many secondary details.

---

## 8.3 Project Cards

Project cards should feel compact and readable.

Each card should show:

```text
name
status
progress
priority
next action
blocker
```

Project cards should not compete visually with the Mission Card.

---

# 9. Buttons

## 9.1 Primary Button

Used for:

```text
Start Mission
Complete Mission
Create Project
```

Style:

```text
high contrast
large
rounded
clear label
```

Suggested visual direction:

```text
copper or electric blue gradient
soft glow
dark text or white text depending contrast
```

---

## 9.2 Secondary Button

Used for:

```text
Explain
View Project
Edit
```

Style:

```text
transparent
soft border
muted text
```

---

## 9.3 Tertiary Actions

Used for:

```text
Postpone
Reject
Archive
```

These should be visible but not dominant.

Reject should not look dangerous unless it deletes data.

---

# 10. Navigation

## 10.1 MVP Navigation Items

```text
Mission
Projects
Brain
History
```

Mission must be first.

---

## 10.2 Navigation Style

The navigation should feel like part of an OS.

Possible layouts:

```text
left sidebar on desktop
bottom tab bar on mobile
```

The navigation should not attract too much attention.

The current section should be clear.

---

# 11. Iconography

## 11.1 Icon Style

Icons should be:

```text
minimal
line-based
slightly futuristic
consistent stroke width
not childish
```

Recommended icon direction:

```text
Lucide icons
Heroicons
custom line icons later
```

---

## 11.2 Core Icons

Suggested mapping:

```text
Mission: target / crosshair
Projects: folder / layers
Brain: brain / circuit
History: clock / timeline
Memory: archive / database
Settings: sliders
```

---

# 12. Motion

Motion should be subtle.

The app should not feel flashy.

## 12.1 Allowed Motion

```text
soft fade in
gentle card elevation
subtle glow on active mission
smooth page transitions
calm loading states
```

## 12.2 Avoid

```text
bouncing animations
childish rewards
excessive confetti
fast flashing
overly playful motion
```

---

# 13. Mission Mode Design

Mission Mode should feel like a focused cockpit.

When Mission Mode starts:

```text
navigation becomes minimal
secondary modules disappear
mission steps become central
timer appears
complete button becomes primary
```

The user should feel:

```text
I am inside one mission.
Nothing else matters right now.
```

---

# 14. Progress Indicators

Progress should be shown carefully.

Use:

```text
thin progress bars
percentage
small milestone labels
```

Avoid:

```text
overloaded charts
too many metrics
fake productivity scores
```

Progress must support execution, not vanity.

---

# 15. Data Visualization

For the MVP, data visualization should be minimal.

Allowed:

```text
small progress bars
score breakdown cards
simple timeline
mission confidence indicator
```

Not needed in MVP:

```text
complex dashboards
financial charts
multi-project analytics
heatmaps
productivity graphs
```

---

# 16. Screen Design Requirements

## 16.1 Mission Screen

The Mission screen should be the most polished screen.

Required visual hierarchy:

```text
1. Today's Mission
2. Mission title
3. Reason
4. Estimated duration / impact / confidence
5. Start Mission button
6. Secondary actions
```

The mission must dominate the page.

---

## 16.2 Projects Screen

The Projects screen must feel organized.

Required hierarchy:

```text
1. Page title
2. Active projects
3. Paused / future projects
4. Project cards
```

Critical projects should be visually stronger.

Paused projects should be visually quieter.

---

## 16.3 Brain Screen

The Brain screen should feel analytical but readable.

Required sections:

```text
Current decision
Score breakdown
Reasoning
Alternatives
Memory used
```

It must not feel like developer logs.

---

## 16.4 History Screen

The History screen should feel like a timeline of progress.

Required sections:

```text
Today
Yesterday
This week
Older
```

Events should be readable and human.

---

# 17. Voice and Copy

Gigi’s written voice should be:

```text
direct
calm
strategic
clear
honest
```

Gigi should not overpraise the user.

Good:

```text
Buildy Clear is the best mission today because it is closest to revenue.
```

Bad:

```text
Amazing! You are crushing it! Let's go superstar!
```

Good:

```text
Not now. This idea is useful, but it would distract from the current launch objective.
```

Bad:

```text
Sure, let's start another new thing.
```

---

# 18. Empty State Design

Empty states should be useful.

## No Projects

```text
Before Gigi can choose your next mission, add your first project.
```

Primary action:

```text
Add Project
```

## No History

```text
Your execution history will appear here once missions are started.
```

## No Mission

```text
Gigi needs at least one active project with a clear next action.
```

---

# 19. Accessibility

The design must remain accessible.

Requirements:

```text
high enough contrast
visible focus states
keyboard navigation
readable text sizes
clear button labels
no meaning based only on color
```

Dark mode must still be readable.

---

# 20. Responsive Design

Gigi OS must work well on:

```text
desktop
tablet
mobile web
```

The MVP can be web-first.

Mobile should remain clean, with Mission Screen first.

---

# 21. Design Tokens Draft

```ts
export const colors = {
  background: {
    deep: "#050507",
    night: "#090A0F",
    graphite: "#11131A",
  },
  text: {
    primary: "#F5F2EA",
    secondary: "#A9ADB8",
    muted: "#6F7480",
  },
  accent: {
    blue: "#38BDF8",
    violet: "#8B5CF6",
    copper: "#B87333",
    gold: "#D6A85A",
  },
  status: {
    success: "#22C55E",
    warning: "#F59E0B",
    danger: "#EF4444",
    neutral: "#6B7280",
  },
};
```

---

# 22. Tailwind Direction

Suggested Tailwind direction:

```text
dark background
rounded-2xl / rounded-3xl cards
border-white/10
bg-white/5
backdrop-blur-xl
text-stone-100
text-zinc-400
shadow soft
```

Example card style:

```tsx
className="
  rounded-3xl
  border
  border-white/10
  bg-white/[0.06]
  backdrop-blur-xl
  shadow-2xl
"
```

---

# 23. Component List

MVP components:

```text
AppShell
Sidebar
TopBar
MissionCard
MissionMode
ProjectCard
ProjectProgress
ScoreBreakdown
HistoryTimeline
DecisionReason
StatusBadge
ImpactBadge
ConfidenceIndicator
PrimaryButton
SecondaryButton
GlassCard
```

---

# 24. Component Rules

## 24.1 GlassCard

Base component for most surfaces.

Must support:

```text
title
children
optional action
optional accent
```

## 24.2 MissionCard

Must be visually dominant.

Must support:

```text
mission
project
reason
estimated duration
impact
confidence
actions
```

## 24.3 ProjectCard

Must be compact.

Must support:

```text
project name
status
progress
priority
next action
blocker
```

## 24.4 ScoreBreakdown

Must show criteria clearly.

Should not look like a complex analytics panel.

---

# 25. Design Acceptance Criteria

The design system is successful if:

- Gigi OS feels premium and calm;
- the Mission Screen is clearly the center of the product;
- the user understands the next action in less than 5 seconds;
- the UI does not feel like a generic todo app;
- the design supports focus;
- the interface looks coherent across screens;
- the dark theme remains readable;
- primary actions are obvious.

The design fails if:

- the interface feels overloaded;
- dashboards dominate the experience;
- too many colors compete;
- buttons are unclear;
- the user does not know what to click;
- the app feels childish;
- the app feels like Trello, Notion or Jira.

---

# 26. Cursor Build Instructions

Cursor should create a visual prototype using this design system.

Initial implementation:

```text
Next.js
TypeScript
Tailwind CSS
Static mock data
No database
No AI calls
No authentication
```

Suggested structure:

```text
components/ui/
  GlassCard.tsx
  PrimaryButton.tsx
  SecondaryButton.tsx
  StatusBadge.tsx
  ProgressBar.tsx

components/mission/
  MissionCard.tsx
  MissionMode.tsx

components/projects/
  ProjectCard.tsx

components/brain/
  ScoreBreakdown.tsx
  DecisionReason.tsx

components/history/
  HistoryTimeline.tsx
```

---

# 27. Final Principle

Gigi OS should not look busy.

It should look intelligent.

The best interface is not the one that shows everything.

It is the one that shows exactly what matters.

> **Design for focus. Design for execution. Design for calm power.**
