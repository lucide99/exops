"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import { KpiCard } from "@/components/shared/kpi-card";
import { fmt } from "@/lib/format";
import { CATEGORY_LABEL } from "@/lib/constants";
import type { Cost, CostCategory } from "@/types";

interface Props {
  costs: Cost[];
}

export function CostsTab({ costs }: Props) {
  const totalBudget = costs.reduce((s, c) => s + c.budgeted, 0);
  const totalActual = costs.reduce((s, c) => s + (c.actual || 0), 0);
  const pctUsed = totalBudget > 0 ? Math.round((totalActual / totalBudget) * 100) : 0;

  return (
    <div>
      <div className="grid grid-cols-3 gap-3 mb-6">
        <KpiCard label="예산 합계" value={fmt.usd(totalBudget)} />
        <KpiCard label="실집행 합계" value={fmt.usd(totalActual)} accent={totalActual > totalBudget} />
        <KpiCard label="남은 예산" value={fmt.usd(totalBudget - totalActual)} accent={totalBudget - totalActual < 0} />
      </div>

      <div className="mb-6">
        <div className="h-2 bg-muted rounded-full overflow-hidden mb-1.5">
          <div
            className={`h-full rounded-full transition-all duration-500 ${totalActual > totalBudget ? "bg-destructive" : "bg-green-500"}`}
            style={{ width: `${Math.min(pctUsed, 100)}%` }}
          />
        </div>
        <div className="text-xs text-muted-foreground">집행률 {pctUsed}%</div>
      </div>

      <div className="flex justify-end mb-3">
        <Button variant="outline" size="sm">+ 비용 추가</Button>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            {["카테고리", "내용", "예산(USD)", "실집행(USD)", "차액", "증빙"].map((h) => (
              <TableHead key={h} className="text-xs">{h}</TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {costs.map((c) => {
            const diff = (c.actual || 0) - c.budgeted;
            return (
              <TableRow key={c.id}>
                <TableCell><Badge variant="secondary">{CATEGORY_LABEL[c.category as CostCategory] || c.category}</Badge></TableCell>
                <TableCell>{c.description}</TableCell>
                <TableCell className="text-muted-foreground">{fmt.usd(c.budgeted)}</TableCell>
                <TableCell className={c.actual ? "" : "text-muted-foreground"}>{c.actual ? fmt.usd(c.actual) : "미입력"}</TableCell>
                <TableCell className={diff > 0 ? "text-destructive" : "text-green-500"}>
                  {c.actual ? (diff > 0 ? `+${fmt.usd(diff)}` : fmt.usd(diff)) : "—"}
                </TableCell>
                <TableCell>
                  {c.receipt
                    ? <span className="text-green-500 text-sm">✓ 첨부</span>
                    : <span className="text-xs text-muted-foreground">미첨부</span>}
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}
