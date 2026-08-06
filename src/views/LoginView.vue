<template>
  <div class="min-h-screen flex items-stretch bg-black">
    <!-- Section 1: Tagline (desktop only) -->
    <div class="hidden sm:flex sm:w-1/2 bg-black items-center p-12 relative overflow-hidden">
      <!-- subtle ambient glow -->
      <div class="absolute -top-24 -left-24 h-96 w-96 rounded-full bg-purple-600/20 blur-3xl"></div>
      <div class="absolute bottom-0 right-0 h-72 w-72 rounded-full bg-purple-800/10 blur-3xl"></div>

      <div class="text-white max-w-xl relative">
        <div class="flex items-center gap-3 mb-6">
          <img
            src="@/assets/logonoya.png"
            alt="Noya"
            class="h-12 w-12 rounded-full object-cover ring-1 ring-white/10"
          />
          <span class="font-display italic text-3xl font-bold">Noya</span>
        </div>
        <h1 class="font-display italic text-4xl sm:text-5xl leading-tight">Share Your Stories</h1>
        <p class="mt-4 text-[15px] text-purple-100/80 max-w-md leading-relaxed">
          Bergabunglah dengan komunitas Noya, tempat cerita-cerita terhangat dan terbaru dari
          seluruh dunia hadir.
        </p>
      </div>
    </div>

    <!-- Section 2: Login Card -->
    <div class="flex w-full sm:w-1/2 items-center justify-center p-6 sm:p-10">
      <div class="w-full max-w-md bg-white rounded-3xl shadow-2xl shadow-black/40 p-8 sm:p-10">
        <!-- Brand mark (mobile only, hidden on desktop since left panel already shows it) -->
        <div class="flex sm:hidden items-center justify-center gap-2 mb-8">
          <img src="@/assets/logonoya.png" alt="Noya" class="h-9 w-9 rounded-full object-cover" />
          <span class="font-display italic text-2xl font-bold text-gray-900">Noya</span>
        </div>

        <div class="text-center">
          <h2 class="text-2xl sm:text-3xl font-extrabold text-gray-900">Sign in to your account</h2>
          <p class="mt-2 text-sm text-gray-500">Welcome back to Noya</p>
        </div>

        <!-- Error message -->
        <transition
          enter-active-class="transition ease-out duration-200"
          enter-from-class="opacity-0 -translate-y-1"
          enter-to-class="opacity-100 translate-y-0"
        >
          <div v-if="authStore.error" class="mt-6 rounded-xl bg-red-50 p-4">
            <div class="flex items-start">
              <svg
                class="h-5 w-5 text-red-400 flex-shrink-0"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fill-rule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                  clip-rule="evenodd"
                />
              </svg>
              <p class="ml-3 text-sm font-medium text-red-800">
                {{ authStore.error }}
              </p>
              <button
                @click="authStore.clearError"
                class="ml-auto flex-shrink-0 rounded-md p-1 text-red-400 hover:bg-red-100 hover:text-red-600 focus:outline-none focus:ring-2 focus:ring-red-500"
              >
                <span class="sr-only">Dismiss</span>
                <svg class="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                  <path
                    fill-rule="evenodd"
                    d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                    clip-rule="evenodd"
                  />
                </svg>
              </button>
            </div>
          </div>
        </transition>

        <!-- Google Sign In -->
        <div class="mt-8">
          <div
            id="g_id_onload"
            :data-client_id="googleClientId"
            data-callback="handleGoogleCallback"
            data-auto_prompt="false"
          ></div>

          <div class="relative">
            <!-- Skeleton placeholder so layout doesn't jump while GSI script loads -->
            <div v-if="!authStore.isLoading" class="flex justify-center">
              <div
                id="g_id_signin"
                class="g_id_signin"
                data-type="standard"
                data-shape="pill"
                data-theme="filled_black"
                data-text="signin_with"
                data-size="large"
                data-logo_alignment="left"
                data-width="300"
              ></div>
            </div>

            <!-- Loading state -->
            <div v-else class="flex flex-col items-center justify-center py-3">
              <div
                class="h-6 w-6 animate-spin rounded-full border-2 border-gray-200 border-t-purple-600"
              ></div>
              <p class="mt-3 text-sm text-gray-500">Signing in...</p>
            </div>
          </div>
        </div>

        <!-- Remember Me Toggle -->
        <div class="mt-6 flex items-center justify-center gap-3">
          <button
            @click="toggleRememberMe"
            :class="[
              'relative inline-flex h-5 w-9 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2',
              authStore.rememberMe ? 'bg-purple-600' : 'bg-gray-300',
            ]"
            role="switch"
            :aria-checked="authStore.rememberMe"
          >
            <span
              :class="[
                'pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out',
                authStore.rememberMe ? 'translate-x-4' : 'translate-x-0',
              ]"
            />
          </button>
          <span class="text-sm text-gray-600">Remember me</span>
        </div>

        <!-- Additional info -->
        <p class="mt-8 text-center text-xs leading-relaxed text-gray-400">
          By signing in, you agree to our
          <a href="#" class="font-medium text-purple-600 hover:text-purple-700">Terms of Service</a>
          and
          <a href="#" class="font-medium text-purple-600 hover:text-purple-700">Privacy Policy</a>
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

const toggleRememberMe = () => {
  authStore.setRememberMe(!authStore.rememberMe)
}

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
