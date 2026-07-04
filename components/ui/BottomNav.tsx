"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Target, MessageCircle, Layers, Compass, Clock } from "lucide-react";
import { NAV_ITEMS } from "@/lib/constants";
import { cn } from "@/lib/utils";

const iconMap = {
  target: Target,
  message: MessageCircle,
  layers: Layers,
  brain: Compass,
  clock: Clock,
} as const;

export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed inset-x-0 bottom-0 z-50 border-t border-border bg-bg-sidebar/95 backdrop-blur-xl lg:hidden">
      <div className="mx-auto flex max-w-md items-stretch justify-around px-1.5 py-1">
        {NAV_ITEMS.map((item) => {
          const Icon = iconMap[item.icon];
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              aria-current={isActive ? "page" : undefined}
              className={cn(
                "gigi-focus flex flex-1 flex-col items-center gap-1 rounded-lg py-2 text-[10px] transition-colors",
                isActive ? "text-text-primary" : "text-text-muted"
              )}
            >
              <Icon
                className={cn("h-[19px] w-[19px]", isActive && "text-accent-soft")}
                strokeWidth={1.9}
              />
              <span className={isActive ? "font-medium" : ""}>{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
