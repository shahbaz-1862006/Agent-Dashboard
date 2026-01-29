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
            <div class="text-lg font-semibold">Enter Invite Code</div>
            <p class="mt-1 text-sm text-muted-foreground">You need an invitation to get started</p>
          </div>
        </div>
      </q-card-section>

      <q-card-section>
        <form class="space-y-4" @submit.prevent="onSubmit">
          <div>
            <label class="text-xs text-muted-foreground">Invite Code</label>
            <q-input
              v-model="inviteCode"
              placeholder="XXXX-XXXX-XXXX"
              uppercase
              maxlength="14"
              dense
            />
          </div>

          <q-btn
            type="submit"
            color="primary"
            class="w-full"
            :loading="isLoading"
            label="Verify Invite"
          />

          <div class="flex items-center justify-between text-xs text-muted-foreground">
            <RouterLink to="/login" class="hover:underline">Have an account?</RouterLink>
          </div>
        </form>
      </q-card-section>
    </q-card>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter, RouterLink } from 'vue-router'
import { useQuasar } from 'quasar'
import ThemeToggle from '@/components/common/ThemeToggle.vue'
import Logo from '@/components/common/Logo.vue'

const router = useRouter()
const $q = useQuasar()

const inviteCode = ref('')
const isLoading = ref(false)

const onSubmit = async () => {
  isLoading.value = true
  try {
    // Mock verification
    localStorage.setItem('clazino_invite', JSON.stringify({ inviteVerified: true, inviteMeta: { code: inviteCode.value } }))
    $q.notify({
      type: 'positive',
      message: 'Invite verified successfully',
    })
    router.push('/register')
  } finally {
    isLoading.value = false
  }
}
</script>
