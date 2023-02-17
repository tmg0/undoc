import { extname } from 'pathe'

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
    if (!query.api) { throw createError('Should provide a target api.') }

    if (Array.isArray(query.name)) { throw createError('Should provide only one lib to find.') }
    if (Array.isArray(query.api)) { throw createError('Should provide only one api to find.') }

    const doc = (conf as UndocConfig).docs[query.name]

    if (!doc.repo) { throw createError('Can not find a repo url of this lib from config.') }

    const [owner, repo] = new URL(doc.repo).pathname.split('/').filter(Boolean)

    const filepath = doc.exports ? doc?.exports[query.api] : ''

    if (!filepath) { throw createError('Can not find this api doc repo path.') }

    const md: GithubContent = await $fetch(`https://api.github.com/repos/${owner}/${removeUrlExtension(repo)}/contents/${filepath}?ref=${doc.branch || 'main'}`)

    const file = Buffer.from(md.content, 'base64')

    return file
  } catch (error) { return { error } }
})
