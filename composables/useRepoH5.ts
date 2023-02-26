
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

export enum TagName {
  PRE = 'PRE'
}

export const useRepoH5 = ({ hasLink }: Props) => () => {
  const { get, set } = useIdb()
  const store = useStore()
  const docRef = ref()
  const repoURL = ref<string | undefined>()
  const h5 = ref('')
  const defaultBranch = ref('')
  const { parsers } = useRepoParsers()

  const repo = computed<Partial<Repo>>(() => {
    if (!repoURL.value) { return {} }

    const branch = store.lib?.conf?.branch
    const [_, owner, name] = repoURL.value.match(/github\.com\/([^/]+)\/([^/]+)/) || []

    return { url: repoURL.value, name: parse(name).name, owner, branch }
  })

  const getRepoDoc = async () => {
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

      if (cache && cache.html) {
        h5.value = cache.html
        defaultBranch.value = cache?.branch
        return cache
      }

      const data = await $fetch('/api/repo-doc', {
        query: { filepath, repo: name, owner, branch }
      })

      set(CacheStore.REPO_DOC_API, data, storeKey)

      h5.value = data?.html
      defaultBranch.value = data?.branch

      return data
    }
  }

  watch(h5, async (value) => {
    if (hasLink.value) { return }

    const shadow = docRef.value

    if (!shadow) { return }

    const shadowRoot = shadow.shadowRoot || shadow.attachShadow({ mode: 'open' })

    shadowRoot.innerHTML = value + '<style>a { text-decoration: none }</style>'

    await nextTick()

    const codes = shadowRoot.querySelectorAll('.highlight')

    for (let i = 0; i < codes.length; i++) {
      const code = codes[i]

      if (!code) { continue }

      code.style.background = '#f6f8fa'
      code.style.color = '#24292f'
      code.style.padding = '4px 16px'
      code.style.fontSize = '85%'
      code.style.borderRadius = '8px'
      code.style.maxWidth = '1280px'
    }
  })

  return { h5, repo, repoURL, docRef, defaultBranch, getRepoDoc }
}
