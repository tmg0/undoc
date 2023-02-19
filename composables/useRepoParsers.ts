export const toKebabCase = (str: string) => {
  str = str.replace(/[A-Z]/g, (item) => {
    return `-${item.toLowerCase()}`
  })

  if (str.startsWith('-')) { return str.substr(1) }

  return str
}

export const useRepoParsers: Record<string, (api: string) => string> = {
  'ant-design-vue': api => `components/${toKebabCase(api)}/index.en-US.md`,
  nuxt: api => `docs/3.api/1.composables/${toKebabCase(api)}.md`
}
