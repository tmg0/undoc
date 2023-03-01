import { kebabCase } from 'scule'

export default defineRepoParser((api) => {
  return `docs/3.api/1.composables/${kebabCase(api)}.md`
})
