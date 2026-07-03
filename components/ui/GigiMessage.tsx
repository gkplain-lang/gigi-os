import { GigiOrb } from "./GigiOrb";

interface GigiMessageProps {
  primary: string;
  secondary?: string;
}

export function GigiMessage({ primary, secondary }: GigiMessageProps) {
  return (
    <div className="flex gap-4">
      <GigiOrb size="md" className="mt-1.5" />
      <div className="max-w-2xl">
        <p className="font-display text-2xl font-medium leading-snug text-text-primary md:text-[1.75rem]">
          {primary}
        </p>
        {secondary && (
          <p className="mt-2.5 text-base leading-relaxed text-text-muted md:text-lg">
            {secondary}
          </p>
        )}
      </div>
    </div>
  );
}
