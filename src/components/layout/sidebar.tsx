"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { EXHIBITIONS } from "@/data/mock";
import { LEADS } from "@/data/mock";

const NAV_ITEMS = [
  { href: "/", icon: "⬡", label: "포트폴리오" },
  { href: "/followup", icon: "◈", label: "팔로업 큐" },
];

export function Sidebar() {
  const pathname = usePathname();
  const slaCount = LEADS.filter((l) => l.slaOverdue).length;
  const activeExhibitions = EXHIBITIONS.filter((e) => e.status !== "closed");

  return (
    <aside className="w-56 shrink-0 border-r border-border bg-card flex flex-col sticky top-0 h-screen overflow-y-auto">
      <div className="p-5 pb-6">
        <div className="text-sm font-extrabold text-primary tracking-tight">
          ◈ EXOPS
        </div>
        <div className="text-[10px] text-muted-foreground tracking-widest mt-0.5">
          EXHIBITION OPS SYSTEM
        </div>
      </div>

      <nav className="flex-1 px-3 space-y-1">
        {NAV_ITEMS.map((item) => {
          const isActive =
            item.href === "/"
              ? pathname === "/"
              : pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-2.5 px-3 py-2 rounded-md text-sm transition-colors",
                isActive
                  ? "bg-primary/10 text-primary font-semibold border border-primary/20"
                  : "text-muted-foreground hover:bg-accent hover:text-accent-foreground border border-transparent"
              )}
            >
              <span>{item.icon}</span>
              <span className="flex-1">{item.label}</span>
              {item.href === "/followup" && slaCount > 0 && (
                <span className="bg-destructive text-destructive-foreground text-[10px] font-bold px-1.5 rounded-full">
                  {slaCount}
                </span>
              )}
            </Link>
          );
        })}

        <div className="h-px bg-border my-3" />
        <div className="text-[10px] text-muted-foreground tracking-widest px-3 py-1 uppercase">
          진행중 전시
        </div>
        {activeExhibitions.map((ex) => {
          const isActive = pathname === `/exhibitions/${ex.id}`;
          return (
            <Link
              key={ex.id}
              href={`/exhibitions/${ex.id}`}
              className={cn(
                "flex items-center gap-2.5 px-3 py-2 rounded-md text-sm transition-colors",
                isActive
                  ? "bg-primary/10 text-primary font-semibold border border-primary/20"
                  : "text-muted-foreground hover:bg-accent hover:text-accent-foreground border border-transparent"
              )}
            >
              <span>→</span>
              <span className="truncate">{ex.name.split(" ").slice(0, 2).join(" ")}</span>
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-border">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-full bg-primary/20 border border-primary/40 flex items-center justify-center text-xs font-bold text-primary">
            K
          </div>
          <div>
            <div className="text-xs font-semibold">김민준</div>
            <div className="text-[10px] text-muted-foreground">ops</div>
          </div>
        </div>
      </div>
    </aside>
  );
}
