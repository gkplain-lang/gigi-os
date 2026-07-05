"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { ArrowLeft, MessageCircle } from "lucide-react";
import { useGigi } from "@/components/providers/GigiProvider";
import { PageHeader } from "@/components/ui/PageHeader";
import { StatusPill } from "@/components/ui/StatusPill";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { ProjectMissionCard } from "@/components/projects/ProjectMissionCard";
import { ActionPlanPanel } from "@/components/actionPlans/ActionPlanPanel";
import { MissionFeedbackPanel } from "@/components/missionFeedback/MissionFeedbackPanel";
import { MissionPlanBridgePanel } from "@/components/missionPlanBridge/MissionPlanBridgePanel";
import { ClosedLoopMissionOS } from "@/components/missionOS/ClosedLoopMissionOS";
import { buildMissionLearningViewModel } from "@/modules/missionOS";
import { useMemo } from "react";
import { getTodayMissionDecision } from "@/modules/missionDecision";
import { getAcceptedCandidateFromDecision } from "@/modules/missionPlanBridge";
import {
  buildProjectDetailContext,
  getProjectAskGigiHref,
  getRecommendedMission,
} from "@/modules/projectMissions";
import { buildActionPlanForProject } from "@/modules/actionPlans";
import type { HistoryEvent } from "@/modules/history/historyTypes";
import type { Project, ProjectStatus } from "@/modules/projects/projectTypes";

const STATUS_LABEL: Record<ProjectStatus, string> = {
  active: "Actif",
  paused: "En pause",
  postponed: "Reporté",
  future: "Futur",
  completed: "Terminé",
  archived: "Archivé",
};

const PRIORITY_LABEL: Record<string, string> = {
  critical: "Critique",
  high: "Haute",
  medium: "Moyenne",
  low: "Basse",
};

interface ProjectDetailPageContentProps {
  projectId: string;
}

function filterProjectHistory(events: HistoryEvent[], project: Project): HistoryEvent[] {
  const nameLower = project.name.toLowerCase();
  const id = project.id;

  return events.filter((e) => {
    if (e.meta?.projectId === id) return true;
    const hay = `${e.title} ${e.description ?? ""}`.toLowerCase();
    return hay.includes(nameLower) || hay.includes(id.replace(/-/g, " "));
  });
}

export function ProjectDetailPageContent({ projectId }: ProjectDetailPageContentProps) {
  const { state, isHydrated } = useGigi();
  const searchParams = useSearchParams();
  const planParam = searchParams.get("plan");
  const prepareParam = searchParams.get("prepare");

  const projectLearning = useMemo(
    () => buildMissionLearningViewModel({ projectId }),
    [projectId]
  );

  if (!isHydrated) return null;

  const project = state.projects.find((p) => p.id === projectId);

  if (!project) {
    return (
      <div className="gigi-page-shell animate-fade-in">
        <div className="gigi-page-content">
          <PageHeader title="Projet introuvable" meta="Ce projet n'existe pas dans ton portefeuille." />
          <div className="gigi-empty-state rounded-xl px-6 py-10 text-center">
            <p className="text-[15px] font-semibold text-text-primary">Projet introuvable</p>
            <p className="mx-auto mt-2 max-w-sm text-[13.5px] leading-relaxed text-text-secondary">
              L&apos;identifiant « {projectId} » ne correspond à aucun projet connu.
            </p>
            <Link
              href="/projects"
              className="gigi-btn-primary gigi-focus mt-5 inline-flex rounded-lg px-4 py-2.5 text-[14px] font-medium"
            >
              Retour aux projets
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const isMissionProject = state.mission.projectId === project.id;
  const ctx = buildProjectDetailContext(project, { isMissionProject });
  const { summary, missions } = ctx;
  const history = filterProjectHistory(state.history, project);
  const askHref = getProjectAskGigiHref(project);

  const recommendedMission = getRecommendedMission(missions);
  const planMissionId =
    planParam && planParam !== "recommended"
      ? missions.some((m) => m.id === planParam)
        ? planParam
        : recommendedMission?.id
      : recommendedMission?.id;
  const actionPlan = planMissionId
    ? buildActionPlanForProject(project.id, project.name, planMissionId)
    : null;
  const showUnknownPlanMission =
    planParam && planParam !== "recommended" && !missions.some((m) => m.id === planParam);

  const todayDecision = getTodayMissionDecision();
  const acceptedCandidateForProject =
    todayDecision && ["accepted", "converted_to_plan"].includes(todayDecision.status)
      ? getAcceptedCandidateFromDecision(todayDecision)
      : undefined;
  const showProjectBridge =
    acceptedCandidateForProject?.projectId === project.id ? todayDecision : undefined;

  const showProjectFollowUp =
    projectLearning.hasLearning &&
    projectLearning.recommendedNextMissionRoute.includes(project.id);

  return (
    <div className="gigi-page-shell animate-fade-in">
      <div className="gigi-page-spotlight" aria-hidden />
      <div className="gigi-page-content">
        <Link
          href="/projects"
          className="gigi-focus mb-4 inline-flex items-center gap-1.5 text-[13px] text-text-muted hover:text-text-secondary"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          Retour aux projets
        </Link>

        <div className="gigi-hero-card mb-6 p-6 md:p-7">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="font-display text-[1.5rem] font-semibold tracking-[-0.02em] text-text-primary md:text-[1.75rem]">
                  {project.name}
                </h1>
                <StatusPill
                  label={STATUS_LABEL[project.status]}
                  variant={project.status === "active" ? "warm" : "muted"}
                />
                {isMissionProject && (
                  <span className="rounded-full border border-[rgba(124,140,255,0.4)] bg-[rgba(124,140,255,0.12)] px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-accent-soft">
                    Mission du jour
                  </span>
                )}
              </div>
              <p className="mt-2 max-w-2xl text-[14px] leading-relaxed text-text-secondary">
                {project.description}
              </p>
              {showProjectFollowUp && projectLearning.recommendedNextMissionTitle && (
                <p className="mt-2 rounded-lg border border-emerald-500/20 bg-emerald-500/5 px-3 py-2 text-[12.5px] text-text-secondary">
                  Suite recommandée pour ce projet :{" "}
                  <Link
                    href={projectLearning.recommendedNextMissionRoute}
                    className="font-medium text-accent-soft underline-offset-2 hover:underline"
                  >
                    {projectLearning.recommendedNextMissionTitle}
                  </Link>
                </p>
              )}
              <p className="mt-3 text-[12px] font-medium uppercase tracking-wide text-text-muted">
                {PRIORITY_LABEL[project.priority]} · Score {summary.score}
              </p>
            </div>
            <div
              className="gigi-priority-ring shrink-0"
              style={{ ["--score" as string]: summary.score, ["--ring-size" as string]: "3.5rem" }}
            >
              <div className="gigi-priority-ring-inner" aria-hidden />
              <span className="gigi-priority-ring-label">{summary.score}</span>
            </div>
          </div>
          <div className="mt-5 flex items-center gap-3">
            <ProgressBar value={project.progress} className="flex-1" />
            <span className="shrink-0 text-[13px] font-medium tabular-nums text-text-secondary">
              {project.progress}%
            </span>
          </div>
        </div>

        <div className="mb-6">
          <ClosedLoopMissionOS
            input={{
              missionTitle: recommendedMission?.title ?? `Mission · ${project.name}`,
              missionSummary: summary.recommendedAction.whyNow,
              projectId: project.id,
            }}
            compact
          />
        </div>
        <p className="mb-5 text-[12.5px] text-text-muted">
          <span className="font-medium text-text-secondary">Prochaine étape projet :</span> choisir
          une mission → préparer le plan → ajouter à la file{" "}
          <Link href="/actions" className="text-accent-soft underline-offset-2 hover:underline">
            /actions
          </Link>
          .
        </p>

        <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_280px] lg:items-start">
          <div className="space-y-5">
            <section className="gigi-command-card p-5">
              <p className="gigi-mission-control-label">Prochaine action</p>
              <p className="mt-2 text-[16px] font-semibold leading-snug text-text-primary">
                {summary.recommendedAction.action}
              </p>
              <p className="mt-2 text-[13.5px] leading-relaxed text-text-secondary">
                <span className="font-medium text-text-primary">Pourquoi maintenant : </span>
                {summary.recommendedAction.whyNow}
              </p>
              <p className="mt-2 text-[13px] text-text-muted">
                <span className="font-medium text-text-secondary">Tu peux ignorer : </span>
                {summary.recommendedAction.canIgnore}
              </p>
            </section>

            {showUnknownPlanMission && (
              <div className="gigi-empty-state rounded-xl px-4 py-6 text-center">
                <p className="text-[14px] font-medium text-text-primary">Mission introuvable</p>
                <p className="mt-1 text-[13px] text-text-muted">
                  Le plan demandé n&apos;existe pas — affichage du plan recommandé.
                </p>
              </div>
            )}

            {actionPlan && (
              <section id="action-plan">
                <PageHeader
                  title="Plan d'action"
                  meta="Préparation locale — aucune exécution automatique."
                />
                <ActionPlanPanel
                  plan={actionPlan}
                  projectName={project.name}
                  initialPrepareId={prepareParam}
                />
              </section>
            )}

            <section>
              <PageHeader
                title="Missions possibles"
                meta="Suggestions locales — demande à Gigi pour trancher."
              />
              <div className="space-y-3">
                {missions.map((mission) => (
                  <ProjectMissionCard key={mission.id} project={project} mission={mission} />
                ))}
              </div>
              {showProjectBridge && (
                <MissionPlanBridgePanel
                  decision={showProjectBridge}
                  projectId={project.id}
                  missionTitle={acceptedCandidateForProject?.title}
                  className="mt-4"
                />
              )}
            </section>
          </div>

          <aside className="space-y-4 lg:sticky lg:top-6">
            <section className="gigi-command-card-accent gigi-command-card p-4">
              <p className="gigi-mission-control-label">Pourquoi ce projet</p>
              <p className="mt-2 text-[13.5px] leading-relaxed text-text-secondary">
                {summary.whyItMatters}
              </p>
            </section>

            <section className="gigi-command-card p-4">
              <p className="gigi-mission-control-label">Aujourd&apos;hui</p>
              <p className="mt-2 text-[13.5px] leading-relaxed text-text-secondary">{summary.whyToday}</p>
              {summary.whyNotToday && (
                <p className="mt-2 text-[13px] text-text-muted">{summary.whyNotToday}</p>
              )}
            </section>

            <section className="gigi-command-card p-4">
              <p className="gigi-mission-control-label">Signaux</p>
              <dl className="mt-3 space-y-2 text-[13px]">
                <div className="flex justify-between gap-3">
                  <dt className="text-text-muted">Urgence</dt>
                  <dd className="font-medium tabular-nums text-text-primary">{project.urgency}/10</dd>
                </div>
                <div className="flex justify-between gap-3">
                  <dt className="text-text-muted">Impact business</dt>
                  <dd className="font-medium tabular-nums text-text-primary">
                    {project.businessPotential}/10
                  </dd>
                </div>
                <div className="flex justify-between gap-3">
                  <dt className="text-text-muted">Valeur stratégique</dt>
                  <dd className="font-medium tabular-nums text-text-primary">
                    {project.strategicValue}/10
                  </dd>
                </div>
                <div className="flex justify-between gap-3">
                  <dt className="text-text-muted">Clarté</dt>
                  <dd className="font-medium tabular-nums text-text-primary">{project.clarity}/10</dd>
                </div>
              </dl>
            </section>

            <Link
              href={askHref}
              className="gigi-btn-primary gigi-focus flex w-full items-center justify-center gap-2 rounded-xl px-4 py-3 text-[14px] font-semibold"
            >
              <MessageCircle className="h-4 w-4" />
              Demander à Gigi
            </Link>

            <Link
              href="/#mission-decision-center"
              className="gigi-btn gigi-focus flex w-full items-center justify-center rounded-xl px-4 py-2.5 text-[13px]"
            >
              Comparer dans le centre de décision
            </Link>

            <section className="gigi-command-card p-4">
              <p className="gigi-mission-control-label">Historique projet</p>
              {history.length === 0 ? (
                <p className="mt-2 text-[13px] text-text-muted">
                  Aucun historique spécifique pour ce projet.
                </p>
              ) : (
                <ul className="mt-3 space-y-2.5">
                  {history.slice(0, 4).map((event) => (
                    <li key={event.id} className="text-[12.5px] leading-relaxed">
                      <span className="font-medium text-text-secondary">{event.title}</span>
                      {event.description && (
                        <span className="mt-0.5 block text-text-muted">{event.description}</span>
                      )}
                    </li>
                  ))}
                </ul>
              )}
            </section>

            <MissionFeedbackPanel projectId={project.id} showTopScores={false} />
          </aside>
        </div>
      </div>
    </div>
  );
}
