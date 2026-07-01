# Gigi OS — Automation System

> **Automation should support execution, not replace judgment.**

Version: `0.1`  
Status: Product Specification  
Owner: Germain Caplain  
Purpose: Define how automation will be introduced inside Gigi OS without creating chaos, complexity or loss of control.

---

# 1. Purpose

This document defines the future automation system of Gigi OS.

Automation is not part of the MVP.

Gigi OS must first prove that it can:

```text
understand projects
recommend one mission
explain decisions
store history
support focused execution
```

Only after that should automation be added.

Automation must never be added just because it is technically possible.

Automation must solve real friction.

---

# 2. Core Principle

The core automation principle is:

> **Automate preparation before execution.**

In early versions, Gigi OS should prepare work for the user.

Later, it can execute certain actions with explicit approval.

Gigi OS should never silently perform high-impact actions without user confirmation.

---

# 3. What Automation Is For

Automation should help Gigi OS:

```text
collect useful project signals
prepare daily briefings
summarize progress
detect blockers
create draft tasks
prepare Cursor prompts
prepare content drafts
sync project activity
reduce manual updates
```

Automation should make the user’s day clearer.

It should not create more noise.

---

# 4. What Automation Is Not For

Automation must not:

```text
send emails without approval
publish content without approval
spend money
delete data
change priorities silently
create projects randomly
trigger workflows without context
generate endless notifications
replace the user’s final decision
```

Automation must be controlled.

---

# 5. MVP Automation Scope

Automation is not included in:

```text
V0.2 Static UI Prototype
V0.3 Local Functional MVP
V0.4 Supabase MVP
```

Automation preparation begins around:

```text
V0.7 Automation Preparation
```

First real integrations begin around:

```text
V0.8 Integrations Alpha
```

---

# 6. Automation Maturity Levels

Gigi OS automation should evolve through levels.

## Level 0 — No Automation

Manual use only.

The user updates projects, missions and progress manually.

## Level 1 — Assisted Preparation

Gigi OS prepares suggestions.

Example:

```text
Gigi prepared a Cursor prompt for the next mission.
```

The user copies or approves it.

## Level 2 — Draft Creation

Gigi OS creates drafts.

Examples:

```text
draft email
draft TikTok script
draft GitHub issue
draft daily report
```

The user must approve before sending or publishing.

## Level 3 — Approved Execution

Gigi OS can execute actions after explicit user approval.

Examples:

```text
create GitHub issue
send approved email
run approved n8n workflow
create calendar event
```

## Level 4 — Conditional Automation

Gigi OS can monitor conditions and notify the user.

Example:

```text
If a GitHub build fails, create a blocker and notify the user.
```

## Level 5 — Autonomous Low-Risk Execution

Only for safe, reversible, low-risk actions.

Example:

```text
create internal history event
update project activity timestamp
draft weekly summary
```

Not for sending, publishing, spending or deleting.

---

# 7. Automation Safety Rules

## Rule 1

Automation must be visible.

## Rule 2

Automation must be explainable.

## Rule 3

Automation must be reversible when possible.

## Rule 4

External actions require approval.

## Rule 5

Automation must not create noise.

## Rule 6

Automation must support the current mission.

## Rule 7

Automation must respect the roadmap.

## Rule 8

Automation must never bypass the Decision Engine.

---

# 8. Automation Architecture

Future automation should be isolated from core modules.

Suggested structure:

```text
modules/automation/
  automationTypes.ts
  automationRules.ts
  automationEvents.ts
  automationQueue.ts
  automationApprovals.ts
  automationLogs.ts
  workflowRegistry.ts
```

Future integrations should live separately:

```text
integrations/
  github/
  gmail/
  calendar/
  drive/
  n8n/
  cursor/
  stripe/
```

Automation should call integrations through clean service interfaces.

---

# 9. Event-Based System

Automation should be event-based.

Important events:

```text
mission_completed
mission_postponed
mission_rejected
project_updated
project_blocked
project_stale
decision_created
weekly_review_due
daily_review_due
external_signal_received
```

Example:

```text
Event:
mission_completed

Possible automation:
create history event
update project last_worked_on
recalculate next mission
prepare next Cursor prompt
```

---

# 10. Automation Event Model

Fields:

```text
id
event_type
source
project_id
mission_id
payload_json
created_at
processed_at
status
```

Status values:

```text
pending
processed
failed
ignored
requires_approval
```

---

# 11. Automation Actions

An automation action is something Gigi OS can prepare or execute.

Fields:

```text
id
type
title
description
risk_level
requires_approval
status
payload_json
created_at
executed_at
```

Status values:

```text
draft
waiting_for_approval
approved
executed
rejected
failed
cancelled
```

Risk levels:

```text
low
medium
high
critical
```

---

# 12. Risk Levels

## Low Risk

Safe and internal.

Examples:

```text
create history event
update last_worked_on
draft summary
prepare prompt
```

Can be automatic later.

## Medium Risk

Visible but reversible.

Examples:

```text
create GitHub issue
create calendar event
create draft email
```

Requires approval initially.

## High Risk

External communication or important state change.

Examples:

```text
send email
publish content
change project priority
archive project
run n8n workflow
```

Requires explicit approval.

## Critical Risk

Money, deletion or public action.

Examples:

```text
charge customer
delete data
publish public post
send mass email
change billing
```

Must always require explicit confirmation.

---

# 13. Approval System

Any medium, high or critical action must have an approval step.

Approval UI should show:

```text
what will happen
why it is recommended
what data will be used
risk level
confirm button
cancel button
```

Example:

```text
Gigi prepared a GitHub issue for the current mission.

Action:
Create GitHub issue

Project:
Gigi OS

Risk:
Medium

Reason:
This will help Cursor build the next milestone.

[Approve] [Cancel]
```

---

# 14. Automation Logs

Every automation must be logged.

Fields:

```text
id
action_id
event_id
status
result_summary
error_message
created_at
```

Logs should be readable.

Not only technical.

Example:

```text
Prepared Cursor prompt for V0.3 Local Functional MVP.
```

---

# 15. n8n Integration

n8n will be used later as the workflow automation layer.

Potential workflows:

```text
daily briefing
weekly review
GitHub activity summary
Gmail summary
Calendar availability check
Drive document sync
content publication draft workflow
sales notification workflow
```

n8n should not be added before the internal automation model exists.

---

# 16. n8n Principles

## Principle 1

Gigi OS decides what should happen.

n8n executes workflows.

## Principle 2

n8n should not contain core product logic.

## Principle 3

n8n workflows must be triggered by structured events.

## Principle 4

n8n outputs must return structured results to Gigi OS.

## Principle 5

Critical workflows require approval.

---

# 17. n8n Workflow Structure

Each workflow should have:

```text
name
trigger
input schema
steps
output schema
risk level
approval requirement
error handling
```

Example:

```text
Workflow:
Daily Project Briefing

Trigger:
daily_review_due

Input:
active projects, open missions, recent history

Steps:
summarize progress
detect blockers
prepare daily mission context

Output:
daily briefing summary
recommended focus notes
```

---

# 18. GitHub Integration

GitHub is likely the first useful integration.

Purpose:

```text
understand code project progress
summarize commits
read issues
detect stale repositories
prepare Cursor tasks
```

Possible features:

```text
connect repository
read latest commits
read open issues
summarize changes
detect inactive repo
create issue after approval
prepare pull request summary
```

GitHub should improve project memory.

It should not replace project planning.

---

# 19. Cursor Integration

Cursor integration should initially mean:

```text
Gigi prepares prompts for Cursor.
```

Not direct control.

Useful actions:

```text
generate development prompt
generate audit prompt
generate refactor prompt
generate bug-fix prompt
summarize docs for Cursor
prepare implementation checklist
```

Later, if APIs or workflows allow it, Gigi could create issues or tasks that Cursor can act on.

---

# 20. Gmail Integration

Gmail can be useful later, but should be added carefully.

Possible features:

```text
summarize important emails
detect client opportunities
detect invoices or payments
prepare draft replies
extract project-related messages
```

Rules:

```text
never send without approval
do not read irrelevant emails unnecessarily
summaries must be concise
important emails can become missions
```

---

# 21. Calendar Integration

Calendar can help Gigi recommend realistic missions.

Possible features:

```text
detect available work blocks
suggest mission duration
schedule mission time
avoid recommending deep work when time is short
```

Example:

```text
You have 45 minutes free. I recommend a short Buildy Clear mission instead of a deep Buildy Crafts session.
```

---

# 22. Google Drive Integration

Drive can be used to access project documents.

Possible features:

```text
find project files
summarize documents
detect outdated docs
sync project documentation
store generated plans
```

Rules:

```text
do not edit files without approval
do not duplicate documents unnecessarily
do not use Drive as random storage
```

---

# 23. Stripe / Payments Integration

Payments should only be added when Gigi OS becomes a SaaS or when tracking revenue becomes useful.

Possible features:

```text
track subscription revenue
detect first sale
update revenue goal
create milestone event
```

Critical rule:

```text
Never change billing or charge users without explicit confirmation and proper product flows.
```

---

# 24. Daily Briefing Automation

Future daily briefing should answer:

```text
What happened yesterday?
What is blocked?
What matters today?
What mission should be started?
```

Example:

```text
Good morning.

Yesterday:
You completed docs/DATA_MODEL.md.

Today:
The best mission is docs/AI_MODULES.md.

Why:
Core documentation is nearly complete and Cursor needs clear AI boundaries before development.
```

This must remain short.

---

# 25. Weekly Review Automation

Weekly review should answer:

```text
What progressed?
What stalled?
What changed?
Which project should be priority next week?
What should be paused?
```

It should not become a long report nobody reads.

---

# 26. Automation and Memory

Automation should create memory only when useful.

Examples:

```text
mission completed
important blocker detected
weekly strategic decision made
first sale received
project became stale
```

Automation should not create memory for every tiny event.

---

# 27. Automation and Decision Engine

Automation can provide signals to the Decision Engine.

Examples:

```text
GitHub repo inactive for 10 days
Gmail contains urgent client message
Calendar has only 30 minutes available
Stripe detected sale
n8n workflow failed
```

The Decision Engine still decides priority.

Automation provides context.

---

# 28. Automation and Mission System

Automation can generate missions from signals.

Examples:

```text
GitHub build failed -> Fix failing build
Gmail client reply -> Respond to client
Calendar free block -> Start short mission
Stripe first sale -> Review conversion path
```

Generated missions must still pass through Gigi’s mission quality rules.

---

# 29. Notification Rules

Notifications should be rare.

Only notify when:

```text
urgent action needed
important blocker detected
scheduled review ready
external high-value signal received
condition watch is triggered
```

Do not notify for:

```text
random updates
minor changes
low-priority suggestions
generic motivation
```

---

# 30. Automation Failure Handling

Automation can fail.

Failures must be handled calmly.

Failure types:

```text
workflow failed
integration disconnected
permission missing
invalid output
timeout
API limit reached
approval expired
```

Recovery:

```text
show clear error
log failure
offer retry
fallback to manual action
do not block core product
```

---

# 31. Automation Security

When integrations are added:

```text
store secrets securely
use least-privilege permissions
never expose API keys
respect user consent
log external actions
allow disconnecting integrations
```

Gigi OS must be trustworthy.

---

# 32. Automation MVP Boundary

Automation is future work.

The first automation-related implementation should be only:

```text
types
event model
action model
approval model
logs model
workflow registry placeholder
```

No real workflows yet.

---

# 33. Cursor Build Instructions

Cursor must not build automation in V0.2.

For later preparation, Cursor may create placeholders:

```text
modules/automation/
  automationTypes.ts
  automationEvents.ts
  automationActions.ts
  automationLogs.ts
```

No n8n connection.

No external API.

No background jobs.

No webhooks.

---

# 34. Automation Acceptance Criteria

The automation system is successful if:

```text
automation reduces manual work
automation supports the current mission
automation is explainable
automation is logged
external actions require approval
automation does not create noise
automation does not bypass the Decision Engine
automation can be disabled
```

The automation system fails if:

```text
it creates too many notifications
it executes risky actions silently
it makes the app harder to understand
it replaces judgment with blind workflows
it adds integrations before the product is useful
it turns Gigi OS into a chaotic agent system
```

---

# 35. Final Principle

Automation is powerful only when the system already knows what matters.

Gigi OS must first become clear.

Then it can become automatic.

> **Do not automate confusion. Automate clarity.**
