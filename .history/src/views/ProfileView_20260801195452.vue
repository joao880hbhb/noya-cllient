<template>
  <div class="min-h-screen bg-white">
    <div class="max-w-3xl mx-auto px-6 sm:px-10 py-16 sm:py-24">
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
        <p class="text-[11px] tracking-[0.15em] text-[#B0B0B0] uppercase">
          Loading account
        </p>
      </div>

      <!-- Profile content -->
      <div v-else-if="authStore.user">
        <!-- Masthead -->
        <div class="flex flex-col items-center text-center mb-10">
          <p class="text-[11px] tracking-[0.2em] text-[#8A8A8A] uppercase mb-6">
            My account
          </p>

          <img
            v-if="authStore.user.picture"
            :src="authStore.user.picture"
            alt="Profile"
            class="h-24 w-24 rounded-full object-cover border border-[#E7E7E7] shadow-[0_8px_20px_-8px_rgba(0,0,0,0.25)]"
          />
          <div
            v-else
            class="h-24 w-24 rounded-full bg-[#FAFAFA] border border-[#E7E7E7] flex items-center justify-center text-[#111111] text-2xl font-display italic shadow-[0_8px_20px_-8px_rgba(0,0,0,0.25)]"
          >
            {{ getInitials(username) }}
          </div>

          <h1
            class="mt-6 font-display italic text-[30px] sm:text-[36px] leading-tight text-[#111111]"
          >
            {{ username }}
          </h1>
          <p class="mt-1 text-[13px] text-[#8A8A8A]">
            {{ authStore.user.email }}
          </p>

          <p
            v-if="authStore.user.bio"
            class="mt-4 text-[14px] leading-relaxed text-[#6B6B6B] max-w-sm"
          >
            {{ authStore.user.bio }}
          </p>
        </div>

        <!-- Details sheet -->
        <div
          class="relative border border-[#E7E7E7] rounded-[3px] shadow-[0_1px_2px_rgba(0,0,0,0.03),0_18px_40px_-16px_rgba(0,0,0,0.14)] bg-white"
        >
          <!-- decorative margin ruler -->
          <div
            class="hidden md:block absolute left-0 top-0 bottom-0 w-6 bg-[repeating-linear-gradient(to_bottom,#E7E7E7_0,#E7E7E7_1px,transparent_1px,transparent_10px)] opacity-70"
          ></div>

          <div class="md:pl-8">
            <p
              class="px-8 sm:px-14 pt-9 pb-2 text-[11px] tracking-[0.2em] text-[#8A8A8A] uppercase"
            >
              Account details
            </p>

            <dl>
              <div
                class="grid md:grid-cols-[160px_1fr] gap-x-10 sm:gap-x-14 px-8 sm:px-14 py-5 border-t border-[#F0F0F0]"
              >
                <dt class="text-[12px] text-[#8A8A8A]">Username</dt>
                <dd class="text-[14px] text-[#111111]">{{ username }}</dd>
              </div>
              <div
                class="grid md:grid-cols-[160px_1fr] gap-x-10 sm:gap-x-14 px-8 sm:px-14 py-5 border-t border-[#F0F0F0]"
              >
                <dt class="text-[12px] text-[#8A8A8A]">Email</dt>
                <dd class="text-[14px] text-[#111111]">
                  {{ authStore.user.email }}
                </dd>
              </div>
              <div
                v-if="authStore.user.firstName"
                class="grid md:grid-cols-[160px_1fr] gap-x-10 sm:gap-x-14 px-8 sm:px-14 py-5 border-t border-[#F0F0F0]"
              >
                <dt class="text-[12px] text-[#8A8A8A]">First name</dt>
                <dd class="text-[14px] text-[#111111]">
                  {{ authStore.user.firstName }}
                </dd>
              </div>
              <div
                v-if="authStore.user.lastName"
                class="grid md:grid-cols-[160px_1fr] gap-x-10 sm:gap-x-14 px-8 sm:px-14 py-5 border-t border-[#F0F0F0]"
              >
                <dt class="text-[12px] text-[#8A8A8A]">Last name</dt>
                <dd class="text-[14px] text-[#111111]">
                  {{ authStore.user.lastName }}
                </dd>
              </div>
              <div
                v-if="authStore.user.phoneNumber"
                class="grid md:grid-cols-[160px_1fr] gap-x-10 sm:gap-x-14 px-8 sm:px-14 py-5 border-t border-[#F0F0F0]"
              >
                <dt class="text-[12px] text-[#8A8A8A]">Phone number</dt>
                <dd class="text-[14px] text-[#111111]">
                  {{ authStore.user.phoneNumber }}
                </dd>
              </div>
              <div
                v-if="dateOfBirthDisplay"
                class="grid md:grid-cols-[160px_1fr] gap-x-10 sm:gap-x-14 px-8 sm:px-14 py-5 border-t border-[#F0F0F0]"
              >
                <dt class="text-[12px] text-[#8A8A8A]">Date of birth</dt>
                <dd class="text-[14px] text-[#111111]">
                  {{ dateOfBirthDisplay }}
                </dd>
              </div>
              <div
                v-if="authStore.user.gender"
                class="grid md:grid-cols-[160px_1fr] gap-x-10 sm:gap-x-14 px-8 sm:px-14 py-5 border-t border-[#F0F0F0]"
              >
                <dt class="text-[12px] text-[#8A8A8A]">Gender</dt>
                <dd class="text-[14px] text-[#111111] capitalize">
                  {{ authStore.user.gender }}
                </dd>
              </div>
              <div
                class="grid md:grid-cols-[160px_1fr] gap-x-10 sm:gap-x-14 px-8 sm:px-14 py-5 border-t border-[#F0F0F0]"
              >
                <dt class="text-[12px] text-[#8A8A8A]">Public ID</dt>
                <dd class="text-[14px] text-[#111111]">
                  {{ authStore.user.publicId || "Not set" }}
                </dd>
              </div>
              <div
                class="grid md:grid-cols-[160px_1fr] gap-x-10 sm:gap-x-14 px-8 sm:px-14 py-5 border-t border-[#F0F0F0]"
              >
                <dt class="text-[12px] text-[#8A8A8A]">Privacy</dt>
                <dd class="text-[14px] text-[#111111]">
                  {{ authStore.user.isPublic === false ? "Private" : "Public" }}
                </dd>
              </div>
              <div
                v-if="location"
                class="grid md:grid-cols-[160px_1fr] gap-x-10 sm:gap-x-14 px-8 sm:px-14 py-5 border-t border-[#F0F0F0]"
              >
                <dt class="text-[12px] text-[#8A8A8A]">Location</dt>
                <dd class="text-[14px] text-[#111111]">{{ location }}</dd>
              </div>
              <div
                v-if="authStore.user.socialMedia?.website"
                class="grid md:grid-cols-[160px_1fr] gap-x-10 sm:gap-x-14 px-8 sm:px-14 py-5 border-t border-[#F0F0F0]"
              >
                <dt class="text-[12px] text-[#8A8A8A]">Website</dt>
                <dd class="text-[14px]">
                  <a
                    :href="authStore.user.socialMedia.website"
                    target="_blank"
                    rel="noopener noreferrer"
                    class="text-[#111111] hover:underline underline-offset-2"
                  >
                    {{ authStore.user.socialMedia.website }}
                  </a>
                </dd>
              </div>
            </dl>
          </div>
        </div>

        <!-- Actions -->
        <div class="mt-8 flex flex-wrap items-center justify-between gap-4">
          <div class="flex items-center gap-3">
            <button
              @click="handleEditProfile"
              class="inline-flex items-center px-5 py-2.5 bg-[#111111] text-white rounded-[2px] text-[13px] font-medium shadow-[0_1px_2px_rgba(0,0,0,0.05),0_10px_20px_-8px_rgba(0,0,0,0.35)] hover:bg-black transition-colors"
            >
              Edit profile
            </button>
            <router-link
              v-if="authStore.user.publicId"
              :to="`/profile/${authStore.user.publicId}`"
              class="inline-flex items-center px-5 py-2.5 border border-[#111111] rounded-[2px] text-[13px] font-medium text-[#111111] hover:bg-[#111111] hover:text-white transition-colors"
            >
              View public profile
            </router-link>
          </div>
          <button
            @click="handleLogout"
            class="text-[13px] font-medium text-[#8A8A8A] hover:text-[#B3261E] transition-colors"
          >
            Logout
          </button>
        </div>
      </div>

      <!-- Error state -->
      <div
        v-else-if="authStore.error"
        class="border border-[#E7E7E7] rounded-[3px] p-10 text-center"
      >
        <p class="text-[11px] tracking-[0.15em] text-[#B3261E] uppercase mb-2">
          Couldn't load your profile
        </p>
        <p class="text-[15px] text-[#4B4B4B] mb-6">{{ authStore.error }}</p>
        <button
          @click="authStore.fetchUserProfile()"
          class="inline-flex items-center px-5 py-2.5 bg-[#111111] text-white rounded-[2px] text-[13px] font-medium shadow-[0_1px_2px_rgba(0,0,0,0.05),0_10px_20px_-8px_rgba(0,0,0,0.35)] hover:bg-black transition-colors"
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

const location = computed(() => {
  const address = authStore.user?.address;
  if (!address?.city && !address?.country) return "";
  return [address.city, address.country].filter(Boolean).join(", ");
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

<style scoped>
@import url("https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,500;1,9..144,500&display=swap");

.font-display {
  font-family: "Fraunces", ui-serif, Georgia, serif;
}
</style>
