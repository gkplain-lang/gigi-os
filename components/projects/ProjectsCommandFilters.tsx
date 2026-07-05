"use client";

import type { ProjectCommandFilter, ProjectCommandFilterId } from "@/modules/projectsCommand";
import { cn } from "@/lib/utils";

interface ProjectsCommandFiltersProps {
  filters: ProjectCommandFilter[];
  activeFilter: ProjectCommandFilterId;
  onChange: (id: ProjectCommandFilterId) => void;
}

export function ProjectsCommandFilters({
  filters,
  activeFilter,
  onChange,
}: ProjectsCommandFiltersProps) {
  return (
    <div className="mb-4 flex flex-wrap gap-2" role="tablist" aria-label="Filtrer les projets">
      {filters.map((f) => (
        <button
          key={f.id}
          type="button"
          role="tab"
          aria-selected={activeFilter === f.id}
          onClick={() => onChange(f.id)}
          className={cn(
            "gigi-focus rounded-full border px-3 py-1 text-[12px] font-medium transition-colors",
            activeFilter === f.id
              ? "border-indigo-400/40 bg-indigo-500/15 text-indigo-100"
              : "border-border/50 text-text-muted hover:text-text-secondary"
          )}
        >
          {f.label}
        </button>
      ))}
    </div>
  );
}
