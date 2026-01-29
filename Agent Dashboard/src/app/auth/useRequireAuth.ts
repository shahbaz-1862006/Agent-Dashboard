import { useRouter } from 'vue-router'
import { useAuthStore } from './authStore'

export function useRequireAuth() {
  const authStore = useAuthStore()
  const router = useRouter()

  if (!authStore.isAuthenticated) {
    router.push({
      path: '/login',
      query: { redirect: router.currentRoute.value.fullPath },
    })
    return false
  }

  return true
}
