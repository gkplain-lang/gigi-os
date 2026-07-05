"use client";

import { useState } from "react";
import { Archive, Check, Copy, RefreshCw, Lock } from "lucide-react";
import type { ClosedLoopLifecycle } from "@/modules/closedLoopLifecycle";
import {
  getCopyableLifecycleText,
  getCopyableNextStepsText,
  markLifecycleClosed,
  recalculateLifecycle,
} from "@/modules/closedLoopLifecycle";
import { cn } from "@/lib/utils";

interface ClosedLoopLifecycleActionsProps {
  lifecycle: ClosedLoopLifecycle;
  onLifecycleChange: (next: ClosedLoopLifecycle) => void;
  onArchive?: () => void;
  className?: string;
}

export function ClosedLoopLifecycleActions({
  lifecycle,
  onLifecycleChange,
  onArchive,
  className,
}: ClosedLoopLifecycleActionsProps) {
  const [copied, setCopied] = useState<"all" | "steps" | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  const canClose = !lifecycle.userClosed && lifecycle.status !== "archived";
  const canRecalc = lifecycle.status !== "archived";

  const handleCopy = async (kind: "all" | "steps") => {
    const text =
      kind === "all" ? getCopyableLifecycleText(lifecycle.id) : getCopyableNextStepsText(lifecycle.id);
    try {
      await navigator.clipboard.writeText(text);
      setCopied(kind);
      window.setTimeout(() => setCopied(null), 2000);
    } catch {
      /* ignore */
    }
  };

  const handleRecalculate = () => {
    const next = recalculateLifecycle(lifecycle.id);
    if (next) {
      onLifecycleChange(next);
      setMessage("Cycle recalculé depuis les données locales.");
    }
  };

  const handleClose = () => {
    const next = markLifecycleClosed(lifecycle.id);
    if (next) {
      onLifecycleChange(next);
      setMessage("Cycle marqué comme fermé — action manuelle uniquement.");
    }
  };

  return (
    <div className={cn("space-y-2", className)}>
      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => void handleCopy("all")}
          className="gigi-btn-primary gigi-focus inline-flex items-center gap-1 rounded-lg px-3 py-1.5 text-[12.5px] font-medium"
        >
          {copied === "all" ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
          Copier cycle
        </button>
        <button
          type="button"
          onClick={() => void handleCopy("steps")}
          className="gigi-btn gigi-focus inline-flex items-center gap-1 rounded-lg px-3 py-1.5 text-[12.5px]"
        >
          {copied === "steps" ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
          Copier étapes
        </button>
        {canRecalc && (
          <button
            type="button"
            onClick={handleRecalculate}
            className="gigi-btn gigi-focus inline-flex items-center gap-1 rounded-lg px-3 py-1.5 text-[12.5px]"
          >
            <RefreshCw className="h-3.5 w-3.5" />
            Recalculer
          </button>
        )}
        {canClose && (
          <button
            type="button"
            onClick={handleClose}
            className="gigi-btn gigi-focus inline-flex items-center gap-1 rounded-lg px-3 py-1.5 text-[12.5px] ring-1 ring-emerald-400/30"
          >
            <Lock className="h-3.5 w-3.5" />
            Fermer cycle
          </button>
        )}
        {onArchive && (
          <button
            type="button"
            onClick={onArchive}
            className="gigi-btn gigi-focus inline-flex items-center gap-1 rounded-lg px-2.5 py-1 text-[11.5px] text-text-muted"
          >
            <Archive className="h-3.5 w-3.5" />
            Archiver
          </button>
        )}
      </div>
      {message && <p className="text-[11.5px] text-emerald-300/90">{message}</p>}
      <p className="text-[11px] text-text-muted">
        Recommandations locales — Gigi n&apos;exécute, n&apos;approuve et ne ferme rien automatiquement.
      </p>
    </div>
  );
}
