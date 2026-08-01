<template>
  <div class="min-h-screen bg-gray-50 py-8">
    <div class="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
      <!-- Header -->
      <div class="mb-8 flex items-center justify-between">
        <div>
          <h1 class="text-3xl font-bold text-gray-900">Edit Profile</h1>
          <p class="mt-2 text-gray-600">Update your personal information</p>
        </div>
        <button
          @click="router.push('/profile')"
          class="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900"
        >
          &larr; Back
        </button>
      </div>

      <!-- Success message -->
      <div
        v-if="successMessage"
        class="mb-6 rounded-md bg-green-50 border border-green-200 p-4"
      >
        <p class="text-sm font-medium text-green-800">{{ successMessage }}</p>
      </div>

      <!-- Error message -->
      <div
        v-if="formError"
        class="mb-6 rounded-md bg-red-50 border border-red-200 p-4"
      >
        <p class="text-sm font-medium text-red-800">{{ formError }}</p>
      </div>

      <form @submit.prevent="handleSubmit" class="space-y-6">
        <!-- Profile picture -->
        <div class="bg-white shadow rounded-lg p-6">
          <h2 class="text-xl font-semibold text-gray-900 mb-4">Profile Picture</h2>
          <div class="flex items-center space-x-6">
            <div class="flex-shrink-0">
              <img
                v-if="picturePreview"
                :src="picturePreview"
                alt="Profile preview"
                class="h-24 w-24 rounded-full object-cover"
              />
              <div
                v-else
                class="h-24 w-24 rounded-full bg-indigo-600 flex items-center justify-center text-white text-3xl font-bold"
              >
                {{ getInitials(displayName || authStore.userDisplayName) }}
              </div>
            </div>
            <div class="flex-1">
              <input
                id="picture"
                type="file"
                accept="image/*"
                class="sr-only"
                @change="handlePictureChange"
              />
              <label
                for="picture"
                class="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 cursor-pointer"
              >
                Upload photo
              </label>
              <button
                v-if="pictureFile || authStore.user?.picture"
                type="button"
                @click="removePicture"
                class="ml-3 inline-flex items-center px-4 py-2 border border-red-300 rounded-md shadow-sm text-sm font-medium text-red-700 bg-white hover:bg-red-50"
              >
                Remove
              </button>
              <p class="mt-2 text-xs text-gray-500">
                JPG, PNG, GIF or WebP. Max {{ MAX_FILE_SIZE / 1024 / 1024 }}MB.
              </p>
            </div>
          </div>
        </div>

        <!-- Basic information -->
        <div class="bg-white shadow rounded-lg p-6">
          <h2 class="text-xl font-semibold text-gray-900 mb-4">Basic Information</h2>
          <div class="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <div class="sm:col-span-2">
              <label for="displayName" class="block text-sm font-medium text-gray-700">
                Display Name
              </label>
              <input
                id="displayName"
                v-model="displayName"
                type="text"
                :maxlength="NAME_MAX_LENGTH"
                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                placeholder="How others see you"
              />
            </div>
            <div>
              <label for="firstName" class="block text-sm font-medium text-gray-700">
                First Name
              </label>
              <input
                id="firstName"
                v-model="firstName"
                type="text"
                :maxlength="NAME_MAX_LENGTH"
                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              />
            </div>
            <div>
              <label for="lastName" class="block text-sm font-medium text-gray-700">
                Last Name
              </label>
              <input
                id="lastName"
                v-model="lastName"
                type="text"
                :maxlength="NAME_MAX_LENGTH"
                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              />
            </div>
            <div class="sm:col-span-2">
              <label for="bio" class="block text-sm font-medium text-gray-700">
                Bio
              </label>
              <textarea
                id="bio"
                v-model="bio"
                rows="3"
                :maxlength="BIO_MAX_LENGTH"
                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                placeholder="Tell us a little about yourself"
              ></textarea>
              <p class="mt-1 text-xs text-gray-500 text-right">
                {{ bio.length }} / {{ BIO_MAX_LENGTH }}
              </p>
            </div>
          </div>
        </div>

        <!-- Contact & personal -->
        <div class="bg-white shadow rounded-lg p-6">
          <h2 class="text-xl font-semibold text-gray-900 mb-4">Contact &amp; Personal</h2>
          <div class="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <div>
              <label for="phoneNumber" class="block text-sm font-medium text-gray-700">
                Phone Number
              </label>
              <input
                id="phoneNumber"
                v-model="phoneNumber"
                type="tel"
                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                placeholder="+62 812 3456 7890"
              />
            </div>
            <div>
              <label for="dateOfBirth" class="block text-sm font-medium text-gray-700">
                Date of Birth
              </label>
              <input
                id="dateOfBirth"
                v-model="dateOfBirth"
                type="date"
                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              />
            </div>
            <div>
              <label for="gender" class="block text-sm font-medium text-gray-700">
                Gender
              </label>
              <select
                id="gender"
                v-model="gender"
                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              >
                <option value="">Prefer not to say</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
                <option value="prefer_not_to_say">Prefer not to say</option>
              </select>
            </div>
          </div>
        </div>

        <!-- Privacy -->
        <div class="bg-white shadow rounded-lg p-6">
          <h2 class="text-xl font-semibold text-gray-900 mb-4">Privacy</h2>
          <div class="flex items-start">
            <input
              id="isPublic"
              v-model="isPublic"
              type="checkbox"
              class="mt-1 h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
            />
            <label for="isPublic" class="ml-3 block text-sm text-gray-700">
              <span class="font-medium">Make my profile public</span>
              <span class="block text-gray-500">
                Allow other users to view and discover your profile.
              </span>
            </label>
          </div>
        </div>

        <!-- Actions -->
        <div class="flex justify-end space-x-3">
          <button
            type="button"
            @click="router.push('/profile')"
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
            {{ saving ? 'Saving...' : 'Save Changes' }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { getInitials } from '@/utils/helpers'
import {
  NAME_MAX_LENGTH,
  BIO_MAX_LENGTH,
  MAX_FILE_SIZE,
  ALLOWED_IMAGE_TYPES,
  SUCCESS_MESSAGES,
} from '@/utils/constants'

const router = useRouter()
const authStore = useAuthStore()

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
  }
)

const handlePictureChange = (event) => {
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
    formError.value = 'Display name is required'
    return
  }
  if (displayName.value.trim().length < 2) {
    formError.value = 'Display name must be at least 2 characters'
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

  saving.value = true
  try {
    const result = await authStore.updateProfile(formData)
    if (result.success) {
      successMessage.value = SUCCESS_MESSAGES.PROFILE_UPDATED
      router.push('/profile')
    } else {
      formError.value = result.error
    }
  } finally {
    saving.value = false
  }
}
</script>
