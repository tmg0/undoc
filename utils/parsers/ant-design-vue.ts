export default defineRepoParser((api, opts) => {
  const lang = opts?.language || Language.EN_US
  return `components/${toKebabCase(api)}/index.${lang}.md`
})
