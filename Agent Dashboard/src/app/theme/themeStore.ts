import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export type Theme = 'light' | 'dark'

const STORAGE_KEY = 'clazino_theme'

function applyThemeClass(theme: Theme) {
  const root = document.documentElement
  if (theme === 'dark') {
    root.classList.add('dark')
  } else {
    root.classList.remove('dark')
  }
}

export const useThemeStore = defineStore('theme', () => {
  const theme = ref<Theme>(() => {
    const stored = localStorage.getItem(STORAGE_KEY)
    return stored === 'light' ? 'light' : 'dark'
  }())

  const isDark = computed(() => theme.value === 'dark')

  const setTheme = (t: Theme) => {
    theme.value = t
    applyThemeClass(t)
    localStorage.setItem(STORAGE_KEY, t)
  }

  const toggleTheme = () => {
    const newTheme = theme.value === 'dark' ? 'light' : 'dark'
    setTheme(newTheme)
  }

  // Apply initial theme
  applyThemeClass(theme.value)

  return {
    theme,
    isDark,
    setTheme,
    toggleTheme,
  }
})
