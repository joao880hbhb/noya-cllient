<template>
  <div class="marquee" :class="direction === 'right' ? 'marquee-right' : 'marquee-left'">
    <div class="marquee-track">
      <!-- Render 2x identik supaya loop mulus saat translasi -50% -->
      <div v-for="copy in 2" :key="copy" class="marquee-copy flex items-center">
        <router-link
          v-for="user in users"
          :key="`${copy}-${user.publicId}`"
          :to="`/profile/${user.publicId}`"
          class="flex items-center gap-2.5 rounded-full border py-1.5 pl-1.5 pr-4 mr-3.5 transition-colors"
          :class="
            isDark
              ? 'bg-white/[0.04] border-white/[0.08] text-stone-100 hover:bg-white/[0.08]'
              : 'bg-white border-stone-200 text-stone-800 hover:bg-stone-50'
          "
        >
          <img
            v-if="user.picture"
            :src="user.picture"
            :alt="user.displayName"
            class="h-9 w-9 rounded-full object-cover shrink-0"
          />
          <div
            v-else
            class="h-9 w-9 rounded-full bg-purple-500/15 text-purple-600 flex items-center justify-center text-xs font-bold shrink-0"
          >
            {{ getInitials(user.displayName) }}
          </div>
          <span class="text-sm font-medium whitespace-nowrap">
            {{ user.displayName }}
          </span>
        </router-link>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  users: { type: Array, default: () => [] },
  direction: { type: String, default: 'left' }, // 'left' | 'right'
  isDark: { type: Boolean, default: false },
})

const getInitials = (name) => {
  if (!name) return '?'
  const parts = name.split(' ')
  if (parts.length >= 2) return parts[0][0] + parts[1][0]
  return name.substring(0, 2).toUpperCase()
}
</script>

<style scoped>
.marquee {
  overflow: hidden;
}

.marquee-track {
  display: flex;
  width: max-content;
  will-change: transform;
}

.marquee-left .marquee-track {
  animation: marquee-left 55s linear infinite;
}

.marquee-right .marquee-track {
  animation: marquee-right 55s linear infinite;
}

.marquee:hover .marquee-track {
  animation-play-state: paused;
}

@keyframes marquee-left {
  from {
    transform: translateX(0);
  }
  to {
    transform: translateX(-50%);
  }
}

@keyframes marquee-right {
  from {
    transform: translateX(-50%);
  }
  to {
    transform: translateX(0);
  }
}
</style>