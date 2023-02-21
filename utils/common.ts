interface RepoParserOpts {
  version?: string
  language?: Language
}

type RepoParser = (api: string, options?: RepoParserOpts) => string

export const toKebabCase = (str: string) => {
  str = str.replace(/[A-Z]/g, (item) => {
    return `-${item.toLowerCase()}`
  })

  if (str.startsWith('-')) { return str.substr(1) }

  return str
}

export const defineRepoParser = (parser: RepoParser) => parser
