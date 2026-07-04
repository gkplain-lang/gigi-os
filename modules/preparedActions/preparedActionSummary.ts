export const PREPARED_ACTION_DRY_RUN_MESSAGE =
  "Dry-run only — aucune exécution réelle. Valide avant de copier-coller ou d'agir.";

export const PREPARED_VALIDATION_DEFAULTS = [
  "Aucune commande exécutée par Gigi",
  "Aucun fichier modifié automatiquement",
  "Aucune branche Git créée par l'application",
  "Aucun commit ou merge sans validation explicite",
];

export const PREPARED_SAFETY_DEFAULTS = [
  "Ne pas committer sans relecture",
  "Ne pas merger dans main sans validation",
  "Ne pas toucher à .env.local",
  "Vérifier le build avant toute PR",
];
