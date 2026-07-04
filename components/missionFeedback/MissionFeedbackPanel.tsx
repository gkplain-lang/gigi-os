"use client";

import { useCallback, useMemo, useState } from "react";
import Link from "next/link";
import type {
  ManualMissionFeedbackSentiment,
  MissionFeedbackSignal,
  MissionRecommendationScore,
} from "@/modules/missionFeedback";
import {
  MANUAL_SENTIMENT_LABELS,
  MISSION_FEEDBACK_DISCLAIMER,
  addManualMissionFeedbackNote,
  generateGlobalMissionFeedbackSummary,
  getCopyableGlobalMissionFeedbackText,
  getCopyableMissionFeedbackText,
  getDefaultScoreableMissions,
  listMissionFeedbackSignals,
  listMissionRecommendationScores,
  regenerateMissionFeedbackFromHistory,
} from "@/modules/missionFeedback";
import { MISSION_CATALOG } from "@/modules/conversation/missionCatalog";
import { MissionFeedbackSummaryCard } from "./MissionFeedbackSummaryCard";
import { MissionRecommendationCard } from "./MissionRecommendationCard";
import { cn } from "@/lib/utils";

interface MissionFeedbackPanelProps {
  projectId?: string;
  missionId?: string;
  missionTitle?: string;
  className?: string;
  showTopScores?: boolean;
}

const SEVERITY_STYLE: Record<MissionFeedbackSignal["severity"], string> = {
  info: "text-text-muted",
  positive: "text-emerald-300/90",
  warning: "text-amber-200/90",
  critical: "text-red-300/80",
};

export function MissionFeedbackPanel({
  projectId,
  missionId,
  missionTitle,
  className,
  showTopScores = true,
}: MissionFeedbackPanelProps) {
  const [signals, setSignals] = useState<MissionFeedbackSignal[]>(() =>
    listMissionFeedbackSignals(projectId ? { projectId } : undefined)
  );
  const [scores, setScores] = useState<MissionRecommendationScore[]>(() =>
    listMissionRecommendationScores(projectId ? { projectId } : undefined)
  );
  const [manualNote, setManualNote] = useState("");
  const [sentiment, setSentiment] =
    useState<ManualMissionFeedbackSentiment>("useful");
  const [copied, setCopied] = useState(false);

  const summary = generateGlobalMissionFeedbackSummary(projectId);

  const focusedScore = useMemo(() => {
    if (missionId) return scores.find((s) => s.missionId === missionId);
    return scores[0];
  }, [scores, missionId]);

  const focusedTitle =
    missionTitle ??
    (missionId ? MISSION_CATALOG.find((m) => m.id === missionId)?.title : undefined) ??
    "Mission";

  const refresh = useCallback(() => {
    const pool = getDefaultScoreableMissions(projectId);
    regenerateMissionFeedbackFromHistory(pool);
    setSignals(listMissionFeedbackSignals(projectId ? { projectId } : undefined));
    setScores(listMissionRecommendationScores(projectId ? { projectId } : undefined));
  }, [projectId]);

  const handleRegenerate = useCallback(() => {
    refresh();
  }, [refresh]);

  const handleCopyGlobal = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(getCopyableGlobalMissionFeedbackText(projectId));
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      /* fallback */
    }
  }, [projectId]);

  const handleCopyMission = useCallback(async () => {
    if (!focusedScore) return;
    try {
      await navigator.clipboard.writeText(
        getCopyableMissionFeedbackText(focusedTitle, focusedScore)
      );
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      /* fallback */
    }
  }, [focusedScore, focusedTitle]);

  const handleAddManual = useCallback(() => {
    const note = manualNote.trim();
    if (!note) return;
    addManualMissionFeedbackNote(note, sentiment, { missionId, projectId });
    setManualNote("");
    refresh();
  }, [manualNote, sentiment, missionId, projectId, refresh]);

  return (
    <section className={cn("space-y-4", className)}>
      <MissionFeedbackSummaryCard
        summary={summary}
        onRegenerate={handleRegenerate}
        onCopyGlobal={handleCopyGlobal}
      />
      {copied && (
        <p className="text-[12px] text-emerald-400/90">Texte copié dans le presse-papiers.</p>
      )}

      {focusedScore && (
        <div>
          <p className="mb-2 text-[10px] font-semibold uppercase tracking-wider text-text-muted">
            Pourquoi cette mission ?
          </p>
          <MissionRecommendationCard
            missionTitle={focusedTitle}
            score={focusedScore}
            onCopy={() => void handleCopyMission()}
          />
        </div>
      )}

      {signals.length > 0 && (
        <div className="rounded-xl border border-border bg-surface-2/20 px-4 py-4">
          <p className="text-[10px] font-semibold uppercase tracking-wider text-text-muted">
            Signaux détectés ({signals.length})
          </p>
          <ul className="mt-2 max-h-48 space-y-2 overflow-y-auto">
            {signals.slice(0, 8).map((s) => (
              <li key={s.id} className="text-[12.5px]">
                <span className={cn("font-medium", SEVERITY_STYLE[s.severity])}>{s.label}</span>
                <span className="mt-0.5 block text-text-muted">{s.description}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {showTopScores && scores.length > 1 && (
        <div className="rounded-xl border border-border bg-surface-2/20 px-4 py-4">
          <p className="text-[10px] font-semibold uppercase tracking-wider text-text-muted">
            Scores mission (indicatif)
          </p>
          <ul className="mt-2 space-y-2">
            {scores.slice(0, 5).map((s) => {
              const title = MISSION_CATALOG.find((m) => m.id === s.missionId)?.title ?? s.missionId;
              return (
                <li key={s.missionId}>
                  <MissionRecommendationCard
                    missionTitle={title}
                    score={s}
                    compact
                  />
                </li>
              );
            })}
          </ul>
        </div>
      )}

      <div className="rounded-xl border border-border bg-surface-2/20 px-4 py-4">
        <p className="text-[10px] font-semibold uppercase tracking-wider text-text-muted">
          Feedback manuel
        </p>
        <div className="mt-2 space-y-2">
          <select
            value={sentiment}
            onChange={(e) => setSentiment(e.target.value as ManualMissionFeedbackSentiment)}
            className="gigi-focus w-full rounded-lg border border-border bg-surface px-3 py-2 text-[13px]"
          >
            {(Object.keys(MANUAL_SENTIMENT_LABELS) as ManualMissionFeedbackSentiment[]).map(
              (key) => (
                <option key={key} value={key}>
                  {MANUAL_SENTIMENT_LABELS[key]}
                </option>
              )
            )}
          </select>
          <textarea
            value={manualNote}
            onChange={(e) => setManualNote(e.target.value)}
            placeholder="Ex. Cette mission était trop floue sans critère de fin"
            rows={2}
            className="gigi-focus w-full rounded-lg border border-border bg-surface px-3 py-2 text-[13px]"
          />
          <button
            type="button"
            onClick={handleAddManual}
            disabled={!manualNote.trim()}
            className="gigi-btn-primary gigi-focus rounded-lg px-3 py-1.5 text-[12.5px] font-medium disabled:opacity-40"
          >
            Enregistrer le feedback
          </button>
        </div>
        <p className="mt-2 text-[11px] text-text-muted">{MISSION_FEEDBACK_DISCLAIMER}</p>
      </div>

      <p className="text-[12px] text-text-muted">
        Basé sur{" "}
        <Link href="/history" className="text-accent-soft underline">
          l&apos;historique V2.4
        </Link>
        — aucune modification automatique des missions.
      </p>
    </section>
  );
}
