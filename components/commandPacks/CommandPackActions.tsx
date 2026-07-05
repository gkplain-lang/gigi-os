"use client";

import { useState } from "react";
import type { CommandPack } from "@/modules/executionReadiness";
import {
  downloadCommandPackJson,
  downloadCommandPackMarkdown,
  getEffectiveCommandPackStatus,
  updateCommandPackStatus,
} from "@/modules/executionReadiness";

interface CommandPackActionsProps {
  pack: CommandPack;
  onUpdated: () => void;
}

export function CommandPackActions({ pack, onUpdated }: CommandPackActionsProps) {
  const [exportMsg, setExportMsg] = useState<string | null>(null);
  const status = getEffectiveCommandPackStatus(pack);
  const active = !["cancelled", "expired", "marked_success_by_human", "marked_failed_by_human"].includes(
    status
  );

  function handleStatus(next: CommandPack["status"], reason: string) {
    updateCommandPackStatus(pack.id, next, reason);
    onUpdated();
  }

  function handleExportJson() {
    const result = downloadCommandPackJson(pack.id);
    setExportMsg(result.ok ? `JSON exporté : ${result.filename}` : result.error ?? "Erreur");
  }

  function handleExportMd() {
    const result = downloadCommandPackMarkdown(pack.id);
    setExportMsg(result.ok ? `Markdown exporté : ${result.filename}` : result.error ?? "Erreur");
  }

  if (!active) {
    return (
      <div className="space-y-2 border-t border-border/40 pt-4">
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={handleExportJson}
            className="gigi-btn-secondary gigi-focus rounded-lg px-3 py-1.5 text-[12px]"
          >
            Exporter JSON
          </button>
          <button
            type="button"
            onClick={handleExportMd}
            className="gigi-btn-secondary gigi-focus rounded-lg px-3 py-1.5 text-[12px]"
          >
            Exporter Markdown
          </button>
        </div>
        {exportMsg && <p className="text-[11px] text-text-muted">{exportMsg}</p>}
        <p className="text-[12px] text-text-muted">Pack clos — statut déclaratif final.</p>
      </div>
    );
  }

  return (
    <div className="space-y-3 border-t border-border/40 pt-4">
      <p className="text-[10px] font-semibold uppercase tracking-wider text-text-muted">
        Actions locales — statuts déclaratifs
      </p>
      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() =>
            handleStatus("copied_by_human", "Pack marqué copié par l'humain — Gigi ne vérifie rien.")
          }
          className="gigi-btn-secondary gigi-focus rounded-lg px-3 py-1.5 text-[12px]"
        >
          Marquer comme copié par l&apos;humain
        </button>
        <button
          type="button"
          onClick={() =>
            handleStatus(
              "marked_run_by_human",
              "Marqué lancé par l'humain — aucune vérification d'exécution réelle."
            )
          }
          className="gigi-btn-secondary gigi-focus rounded-lg px-3 py-1.5 text-[12px]"
        >
          Marquer comme lancé par l&apos;humain
        </button>
        <button
          type="button"
          onClick={() =>
            handleStatus(
              "marked_success_by_human",
              "Succès déclaré par l'humain — statut local uniquement."
            )
          }
          className="gigi-btn-primary gigi-focus rounded-lg px-3 py-1.5 text-[12px] font-medium"
        >
          Marquer succès déclaré
        </button>
        <button
          type="button"
          onClick={() =>
            handleStatus(
              "marked_failed_by_human",
              "Échec déclaré par l'humain — statut local uniquement."
            )
          }
          className="gigi-focus rounded-lg border border-red-500/30 px-3 py-1.5 text-[12px] text-red-200/90"
        >
          Marquer échec déclaré
        </button>
        <button
          type="button"
          onClick={() => handleStatus("cancelled", "Pack annulé localement.")}
          className="gigi-focus rounded-lg border border-border/50 px-3 py-1.5 text-[12px] text-text-muted"
        >
          Annuler
        </button>
        <button
          type="button"
          onClick={handleExportJson}
          className="gigi-btn-secondary gigi-focus rounded-lg px-3 py-1.5 text-[12px]"
        >
          Exporter JSON
        </button>
        <button
          type="button"
          onClick={handleExportMd}
          className="gigi-btn-secondary gigi-focus rounded-lg px-3 py-1.5 text-[12px]"
        >
          Exporter Markdown
        </button>
      </div>
      {exportMsg && <p className="text-[11px] text-text-muted">{exportMsg}</p>}
    </div>
  );
}
