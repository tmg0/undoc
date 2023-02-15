// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  app: { baseURL: '/_undoc' },
  extends: '@nuxt-themes/typography',
  modules: ['@nuxtjs/tailwindcss', '@vueuse/nuxt', '@pinia/nuxt'],
  imports: { dirs: ['./stores'] },
  pinia: { autoImports: ['defineStore', 'storeToRefs'] }
})
