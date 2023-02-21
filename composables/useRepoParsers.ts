import mapKeys from 'lodash.mapkeys'

const modules = import.meta.glob('~/utils/parsers/**/*.ts', { eager: true })

const parseFilenameFromURL = (path: string) => {
  const url = new URL(path, 'http:/127.0.0.1')
  const [filename] = url.pathname.split('/').pop()?.split('.') || []
  return filename
}

const parsers = mapKeys(modules, (_, key) => parseFilenameFromURL(key))

export const useRepoParsers = () => ({
  parsers (lib?: string, api?: string, version?: string) {
    if (!lib || !api) { return }
    return (parsers[lib] as any)?.default?.(api, version)
  }
})
