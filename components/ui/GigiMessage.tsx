import { GigiOrb } from "./GigiOrb";

interface GigiMessageProps {
  primary: string;
  secondary?: string;
  tone?: "warm" | "done";
}

export function GigiMessage({ primary, secondary, tone = "warm" }: GigiMessageProps) {
  return (
    <div className="flex gap-4">
      <GigiOrb size="md" tone={tone} className="mt-1" />
      <div className="max-w-2xl pt-0.5">
        <p className="font-display text-[1.6rem] font-medium leading-[1.2] text-text-primary md:text-[2rem] md:leading-[1.18]">
          {primary}
        </p>
        {secondary && (
          <p className="mt-3 text-base leading-relaxed text-text-muted md:text-lg">{secondary}</p>
        )}
      </div>
    </div>
  );
}
