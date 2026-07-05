import Link from "next/link";
import { BETA_TESTER_SCENARIOS } from "@/modules/publicEntry/betaTesterCopy";

export function OnboardingBetaChecklist() {
  return (
    <div className="rounded-lg border border-border/50 bg-surface-2/20 p-4">
      <p className="text-[10px] font-semibold uppercase tracking-wider text-text-muted">
        Checklist testeur (aperçu)
      </p>
      <ol className="mt-3 space-y-2">
        {BETA_TESTER_SCENARIOS.slice(0, 4).map((s) => (
          <li key={s.n} className="text-[12.5px] text-text-secondary">
            <span className="font-medium text-text-primary">
              {s.n}. {s.title}
            </span>
            {" — "}
            {s.action}
          </li>
        ))}
      </ol>
      <Link
        href="/beta"
        className="gigi-focus mt-3 inline-flex text-[12.5px] font-medium text-accent-soft hover:underline"
      >
        Checklist complète sur /beta →
      </Link>
    </div>
  );
}
