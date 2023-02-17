<script setup lang="ts">
const store = useStore()

const { data: json } = await useFetch('/api/package-json')

json.value && store.parsePackageJSON(json.value)

const { data: used, error } = await useFetch('/api/used-apis')

if (!error.value && used.value) { store.cacheUsed(used.value as Record<string, string[]>) }
</script>

<template>
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>

<style>
::-webkit-scrollbar {
  height: 1rem;
  width: 0.5rem;
}

::-webkit-scrollbar-thumb {
  --tw-border-opacity: 1;
  background-color: rgba(217,217,227,.8);
  border-color: rgba(255,255,255,var(--tw-border-opacity));
  border-radius: 9999px;
  border-width: 1px;
}

::-webkit-scrollbar-track {
  background-color: transparent;
  border-radius: 9999px;
}
</style>
