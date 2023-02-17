import { extname } from 'pathe'

const githubAPI = 'https://api.github.com'

const removeUrlExtension = (url: string) => {
  const extension = extname(url)
  return url.replace(new RegExp(extension + '$'), '')
}

export default defineEventHandler(async (event) => {
  try {
    const query = getQuery(event)
    const conf = await $fetch('/api/undoc-config')

    if (!conf) { throw createError('Can not find available undoc config file.') }
    if (!query.name) { throw createError('Should provide a lib name when find target doc.') }

    if (Array.isArray(query.name)) { throw createError('Should provide only one lib to find.') }

    const doc = (conf as UndocConfig).docs[query.name] || {}

    doc.repo = doc.repo || query.repo as string || undefined

    if (!doc.repo) { throw createError('Can not find a repo url of this lib from config.') }

    const docRepoURLs = doc.repo.match(/(https?|git):\/\/\S+/g)

    if (docRepoURLs?.length) { doc.repo = docRepoURLs[0] }

    const [owner, repo] = new URL(doc.repo).pathname.split('/').filter(Boolean)

    const filepath = query.api && !Array.isArray(query.api) ? doc?.exports?.[query.api] : ''

    const url = `${githubAPI}/repos/${owner}/${removeUrlExtension(repo)}/contents/${filepath || 'README.md'}?ref=${doc.branch || 'main'}`

    try {
      const md: GithubContent = await $fetch(url)

      const file = Buffer.from(md.content, 'base64').toString()

      return file
    } catch { return 'Can not read markdown doc of this repo' }
  } catch (error) { return { error } }
})
