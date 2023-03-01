import { asyncGetQuery } from 'h3-vee'

export const githubAPI = 'https://api.github.com'
export const unghAPI = 'https://ungh.cc'

export const getRepoByGithubAPI = async (owner: string, repo: string) => {
  const data: { default_branch: string } = await $fetch(`${githubAPI}/repos/${owner}/${repo}`)
  return data
}

export default defineEventHandler(async (event) => {
  const query = await asyncGetQuery(event, f => ({
    owner: f<string>().required().isString(),
    repo: f<string>().required().isString(),
    branch: f<string>(''),
    filepath: f<string>('')

  }))

  const filepath = query.filepath || 'README.md'

  try {
    if (filepath || query.branch) { throw new Error() }
    const url = `${unghAPI}/repos/${query.owner}/${query.repo}/readme`
    const data: UnghDefaultReadme = await $fetch(url)
    return { html: data.html, branch: 'main' }
  } catch {
    const branch = query.branch || (await getRepoByGithubAPI(query.owner, query.repo)).default_branch
    const url = `${unghAPI}/repos/${query.owner}/${query.repo}/files/${branch}/${filepath}`
    const data: UnghContents = await $fetch(url)
    return { html: data.file.html, branch }
  }
})
