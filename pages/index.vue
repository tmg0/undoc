<script setup lang="ts">
const docRef = ref()

const store = useStore()
const lib = ref<Partial<Lib>>({})
const frameSrc = ref('')

const hasLink = computed(() => lib.value.conf?.link || '')
const hasRepo = computed(() => lib.value.conf?.repo || '')

const { repo, getRepoMarkdown } = useRepoH5({ docRef, hasLink, hasRepo })()

store.getUndocConf()

const { data: json } = await useFetch('/api/package-json')

json.value && store.parsePackageJSON(json.value)

const fetchNPM = async () => {
  if (!store.lib) { return }

  if (!store.libs[store.lib.name]?.npm) {
    const npmView = await $fetch('/api/npm-view', { query: { name: store.lib?.name } })

    store.cacheLib(store.lib.name, npmView)
    lib.value = store.lib
  }
}

const setDocSrc = () => {
  if (hasLink.value) {
    frameSrc.value = lib.value.conf?.link || ''
    return
  }

  if (hasRepo.value) {
    repo.value.url = lib.value.conf?.repo || ''
    return
  }

  repo.value.url = lib.value.npm?.repository?.url || ''
}

watch(() => store.lib, async (value) => {
  if (!value) { return }

  lib.value = store.lib || {}

  if (value.conf?.repo) { fetchNPM() }

  if (!value.conf?.repo) { await fetchNPM() }

  setDocSrc()

  getRepoMarkdown()
})

</script>

<template>
  <div class="w-screen h-screen flex font-sans">
    <Sidebar />

    <div class="flex-1">
      <div class="flex flex-col h-full">
        <div class="bg-gray-100/80 h-64 border-b border-gray-300/80 overflow-y-auto grid grid-cols-4 px-4 py-3 flex-shrink-0">
          <NpmFieldItem label="Name" :value="lib.name" />
          <NpmFieldItem label="Author" :value="lib.npm?.author" />

          <NpmFieldItem label="Engines">
            <div v-for="([key, value]) in Object.entries((lib.npm?.engines) || {})" :key="key" class="text-gray-500/50 text-sm">
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
    </div>
  </div>
</template>
