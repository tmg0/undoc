enum Language {
  ZH_CN = 'zh-CN',
  EN_US = 'en-US'
}

interface UndocDoc {
  repo?: string
  link?: string
  readme?: string
  branch?: string
  apis?: Record<string, string>
}

interface UndocConfig {
  [key: string]: UndocDoc | undefined
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

interface UnghContents {
  meta: {
    url: string
  }
  file: {
    contents: string
    html: string
  }
}

interface UnghDefaultReadme {
  html: string
  markdown: string
}