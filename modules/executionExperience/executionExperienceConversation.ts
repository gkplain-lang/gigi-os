import type { GigiConversationResponse } from "@/modules/conversation/conversationTypes";
import {
  generateCommandPackSummary,
  generateGlobalExecutionReadinessSummary,
  generateLocalReviewSummary,
  generateManualBridgeSummary,
} from "@/modules/executionReadiness";
import { EXECUTION_EXPERIENCE_V45_DISCLAIMER } from "./executionExperienceConstants";
import { getExecutionCenterOverviewData } from "./executionExperienceSummary";

function normalize(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

const VISIBILITY_KEYWORDS = [
  "qu'est-ce que tu peux faire",
  "que peux-tu faire",
  "que peux tu faire",
  "tu peux faire quoi",
  "tu peux agir sur mes projets",
  "pourquoi je ne vois rien",
  "je ne vois rien",
  "ou je dois aller",
  "où je dois aller",
  "ou aller",
  "comment ca marche",
  "comment ça marche",
  "execution controlee",
  "exécution contrôlée",
  "visible execution",
  "capacites v4",
  "capacités v4",
  "ce que gigi peut preparer",
  "ce que tu prepares",
  "parcours v4",
  "centre d'action",
];

/** Exclut les intentions plus spécifiques déjà gérées ailleurs. */
function isSpecificExecutionIntent(norm: string): boolean {
  if (/prepare.*(commande|pack|action)|pack.*commande/.test(norm)) return true;
  if (/revue locale|analyse.*resultat|resultat.*analyse|j'ai lance/.test(norm)) return true;
  if (/pont manuel|manual bridge/.test(norm)) return true;
  return false;
}

export interface VisibleExecutionExperienceIntent {
  isVisibleExecutionExperience: boolean;
}

export function detectVisibleExecutionExperienceIntent(
  objective: string
): VisibleExecutionExperienceIntent {
  const norm = normalize(objective);
  if (isSpecificExecutionIntent(norm)) {
    return { isVisibleExecutionExperience: false };
  }
  const isVisibleExecutionExperience = VISIBILITY_KEYWORDS.some((k) =>
    norm.includes(normalize(k))
  );
  return { isVisibleExecutionExperience };
}

export function buildVisibleExecutionExperienceResponse(
  objective: string
): GigiConversationResponse {
  const norm = normalize(objective);
  const overview = getExecutionCenterOverviewData();
  const readiness = generateGlobalExecutionReadinessSummary();
  const bridge = generateManualBridgeSummary();
  const packs = generateCommandPackSummary();
  const reviews = generateLocalReviewSummary();

  const routeHints = [
    "/actions — préparer des demandes locales",
    "/permissions — dry-run, refus, blocages",
    "/manual-bridge — pont manuel sandbox",
    "/command-packs — commandes à copier",
    "/local-review — analyser un résultat collé",
  ];

  const activityNote = overview.hasAnyActivity
    ? `${overview.requestsTotal} demande(s) · ${overview.packsTotal} pack(s) · ${overview.reviewsTotal} revue(s) — tout local.`
    : "Rien de préparé pour l'instant — commence sur /actions.";

  if (/ne vois rien|rien.*visible|pourquoi.*rien/.test(norm)) {
    return {
      intent: "execution_readiness",
      intentLabel: "Visibilité V4 · V4.5",
      listen:
        "Les modules V4 existent mais peuvent sembler vides tant qu'aucune demande n'est préparée. L'accueil / et /actions montrent maintenant le parcours complet — panneau « Ce que Gigi peut préparer ».",
      needsClarification: false,
      executionReadinessSummaryText: activityNote,
      executionReadinessGuidance: [
        "Accueil / — panneau capacités + parcours V4",
        "/actions — centre d'action avec compteurs",
        ...routeHints,
      ],
      executionReadinessBlockedMessage: EXECUTION_EXPERIENCE_V45_DISCLAIMER,
      finalMessage: "Commence par préparer une action sur /actions — rien n'est créé automatiquement.",
    };
  }

  if (/bloque|blocked|montre.*bloque/.test(norm)) {
    return {
      intent: "execution_readiness",
      intentLabel: "Capacités V4 · V4.5",
      listen: `${readiness.blockedCount} capacité(s) bloquée(s) localement — aucune exécution réelle. Tout reste sous validation humaine.`,
      needsClarification: false,
      executionReadinessSummaryText: readiness.summaryText,
      executionReadinessGuidance: routeHints,
      executionReadinessBlockedMessage: EXECUTION_EXPERIENCE_V45_DISCLAIMER,
      finalMessage: "Ouvre /permissions pour le détail des statuts dry-run et refus.",
    };
  }

  if (/projet|agir/.test(norm)) {
    return {
      intent: "execution_readiness",
      intentLabel: "Capacités V4 · V4.5",
      listen:
        "Je ne fais pas encore d'exécution réelle sur tes projets. Je peux préparer des demandes, permissions, ponts manuels, packs de commandes et revues locales — tu valides et tu lances toi-même.",
      needsClarification: false,
      executionReadinessSummaryText: readiness.summaryText,
      executionReadinessGuidance: routeHints,
      executionReadinessBlockedMessage: EXECUTION_EXPERIENCE_V45_DISCLAIMER,
      finalMessage: "Commence sur /actions ou / pour voir le parcours complet.",
    };
  }

  return {
    intent: "execution_readiness",
    intentLabel: "Ce que Gigi prépare · V4.5",
    listen:
      "En V4, Gigi prépare et structure — elle ne lance rien toute seule. Demandes locales, permissions dry-run, pont manuel, packs à copier, revue de résultats collés.",
    needsClarification: false,
    executionReadinessSummaryText: `${activityNote} · ${bridge.summaryText} · ${packs.summaryText} · ${reviews.summaryText}`,
    executionReadinessGuidance: [
      ...routeHints,
      "Accueil / — panneau « Ce que Gigi peut préparer »",
      EXECUTION_EXPERIENCE_V45_DISCLAIMER,
    ],
    executionReadinessBlockedMessage: EXECUTION_EXPERIENCE_V45_DISCLAIMER,
    finalMessage:
      "Dis « prépare les commandes », « crée une revue locale » ou ouvre les routes ci-dessus.",
  };
}
