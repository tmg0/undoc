<script setup lang="ts">
import CaretRight from '~icons/carbon/caret-right'

const emit = defineEmits(['select'])

const store = useStore()
const route = useRoute()

const data = await $fetch('/api/used-apis')

if (data) { store.cacheUsed(data) }

const isSelected = (name: string, api?: string) => {
  if (api) { return name === route.params.name && api === route.query.api }

  return name === route.params.name
}
</script>

<template>
  <div class="flex flex-col h-full border-r border-gray-300/80 select-none" :style="{ width: '350px' }">
    <NarBar />

    <div class="flex-1 px-4 py-3 overflow-y-auto">
      <details v-for="({ name, version, used }) in Object.values(store.libs)" :key="name" class="my-1">
        <summary
          class="flex w-full items-center justify-between cursor-pointer gap-1 hover:bg-gray-100 rounded pl-1 pt-1 pb-1 pr-3"
          :class="{ 'bg-gray-100': !used.length && isSelected(name) }"
          @click="!used.length && emit('select', { lib: name })"
        >
          <div :title="name" class="flex items-center">
            <div class="w-5">
              <CaretRight v-if="used.length" class="carbon-caret-right w-full flex-shrink-0 transition-all" />
            </div>

            <div class="flex-1 truncate w-52">
              {{ name }}
            </div>
          </div>

          <div class="bg text-gray-500/50  text-sm">
            {{ version }}
          </div>
        </summary>

        <div class="pl-5">
          <div
            v-for="item in used"
            :key="item"
            class="cursor-pointer hover:bg-gray-100 rounded px-3 py-1 my-1"
            :class="{ 'bg-gray-100': isSelected(name, item) }"
            @click="emit('select', { lib: name, api: item })"
          >
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
