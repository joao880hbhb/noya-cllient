import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { authAPI, profileAPI, setSyncTokenCallback } from '@/services/api'
import i18n from '@/i18n'
import router from '@/router'

const { t } = i18n.global

const RETRY_DELAY = 3000 // ms antar retry saat rate limited
const MAX_RETRIES = 2
const REINIT_DELAY = 10000 // ms sebelum coba lagi saat startup kena 429

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms))
const isRateLimited = (err) => err?.response?.status === 429

export const useAuthStore = defineStore('auth', () => {
  // State
  const user = ref(null)
  const accessToken = ref(localStorage.getItem('accessToken') || null)
  const isLoading = ref(false)
  const error = ref(null)
  const rememberMe = ref(localStorage.getItem('rememberMe') !== 'false')

  // Computed
  const isAuthenticated = computed(() => !!accessToken.value && !!user.value)
  const userDisplayName = computed(() => user.value?.name || user.value?.email || t('common.user'))

  // Actions
  const setToken = (token) => {
    accessToken.value = token
    if (token) {
      localStorage.setItem('accessToken', token)
    } else {
      localStorage.removeItem('accessToken')
    }
  }

  const setUser = (userData) => {
    user.value = userData
  }

  const setError = (errorMessage) => {
    error.value = errorMessage
  }

  const clearError = () => {
    error.value = null
  }

  const setRememberMe = (value) => {
    rememberMe.value = value
    localStorage.setItem('rememberMe', value ? 'true' : 'false')
  }

  // Daftarkan setToken sebagai callback ke interceptor axios
  // agar saat token direfresh oleh interceptor, store ikut terupdate
  setSyncTokenCallback((token) => {
    accessToken.value = token
    if (!token) user.value = null
  })

  // Login with Google OAuth
  const loginWithGoogle = async (credential) => {
    try {
      isLoading.value = true
      clearError()

      const response = await authAPI.oauthCallback(credential, rememberMe.value)
      const { accessToken: token, user: userData } = response.data.data

      setToken(token)
      setUser(userData)

      return { success: true, data: response.data }
    } catch (err) {
      const errorMessage = err.response?.data?.message || t('auth.loginFailed')
      setError(errorMessage)
      return { success: false, error: errorMessage }
    } finally {
      isLoading.value = false
    }
  }

  // Fetch user profile (retry otomatis saat 429)
  // axiosConfig: optional config tambahan, misalnya { _skipRefresh: true }
  const fetchUserProfile = async (retries = 0, axiosConfig = {}) => {
    try {
      isLoading.value = true
      clearError()

      const response = await profileAPI.getMyProfile(axiosConfig)
      setUser(response.data?.data ?? response.data)

      return { success: true, data: response.data }
    } catch (err) {
      if (isRateLimited(err) && retries < MAX_RETRIES) {
        await sleep(RETRY_DELAY)
        return fetchUserProfile(retries + 1, axiosConfig)
      }
      const errorMessage = err.response?.data?.message || t('auth.fetchProfileFailed')
      setError(errorMessage)
      return { success: false, error: errorMessage, rateLimited: isRateLimited(err) }
    } finally {
      isLoading.value = false
    }
  }

  // Refresh token (retry otomatis saat 429, tanpa logout)
  const refreshToken = async (retries = 0) => {
    try {
      const response = await authAPI.refreshToken()
      const { accessToken: token } = response.data.data

      setToken(token)
      return { success: true }
    } catch (err) {
      if (isRateLimited(err) && retries < MAX_RETRIES) {
        await sleep(RETRY_DELAY)
        return refreshToken(retries + 1)
      }
      // Kembalikan status saja — biarkan pemanggil (initializeAuth atau interceptor)
      // yang memutuskan apakah perlu logout/redirect
      return { success: false, rateLimited: isRateLimited(err), status: err?.response?.status }
    }
  }

  // Logout
  const logout = async () => {
    try {
      isLoading.value = true
      clearError()

      // Call logout API
      await authAPI.logout()
    } catch (err) {
      console.error('Logout error:', err)
    } finally {
      // Clear local state regardless of API call result
      setToken(null)
      setUser(null)
      isLoading.value = false
    }
  }

  // Initialize auth state (call on app mount)
  const initializeAuth = async () => {
    if (!accessToken.value) return

    // Tandai request ini dengan _skipRefresh supaya interceptor axios
    // tidak ikut campur — kita urus sendiri logika refresh di sini
    const skipConfig = { _skipRefresh: true }

    // Coba fetch profil dengan access token yang ada
    const result = await fetchUserProfile(0, skipConfig)

    if (result.success) return // sudah ok

    if (result.rateLimited) {
      // Kena rate limit — coba lagi nanti, jangan logout
      setTimeout(initializeAuth, REINIT_DELAY)
      return
    }

    // Fetch gagal (kemungkinan access token expired) → coba refresh
    const refreshResult = await refreshToken()

    if (refreshResult.success) {
      // Refresh berhasil, coba fetch profil lagi
      const retryResult = await fetchUserProfile(0, skipConfig)
      if (retryResult.success) return
    }

    if (refreshResult.rateLimited) {
      // Refresh kena rate limit — coba lagi nanti
      setTimeout(initializeAuth, REINIT_DELAY)
      return
    }

    // Refresh gagal total (401) → sesi benar-benar habis, redirect ke login
    setToken(null)
    setUser(null)
    // Hanya redirect jika bukan sudah di halaman login
    if (router.currentRoute.value.path !== '/login') {
      router.push('/login')
    }
  }

  // Update profile
  const updateProfile = async (data) => {
    try {
      isLoading.value = true
      clearError()

      const response = await profileAPI.patchMyProfile(data)
      setUser(response.data?.data ?? response.data?.user)

      return { success: true, data: response.data }
    } catch (err) {
      const errorMessage = err.response?.data?.message || t('auth.updateProfileFailed')
      setError(errorMessage)
      return { success: false, error: errorMessage }
    } finally {
      isLoading.value = false
    }
  }

  return {
    // State
    user,
    accessToken,
    isLoading,
    error,

    // Computed
    isAuthenticated,
    userDisplayName,

    // Actions
    rememberMe,
    setRememberMe,
    loginWithGoogle,
    logout,
    fetchUserProfile,
    refreshToken,
    initializeAuth,
    updateProfile,
    clearError,
  }
})
