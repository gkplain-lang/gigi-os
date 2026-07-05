import Link from "next/link";
import { LandingHero } from "./LandingHero";
import { LandingProblemSolution } from "./LandingProblemSolution";
import { LandingHowItWorks } from "./LandingHowItWorks";
import { LandingAudience } from "./LandingAudience";
import { LandingSafety } from "./LandingSafety";
import { LandingBetaCTA } from "./LandingBetaCTA";

export function LandingPageContent() {
  return (
    <div className="gigi-page-shell animate-fade-in mx-auto max-w-[820px]">
      <div className="gigi-page-spotlight" aria-hidden />
      <div className="gigi-page-content">
        <p className="gigi-mission-control-label mb-4">Présentation · Gigi V3.5</p>
        <LandingHero />
        <LandingProblemSolution />
        <LandingHowItWorks />
        <LandingAudience />
        <LandingSafety />
        <LandingBetaCTA />
        <div className="mt-8 flex flex-wrap gap-4 border-t border-border/40 pt-6 text-[13px]">
          <Link href="/onboarding" className="gigi-focus text-accent-soft hover:underline">
            Démarrer →
          </Link>
          <Link href="/" className="gigi-focus text-text-muted hover:text-text-secondary">
            Ouvrir l&apos;app
          </Link>
        </div>
      </div>
    </div>
  );
}
