"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Target, MessageCircle, Layers, Compass, Clock, ClipboardList } from "lucide-react";
import { NAV_ITEMS, DISCOVERY_NAV_ITEMS } from "@/lib/constants";
import { GigiBrand } from "@/components/brand/GigiBrand";
import { LocalResetButton } from "./LocalResetButton";
import { AuthAccountStrip } from "./AuthAccountStrip";
import { MemoryStatusStrip } from "@/components/memory/MemoryStatusStrip";
import { useGigi } from "@/components/providers/GigiProvider";
import { cn } from "@/lib/utils";
import { SIDEBAR_READY_LABEL } from "@/modules/dailyUse";
import { SIDEBAR_LINK_LABELS, SIMULATION_NOTE } from "@/modules/dailyUseRefinement";
import { ONBOARDING_BANNER, SIDEBAR_ONBOARDING_LABEL } from "@/modules/onboarding";

const iconMap = {
  target: Target,
  message: MessageCircle,
  layers: Layers,
  actions: ClipboardList,
  brain: Compass,
  clock: Clock,
} as const;

const PRIMARY = new Set(["/", "/conversation"]);

export function SideNav() {
  const pathname = usePathname();
  const { resetLocalData, isOnboardingComplete } = useGigi();

  const primary = NAV_ITEMS.filter((i) => PRIMARY.has(i.href));
  const secondary = NAV_ITEMS.filter((i) => !PRIMARY.has(i.href));

  const renderLink = (item: (typeof NAV_ITEMS)[number]) => {
    const Icon = iconMap[item.icon];
    const isActive = pathname === item.href;
    return (
      <Link
        key={item.href}
        href={item.href}
        aria-current={isActive ? "page" : undefined}
        className={cn(
          "gigi-focus group relative flex items-center gap-3 rounded-lg px-3 py-2 text-[14px] transition-all duration-150",
          isActive
            ? "bg-[rgba(124,140,255,0.2)] text-text-primary shadow-[inset_0_0_0_1px_rgba(124,140,255,0.38),0_0_20px_-8px_rgba(124,140,255,0.45)]"
            : "text-text-secondary hover:bg-white/[0.05] hover:text-text-primary"
        )}
      >
        {isActive && (
          <span
            className="absolute left-0 top-1/2 h-6 w-1 -translate-y-1/2 rounded-full bg-accent-soft shadow-[0_0_12px_rgba(165,180,252,0.9)]"
            aria-hidden
          />
        )}
        <Icon
          className={cn(
            "h-[17px] w-[17px] shrink-0",
            isActive ? "text-accent-soft" : "text-text-muted group-hover:text-text-secondary"
          )}
          strokeWidth={1.9}
        />
        <span className={isActive ? "font-medium" : ""}>{item.label}</span>
      </Link>
    );
  };

  return (
    <aside className="gigi-sidebar-shell sticky top-0 hidden h-screen w-[260px] shrink-0 flex-col px-4 py-5 lg:flex">
      <Link href="/" className="gigi-focus flex items-center px-2 pb-5">
        <GigiBrand size="md" />
      </Link>

      <div
        className="gigi-status-ready mb-4 rounded-lg px-3 py-2.5"
        title={SIMULATION_NOTE.long}
      >
        <div className="flex items-center gap-2">
          <span className="relative flex h-2 w-2 items-center justify-center" aria-hidden>
            <span className="absolute h-2 w-2 animate-ping rounded-full bg-accent/50" />
            <span className="h-1.5 w-1.5 rounded-full bg-accent-soft shadow-[0_0_6px_rgba(124,140,255,0.6)]" />
          </span>
          <span className="text-[12.5px] font-medium text-text-primary">{SIDEBAR_READY_LABEL}</span>
        </div>
        <p className="mt-1 pl-4 text-[10.5px] leading-snug text-text-secondary">
          {SIMULATION_NOTE.short}
        </p>
      </div>

      <p className="px-3 pb-1.5 text-[11px] font-semibold uppercase tracking-wider text-accent-soft/70">
        Principal
      </p>
      <nav className="flex flex-col gap-0.5">{primary.map(renderLink)}</nav>

      <p className="px-3 pb-1.5 pt-5 text-[11px] font-semibold uppercase tracking-wider text-text-secondary">
        Contexte
      </p>
      <nav className="flex flex-col gap-0.5">{secondary.map(renderLink)}</nav>

      <p className="px-3 pb-1.5 pt-5 text-[11px] font-semibold uppercase tracking-wider text-text-secondary">
        Découverte
      </p>
      <nav className="flex flex-col gap-0.5">
        {DISCOVERY_NAV_ITEMS.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              aria-current={isActive ? "page" : undefined}
              className={cn(
                "gigi-focus rounded-lg px-3 py-2 text-[13px] transition-colors",
                isActive
                  ? "bg-[rgba(124,140,255,0.12)] text-text-primary"
                  : "text-text-muted hover:bg-white/[0.04] hover:text-text-secondary"
              )}
            >
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="mt-auto space-y-3 border-t border-border px-3 pt-4">
        {!isOnboardingComplete && (
          <Link
            href="/onboarding"
            className="gigi-focus block rounded-lg border border-[rgba(124,140,255,0.35)] bg-accent-dim/50 px-2.5 py-2 text-[12px] font-medium text-accent-soft shadow-[0_0_16px_-8px_rgba(124,140,255,0.5)] transition-colors hover:text-text-primary"
            title={ONBOARDING_BANNER.body}
          >
            {SIDEBAR_ONBOARDING_LABEL}
          </Link>
        )}
        <Link
          href="/permissions"
          className="gigi-focus block text-[12px] text-text-muted hover:text-text-secondary"
        >
          Permissions
        </Link>
        <Link
          href="/settings"
          className="gigi-focus block text-[12px] text-text-muted hover:text-text-secondary"
        >
          Réglages
        </Link>
        <Link
          href="/feedback"
          className="gigi-focus block text-[12px] text-text-muted hover:text-text-secondary"
        >
          {SIDEBAR_LINK_LABELS.giveFeedback}
        </Link>
        <Link
          href="/beta"
          className="gigi-focus block text-[12px] text-text-muted hover:text-text-secondary"
        >
          Parcours bêta
        </Link>
        <AuthAccountStrip />
        <MemoryStatusStrip />
        <LocalResetButton onReset={resetLocalData} />
      </div>
    </aside>
  );
}
