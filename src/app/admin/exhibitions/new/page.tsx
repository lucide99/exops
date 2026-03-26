import { NewExhibitionForm } from "@/components/admin/new-exhibition-form";

export default function NewExhibitionPage() {
  return (
    <div className="max-w-xl">
      <div className="mb-6">
        <h1 className="text-xl font-extrabold">새 전시 추가</h1>
        <p className="text-sm text-muted-foreground mt-1">
          생성 시 기본 게이트 6개가 자동으로 추가됩니다.
        </p>
      </div>
      <NewExhibitionForm />
    </div>
  );
}
