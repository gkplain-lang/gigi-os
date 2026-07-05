"use client";

import {
  GUIDED_ACTION_CATEGORY_LABELS,
  type GuidedActionTemplateDefinition,
} from "@/modules/executionExperience/guidedActionTypes";
import { listGuidedActionTemplates } from "@/modules/executionExperience/guidedActionTemplates";
import { ExecutionRiskBadge } from "@/components/executionReadiness/ExecutionRiskBadge";

interface GuidedActionTemplateGalleryProps {
  onCreate: (templateId: string) => void;
  limit?: number;
}

function TemplateCard({
  template,
  onCreate,
}: {
  template: GuidedActionTemplateDefinition;
  onCreate: (id: string) => void;
}) {
  return (
    <div className="rounded-lg border border-border/40 bg-surface-2/10 p-4">
      <p className="text-[13px] font-medium text-text-primary">{template.title}</p>
      <p className="mt-1 text-[12px] text-text-secondary">{template.description}</p>
      <p className="mt-2 text-[11px] text-text-muted">{template.whyUseful}</p>
      <div className="mt-2 flex flex-wrap items-center gap-2">
        <span className="text-[10px] uppercase tracking-wider text-text-muted">
          {GUIDED_ACTION_CATEGORY_LABELS[template.category]}
        </span>
        <ExecutionRiskBadge level={template.riskLevel} />
      </div>
      <button
        type="button"
        onClick={() => onCreate(template.id)}
        className="gigi-btn-primary gigi-focus mt-3 rounded-lg px-3 py-1.5 text-[12px] font-medium"
      >
        Créer ce parcours
      </button>
    </div>
  );
}

export function GuidedActionTemplateGallery({ onCreate, limit }: GuidedActionTemplateGalleryProps) {
  const templates = listGuidedActionTemplates(limit);

  return (
    <section aria-label="Modèles d'actions guidées">
      <p className="text-[10px] font-semibold uppercase tracking-wider text-text-muted">
        Modèles · action explicite requise
      </p>
      <div className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {templates.map((t) => (
          <TemplateCard key={t.id} template={t} onCreate={onCreate} />
        ))}
      </div>
    </section>
  );
}
