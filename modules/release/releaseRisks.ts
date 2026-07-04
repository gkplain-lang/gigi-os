import type { ReleaseGuardrailsSummary } from "./types";

export function getReleaseGuardrails(): ReleaseGuardrailsSummary {
  return {
    externalActionsDisabled: true,
    dryRunOnly: true,
    n8nConnected: false,
    realIntegrationsDisabled: true,
    autoSyncDisabled: true,
    autoRestoreDisabled: true,
    confirmationRequired: true,
    localStoragePrimary: true,
  };
}

export const FORBIDDEN_V10_REAL_ACTIONS = [
  "Intégrations réelles (GitHub API, Gmail, Calendar)",
  "Workflow n8n / agents réels",
  "git commit / push / merge applicatif",
  "Sync / restore Supabase automatique",
  "Paiement / billing",
  "Landing page publique",
  "Exécution automatique sans confirmation",
] as const;

export const KNOWN_V10_RISKS = [
  "OpenAI absent → fallback local (comportement normal).",
  "Supabase absent → pas de sync cloud (comportement normal).",
  "Feedback local non synchronisé entre appareils.",
  "Intégrations et automatisations = plans dry-run uniquement.",
  "V1.0 n'ajoute pas de nouveaux pouvoirs externes.",
] as const;

export const MANUAL_V10_VALIDATIONS = [
  "Ouvrir Gigi le matin → mission claire en < 10 secondes.",
  "Compléter une mission → historique mis à jour.",
  "Demander bilan du jour dans /conversation.",
  "Noter une friction via /feedback.",
  "Vérifier npm run build avant release.",
  "Confirmer garde-fous sur /dev/release.",
] as const;

export const V10_NOT_INCLUDED = [
  "Pas de nouvelles intégrations réelles.",
  "Pas de n8n branché.",
  "Pas de produit public / paiement.",
  "Pas de sync Supabase automatique.",
] as const;
