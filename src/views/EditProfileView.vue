<template>
  <div class="min-h-screen bg-gray-50 py-10">
    <div class="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
      <!-- Header -->
      <div class="mb-8 flex items-center justify-between">
        <div>
          <h1 class="text-2xl font-semibold text-gray-900">{{ t('editProfile.title') }}</h1>
          <p class="mt-1 text-sm text-gray-500">{{ t('editProfile.subtitle') }}</p>
        </div>
        <button
          @click="router.push('/profile')"
          class="text-sm font-medium text-gray-500 hover:text-gray-900 transition-colors"
        >
          &larr; {{ t('editProfile.back') }}
        </button>
      </div>

      <!-- Success message -->
      <div v-if="successMessage" class="mb-6 rounded-lg bg-green-50 border border-green-200 p-4">
        <p class="text-sm font-medium text-green-800">{{ successMessage }}</p>
      </div>

      <!-- Error message -->
      <div v-if="formError" class="mb-6 rounded-lg bg-red-50 border border-red-200 p-4">
        <p class="text-sm font-medium text-red-800">{{ formError }}</p>
      </div>

      <form @submit.prevent="handleSubmit" class="space-y-6">
        <!-- Profile picture -->
        <div class="bg-white border border-gray-200 rounded-xl shadow-sm p-6 sm:p-8">
          <h2 class="text-sm font-semibold text-gray-900 mb-5">{{ t('editProfile.picture') }}</h2>
          <div class="flex items-center gap-6">
            <img
              v-if="picturePreview"
              :src="picturePreview"
              alt="Profile preview"
              class="h-20 w-20 rounded-full object-cover border border-gray-200 shrink-0"
            />
            <div
              v-else
              class="h-20 w-20 rounded-full bg-[#111111] flex items-center justify-center text-white text-2xl font-semibold shrink-0"
            >
              {{ getInitials(displayName || authStore.userDisplayName) }}
            </div>
            <div class="flex-1">
              <input
                id="picture"
                type="file"
                accept="image/*"
                class="sr-only"
                @change="handlePictureChange"
              />
              <div class="flex items-center gap-3">
                <label
                  for="picture"
                  class="inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 cursor-pointer transition-colors"
                >
                  {{ t('editProfile.uploadPhoto') }}
                </label>
                <button
                  v-if="pictureFile || authStore.user?.picture"
                  type="button"
                  @click="removePicture"
                  class="text-sm font-medium text-gray-400 hover:text-red-600 transition-colors"
                >
                  {{ t('editProfile.remove') }}
                </button>
              </div>
              <p class="mt-2 text-xs text-gray-400">
                {{ t('editProfile.fileHint', { max: MAX_FILE_SIZE / 1024 / 1024 }) }}
              </p>
            </div>
          </div>
        </div>

        <!-- Basic information -->
        <div class="bg-white border border-gray-200 rounded-xl shadow-sm p-6 sm:p-8">
          <h2 class="text-sm font-semibold text-gray-900 mb-5">{{ t('editProfile.basicInfo') }}</h2>
          <div class="grid grid-cols-1 gap-5 sm:grid-cols-2">
            <div class="sm:col-span-2">
              <label for="displayName" class="block text-sm font-medium text-gray-700">
                {{ t('editProfile.username') }}
              </label>
              <input
                id="displayName"
                v-model="displayName"
                type="text"
                :maxlength="NAME_MAX_LENGTH"
                class="mt-1.5 block w-full rounded-lg border-gray-300 shadow-sm focus:border-[#111111] focus:ring-[#111111] sm:text-sm"
                :placeholder="t('editProfile.usernamePlaceholder')"
              />
            </div>
            <div>
              <label for="firstName" class="block text-sm font-medium text-gray-700">
                {{ t('editProfile.firstName') }}
              </label>
              <input
                id="firstName"
                v-model="firstName"
                type="text"
                :maxlength="NAME_MAX_LENGTH"
                class="mt-1.5 block w-full rounded-lg border-gray-300 shadow-sm focus:border-[#111111] focus:ring-[#111111] sm:text-sm"
              />
            </div>
            <div>
              <label for="lastName" class="block text-sm font-medium text-gray-700">
                {{ t('editProfile.lastName') }}
              </label>
              <input
                id="lastName"
                v-model="lastName"
                type="text"
                :maxlength="NAME_MAX_LENGTH"
                class="mt-1.5 block w-full rounded-lg border-gray-300 shadow-sm focus:border-[#111111] focus:ring-[#111111] sm:text-sm"
              />
            </div>
            <div class="sm:col-span-2">
              <label for="bio" class="block text-sm font-medium text-gray-700"> {{ t('editProfile.bio') }} </label>
              <textarea
                id="bio"
                v-model="bio"
                rows="3"
                :maxlength="BIO_MAX_LENGTH"
                class="mt-1.5 block w-full rounded-lg border-gray-300 shadow-sm focus:border-[#111111] focus:ring-[#111111] sm:text-sm resize-none"
                :placeholder="t('editProfile.bioPlaceholder')"
              ></textarea>
              <p class="mt-1 text-xs text-gray-400 text-right">
                {{ bio.length }} / {{ BIO_MAX_LENGTH }}
              </p>
            </div>
          </div>
        </div>

        <!-- Contact & personal -->
        <div class="bg-white border border-gray-200 rounded-xl shadow-sm p-6 sm:p-8">
          <h2 class="text-sm font-semibold text-gray-900 mb-5">{{ t('editProfile.contactPersonal') }}</h2>
          <div class="grid grid-cols-1 gap-5 sm:grid-cols-2">
            <div>
              <label for="phoneNumber" class="block text-sm font-medium text-gray-700">
                {{ t('editProfile.phoneNumber') }}
              </label>
              <input
                id="phoneNumber"
                v-model="phoneNumber"
                type="tel"
                class="mt-1.5 block w-full rounded-lg border-gray-300 shadow-sm focus:border-[#111111] focus:ring-[#111111] sm:text-sm"
                placeholder="+62 812 3456 7890"
              />
            </div>
            <div>
              <label for="dateOfBirth" class="block text-sm font-medium text-gray-700">
                {{ t('editProfile.dateOfBirth') }}
              </label>
              <input
                id="dateOfBirth"
                v-model="dateOfBirth"
                type="date"
                class="mt-1.5 block w-full rounded-lg border-gray-300 shadow-sm focus:border-[#111111] focus:ring-[#111111] sm:text-sm"
              />
            </div>
            <div>
              <label for="gender" class="block text-sm font-medium text-gray-700"> {{ t('editProfile.gender') }} </label>
              <select
                id="gender"
                v-model="gender"
                class="mt-1.5 block w-full rounded-lg border-gray-300 shadow-sm focus:border-[#111111] focus:ring-[#111111] sm:text-sm"
              >
                <option value="">{{ t('editProfile.genderPreferNot') }}</option>
                <option value="male">{{ t('editProfile.genderMale') }}</option>
                <option value="female">{{ t('editProfile.genderFemale') }}</option>
                <option value="other">{{ t('editProfile.genderOther') }}</option>
                <option value="prefer_not_to_say">{{ t('editProfile.genderPreferNot') }}</option>
              </select>
            </div>
          </div>
        </div>

        <!-- Address -->
        <div class="bg-white border border-gray-200 rounded-xl shadow-sm p-6 sm:p-8">
          <h2 class="text-sm font-semibold text-gray-900 mb-5">{{ t('editProfile.address') }}</h2>
          <div class="grid grid-cols-1 gap-5 sm:grid-cols-2">
            <div class="sm:col-span-2">
              <label for="street" class="block text-sm font-medium text-gray-700"> {{ t('editProfile.street') }} </label>
              <input
                id="street"
                v-model="street"
                type="text"
                class="mt-1.5 block w-full rounded-lg border-gray-300 shadow-sm focus:border-[#111111] focus:ring-[#111111] sm:text-sm"
              />
            </div>
            <div>
              <label for="city" class="block text-sm font-medium text-gray-700"> {{ t('editProfile.city') }} </label>
              <input
                id="city"
                v-model="city"
                type="text"
                class="mt-1.5 block w-full rounded-lg border-gray-300 shadow-sm focus:border-[#111111] focus:ring-[#111111] sm:text-sm"
              />
            </div>
            <div>
              <label for="state" class="block text-sm font-medium text-gray-700"> {{ t('editProfile.state') }} </label>
              <input
                id="state"
                v-model="state"
                type="text"
                class="mt-1.5 block w-full rounded-lg border-gray-300 shadow-sm focus:border-[#111111] focus:ring-[#111111] sm:text-sm"
              />
            </div>
            <div>
              <label for="postalCode" class="block text-sm font-medium text-gray-700">
                {{ t('editProfile.postalCode') }}
              </label>
              <input
                id="postalCode"
                v-model="postalCode"
                type="text"
                class="mt-1.5 block w-full rounded-lg border-gray-300 shadow-sm focus:border-[#111111] focus:ring-[#111111] sm:text-sm"
              />
            </div>
            <div>
              <label for="country" class="block text-sm font-medium text-gray-700"> {{ t('editProfile.country') }} </label>
              <input
                id="country"
                v-model="country"
                type="text"
                class="mt-1.5 block w-full rounded-lg border-gray-300 shadow-sm focus:border-[#111111] focus:ring-[#111111] sm:text-sm"
              />
            </div>
          </div>
        </div>

        <!-- Social media -->
        <div class="bg-white border border-gray-200 rounded-xl shadow-sm p-6 sm:p-8">
          <h2 class="text-sm font-semibold text-gray-900 mb-5">{{ t('editProfile.socialMedia') }}</h2>
          <div class="grid grid-cols-1 gap-5 sm:grid-cols-2">
            <div class="sm:col-span-2">
              <label for="website" class="block text-sm font-medium text-gray-700"> {{ t('editProfile.website') }} </label>
              <input
                id="website"
                v-model="website"
                type="url"
                class="mt-1.5 block w-full rounded-lg border-gray-300 shadow-sm focus:border-[#111111] focus:ring-[#111111] sm:text-sm"
                placeholder="https://yoursite.com"
              />
            </div>
            <div>
              <label for="instagram" class="block text-sm font-medium text-gray-700">
                Instagram
              </label>
              <input
                id="instagram"
                v-model="instagram"
                type="text"
                class="mt-1.5 block w-full rounded-lg border-gray-300 shadow-sm focus:border-[#111111] focus:ring-[#111111] sm:text-sm"
                placeholder="@username"
              />
            </div>
            <div>
              <label for="twitter" class="block text-sm font-medium text-gray-700">
                {{ t('editProfile.twitter') }}
              </label>
              <input
                id="twitter"
                v-model="twitter"
                type="text"
                class="mt-1.5 block w-full rounded-lg border-gray-300 shadow-sm focus:border-[#111111] focus:ring-[#111111] sm:text-sm"
                placeholder="@username"
              />
            </div>
            <div>
              <label for="linkedin" class="block text-sm font-medium text-gray-700">
                LinkedIn
              </label>
              <input
                id="linkedin"
                v-model="linkedin"
                type="text"
                class="mt-1.5 block w-full rounded-lg border-gray-300 shadow-sm focus:border-[#111111] focus:ring-[#111111] sm:text-sm"
                placeholder="linkedin.com/in/username"
              />
            </div>
          </div>
        </div>

        <!-- Privacy -->
        <div class="bg-white border border-gray-200 rounded-xl shadow-sm p-6 sm:p-8">
          <h2 class="text-sm font-semibold text-gray-900 mb-5">{{ t('editProfile.privacy') }}</h2>
          <div class="flex items-start">
            <input
              id="isPublic"
              v-model="isPublic"
              type="checkbox"
              class="mt-1 h-4 w-4 rounded border-gray-300 text-[#111111] focus:ring-[#111111]"
            />
            <label for="isPublic" class="ml-3 block text-sm text-gray-700">
              <span class="font-medium">{{ t('editProfile.makePublic') }}</span>
              <span class="block text-gray-500">
                {{ t('editProfile.makePublicDesc') }}
              </span>
            </label>
          </div>
        </div>

        <!-- Actions -->
        <div class="flex justify-end space-x-3">
          <button
            type="button"
            @click="router.push('/profile')"
            class="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors"
          >
            {{ t('editProfile.cancel') }}
          </button>
          <button
            type="submit"
            :disabled="saving"
            class="inline-flex items-center px-4 py-2 bg-[#111111] text-white rounded-lg text-sm font-medium hover:bg-black disabled:opacity-50 transition-colors"
          >
            <svg
              v-if="saving"
              class="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                class="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                stroke-width="4"
              ></circle>
              <path
                class="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
              ></path>
            </svg>
            {{ saving ? t('editProfile.saving') : t('editProfile.saveChanges') }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { useAuthStore } from '@/stores/auth'
import { getInitials } from '@/utils/helpers'
import {
  NAME_MAX_LENGTH,
  BIO_MAX_LENGTH,
  MAX_FILE_SIZE,
  ALLOWED_IMAGE_TYPES,
} from '@/utils/constants'

const router = useRouter()
const authStore = useAuthStore()
const { t } = useI18n()

const toDateInput = (value) => {
  if (!value) return ''
  const date = new Date(value)
  if (isNaN(date)) return ''
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

// Form state
const displayName = ref(authStore.user?.displayName || authStore.user?.name || '')
const firstName = ref(authStore.user?.firstName || '')
const lastName = ref(authStore.user?.lastName || '')
const bio = ref(authStore.user?.bio || '')
const phoneNumber = ref(authStore.user?.phoneNumber || '')
const dateOfBirth = ref(toDateInput(authStore.user?.dateOfBirth))
const gender = ref(authStore.user?.gender || '')
const isPublic = ref(authStore.user?.isPublic !== false)

// Address state
const street = ref(authStore.user?.address?.street || '')
const city = ref(authStore.user?.address?.city || '')
const state = ref(authStore.user?.address?.state || '')
const postalCode = ref(authStore.user?.address?.postalCode || '')
const country = ref(authStore.user?.address?.country || '')

// Social media state
const website = ref(authStore.user?.socialMedia?.website || '')
const instagram = ref(authStore.user?.socialMedia?.instagram || '')
const twitter = ref(authStore.user?.socialMedia?.twitter || '')
const linkedin = ref(authStore.user?.socialMedia?.linkedin || '')

// Picture state
const pictureFile = ref(null)
const picturePreview = ref(authStore.user?.picture || '')

// UI state
const saving = ref(false)
const formError = ref('')
const successMessage = ref('')

// Watch user changes (e.g. after redirect from refresh)
watch(
  () => authStore.user,
  (user) => {
    if (!user) return
    if (!displayName.value) displayName.value = user.displayName || user.name || ''
    if (!firstName.value) firstName.value = user.firstName || ''
    if (!lastName.value) lastName.value = user.lastName || ''
    if (!bio.value) bio.value = user.bio || ''
    if (!phoneNumber.value) phoneNumber.value = user.phoneNumber || ''
    if (!dateOfBirth.value) dateOfBirth.value = toDateInput(user.dateOfBirth)
    if (!gender.value) gender.value = user.gender || ''
    if (!picturePreview.value) picturePreview.value = user.picture || ''
    if (!street.value) street.value = user.address?.street || ''
    if (!city.value) city.value = user.address?.city || ''
    if (!state.value) state.value = user.address?.state || ''
    if (!postalCode.value) postalCode.value = user.address?.postalCode || ''
    if (!country.value) country.value = user.address?.country || ''
    if (!website.value) website.value = user.socialMedia?.website || ''
    if (!instagram.value) instagram.value = user.socialMedia?.instagram || ''
    if (!twitter.value) twitter.value = user.socialMedia?.twitter || ''
    if (!linkedin.value) linkedin.value = user.socialMedia?.linkedin || ''
  },
)

const handlePictureChange = (event) => {
  const file = event.target.files?.[0]
  event.target.value = ''
  if (!file) return

  if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
    formError.value = t('editProfile.invalidFileType')
    return
  }

  if (file.size > MAX_FILE_SIZE) {
    formError.value = t('editProfile.fileTooLarge', { max: MAX_FILE_SIZE / 1024 / 1024 })
    return
  }

  pictureFile.value = file
  picturePreview.value = URL.createObjectURL(file)
  formError.value = ''
}

const removePicture = () => {
  pictureFile.value = null
  picturePreview.value = ''
  formError.value = ''
}

const handleSubmit = async () => {
  formError.value = ''
  successMessage.value = ''

  if (!displayName.value.trim()) {
    formError.value = t('editProfile.usernameRequired')
    return
  }
  if (displayName.value.trim().length < 2) {
    formError.value = t('editProfile.usernameTooShort')
    return
  }

  const formData = new FormData()
  formData.append('displayName', displayName.value.trim())
  formData.append('isPublic', isPublic.value ? 'true' : 'false')
  if (firstName.value.trim()) formData.append('firstName', firstName.value.trim())
  if (lastName.value.trim()) formData.append('lastName', lastName.value.trim())
  if (bio.value.trim()) formData.append('bio', bio.value.trim())
  if (phoneNumber.value.trim()) formData.append('phoneNumber', phoneNumber.value.trim())
  if (dateOfBirth.value) formData.append('dateOfBirth', dateOfBirth.value)
  if (gender.value) formData.append('gender', gender.value)
  if (pictureFile.value) formData.append('picture', pictureFile.value)

  const address = {
    street: street.value.trim(),
    city: city.value.trim(),
    state: state.value.trim(),
    postalCode: postalCode.value.trim(),
    country: country.value.trim(),
  }
  if (Object.values(address).some(Boolean)) {
    formData.append('address', JSON.stringify(address))
  }

  const socialMedia = {
    website: website.value.trim(),
    instagram: instagram.value.trim(),
    twitter: twitter.value.trim(),
    linkedin: linkedin.value.trim(),
  }
  if (Object.values(socialMedia).some(Boolean)) {
    formData.append('socialMedia', JSON.stringify(socialMedia))
  }

  saving.value = true
  try {
    const result = await authStore.updateProfile(formData)
    if (result.success) {
      successMessage.value = t('common.profileUpdated')
      router.push('/profile')
    } else {
      formError.value = result.error
    }
  } finally {
    saving.value = false
  }
}
</script>
