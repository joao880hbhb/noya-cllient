<script setup>
import { ref, onMounted, onBeforeUnmount, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { useAuthStore } from '@/stores/auth'
import { useTheme } from '@/composables/useTheme'
import { blogAPI } from '@/services/api'
import BlogCard from '@/components/BlogCard.vue'
import UserSearch from '@/components/UserSearch.vue'
import { getInitials, formatRelativeTime } from '@/utils/helpers'

const authStore = useAuthStore()
const { t } = useI18n()
const { isDark } = useTheme()

const trendingBlogs = ref([])
const latestBlogs = ref([])
const loading = ref(true)
const error = ref('')

const loadingMore = ref(false)
const loadMoreTrigger = ref(null)
const currentPage = ref(1)
const totalPages = ref(1)
const pageSize = 9
const hasMore = computed(() => currentPage.value < totalPages.value)
let observer = null

const fetchFeed = async () => {
  loading.value = true
  error.value = ''
  currentPage.value = 1
  try {
    const [trendingRes, latestRes] = await Promise.all([
      blogAPI.getAllBlogs({ sort: 'trending', limit: 6 }),
      blogAPI.getAllBlogs({ page: 1, limit: pageSize }),
    ])
    trendingBlogs.value = trendingRes.data.blogs || []
    latestBlogs.value = latestRes.data.blogs || []
    totalPages.value = latestRes.data.totalPages || 1
  } catch (err) {
    error.value = err.response?.data?.message || t('home.loadFailed')
  } finally {
    loading.value = false
  }
}

const loadMoreLatest = async () => {
  if (loadingMore.value || !hasMore.value) return
  loadingMore.value = true
  try {
    const nextPage = currentPage.value + 1
    const response = await blogAPI.getAllBlogs({ page: nextPage, limit: pageSize })
    const newBlogs = response.data.blogs || []
    latestBlogs.value = [...latestBlogs.value, ...newBlogs]
    currentPage.value = nextPage
    totalPages.value = response.data.totalPages || 1
  } catch (err) {
    console.error('Failed to load more blogs:', err)
  } finally {
    loadingMore.value = false
  }
}

onMounted(() => {
  fetchFeed()

  observer = new IntersectionObserver(
    (entries) => {
      const entry = entries[0]
      if (entry.isIntersecting && hasMore.value && !loading.value && !loadingMore.value) {
        loadMoreLatest()
      }
    },
    {
      rootMargin: '200px',
    },
  )

  if (loadMoreTrigger.value) {
    observer.observe(loadMoreTrigger.value)
  }
})

onBeforeUnmount(() => {
  if (observer) {
    observer.disconnect()
  }
})
</script>

<template>
  <div :class="['min-h-screen transition-colors duration-300', isDark ? 'bg-[#060608] text-white' : 'bg-white text-gray-900']">
    <div class="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <!-- User search -->
      <div class="mb-8 max-w-xl">
        <UserSearch />
      </div>

      <!-- Beranda header -->
      <div class="mb-6 flex items-end justify-between">
        <div>
          <h1 :class="['text-2xl font-bold', isDark ? 'text-white' : 'text-gray-900']">
            {{ t('home.greeting', { name: authStore.user?.displayName || t('common.user') }) }}
          </h1>
          <p :class="['mt-1 text-sm', isDark ? 'text-gray-400' : 'text-gray-500']">{{ t('home.subtitle') }}</p>
        </div>
        <router-link
          to="/blogs"
          :class="['inline-flex items-center text-sm font-medium whitespace-nowrap shrink-0', isDark ? 'text-white hover:text-gray-300' : 'text-black hover:text-gray-700']"
        >
          {{ t('home.viewAll') }} &rarr;
        </router-link>
      </div>

      <!-- Loading state -->
      <div v-if="loading" class="space-y-8">
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div
            v-for="i in 4"
            :key="i"
            :class="['flex items-center gap-3 rounded-2xl p-3 animate-pulse', isDark ? 'bg-white/[0.03]' : 'bg-gray-50']"
          >
            <div :class="['h-20 w-20 sm:h-24 sm:w-24 shrink-0 rounded-xl', isDark ? 'bg-white/[0.06]' : 'bg-gray-100']"></div>
            <div class="flex-1 min-w-0">
              <div :class="['h-4 rounded mb-2 w-3/4', isDark ? 'bg-white/[0.06]' : 'bg-gray-100']"></div>
              <div :class="['h-3 rounded mb-2 w-full', isDark ? 'bg-white/[0.06]' : 'bg-gray-100']"></div>
              <div :class="['h-3 rounded w-1/2', isDark ? 'bg-white/[0.06]' : 'bg-gray-100']"></div>
            </div>
          </div>
        </div>
      </div>

      <!-- Error state -->
      <div v-else-if="error" class="text-center py-20">
        <p :class="isDark ? 'text-gray-400' : 'text-gray-500'">{{ error }}</p>
        <button
          @click="fetchFeed"
          class="mt-4 px-4 py-2 bg-[#5B4BFF] text-white rounded-full text-sm font-medium hover:bg-[#4a3dcc]"
        >
          {{ t('common.tryAgain') }}
        </button>
      </div>

      <template v-else>
        <!-- Trending on Noya -->
        <section v-if="trendingBlogs.length" class="mb-10">
          <div class="mb-4 flex items-center gap-2">
            <h2 :class="['font-serif text-xl font-bold', isDark ? 'text-white' : 'text-gray-900']">{{ t('home.trendingOnNoya') }}</h2>
          </div>

          <!-- Horizontal compact cards, 2 per row -->
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <router-link
              v-for="(blog, index) in trendingBlogs"
              :key="blog._id"
              :to="`/blogs/${blog.slug}`"
              class="block"
            >
              <div
                :class="[
                  'group flex items-center gap-3 rounded-2xl p-3 transition-all h-full',
                  isDark
                    ? 'bg-white/[0.02] border border-white/[0.08] hover:bg-white/[0.04]'
                    : 'bg-white shadow-[0_2px_12px_rgba(0,0,0,0.06)] hover:shadow-[0_4px_20px_rgba(0,0,0,0.1)]',
                ]"
              >
                <!-- Thumbnail -->
                <div :class="['relative h-20 w-20 sm:h-24 sm:w-24 shrink-0 overflow-hidden rounded-xl', isDark ? 'bg-white/[0.05]' : 'bg-gray-100']">
                  <img
                    v-if="blog.coverImage"
                    :src="blog.coverImage"
                    :alt="blog.title"
                    class="h-full w-full object-cover"
                    loading="lazy"
                  />
                  <div v-else class="h-full w-full flex items-center justify-center">
                    <span :class="['text-xl font-bold', isDark ? 'text-gray-600' : 'text-gray-300']">{{
                      getInitials(blog.title)
                    }}</span>
                  </div>
                  <!-- Rank -->
                  <span
                    :class="[
                      'absolute top-1 left-1 h-6 w-6 rounded-md backdrop-blur flex items-center justify-center font-serif text-xs font-bold shadow-sm',
                      isDark ? 'bg-black/70 text-white' : 'bg-white/90 text-gray-900',
                    ]"
                  >
                    {{ String(index + 1).padStart(2, '0') }}
                  </span>
                </div>

                <!-- Content -->
                <div class="flex-1 min-w-0">
                  <h3
                    :class="['font-serif text-sm sm:text-base font-bold leading-snug line-clamp-2', isDark ? 'text-white' : 'text-gray-900']"
                  >
                    {{ blog.title }}
                  </h3>
                  <p v-if="blog.excerpt" :class="['mt-1 text-xs line-clamp-2', isDark ? 'text-gray-400' : 'text-gray-500']">
                    {{ blog.excerpt }}
                  </p>

                  <!-- Like & view info -->
                  <div :class="['mt-2 flex items-center gap-3 text-xs', isDark ? 'text-gray-500' : 'text-gray-400']">
                    <span class="inline-flex items-center gap-1">
                      <svg
                        class="h-3.5 w-3.5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          stroke-width="2"
                          d="M4.318 6.318a4.5 4.5 0 010 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                        />
                      </svg>
                      {{ blog.likesCount ?? blog.likes ?? 0 }}
                    </span>
                    <span class="inline-flex items-center gap-1">
                      <svg
                        class="h-3.5 w-3.5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          stroke-width="2"
                          d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                        />
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          stroke-width="2"
                          d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                        />
                      </svg>
                      {{ blog.viewsCount ?? blog.views ?? 0 }}
                    </span>
                    <span class="ml-auto truncate">{{
                      formatRelativeTime(blog.publishedAt || blog.createdAt)
                    }}</span>
                  </div>
                </div>
              </div>
            </router-link>
          </div>
        </section>

        <!-- Latest stories -->
        <section>
          <div class="mb-4 flex items-center gap-3">
            <h2 :class="['font-serif text-xl font-bold', isDark ? 'text-white' : 'text-gray-900']">{{ t('home.latestStories') }}</h2>
            <span :class="['h-px flex-1', isDark ? 'bg-white/10' : 'bg-gray-100']"></span>
          </div>

          <div v-if="latestBlogs.length" :class="['flex flex-col divide-y', isDark ? 'divide-white/10' : 'divide-gray-100']">
            <router-link
              v-for="blog in latestBlogs"
              :key="blog._id"
              :to="`/blogs/${blog.slug}`"
              class="block py-4 first:pt-0"
            >
              <div class="group flex items-center gap-4">
                <!-- Thumbnail (kiri) -->
                <div :class="['relative h-20 w-20 sm:h-24 sm:w-24 shrink-0 overflow-hidden rounded-xl', isDark ? 'bg-white/[0.05]' : 'bg-gray-100']">
                  <img
                    v-if="blog.coverImage"
                    :src="blog.coverImage"
                    :alt="blog.title"
                    class="h-full w-full object-cover"
                    loading="lazy"
                  />
                  <div v-else class="h-full w-full flex items-center justify-center">
                    <span :class="['text-xl font-bold', isDark ? 'text-gray-600' : 'text-gray-300']">{{
                      getInitials(blog.title)
                    }}</span>
                  </div>
                </div>

                <!-- Content (kanan) -->
                <div class="flex-1 min-w-0">
                  <h3
                    :class="['font-serif text-sm sm:text-base font-bold leading-snug line-clamp-2', isDark ? 'text-white' : 'text-gray-900']"
                  >
                    {{ blog.title }}
                  </h3>
                  <p v-if="blog.excerpt" :class="['mt-1 text-xs line-clamp-2', isDark ? 'text-gray-400' : 'text-gray-500']">
                    {{ blog.excerpt }}
                  </p>

                  <!-- Tag lagu -->
                  <span
                    v-if="blog.song || blog.music"
                    :class="[
                      'mt-2 inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-[11px] font-medium',
                      isDark ? 'border-white/15 text-gray-300' : 'border-[#E7E7E7] text-[#4B4B4B]',
                    ]"
                  >
                    <svg class="h-3 w-3" fill="currentColor" viewBox="0 0 20 20">
                      <path
                        d="M18 3a1 1 0 00-1.196-.98l-10 2A1 1 0 006 5v9.114A4.369 4.369 0 004.5 14C2.567 14 1 15.343 1 17s1.567 3 3.5 3 3.5-1.343 3.5-3V8.82l8-1.6v5.894A4.37 4.37 0 0014.5 13c-1.933 0-3.5 1.343-3.5 3s1.567 3 3.5 3 3.5-1.343 3.5-3V3z"
                      />
                    </svg>
                    {{ blog.song?.artist ?? blog.music?.artist
                    }}{{ blog.song?.artist || blog.music?.artist ? ' – ' : ''
                    }}{{ blog.song?.title ?? blog.music?.title ?? blog.song ?? blog.music }}
                  </span>

                  <div :class="['mt-2 flex items-center gap-3 text-xs', isDark ? 'text-gray-500' : 'text-gray-400']">
                    <span class="inline-flex items-center gap-1.5 min-w-0">
                      <img
                        v-if="blog.author?.picture"
                        :src="blog.author.picture"
                        :alt="blog.author.displayName || blog.author.publicId"
                        class="h-5 w-5 rounded-full object-cover shrink-0"
                      />
                      <div
                        v-else
                        :class="['h-5 w-5 rounded-full flex items-center justify-center text-[9px] font-bold shrink-0', isDark ? 'bg-white/10 text-gray-300' : 'bg-gray-100 text-gray-500']"
                      >
                        {{ getInitials(blog.author?.displayName || blog.author?.publicId) }}
                      </div>
                      <span class="truncate">{{
                        blog.author?.displayName || blog.author?.publicId
                      }}</span>
                    </span>
                    <span class="inline-flex items-center gap-1">
                      <svg
                        class="h-3.5 w-3.5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          stroke-width="2"
                          d="M4.318 6.318a4.5 4.5 0 010 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                        />
                      </svg>
                      {{ blog.likesCount ?? blog.likes ?? 0 }}
                    </span>
                    <span class="inline-flex items-center gap-1">
                      <svg
                        class="h-3.5 w-3.5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          stroke-width="2"
                          d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                        />
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          stroke-width="2"
                          d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                        />
                      </svg>
                      {{ blog.viewsCount ?? blog.views ?? 0 }}
                    </span>
                    <span class="ml-auto truncate">{{
                      formatRelativeTime(blog.publishedAt || blog.createdAt)
                    }}</span>
                  </div>
                </div>
              </div>
            </router-link>
          </div>

          <!-- Empty state -->
          <div v-else :class="['rounded-[20px] py-16 px-6 text-center', isDark ? 'bg-white/[0.02]' : 'bg-gray-50']">
            <div
              :class="['mx-auto flex h-14 w-14 items-center justify-center rounded-full shadow-sm', isDark ? 'bg-white/5' : 'bg-white']"
            >
              <svg :class="['h-7 w-7', isDark ? 'text-gray-600' : 'text-gray-300']" fill="currentColor" viewBox="0 0 20 20">
                <path
                  d="M4 3a1 1 0 011-1h8.586a1 1 0 01.707.293l2.414 2.414A1 1 0 0117 5.414V17a1 1 0 01-1 1H5a1 1 0 01-1-1V3zm9 1v3h3l-3-3z"
                />
              </svg>
            </div>
            <h3 :class="['mt-4 font-serif text-lg font-bold', isDark ? 'text-white' : 'text-gray-800']">{{ t('home.noStories') }}</h3>
            <p :class="['mt-1 text-sm', isDark ? 'text-gray-400' : 'text-gray-500']">{{ t('home.firstWriter') }}</p>
            <router-link
              v-if="authStore.isAuthenticated"
              to="/blogs/create"
              class="mt-5 inline-flex items-center gap-2 rounded-full bg-[#5B4BFF] px-5 py-2.5 text-sm font-semibold text-white hover:bg-[#4a3dcc]"
            >
              {{ t('home.writeStory') }}
            </router-link>
          </div>

          <!-- Infinite Scroll Trigger Sentinel -->
          <div ref="loadMoreTrigger" class="mt-8 mb-12 flex items-center justify-center py-6">
            <!-- Loading spinner for more items -->
            <div v-if="loadingMore" class="flex flex-col items-center gap-2">
              <div
                :class="['h-6 w-6 animate-spin rounded-full border-2 border-t-[#5B4BFF]', isDark ? 'border-white/10' : 'border-gray-200']"
              ></div>
              <span :class="['text-xs font-medium', isDark ? 'text-gray-400' : 'text-gray-500']">{{ t('home.loadingMore') }}</span>
            </div>
            <!-- No more items text -->
            <span
              v-else-if="!hasMore && latestBlogs.length > 0"
              :class="['text-xs font-medium', isDark ? 'text-gray-500' : 'text-gray-400']"
            >
              {{ t('home.allLoaded') }}
            </span>
          </div>
        </section>
      </template>
    </div>
  </div>
</template>