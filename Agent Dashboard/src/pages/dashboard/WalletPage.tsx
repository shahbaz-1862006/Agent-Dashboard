import React, { useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/Card";
import { Button } from "../../components/ui/Button";
import { Badge } from "../../components/ui/Badge";
import { Input } from "../../components/ui/Input";
import { Modal } from "../../components/ui/Modal";
import { Drawer } from "../../components/ui/Drawer";
import { Select } from "../../components/ui/Select";
import { Table, THead, TRow, TH, TD } from "../../components/ui/Table";
import { Skeleton } from "../../components/ui/Skeleton";
import { api } from "../../services/client";
import { useAsync } from "../../app/hooks/useAsync";
import { fmtUSDT } from "../../utils/format";
import { downloadCsv } from "../../utils/csv";
import { printTableAsPdf } from "../../utils/print";
import { useToast } from "../../components/ui/toast";
import type { LedgerEntry, LedgerType } from "../../types";
import { Copy } from "lucide-react";

const LEDGER_TYPES: Array<{ label: string; value: "" | LedgerType }> = [
  { label: "All types", value: "" },
  { label: "Agent Deposit", value: "Agent Deposit" },
  { label: "Player Deposit Conversion", value: "Player Deposit Conversion" },
  { label: "Commission Credit", value: "Commission Credit" },
  { label: "War Entry Lock", value: "War Entry Lock" },
  { label: "Bonus Pool Co-fund", value: "Bonus Pool Co-fund" },
];

function inRange(iso: string, range: string) {
  if (!range) return true;
  const t = new Date(iso).getTime();
  const now = Date.now();
  const day = 86400000;
  const from = range === "7d" ? now - 7 * day : range === "30d" ? now - 30 * day : range === "90d" ? now - 90 * day : 0;
  return t >= from;
}

export function WalletPage() {
  const toast = useToast();
  const walletQ = useAsync(() => api.getWalletSummary(), []);
  const ledgerQ = useAsync(() => api.getLedger(), []);

  const [searchParams, setSearchParams] = useSearchParams();
  const refParam = searchParams.get("ref") ?? "";

  const [depositOpen, setDepositOpen] = useState(false);
  const [selected, setSelected] = useState<LedgerEntry | null>(null);

  const [search, setSearch] = useState("");
  const [type, setType] = useState<"" | LedgerType>("");
  const [range, setRange] = useState<"" | "7d" | "30d" | "90d">("30d");

  // Source wallet state
  const [sourceWalletAddress, setSourceWalletAddress] = useState("");
  const [sourceWalletVerified, setSourceWalletVerified] = useState(false);
  const [showCoinductorConnect, setShowCoinductorConnect] = useState(false);

  const depositAddress = "TQm9wB3WmG5m••••••••••••••••••••d2A";
  
  const isSourceWalletValid = sourceWalletAddress.trim().length > 0;

  const filtered = useMemo(() => {
    const rows = ledgerQ.data ?? [];
    const s = (search || refParam).trim().toLowerCase();
    return rows.filter((e) => {
      const matchesType = !type || e.type === type;
      const matchesRange = inRange(e.at, range);
      const matchesSearch = !s || e.description.toLowerCase().includes(s) || e.refId.toLowerCase().includes(s) || e.type.toLowerCase().includes(s);
      return matchesType && matchesRange && matchesSearch;
    });
  }, [ledgerQ.data, search, type, range, refParam]);

  const csvRows = useMemo(
    () =>
      filtered.map((e) => ({
        at: new Date(e.at).toLocaleString(),
        type: e.type,
        description: e.description,
        amount: e.amount,
        balanceAfter: e.balanceAfter ?? "",
        refId: e.refId,
      })),
    [filtered]
  );

  const pendingDeposits = useMemo(() => {
    // Frontend simulation: if there are fewer Agent Deposit entries, show a pending placeholder.
    const hasRecentDeposit = (ledgerQ.data ?? []).some((e) => e.type === "Agent Deposit" && (Date.now() - new Date(e.at).getTime()) < 6 * 3600000);
    return hasRecentDeposit
      ? []
      : [
          { id: "dep_pending_01", amount: 250, note: "Waiting for TRC-20 confirmations" },
        ];
  }, [ledgerQ.data]);

  const confirmedDeposits = useMemo(() => {
    return (ledgerQ.data ?? []).filter((e) => e.type === "Agent Deposit").slice(0, 5);
  }, [ledgerQ.data]);

  const copyToClipboard = async (value: string, label = "Copied") => {
    try {
      await navigator.clipboard.writeText(value);
      toast.push({ title: label, message: "Copied to clipboard.", tone: "success" });
    } catch {
      toast.push({ title: "Copy failed", message: "Please copy manually.", tone: "danger" });
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-lg font-semibold">Wallet</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          USDT-only. All player fiat deposits convert automatically to USDT and deduct from your wallet.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <Card className="lg:col-span-2">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Balance</CardTitle>
              <Button size="sm" variant="primary" onClick={() => setDepositOpen(true)}>
                Deposit USDT
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {walletQ.loading ? (
              <Skeleton className="h-12 w-72" />
            ) : walletQ.error ? (
              <div className="text-sm text-destructive">Failed to load wallet.</div>
            ) : (
              <div className="space-y-3">
                <div className="flex items-baseline justify-between">
                  <div className="text-3xl font-semibold">{fmtUSDT(walletQ.data!.total)}</div>
                  {walletQ.data!.available < 2000 ? <Badge tone="warning">Low balance</Badge> : <Badge tone="success">Healthy</Badge>}
                </div>
                <div className="grid grid-cols-3 gap-2 text-xs">
                  <div>
                    <div className="text-muted-foreground">Available</div>
                    <div className="text-foreground font-medium">{fmtUSDT(walletQ.data!.available)}</div>
                  </div>
                  <div>
                    <div className="text-muted-foreground">Locked funds</div>
                    <div className="text-foreground font-medium">{fmtUSDT(walletQ.data!.locked)}</div>
                  </div>
                  <div>
                    <div className="text-muted-foreground">Network</div>
                    <div className="text-foreground font-medium">TRON (TRC-20)</div>
                  </div>
                </div>
                {walletQ.data!.available < 2000 ? (
                  <div className="text-xs text-warning-foreground">
                    Low available balance can block player deposit conversions.
                  </div>
                ) : null}
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Prefunding</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="text-sm text-foreground font-medium">Conversion health</div>
            <div className="text-sm text-muted-foreground">
              If your available wallet balance is insufficient, player deposits remain pending until you top up.
            </div>
            <div className="rounded-xl border border-border bg-card/60 p-3">
              <div className="text-xs text-muted-foreground">Blocked conversions</div>
              <div className="mt-1 text-lg font-semibold text-foreground">1</div>
              <div className="mt-1 text-xs text-warning-foreground">Top up to clear pending conversions.</div>
            </div>
            <Button size="sm" variant="secondary" onClick={() => setDepositOpen(true)}>
              Add funds
            </Button>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <CardTitle>Wallet Ledger</CardTitle>
            <div className="flex flex-col md:flex-row gap-2 md:items-center">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                <Input value={refParam ? refParam : search} onChange={(e) => {
                  setSearch(e.target.value);
                  if (refParam) {
                    searchParams.delete("ref");
                    setSearchParams(searchParams, { replace: true });
                  }
                }} placeholder="Search description or reference…" />
                <Select value={type} onChange={(e) => setType(e.target.value as any)}>
                  {LEDGER_TYPES.map((t) => (
                    <option key={t.label} value={t.value}>{t.label}</option>
                  ))}
                </Select>
                <Select value={range} onChange={(e) => setRange(e.target.value as any)}>
                  <option value="">All time</option>
                  <option value="7d">Last 7 days</option>
                  <option value="30d">Last 30 days</option>
                  <option value="90d">Last 90 days</option>
                </Select>
              </div>
              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant="secondary"
                  disabled={!csvRows.length}
                  onClick={() => {
                    downloadCsv("wallet-ledger.csv", csvRows);
                    toast.push({ title: "Export created", message: "wallet-ledger.csv downloaded.", tone: "success" });
                  }}
                >
                  Export CSV
                </Button>
                <Button
                  size="sm"
                  variant="secondary"
                  disabled={!csvRows.length}
                  onClick={() => {
                    printTableAsPdf({
                      title: "Clazino – Wallet Ledger",
                      columns: ["Date", "Type", "Description", "Amount", "Balance", "Ref"],
                      rows: filtered.map((e) => [
                        new Date(e.at).toLocaleString(),
                        e.type,
                        e.description,
                        `${e.amount >= 0 ? "+" : ""}${fmtUSDT(e.amount)}`,
                        e.balanceAfter != null ? fmtUSDT(e.balanceAfter) : "–",
                        e.refId,
                      ]),
                    });
                    toast.push({ title: "Export created", message: "Print dialog opened (save as PDF).", tone: "success" });
                  }}
                >
                  Export PDF
                </Button>
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {ledgerQ.loading ? (
            <Skeleton className="h-12 w-full" />
          ) : ledgerQ.error ? (
            <div className="text-sm text-destructive">Failed to load ledger.</div>
          ) : filtered.length === 0 ? (
            <div className="text-sm text-muted-foreground">No ledger entries for the current filters.</div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <THead>
                  <TRow>
                    <TH>Date/time</TH>
                    <TH>Type</TH>
                    <TH>Description</TH>
                    <TH className="text-right">Amount</TH>
                    <TH className="text-right">Balance after</TH>
                    <TH>Reference ID</TH>
                  </TRow>
                </THead>
                <tbody>
                  {filtered.map((e) => (
                    <TRow key={e.id} className="hover:bg-muted/40 cursor-pointer" onClick={() => setSelected(e)}>
                      <TD className="text-muted-foreground">{new Date(e.at).toLocaleString()}</TD>
                      <TD><Badge tone="info">{e.type}</Badge></TD>
                      <TD className="text-foreground">{e.description}</TD>
                      <TD className={"text-right font-semibold " + (e.amount >= 0 ? "text-emerald-700 dark:text-emerald-300" : "text-destructive")}
                      >
                        {e.amount >= 0 ? "+" : ""}{fmtUSDT(e.amount)}
                      </TD>
                      <TD className="text-right text-muted-foreground">{e.balanceAfter != null ? fmtUSDT(e.balanceAfter) : "–"}</TD>
                      <TD className="text-muted-foreground">{e.refId}</TD>
                    </TRow>
                  ))}
                </tbody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      <Modal
        open={depositOpen}
        title="Deposit USDT (TRC-20)"
        description="Send only USDT on TRC-20. Funds credit after network confirmations."
        onClose={() => {
          setDepositOpen(false);
          setSourceWalletAddress("");
          setSourceWalletVerified(false);
          setShowCoinductorConnect(false);
        }}
        footer={
          <div className="flex gap-2">
            <Button variant="secondary" onClick={() => {
              setDepositOpen(false);
              setSourceWalletAddress("");
              setSourceWalletVerified(false);
              setShowCoinductorConnect(false);
            }}>
              Cancel
            </Button>
            <Button
              variant="primary"
              disabled={!isSourceWalletValid}
              onClick={() => {
                toast.push({ title: "Deposit initiated", message: "Waiting for confirmations from " + (sourceWalletVerified ? "Coinductor wallet" : "your wallet") + ".", tone: "info" });
                setDepositOpen(false);
                setSourceWalletAddress("");
                setSourceWalletVerified(false);
                setShowCoinductorConnect(false);
              }}
            >
              I have sent USDT
            </Button>
          </div>
        }
      >
        <div className="space-y-4">
          {/* Source Wallet Section */}
          <div className="rounded-xl border border-border bg-card/60 p-4">
            <div className="text-sm font-semibold mb-3">Your sending wallet</div>
            
            {!sourceWalletAddress ? (
              <div className="space-y-3">
                <div className="flex gap-2">
                  <Input 
                    placeholder="Paste your wallet address (TRC-20)…"
                    value={sourceWalletAddress}
                    onChange={(e) => setSourceWalletAddress(e.target.value)}
                    disabled={sourceWalletVerified}
                  />
                </div>
                
                <div className="flex items-center gap-2">
                  <div className="flex-1 h-px bg-border"></div>
                  <span className="text-xs text-muted-foreground">or</span>
                  <div className="flex-1 h-px bg-border"></div>
                </div>
                
                <Button 
                  variant="secondary" 
                  className="w-full"
                  onClick={() => setShowCoinductorConnect(true)}
                >
                  Connect Coinductor Wallet
                </Button>
              </div>
            ) : (
              <div className="space-y-2">
                <div className="rounded-lg border border-border bg-background/60 px-3 py-2 flex items-center justify-between">
                  <div className="flex items-center gap-2 flex-1 min-w-0">
                    <div className="text-sm font-mono text-foreground truncate">{sourceWalletAddress}</div>
                    <Button 
                      size="icon" 
                      variant="ghost" 
                      onClick={() => {
                        navigator.clipboard.writeText(sourceWalletAddress);
                        toast.push({ title: "Copied", message: "Wallet address copied to clipboard.", tone: "success" });
                      }}
                      aria-label="Copy wallet address"
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>
                  {sourceWalletVerified && (
                    <Badge tone="success" className="ml-2">Verified</Badge>
                  )}
                </div>
                <Button 
                  size="sm"
                  variant="ghost" 
                  className="w-full"
                  onClick={() => {
                    setSourceWalletAddress("");
                    setSourceWalletVerified(false);
                  }}
                >
                  Change wallet
                </Button>
              </div>
            )}
            
            <div className="mt-3 text-xs text-warning-foreground space-y-1">
              <div>⚠️ <strong>Important:</strong> Send USDT only from this wallet.</div>
              <div>Deposits from other wallets may be delayed or rejected.</div>
            </div>
          </div>

          {/* Coinductor Connection Modal */}
          {showCoinductorConnect && (
            <div className="rounded-xl border border-border bg-card/60 p-4">
              <div className="text-sm font-semibold mb-2">Connect Coinductor Wallet</div>
              <div className="text-sm text-muted-foreground mb-3">
                Click the button below to connect your Coinductor wallet. Your address will be automatically filled and verified.
              </div>
              <Button 
                variant="primary" 
                className="w-full mb-2"
                onClick={() => {
                  // Simulate Coinductor wallet connection
                  const connectedAddress = "TUg99ynNVrHBpzB9C5yvGWt3YVvQRKJGhk";
                  setSourceWalletAddress(connectedAddress);
                  setSourceWalletVerified(true);
                  setShowCoinductorConnect(false);
                  toast.push({ 
                    title: "Wallet connected", 
                    message: "Coinductor wallet verified and connected.", 
                    tone: "success" 
                  });
                }}
              >
                Connect Coinductor Wallet
              </Button>
              <Button 
                variant="ghost" 
                className="w-full"
                onClick={() => setShowCoinductorConnect(false)}
              >
                Cancel
              </Button>
            </div>
          )}

          {/* Casino Deposit Address Section */}
          <div className="rounded-xl border border-border bg-card/60 p-4 flex items-center justify-between gap-4">
            <div className="flex-1">
              <div className="text-xs text-muted-foreground">Deposit address</div>
              <div className="mt-1 flex items-center gap-2">
                <Input value={depositAddress} readOnly />
                <Button size="icon" variant="secondary" onClick={() => copyToClipboard(depositAddress, "Address copied")} aria-label="Copy address">
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
              <div className="mt-2 text-xs text-warning-foreground">Send only USDT on TRC-20. Other assets may be lost.</div>
            </div>
            <div className="h-28 w-28 rounded-xl border border-border bg-background flex items-center justify-center text-xs text-muted-foreground">
              QR (mock)
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div className="rounded-xl border border-border bg-card/60 p-4">
              <div className="text-sm font-semibold">Pending deposits</div>
              <div className="mt-2 space-y-2">
                {pendingDeposits.length === 0 ? (
                  <div className="text-sm text-muted-foreground">No pending deposits.</div>
                ) : (
                  pendingDeposits.map((d) => (
                    <div key={d.id} className="rounded-lg border border-border bg-background/60 px-3 py-2">
                      <div className="flex items-center justify-between">
                        <div className="text-sm font-medium">{fmtUSDT(d.amount)}</div>
                        <Badge tone="warning">Pending</Badge>
                      </div>
                      <div className="mt-1 text-xs text-muted-foreground">{d.note}</div>
                    </div>
                  ))
                )}
              </div>
            </div>

            <div className="rounded-xl border border-border bg-card/60 p-4">
              <div className="text-sm font-semibold">Confirmed deposits</div>
              <div className="mt-2 space-y-2">
                {confirmedDeposits.length === 0 ? (
                  <div className="text-sm text-muted-foreground">No confirmed deposits yet.</div>
                ) : (
                  confirmedDeposits.map((d) => (
                    <div key={d.id} className="rounded-lg border border-border bg-background/60 px-3 py-2">
                      <div className="flex items-center justify-between">
                        <div className="text-sm font-medium">{fmtUSDT(d.amount)}</div>
                        <Badge tone="success">Confirmed</Badge>
                      </div>
                      <div className="mt-1 text-xs text-muted-foreground">{new Date(d.at).toLocaleString()} • {d.refId}</div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      </Modal>

      <Drawer
        open={!!selected}
        title={selected ? "Ledger entry" : "Ledger"}
        onClose={() => setSelected(null)}
      >
        {selected ? (
          <div className="space-y-4">
            <div className="rounded-xl border border-border bg-card/60 p-4">
              <div className="flex items-center justify-between">
                <div className="text-sm font-semibold">{selected.type}</div>
                <Badge tone="info">{new Date(selected.at).toLocaleString()}</Badge>
              </div>
              <div className="mt-3 text-sm text-foreground">{selected.description}</div>
              <div className="mt-3 grid grid-cols-2 gap-3 text-sm">
                <div>
                  <div className="text-xs text-muted-foreground">Amount</div>
                  <div className={"font-semibold " + (selected.amount >= 0 ? "text-emerald-700 dark:text-emerald-300" : "text-destructive")}>
                    {selected.amount >= 0 ? "+" : ""}{fmtUSDT(selected.amount)}
                  </div>
                </div>
                <div>
                  <div className="text-xs text-muted-foreground">Balance after</div>
                  <div className="font-semibold text-foreground">{selected.balanceAfter != null ? fmtUSDT(selected.balanceAfter) : "–"}</div>
                </div>
                <div className="col-span-2">
                  <div className="text-xs text-muted-foreground">Reference ID</div>
                  <div className="flex items-center justify-between gap-2">
                    <div className="text-foreground break-all">{selected.refId}</div>
                    <Button size="sm" variant="secondary" onClick={() => copyToClipboard(selected.refId, "Reference copied")}>
                      Copy
                    </Button>
                  </div>
                </div>
                {selected.sourceWalletAddress && selected.type === "Agent Deposit" && (
                  <div className="col-span-2">
                    <div className="text-xs text-muted-foreground">Source wallet</div>
                    <div className="flex items-center justify-between gap-2 mt-1">
                      <div className="text-foreground break-all font-mono text-xs">{selected.sourceWalletAddress}</div>
                      <Button size="sm" variant="secondary" onClick={() => copyToClipboard(selected.sourceWalletAddress!, "Wallet address copied")}>
                        Copy
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="rounded-xl border border-border bg-card/60 p-4">
              <div className="text-sm font-semibold">Quick links</div>
              <p className="mt-1 text-sm text-muted-foreground">Use reference filters to troubleshoot conversions, locks, and credits.</p>
              <div className="mt-3 flex flex-wrap gap-2">
                <Button
                  size="sm"
                  variant="secondary"
                  onClick={() => {
                    setSearchParams({ ref: selected.refId }, { replace: true });
                    setSelected(null);
                    toast.push({ title: "Filter applied", message: "Ledger filtered by reference.", tone: "info" });
                  }}
                >
                  Filter ledger by ref
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
