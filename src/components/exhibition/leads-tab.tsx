"use client";

import { useState, useTransition } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { createLead, deleteLead } from "@/lib/supabase/actions";
import type { Lead, LeadGrade } from "@/types";
import { cn } from "@/lib/utils";

interface Props {
  leads: Lead[];
  exhibitionId: string;
}

export function LeadsTab({ leads, exhibitionId }: Props) {
  const [gradeFilter, setGradeFilter] = useState<string>("all");
  const [showForm, setShowForm] = useState(false);
  const [isPending, startTransition] = useTransition();
  const filtered = gradeFilter === "all" ? leads : leads.filter((l) => l.grade === gradeFilter);

  const handleCreate = async (formData: FormData) => {
    await createLead(exhibitionId, formData);
    setShowForm(false);
  };

  const handleDelete = (leadId: string) => {
    if (!confirm("리드를 삭제하시겠습니까?")) return;
    startTransition(() => {
      deleteLead(leadId, exhibitionId);
    });
  };

  return (
    <div className={cn(isPending && "opacity-60 pointer-events-none")}>
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
          <Button variant="outline" size="sm" onClick={() => setShowForm(!showForm)}>
            {showForm ? "취소" : "+ 리드 수기입력"}
          </Button>
        </div>
      </div>

      {showForm && (
        <form action={handleCreate} className="mb-5 p-4 bg-muted/50 border border-border rounded-md space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <Label className="text-xs">회사 *</Label>
              <Input name="company" placeholder="Siemens AG" required className="h-8 text-xs" />
            </div>
            <div className="space-y-1">
              <Label className="text-xs">이름 *</Label>
              <Input name="full_name" placeholder="Klaus Weber" required className="h-8 text-xs" />
            </div>
            <div className="space-y-1">
              <Label className="text-xs">직함</Label>
              <Input name="title" placeholder="VP Procurement" className="h-8 text-xs" />
            </div>
            <div className="space-y-1">
              <Label className="text-xs">이메일</Label>
              <Input name="email" type="email" placeholder="k.weber@siemens.com" className="h-8 text-xs" />
            </div>
            <div className="space-y-1">
              <Label className="text-xs">국가코드</Label>
              <Input name="country" placeholder="DE" maxLength={2} className="h-8 text-xs" />
            </div>
            <div className="space-y-1">
              <Label className="text-xs">유형</Label>
              <Input name="lead_type" placeholder="OEM / Distributor / End-user" className="h-8 text-xs" />
            </div>
            <div className="space-y-1">
              <Label className="text-xs">등급</Label>
              <Select name="grade" defaultValue="ungraded">
                <SelectTrigger className="h-8 text-xs">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="A">A급</SelectItem>
                  <SelectItem value="B">B급</SelectItem>
                  <SelectItem value="C">C급</SelectItem>
                  <SelectItem value="ungraded">미분류</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1">
              <Label className="text-xs">수집 방법</Label>
              <Select name="source" defaultValue="manual">
                <SelectTrigger className="h-8 text-xs">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="badge_scan">배지 스캔</SelectItem>
                  <SelectItem value="business_card">명함</SelectItem>
                  <SelectItem value="manual">수기</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="space-y-1">
            <Label className="text-xs">다음 액션</Label>
            <Input name="next_action" placeholder="Send proposal draft" className="h-8 text-xs" />
          </div>
          <div className="flex gap-2 pt-1">
            <Button type="submit" size="sm">저장</Button>
            <Button type="button" variant="outline" size="sm" onClick={() => setShowForm(false)}>취소</Button>
          </div>
        </form>
      )}

      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              {["등급", "회사", "이름/직함", "국가", "유형", "Qualified", "SLA", "다음액션", "담당자", ""].map((h) => (
                <TableHead key={h} className="text-xs whitespace-nowrap">{h}</TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.map((l) => (
              <TableRow key={l.id} className={cn(l.slaOverdue && "bg-destructive/5", "group")}>
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
                <TableCell>
                  <button
                    onClick={() => handleDelete(l.id)}
                    className="text-muted-foreground hover:text-destructive text-xs opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    ✕
                  </button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        {filtered.length === 0 && (
          <div className="text-center text-muted-foreground text-sm py-8">리드가 없습니다.</div>
        )}
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
