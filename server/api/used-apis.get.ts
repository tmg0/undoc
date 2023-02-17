import { existsSync, readFileSync } from 'fs'
import { findExports, findStaticImports, parseStaticImport } from 'mlly'
import { join, relative } from 'pathe'
import ignore from 'ignore'
import g from 'glob'

const excludeFiles = ['.nuxt/imports.d.ts']

const autoImportsAlias: Record<string, string> = { '#app': 'nuxt' }

const getIgnore = (path = '.') => {
  const file = readFileSync(join(process.cwd(), path, '.gitignore'), 'utf8')
  return ignore().add(file)
}

const getFilesInDirectory = (dirPath = '.') => {
  const pattern = join(process.cwd(), dirPath, '**/*.{js,ts,jsx,tsx,vue}')
  const matches = g.sync(pattern, { dot: true, ignore: '**/node_modules/**' })

  const ig = getIgnore().filter(matches.map(match => relative('./', match)))

  return ig.map(filePath => readFileSync(filePath).toString())
}

const getAutoImports = () => {
  return excludeFiles.map((path) => {
    if (existsSync(path)) {
      return readFileSync(path).toString()
    }
    return ''
  }).filter(Boolean)
}

export default defineEventHandler((event) => {
  try {
    const result: Record<string, string[]> = {}
    const query = getQuery(event)
    const files = getFilesInDirectory(query.path as string)

    files.forEach((file) => {
      findStaticImports(file).map(parseStaticImport).forEach(({ specifier, namedImports }) => {
        if (!result[specifier]) { result[specifier] = [] }

        result[specifier] = [...result[specifier], ...Object.keys(namedImports || {})]
      })
    })

    getAutoImports().forEach((file) => {
      findExports(file).forEach(({ specifier, names, type }) => {
        if (!specifier) { return }

        specifier = autoImportsAlias[specifier] || specifier

        if (!result[specifier]) { result[specifier] = [] }

        if (type === 'named') {
          result[specifier] = [...result[specifier], ...names]
        }
      })
    })

    return result
  } catch (error) { return { error } }
})
