<template>
  <div :class="['flex items-center gap-2', className]">
    <img
      src="@/assets/clazino-logo.png"
      alt="Clazino"
      :class="['h-8 w-auto select-none', compact && 'h-7']"
      draggable="false"
    />
    <span v-if="!compact" class="text-sm font-semibold tracking-wide">Clazino</span>
  </div>
</template>

<script setup lang="ts">
interface Props {
  className?: string
  compact?: boolean
}

defineProps<Props>()
</script>

