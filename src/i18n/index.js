import { createI18n } from 'vue-i18n'
import id from './locales/id'
import en from './locales/en'

const savedLocale = localStorage.getItem('locale')
const initialLocale = savedLocale === 'en' ? 'en' : 'id'

const i18n = createI18n({
  legacy: false,
  locale: initialLocale,
  fallbackLocale: 'id',
  messages: { id, en },
})

export const setLocale = (locale) => {
  if (locale !== 'id' && locale !== 'en') return
  i18n.global.locale.value = locale
  localStorage.setItem('locale', locale)
  document.documentElement.lang = locale
}

export default i18n
