import {
  MISSION_CATALOG,
  PROJECT_NAMES,
  catalogToMission,
} from "@/modules/conversation/missionCatalog";
import type { ConversationIntent, GigiConversationResponse } from "@/modules/conversation/conversationTypes";
import type { Mission } from "@/modules/missions/missionTypes";
import type {
  AiBrainResponse,
  AiProviderJsonResponse,
  AiBrainRequest,
} from "./types";
import { mergeSafety } from "./safety";
import { enrichAiBrainDecision } from "./decisionQuality/decisionFormatter";
import { V06_BLOCKED_MESSAGE } from "@/modules/agents";

function mapIntent(raw: string): ConversationIntent {
  const norm = raw.toLowerCase();
  if (norm.includes("daily_review") || norm.includes("daily review")) return "daily_review";
  if (norm.includes("revenue") || norm.includes("revenu")) return "revenue";
  if (norm.includes("alternative")) return "alternative";
  if (norm.includes("project")) return "project_specific";
  if (norm.includes("focus")) return "focus";
  if (norm.includes("unclear")) return "unclear";
  if (norm.includes("creative")) return "creative";
  if (norm.includes("maintenance")) return "maintenance";
  return "general";
}

function resolveMissionFromPayload(
  payload: AiProviderJsonResponse["recommendedMission"],
  completedIds: Set<string>
): Mission | undefined {
  if (!payload?.projectId) return undefined;

  const catalogMatch = payload.missionId
    ? MISSION_CATALOG.find((m) => m.id === payload.missionId)
    : MISSION_CATALOG.find(
        (m) =>
          m.projectId === payload.projectId &&
          m.title.toLowerCase().includes(payload.title.toLowerCase().slice(0, 20))
      );

  if (catalogMatch && !completedIds.has(catalogMatch.id)) {
    return catalogToMission(catalogMatch);
  }

  const fallback = MISSION_CATALOG.filter(
    (m) => m.projectId === payload.projectId && !completedIds.has(m.id)
  ).sort((a, b) => b.score - a.score)[0];

  if (fallback) return catalogToMission(fallback);
  return undefined;
}

export function aiBrainToGigiResponse(ai: AiBrainResponse): GigiConversationResponse {
  const intent = mapIntent(ai.intent);

  if (!ai.recommendedMission) {
    return {
      intent,
      intentLabel: ai.intent,
      listen: ai.message,
      needsClarification: intent === "unclear",
      clarificationQuestion:
        intent === "unclear"
          ? "Tu veux avancer vers quoi aujourd'hui : revenu rapide, un projet précis, ou remettre de l'ordre ?"
          : undefined,
      alternative: ai.alternative,
      notNow: ai.notNow,
      finalMessage: ai.message,
      actionProposals: ai.actionProposals,
      agentBlockedMessage: ai.actionProposals?.some((p) => p.blockedReason)
        ? V06_BLOCKED_MESSAGE
        : undefined,
      dailyReview: ai.dailyReview,
    };
  }

  const mission = ai.recommendedMission;
  const projectName = PROJECT_NAMES[mission.projectId] ?? mission.projectName;
  const displayWarning = ai.primaryRisk ?? undefined;

  return {
    intent,
    intentLabel: ai.mode === "ai_assisted" ? `IA · ${ai.intent}` : ai.intent,
    listen: ai.message,
    needsClarification: false,
    priorityProjectName: projectName,
    mission,
    missionTitle: mission.title,
    why: ai.reason,
    tasks: ai.tasks,
    warning: displayWarning,
    primaryRisk: ai.primaryRisk,
    nextStep: ai.nextStep,
    alternative: ai.alternative,
    notNow: ai.notNow,
    finalMessage: ai.nextStep ?? "Le reste peut attendre.",
    actionProposals: ai.actionProposals,
    agentBlockedMessage: ai.actionProposals?.some((p) => p.blockedReason)
      ? V06_BLOCKED_MESSAGE
      : undefined,
    dailyReview: ai.dailyReview,
  };
}

export function parseProviderJsonToAiBrain(
  parsed: AiProviderJsonResponse,
  request: AiBrainRequest
): AiBrainResponse | null {
  if (!parsed.message) return null;

  const completed = new Set(request.completedMissionIds);
  const mission = resolveMissionFromPayload(parsed.recommendedMission, completed);

  if (parsed.recommendedMission && !mission) {
    return null;
  }

  if (mission && completed.has(mission.id)) {
    return null;
  }

  const safety = mergeSafety(parsed.safety, parsed.message, request.memoryContext);

  const alternative = parsed.alternative
    ? {
        projectName:
          PROJECT_NAMES[parsed.alternative.projectId ?? ""] ??
          parsed.alternative.projectId ??
          "Autre",
        missionTitle: parsed.alternative.title,
      }
    : undefined;

  const notNow = parsed.notNow?.map((line) => {
    const [name, ...rest] = line.split("—");
    return {
      projectName: name?.trim() ?? line,
      reason: rest.join("—").trim() || "pas maintenant",
    };
  });

  const draft: AiBrainResponse = {
    mode: "ai_assisted",
    intent: parsed.intent,
    message: parsed.message,
    recommendedMission: mission,
    reason: parsed.recommendedMission?.reason ?? parsed.message,
    tasks: parsed.recommendedMission?.tasks?.slice(0, 3),
    alternative,
    notNow,
    primaryRisk: parsed.primaryRisk,
    nextStep: parsed.nextStep,
    confidence: Math.min(1, Math.max(0, parsed.confidence ?? 0.5)),
    safety,
    provider: "openai",
    rawProvider: parsed,
  };

  return enrichAiBrainDecision(draft, request);
}
