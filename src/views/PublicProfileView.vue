<template>
  <div class="min-h-screen bg-white">
    <div class="max-w-3xl mx-auto px-6 sm:px-10 py-16 sm:py-24 pb-32">
      <!-- Loading state -->
      <div
        v-if="loading"
        class="flex flex-col items-center justify-center h-72 gap-3"
      >
        <svg
          class="animate-spin h-6 w-6 text-[#111111]"
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
        <p class="text-[11px] tracking-[0.15em] text-[#B0B0B0] uppercase">
          Loading profile
        </p>
      </div>

      <!-- Error state -->
      <div
        v-else-if="error"
        class="border border-[#E7E7E7] rounded-[3px] p-10 text-center"
      >
        <p class="text-[11px] tracking-[0.15em] text-[#B3261E] uppercase mb-2">
          Couldn't load this profile
        </p>
        <p class="text-[15px] text-[#4B4B4B] mb-6">{{ error }}</p>
        <button
          @click="router.push('/')"
          class="inline-flex items-center px-5 py-2.5 bg-[#111111] text-white rounded-[2px] text-[13px] font-medium shadow-[0_1px_2px_rgba(0,0,0,0.05),0_10px_20px_-8px_rgba(0,0,0,0.35)] hover:bg-black transition-colors"
        >
          Back to home
        </button>
      </div>

      <!-- Profile -->
      <template v-else-if="user">
        <div
          class="relative border border-[#E7E7E7] rounded-[3px] shadow-[0_1px_2px_rgba(0,0,0,0.03),0_18px_40px_-16px_rgba(0,0,0,0.14)] bg-white px-8 sm:px-14 py-12 sm:py-14"
        >
          <!-- decorative margin ruler -->
          <div
            class="hidden md:block absolute left-0 top-0 bottom-0 w-6 bg-[repeating-linear-gradient(to_bottom,#E7E7E7_0,#E7E7E7_1px,transparent_1px,transparent_10px)] opacity-70"
          ></div>

          <!-- Avatar & identity -->
          <div class="flex flex-col items-center text-center">
            <p
              class="text-[11px] tracking-[0.2em] text-[#8A8A8A] uppercase mb-6"
            >
              Author profile
            </p>

            <img
              v-if="user.picture"
              :src="user.picture"
              :alt="user.displayName"
              class="h-24 w-24 rounded-full object-cover border border-[#E7E7E7] shadow-[0_8px_20px_-8px_rgba(0,0,0,0.25)]"
            />
            <div
              v-else
              class="h-24 w-24 rounded-full bg-[#FAFAFA] border border-[#E7E7E7] flex items-center justify-center text-[#111111] text-2xl font-display italic shadow-[0_8px_20px_-8px_rgba(0,0,0,0.25)]"
            >
              {{ getInitials(user.displayName || user.publicId) }}
            </div>

            <h1
              class="mt-6 font-display italic text-[30px] sm:text-[36px] leading-tight text-[#111111]"
            >
              {{ user.displayName || user.publicId }}
            </h1>

            <p
              v-if="user.bio"
              class="mt-3 text-[14px] leading-relaxed text-[#6B6B6B] max-w-sm"
            >
              {{ user.bio }}
            </p>

            <div
              class="mt-4 flex flex-wrap items-center justify-center gap-x-5 gap-y-1 text-[12px] text-[#8A8A8A]"
            >
              <span v-if="location" class="inline-flex items-center gap-1.5">
                <svg
                  class="h-3.5 w-3.5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  stroke-width="1.6"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="M12 21c-4-4.2-6.5-7.7-6.5-11a6.5 6.5 0 1113 0c0 3.3-2.5 6.8-6.5 11z"
                  />
                  <circle
                    cx="12"
                    cy="10"
                    r="2.2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                </svg>
                {{ location }}
              </span>
              <a
                v-if="website"
                :href="website"
                target="_blank"
                rel="noopener noreferrer"
                class="inline-flex items-center gap-1.5 text-[#111111] hover:underline underline-offset-2"
              >
                <svg
                  class="h-3.5 w-3.5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  stroke-width="1.6"
                >
                  <circle
                    cx="12"
                    cy="12"
                    r="9"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="M3 12h18M12 3c2.3 2.5 3.5 5.6 3.5 9s-1.2 6.5-3.5 9c-2.3-2.5-3.5-5.6-3.5-9s1.2-6.5 3.5-9z"
                  />
                </svg>
                Website
              </a>
            </div>

            <!-- Share profile -->
            <button
              @click="handleShare"
              class="mt-6 inline-flex items-center gap-2 px-4 py-2 border border-[#111111] rounded-[2px] text-[12.5px] font-medium text-[#111111] hover:bg-[#111111] hover:text-white transition-colors"
            >
              <svg
                class="h-3.5 w-3.5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                stroke-width="1.6"
              >
                <circle
                  cx="18"
                  cy="5"
                  r="2.4"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
                <circle
                  cx="6"
                  cy="12"
                  r="2.4"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
                <circle
                  cx="18"
                  cy="19"
                  r="2.4"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="M8.1 10.7l7.8-4.4M8.1 13.3l7.8 4.4"
                />
              </svg>
              Bagikan profil
            </button>
          </div>

          <!-- Stats row -->
          <div
            class="mt-10 grid grid-cols-3 gap-4 border-t border-[#F0F0F0] pt-8"
          >
            <div class="flex flex-col items-center gap-1.5">
              <svg
                class="h-4 w-4 text-[#8A8A8A]"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                stroke-width="1.6"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="M6 3h9l4 4v14a1 1 0 01-1 1H6a1 1 0 01-1-1V4a1 1 0 011-1z"
                />
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="M14 3v5h5M8.5 12h7M8.5 15.5h7M8.5 8.5h2"
                />
              </svg>
              <p class="text-[17px] font-display text-[#111111] tabular-nums">
                {{ formatNumber(totalBlogs) }}
              </p>
              <p class="text-[11px] tracking-[0.1em] text-[#B0B0B0] uppercase">
                Posts
              </p>
            </div>
            <div
              class="flex flex-col items-center gap-1.5 border-x border-[#F0F0F0]"
            >
              <svg
                class="h-4 w-4 text-[#8A8A8A]"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                stroke-width="1.6"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="M12 20.2s-7.6-4.5-9.8-9A5 5 0 0112 6.5 5 5 0 0121.8 11.2c-2.2 4.5-9.8 9-9.8 9z"
                />
              </svg>
              <p class="text-[17px] font-display text-[#111111] tabular-nums">
                {{ formatNumber(totalLikes) }}
              </p>
              <p class="text-[11px] tracking-[0.1em] text-[#B0B0B0] uppercase">
                Likes
              </p>
            </div>
            <div class="flex flex-col items-center gap-1.5">
              <svg
                class="h-4 w-4 text-[#8A8A8A]"
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
                <circle
                  cx="12"
                  cy="12"
                  r="2.6"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
              </svg>
              <p class="text-[17px] font-display text-[#111111] tabular-nums">
                {{ formatNumber(blogViews) }}
              </p>
              <p class="text-[11px] tracking-[0.1em] text-[#B0B0B0] uppercase">
                Views
              </p>
            </div>
          </div>
        </div>

        <!-- Section label -->
        <div class="mt-14 mb-6 flex items-center gap-4">
          <h2
            class="text-[11px] tracking-[0.2em] text-[#8A8A8A] uppercase whitespace-nowrap"
          >
            Stories
          </h2>
          <span class="h-px flex-1 bg-[#E7E7E7]"></span>
        </div>

        <!-- Blog list -->
        <div
          v-if="blogs.length"
          class="flex flex-col divide-y divide-[#F0F0F0]"
        >
          <router-link
            v-for="blog in blogs"
            :key="blog._id"
            :to="`/blogs/${blog.slug}`"
            class="block py-5 first:pt-0"
          >
            <div
              v-if="blog.isRepost"
              class="mb-2 flex items-center gap-1.5 text-[11px] text-[#8A8A8A]"
            >
              <svg
                class="h-3.5 w-3.5"
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
              Repost · {{ blog.author?.displayName || "Penulis" }}
            </div>
            <div class="group flex items-center gap-4">
              <!-- Thumbnail -->
              <div
                class="relative h-20 w-20 sm:h-24 sm:w-24 shrink-0 overflow-hidden rounded-[2px] border border-[#E7E7E7] bg-[#FAFAFA]"
              >
                <img
                  v-if="blog.coverImage"
                  :src="blog.coverImage"
                  :alt="blog.title"
                  class="h-full w-full object-cover"
                  loading="lazy"
                />
                <div
                  v-else
                  class="h-full w-full flex items-center justify-center"
                >
                  <span class="font-display italic text-xl text-[#D8D8D8]">{{
                    getInitials(blog.title)
                  }}</span>
                </div>
              </div>

              <!-- Content -->
              <div class="flex-1 min-w-0">
                <h3
                  class="font-display italic text-[16px] sm:text-[18px] leading-snug text-[#111111] line-clamp-2 group-hover:underline underline-offset-2"
                >
                  {{ blog.title }}
                </h3>
                <p
                  v-if="blog.excerpt"
                  class="mt-1 text-[12.5px] text-[#8A8A8A] line-clamp-2"
                >
                  {{ blog.excerpt }}
                </p>

                <!-- Music tag -->
                <span
                  v-if="blog.song || blog.music"
                  class="mt-2 inline-flex items-center gap-1.5 rounded-full border border-[#E7E7E7] px-2.5 py-0.5 text-[11px] font-medium text-[#4B4B4B]"
                >
                  <svg class="h-3 w-3" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      d="M18 3a1 1 0 00-1.196-.98l-10 2A1 1 0 006 5v9.114A4.369 4.369 0 004.5 14C2.567 14 1 15.343 1 17s1.567 3 3.5 3 3.5-1.343 3.5-3V8.82l8-1.6v5.894A4.37 4.37 0 0014.5 13c-1.933 0-3.5 1.343-3.5 3s1.567 3 3.5 3 3.5-1.343 3.5-3V3z"
                    />
                  </svg>
                  {{ blog.song?.artist ?? blog.music?.artist
                  }}{{ blog.song?.artist || blog.music?.artist ? " – " : ""
                  }}{{
                    blog.song?.title ??
                    blog.music?.title ??
                    blog.song ??
                    blog.music
                  }}
                </span>

                <div
                  class="mt-2 flex items-center gap-3 text-[11px] text-[#B0B0B0]"
                >
                  <span class="inline-flex items-center gap-1">
                    <svg
                      class="h-3.5 w-3.5"
                      fill="none"
                      stroke="currentColor"
                      stroke-width="1.8"
                      viewBox="0 0 24 24"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        d="M4.318 6.318a4.5 4.5 0 010 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                      />
                    </svg>
                    {{ blog.likesCount ?? blog.likes ?? 0 }}
                  </span>
                  <span class="inline-flex items-center gap-1">
                    <svg
                      class="h-3.5 w-3.5"
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
                      <circle
                        cx="12"
                        cy="12"
                        r="2.6"
                        stroke-linecap="round"
                        stroke-linejoin="round"
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
        <div
          v-else
          class="border border-dashed border-[#D8D8D8] rounded-[3px] py-16 px-6 text-center"
        >
          <div
            class="mx-auto flex h-12 w-12 items-center justify-center rounded-full border border-[#E7E7E7]"
          >
            <svg
              class="h-5 w-5 text-[#B0B0B0]"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              stroke-width="1.6"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M6 3h9l4 4v14a1 1 0 01-1 1H6a1 1 0 01-1-1V4a1 1 0 011-1z"
              />
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M14 3v5h5"
              />
            </svg>
          </div>
          <h3 class="mt-4 font-display italic text-[19px] text-[#111111]">
            No articles yet
          </h3>
          <p class="mt-1 text-[13px] text-[#8A8A8A]">
            Check back later for new stories.
          </p>
        </div>
      </template>

      <!-- Floating Action Button -->
      <router-link
        v-if="isOwnProfile"
        to="/blogs/create"
        class="fixed bottom-6 right-6 z-20 inline-flex items-center gap-2 rounded-full bg-[#111111] px-5 py-3 text-[13px] font-medium text-white shadow-[0_1px_2px_rgba(0,0,0,0.05),0_14px_28px_-10px_rgba(0,0,0,0.45)] hover:bg-black transition-colors"
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
            d="M12 5v14M5 12h14"
          />
        </svg>
        Write
      </router-link>

      <!-- Toast -->
      <transition name="toast">
        <div
          v-if="toast"
          class="fixed bottom-6 left-1/2 -translate-x-1/2 z-30 px-4 py-2.5 bg-[#111111] text-white text-[13px] rounded-full shadow-[0_10px_24px_-8px_rgba(0,0,0,0.5)]"
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
import { getInitials, formatNumber, formatRelativeTime } from "@/utils/helpers";

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
        title: user.value?.displayName || "Profil Noya",
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
@import url("https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,500;1,9..144,500&display=swap");

.font-display {
  font-family: "Fraunces", ui-serif, Georgia, serif;
}

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
