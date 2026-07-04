import { useId } from "react";
import { cn } from "@/lib/utils";

interface AegisMarkProps {
  size?: "sm" | "md" | "lg" | number;
  className?: string;
  /** When set, exposes the mark as an accessible logo (otherwise decorative). */
  title?: string;
}

const presetSizes = {
  sm: "h-7 w-7",
  md: "h-10 w-10",
  lg: "h-12 w-12",
} as const;

export function AegisMark({ size = "sm", className, title }: AegisMarkProps) {
  const uid = useId().replace(/:/g, "");
  const shieldFillId = `aegis-shield-fill-${uid}`;
  const aStrokeId = `aegis-a-stroke-${uid}`;
  const isNumeric = typeof size === "number";
  const ariaProps = title
    ? { role: "img" as const, "aria-label": title }
    : { "aria-hidden": true as const };

  return (
    <svg
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn("inline-block shrink-0", !isNumeric && presetSizes[size], className)}
      style={isNumeric ? { width: size, height: size } : undefined}
      {...ariaProps}
    >
      {title ? <title>{title}</title> : null}
      <defs>
        <linearGradient id={shieldFillId} x1="16" y1="4" x2="16" y2="28" gradientUnits="userSpaceOnUse">
          <stop stopColor="#7c8cff" stopOpacity="0.18" />
          <stop offset="1" stopColor="#7c8cff" stopOpacity="0.04" />
        </linearGradient>
        <linearGradient id={aStrokeId} x1="16" y1="10" x2="16" y2="22" gradientUnits="userSpaceOnUse">
          <stop stopColor="#e9eeff" />
          <stop offset="1" stopColor="#a5b4fc" />
        </linearGradient>
      </defs>

      {/* Shield silhouette — protection / cockpit frame */}
      <path
        d="M16 3.5L26.25 8.25V17.25C26.25 22.1 16 27.5 16 27.5C16 27.5 5.75 22.1 5.75 17.25V8.25L16 3.5Z"
        fill={`url(#${shieldFillId})`}
        stroke="#7c8cff"
        strokeWidth="1.15"
        strokeLinejoin="round"
      />

      {/* Fine orbit — guidance / focus ring */}
      <path
        d="M10.5 14.5C11.8 11.2 14.6 9 16 9C17.4 9 20.2 11.2 21.5 14.5"
        stroke="#38bdf8"
        strokeWidth="0.65"
        strokeLinecap="round"
        strokeOpacity="0.55"
      />

      {/* Stylized A — decision / direction */}
      <path
        d="M12.25 21.25L16 10.75L19.75 21.25"
        stroke={`url(#${aStrokeId})`}
        strokeWidth="1.85"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M13.35 17.75H18.65"
        stroke={`url(#${aStrokeId})`}
        strokeWidth="1.65"
        strokeLinecap="round"
      />

      {/* Core nucleus — personal system anchor */}
      <circle cx="16" cy="13.25" r="1.35" fill="#7c8cff" />
      <circle cx="16" cy="13.25" r="2.1" stroke="#a5b4fc" strokeWidth="0.45" strokeOpacity="0.45" />
    </svg>
  );
}
