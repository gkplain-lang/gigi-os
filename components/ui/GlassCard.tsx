import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

type CardVariant = "surface" | "soft";

interface GlassCardProps {
  children: ReactNode;
  className?: string;
  variant?: CardVariant;
}

const variantStyles: Record<CardVariant, string> = {
  surface: "gigi-surface",
  soft: "gigi-surface-soft",
};

export function GlassCard({ children, className, variant = "surface" }: GlassCardProps) {
  return (
    <div className={cn("rounded-[28px]", variantStyles[variant], className)}>
      {children}
    </div>
  );
}
