import { LANDING_AUDIENCE } from "@/modules/publicEntry/landingCopy";

export function LandingAudience() {
  return (
    <section className="gigi-panel mt-6 rounded-xl p-5 md:p-6">
      <p className="text-[10px] font-semibold uppercase tracking-wider text-text-muted">
        {LANDING_AUDIENCE.title}
      </p>
      <ul className="mt-3 flex flex-wrap gap-2">
        {LANDING_AUDIENCE.items.map((item) => (
          <li
            key={item}
            className="rounded-full border border-border/60 px-3 py-1 text-[12.5px] text-text-secondary"
          >
            {item}
          </li>
        ))}
      </ul>
    </section>
  );
}
