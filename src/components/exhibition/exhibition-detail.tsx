"use client";

import { useState } from "react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { GateProgress } from "@/components/shared/gate-progress";
import { KpiCard } from "@/components/shared/kpi-card";
import { TasksTab } from "./tasks-tab";
import { LeadsTab } from "./leads-tab";
import { CostsTab } from "./costs-tab";
import { STATUS_LABEL } from "@/lib/constants";
import { fmt } from "@/lib/format";
import { LEADS, TASKS } from "@/data/mock";
import type { Exhibition } from "@/types";
import { Button } from "@/components/ui/button";

export function ExhibitionDetail({ exhibition }: { exhibition: Exhibition }) {
  const ex = exhibition;
  const slaOverdueCount = LEADS.filter((l) => l.exhibitionId === ex.id && l.slaOverdue).length;
  const todoCount = TASKS.filter((t) => t.exhibitionId === ex.id && t.status === "todo").length;

  return (
    <div>
      <div className="flex items-center gap-3 mb-5">
        <Link href="/" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
          ← 목록
        </Link>
        <span className="text-border">|</span>
        <h1 className="text-lg font-extrabold">{ex.name}</h1>
        <Badge variant={ex.status === "active" ? "default" : "secondary"}>
          {STATUS_LABEL[ex.status]}
        </Badge>
      </div>

      <Tabs defaultValue="overview">
        <TabsList className="mb-6">
          <TabsTrigger value="overview">개요</TabsTrigger>
          <TabsTrigger value="tasks" className="gap-1.5">
            태스크
            {todoCount > 0 && <span className="bg-destructive text-destructive-foreground text-[10px] px-1.5 rounded-full font-bold">{todoCount}</span>}
          </TabsTrigger>
          <TabsTrigger value="leads" className="gap-1.5">
            리드
            {slaOverdueCount > 0 && <span className="bg-destructive text-destructive-foreground text-[10px] px-1.5 rounded-full font-bold">{slaOverdueCount}</span>}
          </TabsTrigger>
          <TabsTrigger value="meetings">미팅</TabsTrigger>
          <TabsTrigger value="costs">비용</TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <div className="grid grid-cols-2 gap-4 mb-6">
            <Card>
              <CardContent className="p-5">
                <div className="text-[11px] font-bold text-muted-foreground tracking-widest uppercase mb-3">전시 정보</div>
                {[
                  ["도시/국가", `${ex.city}, ${ex.country}`],
                  ["전시장", ex.venueName],
                  ["기간", fmt.dateRange(ex.startsAt, ex.endsAt)],
                  ["예산", fmt.usd(ex.budgetUsd)],
                  ["목표 리드", `${ex.goalLeads}개`],
                  ["목표 미팅", `${ex.goalMeetings}건`],
                ].map(([l, v]) => (
                  <div key={l} className="flex justify-between py-1.5 border-b border-border last:border-0">
                    <span className="text-xs text-muted-foreground">{l}</span>
                    <span className="text-xs">{v}</span>
                  </div>
                ))}
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-5">
                <div className="text-[11px] font-bold text-muted-foreground tracking-widest uppercase mb-3">KPI 현황</div>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    ["방문객", ex.kpi.visitors, false],
                    ["Qualified", ex.kpi.qualifiedLeads, true],
                    ["A급 리드", ex.kpi.aLeads, true],
                    ["임원미팅", ex.kpi.execMeetings, false],
                    ["배포사", ex.kpi.distributors, false],
                    ["→ 제안", ex.kpi.proposals, false],
                  ].map(([l, v, a]) => (
                    <div key={String(l)} className="text-center p-2.5 bg-muted/50 rounded-md">
                      <div className={`text-xl font-bold ${a ? "text-primary" : ""}`}>{String(v)}</div>
                      <div className="text-[11px] text-muted-foreground">{String(l)}</div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
          <Card>
            <CardContent className="p-5">
              <div className="text-[11px] font-bold text-muted-foreground tracking-widest uppercase mb-3">게이트 체크포인트</div>
              <GateProgress gates={ex.gates} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="tasks">
          <TasksTab exhibitionId={ex.id} />
        </TabsContent>

        <TabsContent value="leads">
          <LeadsTab exhibitionId={ex.id} />
        </TabsContent>

        <TabsContent value="meetings">
          <div className="flex justify-end mb-4">
            <Button variant="outline" size="sm">+ 미팅 기록</Button>
          </div>
          <div className="text-muted-foreground text-sm text-center py-10">
            미팅 기록이 없습니다. 위 버튼으로 추가하세요.
          </div>
        </TabsContent>

        <TabsContent value="costs">
          <CostsTab exhibitionId={ex.id} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
