"use client";

import { useState } from "react";
import type { LocalReviewSession } from "@/modules/executionReadiness";
import {
  analyzeExistingReviewSession,
  downloadLocalReviewJson,
  downloadLocalReviewMarkdown,
  updateReviewSessionStatus,
} from "@/modules/executionReadiness";

export function LocalReviewActions({
  session,
  onUpdated,
}: {
  session: LocalReviewSession;
  onUpdated: () => void;
}) {
  const [exportMsg, setExportMsg] = useState<string | null>(null);
  const active = !["cancelled", "archived"].includes(session.status);

  function handleExportJson() {
    const result = downloadLocalReviewJson(session.id);
    setExportMsg(result.ok ? `JSON : ${result.filename}` : result.error ?? "Erreur");
  }

  function handleExportMd() {
    const result = downloadLocalReviewMarkdown(session.id);
    setExportMsg(result.ok ? `Markdown : ${result.filename}` : result.error ?? "Erreur");
  }

  function handleAnalyze() {
    analyzeExistingReviewSession(session.id);
    onUpdated();
  }

  function handleStatus(status: LocalReviewSession["status"], reason: string) {
    updateReviewSessionStatus(session.id, status, reason);
    onUpdated();
  }

  return (
    <div className="space-y-3 border-t border-border/40 pt-4">
      <p className="text-[10px] font-semibold uppercase tracking-wider text-text-muted">
        Actions locales — revue déclarative
      </p>
      <div className="flex flex-wrap gap-2">
        {active && session.userProvidedInput.trim() && (
          <button
            type="button"
            onClick={handleAnalyze}
            className="gigi-btn-secondary gigi-focus rounded-lg px-3 py-1.5 text-[12px]"
          >
            Analyser localement
          </button>
        )}
        {active && (
          <>
            <button
              type="button"
              onClick={() =>
                handleStatus("inconclusive", "Marqué inconclusif — validation humaine requise.")
              }
              className="gigi-btn-secondary gigi-focus rounded-lg px-3 py-1.5 text-[12px]"
            >
              Marquer inconclusif
            </button>
            <button
              type="button"
              onClick={() => handleStatus("archived", "Revue archivée localement.")}
              className="gigi-btn-secondary gigi-focus rounded-lg px-3 py-1.5 text-[12px]"
            >
              Archiver
            </button>
            <button
              type="button"
              onClick={() => handleStatus("cancelled", "Revue annulée.")}
              className="gigi-focus rounded-lg border border-border/50 px-3 py-1.5 text-[12px] text-text-muted"
            >
              Annuler
            </button>
          </>
        )}
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
