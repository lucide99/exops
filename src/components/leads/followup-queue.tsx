"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { LEADS } from "@/data/mock";
import { cn } from "@/lib/utils";

export function FollowUpQueue() {
  const overdue = LEADS.filter((l) => l.slaOverdue);
  const upcoming = LEADS.filter((l) => !l.slaOverdue && l.grade !== "C");

  return (
    <div>
      <h1 className="text-xl font-extrabold mb-6">SLA 팔로업 큐</h1>

      {overdue.length > 0 && (
        <div className="mb-7">
          <div className="text-[11px] font-bold text-destructive tracking-widest uppercase mb-3">
            ⚠ SLA 초과 ({overdue.length}건)
          </div>
          <div className="space-y-2">
            {overdue.map((l) => (
              <Card key={l.id} className="border-destructive/30">
                <CardContent className="p-3 flex items-center gap-3">
                  <span className={cn(
                    "font-extrabold text-lg min-w-5",
                    l.grade === "A" && "text-primary",
                    l.grade === "B" && "text-blue-500"
                  )}>{l.grade}</span>
                  <div className="flex-1">
                    <div className="font-semibold text-sm">
                      {l.fullName} <span className="text-muted-foreground font-normal text-xs">· {l.company}</span>
                    </div>
                    <div className="text-xs text-muted-foreground">{l.nextAction} · 담당: {l.assignee}</div>
                  </div>
                  <Badge variant="destructive">SLA 초과</Badge>
                  <div className="flex gap-1.5">
                    <Button variant="outline" size="sm">이메일 발송</Button>
                    <Button size="sm">완료 처리</Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      <div>
        <div className="text-[11px] font-bold text-muted-foreground tracking-widest uppercase mb-3">
          이번 주 팔로업 예정 ({upcoming.length}건)
        </div>
        <div className="space-y-2">
          {upcoming.map((l) => (
            <Card key={l.id}>
              <CardContent className="p-3 flex items-center gap-3">
                <span className={cn(
                  "font-extrabold text-lg min-w-5",
                  l.grade === "A" && "text-primary",
                  l.grade === "B" && "text-blue-500"
                )}>{l.grade}</span>
                <div className="flex-1">
                  <div className="font-semibold text-sm">
                    {l.fullName} <span className="text-muted-foreground font-normal text-xs">· {l.company}</span>
                  </div>
                  <div className="text-xs text-muted-foreground">{l.nextAction} · 담당: {l.assignee}</div>
                </div>
                <Badge variant="outline" className="text-green-500 border-green-500/30">정상</Badge>
                <div className="flex gap-1.5">
                  <Button variant="outline" size="sm">이메일 발송</Button>
                  <Button size="sm">완료 처리</Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
