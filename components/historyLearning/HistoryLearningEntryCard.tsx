import type { HistoryLearningEntry } from "@/modules/historyLearning";
import {
  HISTORY_OUTCOME_LABELS,
  HISTORY_STATUS_LABELS,
} from "@/modules/historyLearning";
import { cn } from "@/lib/utils";

interface HistoryLearningEntryCardProps {
  entry: HistoryLearningEntry;
  onArchive?: (id: string) => void;
  onCopy?: (entry: HistoryLearningEntry) => void;
  className?: string;
}

export function HistoryLearningEntryCard({
  entry,
  onArchive,
  onCopy,
  className,
}: HistoryLearningEntryCardProps) {
  return (
    <article
      className={cn(
        "rounded-lg border border-border bg-surface-2/30 px-4 py-3",
        className
      )}
    >
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-[10px] font-semibold uppercase tracking-wide text-accent-soft">
          {HISTORY_STATUS_LABELS[entry.status]}
        </span>
        <span className="text-[10px] text-text-muted">
          {HISTORY_OUTCOME_LABELS[entry.outcome]}
        </span>
        {entry.metadata?.projectName && (
          <span className="text-[10px] text-text-muted">{entry.metadata.projectName}</span>
        )}
      </div>
      <h4 className="mt-2 text-[14px] font-medium text-text-primary">{entry.title}</h4>
      <p className="mt-1 text-[13px] leading-relaxed text-text-secondary">{entry.summary}</p>

      {entry.signals.length > 0 && (
        <ul className="mt-3 space-y-1">
          {entry.signals.slice(0, 4).map((s) => (
            <li key={s.id} className="text-[12px] text-text-muted">
              · {s.label}
            </li>
          ))}
        </ul>
      )}

      {entry.learnings.length > 0 && (
        <div className="mt-3 rounded border border-border/60 bg-surface/40 px-3 py-2">
          <p className="text-[10px] font-semibold uppercase tracking-wider text-text-muted">
            Apprentissage
          </p>
          <p className="mt-1 text-[12.5px] text-text-secondary">
            {entry.learnings[0].content}
          </p>
        </div>
      )}

      <div className="mt-3 flex flex-wrap gap-2">
        {onCopy && (
          <button
            type="button"
            onClick={() => onCopy(entry)}
            className="gigi-btn gigi-focus rounded-lg px-2.5 py-1 text-[11.5px]"
          >
            Copier
          </button>
        )}
        {onArchive && entry.status !== "archived" && (
          <button
            type="button"
            onClick={() => onArchive(entry.id)}
            className="gigi-btn gigi-focus rounded-lg px-2.5 py-1 text-[11.5px]"
          >
            Archiver
          </button>
        )}
      </div>
    </article>
  );
}
