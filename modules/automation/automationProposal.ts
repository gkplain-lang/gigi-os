import {
  DRY_RUN_AUTOMATION_LABELS,
  FORBIDDEN_AUTOMATION_LABELS,
  isForbiddenAutomation,
} from "./automationRegistry";
import {
  blockedActionsForType,
  buildAutomationSteps,
  buildExpectedOutcome,
  describeTrigger,
  inferTriggerType,
} from "./automationPlan";
import { permissionsForAutomation } from "./automationPermissions";
import { blockedReasonForForbidden } from "./automationSafety";
import { isAutomationIntent, supersedesActionProposal } from "./automationIntent";
import type {
  AutomationProposal,
  AutomationType,
  DryRunAutomationType,
  ForbiddenRealAutomationType,
} from "./types";
import type { AiBrainRequest, AiBrainResponse } from "../ai/types";

function normalize(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "");
}

function proposalId(): string {
  return `auto-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
}

interface IntentMatch {
  automationType: AutomationType;
  keywords: string[];
  priority: number;
}

const INTENT_PATTERNS: IntentMatch[] = [
  { automationType: "publish_video", keywords: ["publie automatiquement", "publication auto", "publier auto"], priority: 10 },
  { automationType: "send_email", keywords: ["envoie automatiquement", "email auto"], priority: 10 },
  { automationType: "sync_supabase", keywords: ["sync automatique", "sync supabase"], priority: 10 },
  { automationType: "restore_supabase", keywords: ["restore auto", "restaur automatiquement"], priority: 10 },
  { automationType: "run_n8n_workflow", keywords: ["lance n8n", "execute n8n", "run n8n"], priority: 9 },
  { automationType: "merge_branch", keywords: ["merge auto", "merger automatiquement"], priority: 9 },
  { automationType: "push_to_github", keywords: ["push auto", "push automatiquement"], priority: 9 },
  { automationType: "modify_calendar", keywords: ["calendrier auto", "agenda auto"], priority: 9 },
  {
    automationType: "daily_review_reminder",
    keywords: ["revue du jour", "daily review", "revue quotidienne", "tous les matins", "chaque matin"],
    priority: 8,
  },
  {
    automationType: "weekly_project_review",
    keywords: ["revue hebdo", "chaque semaine", "toutes les semaines", "check mes projets"],
    priority: 8,
  },
  {
    automationType: "project_stale_check",
    keywords: ["projets dormants", "surveille mes projets", "surveille", "stale", "projets inactifs"],
    priority: 9,
  },
  {
    automationType: "n8n_agent_plan",
    keywords: ["agent n8n", "prepare n8n", "preparer n8n", "prepare un agent n8n", "preparer un agent", "prepare un agent", "preparer un agent n8n"],
    priority: 9,
  },
  {
    automationType: "buildy_crafts_library_update_plan",
    keywords: ["buildy crafts", "bibliotheque", "update la bibliotheque"],
    priority: 7,
  },
  {
    automationType: "content_publication_plan",
    keywords: ["publie", "publication", "contenu auto"],
    priority: 6,
  },
  {
    automationType: "supabase_backup_plan",
    keywords: ["backup supabase", "sauvegarde supabase"],
    priority: 6,
  },
  {
    automationType: "tomorrow_mission_preparation",
    keywords: ["mission demain", "prepare demain"],
    priority: 5,
  },
  {
    automationType: "buildy_clear_launch_checklist",
    keywords: ["buildy clear", "lancement"],
    priority: 5,
  },
  {
    automationType: "gigi_os_git_branch_plan",
    keywords: ["branche gigi", "branch gigi"],
    priority: 5,
  },
];

function matchIntents(text: string): IntentMatch[] {
  const norm = normalize(text);
  return INTENT_PATTERNS.filter((p) => p.keywords.some((kw) => norm.includes(normalize(kw)))).sort(
    (a, b) => b.priority - a.priority
  );
}

function riskForType(type: AutomationType): AutomationProposal["riskLevel"] {
  if (type.includes("supabase") || type.includes("n8n") || type.includes("publish")) return "high";
  if (type.includes("github") || type.includes("merge") || type.includes("sync")) return "medium";
  return "low";
}

function createProposal(
  automationType: AutomationType,
  message: string,
  context?: { projectId?: string; missionId?: string }
): AutomationProposal {
  const triggerType = inferTriggerType(message);
  const triggerDescription = describeTrigger(triggerType, message);
  const steps = buildAutomationSteps(automationType, triggerDescription);
  const forbidden = isForbiddenAutomation(automationType);

  const title = forbidden
    ? FORBIDDEN_AUTOMATION_LABELS[automationType as ForbiddenRealAutomationType]
    : DRY_RUN_AUTOMATION_LABELS[automationType as DryRunAutomationType];

  return {
    id: proposalId(),
    title,
    description: `Automatisation demandée : « ${message.trim().slice(0, 100)} » — plan dry-run V0.7.`,
    automationType,
    projectId:
      automationType === "buildy_crafts_library_update_plan" ? "buildy-crafts" : context?.projectId,
    missionId: context?.missionId,
    triggerType,
    triggerDescription,
    requiredPermissions: permissionsForAutomation(automationType),
    riskLevel: riskForType(automationType),
    dryRunOnly: true,
    confirmationRequired: true,
    expectedOutcome: buildExpectedOutcome(automationType),
    steps,
    blockedActions: blockedActionsForType(automationType),
    createdAt: new Date().toISOString(),
    confirmationStatus: forbidden ? "blocked" : "pending_confirmation",
    blockedReason: forbidden ? blockedReasonForForbidden(automationType) : undefined,
  };
}

export interface AutomationDetectionResult {
  proposals: AutomationProposal[];
  isAutomationRequest: boolean;
  supersedesAction: boolean;
  appendMessage?: string;
}

export function detectAutomationProposals(
  userMessage: string,
  context?: { projectId?: string; missionId?: string }
): AutomationDetectionResult {
  const isAutomationRequest = isAutomationIntent(userMessage);
  if (!isAutomationRequest) {
    return { proposals: [], isAutomationRequest: false, supersedesAction: false };
  }

  const matches = matchIntents(userMessage);
  const proposals: AutomationProposal[] = [];
  const seen = new Set<string>();

  for (const match of matches) {
    if (seen.has(match.automationType)) continue;
    seen.add(match.automationType);
    proposals.push(createProposal(match.automationType, userMessage, context));
  }

  if (proposals.length === 0) {
    proposals.push(
      createProposal("daily_review_reminder", userMessage, context)
    );
  }

  const hasForbidden = proposals.some((p) => p.blockedReason);
  const appendMessage = hasForbidden
    ? blockedReasonForForbidden(proposals.find((p) => p.blockedReason)!.automationType)
    : undefined;

  return {
    proposals,
    isAutomationRequest: true,
    supersedesAction: supersedesActionProposal(userMessage),
    appendMessage,
  };
}

/** Attach automation proposals — no scheduling, no n8n, no external calls. */
export function applyAutomationProposals(
  request: AiBrainRequest,
  response: AiBrainResponse
): AiBrainResponse {
  const detection = detectAutomationProposals(request.userMessage, {
    projectId: response.recommendedMission?.projectId ?? request.currentMission.projectId,
    missionId: response.recommendedMission?.id ?? request.currentMission.id,
  });

  if (!detection.isAutomationRequest || detection.proposals.length === 0) {
    return response;
  }

  let message = response.message;
  if (detection.appendMessage && !message.includes("V0.7")) {
    message = `${message}\n\n${detection.appendMessage}`;
  }

  return {
    ...response,
    message,
    automationProposals: detection.proposals,
    actionProposals: detection.supersedesAction ? [] : response.actionProposals,
  };
}
