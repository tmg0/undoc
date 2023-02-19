const githubAPI = 'https://api.github.com'

const getRepoByGithubAPI = async (owner: string, repo: string) => {
  const data: { default_branch: string } = await $fetch(`${githubAPI}/repos/${owner}/${repo}`)
  return data
}

export default defineEventHandler(async (event) => {
  try {
    const query = getQuery(event)

    if (!query.name) { throw createError('Should provide a lib name when find target doc.') }
    if (!query.owner) { throw createError('Should provide a repo owner when find target doc.') }
    if (!query.repo) { throw createError('Should provide a repo path when find target doc.') }

    if (Array.isArray(query.owner)) { throw createError('Should provide only one repo owner to find.') }
    if (Array.isArray(query.repo)) { throw createError('Should provide only one repo to find.') }
    if (Array.isArray(query.name)) { throw createError('Should provide only one lib to find.') }
    if (Array.isArray(query.branch)) { throw createError('Should provide only one repo branch to find.') }

    const filepath = query.filepath || 'README.md'

    const branch = query.branch || (await getRepoByGithubAPI(query.owner, query.repo)).default_branch

    const url = `${githubAPI}/repos/${query.owner}/${query.repo}/contents/${filepath}?ref=${branch}`

    const md: GithubContent = await $fetch(url)

    const file = Buffer.from(md.content, 'base64').toString()

    return { md: file, branch }
  } catch (error) { throw new Error(String(error)) }
})
