import { assertResponseSafe } from "./safety";
import { callOpenAiBrainProvider, runLocalFallbackProvider } from "./aiProvider";
import { enrichAiBrainRequest } from "./projectIntent";
import { applyProjectIntentGuard } from "./projectIntentGuard";
import { parseProviderJsonToAiBrain } from "./responseAdapter";
import type { AiBrainRequest, AiBrainResponse } from "./types";

export interface AskAiBrainOptions {
  /** Force local fallback (tests / dev) */
  forceLocal?: boolean;
  /** Skip server call even if configured */
  preferLocal?: boolean;
}

function attachIntentMeta(response: AiBrainResponse, request: AiBrainRequest): AiBrainResponse {
  return {
    ...response,
    requestedProjectId: request.requestedProjectId ?? response.requestedProjectId ?? null,
  };
}

/**
 * AI Brain orchestrator — always returns a safe response.
 * Falls back to deterministic local brain on any failure.
 */
export async function askAiBrain(
  request: AiBrainRequest,
  options: AskAiBrainOptions = {}
): Promise<AiBrainResponse> {
  const enriched = enrichAiBrainRequest(request);

  const fallback = (): AiBrainResponse =>
    attachIntentMeta(assertResponseSafe(runLocalFallbackProvider(enriched)), enriched);

  if (options.forceLocal || options.preferLocal) {
    return fallback();
  }

  const providerResult = await callOpenAiBrainProvider(enriched);

  if (!providerResult.ok || !providerResult.response) {
    const local = fallback();
    return {
      ...local,
      mode: providerResult.error === "not_configured" ? "local_only" : "ai_unavailable",
      message:
        providerResult.error === "not_configured"
          ? local.message
          : `${local.message} (IA indisponible, fallback local.)`,
    };
  }

  let response = providerResult.response;

  if (response.recommendedMission) {
    const completed = new Set(enriched.completedMissionIds);
    if (completed.has(response.recommendedMission.id)) {
      return fallback();
    }
  }

  if (response.safety.level === "blocked") {
    return fallback();
  }

  response = applyProjectIntentGuard(enriched, response);
  response = assertResponseSafe(response);
  return attachIntentMeta(response, enriched);
}

/** Server-side helper after OpenAI JSON parse */
export function finalizeServerAiResponse(
  parsed: Parameters<typeof parseProviderJsonToAiBrain>[0],
  request: AiBrainRequest
): AiBrainResponse {
  const enriched = enrichAiBrainRequest(request);
  const mapped = parseProviderJsonToAiBrain(parsed, enriched);
  if (!mapped) {
    return attachIntentMeta(runLocalFallbackProvider(enriched), enriched);
  }

  let response = assertResponseSafe(mapped);
  response = applyProjectIntentGuard(enriched, response);
  return attachIntentMeta(assertResponseSafe(response), enriched);
}
