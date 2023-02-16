import undocConfig from '~~/undoc.config.json'

export interface PackageJSON extends Record<string, any> {
  dependencies?: Record<string, string>
  devDependencies?: Record<string, string>
  [key: string]: string | number | string[] | Record<string, string> | undefined
}

export interface LibsState {
  count: number
  libs: Record<string, Lib>
  lib?: UndocConfigRecord & Lib
}

export const useLibs = defineStore('lib', {
  state: (): LibsState => ({
    count: 0,
    lib: undefined,
    libs: {}
  }),

  actions: {
    parsePackageJSON (json: PackageJSON) {
      const libs = useMapValues({ ...(json.dependencies || {}), ...(json.devDependencies || {}) }, (version, name) => ({
        name, version, used: []
      }))

      this.libs = libs
      this.count = libs.length
    },

    selectLib (name: string) {
      this.libs[name].conf = { ...(undocConfig as UndocConfig)[name] }
      this.lib = { ...this.libs[name] }
    },

    cacheLib (name: string, npm: Partial<ViewPackage>) {
      this.libs[name].npm = npm
    },

    cacheUsed (used: Record<string, string[]>) {
      for (const name in this.libs) {
        this.libs[name].used = used[name] || []
      }
    }
  }
})
