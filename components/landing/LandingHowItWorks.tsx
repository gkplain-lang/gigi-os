import { LANDING_HOW_IT_WORKS } from "@/modules/publicEntry/landingCopy";

export function LandingHowItWorks() {
  return (
    <section className="gigi-panel mt-6 rounded-xl p-5 md:p-6">
      <p className="text-[10px] font-semibold uppercase tracking-wider text-text-muted">
        {LANDING_HOW_IT_WORKS.title}
      </p>
      <ol className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {LANDING_HOW_IT_WORKS.steps.map((step) => (
          <li
            key={step.n}
            className="rounded-lg border border-border/50 bg-surface-2/20 px-4 py-3"
          >
            <span className="text-[11px] font-bold tabular-nums text-accent-soft">
              {step.n}.
            </span>
            <p className="mt-1 text-[14px] font-medium text-text-primary">{step.label}</p>
            <p className="mt-1 text-[12.5px] text-text-muted">{step.detail}</p>
          </li>
        ))}
      </ol>
    </section>
  );
}
