import { useId } from "react";
import { cn } from "@/lib/utils";

interface GigiMarkProps {
  size?: "xs" | "sm" | "md" | number;
  className?: string;
  /** When set, exposes the mark as an accessible logo (otherwise decorative). */
  title?: string;
}

const presetSizes = {
  xs: "h-4 w-4",
  sm: "h-[18px] w-[18px]",
  md: "h-[22px] w-[22px]",
} as const;

/**
 * Focus arc — an open ring (~280°) opening toward the top-right.
 * Evokes focus, decision and the day opening up. Companion to the
 * "Gigi" wordmark, never a dominant pictogram.
 */
export function GigiMark({ size = "sm", className, title }: GigiMarkProps) {
  const uid = useId().replace(/:/g, "");
  const arcGradId = `gigi-arc-${uid}`;
  const isNumeric = typeof size === "number";
  const ariaProps = title
    ? { role: "img" as const, "aria-label": title }
    : { "aria-hidden": true as const };

  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn("inline-block shrink-0", !isNumeric && presetSizes[size], className)}
      style={isNumeric ? { width: size, height: size } : undefined}
      {...ariaProps}
    >
      {title ? <title>{title}</title> : null}
      <defs>
        <linearGradient id={arcGradId} x1="4" y1="18" x2="20" y2="5" gradientUnits="userSpaceOnUse">
          <stop stopColor="#7c8cff" />
          <stop offset="0.7" stopColor="#a5b4fc" />
          <stop offset="1" stopColor="#38bdf8" stopOpacity="0.85" />
        </linearGradient>
      </defs>

      {/* Open focus arc — ~280°, gap toward top-right */}
      <path
        d="M16.5 5.6A8 8 0 1 0 19 13.2"
        stroke={`url(#${arcGradId})`}
        strokeWidth="1.75"
        strokeLinecap="round"
      />
    </svg>
  );
}
