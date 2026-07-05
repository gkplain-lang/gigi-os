import {
  MISSION_CATALOG,
  PROJECT_NAMES,
  PROJECT_STATUS,
  catalogToMission,
  type CatalogMission,
} from "./missionCatalog";
import {
  ACTION_PLAN_DRY_RUN_MESSAGE,
  buildActionPlanForProject,
  detectActionPlanIntent,
  getActionPlanStepsAsTasks,
} from "@/modules/actionPlans";
import {
  PREPARED_ACTION_DRY_RUN_MESSAGE,
  buildPreparedActionForProject,
  detectPreparedActionIntent,
} from "@/modules/preparedActions";
import {
  EXECUTION_DRY_RUN_MESSAGE,
  EXECUTION_NOT_APPROVED_MESSAGE,
  buildExecutionPlanFromQueuedAction,
  detectExecutionPlanIntent,
  findApprovedQueuedActions,
  saveExecutionPlan,
} from "@/modules/executionPlans";
import {
  EXECUTION_LOG_GUIDANCE_MESSAGE,
  EXECUTION_LOG_MANUAL_DISCLAIMER,
  detectExecutionLogIntent,
} from "@/modules/executionLogs";
import {
  EXECUTION_REVIEW_DECISION_LABELS,
  EXECUTION_REVIEW_DISCLAIMER,
  buildReviewGuidanceHints,
  createReviewFromLog,
  detectExecutionReviewIntent,
  findBestLogForReview,
  getLatestReviewForLog,
} from "@/modules/executionReviews";
import {
  FOLLOW_UP_DISCLAIMER,
  buildFollowUpGuidanceHints,
  detectFollowUpActionIntent,
  getFollowUpProposalsForReview,
} from "@/modules/followUpActions";
import {
  HISTORY_LEARNING_DISCLAIMER,
  buildHistoryLearningGuidanceHints,
  detectHistoryLearningIntent,
  generateGlobalSummary,
} from "@/modules/historyLearning";
import {
  MISSION_DECISION_LABELS,
  MISSION_FEEDBACK_DISCLAIMER,
  buildMissionFeedbackGuidanceHints,
  detectMissionFeedbackIntent,
  generateGlobalMissionFeedbackSummary,
  getBestDailyMissionRecommendation,
  getDefaultScoreableMissions,
  regenerateMissionFeedbackFromHistory,
} from "@/modules/missionFeedback";
import {
  MISSION_DECISION_DISCLAIMER,
  MISSION_DECISION_STATUS_LABELS,
  buildMissionDecisionGuidanceHints,
  detectMissionDecisionIntent,
  generateDailyMissionDecision,
  generateGlobalDecisionSummary,
  getRecommendedCandidateTitle,
  getTodayMissionDecision,
} from "@/modules/missionDecision";
import { formatCandidateComparison } from "@/modules/missionDecision/missionDecisionFormatter";
import {
  MISSION_PLAN_BRIDGE_DISCLAIMER,
  buildMissionPlanBridgeGuidanceHints,
  detectMissionPlanBridgeIntent,
  generateGlobalBridgeSummary,
  getAcceptedCandidateFromDecision,
} from "@/modules/missionPlanBridge";
import {
  SAFE_ACTION_WORKSPACE_DISCLAIMER,
  SAFE_ACTION_WORKSPACE_READINESS_LABELS,
  buildSafeActionWorkspaceGuidanceHints,
  detectSafeActionWorkspaceIntent,
  generateGlobalWorkspaceSummary,
  getSafeActionWorkspaceByActionId,
  aggregateContextFromQueuedAction,
  createWorkspaceFromContext,
} from "@/modules/safeActionWorkspace";
import { loadActionQueueState } from "@/modules/actionQueue/actionQueueStore";
import {
  MANUAL_EXECUTION_HANDOFF_DISCLAIMER,
  MANUAL_EXECUTION_HANDOFF_TARGET_LABELS,
  buildManualExecutionHandoffGuidanceHints,
  detectManualExecutionHandoffIntent,
  generateGlobalHandoffSummary,
} from "@/modules/manualExecutionHandoff";
import { createHandoffFromQueuedActionRecord } from "@/modules/manualExecutionHandoff/manualExecutionHandoffEngine";
import {
  EXECUTION_REPORT_INTAKE_DISCLAIMER,
  buildExecutionReportIntakeGuidanceHints,
  detectExecutionReportIntakeIntent,
  generateGlobalIntakeSummary,
} from "@/modules/executionReportIntake";
import {
  CLOSED_LOOP_LIFECYCLE_DISCLAIMER,
  CLOSED_LOOP_LIFECYCLE_HEALTH_LABELS,
  CLOSED_LOOP_LIFECYCLE_STATUS_LABELS,
  buildClosedLoopLifecycleGuidanceHints,
  detectClosedLoopLifecycleIntent,
  generateGlobalLifecycleSummary,
} from "@/modules/closedLoopLifecycle";
import {
  buildMissionOSConversationResponse,
  detectMissionOSIntent,
} from "@/modules/missionOS/missionOSConversation";
import {
  buildMissionLearningConversationResponse,
  detectMissionLearningIntent,
} from "@/modules/missionOS/missionOSLearningConversation";
import {
  buildProjectsCommandConversationResponse,
  detectProjectsCommandIntent,
} from "@/modules/projectsCommand";
import {
  buildExecutionReadinessConversationResponse,
  buildManualBridgeConversationResponse,
  detectExecutionReadinessIntent,
  detectManualBridgeIntent,
} from "@/modules/executionReadiness";
import {
  buildAggregateContextFromAction,
  buildLifecycleRecord,
} from "@/modules/closedLoopLifecycle/closedLoopLifecycleEngine";
import { listHistoryEntries } from "@/modules/historyLearning/historyLearningStore";
import { PREPARED_ACTION_TYPE_LABELS } from "@/modules/preparedActions/types";
import type {
  ConversationContext,
  ConversationIntent,
  GigiConversationResponse,
  NotNowItem,
} from "./conversationTypes";

/**
 * Local, deterministic decision "brain" — no AI, no API, no network.
 * It listens to the user's intent, respects an explicitly named project,
 * proposes a mission + an alternative, asks for clarification when vague,
 * and NEVER recommends a mission that is already completed.
 */

// ---------------------------------------------------------------- keywords

const REVENUE_KEYWORDS = [
  "argent",
  "revenu",
  "vendre",
  "vente",
  "gagner",
  "rentab",
  "rentable",
  "500",
  "euro",
  "eur",
  "cash",
  "chiffre d'affaire",
  "chiffre d affaire",
  "ca ",
  "lancement commercial",
  "monetis",
  "court terme",
];

const FOCUS_KEYWORDS = [
  "focus",
  "disperse",
  "dispersion",
  "trop de projet",
  "quoi faire aujourd'hui",
  "quoi faire aujourd hui",
  "faire aujourd'hui",
  "faire aujourd hui",
  "par quoi commencer",
  "je fais quoi",
  "prioritaire",
  "me concentrer",
  "concentr",
  "prochaine",
  "maintenant",
  "la suite",
  "et apres",
  "et ensuite",
];

const DAILY_REVIEW_KEYWORDS = [
  "revue du jour",
  "daily review",
  "fais ma revue",
  "fait ma revue",
  "mon bilan",
  "bilan",
  "review",
  "ou j en suis",
  "où j'en suis",
  "point sur",
  "recap",
  "récap",
  "qu est ce que je dois faire aujourd hui",
  "que faire aujourd hui",
];

const ALTERNATIVE_KEYWORDS = [
  "autre chose",
  "autre option",
  "une autre",
  "un autre",
  "propose autre",
  "propose-moi autre",
  "pas envie",
  "donne moi une autre",
  "donne-moi une autre",
  "autre mission",
  "change de mission",
  "une alternative",
  "autrement",
  "sinon",
  "pas ca",
];

const CREATIVE_KEYWORDS = [
  "idee creative",
  "creatif",
  "creative",
  "video",
  "tiktok",
  "contenu",
  "histoire",
  "narratif",
  "jeu",
  "gameplay",
  "inspiration",
  "story",
];

const MAINTENANCE_KEYWORDS = [
  "ranger",
  "organiser",
  "nettoyer",
  "menage",
  "github",
  "docs",
  "documentation",
  "bug",
  "verifier",
  "audit",
  "auditer",
  "refactor",
  "mettre de l'ordre",
  "mettre de l ordre",
  "remettre de l'ordre",
  "remettre de l ordre",
];

const UNCLEAR_KEYWORDS = [
  "je sais pas",
  "sais pas",
  "aucune idee",
  "aide moi",
  "aide-moi",
  "aidez moi",
  "bof",
  "perdu",
  "sais plus",
  "hmm",
];

// ---------------------------------------------------------------- helpers

function normalize(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

function detectProject(norm: string): string | null {
  if (/buildy ?crafts|(^|\W)crafts(\W|$)/.test(norm)) return "buildy-crafts";
  if (/buildy ?clear|(^|\W)clear(\W|$)/.test(norm)) return "buildy-clear";
  if (/linko/.test(norm)) return "linko";
  if (/1 ?millimetre|millimetre|1mm/.test(norm)) return "1millimetre";
  if (/dernier souvenir|souvenir/.test(norm)) return "le-dernier-souvenir";
  if (/gigi ?os|gigios/.test(norm)) return "gigi-os";
  return null;
}

function matchesAny(norm: string, keywords: string[]): boolean {
  return keywords.some((k) => norm.includes(normalize(k)));
}

function byScore(a: CatalogMission, b: CatalogMission): number {
  return b.score - a.score;
}

function projectMissions(pool: CatalogMission[], projectId: string): CatalogMission[] {
  return pool.filter((m) => m.projectId === projectId).sort(byScore);
}

function missionsWithAnyTag(pool: CatalogMission[], tags: string[]): CatalogMission[] {
  return pool.filter((m) => m.tags.some((t) => tags.includes(t))).sort(byScore);
}

function activeMissions(pool: CatalogMission[]): CatalogMission[] {
  return pool.filter((m) => m.status === "active").sort(byScore);
}

function deriveTasks(cm: CatalogMission): string[] {
  if (cm.subtasks && cm.subtasks.length >= 3) return cm.subtasks.slice(0, 3);
  return [
    `${cm.title} — poser la première petite étape`,
    "Avancer 45 minutes, sans rien ouvrir d'autre",
    "Noter où tu t'arrêtes pour reprendre facilement",
  ];
}

const NOT_NOW_ORDER = [
  "buildy-clear",
  "buildy-crafts",
  "linko",
  "1millimetre",
  "le-dernier-souvenir",
  "gigi-os",
];

const NOT_NOW_BASE: Record<string, string> = {
  "buildy-clear": "important pour le revenu",
  "buildy-crafts": "stratégique long terme",
  linko: "en pause",
  "1millimetre": "expérimental",
  "le-dernier-souvenir": "idée future",
  "gigi-os": "infrastructure",
};

function buildNotNow(selectedProjectId: string, intent: ConversationIntent): NotNowItem[] {
  return NOT_NOW_ORDER.filter((id) => id !== selectedProjectId).map((id) => {
    let reason = NOT_NOW_BASE[id];
    if (
      id === "buildy-clear" &&
      intent === "project_specific" &&
      selectedProjectId !== "buildy-clear"
    ) {
      reason = `important pour le revenu, mais tu as demandé ${PROJECT_NAMES[selectedProjectId]}`;
    }
    return { projectName: PROJECT_NAMES[id], reason };
  });
}

function secondOption(
  pool: CatalogMission[],
  selected: CatalogMission,
  sameProject: boolean
): CatalogMission | undefined {
  if (sameProject) {
    const inProject = projectMissions(pool, selected.projectId).filter((m) => m.id !== selected.id);
    if (inProject[0]) return inProject[0];
  }
  const rest = [...pool].sort(byScore).filter((m) => m.id !== selected.id);
  const differentProject = rest.filter((m) => m.projectId !== selected.projectId);
  const active = differentProject.filter((m) => m.status === "active");
  return active[0] ?? differentProject[0] ?? rest[0];
}

// ---------------------------------------------------------------- intent

interface DetectedIntent {
  intent: ConversationIntent;
  projectId: string | null;
  negatedProjectId: string | null;
}

export function detectIntent(objective: string): DetectedIntent {
  const norm = normalize(objective);
  const projectId = detectProject(norm);
  const isNegated = /\b(pas|sans|plutot que|au lieu de)\b/.test(norm) && projectId !== null;

  if (matchesAny(norm, ALTERNATIVE_KEYWORDS) || isNegated) {
    return {
      intent: "alternative",
      projectId: isNegated ? null : projectId,
      negatedProjectId: isNegated ? projectId : null,
    };
  }

  if (projectId) {
    return { intent: "project_specific", projectId, negatedProjectId: null };
  }

  if (matchesAny(norm, REVENUE_KEYWORDS)) {
    return { intent: "revenue", projectId: null, negatedProjectId: null };
  }

  if (matchesAny(norm, CREATIVE_KEYWORDS)) {
    return { intent: "creative", projectId: null, negatedProjectId: null };
  }

  if (matchesAny(norm, MAINTENANCE_KEYWORDS)) {
    return { intent: "maintenance", projectId: null, negatedProjectId: null };
  }

  if (matchesAny(norm, DAILY_REVIEW_KEYWORDS)) {
    return { intent: "daily_review", projectId: null, negatedProjectId: null };
  }

  if (matchesAny(norm, FOCUS_KEYWORDS)) {
    return { intent: "focus", projectId: null, negatedProjectId: null };
  }

  const wordCount = norm.trim().split(/\s+/).filter(Boolean).length;
  if (matchesAny(norm, UNCLEAR_KEYWORDS) || wordCount <= 2) {
    return { intent: "unclear", projectId: null, negatedProjectId: null };
  }

  return { intent: "general", projectId: null, negatedProjectId: null };
}

// ---------------------------------------------------------------- copy

const INTENT_LABELS: Record<ConversationIntent, string> = {
  project_specific: "J'ai compris",
  revenue: "J'ai compris : revenu rapide",
  focus: "J'ai compris : remettre de l'ordre",
  daily_review: "Revue du jour",
  alternative: "J'ai compris : une autre option",
  creative: "J'ai compris : créatif / contenu",
  maintenance: "J'ai compris : rangement / audit",
  unclear: "Je veux être sûr de bien comprendre",
  general: "J'ai regardé tes projets",
  action_plan: "Plan d'action",
  prepared_action: "Action préparée",
  execution_plan: "Plan d'exécution",
  execution_log: "Journal d'exécution",
  execution_review: "Review d'exécution",
  follow_up_action: "Action de suivi",
  history_learning: "Historique & apprentissage",
  mission_feedback: "Feedback mission",
  mission_decision: "Décision mission",
  mission_plan_bridge: "Bridge mission → plan",
  safe_action_workspace: "Safe Action Workspace",
  manual_execution_handoff: "Passation manuelle",
  execution_report_intake: "Rapport d'exécution",
  closed_loop_lifecycle: "Cycle d'action",
  mission_os: "Pilotage mission V3",
  projects_command: "Centre projets V3.6",
  execution_readiness: "Préparation exécution V4",
};

function clarificationResponse(): GigiConversationResponse {
  return {
    intent: "unclear",
    intentLabel: INTENT_LABELS.unclear,
    listen: "Avant de te lancer, dis-moi juste une chose.",
    needsClarification: true,
    clarificationQuestion:
      "Tu veux avancer vers quoi aujourd'hui : revenu rapide, un projet précis, ou juste remettre de l'ordre ?",
    choices: [
      { label: "Revenu rapide", prompt: "Je veux gagner de l'argent rapidement" },
      { label: "Avancer un projet précis", prompt: "Que faire dans Buildy Crafts aujourd'hui ?" },
      { label: "Remettre de l'ordre", prompt: "Je me disperse, par quoi commencer ?" },
    ],
  };
}

function allDoneResponse(
  intent: ConversationIntent,
  listen: string,
  alt?: CatalogMission
): GigiConversationResponse {
  return {
    intent,
    intentLabel: INTENT_LABELS[intent],
    listen,
    needsClarification: false,
    alternative: alt
      ? { projectName: PROJECT_NAMES[alt.projectId], missionTitle: catalogToMission(alt).title }
      : undefined,
    finalMessage: "Le reste peut attendre.",
  };
}

// ---------------------------------------------------------------- main

function buildClosedLoopLifecycleResponse(
  objective: string,
  projectId: string | null
): GigiConversationResponse {
  const hints = buildClosedLoopLifecycleGuidanceHints(objective);
  const summary = generateGlobalLifecycleSummary();
  const actions = loadActionQueueState().actions.filter(
    (a) =>
      ["pending_review", "approved", "copied"].includes(a.status) &&
      (!projectId || a.projectId === projectId)
  );
  const target = actions.find((a) => a.status === "approved") ?? actions[0];
  let actionTitle: string | undefined;
  let healthLabel: string | undefined;
  let statusLabel: string | undefined;

  if (target) {
    const ctx = buildAggregateContextFromAction(target);
    const preview = buildLifecycleRecord({
      title: `Cycle · ${target.preparedAction.title}`,
      source: "action_queue",
      ctx,
    });
    actionTitle = preview.title.replace(/^Cycle · /, "");
    healthLabel = CLOSED_LOOP_LIFECYCLE_HEALTH_LABELS[preview.health];
    statusLabel = CLOSED_LOOP_LIFECYCLE_STATUS_LABELS[preview.status];
  }

  return {
    intent: "closed_loop_lifecycle",
    intentLabel: `${INTENT_LABELS.closed_loop_lifecycle}${actionTitle ? ` · ${actionTitle.slice(0, 36)}` : ""}`,
    listen:
      "Le cycle relie toutes les étapes localement — Gigi n'exécute rien et ne vérifie pas le repo.",
    needsClarification: false,
    priorityProjectName: projectId
      ? PROJECT_NAMES[projectId as keyof typeof PROJECT_NAMES]
      : target?.projectName,
    closedLoopLifecycleSummaryText: summary.summaryText,
    closedLoopLifecycleActionTitle: actionTitle,
    closedLoopLifecycleHealthLabel: healthLabel,
    closedLoopLifecycleStatusLabel: statusLabel,
    closedLoopLifecycleGuidance: hints,
    closedLoopLifecycleBlockedMessage: CLOSED_LOOP_LIFECYCLE_DISCLAIMER,
    finalMessage: target
      ? "Ouvre /actions → Cycle complet pour voir la timeline, les étapes manquantes et la prochaine recommandation."
      : "Ajoute une action à la file sur /actions avant d'ouvrir un cycle.",
  };
}

function buildExecutionReportIntakeResponse(
  objective: string,
  projectId: string | null
): GigiConversationResponse {
  const hints = buildExecutionReportIntakeGuidanceHints(objective);
  const summary = generateGlobalIntakeSummary();
  const actions = loadActionQueueState().actions.filter(
    (a) =>
      ["pending_review", "approved", "copied"].includes(a.status) &&
      (!projectId || a.projectId === projectId)
  );
  const target = actions.find((a) => a.status === "approved") ?? actions[0];
  let actionTitle: string | undefined;

  if (target) {
    actionTitle = target.preparedAction.title;
  }

  return {
    intent: "execution_report_intake",
    intentLabel: `${INTENT_LABELS.execution_report_intake}${actionTitle ? ` · ${actionTitle.slice(0, 36)}` : ""}`,
    listen:
      "Colle le rapport reçu — Gigi le parse localement sans vérifier Git, GitHub ou le repo.",
    needsClarification: false,
    priorityProjectName: projectId
      ? PROJECT_NAMES[projectId as keyof typeof PROJECT_NAMES]
      : target?.projectName,
    executionReportIntakeSummaryText: summary.summaryText,
    executionReportIntakeActionTitle: actionTitle,
    executionReportIntakeDecisionLabel: undefined,
    executionReportIntakeGuidance: hints,
    executionReportIntakeBlockedMessage: EXECUTION_REPORT_INTAKE_DISCLAIMER,
    finalMessage: target
      ? "Ouvre /actions ou le handoff V2.9, colle le rapport, parse-le, puis applique au log manuellement si tu valides."
      : "Ajoute une action à la file sur /actions avant d'importer un rapport.",
  };
}

function buildManualExecutionHandoffResponse(
  objective: string,
  projectId: string | null
): GigiConversationResponse {
  const hints = buildManualExecutionHandoffGuidanceHints(objective);
  const summary = generateGlobalHandoffSummary();
  const actions = loadActionQueueState().actions.filter(
    (a) =>
      ["pending_review", "approved", "copied"].includes(a.status) &&
      (!projectId || a.projectId === projectId)
  );
  const target = actions.find((a) => a.status === "approved") ?? actions[0];
  let actionTitle: string | undefined;
  let targetLabel: string | undefined;

  if (target) {
    const preview = createHandoffFromQueuedActionRecord(target, "cursor");
    actionTitle = preview.title.replace(/^Handoff · /, "");
    targetLabel = MANUAL_EXECUTION_HANDOFF_TARGET_LABELS[preview.target];
  }

  return {
    intent: "manual_execution_handoff",
    intentLabel: `${INTENT_LABELS.manual_execution_handoff}${actionTitle ? ` · ${actionTitle.slice(0, 36)}` : ""}`,
    listen:
      "Le handoff prépare un paquet copiable pour Cursor ou un humain — Gigi n'envoie rien et n'exécute rien.",
    needsClarification: false,
    priorityProjectName: projectId
      ? PROJECT_NAMES[projectId as keyof typeof PROJECT_NAMES]
      : target?.projectName,
    manualExecutionHandoffSummaryText: summary.summaryText,
    manualExecutionHandoffActionTitle: actionTitle,
    manualExecutionHandoffTargetLabel: targetLabel,
    manualExecutionHandoffGuidance: hints,
    manualExecutionHandoffBlockedMessage: MANUAL_EXECUTION_HANDOFF_DISCLAIMER,
    finalMessage: target
      ? "Ouvre /actions, crée le handoff depuis le workspace ou la carte action, puis copie toi-même le prompt."
      : "Ajoute une action à la file sur /actions avant de créer un handoff.",
  };
}

function buildSafeActionWorkspaceResponse(
  objective: string,
  projectId: string | null
): GigiConversationResponse {
  const hints = buildSafeActionWorkspaceGuidanceHints(objective);
  const summary = generateGlobalWorkspaceSummary();
  const actions = loadActionQueueState().actions.filter(
    (a) =>
      ["pending_review", "approved", "copied"].includes(a.status) &&
      (!projectId || a.projectId === projectId)
  );
  const target = actions.find((a) => a.status === "approved") ?? actions[0];
  let actionTitle: string | undefined;
  let readinessLabel: string | undefined;

  if (target) {
    const existing = getSafeActionWorkspaceByActionId(target.id);
    const ctx = aggregateContextFromQueuedAction(target);
    const workspace = createWorkspaceFromContext(ctx, existing);
    actionTitle = workspace.title.replace(/^Workspace · /, "");
    readinessLabel = SAFE_ACTION_WORKSPACE_READINESS_LABELS[workspace.readiness];
  }

  return {
    intent: "safe_action_workspace",
    intentLabel: `${INTENT_LABELS.safe_action_workspace}${actionTitle ? ` · ${actionTitle.slice(0, 36)}` : ""}`,
    listen:
      "Le Safe Action Workspace agrège plan, log, review et checklist — Gigi ne lance aucune commande et ne vérifie pas le repo.",
    needsClarification: false,
    priorityProjectName: projectId
      ? PROJECT_NAMES[projectId as keyof typeof PROJECT_NAMES]
      : target?.projectName,
    safeActionWorkspaceSummaryText: summary.summaryText,
    safeActionWorkspaceActionTitle: actionTitle,
    safeActionWorkspaceReadinessLabel: readinessLabel,
    safeActionWorkspaceGuidance: hints,
    safeActionWorkspaceBlockedMessage: SAFE_ACTION_WORKSPACE_DISCLAIMER,
    finalMessage: target
      ? "Ouvre /actions et clique « Ouvrir workspace » — exécution manuelle uniquement après checklist."
      : "Ajoute d'abord une action à la file sur /actions, puis ouvre le workspace depuis la carte.",
  };
}

function buildMissionPlanBridgeResponse(
  objective: string,
  projectId: string | null
): GigiConversationResponse {
  const hints = buildMissionPlanBridgeGuidanceHints(objective);
  const summary = generateGlobalBridgeSummary();
  const today = getTodayMissionDecision();
  const accepted =
    today && ["accepted", "converted_to_plan"].includes(today.status) ? today : undefined;
  const candidate = accepted ? getAcceptedCandidateFromDecision(accepted) : undefined;
  const bridgeTitle = candidate?.title ?? accepted?.finalUserChoice;

  return {
    intent: "mission_plan_bridge",
    intentLabel: `${INTENT_LABELS.mission_plan_bridge}${bridgeTitle ? ` · ${bridgeTitle.slice(0, 36)}` : ""}`,
    listen:
      "Le bridge mission→plan prépare un plan d'action, une action et un ajout manuel à la file — Gigi n'exécute rien automatiquement.",
    needsClarification: false,
    priorityProjectName: projectId
      ? PROJECT_NAMES[projectId as keyof typeof PROJECT_NAMES]
      : candidate?.projectId
        ? PROJECT_NAMES[candidate.projectId as keyof typeof PROJECT_NAMES]
        : undefined,
    missionPlanBridgeSummaryText: summary.summaryText,
    missionPlanBridgeMissionTitle: bridgeTitle,
    missionPlanBridgeGuidance: hints,
    missionPlanBridgeBlockedMessage: MISSION_PLAN_BRIDGE_DISCLAIMER,
    finalMessage: accepted
      ? "Ouvre / et utilise « Transformer en plan » dans le panneau V2.7 — l'ajout à /actions reste pending_review uniquement."
      : "Accepte d'abord une mission dans le centre de décision V2.6, puis crée le bridge manuellement.",
  };
}

function buildMissionDecisionResponse(
  objective: string,
  projectId: string | null,
  context: ConversationContext
): GigiConversationResponse {
  const hints = buildMissionDecisionGuidanceHints(objective);
  const decision = generateDailyMissionDecision({
    completedMissionIds: context.completedMissionIds,
    currentMissionId: context.currentMissionId,
    currentProjectId: context.currentProjectId ?? projectId ?? undefined,
    projectIdFilter: projectId ?? undefined,
  });
  const summary = generateGlobalDecisionSummary();
  const topTitle = getRecommendedCandidateTitle(decision);

  return {
    intent: "mission_decision",
    intentLabel: `${INTENT_LABELS.mission_decision}${topTitle ? ` · ${topTitle.slice(0, 36)}` : ""}`,
    listen:
      "Voici le centre de décision local — compare, valide ou refuse manuellement. Gigi ne modifie pas ta mission automatiquement.",
    needsClarification: false,
    priorityProjectName: projectId ? PROJECT_NAMES[projectId as keyof typeof PROJECT_NAMES] : undefined,
    missionDecisionSummaryText: decision.recommendationSummary || summary.summaryText,
    missionDecisionTopTitle: topTitle,
    missionDecisionStatusLabel: MISSION_DECISION_STATUS_LABELS[decision.status],
    missionDecisionComparisonText: formatCandidateComparison(decision.candidates.slice(0, 5)),
    missionDecisionGuidance: hints,
    missionDecisionBlockedMessage: MISSION_DECISION_DISCLAIMER,
    finalMessage: "Ouvre / (Mission du jour) pour accepter, refuser ou transformer en plan — sans exécution auto.",
  };
}

function buildMissionFeedbackResponse(
  objective: string,
  projectId: string | null,
  completedMissionIds: string[] = []
): GigiConversationResponse {
  const hints = buildMissionFeedbackGuidanceHints(objective);
  const pool = getDefaultScoreableMissions(projectId ?? undefined);
  if (listHistoryEntries().length > 0) {
    regenerateMissionFeedbackFromHistory(pool);
  }
  const summary = generateGlobalMissionFeedbackSummary(projectId ?? undefined);
  const best = getBestDailyMissionRecommendation(completedMissionIds);

  if (best) {
    const mission = MISSION_CATALOG.find((m) => m.id === best.missionId);
    return {
      intent: "mission_feedback",
      intentLabel: `${INTENT_LABELS.mission_feedback}${mission ? ` · ${mission.title.slice(0, 40)}` : ""}`,
      listen:
        "Voici ce que l'historique local suggère — score indicatif, pas une vérité absolue.",
      needsClarification: false,
      priorityProjectName: mission ? PROJECT_NAMES[mission.projectId] : undefined,
      missionFeedbackSummaryText: summary.summaryText,
      missionFeedbackTopMissionTitle: mission?.title,
      missionFeedbackScoreLabel: `${MISSION_DECISION_LABELS[best.decision]} · ${best.score}/100 · conf. ${best.confidence}%`,
      missionFeedbackGuidance: hints,
      missionFeedbackBlockedMessage: MISSION_FEEDBACK_DISCLAIMER,
      finalMessage: best.reasons[0]
        ? best.reasons[0]
        : "Ouvre la mission du jour ou un projet pour le détail « Pourquoi cette mission ? ».",
    };
  }

  return {
    intent: "mission_feedback",
    intentLabel: INTENT_LABELS.mission_feedback,
    listen:
      "Pas assez d'historique local pour affiner les recommandations — archive des exécutions dans /history d'abord.",
    needsClarification: false,
    missionFeedbackSummaryText: summary.summaryText,
    missionFeedbackGuidance: hints,
    missionFeedbackBlockedMessage: MISSION_FEEDBACK_DISCLAIMER,
    finalMessage: "Les missions du catalogue restent disponibles — le feedback V2.5 s'enrichit avec l'historique V2.4.",
  };
}

function buildHistoryLearningResponse(
  objective: string,
  projectId: string | null
): GigiConversationResponse {
  const hints = buildHistoryLearningGuidanceHints(objective);
  const summary = generateGlobalSummary(projectId ?? undefined);
  const log = findBestLogForReview(projectId);
  const review = log ? getLatestReviewForLog(log.id) : undefined;

  if (summary.totalEntries > 0) {
    return {
      intent: "history_learning",
      intentLabel: `${INTENT_LABELS.history_learning}${projectId ? ` · ${PROJECT_NAMES[projectId as keyof typeof PROJECT_NAMES] ?? projectId}` : ""}`,
      listen: `Tu as ${summary.totalEntries} entrée(s) locale(s) dans la boucle d'apprentissage — je n'ai pas vérifié le repo ni GitHub.`,
      needsClarification: false,
      priorityProjectName: log?.projectName,
      historyLearningSummaryText: summary.summaryText,
      historyLearningGuidance: hints,
      historyLearningBlockedMessage: HISTORY_LEARNING_DISCLAIMER,
      finalMessage:
        summary.topLearnings[0]
          ? `Leçon récente : ${summary.topLearnings[0]} — ouvre /history pour le détail.`
          : "Ouvre /history pour voir signaux, apprentissages et recommandations futures.",
    };
  }

  if (review) {
    return {
      intent: "history_learning",
      intentLabel: INTENT_LABELS.history_learning,
      listen:
        "Tu peux archiver cette review dans l'historique depuis /actions — trace additive, sans supprimer la source.",
      needsClarification: false,
      priorityProjectName: log?.projectName,
      historyLearningGuidance: hints,
      historyLearningBlockedMessage: HISTORY_LEARNING_DISCLAIMER,
      finalMessage: "Review disponible → « Archiver dans l'historique » sous la review dans /actions.",
    };
  }

  return {
    intent: "history_learning",
    intentLabel: INTENT_LABELS.history_learning,
    listen:
      "L'historique d'apprentissage est local et déclaratif — je ne lis pas GitHub, Supabase ni le repo.",
    needsClarification: false,
    historyLearningGuidance: hints,
    historyLearningBlockedMessage: HISTORY_LEARNING_DISCLAIMER,
    finalMessage: "Valide → exécute → journal → review, puis archive dans /history quand tu veux garder une trace.",
  };
}

function buildFollowUpActionResponse(
  objective: string,
  projectId: string | null
): GigiConversationResponse {
  const hints = buildFollowUpGuidanceHints(objective);
  const log = findBestLogForReview(projectId);
  const review = log ? getLatestReviewForLog(log.id) : undefined;
  const existing = review ? getFollowUpProposalsForReview(review.id) : [];

  if (review) {
    return {
      intent: "follow_up_action",
      intentLabel: `${INTENT_LABELS.follow_up_action} · ${log?.projectName ?? "projet"}`,
      listen:
        existing.length > 0
          ? `Tu as ${existing.length} proposition(s) de suivi locale(s) — je ne corrige rien automatiquement.`
          : "Génère les actions de suivi depuis la review dans /actions — ce sont des propositions, pas des exécutions.",
      needsClarification: false,
      priorityProjectName: log?.projectName,
      followUpGuidance: hints,
      followUpBlockedMessage: FOLLOW_UP_DISCLAIMER,
      finalMessage:
        "Ouvre /actions → review → « Actions de suivi ». Ajoute manuellement à la file si tu retiens une proposition.",
    };
  }

  return {
    intent: "follow_up_action",
    intentLabel: INTENT_LABELS.follow_up_action,
    listen:
      "Pour proposer une action de suivi, il faut d'abord un journal et une review dans /actions.",
    needsClarification: false,
    followUpGuidance: hints,
    followUpBlockedMessage: FOLLOW_UP_DISCLAIMER,
    finalMessage: "Valide → exécute → journal → review, puis génère les follow-up actions.",
  };
}

function buildExecutionReviewResponse(
  objective: string,
  projectId: string | null
): GigiConversationResponse {
  const hints = buildReviewGuidanceHints(objective);
  const log = findBestLogForReview(projectId);

  if (log && log.entries.length > 0) {
    const review = createReviewFromLog(log);
    return {
      intent: "execution_review",
      intentLabel: `${INTENT_LABELS.execution_review} · ${log.projectName}`,
      listen:
        "Voici ce que je peux déduire de ton journal manuel — je n'ai pas vérifié le repo, Git ou le build réel.",
      needsClarification: false,
      priorityProjectName: log.projectName,
      executionReviewSummaryText: review.summary,
      executionReviewDecisionLabel: EXECUTION_REVIEW_DECISION_LABELS[review.decision],
      executionReviewGuidance: hints,
      executionReviewBlockedMessage: EXECUTION_REVIEW_DISCLAIMER,
      finalMessage: `Confiance ${review.confidence}% — ouvre /actions pour la review complète et copie le rapport.`,
    };
  }

  return {
    intent: "execution_review",
    intentLabel: INTENT_LABELS.execution_review,
    listen:
      "Je peux analyser ton journal d'exécution — mais seulement si tu as déjà enregistré des entrées dans /actions.",
    needsClarification: false,
    executionReviewGuidance: hints,
    executionReviewBlockedMessage: EXECUTION_REVIEW_DISCLAIMER,
    finalMessage: "Valide une action, prépare l'exécution, puis remplis le suivi manuel avant de demander une review.",
  };
}

function buildExecutionLogResponse(objective: string): GigiConversationResponse {
  const norm = objective.toLowerCase();
  const hints: string[] = [
    "Ouvre /actions et affiche le plan d'exécution de l'action validée.",
    "Section « Suivi manuel » : clique le bouton qui correspond à ton retour.",
  ];

  if (/build/.test(norm)) {
    hints.push("Pour « build OK » ou « build échoué », utilise les boutons Build OK / Build échoué.");
  }
  if (/bloque|bloqué|echoue|échoué|fail/.test(norm)) {
    hints.push("Signale le blocage avec « Signaler blocage » et ajoute une note décrivant le problème.");
  }
  if (/termine|terminé|fait|faite/.test(norm)) {
    hints.push("Quand tout est bon, remplis le rapport final et clique « Terminé manuellement ».");
  }
  if (/cursor/.test(norm)) {
    hints.push("Note ce que Cursor a modifié via « Ajouter une note » — Gigi ne lit pas le diff automatiquement.");
  }
  if (/ui|interface|page/.test(norm)) {
    hints.push("Marque « UI vérifiée » après ton test manuel du parcours.");
  }
  if (/commit/.test(norm)) {
    hints.push("Utilise « Commit manuel » pour noter que tu as commité toi-même.");
  }

  return {
    intent: "execution_log",
    intentLabel: INTENT_LABELS.execution_log,
    listen:
      "Je note ton retour — mais je ne peux pas vérifier automatiquement ce qui s'est passé. Enregistre-le toi-même dans le journal.",
    needsClarification: false,
    executionLogGuidance: hints,
    executionLogBlockedMessage: EXECUTION_LOG_MANUAL_DISCLAIMER,
    finalMessage: EXECUTION_LOG_GUIDANCE_MESSAGE,
  };
}

function buildExecutionPlanResponse(
  projectId: string | null
): GigiConversationResponse {
  const approved = findApprovedQueuedActions(projectId ?? undefined);

  if (approved.length === 0) {
    const projectHint = projectId ? PROJECT_NAMES[projectId] ?? projectId : "ton projet";
    return {
      intent: "execution_plan",
      intentLabel: INTENT_LABELS.execution_plan,
      listen: "Je ne lance rien automatiquement — et je n'ai pas trouvé d'action validée à exécuter.",
      needsClarification: true,
      clarificationQuestion: EXECUTION_NOT_APPROVED_MESSAGE,
      choices: [
        { label: "Ouvrir /actions", prompt: "Gigi, montre-moi la file de validation" },
        {
          label: "Préparer une action · Buildy Clear",
          prompt: "Gigi, prépare le prompt Cursor pour Buildy Clear",
        },
        {
          label: "Plan d'action · Gigi",
          prompt: "Gigi, plan d'action pour améliorer Gigi OS",
        },
      ],
      executionPlanBlockedMessage: `Aucune action validée pour ${projectHint}. Valide d'abord dans /actions.`,
      finalMessage: "Valide l'action, puis redemande le plan d'exécution.",
    };
  }

  const action = approved[0];
  const plan = buildExecutionPlanFromQueuedAction(action);
  saveExecutionPlan(plan);
  const projectName = action.projectName;

  return {
    intent: "execution_plan",
    intentLabel: `${INTENT_LABELS.execution_plan} · ${projectName}`,
    listen: `Voici comment exécuter « ${action.preparedAction.title} » — étape par étape, sans que Gigi lance quoi que ce soit.`,
    needsClarification: false,
    priorityProjectName: projectName,
    missionTitle: action.preparedAction.title,
    why: action.preparedAction.summary,
    tasks: plan.steps.slice(0, 3).map((s) => s.title),
    executionPlan: plan,
    executionPlanBlockedMessage: EXECUTION_DRY_RUN_MESSAGE,
    finalMessage:
      "Exécute manuellement — commandes à copier-coller, jamais lancées par Gigi. Rapporte le résultat quand c'est fait.",
  };
}

function buildPreparedActionResponse(
  projectId: string,
  type: import("@/modules/preparedActions/types").PreparedActionType | null
): GigiConversationResponse {
  const projectName = PROJECT_NAMES[projectId] ?? projectId;
  const resolvedType = type ?? undefined;
  const plan = buildActionPlanForProject(projectId, projectName);
  const prepared = buildPreparedActionForProject(projectId, projectName, resolvedType ?? null, {
    plan: plan ?? undefined,
    sourceActionId: plan?.possibleFutureActions[0]?.id,
  });

  const typeLabel = PREPARED_ACTION_TYPE_LABELS[prepared.type];

  return {
    intent: "prepared_action",
    intentLabel: `${INTENT_LABELS.prepared_action} · ${typeLabel} · ${projectName}`,
    listen: `Voici l'action préparée — ${typeLabel.toLowerCase()} prêt à copier-coller, sans exécution.`,
    needsClarification: false,
    priorityProjectName: projectName,
    missionTitle: prepared.target ?? prepared.title,
    why: prepared.summary,
    preparedAction: prepared,
    preparedActionBlockedMessage: PREPARED_ACTION_DRY_RUN_MESSAGE,
    actionPlan: plan ?? undefined,
    finalMessage: "Valide, copie, puis exécute toi-même — Gigi ne lance rien.",
  };
}

function buildActionPlanResponse(
  objective: string,
  projectId: string,
  missionId: string | null
): GigiConversationResponse {
  const projectName = PROJECT_NAMES[projectId] ?? projectId;
  const plan = buildActionPlanForProject(projectId, projectName, missionId ?? undefined);

  if (!plan) {
    return {
      intent: "action_plan",
      intentLabel: INTENT_LABELS.action_plan,
      listen: `Je n'ai pas trouvé de plan pour ${projectName}.`,
      needsClarification: true,
      clarificationQuestion: "Quelle mission veux-tu transformer en plan d'action ?",
      choices: [
        { label: "Buildy Clear", prompt: "Gigi, avance Buildy Clear" },
        { label: "Buildy Crafts", prompt: "Gigi, prépare un plan pour Buildy Crafts" },
        { label: "Gigi", prompt: "Gigi, plan d'action pour Gigi OS" },
      ],
    };
  }

  return {
    intent: "action_plan",
    intentLabel: `${INTENT_LABELS.action_plan} · ${projectName}`,
    listen: `Voici comment exécuter « ${plan.title} » — étape par étape, sans rien lancer automatiquement.`,
    needsClarification: false,
    priorityProjectName: projectName,
    missionTitle: plan.title,
    why: plan.whyNow,
    tasks: getActionPlanStepsAsTasks(plan),
    actionPlan: plan,
    actionPlanBlockedMessage: ACTION_PLAN_DRY_RUN_MESSAGE,
    finalMessage: "Une action. Aucun bruit. Valide chaque étape avant d'exécuter.",
  };
}

export function askGigi(
  objective: string,
  _projects: unknown,
  context: ConversationContext = {}
): GigiConversationResponse {
  const missionLearningIntent = detectMissionLearningIntent(objective);
  if (missionLearningIntent.isMissionLearning) {
    const projectId =
      context.currentProjectId ?? detectProject(normalize(objective)) ?? undefined;
    return buildMissionLearningConversationResponse({
      projectId,
      completedMissionIds: context.completedMissionIds,
    });
  }

  const projectsCommandIntent = detectProjectsCommandIntent(
    objective,
    context.projects ?? []
  );
  if (projectsCommandIntent.isProjectsCommand) {
    return buildProjectsCommandConversationResponse({
      projects: context.projects ?? [],
      missionProjectId: context.currentMission?.projectId ?? context.currentProjectId,
      missionTitle: context.currentMission?.title,
    });
  }

  const manualBridgeIntent = detectManualBridgeIntent(objective);
  if (manualBridgeIntent.isManualBridge) {
    return buildManualBridgeConversationResponse(objective);
  }

  const executionReadinessIntent = detectExecutionReadinessIntent(objective);
  if (executionReadinessIntent.isExecutionReadiness) {
    return buildExecutionReadinessConversationResponse(objective);
  }

  const missionOSIntent = detectMissionOSIntent(objective);
  if (missionOSIntent.isMissionOS) {
    const mission = context.currentMission;
    return buildMissionOSConversationResponse(objective, {
      missionTitle: mission?.title ?? "Mission du jour",
      missionSummary: mission?.reason,
      missionId: mission?.id ?? context.currentMissionId,
      projectId: mission?.projectId ?? context.currentProjectId,
      projectName: mission?.projectName,
      missionStatus: mission?.status,
      missionConfidence: mission?.confidence,
      missionImpact: mission?.expectedImpact,
    });
  }

  const closedLoopLifecycleIntent = detectClosedLoopLifecycleIntent(objective);
  if (closedLoopLifecycleIntent.isClosedLoopLifecycle) {
    const projectId =
      closedLoopLifecycleIntent.projectId ??
      context.currentProjectId ??
      detectProject(normalize(objective));
    return buildClosedLoopLifecycleResponse(objective, projectId);
  }

  const executionReportIntakeIntent = detectExecutionReportIntakeIntent(objective);
  if (executionReportIntakeIntent.isExecutionReportIntake) {
    const projectId =
      executionReportIntakeIntent.projectId ??
      context.currentProjectId ??
      detectProject(normalize(objective));
    return buildExecutionReportIntakeResponse(objective, projectId);
  }

  const manualExecutionHandoffIntent = detectManualExecutionHandoffIntent(objective);
  if (manualExecutionHandoffIntent.isManualExecutionHandoff) {
    const projectId =
      manualExecutionHandoffIntent.projectId ??
      context.currentProjectId ??
      detectProject(normalize(objective));
    return buildManualExecutionHandoffResponse(objective, projectId);
  }

  const safeActionWorkspaceIntent = detectSafeActionWorkspaceIntent(objective);
  if (safeActionWorkspaceIntent.isSafeActionWorkspace) {
    const projectId =
      safeActionWorkspaceIntent.projectId ??
      context.currentProjectId ??
      detectProject(normalize(objective));
    return buildSafeActionWorkspaceResponse(objective, projectId);
  }

  const missionPlanBridgeIntent = detectMissionPlanBridgeIntent(objective);
  if (missionPlanBridgeIntent.isMissionPlanBridge) {
    const projectId =
      missionPlanBridgeIntent.projectId ??
      context.currentProjectId ??
      detectProject(normalize(objective));
    return buildMissionPlanBridgeResponse(objective, projectId);
  }

  const missionDecisionIntent = detectMissionDecisionIntent(objective);
  if (missionDecisionIntent.isMissionDecision) {
    const projectId =
      missionDecisionIntent.projectId ??
      context.currentProjectId ??
      detectProject(normalize(objective));
    return buildMissionDecisionResponse(objective, projectId, context);
  }

  const missionFeedbackIntent = detectMissionFeedbackIntent(objective);
  if (missionFeedbackIntent.isMissionFeedback) {
    const projectId =
      missionFeedbackIntent.projectId ??
      context.currentProjectId ??
      detectProject(normalize(objective));
    return buildMissionFeedbackResponse(
      objective,
      projectId,
      context.completedMissionIds ?? []
    );
  }

  const historyIntent = detectHistoryLearningIntent(objective);
  if (historyIntent.isHistoryLearning) {
    const projectId =
      historyIntent.projectId ??
      context.currentProjectId ??
      detectProject(normalize(objective));
    return buildHistoryLearningResponse(objective, projectId);
  }

  const followUpIntent = detectFollowUpActionIntent(objective);
  if (followUpIntent.isFollowUpAction) {
    const projectId =
      followUpIntent.projectId ??
      context.currentProjectId ??
      detectProject(normalize(objective));
    return buildFollowUpActionResponse(objective, projectId);
  }

  const reviewIntent = detectExecutionReviewIntent(objective);
  if (reviewIntent.isExecutionReview) {
    const projectId =
      reviewIntent.projectId ??
      context.currentProjectId ??
      detectProject(normalize(objective));
    return buildExecutionReviewResponse(objective, projectId);
  }

  const executionLogIntent = detectExecutionLogIntent(objective);
  if (executionLogIntent.isExecutionLog) {
    return buildExecutionLogResponse(objective);
  }

  const executionIntent = detectExecutionPlanIntent(objective);
  if (executionIntent.isExecutionPlan) {
    const projectId =
      executionIntent.projectId ??
      context.currentProjectId ??
      detectProject(normalize(objective));
    return buildExecutionPlanResponse(projectId);
  }

  const preparedIntent = detectPreparedActionIntent(objective);
  if (preparedIntent.isPreparedAction) {
    const projectId =
      preparedIntent.projectId ??
      context.currentProjectId ??
      detectProject(normalize(objective));
    if (projectId) {
      return buildPreparedActionResponse(projectId, preparedIntent.type);
    }
    return {
      intent: "prepared_action",
      intentLabel: INTENT_LABELS.prepared_action,
      listen: "Tu veux une action préparée — dis-moi sur quel projet et quel type.",
      needsClarification: true,
      clarificationQuestion: "Quelle action préparer ?",
      choices: [
        { label: "Prompt Cursor · Buildy Clear", prompt: "Gigi, prépare le prompt Cursor pour Buildy Clear" },
        { label: "Checklist · Buildy Crafts", prompt: "Gigi, fais-moi une checklist pour Buildy Crafts" },
        { label: "Branche · Gigi OS", prompt: "Gigi, prépare la branche pour Gigi OS" },
      ],
    };
  }

  const planIntent = detectActionPlanIntent(objective);
  if (planIntent.isActionPlan) {
    const projectId =
      planIntent.projectId ??
      context.currentProjectId ??
      detectProject(normalize(objective));
    if (projectId) {
      return buildActionPlanResponse(objective, projectId, planIntent.missionId);
    }
    return {
      intent: "action_plan",
      intentLabel: INTENT_LABELS.action_plan,
      listen: "Tu veux un plan d'action — dis-moi sur quel projet.",
      needsClarification: true,
      clarificationQuestion: "Sur quel projet veux-tu un plan d'action concret ?",
      choices: [
        { label: "Buildy Clear", prompt: "Gigi, avance Buildy Clear" },
        { label: "Buildy Crafts", prompt: "Gigi, prépare un plan pour Buildy Crafts" },
        { label: "Gigi OS", prompt: "Gigi, plan d'action pour améliorer Gigi" },
      ],
    };
  }

  const detected = detectIntent(objective);
  const { intent } = detected;

  if (intent === "unclear") {
    return clarificationResponse();
  }

  // Exclude every completed mission — they must never be recommended again.
  const completed = new Set(context.completedMissionIds ?? []);
  const pool = MISSION_CATALOG.filter((m) => !completed.has(m.id));
  const hasCompleted = completed.size > 0;

  let selected: CatalogMission | undefined;
  let sameProjectAlternative = false;
  let warning: string | undefined;
  let listen: string;
  let intentLabel: string = INTENT_LABELS[intent];

  if (intent === "project_specific" && detected.projectId) {
    const pid = detected.projectId;
    const available = projectMissions(pool, pid);
    intentLabel = `${INTENT_LABELS.project_specific} : ${PROJECT_NAMES[pid]}`;

    if (available.length === 0) {
      const globalAlt = activeMissions(pool)[0];
      return allDoneResponse(
        "project_specific",
        `Toutes les missions importantes de ${PROJECT_NAMES[pid]} sont terminées pour l'instant.`,
        globalAlt
      );
    }

    selected = available[0];
    sameProjectAlternative = true;

    const status = PROJECT_STATUS[pid];
    if (status === "paused") {
      listen = `Ok, je reste sur ${PROJECT_NAMES[pid]}. C'est en pause, donc je choisis une mission courte et claire.`;
      warning = "Mais si ton objectif est le revenu court terme, Buildy Clear reste plus urgent.";
    } else if (status === "future") {
      listen = `Ok, je reste sur ${PROJECT_NAMES[pid]}. C'est un projet pour plus tard, donc on capture juste l'intention.`;
      warning = "Si tu cherches du concret aujourd'hui, Buildy Clear avance plus vite.";
    } else {
      listen = `Ok, je reste sur ${PROJECT_NAMES[pid]}.`;
      if (pid !== "buildy-clear") {
        warning =
          "Je garde Buildy Clear en tête pour le revenu, mais je reste sur ce que tu m'as demandé.";
      }
    }
  } else if (intent === "revenue") {
    selected = missionsWithAnyTag(pool, ["revenue"])[0];
    listen = "Je vois que tu cherches surtout du revenu rapide.";
  } else if (intent === "creative") {
    selected = missionsWithAnyTag(pool, ["creative", "video", "content", "story", "game"])[0];
    listen = "Envie de créer un peu. Cadrons ça pour que ce soit utile.";
    if (selected && selected.projectId !== "buildy-clear") {
      warning =
        "Sympa à faire — mais garde en tête que ce n'est pas ce qui rapproche le plus du revenu.";
    }
  } else if (intent === "maintenance") {
    selected = missionsWithAnyTag(pool, ["maintenance", "audit", "docs"])[0];
    listen = "Ok, on remet un peu d'ordre.";
  } else if (intent === "alternative") {
    const excludeId = context.excludeMissionId ?? context.currentMissionId;
    const excludeProject =
      detected.negatedProjectId ?? context.excludeProjectId ?? context.currentProjectId;
    const withinProject = detected.projectId;

    let altPool = [...pool].sort(byScore).filter((m) => m.id !== excludeId);
    if (withinProject) {
      altPool = altPool.filter((m) => m.projectId === withinProject);
    } else if (excludeProject) {
      const diff = altPool.filter((m) => m.projectId !== excludeProject);
      if (diff.length) altPool = diff;
    }
    const active = altPool.filter((m) => m.status === "active");
    selected = active[0] ?? altPool[0];
    listen = "Ok, autre chose. Voilà une option différente, crédible.";
    intentLabel = withinProject
      ? `${INTENT_LABELS.alternative} · ${PROJECT_NAMES[withinProject]}`
      : INTENT_LABELS.alternative;
  } else if (intent === "focus") {
    selected = activeMissions(pool)[0];
    listen = hasCompleted
      ? "Ta dernière mission est terminée. Voici la suite la plus claire."
      : "Tu n'as pas besoin de tout avancer aujourd'hui.";
  } else if (intent === "daily_review") {
    selected = activeMissions(pool)[0];
    listen = "Voici ta revue du jour. Une mission claire suffit.";
    intentLabel = INTENT_LABELS.daily_review;
  } else {
    // general
    selected = activeMissions(pool)[0];
    listen = hasCompleted
      ? "La précédente est terminée. Voici le prochain mouvement le plus clair."
      : "J'ai regardé tes projets. Voici le mouvement le plus clair.";
  }

  // Nothing left to recommend anywhere.
  if (!selected) {
    return allDoneResponse(
      intent,
      "Tes missions importantes sont terminées pour aujourd'hui. Tu peux souffler."
    );
  }

  const alt = secondOption(pool, selected, sameProjectAlternative);
  const mission = catalogToMission(selected);

  const finalMessageByIntent: Record<ConversationIntent, string> = {
    project_specific: `Reste dans ${PROJECT_NAMES[selected.projectId]}. Une mission claire suffit.`,
    revenue: "Une action. Aucun bruit. Démarre ici.",
    focus: "Le reste peut attendre.",
    daily_review: "Le reste peut attendre — concentre-toi sur cette mission.",
    alternative: "Tu peux avancer sans tout rouvrir.",
    creative: "Amuse-toi, mais garde le cap.",
    maintenance: "Un peu d'ordre, puis on repart.",
    general: "Le reste peut attendre.",
    unclear: "",
    action_plan: "Valide chaque étape avant d'exécuter.",
    prepared_action: "Valide, copie, puis exécute toi-même.",
    execution_plan: "Exécute manuellement — Gigi ne lance rien.",
    execution_log: "Enregistre ton retour dans /actions — Gigi ne vérifie pas automatiquement.",
    execution_review: "Review basée sur les logs manuels — ouvre /actions pour le détail.",
    follow_up_action: "Propositions locales — ajoute manuellement à la file si tu retiens.",
    history_learning: "Historique local uniquement — archive manuellement depuis /actions ou /history.",
    mission_feedback: "Recommandations basées sur l'historique V2.4 — ouvre / ou /projects pour le détail.",
    mission_decision: "Décision locale — ouvre / pour comparer et valider manuellement.",
    mission_plan_bridge: "Bridge local — transforme une mission acceptée en plan sans exécution auto.",
    safe_action_workspace: "Workspace local — ouvre /actions pour préparer l'exécution manuelle.",
    manual_execution_handoff: "Handoff local — copie toi-même le paquet vers Cursor ou un humain.",
    execution_report_intake: "Intake local — colle le rapport toi-même, Gigi ne vérifie pas le repo.",
    closed_loop_lifecycle: "Cycle local — agrégation déclarative, fermeture manuelle uniquement.",
    mission_os: "Pilotage V3 — une mission, une prochaine action, tout reste manuel.",
    projects_command:
      "Centre projets V3.6 — ouvre /projects pour voir priorités, missions et actions par projet.",
    execution_readiness:
      "V4.1 — centre de permissions local ; ouvre /permissions ou /actions pour valider une demande (simulation uniquement).",
  };

  return {
    intent,
    intentLabel,
    listen,
    needsClarification: false,
    priorityProjectName: PROJECT_NAMES[selected.projectId],
    mission,
    missionTitle: mission.title,
    why: selected.reason,
    tasks: deriveTasks(selected),
    warning,
    alternative: alt
      ? { projectName: PROJECT_NAMES[alt.projectId], missionTitle: catalogToMission(alt).title }
      : undefined,
    notNow: buildNotNow(selected.projectId, intent),
    finalMessage: finalMessageByIntent[intent],
  };
}
