import React, { useMemo, useState } from "react";
import { api } from "../../services/client";
import { useAsync } from "../../app/hooks/useAsync";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/Card";
import { Button } from "../../components/ui/Button";
import { Badge } from "../../components/ui/Badge";
import { Table, THead, TRow, TH, TD } from "../../components/ui/Table";
import { Modal } from "../../components/ui/Modal";
import { Input } from "../../components/ui/Input";
import { Select } from "../../components/ui/Select";
import { useToast } from "../../components/ui/toast";
import type { Invite, InviteStatus } from "../../types";
import { downloadCsv } from "../../utils/csv";
import { printTableAsPdf } from "../../utils/print";

function statusTone(s: InviteStatus) {
  if (s === "Accepted") return "success";
  if (s === "Expired") return "danger";
  return "warning";
}

export function InvitesPage() {
  const toast = useToast();
  const q = useAsync(() => api.getInvites(), []);

  const [createOpen, setCreateOpen] = useState(false);
  const [created, setCreated] = useState<Invite | null>(null);
  const [details, setDetails] = useState<Invite | null>(null);

  // create modal state
  const [channel, setChannel] = useState<Invite["channel"]>("WhatsApp");
  const [label, setLabel] = useState("");
  const [expiryDays, setExpiryDays] = useState<7 | 3 | 1>(7);

  // filters
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<"" | InviteStatus>("");
  const [channelFilter, setChannelFilter] = useState<"" | Invite["channel"]>("");

  // mock quota + reset date (wireframe requirement)
  const quota = { used: 42, total: 50 };
  const remaining = Math.max(0, quota.total - quota.used);
  const resetDate = new Date(Date.now() + 5 * 86400000);

  const rows = useMemo(() => {
    const all = q.data ?? [];
    const s = search.trim().toLowerCase();
    return all.filter((i) => {
      const matchesSearch = !s || (i.label ?? "").toLowerCase().includes(s) || i.id.toLowerCase().includes(s);
      const matchesStatus = !status || i.status === status;
      const matchesChannel = !channelFilter || i.channel === channelFilter;
      return matchesSearch && matchesStatus && matchesChannel;
    });
  }, [q.data, search, status, channelFilter]);

  const csvRows = useMemo(
    () =>
      rows.map((i) => ({
        id: i.id,
        label: i.label ?? "",
        channel: i.channel,
        status: i.status,
        createdAt: i.createdAt,
        expiresAt: i.expiresAt,
        acceptedBy: i.acceptedBy ?? "",
        link: i.link,
      })),
    [rows]
  );

  function share(inv: Invite, ch: Invite["channel"]) {
    const text = `Clazino invite link: ${inv.link}`;
    if (ch === "WhatsApp") {
      window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, "_blank");
      return;
    }
    if (ch === "Telegram") {
      window.open(`https://t.me/share/url?url=${encodeURIComponent(inv.link)}&text=${encodeURIComponent("Clazino invite")}`, "_blank");
      return;
    }
    if (ch === "Email") {
      window.open(`mailto:?subject=${encodeURIComponent("Clazino Invite")}&body=${encodeURIComponent(text)}`);
      return;
    }
    // Copy
    navigator.clipboard.writeText(inv.link);
    toast.push({ title: "Link copied", message: "Invite link copied to clipboard.", tone: "success" });
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
        <div>
          <h1 className="text-lg font-semibold">Invites</h1>
          <p className="mt-1 text-sm text-muted-foreground">Invite-only onboarding. Tokens expire and are auditable.</p>
        </div>

        <div className="flex flex-wrap gap-2">
          <Button
            variant="secondary"
            size="sm"
            onClick={() => {
              downloadCsv("invites.csv", csvRows);
              toast.push({ title: "Export created", message: "invites.csv downloaded.", tone: "success" });
            }}
            disabled={!csvRows.length}
          >
            Export CSV
          </Button>
          <Button
            variant="secondary"
            size="sm"
            onClick={() => {
              printTableAsPdf({
                title: "Clazino – Invites",
                columns: ["Label", "Channel", "Status", "Created", "Expiry", "Accepted By", "Invite ID"],
                rows: rows.map((i) => [
                  i.label ?? "Invite",
                  i.channel,
                  i.status,
                  new Date(i.createdAt).toLocaleString(),
                  new Date(i.expiresAt).toLocaleString(),
                  i.acceptedBy ?? "–",
                  i.id,
                ]),
              });
              toast.push({ title: "Export", message: "Print dialog opened (save as PDF).", tone: "success" });
            }}
            disabled={!rows.length}
          >
            Export PDF
          </Button>
          <Button variant="primary" size="sm" onClick={() => { setCreateOpen(true); setCreated(null); }}>Create invite</Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Invite summary</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="rounded-xl border border-border bg-card/60 p-3">
              <div className="text-xs text-muted-foreground">Invites remaining</div>
              <div className="mt-1 text-2xl font-semibold text-foreground">{remaining} / {quota.total}</div>
              <div className="mt-1 text-xs text-muted-foreground">Reset: {resetDate.toLocaleDateString()}</div>
            </div>
            {remaining <= 3 ? (
              <div className="rounded-xl border border-amber-500/25 bg-amber-500/10 px-3 py-2 text-xs text-amber-700 dark:text-amber-200">
                Invite quota running low. Ask Admin for a quota bump if needed.
              </div>
            ) : null}
            <div className="text-xs text-muted-foreground">
              All invites are logged and linked to your agent profile. No personal data is embedded in URLs.
            </div>
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader>
            <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
              <CardTitle>Invites</CardTitle>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-2 w-full md:w-[720px]">
                <Input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search label or invite ID" />
                <Select value={status} onChange={(e) => setStatus(e.target.value as any)}>
                  <option value="">All statuses</option>
                  <option value="Pending">Pending</option>
                  <option value="Accepted">Accepted</option>
                  <option value="Expired">Expired</option>
                </Select>
                <Select value={channelFilter} onChange={(e) => setChannelFilter(e.target.value as any)}>
                  <option value="">All channels</option>
                  <option value="WhatsApp">WhatsApp</option>
                  <option value="Telegram">Telegram</option>
                  <option value="Email">Email</option>
                  <option value="SMS">SMS</option>
                  <option value="Copy">Copy Link</option>
                </Select>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {q.loading ? (
              <div className="text-sm text-muted-foreground">Loading…</div>
            ) : q.error ? (
              <div className="text-sm text-destructive">Failed to load invites.</div>
            ) : rows.length === 0 ? (
              <div className="text-sm text-muted-foreground">No invites found for your current filters.</div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <THead>
                    <TRow>
                      <TH>Label</TH>
                      <TH>Channel</TH>
                      <TH>Status</TH>
                      <TH>Created</TH>
                      <TH>Expiry</TH>
                      <TH className="text-right">Actions</TH>
                    </TRow>
                  </THead>
                  <tbody>
                    {rows.map((i) => (
                      <TRow key={i.id} className="hover:bg-muted/40">
                        <TD>
                          <div className="font-medium text-foreground">{i.label ?? "Invite"}</div>
                          <div className="text-xs text-muted-foreground">{i.id}</div>
                        </TD>
                        <TD className="text-foreground">{i.channel}</TD>
                        <TD>
                          <Badge tone={statusTone(i.status)}>{i.status}</Badge>
                        </TD>
                        <TD className="text-muted-foreground">{new Date(i.createdAt).toLocaleDateString()}</TD>
                        <TD className="text-muted-foreground">{new Date(i.expiresAt).toLocaleDateString()}</TD>
                        <TD className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button size="sm" variant="ghost" onClick={() => share(i, i.channel === "Copy" ? "Copy" : i.channel)}>
                              {i.channel === "Copy" ? "Copy" : "Share"}
                            </Button>
                            <Button
                              size="sm"
                              variant="secondary"
                              onClick={async () => {
                                try {
                                  const updated = await api.resendInvite(i.id);
                                  q.setData((prev) => (prev ? prev.map((x) => (x.id === i.id ? updated : x)) : prev));
                                  toast.push({ title: "Invite resent", message: "New token generated.", tone: "info" });
                                } catch (e: any) {
                                  toast.push({ title: "Resend failed", message: e?.message ?? "Try again.", tone: "danger" });
                                }
                              }}
                            >
                              Resend
                            </Button>
                            <Button size="sm" variant="secondary" onClick={() => setDetails(i)}>
                              Details
                            </Button>
                          </div>
                        </TD>
                      </TRow>
                    ))}
                  </tbody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Create invite */}
      <Modal
        open={createOpen}
        title="Create invite"
        description="Create a new invite link and share via your preferred channel. This is a frontend simulation."
        onClose={() => setCreateOpen(false)}
        footer={
          created ? (
            <div className="flex flex-wrap gap-2">
              <Button variant="secondary" onClick={() => { navigator.clipboard.writeText(created.link); toast.push({ title: "Copied", message: "Invite link copied.", tone: "success" }); }}>
                Copy link
              </Button>
              <Button variant="secondary" onClick={() => share(created, "WhatsApp")}>Share WhatsApp</Button>
              <Button variant="secondary" onClick={() => share(created, "Telegram")}>Share Telegram</Button>
              <Button variant="secondary" onClick={() => share(created, "Email")}>Send Email</Button>
              <Button variant="primary" onClick={() => setCreateOpen(false)}>Done</Button>
            </div>
          ) : (
            <div className="flex gap-2">
              <Button variant="secondary" onClick={() => setCreateOpen(false)}>Cancel</Button>
              <Button
                variant="primary"
                disabled={remaining <= 0}
                onClick={async () => {
                  try {
                    const inv = await api.createInvite({ channel, label: label || undefined, expiryDays });
                    q.setData((prev) => (prev ? [inv, ...prev] : [inv]));
                    setCreated(inv);
                    toast.push({ title: "Invite created", message: "Token generated and ready to share.", tone: "success" });
                  } catch (e: any) {
                    toast.push({ title: "Create failed", message: e?.message ?? "Try again.", tone: "danger" });
                  }
                }}
              >
                Create invite
              </Button>
            </div>
          )
        }
      >
        {created ? (
          <div className="space-y-3">
            <div className="rounded-xl border border-border bg-card/60 p-3">
              <div className="text-xs text-muted-foreground">Invite link</div>
              <div className="mt-1 text-sm font-medium break-all">{created.link}</div>
              <div className="mt-2 flex flex-wrap gap-2 text-xs text-muted-foreground">
                <span>Status: {created.status}</span>
                <span>•</span>
                <span>Expires: {new Date(created.expiresAt).toLocaleString()}</span>
              </div>
            </div>
            <div className="rounded-xl border border-border bg-card/60 p-3 text-xs text-muted-foreground">
              Tip: If the invite expires, use <strong>Resend</strong> to generate a new token while keeping the audit trail.
            </div>
          </div>
        ) : (
          <div className="space-y-3">
            <div>
              <label className="text-xs text-muted-foreground">Channel</label>
              <Select value={channel} onChange={(e) => setChannel(e.target.value as any)}>
                <option value="WhatsApp">WhatsApp</option>
                <option value="Telegram">Telegram</option>
                <option value="Email">Email</option>
                <option value="SMS">SMS</option>
                <option value="Copy">Copy Link</option>
              </Select>
            </div>
            <div>
              <label className="text-xs text-muted-foreground">Label (optional)</label>
              <Input value={label} onChange={(e) => setLabel(e.target.value)} placeholder="e.g., High-value prospect" />
            </div>
            <div>
              <label className="text-xs text-muted-foreground">Expiry</label>
              <Select value={String(expiryDays)} onChange={(e) => setExpiryDays(Number(e.target.value) as any)}>
                <option value="7">7 days</option>
                <option value="3">3 days</option>
                <option value="1">24 hours</option>
              </Select>
            </div>
            {remaining <= 0 ? (
              <div className="rounded-xl border border-rose-500/25 bg-rose-500/10 px-3 py-2 text-xs text-rose-700 dark:text-rose-200">
                Invite quota is exhausted. Request additional invites from Admin.
              </div>
            ) : null}
            <div className="rounded-xl border border-border bg-card/60 p-3 text-xs text-muted-foreground">
              No personal data is embedded in URLs. All invites are logged and auditable.
            </div>
          </div>
        )}
      </Modal>

      {/* Details */}
      <Modal
        open={!!details}
        title="Invite details"
        description="Timeline and state snapshot."
        onClose={() => setDetails(null)}
      >
        {details ? (
          <div className="space-y-3">
            <div className="rounded-xl border border-border bg-card/60 p-3">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-xs text-muted-foreground">Status</div>
                  <div className="mt-1"><Badge tone={statusTone(details.status)}>{details.status}</Badge></div>
                </div>
                <div className="text-right">
                  <div className="text-xs text-muted-foreground">Channel</div>
                  <div className="text-sm font-medium">{details.channel}</div>
                </div>
              </div>
              <div className="mt-3 grid grid-cols-2 gap-3 text-sm">
                <div>
                  <div className="text-xs text-muted-foreground">Created</div>
                  <div className="font-medium">{new Date(details.createdAt).toLocaleString()}</div>
                </div>
                <div>
                  <div className="text-xs text-muted-foreground">Expires</div>
                  <div className="font-medium">{new Date(details.expiresAt).toLocaleString()}</div>
                </div>
                {details.acceptedBy ? (
                  <div className="col-span-2">
                    <div className="text-xs text-muted-foreground">Accepted by</div>
                    <div className="font-medium">{details.acceptedBy}</div>
                  </div>
                ) : null}
              </div>
            </div>

            <div className="rounded-xl border border-border bg-card/60 p-3">
              <div className="text-sm font-semibold">Status timeline</div>
              <div className="mt-2 space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="font-medium">Created</span>
                  <span className="text-muted-foreground">{new Date(details.createdAt).toLocaleString()}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="font-medium">Expires</span>
                  <span className="text-muted-foreground">{new Date(details.expiresAt).toLocaleString()}</span>
                </div>
                {details.status === "Accepted" ? (
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-medium">Accepted</span>
                    <span className="text-muted-foreground">—</span>
                  </div>
                ) : null}
              </div>
            </div>

            <div>
              <label className="text-xs text-muted-foreground">Invite link</label>
              <Input value={details.link} readOnly />
              <div className="mt-2 flex flex-wrap gap-2">
                <Button size="sm" variant="secondary" onClick={() => { navigator.clipboard.writeText(details.link); toast.push({ title: "Copied", message: "Invite link copied.", tone: "success" }); }}>Copy</Button>
                <Button size="sm" variant="secondary" onClick={() => share(details, "WhatsApp")}>WhatsApp</Button>
                <Button size="sm" variant="secondary" onClick={() => share(details, "Telegram")}>Telegram</Button>
                <Button size="sm" variant="ghost" onClick={() => setDetails(null)}>Close</Button>
              </div>
            </div>
          </div>
        ) : null}
      </Modal>
    </div>
  );
}
