interface UndocDoc {
  repo?: string
  link?: string
  readme?: string
  branch?: string
  exports?: Record<string, string>
}

interface UndocConfig {
  git: string
  docs: Record<string, UndocDoc | undefined>
}

interface Lib {
  name: string
  selected?: string
  version?: string
  used: string[]
  npm?: Partial<NPMView>
  conf?: Partial<UndocDoc>
}

interface NPMView {
  author: string
  bin: {
    tsc: string
    tsserver: string
  }
  description: string
  homepage: string
  license: string
  keywords: string[]
  repository: {
    type: string
    url: string
  }
  packageManager: string
  version: string
  versions: string[]
  name: string
  engines: Record<string, string>
}

interface GithubContent {
  name: string
  path: string
  size: number
  url: string
  html_url: string
  git_url: string
  download_url: string
  type: boolean
  content: string
  encoding: 'base64'
  _links: Record<string, string>
}