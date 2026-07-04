import type { Mission } from "@/modules/missions/missionTypes";
import type { Project } from "@/modules/projects/projectTypes";
import type { MemoryStatus } from "@/modules/memory/types";
import type {
  ConversationContext,
  NotNowItem,
  AlternativeSuggestion,
} from "@/modules/conversation/conversationTypes";

export type AiAvailability = "not_configured" | "available" | "error";

export type AiProviderName = "none" | "openai" | "local_fallback";

export type AiBrainMode = "local_only" | "ai_assisted" | "ai_unavailable";

export type AiSafetyLevel = "safe" | "needs_confirmation" | "blocked";

export type AiActionType =
  | "suggestion"
  | "mission_recommendation"
  | "explanation"
  | "draft"
  | "external_action";

export interface AiSafetyResult {
  level: AiSafetyLevel;
  requiresConfirmation: boolean;
  blockedActions: AiActionType[];
  warnings: string[];
}

export interface AiRecommendedMissionPayload {
  title: string;
  projectId: string;
  reason: string;
  tasks: string[];
  missionId?: string;
}

export interface AiAlternativePayload {
  title: string;
  reason: string;
  projectId?: string;
}

export interface AiBrainRequest {
  userMessage: string;
  currentMission: Mission;
  projects: Project[];
  history: Array<{ title: string; type: string; date: string }>;
  memoryStatus?: Pick<MemoryStatus, "mode" | "label" | "lastBackupAt"> | null;
  completedMissionIds: string[];
  postponedMissionIds: string[];
  rejectedMissionIds: string[];
  conversationContext?: ConversationContext;
}

export interface AiBrainResponse {
  mode: AiBrainMode;
  intent: string;
  message: string;
  recommendedMission?: Mission;
  reason?: string;
  tasks?: string[];
  alternative?: AlternativeSuggestion;
  notNow?: NotNowItem[];
  confidence: number;
  safety: AiSafetyResult;
  provider: AiProviderName;
  rawProvider?: unknown;
}

export interface AiProviderJsonResponse {
  intent: string;
  message: string;
  recommendedMission?: AiRecommendedMissionPayload;
  alternative?: AiAlternativePayload;
  notNow?: string[];
  confidence: number;
  safety?: {
    level?: AiSafetyLevel;
    requiresConfirmation?: boolean;
    blockedActions?: AiActionType[];
  };
}

export interface AiServerConfig {
  provider: AiProviderName;
  model: string;
  isConfigured: boolean;
  availability: AiAvailability;
}

export const SAFE_AI_SAFETY: AiSafetyResult = {
  level: "safe",
  requiresConfirmation: false,
  blockedActions: [],
  warnings: [],
};
