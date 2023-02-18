import { extname } from 'pathe'

const githubAPI = 'https://api.github.com'

const removeUrlExtension = (url: string) => {
  const extension = extname(url)
  return url.replace(new RegExp(extension + '$'), '')
}

const getRepoByGithubAPI = async (owner: string, repo: string) => {
  const data: { default_branch: string } = await $fetch(`${githubAPI}/repos/${owner}/${repo}`)
  return data
}

export default defineEventHandler(async (event) => {
  try {
    const query = getQuery(event)

    if (!query.name) { throw createError('Should provide a lib name when find target doc.') }
    if (!query.repo) { throw createError('Should provide a repo path when find target doc.') }

    if (Array.isArray(query.repo)) { throw createError('Should provide only one repo to find.') }
    if (Array.isArray(query.name)) { throw createError('Should provide only one lib to find.') }

    const repoURL = query.repo.match(/(https?|git):\/\/\S+/g)?.[0]

    if (!repoURL) { throw createError('Can not parse the repo url.') }

    const [owner, repo] = new URL(removeUrlExtension(repoURL)).pathname.split('/').filter(Boolean)

    const conf = await $fetch('/api/undoc-config')

    const doc = (conf as UndocConfig).docs[query.name] || {}

    const filepath = (query.api && !Array.isArray(query.api) && doc?.exports?.[query.api]) || doc.readme || 'README.md'

    const branch = doc.branch || (await getRepoByGithubAPI(owner, repo)).default_branch

    const url = `${githubAPI}/repos/${owner}/${repo}/contents/${filepath}?ref=${branch}`

    const md: GithubContent = await $fetch(url)

    const file = Buffer.from(md.content, 'base64').toString()

    return file
  } catch (error) { return String(error) }
})
