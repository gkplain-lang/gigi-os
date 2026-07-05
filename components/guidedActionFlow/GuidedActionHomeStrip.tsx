"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { listGuidedActionTemplates } from "@/modules/executionExperience/guidedActionTemplates";
import { createGuidedFlowFromMission } from "@/modules/executionExperience/guidedActionBuilder";

interface GuidedActionHomeStripProps {
  missionId?: string;
  missionTitle?: string;
  projectId?: string;
  projectName?: string;
  className?: string;
}

export function GuidedActionHomeStrip({
  missionId,
  missionTitle,
  projectId,
  projectName,
  className,
}: GuidedActionHomeStripProps) {
  const router = useRouter();
  const templates = listGuidedActionTemplates(3);

  function handleQuickStart(templateId: string) {
    if (missionId && missionTitle) {
      const flow = createGuidedFlowFromMission(
        missionId,
        missionTitle,
        projectId,
        projectName,
        templateId
      );
      router.push(`/guided-actions?flow=${flow.id}`);
      return;
    }
    router.push(`/guided-actions?template=${templateId}`);
  }

  return (
    <section
      className={`rounded-xl border border-indigo-500/25 bg-indigo-500/[0.04] p-5 ${className ?? ""}`}
      aria-label="Action guidée du jour"
    >
      <p className="text-[10px] font-semibold uppercase tracking-wider text-indigo-200/90">
        Action guidée du jour · V4.6
      </p>
      <h2 className="mt-1 text-[15px] font-semibold text-text-primary">Action guidée du jour</h2>
      <p className="mt-1 text-[12.5px] text-text-secondary">
        Choisis une action, Gigi te guide jusqu&apos;au pack ou à la revue locale — tu valides
        chaque étape.
      </p>

      <ul className="mt-4 space-y-2">
        {templates.map((t) => (
          <li
            key={t.id}
            className="flex flex-wrap items-center justify-between gap-2 rounded-lg border border-border/30 px-3 py-2"
          >
            <div>
              <p className="text-[12.5px] font-medium text-text-primary">{t.title}</p>
              <p className="text-[11px] text-text-muted">{t.whyUseful}</p>
            </div>
            <button
              type="button"
              onClick={() => handleQuickStart(t.id)}
              className="gigi-btn-secondary gigi-focus shrink-0 rounded-lg px-2.5 py-1 text-[11px] font-medium"
            >
              Démarrer
            </button>
          </li>
        ))}
      </ul>

      <Link
        href="/guided-actions"
        className="gigi-focus mt-3 inline-flex text-[12.5px] font-medium text-accent-soft hover:underline"
      >
        Tous les parcours guidés →
      </Link>
    </section>
  );
}
