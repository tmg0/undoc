import { existsSync, readFileSync } from 'fs'
import { findExports, findStaticImports, parseStaticImport } from 'mlly'
import { join, relative } from 'pathe'
import ignore from 'ignore'
import fg from 'fast-glob'
import { asyncGetQuery } from 'h3-vee'

const extraFiles = ['.nuxt/imports.d.ts']
const excludePrefix = ['@types', '~~', '@@', '~', '@', '..', '.', '/']

const autoImportsAlias: Record<string, string> = { '#app': 'nuxt' }

const mapValues = <T>(object: Record<string, T>, iteratee: (value: T, key: string, object: Record<string, T>) => any) => {
  object = Object(object)
  const result: Record<string, any> = {}

  Object.keys(object).forEach((key) => {
    const value = iteratee(object[key], key, object)
    if (value) { result[key] = value }
  })
  return result
}

const getIgnore = (path = '.') => {
  const file = readFileSync(join(process.cwd(), path, '.gitignore'), 'utf8')
  return ignore().add(file)
}

const getFilesInDirectory = (dirPath = '.') => {
  const pattern = join(process.cwd(), dirPath, '**/*.{js,ts,jsx,tsx,vue}')
  const matches = fg.sync(pattern, { dot: true, ignore: ['**/node_modules/**'] })

  const ig = getIgnore().filter(matches.map(match => relative('./', match)))

  return ig.map(filePath => readFileSync(filePath).toString())
}

const getAutoImports = () => {
  return extraFiles.map((path) => {
    if (existsSync(path)) {
      return readFileSync(path).toString()
    }
    return ''
  }).filter(Boolean)
}

export default defineEventHandler(async (event) => {
  try {
    const query = await asyncGetQuery(event, f => ({
      path: f().isString()
    }))
    const result: Record<string, string[]> = {}
    const files = getFilesInDirectory(query.path as string)

    files.forEach((file) => {
      findStaticImports(file).map(parseStaticImport).forEach(({ specifier, namedImports }) => {
        if (!specifier) { return }
        if (excludePrefix.some(pf => specifier?.startsWith(pf))) { return }

        if (!result[specifier]) { result[specifier] = [] }

        result[specifier] = [...result[specifier], ...Object.keys(namedImports || {})]
      })
    })

    getAutoImports().forEach((file) => {
      findExports(file).forEach(({ specifier, names, type }) => {
        if (!specifier) { return }
        if (excludePrefix.some(pf => specifier?.startsWith(pf))) { return }

        specifier = autoImportsAlias[specifier] || specifier

        if (!result[specifier]) { result[specifier] = [] }

        if (type === 'named') {
          result[specifier] = [...result[specifier], ...names]
        }
      })
    })

    return mapValues(result, value => [...new Set([...value])])
  } catch (error) { throw new Error(String(error)) }
})
