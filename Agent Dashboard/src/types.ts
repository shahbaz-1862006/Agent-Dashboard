export type Money = number;

export type KycTier = "Tier A" | "Tier B" | "Tier C";
export type PlayerStatus = "Active" | "Frozen" | "Restricted";
export type InviteStatus = "Pending" | "Accepted" | "Expired";
export type PayoutStatus = "Pending" | "Completed" | "Failed";
export type PayoutMethod = "Crypto" | "Fiat";
export type LedgerType =
  | "Agent Deposit"
  | "Commission Credit"
  | "Player Deposit Conversion"
  | "Credit Reclaim"
  | "War Entry Lock"
  | "War Entry Release"
  | "Bonus Pool Co-fund";

export type Player = {
  id: string;
  name: string;
  username: string;
  kycTier: KycTier;
  status: PlayerStatus;
  riskScore: number; // 0-100
  lastActive: string;
  balanceAvailable: Money;
  balancePending: Money;
  balanceLocked: Money;
};

export type Invite = {
  id: string;
  label?: string;
  channel: "Email" | "WhatsApp" | "Telegram" | "SMS" | "Copy";
  status: InviteStatus;
  createdAt: string;
  expiresAt: string;
  acceptedByPlayerId?: string;
  link: string;
};

export type Payout = {
  id: string;
  playerId: string;
  playerName: string;
  amount: Money;
  method: PayoutMethod;
  status: PayoutStatus;
  requestedAt: string;
  destinationMasked: string;
  txHash?: string;
  timeline: { at: string; status: string; note?: string }[];
};

export type DepositSourceWalletType = "manual" | "coinductor";

export type DepositAttempt = {
  id: string;
  sourceWalletAddress: string;
  sourceWalletVerified: boolean; // true if connected via Coinductor, false if manual entry
  sourceWalletType: DepositSourceWalletType;
  casinoDepositAddress: string;
  status: "pending" | "confirmed" | "failed" | "needs_review";
  initiatedAt: string;
  completedAt?: string;
  amount?: Money;
  transactionHash?: string;
};

export type LedgerEntry = {
  id: string;
  at: string;
  type: LedgerType;
  description: string;
  amount: Money; // + credit / - debit
  balanceAfter?: Money;
  refId: string;
  sourceWalletAddress?: string; // For Agent Deposit entries, track the source wallet
};

export type Statement = {
  id: string;
  weekLabel: string;
  status: "Paid" | "Pending" | "Adjusted";
  ggr: Money;
  ngr: Money;
  commissionRate: number;
  adjustments: Money;
  finalPayout: Money;
  paidAt?: string;
  ledgerRefId: string;
};

export type WalletSummary = {
  available: Money;
  locked: Money;
  total: Money;
};

export type Goal = {
  id: string;
  type: "Individual" | "Clan-wide" | "All-member";
  title: string;
  description: string;
  progress: number; // 0-100
  remainingLabel: string;
};

export type War = {
  id: string;
  name: string;
  status: "Upcoming" | "Active" | "Past";
  startsAt: string;
  endsAt: string;
  entryFee: Money;
  opponent: string;
  registered: boolean;
  scoreYou: number;
  scoreThem: number;
};

export type Alert = {
  id: string;
  severity: "High" | "Medium" | "Low";
  title: string;
  description: string;
  deepLink: string;
};
