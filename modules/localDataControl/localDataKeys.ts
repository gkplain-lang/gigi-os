import { ACTION_QUEUE_STORAGE_KEY } from "@/modules/actionQueue/types";
import { BETA_FEEDBACK_STORAGE_KEY } from "@/modules/beta/types";
import { CLOSED_LOOP_LIFECYCLE_STORAGE_KEY } from "@/modules/closedLoopLifecycle/types";
import { EXECUTION_LOGS_STORAGE_KEY } from "@/modules/executionLogs/types";
import { EXECUTION_PLANS_STORAGE_KEY } from "@/modules/executionPlans/types";
import { EXECUTION_REPORT_INTAKE_STORAGE_KEY } from "@/modules/executionReportIntake/types";
import { EXECUTION_REVIEWS_STORAGE_KEY } from "@/modules/executionReviews/types";
import { FOLLOW_UP_ACTIONS_STORAGE_KEY } from "@/modules/followUpActions/types";
import { HISTORY_LEARNING_STORAGE_KEY } from "@/modules/historyLearning/types";
import { MANUAL_EXECUTION_HANDOFF_STORAGE_KEY } from "@/modules/manualExecutionHandoff/types";
import { MEMORY_STATUS_KEY } from "@/modules/memory/constants";
import { MISSION_DECISION_STORAGE_KEY } from "@/modules/missionDecision/types";
import { MISSION_FEEDBACK_STORAGE_KEY } from "@/modules/missionFeedback/types";
import { MISSION_PLAN_BRIDGE_STORAGE_KEY } from "@/modules/missionPlanBridge/types";
import {
  BACKUP_KEY_PREFIX,
  BACKUPS_INDEX_KEY,
} from "@/modules/persistence/manualControls/constants";
import { SAFE_ACTION_WORKSPACE_STORAGE_KEY } from "@/modules/safeActionWorkspace/types";
import { STORAGE_KEY } from "@/modules/storage/gigiStateTypes";
import type { LocalDataKeyDescriptor } from "./types";
import { LOCAL_SETTINGS_STORAGE_KEY } from "./localSettingsStore";

/** Last shipped release on main before V3.7 branch work. */
export const GIGI_RELEASE_VERSION = "3.6.0";

/** Version implemented on this branch (pre-commit). */
export const GIGI_DEV_VERSION = "3.7.0";

export const LOCAL_DATA_SCHEMA_VERSION = "3.7";

const OPTIONAL_KEYS: LocalDataKeyDescriptor[] = [
  {
    key: "gigi-os-v35-onboarding-state",
    label: "État onboarding UI",
    description: "Préférences UI du guide onboarding si clé dédiée présente.",
    ownerModule: "onboarding",
    version: "3.5",
    category: "optional",
    riskLevel: "low",
    exportable: true,
    resettable: true,
    dangerousToReset: false,
  },
  {
    key: "gigi-os-v36-projects-command-state",
    label: "Filtres centre projets",
    description: "Préférences UI du centre projets si clé dédiée présente.",
    ownerModule: "projectsCommand",
    version: "3.6",
    category: "optional",
    riskLevel: "low",
    exportable: true,
    resettable: true,
    dangerousToReset: false,
  },
  {
    key: "gigi-os-v40-execution-readiness",
    label: "Exécution contrôlée (V4 prep)",
    description: "Préparation V4 — non activée sur main.",
    ownerModule: "executionReadiness",
    version: "4.0",
    category: "optional",
    riskLevel: "medium",
    exportable: false,
    resettable: true,
    dangerousToReset: false,
  },
];

export const KNOWN_LOCAL_DATA_KEYS: LocalDataKeyDescriptor[] = [
  {
    key: STORAGE_KEY,
    label: "État principal Gigi",
    description: "Projets, mission, historique, onboarding intégré.",
    ownerModule: "storage",
    version: "0.3",
    category: "core",
    riskLevel: "critical",
    exportable: true,
    resettable: true,
    dangerousToReset: true,
  },
  {
    key: BACKUPS_INDEX_KEY,
    label: "Index des backups locaux",
    description: "Liste des sauvegardes manuelles gigi-os-v03-backup-*.",
    ownerModule: "persistence",
    version: "0.3",
    category: "backup",
    riskLevel: "medium",
    exportable: true,
    resettable: true,
    dangerousToReset: false,
  },
  {
    key: BACKUP_KEY_PREFIX,
    label: "Backups locaux (préfixe)",
    description: "Copies manuelles de gigi-os-v03-state.",
    ownerModule: "persistence",
    version: "0.3",
    category: "backup",
    riskLevel: "medium",
    exportable: true,
    resettable: true,
    dangerousToReset: false,
    keyPrefix: true,
  },
  {
    key: MEMORY_STATUS_KEY,
    label: "Statut mémoire locale",
    description: "Indicateurs mémoire affichés dans la sidebar.",
    ownerModule: "memory",
    version: "0.4",
    category: "memory",
    riskLevel: "low",
    exportable: true,
    resettable: true,
    dangerousToReset: false,
  },
  {
    key: BETA_FEEDBACK_STORAGE_KEY,
    label: "Retours bêta",
    description: "Feedback testeur stocké localement.",
    ownerModule: "beta",
    version: "0.9",
    category: "feedback",
    riskLevel: "low",
    exportable: true,
    resettable: true,
    dangerousToReset: false,
  },
  {
    key: ACTION_QUEUE_STORAGE_KEY,
    label: "File d'actions",
    description: "Actions préparées — aucune exécution automatique.",
    ownerModule: "actionQueue",
    version: "1.9",
    category: "execution",
    riskLevel: "high",
    exportable: true,
    resettable: true,
    dangerousToReset: true,
  },
  {
    key: EXECUTION_PLANS_STORAGE_KEY,
    label: "Plans d'exécution",
    description: "Plans locaux liés aux actions.",
    ownerModule: "executionPlans",
    version: "2.0",
    category: "execution",
    riskLevel: "high",
    exportable: true,
    resettable: true,
    dangerousToReset: true,
  },
  {
    key: EXECUTION_LOGS_STORAGE_KEY,
    label: "Journaux d'exécution",
    description: "Logs manuels d'exécution.",
    ownerModule: "executionLogs",
    version: "2.1",
    category: "execution",
    riskLevel: "medium",
    exportable: true,
    resettable: true,
    dangerousToReset: false,
  },
  {
    key: EXECUTION_REVIEWS_STORAGE_KEY,
    label: "Revues d'exécution",
    description: "Bilans post-exécution locaux.",
    ownerModule: "executionReviews",
    version: "2.2",
    category: "execution",
    riskLevel: "medium",
    exportable: true,
    resettable: true,
    dangerousToReset: false,
  },
  {
    key: FOLLOW_UP_ACTIONS_STORAGE_KEY,
    label: "Actions de suivi",
    description: "Suivis recommandés après exécution.",
    ownerModule: "followUpActions",
    version: "2.3",
    category: "execution",
    riskLevel: "medium",
    exportable: true,
    resettable: true,
    dangerousToReset: false,
  },
  {
    key: HISTORY_LEARNING_STORAGE_KEY,
    label: "Boucle d'apprentissage",
    description: "Apprentissages dérivés de l'historique.",
    ownerModule: "historyLearning",
    version: "2.4",
    category: "mission",
    riskLevel: "medium",
    exportable: true,
    resettable: true,
    dangerousToReset: false,
  },
  {
    key: MISSION_FEEDBACK_STORAGE_KEY,
    label: "Feedback missions",
    description: "Retours sur les missions.",
    ownerModule: "missionFeedback",
    version: "2.5",
    category: "mission",
    riskLevel: "low",
    exportable: true,
    resettable: true,
    dangerousToReset: false,
  },
  {
    key: MISSION_DECISION_STORAGE_KEY,
    label: "Centre de décision mission",
    description: "Décisions mission stockées localement.",
    ownerModule: "missionDecision",
    version: "2.6",
    category: "mission",
    riskLevel: "medium",
    exportable: true,
    resettable: true,
    dangerousToReset: false,
  },
  {
    key: MISSION_PLAN_BRIDGE_STORAGE_KEY,
    label: "Pont mission ↔ plan",
    description: "Liens entre missions et plans d'action.",
    ownerModule: "missionPlanBridge",
    version: "2.7",
    category: "mission",
    riskLevel: "medium",
    exportable: true,
    resettable: true,
    dangerousToReset: false,
  },
  {
    key: SAFE_ACTION_WORKSPACE_STORAGE_KEY,
    label: "Espaces action sécurisés",
    description: "Workspaces locaux pour actions manuelles.",
    ownerModule: "safeActionWorkspace",
    version: "2.8",
    category: "execution",
    riskLevel: "medium",
    exportable: true,
    resettable: true,
    dangerousToReset: false,
  },
  {
    key: MANUAL_EXECUTION_HANDOFF_STORAGE_KEY,
    label: "Passations manuelles",
    description: "Handoffs d'exécution manuelle.",
    ownerModule: "manualExecutionHandoff",
    version: "2.9",
    category: "execution",
    riskLevel: "medium",
    exportable: true,
    resettable: true,
    dangerousToReset: false,
  },
  {
    key: EXECUTION_REPORT_INTAKE_STORAGE_KEY,
    label: "Intake rapports d'exécution",
    description: "Rapports collés manuellement.",
    ownerModule: "executionReportIntake",
    version: "2.10",
    category: "execution",
    riskLevel: "medium",
    exportable: true,
    resettable: true,
    dangerousToReset: false,
  },
  {
    key: CLOSED_LOOP_LIFECYCLE_STORAGE_KEY,
    label: "Cycle de vie actions",
    description: "États du cycle fermé des actions.",
    ownerModule: "closedLoopLifecycle",
    version: "2.11",
    category: "execution",
    riskLevel: "high",
    exportable: true,
    resettable: true,
    dangerousToReset: true,
  },
  {
    key: LOCAL_SETTINGS_STORAGE_KEY,
    label: "Préférences locales V3.7",
    description: "Densité UI, mode prudence, aides bêta — non critique.",
    ownerModule: "localDataControl",
    version: "3.7",
    category: "settings",
    riskLevel: "low",
    exportable: true,
    resettable: true,
    dangerousToReset: false,
  },
  ...OPTIONAL_KEYS,
];

export function findKeyDescriptor(key: string): LocalDataKeyDescriptor | null {
  const exact = KNOWN_LOCAL_DATA_KEYS.find((d) => !d.keyPrefix && d.key === key);
  if (exact) return exact;

  const prefix = KNOWN_LOCAL_DATA_KEYS.find(
    (d) => d.keyPrefix && key.startsWith(d.key)
  );
  return prefix ?? null;
}

export function isKnownExportableKey(key: string): boolean {
  const descriptor = findKeyDescriptor(key);
  return Boolean(descriptor?.exportable);
}

export function listAllLocalStorageKeys(): string[] {
  if (typeof window === "undefined") return [];
  const keys: string[] = [];
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key) keys.push(key);
  }
  return keys.sort();
}
