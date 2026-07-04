import type { AlternativeConsidered } from "@/modules/decision-engine/decisionTypes";

interface AlternativesListProps {
  alternatives: AlternativeConsidered[];
}

export function AlternativesList({ alternatives }: AlternativesListProps) {
  return (
    <section>
      <p className="text-[13px] font-medium uppercase tracking-wide text-text-muted">
        Pourquoi pas les autres ?
      </p>
      <p className="mt-1.5 text-sm text-text-muted">Ils comptent — mais pas aujourd&apos;hui.</p>

      <ul className="mt-6 space-y-1">
        {alternatives.map((alt) => (
          <li
            key={alt.projectName}
            className="flex flex-col gap-1 py-3.5 sm:flex-row sm:items-baseline sm:gap-5"
          >
            <span className="w-36 shrink-0 text-[15px] font-medium text-text-secondary">
              {alt.projectName}
            </span>
            <span className="text-sm leading-relaxed text-text-muted">{alt.reason}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}
