import type { AiBrainRequest, AiBrainResponse, AiProviderJsonResponse } from "./types";
import { runLocalFallbackProvider } from "./localFallbackProvider";

export interface AiProviderCallResult {
  ok: boolean;
  response?: AiBrainResponse;
  raw?: AiProviderJsonResponse;
  error?: string;
}

/** Client-side — calls server route. Never touches API keys. */
export async function callOpenAiBrainProvider(
  request: AiBrainRequest
): Promise<AiProviderCallResult> {
  try {
    const res = await fetch("/api/ai/brain", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        userMessage: request.userMessage,
        currentMission: request.currentMission,
        projects: request.projects,
        history: request.history,
        memoryStatus: request.memoryStatus,
        completedMissionIds: request.completedMissionIds,
        postponedMissionIds: request.postponedMissionIds,
        rejectedMissionIds: request.rejectedMissionIds,
        conversationContext: request.conversationContext,
      }),
    });

    if (res.status === 503) {
      return { ok: false, error: "not_configured" };
    }

    const data = (await res.json()) as {
      ok?: boolean;
      response?: AiBrainResponse;
      error?: string;
    };

    if (!res.ok || !data.ok || !data.response) {
      return { ok: false, error: data.error ?? "provider_error" };
    }

    return { ok: true, response: data.response, raw: data.response.rawProvider as AiProviderJsonResponse };
  } catch {
    return { ok: false, error: "network_error" };
  }
}

export async function fetchAiAvailability(): Promise<{
  availability: "not_configured" | "available" | "error";
  provider: string;
  model: string | null;
  isConfigured: boolean;
}> {
  try {
    const res = await fetch("/api/ai/status");
    if (!res.ok) {
      return {
        availability: "error",
        provider: "none",
        model: null,
        isConfigured: false,
      };
    }
    return (await res.json()) as {
      availability: "not_configured" | "available" | "error";
      provider: string;
      model: string | null;
      isConfigured: boolean;
    };
  } catch {
    return {
      availability: "error",
      provider: "none",
      model: null,
      isConfigured: false,
    };
  }
}

export { runLocalFallbackProvider };
