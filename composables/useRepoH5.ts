import Markdownit from 'markdown-it'

interface Repo {
  url: string
  name: string
  owner: string
  md: string
  branch: string
}

interface Props {
  hasRepo: ComputedRef<string>
  hasLink: ComputedRef<string>
  docRef: Ref<any>
}

export const useRepoH5 = ({ docRef, hasLink }: Props) => () => {
  const mdit = new Markdownit()

  const store = useStore()
  const repo = ref<Partial<Repo>>({})

  const h5 = computed(() => mdit.render(repo.value?.md || ''))

  const getRepoMarkdown = async () => {
    if (repo.value.url) {
      const data = await $fetch('/api/repo-doc', {
        query: {
          name: store.lib?.name,
          api: store.lib?.selected,
          repo: repo.value?.url
        }
      })

      if (typeof data === 'string') { return }

      repo.value.md = data.md
      repo.value.owner = data.owner
      repo.value.name = data.repo
      repo.value.branch = data.branch
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
        const { owner, name, branch } = repo.value
        imgs[i].src = url.replace(/(.*?)(_undoc)/, `https://github.com/${owner}/${name}/raw/${branch}`)
      }
    }
  })

  return { h5, repo, getRepoMarkdown }
}
