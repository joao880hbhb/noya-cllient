import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { authAPI, profileAPI } from '@/services/api'

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

  // Computed
  const isAuthenticated = computed(() => !!accessToken.value && !!user.value)
  const userDisplayName = computed(() => user.value?.name || user.value?.email || 'User')

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

  // Login with Google OAuth
  const loginWithGoogle = async (credential) => {
    try {
      isLoading.value = true
      clearError()

      const response = await authAPI.oauthCallback(credential)
      const { accessToken: token, user: userData } = response.data.data

      setToken(token)
      setUser(userData)

      return { success: true, data: response.data }
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Login failed'
      setError(errorMessage)
      return { success: false, error: errorMessage }
    } finally {
      isLoading.value = false
    }
  }

  // Fetch user profile (retry otomatis saat 429)
  const fetchUserProfile = async (retries = 0) => {
    try {
      isLoading.value = true
      clearError()

      const response = await profileAPI.getMyProfile()
      setUser(response.data?.data ?? response.data)

      return { success: true, data: response.data }
    } catch (err) {
      if (isRateLimited(err) && retries < MAX_RETRIES) {
        await sleep(RETRY_DELAY)
        return fetchUserProfile(retries + 1)
      }
      const errorMessage = err.response?.data?.message || 'Failed to fetch profile'
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
      // Hanya logout jika ini benar-benar kegagalan auth (bukan rate limited)
      if (!isRateLimited(err)) {
        await logout()
      }
      return { success: false, rateLimited: isRateLimited(err) }
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
    if (accessToken.value) {
      // If we have a token, try to fetch user profile
      const result = await fetchUserProfile()
      if (!result.success) {
        // Jika kena rate limit, jangan refresh/logout — coba lagi nanti
        if (result.rateLimited) {
          setTimeout(initializeAuth, REINIT_DELAY)
          return
        }
        // Bukan 429 → token mungkin kedaluwarsa, coba refresh
        const refreshResult = await refreshToken()
        if (refreshResult.success) {
          // If refresh succeeds, try to fetch profile again
          await fetchUserProfile()
        } else if (refreshResult.rateLimited) {
          // Refresh kena 429 — coba lagi nanti, tanpa logout
          setTimeout(initializeAuth, REINIT_DELAY)
        }
      }
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
      const errorMessage = err.response?.data?.message || 'Failed to update profile'
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
    loginWithGoogle,
    logout,
    fetchUserProfile,
    refreshToken,
    initializeAuth,
    updateProfile,
    clearError,
  }
})
