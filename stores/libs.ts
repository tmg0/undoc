import undocConfig from '~~/undoc.config.json'

export interface Lib {
  name: string
  version: string
  npm?: Partial<ViewPackage>
}

export interface PackageJSON extends Record<string, any> {
  dependencies?: Record<string, string>
  devDependencies?: Record<string, string>
  [key: string]: string | number | string[] | Record<string, string> | undefined
}

export interface LibsState {
  count: number
  libs: Record<string, Lib>
  lib?: UndocConfigRecord & { name: string }
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
        name, version
      }))

      this.libs = libs
      this.count = libs.length
    },

    selectLib (name: string) {
      this.lib = { name, ...(undocConfig as UndocConfig)[name] }
    },

    cacheLib (name: string, npm: Partial<ViewPackage>) {
      this.libs[name].npm = npm
    }
  }
})
