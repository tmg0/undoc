import { defineField, defineValidator, type Field, type ValidatorFields } from 'veelidate'
import type { H3Event } from 'h3'

const githubAPI = 'https://api.github.com'

const getRepoByGithubAPI = async (owner: string, repo: string) => {
  const data: { default_branch: string } = await $fetch(`${githubAPI}/repos/${owner}/${repo}`)
  return data
}

export const isUndefined = (value: any): value is undefined => typeof value === 'undefined'

export const asyncGetQuery = async <R extends Record<string, any>>(event: H3Event, schema?: (f: <T>(value?: T | undefined) => Field<T>) => R): Promise<typeof schema extends undefined ? Record<string, any>: ValidatorFields<R>> => {
  const query = getQuery(event)

  if (isUndefined(schema)) { return Promise.resolve(query as any) }

  const validator = defineValidator().setup(() => schema(defineField))

  Object.entries(query).forEach(([key, value]) => {
    (validator.value as any)[key] = value
  })

  try {
    await validator.validate()
    return validator.value
  } catch {
    throw new Error('Query error')
  }
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

    // const query = await asyncGetQuery(event, f => ({
    //   name: f<string>().required().isString(),
    //   owner: f<string>().required().isString(),
    //   repo: f<string>().required().isString(),
    //   branch: f<string>(''),
    //   filepath: f<string>('')
    // }))

    const filepath = query.filepath || 'README.md'

    const branch = query.branch || (await getRepoByGithubAPI(query.owner, query.repo)).default_branch

    const url = `${githubAPI}/repos/${query.owner}/${query.repo}/contents/${filepath}?ref=${branch}`

    const md: GithubContent = await $fetch(url)

    const file = Buffer.from(md.content, 'base64').toString()

    return { md: file, branch }
  } catch (error) { throw new Error(String(error)) }
})
