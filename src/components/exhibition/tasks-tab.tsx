"use client";

import { useState, useTransition } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { STATUS_LABEL, CATEGORY_LABEL } from "@/lib/constants";
import { createTask, updateTaskStatus, deleteTask } from "@/lib/supabase/actions";
import type { TaskInstance, TaskCategory } from "@/types";
import { cn } from "@/lib/utils";

const STATUS_NEXT: Record<string, string> = {
  todo: "in_progress",
  in_progress: "done",
  done: "todo",
  blocked: "todo",
};

interface Props {
  tasks: TaskInstance[];
  exhibitionId: string;
}

export function TasksTab({ tasks, exhibitionId }: Props) {
  const [filter, setFilter] = useState<string>("all");
  const [showForm, setShowForm] = useState(false);
  const [isPending, startTransition] = useTransition();
  const cats = [...new Set(tasks.map((t) => t.category))];
  const filtered = filter === "all" ? tasks : tasks.filter((t) => t.category === filter);

  const handleStatusToggle = (task: TaskInstance) => {
    startTransition(() => {
      updateTaskStatus(task.id, STATUS_NEXT[task.status], exhibitionId);
    });
  };

  const handleDelete = (taskId: string) => {
    if (!confirm("태스크를 삭제하시겠습니까?")) return;
    startTransition(() => {
      deleteTask(taskId, exhibitionId);
    });
  };

  const handleCreate = async (formData: FormData) => {
    await createTask(exhibitionId, formData);
    setShowForm(false);
  };

  return (
    <div className={cn(isPending && "opacity-60 pointer-events-none")}>
      <div className="flex gap-2 mb-4 flex-wrap">
        {["all", ...cats].map((c) => (
          <button
            key={c}
            onClick={() => setFilter(c)}
            className={cn(
              "px-3 py-1 rounded-full text-xs font-semibold border transition-colors",
              filter === c
                ? "bg-primary text-primary-foreground border-primary"
                : "bg-muted text-muted-foreground border-border hover:bg-accent"
            )}
          >
            {c === "all" ? "전체" : CATEGORY_LABEL[c as TaskCategory] || c}
          </button>
        ))}
        <div className="ml-auto">
          <Button variant="outline" size="sm" onClick={() => setShowForm(!showForm)}>
            {showForm ? "취소" : "+ 태스크 추가"}
          </Button>
        </div>
      </div>

      {showForm && (
        <form action={handleCreate} className="flex gap-2 mb-4 p-3 bg-muted/50 border border-border rounded-md flex-wrap">
          <div className="flex-1 min-w-[180px] space-y-1">
            <Label className="text-xs">제목 *</Label>
            <Input name="title" placeholder="태스크 제목" required className="h-8 text-xs" />
          </div>
          <div className="w-36 space-y-1">
            <Label className="text-xs">카테고리 *</Label>
            <Select name="category" defaultValue="logistics">
              <SelectTrigger className="h-8 text-xs">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {(["logistics", "booth", "marketing", "onsite", "post"] as TaskCategory[]).map((c) => (
                  <SelectItem key={c} value={c}>{CATEGORY_LABEL[c]}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="w-36 space-y-1">
            <Label className="text-xs">마감일</Label>
            <Input name="due_date" type="date" className="h-8 text-xs" />
          </div>
          <div className="flex items-end">
            <Button type="submit" size="sm">추가</Button>
          </div>
        </form>
      )}

      <div className="space-y-1.5">
        {filtered.map((t) => (
          <div
            key={t.id}
            className="flex items-center gap-3 px-3 py-2.5 bg-muted/50 border border-border rounded-md group"
          >
            <button
              onClick={() => handleStatusToggle(t)}
              className={cn(
                "w-4 h-4 rounded border-2 shrink-0 flex items-center justify-center transition-colors",
                t.status === "done" && "border-green-500 bg-green-500/20",
                t.status === "in_progress" && "border-blue-500 hover:border-blue-400",
                t.status === "todo" && "border-muted-foreground hover:border-primary",
                t.status === "blocked" && "border-destructive"
              )}
            >
              {t.status === "done" && <span className="text-green-500 text-[10px]">✓</span>}
              {t.status === "in_progress" && <span className="text-blue-500 text-[10px]">▶</span>}
            </button>
            <span className={cn("flex-1 text-sm", t.status === "done" && "text-muted-foreground line-through")}>
              {t.title}
            </span>
            <Badge variant={t.status === "done" ? "secondary" : t.status === "in_progress" ? "default" : "outline"}>
              {STATUS_LABEL[t.status]}
            </Badge>
            <span className="text-xs text-muted-foreground min-w-[72px] text-right">{t.dueDate}</span>
            <span className="text-xs text-muted-foreground min-w-[60px] text-right">{t.assignee}</span>
            <button
              onClick={() => handleDelete(t.id)}
              className="text-muted-foreground hover:text-destructive text-xs opacity-0 group-hover:opacity-100 transition-opacity ml-1"
            >
              ✕
            </button>
          </div>
        ))}
        {filtered.length === 0 && (
          <div className="text-center text-muted-foreground text-sm py-8">태스크가 없습니다.</div>
        )}
      </div>

      <div className="mt-5 flex gap-3">
        {(["done", "in_progress", "todo"] as const).map((s) => (
          <div key={s} className="flex items-center gap-1.5">
            <div className={cn(
              "w-2 h-2 rounded-full",
              s === "done" && "bg-green-500",
              s === "in_progress" && "bg-blue-500",
              s === "todo" && "bg-muted-foreground"
            )} />
            <span className="text-xs text-muted-foreground">
              {STATUS_LABEL[s]}: {tasks.filter((t) => t.status === s).length}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
