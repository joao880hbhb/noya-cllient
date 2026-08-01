<template>
  <div class="min-h-screen bg-gray-50 py-8">
    <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-28">
      <!-- Loading state -->
      <div v-if="loading" class="flex justify-center items-center h-64">
        <div
          class="animate-spin rounded-full h-10 w-10 border-b-2 border-[#5B4BFF]"
        ></div>
      </div>

      <!-- Error state -->
      <div v-else-if="error" class="text-center py-20">
        <p class="text-gray-400 text-sm">{{ error }}</p>
        <button
          @click="router.push('/')"
          class="mt-4 px-4 py-2 bg-[#5B4BFF] text-white rounded-full text-sm font-medium"
        >
          Back to Home
        </button>
      </div>

      <!-- Profile -->
      <template v-else-if="user">
        <div class="bg-white shadow rounded-lg p-6 sm:p-10">
          <!-- Avatar -->
          <div class="flex flex-col items-center">
            <img
              v-if="user.picture"
              :src="user.picture"
              :alt="user.displayName"
              class="h-28 w-28 rounded-full object-cover border-4 border-gray-50 shadow-md"
            />
            <div
              v-else
              class="h-28 w-28 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 text-4xl font-bold border-4 border-gray-50 shadow-md"
            >
              {{ getInitials(user.displayName || user.publicId) }}
            </div>

            <h1 class="mt-5 font-serif text-2xl font-bold text-gray-900">
              {{ user.displayName || user.publicId }}
            </h1>
            <p class="mt-1 text-sm text-gray-400">@{{ user.publicId }}</p>

            <p
              v-if="user.bio"
              class="mt-3 text-center text-sm leading-relaxed text-gray-600 max-w-xs"
            >
              {{ user.bio }}
            </p>

            <div
              class="mt-3 flex flex-wrap items-center justify-center gap-x-4 gap-y-1 text-xs text-gray-400"
            >
              <span v-if="location" class="inline-flex items-center gap-1">
                <svg
                  class="h-3.5 w-3.5"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fill-rule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clip-rule="evenodd"
                  />
                </svg>
                {{ location }}
              </span>
              <a
                v-if="website"
                :href="website"
                target="_blank"
                rel="noopener noreferrer"
                class="inline-flex items-center gap-1 text-[#5B4BFF] hover:underline"
              >
                <svg
                  class="h-3.5 w-3.5"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fill-rule="evenodd"
                    d="M12.586 4.586a2 2 0 112.828 2.828l-3 3a2 2 0 01-2.828 0 1 1 0 00-1.414 1.414 4 4 0 005.656 0l3-3a4 4 0 00-5.656-5.656l-1.5 1.5a1 1 0 101.414 1.414l1.5-1.5zm-5 5a2 2 0 012.828 0 1 1 0 101.414-1.414 4 4 0 00-5.656 0l-3 3a4 4 0 105.656 5.656l1.5-1.5a1 1 0 10-1.414-1.414l-1.5 1.5a2 2 0 11-2.828-2.828l3-3z"
                    clip-rule="evenodd"
                  />
                </svg>
                Website
              </a>
            </div>

            <!-- Share profile -->
            <button
              @click="handleShare"
              class="mt-4 inline-flex items-center gap-2 rounded-full bg-[#5B4BFF]/10 px-4 py-2 text-sm font-medium text-[#5B4BFF] hover:bg-[#5B4BFF]/20 transition-colors"
            >
              <svg class="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                <path
                  d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.829-2.828z"
                />
              </svg>
              Bagikan profil
            </button>
          </div>

          <!-- Stats row -->
          <div
            class="mt-8 flex items-center justify-center gap-10 border-y border-gray-100 py-4"
          >
            <div class="text-center">
              <p class="text-lg font-bold text-gray-900">
                {{ formatNumber(totalBlogs) }}
              </p>
              <p class="text-xs text-gray-400 mt-0.5">Posts</p>
            </div>
            <div class="text-center">
              <p class="text-lg font-bold text-gray-900">
                {{ formatNumber(totalLikes) }}
              </p>
              <p class="text-xs text-gray-400 mt-0.5">Likes</p>
            </div>
            <div class="text-center">
              <p class="text-lg font-bold text-gray-900">
                {{ formatNumber(blogViews) }}
              </p>
              <p class="text-xs text-gray-400 mt-0.5">Views</p>
            </div>
          </div>
        </div>

        <!-- Section label -->
        <div class="mt-8 mb-4 flex items-center gap-3">
          <h2
            class="text-sm font-semibold uppercase tracking-wide text-gray-500"
          >
            Stories
          </h2>
          <span class="h-px flex-1 bg-gray-100"></span>
        </div>

        <!-- Blog cards -->
        <div v-if="blogs.length" class="grid gap-6 sm:grid-cols-2">
          <BlogCard
            v-for="blog in blogs"
            :key="blog._id"
            :blog="blog"
            :show-author="false"
          />
        </div>

        <!-- Empty state -->
        <div
          v-else
          class="rounded-[20px] bg-white shadow-[0_2px_12px_rgba(0,0,0,0.06)] py-16 px-6 text-center"
        >
          <div
            class="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-white shadow-sm"
          >
            <svg
              class="h-7 w-7 text-gray-300"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                d="M4 3a1 1 0 011-1h8.586a1 1 0 01.707.293l2.414 2.414A1 1 0 0117 5.414V17a1 1 0 01-1 1H5a1 1 0 01-1-1V3zm9 1v3h3l-3-3z"
              />
            </svg>
          </div>
          <h3 class="mt-4 font-serif text-lg font-bold text-gray-800">
            No articles yet
          </h3>
          <p class="mt-1 text-sm text-gray-500">
            Check back later for new stories.
          </p>
        </div>
      </template>

      <!-- Floating Action Button -->
      <router-link
        v-if="isOwnProfile"
        to="/blogs/create"
        class="fixed bottom-6 right-6 z-20 inline-flex items-center gap-2 rounded-full bg-[#5B4BFF] px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-[#5B4BFF]/30 hover:bg-[#4a3dcc]"
      >
        <svg class="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
          <path
            fill-rule="evenodd"
            d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z"
            clip-rule="evenodd"
          />
        </svg>
        Write
      </router-link>

      <!-- Toast -->
      <transition name="toast">
        <div
          v-if="toast"
          class="fixed bottom-6 left-1/2 -translate-x-1/2 z-30 px-4 py-2.5 bg-gray-900 text-white text-sm rounded-full shadow-lg"
        >
          {{ toast }}
        </div>
      </transition>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import { profileAPI, blogAPI } from "@/services/api";
import { useAuthStore } from "@/stores/auth";
import { getInitials, formatNumber } from "@/utils/helpers";
import BlogCard from "@/components/BlogCard.vue";

const route = useRoute();
const router = useRouter();
const authStore = useAuthStore();

const user = ref(null);
const blogs = ref([]);
const totalBlogs = ref(0);
const loading = ref(false);
const error = ref("");
const toast = ref("");
let toastTimer = null;

const location = computed(() => {
  const address = user.value?.address;
  if (!address) return "";
  return [address.city, address.state, address.country]
    .filter(Boolean)
    .join(", ");
});

const website = computed(() => user.value?.socialMedia?.website || "");

const totalLikes = computed(() =>
  blogs.value.reduce((sum, b) => sum + (b.likesCount || 0), 0),
);
const blogViews = computed(() =>
  blogs.value.reduce((sum, b) => sum + (b.views || 0), 0),
);

const isOwnProfile = computed(() => {
  const publicId = route.params.publicId;
  return !!publicId && authStore.user?.publicId === publicId;
});

const fetchProfile = async () => {
  const publicId = route.params.publicId;
  loading.value = true;
  error.value = "";

  try {
    const [profileRes, blogsRes] = await Promise.all([
      profileAPI.getUserByPublicId(publicId),
      blogAPI.getBlogsByPublicId(publicId, { page: 1, limit: 20 }),
    ]);

    user.value = profileRes.data;
    blogs.value = blogsRes.data.blogs || [];
    totalBlogs.value = blogsRes.data.totalBlogs || 0;
  } catch (err) {
    error.value = err.response?.data?.message || "Profile not found";
  } finally {
    loading.value = false;
  }
};

watch(() => route.params.publicId, fetchProfile);

onMounted(fetchProfile);

const profileUrl = () =>
  `${window.location.origin}/profile/${route.params.publicId}`;

const showToast = (message) => {
  toast.value = message;
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => {
    toast.value = "";
  }, 2000);
};

const handleShare = async () => {
  const url = profileUrl();

  if (navigator.share) {
    try {
      await navigator.share({
        title: user.value?.displayName || "Profil MyNoya",
        text: user.value?.bio || "",
        url,
      });
      return;
    } catch (err) {
      if (err.name === "AbortError") return;
    }
  }

  try {
    await navigator.clipboard.writeText(url);
    showToast("Link profil disalin");
  } catch {
    showToast("Gagal membagikan profil");
  }
};
</script>

<style scoped>
.toast-enter-active,
.toast-leave-active {
  transition:
    opacity 0.2s ease,
    transform 0.2s ease;
}
.toast-enter-from,
.toast-leave-to {
  opacity: 0;
  transform: translate(-50%, 8px);
}
</style>
