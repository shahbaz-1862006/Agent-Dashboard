<template>
  <div class="min-h-screen bg-background text-foreground flex items-center justify-center p-5">
    <div class="fixed right-4 top-4">
      <ThemeToggle />
    </div>

    <q-card class="w-full max-w-md">
      <q-card-section>
        <div class="flex flex-col items-center text-center">
          <Logo class="justify-center" />
          <div class="mt-4">
            <div class="text-lg font-semibold">Sign in</div>
            <p class="mt-1 text-sm text-muted-foreground">Access is invite-only. Use your agent credentials.</p>
          </div>
        </div>
      </q-card-section>

      <q-card-section>
        <form class="space-y-3" @submit.prevent="onSubmit">
          <div>
            <label class="text-xs text-muted-foreground">Email</label>
            <q-input
              v-model="form.email"
              placeholder="agent@company.com"
              :error="!!errors.email"
              dense
            />
            <p v-if="errors.email" class="mt-1 text-xs text-destructive">{{ errors.email }}</p>
          </div>
          <div>
            <label class="text-xs text-muted-foreground">Password</label>
            <q-input
              v-model="form.password"
              type="password"
              placeholder="••••••••"
              :error="!!errors.password"
              dense
            />
            <p v-if="errors.password" class="mt-1 text-xs text-destructive">{{ errors.password }}</p>
          </div>

          <q-btn
            type="submit"
            color="primary"
            class="w-full"
            :loading="isLoading"
            label="Sign in"
          />

          <div class="flex items-center justify-between text-xs text-muted-foreground">
            <RouterLink to="/invite" class="hover:underline">Enter invite code</RouterLink>
            <RouterLink to="/register" class="hover:underline">Create an account</RouterLink>
          </div>
        </form>
      </q-card-section>
    </q-card>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { useRouter, useRoute, RouterLink } from 'vue-router'
import { z } from 'zod'
import { useAuthStore } from '@/app/auth/authStore'
import ThemeToggle from '@/components/common/ThemeToggle.vue'
import Logo from '@/components/common/Logo.vue'
import { useQuasar } from 'quasar'

const schema = z.object({
  email: z.string().email('Enter a valid email'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
})

type FormData = z.infer<typeof schema>

const LS_CREDS = 'clazino_agent_credentials'

const authStore = useAuthStore()
const router = useRouter()
const route = useRoute()
const $q = useQuasar()

const form = reactive<FormData>({
  email: '',
  password: '',
})

const errors = reactive<Record<string, string>>({})
const isLoading = ref(false)

const onSubmit = async () => {
  errors.email = ''
  errors.password = ''

  // Validate
  try {
    schema.parse(form)
  } catch (error) {
    if (error instanceof z.ZodError) {
      error.errors.forEach((err) => {
        const path = err.path[0] as string
        errors[path] = err.message
      })
    }
    return
  }

  isLoading.value = true

  try {
    let stored: { email: string; password: string } | null = null
    try {
      const raw = localStorage.getItem(LS_CREDS)
      if (raw) stored = JSON.parse(raw)
    } catch {
      stored = null
    }

    if (
      !stored ||
      stored.email !== form.email.toLowerCase() ||
      stored.password !== form.password
    ) {
      $q.notify({
        type: 'warning',
        message: 'Email or password is incorrect.',
      })
      return
    }

    authStore.login(form.email)
    $q.notify({
      type: 'positive',
      message: 'Welcome back.',
    })

    const to = (route.query.redirect as string) ?? '/dashboard/home'
    router.push(to)
  } finally {
    isLoading.value = false
  }
}
</script>

