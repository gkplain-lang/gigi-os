"use client";

import { MISSION_REVIEW_TEMPLATES } from "@/modules/missionReview";

interface MissionReviewTemplateGalleryProps {
  onSelect: (templateId: string) => void;
}

export function MissionReviewTemplateGallery({ onSelect }: MissionReviewTemplateGalleryProps) {
  return (
    <ul className="space-y-2">
      {MISSION_REVIEW_TEMPLATES.map((t) => (
        <li
          key={t.id}
          className="flex flex-wrap items-center justify-between gap-2 rounded-lg border border-border/30 px-3 py-2.5"
        >
          <div>
            <p className="text-[12.5px] font-medium text-text-primary">{t.title}</p>
            <p className="text-[11px] text-text-muted">{t.signal}</p>
          </div>
          <button
            type="button"
            onClick={() => onSelect(t.id)}
            className="gigi-btn-secondary gigi-focus shrink-0 rounded-lg px-2.5 py-1 text-[11px] font-medium"
          >
            Utiliser ce modèle
          </button>
        </li>
      ))}
    </ul>
  );
}
