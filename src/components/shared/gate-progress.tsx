import type { Gate } from "@/types";
import { cn } from "@/lib/utils";

export function GateProgress({ gates }: { gates: Gate[] }) {
  return (
    <div className="flex items-center">
      {gates.map((g, i) => (
        <div key={g.order} className="flex items-center flex-1">
          <div className="flex flex-col items-center flex-1">
            <div
              className={cn(
                "w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold border-2",
                g.status === "passed" && "bg-green-500 border-green-500 text-white",
                g.status === "blocked" && "bg-destructive border-destructive text-white",
                g.status === "pending" && "bg-muted border-border text-muted-foreground"
              )}
            >
              {g.status === "passed" ? "✓" : g.status === "blocked" ? "✕" : g.order}
            </div>
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
