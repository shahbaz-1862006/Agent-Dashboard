import React, { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../../services/client";
import { useAsync } from "../../app/hooks/useAsync";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/Card";
import { Badge } from "../../components/ui/Badge";
import { Button } from "../../components/ui/Button";
import { TimeRange, TimeRangeControl } from "../../components/charts/TimeRangeControl";
import { ChartTooltip } from "../../components/charts/ChartTooltip";
import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { fmtUSDT } from "../../utils/format";

function series(range: TimeRange) {
  const points = range === "24H" ? 24 : range === "7D" ? 7 : range === "30D" ? 30 : 12;
  return Array.from({ length: points }).map((_, i) => ({
    label: String(i + 1),
    ggr: Math.round(100 + Math.sin(i / 3) * 40 + (i % 5) * 7),
    ngr: Math.round(90 + Math.cos(i / 3) * 30 + (i % 4) * 5),
  }));
}

export function CommissionsPage() {
  const nav = useNavigate();
  const q = useAsync(() => api.getStatements(), []);
  const [range, setRange] = useState<TimeRange>("30D");
  const data = useMemo(() => series(range), [range]);

  return (
    <div className="space-y-6">
      <div className="flex items-end justify-between gap-4">
        <div>
          <h1 className="text-lg font-semibold">Commissions</h1>
          <p className="mt-1 text-sm text-muted-foreground">Statements, tiers, adjustments, and ledger references.</p>
        </div>
        <div className="w-32">
          <TimeRangeControl value={range} onChange={setRange} />
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>GGR / NGR Trend</CardTitle>
        </CardHeader>
        <CardContent className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data}>
              <XAxis dataKey="label" stroke="rgba(148,163,184,0.45)" tickLine={false} axisLine={false} />
              <YAxis stroke="rgba(148,163,184,0.45)" tickLine={false} axisLine={false} />
              <Tooltip content={<ChartTooltip />} />
              <Line type="monotone" dataKey="ggr" name="GGR" strokeWidth={2} dot={false} />
              <Line type="monotone" dataKey="ngr" name="NGR" strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Weekly Statements</CardTitle>
            <Button size="sm" variant="secondary" onClick={() => nav("/dashboard/wallet")}>View wallet ledger</Button>
          </div>
        </CardHeader>
        <CardContent>
          {q.loading ? (
            <div className="text-sm text-muted-foreground">Loading…</div>
          ) : q.error ? (
            <div className="text-sm text-rose-300">Failed to load statements.</div>
          ) : q.data!.length === 0 ? (
            <div className="text-sm text-muted-foreground">No statements available.</div>
          ) : (
            <div className="space-y-2">
              {q.data!.map((s) => (
                <div key={s.id} className="rounded-xl border border-border bg-card/60 px-4 py-3 flex items-center justify-between gap-4">
                  <div>
                    <div className="text-sm font-semibold text-foreground">{s.weekLabel}</div>
                    <div className="mt-0.5 text-xs text-muted-foreground">Ledger ref: {s.ledgerRefId}</div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="text-sm font-semibold">{fmtUSDT(s.finalPayout)}</div>
                    <Badge tone={s.status === "Paid" ? "success" : s.status === "Adjusted" ? "warning" : "info"}>{s.status}</Badge>
                    <Button size="sm" variant="secondary" onClick={() => nav(`/dashboard/commissions/statements/${s.id}`)}>View</Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
