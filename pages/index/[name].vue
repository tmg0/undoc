<script setup lang="ts">
const route = useRoute()
const store = useStore()
const lib = ref<Partial<Lib>>({})
const frameSrc = ref('')

const { get, set } = useIdb()
const { hasLink, hasRepo, getNpmView } = useNpmView({ lib })()
const { md, repoURL, docRef, defaultBranch, getRepoMarkdown } = useRepoH5({ hasLink })()

watch(() => [route.params, route.query], async ([params, query]) => {
  await store.selectLib(params.name as string, query.api as string)

  if (!store.lib) { return }

  let cache: any
  let key = ''

  lib.value = store.lib || {}

  if (store.lib.conf?.repo) { getNpmView() }

  if (!store.lib.conf?.repo) { await getNpmView() }

  if (hasLink.value) {
    frameSrc.value = lib.value.conf?.link || ''
  }

  repoURL.value = hasRepo.value ? lib.value.conf?.repo : lib.value.npm?.repository?.url

  const res = await getRepoMarkdown(async (k) => {
    cache = await get(CacheStore.REPO_DOC_API, k)
    key = k
    return !cache
  })

  if (res) { set(CacheStore.REPO_DOC_API, res, key) }

  md.value = res?.md || cache?.md || ''
  defaultBranch.value = res?.branch || cache?.branch || ''
}, { immediate: true })

</script>

<template>
  <div class="flex flex-col h-full">
    <div class="bg-gray-100/80 h-64 border-b border-gray-300/80 overflow-y-auto grid grid-cols-4 px-4 py-3 flex-shrink-0">
      <NpmFieldItem label="Name" :value="lib.name" />
      <NpmFieldItem label="Author" :value="lib.npm?.author" />

      <NpmFieldItem label="Engines">
        <div v-for="([key, value]) in Object.entries((lib.npm?.engines) || {})" :key="key">
          {{ key + value }}
        </div>
      </NpmFieldItem>

      <NpmFieldItem label="Homepage" :value="lib.npm?.homepage" />
      <NpmFieldItem label="License" :value="lib.npm?.license" />
      <NpmFieldItem label="Repository" :value="lib.npm?.repository?.url" />
    </div>

    <div class="flex-1 overflow-y-auto">
      <iframe v-if="hasLink" :src="frameSrc" frameborder="0" class="w-full h-full" />
      <div v-if="!hasLink" ref="docRef" class="w-full h-full px-4 py-3 box-border " />
    </div>
  </div>
</template>
