"use client";

import Link from "next/link";
import { useMemo } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { KpiCard } from "@/components/shared/kpi-card";
import { GateProgress } from "@/components/shared/gate-progress";
import { fmt } from "@/lib/format";
import { STATUS_LABEL } from "@/lib/constants";
import type { Exhibition } from "@/types";

interface Props {
  exhibitions: Exhibition[];
  slaBreaches: number;
  slaCompleted: number;
}

export function PortfolioDashboard({ exhibitions, slaBreaches, slaCompleted }: Props) {
  const total = useMemo(() => {
    return exhibitions.reduce(
      (acc, ex) => {
        acc.visitors += ex.kpi.visitors;
        acc.qualified += ex.kpi.qualifiedLeads;
        acc.aLeads += ex.kpi.aLeads;
        acc.execMtgs += ex.kpi.execMeetings;
        acc.distributors += ex.kpi.distributors;
        acc.proposals += ex.kpi.proposals;
        acc.contracts += ex.kpi.contracts;
        acc.rev6m += ex.kpi.rev6m;
        acc.rev12m += ex.kpi.rev12m;
        return acc;
      },
      { visitors: 0, qualified: 0, aLeads: 0, execMtgs: 0, distributors: 0, proposals: 0, contracts: 0, rev6m: 0, rev12m: 0 }
    );
  }, [exhibitions]);

  return (
    <div>
      <div className="mb-7">
        <div className="flex items-baseline gap-3 mb-1">
          <h1 className="text-xl font-extrabold">포트폴리오 대시보드</h1>
          <span className="text-sm text-muted-foreground">
            2025 · {exhibitions.length}개 전시
          </span>
        </div>
        {slaBreaches > 0 && (
          <div className="inline-flex items-center gap-2 mt-2 px-3 py-2 rounded-md bg-destructive/10 border border-destructive/30">
            <span className="text-xs font-bold text-destructive">
              ⚠ SLA 초과 리드 {slaBreaches}건 — 즉시 팔로업 필요
            </span>
          </div>
        )}
      </div>

      {/* KPI Grid */}
      <div className="grid grid-cols-3 gap-3 mb-7">
        <KpiCard label="Total Visitors" value={total.visitors.toLocaleString()} sub="전체 방문객" />
        <KpiCard label="Qualified Leads" value={total.qualified} sub={`A급: ${total.aLeads}개`} accent />
        <KpiCard label="Executive Meetings" value={total.execMtgs} sub="임원급 미팅" />
        <KpiCard label="Distributor Prospects" value={total.distributors} sub="유통 잠재파트너" />
        <KpiCard label="→ Proposal" value={fmt.pct(total.proposals, total.qualified)} sub={`${total.proposals}건 / ${total.qualified}건`} />
        <KpiCard label="→ Contract" value={fmt.pct(total.contracts, total.proposals)} sub={`${total.contracts}건 / ${total.proposals}건`} />
        <KpiCard label="Est. 6M Revenue" value={fmt.usd(total.rev6m)} sub="6개월 매출 기여 추정" accent />
        <KpiCard label="Est. 12M Revenue" value={fmt.usd(total.rev12m)} sub="12개월 매출 기여 추정" accent />
        <Card>
          <CardContent className="p-4">
            <div className="text-[10px] font-bold text-muted-foreground tracking-widest uppercase mb-2">
              SLA 현황
            </div>
            <div className="space-y-1">
              <div className="flex justify-between text-xs">
                <span className="text-muted-foreground">초과 (A급)</span>
                <span className="font-bold text-destructive">{slaBreaches}</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-muted-foreground">처리 완료</span>
                <span className="font-bold text-green-500">{slaCompleted}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Exhibition List */}
      <div className="text-[11px] font-bold text-muted-foreground tracking-widest uppercase mb-4">
        전시 목록
      </div>
      <div className="space-y-3">
        {exhibitions.map((ex) => (
          <Link key={ex.id} href={`/exhibitions/${ex.id}`}>
            <Card className="p-4 hover:border-primary/30 transition-colors cursor-pointer mb-3">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <div className="flex items-center gap-2.5 mb-1">
                    <span className="text-sm font-bold">{ex.name}</span>
                    <Badge variant={ex.status === "active" ? "default" : "secondary"}>
                      {STATUS_LABEL[ex.status]}
                    </Badge>
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {ex.city}, {ex.country} · {fmt.dateRange(ex.startsAt, ex.endsAt)} · {ex.venueName}
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-lg font-bold text-primary">{ex.kpi.qualifiedLeads}</div>
                  <div className="text-[11px] text-muted-foreground">qualified leads</div>
                </div>
              </div>
              <GateProgress gates={ex.gates} />
              <div className="grid grid-cols-5 gap-3 mt-4 pt-3 border-t border-border">
                {[
                  ["방문객", ex.kpi.visitors.toLocaleString()],
                  ["A급 리드", ex.kpi.aLeads],
                  ["임원미팅", ex.kpi.execMeetings],
                  ["예산", fmt.usd(ex.budgetUsd)],
                  ["→ 제안", fmt.pct(ex.kpi.proposals, ex.kpi.qualifiedLeads)],
                ].map(([l, v]) => (
                  <div key={String(l)}>
                    <div className="text-[10px] text-muted-foreground mb-0.5">{l}</div>
                    <div className="text-xs font-semibold text-muted-foreground">{v}</div>
                  </div>
                ))}
              </div>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
