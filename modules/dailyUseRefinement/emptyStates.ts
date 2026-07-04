import type { RefinementEmptyState } from "./types";

export const REFINED_EMPTY_STATES: Record<
  RefinementEmptyState["key"],
  RefinementEmptyState
> = {
  history: {
    key: "history",
    title: "Pas encore d'activité",
    body: "Démarre ou termine une mission — elle apparaîtra ici.",
    actionLabel: "Aller à la mission",
    actionHref: "/",
  },
  conversation: {
    key: "conversation",
    title: "Par où commencer ?",
    body: "Demande ta priorité, un bilan du jour, ou choisis une suggestion.",
  },
  feedback: {
    key: "feedback",
    title: "Aucune note pour l'instant",
    body: "Signale une friction pendant ton usage — tout reste sur cet appareil.",
  },
  feedbackEntries: {
    key: "feedbackEntries",
    title: "Aucune entrée enregistrée",
    body: "Ajoute ta première note avec le formulaire ci-dessus.",
  },
};
