import Link from "next/link";
import { ClipboardList, MessageCircle } from "lucide-react";
import type { ProjectMissionSuggestion } from "@/modules/projectMissions";
import { getMissionAskGigiHref, getMissionPrepareHref } from "@/modules/projectMissions";
import { getProjectPlanHref } from "@/modules/actionPlans";
import type { Project } from "@/modules/projects/projectTypes";
import { MissionFeedbackBadge } from "@/components/missionFeedback/MissionFeedbackBadge";
import { cn } from "@/lib/utils";

interface ProjectMissionCardProps {
  project: Project;
  mission: ProjectMissionSuggestion;
}

export function ProjectMissionCard({ project, mission }: ProjectMissionCardProps) {
  const askHref = getMissionAskGigiHref(project, mission);
  const prepareHref = getMissionPrepareHref(project, mission);
  const planHref = getProjectPlanHref(project.id, mission.id);

  return (
    <article
      className={cn(
        "gigi-project-card rounded-xl p-4",
        mission.recommended && "border-[rgba(124,140,255,0.35)]"
      )}
    >
      <div className="flex flex-wrap items-start justify-between gap-2">
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="text-[15px] font-semibold text-text-primary">{mission.title}</h3>
            {mission.recommended && (
              <span className="rounded-full border border-[rgba(124,140,255,0.4)] bg-[rgba(124,140,255,0.12)] px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-accent-soft">
                Recommandée
              </span>
            )}
            <MissionFeedbackBadge
              missionId={mission.id}
              projectId={project.id}
              title={mission.title}
            />
          </div>
          <p className="mt-1.5 text-[13px] leading-relaxed text-text-secondary">
            {mission.description}
          </p>
          <p className="mt-2 text-[12.5px] text-text-muted">{mission.reason}</p>
        </div>
        <div className="flex shrink-0 gap-3 text-[11px] tabular-nums text-text-muted">
          <span title="Impact">I {mission.impact}</span>
          <span title="Effort">E {mission.effort}</span>
          <span title="Urgence">U {mission.urgency}</span>
        </div>
      </div>

      {mission.suggestedTasks && mission.suggestedTasks.length > 0 && (
        <ul className="mt-3 space-y-1 border-t border-border pt-3">
          {mission.suggestedTasks.map((task) => (
            <li key={task} className="flex gap-2 text-[12.5px] text-text-secondary">
              <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-accent-soft" aria-hidden />
              {task}
            </li>
          ))}
        </ul>
      )}

      <div className="mt-4 flex flex-wrap gap-2">
        <Link
          href={planHref}
          className="gigi-btn-primary gigi-focus inline-flex items-center gap-1.5 rounded-lg px-3.5 py-2 text-[13px] font-medium"
        >
          <ClipboardList className="h-3.5 w-3.5" />
          Préparer le plan
        </Link>
        <Link
          href={prepareHref}
          className="gigi-btn gigi-focus rounded-lg px-3.5 py-2 text-[13px] font-medium"
        >
          Préparer comme mission
        </Link>
        <Link
          href={askHref}
          className="gigi-btn gigi-focus inline-flex items-center gap-1.5 rounded-lg px-3.5 py-2 text-[13px]"
        >
          <MessageCircle className="h-3.5 w-3.5" />
          Demander à Gigi de la choisir
        </Link>
      </div>
      <p className="mt-2 text-[11px] text-text-muted">Simulation — aucune mission appliquée automatiquement.</p>
    </article>
  );
}
