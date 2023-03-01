import { kebabCase } from 'scule'

export default defineRepoParser((api, opts) => {
  const lang = opts?.language || Language.EN_US
  return `components/${kebabCase(api)}/index.${lang}.md`
})
