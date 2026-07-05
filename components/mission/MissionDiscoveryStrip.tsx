import Link from "next/link";

/** Liens discrets découverte produit — V3.5 */
export function MissionDiscoveryStrip() {
  return (
    <p className="mb-4 text-[12px] leading-relaxed text-text-muted">
      Nouveau ?{" "}
      <Link href="/onboarding" className="text-accent-soft underline-offset-2 hover:underline">
        Voir l&apos;onboarding
      </Link>
      {" · "}
      <Link href="/landing" className="text-accent-soft underline-offset-2 hover:underline">
        Comprendre Gigi
      </Link>
      {" · "}
      <Link href="/beta" className="text-accent-soft underline-offset-2 hover:underline">
        Checklist bêta
      </Link>
    </p>
  );
}
