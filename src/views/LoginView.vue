<template>
  <div 
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
      <div class="grid lg:grid-cols-12 gap-12 items-center min-h-[70vh]">
        <!-- Hero Text -->
        <div class="lg:col-span-7 space-y-6 text-left">
          <div 
            :class="[
              'inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium border transition-colors duration-300',
              isDark ? 'bg-white/[0.04] border-white/[0.08] text-purple-200' : 'bg-purple-50 border-purple-100 text-purple-700'
            ]"
          >
            <span class="flex h-2 w-2 rounded-full bg-purple-500 animate-pulse"></span>
            Share stories that echo
          </div>
          <h1 
            :class="[
              'font-display italic text-5xl sm:text-6xl lg:text-7xl leading-[1.05] tracking-tight transition-colors duration-300',
              isDark ? 'text-white' : 'text-stone-900'
            ]"
          >
            Write something<br/>
            worth <span class="bg-gradient-to-r from-purple-400 to-indigo-300 bg-clip-text text-transparent">reading.</span>
          </h1>
          <p 
            :class="[
              'text-base sm:text-lg leading-relaxed max-w-xl transition-colors duration-300',
              isDark ? 'text-gray-400' : 'text-stone-600'
            ]"
          >
            Noya adalah ruang tenang untuk menulis cerita, menyematkan musik latar kesukaan Anda, dan berinteraksi secara hangat bersama penulis lainnya.
          </p>
          <div class="pt-2 flex flex-wrap gap-4 items-center">
            <button
              @click="router.push('/')"
              class="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-purple-600 hover:bg-purple-700 text-white font-semibold text-sm transition-all duration-300 transform hover:scale-105 cursor-pointer shadow-lg shadow-purple-600/10"
            >
              Mulai tanpa login
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
              Pelajari fitur utama
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
              <h2 class="text-2xl font-bold">Sign in to Noya</h2>
              <p :class="['text-sm mt-1', isDark ? 'text-gray-400' : 'text-stone-500']">Gunakan akun Google Anda</p>
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
                    <span class="sr-only">Dismiss</span>
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
                  <p class="mt-3 text-sm text-purple-300">Signing in...</p>
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
              <span :class="['text-xs', isDark ? 'text-gray-400' : 'text-stone-500']">Ingat saya</span>
            </div>
          </div>
        </div>
      </div>
    </main>

    <!-- SECTION 2: FEATURES SECTION -->
    <section 
      id="features-section" 
      :class="[
        'w-full border-t transition-colors duration-300 py-20',
        isDark ? 'border-white/[0.05] bg-white/[0.01]' : 'border-stone-200 bg-stone-50/30'
      ]"
    >
      <div class="max-w-7xl mx-auto px-6">
        <div class="text-center max-w-xl mx-auto mb-16">
          <h2 
            :class="[
              'font-display italic text-3xl sm:text-4xl transition-colors duration-300',
              isDark ? 'text-white' : 'text-stone-900'
            ]"
          >
            Menulis, Mendengarkan, Terhubung.
          </h2>
          <p :class="['text-sm mt-2', isDark ? 'text-gray-400' : 'text-stone-500']">
            Didesain minimalis untuk menghadirkan ketenangan dalam berkarya.
          </p>
        </div>

        <div class="grid md:grid-cols-3 gap-8">
          <!-- Feature 1 -->
          <div 
            :class="[
              'border rounded-2xl p-8 transition-all duration-300',
              isDark 
                ? 'bg-white/[0.02] border-white/[0.05] hover:border-purple-500/20 hover:bg-white/[0.03]' 
                : 'bg-white border-stone-200 shadow-sm hover:shadow-md hover:border-purple-500/10'
            ]"
          >
            <div 
              :class="[
                'h-10 w-10 rounded-lg flex items-center justify-center mb-6 border transition-colors duration-300',
                isDark 
                  ? 'bg-purple-500/10 border-purple-500/20 text-purple-400' 
                  : 'bg-purple-50 border-purple-200/60 text-purple-600'
              ]"
            >
              <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
            </div>
            <h3 :class="['font-display italic text-xl font-bold mb-3', isDark ? 'text-white' : 'text-stone-850']">
              Editor Tanpa Batas
            </h3>
            <p :class="['text-sm leading-relaxed', isDark ? 'text-gray-400' : 'text-stone-600']">
              Fokus penuh pada tulisan Anda dengan antarmuka penulisan bergaya minimalis, bersih, bebas dari gangguan notifikasi yang bising.
            </p>
          </div>

          <!-- Feature 2 -->
          <div 
            :class="[
              'border rounded-2xl p-8 transition-all duration-300',
              isDark 
                ? 'bg-white/[0.02] border-white/[0.05] hover:border-purple-500/20 hover:bg-white/[0.03]' 
                : 'bg-white border-stone-200 shadow-sm hover:shadow-md hover:border-purple-500/10'
            ]"
          >
            <div 
              :class="[
                'h-10 w-10 rounded-lg flex items-center justify-center mb-6 border transition-colors duration-300',
                isDark 
                  ? 'bg-purple-500/10 border-purple-500/20 text-purple-400' 
                  : 'bg-purple-50 border-purple-200/60 text-purple-600'
              ]"
            >
              <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
              </svg>
            </div>
            <h3 :class="['font-display italic text-xl font-bold mb-3', isDark ? 'text-white' : 'text-stone-850']">
              Soundtrack Suasana
            </h3>
            <p :class="['text-sm leading-relaxed', isDark ? 'text-gray-400' : 'text-stone-600']">
              Sematkan musik latar dari Deezer untuk memperkuat emosi dan atmosfer cerita Anda, memberikan pengalaman membaca yang unik.
            </p>
          </div>

          <!-- Feature 3 -->
          <div 
            :class="[
              'border rounded-2xl p-8 transition-all duration-300',
              isDark 
                ? 'bg-white/[0.02] border-white/[0.05] hover:border-purple-500/20 hover:bg-white/[0.03]' 
                : 'bg-white border-stone-200 shadow-sm hover:shadow-md hover:border-purple-500/10'
            ]"
          >
            <div 
              :class="[
                'h-10 w-10 rounded-lg flex items-center justify-center mb-6 border transition-colors duration-300',
                isDark 
                  ? 'bg-purple-500/10 border-purple-500/20 text-purple-400' 
                  : 'bg-purple-50 border-purple-200/60 text-purple-600'
              ]"
            >
              <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z" />
              </svg>
            </div>
            <h3 :class="['font-display italic text-xl font-bold mb-3', isDark ? 'text-white' : 'text-stone-850']">
              Interaksi Hangat
            </h3>
            <p :class="['text-sm leading-relaxed', isDark ? 'text-gray-400' : 'text-stone-600']">
              Bagikan cerita, tinggalkan komentar mendalam, sukai tulisan, dan lakukan repost postingan menarik dari sesama penulis.
            </p>
          </div>
        </div>
      </div>
    </section>

    <!-- SECTION 3: TRENDING SHOWCASE -->
    <section 
      :class="[
        'w-full border-t transition-colors duration-300 py-20',
        isDark ? 'border-white/[0.05]' : 'border-stone-200'
      ]"
    >
      <div class="max-w-4xl mx-auto px-6">
        <div class="text-center max-w-xl mx-auto mb-16">
          <h2 
            :class="[
              'font-display italic text-3xl sm:text-4xl transition-colors duration-300',
              isDark ? 'text-white' : 'text-stone-900'
            ]"
          >
            Sedang Hangat Dibicarakan
          </h2>
          <p :class="['text-sm mt-2', isDark ? 'text-gray-400' : 'text-stone-500']">
            Intip beberapa tulisan terbaru dari komunitas Noya.
          </p>
        </div>

        <!-- Blog Cards Grid -->
        <div class="space-y-4">
          <div
            v-if="trendingLoading"
            class="space-y-4"
          >
            <div 
              v-for="i in 3" 
              :key="i" 
              :class="[
                'border rounded-2xl p-6 animate-pulse flex items-center justify-between transition-colors duration-300',
                isDark ? 'bg-white/[0.01] border-white/[0.05]' : 'bg-white border-stone-200 shadow-sm'
              ]"
            >
              <div class="flex-1 space-y-3">
                <div class="h-4 bg-white/10 rounded w-1/3"></div>
                <div class="h-3 bg-white/5 rounded w-3/4"></div>
              </div>
              <div class="h-16 w-16 bg-white/5 rounded-xl ml-4"></div>
            </div>
          </div>

          <div
            v-else-if="trendingBlogs.length"
            class="space-y-4"
          >
            <div
              v-for="blog in trendingBlogs"
              :key="blog._id"
              :class="[
                'group block border rounded-2xl p-6 transition-all duration-300',
                isDark 
                  ? 'bg-white/[0.01] border-white/[0.05] hover:border-purple-500/10 hover:bg-white/[0.02]' 
                  : 'bg-white border-stone-200 hover:border-purple-500/20 shadow-sm hover:shadow-md'
              ]"
            >
              <div class="flex items-center justify-between gap-6">
                <div class="flex-1 min-w-0">
                  <div :class="['flex items-center gap-2 mb-2 text-xs transition-colors', isDark ? 'text-gray-450' : 'text-stone-500']">
                    <span class="font-medium">{{ blog.author?.displayName || 'Penulis Noya' }}</span>
                    <span>&middot;</span>
                    <span>{{ formatRelativeTime(blog.publishedAt || blog.createdAt) }}</span>
                  </div>
                  <h3 
                    :class="[
                      'font-display italic text-lg sm:text-xl font-bold group-hover:text-purple-500 transition-colors line-clamp-1',
                      isDark ? 'text-white' : 'text-stone-900'
                    ]"
                  >
                    {{ blog.title }}
                  </h3>
                  <p :class="['text-xs sm:text-sm mt-1.5 line-clamp-2 leading-relaxed transition-colors', isDark ? 'text-gray-400' : 'text-stone-600']">
                    {{ blog.excerpt || 'Klik untuk membaca selengkapnya cerita menarik ini...' }}
                  </p>
                </div>
                <div 
                  v-if="blog.coverImage" 
                  :class="[
                    'h-16 w-16 sm:h-20 sm:w-20 shrink-0 rounded-xl overflow-hidden border transition-colors',
                    isDark ? 'bg-gray-900 border-white/5' : 'bg-stone-100 border-stone-200'
                  ]"
                >
                  <img :src="blog.coverImage" :alt="blog.title" class="h-full w-full object-cover group-hover:scale-105 transition-transform duration-300" />
                </div>
              </div>
            </div>
          </div>

          <div v-else class="text-center py-10 text-gray-500 text-sm">
            Belum ada cerita publik yang dapat ditampilkan.
          </div>
        </div>
      </div>
    </section>

    <!-- SECTION 4: CALL TO ACTION -->
    <section 
      :class="[
        'w-full border-t transition-colors duration-300 py-24 text-center',
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
          Siap untuk membagikan ceritamu?
        </h2>
        <p :class="['text-sm', isDark ? 'text-gray-400' : 'text-stone-600']">
          Gabung sekarang dan jadilah bagian dari komunitas menulis yang hangat di Noya.
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
            Mulai Menulis
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
      <p>&copy; 2026 Noya. All rights reserved.</p>
    </footer>
  </div>
</template>

<script setup>
import { onMounted, onBeforeUnmount, ref, watch } from "vue";
import { useRouter } from "vue-router";
import { useAuthStore } from "@/stores/auth";
import { blogAPI } from "@/services/api";
import { formatRelativeTime } from "@/utils/helpers";

const router = useRouter();
const authStore = useAuthStore();

const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;

// Sync theme dynamically with document.documentElement class
const isDark = ref(document.documentElement.classList.contains("dark"));

const toggleTheme = () => {
  if (document.documentElement.classList.contains("dark")) {
    document.documentElement.classList.remove("dark");
    localStorage.setItem("theme", "light");
    isDark.value = false;
  } else {
    document.documentElement.classList.add("dark");
    localStorage.setItem("theme", "dark");
    isDark.value = true;
  }
  window.dispatchEvent(new Event("theme-changed"));
};

const handleThemeChanged = () => {
  isDark.value = document.documentElement.classList.contains("dark");
};

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

// Watch theme changes to re-render Google button dynamically with correct theme
watch(isDark, () => {
  renderGoogleButton();
});

const trendingBlogs = ref([]);
const trendingLoading = ref(true);

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

onBeforeUnmount(() => {
  window.removeEventListener("theme-changed", handleThemeChanged);
});

onMounted(async () => {
  window.addEventListener("theme-changed", handleThemeChanged);

  if (authStore.isAuthenticated) {
    router.push("/");
    return;
  }

  // Define global Google OAuth handler
  window.handleGoogleCallback = async (response) => {
    const credential = response.credential;
    const result = await authStore.loginWithGoogle(credential);
    if (result.success) {
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

  // Fetch trending stories for showcase
  try {
    const response = await blogAPI.getAllBlogs({ sort: "trending", limit: 3 });
    trendingBlogs.value = response.data.blogs || [];
  } catch (err) {
    console.error("Failed to load trending blogs for preview", err);
  } finally {
    trendingLoading.value = false;
  }
});
</script>

<style scoped>
.font-display {
  font-family: "Fraunces", ui-serif, Georgia, serif;
}
</style>
