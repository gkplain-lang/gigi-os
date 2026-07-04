"use client";

import { useState } from "react";
import Link from "next/link";
import { ListPlus } from "lucide-react";
import type { ActionPlan } from "@/modules/actionPlans";
import { PREPARED_ACTION_LABELS } from "@/modules/actionPlans";
import {
  buildPreparedActionForProject,
  buildPreparedActionFromPreview,
  getProjectPrepareHref,
  inferTypeFromSourceId,
} from "@/modules/preparedActions";
import { defaultTypeForProject } from "@/modules/preparedActions/preparedActionRules";
import { PreparedActionPanel } from "@/components/preparedActions/PreparedActionPanel";
import { useActionQueue } from "@/components/providers/ActionQueueProvider";

interface ActionPlanFutureActionsProps {
  plan: ActionPlan;
  projectName: string;
  initialPrepareId?: string | null;
}

export function ActionPlanFutureActions({
  plan,
  projectName,
  initialPrepareId,
}: ActionPlanFutureActionsProps) {
  const [expandedId, setExpandedId] = useState<string | null>(initialPrepareId ?? null);
  const [bulkAdded, setBulkAdded] = useState(false);
  const { addManyToQueue } = useActionQueue();

  if (plan.possibleFutureActions.length === 0) return null;

  const expandedPreview = plan.possibleFutureActions.find((a) => a.id === expandedId);
  const preparedAction = expandedId
    ? expandedPreview
      ? buildPreparedActionFromPreview(plan, expandedPreview, projectName)
      : buildPreparedActionForProject(
          plan.projectId,
          projectName,
          inferTypeFromSourceId(expandedId) ?? defaultTypeForProject(plan.projectId),
          { plan, sourceActionId: expandedId }
        )
    : null;

  const handleAddAllToQueue = () => {
    const inputs = plan.possibleFutureActions.map((preview) => ({
      preparedAction: buildPreparedActionFromPreview(plan, preview, projectName),
      projectId: plan.projectId,
      projectName,
      sourcePlanId: plan.id,
      sourceActionId: preview.id,
    }));
    const count = addManyToQueue(inputs);
    if (count > 0) setBulkAdded(true);
  };

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-2">
        <p className="text-[10px] font-semibold uppercase tracking-wider text-text-muted">
          Ce que Gigi peut préparer maintenant
        </p>
        <button
          type="button"
          onClick={handleAddAllToQueue}
          disabled={bulkAdded}
          className="gigi-btn gigi-focus inline-flex items-center gap-1 rounded-lg px-2.5 py-1 text-[11.5px] font-medium disabled:opacity-70"
        >
          <ListPlus className="h-3 w-3" />
          {bulkAdded ? "Ajoutées à la file" : "Ajouter à la file"}
        </button>
      </div>
      {bulkAdded && (
        <Link href="/actions" className="gigi-focus mt-1 inline-block text-[11px] text-emerald-400/90 underline">
          Voir la file de validation
        </Link>
      )}
      <ul className="mt-2 space-y-2">
        {plan.possibleFutureActions.map((action) => (
          <li
            key={action.id}
            className="rounded-lg border border-dashed border-border px-3 py-2.5 text-[13px]"
          >
            <div className="flex flex-wrap items-center gap-2">
              <span className="font-medium text-text-primary">{action.label}</span>
              <span className="rounded bg-surface-2 px-1.5 py-0.5 text-[10px] uppercase tracking-wide text-text-muted">
                {PREPARED_ACTION_LABELS[action.type] ?? action.type}
              </span>
              <button
                type="button"
                onClick={() => setExpandedId(expandedId === action.id ? null : action.id)}
                className="gigi-btn-primary gigi-focus ml-auto rounded-lg px-2.5 py-1 text-[12px] font-medium"
              >
                {expandedId === action.id ? "Masquer" : "Préparer"}
              </button>
            </div>
            <p className="mt-1 text-text-muted">{action.description}</p>
            <a
              href={getProjectPrepareHref(plan.projectId, action.id, plan.missionId)}
              className="gigi-focus mt-1 inline-block text-[11px] text-accent-soft/90 hover:text-accent-soft"
            >
              Lien direct ?prepare={action.id}
            </a>
          </li>
        ))}
      </ul>

      {preparedAction && (
        <div className="mt-4">
          <PreparedActionPanel
            action={preparedAction}
            projectName={projectName}
            sourcePlanId={plan.id}
            sourceActionId={expandedId ?? undefined}
          />
        </div>
      )}
    </div>
  );
}
