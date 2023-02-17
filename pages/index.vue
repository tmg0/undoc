<script setup lang="ts">
import { micromark } from 'micromark'

const store = useStore()
const lib = ref<Partial<Lib>>({})
const pending = ref(false)
const md = ref('')
const frameSrc = ref('')

const hasLink = computed(() => lib.value.conf?.link)
const iframeSrc = computed(() => hasLink.value || lib.value.npm?.homepage)
const h5 = computed(() => micromark(md.value))

const { data: json } = await useFetch('/api/package-json')

json.value && store.parsePackageJSON(json.value)

const { data: used, error } = await useFetch('/api/used-apis')

if (!error.value && used.value) { store.cacheUsed(used.value as Record<string, string[]>) }

const beFramed = (url: string): Promise<string> => {
  try {
    return new Promise((resolve, reject) => {
      const iframe = document.createElement('iframe')

      const messageHandler = (event: any) => {
        if (event.isTrusted) {
          resolve(url)
        } else {
          reject(url)
        }
        document.body.removeChild(iframe)
      }

      window.addEventListener('message', messageHandler, false)

      iframe.src = url
      iframe.style.display = 'none'
      document.body.appendChild(iframe)
    })
  } catch (error) { return Promise.reject(error) }
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const setFrameSrc = async (npmView: Partial<NPMView>) => {
  const src = lib.value.conf?.link || npmView.homepage
  if (!src) { return }

  try {
    frameSrc.value = await beFramed(src)
  } catch { }
}

const fetchNPM = async () => {
  if (store.lib?.name && !store.libs[store.lib.name]?.npm) {
    pending.value = true
    const npmView = await $fetch('/api/npm-view', { query: { name: store.lib?.name } })

    store.cacheLib(store.lib.name, npmView)
    store.lib.npm = npmView
    lib.value = store.libs[store.lib.name]

    pending.value = false
  }
}

const fetchMD = async () => {
  const repo = lib.value.conf?.repo || lib.value.npm?.repository?.url
  if (repo) {
    md.value = await $fetch('/api/doc', {
      query: {
        name: store.lib?.name,
        api: store.lib?.used[0],
        repo
      }
    })
  }
}

watch(() => store.lib, async (value) => {
  // if (value?.npm) { setFrameSrc(value.npm) }

  if (value?.name) {
    lib.value = store.libs[value.name] || {}

    if (value.repo) { fetchNPM() }

    if (!value.repo) { await fetchNPM() }

    if (!hasLink.value) { fetchMD() }
  }
})

</script>

<template>
  <div class="flex flex-col h-full">
    <div class="bg-gray-100/80 h-64 border-b border-gray-300/80 overflow-y-auto grid grid-cols-4 px-4 py-3 flex-shrink-0">
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

    <div class="flex-1 overflow-y-auto">
      <iframe v-if="frameSrc" :src="iframeSrc" frameborder="0" class="w-full h-full" />
      <div v-else class="w-full h-full px-4 py-3 box-border " v-html="h5" />
    </div>
  </div>
</template>
