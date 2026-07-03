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
      <p className="mt-1 text-sm text-text-muted">Ils comptent — mais pas aujourd&apos;hui.</p>

      <ul className="mt-5 divide-y divide-white/[0.05]">
        {alternatives.map((alt) => (
          <li key={alt.projectName} className="flex items-baseline gap-4 py-3.5">
            <span className="w-36 shrink-0 text-[15px] font-medium text-text-primary">
              {alt.projectName}
            </span>
            <span className="text-sm leading-relaxed text-text-muted">{alt.reason}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}
