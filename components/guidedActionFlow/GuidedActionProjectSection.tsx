"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { listGuidedActionTemplates } from "@/modules/executionExperience/guidedActionTemplates";
import { createGuidedFlowFromProject } from "@/modules/executionExperience/guidedActionBuilder";
import { GUIDED_ACTION_CATEGORY_LABELS } from "@/modules/executionExperience/guidedActionTypes";

interface GuidedActionProjectSectionProps {
  projectId: string;
  projectName: string;
}

export function GuidedActionProjectSection({
  projectId,
  projectName,
}: GuidedActionProjectSectionProps) {
  const router = useRouter();
  const templates = listGuidedActionTemplates();

  function handleCreate(templateId: string) {
    const flow = createGuidedFlowFromProject(projectId, projectName, templateId);
    router.push(`/guided-actions?flow=${flow.id}`);
  }

  return (
    <section className="gigi-panel-raised rounded-xl border border-indigo-500/20 p-5">
      <p className="text-[10px] font-semibold uppercase tracking-wider text-indigo-200/90">
        Actions guidées possibles · V4.6
      </p>
      <p className="mt-2 text-[13px] text-text-secondary">
        Prépare une prochaine mission, une checklist, un pack ou une revue — parcours local, contrôle
        humain obligatoire.
      </p>

      <ul className="mt-4 space-y-2">
        {templates.slice(0, 4).map((t) => (
          <li
            key={t.id}
            className="flex flex-wrap items-center justify-between gap-2 rounded-lg border border-border/30 px-3 py-2.5"
          >
            <div>
              <p className="text-[12.5px] font-medium text-text-primary">{t.title}</p>
              <p className="text-[11px] text-text-muted">
                {GUIDED_ACTION_CATEGORY_LABELS[t.category]} · {t.actionGoal}
              </p>
            </div>
            <button
              type="button"
              onClick={() => handleCreate(t.id)}
              className="gigi-btn-secondary gigi-focus shrink-0 rounded-lg px-2.5 py-1 text-[11px] font-medium"
            >
              Créer un parcours guidé
            </button>
          </li>
        ))}
      </ul>

      <Link
        href={`/guided-actions?projectId=${encodeURIComponent(projectId)}&projectName=${encodeURIComponent(projectName)}`}
        className="gigi-focus mt-3 inline-flex text-[12.5px] font-medium text-accent-soft hover:underline"
      >
        Voir tous les parcours →
      </Link>
    </section>
  );
}
