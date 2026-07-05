import { LANDING_SAFETY } from "@/modules/publicEntry/landingCopy";

export function LandingSafety() {
  return (
    <section className="mt-6 rounded-xl border border-amber-500/25 bg-amber-500/5 p-5 md:p-6">
      <p className="text-[10px] font-semibold uppercase tracking-wider text-amber-200/90">
        {LANDING_SAFETY.title}
      </p>
      <ul className="mt-3 space-y-1.5">
        {LANDING_SAFETY.items.map((item) => (
          <li key={item} className="text-[13px] leading-relaxed text-text-secondary">
            {item}
          </li>
        ))}
      </ul>
      <p className="mt-4 text-[12.5px] italic text-text-muted">{LANDING_SAFETY.note}</p>
    </section>
  );
}
