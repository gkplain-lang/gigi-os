import type { MissionDecisionCandidate } from "@/modules/missionDecision";
import { cn } from "@/lib/utils";

const SEVERITY_STYLE: Record<string, string> = {
  info: "border-border bg-surface-2/30",
  positive: "border-emerald-500/30 bg-emerald-500/8",
  warning: "border-amber-500/30 bg-amber-500/8",
  critical: "border-red-500/25 bg-red-500/8",
};

interface MissionDecisionCandidateCardProps {
  candidate: MissionDecisionCandidate;
  selected?: boolean;
  recommended?: boolean;
  onSelect?: () => void;
  className?: string;
}

export function MissionDecisionCandidateCard({
  candidate,
  selected = false,
  recommended = false,
  onSelect,
  className,
}: MissionDecisionCandidateCardProps) {
  return (
    <article
      className={cn(
        "rounded-xl border px-4 py-3 transition-colors",
        selected
          ? "border-[rgba(124,140,255,0.45)] bg-[rgba(124,140,255,0.08)]"
          : "border-border bg-surface-2/25",
        recommended && !selected && "border-[rgba(124,140,255,0.25)]",
        className
      )}
    >
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-[10px] font-semibold uppercase tracking-wide text-accent-soft">
          {candidate.score}/100 · conf. {candidate.confidence}%
        </span>
        {recommended && (
          <span className="rounded-full border border-accent/40 bg-accent/10 px-2 py-0.5 text-[10px] font-semibold text-accent-soft">
            Recommandée
          </span>
        )}
        {candidate.metadata?.projectName && (
          <span className="text-[10px] text-text-muted">{candidate.metadata.projectName}</span>
        )}
      </div>

      <h4 className="mt-2 text-[14px] font-medium text-text-primary">{candidate.title}</h4>
      <p className="mt-1 text-[13px] leading-relaxed text-text-secondary">
        {candidate.description}
      </p>

      {candidate.reasons.length > 0 && (
        <ul className="mt-2 space-y-1">
          {candidate.reasons.slice(0, 3).map((r) => (
            <li key={r.id} className="text-[12px] text-text-muted">
              · {r.label}
            </li>
          ))}
        </ul>
      )}

      {candidate.risks.length > 0 && (
        <div className="mt-2">
          {candidate.risks.slice(0, 2).map((r) => (
            <p
              key={r.id}
              className={cn(
                "mt-1 rounded border px-2 py-1 text-[11.5px]",
                SEVERITY_STYLE[r.severity]
              )}
            >
              ⚠ {r.label}
            </p>
          ))}
        </div>
      )}

      {onSelect && (
        <button
          type="button"
          onClick={onSelect}
          className="gigi-btn gigi-focus mt-3 rounded-lg px-2.5 py-1 text-[11.5px]"
        >
          {selected ? "Sélectionnée" : "Sélectionner"}
        </button>
      )}
    </article>
  );
}
