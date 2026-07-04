export interface GigiDecisionContract {
  /** Mission prioritaire unique */
  missionTitle: string;
  projectId: string;
  projectName: string;
  /** Justification courte */
  why: string;
  /** Exactement 3 tâches concrètes */
  tasks: [string, string, string];
  /** Ce qu'il faut ignorer aujourd'hui */
  ignoreToday: Array<{ projectName: string; reason: string }>;
  /** Risque principal si la mission n'est pas faite */
  primaryRisk: string;
  /** Prochaine étape après exécution */
  nextStep: string;
}

export interface DecisionQualityChecks {
  hasMission: boolean;
  hasThreeTasks: boolean;
  hasIgnoreToday: boolean;
  hasPrimaryRisk: boolean;
  hasNextStep: boolean;
  projectRespected: boolean;
  noAutoActionClaim: boolean;
}

export interface DecisionQualityReport {
  isComplete: boolean;
  checks: DecisionQualityChecks;
  taskCount: number;
  ignoreCount: number;
  detectedProjectId: string | null;
  projectGuardOk: boolean;
  usedFallback: boolean;
  repaired: boolean;
  warnings: string[];
}

export interface DecisionQualitySummary {
  missionDetected: boolean;
  missionTitle: string | null;
  projectId: string | null;
  taskCount: number;
  hasIgnoreToday: boolean;
  hasPrimaryRisk: boolean;
  hasNextStep: boolean;
  projectGuardStatus: "ok" | "mismatch" | "n/a";
  fallbackUsed: boolean;
  isComplete: boolean;
  warnings: string[];
}
