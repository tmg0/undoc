import { asyncGetQuery } from 'h3-vee'

const githubAPI = 'https://api.github.com'

const getRepoByGithubAPI = async (owner: string, repo: string) => {
  const data: { default_branch: string } = await $fetch(`${githubAPI}/repos/${owner}/${repo}`)
  return data
}

export default defineEventHandler(async (event) => {
  try {
    const query = await asyncGetQuery(event, f => ({
      owner: f<string>().required().isString(),
      repo: f<string>().required().isString(),
      branch: f<string>(''),
      filepath: f<string>('')
    }))

    const filepath = query.filepath || 'README.md'

    const branch = query.branch || (await getRepoByGithubAPI(query.owner, query.repo)).default_branch

    const url = `${githubAPI}/repos/${query.owner}/${query.repo}/contents/${filepath}?ref=${branch}`

    const md: GithubContent = await $fetch(url)

    const file = Buffer.from(md.content, 'base64').toString()

    return { md: file, branch }
  } catch (error) { throw new Error(String(error)) }
})
