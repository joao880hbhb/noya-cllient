<template>
  <div class="min-h-screen bg-white">
    <div class="max-w-3xl mx-auto px-6 sm:px-10 py-16 sm:py-24">
      <!-- Masthead -->
      <div class="flex items-start justify-between gap-6 mb-14">
        <div>
          <p class="text-[11px] tracking-[0.2em] text-[#8A8A8A] uppercase mb-2">
            Compose &middot; New entry
          </p>
          <h1
            class="font-display italic text-[34px] sm:text-[42px] leading-[1.05] text-[#111111]"
          >
            Write something<br class="hidden sm:block" />
            worth reading.
          </h1>
        </div>
        <div class="hidden sm:block text-right pt-1 shrink-0">
          <p class="text-[11px] tracking-[0.15em] text-[#B0B0B0] uppercase">
            {{ todayStamp }}
          </p>
          <p class="text-[11px] text-[#B0B0B0] tabular-nums mt-0.5">
            {{ contentLength }} chars
          </p>
        </div>
      </div>

      <!-- Feedback -->
      <div
        v-if="successMessage"
        class="mb-6 border-l-2 border-[#111111] bg-[#FAFAFA] px-4 py-3"
      >
        <p class="text-sm text-[#111111]">{{ successMessage }}</p>
      </div>
      <div
        v-if="formError"
        class="mb-6 border-l-2 border-[#B3261E] bg-[#FDF7F6] px-4 py-3"
      >
        <p class="text-sm text-[#8C1D14]">{{ formError }}</p>
      </div>

      <form @submit.prevent="handleSubmit">
        <div
          class="relative border border-[#E7E7E7] rounded-[3px] shadow-[0_1px_2px_rgba(0,0,0,0.03),0_18px_40px_-16px_rgba(0,0,0,0.14)] bg-white"
        >
          <!-- decorative margin ruler -->
          <div
            class="hidden md:block absolute left-0 top-0 bottom-0 w-6 bg-[repeating-linear-gradient(to_bottom,#E7E7E7_0,#E7E7E7_1px,transparent_1px,transparent_10px)] opacity-70"
          ></div>

          <div class="md:pl-8">
            <!-- Status -->
            <div
              class="flex items-center justify-between px-8 sm:px-14 pt-9 pb-7 border-b border-[#F0F0F0]"
            >
              <span
                class="text-[11px] tracking-[0.15em] text-[#8A8A8A] uppercase"
                >Status</span
              >
              <div class="flex items-center gap-5">
                <button
                  v-for="opt in statusOptions"
                  :key="opt.value"
                  type="button"
                  @click="status = opt.value"
                  class="text-[13px] pb-0.5 border-b transition-colors"
                  :class="
                    status === opt.value
                      ? 'text-[#111111] border-[#111111] font-medium'
                      : 'text-[#B0B0B0] border-transparent hover:text-[#6B6B6B]'
                  "
                >
                  {{ opt.label }}
                </button>
              </div>
            </div>

            <!-- Title -->
            <div
              class="grid md:grid-cols-[140px_1fr] gap-x-10 sm:gap-x-14 px-8 sm:px-14 py-10 sm:py-12 border-b border-[#F0F0F0]"
            >
              <label
                for="title"
                class="text-[11px] tracking-[0.15em] text-[#8A8A8A] uppercase pt-1"
              >
                Title <span class="text-[#B3261E]">*</span>
              </label>
              <div>
                <input
                  id="title"
                  v-model="title"
                  type="text"
                  :maxlength="BLOG_TITLE_MAX_LENGTH"
                  class="w-full text-[22px] font-display text-[#111111] placeholder-[#C9C9C9] border-0 border-b border-[#E7E7E7] focus:border-[#111111] focus:ring-0 px-0 pb-2 bg-transparent transition-colors"
                  placeholder="Give your post a title"
                />
                <p class="mt-2 text-[11px] text-[#B0B0B0] tabular-nums">
                  {{ title.length }} / {{ BLOG_TITLE_MAX_LENGTH }}
                </p>
              </div>
            </div>

            <!-- Content -->
            <div
              class="grid md:grid-cols-[140px_1fr] gap-x-10 sm:gap-x-14 px-8 sm:px-14 py-10 sm:py-12 border-b border-[#F0F0F0]"
            >
              <label
                class="text-[11px] tracking-[0.15em] text-[#8A8A8A] uppercase pt-1"
              >
                Body <span class="text-[#B3261E]">*</span>
              </label>
              <div>
                <BlogEditor v-model="content" />
                <p
                  class="mt-2 text-[11px] text-[#B0B0B0] text-right tabular-nums"
                >
                  {{ contentLength }} characters
                </p>
              </div>
            </div>

            <!-- Excerpt -->
            <div
              class="grid md:grid-cols-[140px_1fr] gap-x-10 sm:gap-x-14 px-8 sm:px-14 py-10 sm:py-12 border-b border-[#F0F0F0]"
            >
              <label
                for="excerpt"
                class="text-[11px] tracking-[0.15em] text-[#8A8A8A] uppercase pt-1"
              >
                Excerpt
              </label>
              <div>
                <textarea
                  id="excerpt"
                  v-model="excerpt"
                  rows="2"
                  :maxlength="BLOG_EXCERPT_LENGTH"
                  class="w-full text-[14px] text-[#111111] placeholder-[#C9C9C9] border border-[#E7E7E7] rounded-[2px] focus:border-[#111111] focus:ring-0 px-3 py-2.5 resize-none transition-colors"
                  placeholder="A short line shown in blog listings"
                ></textarea>
                <p
                  class="mt-2 text-[11px] text-[#B0B0B0] text-right tabular-nums"
                >
                  {{ excerpt.length }} / {{ BLOG_EXCERPT_LENGTH }}
                </p>
              </div>
            </div>

            <!-- Cover image -->
            <div
              class="grid md:grid-cols-[140px_1fr] gap-x-10 sm:gap-x-14 px-8 sm:px-14 py-10 sm:py-12 border-b border-[#F0F0F0]"
            >
              <label
                class="text-[11px] tracking-[0.15em] text-[#8A8A8A] uppercase pt-1"
              >
                Cover
              </label>
              <div>
                <div
                  v-if="coverPreview"
                  class="relative border border-[#E7E7E7] rounded-[2px] overflow-hidden mb-3"
                >
                  <img
                    :src="coverPreview"
                    alt="Cover preview"
                    class="w-full max-h-56 object-cover"
                  />
                </div>
                <div
                  v-else
                  class="border border-dashed border-[#D8D8D8] rounded-[2px] h-28 flex items-center justify-center mb-3"
                >
                  <span class="text-[12px] text-[#B0B0B0]"
                    >No image selected</span
                  >
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
                    class="inline-flex items-center px-3.5 py-1.5 border border-[#111111] rounded-[2px] text-[12px] font-medium text-[#111111] hover:bg-[#111111] hover:text-white transition-colors cursor-pointer"
                  >
                    {{ coverPreview ? "Replace" : "Upload image" }}
                  </label>
                  <button
                    v-if="coverPreview"
                    type="button"
                    @click="removeCover"
                    class="text-[12px] text-[#B0B0B0] hover:text-[#B3261E] transition-colors"
                  >
                    Remove
                  </button>
                  <span class="text-[11px] text-[#C4C4C4] ml-auto"
                    >Max {{ MAX_FILE_SIZE / 1024 / 1024 }}MB</span
                  >
                </div>
              </div>
            </div>

            <!-- Tags -->
            <div
              class="grid md:grid-cols-[140px_1fr] gap-x-10 sm:gap-x-14 px-8 sm:px-14 py-10 sm:py-12 border-b border-[#F0F0F0]"
            >
              <label
                for="tags"
                class="text-[11px] tracking-[0.15em] text-[#8A8A8A] uppercase pt-1"
              >
                Tags
              </label>
              <div>
                <input
                  id="tags"
                  v-model="tagsInput"
                  type="text"
                  class="w-full text-[14px] text-[#111111] placeholder-[#C9C9C9] border-0 border-b border-[#E7E7E7] focus:border-[#111111] focus:ring-0 px-0 pb-2 bg-transparent transition-colors"
                  placeholder="music, review, tutorial"
                />
                <div
                  v-if="parsedTags.length"
                  class="flex flex-wrap gap-1.5 mt-3"
                >
                  <span
                    v-for="tag in parsedTags"
                    :key="tag"
                    class="text-[11px] text-[#4B4B4B] border border-[#E7E7E7] rounded-full px-2.5 py-0.5"
                  >
                    {{ tag }}
                  </span>
                </div>
                <p v-else class="mt-2 text-[11px] text-[#C4C4C4]">
                  Separate with commas &mdash; optional
                </p>
              </div>
            </div>

            <!-- Music -->
            <div
              class="grid md:grid-cols-[140px_1fr] gap-x-10 sm:gap-x-14 px-8 sm:px-14 py-10 sm:py-12"
            >
              <label
                class="text-[11px] tracking-[0.15em] text-[#8A8A8A] uppercase pt-1"
              >
                Soundtrack
              </label>
              <div>
                <!-- Selected -->
                <div
                  v-if="selectedMusic"
                  class="flex items-center gap-4 border border-[#111111] rounded-[2px] p-3"
                >
                  <img
                    v-if="selectedMusic.cover"
                    :src="selectedMusic.cover"
                    :alt="selectedMusic.title"
                    class="h-12 w-12 rounded-[2px] object-cover shrink-0"
                  />
                  <div class="flex-1 min-w-0">
                    <p class="text-[13px] font-medium text-[#111111] truncate">
                      {{ selectedMusic.title }}
                    </p>
                    <p class="text-[12px] text-[#8A8A8A] truncate">
                      {{ selectedMusic.artist }}
                    </p>
                  </div>
                  <button
                    type="button"
                    @click="selectedMusic = null"
                    class="text-[12px] text-[#B0B0B0] hover:text-[#B3261E] transition-colors shrink-0"
                  >
                    Remove
                  </button>
                </div>

                <!-- Search -->
                <div v-else class="flex items-center gap-3">
                  <input
                    v-model="searchQuery"
                    type="text"
                    class="flex-1 text-[14px] text-[#111111] placeholder-[#C9C9C9] border-0 border-b border-[#E7E7E7] focus:border-[#111111] focus:ring-0 px-0 pb-2 bg-transparent transition-colors"
                    placeholder="Search for a track&hellip;"
                    @keyup.enter.prevent="searchMusic"
                  />
                  <svg
                    v-if="musicSearching"
                    class="animate-spin h-4 w-4 text-[#111111] shrink-0"
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
                  class="mt-3 border border-[#E7E7E7] rounded-[2px] divide-y divide-[#F0F0F0]"
                >
                  <button
                    v-for="track in musicResults"
                    :key="track.trackId"
                    type="button"
                    @click="selectTrack(track)"
                    class="w-full flex items-center gap-3 p-2.5 hover:bg-[#FAFAFA] text-left transition-colors"
                  >
                    <img
                      v-if="track.cover"
                      :src="track.cover"
                      :alt="track.title"
                      class="h-9 w-9 rounded-[2px] object-cover shrink-0"
                    />
                    <div class="flex-1 min-w-0">
                      <p
                        class="text-[13px] font-medium text-[#111111] truncate"
                      >
                        {{ track.title }}
                      </p>
                      <p class="text-[11px] text-[#8A8A8A] truncate">
                        {{ track.artist }}
                      </p>
                    </div>
                    <span
                      class="text-[11px] text-[#C4C4C4] tabular-nums shrink-0"
                      >{{ formatDuration(track.duration) }}</span
                    >
                  </button>
                </div>
                <p
                  v-if="musicSearchError"
                  class="mt-2 text-[12px] text-[#B3261E]"
                >
                  {{ musicSearchError }}
                </p>
                <p v-else class="mt-2 text-[11px] text-[#C4C4C4]">
                  Optional &mdash; attach a track to this post
                </p>
              </div>
            </div>
          </div>
        </div>

        <!-- Actions -->
        <div class="flex items-center justify-end gap-4 mt-10">
          <button
            type="button"
            @click="router.push('/blogs')"
            class="px-4 py-2 text-[13px] font-medium text-[#6B6B6B] hover:text-[#111111] transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            :disabled="saving"
            class="inline-flex items-center px-5 py-2.5 bg-[#111111] text-white rounded-[2px] text-[13px] font-medium shadow-[0_1px_2px_rgba(0,0,0,0.05),0_10px_20px_-8px_rgba(0,0,0,0.35)] hover:bg-black disabled:opacity-50 transition-colors"
          >
            <svg
              v-if="saving"
              class="animate-spin -ml-1 mr-2 h-3.5 w-3.5 text-white"
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
            {{ saving ? "Publishing…" : "Create post" }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, computed } from "vue";
import { useRouter } from "vue-router";
import { blogAPI, musicAPI } from "@/services/api";
import BlogEditor from "@/components/BlogEditor.vue";
import { debounce } from "@/utils/helpers";
import {
  BLOG_TITLE_MAX_LENGTH,
  BLOG_EXCERPT_LENGTH,
  MAX_FILE_SIZE,
  ALLOWED_IMAGE_TYPES,
  SUCCESS_MESSAGES,
} from "@/utils/constants";

const router = useRouter();

// Form state
const title = ref("");
const content = ref(null);
const excerpt = ref("");
const tagsInput = ref("");
const status = ref("draft");

const statusOptions = [
  { value: "draft", label: "Draft" },
  { value: "private", label: "Private" },
  { value: "published", label: "Published" },
];

// Cover image
const coverFile = ref(null);
const coverPreview = ref("");

// Music
const searchQuery = ref("");
const musicResults = ref([]);
const musicSearching = ref(false);
const musicSearchError = ref("");
const selectedMusic = ref(null);

// UI state
const saving = ref(false);
const formError = ref("");
const successMessage = ref("");

const todayStamp = new Date().toLocaleDateString("en-US", {
  month: "short",
  day: "numeric",
  year: "numeric",
});

const parsedTags = computed(() =>
  tagsInput.value
    .split(",")
    .map((tag) => tag.trim())
    .filter(Boolean),
);

const formatDuration = (seconds) => {
  if (!seconds) return "";
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${String(secs).padStart(2, "0")}`;
};

const handleCoverChange = (event) => {
  const file = event.target.files?.[0];
  event.target.value = "";
  if (!file) return;

  if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
    formError.value = "Invalid file type. Please upload an image file.";
    return;
  }

  if (file.size > MAX_FILE_SIZE) {
    formError.value = `File size must be less than ${MAX_FILE_SIZE / 1024 / 1024}MB`;
    return;
  }

  coverFile.value = file;
  coverPreview.value = URL.createObjectURL(file);
  formError.value = "";
};

const removeCover = () => {
  coverFile.value = null;
  coverPreview.value = "";
};

const searchMusic = async () => {
  const keyword = searchQuery.value.trim();
  if (!keyword || keyword.length < 2) {
    musicResults.value = [];
    musicSearchError.value = "";
    return;
  }

  musicSearching.value = true;
  musicSearchError.value = "";

  try {
    const response = await musicAPI.searchMusic({
      keyword,
      limit: 8,
    });
    musicResults.value = response.data.data || [];
    if (!musicResults.value.length) {
      musicSearchError.value = "No tracks found. Try a different search.";
    }
  } catch (err) {
    musicSearchError.value =
      err.response?.data?.message || "Failed to search music";
  } finally {
    musicSearching.value = false;
  }
};

const debouncedSearch = debounce(searchMusic, 400);

watch(searchQuery, () => {
  debouncedSearch();
});

const selectTrack = (track) => {
  selectedMusic.value = {
    provider: "deezer",
    trackId: track.trackId,
    title: track.title,
    artist: track.artist,
    album: track.album,
    cover: track.cover,
    previewUrl: track.previewUrl,
    deezerUrl: track.deezerUrl,
    duration: track.duration,
  };
  musicResults.value = [];
  searchQuery.value = "";
  musicSearchError.value = "";
};

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

const contentLength = computed(() => countTextContent(content.value));

const handleSubmit = async () => {
  formError.value = "";
  successMessage.value = "";

  if (!title.value.trim()) {
    formError.value = "Title is required";
    return;
  }
  if (title.value.trim().length < 3) {
    formError.value = "Title must be at least 3 characters";
    return;
  }
  if (contentLength.value < 10) {
    formError.value = "Content must be at least 10 characters";
    return;
  }

  const formData = new FormData();
  formData.append("title", title.value.trim());
  formData.append("content", JSON.stringify(content.value));
  formData.append("status", status.value);
  if (excerpt.value.trim()) formData.append("excerpt", excerpt.value.trim());
  if (coverFile.value) formData.append("coverImage", coverFile.value);

  const tags = tagsInput.value
    .split(",")
    .map((tag) => tag.trim())
    .filter(Boolean);
  if (tags.length) formData.append("tags", JSON.stringify(tags));
  if (selectedMusic.value)
    formData.append("music", JSON.stringify(selectedMusic.value));

  saving.value = true;
  try {
    const response = await blogAPI.createBlog(formData);
    successMessage.value = SUCCESS_MESSAGES.BLOG_CREATED;
    const blog = response.data.blog;
    if (blog?.slug) {
      router.push(`/blogs/${blog.slug}`);
    } else {
      router.push("/blogs");
    }
  } catch (err) {
    formError.value = err.response?.data?.message || "Failed to create blog";
  } finally {
    saving.value = false;
  }
};
</script>

<style scoped>
@import url("https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,500;1,9..144,500&display=swap");

.font-display {
  font-family: "Fraunces", ui-serif, Georgia, serif;
}
</style>
