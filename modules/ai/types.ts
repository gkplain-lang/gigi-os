import type { Mission } from "@/modules/missions/missionTypes";
import type { Project } from "@/modules/projects/projectTypes";
import type { MemoryStatus } from "@/modules/memory/types";
import type {
  ConversationContext,
  NotNowItem,
  AlternativeSuggestion,
} from "@/modules/conversation/conversationTypes";
import type { AiMemoryContext } from "./memoryContext/types";
import type { DecisionQualityReport } from "./decisionQuality/types";
import type { ActionProposal } from "@/modules/agents/types";
import type { AutomationProposal } from "@/modules/automation/types";
import type { IntegrationProposal } from "@/modules/integrations/types";
import type { DailyReviewSnapshot } from "@/modules/dailyReview/types";
import type { HistoryEvent } from "@/modules/history/historyTypes";
import type { MissionExecutionHints } from "@/modules/missionExecution/types";

export type AiAvailability = "not_configured" | "available" | "error";

export type AiProviderName = "none" | "openai" | "local_fallback";

export type AiBrainMode = "local_only" | "ai_assisted" | "ai_unavailable";

export type ProjectIntentLock = "project_specific" | null;

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
  /** Explicit project detected from user message */
  requestedProjectId?: string | null;
  requestedProjectName?: string | null;
  intentLock?: ProjectIntentLock;
  /** Bounded read-only memory context for AI prompts */
  memoryContext?: AiMemoryContext;
  /** V0.6.1 — full history for daily review (read-only) */
  historyEvents?: HistoryEvent[];
  executionHints?: MissionExecutionHints | null;
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
  requestedProjectId?: string | null;
  projectMismatchDetected?: boolean;
  fallbackReason?: string | null;
  primaryRisk?: string;
  nextStep?: string;
  decisionQuality?: DecisionQualityReport;
  /** V0.6 — dry-run action proposals, never auto-executed */
  actionProposals?: ActionProposal[];
  /** V0.7 — dry-run automation proposals, never scheduled or executed */
  automationProposals?: AutomationProposal[];
  /** V0.8 — dry-run integration proposals (GitHub alpha), no external API */
  integrationProposals?: IntegrationProposal[];
  /** V0.6.1 — read-only daily review */
  dailyReview?: DailyReviewSnapshot;
}

export interface AiProviderJsonResponse {
  intent: string;
  message: string;
  recommendedMission?: AiRecommendedMissionPayload;
  alternative?: AiAlternativePayload;
  notNow?: string[];
  primaryRisk?: string;
  nextStep?: string;
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
