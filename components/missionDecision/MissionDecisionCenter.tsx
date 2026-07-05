"use client";

import { useCallback, useState } from "react";
import type { MissionDecision, MissionDecisionCandidate } from "@/modules/missionDecision";
import {
  MISSION_DECISION_DISCLAIMER,
  acceptMissionCandidate,
  addUserNoteToDecision,
  clarifyMissionCandidate,
  generateDailyMissionDecision,
  getCopyableDecisionText,
  getTodayMissionDecision,
  listMissionDecisions,
  markDecisionConvertedToPlan,
  postponeMissionCandidate,
  rejectMissionCandidate,
} from "@/modules/missionDecision";
import { MissionDecisionSummaryCard } from "./MissionDecisionSummaryCard";
import { MissionDecisionCandidateCard } from "./MissionDecisionCandidateCard";
import { MissionDecisionActions } from "./MissionDecisionActions";
import { MissionDecisionHistoryPanel } from "./MissionDecisionHistoryPanel";
import { MissionPlanBridgePanel } from "@/components/missionPlanBridge/MissionPlanBridgePanel";
import { cn } from "@/lib/utils";

interface MissionDecisionCenterProps {
  completedMissionIds?: string[];
  currentMissionId?: string;
  currentProjectId?: string;
  className?: string;
}

export function MissionDecisionCenter({
  completedMissionIds = [],
  currentMissionId,
  currentProjectId,
  className,
}: MissionDecisionCenterProps) {
  const [decision, setDecision] = useState<MissionDecision>(() => {
    const today = getTodayMissionDecision();
    if (today) return today;
    return generateDailyMissionDecision({
      completedMissionIds,
      currentMissionId,
      currentProjectId,
    });
  });
  const [selectedId, setSelectedId] = useState<string | undefined>(
    () => decision.selectedCandidateId ?? decision.candidates[0]?.id
  );
  const [userNote, setUserNote] = useState(decision.userNote ?? "");
  const [copied, setCopied] = useState(false);
  const [history] = useState(() => listMissionDecisions(5));

  const selectedCandidate = decision.candidates.find((c) => c.id === selectedId);

  const refreshDecision = useCallback(
    (next: MissionDecision) => {
      setDecision(next);
      setSelectedId(next.selectedCandidateId ?? next.candidates[0]?.id);
      setUserNote(next.userNote ?? "");
    },
    []
  );

  const handleRegenerate = useCallback(() => {
    const next = generateDailyMissionDecision(
      { completedMissionIds, currentMissionId, currentProjectId },
      true
    );
    refreshDecision(next);
  }, [completedMissionIds, currentMissionId, currentProjectId, refreshDecision]);

  const handleAccept = useCallback(() => {
    if (!selectedId) return;
    const next = acceptMissionCandidate(decision.id, selectedId, userNote.trim() || undefined);
    if (next) refreshDecision(next);
  }, [decision.id, selectedId, userNote, refreshDecision]);

  const handleReject = useCallback(() => {
    const next = rejectMissionCandidate(
      decision.id,
      selectedId,
      userNote.trim() || undefined
    );
    if (next) refreshDecision(next);
  }, [decision.id, selectedId, userNote, refreshDecision]);

  const handlePostpone = useCallback(() => {
    const next = postponeMissionCandidate(
      decision.id,
      selectedId,
      userNote.trim() || undefined
    );
    if (next) refreshDecision(next);
  }, [decision.id, selectedId, userNote, refreshDecision]);

  const handleClarify = useCallback(() => {
    const next = clarifyMissionCandidate(
      decision.id,
      selectedId,
      userNote.trim() || undefined
    );
    if (next) refreshDecision(next);
  }, [decision.id, selectedId, userNote, refreshDecision]);

  const handleCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(getCopyableDecisionText(decision));
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      /* fallback */
    }
  }, [decision]);

  const handleNoteBlur = useCallback(() => {
    const note = userNote.trim();
    if (!note || note === decision.userNote) return;
    const next = addUserNoteToDecision(decision.id, note);
    if (next) refreshDecision(next);
  }, [userNote, decision.id, decision.userNote, refreshDecision]);

  const handleConvertedToPlan = useCallback(() => {
    const next = markDecisionConvertedToPlan(decision.id);
    if (next) refreshDecision(next);
  }, [decision.id, refreshDecision]);

  const recommendedId = decision.selectedCandidateId ?? decision.candidates[0]?.id;

  return (
    <section id="mission-decision-center" className={cn("space-y-4", className)}>
      <MissionDecisionSummaryCard
        decision={decision}
        onRegenerate={handleRegenerate}
        onCopy={() => void handleCopy()}
      />

      {decision.candidates.length > 0 ? (
        <>
          <div>
            <p className="mb-2 text-[10px] font-semibold uppercase tracking-wider text-text-muted">
              Missions candidates ({decision.candidates.length})
            </p>
            <ul className="space-y-3">
              {decision.candidates.map((c: MissionDecisionCandidate) => (
                <li key={c.id}>
                  <MissionDecisionCandidateCard
                    candidate={c}
                    selected={c.id === selectedId}
                    recommended={c.id === recommendedId}
                    onSelect={() => setSelectedId(c.id)}
                  />
                </li>
              ))}
            </ul>
          </div>

          {selectedCandidate && selectedCandidate.validationChecklist.length > 0 && (
            <div className="rounded-xl border border-border bg-surface-2/20 px-4 py-3">
              <p className="text-[10px] font-semibold uppercase tracking-wider text-text-muted">
                Checklist de validation
              </p>
              <ul className="mt-2 space-y-1">
                {selectedCandidate.validationChecklist.map((item) => (
                  <li key={item} className="text-[12.5px] text-text-secondary">
                    ☐ {item}
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div className="rounded-xl border border-border bg-surface-2/20 px-4 py-3">
            <label
              htmlFor="mission-decision-note"
              className="text-[10px] font-semibold uppercase tracking-wider text-text-muted"
            >
              Note utilisateur
            </label>
            <textarea
              id="mission-decision-note"
              value={userNote}
              onChange={(e) => setUserNote(e.target.value)}
              onBlur={handleNoteBlur}
              placeholder="Pourquoi tu choisis (ou refuses) cette mission…"
              rows={2}
              className="gigi-focus mt-2 w-full rounded-lg border border-border bg-surface px-3 py-2 text-[13px]"
            />
          </div>

          <MissionDecisionActions
            decision={decision}
            selectedCandidate={selectedCandidate}
            onAccept={handleAccept}
            onReject={handleReject}
            onPostpone={handlePostpone}
            onClarify={handleClarify}
            onCopy={() => void handleCopy()}
            onConvertedToPlan={handleConvertedToPlan}
            copied={copied}
          />

          {["accepted", "converted_to_plan"].includes(decision.status) && (
            <MissionPlanBridgePanel decision={decision} />
          )}
        </>
      ) : (
        <p className="rounded-lg border border-dashed border-border px-4 py-6 text-center text-[13px] text-text-muted">
          Aucune candidate — explore les projets ou archive des exécutions dans /history.
        </p>
      )}

      <p className="text-[11px] text-text-muted">{MISSION_DECISION_DISCLAIMER}</p>

      {history.length > 1 && (
        <div className="border-t border-border pt-4">
          <p className="mb-2 text-[10px] font-semibold uppercase tracking-wider text-text-muted">
            Décisions récentes
          </p>
          <MissionDecisionHistoryPanel decisions={history.filter((d) => d.id !== decision.id)} />
        </div>
      )}
    </section>
  );
}
