import type { QueuedAction } from "@/modules/actionQueue/types";
import type { ExecutionPlan } from "@/modules/executionPlans/types";
import type { SafeActionWorkspace } from "@/modules/safeActionWorkspace/types";
import { getCachedExecutionPlan } from "@/modules/executionPlans/executionPlanBuilder";
import {
  aggregateContextFromQueuedAction,
  createWorkspaceFromContext,
} from "@/modules/safeActionWorkspace/safeActionWorkspaceEngine";
import { SAFE_ACTION_WORKSPACE_READINESS_LABELS } from "@/modules/safeActionWorkspace/types";
import type {
  ManualExecutionHandoff,
  ManualExecutionHandoffChecklistItem,
  ManualExecutionHandoffRisk,
  ManualExecutionHandoffSection,
  ManualExecutionHandoffTarget,
} from "./types";
import {
  DEFAULT_EXPECTED_REPORT_FIELDS,
  DEFAULT_SAFETY_RULES,
  MANUAL_EXECUTION_HANDOFF_DISCLAIMER,
  MANUAL_EXECUTION_HANDOFF_ID_PREFIX,
} from "./types";

export interface HandoffBuildInput {
  actionTitle: string;
  objective: string;
  scope: string;
  contextSummary: string;
  projectId?: string;
  missionId?: string;
  projectName?: string;
  sourceWorkspaceId?: string;
  sourceActionId?: string;
  sourceExecutionPlanId?: string;
  sourceBridgeId?: string;
  readinessLabel?: string;
  manualSteps: string[];
  theoreticalCommands: string[];
  tests: string[];
  rollbackSteps: string[];
  successCriteria: string[];
  relatedFiles: string[];
  prerequisites: string[];
  risks: ManualExecutionHandoffRisk[];
  checklist: ManualExecutionHandoffChecklistItem[];
  workspaceSections?: SafeActionWorkspace["sections"];
}

function nowIso(): string {
  return new Date().toISOString();
}

function generateId(prefix: string): string {
  return `${prefix}${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

export function buildExpectedReportTemplate(actionTitle: string): string {
  const lines = [
    "# Rapport d'exécution manuel — Gigi",
    "",
    ...DEFAULT_EXPECTED_REPORT_FIELDS.map((f) => `${f} `),
    "",
    `Action de référence : ${actionTitle}`,
    "",
    MANUAL_EXECUTION_HANDOFF_DISCLAIMER,
  ];
  return lines.join("\n");
}

export function buildCursorPrompt(input: HandoffBuildInput, target: ManualExecutionHandoffTarget): string {
  const steps = input.manualSteps.map((s, i) => `${i + 1}. ${s.replace(/^\d+\.\s*/, "")}`).join("\n");
  const tests = input.tests.length > 0 ? input.tests.join("\n") : "npm run build\nnpm run lint si pertinent";
  const rollback =
    input.rollbackSteps.length > 0
      ? input.rollbackSteps.join("\n")
      : "Annuler uniquement les modifications liées à cette action\nNe pas toucher aux autres fichiers";

  const targetLine =
    target === "cursor"
      ? "Tu vas exécuter manuellement une action préparée par Gigi dans Cursor."
      : target === "human"
        ? "Instructions pour exécution manuelle par un humain — Gigi ne lance rien."
        : "Exécution manuelle préparée par Gigi — copie et applique toi-même.";

  return [
    targetLine,
    "Respecte strictement le périmètre.",
    "Ne touche pas à .env.local.",
    "Ne commit pas sans validation.",
    "Ne supprime aucune donnée.",
    "Ne branche aucun service externe.",
    "Ne lance aucune sync/restore.",
    "À la fin, donne un rapport avec fichiers modifiés, tests, erreurs, statut Git et recommandations.",
    "",
    `Action : ${input.actionTitle}`,
    `Objectif : ${input.objective}`,
    `Contexte : ${input.contextSummary}`,
    "",
    "Plan :",
    steps,
    "",
    "Tests :",
    tests,
    "",
    "Rollback :",
    rollback,
    "",
    "Rapport attendu :",
    buildExpectedReportTemplate(input.actionTitle),
  ].join("\n");
}

function mapWorkspaceRiskLevel(
  level: string
): ManualExecutionHandoffRisk["severity"] {
  if (level === "critical") return "critical";
  if (level === "high") return "warning";
  if (level === "low") return "info";
  return "warning";
}

export function buildHandoffInputFromWorkspace(
  workspace: SafeActionWorkspace
): HandoffBuildInput {
  const actionTitle = workspace.title.replace(/^Workspace · /, "");
  const commandsSection = workspace.sections.find((s) => s.type === "manual_steps");

  const theoreticalCommands: string[] = [];
  if (commandsSection?.content) {
    commandsSection.content.split("\n").forEach((line) => {
      if (line.trim().startsWith("$")) theoreticalCommands.push(line.replace(/^\$\s*/, ""));
    });
  }

  const tests = theoreticalCommands.filter(
    (c) => c.includes("test") || c.includes("lint") || c.includes("build")
  );
  if (tests.length === 0) tests.push("npm run build", "npm run lint si pertinent");

  return {
    actionTitle,
    objective: workspace.summary,
    scope: workspace.prerequisites.join(" · ") || "Périmètre limité à l'action décrite — pas d'élargissement.",
    contextSummary: [
      `Readiness workspace : ${SAFE_ACTION_WORKSPACE_READINESS_LABELS[workspace.readiness]}`,
      workspace.executionPlanId ? "Plan d'exécution : disponible" : "Plan d'exécution : non généré",
      workspace.executionReviewId ? "Review : présente" : "",
      workspace.missionPlanBridgeId ? "Origine : Bridge V2.7" : "",
      workspace.metadata?.projectName ? `Projet : ${workspace.metadata.projectName}` : "",
    ]
      .filter(Boolean)
      .join(" · "),
    projectId: workspace.projectId,
    missionId: workspace.missionId,
    projectName: workspace.metadata?.projectName,
    sourceWorkspaceId: workspace.id,
    sourceActionId: workspace.actionId,
    sourceExecutionPlanId: workspace.executionPlanId,
    sourceBridgeId: workspace.missionPlanBridgeId,
    readinessLabel: SAFE_ACTION_WORKSPACE_READINESS_LABELS[workspace.readiness],
    manualSteps: workspace.manualNextSteps,
    theoreticalCommands,
    tests,
    rollbackSteps: ["Annuler uniquement les modifications liées à cette action", "Ne pas toucher aux autres fichiers"],
    successCriteria: [
      "Objectif atteint sans élargir le périmètre",
      "Tests manuels passés ou blocages documentés",
      "Rapport recopié dans Gigi",
    ],
    relatedFiles: [],
    prerequisites: workspace.prerequisites,
    risks: workspace.risks.map((r) => ({
      id: r.id,
      label: r.label,
      description: r.description,
      severity: mapWorkspaceRiskLevel(r.level),
      mitigation: r.mitigation,
    })),
    checklist: workspace.validationChecklist.map((c) => ({
      id: c.id,
      label: c.label,
      completed: c.completed,
      required: c.required,
      description: c.description,
    })),
    workspaceSections: workspace.sections,
  };
}

export function buildHandoffInputFromExecutionPlan(
  plan: ExecutionPlan
): HandoffBuildInput {
  const actionTitle = plan.title;
  return {
    actionTitle,
    objective: plan.objective,
    scope: plan.summary,
    contextSummary: `Plan d'exécution V2.0 · ${plan.projectName} · statut ${plan.status}`,
    projectId: plan.projectId,
    projectName: plan.projectName,
    sourceActionId: plan.queuedActionId,
    sourceExecutionPlanId: plan.id,
    manualSteps: plan.steps.map((s) => `${s.order}. ${s.title}`),
    theoreticalCommands: plan.commands.map((c) => c.command),
    tests: plan.tests.map((t) => (t.command ? `${t.label}: ${t.command}` : t.label)),
    rollbackSteps: plan.rollbackPlan.map((r) => r.title),
    successCriteria: plan.validationChecklist.map((v) => v.label),
    relatedFiles: plan.targetFiles.map((f) => f.path),
    prerequisites: plan.prerequisites.map((p) => p.label),
    risks: plan.risks.map((r, i) => ({
      id: `plan-risk-${i}`,
      label: r.risk,
      description: r.mitigation,
      severity: "warning" as const,
    })),
    checklist: plan.validationChecklist.map((v, i) => ({
      id: `plan-check-${i}`,
      label: v.label,
      completed: false,
      required: v.required,
    })),
  };
}

export function buildHandoffInputFromQueuedAction(action: QueuedAction): HandoffBuildInput {
  const ctx = aggregateContextFromQueuedAction(action);
  const workspace = createWorkspaceFromContext(ctx);
  return buildHandoffInputFromWorkspace(workspace);
}

export function buildHandoffSections(input: HandoffBuildInput): ManualExecutionHandoffSection[] {
  let order = 1;
  const section = (
    type: ManualExecutionHandoffSection["type"],
    title: string,
    content: string,
    required = true,
    relatedId?: string
  ): ManualExecutionHandoffSection => ({
    id: `sec-${type}-${order}`,
    type,
    title,
    content,
    required,
    order: order++,
    relatedId,
  });

  const sections: ManualExecutionHandoffSection[] = [
    section("context", "Contexte", input.contextSummary),
    section("objective", "Objectif", input.objective),
    section("scope", "Périmètre", input.scope),
    section("safety_rules", "Règles de sécurité", DEFAULT_SAFETY_RULES.map((r) => `* ${r}`).join("\n")),
  ];

  if (input.prerequisites.length > 0) {
    sections.push(
      section("prerequisites", "Prérequis", input.prerequisites.map((p) => `* ${p}`).join("\n"))
    );
  }

  if (input.relatedFiles.length > 0) {
    sections.push(
      section("files", "Fichiers potentiellement concernés", input.relatedFiles.map((f) => `* ${f}`).join("\n"), false)
    );
  }

  sections.push(
    section(
      "manual_steps",
      "Étapes manuelles",
      input.manualSteps.map((s, i) => `${i + 1}. ${s.replace(/^\d+\.\s*/, "")}`).join("\n")
    )
  );

  if (input.theoreticalCommands.length > 0) {
    sections.push(
      section(
        "theoretical_commands",
        "Commandes théoriques (copier uniquement — ne pas lancer depuis Gigi)",
        input.theoreticalCommands.map((c) => `$ ${c}`).join("\n"),
        false
      )
    );
  }

  sections.push(
    section("tests", "Tests à lancer manuellement", input.tests.map((t) => `* ${t}`).join("\n")),
    section(
      "success_criteria",
      "Critères de succès",
      input.successCriteria.map((c) => `* ${c}`).join("\n")
    )
  );

  if (input.risks.length > 0) {
    sections.push(
      section(
        "risks",
        "Risques",
        input.risks.map((r) => `* ${r.label} (${r.severity}) — ${r.description}`).join("\n")
      )
    );
  }

  sections.push(
    section(
      "rollback",
      "Rollback attendu",
      input.rollbackSteps.map((r) => `* ${r}`).join("\n")
    ),
    section(
      "expected_report",
      "Rapport attendu",
      buildExpectedReportTemplate(input.actionTitle)
    ),
    section(
      "next_steps",
      "Prochaine étape après exécution",
      "* Coller le rapport dans Gigi (log V2.1 ou V2.10 à venir)\n* Générer une review V2.2\n* Archiver l'apprentissage si terminé"
    )
  );

  return sections;
}

export function createHandoffRecord(
  input: HandoffBuildInput,
  target: ManualExecutionHandoffTarget,
  source: ManualExecutionHandoff["source"],
  existing?: ManualExecutionHandoff
): ManualExecutionHandoff {
  const timestamp = nowIso();
  const sections = buildHandoffSections(input);
  const expectedReportTemplate = buildExpectedReportTemplate(input.actionTitle);
  const cursorPrompt = buildCursorPrompt(input, target);

  return {
    id: existing?.id ?? generateId(MANUAL_EXECUTION_HANDOFF_ID_PREFIX),
    title: `Handoff · ${input.actionTitle}`,
    status: "ready_to_copy",
    target,
    source,
    sourceWorkspaceId: input.sourceWorkspaceId,
    sourceActionId: input.sourceActionId,
    sourceExecutionPlanId: input.sourceExecutionPlanId,
    sourceBridgeId: input.sourceBridgeId,
    projectId: input.projectId,
    missionId: input.missionId,
    objective: input.objective,
    scope: input.scope,
    contextSummary: input.contextSummary,
    sections,
    risks: input.risks,
    checklist: input.checklist,
    expectedReportTemplate,
    cursorPrompt,
    copyCount: existing?.copyCount ?? 0,
    lastCopiedAt: existing?.lastCopiedAt,
    userNotes: existing?.userNotes ?? [],
    createdAt: existing?.createdAt ?? timestamp,
    updatedAt: timestamp,
    metadata: {
      projectName: input.projectName ?? "",
      readinessLabel: input.readinessLabel ?? "",
    },
  };
}

export function createHandoffFromWorkspaceRecord(
  workspace: SafeActionWorkspace,
  target: ManualExecutionHandoffTarget,
  existing?: ManualExecutionHandoff
): ManualExecutionHandoff {
  const input = buildHandoffInputFromWorkspace(workspace);
  return createHandoffRecord(input, target, "safe_action_workspace", existing);
}

export function createHandoffFromQueuedActionRecord(
  action: QueuedAction,
  target: ManualExecutionHandoffTarget,
  existing?: ManualExecutionHandoff
): ManualExecutionHandoff {
  let input = buildHandoffInputFromQueuedAction(action);
  const plan = getCachedExecutionPlan(action.id);
  if (plan) {
    const planInput = buildHandoffInputFromExecutionPlan(plan);
    input = {
      ...input,
      manualSteps: planInput.manualSteps.length ? planInput.manualSteps : input.manualSteps,
      theoreticalCommands: planInput.theoreticalCommands.length
        ? planInput.theoreticalCommands
        : input.theoreticalCommands,
      tests: planInput.tests.length ? planInput.tests : input.tests,
      rollbackSteps: planInput.rollbackSteps,
      relatedFiles: planInput.relatedFiles,
      sourceExecutionPlanId: plan.id,
    };
  }
  input.sourceActionId = action.id;
  input.projectName = action.projectName;
  return createHandoffRecord(
    input,
    target,
    plan ? "execution_plan" : "action_queue",
    existing
  );
}

export function createHandoffFromExecutionPlanRecord(
  plan: ExecutionPlan,
  target: ManualExecutionHandoffTarget,
  existing?: ManualExecutionHandoff
): ManualExecutionHandoff {
  const input = buildHandoffInputFromExecutionPlan(plan);
  return createHandoffRecord(input, target, "execution_plan", existing);
}
