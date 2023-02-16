import { readFileSync } from 'fs'
import { findStaticImports, parseStaticImport } from 'mlly'
import { join, relative } from 'pathe'
import ignore from 'ignore'
import g from 'glob'

const getIgnore = (path = '.') => {
  const file = readFileSync(join(process.cwd(), path, '.gitignore'), 'utf8')
  return ignore().add(file)
}

const getFilesInDirectory = (dirPath = '.') => {
  const pattern = join(process.cwd(), dirPath, '**/*.{js,ts,jsx,tsx,vue}')
  const matches = g.sync(pattern)
  const ig = getIgnore().filter(matches.map(match => relative('./', match)))
  return ig.map(filePath => readFileSync(filePath).toString())
}

export default defineEventHandler((event) => {
  try {
    const result: Record<string, string[]> = {}
    const query = getQuery(event)
    const files = getFilesInDirectory(query.path as string)

    files.forEach((file) => {
      findStaticImports(file).map(parseStaticImport).forEach(({ specifier, namedImports }) => {
        result[specifier] = Object.keys(namedImports || {})
      })
    })

    return result
  } catch (error) { return { error } }
})
