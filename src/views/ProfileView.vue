<template>
  <div class="min-h-screen bg-gray-50 py-10">
    <div class="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
      <!-- Loading state -->
      <div
        v-if="authStore.isLoading"
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
        <p class="text-sm text-gray-400">Loading account…</p>
      </div>

      <template v-else-if="authStore.user">
        <!-- Header card -->
        <div
          class="bg-white border border-gray-200 rounded-xl shadow-sm p-6 sm:p-8"
        >
          <div class="flex flex-col sm:flex-row sm:items-center gap-5">
            <img
              v-if="authStore.user.picture"
              :src="authStore.user.picture"
              alt="Profile"
              class="h-20 w-20 rounded-full object-cover border border-gray-200"
            />
            <div
              v-else
              class="h-20 w-20 rounded-full bg-[#111111] flex items-center justify-center text-white text-2xl font-semibold shrink-0"
            >
              {{ getInitials(username) }}
            </div>

            <div class="flex-1 min-w-0">
              <h1 class="text-xl font-semibold text-gray-900">
                {{ username }}
              </h1>
              <p class="text-sm text-gray-500">{{ authStore.user.email }}</p>
              <p
                v-if="authStore.user.bio"
                class="mt-2 text-sm text-gray-600 leading-relaxed"
              >
                {{ authStore.user.bio }}
              </p>
            </div>

            <span
              class="inline-flex items-center gap-1.5 self-start px-2.5 py-1 rounded-full text-xs font-medium border"
              :class="
                authStore.user.isPublic === false
                  ? 'border-gray-200 text-gray-500 bg-gray-50'
                  : 'border-green-200 text-green-700 bg-green-50'
              "
            >
              <span
                class="h-1.5 w-1.5 rounded-full"
                :class="
                  authStore.user.isPublic === false
                    ? 'bg-gray-400'
                    : 'bg-green-500'
                "
              ></span>
              {{
                authStore.user.isPublic === false
                  ? "Private profile"
                  : "Public profile"
              }}
            </span>
          </div>

          <div
            class="mt-6 pt-5 border-t border-gray-100 flex flex-wrap items-center justify-between gap-3"
          >
            <div class="flex items-center gap-3">
              <button
                @click="handleEditProfile"
                class="px-4 py-2 bg-[#111111] text-white text-sm font-medium rounded-lg hover:bg-black transition-colors"
              >
                Edit profile
              </button>
              <router-link
                v-if="authStore.user.publicId"
                :to="`/profile/${authStore.user.publicId}`"
                class="px-4 py-2 border border-gray-300 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-50 transition-colors"
              >
                View public profile
              </router-link>
            </div>
            <button
              @click="handleLogout"
              class="text-sm font-medium text-gray-400 hover:text-red-600 transition-colors"
            >
              Logout
            </button>
          </div>
        </div>

        <!-- Personal information -->
        <div
          class="bg-white border border-gray-200 rounded-xl shadow-sm p-6 sm:p-8"
        >
          <h2 class="text-sm font-semibold text-gray-900 mb-5">
            Personal information
          </h2>
          <dl class="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-5">
            <div v-if="authStore.user.firstName">
              <dt class="text-xs text-gray-400">First name</dt>
              <dd class="mt-0.5 text-sm text-gray-900">
                {{ authStore.user.firstName }}
              </dd>
            </div>
            <div v-if="authStore.user.lastName">
              <dt class="text-xs text-gray-400">Last name</dt>
              <dd class="mt-0.5 text-sm text-gray-900">
                {{ authStore.user.lastName }}
              </dd>
            </div>
            <div v-if="authStore.user.phoneNumber">
              <dt class="text-xs text-gray-400">Phone number</dt>
              <dd class="mt-0.5 text-sm text-gray-900">
                {{ authStore.user.phoneNumber }}
              </dd>
            </div>
            <div v-if="dateOfBirthDisplay">
              <dt class="text-xs text-gray-400">Date of birth</dt>
              <dd class="mt-0.5 text-sm text-gray-900">
                {{ dateOfBirthDisplay }}
              </dd>
            </div>
            <div v-if="authStore.user.gender">
              <dt class="text-xs text-gray-400">Gender</dt>
              <dd class="mt-0.5 text-sm text-gray-900 capitalize">
                {{ formattedGender }}
              </dd>
            </div>
          </dl>
          <p v-if="!hasPersonalInfo" class="text-sm text-gray-400">
            No personal information added yet.
          </p>
        </div>

        <!-- Address -->
        <div
          v-if="hasAddress"
          class="bg-white border border-gray-200 rounded-xl shadow-sm p-6 sm:p-8"
        >
          <h2 class="text-sm font-semibold text-gray-900 mb-5">Address</h2>
          <dl class="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-5">
            <div v-if="authStore.user.address?.street" class="sm:col-span-2">
              <dt class="text-xs text-gray-400">Street</dt>
              <dd class="mt-0.5 text-sm text-gray-900">
                {{ authStore.user.address.street }}
              </dd>
            </div>
            <div v-if="authStore.user.address?.city">
              <dt class="text-xs text-gray-400">City</dt>
              <dd class="mt-0.5 text-sm text-gray-900">
                {{ authStore.user.address.city }}
              </dd>
            </div>
            <div v-if="authStore.user.address?.state">
              <dt class="text-xs text-gray-400">State</dt>
              <dd class="mt-0.5 text-sm text-gray-900">
                {{ authStore.user.address.state }}
              </dd>
            </div>
            <div v-if="authStore.user.address?.postalCode">
              <dt class="text-xs text-gray-400">Postal code</dt>
              <dd class="mt-0.5 text-sm text-gray-900">
                {{ authStore.user.address.postalCode }}
              </dd>
            </div>
            <div v-if="authStore.user.address?.country">
              <dt class="text-xs text-gray-400">Country</dt>
              <dd class="mt-0.5 text-sm text-gray-900">
                {{ authStore.user.address.country }}
              </dd>
            </div>
          </dl>
        </div>

        <!-- Social media -->
        <div
          v-if="hasSocialMedia"
          class="bg-white border border-gray-200 rounded-xl shadow-sm p-6 sm:p-8"
        >
          <h2 class="text-sm font-semibold text-gray-900 mb-5">Social media</h2>
          <ul class="space-y-3">
            <li
              v-if="authStore.user.socialMedia?.website"
              class="flex items-center gap-3"
            >
              <span
                class="flex h-8 w-8 items-center justify-center rounded-full bg-gray-100 text-gray-500 shrink-0"
              >
                <svg
                  class="h-4 w-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  stroke-width="1.8"
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
              </span>
              <a
                :href="authStore.user.socialMedia.website"
                target="_blank"
                rel="noopener noreferrer"
                class="text-sm text-gray-900 hover:text-[#111111] hover:underline truncate"
              >
                {{ authStore.user.socialMedia.website }}
              </a>
            </li>
            <li
              v-if="authStore.user.socialMedia?.instagram"
              class="flex items-center gap-3"
            >
              <span
                class="flex h-8 w-8 items-center justify-center rounded-full bg-gray-100 text-gray-500 shrink-0"
              >
                <svg
                  class="h-4 w-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  stroke-width="1.8"
                >
                  <rect
                    x="3"
                    y="3"
                    width="18"
                    height="18"
                    rx="5"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                  <circle
                    cx="12"
                    cy="12"
                    r="4"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                  <circle cx="17.2" cy="6.8" r="0.6" fill="currentColor" />
                </svg>
              </span>
              <span class="text-sm text-gray-900 truncate">{{
                authStore.user.socialMedia.instagram
              }}</span>
            </li>
            <li
              v-if="authStore.user.socialMedia?.twitter"
              class="flex items-center gap-3"
            >
              <span
                class="flex h-8 w-8 items-center justify-center rounded-full bg-gray-100 text-gray-500 shrink-0"
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
                    d="M21 5.5c-.7.3-1.4.6-2.2.7a3.8 3.8 0 001.7-2.1 7.6 7.6 0 01-2.4.9 3.8 3.8 0 00-6.5 3.5A10.8 10.8 0 013.1 4.6a3.8 3.8 0 001.2 5.1c-.6 0-1.2-.2-1.7-.5v.1a3.8 3.8 0 003 3.7c-.5.2-1.1.2-1.7.1a3.8 3.8 0 003.6 2.7A7.6 7.6 0 012 17.4a10.8 10.8 0 005.8 1.7c7 0 10.8-5.8 10.8-10.8v-.5c.7-.5 1.4-1.2 1.9-2z"
                  />
                </svg>
              </span>
              <span class="text-sm text-gray-900 truncate">{{
                authStore.user.socialMedia.twitter
              }}</span>
            </li>
            <li
              v-if="authStore.user.socialMedia?.linkedin"
              class="flex items-center gap-3"
            >
              <span
                class="flex h-8 w-8 items-center justify-center rounded-full bg-gray-100 text-gray-500 shrink-0"
              >
                <svg
                  class="h-4 w-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  stroke-width="1.8"
                >
                  <rect
                    x="3"
                    y="3"
                    width="18"
                    height="18"
                    rx="3"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="M7.5 10v6M7.5 7.5v.01M12 16v-3.5c0-1.4 1-2.5 2.3-2.5S16.5 11.1 16.5 12.5V16"
                  />
                </svg>
              </span>
              <span class="text-sm text-gray-900 truncate">{{
                authStore.user.socialMedia.linkedin
              }}</span>
            </li>
          </ul>
        </div>
      </template>

      <!-- Error state -->
      <div
        v-else-if="authStore.error"
        class="bg-white border border-gray-200 rounded-xl shadow-sm p-10 text-center"
      >
        <p class="text-sm font-medium text-red-600 mb-2">
          Couldn't load your profile
        </p>
        <p class="text-sm text-gray-500 mb-6">{{ authStore.error }}</p>
        <button
          @click="authStore.fetchUserProfile()"
          class="px-4 py-2 bg-[#111111] text-white text-sm font-medium rounded-lg hover:bg-black transition-colors"
        >
          Try again
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from "vue";
import { useRouter } from "vue-router";
import { useAuthStore } from "@/stores/auth";
import { getInitials, formatDate } from "@/utils/helpers";

const router = useRouter();
const authStore = useAuthStore();

const username = computed(
  () =>
    authStore.user?.displayName ||
    authStore.user?.name ||
    authStore.user?.publicId ||
    "",
);

const dateOfBirthDisplay = computed(() => {
  const dob = authStore.user?.dateOfBirth;
  return dob ? formatDate(dob) : "";
});

const formattedGender = computed(() =>
  (authStore.user?.gender || "").replace(/_/g, " "),
);

const hasPersonalInfo = computed(
  () =>
    !!(
      authStore.user?.firstName ||
      authStore.user?.lastName ||
      authStore.user?.phoneNumber ||
      authStore.user?.dateOfBirth ||
      authStore.user?.gender
    ),
);

const hasAddress = computed(() => {
  const a = authStore.user?.address;
  return !!(a && (a.street || a.city || a.state || a.postalCode || a.country));
});

const hasSocialMedia = computed(() => {
  const s = authStore.user?.socialMedia;
  return !!(s && (s.website || s.instagram || s.twitter || s.linkedin));
});

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
