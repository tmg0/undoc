// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  ssr: false,
  extends: '@nuxt-themes/typography',
  modules: ['@nuxtjs/tailwindcss', '@vueuse/nuxt', '@pinia/nuxt', 'unplugin-icons/nuxt'],
  imports: { dirs: ['./stores'] },
  pinia: { autoImports: ['defineStore'] }
})
