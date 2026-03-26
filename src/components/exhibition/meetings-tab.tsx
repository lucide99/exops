"use client";

import { useState, useTransition } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { createMeeting, deleteMeeting } from "@/lib/supabase/actions";
import type { Meeting } from "@/types";
import { cn } from "@/lib/utils";

interface Props {
  meetings: Meeting[];
  exhibitionId: string;
}

function formatDateTime(iso: string) {
  return new Date(iso).toLocaleString("ko-KR", {
    month: "short", day: "numeric", hour: "2-digit", minute: "2-digit",
  });
}

export function MeetingsTab({ meetings, exhibitionId }: Props) {
  const [showForm, setShowForm] = useState(false);
  const [isPending, startTransition] = useTransition();

  const handleCreate = async (formData: FormData) => {
    await createMeeting(exhibitionId, formData);
    setShowForm(false);
  };

  const handleDelete = (meetingId: string) => {
    if (!confirm("미팅 기록을 삭제하시겠습니까?")) return;
    startTransition(() => {
      deleteMeeting(meetingId, exhibitionId);
    });
  };

  return (
    <div className={cn(isPending && "opacity-60 pointer-events-none")}>
      <div className="flex justify-end mb-4">
        <Button variant="outline" size="sm" onClick={() => setShowForm(!showForm)}>
          {showForm ? "취소" : "+ 미팅 기록"}
        </Button>
      </div>

      {showForm && (
        <form action={handleCreate} className="mb-5 p-4 bg-muted/50 border border-border rounded-md space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <Label className="text-xs">담당자 이름 *</Label>
              <Input name="contact_name" placeholder="Klaus Weber" required className="h-8 text-xs" />
            </div>
            <div className="space-y-1">
              <Label className="text-xs">회사</Label>
              <Input name="company" placeholder="Siemens AG" className="h-8 text-xs" />
            </div>
            <div className="space-y-1">
              <Label className="text-xs">직함</Label>
              <Input name="contact_title" placeholder="VP Procurement" className="h-8 text-xs" />
            </div>
            <div className="space-y-1">
              <Label className="text-xs">미팅 일시 *</Label>
              <Input name="meeting_at" type="datetime-local" required className="h-8 text-xs" />
            </div>
          </div>
          <div className="space-y-1">
            <Label className="text-xs">미팅 내용</Label>
            <textarea
              name="notes"
              placeholder="주요 논의 사항, 다음 액션 등"
              rows={4}
              className="w-full rounded-md border border-input bg-background px-3 py-2 text-xs resize-none focus:outline-none focus:ring-1 focus:ring-ring"
            />
          </div>
          <div className="flex items-center gap-2">
            <input type="checkbox" id="is_exec" name="is_exec" value="true" className="w-3.5 h-3.5" />
            <Label htmlFor="is_exec" className="text-xs cursor-pointer">임원급 미팅</Label>
          </div>
          <div className="flex gap-2 pt-1">
            <Button type="submit" size="sm">저장</Button>
            <Button type="button" variant="outline" size="sm" onClick={() => setShowForm(false)}>취소</Button>
          </div>
        </form>
      )}

      {meetings.length === 0 ? (
        <div className="text-muted-foreground text-sm text-center py-10">
          미팅 기록이 없습니다.
        </div>
      ) : (
        <div className="space-y-2">
          {meetings.map((m) => (
            <Card key={m.id} className="group">
              <CardContent className="p-4 flex items-start gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-semibold text-sm">{m.contactName}</span>
                    {m.company && (
                      <span className="text-xs text-muted-foreground">· {m.company}</span>
                    )}
                    {m.contactTitle && (
                      <span className="text-xs text-muted-foreground">{m.contactTitle}</span>
                    )}
                    {m.isExec && (
                      <Badge variant="default" className="text-[10px] px-1.5 py-0">임원급</Badge>
                    )}
                  </div>
                  <div className="text-xs text-muted-foreground mb-1">{formatDateTime(m.meetingAt)}</div>
                  {m.notes && (
                    <div className="text-xs text-muted-foreground bg-muted/50 rounded px-2 py-1.5 mt-1">
                      {m.notes}
                    </div>
                  )}
                </div>
                <button
                  onClick={() => handleDelete(m.id)}
                  className="text-muted-foreground hover:text-destructive text-xs opacity-0 group-hover:opacity-100 transition-opacity shrink-0"
                >
                  ✕
                </button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <div className="mt-4 flex gap-4 text-xs text-muted-foreground">
        <span>전체 {meetings.length}건</span>
        <span>임원급 {meetings.filter((m) => m.isExec).length}건</span>
      </div>
    </div>
  );
}
