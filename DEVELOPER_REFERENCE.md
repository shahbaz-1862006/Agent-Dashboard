# Developer Quick Reference: Source Wallet Tracking

## 🏗️ Architecture Overview

```
┌─────────────────────────────────────────────────────────┐
│            Agent Deposit Flow (Updated)                 │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  1. Agent clicks "Deposit USDT" button                │
│     ↓                                                   │
│  2. Modal opens with wallet input options             │
│     ├─ Option A: Manual wallet entry                  │
│     └─ Option B: Connect Coinductor wallet            │
│     ↓                                                   │
│  3. Validation: sourceWalletAddress required          │
│     ↓                                                   │
│  4. Display casino deposit address                    │
│     ↓                                                   │
│  5. Agent submits "I have sent USDT"                 │
│     ↓                                                   │
│  6. DepositAttempt created with source wallet         │
│     ↓                                                   │
│  7. Ledger entry created + sourceWalletAddress       │
│     ↓                                                   │
│  8. Support can track deposit to source wallet       │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

## 📊 Data Structures

### DepositSourceWalletType
```typescript
type DepositSourceWalletType = "manual" | "coinductor";
```
Distinguishes source of wallet information.

### DepositAttempt (New Type)
```typescript
type DepositAttempt = {
  id: string;                          // Unique deposit ID
  sourceWalletAddress: string;         // Agent's sending wallet
  sourceWalletVerified: boolean;       // true if Coinductor verified
  sourceWalletType: DepositSourceWalletType;
  casinoDepositAddress: string;        // Where to send USDT
  status: "pending" | "confirmed" | "failed" | "needs_review";
  initiatedAt: string;                 // ISO timestamp
  completedAt?: string;                // Optional completion time
  amount?: Money;                      // Deposit amount
  transactionHash?: string;            // Optional blockchain tx
};
```

### LedgerEntry (Extended)
```typescript
type LedgerEntry = {
  // ... existing fields ...
  sourceWalletAddress?: string;        // NEW: For Agent Deposit entries
};
```

## 🎛️ Component State

### WalletPage.tsx State Variables
```typescript
// Source wallet tracking
const [sourceWalletAddress, setSourceWalletAddress] = useState("");
const [sourceWalletVerified, setSourceWalletVerified] = useState(false);
const [showCoinductorConnect, setShowCoinductorConnect] = useState(false);

// Computed validation
const isSourceWalletValid = sourceWalletAddress.trim().length > 0;
```

## 🔄 Event Handlers

### Manual Wallet Entry
```typescript
<Input 
  placeholder="Paste your wallet address (TRC-20)…"
  value={sourceWalletAddress}
  onChange={(e) => setSourceWalletAddress(e.target.value)}
  disabled={sourceWalletVerified}
/>
```

### Coinductor Connection
```typescript
onClick={() => {
  // Simulate connection (real: call Coinductor API)
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
```

### Form Submission
```typescript
disabled={!isSourceWalletValid}  // Only enable when wallet set
onClick={() => {
  toast.push({ 
    title: "Deposit initiated", 
    message: `Waiting for confirmations from ${
      sourceWalletVerified ? "Coinductor wallet" : "your wallet"
    }.`,
    tone: "info" 
  });
  // Reset state
  setDepositOpen(false);
  setSourceWalletAddress("");
  setSourceWalletVerified(false);
  setShowCoinductorConnect(false);
}}
```

## 🔐 Validation Rules

```typescript
// Wallet must be provided
if (!sourceWalletAddress.trim()) {
  // Block submission
  return;
}

// Validation happens automatically through:
// 1. Input component requires manual entry OR connection
// 2. Button disabled until sourceWalletAddress has value
// 3. Modal resets state on close to prevent stale data
```

## 📊 UI Sections

### 1. Source Wallet Input
- Located at **top of modal** (most visible)
- Two clear options presented
- Warning message for guidance
- Change wallet option for modification

### 2. Casino Deposit Address
- Below source wallet section
- Copy button for convenience
- QR code placeholder
- Warning about TRC-20 only

### 3. Deposit History
- Pending deposits section
- Confirmed deposits section
- Shows wallet source in list items

### 4. Ledger Detail Drawer
- Shows source wallet when available
- Only for "Agent Deposit" entries
- Copy button for reference
- Monospace font for clarity

## 🔌 Integration Points

### API Integration (To Implement)
```typescript
// Create DepositAttempt
POST /api/deposits
{
  sourceWalletAddress: string;
  sourceWalletVerified: boolean;
  sourceWalletType: "manual" | "coinductor";
  casinoDepositAddress: string;
}

// Fetch ledger with source wallet data
GET /api/ledger
// Returns: LedgerEntry[] with sourceWalletAddress for deposits
```

### Coinductor Integration (To Implement)
```typescript
// Connect wallet via Coinductor
async function connectCoinductorWallet() {
  // 1. Call Coinductor API
  const wallet = await coinductor.connect();
  
  // 2. Set wallet address
  setSourceWalletAddress(wallet.address);
  
  // 3. Mark as verified
  setSourceWalletVerified(true);
  
  // 4. Close connection modal
  setShowCoinductorConnect(false);
}
```

## 🧪 Testing Code Snippets

### Test Manual Entry
```typescript
// Arrange
const walletAddress = "TUg99ynNVrHBpzB9C5yvGWt3YVvQRKJGhk";

// Act
userEvent.type(walletInput, walletAddress);

// Assert
expect(submitButton).not.toBeDisabled();
```

### Test Coinductor Flow
```typescript
// Arrange
const connectButton = screen.getByText("Connect Coinductor Wallet");

// Act
userEvent.click(connectButton);
userEvent.click(screen.getByText("Connect Coinductor Wallet", { selector: "button" }));

// Assert
expect(screen.getByText("Verified")).toBeInTheDocument();
expect(submitButton).not.toBeDisabled();
```

### Test Form Submission
```typescript
// Arrange
const sourceWallet = "TUg99ynNVrHBpzB9C5yvGWt3YVvQRKJGhk";

// Act
userEvent.type(walletInput, sourceWallet);
userEvent.click(submitButton);

// Assert
expect(mockToast).toHaveBeenCalledWith(
  expect.objectContaining({
    title: "Deposit initiated",
    message: expect.stringContaining("your wallet")
  })
);
```

## 🐛 Debugging Tips

### Check Wallet State
```typescript
// In browser console
console.log({
  sourceWalletAddress,
  sourceWalletVerified,
  isSourceWalletValid
});
```

### Verify Form Validation
```typescript
// Submit button should be:
// - Disabled when sourceWalletAddress is empty
// - Enabled when sourceWalletAddress has length > 0
// - Independent of sourceWalletVerified state
```

### Check Mock Data
```typescript
// In src/data/mockData.ts
// Look for sourceWalletAddress in makeLedger() output
const ledger = makeLedger();
console.log(ledger.filter(e => e.type === "Agent Deposit"));
```

## 🚀 Deployment Checklist

- [ ] All TypeScript errors resolved
- [ ] Mock data includes sample source wallets
- [ ] Coinductor API integration ready
- [ ] API endpoints created for DepositAttempt storage
- [ ] Ledger API returns sourceWalletAddress
- [ ] Support team trained on new feature
- [ ] User guide distributed to agents
- [ ] QA testing completed
- [ ] Production database migration ready

## 📚 Related Files

| File | Purpose |
|------|---------|
| [src/types.ts](src/types.ts) | Type definitions |
| [src/pages/dashboard/WalletPage.tsx](src/pages/dashboard/WalletPage.tsx) | Main component |
| [src/data/mockData.ts](src/data/mockData.ts) | Mock data |
| [DEPOSIT_SOURCE_WALLET_FEATURE.md](DEPOSIT_SOURCE_WALLET_FEATURE.md) | Tech docs |
| [DEPOSIT_USER_GUIDE.md](DEPOSIT_USER_GUIDE.md) | User guide |

---

**Last Updated**: January 28, 2026
