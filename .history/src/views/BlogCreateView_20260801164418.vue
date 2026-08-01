<template>
  <div class="min-h-screen bg-gray-50 py-8">
    <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="mb-8">
        <h1 class="text-3xl font-bold text-gray-900">Create New Blog Post</h1>
        <p class="mt-2 text-gray-600">Share your thoughts with the community</p>
      </div>

      <!-- Success message -->
      <div v-if="successMessage" class="mb-6 rounded-md bg-green-50 border border-green-200 p-4">
        <p class="text-sm font-medium text-green-800">{{ successMessage }}</p>
      </div>

      <!-- Error message -->
      <div v-if="formError" class="mb-6 rounded-md bg-red-50 border border-red-200 p-4">
        <p class="text-sm font-medium text-red-800">{{ formError }}</p>
      </div>

      <form @submit.prevent="handleSubmit" class="space-y-6">
        <!-- Title & status -->
        <div class="bg-white shadow rounded-lg p-6">
          <div class="flex items-start justify-between gap-4">
            <div class="flex-1">
              <label for="title" class="block text-sm font-medium text-gray-700">
                Title <span class="text-red-500">*</span>
              </label>
              <input
                id="title"
                v-model="title"
                type="text"
                :maxlength="BLOG_TITLE_MAX_LENGTH"
                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                placeholder="Give your blog a great title"
              />
            </div>
            <div>
              <label for="status" class="block text-sm font-medium text-gray-700">Status</label>
              <select
                id="status"
                v-model="status"
                class="mt-1 block w-40 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              >
                <option value="draft">Draft</option>
                <option value="private">Private</option>
                <option value="published">Published</option>
              </select>
            </div>
          </div>
        </div>

        <!-- Content -->
        <div class="bg-white shadow rounded-lg p-6">
          <label class="block text-sm font-medium text-gray-700 mb-2">
            Content <span class="text-red-500">*</span>
          </label>
          <BlogEditor v-model="content" />
          <p class="mt-1 text-xs text-gray-500 text-right">{{ contentLength }} characters</p>
        </div>

        <!-- Excerpt -->
        <div class="bg-white shadow rounded-lg p-6">
          <label for="excerpt" class="block text-sm font-medium text-gray-700">Excerpt</label>
          <textarea
            id="excerpt"
            v-model="excerpt"
            rows="2"
            :maxlength="BLOG_EXCERPT_LENGTH"
            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            placeholder="Short description shown in blog lists (optional)"
          ></textarea>
          <p class="mt-1 text-xs text-gray-500 text-right">{{ excerpt.length }} / {{ BLOG_EXCERPT_LENGTH }}</p>
        </div>

        <!-- Cover image -->
        <div class="bg-white shadow rounded-lg p-6">
          <h2 class="text-lg font-semibold text-gray-900 mb-4">Cover Image</h2>
          <div v-if="coverPreview" class="mb-4">
            <img :src="coverPreview" alt="Cover preview" class="w-full max-h-64 object-cover rounded-lg" />
          </div>
          <div class="flex items-center space-x-3">
            <input id="coverImage" type="file" accept="image/*" class="sr-only" @change="handleCoverChange" />
            <label
              for="coverImage"
              class="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 cursor-pointer"
            >
              {{ coverPreview ? 'Change image' : 'Upload cover image' }}
            </label>
            <button
              v-if="coverPreview"
              type="button"
              @click="removeCover"
              class="px-4 py-2 border border-red-300 rounded-md shadow-sm text-sm font-medium text-red-700 bg-white hover:bg-red-50"
            >
              Remove
            </button>
            <p class="text-xs text-gray-500">JPG, PNG, GIF or WebP. Max {{ MAX_FILE_SIZE / 1024 / 1024 }}MB.</p>
          </div>
        </div>

        <!-- Tags -->
        <div class="bg-white shadow rounded-lg p-6">
          <label for="tags" class="block text-sm font-medium text-gray-700">Tags</label>
          <input
            id="tags"
            v-model="tagsInput"
            type="text"
            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            placeholder="Separated by commas, e.g. music, review, tutorial"
          />
          <p class="mt-1 text-xs text-gray-500">Optional</p>
        </div>

        <!-- Music embed -->
        <div class="bg-white shadow rounded-lg p-6">
          <h2 class="text-lg font-semibold text-gray-900 mb-2">Music Embed</h2>
          <p class="text-sm text-gray-500 mb-4">Search and attach a track to your blog post (optional)</p>

          <!-- Selected music -->
          <div v-if="selectedMusic" class="flex items-center gap-4 bg-indigo-50 rounded-lg p-4">
            <img
              v-if="selectedMusic.cover"
              :src="selectedMusic.cover"
              :alt="selectedMusic.title"
              class="h-16 w-16 rounded-lg object-cover"
            />
            <div class="flex-1">
              <p class="font-medium text-gray-900">{{ selectedMusic.title }}</p>
              <p class="text-sm text-gray-600">{{ selectedMusic.artist }}</p>
            </div>
            <button
              type="button"
              @click="selectedMusic = null"
              class="text-sm text-red-600 hover:text-red-800"
            >
              Remove
            </button>
          </div>

          <!-- Search -->
          <div v-else class="flex items-center space-x-3">
            <input
              v-model="searchQuery"
              type="text"
              class="flex-1 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              placeholder="Type to search for a track..."
              @keyup.enter.prevent="searchMusic"
            />
            <svg
              v-if="musicSearching"
              class="animate-spin h-5 w-5 text-indigo-600"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path
                class="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
              ></path>
            </svg>
          </div>

          <!-- Search results -->
          <div v-if="musicResults.length" class="mt-4 divide-y divide-gray-100 border border-gray-200 rounded-lg">
            <button
              v-for="track in musicResults"
              :key="track.trackId"
              type="button"
              @click="selectTrack(track)"
              class="w-full flex items-center gap-4 p-3 hover:bg-gray-50 text-left"
            >
              <img v-if="track.cover" :src="track.cover" :alt="track.title" class="h-10 w-10 rounded object-cover" />
              <div class="flex-1 min-w-0">
                <p class="text-sm font-medium text-gray-900 truncate">{{ track.title }}</p>
                <p class="text-xs text-gray-500 truncate">{{ track.artist }}</p>
              </div>
              <span class="text-xs text-gray-400">{{ formatDuration(track.duration) }}</span>
            </button>
          </div>
          <p v-if="musicSearchError" class="mt-2 text-sm text-red-600">{{ musicSearchError }}</p>
        </div>

        <!-- Actions -->
        <div class="flex justify-end space-x-3">
          <button
            type="button"
            @click="router.push('/blogs')"
            class="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            :disabled="saving"
            class="inline-flex items-center px-4 py-2 bg-indigo-600 text-white rounded-md shadow-sm text-sm font-medium hover:bg-indigo-700 disabled:opacity-50"
          >
            <svg
              v-if="saving"
              class="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path
                class="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
              ></path>
            </svg>
            {{ saving ? 'Publishing...' : 'Create Blog' }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, computed } from 'vue'
import { useRouter } from 'vue-router'
import { blogAPI, musicAPI } from '@/services/api'
import BlogEditor from '@/components/BlogEditor.vue'
import { debounce } from '@/utils/helpers'
import {
  BLOG_TITLE_MAX_LENGTH,
  BLOG_EXCERPT_LENGTH,
  MAX_FILE_SIZE,
  ALLOWED_IMAGE_TYPES,
  SUCCESS_MESSAGES,
} from '@/utils/constants'

const router = useRouter()

// Form state
const title = ref('')
const content = ref(null)
const excerpt = ref('')
const tagsInput = ref('')
const status = ref('draft')

// Cover image
const coverFile = ref(null)
const coverPreview = ref('')

// Music
const searchQuery = ref('')
const musicResults = ref([])
const musicSearching = ref(false)
const musicSearchError = ref('')
const selectedMusic = ref(null)

// UI state
const saving = ref(false)
const formError = ref('')
const successMessage = ref('')

const formatDuration = (seconds) => {
  if (!seconds) return ''
  const mins = Math.floor(seconds / 60)
  const secs = seconds % 60
  return `${mins}:${String(secs).padStart(2, '0')}`
}

const handleCoverChange = (event) => {
  const file = event.target.files?.[0]
  event.target.value = ''
  if (!file) return

  if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
    formError.value = 'Invalid file type. Please upload an image file.'
    return
  }

  if (file.size > MAX_FILE_SIZE) {
    formError.value = `File size must be less than ${MAX_FILE_SIZE / 1024 / 1024}MB`
    return
  }

  coverFile.value = file
  coverPreview.value = URL.createObjectURL(file)
  formError.value = ''
}

const removeCover = () => {
  coverFile.value = null
  coverPreview.value = ''
}

const searchMusic = async () => {
  const keyword = searchQuery.value.trim()
  if (!keyword || keyword.length < 2) {
    musicResults.value = []
    musicSearchError.value = ''
    return
  }

  musicSearching.value = true
  musicSearchError.value = ''

  try {
    const response = await musicAPI.searchMusic({
      keyword,
      limit: 8,
    })
    musicResults.value = response.data.data || []
    if (!musicResults.value.length) {
      musicSearchError.value = 'No tracks found. Try a different search.'
    }
  } catch (err) {
    musicSearchError.value = err.response?.data?.message || 'Failed to search music'
  } finally {
    musicSearching.value = false
  }
}

const debouncedSearch = debounce(searchMusic, 400)

watch(searchQuery, () => {
  debouncedSearch()
})

const selectTrack = (track) => {
  selectedMusic.value = {
    provider: 'deezer',
    trackId: track.trackId,
    title: track.title,
    artist: track.artist,
    album: track.album,
    cover: track.cover,
    previewUrl: track.previewUrl,
    deezerUrl: track.deezerUrl,
    duration: track.duration,
  }
  musicResults.value = []
  searchQuery.value = ''
  musicSearchError.value = ''
}

const countTextContent = (doc) => {
  if (!doc) return 0
  if (typeof doc === 'string') return doc.length
  let count = 0
  const walk = (node) => {
    if (!node) return
    if (node.type === 'text' && node.text) count += node.text.length
    if (Array.isArray(node.content)) node.content.forEach(walk)
  }
  walk(doc)
  return count
}

const contentLength = computed(() => countTextContent(content.value))

const handleSubmit = async () => {
  formError.value = ''
  successMessage.value = ''

  if (!title.value.trim()) {
    formError.value = 'Title is required'
    return
  }
  if (title.value.trim().length < 3) {
    formError.value = 'Title must be at least 3 characters'
    return
  }
  if (contentLength.value < 10) {
    formError.value = 'Content must be at least 10 characters'
    return
  }

  const formData = new FormData()
  formData.append('title', title.value.trim())
  formData.append('content', JSON.stringify(content.value))
  formData.append('status', status.value)
  if (excerpt.value.trim()) formData.append('excerpt', excerpt.value.trim())
  if (coverFile.value) formData.append('coverImage', coverFile.value)

  const tags = tagsInput.value
    .split(',')
    .map((tag) => tag.trim())
    .filter(Boolean)
  if (tags.length) formData.append('tags', JSON.stringify(tags))
  if (selectedMusic.value) formData.append('music', JSON.stringify(selectedMusic.value))

  saving.value = true
  try {
    const response = await blogAPI.createBlog(formData)
    successMessage.value = SUCCESS_MESSAGES.BLOG_CREATED
    const blog = response.data.blog
    if (blog?.slug) {
      router.push(`/blogs/${blog.slug}`)
    } else {
      router.push('/blogs')
    }
  } catch (err) {
    formError.value = err.response?.data?.message || 'Failed to create blog'
  } finally {
    saving.value = false
  }
}
</script>
