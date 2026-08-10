<template>
  <div
    :class="[
      'min-h-screen transition-colors duration-300 relative overflow-x-hidden',
      isDark ? 'bg-[#060608] text-white' : 'bg-[#fafaf9] text-stone-900',
    ]"
  >
    <!-- Ambient glowing backgrounds -->
    <div
      :class="[
        'absolute top-0 left-1/4 w-[500px] h-[500px] rounded-full blur-[120px] pointer-events-none transition-colors duration-300',
        isDark ? 'bg-purple-600/5' : 'bg-purple-500/[0.02]',
      ]"
    ></div>

    <main class="w-full max-w-3xl mx-auto px-6 py-12 md:py-20">
      <!-- Header -->
      <div class="text-center mb-10">
        <div
          :class="[
            'inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium border mb-4',
            isDark ? 'bg-white/[0.04] border-white/[0.08] text-purple-200' : 'bg-purple-50 border-purple-100 text-purple-700',
          ]"
        >
          <span class="flex h-2 w-2 rounded-full bg-purple-500 animate-pulse"></span>
          {{ t('setupProfile.stepBadge') }}
        </div>
        <h1
          :class="[
            'font-display italic text-3xl sm:text-4xl leading-tight tracking-tight',
            isDark ? 'text-white' : 'text-stone-900',
          ]"
        >
          {{ t('setupProfile.title') }}
        </h1>
        <p :class="['text-sm mt-2', isDark ? 'text-gray-400' : 'text-stone-500']">
          {{ t('setupProfile.subtitle') }}
        </p>
      </div>

      <!-- Error message -->
      <div
        v-if="formError"
        class="mb-6 rounded-xl bg-red-500/10 border border-red-500/20 p-4"
      >
        <p class="text-sm font-medium text-red-200">{{ formError }}</p>
      </div>

      <div class="space-y-8">
        <!-- Display name -->
        <section
          :class="[
            'border rounded-3xl p-6 sm:p-8 backdrop-blur-xl transition-all duration-300',
            isDark ? 'bg-white/[0.02] border-white/[0.08]' : 'bg-white border-stone-200 shadow-xl shadow-stone-100',
          ]"
        >
          <h2 :class="['text-lg font-semibold mb-3', isDark ? 'text-white' : 'text-stone-900']">
            {{ t('setupProfile.displayNameTitle') }}
          </h2>
          <p :class="['text-sm mb-4', isDark ? 'text-gray-400' : 'text-stone-500']">
            {{ t('setupProfile.displayNameHint') }}
          </p>

          <label
            for="display-name"
            :class="['block text-xs font-medium uppercase tracking-wider mb-2', isDark ? 'text-gray-400' : 'text-stone-400']"
          >
            {{ t('setupProfile.displayNameTitle') }}
          </label>
          <input
            id="display-name"
            v-model="displayName"
            type="text"
            :maxlength="NAME_MAX_LENGTH"
            :placeholder="t('setupProfile.displayNamePlaceholder')"
            :class="[
              'block w-full rounded-xl border px-4 py-3 text-sm transition-colors duration-300',
              'focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500',
              isDark
                ? 'bg-white/[0.03] border-white/[0.1] text-white placeholder-gray-500'
                : 'border-stone-300 bg-white text-stone-900 placeholder-stone-400',
            ]"
          />
          <p :class="['mt-2 text-right text-xs', isDark ? 'text-gray-500' : 'text-stone-400']">
            {{ displayName.length }}/{{ NAME_MAX_LENGTH }}
          </p>
        </section>

        <!-- Avatar picker -->
        <section
          :class="[
            'border rounded-3xl p-6 sm:p-8 backdrop-blur-xl transition-all duration-300',
            isDark ? 'bg-white/[0.02] border-white/[0.08]' : 'bg-white border-stone-200 shadow-xl shadow-stone-100',
          ]"
        >
          <h2 :class="['text-lg font-semibold mb-3', isDark ? 'text-white' : 'text-stone-900']">
            {{ t('setupProfile.avatarTitle') }}
          </h2>
          <p :class="['text-sm mb-6', isDark ? 'text-gray-400' : 'text-stone-500']">
            {{ t('setupProfile.avatarHint') }}
          </p>

          <div v-if="avatarsLoading" class="flex flex-col items-center py-10">
            <div class="h-8 w-8 animate-spin rounded-full border-2 border-purple-500/20 border-t-purple-500"></div>
            <p class="mt-3 text-sm text-purple-300">{{ t('setupProfile.loadingAvatars') }}</p>
          </div>

          <template v-else>
            <div class="flex items-center justify-center mb-8">
              <!-- Preview avatar yang terpilih -->
              <div class="relative">
                <img
                  v-if="selectedAvatar"
                  :src="selectedAvatar"
                  :alt="t('setupProfile.previewAlt')"
                  class="h-28 w-28 rounded-full object-cover ring-4 ring-purple-500/40"
                />
                <div
                  v-else
                  :class="[
                    'h-28 w-28 rounded-full flex items-center justify-center text-3xl font-semibold transition-colors duration-300',
                    isDark ? 'bg-[#111111] text-white' : 'bg-stone-200 text-stone-700',
                  ]"
                >
                  {{ getInitials(displayName || authStore.userDisplayName) }}
                </div>
              </div>
            </div>

            <!-- Avatar grid -->
            <div
              v-if="femaleAvatars.length"
              :class="['text-xs font-medium uppercase tracking-wider mb-3', isDark ? 'text-gray-400' : 'text-stone-400']"
            >
              {{ t('setupProfile.femaleGroup') }}
            </div>
            <div v-if="femaleAvatars.length" class="grid grid-cols-4 sm:grid-cols-5 gap-4 mb-8">
              <button
                v-for="url in femaleAvatars"
                :key="url"
                type="button"
                @click="selectAvatar(url)"
                :class="[
                  'relative rounded-full overflow-hidden transition-all duration-200 cursor-pointer',
                  selectedAvatar === url
                    ? 'ring-4 ring-purple-500 scale-105'
                    : isDark
                      ? 'ring-2 ring-transparent hover:ring-purple-500/40'
                      : 'ring-2 ring-transparent hover:ring-purple-500/30',
                ]"
              >
                <img :src="url" :alt="t('setupProfile.avatarAlt')" class="h-16 w-16 sm:h-20 sm:w-20 object-cover" />
              </button>
            </div>

            <div
              v-if="maleAvatars.length"
              :class="['text-xs font-medium uppercase tracking-wider mb-3', isDark ? 'text-gray-400' : 'text-stone-400']"
            >
              {{ t('setupProfile.maleGroup') }}
            </div>
            <div v-if="maleAvatars.length" class="grid grid-cols-4 sm:grid-cols-5 gap-4">
              <button
                v-for="url in maleAvatars"
                :key="url"
                type="button"
                @click="selectAvatar(url)"
                :class="[
                  'relative rounded-full overflow-hidden transition-all duration-200 cursor-pointer',
                  selectedAvatar === url
                    ? 'ring-4 ring-purple-500 scale-105'
                    : isDark
                      ? 'ring-2 ring-transparent hover:ring-purple-500/40'
                      : 'ring-2 ring-transparent hover:ring-purple-500/30',
                ]"
              >
                <img :src="url" :alt="t('setupProfile.avatarAlt')" class="h-16 w-16 sm:h-20 sm:w-20 object-cover" />
              </button>
            </div>

            <p v-if="!femaleAvatars.length && !maleAvatars.length" :class="['text-center text-sm py-6', isDark ? 'text-gray-400' : 'text-stone-500']">
              {{ t('setupProfile.noAvatars') }}
            </p>
          </template>
        </section>

        <!-- Actions -->
        <section class="flex flex-col sm:flex-row justify-end gap-3">
          <button
            type="button"
            @click="handleSkip"
            :disabled="saving"
            :class="[
              'px-6 py-3 rounded-full text-sm font-medium transition-all duration-300 cursor-pointer disabled:opacity-50 border',
              isDark
                ? 'text-gray-300 border-white/10 hover:text-white hover:bg-white/5'
                : 'text-stone-600 border-stone-200 hover:text-stone-900 hover:bg-stone-50',
            ]"
          >
            {{ t('setupProfile.skip') }}
          </button>
          <button
            type="button"
            @click="handleSubmit"
            :disabled="saving || !displayName.trim()"
            class="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-purple-600 hover:bg-purple-700 text-white font-semibold text-sm transition-all duration-300 transform hover:scale-105 cursor-pointer shadow-lg shadow-purple-600/10 disabled:opacity-50 disabled:hover:scale-100"
          >
            <svg
              v-if="saving"
              class="animate-spin -ml-1 h-4 w-4 text-white"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
            </svg>
            {{ saving ? t('setupProfile.saving') : t('setupProfile.finish') }}
          </button>
        </section>
      </div>
    </main>
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { useAuthStore } from '@/stores/auth'
import { useTheme } from '@/composables/useTheme'
import { profileAPI } from '@/services/api'
import { getInitials } from '@/utils/helpers'
import { NAME_MAX_LENGTH } from '@/utils/constants'

const router = useRouter()
const authStore = useAuthStore()
const { t } = useI18n()

// Reactive terhadap perubahan class `dark` di <html>, dari mana pun
// dark mode di-toggle (bukan cuma dibaca sekali waktu mount).
const { isDark } = useTheme()

const displayName = ref(authStore.user?.displayName || authStore.user?.name || '')
const selectedAvatar = ref('')

const avatarsLoading = ref(true)
const femaleAvatars = ref([])
const maleAvatars = ref([])

const saving = ref(false)
const formError = ref('')

const selectAvatar = (url) => {
  selectedAvatar.value = selectedAvatar.value === url ? '' : url
  formError.value = ''
}

const fetchAvatars = async () => {
  try {
    const res = await profileAPI.getPresetAvatars()
    femaleAvatars.value = res.data?.avatars?.female || []
    maleAvatars.value = res.data?.avatars?.male || []
  } catch (err) {
    console.warn('Failed to load preset avatars:', err)
  } finally {
    avatarsLoading.value = false
  }
}

const handleSubmit = async () => {
  formError.value = ''
  const name = displayName.value.trim()
  if (!name) return
  if (name.length < 2) {
    formError.value = t('setupProfile.nameTooShort')
    return
  }

  saving.value = true
  try {
    const result = await authStore.completeOnboarding({
      displayName: name,
      avatarUrl: selectedAvatar.value || undefined,
    })
    if (result.success) {
      router.push('/')
    } else {
      formError.value = result.error
    }
  } finally {
    saving.value = false
  }
}

const handleSkip = async () => {
  formError.value = ''
  if (!displayName.value.trim()) {
    formError.value = t('setupProfile.nameRequired')
    return
  }
  await handleSubmit()
}

onMounted(() => {
  fetchAvatars()
})
</script>

<style scoped>
.font-display {
  font-family: 'Fraunces', ui-serif, Georgia, serif;
}
</style>