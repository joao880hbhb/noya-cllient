<template>
  <div :class="['min-h-screen transition-colors duration-300', isDark ? 'bg-[#060608] text-white' : 'bg-white text-[#111111]']">
    <div class="max-w-3xl mx-auto px-5 sm:px-8 py-12 sm:py-16">
      <!-- Masthead -->
      <div class="flex items-start justify-between gap-6 mb-10">
        <div>
          <p :class="['text-[11px] tracking-[0.2em] uppercase mb-2', isDark ? 'text-gray-500' : 'text-[#8A8A8A]']">
            {{ t('blogCreate.composeNew') }}
          </p>
          <h1 :class="['font-display italic text-[34px] sm:text-[42px] leading-[1.05]', isDark ? 'text-white' : 'text-[#111111]']">
            {{ t('blogCreate.writeSomething') }}<br class="hidden sm:block" />
            {{ t('blogCreate.worthReading') }}
          </h1>
          <p v-if="draftStatus" :class="['sm:hidden text-[10px] mt-2 italic', isDark ? 'text-gray-500' : 'text-[#8A8A8A]']">
            {{ draftStatus }}
          </p>
        </div>
        <div class="hidden sm:block text-right pt-1 shrink-0">
          <p :class="['text-[11px] tracking-[0.15em] uppercase', isDark ? 'text-gray-500' : 'text-[#B0B0B0]']">
            {{ todayStamp }}
          </p>
          <p :class="['text-[11px] tabular-nums mt-0.5', isDark ? 'text-gray-500' : 'text-[#B0B0B0]']">{{ contentLength }} {{ t('blogCreate.chars') }}</p>
          <p
            v-if="draftStatus"
            :class="['text-[10px] mt-1.5 italic transition-all duration-300', isDark ? 'text-gray-500' : 'text-[#8A8A8A]']"
          >
            {{ draftStatus }}
          </p>
        </div>
      </div>

      <!-- Feedback -->
      <div v-if="successMessage" :class="['mb-6 border-l-2 px-4 py-3', isDark ? 'border-white bg-white/[0.03]' : 'border-[#111111] bg-[#FAFAFA]']">
        <p :class="['text-sm', isDark ? 'text-white' : 'text-[#111111]']">{{ successMessage }}</p>
      </div>
      <div v-if="formError" :class="['mb-6 border-l-2 px-4 py-3', isDark ? 'border-red-500 bg-red-500/10' : 'border-[#B3261E] bg-[#FDF7F6]']">
        <p :class="['text-sm', isDark ? 'text-red-400' : 'text-[#8C1D14]']">{{ formError }}</p>
      </div>

      <form @submit.prevent="handleSubmit">
        <div
          :class="[
            'relative border rounded-[3px] shadow-[0_1px_2px_rgba(0,0,0,0.03),0_18px_40px_-16px_rgba(0,0,0,0.14)]',
            isDark ? 'border-white/10 bg-white/[0.02]' : 'border-[#E7E7E7] bg-white',
          ]"
        >
          <!-- decorative margin ruler -->
          <div
            :class="[
              'hidden md:block absolute left-0 top-0 bottom-0 w-6 opacity-70',
              isDark
                ? 'bg-[repeating-linear-gradient(to_bottom,rgba(255,255,255,0.1)_0,rgba(255,255,255,0.1)_1px,transparent_1px,transparent_10px)]'
                : 'bg-[repeating-linear-gradient(to_bottom,#E7E7E7_0,#E7E7E7_1px,transparent_1px,transparent_10px)]',
            ]"
          ></div>

          <div class="md:pl-6">
            <!-- Status -->
            <div
              :class="['flex items-center justify-between px-6 sm:px-10 pt-7 pb-5 border-b', isDark ? 'border-white/10' : 'border-[#F0F0F0]']"
            >
              <span :class="['text-[11px] tracking-[0.15em] uppercase', isDark ? 'text-gray-500' : 'text-[#8A8A8A]']">{{ t('blogCreate.status') }}</span>
              <div class="flex items-center gap-5">
                <button
                  v-for="opt in statusOptions"
                  :key="opt.value"
                  type="button"
                  @click="status = opt.value"
                  class="text-[13px] pb-0.5 border-b transition-colors"
                  :class="
                    status === opt.value
                      ? (isDark ? 'text-white border-white font-medium' : 'text-[#111111] border-[#111111] font-medium')
                      : (isDark ? 'text-gray-500 border-transparent hover:text-gray-300' : 'text-[#B0B0B0] border-transparent hover:text-[#6B6B6B]')
                  "
                >
                  {{ opt.label }}
                </button>
              </div>
            </div>

            <!-- Title -->
            <div
              :class="['grid md:grid-cols-[140px_1fr] gap-x-8 px-6 sm:px-10 py-8 border-b', isDark ? 'border-white/10' : 'border-[#F0F0F0]']"
            >
              <label
                for="title"
                :class="['text-[11px] tracking-[0.15em] uppercase pt-1', isDark ? 'text-gray-500' : 'text-[#8A8A8A]']"
              >
                {{ t('blogCreate.title') }} <span :class="isDark ? 'text-red-400' : 'text-[#B3261E]'">*</span>
              </label>
              <div>
                <input
                  id="title"
                  v-model="title"
                  type="text"
                  :maxlength="BLOG_TITLE_MAX_LENGTH"
                  :class="[
                    'w-full p-3 text-[22px] font-display border-0 border-b focus:ring-0 pb-2 bg-transparent transition-colors',
                    isDark ? 'text-white placeholder-gray-600 border-white/15 focus:border-white' : 'text-[#111111] placeholder-[#C9C9C9] border-[#E7E7E7] focus:border-[#111111]',
                  ]"
                  :placeholder="t('blogCreate.titlePlaceholder')"
                />
                <p :class="['mt-2 text-[11px] tabular-nums', isDark ? 'text-gray-500' : 'text-[#B0B0B0]']">
                  {{ title.length }} / {{ BLOG_TITLE_MAX_LENGTH }}
                </p>
              </div>
            </div>

            <!-- Content -->
            <div
              :class="['grid md:grid-cols-[140px_1fr] gap-x-8 px-6 sm:px-10 py-8 border-b', isDark ? 'border-white/10' : 'border-[#F0F0F0]']"
            >
              <label :class="['text-[11px] tracking-[0.15em] uppercase pt-1', isDark ? 'text-gray-500' : 'text-[#8A8A8A]']">
                {{ t('blogCreate.body') }} <span :class="isDark ? 'text-red-400' : 'text-[#B3261E]'">*</span>
              </label>
              <div>
                <BlogEditor v-model="content" />
                <p :class="['mt-2 text-[11px] text-right tabular-nums', isDark ? 'text-gray-500' : 'text-[#B0B0B0]']">
                  {{ contentLength }} {{ t('blogCreate.characters') }}
                </p>
              </div>
            </div>

            <!-- Excerpt -->
            <div
              :class="['grid md:grid-cols-[140px_1fr] gap-x-8 px-6 sm:px-10 py-8 border-b', isDark ? 'border-white/10' : 'border-[#F0F0F0]']"
            >
              <label
                for="excerpt"
                :class="['text-[11px] tracking-[0.15em] uppercase pt-1', isDark ? 'text-gray-500' : 'text-[#8A8A8A]']"
              >
                {{ t('blogCreate.excerpt') }}
              </label>
              <div>
                <textarea
                  id="excerpt"
                  v-model="excerpt"
                  rows="2"
                  :maxlength="BLOG_EXCERPT_LENGTH"
                  :class="[
                    'w-full text-[14px] border rounded-[2px] focus:ring-0 px-3 py-2.5 resize-none transition-colors',
                    isDark
                      ? 'bg-white/[0.03] text-white placeholder-gray-600 border-white/15 focus:border-white'
                      : 'text-[#111111] placeholder-[#C9C9C9] border-[#E7E7E7] focus:border-[#111111]',
                  ]"
                  :placeholder="t('blogCreate.excerptPlaceholder')"
                ></textarea>
                <p :class="['mt-2 text-[11px] text-right tabular-nums', isDark ? 'text-gray-500' : 'text-[#B0B0B0]']">
                  {{ excerpt.length }} / {{ BLOG_EXCERPT_LENGTH }}
                </p>
              </div>
            </div>

            <!-- Cover image -->
            <div
              :class="['grid md:grid-cols-[140px_1fr] gap-x-8 px-6 sm:px-10 py-8 border-b', isDark ? 'border-white/10' : 'border-[#F0F0F0]']"
            >
              <label :class="['text-[11px] tracking-[0.15em] uppercase pt-1', isDark ? 'text-gray-500' : 'text-[#8A8A8A]']">
                {{ t('blogCreate.cover') }}
              </label>
              <div>
                <div
                  v-if="coverPreview"
                  :class="['relative border rounded-[2px] overflow-hidden mb-3', isDark ? 'border-white/10' : 'border-[#E7E7E7]']"
                >
                  <img
                    :src="coverPreview"
                    alt="Cover preview"
                    class="w-full max-h-56 object-cover"
                  />
                </div>
                <div
                  v-else
                  :class="['border border-dashed rounded-[2px] h-28 flex items-center justify-center mb-3', isDark ? 'border-white/20' : 'border-[#D8D8D8]']"
                >
                  <span :class="['text-[12px]', isDark ? 'text-gray-500' : 'text-[#B0B0B0]']">{{ t('blogCreate.noImage') }}</span>
                </div>

                <div class="flex items-center gap-3">
                  <input
                    id="coverImage"
                    type="file"
                    accept="image/*"
                    class="sr-only"
                    @change="handleCoverChange"
                  />
                  <label
                    for="coverImage"
                    :class="[
                      'inline-flex items-center px-3.5 py-1.5 border rounded-[2px] text-[12px] font-medium transition-colors cursor-pointer',
                      isDark ? 'border-white text-white hover:bg-white hover:text-black' : 'border-[#111111] text-[#111111] hover:bg-[#111111] hover:text-white',
                    ]"
                  >
                    {{ coverPreview ? t('blogCreate.replace') : t('blogCreate.uploadImage') }}
                  </label>
                  <button
                    v-if="coverPreview"
                    type="button"
                    @click="removeCover"
                    :class="['text-[12px] transition-colors', isDark ? 'text-gray-500 hover:text-red-400' : 'text-[#B0B0B0] hover:text-[#B3261E]']"
                  >
                    {{ t('blogCreate.remove') }}
                  </button>
                  <span :class="['text-[11px] ml-auto', isDark ? 'text-gray-600' : 'text-[#C4C4C4]']"
                    >{{ t('blogCreate.maxFileSize', { max: MAX_FILE_SIZE / 1024 / 1024 }) }}</span
                  >
                </div>
              </div>
            </div>

            <!-- Tags -->
            <div
              :class="['grid md:grid-cols-[140px_1fr] gap-x-8 px-6 sm:px-10 py-8 border-b', isDark ? 'border-white/10' : 'border-[#F0F0F0]']"
            >
              <label for="tags" :class="['text-[11px] tracking-[0.15em] uppercase pt-1', isDark ? 'text-gray-500' : 'text-[#8A8A8A]']">
                {{ t('blogCreate.tags') }}
              </label>
              <div>
                <input
                  id="tags"
                  v-model="tagsInput"
                  type="text"
                  :class="[
                    'w-full text-[14px] border-0 border-b focus:ring-0 p-3 bg-transparent transition-colors',
                    isDark ? 'text-white placeholder-gray-600 border-white/15 focus:border-white' : 'text-[#111111] placeholder-[#C9C9C9] border-[#E7E7E7] focus:border-[#111111]',
                  ]"
                  :placeholder="t('blogCreate.tagsPlaceholder')"
                />
                <div v-if="parsedTags.length" class="flex flex-wrap gap-1.5 mt-3">
                  <span
                    v-for="tag in parsedTags"
                    :key="tag"
                    :class="['text-[11px] border rounded-full px-2.5 py-0.5', isDark ? 'text-gray-300 border-white/15' : 'text-[#4B4B4B] border-[#E7E7E7]']"
                  >
                    {{ tag }}
                  </span>
                </div>
                <p v-else :class="['mt-2 text-[11px]', isDark ? 'text-gray-600' : 'text-[#C4C4C4]']">
                  {{ t('blogCreate.tagsHint') }}
                </p>
              </div>
            </div>

            <!-- Music -->
            <div class="grid md:grid-cols-[140px_1fr] gap-x-8 px-6 sm:px-10 py-8">
              <label :class="['text-[11px] tracking-[0.15em] uppercase pt-1', isDark ? 'text-gray-500' : 'text-[#8A8A8A]']">
                {{ t('blogCreate.soundtrack') }}
              </label>
              <div>
                <!-- Selected -->
                <div
                  v-if="selectedMusic"
                  :class="['flex items-center gap-4 border rounded-[2px] p-3', isDark ? 'border-white' : 'border-[#111111]']"
                >
                  <img
                    v-if="selectedMusic.cover"
                    :src="selectedMusic.cover"
                    :alt="selectedMusic.title"
                    class="h-12 w-12 rounded-[2px] object-cover shrink-0"
                  />
                  <div class="flex-1 min-w-0">
                    <p :class="['text-[13px] font-medium truncate', isDark ? 'text-white' : 'text-[#111111]']">
                      {{ selectedMusic.title }}
                    </p>
                    <p :class="['text-[12px] truncate', isDark ? 'text-gray-500' : 'text-[#8A8A8A]']">
                      {{ selectedMusic.artist }}
                    </p>
                  </div>
                  <button
                    type="button"
                    @click="selectedMusic = null"
                    :class="['text-[12px] transition-colors shrink-0', isDark ? 'text-gray-500 hover:text-red-400' : 'text-[#B0B0B0] hover:text-[#B3261E]']"
                  >
                    {{ t('blogCreate.remove') }}
                  </button>
                </div>

                <!-- Search -->
                <div v-else class="flex items-center gap-3">
                  <input
                    v-model="searchQuery"
                    type="text"
                    :class="[
                      'flex-1 text-[14px] border-0 border-b focus:ring-0 p-3 bg-transparent transition-colors',
                      isDark ? 'text-white placeholder-gray-600 border-white/15 focus:border-white' : 'text-[#111111] placeholder-[#C9C9C9] border-[#E7E7E7] focus:border-[#111111]',
                    ]"
                    :placeholder="t('blogCreate.searchTrack')"
                    @keyup.enter.prevent="searchMusic"
                  />
                  <svg
                    v-if="musicSearching"
                    :class="['animate-spin h-4 w-4 shrink-0', isDark ? 'text-white' : 'text-[#111111]']"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
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
                </div>

                <!-- Results -->
                <div
                  v-if="musicResults.length"
                  :class="['mt-3 border rounded-[2px] divide-y', isDark ? 'border-white/10 divide-white/10' : 'border-[#E7E7E7] divide-[#F0F0F0]']"
                >
                  <button
                    v-for="track in musicResults"
                    :key="track.trackId"
                    type="button"
                    @click="selectTrack(track)"
                    :class="['w-full flex items-center gap-3 p-2.5 text-left transition-colors', isDark ? 'hover:bg-white/5' : 'hover:bg-[#FAFAFA]']"
                  >
                    <img
                      v-if="track.cover"
                      :src="track.cover"
                      :alt="track.title"
                      class="h-9 w-9 rounded-[2px] object-cover shrink-0"
                    />
                    <div class="flex-1 min-w-0">
                      <p :class="['text-[13px] font-medium truncate', isDark ? 'text-white' : 'text-[#111111]']">
                        {{ track.title }}
                      </p>
                      <p :class="['text-[11px] truncate', isDark ? 'text-gray-500' : 'text-[#8A8A8A]']">
                        {{ track.artist }}
                      </p>
                    </div>
                    <span :class="['text-[11px] tabular-nums shrink-0', isDark ? 'text-gray-600' : 'text-[#C4C4C4]']">{{
                      formatDuration(track.duration)
                    }}</span>
                  </button>
                </div>
                <p v-if="musicSearchError" :class="['mt-2 text-[12px]', isDark ? 'text-red-400' : 'text-[#B3261E]']">
                  {{ musicSearchError }}
                </p>
                <p v-else :class="['mt-2 text-[11px]', isDark ? 'text-gray-600' : 'text-[#C4C4C4]']">
                  {{ t('blogCreate.trackOptional') }}
                </p>
              </div>
            </div>
          </div>
        </div>

        <!-- Actions -->
        <div class="flex items-center justify-end gap-3 mt-6">
          <button
            type="button"
            @click="router.push('/blogs')"
            :class="['px-4 py-2 text-[13px] font-medium transition-colors', isDark ? 'text-gray-400 hover:text-white' : 'text-[#6B6B6B] hover:text-[#111111]']"
          >
            {{ t('blogCreate.cancel') }}
          </button>
          <button
            type="submit"
            :disabled="saving"
            :class="[
              'inline-flex items-center px-5 py-2.5 rounded-[2px] text-[13px] font-medium shadow-[0_1px_2px_rgba(0,0,0,0.05),0_10px_20px_-8px_rgba(0,0,0,0.35)] disabled:opacity-50 transition-colors',
              isDark ? 'bg-white text-black hover:bg-gray-200' : 'bg-[#111111] text-white hover:bg-black',
            ]"
          >
            <svg
              v-if="saving"
              :class="['animate-spin -ml-1 mr-2 h-3.5 w-3.5', isDark ? 'text-black' : 'text-white']"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                class="opacity-20"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                stroke-width="4"
              ></circle>
              <path
                class="opacity-90"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
              ></path>
            </svg>
            {{ saving ? t('blogCreate.publishing') : t('blogCreate.createPost') }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { useAuthStore } from '@/stores/auth'
import { useTheme } from '@/composables/useTheme'
import { blogAPI, musicAPI } from '@/services/api'
import BlogEditor from '@/components/BlogEditor.vue'
import { debounce } from '@/utils/helpers'
import {
  BLOG_TITLE_MAX_LENGTH,
  BLOG_EXCERPT_LENGTH,
  MAX_FILE_SIZE,
  ALLOWED_IMAGE_TYPES,
} from '@/utils/constants'

const router = useRouter()
const authStore = useAuthStore()
const { t, locale } = useI18n()
const { isDark } = useTheme()
const draftStatus = ref('')

// Form state
const title = ref('')
const content = ref(null)
const excerpt = ref('')
const tagsInput = ref('')
const status = ref('draft')

const statusOptions = computed(() => [
  { value: 'draft', label: t('blogCreate.statusDraft') },
  { value: 'private', label: t('blogCreate.statusPrivate') },
  { value: 'published', label: t('blogCreate.statusPublished') },
])

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

const todayStamp = computed(() =>
  new Date().toLocaleDateString(locale.value === 'en' ? 'en-US' : 'id-ID', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }),
)

const parsedTags = computed(() =>
  tagsInput.value
    .split(',')
    .map((tag) => tag.trim())
    .filter(Boolean),
)

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
    formError.value = t('blogCreate.invalidFileType')
    return
  }

  if (file.size > MAX_FILE_SIZE) {
    formError.value = t('blogCreate.fileTooLarge', { max: MAX_FILE_SIZE / 1024 / 1024 })
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
      musicSearchError.value = t('blogCreate.noTracksFound')
    }
  } catch (err) {
    musicSearchError.value = err.response?.data?.message || t('blogCreate.searchFailed')
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

// Draft auto-save logic
const getDraftKey = () => `noya_draft_${authStore.user?._id || authStore.user?.id || 'guest'}`

const saveDraft = () => {
  // Hanya save jika ada title, content, atau excerpt yang diisi
  if (
    !title.value.trim() &&
    (!content.value || contentLength.value === 0) &&
    !excerpt.value.trim()
  ) {
    return
  }

  draftStatus.value = t('blogCreate.saving')
  const draftData = {
    title: title.value,
    content: content.value,
    excerpt: excerpt.value,
    tagsInput: tagsInput.value,
    selectedMusic: selectedMusic.value,
    status: status.value,
  }
  localStorage.setItem(getDraftKey(), JSON.stringify(draftData))

  // Update status saved setelah delay kecil
  setTimeout(() => {
    if (draftStatus.value === t('blogCreate.saving')) {
      draftStatus.value = t('blogCreate.draftSaved')
    }
  }, 500)
}

const debouncedSaveDraft = debounce(saveDraft, 1000)

// Watch form inputs to trigger auto-save
watch(
  [title, content, excerpt, tagsInput, selectedMusic, status],
  () => {
    debouncedSaveDraft()
  },
  { deep: true },
)

// Load draft from localStorage on mount
onMounted(() => {
  const saved = localStorage.getItem(getDraftKey())
  if (saved) {
    try {
      const parsed = JSON.parse(saved)
      if (parsed.title) title.value = parsed.title
      if (parsed.content) content.value = parsed.content
      if (parsed.excerpt) excerpt.value = parsed.excerpt
      if (parsed.tagsInput) tagsInput.value = parsed.tagsInput
      if (parsed.selectedMusic) selectedMusic.value = parsed.selectedMusic
      if (parsed.status) status.value = parsed.status

      draftStatus.value = t('blogCreate.draftRestored')
      setTimeout(() => {
        draftStatus.value = t('blogCreate.draftSaved')
      }, 3000)
    } catch (e) {
      console.error('Failed to restore draft', e)
    }
  }
})

const handleSubmit = async () => {
  formError.value = ''
  successMessage.value = ''

  if (!title.value.trim()) {
    formError.value = t('blogCreate.titleRequired')
    return
  }
  if (title.value.trim().length < 3) {
    formError.value = t('blogCreate.titleTooShort')
    return
  }
  if (contentLength.value < 10) {
    formError.value = t('blogCreate.contentTooShort')
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
    successMessage.value = t('blogCreate.createdSuccess')
    localStorage.removeItem(getDraftKey())
    const blog = response.data.blog
    if (blog?.slug) {
      router.push(`/blogs/${blog.slug}`)
    } else {
      router.push('/blogs')
    }
  } catch (err) {
    formError.value = err.response?.data?.message || t('blogCreate.createFailed')
  } finally {
    saving.value = false
  }
}
</script>

<style scoped>
.font-display {
  font-family: 'Fraunces', ui-serif, Georgia, serif;
}
</style>