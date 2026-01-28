import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import { api } from "../../services/client";
import { useAsync } from "../../app/hooks/useAsync";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/Card";
import { Badge } from "../../components/ui/Badge";
import { Button } from "../../components/ui/Button";
import { fmtPct, fmtUSDT } from "../../utils/format";

export function StatementDetailPage() {
  const { statementId } = useParams();
  const nav = useNavigate();
  const q = useAsync(() => api.getStatement(statementId || ""), [statementId]);

  if (q.loading) return <Card><CardContent className="p-5">Loading statement…</CardContent></Card>;
  if (q.error || !q.data) {
    return (
      <Card>
        <CardContent className="p-5">
          <div className="text-sm text-rose-300">Statement not found.</div>
          <div className="mt-3"><Button variant="secondary" onClick={() => nav("/dashboard/commissions")}>Back</Button></div>
        </CardContent>
      </Card>
    );
  }

  const s = q.data;

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-lg font-semibold">Statement</h1>
          <p className="mt-1 text-sm text-muted-foreground">{s.weekLabel} • {s.id}</p>
        </div>
        <Button variant="secondary" onClick={() => nav("/dashboard/commissions")}>Back</Button>
      </div>

      {/* STRICT ORDER */}
      <Card>
        <CardHeader><CardTitle>1. Summary</CardTitle></CardHeader>
        <CardContent className="flex items-center justify-between">
          <div>
            <div className="text-sm text-muted-foreground">Final commission payout</div>
            <div className="mt-1 text-2xl font-semibold">{fmtUSDT(s.finalPayout)}</div>
            <div className="mt-1 text-xs text-muted-foreground">Ledger ref: {s.ledgerRefId}</div>
          </div>
          <Badge tone={s.status === "Paid" ? "success" : s.status === "Adjusted" ? "warning" : "info"}>{s.status}</Badge>
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle>2. GGR Breakdown</CardTitle></CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div className="rounded-xl border border-border bg-card/60 p-4">
            <div className="text-xs text-muted-foreground">GGR</div>
            <div className="mt-1 text-xl font-semibold">{fmtUSDT(s.ggr)}</div>
          </div>
          <div className="rounded-xl border border-border bg-card/60 p-4">
            <div className="text-xs text-muted-foreground">NGR</div>
            <div className="mt-1 text-xl font-semibold">{fmtUSDT(s.ngr)}</div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle>3. Tier Application</CardTitle></CardHeader>
        <CardContent>
          <div className="text-sm text-muted-foreground">Commission rate applied for this statement.</div>
          <div className="mt-2 rounded-xl border border-border bg-card/60 p-4 flex items-center justify-between">
            <div className="text-sm font-semibold text-foreground">Tier 2</div>
            <div className="text-sm font-semibold">{fmtPct(s.commissionRate * 100)}</div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle>4. Adjustments</CardTitle></CardHeader>
        <CardContent>
          <div className="rounded-xl border border-border bg-card/60 p-4 flex items-center justify-between">
            <div className="text-sm text-foreground">Manual/system adjustments</div>
            <div className={"text-sm font-semibold " + (s.adjustments < 0 ? "text-rose-300" : "text-emerald-300")}>
              {s.adjustments >= 0 ? "+" : ""}{fmtUSDT(s.adjustments)}
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle>5. Final Commission</CardTitle></CardHeader>
        <CardContent>
          <div className="text-sm text-muted-foreground">Computed using NGR × rate + adjustments.</div>
          <div className="mt-2 rounded-xl border border-border bg-card/60 p-4 flex items-center justify-between">
            <div className="text-sm font-semibold text-foreground">Final payout</div>
            <div className="text-xl font-semibold">{fmtUSDT(s.finalPayout)}</div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle>6. Payout Processing</CardTitle></CardHeader>
        <CardContent>
          <div className="text-sm text-muted-foreground">
            Payouts are processed by the system. If status is Pending for too long, escalate via Support.
          </div>
          {s.paidAt ? <div className="mt-2 text-xs text-muted-foreground">Paid at: {new Date(s.paidAt).toLocaleString()}</div> : null}
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle>7. Wallet Ledger Link</CardTitle></CardHeader>
        <CardContent className="flex items-center justify-between">
          <div className="text-sm text-muted-foreground">Open wallet ledger to find entry by ref ID.</div>
          <Button variant="secondary" onClick={() => nav("/dashboard/wallet")}>Open wallet</Button>
        </CardContent>
      </Card>
    </div>
  );
}
