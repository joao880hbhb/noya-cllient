/**
 * Application constants
 */

// API Configuration
export const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api'
export const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID

// Token Configuration
export const ACCESS_TOKEN_KEY = 'accessToken'
export const TOKEN_REFRESH_THRESHOLD = 5 * 60 * 1000 // 5 minutes before expiry

// Pagination
export const DEFAULT_PAGE_SIZE = 10
export const MAX_PAGE_SIZE = 50

// File Upload
export const MAX_FILE_SIZE = 10 * 1024 * 1024 // 10MB
export const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp']

// Blog
export const BLOG_TITLE_MIN_LENGTH = 3
export const BLOG_TITLE_MAX_LENGTH = 200
export const BLOG_CONTENT_MIN_LENGTH = 10
export const BLOG_EXCERPT_LENGTH = 200

// Profile
export const BIO_MAX_LENGTH = 500
export const NAME_MAX_LENGTH = 100

// HTTP Status Codes
export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  INTERNAL_SERVER_ERROR: 500,
}

// Route Names
export const ROUTES = {
  HOME: 'home',
  LOGIN: 'login',
  PROFILE: 'profile',
  BLOGS: 'blogs',
  BLOG_DETAIL: 'blog-detail',
  BLOG_CREATE: 'blog-create',
  ABOUT: 'about',
}

// Error Messages
export const ERROR_MESSAGES = {
  NETWORK_ERROR: 'Network error. Please check your connection.',
  UNAUTHORIZED: 'You need to login to access this feature.',
  FORBIDDEN: 'You do not have permission to perform this action.',
  NOT_FOUND: 'The requested resource was not found.',
  SERVER_ERROR: 'Server error. Please try again later.',
  VALIDATION_ERROR: 'Please check your input and try again.',
  FILE_TOO_LARGE: `File size must be less than ${MAX_FILE_SIZE / 1024 / 1024}MB`,
  INVALID_FILE_TYPE: 'Invalid file type. Please upload an image file.',
}

// Success Messages
export const SUCCESS_MESSAGES = {
  LOGIN_SUCCESS: 'Login successful!',
  LOGOUT_SUCCESS: 'Logout successful!',
  PROFILE_UPDATED: 'Profile updated successfully!',
  BLOG_CREATED: 'Blog post created successfully!',
  BLOG_UPDATED: 'Blog post updated successfully!',
  BLOG_DELETED: 'Blog post deleted successfully!',
  LIKE_ADDED: 'Added to favorites!',
  LIKE_REMOVED: 'Removed from favorites!',
}

// Local Storage Keys
export const STORAGE_KEYS = {
  ACCESS_TOKEN: 'accessToken',
  USER_PREFERENCES: 'userPreferences',
  THEME: 'theme',
}

// Date Formats
export const DATE_FORMATS = {
  FULL: 'MMMM DD, YYYY',
  SHORT: 'MMM DD, YYYY',
  TIME: 'HH:mm',
  DATETIME: 'MMMM DD, YYYY HH:mm',
}

// Regex Patterns
export const PATTERNS = {
  EMAIL: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  URL: /^https?:\/\/.+/,
  SLUG: /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
}

// Blog Visibility
export const BLOG_VISIBILITY = {
  PUBLIC: 'public',
  PRIVATE: 'private',
}

// Privacy Settings
export const PRIVACY = {
  PUBLIC: false,
  PRIVATE: true,
}

export default {
  API_URL,
  GOOGLE_CLIENT_ID,
  ACCESS_TOKEN_KEY,
  TOKEN_REFRESH_THRESHOLD,
  DEFAULT_PAGE_SIZE,
  MAX_PAGE_SIZE,
  MAX_FILE_SIZE,
  ALLOWED_IMAGE_TYPES,
  BLOG_TITLE_MIN_LENGTH,
  BLOG_TITLE_MAX_LENGTH,
  BLOG_CONTENT_MIN_LENGTH,
  BLOG_EXCERPT_LENGTH,
  BIO_MAX_LENGTH,
  NAME_MAX_LENGTH,
  HTTP_STATUS,
  ROUTES,
  ERROR_MESSAGES,
  SUCCESS_MESSAGES,
  STORAGE_KEYS,
  DATE_FORMATS,
  PATTERNS,
  BLOG_VISIBILITY,
  PRIVACY,
}
