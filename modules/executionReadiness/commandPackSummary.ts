import type { CommandPackGlobalSummary } from "./commandPackTypes";
import {
  getEffectiveCommandPackStatus,
  listCommandPacks,
  syncExpiredCommandPacks,
} from "./commandPackBuilder";

export function generateCommandPackSummary(): CommandPackGlobalSummary {
  if (typeof window !== "undefined") syncExpiredCommandPacks();

  const packs = listCommandPacks();
  const readyForReview = packs.filter(
    (p) => getEffectiveCommandPackStatus(p) === "ready_for_review"
  ).length;
  const copiedByHuman = packs.filter(
    (p) => getEffectiveCommandPackStatus(p) === "copied_by_human"
  ).length;
  const markedRun = packs.filter(
    (p) => getEffectiveCommandPackStatus(p) === "marked_run_by_human"
  ).length;
  const markedSuccess = packs.filter(
    (p) => getEffectiveCommandPackStatus(p) === "marked_success_by_human"
  ).length;
  const markedFailed = packs.filter(
    (p) => getEffectiveCommandPackStatus(p) === "marked_failed_by_human"
  ).length;
  const expired = packs.filter((p) => getEffectiveCommandPackStatus(p) === "expired").length;
  const cancelled = packs.filter((p) => getEffectiveCommandPackStatus(p) === "cancelled").length;

  const summaryText =
    packs.length === 0
      ? "Aucun pack de commandes — Gigi peut préparer des commandes à copier, sans exécution réelle."
      : `${packs.length} pack(s) · ${readyForReview} prêt(s) à relire · ${markedRun} lancé(s) (déclaratif) · lancement humain uniquement.`;

  return {
    totalPacks: packs.length,
    readyForReview,
    copiedByHuman,
    markedRun,
    markedSuccess,
    markedFailed,
    expired,
    cancelled,
    summaryText,
  };
}

export const COMMAND_PACK_EMPTY_SUMMARY =
  "Packs de commandes V4.3 — texte à copier et lancer toi-même. Aucune exécution réelle.";
