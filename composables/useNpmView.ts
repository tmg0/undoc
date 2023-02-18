export const useNpmView = () => {
  const store = useStore()

  const lib = ref<Partial<Lib>>({ conf: { link: '' } })

  const hasLink = computed(() => {
    debugger
    return lib.value.conf?.link || ''
  })
  const hasRepo = computed(() => lib.value.conf?.repo || '')

  const frameSrc = computed(() => hasLink.value && lib.value.conf?.link ? lib.value.conf.link : '')

  const getNpmView = async () => {
    if (!store.lib) { return }

    if (!store.libs[store.lib.name]?.npm) {
      const npmView = await $fetch('/api/npm-view', { query: { name: store.lib?.name } })

      store.cacheLib(store.lib.name, npmView)
      lib.value = store.lib
      debugger
    }
  }

  return { lib, hasLink, hasRepo, frameSrc, getNpmView }
}
