<script setup lang="ts">

const store = useLibs()
const lib = ref<Partial<ViewPackage>>({})
const pending = ref(false)

watch(() => store.lib, async (value) => {
  if (value?.name) {
    pending.value = true
    const { data } = await useFetch('/api/package', { query: { lib: store.lib?.name } })
    lib.value = data.value
    pending.value = false
  }
}, { immediate: true })

const isRepo = computed(() => store.lib?.repo)
</script>

<template>
  <div class="flex flex-col h-full">
    <div class="bg-gray-100/80 h-1/4 border-b border-gray-300/80 overflow-y-auto grid grid-cols-4">
      <div>name: {{ lib.name }}</div>

      <div>author: {{ lib.author }}</div>

      <div>engines: {{ lib.engines?.node }}</div>

      <div>homepage: {{ lib.homepage }}</div>

      <div>license: {{ lib.license }}</div>

      <div :title="lib.repository?.url" class="truncate">
        repository: {{ lib.repository?.url }}
      </div>
    </div>

    <div class="flex-1">
      <div v-if="isRepo" class="w-full h-full">
        {{ store.lib?.repo }}
      </div>

      <iframe v-else :src="store.lib?.link" frameborder="0" class="w-full h-full" />
    </div>
  </div>
</template>
