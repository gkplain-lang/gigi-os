import { isAutomationIntent } from "@/modules/automation/automationIntent";
import type { AiBrainRequest, AiBrainResponse } from "../ai/types";
import type { IntegrationProposal } from "./types";
import { permissionsForIntegration, formatPermissionsList } from "./integrationPermissions";
import { blockedReasonForGitHubForbidden, V08_BLOCKED_REAL_MESSAGE, V08_NO_API_MESSAGE } from "./integrationSafety";
import { getIntegrationStatus } from "./integrationStatus";
import {
  buildGitHubExpectedOutcome,
  buildGitHubPlanSteps,
  buildGitHubWillNotDo,
  buildGitHubWouldDo,
  GITHUB_DRY_RUN_LABELS,
  isGitHubIntent,
  resolvePrimaryGitHubAction,
} from "./github/githubActions";
import type { GitHubDryRunActionType } from "./github/types";

function proposalId(): string {
  return `int-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
}

function riskForAction(action: GitHubDryRunActionType): IntegrationProposal["riskLevel"] {
  if (action === "prepare_merge_plan") return "high";
  if (action === "prepare_pull_request_plan" || action === "prepare_commit_plan") return "medium";
  return "low";
}

function createGitHubProposal(
  userMessage: string,
  context?: { projectId?: string; missionId?: string; isRecurring?: boolean }
): IntegrationProposal {
  const { dryAction, forbiddenAction } = resolvePrimaryGitHubAction(userMessage);
  const status = getIntegrationStatus("github");
  const planSteps = buildGitHubPlanSteps(dryAction, { userMessage, ...context });
  const blockedReason = forbiddenAction
    ? blockedReasonForGitHubForbidden(forbiddenAction)
    : undefined;

  return {
    id: proposalId(),
    integrationId: "github",
    title: GITHUB_DRY_RUN_LABELS[dryAction],
    description: `Intégration GitHub (dry-run V0.8) — « ${userMessage.trim().slice(0, 100)} »`,
    status: forbiddenAction ? "blocked" : status,
    githubAction: dryAction,
    githubForbiddenAction: forbiddenAction,
    requiredPermissions: permissionsForIntegration("github", dryAction),
    riskLevel: riskForAction(dryAction),
    dryRunOnly: true,
    confirmationRequired: true,
    expectedOutcome: buildGitHubExpectedOutcome(dryAction),
    planSteps,
    wouldDo: buildGitHubWouldDo(dryAction),
    willNotDo: buildGitHubWillNotDo(),
    blockedReason,
    confirmationStatus: forbiddenAction ? "blocked" : "pending_confirmation",
    isRecurring: context?.isRecurring,
    triggerDescription: context?.isRecurring
      ? "Récurrence détectée — plan GitHub hebdomadaire en dry-run"
      : undefined,
    createdAt: new Date().toISOString(),
  };
}

export interface IntegrationDetectionResult {
  proposals: IntegrationProposal[];
  isIntegrationRequest: boolean;
  appendMessage?: string;
}

export function detectIntegrationProposals(
  userMessage: string,
  context?: { projectId?: string; missionId?: string }
): IntegrationDetectionResult {
  if (!isGitHubIntent(userMessage)) {
    return { proposals: [], isIntegrationRequest: false };
  }

  const isRecurring = isAutomationIntent(userMessage);
  const proposal = createGitHubProposal(userMessage, { ...context, isRecurring });
  const hasBlocked = Boolean(proposal.blockedReason);

  return {
    proposals: [proposal],
    isIntegrationRequest: true,
    appendMessage: hasBlocked ? V08_BLOCKED_REAL_MESSAGE : undefined,
  };
}

/** Attach integration proposals — no GitHub API, no git execution. */
export function applyIntegrationProposals(
  request: AiBrainRequest,
  response: AiBrainResponse
): AiBrainResponse {
  const detection = detectIntegrationProposals(request.userMessage, {
    projectId: response.recommendedMission?.projectId ?? request.currentMission.projectId,
    missionId: response.recommendedMission?.id ?? request.currentMission.id,
  });

  if (!detection.isIntegrationRequest || detection.proposals.length === 0) {
    return response;
  }

  let message = response.message;
  if (detection.appendMessage && !message.includes("V0.8")) {
    message = `${message}\n\n${detection.appendMessage}`;
  }
  if (!message.includes("V0.8") && !detection.appendMessage) {
    message = `${message}\n\n${V08_NO_API_MESSAGE}`;
  }

  return {
    ...response,
    message,
    integrationProposals: detection.proposals,
  };
}
