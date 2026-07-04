import type { AiBrainResponse } from "../types";
import type { DecisionQualitySummary } from "./types";

export function summarizeDecisionQuality(
  response: AiBrainResponse | null | undefined
): DecisionQualitySummary {
  if (!response) {
    return {
      missionDetected: false,
      missionTitle: null,
      projectId: null,
      taskCount: 0,
      hasIgnoreToday: false,
      hasPrimaryRisk: false,
      hasNextStep: false,
      projectGuardStatus: "n/a",
      fallbackUsed: false,
      isComplete: false,
      warnings: [],
    };
  }

  const mission = response.recommendedMission;
  const dq = response.decisionQuality;

  let projectGuardStatus: DecisionQualitySummary["projectGuardStatus"] = "n/a";
  if (response.requestedProjectId && mission) {
    projectGuardStatus =
      mission.projectId === response.requestedProjectId ? "ok" : "mismatch";
  } else if (response.projectMismatchDetected) {
    projectGuardStatus = "mismatch";
  } else if (mission) {
    projectGuardStatus = "ok";
  }

  return {
    missionDetected: Boolean(mission),
    missionTitle: mission?.title ?? null,
    projectId: mission?.projectId ?? null,
    taskCount: response.tasks?.length ?? 0,
    hasIgnoreToday: (response.notNow?.length ?? 0) > 0,
    hasPrimaryRisk: Boolean(response.primaryRisk?.trim()),
    hasNextStep: Boolean(response.nextStep?.trim()),
    projectGuardStatus,
    fallbackUsed:
      response.provider === "local_fallback" ||
      Boolean(response.fallbackReason?.includes("FALLBACK")) ||
      Boolean(dq?.usedFallback),
    isComplete: dq?.isComplete ?? false,
    warnings: dq?.warnings ?? [],
  };
}
