"use client";

import { APP_NAME } from "@/lib/constants";
import { AegisMark } from "@/components/brand/AegisMark";
import { SideNav } from "./SideNav";
import { BottomNav } from "./BottomNav";
import { AuthMobileLink } from "./AuthAccountStrip";
import { MemoryStatusStrip } from "@/components/memory/MemoryStatusStrip";

interface AppShellProps {
  children: React.ReactNode;
}

export function AppShell({ children }: AppShellProps) {
  return (
    <div className="min-h-screen bg-bg-base">
      <div className="flex min-h-screen">
        <SideNav />

        <div className="flex min-w-0 flex-1 flex-col">
          {/* Mobile identity bar */}
          <header className="flex items-center gap-3 border-b border-[rgba(124,140,255,0.18)] px-5 py-4 lg:hidden">
            <span className="relative flex shrink-0">
              <span className="absolute inset-0 scale-150 rounded-full bg-accent/25 blur-md" aria-hidden />
              <AegisMark size="sm" className="relative drop-shadow-[0_0_10px_rgba(124,140,255,0.6)]" />
            </span>
            <span className="font-display text-[16px] font-medium tracking-tight text-text-primary">
              {APP_NAME}
            </span>
            <MemoryStatusStrip variant="mobile" />
            <AuthMobileLink />
          </header>

          <main className="flex-1 px-5 pb-24 pt-6 md:px-8 lg:px-10 lg:pb-10 lg:pt-9">
            <div className="mx-auto w-full max-w-[1080px]">{children}</div>
          </main>
        </div>
      </div>

      <BottomNav />
    </div>
  );
}
