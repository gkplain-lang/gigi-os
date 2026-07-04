import { ACTIVE_MAX_AUTONOMY_LEVEL } from "./autonomyLevels";
import {
  DRY_RUN_ACTION_LABELS,
  FORBIDDEN_ACTION_LABELS,
} from "./actionRegistry";
import {
  blockedReasonForForbidden,
  canPrepareAction,
  V06_BLOCKED_MESSAGE,
} from "./actionSafety";
import { executeActionDryRun } from "./actionDryRun";
import { applyConfirmationDefaults } from "./confirmation/confirmationState";
import type {
  ActionProposal,
  AgentActionType,
  DryRunActionType,
  ForbiddenRealActionType,
} from "./types";
import type { AiBrainRequest, AiBrainResponse } from "../ai/types";

function normalize(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "");
}

function proposalId(): string {
  return `ap-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
}

function createDryRunProposal(
  actionType: DryRunActionType,
  opts: {
    title?: string;
    description: string;
    expectedOutcome: string;
    projectId?: string;
    missionId?: string;
    riskLevel?: ActionProposal["riskLevel"];
  }
): ActionProposal {
  return {
    id: proposalId(),
    title: opts.title ?? DRY_RUN_ACTION_LABELS[actionType],
    description: opts.description,
    projectId: opts.projectId,
    missionId: opts.missionId,
    actionType,
    riskLevel: opts.riskLevel ?? "low",
    autonomyLevelRequired: "level_1_prepare_only",
    dryRunOnly: true,
    confirmationRequired: true,
    expectedOutcome: opts.expectedOutcome,
    createdAt: new Date().toISOString(),
  };
}

function createBlockedProposal(
  actionType: ForbiddenRealActionType,
  opts: {
    description: string;
    expectedOutcome: string;
    projectId?: string;
    missionId?: string;
  }
): ActionProposal {
  return {
    id: proposalId(),
    title: FORBIDDEN_ACTION_LABELS[actionType],
    description: opts.description,
    projectId: opts.projectId,
    missionId: opts.missionId,
    actionType,
    riskLevel: "high",
    autonomyLevelRequired: "level_2_confirmed_action",
    dryRunOnly: true,
    confirmationRequired: true,
    expectedOutcome: opts.expectedOutcome,
    blockedReason: blockedReasonForForbidden(actionType),
    createdAt: new Date().toISOString(),
  };
}

interface IntentMatch {
  actionType: AgentActionType;
  keywords: string[];
  priority: number;
}

const INTENT_PATTERNS: IntentMatch[] = [
  { actionType: "merge_branch", keywords: ["merge", "merger", "fusionne"], priority: 10 },
  { actionType: "push_to_github", keywords: ["push", "pousse sur github"], priority: 10 },
  { actionType: "sync_supabase", keywords: ["sync", "synchronise", "synchroniser"], priority: 10 },
  { actionType: "restore_supabase", keywords: ["restore", "restaur"], priority: 10 },
  { actionType: "send_email", keywords: ["envoie", "envoyer", "email", "mail", "gmail"], priority: 9 },
  { actionType: "modify_calendar", keywords: ["calendrier", "agenda", "rdv", "calendar"], priority: 9 },
  { actionType: "run_n8n_workflow", keywords: ["lance n8n", "execute n8n", "executer n8n", "run n8n"], priority: 9 },
  { actionType: "publish_content", keywords: ["publie", "publier", "publication", "poste sur"], priority: 9 },
  { actionType: "delete_data", keywords: ["supprime", "delete", "efface les donnees"], priority: 9 },
  { actionType: "spend_money", keywords: ["achete", "paiement", "paye", "depense"], priority: 8 },
  { actionType: "call_external_api", keywords: ["api externe", "call api", "webhook externe"], priority: 8 },
  {
    actionType: "prepare_buildy_crafts_library_update",
    keywords: ["buildy crafts", "bibliotheque", "library"],
    priority: 7,
  },
  {
    actionType: "prepare_n8n_agent_plan",
    keywords: ["prepare un agent", "preparer un agent", "agent n8n", "plan n8n", "prepare agent"],
    priority: 7,
  },
  { actionType: "prepare_github_commit", keywords: ["commit", "commiter"], priority: 6 },
  { actionType: "prepare_github_branch", keywords: ["branche", "branch", "checkout -b"], priority: 6 },
  {
    actionType: "prepare_supabase_backup_plan",
    keywords: ["backup supabase", "sauvegarde supabase", "backup"],
    priority: 5,
  },
  {
    actionType: "prepare_tomorrow_mission",
    keywords: ["demain", "tomorrow", "mission demain"],
    priority: 5,
  },
  {
    actionType: "prepare_project_review",
    keywords: ["revue projet", "review projet", "bilan projet"],
    priority: 5,
  },
];

function matchIntents(text: string): IntentMatch[] {
  const norm = normalize(text);
  return INTENT_PATTERNS.filter((p) => p.keywords.some((kw) => norm.includes(normalize(kw)))).sort(
    (a, b) => b.priority - a.priority
  );
}

export interface ActionDetectionResult {
  proposals: ActionProposal[];
  appendMessage?: string;
  hasForbiddenIntent: boolean;
}

export function detectActionProposals(
  userMessage: string,
  context?: { projectId?: string; missionId?: string }
): ActionDetectionResult {
  const matches = matchIntents(userMessage);
  if (matches.length === 0) {
    return { proposals: [], hasForbiddenIntent: false };
  }

  const proposals: ActionProposal[] = [];
  let hasForbiddenIntent = false;
  const seen = new Set<string>();

  for (const match of matches) {
    if (seen.has(match.actionType)) continue;
    seen.add(match.actionType);

    if (match.actionType.startsWith("prepare_")) {
      const dryType = match.actionType as DryRunActionType;
      if (!canPrepareAction(dryType)) continue;

      const buildyUpdate =
        dryType === "prepare_buildy_crafts_library_update" &&
        (normalize(userMessage).includes("update") ||
          normalize(userMessage).includes("mettre a jour") ||
          normalize(userMessage).includes("bibliotheque"));

      const n8nPlan =
        dryType === "prepare_n8n_agent_plan" &&
        (normalize(userMessage).includes("agent") || normalize(userMessage).includes("n8n"));

      if (dryType === "prepare_buildy_crafts_library_update" && !buildyUpdate) continue;
      if (dryType === "prepare_n8n_agent_plan" && !n8nPlan) continue;

      proposals.push(
        createDryRunProposal(dryType, {
          description: buildProposalDescription(dryType, userMessage),
          expectedOutcome: dryRunExpectedOutcome(dryType),
          projectId:
            dryType === "prepare_buildy_crafts_library_update" ? "buildy-crafts" : context?.projectId,
          missionId: context?.missionId,
          riskLevel: dryType.includes("supabase") ? "medium" : "low",
        })
      );
    } else {
      hasForbiddenIntent = true;
      const forbiddenType = match.actionType as ForbiddenRealActionType;
      proposals.push(
        createBlockedProposal(forbiddenType, {
          description: `Demande détectée : ${FORBIDDEN_ACTION_LABELS[forbiddenType]}. Plan préparé en dry-run uniquement.`,
          expectedOutcome: `Plan documenté localement — exécution réelle bloquée en V0.6.`,
          projectId: context?.projectId,
          missionId: context?.missionId,
        })
      );
    }
  }

  const appendMessage = hasForbiddenIntent ? V06_BLOCKED_MESSAGE : undefined;

  return { proposals, appendMessage, hasForbiddenIntent };
}

function buildProposalDescription(actionType: DryRunActionType, userMessage: string): string {
  const trimmed = userMessage.trim().slice(0, 120);
  switch (actionType) {
    case "prepare_buildy_crafts_library_update":
      return `Préparer la mise à jour de la bibliothèque Buildy Crafts (dry-run). Demande : « ${trimmed} »`;
    case "prepare_n8n_agent_plan":
      return `Élaborer un plan d'agent n8n sans connexion ni exécution. Demande : « ${trimmed} »`;
    case "prepare_github_commit":
      return `Préparer un message et une liste de fichiers pour commit — sans git réel.`;
    case "prepare_github_branch":
      return `Proposer un nom de branche et un plan de travail — sans création réelle.`;
    case "prepare_supabase_backup_plan":
      return `Plan de backup Supabase manuel — sans sync ni restore automatique.`;
    case "prepare_tomorrow_mission":
      return `Suggérer une mission pour demain à partir de l'état local.`;
    case "prepare_project_review":
      return `Synthèse de revue projet basée sur les données locales.`;
    default:
      return `Action préparée en dry-run pour : « ${trimmed} »`;
  }
}

function dryRunExpectedOutcome(actionType: DryRunActionType): string {
  const dry = executeActionDryRun({
    id: "preview",
    title: DRY_RUN_ACTION_LABELS[actionType],
    description: "",
    actionType,
    riskLevel: "low",
    autonomyLevelRequired: ACTIVE_MAX_AUTONOMY_LEVEL,
    dryRunOnly: true,
    confirmationRequired: false,
    expectedOutcome: "",
    createdAt: new Date().toISOString(),
  });
  return dry.summary;
}

/** Attach action proposals to AI brain response — no external side effects. */
export function applyAgentProposals(
  request: AiBrainRequest,
  response: AiBrainResponse
): AiBrainResponse {
  const detection = detectActionProposals(request.userMessage, {
    projectId: response.recommendedMission?.projectId ?? request.currentMission.projectId,
    missionId: response.recommendedMission?.id ?? request.currentMission.id,
  });

  if (detection.proposals.length === 0) {
    return response;
  }

  let message = response.message;
  if (detection.appendMessage && !message.includes(detection.appendMessage)) {
    message = `${message}\n\n${detection.appendMessage}`;
  }

  return {
    ...response,
    message,
    actionProposals: detection.proposals.map(applyConfirmationDefaults),
  };
}
