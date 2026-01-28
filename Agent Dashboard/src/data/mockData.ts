import type { Alert, Goal, Invite, LedgerEntry, Payout, Player, Statement, WalletSummary, War } from "../types";

function daysAgo(days: number) {
  const d = new Date();
  d.setDate(d.getDate() - days);
  return d.toISOString();
}

function hoursAgo(hours: number) {
  const d = new Date();
  d.setHours(d.getHours() - hours);
  return d.toISOString();
}

function id(prefix: string) {
  return prefix + "_" + Math.random().toString(36).slice(2, 9);
}

export function makePlayers(count = 42): Player[] {
  const tiers: Player["kycTier"][] = ["Tier A", "Tier B", "Tier C"];
  const statuses: Player["status"][] = ["Active", "Frozen", "Restricted"];
  return Array.from({ length: count }).map((_, i) => {
    const name = ["Adeel", "Hassan", "Zara", "Hira", "Ali", "Saad", "Mariam", "Usman", "Ayesha", "Bilal"][i % 10];
    const status = statuses[i % statuses.length];
    const riskScore = Math.min(100, Math.max(0, (i * 7) % 98));
    const balanceAvailable = Math.round((200 + (i * 31) % 1800) * 100) / 100;
    const balancePending = i % 9 === 0 ? 150 : 0;
    const balanceLocked = i % 11 === 0 ? 200 : 0;
    return {
      id: "pl_" + (1000 + i),
      name: name + " " + (i + 1),
      username: "player" + (i + 1),
      kycTier: tiers[i % tiers.length],
      status,
      riskScore,
      lastActive: hoursAgo((i * 3) % 48),
      balanceAvailable,
      balancePending,
      balanceLocked,
    };
  });
}

export function makeWalletSummary(): WalletSummary {
  return { available: 12450.25, locked: 980.0, total: 13430.25 };
}

export function makeLedger(): LedgerEntry[] {
  return [
    {
      id: id("led"),
      at: hoursAgo(2),
      type: "Player Deposit Conversion",
      description: "Player Deposit Conversion: player1010 – 5,000 PKR → 18.00 USDT",
      amount: -18,
      balanceAfter: 13412.25,
      refId: "ref_dep_" + Math.random().toString(36).slice(2, 8),
    },
    {
      id: id("led"),
      at: hoursAgo(6),
      type: "Agent Deposit",
      description: "Agent Deposit (USDT TRC-20) – 500.00 USDT",
      amount: 500,
      balanceAfter: 13430.25,
      refId: "tx_" + Math.random().toString(36).slice(2, 10),
      sourceWalletAddress: "TUg99ynNVrHBpzB9C5yvGWt3YVvQRKJGhk",
    },
    {
      id: id("led"),
      at: daysAgo(1),
      type: "Commission Credit",
      description: "Weekly Commission Credit – Statement Wk 02",
      amount: 320.55,
      balanceAfter: 12930.25,
      refId: "stmt_02",
    },
    {
      id: id("led"),
      at: daysAgo(2),
      type: "War Entry Lock",
      description: "War Entry Lock – Clan War #CW-12",
      amount: -50,
      balanceAfter: 12609.70,
      refId: "war_12",
    },
  ];
}

export function makeInvites(): Invite[] {
  const base = new Date();
  return [
    {
      id: "inv_01",
      label: "High-value prospect",
      channel: "WhatsApp",
      status: "Pending",
      createdAt: hoursAgo(6),
      expiresAt: new Date(base.getTime() + 3 * 86400000).toISOString(),
      link: "https://clazino.app/invite?token=" + Math.random().toString(36).slice(2),
    },
    {
      id: "inv_02",
      label: "Referral",
      channel: "Telegram",
      status: "Accepted",
      createdAt: daysAgo(2),
      expiresAt: daysAgo(-5),
      acceptedByPlayerId: "pl_1004",
      link: "https://clazino.app/invite?token=" + Math.random().toString(36).slice(2),
    },
    {
      id: "inv_03",
      channel: "Copy",
      status: "Expired",
      createdAt: daysAgo(8),
      expiresAt: daysAgo(1),
      link: "https://clazino.app/invite?token=" + Math.random().toString(36).slice(2),
    },
  ];
}

export function makePayouts(players: Player[]): Payout[] {
  const p1 = players[3];
  const p2 = players[9];
  return [
    {
      id: "po_1001",
      playerId: p1.id,
      playerName: p1.name,
      amount: 75.0,
      method: "Crypto",
      status: "Pending",
      requestedAt: hoursAgo(3),
      destinationMasked: "TRC20 •••• 8F2A",
      txHash: undefined,
      timeline: [
        { at: hoursAgo(3), status: "Pending", note: "Withdrawal requested" },
      ],
    },
    {
      id: "po_1002",
      playerId: p2.id,
      playerName: p2.name,
      amount: 120.5,
      method: "Fiat",
      status: "Failed",
      requestedAt: daysAgo(1),
      destinationMasked: "Bank •••• 1120",
      timeline: [
        { at: daysAgo(1), status: "Pending", note: "External payout initiated" },
        { at: hoursAgo(20), status: "Failed", note: "Settlement not confirmed" },
      ],
    },
    {
      id: "po_1003",
      playerId: players[1].id,
      playerName: players[1].name,
      amount: 40,
      method: "Crypto",
      status: "Completed",
      requestedAt: daysAgo(2),
      destinationMasked: "TRC20 •••• 1A7C",
      txHash: "0x" + Math.random().toString(16).slice(2),
      timeline: [
        { at: daysAgo(2), status: "Pending", note: "Withdrawal requested" },
        { at: daysAgo(2), status: "Completed", note: "Treasury payout broadcasted" },
      ],
    },
  ];
}

export function makeStatements(): Statement[] {
  return [
    {
      id: "stmt_02",
      weekLabel: "Week 02 (Mon–Sun)",
      status: "Paid",
      ggr: 12800,
      ngr: 11200,
      commissionRate: 0.035,
      adjustments: -45.5,
      finalPayout: 346.5,
      paidAt: daysAgo(1),
      ledgerRefId: "ref_stmt_02",
    },
    {
      id: "stmt_03",
      weekLabel: "Week 03 (Mon–Sun)",
      status: "Pending",
      ggr: 9400,
      ngr: 8600,
      commissionRate: 0.03,
      adjustments: 0,
      finalPayout: 258,
      ledgerRefId: "ref_stmt_03",
    },
  ];
}

export function makeGoals(): Goal[] {
  return [
    {
      id: "g1",
      type: "Clan-wide",
      title: "Active Sessions",
      description: "Reach 220 total play sessions across the clan.",
      progress: 68,
      remainingLabel: "3d 14h remaining",
    },
    {
      id: "g2",
      type: "All-member",
      title: "All Members Participate",
      description: "Every clan member plays at least once this week.",
      progress: 82,
      remainingLabel: "3d 14h remaining",
    },
    {
      id: "g3",
      type: "Individual",
      title: "Consistency Streaks",
      description: "10 players hit a 3-day activity streak.",
      progress: 54,
      remainingLabel: "3d 14h remaining",
    },
  ];
}

export function makeWars(): War[] {
  return [
    {
      id: "war_12",
      name: "Weekend Sprint",
      status: "Active",
      startsAt: daysAgo(0),
      endsAt: daysAgo(-1),
      entryFee: 50,
      opponent: "Clan Orion",
      registered: true,
      scoreYou: 1120,
      scoreThem: 980,
    },
    {
      id: "war_13",
      name: "Midweek Clash",
      status: "Upcoming",
      startsAt: daysAgo(-2),
      endsAt: daysAgo(-3),
      entryFee: 35,
      opponent: "Clan Nova",
      registered: false,
      scoreYou: 0,
      scoreThem: 0,
    },
    {
      id: "war_11",
      name: "Last Week Finals",
      status: "Past",
      startsAt: daysAgo(8),
      endsAt: daysAgo(7),
      entryFee: 50,
      opponent: "Clan Vega",
      registered: true,
      scoreYou: 780,
      scoreThem: 820,
    },
  ];
}

export function makeAlerts(): Alert[] {
  return [
    {
      id: "al1",
      severity: "High",
      title: "Low wallet balance",
      description: "Prefunding may block new player deposits. Top up to avoid pending conversions.",
      deepLink: "/dashboard/wallet",
    },
    {
      id: "al2",
      severity: "Medium",
      title: "1 failed fiat payout",
      description: "Review payout details and confirm settlement externally.",
      deepLink: "/dashboard/payouts",
    },
    {
      id: "al3",
      severity: "Low",
      title: "Invite quota running low",
      description: "You have fewer than 10 invites remaining.",
      deepLink: "/dashboard/invites",
    },
  ];
}
