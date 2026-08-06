<template>
  <div class="min-h-screen bg-[#060608] text-white selection:bg-purple-600 selection:text-white relative overflow-x-hidden">
    <!-- Ambient glowing backgrounds -->
    <div class="absolute top-0 left-1/4 w-[500px] h-[500px] rounded-full bg-purple-600/5 blur-[120px] pointer-events-none"></div>
    <div class="absolute top-[30vh] right-[10%] w-[400px] h-[400px] rounded-full bg-indigo-600/5 blur-[120px] pointer-events-none"></div>
    <div class="absolute bottom-[10vh] left-[5%] w-[400px] h-[400px] rounded-full bg-purple-900/5 blur-[120px] pointer-events-none"></div>

    <!-- Header / Navbar -->
    <header class="w-full max-w-7xl mx-auto px-6 py-5 flex items-center justify-between border-b border-white/[0.05]">
      <div class="flex items-center gap-3">
        <img
          src="@/assets/logonoya.png"
          alt="Noya"
          class="h-8 w-8 rounded-full object-cover ring-2 ring-purple-500/20"
        />
        <span class="font-display italic text-2xl font-bold tracking-tight text-white">Noya</span>
      </div>
      <div class="text-[11px] tracking-[0.15em] uppercase text-purple-300 bg-purple-500/10 border border-purple-500/20 px-3.5 py-1 rounded-full font-medium">
        Beta Community
      </div>
    </header>

    <!-- SECTION 1: HERO & LOGIN CARD -->
    <main class="w-full max-w-7xl mx-auto px-6 py-12 md:py-20">
      <div class="grid lg:grid-cols-12 gap-12 items-center min-h-[70vh]">
        <!-- Hero Text -->
        <div class="lg:col-span-7 space-y-6 text-left">
          <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/[0.04] border border-white/[0.08] text-xs text-purple-200">
            <span class="flex h-2 w-2 rounded-full bg-purple-500 animate-pulse"></span>
            Share stories that echo
          </div>
          <h1 class="font-display italic text-5xl sm:text-6xl lg:text-7xl leading-[1.05] text-white tracking-tight">
            Write something<br/>
            worth <span class="bg-gradient-to-r from-purple-400 to-indigo-300 bg-clip-text text-transparent">reading.</span>
          </h1>
          <p class="text-base sm:text-lg text-gray-400 max-w-xl leading-relaxed">
            Noya adalah ruang tenang untuk menulis cerita, menyematkan musik latar kesukaan Anda, dan berinteraksi secara hangat bersama penulis lainnya.
          </p>
          <div class="pt-4 flex flex-wrap gap-4 items-center">
            <button
              @click="scrollToFeatures"
              class="group flex items-center gap-2 text-sm text-purple-300 hover:text-white transition-colors cursor-pointer"
            >
              Pelajari fitur utama
              <span class="transform group-hover:translate-y-1 transition-transform duration-200">&darr;</span>
            </button>
          </div>
        </div>

        <!-- Login Card -->
        <div id="login-card" class="lg:col-span-5 flex justify-center lg:justify-end">
          <div class="w-full max-w-md bg-white/[0.02] border border-white/[0.08] rounded-3xl p-8 sm:p-10 backdrop-blur-xl shadow-2xl relative overflow-hidden">
            <div class="absolute -top-12 -right-12 h-36 w-36 rounded-full bg-purple-500/10 blur-2xl"></div>

            <div class="text-center mb-8">
              <h2 class="text-2xl font-bold text-white">Sign in to Noya</h2>
              <p class="text-sm text-gray-400 mt-1">Gunakan akun Google Anda</p>
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

            <!-- Google Sign In -->
            <div class="mb-6">
              <div
                id="g_id_onload"
                :data-client_id="googleClientId"
                data-callback="handleGoogleCallback"
                data-auto_prompt="false"
              ></div>

              <div class="relative">
                <div v-if="!authStore.isLoading" class="flex justify-center">
                  <div
                    id="g_id_signin"
                    class="g_id_signin"
                    data-type="standard"
                    data-shape="pill"
                    data-theme="filled_black"
                    data-text="signin_with"
                    data-size="large"
                    data-logo_alignment="left"
                    data-width="300"
                  ></div>
                </div>

                <div v-else class="flex flex-col items-center justify-center py-3">
                  <div class="h-6 w-6 animate-spin rounded-full border-2 border-purple-500/20 border-t-purple-500"></div>
                  <p class="mt-3 text-sm text-purple-300">Signing in...</p>
                </div>
              </div>
            </div>

            <!-- Remember Me Toggle -->
            <div class="flex items-center justify-center gap-3 py-2 border-t border-white/[0.05]">
              <button
                @click="toggleRememberMe"
                :class="[
                  'relative inline-flex h-5 w-9 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-[#060608]',
                  authStore.rememberMe ? 'bg-purple-600' : 'bg-white/10'
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
              <span class="text-xs text-gray-400">Ingat saya</span>
            </div>
          </div>
        </div>
      </div>
    </main>

    <!-- SECTION 2: FEATURES SECTION -->
    <section id="features-section" class="w-full border-t border-white/[0.05] bg-white/[0.01] py-20">
      <div class="max-w-7xl mx-auto px-6">
        <div class="text-center max-w-xl mx-auto mb-16">
          <h2 class="font-display italic text-3xl sm:text-4xl text-white">Menulis, Mendengarkan, Terhubung.</h2>
          <p class="text-sm text-gray-400 mt-2">Didesain minimalis untuk menghadirkan ketenangan dalam berkarya.</p>
        </div>

        <div class="grid md:grid-cols-3 gap-8">
          <!-- Feature 1 -->
          <div class="bg-white/[0.02] border border-white/[0.05] rounded-2xl p-8 hover:border-purple-500/20 hover:bg-white/[0.03] transition-all duration-300">
            <div class="h-10 w-10 rounded-lg bg-purple-500/10 flex items-center justify-center text-purple-400 mb-6 border border-purple-500/20">
              <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
            </div>
            <h3 class="font-display italic text-xl font-bold mb-3 text-white">Editor Tanpa Batas</h3>
            <p class="text-sm text-gray-400 leading-relaxed">
              Fokus penuh pada tulisan Anda dengan antarmuka penulisan bergaya minimalis, bersih, bebas dari gangguan notifikasi yang bising.
            </p>
          </div>

          <!-- Feature 2 -->
          <div class="bg-white/[0.02] border border-white/[0.05] rounded-2xl p-8 hover:border-purple-500/20 hover:bg-white/[0.03] transition-all duration-300">
            <div class="h-10 w-10 rounded-lg bg-purple-500/10 flex items-center justify-center text-purple-400 mb-6 border border-purple-500/20">
              <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
              </svg>
            </div>
            <h3 class="font-display italic text-xl font-bold mb-3 text-white">Soundtrack Suasana</h3>
            <p class="text-sm text-gray-400 leading-relaxed">
              Sematkan musik latar dari Deezer untuk memperkuat emosi dan atmosfer cerita Anda, memberikan pengalaman membaca yang unik.
            </p>
          </div>

          <!-- Feature 3 -->
          <div class="bg-white/[0.02] border border-white/[0.05] rounded-2xl p-8 hover:border-purple-500/20 hover:bg-white/[0.03] transition-all duration-300">
            <div class="h-10 w-10 rounded-lg bg-purple-500/10 flex items-center justify-center text-purple-400 mb-6 border border-purple-500/20">
              <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z" />
              </svg>
            </div>
            <h3 class="font-display italic text-xl font-bold mb-3 text-white">Interaksi Hangat</h3>
            <p class="text-sm text-gray-400 leading-relaxed">
              Bagikan cerita, tinggalkan komentar mendalam, sukai tulisan, dan lakukan repost postingan menarik dari sesama penulis.
            </p>
          </div>
        </div>
      </div>
    </section>

    <!-- SECTION 3: TRENDING SHOWCASE -->
    <section class="w-full border-t border-white/[0.05] py-20">
      <div class="max-w-4xl mx-auto px-6">
        <div class="text-center max-w-xl mx-auto mb-16">
          <h2 class="font-display italic text-3xl sm:text-4xl text-white">Sedang Hangat Dibicarakan</h2>
          <p class="text-sm text-gray-400 mt-2">Intip beberapa tulisan terbaru dari komunitas Noya.</p>
        </div>

        <!-- Blog Cards Grid -->
        <div class="space-y-4">
          <div
            v-if="trendingLoading"
            class="space-y-4"
          >
            <div v-for="i in 3" :key="i" class="bg-white/[0.01] border border-white/[0.05] rounded-2xl p-6 animate-pulse flex items-center justify-between">
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
              class="group block bg-white/[0.01] border border-white/[0.05] hover:border-purple-500/10 rounded-2xl p-6 hover:bg-white/[0.02] transition-all duration-300"
            >
              <div class="flex items-center justify-between gap-6">
                <div class="flex-1 min-w-0">
                  <div class="flex items-center gap-2 mb-2 text-xs text-gray-400">
                    <span>{{ blog.author?.displayName || 'Penulis Noya' }}</span>
                    <span>&middot;</span>
                    <span>{{ formatRelativeTime(blog.publishedAt || blog.createdAt) }}</span>
                  </div>
                  <h3 class="font-display italic text-lg sm:text-xl font-bold text-white group-hover:text-purple-300 transition-colors line-clamp-1">
                    {{ blog.title }}
                  </h3>
                  <p class="text-xs sm:text-sm text-gray-400 mt-1.5 line-clamp-2 leading-relaxed">
                    {{ blog.excerpt || 'Klik untuk membaca selengkapnya cerita menarik ini...' }}
                  </p>
                </div>
                <div v-if="blog.coverImage" class="h-16 w-16 sm:h-20 sm:w-20 shrink-0 rounded-xl overflow-hidden bg-gray-900 border border-white/5">
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
    <section class="w-full border-t border-white/[0.05] bg-gradient-to-b from-transparent to-purple-950/10 py-24 text-center">
      <div class="max-w-xl mx-auto px-6 space-y-6">
        <h2 class="font-display italic text-4xl sm:text-5xl text-white">Siap untuk membagikan ceritamu?</h2>
        <p class="text-sm text-gray-400">Gabung sekarang dan jadilah bagian dari komunitas menulis yang hangat di Noya.</p>
        <div class="pt-4">
          <button
            @click="scrollToLogin"
            class="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-white text-black font-semibold text-sm hover:bg-gray-100 hover:scale-105 transition-all duration-300 shadow-xl shadow-purple-900/10 cursor-pointer"
          >
            Mulai Menulis
            <span>&rarr;</span>
          </button>
        </div>
      </div>
    </section>

    <!-- Footer -->
    <footer class="w-full border-t border-white/[0.05] py-8 text-center text-xs text-gray-500">
      <p>&copy; 2026 Noya. All rights reserved.</p>
    </footer>
  </div>
</template>

<script setup>
import { onMounted, ref } from "vue";
import { useRouter } from "vue-router";
import { useAuthStore } from "@/stores/auth";
import { blogAPI } from "@/services/api";
import { formatRelativeTime } from "@/utils/helpers";

const router = useRouter();
const authStore = useAuthStore();

const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;

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

onMounted(async () => {
  if (authStore.isAuthenticated) {
    router.push("/");
    return;
  }

  // Load Google Sign-In script
  const script = document.createElement("script");
  script.src = "https://accounts.google.com/gsi/client";
  script.async = true;
  script.defer = true;
  document.head.appendChild(script);

  window.handleGoogleCallback = async (response) => {
    const credential = response.credential;
    const result = await authStore.loginWithGoogle(credential);
    if (result.success) {
      const redirectTo = router.currentRoute.value.query.redirect || "/";
      router.push(redirectTo);
    }
  };

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
