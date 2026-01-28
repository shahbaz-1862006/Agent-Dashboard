import React, { useMemo, useState } from "react";
import { api } from "../../services/client";
import { useAsync } from "../../app/hooks/useAsync";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/Card";
import { Table, THead, TRow, TH, TD } from "../../components/ui/Table";
import { Badge } from "../../components/ui/Badge";
import { Input } from "../../components/ui/Input";
import { Select } from "../../components/ui/Select";
import { Drawer } from "../../components/ui/Drawer";
import { Button } from "../../components/ui/Button";
import type { Payout, PayoutStatus } from "../../types";
import { fmtUSDT } from "../../utils/format";
import { useToast } from "../../components/ui/toast";

export function PayoutsPage() {
  const toast = useToast();
  const q = useAsync(() => api.getPayouts(), []);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<"" | PayoutStatus>("");
  const [selected, setSelected] = useState<Payout | null>(null);

  const filtered = useMemo(() => {
    const rows = q.data ?? [];
    const s = search.trim().toLowerCase();
    return rows.filter((p) => {
      const matchesSearch = !s || p.playerName.toLowerCase().includes(s) || p.id.toLowerCase().includes(s);
      const matchesStatus = !status || p.status === status;
      return matchesSearch && matchesStatus;
    });
  }, [q.data, search, status]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-lg font-semibold">Payouts</h1>
        <p className="mt-1 text-sm text-muted-foreground">Read-only. Agents cannot approve, reject, or retry payouts.</p>
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
            <CardTitle>Requests</CardTitle>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 w-full md:w-[520px]">
              <Input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search by player or payout ID" />
              <Select value={status} onChange={(e) => setStatus(e.target.value as any)}>
                <option value="">All statuses</option>
                <option value="Pending">Pending</option>
                <option value="Completed">Completed</option>
                <option value="Failed">Failed</option>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {q.loading ? (
            <div className="text-sm text-muted-foreground">Loading…</div>
          ) : q.error ? (
            <div className="text-sm text-rose-300">Failed to load payouts.</div>
          ) : filtered.length === 0 ? (
            <div className="text-sm text-muted-foreground">No payouts found.</div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <THead>
                  <TRow>
                    <TH>Payout</TH>
                    <TH>Player</TH>
                    <TH>Method</TH>
                    <TH>Status</TH>
                    <TH className="text-right">Amount</TH>
                    <TH>Requested</TH>
                  </TRow>
                </THead>
                <tbody>
                  {filtered.map((p) => (
                    <TRow key={p.id} className="hover:bg-muted/40 cursor-pointer" onClick={() => setSelected(p)}>
                      <TD className="font-medium">{p.id}</TD>
                      <TD>
                        <div className="font-medium">{p.playerName}</div>
                        <div className="text-xs text-muted-foreground">{p.playerId}</div>
                      </TD>
                      <TD className="text-foreground">{p.method}</TD>
                      <TD><Badge tone={p.status === "Completed" ? "success" : p.status === "Failed" ? "danger" : "warning"}>{p.status}</Badge></TD>
                      <TD className="text-right font-semibold">{fmtUSDT(p.amount)}</TD>
                      <TD className="text-muted-foreground">{new Date(p.requestedAt).toLocaleString()}</TD>
                    </TRow>
                  ))}
                </tbody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      <Drawer open={!!selected} title={selected ? `Payout ${selected.id}` : "Payout"} onClose={() => setSelected(null)}>
        {selected ? (
          <div className="space-y-4">
            <div className="rounded-xl border border-border bg-card/60 p-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-xs text-muted-foreground">Player</div>
                  <div className="text-sm font-semibold">{selected.playerName}</div>
                </div>
                <Badge tone={selected.status === "Completed" ? "success" : selected.status === "Failed" ? "danger" : "warning"}>{selected.status}</Badge>
              </div>
              <div className="mt-3 grid grid-cols-2 gap-3 text-sm">
                <div>
                  <div className="text-xs text-muted-foreground">Amount</div>
                  <div className="font-semibold">{fmtUSDT(selected.amount)}</div>
                </div>
                <div>
                  <div className="text-xs text-muted-foreground">Method</div>
                  <div className="text-foreground">{selected.method}</div>
                </div>
                <div className="col-span-2">
                  <div className="text-xs text-muted-foreground">Destination</div>
                  <div className="text-foreground">{selected.destinationMasked}</div>
                </div>
                {selected.txHash ? (
                  <div className="col-span-2">
                    <div className="text-xs text-muted-foreground">Tx hash</div>
                    <div className="text-foreground break-all">{selected.txHash}</div>
                  </div>
                ) : null}
              </div>
            </div>

            <div>
              <div className="text-sm font-semibold">Timeline</div>
              <div className="mt-2 space-y-2">
                {selected.timeline.map((t, idx) => (
                  <div key={idx} className="rounded-xl border border-border bg-card/60 px-4 py-3">
                    <div className="flex items-center justify-between">
                      <div className="text-sm font-medium">{t.status}</div>
                      <div className="text-xs text-muted-foreground">{new Date(t.at).toLocaleString()}</div>
                    </div>
                    {t.note ? <div className="mt-1 text-sm text-muted-foreground">{t.note}</div> : null}
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-xl border border-border bg-card/60 p-4">
              <div className="text-sm font-semibold">Agent actions</div>
              <p className="mt-1 text-sm text-muted-foreground">
                This module is read-only. If a payout is pending too long or fails repeatedly, escalate via Support.
              </p>
              <div className="mt-3 flex gap-2">
                <Button size="sm" variant="secondary" onClick={() => toast.push({ title: "Support draft created", message: "Prepared a support escalation note (mock).", tone: "info" })}>
                  Escalate to support
                </Button>
                <Button size="sm" variant="ghost" onClick={() => setSelected(null)}>Close</Button>
              </div>
            </div>
          </div>
        ) : null}
      </Drawer>
    </div>
  );
}
