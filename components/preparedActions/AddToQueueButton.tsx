"use client";

import { useState } from "react";
import Link from "next/link";
import { ListPlus } from "lucide-react";
import type { PreparedAction } from "@/modules/preparedActions";
import { useActionQueue } from "@/components/providers/ActionQueueProvider";
import { cn } from "@/lib/utils";

interface AddToQueueButtonProps {
  preparedAction: PreparedAction;
  projectId: string;
  projectName: string;
  sourcePlanId?: string;
  sourceActionId?: string;
  className?: string;
}

export function AddToQueueButton({
  preparedAction,
  projectId,
  projectName,
  sourcePlanId,
  sourceActionId,
  className,
}: AddToQueueButtonProps) {
  const { addToQueue } = useActionQueue();
  const [added, setAdded] = useState(false);

  const handleAdd = () => {
    const ok = addToQueue({
      preparedAction,
      projectId,
      projectName,
      sourcePlanId,
      sourceActionId,
    });
    if (ok) setAdded(true);
  };

  return (
    <div className={cn("flex flex-wrap items-center gap-2", className)}>
      <button
        type="button"
        onClick={handleAdd}
        disabled={added}
        className="gigi-btn gigi-focus inline-flex items-center gap-1.5 rounded-lg px-3 py-2 text-[13px] font-medium disabled:opacity-70"
      >
        <ListPlus className="h-3.5 w-3.5" />
        {added ? "Ajouté à la file" : "Ajouter à la file de validation"}
      </button>
      {added && (
        <Link href="/actions" className="gigi-focus text-[12px] text-emerald-400/90 underline hover:text-emerald-300">
          Voir la file
        </Link>
      )}
    </div>
  );
}
