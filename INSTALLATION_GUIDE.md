# Installation & Verification Guide

## Step 1: Install Dependencies

```bash
cd "Agent Dashboard"
npm install
```

This will install:
- Vue 3
- Vue Router
- Pinia
- Quasar Framework
- TypeScript
- Vite and build tools

**Expected output**: `added XXX packages`

---

## Step 2: Verify Installation

### Check Node and npm versions
```bash
node --version  # Should be 16.x or higher
npm --version   # Should be 8.x or higher
```

### Check installed packages
```bash
npm list vue vue-router pinia quasar
```

**Expected**: All packages should show their versions without errors

---

## Step 3: Start Development Server

```bash
npm run dev
```

**Expected output**:
```
  VITE v5.x.x  ready in XXX ms

  ➜  Local:   http://localhost:5000
  ➜  press h to show help
```

---

## Step 4: Access the Application

Open your browser and navigate to:
```
http://localhost:5000
```

You should see the **Clazino Agent Dashboard** login page.

---

## Step 5: Test Basic Functionality

### Test Theme Toggle
1. Click the moon/sun icon in the top-right corner
2. Verify the page switches between light and dark modes
3. Reload the page - theme should persist

### Test Authentication Flow

#### Option 1: Login (Mock)
1. Go to "Create an account" link
2. Create credentials (any email/password)
3. Go back to login
4. Use the credentials you created
5. You should be redirected to dashboard

#### Option 2: Use Invite Code
1. Click "Enter invite code"
2. Enter any code (e.g., `DEMO-0001`)
3. Click "Verify Invite"
4. Register with credentials
5. Login with those credentials

### Test Navigation
1. On dashboard, verify sidebar shows all menu items:
   - Home
   - Wallet
   - Players
   - Invites
   - Payouts
   - Commissions
   - Clan Goals
   - Clan Wars
   - Settings

2. Click each menu item - page should change
3. Click the menu icon to collapse/expand sidebar (desktop)
4. Click menu button to open sidebar (mobile)

### Test Logout
1. Go to Settings or click the user menu
2. Click Logout
3. You should be redirected to login page

---

## Troubleshooting

### Issue: Port 5000 already in use
**Solution**: 
```bash
# Use a different port
PORT=5001 npm run dev
```

### Issue: Module not found errors
**Solution**:
```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
npm run dev
```

### Issue: Vue DevTools not showing
**Solution**:
1. Install Vue DevTools browser extension
2. Reload the page
3. DevTools should appear in browser dev tools

### Issue: Quasar icons not displaying
**Solution**:
1. Make sure Quasar CSS is imported in `src/main.ts`
2. Check that icon name is valid (e.g., 'home', 'settings')
3. Reload the page

### Issue: Components not updating
**Solution**:
1. Check Vue DevTools to see if state is updating
2. Ensure using `ref()` for reactive values
3. Use `computed()` for derived values
4. Check for console errors

### Issue: TypeScript errors
**Solution**:
```bash
# Rebuild type definitions
npm run build
```

---

## Build for Production

```bash
npm run build
```

**Expected output**:
```
vite v5.x.x building for production...
✓ XXX modules transformed.
dist/index.html                          XXX B
dist/assets/index-XXX.js              XXX.XXX kB / gzip: XXX.XX kB
✓ built in XXXms
```

The `dist/` folder contains the production-ready files.

---

## Preview Production Build

```bash
npm run preview
```

This runs the production build locally for testing.

---

## Development Workflow

### Making Changes
1. Edit `.vue` files in `src/`
2. Changes auto-reload thanks to Vite HMR
3. No need to restart dev server

### Debugging
1. Open browser DevTools (F12)
2. Use Vue DevTools tab for component inspection
3. Use Console for logging
4. Use Network tab for API calls

### File Watchlist
Watch these files for changes:
- `src/pages/**/*.vue` - Page components
- `src/components/**/*.vue` - UI components
- `src/app/router.ts` - Routes
- `src/app/auth/authStore.ts` - Auth store
- `src/app/theme/themeStore.ts` - Theme store
- `src/main.ts` - Entry point

---

## Common Commands

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Start (alias for dev)
npm start

# Check TypeScript
npm run build
```

---

## Environment Setup

### VS Code Extensions (Recommended)

1. **Volar** (Vue Language Support)
   - Id: `Vue.volar`
   - Required for Vue 3 + TypeScript

2. **Tailwind CSS IntelliSense**
   - Id: `bradlc.vscode-tailwindcss`
   - For Tailwind class autocompletion

3. **Vue DevTools**
   - Browser extension for debugging
   - Available for Chrome and Firefox

4. **Prettier** (Optional)
   - Id: `esbenp.prettier-vscode`
   - For code formatting

### VS Code Settings

Create `.vscode/settings.json`:
```json
{
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "[vue]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode"
  },
  "editor.codeActionsOnSave": {
    "source.fixAll": true
  }
}
```

---

## Project Health Check

Run this checklist to verify everything works:

- [ ] `npm install` completes without errors
- [ ] `npm run dev` starts server on port 5000
- [ ] Browser opens to login page without errors
- [ ] Browser DevTools shows no JS errors
- [ ] Vue DevTools extension loads
- [ ] Theme toggle works
- [ ] Navigation sidebar works
- [ ] Login/Register flow works
- [ ] Page changes when clicking nav items
- [ ] `npm run build` produces dist folder
- [ ] `npm run preview` loads production build

---

## Next Steps

Once verified:
1. Review [VUE3_DEVELOPER_GUIDE.md](./VUE3_DEVELOPER_GUIDE.md) for development patterns
2. Check [QUICK_START_VUE3.md](./QUICK_START_VUE3.md) for quick reference
3. Read [MIGRATION_SUMMARY.md](./MIGRATION_SUMMARY.md) for architecture overview
4. Start implementing dashboard page content
5. Connect to real API backend

---

## Support Resources

- **Vue 3 Docs**: https://vuejs.org/
- **Vue Router Docs**: https://router.vuejs.org/
- **Pinia Docs**: https://pinia.vuejs.org/
- **Quasar Docs**: https://quasar.dev/
- **TypeScript Docs**: https://www.typescriptlang.org/
- **Tailwind CSS**: https://tailwindcss.com/

---

## FAQ

**Q: Can I use the old React components?**
A: No, they've been replaced with Vue components. The old code is no longer compatible.

**Q: How do I update components?**
A: Edit `.vue` files in `src/`. Changes auto-reload in development.

**Q: How do I add new pages?**
A: Create a `.vue` file in `src/pages/`, add route in `src/app/router.ts`.

**Q: How do I add new stores?**
A: Create a new file in `src/app/` with Pinia `defineStore()`.

**Q: Can I use Quasar components directly?**
A: Yes! All Quasar components are available. See `VUE3_DEVELOPER_GUIDE.md`.

**Q: How do I debug?**
A: Use Vue DevTools browser extension + browser console.

**Q: Is this production-ready?**
A: The framework is production-ready. Dashboard pages need content implementation.

---

**Installation Guide Complete!** 
Now you're ready to develop. 🚀
