import type { Api } from "./api";
import type { Invite } from "../types";
import {
  makeAlerts,
  makeGoals,
  makeInvites,
  makeLedger,
  makePlayers,
  makePayouts,
  makeStatements,
  makeWalletSummary,
  makeWars,
} from "../data/mockData";

let players = makePlayers();
let wallet = makeWalletSummary();
let ledger = makeLedger();
let invites = makeInvites();
let payouts = makePayouts(players);
let statements = makeStatements();
let goals = makeGoals();
let wars = makeWars();
let alerts = makeAlerts();

function sleep(ms = 350) {
  return new Promise((r) => setTimeout(r, ms));
}

export const mockApi: Api = {
  async getWalletSummary() {
    await sleep();
    return wallet;
  },
  async getLedger() {
    await sleep();
    return ledger;
  },
  async getPlayers() {
    await sleep();
    return players;
  },
  async getPlayer(id: string) {
    await sleep();
    return players.find((p) => p.id === id) ?? null;
  },
  async getInvites() {
    await sleep();
    return invites;
  },
  async createInvite(input) {
    await sleep();
    const newInv: Invite = {
      id: "inv_" + Math.random().toString(36).slice(2, 6),
      channel: input.channel,
      label: input.label,
      status: "Pending",
      createdAt: new Date().toISOString(),
      expiresAt: new Date(Date.now() + (input.expiryDays ?? 7) * 86400000).toISOString(),
      link: "https://clazino.app/invite?token=" + Math.random().toString(36).slice(2),
    };
    invites = [newInv, ...invites];
    return newInv;
  },
  async resendInvite(inviteId: string) {
    await sleep();
    const inv = invites.find((i) => i.id === inviteId);
    if (!inv) throw new Error("Invite not found");
    const updated = { ...inv, status: "Pending" as const, link: "https://clazino.app/invite?token=" + Math.random().toString(36).slice(2) };
    invites = invites.map((i) => (i.id === inviteId ? updated : i));
    return updated;
  },
  async getPayouts() {
    await sleep();
    return payouts;
  },
  async getStatements() {
    await sleep();
    return statements;
  },
  async getStatement(id: string) {
    await sleep();
    return statements.find((s) => s.id === id) ?? null;
  },
  async getGoals() {
    await sleep();
    return goals;
  },
  async getWars() {
    await sleep();
    return wars;
  },
  async registerWar(warId: string) {
    await sleep();
    const w = wars.find((x) => x.id === warId);
    if (!w) return null;
    if (w.registered) return w;
    const updated = { ...w, registered: true };
    wars = wars.map((x) => (x.id === warId ? updated : x));
    // lock wallet and ledger
    wallet = { ...wallet, available: wallet.available - w.entryFee, locked: wallet.locked + w.entryFee, total: wallet.total };
    ledger = [
      {
        id: "led_" + Math.random().toString(36).slice(2, 8),
        at: new Date().toISOString(),
        type: "War Entry Lock",
        description: `War Entry Lock – ${w.name}`,
        amount: -w.entryFee,
        balanceAfter: wallet.available,
        refId: w.id,
      },
      ...ledger,
    ];
    return updated;
  },
  async getAlerts() {
    await sleep(200);
    return alerts;
  },
};
