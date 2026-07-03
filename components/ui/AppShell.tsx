"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Brain, Clock, Layers, Target } from "lucide-react";
import { APP_NAME, APP_TAGLINE, NAV_ITEMS } from "@/lib/constants";
import { GigiOrb } from "./GigiOrb";
import { GigiPresence } from "./GigiPresence";
import { BottomNav } from "./BottomNav";
import { LocalResetButton } from "./LocalResetButton";
import { useGigi } from "@/components/providers/GigiProvider";
import { cn } from "@/lib/utils";

const iconMap = {
  target: Target,
  layers: Layers,
  brain: Brain,
  clock: Clock,
} as const;

interface AppShellProps {
  children: React.ReactNode;
}

export function AppShell({ children }: AppShellProps) {
  const pathname = usePathname();
  const { resetLocalData } = useGigi();

  return (
    <div className="gigi-app-bg min-h-screen">
      <div className="mx-auto flex min-h-screen w-full max-w-6xl">
        {/* Desktop sidebar — borderless, calm */}
        <aside className="hidden w-60 shrink-0 flex-col px-5 py-9 lg:flex xl:w-64">
          <div className="flex items-center gap-3 px-2">
            <GigiOrb size="md" />
            <div>
              <p className="font-display text-lg leading-none text-text-primary">{APP_NAME}</p>
              <p className="mt-1.5 text-[13px] text-text-muted">{APP_TAGLINE}</p>
            </div>
          </div>

          <nav className="mt-12 flex flex-col gap-1.5">
            {NAV_ITEMS.map((item) => {
              const Icon = iconMap[item.icon];
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3.5 rounded-[18px] px-4 py-3 text-[15px] transition-colors",
                    isActive
                      ? "bg-[rgba(184,115,51,0.13)] text-text-primary"
                      : "text-text-muted hover:bg-white/[0.03] hover:text-text-secondary"
                  )}
                >
                  <Icon
                    className={cn("h-[18px] w-[18px]", isActive ? "text-copper-soft" : "text-text-muted")}
                  />
                  {item.label}
                </Link>
              );
            })}
          </nav>

          <div className="mt-auto space-y-4 px-2 pt-8">
            <GigiPresence />
            <LocalResetButton onReset={resetLocalData} />
          </div>
        </aside>

        {/* Main column */}
        <div className="flex min-w-0 flex-1 flex-col">
          {/* Compact top bar for mobile / tablet */}
          <header className="flex items-center justify-between px-5 pt-6 md:px-8 md:pt-7 lg:hidden">
            <div className="flex items-center gap-3">
              <GigiOrb size="sm" />
              <p className="font-display text-lg text-text-primary">{APP_NAME}</p>
            </div>

            <nav className="hidden gap-1 rounded-[18px] bg-[rgba(16,22,20,0.6)] p-1.5 md:flex">
              {NAV_ITEMS.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      "rounded-[13px] px-3.5 py-2 text-sm transition-colors",
                      isActive
                        ? "bg-[rgba(184,115,51,0.14)] text-text-primary"
                        : "text-text-muted hover:text-text-secondary"
                    )}
                  >
                    {item.label}
                  </Link>
                );
              })}
            </nav>
          </header>

          <main className="flex-1 px-5 py-8 pb-28 md:px-8 md:py-12 lg:pb-12">
            {children}
          </main>
        </div>
      </div>

      <BottomNav />
    </div>
  );
}
