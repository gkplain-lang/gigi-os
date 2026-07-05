import type { GigiConversationResponse } from "@/modules/conversation/conversationTypes";
import { MISSION_COMPOSER_V47_DISCLAIMER } from "./missionComposerPolicy";
import { generateMissionComposerSummary } from "./missionComposerSummary";
import { getActiveDailyPriorityMission, listActiveMissionCandidates } from "./missionComposerBuilder";

function normalize(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

const MISSION_COMPOSER_KEYWORDS = [
  "mission du jour",
  "choisis une mission",
  "choisir une mission",
  "mission prioritaire",
  "mission recommandee",
  "mission recommandée",
  "avancer sans dispersion",
  "quelle mission pour ce projet",
  "transforme cette mission",
  "transformer cette mission",
  "compose la mission",
  "composer la mission",
  "je dois faire quoi",
  "quelle est ma mission",
  "focus du jour",
  "mission composer",
  "mission-composer",
  "reduire la dispersion",
  "réduire la dispersion",
  "une seule mission",
];

function isMoreSpecificIntent(norm: string): boolean {
  if (/parcours guide|action guidee|guided action/.test(norm) && !/mission du jour|composer/.test(norm)) {
    return true;
  }
  if (/pack.*commande|command pack/.test(norm)) return true;
  if (/revue locale|local review/.test(norm)) return true;
  return false;
}

export interface MissionComposerIntent {
  isMissionComposer: boolean;
}

export function detectMissionComposerIntent(objective: string): MissionComposerIntent {
  const norm = normalize(objective);
  if (isMoreSpecificIntent(norm)) return { isMissionComposer: false };
  const isMissionComposer = MISSION_COMPOSER_KEYWORDS.some((k) => norm.includes(normalize(k)));
  return { isMissionComposer };
}

export function buildMissionComposerConversationResponse(
  objective: string
): GigiConversationResponse {
  const norm = normalize(objective);
  const summary = generateMissionComposerSummary();
  const daily = getActiveDailyPriorityMission();
  const candidates = listActiveMissionCandidates(3);
  const disclaimer = MISSION_COMPOSER_V47_DISCLAIMER;

  const routeHints = [
    "/mission-composer — composer la mission du jour",
    "/guided-actions — transformer en parcours guidé V4.6",
    "/projects — missions possibles par projet",
    "/actions — flux d'action local",
  ];

  if (/transforme|parcours|guide/.test(norm)) {
    return {
      intent: "execution_readiness",
      intentLabel: "Mission → parcours guidé · V4.7",
      listen:
        "Tu peux transformer ta mission du jour en parcours guidé local V4.6 — Gigi prépare, tu valides chaque étape. Aucune exécution réelle.",
      needsClarification: false,
      executionReadinessSummaryText: summary.summaryText,
      executionReadinessGuidance: [
        ...routeHints,
        daily?.linkedGuidedFlowId
          ? `Parcours lié : /guided-actions?flow=${daily.linkedGuidedFlowId}`
          : "Ouvre /mission-composer puis « Transformer en parcours guidé »",
      ],
      executionReadinessBlockedMessage: disclaimer,
      finalMessage: "Ouvre /mission-composer pour convertir ta mission prioritaire.",
    };
  }

  if (/projet|project/.test(norm)) {
    return {
      intent: "execution_readiness",
      intentLabel: "Missions projet · V4.7",
      listen:
        "Chaque projet peut proposer des missions candidates. Tu choisis une seule mission du jour — Gigi t'aide à la structurer, sans rien lancer.",
      needsClarification: false,
      executionReadinessSummaryText: summary.summaryText,
      executionReadinessGuidance: [
        ...routeHints,
        candidates.length > 0
          ? `${candidates.length} candidate(s) active(s) — choisis-en une`
          : "Crée une candidate depuis un projet sur /mission-composer",
      ],
      executionReadinessBlockedMessage: disclaimer,
      finalMessage: "Ouvre /projects ou /mission-composer pour voir les missions possibles.",
    };
  }

  if (daily) {
    return {
      intent: "execution_readiness",
      intentLabel: "Mission du jour · V4.7",
      listen: `Ta mission du jour : « ${daily.title} » (${daily.projectName}). ${daily.selectedReason}`,
      needsClarification: false,
      executionReadinessSummaryText: summary.summaryText,
      executionReadinessGuidance: routeHints,
      executionReadinessBlockedMessage: disclaimer,
      finalMessage: "Continue sur /mission-composer ou transforme en parcours guidé.",
    };
  }

  return {
    intent: "execution_readiness",
    intentLabel: "Composer mission · V4.7",
    listen:
      "Aegis avance mieux quand une seule mission est choisie. Gigi peut proposer des candidates — tu choisis et tu valides. Rien n'est exécuté automatiquement.",
    needsClarification: false,
    executionReadinessSummaryText: summary.summaryText,
    executionReadinessGuidance: [...routeHints, disclaimer],
    executionReadinessBlockedMessage: disclaimer,
    finalMessage: "Ouvre /mission-composer pour choisir ta mission prioritaire du jour.",
  };
}
