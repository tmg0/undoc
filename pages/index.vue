<script setup lang="tsx">

const store = useLibs()
const lib = ref<Partial<Lib>>({})
const pending = ref(false)

watch(() => store.lib, async (value) => {
  if (value?.name) {
    lib.value = store.libs[value.name] || {}

    if (!store.libs[value.name]?.npm) {
      pending.value = true
      const { data } = await useFetch('/api/package', { query: { lib: store.lib?.name } })
      store.cacheLib(value.name, data.value)
      lib.value = store.libs[value.name]
      pending.value = false
    }
  }
})
</script>

<template>
  <div class="flex flex-col h-full">
    <div class="bg-gray-100/80 h-1/4 border-b border-gray-300/80 overflow-y-auto grid grid-cols-4 px-4 py-3 ">
      <PackageFieldItem label="Name" :value="lib.name" />
      <PackageFieldItem label="Author" :value="lib.npm?.author" />

      <PackageFieldItem label="Engines">
        <div v-for="([key, value]) in Object.entries((lib.npm?.engines) || {})" :key="key" class="text-gray-500/50 text-sm">
          {{ key + value }}
        </div>
      </PackageFieldItem>

      <PackageFieldItem label="Homepage" :value="lib.npm?.homepage" />
      <PackageFieldItem label="License" :value="lib.npm?.license" />
      <PackageFieldItem label="Repository" :value="lib.npm?.repository?.url" />
      <PackageFieldItem label="Used" :value="lib.used?.join(' ')" />
    </div>

    <div class="flex-1">
      <iframe :src="store.lib?.link" frameborder="0" class="w-full h-full" />
    </div>
  </div>
</template>
