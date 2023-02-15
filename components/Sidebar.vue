<script setup lang="ts">
const store = useLibs()

const { data } = await useFetch('/api/package-json')

data.value && store.parsePackageJSON(data.value)
</script>

<template>
  <div class="h-full border-r border-gray-300/80" :style="{ width: '256px' }">
    <NarBar />

    <div class="px-4 py-3">
      <div v-for="({ name, version }) in store.libs" :key="name" class="flex items-center justify-between">
        <span :title="name" class="truncate">{{ name }}</span>
        <span>{{ version }}</span>
      </div>
    </div>
  </div>
</template>
