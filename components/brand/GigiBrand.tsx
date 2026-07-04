import { PRODUCT_NAME } from "@/lib/branding";
import { GigiMark } from "@/components/brand/GigiMark";
import { cn } from "@/lib/utils";

interface GigiBrandProps {
  size?: "sm" | "md";
  className?: string;
}

const config = {
  sm: { mark: "sm" as const, text: "text-[1.15rem]", gap: "gap-2" },
  md: { mark: "md" as const, text: "text-[1.35rem]", gap: "gap-2.5" },
};

/**
 * Product lockup — focus arc + "Gigi" wordmark. The word dominates;
 * the mark stays a subtle companion.
 */
export function GigiBrand({ size = "md", className }: GigiBrandProps) {
  const c = config[size];
  return (
    <span className={cn("inline-flex items-center", c.gap, className)}>
      <GigiMark size={c.mark} title={PRODUCT_NAME} />
      <span
        className={cn(
          "font-display font-medium leading-none tracking-[-0.02em] text-[#f4f6fb]",
          c.text
        )}
      >
        {PRODUCT_NAME}
      </span>
    </span>
  );
}
