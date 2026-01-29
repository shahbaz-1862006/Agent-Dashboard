<template>
  <div class="min-h-screen bg-background text-foreground">
    <div class="flex">
      <Sidebar
        :userName="user?.name"
        :clanName="user?.clanName"
        :collapsed="collapsed"
        :mobileOpen="mobileOpen"
        @toggle-mobile="mobileOpen = $event"
        @logout="handleLogout"
      />

      <main class="flex-1">
        <header class="sticky top-0 z-40 border-b border-border bg-background/80 backdrop-blur">
          <div class="mx-auto max-w-[1400px] px-5 py-4 flex items-center justify-between gap-4">
            <div class="flex items-center gap-2">
              <!-- Mobile menu -->
              <div class="md:hidden">
                <q-btn
                  flat
                  round
                  icon="menu"
                  size="md"
                  @click="mobileOpen = true"
                  aria-label="Open sidebar"
                  title="Open sidebar"
                />
              </div>
              <!-- Desktop sidebar toggle -->
              <div class="hidden md:block">
                <q-btn
                  flat
                  round
                  icon="menu"
                  size="md"
                  @click="collapsed = !collapsed"
                  :title="collapsed ? 'Expand sidebar' : 'Collapse sidebar'"
                  aria-label="Toggle sidebar"
                />
              </div>

              <div>
                <div class="text-xs text-muted-foreground">Agent</div>
                <div class="text-sm font-semibold">{{ user?.clanName ?? 'Clan' }}</div>
              </div>
            </div>

            <div class="flex items-center gap-1">
              <ThemeToggle />
              <q-btn
                size="sm"
                flat
                @click="$router.push('/dashboard/invites')"
              >
                Invite Player
              </q-btn>
              <q-btn
                size="sm"
                flat
                @click="$router.push('/dashboard/wallet')"
              >
                Deposit USDT
              </q-btn>
            </div>
          </div>
        </header>

        <div class="mx-auto max-w-[1400px] px-5 py-6">
          <RouterView />
        </div>
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../auth/authStore'
import Sidebar from './Sidebar.vue'
import ThemeToggle from '@/components/common/ThemeToggle.vue'
import { RouterView } from 'vue-router'

const authStore = useAuthStore()
const router = useRouter()

const user = computed(() => authStore.user)

const STORAGE_KEY = 'clazino_sidebar_collapsed'
const collapsed = ref<boolean>(() => {
  const v = localStorage.getItem(STORAGE_KEY)
  return v === '1'
}())

const mobileOpen = ref(false)

watch(collapsed, (value) => {
  localStorage.setItem(STORAGE_KEY, value ? '1' : '0')
})

const handleLogout = () => {
  authStore.logout()
  router.push('/login')
}
</script>

