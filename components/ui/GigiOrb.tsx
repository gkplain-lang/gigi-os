import { cn } from "@/lib/utils";

interface GigiOrbProps {
  size?: "sm" | "md" | "lg";
  tone?: "warm" | "done";
  className?: string;
}

const sizes = {
  sm: "h-7 w-7",
  md: "h-10 w-10",
  lg: "h-14 w-14",
};

export function GigiOrb({ size = "md", tone = "warm", className }: GigiOrbProps) {
  return (
    <span
      className={cn(
        "gigi-orb inline-block shrink-0 rounded-full",
        tone === "done" && "gigi-orb-done",
        sizes[size],
        className
      )}
      aria-hidden
    />
  );
}
