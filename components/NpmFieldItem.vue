<script setup lang="tsx">
withDefaults(defineProps<{
  label: string
  value?: string
}>(), { value: '' })
</script>

<template>
  <div>
    <div class="text-gray-500/80">
      {{ label }}
    </div>
    <div class="text-gray-500/50 text-sm mt-1 truncate" :title="value">
      <slot>{{ value || '' }}</slot>
    </div>
  </div>
</template>
