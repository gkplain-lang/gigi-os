# Gigi OS — Operating Rules

> **V0.5** — L'IA suggère via `askAiBrain()` ; le cerveau local reste fallback. Aucune action automatique. Voir `docs/AI_BRAIN_FOUNDATION.md`.

> **Clarity before action. Action before expansion.**

Version: `0.1`  
Status: Product Specification  
Owner: Germain Caplain  
Purpose: Define the behavioral rules that Gigi OS must follow when guiding the user, recommending missions and managing projects.

---

# 1. Purpose

This document defines the operating rules of Gigi OS.

These rules explain how Gigi OS should behave as a system.

Gigi OS is not just an interface.

Gigi OS is not just a decision engine.

Gigi OS is not just an AI assistant.

Gigi OS is an operating system for execution.

Its behavior must be consistent, reliable and focused.

The goal is simple:

```text
Help the user always know what matters next.
```

---

# 2. Core Operating Principle

The core operating principle is:

> **Gigi OS must protect the user from chaos.**

Chaos can come from:

```text
too many ideas
too many projects
too many options
too many dashboards
too many tools
too many AI suggestions
too many unfinished things
```

Gigi OS must reduce noise.

It must create focus.

---

# 3. The One Mission Rule

At any moment, Gigi OS must present one main mission.

Not five.

Not ten.

One.

The user may have many projects.

The system may store many tasks.

But the experience must always make one mission dominant.

Example:

```text
Today's Mission:
Finish the Buildy Clear sales page.
```

This rule protects execution.

---

# 4. The Mission-First Rule

Gigi OS must always be mission-first.

The home screen must not become:

```text
a dashboard
a notification center
a task list
a calendar
a chat window
an analytics page
```

The home screen must answer:

```text
What should I do now?
```

---

# 5. The Explainability Rule

Every recommendation must be explainable.

Gigi OS must never say:

```text
Do this.
```

without explaining why.

A valid recommendation must include:

```text
selected mission
related project
reason
expected impact
estimated duration
alternatives considered
why alternatives were not selected
```

Example:

```text
Buildy Clear is recommended because it is closest to short-term revenue, has a clear next action, and is near launch.
```

---

# 6. The “Not Now” Rule

Gigi OS must be allowed to say:

```text
Not now.
```

This is one of the most important product behaviors.

If the user wants to start a new idea while a higher-priority mission is active, Gigi OS should not automatically encourage it.

Example:

```text
This idea is interesting, but not now. Buildy Clear is still the fastest path to short-term revenue.
```

Gigi OS should never kill ideas.

It should park them.

---

# 7. The Idea Parking Rule

New ideas should be saved without becoming active by default.

Default status for a new idea:

```text
future
```

This allows the user to capture ideas without destroying focus.

Example:

```text
Le Dernier Souvenir is saved as a future creative project. It will not replace the current mission.
```

---

# 8. The Revenue Pressure Rule

When the user has a short-term money goal, Gigi OS must consider revenue pressure.

Example goal:

```text
Generate 300–500 € per month.
```

In this context, projects close to monetization should usually outrank long-term or creative projects.

Example:

```text
Buildy Clear should usually outrank Le Dernier Souvenir for short-term revenue.
```

This rule can change if the North Star changes.

---

# 9. The Completion Rule

When two projects have similar value, Gigi OS should favor the one closest to completion.

Reason:

```text
Finishing creates results.
Starting creates complexity.
```

Example:

```text
A 94% finished product should usually outrank a 5% idea.
```

---

# 10. The Clarity Rule

A clear mission outranks a vague mission.

Bad:

```text
Improve the app.
```

Good:

```text
Rewrite the Mission screen headline and primary action.
```

If a mission is vague, Gigi OS must clarify it before recommending it.

---

# 11. The Size Rule

A mission should usually take:

```text
15 to 90 minutes
```

If a mission is bigger than 90 minutes, Gigi OS should split it.

Bad:

```text
Launch Buildy Clear.
```

Good:

```text
Test the checkout flow.
```

---

# 12. The Blocker Rule

If a project is blocked, Gigi OS should not ignore it.

It should either:

```text
recommend a blocker-resolution mission
lower the project priority temporarily
ask for clarification
```

Example:

```text
Buildy Clear is blocked by an unfinished checkout. The best mission is to test the payment flow.
```

---

# 13. The User Override Rule

Gigi OS recommends.

The user decides.

The user must always be able to:

```text
accept
start
complete
postpone
reject
override
```

But every override should be remembered.

If the user rejects a mission, Gigi OS must ask why.

---

# 14. The Rejection Learning Rule

Rejected missions must improve the system.

A rejection is not failure.

It is feedback.

Possible rejection reasons:

```text
wrong priority
already done
too vague
too large
blocked
not relevant
not today
other
```

Gigi OS must use rejection history to improve future recommendations.

---

# 15. The Postponement Rule

Postponing is different from rejecting.

Postponing means:

```text
This is useful, but not now.
```

Rejecting means:

```text
This is not the right mission.
```

Gigi OS must store these differently.

If the same mission is postponed several times, Gigi OS should detect a blocker.

---

# 16. The No Fake Productivity Rule

Gigi OS must not create the illusion of progress.

It should not reward:

```text
moving tasks around
creating endless plans
opening dashboards
writing documents forever
changing priorities repeatedly
starting new projects too often
```

Gigi OS should reward real progress:

```text
mission completed
product shipped
sale made
bug fixed
page published
decision made
blocker removed
```

---

# 17. The Documentation Before Code Rule

For new major features, Gigi OS should prefer:

```text
specification before implementation
```

Especially for:

```text
decision logic
memory
automation
AI modules
security
integrations
database
```

This prevents Cursor from building in the wrong direction.

---

# 18. The No Overbuilding Rule

Gigi OS must avoid building future features too early.

Do not build:

```text
AI agents
Gmail integration
Calendar integration
GitHub sync
n8n workflows
payments
team accounts
voice mode
mobile app
```

until the core product works.

The core product is:

```text
projects
missions
decision engine
memory
history
focused UX
```

---

# 19. The Deterministic Core Rule

The core decision system must work without AI.

AI can improve:

```text
wording
summaries
explanations
mission generation
blocker detection
Cursor prompts
```

But AI must not replace the structured decision engine.

Bad:

```text
Ask AI what to do.
```

Good:

```text
Score projects with deterministic logic, then use AI to explain the recommendation better.
```

---

# 20. The Memory Continuity Rule

Gigi OS must not restart from zero every session.

It must remember:

```text
current projects
project status
missions completed
missions rejected
missions postponed
important decisions
blockers
North Star
current target
```

Memory exists to improve future decisions.

---

# 21. The Memory Quality Rule

Not everything deserves to become memory.

Good memory:

```text
Buildy Clear is the short-term revenue priority until the sales funnel is launched.
```

Bad memory:

```text
The user said this was cool.
```

Memory must be:

```text
useful
specific
current
connected to decisions
connected to projects
```

---

# 22. The Calm Interface Rule

The interface must remain calm.

Avoid:

```text
too many charts
too many colors
too many buttons
too many equal priorities
too many notifications
```

Prefer:

```text
one mission
one reason
one primary action
clear hierarchy
premium dark interface
```

---

# 23. The No Dashboard-First Rule

Dashboards are allowed later.

But Gigi OS must never become dashboard-first.

The user should not open Gigi OS to analyze everything.

The user should open Gigi OS to execute the next mission.

---

# 24. The Current Objective Rule

All recommendations must be evaluated against the current objective.

Example current target:

```text
Generate 300–500 € per month.
```

Example North Star:

```text
Build profitable digital products and software.
```

If the objective changes, priorities can change.

---

# 25. The Tradeoff Rule

When Gigi OS chooses one mission, it must acknowledge the tradeoff.

Example:

```text
Buildy Crafts is strategically important, but Buildy Clear has faster short-term revenue potential.
```

This builds trust.

---

# 26. The Strategic Patience Rule

Gigi OS should distinguish between:

```text
short-term revenue
long-term strategic value
creative upside
experimental potential
```

A project can be important without being today’s mission.

Example:

```text
Linko is strategic, but not the fastest path to revenue this week.
```

---

# 27. The Stale Project Rule

If an active project has not moved for a while, Gigi OS should detect it.

Possible response:

```text
This project is active but stale. I recommend a review mission.
```

A stale project should not automatically become priority.

It should be reviewed.

---

# 28. The Focus Protection Rule

If the user is in Mission Mode, Gigi OS must hide unrelated distractions.

Mission Mode should not show:

```text
other projects
new ideas
analytics
long task lists
future features
```

Mission Mode should show only:

```text
mission
steps
timer
completion action
```

---

# 29. The Approval Rule

Gigi OS must require approval before external actions.

Examples:

```text
send email
publish content
create GitHub issue
run n8n workflow
create calendar event
modify Drive file
charge payment
delete data
```

No high-impact external action should happen silently.

---

# 30. The Low Noise Rule

Gigi OS must not create many notifications.

Notify only for:

```text
important blockers
scheduled reviews
critical opportunities
requested reminders
automation failures
```

Do not notify for generic motivation.

---

# 31. The Cursor Discipline Rule

When preparing Cursor work, Gigi OS must be precise.

A Cursor prompt should always include:

```text
context
objective
files to read
what to build
what not to build
acceptance criteria
output expected
```

Cursor should not be asked:

```text
Make the app better.
```

Cursor should be asked:

```text
Build V0.2 Static UI Prototype with Mission, Projects, Brain and History screens using mock data only.
```

---

# 32. The No Random Agent Rule

Gigi OS must not create agents randomly.

AI modules must solve real problems.

Allowed later:

```text
CEO
Developer
Designer
Marketing
Business
Finance
Automation
Research
Legal
```

But only when each module has:

```text
clear purpose
input
output
rules
limits
approval requirements
```

---

# 33. The “Useful Before Powerful” Rule

Gigi OS must become useful before it becomes powerful.

A simple version used every day is better than a huge version never finished.

V0.2 must prove the feeling.

V0.3 must prove the logic.

V0.4 must prove memory.

V0.5 must prove AI value.

---

# 34. The Founder Mode Rule

Gigi OS should behave like a serious COO, not like a motivational coach.

Good:

```text
Not now. This would distract from the current launch objective.
```

Bad:

```text
Amazing idea! Let’s do everything!
```

Gigi OS should be supportive, but direct.

---

# 35. The Founder Energy Rule

Gigi OS should consider available time and energy.

If the user has 20 minutes:

```text
recommend a short mission
```

If the user has 2 hours:

```text
recommend a deeper mission
```

If energy is low:

```text
recommend a simple but useful task
```

The system should not recommend heavy missions blindly.

---

# 36. The Project Classification Rule

Every project must have a clear status:

```text
active
paused
future
archived
completed
```

New ideas should start as:

```text
future
```

Only active projects should usually generate daily missions.

---

# 37. The Active Project Limit Rule

Gigi OS should discourage too many active projects.

Recommended maximum active projects for solo builder:

```text
2 to 3
```

If more projects are active, Gigi OS should recommend pausing some.

Example:

```text
You currently have 5 active projects. This creates focus risk. I recommend keeping Buildy Clear and Gigi OS active, and pausing the rest.
```

---

# 38. The Weekly Review Rule

Gigi OS should eventually perform a weekly review.

Questions:

```text
What moved forward?
What stayed blocked?
What should remain active?
What should be paused?
What should be the focus next week?
```

Weekly review must stay short and actionable.

---

# 39. The Daily Review Rule

Gigi OS should eventually prepare a daily review.

It should answer:

```text
What happened recently?
What matters today?
What is the recommended mission?
Why?
```

It should not become a long report.

---

# 40. The Progress Reality Rule

Progress percentages must be treated as estimates.

Gigi OS should not pretend progress is exact.

Progress should help prioritization, not create fake precision.

Example:

```text
Buildy Clear is estimated near launch because the product exists and the sales tunnel is close.
```

---

# 41. The Business Honesty Rule

Gigi OS must not make unrealistic promises.

Bad:

```text
This will definitely make money.
```

Good:

```text
This has the best short-term revenue potential based on current project state.
```

Estimates must remain estimates.

---

# 42. The Product Identity Rule

Gigi OS should protect its identity.

Gigi OS is:

```text
mission-first
decision-focused
calm
structured
explainable
execution-oriented
```

Gigi OS is not:

```text
a chatbot
a todo app
a dashboard
a gamified toy
a random agent swarm
```

---

# 43. The Roadmap Discipline Rule

Gigi OS must respect the roadmap.

Current order:

```text
V0.1 Documentation
V0.2 Static UI Prototype
V0.3 Local Functional MVP
V0.4 Supabase MVP
V0.5 AI-Assisted MVP
V1.0 Daily Use Version
```

Do not skip directly to agents or automation.

---

# 44. The System Self-Use Rule

Gigi OS should eventually be used to build Gigi OS.

Example:

```text
Project:
Gigi OS

Mission:
Create docs/OPERATING_RULES.md
```

This creates product validation from real use.

---

# 45. The Failure Detection Rule

Gigi OS should detect when it is failing.

Warning signs:

```text
the user ignores missions
missions are too vague
too many projects are active
recommendations feel wrong
history is not useful
project state is outdated
Gigi cannot explain its decisions
```

When failure is detected, Gigi OS should recommend a review mission.

---

# 46. The No Shame Rule

Gigi OS must never shame the user.

It can be direct.

It can say no.

But it should not guilt the user.

Good:

```text
This mission has been postponed several times. It may be too large. I recommend splitting it.
```

Bad:

```text
You failed to complete this again.
```

---

# 47. The Decision Log Rule

Important decisions must be stored.

A decision record should include:

```text
selected mission
selected project
reason
score
alternatives
user response
date
```

This prevents repeated debates.

---

# 48. The External Signal Rule

Future integrations can provide signals.

Examples:

```text
GitHub commit
Gmail message
Calendar availability
Stripe sale
n8n workflow failure
```

But external signals should not automatically override the Decision Engine.

They provide context.

Gigi OS decides.

---

# 49. The Simplification Rule

When Gigi OS becomes too complex, simplify.

Possible simplifications:

```text
hide secondary projects
reduce visible metrics
merge screens
remove unused features
split large missions
pause low-priority projects
```

The best feature may be removing a feature.

---

# 50. Final Operating Principle

Gigi OS exists to create clarity and execution.

It should always protect the user from:

```text
noise
overthinking
dispersion
false urgency
unfinished loops
random AI suggestions
```

Its best behavior is not saying more.

Its best behavior is saying the right thing at the right time.

> **Know what matters next. Then do it.**
