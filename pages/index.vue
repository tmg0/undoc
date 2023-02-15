<script setup lang="ts">
const doc = ref('')
</script>

<template>
  <div class="flex flex-col h-full">
    <div class="bg-gray-100/80 h-1/3 border-b border-gray-300/80">
      overview
    </div>

    <div class="flex-1">
      <iframe v-if="doc" :src="doc" frameborder="0" class="w-full h-full" />
    </div>
  </div>
</template>
