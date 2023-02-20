import Markdownit from 'markdown-it'
import { extname } from 'pathe'

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

const r = (url = '') => {
  const extension = extname(url)
  return url.replace(new RegExp(extension + '$'), '')
}

export const useRepoH5 = ({ hasLink }: Props) => () => {
  const mdit = new Markdownit({ html: true })

  const store = useStore()
  const docRef = ref()
  const repoURL = ref<string | undefined>()
  const md = ref('')
  const defaultBranch = ref('')

  const h5 = computed(() => mdit.render(md.value))

  const repo = computed<Partial<Repo>>(() => {
    if (!repoURL.value) { return {} }

    const branch = store.lib?.conf?.branch
    const url = repoURL.value.match(/(https?|git|ssh):\/\/\S+/g)?.[0]
    const [owner, name] = new URL(r(url)).pathname.split('/').filter(Boolean)

    return { url, name, owner, branch }
  })

  const getRepoMarkdown = async (onRequest: (key: string) => Promise<boolean>) => {
    if (repoURL.value) {
      const filepath = (() => {
        if (!store.lib?.selected) { return store.lib?.conf?.readme }

        if (store.lib?.conf?.exports) { return store.lib?.conf?.exports?.[store.lib.selected] }

        const parser = useRepoParsers?.[store.lib?.name]

        return parser && parser(store.lib?.selected)
      })()

      const { name, owner, branch } = repo.value
      const query = { filepath, repo: name, owner, branch }

      if (!(await onRequest(JSON.stringify(query)))) { return }

      const data = await $fetch('/api/repo-doc', {
        query: { filepath, repo: name, owner, branch }
      })

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
