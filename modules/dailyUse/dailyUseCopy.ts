import type { DailyUseEmptyState, DailyUseEmptyStateKey, DailyUseGuardrailsNote } from "./types";
import { PRODUCT_PROMISE, PRODUCT_READY_LABEL } from "@/lib/branding";

export const V11_PROMISE = PRODUCT_PROMISE;

export const V11_PHASE_LABEL = "V1.1 — usage quotidien amélioré";

export const V11_NO_AUTO_EXTERNAL_MESSAGE =
  "Mode simulation : aucune action externe automatique. Tes données restent en local.";

export const DAILY_USE_GUARDRAILS: DailyUseGuardrailsNote = {
  short: "Simulation — rien n'est envoyé dehors",
  long: "Actions, automatisations et intégrations restent en simulation. Aucun appel GitHub, Gmail, Calendar ou n8n.",
};

export const PAGE_META = {
  mission: {
    recommended: "Une mission claire — le reste peut attendre.",
    in_progress: "Continue étape par étape. Gigi garde le reste au calme.",
    completed: "C'est fait. Gigi peut préparer la suite.",
    resting: "Tu peux reprendre quand tu veux ou demander autre chose.",
  },
  conversation: "Dis à Gigi où tu veux aller — il te propose une seule priorité.",
  brain: "Pourquoi cette mission a été choisie aujourd'hui.",
  projects: "Tes projets. Gigi a déjà sélectionné la mission du jour.",
  history: "Ce que tu as fait récemment avec Gigi.",
  feedback: "Une friction, un bug ou une idée — enregistré sur cet appareil uniquement.",
} as const;

export const CONVERSATION_PLACEHOLDER = "Ex. : Quelle est ma priorité aujourd'hui ?";

export const CONVERSATION_EMPTY_HINT =
  "Pose une question ou choisis une suggestion ci-dessous. Gigi lit tes projets et te répond en local.";

export const CONVERSATION_PROPOSAL_EMPTY =
  "Demande une mission, un bilan du jour ou une autre priorité. Gigi te propose une seule direction claire.";

export const CONVERSATION_APPLY_HINT =
  "Appliquer enregistre la mission sur l'accueil. Tu pourras la démarrer puis la terminer.";

export const DAILY_REVIEW_PROMPT = "Gigi, fais ma revue du jour";

export const CONVERSATION_PROMPT_CHIPS = [
  DAILY_REVIEW_PROMPT,
  "Quelle mission est prioritaire maintenant ?",
  "Que faire dans Buildy Crafts aujourd'hui ?",
  "Quel projet puis-je ignorer aujourd'hui ?",
] as const;

export const EMPTY_STATES: Record<DailyUseEmptyStateKey, DailyUseEmptyState> = {
  history: {
    title: "Rien pour l'instant",
    body: "Termine ou démarre une mission — ton activité apparaîtra ici.",
    actionLabel: "Voir la mission du jour",
    actionHref: "/",
  },
  feedback: {
    title: "Aucun feedback pour l'instant",
    body: "Note une friction ou une idée pendant ton usage. Tout reste sur cet appareil.",
  },
  conversation: {
    title: "Commence une conversation",
    body: CONVERSATION_EMPTY_HINT,
  },
};

export const FEEDBACK_PAGE = {
  eyebrow: "Ton avis compte",
  title: "Feedback",
  intro:
    "Signale une friction, un bug ou une idée pendant ton usage quotidien. Rien n'est envoyé automatiquement.",
  backLinks: {
    home: "Retour à l'accueil",
    conversation: "Parler à Gigi",
  },
} as const;

export const SIDEBAR_READY_LABEL = PRODUCT_READY_LABEL;
export const SIDEBAR_FEEDBACK_LABEL = "Donner un avis";
