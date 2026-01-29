<template>
  <div class="min-h-screen bg-background text-foreground flex items-center justify-center p-5">
    <div class="text-center">
      <div class="text-6xl font-bold text-muted-foreground">404</div>
      <h1 class="mt-4 text-2xl font-bold">Page Not Found</h1>
      <p class="mt-2 text-muted-foreground">Sorry, the page you're looking for doesn't exist.</p>
      <q-btn
        to="/dashboard/home"
        color="primary"
        label="Go to Dashboard"
        class="mt-6"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
</script>
