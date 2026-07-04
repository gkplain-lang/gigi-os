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
    <div className="gigi-app-bg relative min-h-screen">
      <div className="relative z-10 mx-auto flex min-h-screen w-full max-w-[1200px]">
        {/* Desktop sidebar — borderless, calm, lots of air */}
        <aside className="hidden w-64 shrink-0 flex-col px-6 py-10 lg:flex">
          <div className="flex items-center gap-3 px-2">
            <GigiOrb size="md" />
            <div>
              <p className="font-display text-lg leading-none text-text-primary">{APP_NAME}</p>
              <p className="mt-1.5 text-[13px] text-text-muted">{APP_TAGLINE}</p>
            </div>
          </div>

          <nav className="mt-14 flex flex-col gap-1">
            {NAV_ITEMS.map((item) => {
              const Icon = iconMap[item.icon];
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "group flex items-center gap-3.5 rounded-2xl px-4 py-3 text-[15px] transition-all duration-200",
                    isActive
                      ? "bg-[rgba(184,115,51,0.12)] text-text-primary"
                      : "text-text-muted hover:bg-white/[0.03] hover:text-text-secondary"
                  )}
                >
                  <Icon
                    className={cn(
                      "h-[18px] w-[18px] transition-colors",
                      isActive
                        ? "text-copper-soft"
                        : "text-text-muted group-hover:text-text-secondary"
                    )}
                  />
                  {item.label}
                </Link>
              );
            })}
          </nav>

          <div className="mt-auto space-y-5 px-2 pt-8">
            <GigiPresence />
            <LocalResetButton onReset={resetLocalData} />
          </div>
        </aside>

        {/* Main column */}
        <div className="flex min-w-0 flex-1 flex-col">
          {/* Compact top bar for mobile / tablet */}
          <header className="flex items-center justify-between px-5 pt-6 md:px-10 md:pt-8 lg:hidden">
            <div className="flex items-center gap-3">
              <GigiOrb size="sm" />
              <p className="font-display text-lg text-text-primary">{APP_NAME}</p>
            </div>

            <nav className="hidden gap-1 rounded-2xl bg-[rgba(16,22,20,0.55)] p-1.5 backdrop-blur-md md:flex">
              {NAV_ITEMS.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      "rounded-xl px-4 py-2 text-sm transition-colors",
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

          <main className="flex-1 px-5 py-10 pb-28 md:px-10 md:py-16 lg:px-14 lg:pb-16">
            <div className="mx-auto w-full max-w-3xl">{children}</div>
          </main>
        </div>
      </div>

      <BottomNav />
    </div>
  );
}
