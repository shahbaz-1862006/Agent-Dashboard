import React, { useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/Card";
import { Badge } from "../../components/ui/Badge";
import { Button } from "../../components/ui/Button";
import { Skeleton } from "../../components/ui/Skeleton";
import { TimeRange, TimeRangeControl } from "../../components/charts/TimeRangeControl";
import { ChartTooltip } from "../../components/charts/ChartTooltip";
import { api } from "../../services/client";
import { useAsync } from "../../app/hooks/useAsync";
import { fmtUSDT } from "../../utils/format";
import { useNavigate } from "react-router-dom";
import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis, AreaChart, Area } from "recharts";

function makeSeries(range: TimeRange) {
  const points = range === "24H" ? 24 : range === "7D" ? 7 : range === "30D" ? 30 : range === "90D" ? 12 : 12;
  return Array.from({ length: points }).map((_, i) => {
    const x = i + 1;
    const deposits = Math.round(50 + Math.sin(i / 2) * 20 + (i % 5) * 5);
    const withdrawals = Math.round(35 + Math.cos(i / 2) * 15 + (i % 3) * 4);
    const ggr = Math.round(120 + Math.sin(i / 3) * 30 + (i % 4) * 6);
    const active = Math.round(40 + Math.cos(i / 4) * 8 + (i % 6));
    return { label: String(x), deposits, withdrawals, ggr, active };
  });
}

export function HomePage() {
  const [range, setRange] = useState<TimeRange>("7D");
  const nav = useNavigate();

  const walletQ = useAsync(() => api.getWalletSummary(), []);
  const alertsQ = useAsync(() => api.getAlerts(), []);
  const invitesQ = useAsync(() => api.getInvites(), []);
  const payoutsQ = useAsync(() => api.getPayouts(), []);
  const goalsQ = useAsync(() => api.getGoals(), []);
  const statementsQ = useAsync(() => api.getStatements(), []);

  const series = useMemo(() => makeSeries(range), [range]);

  return (
    <div className="space-y-6">
      <div className="flex items-end justify-between gap-4">
        <div>
          <h1 className="text-lg font-semibold">Home</h1>
          <p className="mt-1 text-sm text-muted-foreground">Operational overview: wallet, risk, and actions.</p>
        </div>
        <div className="w-32">
          <TimeRangeControl value={range} onChange={setRange} />
        </div>
      </div>

      {/* Top widgets */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Wallet Health</CardTitle>
          </CardHeader>
          <CardContent>
            {walletQ.loading ? (
              <div className="space-y-2">
                <Skeleton className="h-6 w-40" />
                <Skeleton className="h-4 w-56" />
              </div>
            ) : walletQ.error ? (
              <div className="text-sm text-destructive">Failed to load wallet. <button className="underline" onClick={() => location.reload()}>Retry</button></div>
            ) : (
              <div className="space-y-3">
                <div className="flex items-baseline justify-between">
                  <div className="text-2xl font-semibold">{fmtUSDT(walletQ.data!.total)}</div>
                  {walletQ.data!.available < 2000 ? <Badge tone="warning">Low balance</Badge> : <Badge tone="success">Healthy</Badge>}
                </div>
                <div className="grid grid-cols-3 gap-2 text-xs text-muted-foreground">
                  <div>
                    <div className="text-muted-foreground">Available</div>
                    <div className="text-foreground font-medium">{fmtUSDT(walletQ.data!.available)}</div>
                  </div>
                  <div>
                    <div className="text-muted-foreground">Locked</div>
                    <div className="text-foreground font-medium">{fmtUSDT(walletQ.data!.locked)}</div>
                  </div>
                  <div>
                    <div className="text-muted-foreground">USDT</div>
                    <div className="text-foreground font-medium">TRC-20</div>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button size="sm" variant="secondary" onClick={() => nav("/dashboard/wallet")}>View wallet</Button>
                  <Button size="sm" variant="primary" onClick={() => nav("/dashboard/wallet")}>Add funds</Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Commission Snapshot</CardTitle>
          </CardHeader>
          <CardContent>
            {statementsQ.loading ? (
              <div className="space-y-2">
                <Skeleton className="h-6 w-44" />
                <Skeleton className="h-4 w-52" />
              </div>
            ) : statementsQ.error ? (
              <div className="text-sm text-destructive">Failed to load commissions.</div>
            ) : (
              <div className="space-y-3">
                <div className="flex items-baseline justify-between">
                  <div className="text-2xl font-semibold">{fmtUSDT(statementsQ.data![0]!.finalPayout)}</div>
                  <Badge tone={statementsQ.data![0]!.status === "Paid" ? "success" : "warning"}>{statementsQ.data![0]!.status}</Badge>
                </div>
                <div className="text-xs text-muted-foreground">
                  Tier: <span className="text-foreground font-medium">Tier 2</span> • Cycle ends in{" "}
                  <span className="text-foreground font-medium">3d 14h</span>
                </div>
                <Button size="sm" variant="secondary" onClick={() => nav("/dashboard/commissions")}>
                  View statements
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Alerts</CardTitle>
          </CardHeader>
          <CardContent>
            {alertsQ.loading ? (
              <div className="space-y-2">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-5/6" />
                <Skeleton className="h-4 w-4/6" />
              </div>
            ) : alertsQ.error ? (
              <div className="text-sm text-destructive">Failed to load alerts.</div>
            ) : alertsQ.data!.length === 0 ? (
              <div className="text-sm text-muted-foreground">No active alerts.</div>
            ) : (
              <div className="space-y-2">
                {alertsQ.data!.map((a) => (
                  <div key={a.id} className="flex items-start justify-between gap-3 rounded-xl border border-border bg-card/60 px-3 py-2">
                    <div>
                      <div className="text-sm font-medium text-foreground">{a.title}</div>
                      <div className="text-xs text-muted-foreground">{a.description}</div>
                    </div>
                    <Button size="sm" variant="ghost" onClick={() => nav(a.deepLink)}>
                      Resolve
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Deposits vs Withdrawals</CardTitle>
              <Button size="sm" variant="ghost" onClick={() => nav("/dashboard/wallet")}>Open</Button>
            </div>
          </CardHeader>
          <CardContent className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={series}>
                <XAxis dataKey="label" stroke="rgba(148,163,184,0.45)" tickLine={false} axisLine={false} />
                <YAxis stroke="rgba(148,163,184,0.45)" tickLine={false} axisLine={false} />
                <Tooltip content={<ChartTooltip />} />
                <Line type="monotone" dataKey="deposits" name="Deposits" strokeWidth={2} dot={false} />
                <Line type="monotone" dataKey="withdrawals" name="Withdrawals" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>GGR Trend</CardTitle>
              <Button size="sm" variant="ghost" onClick={() => nav("/dashboard/commissions")}>Open</Button>
            </div>
          </CardHeader>
          <CardContent className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={series}>
                <XAxis dataKey="label" stroke="rgba(148,163,184,0.45)" tickLine={false} axisLine={false} />
                <YAxis stroke="rgba(148,163,184,0.45)" tickLine={false} axisLine={false} />
                <Tooltip content={<ChartTooltip />} />
                <Area type="monotone" dataKey="ggr" name="GGR" strokeWidth={2} fillOpacity={0.15} />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Bottom widgets */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <Card className="lg:col-span-2">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Recent Payouts</CardTitle>
              <Button size="sm" variant="ghost" onClick={() => nav("/dashboard/payouts")}>Open</Button>
            </div>
          </CardHeader>
          <CardContent>
            {payoutsQ.loading ? (
              <Skeleton className="h-10 w-full" />
            ) : payoutsQ.error ? (
              <div className="text-sm text-rose-300">Failed to load payouts.</div>
            ) : (
              <div className="space-y-2">
                {payoutsQ.data!.slice(0, 3).map((p) => (
                  <div key={p.id} className="flex items-center justify-between gap-4 rounded-xl border border-border bg-card/60 px-3 py-2">
                    <div>
                      <div className="text-sm font-medium">{p.playerName}</div>
                      <div className="text-xs text-muted-foreground">{p.method} • {p.id}</div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="text-sm font-semibold">{fmtUSDT(p.amount)}</div>
                      <Badge tone={p.status === "Completed" ? "success" : p.status === "Failed" ? "danger" : "warning"}>{p.status}</Badge>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Clan Goals</CardTitle>
          </CardHeader>
          <CardContent>
            {goalsQ.loading ? (
              <div className="space-y-2">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-5/6" />
              </div>
            ) : goalsQ.error ? (
              <div className="text-sm text-rose-300">Failed to load goals.</div>
            ) : (
              <div className="space-y-3">
                {goalsQ.data!.slice(0, 2).map((g) => (
                  <div key={g.id}>
                    <div className="flex items-center justify-between text-sm">
                      <div className="text-foreground font-medium">{g.title}</div>
                      <div className="text-muted-foreground">{g.progress}%</div>
                    </div>
                    <div className="mt-2 h-2 rounded-full bg-muted">
                      <div className="h-2 rounded-full bg-emerald-500/70" style={{ width: `${g.progress}%` }} />
                    </div>
                    <div className="mt-1 text-xs text-muted-foreground">{g.remainingLabel}</div>
                  </div>
                ))}
                <Button size="sm" variant="secondary" onClick={() => nav("/dashboard/clan/goals")}>View clan hub</Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
