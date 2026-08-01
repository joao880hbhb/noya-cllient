# 📡 API Reference - Noya Frontend

## Base Configuration

```javascript
import api from '@/services/api'
// atau import individual
import { authAPI, profileAPI, blogAPI, musicAPI, likeAPI } from '@/services/api'
```

## 🔐 Auth API

### Login with Google OAuth
```javascript
await authAPI.oauthCallback(credential)
```
**Parameters:**
- `credential` (string): Google credential token dari OAuth callback

**Response:**
```json
{
  "success": true,
  "data": {
    "accessToken": "jwt_token",
    "user": { ...user_data }
  }
}
```

### Refresh Token
```javascript
await authAPI.refreshToken()
```

### Logout
```javascript
await authAPI.logout()
```

---

## 👤 Profile API

### Get My Profile
```javascript
await profileAPI.getMyProfile()
```

### Update My Profile (Full)
```javascript
const formData = new FormData()
formData.append('name', 'John Doe')
formData.append('bio', 'My bio')
formData.append('location', 'Jakarta')
formData.append('website', 'https://example.com')
formData.append('picture', fileObject) // optional

await profileAPI.updateMyProfile(formData)
```

### Patch My Profile (Partial)
```javascript
const formData = new FormData()
formData.append('bio', 'Updated bio')

await profileAPI.patchMyProfile(formData)
```

### Upload Profile Picture
```javascript
await profileAPI.uploadProfilePicture(fileObject)
```

### Get User Profile by ID
```javascript
await profileAPI.getUserProfile(userId)
```

### Get User by Public ID
```javascript
await profileAPI.getUserByPublicId(publicId)
```

### Delete My Account
```javascript
await profileAPI.deleteMyAccount()
```

---

## 📝 Blog API

### Create Blog
```javascript
const formData = new FormData()
formData.append('title', 'My Blog Title')
formData.append('content', 'Blog content...')
formData.append('excerpt', 'Short description') // optional
formData.append('coverImage', fileObject) // optional
formData.append('visibility', 'public') // 'public' or 'private'
formData.append('tags', JSON.stringify(['tag1', 'tag2'])) // optional

await blogAPI.createBlog(formData)
```

### Get All Blogs
```javascript
await blogAPI.getAllBlogs({
  page: 1,
  limit: 10,
  visibility: 'public', // optional
  search: 'keyword', // optional
  tags: 'tag1,tag2' // optional
})
```

**Response:**
```json
{
  "success": true,
  "data": [...blogs],
  "pagination": {
    "currentPage": 1,
    "totalPages": 5,
    "totalBlogs": 50,
    "hasNextPage": true,
    "hasPrevPage": false
  }
}
```

### Get My Blogs
```javascript
await blogAPI.getMyBlogs({
  page: 1,
  limit: 10
})
```

### Get Blog by Slug
```javascript
await blogAPI.getBlogBySlug('my-blog-slug')
```

### Get Blogs by User ID
```javascript
await blogAPI.getBlogsByUserId(userId, {
  page: 1,
  limit: 10
})
```

### Get Blogs by Public ID
```javascript
await blogAPI.getBlogsByPublicId(publicId, {
  page: 1,
  limit: 10
})
```

### Update Blog
```javascript
const formData = new FormData()
formData.append('title', 'Updated Title')
formData.append('content', 'Updated content...')

await blogAPI.updateBlog(blogId, formData)
```

### Delete Blog
```javascript
await blogAPI.deleteBlog(blogId)
```

---

## 🎵 Music API

### Search Music
```javascript
await musicAPI.searchMusic({
  q: 'indie rock', // search query
  type: 'track', // optional: 'track', 'album', 'artist'
  limit: 10 // optional, default 10
})
```

**Response:**
```json
{
  "success": true,
  "data": {
    "tracks": [
      {
        "id": "track_id",
        "name": "Song Name",
        "artists": [...],
        "album": {...},
        "preview_url": "url",
        "external_url": "spotify_url"
      }
    ]
  }
}
```

### Get Track Details
```javascript
await musicAPI.getTrackDetails(trackId)
```

---

## ❤️ Like API

### Toggle Like
```javascript
await likeAPI.toggleLike(blogId)
```

**Response:**
```json
{
  "success": true,
  "data": {
    "isLiked": true, // or false
    "totalLikes": 42
  }
}
```

### Check Like Status
```javascript
await likeAPI.checkLikeStatus(blogId)
```

**Response:**
```json
{
  "success": true,
  "data": {
    "isLiked": true
  }
}
```

### Get Users Who Liked
```javascript
await likeAPI.getLikeUsers(blogId, {
  page: 1,
  limit: 10
})
```

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "_id": "user_id",
      "name": "User Name",
      "picture": "url"
    }
  ],
  "pagination": {...}
}
```

---

## 🎯 Auth Store Usage

```javascript
import { useAuthStore } from '@/stores/auth'

const authStore = useAuthStore()

// State
authStore.user // current user object
authStore.accessToken // JWT token
authStore.isLoading // loading state
authStore.error // error message

// Computed
authStore.isAuthenticated // boolean
authStore.userDisplayName // user name or email

// Actions
await authStore.loginWithGoogle(credential)
await authStore.logout()
await authStore.fetchUserProfile()
await authStore.updateProfile(data)
await authStore.initializeAuth()
authStore.clearError()
```

---

## 🔄 Response Format

Semua API response mengikuti format:

### Success Response
```json
{
  "success": true,
  "message": "Success message",
  "data": { ...data }
}
```

### Error Response
```json
{
  "success": false,
  "message": "Error message",
  "errors": [...validation_errors] // optional
}
```

---

## 📦 Pagination Parameters

Parameter yang tersedia untuk pagination:

```javascript
{
  page: 1,        // current page (default: 1)
  limit: 10,      // items per page (default: 10, max: 50)
  sort: 'createdAt', // sort field
  order: 'desc'   // 'asc' or 'desc'
}
```

---

## 🚨 Error Handling

```javascript
try {
  const response = await blogAPI.getAllBlogs()
  // handle success
} catch (error) {
  // error.response.status - HTTP status code
  // error.response.data.message - error message
  // error.response.data.errors - validation errors (if any)
  
  console.error('Error:', error.response?.data?.message)
}
```

---

## 🔑 Headers

API client otomatis menambahkan:
- `Authorization: Bearer {token}` - untuk authenticated requests
- `Content-Type: application/json` - untuk JSON requests
- `Content-Type: multipart/form-data` - untuk file uploads

---

## 🍪 Cookies

Refresh token disimpan di HTTP-only cookie oleh backend:
- Cookie name: `refreshToken`
- Domain: sama dengan API URL
- Secure: true (production)
- HttpOnly: true
- SameSite: Strict
- Max-Age: 7 days

---

## ⚡ Auto Refresh

Access token otomatis di-refresh ketika:
1. Request mendapat response 401 (Unauthorized)
2. Axios interceptor memanggil `/api/auth/refresh`
3. Jika refresh berhasil, request di-retry dengan token baru
4. Jika refresh gagal, user di-logout otomatis

---

## 📝 Example: Complete Blog Flow

```javascript
import { ref } from 'vue'
import { blogAPI, likeAPI } from '@/services/api'
import { useAuthStore } from '@/stores/auth'

const authStore = useAuthStore()
const blogs = ref([])
const loading = ref(false)

// Fetch blogs
const fetchBlogs = async () => {
  try {
    loading.value = true
    const response = await blogAPI.getAllBlogs({ page: 1, limit: 10 })
    blogs.value = response.data.data
  } catch (error) {
    console.error('Error:', error.response?.data?.message)
  } finally {
    loading.value = false
  }
}

// Create blog
const createBlog = async (blogData) => {
  if (!authStore.isAuthenticated) {
    alert('Please login first')
    return
  }
  
  const formData = new FormData()
  formData.append('title', blogData.title)
  formData.append('content', blogData.content)
  if (blogData.coverImage) {
    formData.append('coverImage', blogData.coverImage)
  }
  
  try {
    await blogAPI.createBlog(formData)
    alert('Blog created successfully!')
    await fetchBlogs() // refresh list
  } catch (error) {
    alert('Error: ' + error.response?.data?.message)
  }
}

// Toggle like
const toggleLike = async (blogId) => {
  if (!authStore.isAuthenticated) {
    alert('Please login first')
    return
  }
  
  try {
    const response = await likeAPI.toggleLike(blogId)
    console.log('Liked:', response.data.data.isLiked)
    // Update UI accordingly
  } catch (error) {
    console.error('Error:', error.response?.data?.message)
  }
}
```

---

## 🎨 Helper Functions

```javascript
import { 
  formatDate,
  formatRelativeTime,
  truncateText,
  getInitials 
} from '@/utils/helpers'

// Format date
formatDate(blog.createdAt) // "January 15, 2024"

// Relative time
formatRelativeTime(blog.createdAt) // "2 hours ago"

// Truncate text
truncateText(blog.content, 100) // First 100 chars + "..."

// Get initials
getInitials("John Doe") // "JD"
```

---

Untuk dokumentasi lebih lengkap, lihat:
- `SETUP.md` - Setup guide (English)
- `PANDUAN.md` - Panduan setup (Indonesian)
