import type { MissionOSViewModel } from "./types";
import { MISSION_OS_PHASE_LABELS, MISSION_OS_READINESS_LABELS } from "./types";

export function formatMissionOSForCopy(vm: MissionOSViewModel): string {
  const lines = [
    "Gigi — Mission Command Center V3.1",
    "",
    `Mission : ${vm.currentMissionTitle}`,
    `Pourquoi : ${vm.primaryReason}`,
    `Phase : ${MISSION_OS_PHASE_LABELS[vm.currentPhase]}`,
    `Étape : ${vm.currentStepLabel}`,
    `Action maintenant : ${vm.primaryCtaLabel}`,
    `Route : ${vm.primaryCtaRoute}`,
    "",
    vm.safetyNote,
  ];
  if (vm.learningSummary) {
    lines.splice(-1, 0, "", `Apprentissage : ${vm.learningSummary}`);
  }
  return lines.join("\n");
}

export function formatMissionOSShortSummary(vm: MissionOSViewModel): string {
  return `${vm.currentMissionTitle} · ${vm.currentStepLabel} · ${vm.primaryCtaLabel}`;
}

export function formatReadinessLabel(vm: MissionOSViewModel): string {
  return MISSION_OS_READINESS_LABELS[vm.readiness];
}
