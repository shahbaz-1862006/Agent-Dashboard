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
            <div class="text-lg font-semibold">Create Account</div>
            <p class="mt-1 text-sm text-muted-foreground">Register as a new agent</p>
          </div>
        </div>
      </q-card-section>

      <q-card-section>
        <form class="space-y-3" @submit.prevent="onSubmit">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label class="text-xs text-muted-foreground">First Name</label>
              <q-input v-model="form.firstName" placeholder="John" dense />
            </div>
            <div>
              <label class="text-xs text-muted-foreground">Last Name</label>
              <q-input v-model="form.lastName" placeholder="Doe" dense />
            </div>
          </div>

          <div>
            <label class="text-xs text-muted-foreground">Email</label>
            <q-input v-model="form.email" placeholder="agent@company.com" dense />
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label class="text-xs text-muted-foreground">Date of Birth</label>
              <q-input v-model="form.dob" type="date" dense />
            </div>
            <div>
              <label class="text-xs text-muted-foreground">Country</label>
              <q-select v-model="form.country" :options="countries" dense />
            </div>
          </div>

          <div>
            <label class="text-xs text-muted-foreground">Password</label>
            <q-input v-model="form.password" type="password" placeholder="••••••••" dense />
          </div>

          <div>
            <label class="text-xs text-muted-foreground">Confirm Password</label>
            <q-input v-model="form.confirmPassword" type="password" placeholder="••••••••" dense />
          </div>

          <div class="flex items-center gap-2">
            <q-checkbox v-model="form.acceptTerms" />
            <label class="text-sm">I accept the terms and conditions</label>
          </div>

          <q-btn
            type="submit"
            color="primary"
            class="w-full"
            :loading="isLoading"
            label="Create Account"
          />

          <div class="flex items-center justify-between text-xs text-muted-foreground">
            <RouterLink to="/login" class="hover:underline">Already have account?</RouterLink>
          </div>
        </form>
      </q-card-section>
    </q-card>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { useRouter, RouterLink } from 'vue-router'
import { useQuasar } from 'quasar'
import ThemeToggle from '@/components/common/ThemeToggle.vue'
import Logo from '@/components/common/Logo.vue'

const router = useRouter()
const $q = useQuasar()

const countries = ['Pakistan', 'United Arab Emirates', 'United Kingdom', 'United States', 'India', 'Australia', 'Germany', 'France', 'Italy', 'Spain']

const form = reactive({
  firstName: '',
  lastName: '',
  email: '',
  dob: '',
  country: 'Pakistan',
  password: '',
  confirmPassword: '',
  acceptTerms: false,
})

const isLoading = ref(false)

const onSubmit = async () => {
  isLoading.value = true
  try {
    $q.notify({
      type: 'positive',
      message: 'Account created successfully',
    })
    router.push('/login')
  } finally {
    isLoading.value = false
  }
}
</script>
