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
          <header className="flex items-center gap-2.5 border-b border-border px-5 py-4 lg:hidden">
            <AegisMark size="sm" />
            <span className="font-display text-[16px] tracking-tight text-text-primary">
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
