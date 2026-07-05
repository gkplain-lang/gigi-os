export const MISSION_COMPOSER_V47_DISCLAIMER =
  "V4.7 — Composer mission local. Tu choisis une mission prioritaire — Gigi prépare, aucune exécution réelle, validation humaine obligatoire.";

export const MISSION_COMPOSER_BADGES = [
  "Mission-first",
  "Local",
  "Focus du jour",
  "Aucune exécution réelle",
  "Validation humaine",
] as const;

export function isMissionComposerExecutionBlocked(): boolean {
  return true;
}

export function missionComposerPolicyNotes(): string[] {
  return [
    "Une seule mission du jour — réduction de dispersion.",
    "Les candidats persistés sont créés par action explicite uniquement.",
    "Conversion en parcours guidé = local V4.6, sans exécution réelle.",
    "Terminé par l'humain = déclaration locale, pas de vérification réelle.",
    "Aucun connecteur actif, aucune permission permanente.",
  ];
}
