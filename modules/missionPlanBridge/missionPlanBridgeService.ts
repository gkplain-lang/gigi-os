import { markDecisionConvertedToPlan } from "@/modules/missionDecision/missionDecisionService";
import { getMissionDecisionById } from "@/modules/missionDecision/missionDecisionStore";
import type { MissionDecision, MissionDecisionCandidate } from "@/modules/missionDecision/types";
import {
  appendBridgeOutput,
  buildConversationPromptFromBridge,
  buildPlanDraftForCandidate,
  buildPreparedActionDraftForBridge,
  createBridgeRecordFromDecision,
  getAcceptedCandidateFromDecision,
} from "./missionPlanBridgeEngine";
import {
  formatMissionPlanBridgeForCopy,
  formatMissionPlanBridgeListForCopy,
} from "./missionPlanBridgeFormatter";
import {
  MISSION_PLAN_BRIDGE_EMPTY_SUMMARY,
  MISSION_PLAN_BRIDGE_GUIDANCE,
} from "./missionPlanBridgeSummary";
import {
  archiveMissionPlanBridge,
  getBridgesByMissionDecisionId,
  getMissionPlanBridgeById,
  listMissionPlanBridges,
  upsertMissionPlanBridge,
} from "./missionPlanBridgeStore";
import type {
  MissionPlanBridgeGlobalSummary,
  MissionPlanBridgeIntent,
  MissionPlanBridgeRecord,
} from "./types";
import { MISSION_PLAN_BRIDGE_DISCLAIMER } from "./types";

function normalize(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

function detectProjectId(norm: string): string | null {
  if (/buildy ?crafts|(^|\W)crafts(\W|$)/.test(norm)) return "buildy-crafts";
  if (/buildy ?clear|(^|\W)clear(\W|$)/.test(norm)) return "buildy-clear";
  if (/linko/.test(norm)) return "linko";
  if (/gigi ?os|gigios|(^|\W)gigi(\W|$)/.test(norm)) return "gigi-os";
  return null;
}

const MISSION_PLAN_BRIDGE_KEYWORDS = [
  "transforme cette mission en plan",
  "prepare le plan",
  "prépare le plan",
  "cree le pont mission plan",
  "crée le pont mission plan",
  "prepare l action depuis cette mission",
  "prépare l'action depuis cette mission",
  "ajoute cette mission a valider",
  "ajoute cette mission à valider",
  "ouvre la conversation avec cette mission",
  "mission acceptee prepare la suite",
  "mission acceptée prepare la suite",
  "mission acceptee, prepare la suite",
  "mission acceptée, prépare la suite",
  "pont mission plan",
  "mission to plan",
  "bridge mission plan",
  "crée le bridge",
  "cree le bridge",
];

export function detectMissionPlanBridgeIntent(objective: string): MissionPlanBridgeIntent {
  const norm = normalize(objective);
  const isMissionPlanBridge = MISSION_PLAN_BRIDGE_KEYWORDS.some((k) =>
    norm.includes(normalize(k))
  );
  return { isMissionPlanBridge, projectId: detectProjectId(norm) };
}

export function createBridgeFromAcceptedDecision(
  decisionId: string
): MissionPlanBridgeRecord | undefined {
  const decision = getMissionDecisionById(decisionId);
  if (!decision) return undefined;

  const candidate = getAcceptedCandidateFromDecision(decision);
  if (!candidate) return undefined;

  const existing = getBridgesByMissionDecisionId(decisionId).find(
    (b) => b.status !== "archived" && b.status !== "cancelled"
  );
  if (existing) return existing;

  const record = createBridgeRecordFromDecision(decision, candidate);
  return upsertMissionPlanBridge(record);
}

export function createBridgeFromDecision(decision: MissionDecision): MissionPlanBridgeRecord | undefined {
  return createBridgeFromAcceptedDecision(decision.id);
}

export function generatePlanDraft(bridgeId: string): MissionPlanBridgeRecord | undefined {
  const record = getMissionPlanBridgeById(bridgeId);
  if (!record) return undefined;

  let candidate: MissionDecisionCandidate | undefined;
  if (record.missionDecisionId && record.missionCandidateId) {
    const decision = getMissionDecisionById(record.missionDecisionId);
    candidate = decision?.candidates.find((c) => c.id === record.missionCandidateId);
  }

  if (!candidate && record.projectId) {
    const synthetic: MissionDecisionCandidate = {
      id: record.missionCandidateId ?? "manual",
      title: record.missionTitle,
      description: record.missionDescription ?? "",
      projectId: record.projectId,
      missionId: record.missionId,
      source: "manual",
      score: 50,
      confidence: 50,
      reasons: [],
      risks: record.risks.map((r) => ({
        id: r.id,
        label: r.label,
        description: r.description,
        severity:
          r.severity === "success"
            ? "positive"
            : (r.severity as "info" | "warning" | "critical"),
        mitigation: r.mitigation,
      })),
      validationChecklist: record.validationChecklist.map((v) => v.label),
      createdAt: record.createdAt,
    };
    candidate = synthetic;
  }

  if (!candidate) return undefined;

  const plan = buildPlanDraftForCandidate(candidate);
  if (!plan) return undefined;

  const withPlan: MissionPlanBridgeRecord = {
    ...record,
    planDraft: plan,
    status: "plan_generated",
    updatedAt: new Date().toISOString(),
  };

  const next = appendBridgeOutput(
    withPlan,
    "action_plan",
    plan.title,
    plan.summary,
    plan.id
  );

  if (record.missionDecisionId) {
    markDecisionConvertedToPlan(record.missionDecisionId);
  }

  return upsertMissionPlanBridge(next);
}

export function generatePreparedActionDraft(
  bridgeId: string
): MissionPlanBridgeRecord | undefined {
  let record = getMissionPlanBridgeById(bridgeId);
  if (!record) return undefined;

  if (!record.planDraft) {
    record = generatePlanDraft(bridgeId);
    if (!record) return undefined;
  }

  const plan = record.planDraft;
  if (!plan) return undefined;

  const prepared = buildPreparedActionDraftForBridge(record, plan);
  if (!prepared) return undefined;

  const withPrepared: MissionPlanBridgeRecord = {
    ...record,
    preparedActionDraft: prepared,
    status: "prepared_action_generated",
    updatedAt: new Date().toISOString(),
  };

  const next = appendBridgeOutput(
    withPrepared,
    "prepared_action",
    prepared.title,
    prepared.summary,
    prepared.id
  );

  return upsertMissionPlanBridge(next);
}

export function generateConversationPrompt(bridgeId: string): MissionPlanBridgeRecord | undefined {
  const record = getMissionPlanBridgeById(bridgeId);
  if (!record) return undefined;

  const prompt = buildConversationPromptFromBridge(record);
  const withPrompt: MissionPlanBridgeRecord = {
    ...record,
    conversationPrompt: prompt,
    status:
      record.status === "draft" || record.status === "ready" ? "ready" : record.status,
    updatedAt: new Date().toISOString(),
  };

  const next = appendBridgeOutput(
    withPrompt,
    "conversation_prompt",
    "Prompt conversationnel",
    prompt.slice(0, 120) + (prompt.length > 120 ? "…" : "")
  );

  return upsertMissionPlanBridge(next);
}

export function markBridgeAddedToQueue(
  bridgeId: string,
  queueItemId: string
): MissionPlanBridgeRecord | undefined {
  const record = getMissionPlanBridgeById(bridgeId);
  if (!record) return undefined;

  const withQueue: MissionPlanBridgeRecord = {
    ...record,
    queueItemId,
    status: "added_to_queue",
    updatedAt: new Date().toISOString(),
  };

  const next = appendBridgeOutput(
    withQueue,
    "queue_item",
    "Ajouté à la file V1.9",
    `Entrée ${queueItemId} — pending_review uniquement.`,
    queueItemId
  );

  return upsertMissionPlanBridge(next);
}

export function markBridgeConversationOpened(
  bridgeId: string
): MissionPlanBridgeRecord | undefined {
  const record = getMissionPlanBridgeById(bridgeId);
  if (!record) return undefined;

  return upsertMissionPlanBridge({
    ...record,
    status: "conversation_opened",
    updatedAt: new Date().toISOString(),
  });
}

export function getCopyableBridgeText(bridgeId: string): string {
  const record = getMissionPlanBridgeById(bridgeId);
  if (!record) return MISSION_PLAN_BRIDGE_DISCLAIMER;
  return formatMissionPlanBridgeForCopy(record);
}

export function getCopyableBridgeListText(limit = 10): string {
  return formatMissionPlanBridgeListForCopy(listMissionPlanBridges(limit));
}

export function generateGlobalBridgeSummary(): MissionPlanBridgeGlobalSummary {
  const bridges = listMissionPlanBridges();
  if (bridges.length === 0) {
    return {
      totalBridges: 0,
      queuedCount: 0,
      summaryText: MISSION_PLAN_BRIDGE_EMPTY_SUMMARY,
    };
  }

  const queuedCount = bridges.filter((b) => b.status === "added_to_queue").length;
  const recent = bridges[0];

  return {
    totalBridges: bridges.length,
    queuedCount,
    recentTitle: recent.missionTitle,
    summaryText: `${bridges.length} bridge(s) mission→plan — dernier : « ${recent.missionTitle} » (${recent.status}).`,
  };
}

export function buildMissionPlanBridgeGuidanceHints(objective: string): string[] {
  const hints = [...MISSION_PLAN_BRIDGE_GUIDANCE];
  const norm = normalize(objective);
  if (norm.includes("queue") || norm.includes("valider")) {
    hints.push("L'ajout à /actions reste manuel et en pending_review — jamais approuvé automatiquement.");
  }
  if (norm.includes("conversation")) {
    hints.push("Ouvre /conversation avec le prompt généré — Gigi ne modifie rien sans toi.");
  }
  return hints;
}

export function findLatestAcceptedDecisionBridge(): MissionPlanBridgeRecord | undefined {
  const bridges = listMissionPlanBridges();
  return bridges.find((b) => b.source === "mission_decision" && b.status !== "archived");
}

export { archiveMissionPlanBridge, listMissionPlanBridges, getMissionPlanBridgeById };
