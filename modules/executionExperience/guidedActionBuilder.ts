import {
  loadExecutionReadinessState,
  saveExecutionReadinessState,
} from "@/modules/executionReadiness/executionReadinessStore";
import { getGuidedActionDisclaimer } from "./guidedActionPolicy";
import {
  GUIDED_STEP_DEFINITIONS,
  getGuidedActionTemplate,
} from "./guidedActionTemplates";
import type {
  GuidedFlowAuditEntry,
  GuidedFlowStatus,
  GuidedFlowStep,
  GuidedFlowStepId,
  GuidedProjectActionFlow,
  GuidedActionTemplateDefinition,
} from "./guidedActionTypes";

function newId(prefix: string): string {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

function nowIso(): string {
  return new Date().toISOString();
}

function audit(
  type: GuidedFlowAuditEntry["type"],
  message: string,
  status?: GuidedFlowStatus
): GuidedFlowAuditEntry {
  return { id: newId("gf-audit"), at: nowIso(), type, message, status };
}

function buildSteps(stepIds: GuidedFlowStepId[]): GuidedFlowStep[] {
  return stepIds.map((id) => {
    const def = GUIDED_STEP_DEFINITIONS[id];
    return {
      id,
      label: def.label,
      description: def.description,
      route: def.route,
      status: id === "action_goal" ? "ready" : "pending",
    };
  });
}

function saveFlow(flow: GuidedProjectActionFlow): GuidedProjectActionFlow {
  const state = loadExecutionReadinessState();
  const existing = state.guidedProjectActionFlows ?? [];
  saveExecutionReadinessState({
    ...state,
    guidedProjectActionFlows: [flow, ...existing.filter((f) => f.id !== flow.id)],
    lastUpdatedAt: flow.updatedAt,
  });
  return flow;
}

function baseFlowFromTemplate(
  template: GuidedActionTemplateDefinition,
  overrides: Partial<GuidedProjectActionFlow> = {}
): GuidedProjectActionFlow {
  const now = nowIso();
  const disclaimer = getGuidedActionDisclaimer();
  return {
    id: newId("guided-flow"),
    title: `Guidé · ${template.title}`,
    description: template.description,
    source: "template",
    templateId: template.id,
    status: "action_selected",
    createdAt: now,
    updatedAt: now,
    actionGoal: template.actionGoal,
    actionCategory: template.category,
    riskLevel: template.riskLevel,
    suggestedCapability: template.suggestedCapability,
    suggestedRoute: template.suggestedRoute,
    steps: buildSteps(template.stepIds),
    auditTrail: [
      audit(
        "guided_flow_created",
        `Parcours guidé créé depuis le modèle « ${template.title} » — aucune exécution réelle.`,
        "action_selected"
      ),
    ],
    disclaimer,
    ...overrides,
  };
}

export function listGuidedProjectActionFlows(limit?: number): GuidedProjectActionFlow[] {
  const flows = loadExecutionReadinessState().guidedProjectActionFlows ?? [];
  const sorted = [...flows].sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
  return limit ? sorted.slice(0, limit) : sorted;
}

export function getGuidedProjectActionFlowById(id: string): GuidedProjectActionFlow | undefined {
  return listGuidedProjectActionFlows().find((f) => f.id === id);
}

export function listActiveGuidedFlows(limit?: number): GuidedProjectActionFlow[] {
  const active = listGuidedProjectActionFlows().filter(
    (f) => !["completed_by_human", "cancelled"].includes(f.status)
  );
  return limit ? active.slice(0, limit) : active;
}

export interface CreateGuidedFlowInput {
  templateId?: string;
  title?: string;
  description?: string;
  projectId?: string;
  projectName?: string;
  missionId?: string;
  source?: GuidedProjectActionFlow["source"];
}

export function createGuidedProjectActionFlow(
  input: CreateGuidedFlowInput = {}
): GuidedProjectActionFlow {
  const template = input.templateId ? getGuidedActionTemplate(input.templateId) : undefined;
  if (template) {
    return saveFlow(
      baseFlowFromTemplate(template, {
        projectId: input.projectId,
        projectName: input.projectName,
        missionId: input.missionId,
        source: input.source ?? (input.projectId ? "project" : "template"),
      })
    );
  }

  const now = nowIso();
  const flow: GuidedProjectActionFlow = {
    id: newId("guided-flow"),
    title: input.title ?? "Guidé · Action personnalisée",
    description: input.description ?? "Parcours guidé local — validation humaine à chaque étape.",
    projectId: input.projectId,
    projectName: input.projectName,
    missionId: input.missionId,
    source: input.source ?? "manual",
    status: "draft",
    createdAt: now,
    updatedAt: now,
    actionGoal: input.title ?? "Préparer une action guidée",
    actionCategory: "product",
    riskLevel: "low",
    suggestedCapability: "local_only",
    suggestedRoute: "/guided-actions",
    steps: buildSteps(["action_goal", "local_request", "permission", "command_pack", "local_review"]),
    auditTrail: [
      audit("guided_flow_created", "Parcours guidé créé manuellement — local uniquement.", "draft"),
    ],
    disclaimer: getGuidedActionDisclaimer(),
  };
  return saveFlow(flow);
}

export function createGuidedFlowFromProject(
  projectId: string,
  projectName: string,
  templateId?: string
): GuidedProjectActionFlow {
  if (templateId) {
    const template = getGuidedActionTemplate(templateId);
    if (template) {
      return saveFlow(
        baseFlowFromTemplate(template, {
          projectId,
          projectName,
          source: "project",
        })
      );
    }
  }
  return createGuidedProjectActionFlow({
    projectId,
    projectName,
    source: "project",
    title: `Guidé · ${projectName}`,
    description: `Parcours guidé pour le projet ${projectName} — aucune exécution réelle.`,
  });
}

export function createGuidedFlowFromMission(
  missionId: string,
  missionTitle: string,
  projectId?: string,
  projectName?: string,
  templateId?: string
): GuidedProjectActionFlow {
  if (templateId) {
    const template = getGuidedActionTemplate(templateId);
    if (template) {
      return saveFlow(
        baseFlowFromTemplate(template, {
          missionId,
          projectId,
          projectName,
          source: "mission",
          title: `Guidé · ${missionTitle}`,
        })
      );
    }
  }
  return createGuidedProjectActionFlow({
    missionId,
    projectId,
    projectName,
    source: "mission",
    title: `Guidé · ${missionTitle}`,
    description: `Parcours guidé depuis la mission « ${missionTitle} ».`,
  });
}

const STATUS_ORDER: GuidedFlowStatus[] = [
  "draft",
  "action_selected",
  "request_prepared",
  "permission_review_ready",
  "manual_bridge_ready",
  "command_pack_ready",
  "local_review_ready",
  "completed_by_human",
  "cancelled",
];

export function updateGuidedFlowStatus(
  flowId: string,
  status: GuidedFlowStatus
): GuidedProjectActionFlow | null {
  const flow = getGuidedProjectActionFlowById(flowId);
  if (!flow) return null;
  const updated: GuidedProjectActionFlow = {
    ...flow,
    status,
    updatedAt: nowIso(),
    auditTrail: [
      audit("guided_flow_status_change", `Statut → ${status} (déclaratif local).`, status),
      ...flow.auditTrail,
    ],
  };
  return saveFlow(updated);
}

export function markGuidedStepReady(
  flowId: string,
  stepId: GuidedFlowStepId
): GuidedProjectActionFlow | null {
  const flow = getGuidedProjectActionFlowById(flowId);
  if (!flow) return null;

  const steps = flow.steps.map((s) =>
    s.id === stepId ? { ...s, status: "completed_by_human" as const } : s
  );

  const nextStatus = inferStatusFromSteps(steps, flow.status);
  const updated: GuidedProjectActionFlow = {
    ...flow,
    steps,
    status: nextStatus,
    updatedAt: nowIso(),
    auditTrail: [
      audit(
        "guided_step_marked_ready",
        `Étape « ${GUIDED_STEP_DEFINITIONS[stepId].label} » marquée prête par l'humain.`,
        nextStatus
      ),
      ...flow.auditTrail,
    ],
  };
  return saveFlow(updated);
}

function inferStatusFromSteps(
  steps: GuidedFlowStep[],
  current: GuidedFlowStatus
): GuidedFlowStatus {
  if (current === "cancelled" || current === "completed_by_human") return current;

  const done = (id: GuidedFlowStepId) =>
    steps.find((s) => s.id === id)?.status === "completed_by_human";

  if (done("local_review")) return "local_review_ready";
  if (done("command_pack")) return "command_pack_ready";
  if (done("manual_bridge")) return "manual_bridge_ready";
  if (done("permission")) return "permission_review_ready";
  if (done("local_request")) return "request_prepared";
  if (done("action_goal")) return "action_selected";
  return current;
}

function linkField<K extends keyof GuidedProjectActionFlow>(
  flowId: string,
  field: K,
  value: NonNullable<GuidedProjectActionFlow[K]>,
  auditType: GuidedFlowAuditEntry["type"],
  message: string,
  status?: GuidedFlowStatus
): GuidedProjectActionFlow | null {
  const flow = getGuidedProjectActionFlowById(flowId);
  if (!flow) return null;
  const updated: GuidedProjectActionFlow = {
    ...flow,
    [field]: value,
    status: status ?? flow.status,
    updatedAt: nowIso(),
    auditTrail: [audit(auditType, message, status ?? flow.status), ...flow.auditTrail],
  };
  return saveFlow(updated);
}

export function linkGuidedFlowToRequest(
  flowId: string,
  requestId: string
): GuidedProjectActionFlow | null {
  return linkField(
    flowId,
    "linkedRequestId",
    requestId,
    "guided_flow_linked_request",
    `Demande locale ${requestId} reliée au parcours.`,
    "request_prepared"
  );
}

export function linkGuidedFlowToManualPacket(
  flowId: string,
  packetId: string
): GuidedProjectActionFlow | null {
  return linkField(
    flowId,
    "linkedManualPacketId",
    packetId,
    "guided_flow_linked_manual_packet",
    `Paquet pont manuel ${packetId} relié.`,
    "manual_bridge_ready"
  );
}

export function linkGuidedFlowToCommandPack(
  flowId: string,
  packId: string
): GuidedProjectActionFlow | null {
  return linkField(
    flowId,
    "linkedCommandPackId",
    packId,
    "guided_flow_linked_command_pack",
    `Pack de commandes ${packId} relié.`,
    "command_pack_ready"
  );
}

export function linkGuidedFlowToReviewSession(
  flowId: string,
  sessionId: string
): GuidedProjectActionFlow | null {
  return linkField(
    flowId,
    "linkedReviewSessionId",
    sessionId,
    "guided_flow_linked_review_session",
    `Revue locale ${sessionId} reliée.`,
    "local_review_ready"
  );
}

export function completeGuidedFlowByHuman(flowId: string): GuidedProjectActionFlow | null {
  const flow = getGuidedProjectActionFlowById(flowId);
  if (!flow) return null;
  const updated: GuidedProjectActionFlow = {
    ...flow,
    status: "completed_by_human",
    updatedAt: nowIso(),
    auditTrail: [
      audit(
        "guided_flow_completed_by_human",
        "Parcours marqué terminé par l'humain — aucune vérification réelle.",
        "completed_by_human"
      ),
      ...flow.auditTrail,
    ],
  };
  return saveFlow(updated);
}

export function cancelGuidedFlow(flowId: string): GuidedProjectActionFlow | null {
  const flow = getGuidedProjectActionFlowById(flowId);
  if (!flow) return null;
  const updated: GuidedProjectActionFlow = {
    ...flow,
    status: "cancelled",
    updatedAt: nowIso(),
    auditTrail: [
      audit("guided_flow_cancelled", "Parcours guidé annulé localement.", "cancelled"),
      ...flow.auditTrail,
    ],
  };
  return saveFlow(updated);
}

export function getNextGuidedStep(flow: GuidedProjectActionFlow): GuidedFlowStep | undefined {
  return flow.steps.find(
    (s) => s.status === "pending" && s.id !== "action_goal"
  ) ?? flow.steps.find((s) => s.status === "pending");
}

export function compareGuidedStatus(a: GuidedFlowStatus, b: GuidedFlowStatus): number {
  return STATUS_ORDER.indexOf(a) - STATUS_ORDER.indexOf(b);
}
