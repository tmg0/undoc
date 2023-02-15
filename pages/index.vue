<script setup lang="ts">
const store = useLibs()
const versions = ref()
const pending = ref(false)

watch(() => store.lib, async (value) => {
  if (value?.name) {
    pending.value = true
    const { data } = await useFetch('/api/package', { query: { lib: store.lib?.name } })
    versions.value = data.value
    pending.value = false
  }
}, { immediate: true })

const isRepo = computed(() => store.lib?.repo)
</script>

<template>
  <div class="flex flex-col h-full">
    <div class="bg-gray-100/80 h-1/3 border-b border-gray-300/80 overflow-y-auto">
      <div>{{ pending }}</div>

      {{ versions }}
    </div>

    <div class="flex-1">
      <div v-if="isRepo" class="w-full h-full">
        {{ store.lib?.repo }}
      </div>

      <iframe v-else :src="store.lib?.link" frameborder="0" class="w-full h-full" />
    </div>
  </div>
</template>
