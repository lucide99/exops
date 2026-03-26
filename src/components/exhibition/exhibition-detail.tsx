"use client";

import { useTransition } from "react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { InteractiveGateProgress } from "@/components/shared/interactive-gate-progress";
import { KpiCard } from "@/components/shared/kpi-card";
import { TasksTab } from "./tasks-tab";
import { LeadsTab } from "./leads-tab";
import { CostsTab } from "./costs-tab";
import { MeetingsTab } from "./meetings-tab";
import { STATUS_LABEL } from "@/lib/constants";
import { fmt } from "@/lib/format";
import { updateExhibitionStatus } from "@/lib/supabase/actions";
import type { Exhibition, Lead, TaskInstance, Cost, Meeting } from "@/types";

const STATUS_OPTIONS = [
  { value: "planning", label: "계획중" },
  { value: "active",   label: "진행중" },
  { value: "closed",   label: "완료" },
  { value: "cancelled",label: "취소" },
] as const;

interface Props {
  exhibition: Exhibition;
  leads: Lead[];
  tasks: TaskInstance[];
  costs: Cost[];
  meetings: Meeting[];
}

export function ExhibitionDetail({ exhibition, leads, tasks, costs, meetings }: Props) {
  const ex = exhibition;
  const slaOverdueCount = leads.filter((l) => l.slaOverdue).length;
  const todoCount = tasks.filter((t) => t.status === "todo").length;
  const [isPending, startTransition] = useTransition();

  const handleStatusChange = (status: string) => {
    startTransition(() => {
      updateExhibitionStatus(ex.id, status);
    });
  };

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
                {/* 상태 변경 */}
                <div className="flex justify-between py-1.5 mt-1 items-center">
                  <span className="text-xs text-muted-foreground">상태 변경</span>
                  <div className={`flex gap-1 ${isPending ? "opacity-50 pointer-events-none" : ""}`}>
                    {STATUS_OPTIONS.map((opt) => (
                      <button
                        key={opt.value}
                        onClick={() => handleStatusChange(opt.value)}
                        className={`text-[10px] px-2 py-0.5 rounded border transition-colors ${
                          ex.status === opt.value
                            ? "bg-primary text-primary-foreground border-primary"
                            : "text-muted-foreground border-border hover:border-primary hover:text-primary"
                        }`}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                </div>
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
              <p className="text-[11px] text-muted-foreground mb-3">게이트를 클릭하면 통과/미통과를 전환합니다.</p>
              <InteractiveGateProgress gates={ex.gates} exhibitionId={ex.id} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="tasks">
          <TasksTab tasks={tasks} exhibitionId={ex.id} />
        </TabsContent>

        <TabsContent value="leads">
          <LeadsTab leads={leads} exhibitionId={ex.id} />
        </TabsContent>

        <TabsContent value="meetings">
          <MeetingsTab meetings={meetings} exhibitionId={ex.id} />
        </TabsContent>

        <TabsContent value="costs">
          <CostsTab costs={costs} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
