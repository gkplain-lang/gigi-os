import { askGigi } from "@/modules/conversation/conversationBrain";
import type { GigiConversationResponse } from "@/modules/conversation/conversationTypes";
import { enrichAiBrainDecision } from "./decisionQuality/decisionFormatter";
import type { AiBrainMode, AiBrainRequest, AiBrainResponse } from "./types";
import { SAFE_AI_SAFETY } from "./types";

export function gigiResponseToAiBrain(
  response: GigiConversationResponse,
  mode: AiBrainMode = "local_only"
): AiBrainResponse {
  return {
    mode,
    intent: response.intent,
    message: response.listen,
    recommendedMission: response.mission,
    reason: response.why,
    tasks: response.tasks,
    alternative: response.alternative,
    notNow: response.notNow,
    primaryRisk: response.primaryRisk ?? response.warning,
    nextStep: response.nextStep,
    confidence: mode === "local_only" ? 0.85 : 0.7,
    safety: SAFE_AI_SAFETY,
    provider: "local_fallback",
  };
}

export function runLocalFallbackProvider(request: AiBrainRequest): AiBrainResponse {
  const context = {
    currentMissionId: request.currentMission.id,
    currentProjectId: request.currentMission.projectId,
    completedMissionIds: request.completedMissionIds,
    ...request.conversationContext,
  };

  const local = askGigi(request.userMessage, request.projects, context);
  const base = gigiResponseToAiBrain(local, "local_only");
  const enriched = enrichAiBrainDecision(base, request);

  return {
    ...enriched,
    requestedProjectId: request.requestedProjectId ?? null,
    projectMismatchDetected: false,
    fallbackReason: null,
  };
}
