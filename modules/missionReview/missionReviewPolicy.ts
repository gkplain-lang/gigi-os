export const MISSION_REVIEW_V48_DISCLAIMER =
  "V4.8 — Revue de mission locale. Tu décris ce qui s'est passé — Gigi prépare une réflexion, tu valides la décision suivante. Aucune exécution réelle.";

export const MISSION_REVIEW_BADGES = [
  "Revue locale",
  "Bilan mission",
  "Décision suivante",
  "Aucune exécution réelle",
  "Validation humaine",
] as const;

export function isMissionReviewExecutionBlocked(): boolean {
  return true;
}

export function missionReviewPolicyNotes(): string[] {
  return [
    "Revue déclarative — Gigi ne vérifie rien réellement.",
    "Les revues persistées sont créées par action explicite uniquement.",
    "La décision suivante reste validée par toi.",
    "Terminée par l'humain = déclaration locale, pas de vérification réelle.",
    "Aucun connecteur actif, aucune permission permanente.",
  ];
}
