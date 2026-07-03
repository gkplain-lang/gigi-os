import type { ButtonHTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/utils";

interface GhostButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
}

export function GhostButton({ children, className, ...props }: GhostButtonProps) {
  return (
    <button
      type="button"
      className={cn(
        "rounded-[18px] px-4 py-3 text-[15px] text-text-muted transition-colors hover:text-text-secondary",
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}
