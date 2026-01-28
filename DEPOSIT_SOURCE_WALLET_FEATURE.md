# Agent Deposit Source Wallet Tracking Feature

## Overview

This document describes the source wallet tracking feature added to the Clazino Agent Dashboard. This feature ensures every deposit clearly identifies the agent's source wallet (the wallet the agent is sending USDT from).

## Why This Matters

- **Verification**: Deposits belong to the correct agent
- **Resolution**: Quickly match missing or delayed deposits to their source
- **Security**: Prevents third-party or unauthorized wallet usage
- **Trust**: Maintains a trusted list of agent wallets

## Implementation Details

### 1. Type Definitions

Added two new types in [`src/types.ts`](src/types.ts):

#### `DepositSourceWalletType`
```typescript
export type DepositSourceWalletType = "manual" | "coinductor";
```
Distinguishes between manually entered wallet addresses and Coinductor-connected wallets.

#### `DepositAttempt`
```typescript
export type DepositAttempt = {
  id: string;
  sourceWalletAddress: string;
  sourceWalletVerified: boolean; // true if connected via Coinductor
  sourceWalletType: DepositSourceWalletType;
  casinoDepositAddress: string;
  status: "pending" | "confirmed" | "failed" | "needs_review";
  initiatedAt: string;
  completedAt?: string;
  amount?: Money;
  transactionHash?: string;
};
```
Tracks all deposit attempts with source wallet information.

#### `LedgerEntry` (Updated)
```typescript
export type LedgerEntry = {
  // ... existing fields
  sourceWalletAddress?: string; // For Agent Deposit entries, track the source wallet
};
```
Extended to track source wallet for Agent Deposit ledger entries.

### 2. UI Changes

#### Deposit Modal Flow

When agents click "Deposit USDT", they now see:

**Step 1: Provide Source Wallet**
- **Option A**: Manual Entry
  - Text input field: "Paste your wallet address (TRC-20)…"
  - Clear warning: "Send USDT only from this wallet. Deposits from other wallets may be delayed or rejected."
  
- **Option B**: Connect Coinductor Wallet
  - Button: "Connect Coinductor Wallet"
  - Auto-fills wallet address
  - Marks address as verified
  - No manual entry required

**Step 2: Provide Deposit Details**
- Casino deposit address (existing functionality)
- Pending/Confirmed deposits list (existing functionality)

**Step 3: Confirmation**
- Button "I have sent USDT" becomes enabled only after wallet is provided
- Toast confirms wallet source used (manual or Coinductor)

### 3. Validation Rules

- **Required**: Agent cannot proceed without providing or connecting a source wallet
- **Verified**: Coinductor-connected wallets are marked as verified
- **Manual**: Manually entered addresses can be changed if needed

### 4. Ledger Display

When viewing deposit details in the Wallet Ledger:

- **Agent Deposit** entries now display the source wallet address
- Click the ledger entry to see full details
- Copy button for easy reference
- Source wallet shown only for Agent Deposit type entries

### 5. Data Storage

Each deposit attempt stores:
- **Agent identity** (implicit from logged-in agent)
- **Source wallet address** (manual or Coinductor-verified)
- **Casino deposit address** (unchanged)
- **Deposit status**: pending / confirmed / failed / needs_review
- **Wallet verification method**: manual or coinductor

## Features Implemented

✅ **Manual Wallet Entry**
- Agent enters wallet address in text field
- Clear warning displayed
- Address stored with deposit attempt

✅ **Coinductor Wallet Connection**
- "Connect Coinductor Wallet" button
- Auto-fills verified wallet address
- Simplifies workflow for Coinductor users

✅ **Validation**
- Cannot submit deposit without source wallet
- Field required before proceeding

✅ **Ledger Tracking**
- Source wallet displayed in deposit details
- Easily identifiable in ledger history
- Copy functionality for reference

✅ **UX/UI**
- Minimal changes to existing popup layout
- Clear instructions and warnings
- Responsive design maintained
- Warning badges for clarity

## Out of Scope

As specified in requirements:
- ❌ No blockchain analysis
- ❌ No automation of confirmations
- ❌ No wallet risk scoring
- ❌ No changes to payment networks
- ❌ No changes to existing deposit confirmation logic

## Files Modified

1. **[src/types.ts](src/types.ts)**
   - Added `DepositSourceWalletType` type
   - Added `DepositAttempt` type
   - Extended `LedgerEntry` with `sourceWalletAddress` field

2. **[src/pages/dashboard/WalletPage.tsx](src/pages/dashboard/WalletPage.tsx)**
   - Added source wallet state management
   - Updated deposit modal with wallet input section
   - Added Coinductor wallet connection flow
   - Added validation for source wallet
   - Updated ledger detail drawer to display source wallet
   - Disabled submit button until wallet is provided

3. **[src/data/mockData.ts](src/data/mockData.ts)**
   - Updated `makeLedger()` to include sample source wallet addresses for deposits

## Testing Checklist

- [ ] Open Deposit USDT modal
- [ ] Verify wallet input field is visible
- [ ] Verify "Connect Coinductor Wallet" button is visible
- [ ] Test manual wallet entry and validation
- [ ] Test Coinductor wallet connection flow
- [ ] Verify "I have sent USDT" button is disabled until wallet provided
- [ ] Test wallet address copy functionality
- [ ] Verify source wallet displays in ledger entry details
- [ ] Verify toast messages display correctly
- [ ] Test "Change wallet" option to modify entry

## Future Enhancements

While out of scope for this release, consider:
1. Wallet address validation against known formats
2. Support for multiple source wallets per agent
3. Wallet whitelist management UI
4. Automatic deposit matching based on source wallet
5. Alerts for deposits from unexpected wallets
6. Analytics on deposit sources

## Success Metrics

✅ Every agent deposit now clearly identifies the source wallet
✅ Support team can quickly match deposits to agents
✅ Agents understand exactly which wallet to send funds from
✅ Existing deposit logic continues to work unchanged
✅ UI remains intuitive and user-friendly
