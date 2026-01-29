# Vue 3 Architecture Overview

## Application Architecture

```
┌─────────────────────────────────────────────────────────┐
│                    Browser / DOM                         │
└─────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────┐
│                      Vue 3 App                           │
│  ┌───────────────────────────────────────────────────┐  │
│  │              App.vue (Root)                       │  │
│  │  - RouterView (dynamic page rendering)            │  │
│  └───────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────┘
                            ↓
        ┌───────────────────┼───────────────────┐
        ↓                   ↓                   ↓
   ┌─────────┐      ┌──────────────┐    ┌────────────┐
   │  Pinia  │      │ Vue Router   │    │  Quasar    │
   │ Stores  │      │              │    │ Components │
   └─────────┘      └──────────────┘    └────────────┘
        ↓                   ↓                   ↓
   ┌─────────┐      ┌──────────────┐    ┌────────────┐
   │ Auth    │      │  Routes      │    │  UI/Layout │
   │ Store   │      │  Protected   │    │  Elements  │
   │ Theme   │      │  by Guard    │    │            │
   │ Store   │      │              │    │            │
   └─────────┘      └──────────────┘    └────────────┘
```

---

## Directory Structure

```
Agent Dashboard/
├── src/
│   ├── main.ts                          # Entry point
│   ├── App.vue                          # Root component
│   ├── styles.css                       # Global styles (Tailwind)
│   │
│   ├── app/
│   │   ├── router.ts                    # Vue Router configuration
│   │   │
│   │   ├── auth/
│   │   │   ├── authStore.ts             # Pinia auth store
│   │   │   └── useRequireAuth.ts        # Auth composable
│   │   │
│   │   ├── shell/
│   │   │   ├── DashboardLayout.vue      # Main layout wrapper
│   │   │   ├── Sidebar.vue              # Navigation sidebar
│   │   │   └── nav.ts                   # Navigation items config
│   │   │
│   │   └── theme/
│   │       └── themeStore.ts            # Pinia theme store
│   │
│   ├── pages/
│   │   ├── auth/
│   │   │   ├── LoginPage.vue            # Login form
│   │   │   ├── RegisterPage.vue         # Registration form
│   │   │   └── InviteEntryPage.vue      # Invite code entry
│   │   │
│   │   ├── dashboard/
│   │   │   ├── HomePage.vue             # Home dashboard
│   │   │   ├── WalletPage.vue           # Wallet management
│   │   │   ├── PlayersPage.vue          # Players list
│   │   │   ├── PlayerDetailPage.vue     # Player details
│   │   │   ├── InvitesPage.vue          # Invite management
│   │   │   ├── PayoutsPage.vue          # Payout records
│   │   │   ├── CommissionsPage.vue      # Commission tracking
│   │   │   ├── StatementDetailPage.vue  # Statement details
│   │   │   ├── ClanOverviewPage.vue     # Clan info
│   │   │   ├── ClanGoalsPage.vue        # Clan goals
│   │   │   ├── ClanWarsPage.vue         # Clan wars
│   │   │   ├── WarDetailPage.vue        # War details
│   │   │   └── SettingsPage.vue         # User settings
│   │   │
│   │   └── misc/
│   │       └── NotFoundPage.vue         # 404 page
│   │
│   ├── components/
│   │   ├── common/
│   │   │   ├── Logo.vue                 # Logo component
│   │   │   └── ThemeToggle.vue          # Theme switcher
│   │   │
│   │   ├── ui/
│   │   │   └── ... (Quasar wrappers)
│   │   │
│   │   └── charts/
│   │       └── ... (Chart components)
│   │
│   ├── services/
│   │   ├── api.ts                       # API methods
│   │   ├── client.ts                    # HTTP client
│   │   └── mock.ts                      # Mock data
│   │
│   ├── types/
│   │   └── ... (TypeScript types)
│   │
│   └── utils/
│       ├── csv.ts                       # CSV utilities
│       ├── format.ts                    # Format utilities
│       └── print.ts                     # Print utilities
│
├── public/
│   └── ... (Static assets)
│
├── index.html                           # HTML entry point
├── vite.config.ts                       # Vite configuration
├── tsconfig.json                        # TypeScript config
├── tsconfig.app.json                    # App-specific TS config
├── tsconfig.node.json                   # Node-specific TS config
├── package.json                         # Dependencies
└── package-lock.json                    # Lock file
```

---

## Data Flow Architecture

```
┌──────────────────────────────────────────────────────────────┐
│                     User Interaction                          │
│           (Click, Type, Submit, Navigate)                    │
└──────────────────────────────────────────────────────────────┘
                            ↓
┌──────────────────────────────────────────────────────────────┐
│                   Vue Components                              │
│  ┌─────────────┐ ┌──────────┐ ┌──────────┐ ┌────────────┐  │
│  │ LoginPage   │ │ Sidebar  │ │HomePage  │ │ WalletPage │  │
│  └─────────────┘ └──────────┘ └──────────┘ └────────────┘  │
└──────────────────────────────────────────────────────────────┘
                            ↓
                 ┌──────────┴──────────┐
                 ↓                     ↓
        ┌────────────────┐    ┌────────────────┐
        │ Pinia Stores   │    │  Vue Router    │
        ├────────────────┤    ├────────────────┤
        │ • authStore    │    │ • Route Guard  │
        │ • themeStore   │    │ • Navigation   │
        └────────────────┘    └────────────────┘
                 ↓                     ↓
        ┌────────────────┐    ┌────────────────┐
        │ State Update   │    │ URL Change     │
        └────────────────┘    └────────────────┘
                 ↓                     ↓
        ┌────────────────┐    ┌────────────────┐
        │ Computed       │    │ Components     │
        │ Properties     │    │ Re-render      │
        └────────────────┘    └────────────────┘
                 ↓                     ↓
                 └──────────┬──────────┘
                            ↓
        ┌──────────────────────────────────────┐
        │       DOM Updates & Re-render        │
        └──────────────────────────────────────┘
                            ↓
        ┌──────────────────────────────────────┐
        │          Browser Renders             │
        └──────────────────────────────────────┘
```

---

## State Management Flow

### Authentication Store
```
┌──────────────────────────┐
│   useAuthStore()         │
├──────────────────────────┤
│ State (Refs):            │
│  • user: AuthUser | null │
│  • token: string | null  │
├──────────────────────────┤
│ Computed:                │
│  • isAuthenticated       │
├──────────────────────────┤
│ Actions:                 │
│  • login(email)          │
│  • logout()              │
├──────────────────────────┤
│ Storage:                 │
│  • localStorage (LS_KEY) │
└──────────────────────────┘
        ↓
┌──────────────────────────┐
│ Components Access:       │
│ • authStore.user         │
│ • authStore.isAuth...    │
│ • authStore.login(...)   │
│ • authStore.logout()     │
└──────────────────────────┘
        ↓
┌──────────────────────────┐
│ UI Updates:              │
│ • Show/hide elements     │
│ • Redirect on logout     │
│ • Display user info      │
└──────────────────────────┘
```

### Theme Store
```
┌──────────────────────────┐
│   useThemeStore()        │
├──────────────────────────┤
│ State (Refs):            │
│  • theme: 'light'|'dark' │
├──────────────────────────┤
│ Computed:                │
│  • isDark: boolean       │
├──────────────────────────┤
│ Actions:                 │
│  • setTheme(t)           │
│  • toggleTheme()         │
├──────────────────────────┤
│ Storage:                 │
│  • localStorage (STORAGE)│
│  • DOM class ('dark')    │
└──────────────────────────┘
        ↓
┌──────────────────────────┐
│ Components Access:       │
│ • themeStore.theme       │
│ • themeStore.isDark      │
│ • themeStore.toggle...() │
└──────────────────────────┘
        ↓
┌──────────────────────────┐
│ UI Updates:              │
│ • CSS variables applied  │
│ • Colors change          │
│ • All pages update       │
└──────────────────────────┘
```

---

## Routing Architecture

```
┌────────────────────────────────────────────────────────┐
│             Vue Router Configuration                   │
├────────────────────────────────────────────────────────┤
│ Routes:                                                │
│                                                        │
│ /                    → redirect to /invite            │
│ /invite              → InviteEntryPage (public)       │
│ /login               → LoginPage (public)             │
│ /register            → RegisterPage (public)          │
│ /auth/login          → redirect to /login             │
│ /auth/register       → redirect to /register          │
│                                                        │
│ /dashboard           → DashboardLayout (protected)    │
│ ├── /dashboard/home         → HomePage               │
│ ├── /dashboard/wallet       → WalletPage             │
│ ├── /dashboard/players      → PlayersPage            │
│ ├── /dashboard/players/:id  → PlayerDetailPage       │
│ ├── /dashboard/invites      → InvitesPage            │
│ ├── /dashboard/payouts      → PayoutsPage            │
│ ├── /dashboard/commissions  → CommissionsPage        │
│ ├── /dashboard/commissions/statements/:id → ...      │
│ ├── /dashboard/clan         → ClanOverviewPage       │
│ ├── /dashboard/clan/goals   → ClanGoalsPage          │
│ ├── /dashboard/clan/wars    → ClanWarsPage           │
│ ├── /dashboard/clan/wars/:id → WarDetailPage         │
│ └── /dashboard/settings     → SettingsPage           │
│                                                        │
│ /404                 → NotFoundPage                   │
│ /:pathMatch(.*)* → redirect to /404                   │
└────────────────────────────────────────────────────────┘
        ↓
┌────────────────────────────────────────────────────────┐
│             Route Guard (beforeEach)                   │
├────────────────────────────────────────────────────────┤
│ Check meta.requiresAuth:                              │
│ • true + no token → redirect to /login                │
│ • true + token → allow                                │
│ • false → allow                                        │
└────────────────────────────────────────────────────────┘
```

---

## Component Communication

```
┌──────────────────────────────────────┐
│         Parent Component              │
│  (DashboardLayout)                   │
├──────────────────────────────────────┤
│ Props: user, clanName, etc.          │
│ Events: @toggle-mobile, @logout      │
│ Stores: authStore, themeStore        │
└──────────┬───────────────────────────┘
           │
    ┌──────┴──────┬───────────┐
    ↓             ↓           ↓
┌────────┐  ┌────────────┐  ┌─────────┐
│Sidebar │  │ Header     │  │Main     │
│  .vue  │  │ Section    │  │Content  │
└────────┘  └────────────┘  └─────────┘
    │            │              │
    └───────┬────┴──────┬───────┘
            ↓           ↓
        Emit         UseRouter
        Events       Navigate
```

---

## Store Usage Pattern

### In Component (Composition API)
```typescript
<script setup lang="ts">
import { computed } from 'vue'
import { useAuthStore } from '@/app/auth/authStore'

// Get store instance
const authStore = useAuthStore()

// Access state (via computed for reactivity)
const user = computed(() => authStore.user)
const isAuth = computed(() => authStore.isAuthenticated)

// Use in template
// {{ user?.name }}
// {{ isAuth }}

// Call actions
const handleLogin = () => {
  authStore.login('email@example.com')
}

const handleLogout = () => {
  authStore.logout()
}
</script>
```

---

## Lifecycle Overview

```
1. Browser Loads http://localhost:5000
   ↓
2. index.html loads main.ts
   ↓
3. main.ts initializes:
   - Creates Vue app
   - Installs Pinia
   - Installs Vue Router
   - Installs Quasar
   - Mounts App.vue
   ↓
4. App.vue renders:
   - RouterView component
   - Loads current route
   ↓
5. Router Guard checks:
   - Route requires auth?
   - User has token?
   - Redirect or proceed
   ↓
6. Page Component loads:
   - Initializes stores
   - Sets up event listeners
   - Renders content
   ↓
7. User interacts:
   - Click, type, etc.
   - Triggers component methods
   - Updates store state
   ↓
8. Store state updates:
   - Computed properties notify
   - Components re-render
   - DOM updates
   ↓
9. Browser renders:
   - Shows updated UI
```

---

## Performance Optimization Strategies

### Code Splitting
```typescript
// Lazy load routes
const HomePage = () => import('@/pages/dashboard/HomePage.vue')

// Routes automatically code-split by Vite
```

### Computed Properties
```typescript
// Only recompute when dependency changes
const isDark = computed(() => themeStore.theme === 'dark')
```

### Watch vs Computed
```typescript
// Use computed for derived state
const fullName = computed(() => `${user.firstName} ${user.lastName}`)

// Use watch for side effects
watch(() => authStore.user, (newUser) => {
  console.log('User changed')
})
```

### Component Reusability
```typescript
// Pass data via props
<Sidebar :collapsed="collapsed" @toggle="setCollapsed" />

// Share logic with composables
const useFormValidation = () => { /* ... */ }
```

---

## Error Handling Strategy

```
┌─────────────────────────────────┐
│    Try-Catch Blocks             │
│  (API calls, validations)       │
└──────────┬──────────────────────┘
           ↓
┌─────────────────────────────────┐
│   Quasar Notifications          │
│  ($q.notify for feedback)       │
└──────────┬──────────────────────┘
           ↓
┌─────────────────────────────────┐
│   Component State               │
│  (error, isLoading flags)       │
└──────────┬──────────────────────┘
           ↓
┌─────────────────────────────────┐
│   Browser Console               │
│  (console.error for logging)    │
└─────────────────────────────────┘
```

---

## Security Considerations

1. **Authentication**
   - Token stored in localStorage
   - Checked before accessing protected routes
   - Cleared on logout

2. **Validation**
   - Frontend validation with Zod
   - Form error display
   - Type safety with TypeScript

3. **Routing**
   - Route guards prevent unauthorized access
   - Redirect to login if not authenticated

4. **XSS Prevention**
   - Vue sanitizes templates by default
   - No direct DOM manipulation

---

## Future Enhancements

```
Current State (MVP)
    ↓
+ API Integration
    ↓
+ Form Validation
    ↓
+ Error Handling
    ↓
+ Loading States
    ↓
+ Unit Tests
    ↓
+ E2E Tests
    ↓
+ Performance Optimization
    ↓
+ Accessibility (a11y)
    ↓
Production Ready
```

---

**Architecture Overview Complete** ✅
