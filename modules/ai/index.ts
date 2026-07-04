export type {
  AiActionType,
  AiAvailability,
  AiBrainMode,
  AiBrainRequest,
  AiBrainResponse,
  AiProviderJsonResponse,
  AiProviderName,
  AiSafetyLevel,
  AiSafetyResult,
  AiServerConfig,
  ProjectIntentLock,
} from "./types";

export type {
  AiMemoryContext,
  AiMemoryContextStats,
  BuildAiMemoryContextParams,
  ContextLimits,
} from "./memoryContext";

export { SAFE_AI_SAFETY } from "./types";

export { getServerAiConfig, getPublicAiStatus } from "./aiConfig";

export {
  AI_SAFETY_RULES_SUMMARY,
  assertResponseSafe,
  evaluateTextSafety,
  mergeSafety,
} from "./safety";

export { buildAiPromptPayload, buildOpenAiMessages, SYSTEM_PROMPT } from "./promptBuilder";

export { runLocalFallbackProvider, gigiResponseToAiBrain } from "./localFallbackProvider";

export {
  aiBrainToGigiResponse,
  parseProviderJsonToAiBrain,
} from "./responseAdapter";

export {
  callOpenAiBrainProvider,
  fetchAiAvailability,
} from "./aiProvider";

export { askAiBrain, finalizeServerAiResponse } from "./aiBrain";
export type { AskAiBrainOptions } from "./aiBrain";

export { detectRequestedProject, enrichAiBrainRequest } from "./projectIntent";
export { applyProjectIntentGuard, pickCatalogMissionForProject } from "./projectIntentGuard";

export {
  buildAiMemoryContext,
  tryBuildAiMemoryContext,
  summarizeAiMemoryContext,
  DEFAULT_CONTEXT_LIMITS,
} from "./memoryContext";

export {
  applyDecisionQuality,
  summarizeDecisionQuality,
  validateDecisionQuality,
  DECISION_CONTRACT_RULES,
} from "./decisionQuality";

export type {
  DecisionQualityReport,
  DecisionQualitySummary,
  GigiDecisionContract,
} from "./decisionQuality";

export { useAiAvailability } from "./useAiAvailability";
