
import { parse } from 'pathe'

interface Repo {
  url: string
  name: string
  owner: string
  branch?: string
  filepath?: string
}

interface Props {
  hasLink: ComputedRef<string>
}

const { mdit } = useMdit()

export const useRepoH5 = ({ hasLink }: Props) => () => {
  const { get, set } = useIdb()
  const store = useStore()
  const docRef = ref()
  const repoURL = ref<string | undefined>()
  const md = ref('')
  const defaultBranch = ref('')
  const { parsers } = useRepoParsers()

  const h5 = computed(() => mdit.render(md.value))

  const repo = computed<Partial<Repo>>(() => {
    if (!repoURL.value) { return {} }

    const branch = store.lib?.conf?.branch
    const [_, owner, name] = repoURL.value.match(/github\.com\/([^/]+)\/([^/]+)/) || []

    return { url: repoURL.value, name: parse(name).name, owner, branch }
  })

  const getRepoMarkdown = async () => {
    if (repoURL.value) {
      const filepath = (() => {
        if (!store.lib?.selected) { return store.lib?.conf?.readme }

        if (store.lib?.conf?.apis) { return store.lib?.conf?.apis?.[store.lib.selected] }

        return parsers(store.lib?.name, store.lib?.selected)
      })()

      const { name, owner, branch } = repo.value
      const query = { filepath, repo: name, owner, branch }

      const storeKey = JSON.stringify(query)

      const cache = await get(CacheStore.REPO_DOC_API, storeKey)

      if (cache && cache.md) {
        md.value = cache.md
        defaultBranch.value = cache?.branch
        return cache
      }

      const data = await $fetch('/api/repo-doc', {
        query: { filepath, repo: name, owner, branch }
      })

      set(CacheStore.REPO_DOC_API, data, storeKey)

      md.value = data?.md
      defaultBranch.value = data?.branch

      return data
    }
  }

  watch(h5, async (value) => {
    if (hasLink.value) { return }

    const shadow = docRef.value

    if (!shadow) { return }

    const shadowRoot = shadow.shadowRoot || shadow.attachShadow({ mode: 'open' })

    shadowRoot.innerHTML = value

    await nextTick()

    const imgs = shadowRoot.querySelectorAll('img')

    for (let i = 0; i < imgs.length; i++) {
      const url: string = imgs[i].src

      if (url.includes('_undoc')) {
        const { owner, name, branch: confBranch } = repo.value
        const branch = confBranch || defaultBranch.value
        imgs[i].src = url.replace(/(.*?)(_undoc)/, `https://github.com/${owner}/${name}/raw/${branch}`)
      }
    }
  })

  return { md, h5, repo, repoURL, docRef, defaultBranch, getRepoMarkdown }
}
