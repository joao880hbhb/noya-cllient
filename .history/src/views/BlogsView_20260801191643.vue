<template>
  <div class="min-h-screen bg-gray-50 py-8">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <!-- Header -->
      <div class="mb-6">
        <h1 class="text-2xl sm:text-3xl font-serif font-bold text-gray-900">
          Semua cerita
        </h1>
        <p class="mt-1 text-sm text-gray-500">
          Jelajahi semua blog dari komunitas MyNoya
        </p>
      </div>

      <!-- Sort tabs -->
      <div class="mb-6 flex items-center gap-2 border-b border-gray-200">
        <button
          v-for="tab in tabs"
          :key="tab.value"
          @click="switchSort(tab.value)"
          class="px-4 py-2.5 text-sm font-medium border-b-2 -mb-px transition-colors"
          :class="
            sort === tab.value
              ? 'border-[#5B4BFF] text-[#5B4BFF]'
              : 'border-transparent text-gray-500 hover:text-gray-700'
          "
        >
          {{ tab.label }}
        </button>
      </div>

      <!-- Loading state -->
      <div
        v-if="loading"
        class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
      >
        <div
          v-for="i in 6"
          :key="i"
          class="bg-white rounded-[20px] p-4 shadow-[0_2px_12px_rgba(0,0,0,0.06)] animate-pulse"
        >
          <div class="aspect-video rounded-xl bg-gray-100 mb-4"></div>
          <div class="h-4 bg-gray-100 rounded mb-2 w-3/4"></div>
          <div class="h-3 bg-gray-100 rounded mb-2 w-full"></div>
          <div class="h-3 bg-gray-100 rounded w-2/3"></div>
        </div>
      </div>

      <!-- Error state -->
      <div v-else-if="error" class="text-center py-20">
        <p class="text-gray-500">{{ error }}</p>
        <button
          @click="fetchBlogs"
          class="mt-4 px-4 py-2 bg-[#5B4BFF] text-white rounded-full text-sm font-medium hover:bg-[#4a3dcc]"
        >
          Coba lagi
        </button>
      </div>

      <!-- Blog grid -->
      <div
        v-else-if="blogs.length"
        class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
      >
        <BlogCard
          v-for="blog in blogs"
          :key="blog._id"
          :blog="blog"
          :show-author="true"
          :trending="sort === 'trending'"
        />
      </div>

      <!-- Empty state -->
      <div
        v-else
        class="rounded-[20px] bg-white shadow-[0_2px_12px_rgba(0,0,0,0.06)] py-16 px-6 text-center"
      >
        <div
          class="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-gray-50"
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
      </div>

      <!-- Pagination -->
      <div
        v-if="totalPages > 1"
        class="mt-10 flex items-center justify-center gap-3"
      >
        <button
          :disabled="currentPage <= 1"
          @click="goToPage(currentPage - 1)"
          class="px-4 py-2 rounded-full border border-gray-300 text-sm font-medium text-gray-700 hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed"
        >
          &larr; Sebelumnya
        </button>
        <span class="text-sm text-gray-500">
          Halaman {{ currentPage }} / {{ totalPages }}
        </span>
        <button
          :disabled="currentPage >= totalPages"
          @click="goToPage(currentPage + 1)"
          class="px-4 py-2 rounded-full border border-gray-300 text-sm font-medium text-gray-700 hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed"
        >
          Berikutnya &rarr;
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import { blogAPI } from "@/services/api";
import BlogCard from "@/components/BlogCard.vue";

const route = useRoute();
const router = useRouter();

const tabs = [
  { label: "Trending", value: "trending" },
  { label: "Terbaru", value: "latest" },
];

const sort = ref(route.query.sort === "latest" ? "latest" : "trending");
const blogs = ref([]);
const loading = ref(false);
const error = ref("");
const currentPage = ref(1);
const totalPages = ref(1);
const pageSize = 9;

const fetchBlogs = async () => {
  loading.value = true;
  error.value = "";
  try {
    const params = {
      page: currentPage.value,
      limit: pageSize,
    };
    if (sort.value === "trending") {
      params.sort = "trending";
    }
    const response = await blogAPI.getAllBlogs(params);
    blogs.value = response.data.blogs || [];
    totalPages.value = Math.max(1, response.data.totalPages || 1);
  } catch (err) {
    error.value = err.response?.data?.message || "Gagal memuat blog";
  } finally {
    loading.value = false;
  }
};

const switchSort = (value) => {
  if (sort.value === value) return;
  sort.value = value;
  currentPage.value = 1;
  router.replace({
    query: { sort: value === "latest" ? "latest" : "trending" },
  });
  fetchBlogs();
};

const goToPage = (page) => {
  if (page < 1 || page > totalPages.value) return;
  currentPage.value = page;
  fetchBlogs();
  window.scrollTo({ top: 0, behavior: "smooth" });
};

onMounted(fetchBlogs);
</script>
