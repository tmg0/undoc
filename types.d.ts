interface UndocConfigRecord {
  repo?: string
  link?: string
  branch?: string
  exports?: Record<string, string>
}

interface UndocConfig {
  [key: string]: UndocConfigRecord
}
