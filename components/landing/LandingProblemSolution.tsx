import { LANDING_PROBLEM, LANDING_SOLUTION } from "@/modules/publicEntry/landingCopy";

export function LandingProblemSolution() {
  return (
    <section className="mt-6 grid gap-4 md:grid-cols-2">
      <div className="gigi-panel rounded-xl p-5 md:p-6">
        <p className="text-[10px] font-semibold uppercase tracking-wider text-text-muted">
          {LANDING_PROBLEM.title}
        </p>
        <ul className="mt-3 space-y-2">
          {LANDING_PROBLEM.items.map((item) => (
            <li key={item} className="text-[13.5px] leading-relaxed text-text-secondary">
              {item}
            </li>
          ))}
        </ul>
      </div>
      <div className="gigi-panel-raised rounded-xl border border-indigo-500/20 p-5 md:p-6">
        <p className="text-[10px] font-semibold uppercase tracking-wider text-accent-soft">
          {LANDING_SOLUTION.title}
        </p>
        <ul className="mt-3 space-y-2">
          {LANDING_SOLUTION.items.map((item) => (
            <li key={item} className="text-[13.5px] leading-relaxed text-text-primary">
              {item}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
