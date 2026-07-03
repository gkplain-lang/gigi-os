"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Brain, Clock, Layers, Target } from "lucide-react";
import { NAV_ITEMS } from "@/lib/constants";
import { cn } from "@/lib/utils";

const iconMap = {
  target: Target,
  layers: Layers,
  brain: Brain,
  clock: Clock,
} as const;

export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed inset-x-0 bottom-0 z-50 px-4 pb-5 md:hidden">
      <div className="mx-auto flex max-w-md items-center justify-around rounded-[24px] bg-[rgba(9,14,13,0.9)] px-2 py-2 shadow-[0_-4px_40px_-12px_rgba(0,0,0,0.7),inset_0_1px_0_rgba(255,255,255,0.04)] backdrop-blur-2xl">
        {NAV_ITEMS.map((item) => {
          const Icon = iconMap[item.icon];
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex flex-1 flex-col items-center gap-1 rounded-[18px] py-2.5 text-[11px] font-medium transition-colors",
                isActive ? "text-text-primary" : "text-text-muted"
              )}
            >
              <Icon className={cn("h-[20px] w-[20px]", isActive && "text-copper-soft")} />
              {item.label}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
