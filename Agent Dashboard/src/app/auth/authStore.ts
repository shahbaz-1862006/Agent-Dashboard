import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export interface AuthUser {
  id: string
  name: string
  agentId: string
  clanName: string
}

const LS_KEY = 'clazino_agent_auth_v1'

function load(): { user: AuthUser | null; token: string | null } {
  try {
    const raw = localStorage.getItem(LS_KEY)
    if (!raw) return { user: null, token: null }
    const parsed = JSON.parse(raw) as { user: AuthUser; token: string }
    return { user: parsed.user ?? null, token: parsed.token ?? null }
  } catch {
    return { user: null, token: null }
  }
}

function save(user: AuthUser | null, token: string | null) {
  try {
    if (!user || !token) {
      localStorage.removeItem(LS_KEY)
      return
    }
    localStorage.setItem(LS_KEY, JSON.stringify({ user, token }))
  } catch {
    // ignore
  }
}

export const useAuthStore = defineStore('auth', () => {
  const initial = load()
  const user = ref<AuthUser | null>(initial.user)
  const token = ref<string | null>(initial.token)

  const isAuthenticated = computed(() => !!token.value)

  const login = (email: string) => {
    const newUser: AuthUser = {
      id: 'agent_user_01',
      name: email.split('@')[0]?.replaceAll('.', ' ') || 'Agent',
      agentId: 'agent_001',
      clanName: 'Clazino Clan Alpha',
    }
    const newToken = 'mock_token_' + Math.random().toString(36).slice(2)
    save(newUser, newToken)
    user.value = newUser
    token.value = newToken
  }

  const logout = () => {
    save(null, null)
    user.value = null
    token.value = null
  }

  return {
    user,
    token,
    isAuthenticated,
    login,
    logout,
  }
})
