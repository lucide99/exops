"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { fmt } from "@/lib/format";
import { STATUS_LABEL } from "@/lib/constants";
import { deleteExhibition } from "@/lib/supabase/actions";
import type { Exhibition } from "@/types";
import { useTransition } from "react";

interface Props {
  exhibitions: Exhibition[];
}

export function ExhibitionAdminList({ exhibitions }: Props) {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  if (exhibitions.length === 0) {
    return (
      <div className="text-center text-muted-foreground py-20 text-sm">
        전시가 없습니다.{" "}
        <Link href="/admin/exhibitions/new" className="text-primary underline">
          첫 전시를 추가하세요.
        </Link>
      </div>
    );
  }

  return (
    <div className={`space-y-3 ${isPending ? "opacity-60 pointer-events-none" : ""}`}>
      {exhibitions.map((ex) => (
        <Card
          key={ex.id}
          className="hover:border-primary/30 transition-colors cursor-pointer mb-3"
          onClick={() => router.push(`/exhibitions/${ex.id}`)}
        >
          <CardContent className="p-4 flex items-center gap-4">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2.5 mb-1">
                <span className="font-bold text-sm truncate">{ex.name}</span>
                <Badge variant={ex.status === "active" ? "default" : "secondary"}>
                  {STATUS_LABEL[ex.status]}
                </Badge>
              </div>
              <div className="text-xs text-muted-foreground">
                {ex.city}, {ex.country} · {fmt.dateRange(ex.startsAt, ex.endsAt)} · 예산 {fmt.usd(ex.budgetUsd)}
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0" onClick={(e) => e.stopPropagation()}>
              <button
                onClick={() => router.push(`/admin/exhibitions/${ex.id}/edit`)}
                className="text-xs text-muted-foreground hover:text-foreground px-2 py-1 border border-border rounded transition-colors"
              >
                수정
              </button>
              <form action={deleteExhibition.bind(null, ex.id)}>
                <button
                  type="submit"
                  className="text-xs text-destructive px-2 py-1 border border-destructive/30 rounded transition-colors"
                  onClick={(e) => {
                    if (!confirm(`"${ex.name}"을(를) 삭제하시겠습니까?`)) e.preventDefault();
                  }}
                >
                  삭제
                </button>
              </form>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
