export default defineRepoParser((api) => {
  return `docs/3.api/1.composables/${toKebabCase(api)}.md`
})
