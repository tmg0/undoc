import { parse } from 'pathe'
import mapKeys from 'lodash.mapkeys'

const modules = import.meta.glob('~/utils/parsers/**/*.ts', { eager: true })

const parsers = mapKeys(modules, (_, key) => parse(key).name)

export const useRepoParsers = () => ({
  parsers (lib?: string, api?: string, version?: string) {
    if (!lib || !api) { return }
    return (parsers[lib] as any)?.default?.(api, version)
  }
})
