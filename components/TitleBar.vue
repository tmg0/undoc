<script setup lang="ts">
defineProps<{
  title: string
}>()
</script>

<template>
  <div class="border-y border-gray-100/20 text-gray-100/80 p-1 min-h-[30px] max-h-[30px] select-none flex">
    <div class="flex">
      <slot name="before" />
      <div class="mr-2 opacity-60">
        {{ title }}
      </div>
    </div>
    <div flex gap-2 flex-auto>
      <slot />
    </div>
  </div>
</template>
