<template>
  <div class="min-h-screen bg-gray-50 py-8">
    <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
      <button
        @click="router.back()"
        class="mb-6 inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
      >
        &larr; Back
      </button>

      <!-- Loading state -->
      <div v-if="loading" class="flex justify-center items-center h-64">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>

      <!-- Error state -->
      <div v-else-if="error" class="bg-red-50 border border-red-200 rounded-lg p-6">
        <h3 class="text-red-800 font-semibold">Error loading blog</h3>
        <p class="text-red-600 mt-2">{{ error }}</p>
      </div>

      <!-- Blog content -->
      <article v-else-if="blog" class="bg-white shadow rounded-lg overflow-hidden">
        <!-- Music card -->
        <div
          v-if="blog.music?.title"
          class="bg-gradient-to-r from-indigo-600 to-purple-600 p-6 flex items-center gap-6 text-white"
        >
          <img
            v-if="blog.music.cover"
            :src="blog.music.cover"
            :alt="blog.music.title"
            class="h-24 w-24 rounded-lg object-cover shadow-lg"
          />
          <div class="flex-1">
            <h3 class="text-xl font-bold">{{ blog.music.title }}</h3>
            <p class="mt-1">{{ blog.music.artist }}</p>
            <p v-if="blog.music.album" class="text-sm opacity-80">{{ blog.music.album }}</p>
            <div class="mt-3 flex items-center gap-4">
              <audio v-if="blog.music.previewUrl" controls autoplay class="h-8">
                <source :src="blog.music.previewUrl" type="audio/mpeg" />
                Your browser does not support the audio element.
              </audio>
              <a
                v-if="blog.music.deezerUrl"
                :href="blog.music.deezerUrl"
                target="_blank"
                rel="noopener noreferrer"
                class="text-sm font-medium bg-white text-purple-700 px-3 py-1.5 rounded-md hover:bg-purple-50"
              >
                Open in Deezer
              </a>
            </div>
          </div>
        </div>

        <!-- Cover image -->
        <img
          v-if="blog.coverImage"
          :src="blog.coverImage"
          :alt="blog.title"
          class="w-full h-64 sm:h-96 object-cover"
        />

        <!-- Body -->
        <div class="p-6 sm:p-10">
          <h1 class="text-3xl sm:text-4xl font-bold text-gray-900">{{ blog.title }}</h1>

          <!-- Meta -->
          <div class="mt-4 flex items-center justify-between border-b border-gray-200 pb-6">
            <router-link
              v-if="blog.author?.publicId"
              :to="`/profile/${blog.author.publicId}`"
              class="flex items-center space-x-3 group"
            >
              <img
                v-if="blog.author?.picture"
                :src="blog.author.picture"
                :alt="authorName"
                class="h-10 w-10 rounded-full object-cover"
              />
              <div
                v-else
                class="h-10 w-10 rounded-full bg-indigo-600 flex items-center justify-center text-white text-sm font-bold"
              >
                {{ getInitials(authorName) }}
              </div>
              <div>
                <p class="text-sm font-medium text-gray-900 group-hover:text-indigo-600">{{ authorName }}</p>
                <p class="text-xs text-gray-500">
                  {{ formatDate(blog.publishedAt || blog.createdAt) }}
                </p>
              </div>
            </router-link>
            <div v-else class="flex items-center space-x-3">
              <img
                v-if="blog.author?.picture"
                :src="blog.author.picture"
                :alt="authorName"
                class="h-10 w-10 rounded-full object-cover"
              />
              <div
                v-else
                class="h-10 w-10 rounded-full bg-indigo-600 flex items-center justify-center text-white text-sm font-bold"
              >
                {{ getInitials(authorName) }}
              </div>
              <div>
                <p class="text-sm font-medium text-gray-900">{{ authorName }}</p>
                <p class="text-xs text-gray-500">
                  {{ formatDate(blog.publishedAt || blog.createdAt) }}
                </p>
              </div>
            </div>
            <div class="flex items-center gap-4">
              <!-- Like button -->
              <button
                @click="handleToggleLike"
                :disabled="liking"
                class="inline-flex items-center gap-1.5 text-sm font-medium rounded-full px-3 py-1.5 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                :class="liked ? 'bg-red-50 text-red-600' : 'bg-gray-50 text-gray-500 hover:bg-gray-100'"
              >
                <svg
                  class="h-5 w-5"
                  :class="liked ? 'fill-current' : 'fill-none'"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                  />
                </svg>
                <span>{{ likesCount }}</span>
              </button>

              <!-- Views -->
              <span class="inline-flex items-center gap-1.5 text-sm text-gray-500">
                <svg class="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                  <path fill-rule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clip-rule="evenodd" />
                </svg>
                {{ blog.views || 0 }}
              </span>
            </div>
          </div>

          <!-- Excerpt -->
          <p v-if="blog.excerpt" class="mt-6 text-lg text-gray-600 italic">{{ blog.excerpt }}</p>

          <!-- Content -->
          <div class="mt-6 text-gray-800">
            <BlogContent :content="blog.content" />
          </div>

          <!-- Tags -->
          <div v-if="blog.tags && blog.tags.length" class="mt-8 flex flex-wrap gap-2">
            <span
              v-for="tag in blog.tags"
              :key="tag"
              class="px-3 py-1 bg-indigo-50 text-indigo-700 text-sm rounded-full"
            >
              #{{ tag }}
            </span>
          </div>
        </div>
      </article>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { blogAPI, likeAPI } from '@/services/api'
import { useAuthStore } from '@/stores/auth'
import BlogContent from '@/components/BlogContent.vue'
import { getInitials, formatDate } from '@/utils/helpers'

const route = useRoute()
const router = useRouter()
const authStore = useAuthStore()

const blog = ref(null)
const loading = ref(false)
const error = ref('')
const liked = ref(false)
const likesCount = ref(0)
const liking = ref(false)

const authorName = computed(() => {
  const author = blog.value?.author
  if (!author) return 'Unknown'
  if (author.displayName) return author.displayName
  if (author.firstName || author.lastName) {
    return `${author.firstName || ''} ${author.lastName || ''}`.trim()
  }
  return 'Unknown'
})

const fetchBlog = async () => {
  loading.value = true
  error.value = ''

  try {
    const response = await blogAPI.getBlogBySlug(route.params.slug)
    blog.value = response.data.blog || null
    if (blog.value) {
      likesCount.value = blog.value.likesCount || 0
      liked.value = !!response.data.userLiked
    } else {
      error.value = 'Blog not found'
    }
  } catch (err) {
    error.value = err.response?.data?.message || 'Failed to load blog'
  } finally {
    loading.value = false
  }
}

const handleToggleLike = async () => {
  if (!authStore.isAuthenticated) {
    router.push({ name: 'login', query: { redirect: route.fullPath } })
    return
  }
  if (liking.value || !blog.value?._id) return

  liking.value = true
  try {
    const response = await likeAPI.toggleLike(blog.value._id)
    liked.value = response.data.liked
    likesCount.value = response.data.likesCount
  } catch (err) {
    if (err.response?.status === 401) {
      router.push({ name: 'login', query: { redirect: route.fullPath } })
    }
  } finally {
    liking.value = false
  }
}

watch(() => route.params.slug, fetchBlog)

onMounted(fetchBlog)
</script>
