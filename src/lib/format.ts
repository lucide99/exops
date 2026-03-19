export const fmt = {
  usd: (v: number | null | undefined) =>
    v == null ? "—" : `$${Number(v).toLocaleString()}`,
  pct: (n: number, d: number) =>
    d === 0 ? "0%" : `${Math.round((n / d) * 100)}%`,
  date: (s: string | null | undefined) =>
    s
      ? new Date(s).toLocaleDateString("ko-KR", {
          month: "short",
          day: "numeric",
        })
      : "—",
  dateRange: (s: string, e: string) => `${fmt.date(s)} – ${fmt.date(e)}`,
};
