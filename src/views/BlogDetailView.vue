<template>
  <div class="min-h-screen bg-white">
    <!-- Reading progress -->
    <div class="fixed top-0 left-0 right-0 h-[2px] bg-[#F0F0F0] z-40">
      <div
        class="h-full bg-[#111111] transition-[width] duration-150 ease-out"
        :style="{ width: progress + '%' }"
      ></div>
    </div>

    <div class="max-w-3xl mx-auto px-6 sm:px-10 py-12 sm:py-16">
      <button
        @click="router.back()"
        class="mb-10 inline-flex items-center gap-2 text-[13px] font-medium text-[#6B6B6B] hover:text-[#111111] transition-colors"
      >
        <svg
          class="h-3.5 w-3.5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          stroke-width="2"
        >
          <path stroke-linecap="round" stroke-linejoin="round" d="M15 19l-7-7 7-7" />
        </svg>
        {{ t('blogDetail.back') }}
      </button>

      <!-- Loading state -->
      <div v-if="loading" class="flex flex-col items-center justify-center h-72 gap-3">
        <svg class="animate-spin h-6 w-6 text-[#111111]" fill="none" viewBox="0 0 24 24">
          <circle
            class="opacity-20"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            stroke-width="3"
          ></circle>
          <path
            class="opacity-90"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
          ></path>
        </svg>
        <p class="text-[11px] tracking-[0.15em] text-[#B0B0B0] uppercase">{{ t('blogDetail.loadingStory') }}</p>
      </div>

      <!-- Error state -->
      <div v-else-if="error" class="border border-[#E7E7E7] rounded-[3px] p-10 text-center">
        <p class="text-[11px] tracking-[0.15em] text-[#B3261E] uppercase mb-2">
          {{ t('blogDetail.loadError') }}
        </p>
        <p class="text-[15px] text-[#4B4B4B]">{{ error }}</p>
      </div>

      <!-- Blog content -->
      <article v-else-if="blog">
        <!-- Music card -->
        <div
          v-if="blog.music?.title"
          class="mb-8 bg-[#111111] rounded-[3px] p-5 sm:p-6 flex items-center gap-5 text-white shadow-[0_1px_2px_rgba(0,0,0,0.05),0_18px_40px_-16px_rgba(0,0,0,0.4)]"
        >
          <img
            v-if="blog.music.cover"
            :src="blog.music.cover"
            :alt="blog.music.title"
            class="h-20 w-20 rounded-[2px] object-cover shrink-0 border border-white/10"
          />
          <div class="flex-1 min-w-0">
            <p class="text-[10px] tracking-[0.2em] text-white/50 uppercase mb-1">{{ t('blogDetail.nowPlaying') }}</p>
            <h3 class="font-display italic text-[18px] leading-tight truncate">
              {{ blog.music.title }}
            </h3>
            <p class="mt-0.5 text-[13px] text-white/70 truncate">
              {{ blog.music.artist }}
            </p>
            <p v-if="blog.music.album" class="text-[11px] text-white/40 truncate">
              {{ blog.music.album }}
            </p>
            <div class="mt-3 flex flex-wrap items-center gap-3">
              <audio
                v-if="musicPreviewUrl"
                ref="audioEl"
                controls
                autoplay
                playsinline
                :src="musicPreviewUrl"
                type="audio/mpeg"
                class="h-8 max-w-[220px]"
              >
                {{ t('blogDetail.audioNotSupported') }}
              </audio>
              <a
                v-if="blog.music.deezerUrl"
                :href="blog.music.deezerUrl"
                target="_blank"
                rel="noopener noreferrer"
                class="text-[12px] font-medium border border-white/30 text-white px-3 py-1.5 rounded-[2px] hover:bg-white hover:text-[#111111] transition-colors"
              >
                {{ t('blogDetail.openInDeezer') }}
              </a>
            </div>
          </div>
        </div>

        <!-- Cover image -->

        <!-- Title -->
        <h1 class="font-display italic text-[32px] sm:text-[44px] leading-[1.1] text-[#111111]">
          {{ blog.title }}
        </h1>

        <!-- Meta -->
        <div
          class="mt-6 flex flex-wrap items-center justify-between gap-4 border-b border-[#F0F0F0] pb-6"
        >
          <component
            :is="blog.author?.publicId ? 'router-link' : 'div'"
            :to="blog.author?.publicId ? `/profile/${blog.author.publicId}` : undefined"
            class="flex items-center gap-3 group"
          >
            <img
              v-if="blog.author?.picture"
              :src="blog.author.picture"
              :alt="authorName"
              class="h-10 w-10 rounded-full object-cover border border-[#E7E7E7]"
            />
            <div
              v-else
              class="h-10 w-10 rounded-full bg-[#111111] flex items-center justify-center text-white text-[12px] font-medium"
            >
              {{ getInitials(authorName) }}
            </div>
            <div>
              <p class="text-[11px] tracking-wide text-[#B0B0B0]">{{ t('blogDetail.writtenBy') }}</p>
              <p
                class="text-[13px] font-medium text-[#111111] group-hover:underline underline-offset-2"
              >
                {{ authorName }}
              </p>
              <p class="text-[12px] text-[#B0B0B0]">
                {{ formatDate(blog.publishedAt || blog.createdAt) }} &middot;
                {{ t('blogDetail.minRead', { min: readingTime }) }}
              </p>
            </div>
          </component>

          <div class="flex items-center gap-3">
            <!-- Like button -->
            <button
              @click="handleToggleLike"
              :disabled="liking"
              class="inline-flex items-center gap-1.5 text-[13px] font-medium rounded-full px-3.5 py-1.5 border transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              :class="
                liked
                  ? 'bg-red-50 text-red-600 border-red-200 hover:bg-red-100'
                  : 'text-[#6B6B6B] border-[#E7E7E7] hover:border-[#111111] hover:text-[#111111]'
              "
            >
              <svg
                class="h-4 w-4"
                :class="liked ? 'fill-current' : 'fill-none'"
                fill="none"
                stroke="currentColor"
                stroke-width="1.8"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                />
              </svg>
              <span class="tabular-nums">{{ likesCount }}</span>
            </button>

            <!-- Repost button -->
            <button
              @click="handleToggleRepost"
              :disabled="reposting"
              class="inline-flex items-center gap-1.5 text-[13px] font-medium rounded-full px-3.5 py-1.5 border transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              :class="
                reposted
                  ? 'bg-emerald-50 text-emerald-600 border-emerald-200 hover:bg-emerald-100'
                  : 'text-[#6B6B6B] border-[#E7E7E7] hover:border-[#111111] hover:text-[#111111]'
              "
            >
              <svg
                class="h-4 w-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                stroke-width="1.8"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="M4 4v7h7M20 20v-7h-7M5.868 16.5a8 8 0 0014.1-6M18.132 7.5a8 8 0 00-14.1 6"
                />
              </svg>
              <span class="tabular-nums">{{ repostsCount }}</span>
            </button>

            <!-- Comment count -->
            <button
              @click="scrollToComments"
              class="inline-flex items-center gap-1.5 text-[13px] font-medium rounded-full px-3.5 py-1.5 border border-[#E7E7E7] text-[#6B6B6B] hover:border-[#111111] hover:text-[#111111] transition-colors"
            >
              <svg
                class="h-4 w-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                stroke-width="1.8"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="M8 10h8M8 14h5M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <span class="tabular-nums">{{ commentsCount }}</span>
            </button>

            <!-- Views -->
            <span class="inline-flex items-center gap-1.5 text-[13px] text-[#B0B0B0]">
              <svg
                class="h-4 w-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                stroke-width="1.6"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="M2.5 12S6 5.5 12 5.5 21.5 12 21.5 12 18 18.5 12 18.5 2.5 12 2.5 12z"
                />
                <circle cx="12" cy="12" r="2.6" stroke-linecap="round" stroke-linejoin="round" />
              </svg>
              <span class="tabular-nums">{{ blog.views || 0 }}</span>
            </span>
          </div>
        </div>

        <div
          v-if="blog.coverImage"
          class="mb-10 border border-[#E7E7E7] rounded-[3px] overflow-hidden"
        >
          <img :src="blog.coverImage" :alt="blog.title" class="w-full h-64 sm:h-96 object-cover" />
        </div>
        <!-- Excerpt -->
        <p
          v-if="blog.excerpt"
          class="mt-8 pl-5 border-l-2 border-[#111111] font-display italic text-[19px] leading-relaxed text-[#4B4B4B]"
        >
          {{ blog.excerpt }}
        </p>

        <!-- Content -->
        <div class="reading-content mt-8 text-[#1F1F1F]">
          <BlogContent :content="blog.content" />
        </div>

        <!-- Tags -->
        <div
          v-if="blog.tags && blog.tags.length"
          class="mt-12 pt-6 border-t border-[#F0F0F0] flex flex-wrap gap-2"
        >
          <span
            v-for="tag in blog.tags"
            :key="tag"
            class="px-3 py-1 border border-[#E7E7E7] text-[#4B4B4B] text-[12px] rounded-full"
          >
            #{{ tag }}
          </span>
        </div>
      </article>

      <!-- Comments section -->
      <div ref="commentsSection" class="mt-14 border-t border-[#F0F0F0] pt-10">
        <h2 class="font-display italic text-[24px] sm:text-[28px] text-[#111111]">{{ t('blogDetail.comments') }}</h2>

        <!-- Comment form -->
        <div class="mt-6">
          <div v-if="authStore.isAuthenticated" class="flex items-start gap-3">
            <img
              v-if="authStore.user?.picture"
              :src="authStore.user.picture"
              :alt="authStore.user?.displayName"
              class="h-9 w-9 rounded-full object-cover border border-[#E7E7E7] shrink-0"
            />
            <div
              v-else
              class="h-9 w-9 rounded-full bg-[#111111] flex items-center justify-center text-white text-[12px] font-medium shrink-0"
            >
              {{ getInitials(authStore.user?.displayName || 'U') }}
            </div>
            <form class="flex-1" @submit.prevent="submitComment">
              <textarea
                v-model="commentText"
                rows="2"
                maxlength="1000"
                class="w-full text-[14px] text-[#111111] placeholder-[#C9C9C9] border border-[#E7E7E7] rounded-[3px] focus:border-[#111111] focus:ring-0 px-3 py-2.5 resize-none transition-colors"
                :placeholder="t('blogDetail.commentPlaceholder')"
                @keydown.ctrl.enter="submitComment"
                @keydown.meta.enter="submitComment"
              ></textarea>
              <div class="flex items-center justify-between mt-2">
                <span class="text-[11px] text-[#B0B0B0] tabular-nums"
                  >{{ commentText.length }} / 1000</span
                >
                <button
                  type="submit"
                  :disabled="commentSubmitting"
                  class="inline-flex items-center px-4 py-1.5 bg-[#111111] text-white rounded-full text-[12px] font-medium hover:bg-black disabled:opacity-50 transition-colors"
                >
                  {{ commentSubmitting ? t('blogDetail.sending') : t('blogDetail.send') }}
                </button>
              </div>
            </form>
          </div>
          <button
            v-else
            @click="openLoginPrompt('login-comment')"
            class="w-full text-left border border-dashed border-[#D8D8D8] rounded-[3px] px-4 py-3.5 text-[13px] text-[#B0B0B0] hover:border-[#111111] hover:text-[#111111] transition-colors"
          >
            {{ t('blogDetail.loginToComment') }}
          </button>
        </div>

        <!-- Comment list -->
        <div v-if="commentsLoading" class="mt-6 space-y-4">
          <div v-for="i in 3" :key="i" class="flex gap-3 animate-pulse">
            <div class="h-9 w-9 rounded-full bg-[#F0F0F0] shrink-0"></div>
            <div class="flex-1 space-y-2">
              <div class="h-3 w-32 bg-[#F0F0F0] rounded"></div>
              <div class="h-3 w-full bg-[#F0F0F0] rounded"></div>
            </div>
          </div>
        </div>

        <div v-else-if="commentsError" class="mt-6 border border-[#FDF7F6] bg-[#FDF7F6] px-4 py-3">
          <p class="text-[13px] text-[#8C1D14]">{{ commentsError }}</p>
        </div>

        <div v-else-if="comments.length" class="mt-6 flex flex-col divide-y divide-[#F0F0F0]">
          <div v-for="comment in comments" :key="comment._id" class="py-5">
            <div class="flex items-start gap-3">
              <img
                v-if="comment.author?.picture"
                :src="comment.author.picture"
                :alt="comment.author?.displayName"
                class="h-9 w-9 rounded-full object-cover border border-[#E7E7E7] shrink-0"
              />
              <div
                v-else
                class="h-9 w-9 rounded-full bg-[#111111] flex items-center justify-center text-white text-[12px] font-medium shrink-0"
              >
                {{ getInitials(commentAuthorName(comment)) }}
              </div>
              <div class="flex-1 min-w-0">
                <div class="flex items-baseline gap-2">
                  <p class="text-[13px] font-medium text-[#111111]">
                    {{ commentAuthorName(comment) }}
                  </p>
                  <span class="text-[11px] text-[#B0B0B0]">{{
                    formatRelativeTime(comment.createdAt)
                  }}</span>
                  <button
                    v-if="authStore.isAuthenticated && comment.author?._id === authStore.user?.id"
                    @click="deleteComment(comment._id)"
                    class="ml-auto text-[11px] text-[#B0B0B0] hover:text-[#B3261E] transition-colors"
                  >
                    {{ t('blogDetail.delete') }}
                  </button>
                </div>
                <p class="mt-1 text-[14px] leading-relaxed text-[#333333] whitespace-pre-wrap">
                  {{ comment.content }}
                </p>
              </div>
            </div>

            <!-- Replies -->
            <div
              v-if="comment.replies && comment.replies.length"
              class="mt-3 ml-12 flex flex-col divide-y divide-[#F5F5F5]"
            >
              <div v-for="reply in comment.replies" :key="reply._id" class="py-3">
                <div class="flex items-start gap-3">
                  <img
                    v-if="reply.author?.picture"
                    :src="reply.author.picture"
                    :alt="reply.author?.displayName"
                    class="h-7 w-7 rounded-full object-cover border border-[#E7E7E7] shrink-0"
                  />
                  <div
                    v-else
                    class="h-7 w-7 rounded-full bg-[#111111] flex items-center justify-center text-white text-[10px] font-medium shrink-0"
                  >
                    {{ getInitials(replyAuthorName(reply)) }}
                  </div>
                  <div class="flex-1 min-w-0">
                    <div class="flex items-baseline gap-2">
                      <p class="text-[12.5px] font-medium text-[#111111]">
                        {{ replyAuthorName(reply) }}
                      </p>
                      <span class="text-[11px] text-[#B0B0B0]">{{
                        formatRelativeTime(reply.createdAt)
                      }}</span>
                      <button
                        v-if="authStore.isAuthenticated && reply.author?._id === authStore.user?.id"
                        @click="deleteComment(reply._id)"
                        class="ml-auto text-[11px] text-[#B0B0B0] hover:text-[#B3261E] transition-colors"
                      >
                        Hapus
                      </button>
                    </div>
                    <p
                      class="mt-1 text-[13.5px] leading-relaxed text-[#333333] whitespace-pre-wrap"
                    >
                      {{ reply.content }}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <!-- Reply form -->
            <form
              v-if="authStore.isAuthenticated"
              class="mt-3 ml-12 flex gap-2"
              @submit.prevent="submitReply(comment)"
            >
              <input
                v-model="replyTexts[comment._id]"
                type="text"
                maxlength="1000"
                class="flex-1 text-[13px] text-[#111111] placeholder-[#C9C9C9] border border-[#E7E7E7] rounded-[3px] focus:border-[#111111] focus:ring-0 px-3 py-1.5 transition-colors"
                :placeholder="t('blogDetail.replyPlaceholder')"
              />
              <button
                type="submit"
                class="text-[12px] font-medium text-[#5B4BFF] hover:text-[#4a3dcc] shrink-0 transition-colors"
              >
                {{ t('blogDetail.reply') }}
              </button>
            </form>
          </div>
        </div>

        <!-- Empty comments -->
        <div
          v-else
          class="mt-6 border border-dashed border-[#D8D8D8] rounded-[3px] py-10 px-6 text-center"
        >
          <p class="text-[13px] text-[#8A8A8A]">{{ t('blogDetail.noComments') }}</p>
        </div>
      </div>
    </div>

    <!-- Login prompt modal -->
    <div v-if="showLoginPrompt" class="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div class="absolute inset-0 bg-black/40 backdrop-blur-[2px]" @click="closeLoginPrompt"></div>
      <div
        class="relative w-full max-w-sm bg-white rounded-[6px] shadow-[0_20px_60px_-20px_rgba(0,0,0,0.4)] p-8 text-center"
      >
        <div
          class="mx-auto h-12 w-12 rounded-full bg-[#F7F5FF] flex items-center justify-center mb-5"
        >
          <svg
            class="h-6 w-6 text-[#5B4BFF]"
            fill="none"
            stroke="currentColor"
            stroke-width="1.8"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
            />
          </svg>
        </div>
        <h3 class="text-[17px] font-display font-semibold text-[#111111]">
          {{ loginPromptTitle }}
        </h3>
        <p class="mt-2 text-[13px] leading-relaxed text-[#6B6B6B]">
          {{ loginPromptMessage }}
        </p>
        <div class="mt-7 flex flex-col gap-2.5">
          <button
            @click="goToLogin"
            class="w-full inline-flex items-center justify-center px-5 py-2.5 bg-[#5B4BFF] text-white rounded-full text-[13px] font-medium hover:bg-[#4a3dcc] transition-colors"
          >
            {{ t('blogDetail.login') }}
          </button>
          <button
            @click="closeLoginPrompt"
            class="w-full inline-flex items-center justify-center px-5 py-2.5 border border-[#E7E7E7] text-[#4B4B4B] rounded-full text-[13px] font-medium hover:bg-[#FAFAFA] transition-colors"
          >
            {{ t('blogDetail.cancel') }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { blogAPI, likeAPI, repostAPI, commentAPI, BASE_URL } from '@/services/api'
import { useAuthStore } from '@/stores/auth'
import BlogContent from '@/components/BlogContent.vue'
import { getInitials, formatDate, formatRelativeTime } from '@/utils/helpers'

const route = useRoute()
const router = useRouter()
const authStore = useAuthStore()
const { t } = useI18n()

const blog = ref(null)
const loading = ref(false)
const error = ref('')
const liked = ref(false)
const likesCount = ref(0)
const liking = ref(false)
const progress = ref(0)
const reposted = ref(false)
const repostsCount = ref(0)
const reposting = ref(false)
const commentsCount = ref(0)
const comments = ref([])
const commentsLoading = ref(false)
const commentsError = ref('')
const commentText = ref('')
const commentSubmitting = ref(false)
const replyTexts = ref({})
const commentsSection = ref(null)
const loginPromptReason = ref('like')
const audioEl = ref(null)
const showLoginPrompt = ref(false)
const musicPreviewUrl = ref('')

const loginPromptTitle = computed(() => {
  if (loginPromptReason.value === 'repost') return t('blogDetail.loginTitleRepost')
  if (loginPromptReason.value === 'comment') return t('blogDetail.loginTitleComment')
  return t('blogDetail.loginTitleLike')
})

const loginPromptMessage = computed(() => {
  if (loginPromptReason.value === 'repost') {
    return t('blogDetail.loginMsgRepost')
  }
  if (loginPromptReason.value === 'comment') {
    return t('blogDetail.loginMsgComment')
  }
  return t('blogDetail.loginMsgLike')
})

const openLoginPrompt = (reason = 'like') => {
  loginPromptReason.value = reason
  showLoginPrompt.value = true
}

// Audio di-stream lewat server kita (/api/music/preview/:trackId).
// Server selalu mengambil URL segar dari Deezer saat itu juga, jadi
// URL expired/mixed-content tidak lagi jadi masalah.
const refreshMusicPreview = async (music) => {
  if (!music?.trackId) return
  musicPreviewUrl.value = `${BASE_URL}/music/preview/${music.trackId}`
}

const authorName = computed(() => {
  const author = blog.value?.author
  if (!author) return t('blogDetail.unknownAuthor')
  if (author.displayName) return author.displayName
  if (author.firstName || author.lastName) {
    return `${author.firstName || ''} ${author.lastName || ''}`.trim()
  }
  return t('blogDetail.unknownAuthor')
})

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

const readingTime = computed(() => {
  const chars = countTextContent(blog.value?.content)
  const words = Math.ceil(chars / 5)
  return Math.max(1, Math.round(words / 200))
})

const updateProgress = () => {
  const docHeight = document.documentElement.scrollHeight - window.innerHeight
  progress.value =
    docHeight > 0 ? Math.min(100, Math.max(0, (window.scrollY / docHeight) * 100)) : 0
}

const fetchBlog = async () => {
  loading.value = true
  error.value = ''

  try {
    const response = await blogAPI.getBlogBySlug(route.params.slug)
    blog.value = response.data.blog || null
    if (blog.value) {
      likesCount.value = blog.value.likesCount || 0
      liked.value = !!response.data.userLiked
      reposted.value = !!response.data.userReposted
      repostsCount.value = response.data.repostsCount || 0
      commentsCount.value = response.data.commentsCount || 0
      musicPreviewUrl.value = ''
      refreshMusicPreview(blog.value.music)
      loadComments()
    } else {
      error.value = t('blogDetail.blogNotFound')
    }
  } catch (err) {
    error.value = err.response?.data?.message || t('blogDetail.loadFailed')
  } finally {
    loading.value = false
    requestAnimationFrame(updateProgress)
  }
}

const handleToggleLike = async () => {
  if (!authStore.isAuthenticated) {
    openLoginPrompt('like')
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
      openLoginPrompt('like')
    }
  } finally {
    liking.value = false
  }
}

const goToLogin = () => {
  showLoginPrompt.value = false
  router.push({ name: 'login', query: { redirect: route.fullPath } })
}

const closeLoginPrompt = () => {
  showLoginPrompt.value = false
}

const handleToggleRepost = async () => {
  if (!authStore.isAuthenticated) {
    openLoginPrompt('repost')
    return
  }
  if (reposting.value || !blog.value?._id) return

  reposting.value = true
  try {
    const response = await repostAPI.toggleRepost(blog.value._id)
    reposted.value = response.data.reposted
    repostsCount.value = response.data.repostsCount
  } catch (err) {
    if (err.response?.status === 401) {
      openLoginPrompt('repost')
    }
  } finally {
    reposting.value = false
  }
}

const scrollToComments = () => {
  commentsSection.value?.scrollIntoView({ behavior: 'smooth' })
}

const commentAuthorName = (comment) =>
  comment.author?.displayName ||
  [comment.author?.firstName, comment.author?.lastName].filter(Boolean).join(' ') ||
  t('common.user')

const replyAuthorName = commentAuthorName

const loadComments = async () => {
  if (!blog.value?._id) return
  commentsLoading.value = true
  commentsError.value = ''
  try {
    const response = await commentAPI.getComments(blog.value._id, { limit: 50 })
    comments.value = response.data.comments || []
    commentsCount.value = response.data.totalComments ?? commentsCount.value
  } catch (err) {
    commentsError.value = err.response?.data?.message || t('blogDetail.commentLoadFailed')
  } finally {
    commentsLoading.value = false
  }
}

const submitComment = async () => {
  if (!authStore.isAuthenticated) {
    openLoginPrompt('comment')
    return
  }
  const text = commentText.value.trim()
  if (!text || commentSubmitting.value || !blog.value?._id) return

  commentSubmitting.value = true
  try {
    const response = await commentAPI.createComment(blog.value._id, {
      content: text,
    })
    comments.value.unshift(response.data.comment)
    commentsCount.value = response.data.commentsCount
    commentText.value = ''
  } catch (err) {
    commentsError.value = err.response?.data?.message || t('blogDetail.commentSendFailed')
  } finally {
    commentSubmitting.value = false
  }
}

const submitReply = async (comment) => {
  if (!authStore.isAuthenticated) {
    openLoginPrompt('comment')
    return
  }
  const text = (replyTexts.value[comment._id] || '').trim()
  if (!text || !blog.value?._id) return

  try {
    const response = await commentAPI.createComment(blog.value._id, {
      content: text,
      parent: comment._id,
    })
    if (!comment.replies) comment.replies = []
    comment.replies.push(response.data.comment)
    commentsCount.value = response.data.commentsCount
    replyTexts.value[comment._id] = ''
  } catch (err) {
    commentsError.value = err.response?.data?.message || t('blogDetail.replySendFailed')
  }
}

const deleteComment = async (commentId) => {
  if (!confirm(t('blogDetail.confirmDeleteComment'))) return
  try {
    await commentAPI.deleteComment(commentId)
    comments.value = comments.value.filter((c) => c._id !== commentId)
    commentsCount.value = Math.max(0, commentsCount.value - 1)
  } catch (err) {
    commentsError.value = err.response?.data?.message || t('blogDetail.commentDeleteFailed')
  }
}

watch(() => route.params.slug, fetchBlog)

// Putar lagu otomatis begitu elemen audio muncul
watch(audioEl, (el) => {
  if (el) {
    const playPromise = el.play()
    if (playPromise) playPromise.catch(() => {})
  }
})

// Saat URL segar dari Deezer tiba, muat ulang & putar audio
watch(musicPreviewUrl, (url) => {
  const el = audioEl.value
  if (el && url) {
    el.load()
    const playPromise = el.play()
    if (playPromise) playPromise.catch(() => {})
  }
})

// Fallback: jika autoplay diblokir browser, coba putar saat user berinteraksi
const tryPlayMusic = () => {
  const el = audioEl.value
  if (el && el.paused) {
    const playPromise = el.play()
    if (playPromise) playPromise.catch(() => {})
  }
}

onMounted(() => {
  fetchBlog()
  window.addEventListener('scroll', updateProgress, { passive: true })
  window.addEventListener('resize', updateProgress)
  window.addEventListener('click', tryPlayMusic)
})

onUnmounted(() => {
  window.removeEventListener('scroll', updateProgress)
  window.removeEventListener('resize', updateProgress)
  window.removeEventListener('click', tryPlayMusic)
})
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,500;1,9..144,500&family=Source+Serif+4:opsz,wght@8..60,400;8..60,500&display=swap');

.font-display {
  font-family: 'Fraunces', ui-serif, Georgia, serif;
}

.reading-content {
  font-family: 'Source Serif 4', ui-serif, Georgia, serif;
  font-size: 18px;
  line-height: 1.8;
}

.reading-content :deep(p) {
  margin-bottom: 1.4em;
}

.reading-content :deep(h2) {
  font-family: 'Fraunces', ui-serif, Georgia, serif;
  font-style: italic;
  font-size: 26px;
  line-height: 1.3;
  color: #111111;
  margin-top: 2em;
  margin-bottom: 0.7em;
}

.reading-content :deep(h3) {
  font-family: 'Fraunces', ui-serif, Georgia, serif;
  font-style: italic;
  font-size: 21px;
  line-height: 1.35;
  color: #111111;
  margin-top: 1.75em;
  margin-bottom: 0.6em;
}

.reading-content :deep(a) {
  color: #111111;
  text-decoration: underline;
  text-underline-offset: 2px;
}

.reading-content :deep(strong) {
  color: #111111;
}

.reading-content :deep(blockquote) {
  border-left: 2px solid #111111;
  padding-left: 1.1em;
  font-style: italic;
  color: #4b4b4b;
  margin: 1.75em 0;
}

.reading-content :deep(ul),
.reading-content :deep(ol) {
  margin: 1.2em 0 1.4em 1.4em;
}

.reading-content :deep(li) {
  margin-bottom: 0.5em;
}

.reading-content :deep(img) {
  border-radius: 3px;
  border: 1px solid #e7e7e7;
  margin: 1.75em 0;
}

.reading-content :deep(code) {
  background: #fafafa;
  border: 1px solid #f0f0f0;
  border-radius: 2px;
  padding: 0.15em 0.4em;
  font-size: 0.9em;
}

.reading-content :deep(pre) {
  background: #111111;
  color: #f5f5f5;
  border-radius: 3px;
  padding: 1.1em 1.3em;
  overflow-x: auto;
  margin: 1.75em 0;
}

.reading-content :deep(pre code) {
  background: none;
  border: none;
  padding: 0;
  color: inherit;
}
</style>
