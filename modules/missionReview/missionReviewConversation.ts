import type { GigiConversationResponse } from "@/modules/conversation/conversationTypes";
import { getActiveDailyPriorityMission } from "@/modules/missionComposer";
import { MISSION_REVIEW_V48_DISCLAIMER } from "./missionReviewPolicy";
import { generateMissionReviewSummary } from "./missionReviewSummary";
import { getLatestMissionReview } from "./missionReviewBuilder";

function normalize(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

const MISSION_REVIEW_KEYWORDS = [
  "revue de mission",
  "revue mission",
  "bilan de la mission",
  "bilan mission",
  "qu est ce que j ai fait",
  "qu'est-ce que j'ai fait",
  "mission est bloquee",
  "mission est bloquée",
  "ma mission est bloquee",
  "je continue ou je change",
  "prochaine decision",
  "prochaine décision",
  "j ai termine la mission",
  "j'ai terminé la mission",
  "marque la mission",
  "fais le point",
  "faire le point",
  "aide-moi a faire le point",
  "mission-review",
  "mission review",
  "reflexion d execution",
  "réflexion d'exécution",
];

function isMoreSpecificIntent(norm: string): boolean {
  if (/revue locale|local review|resultat colle/.test(norm) && !/mission/.test(norm)) return true;
  if (/mission du jour|composer/.test(norm) && !/revue|bilan|point/.test(norm)) return false;
  return false;
}

export interface MissionReviewIntent {
  isMissionReview: boolean;
}

export function detectMissionReviewIntent(objective: string): MissionReviewIntent {
  const norm = normalize(objective);
  if (isMoreSpecificIntent(norm)) return { isMissionReview: false };
  const isMissionReview = MISSION_REVIEW_KEYWORDS.some((k) => norm.includes(normalize(k)));
  return { isMissionReview };
}

export function buildMissionReviewConversationResponse(
  objective: string
): GigiConversationResponse {
  const norm = normalize(objective);
  const summary = generateMissionReviewSummary();
  const daily = getActiveDailyPriorityMission();
  const latest = getLatestMissionReview();
  const disclaimer = MISSION_REVIEW_V48_DISCLAIMER;

  const routeHints = [
    "/mission-review — revue de mission locale",
    "/mission-composer — mission du jour",
    "/guided-actions — parcours guidé V4.6",
    "/actions — flux d'action",
  ];

  if (/bloque|bloquée|block/.test(norm)) {
    return {
      intent: "execution_readiness",
      intentLabel: "Mission bloquée · V4.8",
      listen:
        "Décris le blocage dans une revue locale — Gigi prépare une réflexion, tu choisis la décision suivante. Aucune vérification réelle.",
      needsClarification: false,
      executionReadinessSummaryText: summary.summaryText,
      executionReadinessGuidance: routeHints,
      executionReadinessBlockedMessage: disclaimer,
      finalMessage: "Ouvre /mission-review et note tes blocages.",
    };
  }

  if (/termine|terminée|fini/.test(norm)) {
    return {
      intent: "execution_readiness",
      intentLabel: "Mission terminée · V4.8",
      listen:
        "Marque la mission comme terminée par toi — déclaration locale uniquement. Gigi ne vérifie rien réellement.",
      needsClarification: false,
      executionReadinessSummaryText: summary.summaryText,
      executionReadinessGuidance: routeHints,
      executionReadinessBlockedMessage: disclaimer,
      finalMessage: "Ouvre /mission-review → « Marquer terminée (humain) ».",
    };
  }

  if (!daily && !latest) {
    return {
      intent: "execution_readiness",
      intentLabel: "Revue mission · V4.8",
      listen:
        "Pas de mission du jour active — compose d'abord une mission sur /mission-composer, puis reviens pour la revue.",
      needsClarification: false,
      executionReadinessSummaryText: summary.summaryText,
      executionReadinessGuidance: ["/mission-composer — composer la mission du jour", ...routeHints],
      executionReadinessBlockedMessage: disclaimer,
      finalMessage: "Ouvre /mission-composer pour choisir ta mission prioritaire.",
    };
  }

  return {
    intent: "execution_readiness",
    intentLabel: "Revue de mission · V4.8",
    listen:
      "Aegis peut faire une revue locale : tu décris ce qui a été fait, Gigi prépare une réflexion et une recommandation — tu valides la décision suivante.",
    needsClarification: false,
    executionReadinessSummaryText: summary.summaryText,
    executionReadinessGuidance: [
      ...routeHints,
      daily ? `Mission du jour : « ${daily.title} »` : "Aucune mission active",
      latest ? `Dernière revue : ${latest.recommendedNextAction}` : "Aucune revue encore",
    ],
    executionReadinessBlockedMessage: disclaimer,
    finalMessage: "Ouvre /mission-review pour faire le bilan de ta mission.",
  };
}
