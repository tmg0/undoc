<script setup lang="ts">
import Markdownit from 'markdown-it'
import { uid } from 'uid'

const domId = uid()
const mdit = new Markdownit()

const store = useStore()
const lib = ref<Partial<Lib>>({})
const pending = ref(false)
const md = ref('')
const frameSrc = ref('')
const repo = ref('')

const h5 = computed(() => mdit.render(md.value))

const hasLink = computed(() => lib.value.conf?.link || '')
const hasRepo = computed(() => lib.value.conf?.repo || '')

store.getUndocConf()

const { data: json } = await useFetch('/api/package-json')

json.value && store.parsePackageJSON(json.value)

const { data: used, error } = await useFetch('/api/used-apis')

if (!error.value && used.value) { store.cacheUsed(used.value as Record<string, string[]>) }

const fetchNPM = async () => {
  if (!store.lib) { return }

  if (!store.libs[store.lib.name]?.npm) {
    pending.value = true
    const npmView = await $fetch('/api/npm-view', { query: { name: store.lib?.name } })

    store.cacheLib(store.lib.name, npmView)
    lib.value = store.lib

    pending.value = false
  }
}

const fetchMD = async () => {
  if (repo.value) {
    md.value = await $fetch('/api/repo-doc', {
      query: {
        name: store.lib?.name,
        api: store.lib?.used[0],
        repo: repo.value
      }
    })
  }
}

const setDocSrc = () => {
  if (hasLink.value) {
    frameSrc.value = lib.value.conf?.link || ''
    return
  }

  if (hasRepo.value) {
    repo.value = lib.value.conf?.repo || ''
    return
  }

  repo.value = lib.value.npm?.repository?.url || ''
}

watch(() => store.lib, async (value) => {
  if (!value) { return }

  lib.value = store.lib || {}

  if (value.conf?.repo) { fetchNPM() }

  if (!value.conf?.repo) { await fetchNPM() }

  setDocSrc()

  fetchMD()
})

watch(h5, (value) => {
  if (hasLink.value) { return }

  const shadow = document.getElementById(domId)

  if (!shadow) { return }

  if (shadow.shadowRoot) {
    shadow.shadowRoot.innerHTML = value
    return
  }

  shadow.attachShadow({ mode: 'open' }).innerHTML = value
})

</script>

<template>
  <div class="flex flex-col h-full">
    <div class="bg-gray-100/80 h-64 border-b border-gray-300/80 overflow-y-auto grid grid-cols-4 px-4 py-3 flex-shrink-0">
      <NpmFieldItem label="Name" :value="lib.name" />
      <NpmFieldItem label="Author" :value="lib.npm?.author" />

      <NpmFieldItem label="Engines">
        <div v-for="([key, value]) in Object.entries((lib.npm?.engines) || {})" :key="key" class="text-gray-500/50 text-sm">
          {{ key + value }}
        </div>
      </NpmFieldItem>

      <NpmFieldItem label="Homepage" :value="lib.npm?.homepage" />
      <NpmFieldItem label="License" :value="lib.npm?.license" />
      <NpmFieldItem label="Repository" :value="lib.npm?.repository?.url" />
      <NpmFieldItem label="Used" :value="lib.used?.join(' ')" />
    </div>

    <div class="flex-1 overflow-y-auto">
      <iframe v-if="hasLink" :src="frameSrc" frameborder="0" class="w-full h-full" />
      <div v-show="!hasLink" :id="domId" class="w-full h-full px-4 py-3 box-border " />
    </div>
  </div>
</template>
