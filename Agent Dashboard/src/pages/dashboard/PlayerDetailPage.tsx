import React, { useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { api } from "../../services/client";
import { useAsync } from "../../app/hooks/useAsync";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/Card";
import { Badge } from "../../components/ui/Badge";
import { Button } from "../../components/ui/Button";
import { Tabs } from "../../components/ui/Tabs";
import { Modal } from "../../components/ui/Modal";
import { Input } from "../../components/ui/Input";
import { useToast } from "../../components/ui/toast";
import { fmtUSDT } from "../../utils/format";

type TabKey = "overview" | "transactions" | "activity" | "payouts" | "limits" | "notes" | "audit";

export function PlayerDetailPage() {
  const { playerId } = useParams();
  const nav = useNavigate();
  const toast = useToast();
  const q = useAsync(() => api.getPlayer(playerId || ""), [playerId]);

  const [tab, setTab] = useState<TabKey>("overview");
  const [reclaimOpen, setReclaimOpen] = useState(false);
  const [reclaimAmount, setReclaimAmount] = useState("0");
  const [notes, setNotes] = useState("");

  const eligibleMax = useMemo(() => {
    const p = q.data;
    if (!p) return 0;
    // eligibility: if locked balance exists
    return Math.max(0, p.balanceLocked);
  }, [q.data]);

  const audit = useMemo(() => {
    const p = q.data;
    if (!p) return [];
    return [
      { at: new Date().toISOString(), event: "Profile opened", note: "Viewed by agent" },
      { at: p.lastActive, event: "Last activity", note: "Player session recorded" },
    ];
  }, [q.data]);

  if (q.loading) {
    return <div className="space-y-4"><Card><CardContent className="p-5">Loading player…</CardContent></Card></div>;
  }
  if (q.error || !q.data) {
    return (
      <Card>
        <CardContent className="p-5">
          <div className="text-sm text-rose-300">Player not found.</div>
          <div className="mt-3"><Button variant="secondary" onClick={() => nav("/dashboard/players")}>Back</Button></div>
        </CardContent>
      </Card>
    );
  }

  const p = q.data;

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-lg font-semibold">{p.name}</h1>
          <p className="mt-1 text-sm text-muted-foreground">@{p.username} • {p.id}</p>
          <div className="mt-3 flex flex-wrap gap-2">
            <Badge tone={p.kycTier === "Tier A" ? "success" : p.kycTier === "Tier B" ? "warning" : "danger"}>{p.kycTier}</Badge>
            <Badge tone={p.status === "Active" ? "success" : p.status === "Frozen" ? "danger" : "warning"}>{p.status}</Badge>
            <Badge tone={p.riskScore > 75 ? "danger" : p.riskScore > 45 ? "warning" : "success"}>Risk {p.riskScore}</Badge>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="secondary" onClick={() => nav("/dashboard/players")}>Back</Button>
          <Button
            variant="secondary"
            disabled={eligibleMax <= 0}
            onClick={() => {
              setReclaimAmount(String(eligibleMax.toFixed(2)));
              setReclaimOpen(true);
            }}
          >
            Credit reclaim
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between gap-3">
            <CardTitle>Profile</CardTitle>
            <Tabs
              value={tab}
              onChange={(v) => setTab(v as TabKey)}
              items={[
                { value: "overview", label: "Overview" },
                { value: "transactions", label: "Transactions" },
                { value: "activity", label: "Activity" },
                { value: "payouts", label: "Payouts" },
                { value: "limits", label: "Limits" },
                { value: "notes", label: "Notes" },
                { value: "audit", label: "Audit Log" },
              ]}
            />
          </div>
        </CardHeader>

        <CardContent>
          {tab === "overview" ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="rounded-xl border border-border bg-card/60 p-4">
                <div className="text-xs text-muted-foreground">Available</div>
                <div className="mt-1 text-xl font-semibold">{fmtUSDT(p.balanceAvailable)}</div>
              </div>
              <div className="rounded-xl border border-border bg-card/60 p-4">
                <div className="text-xs text-muted-foreground">Pending</div>
                <div className="mt-1 text-xl font-semibold">{p.balancePending ? fmtUSDT(p.balancePending) : "—"}</div>
                <div className="mt-1 text-xs text-muted-foreground">Automated conversion status.</div>
              </div>
              <div className="rounded-xl border border-border bg-card/60 p-4">
                <div className="text-xs text-muted-foreground">Locked</div>
                <div className="mt-1 text-xl font-semibold">{p.balanceLocked ? fmtUSDT(p.balanceLocked) : "—"}</div>
                <div className="mt-1 text-xs text-muted-foreground">Locks may be due to war entry or restrictions.</div>
              </div>

              <div className="md:col-span-3 rounded-xl border border-border bg-card/60 p-4">
                <div className="text-sm font-medium">Operational Notes</div>
                <p className="mt-1 text-sm text-muted-foreground">
                  Credit allocation is automated. Agent cannot manually credit balances. Use reclaim only when eligible.
                </p>
              </div>
            </div>
          ) : null}

          {tab === "transactions" ? (
            <div className="text-sm text-muted-foreground">
              Transaction history will be populated via API. For now, use Wallet → Ledger for cross-reference.
            </div>
          ) : null}

          {tab === "activity" ? (
            <div className="text-sm text-muted-foreground">
              Activity metrics (sessions, streaks, war contributions) will appear here once wired to live events.
            </div>
          ) : null}

          {tab === "payouts" ? (
            <div className="text-sm text-muted-foreground">
              Payouts are read-only. Open Payouts module for detail views and status timelines.
            </div>
          ) : null}

          {tab === "limits" ? (
            <div className="space-y-2">
              <div className="rounded-xl border border-border bg-card/60 p-4">
                <div className="text-sm font-medium">Responsible Gaming</div>
                <p className="mt-1 text-sm text-muted-foreground">
                  Limits and exclusions override all agent operations. No bypass controls are exposed.
                </p>
              </div>
            </div>
          ) : null}

          {tab === "notes" ? (
            <div className="space-y-2">
              <label className="text-xs text-muted-foreground">Internal note</label>
              <textarea
                className="w-full min-h-[120px] rounded-xl bg-muted border border-border px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Write a short, factual note. Avoid sensitive details."
              />
              <div className="flex justify-end">
                <Button
                  size="sm"
                  variant="secondary"
                  onClick={() => toast.push({ title: "Note saved", message: "Stored locally (mock).", tone: "success" })}
                >
                  Save note
                </Button>
              </div>
            </div>
          ) : null}

          {tab === "audit" ? (
            <div className="space-y-2">
              {audit.map((a, idx) => (
                <div key={idx} className="rounded-xl border border-border bg-card/60 px-4 py-3">
                  <div className="text-sm font-medium text-foreground">{a.event}</div>
                  <div className="mt-0.5 text-xs text-muted-foreground">{new Date(a.at).toLocaleString()}</div>
                  <div className="mt-1 text-sm text-muted-foreground">{a.note}</div>
                </div>
              ))}
            </div>
          ) : null}
        </CardContent>
      </Card>

      <Modal
        open={reclaimOpen}
        title="Credit reclaim"
        description="Reclaim is only available when there is eligible locked balance. This will create a ledger entry (mock)."
        onClose={() => setReclaimOpen(false)}
        footer={
          <div className="flex gap-2">
            <Button variant="secondary" onClick={() => setReclaimOpen(false)}>Cancel</Button>
            <Button
              variant="primary"
              disabled={Number(reclaimAmount) <= 0 || Number(reclaimAmount) > eligibleMax}
              onClick={() => {
                toast.push({ title: "Reclaim queued", message: "Ledger updated (mock).", tone: "success" });
                setReclaimOpen(false);
              }}
            >
              Confirm reclaim
            </Button>
          </div>
        }
      >
        <div className="space-y-3">
          <div className="rounded-xl border border-border bg-card/60 px-4 py-3">
            <div className="text-xs text-muted-foreground">Eligible max</div>
            <div className="mt-1 text-sm text-foreground font-semibold">{fmtUSDT(eligibleMax)}</div>
          </div>
          <div>
            <label className="text-xs text-muted-foreground">Reclaim amount (USDT)</label>
            <Input value={reclaimAmount} onChange={(e) => setReclaimAmount(e.target.value)} />
            {Number(reclaimAmount) > eligibleMax ? (
              <p className="mt-1 text-xs text-rose-300">Amount cannot exceed eligible max.</p>
            ) : null}
          </div>
        </div>
      </Modal>
    </div>
  );
}
