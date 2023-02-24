<script setup lang="ts">
import LogoNpm from '~icons/carbon/logo-npm'
import LogoGithub from '~icons/carbon/logo-github'
import Link from '~icons/carbon/link'

const visible = ref(false)
const store = useStore()

const engines = computed(() => Object.entries((store?.lib?.npm?.engines) || {}))
const homepage = computed(() => store?.lib?.npm?.homepage)
const repoURL = computed(() => store?.lib?.npm?.repository?.url)

const onToggle = () => {
  visible.value = !visible.value
}
</script>

<template>
  <div>
    <div class="relative">
      <div
        class="shadow-lg shadow-[#ce3736]/50 rounded-full p-4 cursor-pointer bg-[#ce3736] transition-all"
        @click="onToggle"
      >
        <LogoNpm class="text-2xl text-white" />
      </div>

      <Transition>
        <div v-show="visible" class="absolute shadow-xl -top-4 right-0 px-4 py-3 box-border rounded-lg -translate-y-[100%] bg-gray-100 flex flex-col gap-2">
          <NpmFieldItem label="Name" :value="store?.lib?.name" />
          <NpmFieldItem label="Author" :value="store?.lib?.npm?.author" />

          <NpmFieldItem label="Engines" :value="!!engines.length">
            <div v-for="([key, value]) in engines" :key="key">
              {{ key + value }}
            </div>
          </NpmFieldItem>

          <NpmFieldItem label="Homepage" :value="homepage">
            <div class="flex items-center gap-1">
              <Link />
              <a :href="homepage">{{ homepage }}</a>
            </div>
          </NpmFieldItem>

          <NpmFieldItem label="License" :value="store?.lib?.npm?.license" />

          <NpmFieldItem label="Repository" :value="repoURL">
            <div class="flex items-center gap-1">
              <LogoGithub />
              <a :href="homepage">{{ homepage }}</a>
            </div>
          </NpmFieldItem>
        </div>
      </Transition>
    </div>
  </div>
</template>

<style scoped>
.v-enter-active,
.v-leave-active {
  @apply transition-all;
  @apply duration-300;
}

.v-enter-from,
.v-leave-to {
  opacity: 0;
}
</style>
