import React, { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../../services/client";
import { useAsync } from "../../app/hooks/useAsync";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/Card";
import { Input } from "../../components/ui/Input";
import { Select } from "../../components/ui/Select";
import { Table, THead, TRow, TH, TD } from "../../components/ui/Table";
import { Badge } from "../../components/ui/Badge";
import { Pagination } from "../../components/ui/Pagination";
import { Skeleton } from "../../components/ui/Skeleton";
import type { KycTier } from "../../types";
import { fmtUSDT } from "../../utils/format";

export function PlayersPage() {
  const nav = useNavigate();
  const q = useAsync(() => api.getPlayers(), []);
  const [search, setSearch] = useState("");
  const [kyc, setKyc] = useState<"" | KycTier>("");
  const [page, setPage] = useState(1);
  const pageSize = 10;

  const filtered = useMemo(() => {
    const rows = q.data ?? [];
    return rows.filter((p) => {
      const s = search.trim().toLowerCase();
      const matchesSearch = !s || p.name.toLowerCase().includes(s) || p.username.toLowerCase().includes(s) || p.id.toLowerCase().includes(s);
      const matchesKyc = !kyc || p.kycTier === kyc;
      return matchesSearch && matchesKyc;
    });
  }, [q.data, search, kyc]);

  const paged = useMemo(() => filtered.slice((page - 1) * pageSize, page * pageSize), [filtered, page]);
  const resetPage = () => setPage(1);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-lg font-semibold">Players</h1>
        <p className="mt-1 text-sm text-muted-foreground">Search, review status, and open full player profiles.</p>
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
            <CardTitle>Player List</CardTitle>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-2 w-full md:w-[680px]">
              <Input
                value={search}
                onChange={(e) => { setSearch(e.target.value); resetPage(); }}
                placeholder="Search by name, username, or ID"
              />
              <Select value={kyc} onChange={(e) => { setKyc(e.target.value as any); resetPage(); }}>
                <option value="">All KYC tiers</option>
                <option value="Tier A">Tier A</option>
                <option value="Tier B">Tier B</option>
                <option value="Tier C">Tier C</option>
              </Select>
              <div className="flex items-center justify-end text-xs text-muted-foreground">
                Showing <span className="mx-1 text-foreground">{filtered.length}</span> players
              </div>
            </div>
          </div>
        </CardHeader>

        <CardContent>
          {q.loading ? (
            <Skeleton className="h-14 w-full" />
          ) : q.error ? (
            <div className="text-sm text-rose-300">Failed to load players.</div>
          ) : filtered.length === 0 ? (
            <div className="text-sm text-muted-foreground">No players match your filters.</div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <THead>
                  <TRow>
                    <TH>Player</TH>
                    <TH>KYC</TH>
                    <TH>Status</TH>
                    <TH className="text-right">Available</TH>
                    <TH className="text-right">Pending</TH>
                    <TH className="text-right">Locked</TH>
                    <TH>Risk</TH>
                    <TH>Last Active</TH>
                  </TRow>
                </THead>
                <tbody>
                  {paged.map((p) => (
                    <TRow
                      key={p.id}
                      className="hover:bg-muted/40 cursor-pointer"
                      onClick={() => nav(`/dashboard/players/${p.id}`)}
                      role="button"
                      tabIndex={0}
                    >
                      <TD>
                        <div className="font-medium">{p.name}</div>
                        <div className="text-xs text-muted-foreground">@{p.username} • {p.id}</div>
                      </TD>
                      <TD><Badge tone={p.kycTier === "Tier A" ? "success" : p.kycTier === "Tier B" ? "warning" : "danger"}>{p.kycTier}</Badge></TD>
                      <TD><Badge tone={p.status === "Active" ? "success" : p.status === "Frozen" ? "danger" : "warning"}>{p.status}</Badge></TD>
                      <TD className="text-right font-semibold">{fmtUSDT(p.balanceAvailable)}</TD>
                      <TD className="text-right">{p.balancePending ? <span className="text-amber-300 font-medium">{fmtUSDT(p.balancePending)}</span> : <span className="text-muted-foreground">—</span>}</TD>
                      <TD className="text-right">{p.balanceLocked ? <span className="text-sky-300 font-medium">{fmtUSDT(p.balanceLocked)}</span> : <span className="text-muted-foreground">—</span>}</TD>
                      <TD>
                        <Badge tone={p.riskScore > 75 ? "danger" : p.riskScore > 45 ? "warning" : "success"}>{p.riskScore}</Badge>
                      </TD>
                      <TD className="text-muted-foreground">{new Date(p.lastActive).toLocaleString()}</TD>
                    </TRow>
                  ))}
                </tbody>
              </Table>

              <div className="mt-4">
                <Pagination page={page} pageSize={pageSize} total={filtered.length} onPageChange={setPage} />
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
