import type { GigiConversationResponse } from "@/modules/conversation/conversationTypes";
import { generateGuidedActionSummary } from "./guidedActionSummary";
import { getGuidedActionDisclaimer } from "./guidedActionPolicy";
import { listActiveGuidedFlows } from "./guidedActionBuilder";

function normalize(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

const GUIDED_KEYWORDS = [
  "guide-moi",
  "parcours guide",
  "parcours guidé",
  "action guidee",
  "action guidée",
  "crée un parcours",
  "cree un parcours",
  "creer un parcours",
  "quelle action je peux faire",
  "prepare une action guidee",
  "prépare une action guidée",
  "aide-moi a passer de mission",
  "aide moi a passer de mission",
  "mission a commandes",
  "avancer sur ce projet",
  "etape par etape",
  "étape par étape",
  "prochaine action",
  "guided action",
  "guided-actions",
];

function isMoreSpecificIntent(norm: string): boolean {
  if (/revue locale|analyse.*resultat|local review/.test(norm)) return true;
  if (/pack.*commande|command pack/.test(norm)) return true;
  if (/pont manuel|manual bridge/.test(norm)) return true;
  if (/permission|bloque|blocked/.test(norm) && !/parcours|guide/.test(norm)) return true;
  return false;
}

export interface GuidedActionIntent {
  isGuidedAction: boolean;
}

export function detectGuidedActionIntent(objective: string): GuidedActionIntent {
  const norm = normalize(objective);
  if (isMoreSpecificIntent(norm)) return { isGuidedAction: false };
  const isGuidedAction = GUIDED_KEYWORDS.some((k) => norm.includes(normalize(k)));
  return { isGuidedAction };
}

export function buildGuidedActionConversationResponse(
  objective: string
): GigiConversationResponse {
  const norm = normalize(objective);
  const summary = generateGuidedActionSummary();
  const active = listActiveGuidedFlows(3);
  const disclaimer = getGuidedActionDisclaimer();

  const routeHints = [
    "/guided-actions — parcours guidé projet/mission",
    "/actions — demande locale",
    "/permissions — dry-run et blocages",
    "/manual-bridge — pont manuel sandbox",
    "/command-packs — commandes à copier",
    "/local-review — analyser un résultat collé",
  ];

  if (/projet|project/.test(norm)) {
    return {
      intent: "execution_readiness",
      intentLabel: "Parcours guidé · V4.6",
      listen:
        "Je peux créer un parcours guidé local pour ton projet — objectif, permission, pont manuel, pack et revue. Je ne lance rien : tu valides chaque étape.",
      needsClarification: false,
      executionReadinessSummaryText: summary.summaryText,
      executionReadinessGuidance: routeHints,
      executionReadinessBlockedMessage: disclaimer,
      finalMessage: "Ouvre /guided-actions ou une fiche projet → « Créer un parcours guidé ».",
    };
  }

  if (/mission|commande|etape/.test(norm)) {
    return {
      intent: "execution_readiness",
      intentLabel: "Mission → commandes · V4.6",
      listen:
        "Pour passer de mission à commandes : parcours guidé local — demande → permission → pont → pack → revue. Contrôle humain à chaque étape.",
      needsClarification: false,
      executionReadinessSummaryText: summary.summaryText,
      executionReadinessGuidance: [
        ...routeHints,
        active.length > 0
          ? `${active.length} parcours actif(s) — continue sur /guided-actions`
          : "Aucun parcours actif — crée-en un depuis un modèle",
      ],
      executionReadinessBlockedMessage: disclaimer,
      finalMessage: "Dis « crée un parcours guidé » ou ouvre /guided-actions.",
    };
  }

  return {
    intent: "execution_readiness",
    intentLabel: "Actions guidées · V4.6",
    listen:
      "En V4.6, Gigi structure un parcours guidé depuis projet ou mission — sans exécution réelle. Tu copies, tu lances toi-même, tu colles le résultat.",
    needsClarification: false,
    executionReadinessSummaryText: summary.summaryText,
    executionReadinessGuidance: [...routeHints, disclaimer],
    executionReadinessBlockedMessage: disclaimer,
    finalMessage: "Ouvre /guided-actions pour choisir un modèle d'action guidée.",
  };
}
