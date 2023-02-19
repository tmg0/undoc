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
    async getLibs () {
      const data = await $fetch('/api/node-config')
      data && this.parsePackageJSON(data)
    },

    async getUndocConf () {
      const data: UndocConfig = await $fetch('/api/undoc-config')
      this.undocConf = data
    },

    parsePackageJSON (json: PackageJSON) {
      const result = useMapValues({ ...(json.dependencies || {}), ...(json.devDependencies || {}) }, (version, name) => {
        if (name.includes('@types')) { return }
        return { name, version, used: this.libs[name]?.used || [] }
      })
      this.libs = { ...this.libs, ...result }
    },

    async selectLib (name: string, api?: string) {
      if (name === this.lib?.name && api === this.lib?.selected) { return }

      if (!this.undocConf) { await this.getUndocConf() }

      if (!this.libs[name]) { this.libs[name] = { name, used: [] } }

      this.libs[name].conf = { ...this.undocConf?.docs[name] }
      this.lib = { ...this.lib, ...this.libs[name] }
      this.lib.selected = api || this.lib.used[0]
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
