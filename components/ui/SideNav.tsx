"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Target, MessageCircle, Layers, Compass, Clock } from "lucide-react";
import { APP_NAME, NAV_ITEMS } from "@/lib/constants";
import { GigiOrb } from "./GigiOrb";
import { LocalResetButton } from "./LocalResetButton";
import { AuthAccountStrip } from "./AuthAccountStrip";
import { MemoryStatusStrip } from "@/components/memory/MemoryStatusStrip";
import { useGigi } from "@/components/providers/GigiProvider";
import { cn } from "@/lib/utils";
import { DAILY_USE_GUARDRAILS, SIDEBAR_FEEDBACK_LABEL, SIDEBAR_READY_LABEL } from "@/modules/dailyUse";

const iconMap = {
  target: Target,
  message: MessageCircle,
  layers: Layers,
  brain: Compass,
  clock: Clock,
} as const;

const PRIMARY = new Set(["/", "/conversation"]);

export function SideNav() {
  const pathname = usePathname();
  const { resetLocalData } = useGigi();

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
          "gigi-focus group flex items-center gap-3 rounded-lg px-3 py-2 text-[14px] transition-colors",
          isActive
            ? "bg-white/[0.06] text-text-primary"
            : "text-text-secondary hover:bg-white/[0.03] hover:text-text-primary"
        )}
      >
        <Icon
          className={cn(
            "h-[17px] w-[17px] shrink-0",
            isActive ? "text-accent" : "text-text-muted group-hover:text-text-secondary"
          )}
          strokeWidth={1.9}
        />
        <span className={isActive ? "font-medium" : ""}>{item.label}</span>
      </Link>
    );
  };

  return (
    <aside className="sticky top-0 hidden h-screen w-[260px] shrink-0 flex-col border-r border-border bg-bg-sidebar px-4 py-5 lg:flex">
      <div className="flex items-center gap-2.5 px-2 pb-5">
        <GigiOrb size="sm" />
        <span className="font-display text-[16px] tracking-tight text-text-primary">
          {APP_NAME}
        </span>
      </div>

      <div
        className="mb-4 rounded-lg border border-border bg-surface px-3 py-2"
        title={DAILY_USE_GUARDRAILS.long}
      >
        <div className="flex items-center gap-2">
          <span className="h-1.5 w-1.5 rounded-full bg-ok" aria-hidden />
          <span className="text-[12.5px] text-text-secondary">{SIDEBAR_READY_LABEL}</span>
        </div>
        <p className="mt-1 pl-3.5 text-[10.5px] leading-snug text-text-muted">
          {DAILY_USE_GUARDRAILS.short}
        </p>
      </div>

      <p className="px-3 pb-1.5 text-[11px] font-medium uppercase tracking-wider text-text-muted">
        Principal
      </p>
      <nav className="flex flex-col gap-0.5">{primary.map(renderLink)}</nav>

      <p className="px-3 pb-1.5 pt-5 text-[11px] font-medium uppercase tracking-wider text-text-muted">
        Contexte
      </p>
      <nav className="flex flex-col gap-0.5">{secondary.map(renderLink)}</nav>

      <div className="mt-auto space-y-3 border-t border-border px-3 pt-4">
        <Link
          href="/feedback"
          className="gigi-focus block text-[12px] text-text-muted hover:text-text-secondary"
        >
          {SIDEBAR_FEEDBACK_LABEL}
        </Link>
        <AuthAccountStrip />
        <MemoryStatusStrip />
        <LocalResetButton onReset={resetLocalData} />
      </div>
    </aside>
  );
}
