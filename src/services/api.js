import axios from 'axios'

// Base URL dari environment variable atau default ke localhost
const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api'

// Create axios instance
const apiClient = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // Include cookies in requests
})

// Request interceptor untuk menambahkan token
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  },
)

// Response interceptor untuk handle refresh token
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config

    // Jika error 401 dan belum retry
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true

      try {
        // Coba refresh token
        const response = await axios.post(`${BASE_URL}/auth/refresh`, {}, { withCredentials: true })

        const { accessToken } = response.data.data
        localStorage.setItem('accessToken', accessToken)

        // Retry request dengan token baru
        originalRequest.headers.Authorization = `Bearer ${accessToken}`
        return apiClient(originalRequest)
      } catch (refreshError) {
        // Jika refresh gagal, clear token dan redirect ke login
        localStorage.removeItem('accessToken')
        window.location.href = '/login'
        return Promise.reject(refreshError)
      }
    }

    return Promise.reject(error)
  },
)

// ============================================
// AUTH API
// ============================================
export const authAPI = {
  // OAuth callback (Google Login)
  oauthCallback: (credential) => {
    return apiClient.post('/auth/oauth/callback', {
      provider: 'google',
      idToken: credential,
      rememberMe: true,
    })
  },

  // Refresh token
  refreshToken: () => {
    return apiClient.post('/auth/refresh')
  },

  // Logout
  logout: () => {
    return apiClient.post('/auth/logout')
  },
}

// ============================================
// PROFILE API
// ============================================
export const profileAPI = {
  // Get my profile
  getMyProfile: () => {
    return apiClient.get('/profile/me')
  },

  // Update my profile (PUT - full update)
  updateMyProfile: (data) => {
    return apiClient.put('/profile/me', data, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
  },

  // Patch my profile (PATCH - partial update)
  patchMyProfile: (data) => {
    return apiClient.patch('/profile/me', data, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
  },

  // Delete my account
  deleteMyAccount: () => {
    return apiClient.delete('/profile/me')
  },

  // Upload profile picture
  uploadProfilePicture: (file) => {
    const formData = new FormData()
    formData.append('picture', file)
    return apiClient.post('/profile/picture', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
  },

  // Get user profile by ID
  getUserProfile: (userId) => {
    return apiClient.get(`/profile/${userId}`)
  },

  // Get user by public ID
  getUserByPublicId: (publicId) => {
    return apiClient.get(`/profile/public/${publicId}`)
  },

  // Search public users by name or public ID
  searchUsers: (query) => {
    return apiClient.get('/profile/search', { params: { q: query } })
  },
}

// ============================================
// BLOG API
// ============================================
export const blogAPI = {
  // Create blog
  createBlog: (data) => {
    return apiClient.post('/blogs', data, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
  },

  // Get all blogs (public)
  getAllBlogs: (params = {}) => {
    return apiClient.get('/blogs', { params })
  },

  // Get my blogs
  getMyBlogs: (params = {}) => {
    return apiClient.get('/blogs/my/posts', { params })
  },

  // Get blog by slug
  getBlogBySlug: (slug) => {
    return apiClient.get(`/blogs/${slug}`)
  },

  // Get blogs by user ID
  getBlogsByUserId: (userId, params = {}) => {
    return apiClient.get(`/blogs/user/${userId}`, { params })
  },

  // Get blogs by public ID
  getBlogsByPublicId: (publicId, params = {}) => {
    return apiClient.get(`/blogs/author/${publicId}`, { params })
  },

  // Update blog
  updateBlog: (id, data) => {
    return apiClient.put(`/blogs/${id}`, data, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
  },

  // Delete blog
  deleteBlog: (id) => {
    return apiClient.delete(`/blogs/${id}`)
  },
}

// ============================================
// MUSIC API
// ============================================
export const musicAPI = {
  // Search music
  searchMusic: (params) => {
    return apiClient.get('/music/search', { params })
  },

  // Get track details
  getTrackDetails: (trackId) => {
    return apiClient.get(`/music/track/${trackId}`)
  },
}

// ============================================
// LIKE API
// ============================================
export const likeAPI = {
  // Toggle like
  toggleLike: (blogId) => {
    return apiClient.post(`/likes/${blogId}`)
  },

  // Check like status
  checkLikeStatus: (blogId) => {
    return apiClient.get(`/likes/${blogId}/check`)
  },

  // Get users who liked
  getLikeUsers: (blogId, params = {}) => {
    return apiClient.get(`/likes/${blogId}/users`, { params })
  },
}

// ============================================
// NOTIFICATION API
// ============================================
export const notificationAPI = {
  // Get my notifications
  getNotifications: (params = {}) => {
    return apiClient.get('/notifications', { params })
  },

  // Get unread count
  getUnreadCount: () => {
    return apiClient.get('/notifications/unread-count')
  },

  // Mark one notification as read
  markAsRead: (id) => {
    return apiClient.patch(`/notifications/${id}/read`)
  },

  // Mark all notifications as read
  markAllAsRead: () => {
    return apiClient.patch('/notifications/read-all')
  },
}

// Export default untuk kemudahan import
export default {
  auth: authAPI,
  profile: profileAPI,
  blog: blogAPI,
  music: musicAPI,
  like: likeAPI,
  notification: notificationAPI,
}
