import { notFound } from "next/navigation";
import { getExhibition } from "@/lib/supabase/queries";
import { EditExhibitionForm } from "@/components/admin/edit-exhibition-form";

export default async function EditExhibitionPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const exhibition = await getExhibition(id);
  if (!exhibition) return notFound();

  return (
    <div className="max-w-xl">
      <div className="mb-6">
        <h1 className="text-xl font-extrabold">전시 수정</h1>
        <p className="text-sm text-muted-foreground mt-1">{exhibition.name}</p>
      </div>
      <EditExhibitionForm exhibition={exhibition} />
    </div>
  );
}
