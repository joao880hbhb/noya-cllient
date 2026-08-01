<template>
  <div class="min-h-screen bg-gray-50 py-8">
    <div class="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="mb-8 flex items-center justify-between">
        <div>
          <h1 class="text-3xl font-bold text-gray-900">My Blogs</h1>
          <p class="mt-2 text-gray-600">Manage all of your blog posts</p>
        </div>
      </div>

      <!-- Loading state -->
      <div v-if="loading" class="flex justify-center items-center h-64">
        <div
          class="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"
        ></div>
      </div>

      <!-- Error state -->
      <div
        v-else-if="error"
        class="bg-red-50 border border-red-200 rounded-lg p-6"
      >
        <h3 class="text-red-800 font-semibold">Error loading your blogs</h3>
        <p class="text-red-600 mt-2">{{ error }}</p>
        <button
          @click="fetchBlogs"
          class="mt-4 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
        >
          Try Again
        </button>
      </div>

      <!-- Empty state -->
      <div
        v-else-if="blogs.length === 0"
        class="bg-white rounded-lg shadow p-12 text-center"
      >
        <h2 class="text-xl font-semibold text-gray-900">No blog posts yet</h2>
        <p class="mt-2 text-gray-600">
          Start sharing your thoughts with the community.
        </p>
        <router-link
          to="/blogs/create"
          class="mt-6 inline-block px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-md hover:bg-indigo-700"
        >
          Create your first blog
        </router-link>
      </div>

      <!-- Blog list -->
      <div v-else class="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <div
          v-for="blog in blogs"
          :key="blog._id"
          class="bg-white rounded-lg shadow overflow-hidden hover:shadow-lg transition-shadow flex flex-col"
        >
          <router-link :to="`/blogs/${blog.slug}`" class="flex-shrink-0">
            <img
              v-if="blog.coverImage"
              :src="blog.coverImage"
              :alt="blog.title"
              class="h-48 w-full object-cover"
            />
            <div
              v-else
              class="h-48 w-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center"
            >
              <span class="text-white text-4xl font-bold">
                {{ getInitials(blog.title) }}
              </span>
            </div>
          </router-link>

          <div class="p-5 flex-1 flex flex-col">
            <div class="mb-2 flex items-center justify-between">
              <span
                :class="{
                  'bg-green-100 text-green-800': blog.status === 'published',
                  'bg-amber-100 text-amber-800': blog.status === 'private',
                  'bg-gray-100 text-gray-700': blog.status === 'draft',
                }"
                class="px-2 py-1 text-xs font-medium rounded-full capitalize"
              >
                {{ blog.status }}
              </span>
              <span class="text-xs text-gray-500">
                {{ formatRelativeTime(blog.publishedAt || blog.createdAt) }}
              </span>
            </div>

            <router-link :to="`/blogs/${blog.slug}`" class="block group">
              <h2
                class="text-lg font-semibold text-gray-900 group-hover:text-indigo-600"
              >
                {{ blog.title }}
              </h2>
            </router-link>

            <p v-if="blog.excerpt" class="mt-2 text-sm text-gray-600 flex-1">
              {{ truncateText(blog.excerpt, 120) }}
            </p>

            <div
              class="mt-4 pt-4 border-t border-gray-100 flex items-center justify-between text-xs text-gray-500"
            >
              <span>{{ blog.views || 0 }} views</span>
              <span>{{ blog.likesCount || 0 }} likes</span>
            </div>

            <!-- Actions -->
            <div class="mt-3 flex items-center justify-end gap-2">
              <router-link
                :to="`/blogs/${blog.slug}/edit`"
                class="inline-flex items-center px-3 py-1.5 border border-gray-300 rounded-md text-xs font-medium text-gray-700 bg-white hover:bg-gray-50"
              >
                Edit
              </router-link>
              <button
                @click="handleDelete(blog)"
                :disabled="deletingId === blog._id"
                class="inline-flex items-center px-3 py-1.5 border border-red-300 rounded-md text-xs font-medium text-red-700 bg-white hover:bg-red-50 disabled:opacity-50"
              >
                {{ deletingId === blog._id ? "Deleting..." : "Delete" }}
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Pagination -->
      <div v-if="totalPages > 1" class="mt-8 flex items-center justify-between">
        <button
          @click="changePage(currentPage - 1)"
          :disabled="currentPage <= 1"
          class="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
        >
          &larr; Previous
        </button>
        <span class="text-sm text-gray-600">
          Page {{ currentPage }} of {{ totalPages }}
        </span>
        <button
          @click="changePage(currentPage + 1)"
          :disabled="currentPage >= totalPages"
          class="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
        >
          Next &rarr;
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { blogAPI } from "@/services/api";
import { getInitials, formatRelativeTime, truncateText } from "@/utils/helpers";
import { DEFAULT_PAGE_SIZE } from "@/utils/constants";

const blogs = ref([]);
const loading = ref(false);
const error = ref("");
const currentPage = ref(1);
const totalPages = ref(1);
const totalBlogs = ref(0);
const deletingId = ref(null);

const fetchBlogs = async () => {
  loading.value = true;
  error.value = "";

  try {
    const response = await blogAPI.getMyBlogs({
      page: currentPage.value,
      limit: DEFAULT_PAGE_SIZE,
    });

    const data = response.data;
    blogs.value = data.blogs || [];
    totalBlogs.value = data.totalBlogs || 0;
    totalPages.value = data.totalPages || 1;
  } catch (err) {
    error.value = err.response?.data?.message || "Failed to load your blogs";
  } finally {
    loading.value = false;
  }
};

const changePage = (page) => {
  if (page < 1 || page > totalPages.value) return;
  currentPage.value = page;
  fetchBlogs();
};

const handleDelete = async (blog) => {
  if (!confirm(`Delete "${blog.title}"? This action cannot be undone.`)) return;

  deletingId.value = blog._id;
  error.value = "";

  try {
    await blogAPI.deleteBlog(blog._id);
    if (blogs.value.length === 1 && currentPage.value > 1) {
      currentPage.value -= 1;
    }
    await fetchBlogs();
  } catch (err) {
    error.value = err.response?.data?.message || "Failed to delete blog";
  } finally {
    deletingId.value = null;
  }
};

onMounted(fetchBlogs);
</script>
