import { runLocalFallbackProvider } from "../localFallbackProvider";
import type { AiBrainRequest, AiBrainResponse } from "../types";
import { enrichAiBrainDecision } from "./decisionFormatter";
import { validateDecisionQuality } from "./decisionValidator";
import type { DecisionQualityReport } from "./types";

export function repairDecisionQuality(
  response: AiBrainResponse,
  request: AiBrainRequest
): AiBrainResponse {
  const enriched = enrichAiBrainDecision(response, request);
  const report = validateDecisionQuality(enriched, request);

  return {
    ...enriched,
    decisionQuality: { ...report, repaired: true },
    fallbackReason: report.isComplete ? response.fallbackReason : "DECISION_QUALITY_REPAIRED",
  };
}

export function fallbackForDecisionQuality(request: AiBrainRequest): AiBrainResponse {
  const local = runLocalFallbackProvider(request);
  const report = validateDecisionQuality(local, request);

  return {
    ...local,
    mode: "ai_unavailable",
    fallbackReason: "DECISION_QUALITY_FALLBACK",
    decisionQuality: { ...report, usedFallback: true },
  };
}

export function applyDecisionQuality(
  request: AiBrainRequest,
  response: AiBrainResponse
): AiBrainResponse {
  if (!response.recommendedMission) {
    const report = validateDecisionQuality(response, request);
    return { ...response, decisionQuality: report };
  }

  let current = enrichAiBrainDecision(response, request);
  let report = validateDecisionQuality(current, request);

  if (report.isComplete) {
    return { ...current, decisionQuality: report };
  }

  current = repairDecisionQuality(current, request);
  report = validateDecisionQuality(current, request);

  if (report.isComplete) {
    return {
      ...current,
      decisionQuality: { ...report, repaired: true },
    };
  }

  return fallbackForDecisionQuality(request);
}

export { enrichAiBrainDecision } from "./decisionFormatter";
