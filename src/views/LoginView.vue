<template>
  <!-- Loading screen: halaman baru dirender setelah semua data masuk -->
  <div
    v-if="pageLoading"
    :class="[
      'min-h-screen flex flex-col items-center justify-center gap-4 transition-colors duration-300',
      isDark ? 'bg-[#060608] text-white' : 'bg-[#fafaf9] text-stone-900'
    ]"
  >
    <div class="h-10 w-10 animate-spin rounded-full border-2 border-purple-500/20 border-t-purple-500"></div>
    <p class="text-sm text-gray-500">{{ t('login.loadingData') }}</p>
  </div>

  <div
    v-else
    :class="[
      'min-h-screen transition-colors duration-300 relative overflow-x-hidden selection:bg-purple-600 selection:text-white',
      isDark ? 'bg-[#060608] text-white' : 'bg-[#fafaf9] text-stone-900'
    ]"
  >
    <!-- Ambient glowing backgrounds (only visible or very subtle in light mode) -->
    <div 
      :class="[
        'absolute top-0 left-1/4 w-[500px] h-[500px] rounded-full blur-[120px] pointer-events-none transition-colors duration-300',
        isDark ? 'bg-purple-600/5' : 'bg-purple-500/[0.02]'
      ]"
    ></div>
    <div 
      :class="[
        'absolute top-[30vh] right-[10%] w-[400px] h-[400px] rounded-full blur-[120px] pointer-events-none transition-colors duration-300',
        isDark ? 'bg-indigo-600/5' : 'bg-indigo-500/[0.02]'
      ]"
    ></div>
    <div 
      :class="[
        'absolute bottom-[10vh] left-[5%] w-[400px] h-[400px] rounded-full blur-[120px] pointer-events-none transition-colors duration-300',
        isDark ? 'bg-purple-900/5' : 'bg-purple-900/[0.01]'
      ]"
    ></div>

    <!-- SECTION 1: HERO & LOGIN CARD -->
    <main class="w-full max-w-7xl mx-auto px-6 py-12 md:py-24">
      <div class="grid lg:grid-cols-12 gap-12 items-center min-h-[60vh]">
        <!-- Hero Text -->
        <div class="lg:col-span-7 space-y-6 text-left">
        
          <h1 
            :class="[
              'font-display italic text-5xl sm:text-6xl lg:text-7xl leading-[1.05] tracking-tight transition-colors duration-300',
              isDark ? 'text-white' : 'text-stone-900'
            ]"
          >
            {{ t('login.headline1') }}<br/>
            <span class="bg-gradient-to-r from-purple-400 to-indigo-300 bg-clip-text text-transparent">{{ t('login.headline2') }}</span>
          </h1>
          <p 
            :class="[
              'text-base sm:text-lg leading-relaxed max-w-xl transition-colors duration-300',
              isDark ? 'text-gray-400' : 'text-stone-600'
            ]"
          >
            {{ t('login.hero') }}
          </p>
          <div class="pt-2 flex flex-wrap gap-4 items-center">
            <button
              @click="router.push('/')"
              class="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-purple-600 hover:bg-purple-700 text-white font-semibold text-sm transition-all duration-300 transform hover:scale-105 cursor-pointer shadow-lg shadow-purple-600/10"
            >
              {{ t('login.startWithoutLogin') }}
              <span>&rarr;</span>
            </button>
            <button
              @click="scrollToFeatures"
              :class="[
                'group flex items-center gap-2 text-sm transition-all duration-300 cursor-pointer py-3 px-5 rounded-full border',
                isDark 
                  ? 'text-purple-300 border-white/10 hover:text-white hover:bg-white/5' 
                  : 'text-purple-700 border-stone-200 hover:text-purple-900 hover:bg-stone-100 font-medium'
              ]"
            >
              {{ t('login.learnFeatures') }}
            </button>
          </div>
        </div>

        <!-- Login Card -->
        <div id="login-card" class="lg:col-span-5 flex justify-center lg:justify-end">
          <div 
            :class="[
              'w-full max-w-md border rounded-3xl p-8 sm:p-10 backdrop-blur-xl transition-all duration-300 relative overflow-hidden',
              isDark 
                ? 'bg-white/[0.02] border-white/[0.08] text-white shadow-2xl' 
                : 'bg-white border-stone-200 text-stone-900 shadow-xl shadow-stone-100'
            ]"
          >
            <div 
              :class="[
                'absolute -top-12 -right-12 h-36 w-36 rounded-full blur-2xl transition-colors duration-300',
                isDark ? 'bg-purple-500/10' : 'bg-purple-500/5'
              ]"
            ></div>

            <div class="text-center mb-8">
              <h2 class="text-2xl font-bold">{{ t('login.signInTitle') }}</h2>
              <p :class="['text-sm mt-1', isDark ? 'text-gray-400' : 'text-stone-500']">{{ t('login.useGoogle') }}</p>
            </div>

            <!-- Error message -->
            <transition
              enter-active-class="transition ease-out duration-200"
              enter-from-class="opacity-0 -translate-y-1"
              enter-to-class="opacity-100 translate-y-0"
            >
              <div v-if="authStore.error" class="mb-6 rounded-xl bg-red-500/10 border border-red-500/20 p-4">
                <div class="flex items-start">
                  <svg class="h-5 w-5 text-red-400 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
                    <path
                      fill-rule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                      clip-rule="evenodd"
                    />
                  </svg>
                  <p class="ml-3 text-sm font-medium text-red-200">
                    {{ authStore.error }}
                  </p>
                  <button
                    @click="authStore.clearError"
                    class="ml-auto flex-shrink-0 rounded-md p-1 text-red-400 hover:bg-red-500/20 hover:text-red-300 focus:outline-none"
                  >
                    <span class="sr-only">{{ t('login.dismiss') }}</span>
                    <svg class="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                      <path
                        fill-rule="evenodd"
                        d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                        clip-rule="evenodd"
                      />
                    </svg>
                  </button>
                </div>
              </div>
            </transition>

            <!-- Custom Google Sign In (Programmatic Button Style) -->
            <div class="mb-6">
              <div class="relative">
                <div v-show="!authStore.isLoading" class="flex justify-center">
                  <!-- Div target untuk render Google Button secara mandiri -->
                  <div id="custom-google-btn" class="min-h-[44px]"></div>
                </div>

                <div v-if="authStore.isLoading" class="flex flex-col items-center justify-center py-3">
                  <div class="h-6 w-6 animate-spin rounded-full border-2 border-purple-500/20 border-t-purple-500"></div>
                  <p class="mt-3 text-sm text-purple-300">{{ t('login.signingIn') }}</p>
                </div>
              </div>
            </div>

            <!-- Remember Me Toggle -->
            <div 
              :class="[
                'flex items-center justify-center gap-3 py-2 border-t transition-colors duration-300',
                isDark ? 'border-white/[0.05]' : 'border-stone-100'
              ]"
            >
              <button
                @click="toggleRememberMe"
                :class="[
                  'relative inline-flex h-5 w-9 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2',
                  authStore.rememberMe ? 'bg-purple-600' : (isDark ? 'bg-white/10' : 'bg-stone-200'),
                  isDark ? 'focus:ring-offset-[#060608]' : 'focus:ring-offset-white'
                ]"
                role="switch"
                :aria-checked="authStore.rememberMe"
              >
                <span
                  :class="[
                    'pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out',
                    authStore.rememberMe ? 'translate-x-4' : 'translate-x-0'
                  ]"
                />
              </button>
              <span :class="['text-xs', isDark ? 'text-gray-400' : 'text-stone-500']">{{ t('login.rememberMe') }}</span>
            </div>
          </div>
        </div>
      </div>
    </main>

    <!-- SECTION 3.5: LATEST WRITERS (marquee 2 baris) -->
    <section
      v-if="latestUsers.length"
      :class="[
        'w-full border-t transition-colors duration-300 py-20 overflow-hidden',
        isDark ? 'border-white/[0.05] bg-white/[0.01]' : 'border-stone-200 bg-stone-50/30'
      ]"
    >
      <div class="max-w-7xl mx-auto px-6">
        <div class="text-center max-w-xl mx-auto mb-12">
          <h2
            :class="[
              'font-display italic text-3xl sm:text-4xl transition-colors duration-300',
              isDark ? 'text-white' : 'text-stone-900'
            ]"
          >
            {{ t('login.latestWriters') }}
          </h2>
          <p :class="['text-sm mt-2', isDark ? 'text-gray-400' : 'text-stone-500']">
            {{ t('login.latestWritersSubtitle') }}
          </p>
        </div>

        <div class="space-y-5">
          <!-- Baris 1: geser ke kanan -->
          <UserMarquee :users="latestRowA" direction="right" :is-dark="isDark" />
          <!-- Baris 2: geser ke kiri -->
          <UserMarquee :users="latestRowB" direction="left" :is-dark="isDark" />
        </div>
      </div>
     </section>

     
<!-- DOME -->
      <div
        :style="{ width: '100vw', height: isMobile ? '62vh' : '100vh' }"
      >
        
            <div class="text-center max-w-xl mx-auto mb-12 mt-20">
          <h2 
            :class="[
              'font-display italic text-3xl sm:text-4xl transition-colors duration-300',
              isDark ? 'text-white' : 'text-stone-900'
            ]"
          >
            {{ t('login.trendingTitle') }}
          </h2>
          <p :class="['text-sm mt-2', isDark ? 'text-gray-400' : 'text-stone-500']">
            {{ t('login.trendingSubtitle') }}
          </p>
        </div>
  <DomeGallery
    :images="domeImages"
    :read-more-label="t('login.readMore')"
    :min-radius="isMobile ? 320 : 600"
    :segments="isMobile ? 22 : 35"
    :drag-sensitivity="isMobile ? 12 : 20"
    @select="handleSelectBlog"
  />
  </div>

    <!-- SECTION 4: CALL TO ACTION -->
    <section 
      :class="[
        'w-full border-t transition-colors duration-300 py-24 text-center mt-52',
        isDark 
          ? 'border-white/[0.05] bg-gradient-to-b from-transparent to-purple-950/10' 
          : 'border-stone-200 bg-gradient-to-b from-transparent to-purple-500/[0.02]'
      ]"
    >
      <div class="max-w-xl mx-auto px-6 space-y-6">
        <h2 
          :class="[
            'font-display italic text-4xl sm:text-5xl transition-colors duration-300',
            isDark ? 'text-white' : 'text-stone-900'
          ]"
        >
          {{ t('login.ctaTitle') }}
        </h2>
        <p :class="['text-sm', isDark ? 'text-gray-400' : 'text-stone-600']">
          {{ t('login.ctaDesc') }}
        </p>
        <div class="pt-4">
          <button
            @click="scrollToLogin"
            :class="[
              'inline-flex items-center gap-2 px-6 py-3 rounded-full font-semibold text-sm hover:scale-105 transition-all duration-300 shadow-xl cursor-pointer',
              isDark 
                ? 'bg-white text-black hover:bg-gray-100 shadow-purple-900/10' 
                : 'bg-stone-900 text-white hover:bg-stone-800 shadow-stone-200'
            ]"
          >
            {{ t('login.startWriting') }}
            <span>&rarr;</span>
          </button>
        </div>
      </div>
    </section>

    <!-- Footer -->
    <footer 
      :class="[
        'w-full border-t py-8 text-center text-xs transition-colors duration-300',
        isDark ? 'border-white/[0.05] text-gray-550' : 'border-stone-200 text-stone-400'
      ]"
    >
      <p>&copy; 2026 Noya. {{ t('login.allRightsReserved') }}</p>
    </footer>
  </div>
</template>

<script setup>
import { onMounted, ref, watch, computed, onUnmounted, nextTick } from "vue";
import { useRouter } from "vue-router";
import DomeGallery from "@/components/landingpage/DomeGallery.vue"
import { useI18n } from "vue-i18n";
import { useAuthStore } from "@/stores/auth";
import { blogAPI, profileAPI } from "@/services/api";
import { formatRelativeTime } from "@/utils/helpers";
import { useTheme } from "@/composables/useTheme";
import UserMarquee from "@/components/UserMarquee.vue";
const isMobile = ref(false);

function checkMobile() {
  isMobile.value = window.innerWidth < 768;
}

onMounted(() => {
  checkMobile();
  window.addEventListener('resize', checkMobile);
});
onUnmounted(() => window.removeEventListener('resize', checkMobile));

const router = useRouter();
const authStore = useAuthStore();
const { t } = useI18n();
const { isDark } = useTheme();

const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;

// Menunggu semua data masuk sebelum halaman dirender
const pageLoading = ref(true);

// Render Google button programmatically
const renderGoogleButton = () => {
  const container = document.getElementById("custom-google-btn");
  if (container && window.google) {
    container.innerHTML = ""; // Clear existing GSI render
    window.google.accounts.id.renderButton(container, {
      theme: isDark.value ? "filled_black" : "outline",
      size: "large",
      shape: "pill",
      width: 300,
    });
  }
};

// Login card (beserta #custom-google-btn) baru ada di DOM setelah pageLoading=false
// → render ulang tombol Google setiap halaman selesai dimuat / tema berubah
watch(pageLoading, (ready) => {
  if (ready) nextTick(() => renderGoogleButton());
});

// Watch theme changes to re-render Google button dynamically with correct theme
watch(isDark, () => {
  renderGoogleButton();
});

const trendingBlogs = ref([]);
const trendingLoading = ref(true);

// ---- User terbaru (marquee 2 baris, fetch bertahap 20 → 40 → 60) ----
const LATEST_BATCH = 20;
const LATEST_WANTED = 60;
const latestUsers = ref([]);
const latestLoading = ref(false);

const latestRowA = computed(() => latestUsers.value.slice(0, 30));
const latestRowB = computed(() => latestUsers.value.slice(30, 60));

const fetchLatestUsers = async () => {
  if (latestLoading.value) return;
  latestLoading.value = true;
  let before = null;
  let collected = [];
  let hasMore = true;
  try {
    // Progressive: tarik 20 dulu, lalu lanjut 20 berikutnya dst.
    while (collected.length < LATEST_WANTED && hasMore) {
      const res = await profileAPI.getLatestUsers({ limit: LATEST_BATCH, before });
      const batch = res.data?.users || [];
      if (!batch.length) break;
      collected = [...collected, ...batch];
      before = res.data?.nextBefore || null;
      hasMore = !!res.data?.hasMore;
    }
    latestUsers.value = collected;
  } catch (err) {
    // Non-blocking — landing tetap tampil walau gagal
    console.warn("Failed to load latest users:", err);
  } finally {
    latestLoading.value = false;
  }
};

const toggleRememberMe = () => {
  authStore.setRememberMe(!authStore.rememberMe);
};

const scrollToFeatures = () => {
  const el = document.getElementById("features-section");
  if (el) {
    el.scrollIntoView({ behavior: "smooth" });
  }
};

const scrollToLogin = () => {
  const el = document.getElementById("login-card");
  if (el) {
    el.scrollIntoView({ behavior: "smooth" });
  }
};

onMounted(async () => {
  if (authStore.isAuthenticated) {
    router.push("/");
    return;
  }

  // Define global Google OAuth handler
  window.handleGoogleCallback = async (response) => {
    const credential = response.credential;
    const result = await authStore.loginWithGoogle(credential);
    if (result.success) {
      // User baru (baru daftar) → arahkan lengkapi profil (avatar + display name)
      if (authStore.needsOnboarding) {
        router.push({ name: 'profile-setup' })
        return
      }
      const redirectTo = router.currentRoute.value.query.redirect || "/";
      router.push(redirectTo);
    }
  };

  // Check if GSI client is already loaded, otherwise load script
  if (window.google) {
    window.google.accounts.id.initialize({
      client_id: googleClientId,
      callback: window.handleGoogleCallback,
      auto_prompt: false,
    });
    renderGoogleButton();
  } else {
    const script = document.createElement("script");
    script.src = "https://accounts.google.com/gsi/client";
    script.async = true;
    script.defer = true;
    script.onload = () => {
      if (window.google) {
        window.google.accounts.id.initialize({
          client_id: googleClientId,
          callback: window.handleGoogleCallback,
          auto_prompt: false,
        });
        renderGoogleButton();
      }
    };
    document.head.appendChild(script);
  }

  // Tunggu semua data masuk (trending + latest users) sebelum halaman dirender
  try {
    await Promise.all([
      fetchTrendingBlogs(),
      fetchLatestUsers(),
    ]);
  } finally {
    pageLoading.value = false;
  }
});

const fetchTrendingBlogs = async () => {
  try {
    const response = await blogAPI.getAllBlogs({ sort: "trending", limit: 8 });
    trendingBlogs.value = response.data.blogs || [];
  } catch (err) {
    console.error("Failed to load trending blogs for preview", err);
  } finally {
    trendingLoading.value = false;
  }
};




const domeImages = computed(() =>
  trendingBlogs.value.map((blog) => ({
    src: blog.coverImage || '/images/default-cover.jpg',
    alt: blog.title,
    title: blog.title,
    author: blog.author?.displayName || t('login.authorNoya'),
    link: `/blogs/${blog.slug || blog._id}`,
  }))
);

function handleSelectBlog(item) {
  if (item.link) router.push(item.link);
}
</script>

<style scoped>
.font-display {
  font-family: "Fraunces", ui-serif, Georgia, serif;
}
</style>
