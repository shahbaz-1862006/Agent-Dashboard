# 📦 Replit Deployment Guide

## Quick Start

### Step 1: Download the Zip
Download `Agent-Dashboard-Final.zip` from the workspaces folder.

### Step 2: Extract on Replit
1. Upload the zip file to your Replit project
2. Extract it: `unzip Agent-Dashboard-Final.zip`
3. Navigate to the project: `cd Agent-Dashboard`

### Step 3: Install Dependencies
```bash
cd "Agent Dashboard"
npm install
```

### Step 4: Run the Application
```bash
npm run dev
```

The application will be available at:
- **Local**: `http://localhost:5000`
- **Replit**: Your Replit domain (usually auto-detected)

---

## 📂 What's in the Zip

```
Agent-Dashboard/
├── Agent Dashboard/          # Main React application
│   ├── src/
│   │   ├── types.ts         ✅ Updated with deposit tracking
│   │   ├── pages/dashboard/
│   │   │   └── WalletPage.tsx ✅ Updated with source wallet
│   │   └── data/
│   │       └── mockData.ts   ✅ Updated with sample wallets
│   ├── package.json
│   ├── vite.config.ts
│   ├── index.html
│   └── tsconfig.json
│
└── Documentation/            # Complete guides
    ├── README_IMPLEMENTATION.md
    ├── DOCUMENTATION_INDEX.md
    ├── DEVELOPER_REFERENCE.md
    ├── DEPOSIT_SOURCE_WALLET_FEATURE.md
    ├── DEPOSIT_USER_GUIDE.md
    ├── IMPLEMENTATION_CHECKLIST.md
    ├── DELIVERY_SUMMARY.md
    ├── CHANGES_SUMMARY.md
    └── PUBLICATION_STATUS.md
```

---

## 🚀 Deployment Steps

### On Replit:

1. **Create a new Replit project** (if needed)
   - Choose Node.js template
   - Or import from GitHub

2. **Upload the zip file**
   - Use Replit's file upload
   - Or use git to push

3. **Extract and setup**
   ```bash
   unzip Agent-Dashboard-Final.zip
   cd Agent-Dashboard/"Agent Dashboard"
   npm install
   ```

4. **Create .replit file** (if not present)
   ```
   run = "npm run dev"
   ```

5. **Click Run**
   - Replit will execute `npm run dev`
   - App will be live on your Replit domain

6. **Access the app**
   - Click the "Open in new tab" button
   - Or use the preview pane

---

## 🔧 Environment Setup

### package.json Scripts
The following scripts are available:

```json
{
  "dev": "vite --host 0.0.0.0",
  "build": "tsc -b && vite build",
  "preview": "vite preview"
}
```

### Port Configuration
- Default: `5000`
- Can be changed via `PORT` environment variable
- On Replit: automatically configured

---

## 🎯 Testing the Feature

Once deployed, test the source wallet tracking:

1. **Navigate to Wallet page**
   - Click "Wallet" in sidebar

2. **Click "Deposit USDT" button**
   - Should see "Your sending wallet" section

3. **Test Manual Entry**
   - Paste wallet address: `TUg99ynNVrHBpzB9C5yvGWt3YVvQRKJGhk`
   - See warning message
   - Click "I have sent USDT"

4. **Test Coinductor Connection**
   - Click "Connect Coinductor Wallet"
   - See connection modal
   - Click connect button
   - See wallet auto-fill with "Verified" badge

5. **Check Ledger**
   - View wallet ledger
   - Click "Agent Deposit" entry
   - See source wallet in details

---

## 📚 Documentation

After deployment, read these files (included in zip):

**Start Here**:
→ `README_IMPLEMENTATION.md`

**Navigation**:
→ `DOCUMENTATION_INDEX.md`

**For Users**:
→ `DEPOSIT_USER_GUIDE.md`

**For Developers**:
→ `DEVELOPER_REFERENCE.md`

**Full Specification**:
→ `DEPOSIT_SOURCE_WALLET_FEATURE.md`

---

## 🛠️ Troubleshooting

### Port Already in Use
```bash
PORT=3000 npm run dev
```

### Dependencies Not Installing
```bash
rm -rf node_modules package-lock.json
npm install
```

### TypeScript Errors
```bash
npm run build
```

### Clear Cache
```bash
npm cache clean --force
npm install
```

---

## 📋 Replit-Specific Notes

### .replit File Example
```
run = "cd 'Agent Dashboard' && npm run dev"
modules = ["nodejs-20"]
```

### Environment Variables (if needed)
```
VITE_API_URL=https://your-api.com
PORT=5000
```

### Database Connection (future)
When adding backend APIs, set environment variables in Replit secrets:
- `DB_CONNECTION_STRING`
- `API_KEY`
- `COINDUCTOR_API_KEY`

---

## ✅ Verification Checklist

After deployment:

- [ ] App loads without errors
- [ ] Navigation works
- [ ] Wallet page accessible
- [ ] Deposit button opens modal
- [ ] Wallet input field visible
- [ ] Coinductor button visible
- [ ] Manual entry works
- [ ] Connection flow works
- [ ] Ledger shows source wallet
- [ ] No console errors

---

## 🔗 Quick Links

| Resource | Purpose |
|----------|---------|
| `Agent Dashboard/src/types.ts` | Type definitions |
| `Agent Dashboard/src/pages/dashboard/WalletPage.tsx` | Main component |
| `DEVELOPER_REFERENCE.md` | API integration guide |
| `DEPOSIT_USER_GUIDE.md` | User instructions |

---

## 📞 Support

### If Something Breaks

1. Check console for errors (F12)
2. Review the error message
3. Check `TROUBLESHOOTING.md` (if present)
4. Refer to `DEVELOPER_REFERENCE.md`

### Common Issues

**Blank page**: 
- Check browser console (F12)
- Refresh page
- Clear browser cache

**Build errors**:
- Run `npm run build` to see details
- Check TypeScript errors
- Verify all files extracted properly

**Port conflicts**:
- Use different port: `PORT=3000 npm run dev`
- Kill process: `pkill -f node`

---

## 🎉 You're Ready!

Everything needed to deploy on Replit is in this zip:
- ✅ Complete source code
- ✅ All dependencies listed
- ✅ Configuration files
- ✅ Documentation

**Next Step**: Extract, install, and run!

```bash
unzip Agent-Dashboard-Final.zip
cd Agent-Dashboard/"Agent Dashboard"
npm install
npm run dev
```

Then open the preview or generated URL in your browser.

---

**Created**: January 28, 2026
**Status**: Ready for Replit Deployment
