import type { AiBrainRequest, AiBrainResponse } from "../types";
import { REQUIRED_TASK_COUNT } from "./decisionContract";
import type { DecisionQualityChecks, DecisionQualityReport } from "./types";

const AUTO_ACTION_CLAIMS = [
  "j'ai synchronisé",
  "j ai synchronise",
  "j'ai restauré",
  "j ai restaure",
  "synchronisation effectuée",
  "restauration effectuée",
  "j'ai publié",
  "j ai publie",
  "j'ai envoyé",
  "j ai envoye",
];

function messageClaimsAutoAction(message: string): boolean {
  const norm = message.toLowerCase();
  return AUTO_ACTION_CLAIMS.some((phrase) => norm.includes(phrase));
}

export function validateDecisionQuality(
  response: AiBrainResponse,
  request: AiBrainRequest
): DecisionQualityReport {
  const mission = response.recommendedMission;
  const warnings: string[] = [];

  if (!mission) {
    return {
      isComplete: false,
      checks: {
        hasMission: false,
        hasThreeTasks: false,
        hasIgnoreToday: false,
        hasPrimaryRisk: false,
        hasNextStep: false,
        projectRespected: true,
        noAutoActionClaim: !messageClaimsAutoAction(response.message),
      },
      taskCount: 0,
      ignoreCount: 0,
      detectedProjectId: null,
      projectGuardOk: true,
      usedFallback: false,
      repaired: false,
      warnings: ["Pas de mission recommandée — contrat décisionnel non applicable."],
    };
  }

  const taskCount = response.tasks?.length ?? 0;
  const ignoreCount = response.notNow?.length ?? 0;
  const requested = request.requestedProjectId;
  const projectRespected = !requested || mission.projectId === requested;

  const checks: DecisionQualityChecks = {
    hasMission: true,
    hasThreeTasks: taskCount === REQUIRED_TASK_COUNT,
    hasIgnoreToday: ignoreCount > 0,
    hasPrimaryRisk: Boolean(response.primaryRisk?.trim()),
    hasNextStep: Boolean(response.nextStep?.trim()),
    projectRespected,
    noAutoActionClaim: !messageClaimsAutoAction(response.message),
  };

  if (!checks.hasThreeTasks) warnings.push(`Tâches : ${taskCount}/${REQUIRED_TASK_COUNT}`);
  if (!checks.hasIgnoreToday) warnings.push("Liste « quoi ignorer » absente.");
  if (!checks.hasPrimaryRisk) warnings.push("Risque principal absent.");
  if (!checks.hasNextStep) warnings.push("Prochaine étape absente.");
  if (!checks.projectRespected) warnings.push("Projet demandé non respecté.");
  if (!checks.noAutoActionClaim) warnings.push("Action automatique prétendument exécutée.");

  const isComplete = Object.values(checks).every(Boolean);

  return {
    isComplete,
    checks,
    taskCount,
    ignoreCount,
    detectedProjectId: mission.projectId,
    projectGuardOk: projectRespected,
    usedFallback: false,
    repaired: false,
    warnings,
  };
}
