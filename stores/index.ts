export interface PackageJSON extends Record<string, any> {
  dependencies?: Record<string, string>
  devDependencies?: Record<string, string>
  [key: string]: string | number | string[] | Record<string, string> | undefined
}

export interface StoreState {
  undocConf?: UndocConfig
  libs: Record<string, Lib>
  lib?: Lib
}

export const useStore = defineStore('store', {
  state: (): StoreState => ({
    undocConf: undefined,
    lib: undefined,
    libs: {}
  }),

  actions: {
    async getUndocConf () {
      const data: UndocConfig = await $fetch('/api/undoc-config')
      this.undocConf = data
    },

    parsePackageJSON (json: PackageJSON) {
      this.libs = useMapValues({ ...(json.dependencies || {}), ...(json.devDependencies || {}) }, (version, name) => {
        if (name.includes('@types')) { return undefined }
        return { name, version, used: [] }
      })
    },

    async selectLib (name: string) {
      if (name === this.lib?.name) { return }
      if (!this.undocConf) { await this.getUndocConf() }

      this.libs[name].conf = { ...this.undocConf?.docs[name] }
      this.lib = { ...this.lib, ...this.libs[name] }
    },

    cacheLib (name: string, npm: Partial<NPMView>) {
      this.libs[name].npm = npm
      if (this.lib) { this.lib.npm = npm }
    },

    cacheUsed (used: Record<string, string[]>) {
      Object.entries(used).forEach(([name, usedAPIs]) => {
        if (!this.libs[name]) { this.libs[name] = { name, used: [] } }
        this.libs[name].used = usedAPIs
      })
    }
  }
})