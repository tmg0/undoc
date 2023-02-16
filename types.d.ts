interface UndocConfigRecord {
  repo?: string
  link?: string
  branch?: string
  exports?: Record<string, string>
}

interface UndocConfig {
  [key: string]: UndocConfigRecord
}

interface ViewPackage {
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
  engines: {
    node: string
  }
}
