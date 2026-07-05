import type { GigiConversationResponse } from "@/modules/conversation/conversationTypes";
import { loadActionQueueState } from "@/modules/actionQueue/actionQueueStore";
import { buildActionFlowViewModel } from "@/modules/missionOS/missionOSActionFlowViewModel";
import {
  createReadinessRequestFromAction,
  inferCapabilitiesFromPreparedType,
} from "./executionReadinessService";
import {
  EXECUTION_CAPABILITY_LABELS,
  EXECUTION_RISK_LABELS,
  EXECUTION_PERMISSION_STATUS_LABELS,
  formatExecutionReadinessForCopy,
} from "./executionReadinessFormatter";
import {
  buildExecutionReadinessGuidanceHints,
  generateGlobalExecutionReadinessSummary,
} from "./executionReadinessSummary";
import { listActiveExecutionReadinessRequests } from "./executionReadinessStore";
import type { ExecutionReadinessIntent } from "./types";
import {
  EXECUTION_READINESS_DISCLAIMER,
  EXECUTION_READINESS_V4_TAGLINE,
} from "./types";
import { assessRiskLevel, riskRationale } from "./executionReadinessRisk";
import { policySafetyNotes } from "./executionReadinessPolicy";

function normalize(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

function detectProjectId(norm: string): string | null {
  if (/buildy ?crafts|(^|\W)crafts(\W|$)/.test(norm)) return "buildy-crafts";
  if (/buildy ?clear|(^|\W)clear(\W|$)/.test(norm)) return "buildy-clear";
  if (/linko/.test(norm)) return "linko";
  if (/gigi ?os|gigios|(^|\W)gigi(\W|$)/.test(norm)) return "gigi-os";
  return null;
}

const EXECUTION_READINESS_KEYWORDS = [
  "gigi fais le",
  "gigi fais-le",
  "tu peux le faire",
  "tu peux le faire ?",
  "execute",
  "exécute",
  "lance l action",
  "lance l'action",
  "autorise l execution",
  "autorise l'exécution",
  "prepare l execution",
  "prépare l'exécution",
  "preparation execution",
  "préparation exécution",
  "execution controlee",
  "exécution contrôlée",
  "execution readiness",
  "quels risques",
  "est ce dangereux",
  "est-ce dangereux",
  "tu as le droit",
  "qu est ce que tu peux faire tout seul",
  "qu'est-ce que tu peux faire tout seul",
  "permission d execution",
  "permission d'exécution",
  "dry run execution",
  "demande le droit d agir",
  "demande le droit d'agir",
  "fais le pour moi",
  "fais-le pour moi",
];

export function detectExecutionReadinessIntent(objective: string): ExecutionReadinessIntent {
  const norm = normalize(objective);
  const isExecutionReadiness = EXECUTION_READINESS_KEYWORDS.some((k) =>
    norm.includes(normalize(k))
  );
  return { isExecutionReadiness, projectId: detectProjectId(norm) };
}

export function buildExecutionReadinessConversationResponse(
  objective: string
): GigiConversationResponse {
  const hints = buildExecutionReadinessGuidanceHints(objective);
  const summary = generateGlobalExecutionReadinessSummary();
  const flow = buildActionFlowViewModel(loadActionQueueState().actions);
  const norm = normalize(objective);

  const wantsPrepare =
    /prepare|prépare|autorise|permission|readiness|demande/.test(norm) &&
    !/risque|dangereux|droit|seul/.test(norm);

  if (wantsPrepare && flow.primaryActionId) {
    const action = loadActionQueueState().actions.find((a) => a.id === flow.primaryActionId);
    if (action) {
      const request = createReadinessRequestFromAction({
        actionId: action.id,
        actionTitle: action.preparedAction.title,
        actionSummary: action.preparedAction.summary,
        preparedType: action.preparedAction.type,
        projectId: action.projectId,
      });
      return {
        intent: "execution_readiness",
        intentLabel: "Préparation exécution · Gigi V4",
        listen:
          "En V4.0 je ne peux pas exécuter réellement. J'ai préparé une demande d'autorisation locale — dry-run, périmètre, risques et rollback.",
        needsClarification: false,
        priorityProjectName: action.projectName,
        executionReadinessSummaryText: summary.summaryText,
        executionReadinessRequestTitle: request.title,
        executionReadinessRiskLabel: EXECUTION_RISK_LABELS[request.riskLevel],
        executionReadinessStatusLabel:
          EXECUTION_PERMISSION_STATUS_LABELS[request.permissionStatus],
        executionReadinessCapabilitiesText: request.requestedCapabilities
          .map((c) => EXECUTION_CAPABILITY_LABELS[c])
          .join(" · "),
        executionReadinessCopyText: formatExecutionReadinessForCopy(request),
        executionReadinessGuidance: hints,
        executionReadinessBlockedMessage: EXECUTION_READINESS_DISCLAIMER,
        finalMessage: `Ouvre /actions pour valider la demande « ${request.title.replace(/^Readiness · /, "")} » — rien ne sera lancé automatiquement.`,
      };
    }
  }

  if (/risque|dangereux|danger/.test(norm)) {
    const caps = flow.primaryActionId
      ? (() => {
          const action = loadActionQueueState().actions.find(
            (a) => a.id === flow.primaryActionId
          );
          return action
            ? inferCapabilitiesFromPreparedType(action.preparedAction.type)
            : (["documentation_only", "local_only"] as const);
        })()
      : (["documentation_only", "local_only"] as const);
    const level = assessRiskLevel([...caps]);
    const rationale = riskRationale([...caps], level);
    return {
      intent: "execution_readiness",
      intentLabel: "Risques · Gigi V4",
      listen:
        "Voici comment j'évalue le risque en V4.0 — simulation et préparation uniquement, aucune exécution réelle.",
      needsClarification: false,
      executionReadinessSummaryText: summary.summaryText,
      executionReadinessRiskLabel: EXECUTION_RISK_LABELS[level],
      executionReadinessGuidance: [...hints, ...rationale],
      executionReadinessBlockedMessage: EXECUTION_READINESS_DISCLAIMER,
      warning: rationale[0],
      finalMessage: EXECUTION_READINESS_V4_TAGLINE,
    };
  }

  if (/droit|seul|peux faire|capable/.test(norm)) {
    return {
      intent: "execution_readiness",
      intentLabel: "Permissions · Gigi V4",
      listen:
        "En V4.0 je ne peux pas agir seul. Je peux préparer une demande, expliquer les risques, définir le périmètre et le rollback — tu dois valider.",
      needsClarification: false,
      executionReadinessSummaryText: summary.summaryText,
      executionReadinessGuidance: [
        ...hints,
        ...policySafetyNotes(),
        "Capacités préparables : documentation, local, brouillons simulés.",
        "Capacités bloquées en V4.0 : shell réel, GitHub réel, n8n, API, email/calendar réels.",
      ],
      executionReadinessBlockedMessage: EXECUTION_READINESS_DISCLAIMER,
      finalMessage:
        "L'exécution réelle viendra plus tard, connecteur par connecteur, avec validation forte à chaque étape.",
    };
  }

  const active = listActiveExecutionReadinessRequests(3);
  if (active.length > 0) {
    const top = active[0];
    return {
      intent: "execution_readiness",
      intentLabel: "Préparation exécution · Gigi V4",
      listen: `${active.length} demande(s) locale(s) — je ne lance rien sans ta validation explicite.`,
      needsClarification: false,
      executionReadinessSummaryText: summary.summaryText,
      executionReadinessRequestTitle: top.title,
      executionReadinessRiskLabel: EXECUTION_RISK_LABELS[top.riskLevel],
      executionReadinessStatusLabel: EXECUTION_PERMISSION_STATUS_LABELS[top.permissionStatus],
      executionReadinessGuidance: hints,
      executionReadinessBlockedMessage: EXECUTION_READINESS_DISCLAIMER,
      finalMessage: "Ouvre /actions pour gérer les demandes V4.0.",
    };
  }

  return {
    intent: "execution_readiness",
    intentLabel: "Préparation exécution · Gigi V4",
    listen:
      "Tu demandes si je peux agir — en V4.0 la réponse est non pour l'exécution réelle, oui pour préparer une demande contrôlée.",
    needsClarification: false,
    executionReadinessSummaryText: summary.summaryText,
    executionReadinessGuidance: hints,
    executionReadinessBlockedMessage: EXECUTION_READINESS_DISCLAIMER,
    finalMessage: flow.primaryActionId
      ? "Dis « prépare l'exécution » avec une action dominante sur /actions pour créer une demande locale."
      : "Valide d'abord une action sur /actions, puis demande « prépare l'exécution ».",
  };
}
