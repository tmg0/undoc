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

  const query = computed(() => ({ name: store.lib?.name }))

  const storeKey = computed(() => JSON.stringify(query.value))

  const getNpmView = async () => {
    if (!store.lib) { return }

    const cache = await get(CacheStore.NPM_VIEW_API, storeKey.value)

    if (cache) {
      store.cacheLib(store.lib.name, cache)
      lib.value = store.lib
      return cache
    }

    const npmView = await $fetch('/api/npm-view', { query: query.value })

    store.cacheLib(store.lib.name, npmView)
    set(CacheStore.NPM_VIEW_API, npmView, storeKey.value)
    lib.value = store.lib
  }

  return { hasLink, hasRepo, frameSrc, storeKey, getNpmView }
}
