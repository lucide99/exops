import { notFound } from "next/navigation";
import { ExhibitionDetail } from "@/components/exhibition/exhibition-detail";
import { EXHIBITIONS } from "@/data/mock";

export default async function ExhibitionPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const exhibition = EXHIBITIONS.find((e) => e.id === id);
  if (!exhibition) return notFound();
  return <ExhibitionDetail exhibition={exhibition} />;
}
