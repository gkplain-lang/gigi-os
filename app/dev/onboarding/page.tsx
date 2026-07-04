"use client";

import { DevPageLayout } from "@/components/dev/DevPageLayout";
import { OnboardingDevPanel } from "./OnboardingDevPanel";

const IS_PROD = process.env.NODE_ENV === "production";

export default function DevOnboardingPage() {
  if (IS_PROD) {
    return (
      <div className="p-8 text-text-secondary">Page de développement indisponible en production.</div>
    );
  }

  return (
    <DevPageLayout
      label="Dev · Onboarding"
      title="V1.4 Onboarding & First Run"
      description="État onboarding, données locales et reset — localStorage only, aucune action externe."
      links={[
        { href: "/onboarding", label: "/onboarding" },
        { href: "/", label: "Mission du jour" },
        { href: "/dev/release", label: "Dev · Release" },
        { href: "/dev/beta", label: "Dev · Beta" },
      ]}
    >
      <OnboardingDevPanel />
    </DevPageLayout>
  );
}
