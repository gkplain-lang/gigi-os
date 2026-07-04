# Gigi OS — AI Modules

> **V0.5.0 foundation livrée** — module `modules/ai/`, IA optionnelle, fallback local via `askGigi()`. Détails : `docs/AI_BRAIN_FOUNDATION.md`.

> **AI should improve decisions, not create chaos.**

Version: `0.1`  
Status: Product Specification  
Owner: Germain Caplain  
Purpose: Define how AI modules will be used inside Gigi OS without compromising clarity, control or product focus.

---

# 1. Purpose

This document defines the role of AI inside Gigi OS.

Gigi OS is not a chatbot.

Gigi OS is not a random collection of agents.

Gigi OS is a decision and execution operating system.

AI should only be added when it improves:

```text
decision quality
mission clarity
project understanding
memory summaries
execution speed
strategic reasoning
```

AI must not make the product noisy, unpredictable or overcomplicated.

---

# 2. Core AI Principle

The core AI principle is:

> **AI suggests. Gigi OS decides. The user remains in control.**

AI modules can:

```text
suggest missions
rewrite explanations
summarize projects
detect blockers
prepare prompts
analyze progress
generate ideas
```

AI modules must not silently change:

```text
project status
mission status
priority
history
memory
settings
user goals
billing
external tools
```

Any important change must be visible, explainable and reversible.

---

# 3. AI Is Not Required for the MVP

The first versions of Gigi OS must work without AI.

## V0.2

```text
No AI.
Static prototype only.
```

## V0.3

```text
No AI required.
Local deterministic decision engine.
```

## V0.4

```text
No AI required.
Database persistence.
```

## V0.5

```text
AI-assisted features can begin.
```

This prevents Gigi OS from becoming dependent on an external model before the core product is validated.

---

# 4. Deterministic First Rule

Bad architecture:

```text
Ask AI what the user should do next.
```

Good architecture:

```text
Use structured project data and scoring to select a mission.
Use AI to improve the wording, explanation and context.
```

The Decision Engine remains the source of truth.

AI improves the experience around it.

---

# 5. What AI Should Do

AI should help with:

```text
mission generation
mission rewriting
decision explanation
project summarization
blocker detection
weekly review
prompt preparation
strategic analysis
content generation
agent task preparation
```

AI should not replace the core system logic.

---

# 6. What AI Should Not Do

AI must not:

```text
create random new projects
change priorities without confirmation
overwrite memory silently
delete data
send emails
publish content
spend money
connect integrations automatically
execute external workflows without approval
create fake certainty
hide reasoning
```

Gigi OS must always remain transparent.

---

# 7. AI Module Architecture

AI should be implemented as a separate layer.

Suggested structure:

```text
modules/ai/
  aiTypes.ts
  aiClient.ts
  aiConfig.ts
  prompts/
    missionGeneration.ts
    decisionExplanation.ts
    projectSummary.ts
    blockerDetection.ts
    weeklyReview.ts
    cursorPrompt.ts
  services/
    generateMission.ts
    explainDecision.ts
    summarizeProject.ts
    detectBlockers.ts
    generateWeeklyReview.ts
    prepareCursorPrompt.ts
```

The AI layer should receive structured inputs and return structured outputs.

---

# 8. Structured Input Rule

AI should never receive vague prompts when structured data is available.

Bad:

```text
What should I do today?
```

Good:

```json
{
  "northStar": "Generate 500 € per month from digital products.",
  "availableTime": 45,
  "projects": [
    {
      "name": "Buildy Clear",
      "status": "active",
      "progress": 94,
      "nextAction": "Finish the sales page",
      "businessPotential": 9,
      "urgency": 9
    }
  ],
  "decisionEngineRecommendation": {
    "mission": "Finish the Buildy Clear sales page",
    "score": 87
  }
}
```

Structured input makes AI more reliable.

---

# 9. Structured Output Rule

AI responses should be structured whenever possible.

Example output for mission explanation:

```json
{
  "summary": "Buildy Clear is the best mission today because it is closest to short-term revenue.",
  "whyNow": "The project is near launch and has a clear next action.",
  "tradeoffs": [
    {
      "project": "Buildy Crafts",
      "reason": "Strategic but longer-term."
    }
  ],
  "confidence": 87
}
```

Do not rely on long unstructured text for product logic.

---

# 10. AI Modules

Gigi OS can eventually contain multiple AI modules.

These are not random agents.

They are controlled modules inside the OS.

---

## 10.1 Brain AI Module

Purpose:

```text
Improve strategic reasoning and decision explanations.
```

Can do:

```text
rewrite decision explanations
explain tradeoffs
summarize why a mission matters
identify weak project data
```

Must not:

```text
override deterministic scoring without confirmation
change mission selection silently
```

---

## 10.2 Mission AI Module

Purpose:

```text
Turn vague next actions into clear missions.
```

Example input:

```text
Finish sales page.
```

Example output:

```text
Rewrite the headline, CTA and guarantee section of the Buildy Clear sales page.
```

Can do:

```text
make missions clearer
split large missions
generate mission steps
estimate duration
improve action wording
```

Must not:

```text
create endless task lists
generate 20 missions at once
turn Gigi OS into a todo app
```

---

## 10.3 Project AI Module

Purpose:

```text
Summarize project state and detect unclear projects.
```

Can do:

```text
summarize project vision
identify missing next action
detect stale projects
suggest blocker resolution
suggest progress updates
```

Must not:

```text
change project status automatically
archive projects without approval
invent project facts
```

---

## 10.4 Memory AI Module

Purpose:

```text
Compress history into useful memory.
```

Can do:

```text
summarize completed missions
extract strategic decisions
detect repeated blockers
create project summaries
mark outdated memories for review
```

Must not:

```text
store sensitive or irrelevant memory automatically
delete memory without approval
rewrite history
```

---

## 10.5 Cursor AI Module

Purpose:

```text
Prepare high-quality prompts for Cursor.
```

Can do:

```text
generate development prompts
convert specs into implementation tasks
prepare audit prompts
summarize code changes needed
create build checklists
```

Example:

```text
Generate a Cursor prompt to build V0.2 Static UI Prototype following docs/MVP_SPEC.md and docs/DESIGN_SYSTEM.md.
```

Must not:

```text
ask Cursor to overbuild
skip documentation
add backend too early
```

---

## 10.6 Marketing AI Module

Purpose:

```text
Help generate content and acquisition ideas.
```

Can do:

```text
write TikTok scripts
write landing page copy
generate campaign ideas
analyze positioning
prepare launch content
```

Must remain connected to current priorities.

Example:

If Buildy Clear is the short-term revenue priority, Marketing AI should focus on:

```text
Buildy Clear content
Buildy Clear sales copy
Buildy Clear traffic strategy
```

Not unrelated ideas.

---

## 10.7 Business AI Module

Purpose:

```text
Evaluate monetization, pricing and strategic choices.
```

Can do:

```text
estimate revenue scenarios
compare business models
prioritize short-term vs long-term projects
suggest pricing tests
analyze project ROI
```

Must not:

```text
make unrealistic guarantees
hide assumptions
treat estimates as facts
```

---

## 10.8 Designer AI Module

Purpose:

```text
Support product and interface design.
```

Can do:

```text
generate UI concepts
improve layout hierarchy
suggest design systems
write design prompts
review screens
```

Must follow:

```text
docs/DESIGN_SYSTEM.md
docs/UX_FLOWS.md
```

---

## 10.9 Automation AI Module

Purpose:

```text
Prepare future n8n and integration workflows.
```

Can do:

```text
design workflows
write automation specs
identify triggers and actions
prepare n8n plans
```

Must not:

```text
execute workflows without approval
connect accounts automatically
send messages automatically
publish content automatically
```

---

# 11. AI Module Maturity Levels

AI modules should evolve through levels.

## Level 0 — No AI

The module is deterministic.

## Level 1 — AI Copy Assistance

AI improves wording only.

Example:

```text
Rewrite this mission explanation more clearly.
```

## Level 2 — AI Suggestion

AI suggests possible actions.

Example:

```text
Suggest 3 clearer missions based on this project.
```

## Level 3 — AI Recommendation Support

AI supports the Decision Engine with analysis.

Example:

```text
Identify blockers and risks in this project state.
```

## Level 4 — AI Draft Execution

AI prepares assets or prompts.

Example:

```text
Prepare a Cursor prompt to build the next feature.
```

## Level 5 — Controlled Automation

AI can trigger workflows only with explicit approval.

Not part of MVP.

---

# 12. AI Safety Rules

## Rule 1

AI must never be the only source of truth.

## Rule 2

AI must not silently mutate important data.

## Rule 3

AI outputs must be reviewable.

## Rule 4

AI must stay inside the current product context.

## Rule 5

AI must explain uncertainty.

## Rule 6

AI must not generate fake progress.

## Rule 7

AI must not encourage project switching without strong reason.

## Rule 8

AI must follow the current roadmap.

---

# 13. Prompt Standards

Every AI prompt should include:

```text
role
context
input data
task
constraints
output format
quality bar
```

Example prompt structure:

```text
You are the Mission AI module of Gigi OS.

Context:
Gigi OS helps the user know what to work on next.

Input:
[structured project data]

Task:
Rewrite the next action into one clear mission.

Constraints:
- One mission only.
- 15 to 90 minutes.
- Must be actionable.
- Must belong to the project.
- Do not create a task list.

Output:
Return JSON with title, description, steps, duration, impact and reason.
```

---

# 14. AI Output Validation

AI output must be validated before being used.

Validation should check:

```text
is the output structured?
is the mission clear?
does it belong to a project?
is it too large?
does it invent facts?
does it violate roadmap scope?
does it create too many options?
```

Invalid AI output should be rejected or regenerated.

---

# 15. AI and Decision Engine

The Decision Engine should remain deterministic.

AI can support it by:

```text
improving explanations
detecting blockers
summarizing alternatives
suggesting mission wording
```

But final scoring should remain visible.

Example:

```text
Decision Engine score:
87%

AI explanation:
Buildy Clear is recommended because it is closest to revenue and has a clear next action.
```

---

# 16. AI and Mission System

AI can help transform vague work into clear missions.

Input:

```text
Project next action:
Improve Buildy Clear sales page.
```

Output:

```json
{
  "title": "Rewrite the headline and CTA of the Buildy Clear sales page",
  "description": "Improve the first section so visitors understand the value quickly and have a clear next action.",
  "estimatedDuration": 45,
  "steps": [
    "Open the sales page",
    "Rewrite the headline",
    "Rewrite the CTA",
    "Save and review"
  ]
}
```

---

# 17. AI and Memory System

AI can help compress memory.

Example raw events:

```text
Created PRD.
Created Decision Engine.
Created Mission System.
Created Project Model.
```

AI summary:

```text
Gigi OS documentation foundation is being built. The core product logic is now defined around missions, projects, decision-making and memory.
```

This summary can improve future recommendations.

---

# 18. AI and Cursor

One of the most useful early AI modules is the Cursor module.

Its role:

```text
turn product specs into precise development prompts
```

Example output:

```text
Build V0.2 Static UI Prototype.
Read docs first.
Use mock data only.
Do not add Supabase.
Do not add AI.
Create Mission, Projects, Brain and History screens.
```

This prevents Cursor from overbuilding.

---

# 19. AI Cost Control

AI usage must be controlled.

Rules:

```text
Do not call AI for every small UI action.
Do not use AI when deterministic logic is enough.
Cache AI summaries when possible.
Use short structured prompts.
Avoid long context unless necessary.
Use AI only where it improves value.
```

The MVP should not require paid AI calls.

---

# 20. AI Provider Strategy

Gigi OS should not be locked into one model provider too early.

Possible providers later:

```text
OpenAI
Anthropic
Google
Mistral
local models
compatible LLM APIs
```

Architecture should allow provider switching.

Suggested abstraction:

```ts
type AIProvider = {
  generateText(input: AITextInput): Promise<AITextOutput>;
  generateStructured<T>(input: AIStructuredInput): Promise<T>;
};
```

---

# 21. AI Configuration

Suggested configuration fields:

```text
provider
model
temperature
max_tokens
enabled_modules
cost_limit
fallback_enabled
```

For decision-related tasks, temperature should stay low.

Example:

```text
temperature: 0.2
```

For creative marketing tasks, temperature can be higher.

Example:

```text
temperature: 0.7
```

---

# 22. AI Logs

AI outputs should be logged when they affect decisions.

AI log fields:

```text
id
module
input_summary
output_summary
model
created_at
user_accepted
```

Do not store sensitive raw prompts unnecessarily.

---

# 23. Human Approval

AI actions that affect external systems require approval.

Examples requiring approval:

```text
sending email
publishing content
creating GitHub issues
running n8n workflow
changing project priority
archiving project
```

Approval copy:

```text
Gigi prepared this action. Do you want to execute it?
```

---

# 24. AI Failure Modes

Gigi OS must handle AI failure.

Possible failures:

```text
AI unavailable
AI output too vague
AI invents information
AI returns invalid JSON
AI recommends too many actions
AI contradicts roadmap
AI suggests out-of-scope feature
```

Recovery:

```text
fallback to deterministic logic
ask for user confirmation
retry with stricter prompt
show error clearly
do not block core product
```

---

# 25. MVP AI Scope

AI is not part of V0.2 or V0.3.

For V0.5, first AI features should be:

```text
AI decision explanation
AI mission rewriting
AI project summary
AI Cursor prompt generator
```

Do not start with:

```text
autonomous agents
voice interface
integrations
automation execution
multi-agent orchestration
```

---

# 26. Future AI Team

Later, Gigi OS can expose AI modules as an “AI Team”.

Possible roles:

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

But these roles must be productized carefully.

They should not appear in the MVP.

---

# 27. AI Team Rule

The AI Team must never become a distraction.

Each AI role must answer:

```text
How does this help the user decide or execute?
```

If the answer is unclear, the role should not be built yet.

---

# 28. Example AI Team Use Cases

## CEO

```text
Review all projects and suggest the weekly focus.
```

## Developer

```text
Prepare a Cursor prompt for the next build milestone.
```

## Designer

```text
Review the Mission screen and suggest UI improvements.
```

## Marketing

```text
Generate 10 TikTok scripts for Buildy Clear.
```

## Business

```text
Compare Buildy Clear and Buildy Crafts for short-term revenue potential.
```

## Automation

```text
Design an n8n workflow to summarize GitHub activity.
```

---

# 29. Cursor Build Instructions

For now, Cursor should only create AI module placeholders.

Required files later:

```text
modules/ai/aiTypes.ts
modules/ai/aiConfig.ts
modules/ai/prompts/missionGeneration.ts
modules/ai/prompts/decisionExplanation.ts
modules/ai/prompts/projectSummary.ts
modules/ai/prompts/cursorPrompt.ts
```

But Cursor must not add real AI calls in V0.2.

---

# 30. AI Module Acceptance Criteria

The AI system is successful if:

```text
AI improves clarity.
AI does not make decisions hidden.
AI does not create chaos.
AI respects the roadmap.
AI outputs are structured.
AI actions are reviewable.
AI never breaks deterministic core logic.
AI helps the user execute faster.
```

The AI system fails if:

```text
Gigi becomes just another chatbot.
AI creates too many options.
AI changes priorities without explanation.
AI invents project facts.
AI adds cost before value is proven.
AI makes the app unusable without API access.
AI distracts from the Mission screen.
```

---

# 31. Final Principle

AI in Gigi OS is not the product.

The product is clarity.

AI is useful only when it helps the user know what matters next and execute faster.

> **Do not build AI for spectacle. Build AI for better decisions.**
