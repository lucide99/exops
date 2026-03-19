"use client";

import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { TASKS } from "@/data/mock";
import { STATUS_LABEL, CATEGORY_LABEL } from "@/lib/constants";
import type { TaskCategory } from "@/types";
import { cn } from "@/lib/utils";

export function TasksTab({ exhibitionId }: { exhibitionId: string }) {
  const tasks = TASKS.filter((t) => t.exhibitionId === exhibitionId);
  const [filter, setFilter] = useState<string>("all");
  const cats = [...new Set(tasks.map((t) => t.category))];
  const filtered = filter === "all" ? tasks : tasks.filter((t) => t.category === filter);

  return (
    <div>
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
          <Button variant="outline" size="sm">+ 태스크 추가</Button>
        </div>
      </div>

      <div className="space-y-1.5">
        {filtered.map((t) => (
          <div
            key={t.id}
            className="flex items-center gap-3 px-3 py-2.5 bg-muted/50 border border-border rounded-md"
          >
            <div
              className={cn(
                "w-4 h-4 rounded border-2 shrink-0 flex items-center justify-center",
                t.status === "done" && "border-green-500 bg-green-500/20",
                t.status === "in_progress" && "border-blue-500",
                t.status === "todo" && "border-muted-foreground",
                t.status === "blocked" && "border-destructive"
              )}
            >
              {t.status === "done" && <span className="text-green-500 text-[10px]">✓</span>}
            </div>
            <span className={cn("flex-1 text-sm", t.status === "done" && "text-muted-foreground line-through")}>
              {t.title}
            </span>
            <Badge variant={t.status === "done" ? "secondary" : t.status === "in_progress" ? "default" : "outline"}>
              {STATUS_LABEL[t.status]}
            </Badge>
            <span className="text-xs text-muted-foreground min-w-[72px] text-right">{t.dueDate}</span>
            <span className="text-xs text-muted-foreground min-w-[60px] text-right">{t.assignee}</span>
          </div>
        ))}
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
