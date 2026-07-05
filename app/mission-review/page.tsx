import { Suspense } from "react";
import { MissionReviewPanel } from "@/components/missionReview/MissionReviewPanel";

export default function MissionReviewPage() {
  return (
    <Suspense fallback={null}>
      <MissionReviewPanel />
    </Suspense>
  );
}
