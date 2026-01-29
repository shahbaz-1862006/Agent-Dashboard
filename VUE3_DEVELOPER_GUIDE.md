# Vue 3 + Quasar + Pinia Developer Guide

## Project Structure

```
src/
├── main.ts                    # App entry point
├── App.vue                    # Root component
├── styles.css                 # Global styles
├── app/
│   ├── router.ts             # Vue Router configuration
│   ├── auth/
│   │   ├── authStore.ts      # Pinia auth store
│   │   └── useRequireAuth.ts # Auth composable
│   ├── shell/
│   │   ├── DashboardLayout.vue # Main layout
│   │   ├── Sidebar.vue        # Navigation sidebar
│   │   └── nav.ts            # Navigation items
│   └── theme/
│       └── themeStore.ts     # Pinia theme store
├── pages/
│   ├── auth/
│   │   ├── LoginPage.vue
│   │   ├── RegisterPage.vue
│   │   └── InviteEntryPage.vue
│   ├── dashboard/
│   │   ├── HomePage.vue
│   │   ├── WalletPage.vue
│   │   ├── PlayersPage.vue
│   │   └── ... (other pages)
│   └── misc/
│       └── NotFoundPage.vue
├── components/
│   ├── common/
│   │   ├── Logo.vue
│   │   └── ThemeToggle.vue
│   ├── ui/
│   │   └── ... (Quasar component wrappers if needed)
│   └── charts/
│       └── ... (chart components)
├── services/
│   ├── api.ts               # API service
│   ├── client.ts            # HTTP client
│   └── mock.ts              # Mock data
├── types/
│   └── ... (TypeScript types)
└── utils/
    ├── csv.ts
    ├── format.ts
    └── print.ts
```

## Using Pinia Stores

### Auth Store

```ts
import { useAuthStore } from '@/app/auth/authStore'

export default {
  setup() {
    const authStore = useAuthStore()
    
    // Access state
    const user = computed(() => authStore.user)
    const isAuthenticated = computed(() => authStore.isAuthenticated)
    
    // Use actions
    const handleLogin = () => {
      authStore.login('user@email.com')
    }
    
    const handleLogout = () => {
      authStore.logout()
    }
    
    return { user, isAuthenticated, handleLogin, handleLogout }
  }
}
```

### Theme Store

```ts
import { useThemeStore } from '@/app/theme/themeStore'

export default {
  setup() {
    const themeStore = useThemeStore()
    
    // Access state
    const isDark = computed(() => themeStore.isDark)
    
    // Use actions
    const toggleTheme = () => {
      themeStore.toggleTheme()
    }
    
    return { isDark, toggleTheme }
  }
}
```

## Using Quasar Components

### Button
```vue
<q-btn
  label="Click me"
  color="primary"
  @click="handleClick"
  :loading="isLoading"
/>
```

### Input
```vue
<q-input
  v-model="email"
  label="Email"
  type="email"
  outlined
  dense
/>
```

### Card
```vue
<q-card>
  <q-card-section>
    Content goes here
  </q-card-section>
</q-card>
```

### Dialog/Modal
```vue
<q-dialog v-model="showDialog">
  <q-card>
    <q-card-section>
      Dialog content
    </q-card-section>
  </q-card>
</q-dialog>
```

### Select/Dropdown
```vue
<q-select
  v-model="selectedCountry"
  :options="countries"
  label="Country"
/>
```

### Checkbox
```vue
<q-checkbox
  v-model="agreeToTerms"
  label="I agree to terms"
/>
```

### Table
```vue
<q-table
  :rows="rows"
  :columns="columns"
  row-key="id"
/>
```

### Tabs
```vue
<q-tabs v-model="activeTab">
  <q-tab name="tab1" label="Tab 1" />
  <q-tab name="tab2" label="Tab 2" />
</q-tabs>
<q-tab-panels v-model="activeTab">
  <q-tab-panel name="tab1">Content 1</q-tab-panel>
  <q-tab-panel name="tab2">Content 2</q-tab-panel>
</q-tab-panels>
```

### Notifications
```ts
import { useQuasar } from 'quasar'

const $q = useQuasar()

$q.notify({
  type: 'positive', // or 'warning', 'negative', 'info'
  message: 'Success!'
})
```

## Navigation

### Using RouterLink
```vue
<RouterLink to="/dashboard/home">Go to Home</RouterLink>
```

### Using Router Push
```ts
import { useRouter } from 'vue-router'

const router = useRouter()

router.push('/dashboard/home')
router.push({
  path: '/dashboard/players/:playerId',
  params: { playerId: '123' }
})
```

### Getting Route Params
```ts
import { useRoute } from 'vue-router'

const route = useRoute()

const playerId = route.params.playerId
const redirectUrl = route.query.redirect
```

## Form Handling

### Simple Form with v-model
```vue
<template>
  <form @submit.prevent="onSubmit">
    <q-input v-model="form.name" label="Name" />
    <q-input v-model="form.email" label="Email" />
    <q-btn type="submit" label="Submit" />
  </form>
</template>

<script setup lang="ts">
import { reactive } from 'vue'

const form = reactive({
  name: '',
  email: ''
})

const onSubmit = () => {
  console.log(form)
}
</script>
```

### Form with Validation (Zod)
```vue
<script setup lang="ts">
import { reactive } from 'vue'
import { z } from 'zod'

const schema = z.object({
  name: z.string().min(2, 'Name required'),
  email: z.string().email('Invalid email')
})

const form = reactive({
  name: '',
  email: ''
})

const errors = reactive({})

const onSubmit = () => {
  try {
    schema.parse(form)
    console.log('Form is valid!')
  } catch (error) {
    if (error instanceof z.ZodError) {
      error.errors.forEach(err => {
        errors[err.path[0]] = err.message
      })
    }
  }
}
</script>
```

## Responsive Design

The project uses Tailwind CSS classes. Use the following responsive prefixes:
- `sm:` - 640px and up
- `md:` - 768px and up
- `lg:` - 1024px and up
- `xl:` - 1280px and up

Example:
```vue
<div class="flex flex-col md:flex-row gap-4">
  <div class="w-full md:w-1/2">Column 1</div>
  <div class="w-full md:w-1/2">Column 2</div>
</div>
```

## Working with Refs and Reactive

### Using `ref` for primitive values
```ts
import { ref } from 'vue'

const count = ref(0)

// Access/modify
count.value++
```

### Using `reactive` for objects
```ts
import { reactive } from 'vue'

const state = reactive({
  user: null,
  isLoading: false
})

// Access/modify directly
state.user = { name: 'John' }
state.isLoading = true
```

### Using `computed` for derived values
```ts
import { computed } from 'vue'

const count = ref(0)
const doubled = computed(() => count.value * 2)
```

### Using `watch` for side effects
```ts
import { watch } from 'vue'

watch(
  () => authStore.user,
  (newUser) => {
    if (newUser) {
      console.log('User logged in:', newUser.name)
    }
  }
)
```

## API Integration

The project includes `src/services/api.ts` for API calls. Update it with your backend endpoints:

```ts
// src/services/api.ts
import { apiClient } from './client'

export async function loginUser(email: string, password: string) {
  return apiClient.post('/auth/login', { email, password })
}

export async function getPlayers() {
  return apiClient.get('/players')
}
```

Then use it in components:

```ts
import { loginUser, getPlayers } from '@/services/api'

const players = ref([])
const isLoading = ref(false)

const fetchPlayers = async () => {
  isLoading.value = true
  try {
    const response = await getPlayers()
    players.value = response.data
  } finally {
    isLoading.value = false
  }
}
```

## Build and Deploy

### Development
```bash
npm run dev
```

### Production Build
```bash
npm run build
```

### Preview Build
```bash
npm run preview
```

## Environment Variables

Create `.env` and `.env.local` files in the project root:

```env
VITE_API_BASE_URL=https://api.example.com
VITE_APP_NAME=Clazino
```

Access them in the app:
```ts
const apiUrl = import.meta.env.VITE_API_BASE_URL
```

## Troubleshooting

### Issue: Module path not resolving
**Solution**: Ensure `tsconfig.app.json` has the correct path alias:
```json
"paths": {
  "@/*": ["./src/*"]
}
```

### Issue: Quasar components not displaying
**Solution**: Check that Quasar is properly initialized in `main.ts`:
```ts
app.use(Quasar)
```

### Issue: Styles not applying
**Solution**: Ensure CSS files are imported in `main.ts`:
```ts
import '@quasar/extras/roboto-font/roboto-font.css'
import '@quasar/extras/material-icons/material-icons.css'
import 'quasar/dist/quasar.css'
import './styles.css'
```

### Issue: Type errors with Vue components
**Solution**: Ensure `vite-env.d.ts` includes Vue module declaration:
```ts
declare module '*.vue' {
  import type { DefineComponent } from 'vue'
  const component: DefineComponent<{}, {}, any>
  export default component
}
```
