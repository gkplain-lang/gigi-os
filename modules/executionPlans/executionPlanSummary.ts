export const EXECUTION_DRY_RUN_MESSAGE =
  "Exécution guidée · aucune action automatique. Gigi ne lance aucune commande ni aucun Git.";

export const EXECUTION_FINAL_CONFIRMATION =
  "Confirmation finale requise avant tout commit, merge ou déploiement.";

export const EXECUTION_NOT_APPROVED_MESSAGE =
  "Valide cette action dans /actions avant de préparer son exécution.";

export const DEFAULT_SAFETY_NOTES = [
  "Gigi n'exécute aucune commande depuis l'application",
  "Ne pas committer sans relecture du diff",
  "Ne pas merger dans main sans validation explicite",
  "Ne pas toucher à .env.local",
  "Vérifier npm run build avant toute PR",
];

export const DEFAULT_EXPECTED_REPORT = [
  "Résumé en 3 bullets de ce qui a été fait",
  "Liste des fichiers modifiés",
  "Résultat des tests (build, parcours manuel)",
  "Points restants ou blocages",
  "Confirmation : exécution manuelle terminée ou non",
];
