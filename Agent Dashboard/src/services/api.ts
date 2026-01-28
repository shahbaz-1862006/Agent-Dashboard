import type { Alert, Goal, Invite, LedgerEntry, Payout, Player, Statement, WalletSummary, War } from "../types";

export type Api = {
  getWalletSummary(): Promise<WalletSummary>;
  getLedger(): Promise<LedgerEntry[]>;
  getPlayers(): Promise<Player[]>;
  getPlayer(id: string): Promise<Player | null>;
  getInvites(): Promise<Invite[]>;
  createInvite(input: { channel: Invite["channel"]; label?: string; expiryDays?: number }): Promise<Invite>;
  resendInvite(inviteId: string): Promise<Invite>;
  getPayouts(): Promise<Payout[]>;
  getStatements(): Promise<Statement[]>;
  getStatement(id: string): Promise<Statement | null>;
  getGoals(): Promise<Goal[]>;
  getWars(): Promise<War[]>;
  registerWar(warId: string): Promise<War | null>;
  getAlerts(): Promise<Alert[]>;
};
