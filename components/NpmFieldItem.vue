<script setup lang="tsx">
withDefaults(defineProps<{
  label: string
  value?: string | boolean
}>(), { value: false })
</script>

<template>
  <div v-if="value">
    <div class="text-gray-500/80">
      {{ label }}
    </div>
    <div class="text-gray-500/50 text-sm mt-1 truncate" :title="String(value)">
      <slot>{{ value || '' }}</slot>
    </div>
  </div>
</template>
