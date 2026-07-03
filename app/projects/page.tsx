import { SectionHeader } from "@/components/ui/SectionHeader";
import { ProjectList } from "@/components/projects/ProjectList";
import { mockProjects } from "@/data/mockProjects";

export default function ProjectsPage() {
  return (
    <div>
      <SectionHeader
        title="Projets"
        subtitle="Juste pour te situer. Gigi a déjà choisi la mission du jour — le reste attend son tour."
      />
      <ProjectList projects={mockProjects} />
    </div>
  );
}
