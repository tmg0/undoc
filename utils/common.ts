interface RepoParserOpts {
  version?: string
  language?: Language
}

type RepoParser = (api: string, options?: RepoParserOpts) => string

export const defineRepoParser = (parser: RepoParser) => parser

export const styleStringify = (json: Record<string, string>) => {
  return Object.keys(json).reduce((acc, key) => (
    acc + key.split(/(?=[A-Z])/).join('-').toLowerCase() + ':' + json[key] + ';'
  ), '')
}
