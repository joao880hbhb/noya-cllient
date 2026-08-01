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
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="M15 19l-7-7 7-7"
          />
        </svg>
        Back
      </button>

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
          Loading story
        </p>
      </div>

      <!-- Error state -->
      <div
        v-else-if="error"
        class="border border-[#E7E7E7] rounded-[3px] p-10 text-center"
      >
        <p class="text-[11px] tracking-[0.15em] text-[#B3261E] uppercase mb-2">
          Couldn't load this story
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
            <p
              class="text-[10px] tracking-[0.2em] text-white/50 uppercase mb-1"
            >
              Now playing
            </p>
            <h3 class="font-display italic text-[18px] leading-tight truncate">
              {{ blog.music.title }}
            </h3>
            <p class="mt-0.5 text-[13px] text-white/70 truncate">
              {{ blog.music.artist }}
            </p>
            <p
              v-if="blog.music.album"
              class="text-[11px] text-white/40 truncate"
            >
              {{ blog.music.album }}
            </p>
            <div class="mt-3 flex flex-wrap items-center gap-3">
              <audio
                v-if="blog.music.previewUrl"
                controls
                class="h-8 max-w-[220px]"
              >
                <source :src="blog.music.previewUrl" type="audio/mpeg" />
                Your browser does not support the audio element.
              </audio>
              <a
                v-if="blog.music.deezerUrl"
                :href="blog.music.deezerUrl"
                target="_blank"
                rel="noopener noreferrer"
                class="text-[12px] font-medium border border-white/30 text-white px-3 py-1.5 rounded-[2px] hover:bg-white hover:text-[#111111] transition-colors"
              >
                Open in Deezer
              </a>
            </div>
          </div>
        </div>

        <!-- Cover image -->

        <!-- Title -->
        <h1
          class="font-display italic text-[32px] sm:text-[44px] leading-[1.1] text-[#111111]"
        >
          {{ blog.title }}
        </h1>

        <!-- Meta -->
        <div
          class="mt-6 flex flex-wrap items-center justify-between gap-4 border-b border-[#F0F0F0] pb-6"
        >
          <component
            :is="blog.author?.publicId ? 'router-link' : 'div'"
            :to="
              blog.author?.publicId
                ? `/profile/${blog.author.publicId}`
                : undefined
            "
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
              <p
                class="text-[13px] font-medium text-[#111111] group-hover:underline underline-offset-2"
              >
                {{ authorName }}
              </p>
              <p class="text-[12px] text-[#B0B0B0]">
                {{ formatDate(blog.publishedAt || blog.createdAt) }} &middot;
                {{ readingTime }} min read
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
                  ? 'bg-[#111111] text-white border-[#111111]'
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

            <!-- Views -->
            <span
              class="inline-flex items-center gap-1.5 text-[13px] text-[#B0B0B0]"
            >
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
                <circle
                  cx="12"
                  cy="12"
                  r="2.6"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
              </svg>
              <span class="tabular-nums">{{ blog.views || 0 }}</span>
            </span>
          </div>
        </div>
        <div
          v-if="blog.coverImage"
          class="mb-10 border border-[#E7E7E7] rounded-[3px] overflow-hidden"
        >
          <img
            :src="blog.coverImage"
            :alt="blog.title"
            class="w-full h-64 sm:h-96 object-cover"
          />
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
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import { blogAPI, likeAPI } from "@/services/api";
import { useAuthStore } from "@/stores/auth";
import BlogContent from "@/components/BlogContent.vue";
import { getInitials, formatDate } from "@/utils/helpers";

const route = useRoute();
const router = useRouter();
const authStore = useAuthStore();

const blog = ref(null);
const loading = ref(false);
const error = ref("");
const liked = ref(false);
const likesCount = ref(0);
const liking = ref(false);
const progress = ref(0);

const authorName = computed(() => {
  const author = blog.value?.author;
  if (!author) return "Unknown";
  if (author.displayName) return author.displayName;
  if (author.firstName || author.lastName) {
    return `${author.firstName || ""} ${author.lastName || ""}`.trim();
  }
  return "Unknown";
});

const countTextContent = (doc) => {
  if (!doc) return 0;
  if (typeof doc === "string") return doc.length;
  let count = 0;
  const walk = (node) => {
    if (!node) return;
    if (node.type === "text" && node.text) count += node.text.length;
    if (Array.isArray(node.content)) node.content.forEach(walk);
  };
  walk(doc);
  return count;
};

const readingTime = computed(() => {
  const chars = countTextContent(blog.value?.content);
  const words = Math.ceil(chars / 5);
  return Math.max(1, Math.round(words / 200));
});

const updateProgress = () => {
  const docHeight = document.documentElement.scrollHeight - window.innerHeight;
  progress.value =
    docHeight > 0
      ? Math.min(100, Math.max(0, (window.scrollY / docHeight) * 100))
      : 0;
};

const fetchBlog = async () => {
  loading.value = true;
  error.value = "";

  try {
    const response = await blogAPI.getBlogBySlug(route.params.slug);
    blog.value = response.data.blog || null;
    if (blog.value) {
      likesCount.value = blog.value.likesCount || 0;
      liked.value = !!response.data.userLiked;
    } else {
      error.value = "Blog not found";
    }
  } catch (err) {
    error.value = err.response?.data?.message || "Failed to load blog";
  } finally {
    loading.value = false;
    requestAnimationFrame(updateProgress);
  }
};

const handleToggleLike = async () => {
  if (!authStore.isAuthenticated) {
    router.push({ name: "login", query: { redirect: route.fullPath } });
    return;
  }
  if (liking.value || !blog.value?._id) return;

  liking.value = true;
  try {
    const response = await likeAPI.toggleLike(blog.value._id);
    liked.value = response.data.liked;
    likesCount.value = response.data.likesCount;
  } catch (err) {
    if (err.response?.status === 401) {
      router.push({ name: "login", query: { redirect: route.fullPath } });
    }
  } finally {
    liking.value = false;
  }
};

watch(() => route.params.slug, fetchBlog);

onMounted(() => {
  fetchBlog();
  window.addEventListener("scroll", updateProgress, { passive: true });
  window.addEventListener("resize", updateProgress);
});

onUnmounted(() => {
  window.removeEventListener("scroll", updateProgress);
  window.removeEventListener("resize", updateProgress);
});
</script>

<style scoped>
@import url("https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,500;1,9..144,500&family=Source+Serif+4:opsz,wght@8..60,400;8..60,500&display=swap");

.font-display {
  font-family: "Fraunces", ui-serif, Georgia, serif;
}

.reading-content {
  font-family: "Source Serif 4", ui-serif, Georgia, serif;
  font-size: 18px;
  line-height: 1.8;
}

.reading-content :deep(p) {
  margin-bottom: 1.4em;
}

.reading-content :deep(h2) {
  font-family: "Fraunces", ui-serif, Georgia, serif;
  font-style: italic;
  font-size: 26px;
  line-height: 1.3;
  color: #111111;
  margin-top: 2em;
  margin-bottom: 0.7em;
}

.reading-content :deep(h3) {
  font-family: "Fraunces", ui-serif, Georgia, serif;
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
