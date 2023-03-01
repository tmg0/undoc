<script setup lang="ts">
import Renew from '~icons/carbon/renew'

const props = defineProps<{
  refresh:() => Promise<any>
}>()

const pending = ref(false)

const onRefresh = () => {
  pending.value = true
  props.refresh().finally(() => {
    pending.value = false
  })
}
</script>

<template>
  <div>
    <div class="relative">
      <div
        class="shadow-lg shadow-[#32475b]/50 rounded-full p-4 cursor-pointer bg-[#32475b] transition-all"
        @click="onRefresh"
      >
        <Renew class="text-2xl text-white" :class="{ spinning: pending }" />
      </div>
    </div>
  </div>
</template>

<style scoped>
@keyframes spin {
  from {
    transform: rotate(360deg);
  }
  to {
    transform: rotate(0deg);
  }
}

.spinning {
  animation: spin 1s linear infinite;
}
</style>
