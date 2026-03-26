"use client";

import { useTransition } from "react";
import { toggleGateStatus } from "@/lib/supabase/actions";
import type { Gate } from "@/types";
import { cn } from "@/lib/utils";

export function InteractiveGateProgress({ gates, exhibitionId }: { gates: Gate[]; exhibitionId: string }) {
  const [isPending, startTransition] = useTransition();

  const handleToggle = (gate: Gate) => {
    if (!gate.id || gate.status === "blocked") return;
    startTransition(() => {
      toggleGateStatus(gate.id!, gate.status, exhibitionId);
    });
  };

  return (
    <div className={cn("flex items-center", isPending && "opacity-60 pointer-events-none")}>
      {gates.map((g, i) => (
        <div key={g.order} className="flex items-center flex-1">
          <div className="flex flex-col items-center flex-1">
            <button
              onClick={() => handleToggle(g)}
              disabled={!g.id || g.status === "blocked"}
              title={g.status === "passed" ? "클릭하면 미통과로 되돌립니다" : "클릭하면 통과 처리됩니다"}
              className={cn(
                "w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold border-2 transition-all",
                g.status === "passed" && "bg-green-500 border-green-500 text-white hover:bg-green-600",
                g.status === "blocked" && "bg-destructive border-destructive text-white cursor-not-allowed",
                g.status === "pending" && "bg-muted border-border text-muted-foreground hover:border-green-500 hover:text-green-500 cursor-pointer"
              )}
            >
              {g.status === "passed" ? "✓" : g.status === "blocked" ? "✕" : g.order}
            </button>
            <div className="text-[9px] text-muted-foreground mt-1 text-center max-w-16 leading-tight">
              {g.name}
            </div>
          </div>
          {i < gates.length - 1 && (
            <div
              className={cn(
                "h-0.5 flex-[0.5] mb-5",
                g.status === "passed" ? "bg-green-500/40" : "bg-border"
              )}
            />
          )}
        </div>
      ))}
    </div>
  );
}
