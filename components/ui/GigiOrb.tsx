import { cn } from "@/lib/utils";

interface GigiOrbProps {
  size?: "sm" | "md" | "lg";
  className?: string;
}

const sizes = {
  sm: "h-7 w-7",
  md: "h-10 w-10",
  lg: "h-12 w-12",
};

export function GigiOrb({ size = "md", className }: GigiOrbProps) {
  return (
    <span
      className={cn("gigi-orb inline-block shrink-0 rounded-full", sizes[size], className)}
      aria-hidden
    />
  );
}
