<script setup lang="ts">
import { micromark } from 'micromark'

const store = useStore()
const lib = ref<Partial<Lib>>({})
const pending = ref(false)
const md = ref('')

const hasRepo = computed(() => lib.value.conf?.repo)
const iframeSrc = computed(() => lib.value.conf?.link || lib.value.npm?.homepage)
const h5 = computed(() => micromark(md.value))

const fetchNPM = async () => {
  if (store.lib?.name && !store.libs[store.lib.name]?.npm) {
    pending.value = true
    const npmI = await $fetch('/api/package', { query: { lib: store.lib?.name } })
    store.cacheLib(store.lib.name, npmI)
    lib.value = store.libs[store.lib.name]
    pending.value = false
  }
}

const fetchMD = async () => {
  if (lib.value.conf?.repo) {
    md.value = await $fetch('/api/doc', { query: { name: store.lib?.name, api: 'use-fetch' } })
  }
}

watch(() => store.lib, (value) => {
  if (value?.name) {
    lib.value = store.libs[value.name] || {}

    fetchNPM()
    fetchMD()
  }
})

</script>

<template>
  <div class="flex flex-col h-full">
    <div class="bg-gray-100/80 h-64 border-b border-gray-300/80 overflow-y-auto grid grid-cols-4 px-4 py-3 flex-shrink-0">
      <PackageFieldItem label="Name" :value="lib.name" />
      <PackageFieldItem label="Author" :value="lib.npm?.author" />

      <PackageFieldItem label="Engines">
        <div v-for="([key, value]) in Object.entries((lib.npm?.engines) || {})" :key="key" class="text-gray-500/50 text-sm">
          {{ key + value }}
        </div>
      </PackageFieldItem>

      <PackageFieldItem label="Homepage" :value="lib.npm?.homepage" />
      <PackageFieldItem label="License" :value="lib.npm?.license" />
      <PackageFieldItem label="Repository" :value="lib.npm?.repository?.url" />
      <PackageFieldItem label="Used" :value="lib.used?.join(' ')" />
    </div>

    <div class="flex-1 overflow-y-auto">
      <div v-if="hasRepo" class="w-full h-full px-4 py-3 box-border " v-html="h5" />

      <iframe v-else-if="iframeSrc" :src="iframeSrc" frameborder="0" class="w-full h-full" />
    </div>
  </div>
</template>
