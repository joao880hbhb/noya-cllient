<template>
  <div class="min-h-screen bg-gray-50 py-8">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <!-- Loading state -->
      <div
        v-if="authStore.isLoading"
        class="flex justify-center items-center h-64"
      >
        <div
          class="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"
        ></div>
      </div>

      <!-- Profile content -->
      <div v-else-if="authStore.user" class="bg-white shadow rounded-lg">
        <!-- Header -->
        <div class="px-6 py-8 border-b border-gray-200">
          <div class="flex items-center">
            <div class="flex-shrink-0">
              <img
                v-if="authStore.user.picture"
                :src="authStore.user.picture"
                alt="Profile"
                class="h-24 w-24 rounded-full object-cover"
              />
              <div
                v-else
                class="h-24 w-24 rounded-full bg-indigo-600 flex items-center justify-center text-white text-3xl font-bold"
              >
                {{ getInitials(authStore.userDisplayName) }}
              </div>
            </div>
            <div class="ml-6">
              <h1 class="text-3xl font-bold text-gray-900">
                {{ authStore.userDisplayName }}
              </h1>
              <p class="text-gray-600">{{ authStore.user.email }}</p>
              <p v-if="authStore.user.bio" class="mt-2 text-gray-700">
                {{ authStore.user.bio }}
              </p>
            </div>
          </div>
        </div>

        <!-- Profile details -->
        <div class="px-6 py-6">
          <h2 class="text-xl font-semibold text-gray-900 mb-4">
            Profile Information
          </h2>
          <dl class="grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-2">
            <div>
              <dt class="text-sm font-medium text-gray-500">Full Name</dt>
              <dd class="mt-1 text-sm text-gray-900">
                {{ authStore.userDisplayName }}
              </dd>
            </div>
            <div>
              <dt class="text-sm font-medium text-gray-500">Email</dt>
              <dd class="mt-1 text-sm text-gray-900">
                {{ authStore.user.email }}
              </dd>
            </div>
            <div>
              <dt class="text-sm font-medium text-gray-500">Public ID</dt>
              <dd class="mt-1 text-sm text-gray-900">
                {{ authStore.user.publicId || "Not set" }}
              </dd>
            </div>
            <div>
              <dt class="text-sm font-medium text-gray-500">Privacy</dt>
              <dd class="mt-1 text-sm text-gray-900">
                {{ authStore.user.isPublic === false ? "Private" : "Public" }}
              </dd>
            </div>
            <div
              v-if="
                authStore.user.address?.city || authStore.user.address?.country
              "
            >
              <dt class="text-sm font-medium text-gray-500">Location</dt>
              <dd class="mt-1 text-sm text-gray-900">
                {{ authStore.user.address.city || ""
                }}{{
                  authStore.user.address.city && authStore.user.address.country
                    ? ", "
                    : ""
                }}{{ authStore.user.address.country || "" }}
              </dd>
            </div>
            <div v-if="authStore.user.socialMedia?.website">
              <dt class="text-sm font-medium text-gray-500">Website</dt>
              <dd class="mt-1 text-sm text-gray-900">
                <a
                  :href="authStore.user.socialMedia.website"
                  target="_blank"
                  class="text-indigo-600 hover:text-indigo-500"
                >
                  {{ authStore.user.socialMedia.website }}
                </a>
              </dd>
            </div>
          </dl>
        </div>

        <!-- Actions -->
        <div
          class="px-6 py-4 bg-gray-50 border-t border-gray-200 flex flex-wrap items-center justify-between gap-3"
        >
          <div class="flex items-center gap-3">
            <button
              @click="handleEditProfile"
              class="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Edit Profile
            </button>
            <router-link
              v-if="authStore.user.publicId"
              :to="`/profile/${authStore.user.publicId}`"
              class="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-100"
            >
              View Public Profile
            </router-link>
          </div>
          <button
            @click="handleLogout"
            class="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
          >
            Logout
          </button>
        </div>
      </div>

      <!-- Error state -->
      <div
        v-else-if="authStore.error"
        class="bg-red-50 border border-red-200 rounded-lg p-6"
      >
        <h3 class="text-red-800 font-semibold">Error loading profile</h3>
        <p class="text-red-600 mt-2">{{ authStore.error }}</p>
        <button
          @click="authStore.fetchUserProfile()"
          class="mt-4 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
        >
          Try Again
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from "vue-router";
import { useAuthStore } from "@/stores/auth";
import { getInitials } from "@/utils/helpers";

const router = useRouter();
const authStore = useAuthStore();

const handleEditProfile = () => {
  router.push("/profile/edit");
};

const handleLogout = async () => {
  if (confirm("Are you sure you want to logout?")) {
    await authStore.logout();
    router.push("/login");
  }
};
</script>
