"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemo } from "react";
import { getActiveDailyPriorityMission, convertMissionToGuidedActionFlow } from "@/modules/missionComposer";
import { listActiveGuidedFlows } from "@/modules/executionExperience/guidedActionBuilder";
import { useIsClient } from "@/components/settings/useIsClient";
import { MVPStatusPill } from "./MVPStatusPill";

export function NextActionCard({ className }: { className?: string }) {
  const isClient = useIsClient();
  const router = useRouter();

  const daily = useMemo(() => {
    if (!isClient) return undefined;
    return getActiveDailyPriorityMission();
  }, [isClient]);

  const activeFlow = useMemo(() => {
    if (!isClient) return undefined;
    if (!daily?.linkedGuidedFlowId) return undefined;
    return listActiveGuidedFlows().find((f) => f.id === daily.linkedGuidedFlowId);
  }, [isClient, daily]);

  if (!isClient || !daily) return null;

  function handleConvert() {
    const result = convertMissionToGuidedActionFlow(undefined, daily!.id);
    if (result?.flow) router.push(`/guided-actions?flow=${result.flow.id}`);
    else router.push("/guided-actions");
  }

  return (
    <section
      className={`rounded-xl border border-indigo-500/25 bg-indigo-500/[0.05] p-5 ${className ?? ""}`}
      aria-label="Prochaine action"
    >
      <div className="flex flex-wrap items-center justify-between gap-2">
        <p className="text-[10px] font-semibold uppercase tracking-wider text-indigo-200/90">
          Prochaine action
        </p>
        <MVPStatusPill
          label={activeFlow ? "Parcours guidé actif" : "À structurer"}
          tone={activeFlow ? "accent" : "muted"}
        />
      </div>

      {activeFlow ? (
        <>
          <p className="mt-2 text-[13px] text-text-secondary">
            Ton parcours guidé est prêt — continue étape par étape. Gigi prépare, tu valides.
          </p>
          <Link
            href={`/guided-actions?flow=${activeFlow.id}`}
            className="gigi-focus mt-4 inline-flex rounded-lg bg-indigo-500/15 px-4 py-2 text-[12.5px] font-medium text-indigo-100 hover:bg-indigo-500/25"
          >
            Continuer le parcours guidé →
          </Link>
        </>
      ) : (
        <>
          <p className="mt-2 text-[13px] text-text-secondary">
            Transforme « {daily.title} » en parcours guidé local — aucune exécution réelle,
            validation humaine obligatoire.
          </p>
          <button
            type="button"
            onClick={handleConvert}
            className="gigi-focus mt-4 inline-flex rounded-lg bg-indigo-500/15 px-4 py-2 text-[12.5px] font-medium text-indigo-100 hover:bg-indigo-500/25"
          >
            Transformer en action guidée →
          </button>
        </>
      )}
    </section>
  );
}
