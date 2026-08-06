<template>
  <router-link
    :to="`/blogs/${blog.slug}`"
    class="block bg-white rounded-[20px] shadow-[0_2px_12px_rgba(0,0,0,0.06)] p-4 transition-shadow hover:shadow-[0_4px_20px_rgba(0,0,0,0.1)]"
  >
    <!-- 16:9 cover -->
    <div class="aspect-video w-full overflow-hidden rounded-xl bg-gray-100 mb-4">
      <img
        v-if="blog.coverImage"
        :src="blog.coverImage"
        :alt="blog.title"
        class="h-full w-full object-cover"
        loading="lazy"
      />
      <div v-else class="h-full w-full flex items-center justify-center">
        <span class="text-2xl font-bold text-gray-300">{{ getInitials(blog.title) }}</span>
      </div>
    </div>

    <!-- Author row -->
    <div v-if="showAuthor && blog.author" class="mb-3 flex items-center gap-2">
      <img
        v-if="blog.author.picture"
        :src="blog.author.picture"
        :alt="blog.author.displayName || blog.author.publicId"
        class="h-6 w-6 rounded-full object-cover"
      />
      <div
        v-else
        class="h-6 w-6 rounded-full bg-gray-100 flex items-center justify-center text-[10px] font-bold text-gray-500"
      >
        {{ getInitials(blog.author.displayName || blog.author.publicId) }}
      </div>
      <span class="text-xs font-medium text-gray-500 truncate">
        {{ blog.author.displayName || blog.author.publicId }}
      </span>
      <span
        v-if="trending"
        class="ml-auto inline-flex items-center gap-1 text-xs font-semibold text-[#5B4BFF]"
      >
        <svg class="h-3.5 w-3.5" fill="currentColor" viewBox="0 0 20 20">
          <path
            fill-rule="evenodd"
            d="M5.05 3.636a1 1 0 010 1.414L3.464 6.636a1 1 0 11-1.414-1.414l1.586-1.586a1 1 0 011.414 0zm10 0a1 1 0 011.414 0l1.586 1.586a1 1 0 11-1.414 1.414l-1.586-1.586a1 1 0 010-1.414zM12 2a1 1 0 011 1v2a1 1 0 11-2 0V3a1 1 0 011-1zM5.05 16.364a1 1 0 01-1.414 0L2.05 14.778a1 1 0 111.414-1.414l1.586 1.586a1 1 0 010 1.414zM17 10a1 1 0 110 2h-2a1 1 0 110-2h2zm-8-2a4 4 0 108 0 4 4 0 00-8 0z"
            clip-rule="evenodd"
          />
        </svg>
        Trending
      </span>
    </div>

    <!-- Title -->
    <h3 class="font-serif text-lg font-bold leading-snug text-gray-900 line-clamp-2">
      {{ blog.title }}
    </h3>

    <!-- Excerpt -->
    <p v-if="blog.excerpt" class="mt-2 text-sm leading-relaxed text-gray-500 line-clamp-2">
      {{ blog.excerpt }}
    </p>

    <!-- Music badge -->
    <div
      v-if="blog.music?.title"
      class="mt-3 inline-flex items-center gap-1.5 rounded-full bg-[#5B4BFF]/10 px-2.5 py-1 text-xs font-medium text-[#5B4BFF] max-w-full"
    >
      <span class="text-xs">&#127925;</span>
      <span class="truncate">{{ blog.music.title }} &middot; {{ blog.music.artist }}</span>
    </div>

    <!-- Metadata -->
    <div class="mt-3 flex items-center gap-3 text-xs text-gray-400">
      <span class="inline-flex items-center gap-1">
        <svg class="h-3.5 w-3.5" fill="currentColor" viewBox="0 0 20 20">
          <path
            d="M10 18a1 1 0 01-.707-.293C8.286 16.7 4 13.223 4 9a6 6 0 1112 0c0 4.223-4.286 7.7-5.293 8.707A1 1 0 0110 18z"
          />
        </svg>
        {{ formatNumber(blog.likesCount || 0) }}
      </span>
      <span class="inline-flex items-center gap-1">
        <svg class="h-3.5 w-3.5" fill="currentColor" viewBox="0 0 20 20">
          <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
          <path
            fill-rule="evenodd"
            d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z"
            clip-rule="evenodd"
          />
        </svg>
        {{ formatNumber(blog.views || 0) }}
      </span>
      <span class="ml-auto">{{ formatRelativeTime(blog.publishedAt || blog.createdAt) }}</span>
    </div>
  </router-link>
</template>

<script setup>
import { getInitials, formatNumber, formatRelativeTime } from '@/utils/helpers'

defineProps({
  blog: {
    type: Object,
    required: true,
  },
  showAuthor: {
    type: Boolean,
    default: false,
  },
  trending: {
    type: Boolean,
    default: false,
  },
})
</script>
