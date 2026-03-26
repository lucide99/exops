import Link from "next/link";
import { getExhibitions } from "@/lib/supabase/queries";
import { ExhibitionAdminList } from "@/components/admin/exhibition-admin-list";

export default async function AdminExhibitionsPage() {
  const exhibitions = await getExhibitions();

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl font-extrabold">전시 관리</h1>
        <Link
          href="/admin/exhibitions/new"
          className="text-sm bg-primary text-primary-foreground px-4 py-2 rounded-md font-semibold hover:bg-primary/90 transition-colors"
        >
          + 새 전시 추가
        </Link>
      </div>
      <ExhibitionAdminList exhibitions={exhibitions} />
    </div>
  );
}
