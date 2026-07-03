import type { ButtonHTMLAttributes, ReactNode } from "react";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface PrimaryButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  fullWidth?: boolean;
}

export function PrimaryButton({
  children,
  className,
  fullWidth,
  ...props
}: PrimaryButtonProps) {
  return (
    <button
      type="button"
      className={cn(
        "gigi-cta group inline-flex items-center justify-center gap-2.5 rounded-[22px] px-7 py-4 text-[15px] font-medium text-text-primary",
        fullWidth && "w-full",
        className
      )}
      {...props}
    >
      {children}
      <ArrowRight className="h-[18px] w-[18px] text-copper-soft transition-transform group-hover:translate-x-0.5" />
    </button>
  );
}
