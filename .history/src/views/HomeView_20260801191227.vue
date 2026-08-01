<script setup>
import { ref, onMounted } from "vue";
import { useAuthStore } from "@/stores/auth";
import { blogAPI } from "@/services/api";
import BlogCard from "@/components/BlogCard.vue";
import UserSearch from "@/components/UserSearch.vue";
import { getInitials, formatRelativeTime } from "@/utils/helpers";

const authStore = useAuthStore();

const trendingBlogs = ref([]);
const latestBlogs = ref([]);
const loading = ref(true);
const error = ref("");

const fetchFeed = async () => {
  loading.value = true;
  error.value = "";
  try {
    const [trendingRes, latestRes] = await Promise.all([
      blogAPI.getAllBlogs({ sort: "trending", limit: 6 }),
      blogAPI.getAllBlogs({ page: 1, limit: 9 }),
    ]);
    trendingBlogs.value = trendingRes.data.blogs || [];
    latestBlogs.value = latestRes.data.blogs || [];
  } catch (err) {
    error.value = err.response?.data?.message || "Failed to load beranda";
  } finally {
    loading.value = false;
  }
};

onMounted(fetchFeed);
</script>

<template>
  <div class="min-h-screen bg-white">
    <div class="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <!-- Beranda header -->

      <!-- User search -->
      <div class="mb-8 max-w-xl">
        <UserSearch />
      </div>
      <div class="mb-6 flex items-end justify-between">
        <div>
          <h1 class="text-2xl font-bold text-gray-900">
            Haloo {{ authStore.user?.displayName || "User"
            }}<svg
              viewBox="0 0 36 36"
              xmlns="http://www.w3.org/2000/svg"
              xmlns:xlink="http://www.w3.org/1999/xlink"
              aria-hidden="true"
              role="img"
              class="iconify iconify--twemoji"
              preserveAspectRatio="xMidYMid meet"
              fill="#000000"
            >
              <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
              <g
                id="SVGRepo_tracerCarrier"
                stroke-linecap="round"
                stroke-linejoin="round"
              ></g>
              <g id="SVGRepo_iconCarrier">
                <path fill="#F7DECE" d="M3 26h8v10H3zm22 0h8v10h-8z"></path>
                <path
                  fill="#EEC2AD"
                  d="M33 28.72s-3 2-8 1v-5h8v4zm-30 0s3 2 8 1v-5H3v4z"
                ></path>
                <path
                  fill="#E0AA94"
                  d="M3.983 18.229h8v8h-8zm20.023-.036h8v8h-8z"
                ></path>
                <path
                  fill="#F7DECE"
                  d="M.373 11.835S.376 10.61 1.6 10.613c1.226.004 1.222 1.229 1.222 1.229l-.019 5.684a5.66 5.66 0 0 1 .613-.241l.025-7.889s.004-1.225 1.227-1.221c1.224.003 1.221 1.229 1.221 1.229l-.021 7.42c.199-.018.404-.032.61-.042l.028-8.602s.003-1.225 1.228-1.22c1.225.004 1.22 1.229 1.22 1.229l-.028 8.6c.21.012.412.033.614.052l.025-8.039s.004-1.225 1.227-1.22c1.224.003 1.219 1.227 1.219 1.227l-.024 8.501l-.003.681v.611c-3.674-.009-6.133 3.042-6.144 6.104c0 .612.612.616.612.616c.01-3.678 2.467-6.115 6.142-6.104l1.801-4.188s.395-1.159 1.556-.762c1.158.392.765 1.553.765 1.553l-.893 3.105c-.354 1.234-.685 2.476-.859 3.744A7.353 7.353 0 0 1 7.665 29C3.61 28.983.33 25.685.343 21.63a6.16 6.16 0 0 1 .034-.61l-.032-.004l.028-9.181zm35.244 0s-.003-1.225-1.227-1.222c-1.226.004-1.223 1.229-1.223 1.229l.019 5.684a5.644 5.644 0 0 0-.612-.241l-.025-7.889s-.004-1.225-1.227-1.221c-1.225.003-1.222 1.229-1.222 1.229l.022 7.42a14.492 14.492 0 0 0-.61-.042l-.027-8.602s-.004-1.225-1.229-1.22c-1.225.004-1.22 1.229-1.22 1.229l.028 8.6c-.21.012-.412.033-.614.052l-.025-8.039s-.005-1.225-1.228-1.22c-1.224.003-1.219 1.227-1.219 1.227l.024 8.501l.003.681v.611c3.674-.009 6.133 3.042 6.145 6.104c0 .612-.612.616-.612.616c-.011-3.678-2.468-6.115-6.142-6.104l-1.801-4.188s-.394-1.159-1.556-.762c-1.157.392-.765 1.553-.765 1.553l.893 3.105c.354 1.234.685 2.476.859 3.744A7.353 7.353 0 0 0 28.325 29c4.055-.017 7.336-3.315 7.322-7.37a6.16 6.16 0 0 0-.034-.61l.032-.004l-.028-9.181z"
                ></path>
                <path
                  d="M23.541 6.458a1 1 0 0 1-.79-1.611L25.73.992a1 1 0 1 1 1.582 1.223L24.333 6.07a.995.995 0 0 1-.792.388zm-11.02 0a.999.999 0 0 1-.792-.389L8.75 2.215A1.001 1.001 0 0 1 10.334.992l2.979 3.855a1.001 1.001 0 0 1-.792 1.611zM18 6a1 1 0 0 1-1-1V1a1 1 0 0 1 2 0v4a1 1 0 0 1-1 1z"
                  fill="#5DADEC"
                ></path>
              </g>
            </svg>
          </h1>
          <p class="mt-1 text-sm text-gray-500">
            Temukan cerita terhangat dan terbaru
          </p>
        </div>
        <router-link
          to="/blogs"
          class="hidden sm:inline-flex items-center text-sm font-medium text-indigo-600 hover:text-indigo-700"
        >
          View all &rarr;
        </router-link>
      </div>
      <!-- Loading state -->
      <div v-if="loading" class="space-y-8">
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div
            v-for="i in 4"
            :key="i"
            class="flex items-center gap-3 bg-gray-50 rounded-2xl p-3 animate-pulse"
          >
            <div
              class="h-20 w-20 sm:h-24 sm:w-24 shrink-0 rounded-xl bg-gray-100"
            ></div>
            <div class="flex-1 min-w-0">
              <div class="h-4 bg-gray-100 rounded mb-2 w-3/4"></div>
              <div class="h-3 bg-gray-100 rounded mb-2 w-full"></div>
              <div class="h-3 bg-gray-100 rounded w-1/2"></div>
            </div>
          </div>
        </div>
      </div>

      <!-- Error state -->
      <div v-else-if="error" class="text-center py-20">
        <p class="text-gray-500">{{ error }}</p>
        <button
          @click="fetchFeed"
          class="mt-4 px-4 py-2 bg-[#5B4BFF] text-white rounded-full text-sm font-medium hover:bg-[#4a3dcc]"
        >
          Coba lagi
        </button>
      </div>

      <template v-else>
        <!-- Trending on MyNoya -->
        <section v-if="trendingBlogs.length" class="mb-10">
          <div class="mb-4 flex items-center gap-2">
            <h2 class="font-serif text-xl font-bold text-gray-900">
              Trending on MyNoya
            </h2>
            <span
              class="rounded-full bg-[#5B4BFF]/10 px-2 py-0.5 text-xs font-semibold text-[#5B4BFF]"
            >
              LIVE
            </span>
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
                class="group flex items-center gap-3 bg-white rounded-2xl shadow-[0_2px_12px_rgba(0,0,0,0.06)] p-3 hover:shadow-[0_4px_20px_rgba(0,0,0,0.1)] transition-shadow h-full"
              >
                <!-- Thumbnail -->
                <div
                  class="relative h-20 w-20 sm:h-24 sm:w-24 shrink-0 overflow-hidden rounded-xl bg-gray-100"
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
                    <span class="text-xl font-bold text-gray-300">{{
                      getInitials(blog.title)
                    }}</span>
                  </div>
                  <!-- Rank -->
                  <span
                    class="absolute top-1 left-1 h-6 w-6 rounded-md bg-white/90 backdrop-blur flex items-center justify-center font-serif text-xs font-bold text-gray-900 shadow-sm"
                  >
                    {{ String(index + 1).padStart(2, "0") }}
                  </span>
                </div>

                <!-- Content -->
                <div class="flex-1 min-w-0">
                  <h3
                    class="font-serif text-sm sm:text-base font-bold leading-snug text-gray-900 line-clamp-2"
                  >
                    {{ blog.title }}
                  </h3>
                  <p
                    v-if="blog.excerpt"
                    class="mt-1 text-xs text-gray-500 line-clamp-2"
                  >
                    {{ blog.excerpt }}
                  </p>

                  <!-- Like & view info -->
                  <div
                    class="mt-2 flex items-center gap-3 text-xs text-gray-400"
                  >
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
            <h2 class="font-serif text-xl font-bold text-gray-900">
              Cerita terbaru
            </h2>
            <span class="h-px flex-1 bg-gray-100"></span>
          </div>

          <div
            v-if="latestBlogs.length"
            class="flex flex-col divide-y divide-gray-100"
          >
            <router-link
              v-for="blog in latestBlogs"
              :key="blog._id"
              :to="`/blogs/${blog.slug}`"
              class="block py-4 first:pt-0"
            >
              <div class="group flex items-center gap-4">
                <!-- Thumbnail (kiri) -->
                <div
                  class="relative h-20 w-20 sm:h-24 sm:w-24 shrink-0 overflow-hidden rounded-xl bg-gray-100"
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
                    <span class="text-xl font-bold text-gray-300">{{
                      getInitials(blog.title)
                    }}</span>
                  </div>
                </div>

                <!-- Content (kanan) -->
                <div class="flex-1 min-w-0">
                  <h3
                    class="font-serif text-sm sm:text-base font-bold leading-snug text-gray-900 line-clamp-2"
                  >
                    {{ blog.title }}
                  </h3>
                  <p
                    v-if="blog.excerpt"
                    class="mt-1 text-xs text-gray-500 line-clamp-2"
                  >
                    {{ blog.excerpt }}
                  </p>

                  <!-- Tag lagu -->
                  <span
                    v-if="blog.song || blog.music"
                    class="mt-2 inline-flex items-center gap-1 rounded-full bg-[#5B4BFF]/10 px-2 py-0.5 text-[11px] font-medium text-[#5B4BFF]"
                  >
                    <svg
                      class="h-3 w-3"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
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
                    class="mt-2 flex items-center gap-3 text-xs text-gray-400"
                  >
                    <span class="inline-flex items-center gap-1.5 min-w-0">
                      <img
                        v-if="blog.author?.picture"
                        :src="blog.author.picture"
                        :alt="blog.author.displayName || blog.author.publicId"
                        class="h-5 w-5 rounded-full object-cover shrink-0"
                      />
                      <div
                        v-else
                        class="h-5 w-5 rounded-full bg-gray-100 flex items-center justify-center text-[9px] font-bold text-gray-500 shrink-0"
                      >
                        {{
                          getInitials(
                            blog.author?.displayName || blog.author?.publicId,
                          )
                        }}
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
          <div v-else class="rounded-[20px] bg-gray-50 py-16 px-6 text-center">
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
              Belum ada cerita
            </h3>
            <p class="mt-1 text-sm text-gray-500">
              Jadilah yang pertama menulis di MyNoya.
            </p>
            <router-link
              v-if="authStore.isAuthenticated"
              to="/blogs/create"
              class="mt-5 inline-flex items-center gap-2 rounded-full bg-[#5B4BFF] px-5 py-2.5 text-sm font-semibold text-white hover:bg-[#4a3dcc]"
            >
              Tulis cerita
            </router-link>
          </div>
        </section>
      </template>
    </div>
  </div>
</template>
