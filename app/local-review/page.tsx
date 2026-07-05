import { Suspense } from "react";
import { LocalReviewPanel } from "@/components/localReview/LocalReviewPanel";

export default function LocalReviewPage() {
  return (
    <Suspense fallback={null}>
      <LocalReviewPanel />
    </Suspense>
  );
}
