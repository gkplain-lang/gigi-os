import { assertResponseSafe } from "./safety";
import { callOpenAiBrainProvider, runLocalFallbackProvider } from "./aiProvider";
import { parseProviderJsonToAiBrain } from "./responseAdapter";
import type { AiBrainRequest, AiBrainResponse } from "./types";

export interface AskAiBrainOptions {
  /** Force local fallback (tests / dev) */
  forceLocal?: boolean;
  /** Skip server call even if configured */
  preferLocal?: boolean;
}

/**
 * AI Brain orchestrator — always returns a safe response.
 * Falls back to deterministic local brain on any failure.
 */
export async function askAiBrain(
  request: AiBrainRequest,
  options: AskAiBrainOptions = {}
): Promise<AiBrainResponse> {
  const fallback = (): AiBrainResponse =>
    assertResponseSafe(runLocalFallbackProvider(request));

  if (options.forceLocal || options.preferLocal) {
    return fallback();
  }

  const providerResult = await callOpenAiBrainProvider(request);

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
    const completed = new Set(request.completedMissionIds);
    if (completed.has(response.recommendedMission.id)) {
      return fallback();
    }
  }

  if (response.safety.level === "blocked") {
    return fallback();
  }

  response = assertResponseSafe(response);
  return response;
}

/** Server-side helper after OpenAI JSON parse */
export function finalizeServerAiResponse(
  parsed: Parameters<typeof parseProviderJsonToAiBrain>[0],
  request: AiBrainRequest
): AiBrainResponse {
  const mapped = parseProviderJsonToAiBrain(parsed, request);
  if (!mapped) {
    return runLocalFallbackProvider(request);
  }
  return assertResponseSafe(mapped);
}
