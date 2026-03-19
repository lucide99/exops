import { Card, CardContent } from "@/components/ui/card";

interface KpiCardProps {
  label: string;
  value: string | number;
  sub?: string;
  accent?: boolean;
}

export function KpiCard({ label, value, sub, accent }: KpiCardProps) {
  return (
    <Card>
      <CardContent className="p-4">
        <div className="text-[11px] font-semibold text-muted-foreground tracking-widest uppercase mb-2">
          {label}
        </div>
        <div className={`text-2xl font-bold leading-none mb-1 ${accent ? "text-primary" : ""}`}>
          {value}
        </div>
        {sub && <div className="text-xs text-muted-foreground">{sub}</div>}
      </CardContent>
    </Card>
  );
}
