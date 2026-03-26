import { notFound } from "next/navigation";
import { ExhibitionDetail } from "@/components/exhibition/exhibition-detail";
import {
  getExhibition,
  getLeadsByExhibition,
  getTasksByExhibition,
  getCostsByExhibition,
  getMeetingsByExhibition,
} from "@/lib/supabase/queries";

export default async function ExhibitionPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const [exhibition, leads, tasks, costs, meetings] = await Promise.all([
    getExhibition(id),
    getLeadsByExhibition(id),
    getTasksByExhibition(id),
    getCostsByExhibition(id),
    getMeetingsByExhibition(id),
  ]);
  if (!exhibition) return notFound();
  return (
    <ExhibitionDetail
      exhibition={exhibition}
      leads={leads}
      tasks={tasks}
      costs={costs}
      meetings={meetings}
    />
  );
}
