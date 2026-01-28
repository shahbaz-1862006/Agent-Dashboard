import React from "react";

export function ChartTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-xl border border-border bg-card px-3 py-2 shadow-panel">
      <div className="text-xs text-muted-foreground">{label}</div>
      <div className="mt-1 space-y-1">
        {payload.map((p: any) => (
          <div key={p.dataKey} className="flex items-center justify-between gap-4 text-xs">
            <span className="text-muted-foreground">{p.name}</span>
            <span className="text-foreground font-semibold">{p.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
