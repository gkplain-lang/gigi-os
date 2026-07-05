import type { ActionPlan } from "@/modules/actionPlans/types";
import type { PreparedAction } from "@/modules/preparedActions/types";

export type MissionPlanBridgeStatus =
  | "draft"
  | "ready"
  | "plan_generated"
  | "prepared_action_generated"
  | "added_to_queue"
  | "conversation_opened"
  | "cancelled"
  | "archived";

export type MissionPlanBridgeSource =
  | "mission_decision"
  | "mission_candidate"
  | "project_mission"
  | "manual";

export type MissionPlanBridgeOutputType =
  | "action_plan"
  | "prepared_action"
  | "queue_item"
  | "conversation_prompt"
  | "manual_task";

export type MissionPlanBridgeSeverity = "info" | "warning" | "critical" | "success";

export interface MissionPlanBridgeOutput {
  id: string;
  type: MissionPlanBridgeOutputType;
  title: string;
  description: string;
  status: "proposed" | "copied" | "linked" | "queued";
  createdAt: string;
  relatedId?: string;
  metadata?: Record<string, string>;
}

export interface MissionPlanBridgeRisk {
  id: string;
  label: string;
  description: string;
  severity: MissionPlanBridgeSeverity;
  mitigation?: string;
}

export interface MissionPlanBridgeValidationItem {
  id: string;
  label: string;
  completed: boolean;
  required: boolean;
  description?: string;
}

export interface MissionPlanBridgeRecord {
  id: string;
  source: MissionPlanBridgeSource;
  status: MissionPlanBridgeStatus;
  missionDecisionId?: string;
  missionCandidateId?: string;
  projectId?: string;
  missionId?: string;
  title: string;
  missionTitle: string;
  missionDescription?: string;
  acceptedAt?: string;
  planDraft?: ActionPlan;
  preparedActionDraft?: PreparedAction;
  queueItemId?: string;
  conversationPrompt?: string;
  outputs: MissionPlanBridgeOutput[];
  validationChecklist: MissionPlanBridgeValidationItem[];
  risks: MissionPlanBridgeRisk[];
  createdAt: string;
  updatedAt: string;
  archivedAt?: string;
  metadata?: Record<string, string>;
}

export interface MissionPlanBridgeState {
  bridges: MissionPlanBridgeRecord[];
  lastUpdatedAt?: string;
  version: number;
}

export interface MissionPlanBridgeGlobalSummary {
  totalBridges: number;
  queuedCount: number;
  recentTitle?: string;
  summaryText: string;
}

export interface MissionPlanBridgeIntent {
  isMissionPlanBridge: boolean;
  projectId: string | null;
}

export const MISSION_PLAN_BRIDGE_STORAGE_KEY = "gigi-os-v27-mission-plan-bridge";
export const MISSION_PLAN_BRIDGE_VERSION = 1;
export const MISSION_PLAN_BRIDGE_ID_PREFIX = "mpbridge-";

export const MISSION_PLAN_BRIDGE_DISCLAIMER =
  "Ce bridge prépare la suite localement. Gigi ne lance aucune commande, ne modifie aucun fichier externe et n'approuve aucune action automatiquement.";

export const MISSION_PLAN_BRIDGE_STATUS_LABELS: Record<MissionPlanBridgeStatus, string> = {
  draft: "Brouillon",
  ready: "Prêt",
  plan_generated: "Plan généré",
  prepared_action_generated: "Action préparée",
  added_to_queue: "Ajouté à la file",
  conversation_opened: "Conversation ouverte",
  cancelled: "Annulé",
  archived: "Archivé",
};
