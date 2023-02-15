import undocConfig from '~~/undoc.config.json'

export interface Lib {
  name: string
  version: string
}

export interface PackageJSON extends Record<string, any> {
  dependencies?: Record<string, string>
  devDependencies?: Record<string, string>
  [key: string]: string | number | string[] | Record<string, string> | undefined
}

export interface LibsState {
  count: number
  libs: Lib[]
  lib?: UndocConfigRecord & { name: string }
}

export const useLibs = defineStore('lib', {
  state: (): LibsState => ({
    count: 0,
    lib: undefined,
    libs: []
  }),

  actions: {
    parsePackageJSON (json: PackageJSON) {
      const libs = Object.entries({ ...(json.dependencies || {}), ...(json.devDependencies || {}) }).map(([name, version]) => ({
        name, version
      }))

      this.libs = libs
      this.count = libs.length
    },

    selectLib (name: string) {
      this.lib = { name, ...(undocConfig as UndocConfig)[name] }
    }
  }
})
