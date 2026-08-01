<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-md w-full space-y-8">
      <div>
        <h2 class="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Sign in to your account
        </h2>
        <p class="mt-2 text-center text-sm text-gray-600">
          Welcome to Noya
        </p>
      </div>

      <!-- Error message -->
      <div v-if="authStore.error" class="rounded-md bg-red-50 p-4">
        <div class="flex">
          <div class="flex-shrink-0">
            <svg class="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
              <path
                fill-rule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                clip-rule="evenodd"
              />
            </svg>
          </div>
          <div class="ml-3">
            <p class="text-sm font-medium text-red-800">
              {{ authStore.error }}
            </p>
          </div>
          <div class="ml-auto pl-3">
            <button
              @click="authStore.clearError"
              class="inline-flex bg-red-50 rounded-md p-1.5 text-red-500 hover:bg-red-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-red-50 focus:ring-red-600"
            >
              <span class="sr-only">Dismiss</span>
              <svg class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path
                  fill-rule="evenodd"
                  d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                  clip-rule="evenodd"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>

      <!-- Google Sign In Button -->
      <div class="mt-8">
        <div class="mt-6">
          <div id="g_id_onload" :data-client_id="googleClientId" data-callback="handleGoogleCallback" data-auto_prompt="false"></div>

          <div
            class="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium"
          >
            <div
              id="g_id_signin"
              class="g_id_signin"
              data-type="standard"
              data-shape="rectangular"
              data-theme="outline"
              data-text="signin_with"
              data-size="large"
              data-logo_alignment="left"
              data-width="300"
            ></div>
          </div>

          <!-- Loading state -->
          <div v-if="authStore.isLoading" class="mt-4 text-center">
            <div class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
            <p class="mt-2 text-sm text-gray-600">Signing in...</p>
          </div>
        </div>
      </div>

      <!-- Additional info -->
      <div class="text-center text-sm text-gray-600">
        <p>By signing in, you agree to our</p>
        <p>
          <a href="#" class="font-medium text-indigo-600 hover:text-indigo-500">Terms of Service</a>
          and
          <a href="#" class="font-medium text-indigo-600 hover:text-indigo-500">Privacy Policy</a>
        </p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const router = useRouter()
const authStore = useAuthStore()

// Google Client ID dari environment variable
const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID

// Load Google Sign-In script
onMounted(() => {
  // Check if already authenticated
  if (authStore.isAuthenticated) {
    router.push('/')
    return
  }

  // Load Google Sign-In script
  const script = document.createElement('script')
  script.src = 'https://accounts.google.com/gsi/client'
  script.async = true
  script.defer = true
  document.head.appendChild(script)

  // Setup global callback function
  window.handleGoogleCallback = async (response) => {
    const credential = response.credential

    const result = await authStore.loginWithGoogle(credential)

    if (result.success) {
      // Redirect ke homepage atau dashboard
      const redirectTo = router.currentRoute.value.query.redirect || '/'
      router.push(redirectTo)
    }
  }
})
</script>

<style scoped>
/* Additional styles if needed */
</style>
