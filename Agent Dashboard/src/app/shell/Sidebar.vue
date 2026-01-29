<template>
  <div>
    <!-- Mobile sidebar -->
    <q-dialog v-model="mobileOpenLocal" position="left" @before-hide="$emit('toggle-mobile', false)">
      <div class="w-80 max-w-[92vw] bg-card">
        <div class="flex h-full flex-col">
          <div class="px-5 py-5 border-b border-border">
            <button
              type="button"
              @click="
                mobileOpenLocal = false
                $router.push('/dashboard/home')
              "
              class="text-left"
            >
              <Logo />
              <div class="mt-1 text-xs text-muted-foreground">Agent Dashboard</div>
            </button>
          </div>

          <nav class="px-3 py-3">
            <RouterLink
              v-for="item in navItems"
              :key="item.to"
              :to="item.to"
              @click="mobileOpenLocal = false"
              class="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
              active-class="bg-muted text-foreground border border-border"
            >
              <q-icon :name="item.icon" size="sm" />
              <span>{{ item.label }}</span>
            </RouterLink>
          </nav>

          <div class="mt-auto px-5 py-4 border-t border-border">
            <div class="text-xs text-muted-foreground">Signed in as</div>
            <div class="mt-1 text-sm font-medium">{{ userName ?? 'Agent' }}</div>
            <div class="mt-0.5 text-xs text-muted-foreground">{{ clanName ?? 'Clan' }}</div>
            <div class="mt-3 flex gap-2">
              <q-btn
                size="sm"
                flat
                @click="
                  mobileOpenLocal = false
                  $router.push('/dashboard/settings')
                "
              >
                Settings
              </q-btn>
              <q-btn
                size="sm"
                flat
                @click="
                  mobileOpenLocal = false
                  $emit('logout')
                "
              >
                Logout
              </q-btn>
            </div>
          </div>
        </div>
      </div>
    </q-dialog>

    <!-- Desktop sidebar -->
    <aside
      class="hidden md:flex h-screen flex-col border-r border-border bg-card/60"
      :class="[collapsed ? 'w-16 group/sidebar hover:w-72 transition-[width] duration-200' : 'w-72']"
    >
      <div :class="['px-4 py-5', collapsed && 'px-3']">
        <button
          type="button"
          @click="$router.push('/dashboard/home')"
          :class="['w-full', collapsed && 'flex justify-center']"
        >
          <Logo :compact="collapsed" />
        </button>
        <div :class="['mt-1 text-xs text-muted-foreground', collapsed && 'hidden group-hover/sidebar:block']">
          Agent Dashboard
        </div>
      </div>

      <nav :class="['px-2 pb-4', collapsed && 'px-2']">
        <RouterLink
          v-for="item in navItems"
          :key="item.to"
          :to="item.to"
          class="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
          :class="[collapsed && 'justify-center px-0']"
          active-class="bg-muted text-foreground border border-border"
        >
          <q-icon :name="item.icon" size="sm" />
          <span :class="['whitespace-nowrap', collapsed && 'hidden group-hover/sidebar:inline']">
            {{ item.label }}
          </span>
        </RouterLink>
      </nav>

      <div class="mt-auto px-4 py-4 border-t border-border">
        <div :class="['text-xs text-muted-foreground', collapsed && 'hidden group-hover/sidebar:block']">
          Signed in as
        </div>
        <div :class="['mt-1 text-sm font-medium', collapsed && 'hidden group-hover/sidebar:block']">
          {{ userName ?? 'Agent' }}
        </div>
        <div :class="['mt-0.5 text-xs text-muted-foreground', collapsed && 'hidden group-hover/sidebar:block']">
          {{ clanName ?? 'Clan' }}
        </div>
        <div :class="['mt-3 flex gap-2', collapsed && 'hidden group-hover/sidebar:flex']">
          <q-btn size="sm" flat @click="$router.push('/dashboard/settings')">
            Settings
          </q-btn>
          <q-btn size="sm" flat @click="$emit('logout')">
            Logout
          </q-btn>
        </div>
      </div>
    </aside>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { RouterLink } from 'vue-router'
import { navItems } from './nav'
import Logo from '@/components/common/Logo.vue'

interface Props {
  userName?: string
  clanName?: string
  collapsed: boolean
  mobileOpen: boolean
}

defineProps<Props>()

const emit = defineEmits<{
  'toggle-mobile': [value: boolean]
  logout: []
}>()

const mobileOpenLocal = computed({
  get: () => mobileOpen,
  set: (value) => emit('toggle-mobile', value),
})
</script>

