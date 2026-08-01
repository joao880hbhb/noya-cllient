<template>
  <nav class="bg-white shadow-sm">
    <div class="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex items-center justify-between h-16">
        <!-- Brand -->
        <div class="flex items-center">
          <router-link
            to="/"
            class="flex items-center gap-2 text-xl sm:text-2xl font-bold text-[#5B4BFF]"
          >
            <svg class="h-7 w-7" viewBox="0 0 24 24" fill="currentColor">
              <path
                d="M5 4h14a1 1 0 011 1v14a1 1 0 01-1 1H5a1 1 0 01-1-1V5a1 1 0 011-1zm1 3v2h8V7H6zm0 4v2h12v-2H6zm0 4v2h9v-2H6z"
              />
            </svg>
            MyNoya
          </router-link>
        </div>

        <!-- Right side -->
        <div class="flex items-center gap-3 sm:gap-4">
          <template v-if="authStore.isAuthenticated">
            <!-- Create Blog (desktop) -->
            <router-link
              to="/blogs/create"
              class="hidden sm:inline-flex items-center gap-1.5 px-4 py-2 bg-[#5B4BFF] text-white text-sm font-medium rounded-full hover:bg-[#4a3dcc]"
            >
              <svg class="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fill-rule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z"
                  clip-rule="evenodd"
                />
              </svg>
              Tulis
            </router-link>

            <!-- Notification bell -->
            <div class="relative">
              <button
                @click="toggleNotifications"
                class="relative flex items-center justify-center h-10 w-10 rounded-full text-gray-500 hover:text-gray-700 hover:bg-gray-100 focus:outline-none"
              >
                <svg
                  class="h-6 w-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                  />
                </svg>
                <span
                  v-if="unreadCount > 0"
                  class="absolute -top-0.5 -right-0.5 min-w-4 h-4 px-1 rounded-full bg-red-500 text-white text-[10px] font-bold flex items-center justify-center"
                >
                  {{ unreadCount > 99 ? "99+" : unreadCount }}
                </span>
              </button>

              <!-- Notifications dropdown -->
              <div
                v-if="showNotifications"
                class="absolute right-0 mt-2 w-80 max-w-[90vw] bg-white rounded-xl shadow-lg py-1 z-10 border border-gray-100 overflow-hidden"
              >
                <div
                  class="px-4 py-3 border-b border-gray-100 flex items-center justify-between"
                >
                  <p class="text-sm font-semibold text-gray-900">Notifikasi</p>
                  <button
                    v-if="notifications.length"
                    @click="handleMarkAllRead"
                    class="text-xs font-medium text-[#5B4BFF] hover:underline"
                  >
                    Tandai semua dibaca
                  </button>
                </div>

                <div v-if="notifLoading" class="px-4 py-8 flex justify-center">
                  <div
                    class="animate-spin rounded-full h-6 w-6 border-b-2 border-[#5B4BFF]"
                  ></div>
                </div>

                <div
                  v-else-if="notifications.length"
                  class="max-h-96 overflow-y-auto"
                >
                  <router-link
                    v-for="notification in notifications"
                    :key="notification._id"
                    :to="`/blogs/${notification.blog?.slug}`"
                    @click="handleOpenNotification(notification)"
                    class="flex items-start gap-3 px-4 py-3 hover:bg-gray-50"
                    :class="notification.read ? 'opacity-70' : 'bg-[#5B4BFF]/5'"
                  >
                    <img
                      v-if="notification.actor?.picture"
                      :src="notification.actor.picture"
                      :alt="notification.actor.displayName || 'User'"
                      class="h-10 w-10 rounded-full object-cover shrink-0"
                    />
                    <div
                      v-else
                      class="h-10 w-10 rounded-full bg-[#5B4BFF]/10 text-[#5B4BFF] flex items-center justify-center text-sm font-bold shrink-0"
                    >
                      {{
                        getInitials(
                          notification.actor?.displayName ||
                            notification.actor?.publicId,
                        )
                      }}
                    </div>
                    <div class="min-w-0">
                      <p class="text-sm text-gray-800 leading-snug">
                        <span class="font-semibold">
                          {{ notification.actor?.displayName || "Seseorang" }}
                        </span>
                        menyukai blog kamu
                      </p>
                      <p class="text-xs text-gray-500 mt-0.5 truncate">
                        {{ notification.blog?.title }}
                      </p>
                      <p class="text-[11px] text-gray-400 mt-1">
                        {{ formatRelativeTime(notification.createdAt) }}
                      </p>
                    </div>
                    <span
                      v-if="!notification.read"
                      class="mt-1.5 ml-auto h-2 w-2 rounded-full bg-[#5B4BFF] shrink-0"
                    ></span>
                  </router-link>
                </div>

                <div v-else class="px-4 py-8 text-center">
                  <svg
                    class="mx-auto h-8 w-8 text-gray-300"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                    />
                  </svg>
                  <p class="mt-2 text-sm text-gray-500">Belum ada notifikasi</p>
                </div>
              </div>
            </div>

            <!-- User menu -->
            <div class="relative">
              <button
                @click="toggleUserMenu"
                class="flex items-center focus:outline-none"
              >
                <img
                  v-if="authStore.user?.picture"
                  :src="authStore.user.picture"
                  alt="Profile"
                  class="h-10 w-10 rounded-full object-cover ring-2 ring-gray-100 hover:ring-[#131315] transition"
                />
                <div
                  v-else
                  class="h-10 w-10 rounded-full bg-[#343437] flex items-center justify-center text-white text-sm font-bold ring-2 ring-gray-100 hover:ring-[#5B4BFF] transition"
                >
                  {{ getInitials(authStore.userDisplayName) }}
                </div>
              </button>

              <!-- Dropdown Menu -->
              <div
                v-if="showUserMenu"
                class="absolute right-0 mt-2 w-52 bg-white rounded-xl shadow-lg py-1 z-10 border border-gray-100"
              >
                <div class="px-4 py-3 border-b border-gray-100">
                  <p class="text-sm font-semibold text-gray-900 truncate">
                    {{ authStore.userDisplayName }}
                  </p>
                  <p class="text-xs text-gray-400 truncate">
                    {{ authStore.user?.email }}
                  </p>
                </div>
                <router-link
                  to="/profile"
                  @click="showUserMenu = false"
                  class="flex items-center gap-2 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50"
                >
                  <svg
                    class="h-4 w-4 text-gray-400"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fill-rule="evenodd"
                      d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                      clip-rule="evenodd"
                    />
                  </svg>
                  Your Profile
                </router-link>
                <router-link
                  to="/blogs/my-posts"
                  @click="showUserMenu = false"
                  class="flex items-center gap-2 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50"
                >
                  <svg
                    class="h-4 w-4 text-gray-400"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      d="M4 3a1 1 0 011-1h8.586a1 1 0 01.707.293l2.414 2.414A1 1 0 0117 5.414V17a1 1 0 01-1 1H5a1 1 0 01-1-1V3zm9 1v3h3l-3-3z"
                    />
                  </svg>
                  My Blogs
                </router-link>
                <button
                  @click="handleLogout"
                  class="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50"
                >
                  <svg class="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      fill-rule="evenodd"
                      d="M3 3a1 1 0 00-1 1v12a1 1 0 102 0V4a1 1 0 00-1-1zm10.293 9.293a1 1 0 001.414 1.414l3-3a1 1 0 000-1.414l-3-3a1 1 0 10-1.414 1.414L14.586 9H7a1 1 0 100 2h7.586l-1.293 1.293z"
                      clip-rule="evenodd"
                    />
                  </svg>
                  Sign out
                </button>
              </div>
            </div>
          </template>

          <!-- Guest -->
          <template v-else>
            <router-link
              to="/login"
              class="inline-flex items-center gap-2 px-5 py-2 bg-[#0e0e0e] text-white text-sm font-medium rounded-full hover:bg-[#4a3dcc]"
            >
              Masuk
            </router-link>
          </template>
        </div>
      </div>
    </div>
  </nav>
</template>

<script setup>
import { ref, onMounted, onUnmounted, watch } from "vue";
import { useRouter } from "vue-router";
import { useAuthStore } from "@/stores/auth";
import { notificationAPI } from "@/services/api";
import { formatRelativeTime } from "@/utils/helpers";

const router = useRouter();
const authStore = useAuthStore();
const showUserMenu = ref(false);
const showNotifications = ref(false);

const notifications = ref([]);
const unreadCount = ref(0);
const notifLoading = ref(false);
let pollTimer = null;

const toggleUserMenu = () => {
  showUserMenu.value = !showUserMenu.value;
  showNotifications.value = false;
};

const toggleNotifications = async () => {
  showNotifications.value = !showNotifications.value;
  showUserMenu.value = false;
  if (showNotifications.value) {
    await fetchNotifications();
  }
};

const fetchNotifications = async () => {
  if (!authStore.isAuthenticated) return;
  notifLoading.value = true;
  try {
    const response = await notificationAPI.getNotifications({
      page: 1,
      limit: 20,
    });
    notifications.value = response.data.notifications || [];
    unreadCount.value = response.data.unreadCount || 0;
  } catch (err) {
    // ignore — polling keeps trying
  } finally {
    notifLoading.value = false;
  }
};

const handleOpenNotification = async (notification) => {
  showNotifications.value = false;
  if (!notification.read) {
    try {
      await notificationAPI.markAsRead(notification._id);
      notification.read = true;
      unreadCount.value = Math.max(0, unreadCount.value - 1);
    } catch (err) {
      // ignore
    }
  }
};

const handleMarkAllRead = async () => {
  try {
    await notificationAPI.markAllAsRead();
    notifications.value.forEach((n) => (n.read = true));
    unreadCount.value = 0;
  } catch (err) {
    // ignore
  }
};

const getInitials = (name) => {
  if (!name) return "?";
  const parts = name.split(" ");
  if (parts.length >= 2) {
    return parts[0][0] + parts[1][0];
  }
  return name.substring(0, 2).toUpperCase();
};

const handleLogout = async () => {
  showUserMenu.value = false;
  await authStore.logout();
  router.push("/login");
};

const handleClickOutside = (event) => {
  if (showUserMenu.value || showNotifications.value) {
    const insideMenu = event.target.closest(".relative");
    if (!insideMenu) {
      showUserMenu.value = false;
      showNotifications.value = false;
    }
  }
};

// Fetch unread count when auth state changes
watch(
  () => authStore.isAuthenticated,
  (val) => {
    if (val) {
      fetchNotifications();
      pollTimer = setInterval(fetchNotifications, 30000);
    } else if (pollTimer) {
      clearInterval(pollTimer);
      pollTimer = null;
      notifications.value = [];
      unreadCount.value = 0;
    }
  },
);

onMounted(() => {
  window.addEventListener("click", handleClickOutside);
  if (authStore.isAuthenticated) {
    fetchNotifications();
    pollTimer = setInterval(fetchNotifications, 30000);
  }
});

onUnmounted(() => {
  window.removeEventListener("click", handleClickOutside);
  if (pollTimer) clearInterval(pollTimer);
});
</script>
