import React, { useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { api } from "../../services/client";
import { useAsync } from "../../app/hooks/useAsync";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/Card";
import { Badge } from "../../components/ui/Badge";
import { Button } from "../../components/ui/Button";
import { Modal } from "../../components/ui/Modal";
import { useToast } from "../../components/ui/toast";
import { fmtUSDT } from "../../utils/format";

export function WarDetailPage() {
  const { warId } = useParams();
  const nav = useNavigate();
  const toast = useToast();
  const warsQ = useAsync(() => api.getWars(), []);
  const [confirmOpen, setConfirmOpen] = useState(false);

  const war = useMemo(() => (warsQ.data ?? []).find((w) => w.id === warId) ?? null, [warsQ.data, warId]);

  if (warsQ.loading) return <Card><CardContent className="p-5">Loading war…</CardContent></Card>;
  if (warsQ.error || !war) {
    return (
      <Card>
        <CardContent className="p-5">
          <div className="text-sm text-rose-300">War not found.</div>
          <div className="mt-3"><Button variant="secondary" onClick={() => nav("/dashboard/clan/wars")}>Back</Button></div>
        </CardContent>
      </Card>
    );
  }

  const lead = war.scoreYou - war.scoreThem;

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-lg font-semibold">{war.name}</h1>
          <p className="mt-1 text-sm text-muted-foreground">{war.id} • Opponent: {war.opponent}</p>
          <div className="mt-3 flex gap-2">
            <Badge tone={war.status === "Active" ? "success" : war.status === "Upcoming" ? "warning" : "default"}>{war.status}</Badge>
            <Badge tone={war.registered ? "info" : "default"}>{war.registered ? "Registered" : "Not registered"}</Badge>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="secondary" onClick={() => nav("/dashboard/clan/wars")}>Back</Button>
          {!war.registered && war.status !== "Past" ? (
            <Button variant="primary" onClick={() => setConfirmOpen(true)}>Register</Button>
          ) : null}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <Card className="lg:col-span-2">
          <CardHeader><CardTitle>Live War Dashboard</CardTitle></CardHeader>
          <CardContent className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <div className="rounded-xl border border-border bg-card/60 p-4">
                <div className="text-xs text-muted-foreground">Your score</div>
                <div className="mt-1 text-2xl font-semibold">{war.scoreYou}</div>
              </div>
              <div className="rounded-xl border border-border bg-card/60 p-4">
                <div className="text-xs text-muted-foreground">Opponent score</div>
                <div className="mt-1 text-2xl font-semibold">{war.scoreThem}</div>
              </div>
            </div>

            <div className="rounded-xl border border-border bg-card/60 p-4 flex items-center justify-between">
              <div>
                <div className="text-xs text-muted-foreground">Status</div>
                <div className="mt-1 text-sm text-foreground">{war.status === "Active" ? "Scoring live" : war.status === "Upcoming" ? "Not started" : "Completed"}</div>
              </div>
              <Badge tone={lead > 0 ? "success" : lead < 0 ? "danger" : "warning"}>
                {lead > 0 ? `Leading by ${lead}` : lead < 0 ? `Behind by ${Math.abs(lead)}` : "Tied"}
              </Badge>
            </div>

            <div className="rounded-xl border border-border bg-card/60 p-4">
              <div className="text-sm font-semibold">Scoring rules</div>
              <ul className="mt-2 list-disc pl-5 text-sm text-muted-foreground space-y-1">
                <li>Scores are computed automatically from gameplay events.</li>
                <li>Entry fee is locked on registration and released/settled on completion.</li>
                <li>Agent cannot modify player scores or disqualify members.</li>
              </ul>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>Registration</CardTitle></CardHeader>
          <CardContent className="space-y-3">
            <div className="rounded-xl border border-border bg-card/60 p-4">
              <div className="text-xs text-muted-foreground">Entry fee</div>
              <div className="mt-1 text-xl font-semibold">{fmtUSDT(war.entryFee)}</div>
              <div className="mt-1 text-xs text-muted-foreground">Fee is locked from agent wallet.</div>
            </div>
            {!war.registered && war.status !== "Past" ? (
              <Button variant="primary" onClick={() => setConfirmOpen(true)}>Register & lock fee</Button>
            ) : (
              <div className="text-sm text-muted-foreground">Already registered.</div>
            )}
            <div className="rounded-xl border border-border bg-card/60 p-4">
              <div className="text-sm font-semibold">Motivation tools</div>
              <p className="mt-1 text-sm text-muted-foreground">Use clan chat externally to encourage participation.</p>
              <Button size="sm" variant="secondary" className="mt-3" onClick={() => toast.push({ title: "Message drafted", message: "Prepared a clan motivation message (mock).", tone: "info" })}>
                Draft message
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      <Modal
        open={confirmOpen}
        title="Confirm war registration"
        description="Entry fee will be locked from your wallet. This action is auditable."
        onClose={() => setConfirmOpen(false)}
        footer={
          <div className="flex gap-2">
            <Button variant="secondary" onClick={() => setConfirmOpen(false)}>Cancel</Button>
            <Button
              variant="primary"
              onClick={async () => {
                const updated = await api.registerWar(war.id);
                if (updated) {
                  warsQ.setData((prev) => prev ? prev.map((x) => x.id === updated.id ? updated : x) : prev);
                }
                toast.push({ title: "Registered", message: "Entry fee locked (mock).", tone: "success" });
                setConfirmOpen(false);
              }}
            >
              Confirm
            </Button>
          </div>
        }
      >
        <div className="space-y-3">
          <div className="rounded-xl border border-border bg-card/60 p-4">
            <div className="text-xs text-muted-foreground">Fee to lock</div>
            <div className="mt-1 text-lg font-semibold">{fmtUSDT(war.entryFee)}</div>
          </div>
          <div className="text-sm text-muted-foreground">
            If wallet balance is insufficient, registration will fail in real systems. In this mock, it will proceed.
          </div>
        </div>
      </Modal>
    </div>
  );
}
