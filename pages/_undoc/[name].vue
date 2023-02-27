<script setup lang="ts">
const route = useRoute()
const store = useStore()
const lib = ref<Partial<Lib>>({})
const frameSrc = ref('')

const { hasLink, hasRepo, getNpmView } = useNpmView({ lib })()
const { repoURL, docRef, getRepoDoc } = useRepoH5({ hasLink })()

watch(() => [route.params, route.query], async ([params, query]) => {
  await store.selectLib(params.name as string, query.api as string)

  if (!store.lib) { return }

  lib.value = store.lib || {}

  if (store.lib.conf?.repo) { getNpmView() }

  if (!store.lib.conf?.repo) { await getNpmView() }

  if (hasLink.value) {
    frameSrc.value = lib.value.conf?.link || ''
  }

  repoURL.value = hasRepo.value ? lib.value.conf?.repo : lib.value.npm?.repository?.url

  getRepoDoc()
}, { immediate: true })

</script>

<template>
  <div class="flex flex-col h-full">
    <NpmFloatBtn class="fixed bottom-6 right-8" />

    <div class="flex-1 overflow-y-auto">
      <iframe v-if="hasLink" :src="frameSrc" frameborder="0" class="w-full h-full" />
      <div v-if="!hasLink" ref="docRef" class="w-full h-full px-4 box-border" />
    </div>
  </div>
</template>
