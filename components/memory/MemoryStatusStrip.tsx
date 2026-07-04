"use client";

import Link from "next/link";
import { formatMemoryBackupDate, useMemoryStatus } from "@/modules/memory";
import { cn } from "@/lib/utils";

function dotClass(mode: string): string {
  switch (mode) {
    case "connected_recently_backed_up":
    case "connected_backup_available":
      return "bg-ok";
    case "connected_conflict":
      return "bg-accent/70";
    case "supabase_error":
      return "bg-text-muted/60";
    default:
      return "bg-text-muted/50";
  }
}

interface MemoryStatusStripProps {
  variant?: "sidebar" | "mobile";
}

export function MemoryStatusStrip({ variant = "sidebar" }: MemoryStatusStripProps) {
  const { memoryStatus, backupState, backupNow, error, lastResult } = useMemoryStatus();
  const { mode, label, message, canBackup, canOpenAuth, lastBackupAt } = memoryStatus;

  const formattedBackup = formatMemoryBackupDate(lastBackupAt);
  const isSaving = backupState === "saving";

  if (variant === "mobile") {
    return (
      <Link
        href="/memory"
        className="gigi-focus ml-2 flex max-w-[42%] items-center gap-1.5 truncate rounded-md px-1 py-0.5 text-[10px] text-text-muted transition-colors hover:text-text-secondary"
        title={message}
      >
        <span className={cn("h-1 w-1 shrink-0 rounded-full", dotClass(mode))} aria-hidden />
        <span className="truncate">{label}</span>
      </Link>
    );
  }

  return (
    <div className="space-y-2 rounded-lg border border-border bg-surface/60 px-3 py-2.5">
      <div className="flex items-start gap-2">
        <span
          className={cn("mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full", dotClass(mode))}
          aria-hidden
        />
        <div className="min-w-0 flex-1">
          <p className="text-[12px] font-medium text-text-secondary">{label}</p>
          <p className="mt-0.5 text-[11px] leading-snug text-text-muted">{message}</p>
          {formattedBackup && (
            <p className="mt-1 text-[10.5px] text-text-muted/70">
              Dernière sauvegarde : {formattedBackup}
            </p>
          )}
          {memoryStatus.warning && (
            <p className="mt-1 text-[10.5px] text-accent-soft/90">{memoryStatus.warning}</p>
          )}
          {(error || lastResult?.status === "error") && (
            <p className="mt-1 text-[10.5px] text-text-secondary/90">
              {error ?? lastResult?.message}
            </p>
          )}
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        {canBackup && (
          <button
            type="button"
            onClick={() => void backupNow()}
            disabled={isSaving}
            className="text-[11px] text-text-muted transition-colors hover:text-text-secondary disabled:opacity-50"
          >
            {isSaving ? "Sauvegarde…" : "Sauvegarder"}
          </button>
        )}
        {canOpenAuth && (
          <Link
            href="/auth"
            className="text-[11px] text-text-muted transition-colors hover:text-text-secondary"
          >
            Connexion
          </Link>
        )}
        <Link
          href="/memory"
          className="text-[11px] text-text-muted/70 transition-colors hover:text-text-muted"
        >
          Voir mémoire
        </Link>
      </div>
    </div>
  );
}
