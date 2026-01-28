import React, { useMemo, useState } from "react";
import { api } from "../../services/client";
import { useAsync } from "../../app/hooks/useAsync";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/Card";
import { Badge } from "../../components/ui/Badge";
import { Button } from "../../components/ui/Button";
import { Modal } from "../../components/ui/Modal";
import { Input } from "../../components/ui/Input";
import { useToast } from "../../components/ui/toast";
import { fmtUSDT } from "../../utils/format";

export function ClanGoalsPage() {
  const toast = useToast();
  const goalsQ = useAsync(() => api.getGoals(), []);
  const walletQ = useAsync(() => api.getWalletSummary(), []);
  const [cofundOpen, setCofundOpen] = useState(false);
  const [amount, setAmount] = useState("0");
  const cap = 250;

  const max = useMemo(() => Math.min(cap, walletQ.data?.available ?? 0), [walletQ.data]);

  return (
    <div className="space-y-6">
      <div className="flex items-end justify-between gap-4">
        <div>
          <h1 className="text-lg font-semibold">Clan Goals</h1>
          <p className="mt-1 text-sm text-muted-foreground">Weekly objectives with contributor visibility and reward states.</p>
        </div>
        <Button variant="secondary" size="sm" onClick={() => setCofundOpen(true)}>Co-fund bonus pool</Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Weekly Goals</CardTitle>
        </CardHeader>
        <CardContent>
          {goalsQ.loading ? (
            <div className="text-sm text-muted-foreground">Loading…</div>
          ) : goalsQ.error ? (
            <div className="text-sm text-rose-300">Failed to load goals.</div>
          ) : (
            <div className="space-y-3">
              {goalsQ.data!.map((g) => (
                <div key={g.id} className="rounded-2xl border border-border bg-card/60 p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="text-sm font-semibold text-foreground">{g.title}</div>
                      <div className="mt-1 text-sm text-muted-foreground">{g.description}</div>
                      <div className="mt-2 flex items-center gap-2">
                        <Badge tone={g.type === "Clan-wide" ? "info" : g.type === "All-member" ? "warning" : "default"}>{g.type}</Badge>
                        <span className="text-xs text-muted-foreground">{g.remainingLabel}</span>
                      </div>
                    </div>
                    <div className="text-sm font-semibold text-foreground">{g.progress}%</div>
                  </div>
                  <div className="mt-3 h-2 rounded-full bg-muted">
                    <div className="h-2 rounded-full bg-emerald-500/70" style={{ width: `${g.progress}%` }} />
                  </div>
                  <div className="mt-3 flex items-center justify-between text-xs text-muted-foreground">
                    <span>Rewards</span>
                    <Badge tone={g.progress >= 100 ? "success" : "default"}>{g.progress >= 100 ? "Unlocked" : "Locked"}</Badge>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <Modal
        open={cofundOpen}
        title="Co-fund bonus pool"
        description="Optional co-funding is capped. Funds are debited from agent wallet (mock)."
        onClose={() => setCofundOpen(false)}
        footer={
          <div className="flex gap-2">
            <Button variant="secondary" onClick={() => setCofundOpen(false)}>Cancel</Button>
            <Button
              variant="primary"
              disabled={Number(amount) <= 0 || Number(amount) > max}
              onClick={() => {
                toast.push({ title: "Bonus pool funded", message: "Wallet debit recorded (mock).", tone: "success" });
                setCofundOpen(false);
              }}
            >
              Confirm
            </Button>
          </div>
        }
      >
        <div className="space-y-3">
          <div className="rounded-xl border border-border bg-card/60 p-3">
            <div className="text-xs text-muted-foreground">Co-fund cap</div>
            <div className="mt-1 text-sm font-semibold text-foreground">{fmtUSDT(cap)}</div>
            <div className="mt-1 text-xs text-muted-foreground">Available wallet balance may reduce the max.</div>
          </div>
          <div>
            <label className="text-xs text-muted-foreground">Amount (USDT)</label>
            <Input value={amount} onChange={(e) => setAmount(e.target.value)} />
            <div className="mt-1 text-xs text-muted-foreground">Max allowed now: {fmtUSDT(max)}</div>
          </div>
        </div>
      </Modal>
    </div>
  );
}
