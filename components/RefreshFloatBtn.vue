<script setup lang="ts">
import Renew from '~icons/carbon/renew'

const emit = defineEmits(['refresh'])
</script>

<template>
  <div>
    <div class="relative">
      <div
        class="shadow-lg shadow-[#ce3736]/50 rounded-full p-4 cursor-pointer bg-[#ce3736] transition-all"
        @click="emit('refresh')"
      >
        <Renew class="text-2xl text-white" />
      </div>
    </div>
  </div>
</template>
