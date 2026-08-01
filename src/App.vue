<script setup>
import { RouterView } from 'vue-router'
import AppNavigation from './components/AppNavigation.vue'
</script>

<template>
  <div class="min-h-screen bg-gray-50">
    <AppNavigation />
    <RouterView />
  </div>
</template>

<style scoped>
/* App styles handled by Tailwind */
</style>
