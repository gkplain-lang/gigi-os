import type { SafeActionWorkspace } from "./types";
import {
  SAFE_ACTION_WORKSPACE_DISCLAIMER,
  SAFE_ACTION_WORKSPACE_READINESS_LABELS,
  SAFE_ACTION_WORKSPACE_STATUS_LABELS,
} from "./types";

export function formatSafeActionWorkspaceForCopy(workspace: SafeActionWorkspace): string {
  const lines = [
    "# Safe Action Workspace — Gigi V2.8",
    "",
    "Action :",
    workspace.title.replace(/^Workspace · /, ""),
    "",
    "Readiness :",
    SAFE_ACTION_WORKSPACE_READINESS_LABELS[workspace.readiness],
    "",
    "Statut workspace :",
    SAFE_ACTION_WORKSPACE_STATUS_LABELS[workspace.status],
    "",
    "Résumé :",
    workspace.summary,
    "",
    "Contexte :",
    "",
  ];

  if (workspace.projectId) {
    lines.push(`* Projet : ${workspace.metadata?.projectName ?? workspace.projectId}`);
  }
  if (workspace.missionPlanBridgeId) {
    lines.push("* Origine : Bridge V2.7 depuis mission acceptée");
  }
  if (workspace.executionPlanId) {
    lines.push("* Plan d'exécution : disponible");
  } else {
    lines.push("* Plan d'exécution : non généré");
  }
  if (workspace.executionLogId) {
    const logSection = workspace.sections.find((s) => s.type === "execution_logs");
    lines.push(`* Log : ${logSection?.content.split("\n")[0] ?? "présent"}`);
  }
  if (workspace.executionReviewId) {
    const reviewSection = workspace.sections.find((s) => s.type === "execution_review");
    lines.push(`* Review : ${reviewSection?.content.split("\n")[0] ?? "présente"}`);
  }

  if (workspace.risks.length > 0) {
    lines.push("", "Risques :", "");
    workspace.risks.forEach((r) => lines.push(`* ${r.label} — ${r.description}`));
  }

  if (workspace.prerequisites.length > 0) {
    lines.push("", "Prérequis :", "");
    workspace.prerequisites.forEach((p) => lines.push(`* ${p}`));
  }

  lines.push("", "Checklist avant exécution :", "");
  workspace.validationChecklist.forEach((item) => {
    const mark = item.completed ? "[x]" : "[ ]";
    lines.push(`${mark} ${item.label}`);
  });

  if (workspace.manualNextSteps.length > 0) {
    lines.push("", "Étapes manuelles suggérées :", "");
    workspace.manualNextSteps.forEach((step) => lines.push(step.startsWith("•") ? step : `* ${step}`));
  }

  if (workspace.userNotes.length > 0) {
    lines.push("", "Notes utilisateur :", "");
    workspace.userNotes.forEach((n) => lines.push(`* ${n.content}`));
  }

  lines.push("", "Limite :", SAFE_ACTION_WORKSPACE_DISCLAIMER);

  return lines.join("\n");
}

export function formatChecklistForCopy(workspace: SafeActionWorkspace): string {
  const lines = [
    "# Checklist avant exécution — Gigi V2.8",
    "",
    workspace.title.replace(/^Workspace · /, ""),
    "",
  ];
  workspace.validationChecklist.forEach((item) => {
    const mark = item.completed ? "[x]" : "[ ]";
    lines.push(`${mark} ${item.label}`);
  });
  lines.push("", SAFE_ACTION_WORKSPACE_DISCLAIMER);
  return lines.join("\n");
}

export function formatCursorContextForCopy(workspace: SafeActionWorkspace): string {
  const actionSection = workspace.sections.find((s) => s.type === "action_summary");
  const planSection = workspace.sections.find((s) => s.type === "execution_plan");
  const commandsSection = workspace.sections.find((s) => s.type === "manual_steps");

  const lines = [
    "# Contexte Cursor — Gigi V2.8 Safe Action Workspace",
    "",
    "## Objectif",
    workspace.summary,
    "",
    "## Action",
    actionSection?.content ?? workspace.title,
    "",
    "## Plan d'exécution",
    planSection?.content ?? "Plan non généré localement.",
    "",
    "## Risques à respecter",
    ...workspace.risks.map((r) => `- ${r.label}: ${r.description}`),
    "",
    "## Checklist obligatoire avant modification",
    ...workspace.validationChecklist
      .filter((c) => c.required)
      .map((c) => `- ${c.label}`),
    "",
    "## Étapes manuelles",
    ...workspace.manualNextSteps.map((s) => (s.match(/^\d+\./) ? s : `- ${s}`)),
  ];

  if (commandsSection) {
    lines.push("", "## Commandes théoriques (NE PAS exécuter depuis Gigi)", commandsSection.content);
  }

  lines.push(
    "",
    "## Contraintes",
    "- Préparation uniquement — aucune exécution automatique",
    "- Périmètre limité à l'objectif ci-dessus",
    "- Logger le résultat manuellement après exécution",
    "",
    SAFE_ACTION_WORKSPACE_DISCLAIMER
  );

  return lines.join("\n");
}

export function formatWorkspaceListForCopy(workspaces: SafeActionWorkspace[]): string {
  const lines = [
    "# Safe Action Workspaces — Synthèse · Gigi V2.8",
    "",
    `${workspaces.length} workspace(s) local(aux)`,
    "",
  ];
  for (const w of workspaces.slice(0, 10)) {
    lines.push(
      `* ${w.title.replace(/^Workspace · /, "")} — ${SAFE_ACTION_WORKSPACE_READINESS_LABELS[w.readiness]} — ${w.updatedAt.slice(0, 10)}`
    );
  }
  lines.push("", "Limite :", SAFE_ACTION_WORKSPACE_DISCLAIMER);
  return lines.join("\n");
}
