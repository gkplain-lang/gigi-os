import Link from "next/link";
import { GigiBrand } from "@/components/brand/GigiBrand";
import { LANDING_HERO } from "@/modules/publicEntry/landingCopy";

export function LandingHero() {
  return (
    <section className="gigi-panel-raised rounded-2xl border border-indigo-500/25 p-6 md:p-8">
      <GigiBrand size="md" className="mb-5" />
      <p className="font-display text-[26px] font-bold tracking-tight text-text-primary md:text-[32px]">
        {LANDING_HERO.tagline}
      </p>
      <p className="mt-3 max-w-2xl text-[15px] leading-relaxed text-text-secondary">
        {LANDING_HERO.subtitle}
      </p>
      <div className="mt-6 flex flex-wrap gap-3">
        <Link
          href={LANDING_HERO.primaryHref}
          className="gigi-btn-primary gigi-focus inline-flex rounded-xl px-5 py-2.5 text-[14px] font-semibold"
        >
          {LANDING_HERO.primaryCta}
        </Link>
        <Link
          href={LANDING_HERO.secondaryHref}
          className="gigi-btn-secondary gigi-focus inline-flex rounded-xl px-5 py-2.5 text-[14px] font-medium"
        >
          {LANDING_HERO.secondaryCta}
        </Link>
      </div>
    </section>
  );
}
