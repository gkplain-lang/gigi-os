"use client";

import { useMemo, useState } from "react";
import { PageHeader } from "@/components/ui/PageHeader";
import { useGigi } from "@/components/providers/GigiProvider";
import {
  buildProjectsCommandViewModel,
  filterProjectCommandCards,
  type ProjectCommandFilterId,
} from "@/modules/projectsCommand";
import { ProjectsCommandCenter } from "./ProjectsCommandCenter";
import { ProjectsPriorityCard } from "./ProjectsPriorityCard";
import { ProjectsCommandFilters } from "./ProjectsCommandFilters";
import { ProjectCommandCardView } from "./ProjectCommandCardView";

export function ProjectsPageContent() {
  const { state, isHydrated } = useGigi();
  const [filter, setFilter] = useState<ProjectCommandFilterId>("all");

  const viewModel = useMemo(
    () =>
      buildProjectsCommandViewModel({
        projects: state.projects,
        missionProjectId: state.mission.projectId,
        missionTitle: state.mission.title,
      }),
    [
      state.projects,
      state.mission.projectId,
      state.mission.title,
    ]
  );

  const filteredCards = useMemo(
    () => filterProjectCommandCards(viewModel.projectCards, filter),
    [viewModel.projectCards, filter]
  );

  if (!isHydrated) return null;

  return (
    <div className="gigi-page-shell animate-fade-in">
      <div className="gigi-page-spotlight" aria-hidden />
      <div className="gigi-page-content">
        <PageHeader
          title="Projets"
          meta="Centre projets — priorité, mission possible et action active par projet."
        />

        {viewModel.emptyStateTitle ? (
          <div className="gigi-empty-state rounded-xl px-6 py-10 text-center">
            <p className="text-[15px] font-semibold text-text-primary">{viewModel.emptyStateTitle}</p>
            <p className="mx-auto mt-2 max-w-sm text-[13.5px] text-text-secondary">
              {viewModel.emptyStateDescription}
            </p>
          </div>
        ) : (
          <>
            <ProjectsCommandCenter viewModel={viewModel} />
            {viewModel.recommendedProject && (
              <ProjectsPriorityCard card={viewModel.recommendedProject} />
            )}
            <ProjectsCommandFilters
              filters={viewModel.filters}
              activeFilter={filter}
              onChange={setFilter}
            />
            {filteredCards.length === 0 ? (
              <p className="text-[13px] text-text-muted">Aucun projet pour ce filtre.</p>
            ) : (
              <div className="grid gap-3 sm:grid-cols-2">
                {filteredCards.map((card) => (
                  <ProjectCommandCardView key={card.projectId} card={card} />
                ))}
              </div>
            )}
            <p className="mt-6 text-[12px] italic text-text-muted">{viewModel.safetyNote}</p>
          </>
        )}
      </div>
    </div>
  );
}
