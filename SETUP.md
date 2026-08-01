# Noya Frontend Setup Guide

## 📋 Prerequisites

- Node.js (v22.18.0 or >=24.12.0)
- npm
- Backend server running on http://localhost:3000

## 🚀 Installation

1. Install dependencies:
```bash
npm install
```

2. Configure environment variables:
```bash
# Copy .env.example to .env
cp .env.example .env
```

3. Edit `.env` file and add your Google OAuth Client ID:
```env
VITE_API_URL=http://localhost:3000/api
VITE_GOOGLE_CLIENT_ID=your_actual_google_client_id_here
```

## 🔑 Getting Google OAuth Client ID

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing one
3. Enable Google+ API
4. Go to "Credentials" → "Create Credentials" → "OAuth Client ID"
5. Choose "Web application"
6. Add authorized JavaScript origins:
   - `http://localhost:5173` (Vite dev server)
   - `http://localhost:3000` (if needed)
7. Add authorized redirect URIs:
   - `http://localhost:5173`
   - Your production URL
8. Copy the Client ID and paste it in your `.env` file

## 🏃‍♂️ Running the Application

### Development Mode
```bash
npm run dev
```
The app will be available at `http://localhost:5173`

### Production Build
```bash
npm run build
npm run preview
```

## 📁 Project Structure

```
client/
├── src/
│   ├── services/
│   │   └── api.js              # API service with all backend endpoints
│   ├── stores/
│   │   ├── auth.js             # Authentication store (Pinia)
│   │   └── counter.js          # Example counter store
│   ├── views/
│   │   ├── HomeView.vue        # Home page
│   │   ├── LoginView.vue       # Login page with Google OAuth
│   │   ├── ProfileView.vue     # User profile page (protected)
│   │   ├── BlogsView.vue       # Blog listing page
│   │   ├── BlogCreateView.vue  # Create blog page (protected)
│   │   └── BlogDetailView.vue  # Blog detail page
│   ├── components/
│   │   └── AppNavigation.vue   # Main navigation component
│   ├── router/
│   │   └── index.js            # Vue Router with auth guards
│   ├── App.vue                 # Root component
│   └── main.js                 # App entry point
├── .env                        # Environment variables (not in git)
├── .env.example               # Environment variables template
└── package.json
```

## 🔐 Authentication Flow

1. User clicks "Sign in with Google" button
2. Google OAuth popup appears
3. User authenticates with Google
4. Google returns credential token
5. Frontend sends token to backend `/api/auth/oauth/callback`
6. Backend validates token and returns access token + refresh token
7. Access token stored in localStorage
8. Refresh token stored in HTTP-only cookie
9. User is redirected to home page or intended route

### Token Management

- **Access Token**: Stored in localStorage, expires in 15 minutes
- **Refresh Token**: Stored in HTTP-only cookie, expires in 7 days
- Auto-refresh: When access token expires, automatically refreshes using refresh token
- Auto-logout: If refresh fails, user is logged out automatically

## 🛡️ Protected Routes

Routes marked with `meta: { requiresAuth: true }` require authentication:
- `/profile` - User profile page
- `/blogs/create` - Create new blog post
- Any other routes that require login

Routes marked with `meta: { requiresGuest: true }` redirect authenticated users:
- `/login` - Login page

## 📡 API Services

All API endpoints are organized in `src/services/api.js`:

### Auth API
- `authAPI.oauthCallback(credential)` - Login with Google
- `authAPI.refreshToken()` - Refresh access token
- `authAPI.logout()` - Logout user

### Profile API
- `profileAPI.getMyProfile()` - Get current user profile
- `profileAPI.updateMyProfile(data)` - Update profile (full)
- `profileAPI.patchMyProfile(data)` - Update profile (partial)
- `profileAPI.uploadProfilePicture(file)` - Upload profile picture
- `profileAPI.getUserProfile(userId)` - Get user by ID
- `profileAPI.getUserByPublicId(publicId)` - Get user by public ID
- `profileAPI.deleteMyAccount()` - Delete account

### Blog API
- `blogAPI.createBlog(data)` - Create new blog
- `blogAPI.getAllBlogs(params)` - Get all blogs (with pagination)
- `blogAPI.getMyBlogs(params)` - Get my blogs
- `blogAPI.getBlogBySlug(slug)` - Get blog by slug
- `blogAPI.getBlogsByUserId(userId, params)` - Get blogs by user
- `blogAPI.getBlogsByPublicId(publicId, params)` - Get blogs by public ID
- `blogAPI.updateBlog(id, data)` - Update blog
- `blogAPI.deleteBlog(id)` - Delete blog

### Music API
- `musicAPI.searchMusic(params)` - Search music
- `musicAPI.getTrackDetails(trackId)` - Get track details

### Like API
- `likeAPI.toggleLike(blogId)` - Toggle like on blog
- `likeAPI.checkLikeStatus(blogId)` - Check if user liked blog
- `likeAPI.getLikeUsers(blogId, params)` - Get users who liked blog

## 🎨 UI Components

The app uses Tailwind CSS for styling. Key components:

- `AppNavigation.vue` - Navigation bar with user menu
- Protected views require authentication
- Loading states handled by auth store
- Error messages displayed automatically

## 🔧 Troubleshooting

### Login not working
1. Check if backend is running on port 3000
2. Verify Google Client ID is correct in `.env`
3. Check browser console for errors
4. Verify authorized origins in Google Cloud Console

### CORS Errors
1. Backend must allow `http://localhost:5173` as origin
2. Check backend CORS configuration
3. Ensure `withCredentials: true` is set in axios

### Token Issues
1. Clear localStorage: `localStorage.clear()`
2. Clear cookies in browser
3. Try logging in again

## 📝 Next Steps

1. Implement blog listing with pagination
2. Implement blog creation form
3. Implement blog detail page with like functionality
4. Add profile edit functionality
5. Add image upload for blogs
6. Add music integration for blogs
7. Implement search functionality

## 🤝 Contributing

When adding new features:
1. Add API endpoints to `src/services/api.js`
2. Create corresponding views in `src/views/`
3. Add routes to `src/router/index.js`
4. Update auth store if needed in `src/stores/auth.js`

## 📄 License

This project is part of the Noya application.
