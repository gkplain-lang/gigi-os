import type { AlternativeConsidered } from "@/modules/decision-engine/decisionTypes";

interface AlternativesListProps {
  alternatives: AlternativeConsidered[];
}

export function AlternativesList({ alternatives }: AlternativesListProps) {
  return (
    <div className="gigi-panel rounded-xl p-5">
      <p className="text-[11px] font-medium uppercase tracking-wider text-text-muted">
        Pourquoi pas les autres ?
      </p>
      <ul className="mt-3 divide-y divide-border">
        {alternatives.map((alt) => (
          <li key={alt.projectName} className="flex items-baseline gap-3 py-2.5 first:pt-0 last:pb-0">
            <span className="w-32 shrink-0 text-[13.5px] font-medium text-text-secondary">
              {alt.projectName}
            </span>
            <span className="text-[13px] leading-relaxed text-text-muted">{alt.reason}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
