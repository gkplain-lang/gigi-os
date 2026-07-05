import type { GigiConversationResponse } from "./conversationTypes";
import { generateMissionComposerSummary, getActiveDailyPriorityMission } from "@/modules/missionComposer";
import { generateMissionReviewSummary } from "@/modules/missionReview";

function normalize(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

const OVERVIEW_KEYWORDS = [
  "resume aegis",
  "résume aegis",
  "resume-moi aegis",
  "c'est quoi aegis",
  "c est quoi aegis",
  "explique aegis",
  "explique-moi aegis",
  "je suis perdu",
  "je me perds",
  "pourquoi autant de module",
  "trop de module",
  "aide-moi a avancer",
  "aide moi a avancer",
  "comment ca marche",
  "comment ça marche",
  "par ou commencer",
  "par où commencer",
];

export interface MVPOverviewIntent {
  isOverview: boolean;
}

export function detectMVPOverviewIntent(objective: string): MVPOverviewIntent {
  const norm = normalize(objective);
  const isOverview = OVERVIEW_KEYWORDS.some((k) => norm.includes(normalize(k)));
  return { isOverview };
}

export function buildMVPOverviewResponse(): GigiConversationResponse {
  const composer = generateMissionComposerSummary();
  const review = generateMissionReviewSummary();
  const daily = getActiveDailyPriorityMission();

  const listen = daily
    ? `Ta mission du jour : « ${daily.title} ». La boucle Aegis est simple : une mission prioritaire, une prochaine action guidée, puis une revue locale pour décider la suite. Gigi prépare, tu valides — rien n'est exécuté automatiquement.`
    : "Aegis reste simple : tu choisis une seule mission prioritaire, tu la transformes en parcours guidé, puis tu fais une revue locale pour décider la suite. Gigi prépare, tu valides — aucune exécution réelle.";

  return {
    intent: "execution_readiness",
    intentLabel: "Aegis en 30 secondes · V5.0",
    listen,
    needsClarification: false,
    executionReadinessSummaryText: `${composer.summaryText} ${review.summaryText}`,
    executionReadinessGuidance: [
      "/mission-composer — choisir la mission du jour",
      "/guided-actions — parcours guidé (prochaine action)",
      "/mission-review — revue locale et décision suivante",
      "/projects — missions possibles par projet",
    ],
    executionReadinessBlockedMessage:
      "Local uniquement — aucune exécution réelle, aucun connecteur actif, validation humaine obligatoire.",
    finalMessage: "Commence par /mission-composer, puis avance vers /guided-actions et /mission-review.",
  };
}
