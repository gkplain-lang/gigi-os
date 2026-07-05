import type { ExecutionCapability, ExecutionRiskLevel } from "@/modules/executionReadiness/types";

export type GuidedFlowStatus =
  | "draft"
  | "action_selected"
  | "request_prepared"
  | "permission_review_ready"
  | "manual_bridge_ready"
  | "command_pack_ready"
  | "local_review_ready"
  | "completed_by_human"
  | "cancelled";

export type GuidedFlowSource = "project" | "mission" | "template" | "manual";

export type GuidedActionCategory =
  | "code"
  | "collaboration"
  | "automation"
  | "product"
  | "verification";

export type GuidedFlowStepId =
  | "action_goal"
  | "local_request"
  | "permission"
  | "manual_bridge"
  | "command_pack"
  | "local_review";

export type GuidedFlowStepStatus = "pending" | "ready" | "skipped" | "completed_by_human";

export interface GuidedFlowStep {
  id: GuidedFlowStepId;
  label: string;
  description: string;
  route: string;
  status: GuidedFlowStepStatus;
}

export type GuidedFlowAuditType =
  | "guided_flow_created"
  | "guided_step_marked_ready"
  | "guided_flow_linked_request"
  | "guided_flow_linked_manual_packet"
  | "guided_flow_linked_command_pack"
  | "guided_flow_linked_review_session"
  | "guided_flow_completed_by_human"
  | "guided_flow_cancelled"
  | "guided_flow_status_change";

export interface GuidedFlowAuditEntry {
  id: string;
  at: string;
  type: GuidedFlowAuditType;
  message: string;
  status?: GuidedFlowStatus;
}

export interface GuidedProjectActionFlow {
  id: string;
  title: string;
  description: string;
  projectId?: string;
  projectName?: string;
  missionId?: string;
  source: GuidedFlowSource;
  templateId?: string;
  status: GuidedFlowStatus;
  createdAt: string;
  updatedAt: string;
  actionGoal: string;
  actionCategory: GuidedActionCategory;
  riskLevel: ExecutionRiskLevel;
  suggestedCapability: ExecutionCapability;
  suggestedRoute: string;
  linkedRequestId?: string;
  linkedPermissionDecisionId?: string;
  linkedManualPacketId?: string;
  linkedCommandPackId?: string;
  linkedReviewSessionId?: string;
  steps: GuidedFlowStep[];
  auditTrail: GuidedFlowAuditEntry[];
  disclaimer: string;
}

export interface GuidedActionTemplateDefinition {
  id: string;
  title: string;
  description: string;
  category: GuidedActionCategory;
  actionGoal: string;
  riskLevel: ExecutionRiskLevel;
  suggestedCapability: ExecutionCapability;
  suggestedRoute: string;
  stepIds: GuidedFlowStepId[];
  whyUseful: string;
}

export interface GuidedActionGlobalSummary {
  totalFlows: number;
  activeFlows: number;
  completedFlows: number;
  cancelledFlows: number;
  summaryText: string;
}

export const GUIDED_FLOW_STATUS_LABELS: Record<GuidedFlowStatus, string> = {
  draft: "Brouillon",
  action_selected: "Action choisie",
  request_prepared: "Demande préparée",
  permission_review_ready: "Permission à relire",
  manual_bridge_ready: "Pont manuel prêt",
  command_pack_ready: "Pack prêt",
  local_review_ready: "Revue prête",
  completed_by_human: "Terminé (humain)",
  cancelled: "Annulé",
};

export const GUIDED_ACTION_CATEGORY_LABELS: Record<GuidedActionCategory, string> = {
  code: "Code",
  collaboration: "Collaboration",
  automation: "Automation",
  product: "Produit",
  verification: "Vérification",
};
