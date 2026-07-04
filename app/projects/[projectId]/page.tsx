import { Suspense } from "react";
import { ProjectDetailPageContent } from "@/components/projects/ProjectDetailPageContent";

interface ProjectDetailPageProps {
  params: Promise<{ projectId: string }>;
}

export default async function ProjectDetailPage({ params }: ProjectDetailPageProps) {
  const { projectId } = await params;
  return (
    <Suspense fallback={null}>
      <ProjectDetailPageContent projectId={projectId} />
    </Suspense>
  );
}
