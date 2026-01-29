# Quick Start Guide - Vue 3 Migration

## Installation

1. **Install dependencies**:
   ```bash
   cd "Agent Dashboard"
   npm install
   ```

2. **Start development server**:
   ```bash
   npm run dev
   ```
   The app will be available at `http://localhost:5000`

3. **Build for production**:
   ```bash
   npm run build
   ```

## What Changed

### Tech Stack
| Before | After |
|--------|-------|
| React 18 | Vue 3 |
| React Router | Vue Router |
| Zustand | Pinia |
| Radix UI + Tailwind | Quasar |
| react-hook-form | Native Vue forms |

### File Extensions
- `.tsx` → `.vue` (components)
- `.tsx` → `.ts` (logic files)

### Key Differences

#### 1. Components Structure
**React:**
```tsx
export function MyComponent() {
  const [count, setCount] = useState(0)
  return <div onClick={() => setCount(count + 1)}>{count}</div>
}
```

**Vue 3:**
```vue
<template>
  <div @click="count++">{{ count }}</div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
const count = ref(0)
</script>
```

#### 2. State Management
**React (Zustand):**
```ts
const useStore = create((set) => ({
  user: null,
  setUser: (user) => set({ user })
}))

// Usage: const user = useStore((s) => s.user)
```

**Vue 3 (Pinia):**
```ts
export const useStore = defineStore('store', () => {
  const user = ref(null)
  return { user }
})

// Usage: const user = computed(() => store.user)
```

#### 3. Navigation
**React:**
```tsx
import { useNavigate } from 'react-router-dom'
const navigate = useNavigate()
navigate('/dashboard')
```

**Vue 3:**
```ts
import { useRouter } from 'vue-router'
const router = useRouter()
router.push('/dashboard')
```

#### 4. Router Params
**React:**
```tsx
const { playerId } = useParams()
```

**Vue 3:**
```ts
const route = useRoute()
const playerId = route.params.playerId
```

## File Structure Changes

### Auth Flow
- `authStore.ts` - Pinia store (replaces Zustand)
- `useRequireAuth.ts` - Composable (replaces `RequireAuth` component)
- No more `AuthProvider.tsx` (Pinia handles state globally)

### Theme Management
- `themeStore.ts` - Pinia store (replaces Context API)
- No more `ThemeProvider.tsx` (Pinia handles state globally)

### Pages
All pages converted to `.vue` components with:
- Quasar components instead of custom UI
- Vue Router links instead of React Router
- Pinia stores instead of Zustand

## Common Patterns

### Accessing Store State
```ts
import { useAuthStore } from '@/app/auth/authStore'

const store = useAuthStore()
const user = computed(() => store.user) // or just store.user
```

### Navigating
```ts
import { useRouter } from 'vue-router'

const router = useRouter()
router.push('/dashboard/home')
router.push({ path: '/player/:id', params: { id: '123' } })
```

### Forms
```vue
<q-input v-model="form.email" label="Email" />

<script setup lang="ts">
const form = reactive({ email: '' })
</script>
```

### Notifications
```ts
const $q = useQuasar()
$q.notify({ type: 'positive', message: 'Success!' })
```

### Conditionals
```vue
<div v-if="isLoading">Loading...</div>
<div v-else-if="hasError">Error</div>
<div v-else>Content</div>
```

### Loops
```vue
<div v-for="item in items" :key="item.id">
  {{ item.name }}
</div>
```

## Debugging

### Vue DevTools
Install the Vue DevTools browser extension to inspect:
- Component hierarchy
- Props and state
- Events
- Pinia stores

### Console Logging
```ts
console.log('User:', authStore.user)
console.log('Theme:', themeStore.theme)
```

## Migration Checklist

- ✅ Dependencies updated
- ✅ Entry point converted
- ✅ Router configured
- ✅ Auth store created (Pinia)
- ✅ Theme store created (Pinia)
- ✅ Components converted to Vue
- ✅ All pages created (placeholders ready for content)
- ✅ Navigation working
- ✅ Auth flow working

## Next Steps

1. **Implement page content** - Replace placeholder pages with actual UI
2. **Connect to API** - Update `src/services/api.ts` with real endpoints
3. **Add charts** - Implement visualization components
4. **Write tests** - Add unit and integration tests
5. **Optimize** - Enable lazy loading, code splitting, etc.

## Useful Links

- [Vue 3 Docs](https://vuejs.org/)
- [Vue Router Docs](https://router.vuejs.org/)
- [Pinia Docs](https://pinia.vuejs.org/)
- [Quasar Docs](https://quasar.dev/)
- [TypeScript + Vue](https://vuejs.org/guide/typescript/overview.html)

## Support

If you encounter issues:
1. Check the Vue DevTools
2. Review browser console for errors
3. Verify file paths use `@/` alias
4. Ensure all imports are from `.vue` files
5. Check that Pinia stores are properly initialized

## Version Info

- Vue: 3.4.x
- Vue Router: 4.3.x
- Pinia: 2.1.x
- Quasar: 2.14.x
- TypeScript: 5.5.x
- Vite: 5.4.x
