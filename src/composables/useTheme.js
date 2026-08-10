import { onMounted, onUnmounted, ref } from 'vue'

/**
 * Reactive dark-mode state yang selalu sinkron dengan class `dark`
 * di <html>, dari mana pun class itu di-toggle (store, tombol di
 * navbar, dsb). Dipakai di semua komponen yang butuh tahu apakah
 * dark mode sedang aktif, biar bg/warna-nya ikut berubah otomatis.
 *
 * Pemakaian:
 *   const { isDark } = useTheme()
 */
export function useTheme() {
  const isDark = ref(document.documentElement.classList.contains('dark'))
  let observer = null

  onMounted(() => {
    observer = new MutationObserver(() => {
      isDark.value = document.documentElement.classList.contains('dark')
    })
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class'],
    })
  })

  onUnmounted(() => {
    observer?.disconnect()
  })

  return { isDark }
}