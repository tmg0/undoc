export interface PackageJSON extends Record<string, any> {
  dependencies?: Record<string, string>
  devDependencies?: Record<string, string>
  [key: string]: string | number | string[] | Record<string, string> | undefined
}

export interface StoreState {
  count: number
  libs: Record<string, Lib>
  lib?: UndocDoc & Lib
}

export const useStore = defineStore('lib', {
  state: (): StoreState => ({
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

    async selectLib (name: string) {
      const { data } = await useFetch('/api/undoc-config')
      this.libs[name].conf = { ...(data.value as UndocConfig).docs[name] }
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
