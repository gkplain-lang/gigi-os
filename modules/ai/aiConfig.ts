import type { AiAvailability, AiProviderName, AiServerConfig } from "./types";

const DEFAULT_MODEL = "gpt-4o-mini";

function resolveProvider(raw: string | undefined): AiProviderName {
  if (raw === "openai") return "openai";
  return "none";
}

/**
 * Server-side only — reads AI env vars. Never import in client components.
 */
export function getServerAiConfig(): AiServerConfig {
  const providerRaw = process.env.AI_PROVIDER;
  const apiKey = process.env.OPENAI_API_KEY?.trim();
  const model = process.env.AI_MODEL?.trim() || DEFAULT_MODEL;
  const provider = resolveProvider(providerRaw);

  const openAiReady = provider === "openai" && Boolean(apiKey);

  let availability: AiAvailability = "not_configured";
  if (openAiReady) availability = "available";

  return {
    provider: openAiReady ? "openai" : "none",
    model,
    isConfigured: openAiReady,
    availability,
  };
}

/** Safe public snapshot — no secrets. */
export function getPublicAiStatus(config: AiServerConfig) {
  return {
    availability: config.availability,
    provider: config.provider,
    model: config.isConfigured ? config.model : null,
    isConfigured: config.isConfigured,
  };
}
