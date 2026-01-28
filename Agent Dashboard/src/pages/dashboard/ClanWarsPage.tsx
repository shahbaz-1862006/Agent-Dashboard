import React, { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../../services/client";
import { useAsync } from "../../app/hooks/useAsync";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/Card";
import { Badge } from "../../components/ui/Badge";
import { Button } from "../../components/ui/Button";
import { fmtUSDT } from "../../utils/format";

export function ClanWarsPage() {
  const nav = useNavigate();
  const q = useAsync(() => api.getWars(), []);

  const buckets = useMemo(() => {
    const wars = q.data ?? [];
    return {
      Upcoming: wars.filter((w) => w.status === "Upcoming"),
      Active: wars.filter((w) => w.status === "Active"),
      Past: wars.filter((w) => w.status === "Past"),
    };
  }, [q.data]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-lg font-semibold">Clan Wars</h1>
        <p className="mt-1 text-sm text-muted-foreground">Competitive events with entry locks, live scoring, and outcomes.</p>
      </div>

      {q.loading ? (
        <Card><CardContent className="p-5 text-sm text-muted-foreground">Loading…</CardContent></Card>
      ) : q.error ? (
        <Card><CardContent className="p-5 text-sm text-rose-300">Failed to load wars.</CardContent></Card>
      ) : (
        <div className="space-y-4">
          {(["Active","Upcoming","Past"] as const).map((k) => (
            <Card key={k}>
              <CardHeader><CardTitle>{k}</CardTitle></CardHeader>
              <CardContent className="space-y-2">
                {buckets[k].length === 0 ? (
                  <div className="text-sm text-muted-foreground">No {k.toLowerCase()} wars.</div>
                ) : (
                  buckets[k].map((w) => (
                    <div key={w.id} className="rounded-xl border border-border bg-card/60 px-4 py-3 flex items-center justify-between gap-4">
                      <div>
                        <div className="text-sm font-semibold">{w.name}</div>
                        <div className="mt-0.5 text-xs text-muted-foreground">Opponent: {w.opponent} • Entry: {fmtUSDT(w.entryFee)}</div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge tone={w.status === "Active" ? "success" : w.status === "Upcoming" ? "warning" : "default"}>{w.status}</Badge>
                        <Badge tone={w.registered ? "info" : "default"}>{w.registered ? "Registered" : "Not registered"}</Badge>
                        <Button size="sm" variant="secondary" onClick={() => nav(`/dashboard/clan/wars/${w.id}`)}>Open</Button>
                      </div>
                    </div>
                  ))
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
