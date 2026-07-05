"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useMemo, useState } from "react";
import { PageHeader } from "@/components/ui/PageHeader";
import {
  getActiveDailyPriorityMission,
} from "@/modules/missionComposer";
import {
  createReviewFromDailyMission,
  createReviewFromTemplate,
  getDailyMissionReviewById,
  getLatestMissionReview,
  getReflectionByReviewId,
  generateMissionReviewSummary,
  missionReviewPolicyNotes,
  saveDailyMissionReviewWithReflection,
  updateDailyMissionReview,
  listDailyMissionReviews,
  type UpdateReviewInput,
} from "@/modules/missionReview";
import { useIsClient } from "@/components/settings/useIsClient";
import { MissionReviewBadges, MissionReviewDisclaimer } from "./MissionReviewDisclaimer";
import { DailyMissionReviewCard } from "./DailyMissionReviewCard";
import { MissionReviewForm } from "./MissionReviewForm";
import { MissionReviewTemplateGallery } from "./MissionReviewTemplateGallery";
import { MissionExecutionReflectionCard } from "./MissionExecutionReflectionCard";
import { MissionReviewDecisionPanel } from "./MissionReviewDecisionPanel";

export function MissionReviewPanel() {
  const isClient = useIsClient();
  const router = useRouter();
  const searchParams = useSearchParams();
  const reviewFromUrl = searchParams.get("review");

  const [revision, setRevision] = useState(0);
  const refresh = useCallback(() => setRevision((r) => r + 1), []);

  const summary = useMemo(() => {
    if (!isClient) return null;
    void revision;
    return generateMissionReviewSummary();
  }, [isClient, revision]);

  const daily = useMemo(() => {
    if (!isClient) return undefined;
    void revision;
    return getActiveDailyPriorityMission();
  }, [isClient, revision]);

  const selectedReview = useMemo(() => {
    if (!isClient) return undefined;
    void revision;
    if (reviewFromUrl) return getDailyMissionReviewById(reviewFromUrl);
    return getLatestMissionReview();
  }, [isClient, revision, reviewFromUrl]);

  const reflection = useMemo(() => {
    if (!selectedReview) return undefined;
    void revision;
    return getReflectionByReviewId(selectedReview.id);
  }, [selectedReview, revision]);

  const recentReviews = useMemo(() => {
    if (!isClient) return [];
    void revision;
    return listDailyMissionReviews(5);
  }, [isClient, revision]);

  if (!isClient || !summary) return null;

  function handleCreateReview() {
    const review = createReviewFromDailyMission();
    refresh();
    if (review) router.push(`/mission-review?review=${review.id}`);
  }

  function handleTemplateSelect(templateId: string) {
    const title = daily?.title ?? "Mission";
    const review = createReviewFromTemplate(templateId, title, {
      dailyPriorityMissionId: daily?.id,
      missionCandidateId: daily?.missionCandidateId,
      linkedGuidedFlowId: daily?.linkedGuidedFlowId,
      projectId: daily?.projectId,
      projectName: daily?.projectName,
    });
    refresh();
    if (review) router.push(`/mission-review?review=${review.id}`);
  }

  function handleFormChange(fields: UpdateReviewInput) {
    if (!selectedReview) return;
    updateDailyMissionReview(selectedReview.id, fields);
    refresh();
  }

  function handleSaveReview() {
    if (!selectedReview) return;
    saveDailyMissionReviewWithReflection(selectedReview.id, {
      whatWasDone: selectedReview.whatWasDone,
      blockers: selectedReview.blockers,
      learnings: selectedReview.learnings,
      outcomeStatus: selectedReview.outcomeStatus,
      nextDecision: selectedReview.nextDecision,
      progressLevel: selectedReview.progressLevel,
      status: "reviewed",
    });
    refresh();
  }

  return (
    <div className="gigi-page-shell animate-fade-in">
      <div className="gigi-page-spotlight" aria-hidden />
      <div className="gigi-page-content">
        <PageHeader
          title="Revue de mission"
          meta="Fais le bilan de la mission du jour, puis choisis la décision suivante."
        />

        <section className="gigi-panel-raised mb-6 rounded-xl border border-violet-500/30 p-5">
          <p className="text-[10px] font-bold uppercase tracking-wider text-violet-200/90">
            V4.8 · Daily Mission Review
          </p>
          <MissionReviewBadges className="mt-3" />
          <MissionReviewDisclaimer className="mt-3" />
          <p className="mt-3 text-[13px] text-text-secondary">{summary.summaryText}</p>
        </section>

        <section className="mb-6">
          <h2 className="text-[14px] font-semibold text-text-primary">1. Mission à revoir</h2>
          {daily ? (
            <div className="mt-3 space-y-3">
              <p className="text-[13px] text-text-secondary">
                <span className="font-medium text-text-primary">{daily.title}</span>
                {daily.projectName ? ` · ${daily.projectName}` : ""}
              </p>
              <p className="text-[12px] text-text-muted">Outcome attendu : {daily.outcome}</p>
              <button
                type="button"
                onClick={handleCreateReview}
                className="gigi-btn-secondary gigi-focus rounded-lg px-3 py-1.5 text-[12px] font-medium"
              >
                Créer une revue
              </button>
            </div>
          ) : (
            <p className="mt-2 text-[13px] text-text-secondary">
              Aucune mission du jour —{" "}
              <Link href="/mission-composer" className="text-accent-soft hover:underline">
                composer une mission
              </Link>
              .
            </p>
          )}
        </section>

        {selectedReview && (
          <>
            <section className="mb-6">
              <h2 className="text-[14px] font-semibold text-text-primary">2. Revue locale</h2>
              <div className="mt-3">
                <DailyMissionReviewCard review={selectedReview} />
              </div>
              <div className="mt-4">
                <MissionReviewForm
                  review={selectedReview}
                  onChange={(fields) => handleFormChange(fields)}
                />
              </div>
              <button
                type="button"
                onClick={handleSaveReview}
                className="gigi-btn-secondary gigi-focus mt-4 rounded-lg px-4 py-2 text-[13px] font-medium"
              >
                Enregistrer la revue
              </button>
            </section>

            {reflection && (
              <section className="mb-6">
                <h2 className="text-[14px] font-semibold text-text-primary">
                  3. Réflexion d&apos;exécution
                </h2>
                <div className="mt-3">
                  <MissionExecutionReflectionCard reflection={reflection} />
                </div>
              </section>
            )}

            <section className="mb-6">
              <h2 className="text-[14px] font-semibold text-text-primary">4. Décision suivante</h2>
              <div className="mt-3">
                <MissionReviewDecisionPanel review={selectedReview} onRefresh={refresh} />
              </div>
            </section>
          </>
        )}

        <section className="mb-6">
          <h2 className="text-[14px] font-semibold text-text-primary">Modèles rapides</h2>
          <p className="mt-1 text-[12px] text-text-muted">
            Suggestions UI — persistées uniquement si tu cliques.
          </p>
          <div className="mt-3">
            <MissionReviewTemplateGallery onSelect={handleTemplateSelect} />
          </div>
        </section>

        {recentReviews.length > 0 && (
          <section className="mb-6">
            <h2 className="text-[14px] font-semibold text-text-primary">Revues récentes</h2>
            <ul className="mt-3 space-y-2">
              {recentReviews.map((r) => (
                <li key={r.id}>
                  <Link
                    href={`/mission-review?review=${r.id}`}
                    className="gigi-focus text-[12.5px] text-accent-soft hover:underline"
                  >
                    {r.missionTitle} · {r.status}
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        )}

        <section className="rounded-xl border border-border/30 p-4">
          <ul className="list-inside list-disc text-[11.5px] text-text-muted">
            {missionReviewPolicyNotes().map((n) => (
              <li key={n}>{n}</li>
            ))}
          </ul>
          <div className="mt-3 flex flex-wrap gap-3">
            <Link href="/mission-composer" className="gigi-focus text-[12px] text-accent-soft hover:underline">
              Mission du jour →
            </Link>
            <Link href="/guided-actions" className="gigi-focus text-[12px] text-text-muted hover:underline">
              Parcours guidés →
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
}
