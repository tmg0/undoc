<script setup lang="ts">
import CaretRight from '~icons/carbon/caret-right'

const emit = defineEmits(['select'])

const store = useStore()

const { data, error } = await useFetch('/api/used-apis')

if (!error.value && data.value) { store.cacheUsed(data.value as Record<string, string[]>) }
</script>

<template>
  <div class="flex flex-col h-full border-r border-gray-300/80" :style="{ width: '350px' }">
    <NarBar />

    <div class="flex-1 px-4 py-3 overflow-y-auto">
      <details v-for="({ name, version, used }) in Object.values(store.libs)" :key="name">
        <summary class="flex w-full justify-between cursor-pointer" @click="!used.length && emit('select', { lib: name })">
          <div :title="name" class="flex items-center ">
            <div class="w-5">
              <CaretRight v-if="used.length" class="carbon-caret-right w-full flex-shrink-0 transition-all" />
            </div>

            <div class="flex-1 truncate">
              {{ name }}
            </div>
          </div>
          <span>{{ version }}</span>
        </summary>

        <div class="pl-5">
          <div v-for="item in used" :key="item" class="cursor-pointer" @click="emit('select', { lib: name, api: item })">
            {{ item }}
          </div>
        </div>
      </details>
    </div>
  </div>
</template>

<style scoped>
details[open] .carbon-caret-right {
  transform: rotate(90deg);
}
</style>
