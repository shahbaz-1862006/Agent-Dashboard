<template>
  <q-btn
    type="button"
    flat
    round
    :icon="themeStore.isDark ? 'light_mode' : 'dark_mode'"
    :size="size === 'sm' ? 'sm' : 'md'"
    @click="themeStore.toggleTheme"
    aria-label="Toggle theme"
    :title="themeStore.isDark ? 'Switch to light' : 'Switch to dark'"
  />
</template>

<script setup lang="ts">
import { useThemeStore } from '@/app/theme/themeStore'

interface Props {
  size?: 'sm' | 'md'
}

withDefaults(defineProps<Props>(), {
  size: 'sm',
})

const themeStore = useThemeStore()
</script>

  );
}
