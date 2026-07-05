import type { MissionPlanBridgeRecord } from "./types";
import {
  MISSION_PLAN_BRIDGE_DISCLAIMER,
  MISSION_PLAN_BRIDGE_STATUS_LABELS,
} from "./types";

function formatPlanSteps(record: MissionPlanBridgeRecord): string[] {
  if (!record.planDraft?.steps?.length) {
    return ["* Plan non généré — utilise « Générer le plan » dans le panneau bridge."];
  }
  return record.planDraft.steps.map((s) => `${s.order}. ${s.title}`);
}

export function formatMissionPlanBridgeForCopy(record: MissionPlanBridgeRecord): string {
  const lines = [
    "# Mission-to-Plan Bridge — Gigi V2.7",
    "",
    "Mission acceptée :",
    record.missionTitle,
    "",
    "Objectif :",
    "Transformer cette mission en plan d'action clair, validable et sans exécution automatique.",
    "",
    "Plan proposé :",
    "",
    ...formatPlanSteps(record),
    "",
  ];

  if (record.preparedActionDraft) {
    lines.push(
      "Action préparée :",
      record.preparedActionDraft.summary,
      ""
    );
  } else {
    lines.push(
      "Action préparée :",
      "Préparer une action ciblée, à valider avant toute exécution.",
      ""
    );
  }

  lines.push("Checklist :", "");
  if (record.validationChecklist.length > 0) {
    record.validationChecklist.forEach((item) => lines.push(`* ${item.label}`));
  } else {
    lines.push("* Périmètre clair", "* Risques compris", "* Validation définie");
  }

  if (record.risks.length > 0) {
    lines.push("", "Risques :", "");
    record.risks.forEach((r) => lines.push(`* ${r.label} — ${r.description}`));
  }

  if (record.conversationPrompt) {
    lines.push("", "Prompt conversation :", record.conversationPrompt);
  }

  lines.push(
    "",
    "Statut bridge :",
    MISSION_PLAN_BRIDGE_STATUS_LABELS[record.status],
    "",
    "Limite :",
    MISSION_PLAN_BRIDGE_DISCLAIMER
  );

  return lines.join("\n");
}

export function formatMissionPlanBridgeListForCopy(
  records: MissionPlanBridgeRecord[]
): string {
  const lines = [
    "# Mission-to-Plan Bridges — Synthèse · Gigi V2.7",
    "",
    `${records.length} bridge(s) local(aux)`,
    "",
  ];

  for (const r of records.slice(0, 10)) {
    lines.push(
      `* ${r.missionTitle} — ${MISSION_PLAN_BRIDGE_STATUS_LABELS[r.status]} — ${r.updatedAt.slice(0, 10)}`
    );
  }

  lines.push("", "Limite :", MISSION_PLAN_BRIDGE_DISCLAIMER);
  return lines.join("\n");
}

export function formatBridgePlanStepsText(record: MissionPlanBridgeRecord): string {
  return formatPlanSteps(record).join("\n");
}
