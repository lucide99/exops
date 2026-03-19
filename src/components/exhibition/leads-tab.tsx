"use client";

import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { LEADS } from "@/data/mock";
import type { LeadGrade } from "@/types";
import { cn } from "@/lib/utils";

export function LeadsTab({ exhibitionId }: { exhibitionId: string }) {
  const leads = LEADS.filter((l) => l.exhibitionId === exhibitionId);
  const [gradeFilter, setGradeFilter] = useState<string>("all");
  const filtered = gradeFilter === "all" ? leads : leads.filter((l) => l.grade === gradeFilter);

  return (
    <div>
      <div className="flex gap-2 items-center mb-4 flex-wrap">
        {["all", "A", "B", "C"].map((g) => (
          <button
            key={g}
            onClick={() => setGradeFilter(g)}
            className={cn(
              "px-3 py-1 rounded-full text-xs font-semibold border transition-colors",
              gradeFilter === g
                ? "bg-primary text-primary-foreground border-primary"
                : "bg-muted text-muted-foreground border-border hover:bg-accent"
            )}
          >
            {g === "all" ? "전체" : `${g}급`}
          </button>
        ))}
        <div className="ml-auto flex gap-2">
          <Button variant="outline" size="sm">📥 CSV 업로드</Button>
          <Button variant="outline" size="sm">+ 리드 수기입력</Button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              {["등급", "회사", "이름/직함", "국가", "유형", "Qualified", "SLA", "다음액션", "담당자"].map((h) => (
                <TableHead key={h} className="text-xs whitespace-nowrap">{h}</TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.map((l) => (
              <TableRow key={l.id} className={cn(l.slaOverdue && "bg-destructive/5")}>
                <TableCell>
                  <span className={cn(
                    "font-extrabold text-sm",
                    l.grade === "A" && "text-primary",
                    l.grade === "B" && "text-blue-500",
                    l.grade === "C" && "text-muted-foreground"
                  )}>
                    {l.grade}
                  </span>
                </TableCell>
                <TableCell className="font-semibold">{l.company}</TableCell>
                <TableCell>
                  <div>{l.fullName}</div>
                  <div className="text-xs text-muted-foreground">{l.title}</div>
                </TableCell>
                <TableCell className="text-muted-foreground">{l.country}</TableCell>
                <TableCell><Badge variant="secondary">{l.leadType}</Badge></TableCell>
                <TableCell>
                  <span className={l.isQualified ? "text-green-500" : "text-muted-foreground"}>
                    {l.isQualified ? "✓" : "—"}
                  </span>
                </TableCell>
                <TableCell>
                  {l.slaOverdue
                    ? <Badge variant="destructive">⚠ 초과</Badge>
                    : <Badge variant="outline" className="text-green-500 border-green-500/30">정상</Badge>}
                </TableCell>
                <TableCell className="text-muted-foreground max-w-[140px] truncate">{l.nextAction}</TableCell>
                <TableCell className="text-muted-foreground">{l.assignee}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <div className="mt-4 flex gap-5">
        {(["A", "B", "C"] as LeadGrade[]).map((g) => (
          <div key={g} className="flex items-center gap-1.5">
            <span className={cn(
              "font-bold",
              g === "A" && "text-primary",
              g === "B" && "text-blue-500",
              g === "C" && "text-muted-foreground"
            )}>{g}급</span>
            <span className="text-xs text-muted-foreground">{leads.filter((l) => l.grade === g).length}건</span>
          </div>
        ))}
        <span className="text-xs text-destructive ml-auto">
          SLA 초과: {leads.filter((l) => l.slaOverdue).length}건
        </span>
      </div>
    </div>
  );
}
