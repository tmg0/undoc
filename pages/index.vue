<script setup lang="ts">
const router = useRouter()
const store = useStore()

store.getLibs()
store.getUndocConf()

const onSelect = ({ lib: name, api }: {
  lib: string
  api?: string
}) => {
  router.push({ name: 'index-name', params: { name }, query: { api } })
}
</script>

<template>
  <div class="w-screen h-screen flex font-sans">
    <Sidebar @select="onSelect" />

    <div class="flex-1">
      <NuxtPage />
    </div>
  </div>
</template>
