import Link from "next/link";
import { LANDING_BETA } from "@/modules/publicEntry/landingCopy";

export function LandingBetaCTA() {
  return (
    <section className="gigi-panel-raised mt-6 rounded-xl border border-indigo-500/30 p-5 md:p-6">
      <p className="text-[10px] font-semibold uppercase tracking-wider text-accent-soft">Bêta</p>
      <p className="mt-2 text-[16px] font-semibold text-text-primary">{LANDING_BETA.title}</p>
      <p className="mt-2 text-[13.5px] leading-relaxed text-text-secondary">{LANDING_BETA.body}</p>
      <Link
        href={LANDING_BETA.href}
        className="gigi-btn-primary gigi-focus mt-4 inline-flex rounded-xl px-5 py-2.5 text-[14px] font-semibold"
      >
        {LANDING_BETA.cta}
      </Link>
    </section>
  );
}
