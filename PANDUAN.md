# 🚀 Panduan Setup Noya Frontend

## Yang Sudah Dibuat

### ✅ Struktur API Service (`src/services/api.js`)
File ini berisi semua endpoint API yang terhubung dengan backend:
- **Auth API**: Login OAuth, Refresh Token, Logout
- **Profile API**: Get/Update Profile, Upload Picture, dll
- **Blog API**: CRUD Blog, Get by Slug, Get by User, dll
- **Music API**: Search Music, Get Track Details
- **Like API**: Toggle Like, Check Status, Get Users

### ✅ Auth Store (`src/stores/auth.js`)
Store Pinia untuk manage authentication:
- Login dengan Google OAuth
- Auto-refresh token
- Logout
- Fetch & update user profile
- Check authentication status

### ✅ Router dengan Guards (`src/router/index.js`)
Router dengan protection:
- Route yang butuh login (profile, create blog)
- Route untuk guest only (login page)
- Auto redirect ke login kalau belum auth
- Auto redirect ke home kalau sudah auth dan akses login

### ✅ Komponen & Views
- **LoginView**: Halaman login dengan Google OAuth
- **ProfileView**: Halaman profile user (protected)
- **AppNavigation**: Navigation bar dengan user menu
- **HomeView**: Landing page
- **BlogsView, BlogCreateView, BlogDetailView**: Placeholder untuk blog features

### ✅ Utils & Helpers
- **helpers.js**: Utility functions (format date, truncate text, dll)
- **constants.js**: Konstanta aplikasi (API URL, error messages, dll)

## 🔧 Cara Setup

### 1. Install Dependencies
```bash
cd client
npm install
```

### 2. Setup Environment Variables
```bash
# Copy file .env.example ke .env
cp .env.example .env
```

Edit file `.env` dan isi:
```env
VITE_API_URL=http://localhost:3000/api
VITE_GOOGLE_CLIENT_ID=your_google_client_id
```

### 3. Dapatkan Google Client ID

1. Buka [Google Cloud Console](https://console.cloud.google.com/)
2. Buat project baru atau pilih yang ada
3. Enable **Google+ API**
4. Pergi ke **Credentials** → **Create Credentials** → **OAuth Client ID**
5. Pilih **Web application**
6. Tambahkan **Authorized JavaScript origins**:
   - `http://localhost:5173`
   - `http://localhost:3000`
7. Tambahkan **Authorized redirect URIs**:
   - `http://localhost:5173`
8. Copy **Client ID** dan paste ke `.env`

### 4. Jalankan Backend
Pastikan backend sudah jalan di `http://localhost:3000`:
```bash
cd ../server
npm run dev
```

### 5. Jalankan Frontend
```bash
cd ../client
npm run dev
```

Buka browser: `http://localhost:5173`

## 📖 Cara Menggunakan API Service

### Import API
```javascript
import api from '@/services/api'
// atau
import { authAPI, profileAPI, blogAPI, musicAPI, likeAPI } from '@/services/api'
```

### Contoh Penggunaan

#### 1. Login (sudah auto di LoginView)
```javascript
const result = await authStore.loginWithGoogle(credential)
if (result.success) {
  console.log('Login berhasil!')
}
```

#### 2. Get User Profile
```javascript
import { profileAPI } from '@/services/api'

const response = await profileAPI.getMyProfile()
console.log(response.data.data) // user data
```

#### 3. Update Profile
```javascript
const formData = new FormData()
formData.append('name', 'John Doe')
formData.append('bio', 'Hello World')
formData.append('picture', file) // optional

const response = await profileAPI.patchMyProfile(formData)
```

#### 4. Get All Blogs
```javascript
import { blogAPI } from '@/services/api'

const response = await blogAPI.getAllBlogs({
  page: 1,
  limit: 10,
  visibility: 'public'
})

console.log(response.data.data) // array of blogs
```

#### 5. Create Blog
```javascript
const formData = new FormData()
formData.append('title', 'My First Blog')
formData.append('content', 'Blog content here...')
formData.append('coverImage', file) // optional
formData.append('visibility', 'public')

const response = await blogAPI.createBlog(formData)
```

#### 6. Toggle Like
```javascript
import { likeAPI } from '@/services/api'

const response = await likeAPI.toggleLike(blogId)
console.log(response.data.data.isLiked) // true or false
```

#### 7. Search Music
```javascript
import { musicAPI } from '@/services/api'

const response = await musicAPI.searchMusic({
  q: 'indie rock',
  limit: 10
})

console.log(response.data.data.tracks) // array of tracks
```

## 🎯 Flow Authentication

1. User klik "Sign in with Google"
2. Google popup muncul
3. User login dengan Google
4. Google return credential token
5. Frontend kirim token ke backend `/api/auth/oauth/callback`
6. Backend validasi dan return:
   - `accessToken` (disimpan di localStorage)
   - `refreshToken` (disimpan di HTTP-only cookie)
   - `user` data
7. Frontend save token dan user ke store
8. User diredirect ke halaman yang dituju

### Auto Refresh Token
- Kalau request dapat 401 (Unauthorized)
- Axios interceptor otomatis coba refresh token
- Kalau refresh sukses, retry request dengan token baru
- Kalau refresh gagal, user di-logout otomatis

## 🛡️ Protected Routes

Route yang butuh login:
```javascript
{
  path: '/profile',
  meta: { requiresAuth: true }
}
```

Route untuk guest only:
```javascript
{
  path: '/login',
  meta: { requiresGuest: true }
}
```

## 📝 Next Steps - Yang Perlu Diimplementasikan

### 1. Blog Listing (BlogsView.vue)
- Fetch blogs dari API
- Tampilkan dalam card/grid
- Implementasi pagination
- Tambahkan filter & search

### 2. Blog Create (BlogCreateView.vue)
- Form untuk title, content, cover image
- Rich text editor (optional: install Quill/TipTap)
- Upload image preview
- Validation
- Submit ke API

### 3. Blog Detail (BlogDetailView.vue)
- Fetch blog by slug
- Tampilkan content
- Like/Unlike button
- Share button
- Comments (jika ada)

### 4. Profile Edit
- Form untuk edit profile
- Upload profile picture
- Update bio, location, website
- Change privacy settings

### 5. My Blogs Page
- List blog yang dibuat user
- Edit/Delete buttons
- Draft/Published status

## 🎨 Styling

Aplikasi menggunakan **Tailwind CSS** yang sudah ter-install dan ter-konfigurasi.

Contoh penggunaan:
```vue
<div class="bg-white rounded-lg shadow-md p-6">
  <h1 class="text-2xl font-bold text-gray-900">Title</h1>
  <p class="text-gray-600 mt-2">Description</p>
</div>
```

## 🐛 Troubleshooting

### Login Tidak Berfungsi
1. Cek backend jalan di port 3000
2. Cek Google Client ID benar
3. Cek browser console untuk error
4. Cek authorized origins di Google Console

### CORS Error
1. Backend harus allow origin `http://localhost:5173`
2. Cek CORS config di backend
3. Pastikan `withCredentials: true` ada di axios

### Token Error
1. Clear localStorage: `localStorage.clear()`
2. Clear cookies di browser
3. Login ulang

## 📚 Dokumentasi Lengkap

Lihat `SETUP.md` untuk dokumentasi dalam Bahasa Inggris yang lebih lengkap.

## 💡 Tips

1. **Error Handling**: Semua API call sudah include try-catch di store
2. **Loading State**: Gunakan `authStore.isLoading` untuk loading indicator
3. **Error Display**: Gunakan `authStore.error` untuk tampilkan error
4. **Auth Check**: Gunakan `authStore.isAuthenticated` untuk cek login status
5. **User Data**: Akses user data via `authStore.user`

## 🤝 Contoh Implementasi di Component

```vue
<script setup>
import { ref, onMounted } from 'vue'
import { blogAPI } from '@/services/api'
import { useAuthStore } from '@/stores/auth'

const authStore = useAuthStore()
const blogs = ref([])
const loading = ref(false)
const error = ref(null)

const fetchBlogs = async () => {
  try {
    loading.value = true
    error.value = null
    
    const response = await blogAPI.getAllBlogs({ page: 1, limit: 10 })
    blogs.value = response.data.data
  } catch (err) {
    error.value = err.response?.data?.message || 'Failed to fetch blogs'
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  fetchBlogs()
})
</script>

<template>
  <div>
    <div v-if="loading">Loading...</div>
    <div v-else-if="error">Error: {{ error }}</div>
    <div v-else>
      <div v-for="blog in blogs" :key="blog._id">
        {{ blog.title }}
      </div>
    </div>
  </div>
</template>
```

Semoga membantu! 🎉
