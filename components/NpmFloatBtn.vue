<script setup lang="ts">
import LogoNpm from '~icons/carbon/logo-npm'

const visible = ref(false)
const store = useStore()

const onToggle = () => {
  visible.value = !visible.value
}
</script>

<template>
  <div>
    <div class="relative">
      <div class="shadow shadow-black rounded-full p-4 cursor-pointer bg-[#ce3736]" @click="onToggle">
        <LogoNpm class="text-2xl text-white" />
      </div>

      <div v-show="visible" class="absolute shadow -top-4 right-0 px-4 py-3 box-border rounded-lg -translate-y-[100%] bg-gray-100 flex flex-col gap-2">
        <NpmFieldItem label="Name" :value="store?.lib?.name" />
        <NpmFieldItem label="Author" :value="store?.lib?.npm?.author" />

        <NpmFieldItem label="Engines">
          <div v-for="([key, value]) in Object.entries((store?.lib?.npm?.engines) || {})" :key="key">
            {{ key + value }}
          </div>
        </NpmFieldItem>

        <NpmFieldItem label="Homepage" :value="store?.lib?.npm?.homepage" />
        <NpmFieldItem label="License" :value="store?.lib?.npm?.license" />
        <NpmFieldItem label="Repository" :value="store?.lib?.npm?.repository?.url" />
      </div>
    </div>
  </div>
</template>
