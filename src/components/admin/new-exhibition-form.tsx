"use client";

import { useActionState } from "react";
import { createExhibition } from "@/lib/supabase/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";

export function NewExhibitionForm() {
  const [error, action, isPending] = useActionState(
    async (_: string | null, formData: FormData) => {
      try {
        await createExhibition(formData);
        return null;
      } catch (e) {
        return (e as Error).message;
      }
    },
    null
  );

  return (
    <form action={action} className="space-y-5">
      <div className="space-y-1.5">
        <Label htmlFor="name">전시명 *</Label>
        <Input id="name" name="name" placeholder="CES 2026" required />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <Label htmlFor="city">도시 *</Label>
          <Input id="city" name="city" placeholder="Las Vegas" required />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="country">국가코드 (2자리) *</Label>
          <Input id="country" name="country" placeholder="US" maxLength={2} required />
        </div>
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="venue_name">전시장명 *</Label>
        <Input id="venue_name" name="venue_name" placeholder="Las Vegas Convention Center" required />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <Label htmlFor="starts_at">시작일 *</Label>
          <Input id="starts_at" name="starts_at" type="date" required />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="ends_at">종료일 *</Label>
          <Input id="ends_at" name="ends_at" type="date" required />
        </div>
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="budget_usd">예산 (USD)</Label>
        <Input id="budget_usd" name="budget_usd" type="number" min="0" placeholder="100000" />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <Label htmlFor="goal_leads">목표 리드 수</Label>
          <Input id="goal_leads" name="goal_leads" type="number" min="0" placeholder="100" />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="goal_meetings">목표 미팅 수</Label>
          <Input id="goal_meetings" name="goal_meetings" type="number" min="0" placeholder="20" />
        </div>
      </div>

      {error && (
        <p className="text-sm text-destructive">{error}</p>
      )}

      <div className="flex gap-3 pt-2">
        <Button type="submit" disabled={isPending}>
          {isPending ? "생성 중..." : "전시 생성"}
        </Button>
        <Link
          href="/admin/exhibitions"
          className="inline-flex items-center justify-center px-4 py-2 text-sm font-semibold border border-border rounded-md text-muted-foreground hover:bg-accent transition-colors"
        >
          취소
        </Link>
      </div>
    </form>
  );
}
