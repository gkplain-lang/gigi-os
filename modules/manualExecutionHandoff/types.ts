export type ManualExecutionHandoffStatus =
  | "draft"
  | "ready_to_copy"
  | "copied"
  | "handed_off"
  | "waiting_for_report"
  | "report_received"
  | "archived"
  | "cancelled";

export type ManualExecutionHandoffTarget = "cursor" | "human" | "self" | "generic";

export type ManualExecutionHandoffSource =
  | "safe_action_workspace"
  | "action_queue"
  | "execution_plan"
  | "mission_plan_bridge"
  | "prepared_action"
  | "manual";

export type ManualExecutionHandoffSectionType =
  | "context"
  | "objective"
  | "scope"
  | "safety_rules"
  | "prerequisites"
  | "files"
  | "manual_steps"
  | "theoretical_commands"
  | "tests"
  | "success_criteria"
  | "risks"
  | "rollback"
  | "expected_report"
  | "next_steps"
  | "notes";

export type ManualExecutionHandoffSeverity = "info" | "warning" | "critical" | "success";

export interface ManualExecutionHandoffSection {
  id: string;
  type: ManualExecutionHandoffSectionType;
  title: string;
  content: string;
  required: boolean;
  order: number;
  relatedId?: string;
}

export interface ManualExecutionHandoffRisk {
  id: string;
  label: string;
  description: string;
  severity: ManualExecutionHandoffSeverity;
  mitigation?: string;
}

export interface ManualExecutionHandoffChecklistItem {
  id: string;
  label: string;
  completed: boolean;
  required: boolean;
  description?: string;
}

export interface ManualExecutionHandoff {
  id: string;
  title: string;
  status: ManualExecutionHandoffStatus;
  target: ManualExecutionHandoffTarget;
  source: ManualExecutionHandoffSource;
  sourceWorkspaceId?: string;
  sourceActionId?: string;
  sourceExecutionPlanId?: string;
  sourceBridgeId?: string;
  projectId?: string;
  missionId?: string;
  objective: string;
  scope: string;
  contextSummary: string;
  sections: ManualExecutionHandoffSection[];
  risks: ManualExecutionHandoffRisk[];
  checklist: ManualExecutionHandoffChecklistItem[];
  expectedReportTemplate: string;
  cursorPrompt?: string;
  copyCount: number;
  lastCopiedAt?: string;
  userNotes: string[];
  createdAt: string;
  updatedAt: string;
  archivedAt?: string;
  metadata?: Record<string, string>;
}

export interface ManualExecutionHandoffState {
  handoffs: ManualExecutionHandoff[];
  lastUpdatedAt?: string;
  version: number;
}

export interface ManualExecutionHandoffGlobalSummary {
  totalHandoffs: number;
  waitingForReportCount: number;
  recentTitle?: string;
  summaryText: string;
}

export interface ManualExecutionHandoffIntent {
  isManualExecutionHandoff: boolean;
  projectId: string | null;
}

export const MANUAL_EXECUTION_HANDOFF_STORAGE_KEY = "gigi-os-v29-manual-execution-handoffs";
export const MANUAL_EXECUTION_HANDOFF_VERSION = 1;
export const MANUAL_EXECUTION_HANDOFF_ID_PREFIX = "mehandoff-";

export const MANUAL_EXECUTION_HANDOFF_DISCLAIMER =
  "Ce handoff est local et copiable. Gigi ne l'envoie pas, ne l'exécute pas et ne vérifie pas le repo.";

export const MANUAL_EXECUTION_HANDOFF_STATUS_LABELS: Record<
  ManualExecutionHandoffStatus,
  string
> = {
  draft: "Brouillon",
  ready_to_copy: "Prêt à copier",
  copied: "Copié",
  handed_off: "Passé à l'exécutant",
  waiting_for_report: "En attente de rapport",
  report_received: "Rapport reçu",
  archived: "Archivé",
  cancelled: "Annulé",
};

export const MANUAL_EXECUTION_HANDOFF_TARGET_LABELS: Record<
  ManualExecutionHandoffTarget,
  string
> = {
  cursor: "Cursor",
  human: "Humain",
  self: "Moi-même",
  generic: "Générique",
};

export const DEFAULT_SAFETY_RULES = [
  "Ne touche pas à .env.local",
  "Ne commit pas sans validation",
  "Ne lance aucun service externe",
  "Ne fais aucune sync/restore",
  "Ne change pas le périmètre",
  "Exécution manuelle uniquement — Gigi ne lance rien",
];

export const DEFAULT_EXPECTED_REPORT_FIELDS = [
  "Action exécutée :",
  "Date :",
  "Outil utilisé : Cursor / humain / moi",
  "Fichiers modifiés :",
  "Étapes réalisées :",
  "Commandes lancées manuellement :",
  "Tests lancés :",
  "Résultat des tests :",
  "Blocages :",
  "Corrections nécessaires :",
  "Commit réalisé ? oui/non",
  "Hash commit si applicable :",
  "Rapport final :",
  "Prochaine étape recommandée :",
];
