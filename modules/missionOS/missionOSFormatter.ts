import type { MissionOSViewModel } from "./types";
import { MISSION_OS_PHASE_LABELS, MISSION_OS_READINESS_LABELS } from "./types";

export function formatMissionOSForCopy(vm: MissionOSViewModel): string {
  const lines = [
    "Gigi — Closed Loop Mission OS",
    "",
    `Mission : ${vm.currentMissionTitle}`,
    `Phase : ${MISSION_OS_PHASE_LABELS[vm.currentPhase]}`,
    `Étape : ${vm.currentStepLabel}`,
    `Prochaine action : ${vm.nextActionLabel}`,
    `Route : ${vm.nextActionRoute}`,
    "",
    "Pourquoi :",
    ...vm.reasons.map((r) => `- ${r}`),
    "",
    vm.safetyNote,
  ];
  if (vm.learningSummary) {
    lines.splice(-2, 0, "", `Apprentissage : ${vm.learningSummary}`);
  }
  return lines.join("\n");
}

export function formatMissionOSShortSummary(vm: MissionOSViewModel): string {
  return `${MISSION_OS_PHASE_LABELS[vm.currentPhase]} · ${vm.currentStepLabel} · Prochaine : ${vm.nextActionLabel}`;
}

export function formatReadinessLabel(vm: MissionOSViewModel): string {
  return MISSION_OS_READINESS_LABELS[vm.readiness];
}
