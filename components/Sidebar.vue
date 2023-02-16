<script setup lang="ts">
const store = useLibs()

const { data } = await useFetch('/api/package-json')

data.value && store.parsePackageJSON(data.value)
</script>

<template>
  <div class="flex flex-col h-full border-r border-gray-300/80" :style="{ width: '350px' }">
    <NarBar />

    <div class="flex-1 px-4 py-3 overflow-y-auto">
      <div
        v-for="({ name, version }) in Object.values(store.libs) "
        :key="name"
        class="flex items-center justify-between cursor-pointer"
        @click="store.selectLib(name)"
      >
        <span :title="name" class="truncate">{{ name }}</span>
        <span>{{ version }}</span>
      </div>
    </div>
  </div>
</template>
