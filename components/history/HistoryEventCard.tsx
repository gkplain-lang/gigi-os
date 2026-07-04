import {
  Check,
  Play,
  Clock,
  X,
  Compass,
  Layers,
  FileText,
  RotateCcw,
  type LucideIcon,
} from "lucide-react";
import type { HistoryEvent, HistoryEventType } from "@/modules/history/historyTypes";
import { cn } from "@/lib/utils";

interface HistoryEventCardProps {
  event: HistoryEvent;
}

const ICONS: Record<HistoryEventType, LucideIcon> = {
  mission_completed: Check,
  mission_started: Play,
  mission_postponed: Clock,
  mission_rejected: X,
  decision_created: Compass,
  project_updated: Layers,
  document_created: FileText,
  data_reset: RotateCcw,
};

const WARM_TYPES = new Set<HistoryEventType>([
  "mission_completed",
  "decision_created",
  "mission_started",
]);

function formatDate(iso: string): string {
  const parts = iso.split("-");
  if (parts.length !== 3) return "";
  const [, m, d] = parts;
  const months = [
    "janv.", "févr.", "mars", "avr.", "mai", "juin",
    "juil.", "août", "sept.", "oct.", "nov.", "déc.",
  ];
  const mi = Number(m) - 1;
  return `${Number(d)} ${months[mi] ?? ""}`.trim();
}

export function HistoryEventCard({ event }: HistoryEventCardProps) {
  const Icon = ICONS[event.type] ?? Compass;
  const warm = WARM_TYPES.has(event.type);

  return (
    <div className="relative flex gap-4">
      <span
        className={cn(
          "relative z-10 flex h-8 w-8 shrink-0 items-center justify-center rounded-full",
          warm ? "bg-accent/15 text-accent-soft shadow-[0_0_12px_-6px_rgba(124,140,255,0.5)]" : "bg-white/[0.04] text-text-secondary"
        )}
      >
        <Icon className="h-4 w-4" strokeWidth={2} />
      </span>
      <div className="min-w-0 flex-1 rounded-lg gigi-panel-subtle px-3 py-2.5 pb-1">
        <div className="flex items-baseline justify-between gap-3">
          <p className="text-[15px] font-medium leading-snug text-text-primary">{event.title}</p>
          <span className="shrink-0 text-[12px] tabular-nums text-text-muted">
            {formatDate(event.date)}
          </span>
        </div>
        {event.description && (
          <p className="mt-1 text-[14px] leading-relaxed text-text-muted">{event.description}</p>
        )}
        {event.meta?.projectName && (
          <p className="mt-1 text-[12.5px] text-text-muted/80">
            {event.meta.projectName}
            {event.meta.nextStep ? ` · Suite : ${event.meta.nextStep}` : ""}
          </p>
        )}
      </div>
    </div>
  );
}
