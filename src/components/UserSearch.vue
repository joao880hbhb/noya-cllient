<template>
  <div class="relative" @click.stop>
    <!-- Search input -->
    <div class="relative">
      <svg
        class="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 pointer-events-none"
        fill="currentColor"
        viewBox="0 0 20 20"
      >
        <path fill-rule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clip-rule="evenodd" />
      </svg>
      <input
        v-model="query"
        type="text"
        placeholder="Cari pengguna berdasarkan username"
        class="w-full pl-11 pr-4 py-3 rounded-full bg-gray-100 border border-transparent focus:bg-white focus:border-[#5B4BFF] focus:ring-2 focus:ring-[#5B4BFF]/20 text-sm text-gray-900 placeholder-gray-400 outline-none transition"
        @input="onInput"
        @focus="open = true"
        @keydown.escape="closeDropdown"
      />
      <button
        v-if="query"
        @click="clearSearch"
        class="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
      >
        <svg class="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
          <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd" />
        </svg>
      </button>
    </div>

    <!-- Dropdown results -->
    <div
      v-if="open && query"
      class="absolute left-0 right-0 mt-2 bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden z-20"
    >
      <div v-if="loading" class="p-6 flex justify-center">
        <div class="animate-spin rounded-full h-6 w-6 border-b-2 border-[#5B4BFF]"></div>
      </div>

      <div v-else-if="error" class="p-6 text-center text-sm text-gray-500">{{ error }}</div>

      <div v-else-if="users.length" class="max-h-80 overflow-y-auto py-2">
        <button
          v-for="user in users"
          :key="user.publicId"
          @click="selectUser(user)"
          class="w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-50 text-left"
        >
          <img
            v-if="user.picture"
            :src="user.picture"
            :alt="user.displayName || user.publicId"
            class="h-10 w-10 rounded-full object-cover shrink-0"
          />
          <div
            v-else
            class="h-10 w-10 rounded-full bg-[#5B4BFF]/10 text-[#5B4BFF] flex items-center justify-center text-sm font-bold shrink-0"
          >
            {{ getInitials(user.displayName || user.publicId) }}
          </div>
          <div class="min-w-0">
            <p class="text-sm font-semibold text-gray-900 truncate">{{ user.displayName || 'User' }}</p>
            <!-- <p class="text-xs text-gray-400 truncate">@{{ shortenId(user.publicId) }}</p> -->
            <p v-if="user.bio" class="text-xs text-gray-500 truncate">{{ user.bio }}</p>
          </div>
          <svg class="ml-auto h-4 w-4 text-gray-300 shrink-0" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clip-rule="evenodd" />
          </svg>
        </button>
      </div>

      <div v-else class="p-6 text-center">
        <p class="text-sm text-gray-500">Tidak ada pengguna ditemukan</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import { profileAPI } from '@/services/api'
import { getInitials } from '@/utils/helpers'

const router = useRouter()

const query = ref('')
const users = ref([])
const loading = ref(false)
const error = ref('')
const open = ref(false)
let debounceTimer = null

const onInput = () => {
  clearTimeout(debounceTimer)
  if (!query.value.trim()) {
    users.value = []
    return
  }
  loading.value = true
  debounceTimer = setTimeout(async () => {
    try {
      const response = await profileAPI.searchUsers(query.value.trim())
      users.value = response.data.users || []
      error.value = ''
    } catch (err) {
      error.value = err.response?.data?.message || 'Gagal mencari pengguna'
    } finally {
      loading.value = false
    }
  }, 300)
}

const selectUser = (user) => {
  open.value = false
  query.value = ''
  users.value = []
  router.push(`/profile/${user.publicId}`)
}

const clearSearch = () => {
  query.value = ''
  users.value = []
}

const closeDropdown = () => {
  open.value = false
}

const shortenId = (id) => {
  if (!id) return ''
  return id.length > 14 ? `${id.slice(0, 14)}...` : id
}

watch(query, (val) => {
  if (!val) users.value = []
})

// Close dropdown when clicking outside
if (typeof window !== 'undefined') {
  window.addEventListener('click', () => {
    open.value = false
  })
}
</script>
