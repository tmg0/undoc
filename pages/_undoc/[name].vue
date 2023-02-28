<script setup lang="ts">
const route = useRoute()
const store = useStore()
const lib = ref<Partial<Lib>>({})
const frameSrc = ref('')

const { del } = useIdb()
const { hasLink, hasRepo, storeKey: npmStoreKey, getNpmView } = useNpmView({ lib })()
const { repoURL, docRef, storeKey: gitStoraKey, getRepoDoc } = useRepoH5({ hasLink })()

const setup = async (name = route.params.name, api = route.query.api) => {
  await store.selectLib(name as string, api as string)

  if (!store.lib) { return }

  lib.value = store.lib || {}

  await getNpmView()

  if (hasLink.value) {
    frameSrc.value = lib.value.conf?.link || ''
  }

  repoURL.value = hasRepo.value ? lib.value.conf?.repo : lib.value.npm?.repository?.url

  getRepoDoc()
}

const onRefresh = async () => {
  await Promise.all([
    del(CacheStore.NPM_VIEW_API, npmStoreKey.value),
    del(CacheStore.REPO_DOC_API, gitStoraKey.value)
  ])
  setup()
}

watch(() => [route.params, route.query], () => {
  setup()
}, { immediate: true })

</script>

<template>
  <div class="flex flex-col h-full">
    <div class="fixed bottom-6 right-8 flex flex-col gap-4">
      <NpmFloatBtn />
      <RefreshFloatBtn :refresh="onRefresh" />
    </div>

    <div class="flex-1 overflow-y-auto">
      <iframe v-if="hasLink" :src="frameSrc" frameborder="0" class="w-full h-full" />
      <div v-if="!hasLink" ref="docRef" class="w-full h-full px-4 box-border" />
    </div>
  </div>
</template>
