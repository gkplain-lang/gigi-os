export const GUIDED_ACTION_V46_DISCLAIMER =
  "V4.6 — Parcours guidé local. Gigi prépare et structure — aucune exécution réelle, validation humaine obligatoire, connecteurs non actifs.";

export const GUIDED_ACTION_BADGES = [
  "Guidé",
  "Local",
  "Validation humaine",
  "Aucune exécution réelle",
  "Connecteurs non actifs",
] as const;

export function getGuidedActionDisclaimer(): string {
  return GUIDED_ACTION_V46_DISCLAIMER;
}

/** Toujours vrai — V4.6 ne déclenche jamais d'exécution réelle. */
export function isGuidedActionExecutionBlocked(): boolean {
  return true;
}

export function guidedActionPolicyNotes(): string[] {
  return [
    "Parcours déclaratif local uniquement — statuts sans vérification réelle.",
    "Chaque étape nécessite une action explicite de ta part.",
    "Aucun connecteur actif, aucune permission permanente.",
    "Les liens vers demandes/packs/revues restent manuels ou existants.",
    "Terminé par l'humain = déclaration locale, pas de preuve automatique.",
  ];
}
