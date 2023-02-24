interface Props {
  lib: Ref<Partial<Lib>>
}

export const useNpmView = ({ lib }: Props) => () => {
  const { get, set } = useIdb()
  const store = useStore()

  const hasLink = computed(() => {
    return lib.value.conf?.link || ''
  })
  const hasRepo = computed(() => lib.value.conf?.repo || '')

  const frameSrc = computed(() => hasLink.value && lib.value.conf?.link ? lib.value.conf.link : '')

  const getNpmView = async () => {
    if (!store.lib) { return }

    const query = { name: store.lib?.name }
    const storeKey = JSON.stringify(query)

    const cache = await get(CacheStore.NPM_VIEW_API, storeKey)

    if (cache) {
      store.cacheLib(store.lib.name, cache)
      lib.value = store.lib
      return cache
    }

    if (!store.libs[store.lib.name]?.npm) {
      const npmView = await $fetch('/api/npm-view', { query })

      store.cacheLib(store.lib.name, npmView)
      set(CacheStore.NPM_VIEW_API, npmView, storeKey)
      lib.value = store.lib
    }
  }

  return { hasLink, hasRepo, frameSrc, getNpmView }
}
